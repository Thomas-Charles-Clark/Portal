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
    public class ImageDownloadHub : Hub
    {
        public static ImageDownloadHub Create(IdentityFactoryOptions<ImageDownloadHub> options, IOwinContext context)
        {
            return new ImageDownloadHub();
        }

        private static ConcurrentDictionary<string, ImageDownloadTask> _CurrentTasks;

        private ConcurrentDictionary<string, ImageDownloadTask> CurrentTasks
        {
            get
            {
                if (_CurrentTasks == null)
                    _CurrentTasks = new ConcurrentDictionary<string, ImageDownloadTask>();

                return _CurrentTasks;
            }
        }

        public void CancelTask(string taskId)
        {
            if (CurrentTasks.ContainsKey(taskId))
                CurrentTasks[taskId].CancelToken.Cancel();
        }

        public async Task<string> StartTask(Member user, string tradeAccountCode, string fileNameBase, string programmaticPath, List<long> imageList)
        {
            var tokenSource = new CancellationTokenSource();

            string taskId = string.Format("progress-{0}", Guid.NewGuid());

            var ImageDownloadTask = new ImageDownloadTask(
                taskId,
                user.Id,
                tradeAccountCode,
                taskId,
                programmaticPath,
                fileNameBase,
                0,
                "progress-bar-primary",
                imageList,
                tokenSource
            );

            CurrentTasks.TryAdd(taskId, ImageDownloadTask);

            var task = ZipTask.ExecuteZipArchive(ImageDownloadTask, tokenSource.Token, new Progress<int>(percent =>
            {
                if (CurrentTasks.ContainsKey(taskId))
                    CurrentTasks[taskId].Percent = percent;

                ReportProgress(ImageDownloadTask.MemberID);
            }));

            await task;

            return "Task result";
        }

        private void ReportProgress(int id)
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<ImageDownloadHub>();

            context.Clients.User($"{id}").progressChanged(CurrentTasks.Where(t => t.Value.MemberID == id).Select(t => t.Value));

            foreach (var task in CurrentTasks.Where(t => t.Value.MemberID == id))
            {
                if (task.Value.Percent >= 100)
                {
                    ImageDownloadTask ImageDownloadTasks;

                    CurrentTasks.TryRemove(task.Key, out ImageDownloadTasks);

                    ReportProgress(id);
                }
            }
        }
    }
}
