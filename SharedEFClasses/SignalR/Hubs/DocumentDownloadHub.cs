using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;

using SharedEFClasses.Models;

using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SharedEFClasses.SignalR.Hubs
{
    public class DocumentDownloadHub : Hub
    {
        public static DocumentDownloadHub Create(IdentityFactoryOptions<DocumentDownloadHub> options, IOwinContext context)
        {
            return new DocumentDownloadHub();
        }

        private static ConcurrentDictionary<string, DocumentDownloadTask> _CurrentTasks;

        private ConcurrentDictionary<string, DocumentDownloadTask> CurrentTasks
        {
            get
            {
                if (_CurrentTasks == null)
                    _CurrentTasks = new ConcurrentDictionary<string, DocumentDownloadTask>();

                return _CurrentTasks;
            }
        }

        public void CancelTask(string taskId)
        {
            if (CurrentTasks.ContainsKey(taskId))
                CurrentTasks[taskId].CancelToken.Cancel();
        }

        public async Task<string> StartTask(Member user, string fileNameBase, string programmaticPath, IEnumerable<long> attachmentIds)
        {
            var tokenSource = new CancellationTokenSource();

            string taskId = string.Format("progress-{0}", Guid.NewGuid());

            var DocumentDownloadTask = new DocumentDownloadTask(
                taskId,
                user.Id,
                taskId,
                programmaticPath,
                fileNameBase,
                0,
                "progress-bar-primary",
                attachmentIds,
                tokenSource
            );

            CurrentTasks.TryAdd(taskId, DocumentDownloadTask);

            var task = ZipTask.ExecuteDocumentDownloadZipArchive(DocumentDownloadTask, tokenSource.Token, new Progress<int>(percent =>
            {
                if (CurrentTasks.ContainsKey(taskId))
                    CurrentTasks[taskId].Percent = percent;

                ReportProgress(DocumentDownloadTask.MemberID);
            }));

            await task;

            return "Task result";
        }

        private void ReportProgress(int id)
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<DocumentDownloadHub>();

            context.Clients.User($"{id}").progressChanged(CurrentTasks.Where(t => t.Value.MemberID == id).Select(t => t.Value));

            foreach (var task in CurrentTasks.Where(t => t.Value.MemberID == id))
            {
                if (task.Value.Percent >= 100)
                {
                    DocumentDownloadTask DocumentDownloadTasks;

                    CurrentTasks.TryRemove(task.Key, out DocumentDownloadTasks);

                    ReportProgress(id);
                }
            }
        }
    }
}
