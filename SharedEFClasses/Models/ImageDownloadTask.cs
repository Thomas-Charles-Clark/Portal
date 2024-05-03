using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public class ImageDownloadTask
    {
        [JsonProperty("taskId")]
        public string TaskID { get; set; }

        public int MemberID { get; set; }

        public string AccountNumber { get; set; }

        public string UniqueID { get; set; }

        public string ProgrammaticFolderPath { get; set; }

        public string ArchiveBaseName { get; set; }

        [JsonProperty("taskPercent")]
        public int Percent { get; set; }

        [JsonProperty("barCss")]
        public string BarCss { get; set; }

        public List<long> ImageList { get; set; }

        public CancellationTokenSource CancelToken { get; set; }

        [JsonProperty("createdArchiveFiles")]
        public List<ArchiveResponse> CreatedArchiveFiles { get; set; }

        public ImageDownloadTask(
            string taskId,
            int memberId,
            string accountNumber,
            string uniqueId,
            string programmaticFolderPath,
            string archiveBaseName,
            int percent,
            string barCss,
            List<long> imageList,
            CancellationTokenSource cancelToken)
        {
            TaskID = taskId;
            MemberID = memberId;
            AccountNumber = accountNumber;
            UniqueID = uniqueId;
            ProgrammaticFolderPath = programmaticFolderPath;
            ArchiveBaseName = archiveBaseName;
            Percent = percent;
            BarCss = barCss;
            ImageList = imageList;
            CancelToken = cancelToken;
            CreatedArchiveFiles = new List<ArchiveResponse>();
        }
    }
}
