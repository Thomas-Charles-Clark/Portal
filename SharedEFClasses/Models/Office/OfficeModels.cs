using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models.Office
{
    public class MicrosoftOnlineOAuth2Response
    {
        public string token_type { get; set; }
        public string expires_in { get; set; }
        public string access_token { get; set; }
        public string scope { get; set; }
    }
}