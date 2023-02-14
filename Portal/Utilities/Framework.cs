using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Portal.ViewModels.ComponentModels;
using System.Collections;
using Portal.Models;
using System.Text.RegularExpressions;

namespace Portal.Utilities
{
    public enum ApplicationEnum
    {
        Quote = 1,
        BlindQuote = 2,
        BespokeCushions = 3,
        FurnitureQuote = 4,
        BespokeRugs = 5,
        AccessoriesQuote = 6,
        ProductCalculator = 7,
        DeliveryEstimator = 9,
        CheckStock = 10,
        PriceEnquiry = 11,
        TakeaPayment = 12,
        ProjectManagement = 13,
        PaintCalculator = 14,
        Calendar = 15,
        InteriorDesignAppointments = 16,
        RetailSalesPipeline = 17,
        OrderEnquiry = 18,
        CustomerCare = 19,
        Reporting = 20,
        ReupholsteryQuote = 21,
        FittingCharges = 22,
        MeasuringCharges = 23,
        FabricOrder = 24,
        WallpaperOrder = 25,
        BespokeCushionsQuote = 26,
        FurnitureOrder = 27,
        BespokeRugsOrder = 28,
        DigitalPrintingOrder = 29,
        AccessoriesOrder = 30,
        ReplicatedOrders = 31,
        BackCoatingOrders = 32,
        JLEdiOrders = 33,
        SendPaintOrderstoSupplier = 34,
        ReserveStock = 35,
        MixedOrders = 36,
        TransferStock = 37,
        ReserveStockwithabatchcutting = 38,
        ProductInformation = 39,
        WallpaperrollCalculator = 40,
        PromoCodesList = 41,
        Tasks = 42,
        Leads = 43,
        CustomerVisits = 44,
        CustomerEnquiry = 45,
        Accounts = 46,
        ContractProjectManagement = 47,
        Returnsnotback = 48,
        Documents = 49,
        ChaseOrdersatthewarehouse = 50,
        DealsExpiring = 51,
        RequestSpecialPriceDiscount = 52,
        NewAccounts = 53,
        ViewCustomerPriceswithmargin = 54,
        MixOrders = 55,
        AlternativeProducts = 56,
        SampleRequest = 57,
        NewBusinessInitiatives = 58,
        ProspectAccounts = 59,
        Conversation = 60,
        OrderEntry = 61
    }

    public static partial class PortalFramework
    {
        public static IHtmlString AppLink(
            ApplicationEnum application,
            string contents,
            string elementId = null,
            string style = null,
            string @class = null,
            string queryString = null,
            string dataBind = null,
            string target = "_blank")
        {
            // fetch a cache object, if null set it...
            // we want the application's area, controller and index strings
            //

            var cache = new PortalCache<List<Application>>(
                String.Format("Applications")
            );
            
            var applications = cache.Get(DateTime.Now);

            if (applications == null)
            {
                var portalDb = new PortalDbContext();
                applications = portalDb.Applications.Where(p => p.Deleted == false).ToList();
                cache.Set(DateTime.Now, applications, 60);
            }

            Application app = null;

#if DEBUG
            app = applications.Where(p => p.ApplicationID == (int)application).SingleOrDefault();
#endif
#if !DEBUG
            app = applications.Where(p => p.ApplicationID == (int)application && p.LaunchDate <= DateTime.Now).SingleOrDefault();
#endif

            if (app == null || (String.IsNullOrEmpty(app.ControllerName) &&
                                String.IsNullOrEmpty(app.ActionName)))
            {
                return new HtmlString($"<a href='javascript:;' onclick='event.stopPropagation(); $.info(\"{application}\", \"Not yet available.\");' data-bind='{dataBind}'>{contents}</a>");
            }
            else
            {
                var href = "/";
                List<string> parts = new List<string>();


                if (!String.IsNullOrEmpty(app.AreaName))
                    parts.Add(app.AreaName.ToLower());
                if (!String.IsNullOrEmpty(app.ControllerName))
                    parts.Add(app.ControllerName.ToLower());
                if (!String.IsNullOrEmpty(app.ActionName))
                    if (app.ActionName.ToLower() != "index")
                        parts.Add(app.ActionName.ToLower());

                href += String.Join("/", parts.ToArray());

                if (!String.IsNullOrEmpty(queryString))
                    href += queryString;
                
                return new HtmlString($"<a href='{href}' title='{application.ToString()}' id='{elementId}' style='{style}' class='{@class}' target='{target}' data-bind='{dataBind}'>{contents}</a>");
            }
        }
        
        public static string ReplaceHexadecimalSymbols(string txt)
        {
            if (String.IsNullOrEmpty(txt))
                return txt;

            string r = "[\x00-\x08\x0B\x0C\x0E-\x1F\x26]";
            return Regex.Replace(txt, r, "", RegexOptions.Compiled);
        }

        public static List<BoolSelectOption> GetYesNo()
        {
            var result = new List<BoolSelectOption>()
            {
                new BoolSelectOption() { Value = true, Name = "Yes" },
                new BoolSelectOption() { Value = false, Name = "No" }
            };

            return result;
        }

        public static List<ByteSelectOption> GetTradingSinceOptions()
        {
            var result = new List<ByteSelectOption>();

            result.Add(new ByteSelectOption() { Name = "Opening Soon", Value = 0 });

            result.Add(new ByteSelectOption() { Name = "Under 1 Year", Value = 1 });

            for (byte i = 2; i < 6; i++)
            {
                result.Add(new ByteSelectOption() { Name = String.Format("{0} Year{1}", i, i > 1 ? "s" : ""), Value = i });
            }

            result.Add(new ByteSelectOption() { Name = "5+ Years", Value = 6 });

            return result;
        }

        public static List<StringSelectOption> GetNextFiveFinancialYears()
        {
            var result = new List<StringSelectOption>();

            for (var i = 1; i < 6; i++)
            {
                var date = DateTime.Now.AddYears(i);
                result.Add(new StringSelectOption() { Name = "Financial Year " + date.Year.ToString() + " (April " + date.AddYears(-1).Year.ToString() + " to March " + date.Year.ToString() + ")", Value = date.Year.ToString()  });
            }

            return result;
        }

        public static string GetUserAgent()
        {
            String tempUserAgent = "Unavailable";
            if (HttpContext.Current.Request == null) { }
            else
            {
                if (HttpContext.Current.Request.UserAgent == null) { }
                else
                {
                    tempUserAgent = HttpContext.Current.Request.UserAgent;
                }
            }

            return tempUserAgent;
        }
        
        public static IEnumerable ConvertModelStateErrorsToJSON(System.Web.Mvc.ModelStateDictionary modelState)
        {
            if (!modelState.IsValid)
            {
                return modelState.ToDictionary(kvp => kvp.Key,
                    kvp => kvp.Value.Errors
                                    .Select(e => e.ErrorMessage).ToArray())
                                    .Where(m => m.Value.Any());
            }
            return null;
        }

        internal static List<ClientSideCountry> GetClientSideCountries(PortalDbContext portalDb)
        {
            var primaryMarkets = new List<short>() { 81, 79, 60, 114, 238 };

            var result = new List<ClientSideCountry>();

            result.Add(portalDb.Countries.Where(p => p.CountryID == 15).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Austria

            result.Add(portalDb.Countries.Where(p => p.CountryID == 23).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Belgium

            result.Add(portalDb.Countries.Where(p => p.CountryID == 62).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Denmark

            result.Add(portalDb.Countries.Where(p => p.CountryID == 74).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Finland

            result.Add(portalDb.Countries.Where(p => p.CountryID == 79).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // France

            result.Add(portalDb.Countries.Where(p => p.CountryID == 60).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Germany

            result.Add(portalDb.Countries.Where(p => p.CountryID == 170).Select(p => new ClientSideCountry() { Name = "Holland", Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Holland 

            result.Add(portalDb.Countries.Where(p => p.CountryID == 106).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Ireland

            result.Add(portalDb.Countries.Where(p => p.CountryID == 114).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Italy

            result.Add(portalDb.Countries.Where(p => p.CountryID == 171).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Norway

            result.Add(portalDb.Countries.Where(p => p.CountryID == 184).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Poland

            result.Add(portalDb.Countries.Where(p => p.CountryID == 189).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Portugal

            result.Add(portalDb.Countries.Where(p => p.CountryID == 71).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Spain

            result.Add(portalDb.Countries.Where(p => p.CountryID == 202).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Sweden

            result.Add(portalDb.Countries.Where(p => p.CountryID == 46).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Switzerland

            result.Add(portalDb.Countries.Where(p => p.CountryID == 81).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // United Kingdom

            result.Add(portalDb.Countries.Where(p => p.CountryID == 238).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // United States

            //result.Add(new ClientSideCountry() { Name = "----------------------------------------------", Code = null, ThreeDigitCode = null, CountryID = null });

            result = result.Concat(portalDb.Countries.Where(p => p.DeletedDT == null)
                                    .Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID })
                                    .OrderBy(p => p.Name)
                                    .ToList()).ToList();
            return result;
        }

        internal static string LoadTwoRandomWords()
        {
            try
            {
                var ti = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo;

                var words = System.IO.File.ReadAllLines(AppDomain.CurrentDomain.BaseDirectory + "/Utilities/wordlist.txt").ToList();

                var random = new System.Random();
                
                var wordOne = ti.ToTitleCase(words[random.Next(words.Count - 1)]);

                var wordTwo = ti.ToTitleCase(words[random.Next(words.Count - 1)]);

                return wordOne + wordTwo;
            }
            catch(Exception)
            {
                return "RandomGeneratorFailure";
            }
        }

        internal static List<ClientSideLanguage> GetClientSideLanguages(PortalDbContext portalDb)
        {
            return portalDb.Languages.Where(p => p.DeletedDT == null)
                                    .Select(p => new ClientSideLanguage() { LanguageID = p.LanguageID, Name = p.Name })
                                    .ToList();
        }

        internal static List<ByteSelectOption> GenerateLeadStatusOptions()
        {
            return
                new List<ByteSelectOption>() {
                            new ByteSelectOption() { Name = "All", Value = 0 },
                            new ByteSelectOption() { Name = "Open", Value = 1 },
                            new ByteSelectOption() { Name = "Converted", Value = 2 },
                            new ByteSelectOption() { Name = "Lapsed", Value = 3 }
            };
        }

        public static string GetIPAddress()
        {
            return HttpContext.Current.Request.Headers["CF-Connecting-IP"] ?? HttpContext.Current.Request.UserHostAddress;
        }

        internal static List<ByteSelectOption> GenerateTaskStatusOptions()
        {
            return
                new List<ByteSelectOption>() {
                            new ByteSelectOption() { Name = "All", Value = 0 },
                            new ByteSelectOption() { Name = "Ongoing", Value = 1 },
                            new ByteSelectOption() { Name = "Completed", Value = 2 },
                            new ByteSelectOption() { Name = "Upcoming", Value = 3 }
            };
        }

        internal static List<ByteSelectOption> GenerateCareRecordStatusOptions()
        {
            return
                new List<ByteSelectOption>() {
                            new ByteSelectOption() { Name = "All", Value = 0 },
                            new ByteSelectOption() { Name = "Resolved", Value = 1 },
                            new ByteSelectOption() { Name = "Open", Value = 2 }
            };
        }

        internal static List<ByteSelectOption> GenerateOrderStatusOptions()
        {
            return
                new List<ByteSelectOption>() {
                            new ByteSelectOption() { Name = "All", Value = 0 },
                            new ByteSelectOption() { Name = "Complete", Value = 1 },
                            new ByteSelectOption() { Name = "Outstanding", Value = 2 },
                            new ByteSelectOption() { Name = "Held", Value = 3 }
            };
        }

        internal static List<StringSelectOption> GeneratePeriodOptions()
        {
            var results = new List<StringSelectOption>()
            {
                new StringSelectOption() { Name = "Today", Value = "today" },
                new StringSelectOption() { Name = "Last 30 Days", Value = "last-30-days" },
                new StringSelectOption() { Name = "Last Three Months", Value = "last-3-months" },
                new StringSelectOption() { Name = "Last Six Months", Value = "last-6-months" }
            };

            for (var i = 0; i < 3; i++)
            {
                var y = DateTime.Now.AddYears(-i).Year.ToString();
                results.Add(new StringSelectOption() { Name = y, Value = y });
            }

            results.Add(new StringSelectOption() { Name = "All Time", Value = "all-time" });
            results.Add(new StringSelectOption() { Name = "Custom Range", Value = "custom" });

            return results;
        }

        public static string DateTimeDistanceString(DateTime? inputDate, bool showHoursMinutesAgo = false, bool showDateAsWellAsHoursMinutesAgo = true)
        {
            if (inputDate == null)
            {
                return null;
            }

            string result = "";

            var difference = DateTime.Now.Date - inputDate.Value.Date;

            var today = DateTime.Now;

            if (difference.Ticks >= 0)
            {
                if (difference.Ticks == 0)
                    difference = DateTime.Now - inputDate.Value;

                var absDays = Math.Abs(Math.Ceiling(difference.TotalDays));

                if (absDays == 1)
                    result = "Today";
                if (difference.Ticks == 864000000000)
                    result = "Yesterday";
                if (difference.Ticks >= 1728000000000 && absDays < 14)
                    result = String.Format("({0} Days ago)", absDays);
                if (absDays >= 14)
                    result = String.Format("({0} Week" + (Math.Round(absDays / 7, 0) == 1 ? "" : "s") + " ago)", Math.Round(absDays / 7, 0));
                if (absDays >= 31)
                    result = String.Format("({0} Month" + (Math.Round(((absDays / 365.25) % 1) * 12, 0) == 1 ? "" : "s") + " ago)", Math.Round(((absDays / 365.25) % 1) * 12, 0));
                if (absDays >= 365)
                    result = String.Format("({0} Year" + (Math.Round((absDays / 365.25), 0) == 1 ? "" : "s" ) + " ago)", Math.Round((absDays / 365.25), 0));
                
                if (showHoursMinutesAgo)
                {
                    if (result == "Today" || result == "Yesterday")
                    {
                        var diff = today - inputDate.Value;

                        if (Math.Abs(diff.TotalHours) >= 1)
                        {
                            //if (Math.Abs(diff.Hours) > 6)
                            //{
                                result += " (" + String.Format("{0} hour" + (diff.TotalHours == 1 ? "" : "s"), Math.Round(diff.TotalHours, MidpointRounding.AwayFromZero)) + " ago)";
                            //}
                            //else
                            //{
                            //    result += " (" + String.Format("{0:%h} hour" + (diff.Hours == 1 ? "" : "s") + " {0:%m} minute" + (diff.Minutes == 1 ? "" : "s"), diff) + " ago)";
                            //}
                        }
                        else
                        {
                            result += " (" + String.Format("{0} minute" + (diff.TotalMinutes == 1 ? "" : "s"), (int)diff.TotalMinutes) + " ago)";
                        }
                    }
                    else
                    {
                        if (showDateAsWellAsHoursMinutesAgo)
                            result = inputDate.Value.ToString("ddd dd/MM/yyyy") + " " + result;
                        else
                            result = result.Replace("(", "").Replace(")", "");
                    }
                }
            }
            else
            {
                if (difference.Minutes < 60)
                    result = String.Format("(In {0} Minute" + (difference.Minutes == 1 ? "" : "s") + ")", difference.Minutes);
                if (difference.Hours < 24)
                    result = String.Format("(In {0} Hour" + (difference.Hours == 1 ? "": "s") + ")", difference.Hours);
                if (difference.Days == 1)
                    result = "(Yesterday)";
                if (difference.Days >= 7)
                    result = String.Format("(In {0} Week" + (Math.Round((double)difference.Days / 7, 0) == 1 ? "" : "s") + ")", Math.Round((double)difference.Days / 7, 0));
                if (difference.Days >= 31)
                    result = String.Format("(In {0} Month" + (Math.Round(((difference.Days / 365.25) % 1) * 12, 0) == 1 ? "" : "s") + ")", Math.Round(((difference.Days / 365.25) % 1) * 12, 0));
                if (difference.Days >= 365)
                    result = String.Format("(In {0} Year" + (Math.Round((difference.Days / 365.25), 0) == 1 ? "" : "s") + ")", Math.Round((difference.Days / 365.25), 0));
            }

            return result;
        }

        #region Email CSS
        internal static readonly string EmailCSS = @"
p, h1, h2, h3, h4, table, td, th, ul, ol, textarea, input {
    font-family:Verdana, Geneva, Helvetica, Arial, sans-serif; text-align:left; 
}

body, p, h3, h4, table, td, th, ul, ol, textarea, input {
 font-size:11px; color: #333333;
}

h1 {
 font-size:14px; margin-top:20px; margin-bottom:10px;
}

h2 {
 font-size:13px; margin-top:20px; margin-bottom:5px;
}

h3 {
 font-size:12px !important; margin-top:20px; margin-bottom:0px;
}

.header-p {
    width: 640px;
    height: 50px;
    overflow: hidden;
}

.header_h1 {
    margin-top: 0;
}

.header_h4 {
    margin-bottom: 20px;
}

h4 {
    font-size:11px; font-weight: 400; margin-top:20px; margin-bottom:0px; color:#585858;
}

.header-logo {
    display: block;
    width: 800px;
}

.footer-logo {
    margin-top: 10px;
    display: block;
    width: 200px;
}

p.footer {
    margin-top: 10px;
    margin-bottom: 16px;
}

p.signoff {
    font-size: 11px;
    margin-bottom: 16px;
    margin-top: 24px;
}

h2.signoff {
    margin-top: 6px;
    margin-bottom: 4px;
    font-weight: 400;
    font-size: 11px;
}";
        #endregion
    }

    public class ByteSelectOption
    {
        public byte Value { get; set; }
        public string Name { get; set; }
    }

    public class StringSelectOption
    {
        public string Value { get; set; }
        public string Name { get; set; }
    }

    public class BoolSelectOption
    {
        public bool? Value { get; set; }
        public string Name { get; set; }
    }
}