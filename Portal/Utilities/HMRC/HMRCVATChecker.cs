using Newtonsoft.Json;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using SharedEFClasses.Models;
using System.Web.Http.Results;
using System.Net.Http.Formatting;

namespace Portal.Utilities.HMRC
{
    public static class HMRCVATChecker
    {
        public static async Task<HMRCVATCheckReturnType> Check(string vatNumber)
        {
            using (var PortalDb = new PortalDbContext())
            {

                var tokenPostData = new List<KeyValuePair<string, string>>()
                {
                    new KeyValuePair<string, string>("grant_type", "client_credentials"),
                    new KeyValuePair<string, string>("client_secret", SharedEFClasses.Utilities.Framework.HMRCDeveloperHubCheckGBVATNoProductionClientSecret),
                    new KeyValuePair<string, string>("client_id", SharedEFClasses.Utilities.Framework.HMRCDeveloperHubCheckGBVATNoProductionClientID),
                    new KeyValuePair<string, string>("scope", "read:vat")
                };

                var country = PortalDb.Countries.Where(p => p.Code == "GB").Single();

                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Clear();

                    client.DefaultRequestHeaders.Add("scope", "read:vat");

                    var tokenBody = new FormUrlEncodedContent(tokenPostData);

                    tokenBody.Headers.ContentType.MediaType = "application/x-www-form-urlencoded";

                    var tokenResponse = await client.PostAsync($"{SharedEFClasses.Utilities.Framework.HMRCDeveloperHubProductionBaseURL}/oauth/token", tokenBody);

                    if (tokenResponse.IsSuccessStatusCode)
                    {
                        var token = JsonConvert.DeserializeObject<HMRCTokenResponse>(await tokenResponse.Content.ReadAsStringAsync());

                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.hmrc.2.0+json"));

                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.access_token);

                        var vatResponse = await client.GetAsync($"{SharedEFClasses.Utilities.Framework.HMRCDeveloperHubProductionBaseURL}/organisations/vat/check-vat-number/lookup/{vatNumber}");

                        if (vatResponse.IsSuccessStatusCode)
                        {
                            var vatCheckResult = JsonConvert.DeserializeObject<HMRCVATCheckResult>(await vatResponse.Content.ReadAsStringAsync());

                            return new HMRCVATCheckReturnType(valid: true, traderName: vatCheckResult.Target.Name, countryName: country.Name, responseMessage: null);
                        }
                        else
                        {
                            return new HMRCVATCheckReturnType(valid: false, traderName: null, countryName: country.Name, responseMessage: await tokenResponse.Content.ReadAsStringAsync());
                        }
                    }
                    else
                    {
                        return new HMRCVATCheckReturnType(valid: false, traderName: null, countryName: country.Name, responseMessage: await tokenResponse.Content.ReadAsStringAsync());
                    }
                }
            }
        }
    }
}