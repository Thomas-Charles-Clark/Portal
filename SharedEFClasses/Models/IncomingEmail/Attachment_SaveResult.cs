using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class Attachment_SaveResult
    {
        public bool Saved { get; set; }
        public bool PassedValidation { get; set; }
        public int ValidationErrorNumber { get; set; }
        public string ValidationErrorMessage { get; set; }
    }
}
