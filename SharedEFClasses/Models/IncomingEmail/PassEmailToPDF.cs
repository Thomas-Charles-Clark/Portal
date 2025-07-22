using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassEmailToPDF
    {
        public long EmailID { get; set; }
        public string Body { get; set; }
        public string FileName { get; set; }
    }
}
