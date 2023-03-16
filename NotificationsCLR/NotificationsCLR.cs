using Microsoft.SqlServer.Server;

using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace NotificationsCLR
{
    public static class NotificationsCLR
    {
        [Microsoft.SqlServer.Server.SqlFunction(DataAccess = DataAccessKind.Read)]
        [System.Security.Permissions.PermissionSet(System.Security.Permissions.SecurityAction.Demand, Name = "FullTrust")]
        public static int Notify(string NotificationJSON)
        {
            using (var client = new HttpClient())
            {
                var content = new StringContent(NotificationJSON, Encoding.UTF8, "application/json");

                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", "Q0FkbWluOkQzczFnbmVyNQ==");

                client.DefaultRequestHeaders.Add("purposeKey", "ACBB62E6-5A3F-4F9A-B2D5-FBE4B69BC36C");

#if DEBUG
                var result = client.PostAsync("https://localhost:44334/api/notification/notifyuser", content);

                var response = result.Result;

                Console.WriteLine(response);
#else
                var result = client.PostAsync("https://portal.designersguild.com/api/notification/notifyuser", content);

                var response = result.Result;

                Console.WriteLine(response);
#endif
            }

            return 0;
        }
    }
}
