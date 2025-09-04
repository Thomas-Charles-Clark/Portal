using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public class DocumentDownloadTask
    {
        [JsonProperty("taskId")]
        public string TaskID { get; set; }

        public int MemberID { get; set; }

        public string UniqueID { get; set; }

        public string ProgrammaticFolderPath { get; set; }

        public string ArchiveBaseName { get; set; }

        [JsonProperty("taskPercent")]
        public int Percent { get; set; }

        [JsonProperty("barCss")]
        public string BarCss { get; set; }

        public IEnumerable<long> AttachmentsList { get; set; }

        public CancellationTokenSource CancelToken { get; set; }

        [JsonProperty("createdArchiveFiles")]
        public List<ArchiveResponse> CreatedArchiveFiles { get; set; }

        public DocumentDownloadTask(
            string taskId,
            int memberId,
            string uniqueId,
            string programmaticFolderPath,
            string archiveBaseName,
            int percent,
            string barCss,
            IEnumerable<long> attachmentIds,
            CancellationTokenSource cancelToken)
        {
            TaskID = taskId;
            MemberID = memberId;
            UniqueID = uniqueId;
            ProgrammaticFolderPath = programmaticFolderPath;
            ArchiveBaseName = archiveBaseName;
            Percent = percent;
            BarCss = barCss;
            AttachmentsList = attachmentIds;
            CancelToken = cancelToken;
            CreatedArchiveFiles = new List<ArchiveResponse>();
        }
    }
}
