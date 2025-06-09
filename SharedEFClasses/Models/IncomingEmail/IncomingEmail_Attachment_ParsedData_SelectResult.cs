using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json.Linq;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class IncomingEmail_Attachment_ParsedData_SelectResult
    {
        public string OriginalSubmittedFormDataJSON { get; set; }
        public string MostRecentMertexFormDataJSON { get; set; }
        public DateTime? ParsedDT { get; set; }
        public DateTime? ProcessedDT { get; set; }

        [NotMapped]
        public object Original 
        { 
            get
            {
                return String.IsNullOrEmpty(OriginalSubmittedFormDataJSON) ? null : JObject.Parse(OriginalSubmittedFormDataJSON);
            }
        }

        [NotMapped]
        public object MostRecent
        {
            get
            {
                return String.IsNullOrEmpty(MostRecentMertexFormDataJSON) ? null : JObject.Parse(MostRecentMertexFormDataJSON);
            }
        }
    }
}
