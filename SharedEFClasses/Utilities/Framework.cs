using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Utilities
{
    public static class Framework
    {
        public static readonly string HMRCDeveloperHubCheckGBVATNoClientID = "jtV0faSd7fs0AeIAM4z6cO9t0NyS";

        public static readonly string HMRCDeveloperHubCheckGBVATNoClientSecret = "e96bf083-516f-4a68-97dd-1d619900519e";

        public static readonly string HMRCDeveloperHubSandboxBaseURL = "https://test-api.service.hmrc.gov.uk";

        public static readonly string HMRCDeveloperHubProductionBaseURL = "https://api.service.hmrc.gov.uk";



        public static bool DebugMode
        {
            get
            {
#if DEBUG
                return true;
#else
                return false;
#endif
            }
        }

        public static string UniVerseDateString(DateTime val)
        {
            return $"{((int)(val - DateTime.ParseExact("31/12/1967", "dd/MM/yyyy", new System.Globalization.CultureInfo("en-GB"))).TotalDays)}";
        }

        public static DateTime DateTimeFromUniVerseOffset(int val)
        {
            return DateTime.ParseExact("31/12/1967", "dd/MM/yyyy", new System.Globalization.CultureInfo("en-GB")).AddDays(val);
        }

        public static string GetDaySuffix(int day)
        {
            switch (day)
            {
                case 1:
                case 21:
                case 31:
                    return "st";
                case 2:
                case 22:
                    return "nd";
                case 3:
                case 23:
                    return "rd";
                default:
                    return "th";
            }
        }

        public static Newtonsoft.Json.Formatting IndentedFormatting = Newtonsoft.Json.Formatting.Indented;

        public static JsonSerializerSettings JsonSettingsIndentedIgnoreNulls = new JsonSerializerSettings()
        {
            Formatting = Framework.IndentedFormatting,
            NullValueHandling = NullValueHandling.Ignore
        };

        public static JsonSerializerSettings JsonSettingsIndentedIgnoreNullsAlphabetical = new JsonSerializerSettings()
        {
            Formatting = Framework.IndentedFormatting,
            NullValueHandling = NullValueHandling.Ignore,
            ContractResolver = new OrderedContractResolver()
        };

        public static void InitialiseUniProperty(object o, PropertyInfo p)
        {
            if (p.CanWrite)
            {
                //if (p.PropertyType == typeof(string))
                //{
                //    p.SetValue(o, ""); // why do we want to be initialising strings to empty...
                //}
                if (p.PropertyType == typeof(IEnumerable<string>))
                {
                    p.SetValue(o, new List<string>());
                }
                else if (p.PropertyType == typeof(IEnumerable<decimal?>))
                {
                    p.SetValue(o, new List<decimal?>());
                }
                else if (p.PropertyType == typeof(IEnumerable<decimal>))
                {
                    p.SetValue(o, new List<decimal>());
                }
                else if (p.PropertyType == typeof(IEnumerable<long?>))
                {
                    p.SetValue(o, new List<long?>());
                }
                else if (p.PropertyType == typeof(IEnumerable<long>))
                {
                    p.SetValue(o, new List<long>());
                }
                else if (p.PropertyType == typeof(IEnumerable<int?>))
                {
                    p.SetValue(o, new List<int?>());
                }
                else if (p.PropertyType == typeof(IEnumerable<int>))
                {
                    p.SetValue(o, new List<int>());
                }
                else if (p.PropertyType == typeof(IEnumerable<short?>))
                {
                    p.SetValue(o, new List<short?>());
                }
                else if (p.PropertyType == typeof(IEnumerable<short>))
                {
                    p.SetValue(o, new List<short>());
                }
                else if (p.PropertyType == typeof(IEnumerable<byte?>))
                {
                    p.SetValue(o, new List<byte?>());
                }
                else if (p.PropertyType == typeof(IEnumerable<byte>))
                {
                    p.SetValue(o, new List<byte>());
                }
                else if (p.PropertyType == typeof(IEnumerable<bool?>))
                {
                    p.SetValue(o, new List<bool?>());
                }
                else if (p.PropertyType == typeof(IEnumerable<bool>))
                {
                    p.SetValue(o, new List<bool>());
                }
                else if (p.PropertyType == typeof(decimal?))
                {
                    p.SetValue(o, (decimal?)0);
                }
                else if (p.PropertyType == typeof(decimal))
                {
                    p.SetValue(o, (decimal)0);
                }
                else if (p.PropertyType == typeof(long?))
                {
                    p.SetValue(o, (long?)0);
                }
                else if (p.PropertyType == typeof(long))
                {
                    p.SetValue(o, (long)0);
                }
                else if (p.PropertyType == typeof(int?))
                {
                    p.SetValue(o, (int?)0);
                }
                else if (p.PropertyType == typeof(int))
                {
                    p.SetValue(o, (int)0);
                }
                else if (p.PropertyType == typeof(short?))
                {
                    p.SetValue(o, (short?)0);
                }
                else if (p.PropertyType == typeof(short))
                {
                    p.SetValue(o, (short)0u);
                }
                else if (p.PropertyType == typeof(byte?))
                {
                    p.SetValue(o, (byte?)0);
                }
                else if (p.PropertyType == typeof(byte))
                {
                    p.SetValue(o, (byte)0);
                }
                else if (p.PropertyType == typeof(bool?))
                {
                    p.SetValue(o, (bool?)null);
                }
                else if (p.PropertyType == typeof(bool))
                {
                    p.SetValue(o, false);
                }
            }
        }
    }
}
