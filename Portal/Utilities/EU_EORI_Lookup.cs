using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;

namespace Portal.Utilities
{
    public class EU_EORI_Lookup
    {
        public static Portal.EU_EORI_Lookup.eoriResponse Validate(string eoriNumber)
        {
            var soapString = BuildRequest(eoriNumber);

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Clear();

                var content = new StringContent(soapString, Encoding.UTF8, "text/xml");

                var task = Task.Run<HttpResponseMessage>(async () =>  
                    await client.PostAsync("https://ec.europa.eu/taxation_customs/dds2/eos/validation/services/validation", content)
                );

                var response = task.Result;

                var soapResponse = response.Content.ReadAsStringAsync().Result;

                Console.WriteLine();
                Console.WriteLine("Request:");
                Console.WriteLine(soapString);
                Console.WriteLine();
                Console.WriteLine("Response:");
                Console.WriteLine(soapResponse);
                Console.WriteLine();

                try
                {
                    var xDoc = XDocument.Parse(soapResponse);

                    XNamespace baseNs = "http://schemas.xmlsoap.org/soap/envelope/";
                    XNamespace ns = "http://eori.ws.eos.dds.s/";

                    var serializer = new System.Xml.Serialization.XmlSerializer(typeof(Portal.EU_EORI_Lookup.eoriResponse));

                    System.IO.StringReader sr = new System.IO.StringReader(xDoc.Root.Descendants(ns + "validateEORIResponse")?.Descendants("result")?.FirstOrDefault().ToString());

                    return (Portal.EU_EORI_Lookup.eoriResponse)serializer.Deserialize(sr);

                    //results.Add(new VATNumberCheckResponse()
                    //{
                    //    Valid = Convert.ToBoolean(xDoc.Root.Descendants(ns + "checkVatApproxResponse").Descendants(ns + "valid").FirstOrDefault()?.Value),
                    //    VIESConsultationNumber = xDoc.Root.Descendants(ns + "checkVatApproxResponse").Descendants(ns + "requestIdentifier").FirstOrDefault()?.Value
                    //});

                    //return new eoriResponse();

                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw e;
                }
            }
        }

        private static string BuildRequest(string eoriNumber)
        {
            return $@"<s:Envelope xmlns:s=""http://schemas.xmlsoap.org/soap/envelope/""><s:Body><validateEORI xmlns=""http://eori.ws.eos.dds.s/""><eori>{eoriNumber}</eori></validateEORI></s:Body></s:Envelope>";
        }
    }
}