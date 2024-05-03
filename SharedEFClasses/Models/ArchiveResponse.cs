using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public class ArchiveResponse
    {
        public string FileName { get; set; }
        public string FileSize { get; set; }

        public ArchiveResponse(string fileName, string fileSize)
        {
            FileName = fileName;
            FileSize = fileSize;
        }
    }
}
