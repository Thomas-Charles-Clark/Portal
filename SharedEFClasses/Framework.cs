using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections;
using System.Text.RegularExpressions;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Cache;
using SharedEFClasses.Models.Applications;
using SharedEFClasses.Models;
using System.Data;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using SharedEFClasses.Models.ErrorContext;
using System.Text;
using System.Globalization;
using System.Reflection;

namespace SharedEFClasses.Utilities
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

    public enum TaskAlertType
    {
        Task = 1,
        TaskChase = 2,
        TaskCommented = 3,
        TaskCompleted = 4,
        ExpectedDeliveryChanged = 5
    }

    public static partial class PortalFramework
    {
        public static readonly string InkyEndpoint = "https://vm-web2:8091/inkyUpdated/inkyUpdated.js";
        public static readonly string PlainEmailHeaderImage = "https://downloads.designersguild.com/content/images/email-logo-720-shallow.jpg";
        public static readonly string WebServerHostname = "vm-web2";

        public static Assembly GetAssembly(string name) 
        {
            return AppDomain.CurrentDomain.GetAssemblies()
                .SingleOrDefault(a => a.GetName().Name == name);
        }

        public static bool IsDebug() 
        {
#if DEBUG
            return true;
#else
            return false;
#endif
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

        public static string RemoveDiacritics(string text)
        {
            if (text == null)
                return text;

            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }

        public static void LogErrorToDatabase(Exception e, int memberId = 0)
        {
            String exceptionType = "";
            String exceptionMessage = "";
            String exceptionSource = "";
            String stackTrace = "";
            String innerExceptionType = "";
            String innerExceptionMessage = "";
            String innerExceptionSource = "";
            String innerExceptionStackTrace = "";

            var exc = e;

            exceptionType = exc.GetType().ToString();
            exceptionMessage = exc.Message;
            exceptionSource = exc.Source;

            if (exc.StackTrace != null)
            {
                stackTrace = exc.StackTrace;
            }

            if (exc.InnerException == null) { }
            else
            {
                innerExceptionType = exc.InnerException.GetType().ToString();
                innerExceptionMessage = exc.InnerException.Message;
                innerExceptionSource = exc.InnerException.Source;

                if (exc.InnerException.StackTrace != null)
                {
                    innerExceptionStackTrace = exc.InnerException.StackTrace;
                }
            }

            ErrorDbContext objError = new ErrorDbContext();

            objError.SaveToErrorLog(
                memberId,
                exceptionType,
                exceptionMessage,
                exceptionSource,
                stackTrace,
                innerExceptionType,
                innerExceptionMessage,
                innerExceptionSource,
                innerExceptionStackTrace,
                null,
                PortalFramework.GetUserAgent(),
                PortalFramework.GetIPAddress());
        }


        public static void LogErrorToDatabase(int memberId, PassClientError e)
        {
            String exceptionType = "";
            String exceptionMessage = "";
            String exceptionSource = "";
            String stackTrace = "";
            String innerExceptionType = "";
            String innerExceptionMessage = "";
            String innerExceptionSource = "";
            String innerExceptionStackTrace = "";
                
            var exc = e;

            exceptionType = "Javascript Error";
            exceptionMessage = e.message;
            exceptionSource = e.stack;
            innerExceptionMessage = e.error;

            stackTrace = exc.lineNo;

            ErrorDbContext objError = new ErrorDbContext();

            objError.SaveToErrorLog(memberId,
                exceptionType,
                exceptionMessage,
                exceptionSource,
                stackTrace,
                innerExceptionType,
                innerExceptionMessage,
                innerExceptionSource,
                innerExceptionStackTrace,
                null,
                PortalFramework.GetUserAgent(),
                PortalFramework.GetIPAddress());
        }

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

        public static List<ByteSelectOption> GetYesNoDontKnow()
        {
            var result = new List<ByteSelectOption>()
            {
                new ByteSelectOption() { Value = 0, Name = "No" },
                new ByteSelectOption() { Value = 1, Name = "Yes" },
                new ByteSelectOption() { Value = 2, Name = "Don't Know" }
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

        public static List<ClientSideCountry> GetClientSideCountries(PortalDbContext portalDb)
        {
            var primaryMarkets = new List<short>() { 81, 79, 60, 114, 238 };

            var result = new List<ClientSideCountry>();

            result.Add(portalDb.Countries.Where(p => p.CountryID == 15).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Austria

            result.Add(portalDb.Countries.Where(p => p.CountryID == 16).Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID }).Single()); // Austria

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

        public static string LoadTwoRandomWords()
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

        public static List<string> LoadRandomWordsAndSpooneriseThem()
        {
            try
            {
                var result = new List<string>();

                var ti = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo;

                var words = System.IO.File.ReadAllLines(AppDomain.CurrentDomain.BaseDirectory + "/Utilities/wordlist.txt").ToList();

                var random = new System.Random();

                for (var i = 0; i < 10; i++)
                {
                    var wordOne = ti.ToTitleCase(words[random.Next(words.Count - 1)]);

                    var wordTwo = ti.ToTitleCase(words[random.Next(words.Count - 1)]);

                    var charOne = wordOne[0];

                    var charTwo = wordTwo[0];

                    while (charOne == charTwo)
                    {
                        wordTwo = ti.ToTitleCase(words[random.Next(words.Count - 1)]);
                        charTwo = wordTwo[0];
                    }

                    wordOne = charTwo + wordOne.Substring(1, wordOne.Length - 1);

                    wordTwo = charOne + wordTwo.Substring(1, wordTwo.Length - 1);

                    result.Add($"{wordOne} {wordTwo}");

                }

                return result;
            }
            catch (Exception)
            {
                return new List<string> { "SpoonFailure" };
            }
        }

        public static List<ClientSideLanguage> GetClientSideLanguages(PortalDbContext portalDb)
        {
            return portalDb.Languages.Where(p => p.DeletedDT == null)
                                    .Select(p => new ClientSideLanguage() { LanguageID = p.LanguageID, Name = p.Name })
                                    .ToList();
        }

        public static List<ByteSelectOption> GenerateLeadStatusOptions()
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

        public static List<ByteSelectOption> GenerateTaskStatusOptions()
        {
            return
                new List<ByteSelectOption>() {
                            new ByteSelectOption() { Name = "All", Value = 0 },
                            new ByteSelectOption() { Name = "Ongoing", Value = 1 },
                            new ByteSelectOption() { Name = "Completed", Value = 2 },
                            new ByteSelectOption() { Name = "Upcoming", Value = 3 }
            };
        }

        public static List<ByteSelectOption> GenerateCareRecordStatusOptions()
        {
            return
                new List<ByteSelectOption>() {
                            new ByteSelectOption() { Name = "All", Value = 0 },
                            new ByteSelectOption() { Name = "Resolved", Value = 1 },
                            new ByteSelectOption() { Name = "Open", Value = 2 }
            };
        }

        public static List<ByteSelectOption> GenerateOrderStatusOptions()
        {
            return
                new List<ByteSelectOption>() {
                            new ByteSelectOption() { Name = "All", Value = 0 },
                            new ByteSelectOption() { Name = "Complete", Value = 1 },
                            new ByteSelectOption() { Name = "Outstanding", Value = 2 },
                            new ByteSelectOption() { Name = "Held", Value = 3 }
            };
        }

        public static List<StringSelectOption> GeneratePeriodOptions()
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

        /// Thanks: https://stackoverflow.com/questions/11/calculate-relative-time-in-c-sharp#answer-628203
        /// <summary>
        /// Compares a supplied date to the current date and generates a friendly English 
        /// comparison ("5 days ago", "5 days from now")
        /// </summary>
        /// <param name="date">The date to convert</param>
        /// <param name="approximate">When off, calculate timespan down to the second.
        /// When on, approximate to the largest round unit of time.</param>
        /// <returns></returns>
        public static string ToRelativeDateString(this DateTime value, bool approximate)
        {
            StringBuilder sb = new StringBuilder();

            string suffix = (value > DateTime.Now) ? " from now" : " ago";

            TimeSpan timeSpan = new TimeSpan(Math.Abs(DateTime.Now.Subtract(value).Ticks));

            if (timeSpan.Days > 31)
            {
                return "";
            }
            if (timeSpan.Days > 0)
            {
                sb.AppendFormat("{0} {1}", timeSpan.Days,
                  (timeSpan.Days > 1) ? "days" : "day");
                if (approximate) return sb.ToString() + suffix;
            }
            if (timeSpan.Hours > 0)
            {
                sb.AppendFormat("{0}{1} {2}", (sb.Length > 0) ? ", " : string.Empty,
                  timeSpan.Hours, (timeSpan.Hours > 1) ? "hours" : "hour");
                if (approximate) return sb.ToString() + suffix;
            }
            if (timeSpan.Minutes > 0)
            {
                sb.AppendFormat("{0}{1} {2}", (sb.Length > 0) ? ", " : string.Empty,
                  timeSpan.Minutes, (timeSpan.Minutes > 1) ? "minutes" : "minute");
                if (approximate) return sb.ToString() + suffix;
            }
            if (timeSpan.Seconds > 0)
            {
                sb.AppendFormat("{0}{1} {2}", (sb.Length > 0) ? ", " : string.Empty,
                  timeSpan.Seconds, (timeSpan.Seconds > 1) ? "seconds" : "second");
                if (approximate) return sb.ToString() + suffix;
            }
            if (sb.Length == 0) return "";

            sb.Append(suffix);
            return sb.ToString();
        }

        public static string DateTimeDistanceString(DateTime? inputDate, bool showHoursMinutesAgo = false, bool showDateAsWellAsHoursMinutesAgo = true)
        {
            if (inputDate == null)
            {
                return null;
            }

            string result = "";

            var difference = DateTime.Now - inputDate.Value;

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
                var days = Math.Abs(difference.Days);
                var hours = Math.Abs(difference.Hours);
                var minutes = Math.Abs(difference.Minutes);

                var dayPart = "";

                if (days >= 365)
                    dayPart = $"in {Math.Round((days / 365.25), 0)} year" + (Math.Round((days / 365.25), 0) == 1 ? "" : "s");
                if (days >= 31)
                    dayPart = $"in {Math.Round(((days / 365.25) % 1) * 12, 0)} month" + (Math.Round(((days / 365.25) % 1) * 12, 0) == 1 ? "" : "s");
                if (days >= 7)
                    dayPart = $"in {Math.Round((double)days / 7, 0)} week" + (Math.Round((double)days / 7, 0) == 1 ? "" : "s");
                if (days < 7)
                    dayPart = $"in {days} days";
                if (days == 1)
                    dayPart = "in 1 day";
                if (days == 0)
                    dayPart = "";
                if (hours < 24)
                    result = $"in {hours} hours";
                if (hours <= 2)
                    result = $"in {hours} hour" + (hours == 1 ? "" : "s") + $" {minutes} minute" + (minutes == 1 ? "" : "s");
                if (minutes <= 60 && hours <= 1)
                    result = $"in {minutes} minute" + (minutes == 1 ? "" : "s");

                if (dayPart != "")
                    result = $"{dayPart},{result.Replace("in ", " ")}";
            }

            return result;
        }

        public static string DateTimeDistanceBetweenString(DateTime? inputDate, DateTime? endDate, bool showHoursMinutesAgo = false, bool showDateAsWellAsHoursMinutesAgo = true)
        {
            if (inputDate == null)
            {
                return null;
            }

            string result = "";

            var difference = (endDate.HasValue ? endDate.Value.Date : DateTime.Now.Date) - inputDate.Value.Date;

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
                    result = String.Format("({0} Days)", absDays);
                if (absDays >= 14)
                    result = String.Format("({0} Week" + (Math.Round(absDays / 7, 0) == 1 ? "" : "s") + ")", Math.Round(absDays / 7, 0));
                if (absDays >= 31)
                    result = String.Format("({0} Month" + (Math.Round(((absDays / 365.25) % 1) * 12, 0) == 1 ? "" : "s") + ")", Math.Round(((absDays / 365.25) % 1) * 12, 0));
                if (absDays >= 365)
                    result = String.Format("({0} Year" + (Math.Round((absDays / 365.25), 0) == 1 ? "" : "s") + ")", Math.Round((absDays / 365.25), 0));

                if (showHoursMinutesAgo)
                {
                    if (result == "Today" || result == "Yesterday")
                    {
                        var diff = today - inputDate.Value;

                        if (Math.Abs(diff.TotalHours) >= 1)
                        {
                            //if (Math.Abs(diff.Hours) > 6)
                            //{
                            result += " (" + String.Format("{0} hour" + (diff.TotalHours == 1 ? "" : "s"), Math.Round(diff.TotalHours, MidpointRounding.AwayFromZero)) + ")";
                            //}
                            //else
                            //{
                            //    result += " (" + String.Format("{0:%h} hour" + (diff.Hours == 1 ? "" : "s") + " {0:%m} minute" + (diff.Minutes == 1 ? "" : "s"), diff) + " ago)";
                            //}
                        }
                        else
                        {
                            result += " (" + String.Format("{0} minute" + (diff.TotalMinutes == 1 ? "" : "s"), (int)diff.TotalMinutes) + ")";
                        }
                    }
                    else
                    {
                        if (showDateAsWellAsHoursMinutesAgo)
                            result = inputDate.Value.ToString("ddd dd/MM/yyyy") + " " + result;
                        //else
                            //result = result.Replace("(", "").Replace(")", "");
                    }
                }
            }
            else
            {
                if (difference.Minutes < 60)
                    result = String.Format("(In {0} Minute" + (difference.Minutes == 1 ? "" : "s") + ")", difference.Minutes);
                if (difference.Hours < 24)
                    result = String.Format("(In {0} Hour" + (difference.Hours == 1 ? "" : "s") + ")", difference.Hours);
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

        public static DataTable ConvertToDataTable<T>(IEnumerable<T> data)
        {
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(T));
            var table = new DataTable();

            foreach (PropertyDescriptor prop in properties)
            {
                table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            }

            foreach (T item in data)
            {
                var row = table.NewRow();

                foreach (PropertyDescriptor prop in properties)
                {
                    row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                }

                table.Rows.Add(row);
            }

            return table;

        }

        #region Email CSS

        public static readonly string EmailCSS = @"
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
}

table > thead > tr > th,
table > tbody > tr > td {
    padding: 2px 4px;
}";

        public static readonly string FoundationEmailCSS = @"
.wrapper {
  width: 100%;
}

# outlook a {
  padding: 0;
}

body {
  width: 100% !important;
  min-width: 100%;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  margin: 0;
  Margin: 0;
  padding: 0;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.ExternalClass {
  width: 100%;
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
  line-height: 100%;
}

# backgroundTable {
  margin: 0;
  Margin: 0;
  padding: 0;
  width: 100% !important;
  line-height: 100% !important;
}

img {
  outline: none;
  text-decoration: none;
  -ms-interpolation-mode: bicubic;
  width: auto;
  max-width: 100%;
  clear: both;
  display: block;
}

center {
  width: 100%;
  min-width: 640px;
}

a img {
  border: none;
}

table {
  border-spacing: 0;
  border-collapse: collapse;
}

td {
  word-wrap: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  hyphens: auto;
  border-collapse: collapse !important;
}

table, tr, td {
  padding: 0;
  vertical-align: top;
  text-align: left;
}

@media only screen {
  html {
    min-height: 100%;
    background: #f3f3f3;
  }
}
table.body {
  background: #f3f3f3;
  height: 100%;
  width: 100%;
}
table.container {
  background: #fefefe;
  width: 640px;
  margin: 0 auto;
  Margin: 0 auto;
  text-align: inherit;
}
table.row {
  padding: 0;
  width: 100%;
  position: relative;
}
table.spacer {
  width: 100%;
}
table.spacer td {
  mso-line-height-rule: exactly;
}

table.container table.row {
  display: table;
}

td.columns,
td.column,
th.columns,
th.column {
  margin: 0 auto;
  Margin: 0 auto;
  padding-left: 16px;
  padding-bottom: 16px;
}
td.columns .column,
td.columns .columns,
td.column .column,
td.column .columns,
th.columns .column,
th.columns .columns,
th.column .column,
th.column .columns {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
td.columns .column center,
td.columns .columns center,
td.column .column center,
td.column .columns center,
th.columns .column center,
th.columns .columns center,
th.column .column center,
th.column .columns center {
  min-width: none !important;
}

td.columns.last,
td.column.last,
th.columns.last,
th.column.last {
  padding-right: 16px;
}

td.columns table:not(.button),
td.column table:not(.button),
th.columns table:not(.button),
th.column table:not(.button) {
  width: 100%;
}

td.large-1,
th.large-1 {
  width: 32.3333333333px;
  padding-left: 8px;
  padding-right: 8px;
}

td.large-1.first,
th.large-1.first {
  padding-left: 16px;
}

td.large-1.last,
th.large-1.last {
  padding-right: 16px;
}

.collapse > tbody > tr > td.large-1,
.collapse > tbody > tr > th.large-1 {
  padding-right: 0;
  padding-left: 0;
  width: 48.3333333333px;
}
.collapse td.large-1.first,
.collapse th.large-1.first,
.collapse td.large-1.last,
.collapse th.large-1.last {
  width: 56.3333333333px;
}

td.large-1 center,
th.large-1 center {
  min-width: 0.3333333333px;
}

.body .columns td.large-1,
.body .column td.large-1,
.body .columns th.large-1,
.body .column th.large-1 {
  width: 8.333333%;
}

td.large-2,
th.large-2 {
  width: 80.6666666667px;
  padding-left: 8px;
  padding-right: 8px;
}

td.large-2.first,
th.large-2.first {
  padding-left: 16px;
}

td.large-2.last,
th.large-2.last {
  padding-right: 16px;
}

.collapse > tbody > tr > td.large-2,
.collapse > tbody > tr > th.large-2 {
  padding-right: 0;
  padding-left: 0;
  width: 96.6666666667px;
}
.collapse td.large-2.first,
.collapse th.large-2.first,
.collapse td.large-2.last,
.collapse th.large-2.last {
  width: 104.6666666667px;
}

td.large-2 center,
th.large-2 center {
  min-width: 48.6666666667px;
}

.body .columns td.large-2,
.body .column td.large-2,
.body .columns th.large-2,
.body .column th.large-2 {
  width: 16.666666%;
}

td.large-3,
th.large-3 {
  width: 129px;
  padding-left: 8px;
  padding-right: 8px;
}

td.large-3.first,
th.large-3.first {
  padding-left: 16px;
}

td.large-3.last,
th.large-3.last {
  padding-right: 16px;
}

.collapse > tbody > tr > td.large-3,
.collapse > tbody > tr > th.large-3 {
  padding-right: 0;
  padding-left: 0;
  width: 145px;
}
.collapse td.large-3.first,
.collapse th.large-3.first,
.collapse td.large-3.last,
.collapse th.large-3.last {
  width: 153px;
}

td.large-3 center,
th.large-3 center {
  min-width: 97px;
}

.body .columns td.large-3,
.body .column td.large-3,
.body .columns th.large-3,
.body .column th.large-3 {
  width: 25%;
}

td.large-4,
th.large-4 {
  width: 177.3333333333px;
  padding-left: 8px;
  padding-right: 8px;
}

td.large-4.first,
th.large-4.first {
  padding-left: 16px;
}

td.large-4.last,
th.large-4.last {
  padding-right: 16px;
}

.collapse > tbody > tr > td.large-4,
.collapse > tbody > tr > th.large-4 {
  padding-right: 0;
  padding-left: 0;
  width: 193.3333333333px;
}
.collapse td.large-4.first,
.collapse th.large-4.first,
.collapse td.large-4.last,
.collapse th.large-4.last {
  width: 201.3333333333px;
}

td.large-4 center,
th.large-4 center {
  min-width: 145.3333333333px;
}

.body .columns td.large-4,
.body .column td.large-4,
.body .columns th.large-4,
.body .column th.large-4 {
  width: 33.333333%;
}

td.large-5,
th.large-5 {
  width: 225.6666666667px;
  padding-left: 8px;
  padding-right: 8px;
}

td.large-5.first,
th.large-5.first {
  padding-left: 16px;
}

td.large-5.last,
th.large-5.last {
  padding-right: 16px;
}

.collapse > tbody > tr > td.large-5,
.collapse > tbody > tr > th.large-5 {
  padding-right: 0;
  padding-left: 0;
  width: 241.6666666667px;
}
.collapse td.large-5.first,
.collapse th.large-5.first,
.collapse td.large-5.last,
.collapse th.large-5.last {
  width: 249.6666666667px;
}

td.large-5 center,
th.large-5 center {
  min-width: 193.6666666667px;
}

.body .columns td.large-5,
.body .column td.large-5,
.body .columns th.large-5,
.body .column th.large-5 {
  width: 41.666666%;
}

td.large-6,
th.large-6 {
  width: 274px;
  padding-left: 8px;
  padding-right: 8px;
}

td.large-6.first,
th.large-6.first {
  padding-left: 16px;
}

td.large-6.last,
th.large-6.last {
  padding-right: 16px;
}

.collapse > tbody > tr > td.large-6,
.collapse > tbody > tr > th.large-6 {
  padding-right: 0;
  padding-left: 0;
  width: 290px;
}
.collapse td.large-6.first,
.collapse th.large-6.first,
.collapse td.large-6.last,
.collapse th.large-6.last {
  width: 298px;
}

td.large-6 center,
th.large-6 center {
  min-width: 242px;
}

.body .columns td.large-6,
.body .column td.large-6,
.body .columns th.large-6,
.body .column th.large-6 {
  width: 50%;
}

td.large-7,
th.large-7 {
  width: 322.3333333333px;
  padding-left: 8px;
  padding-right: 8px;
}

td.large-7.first,
th.large-7.first {
  padding-left: 16px;
}

td.large-7.last,
th.large-7.last {
  padding-right: 16px;
}

.collapse > tbody > tr > td.large-7,
.collapse > tbody > tr > th.large-7 {
  padding-right: 0;
  padding-left: 0;
  width: 338.3333333333px;
}
.collapse td.large-7.first,
.collapse th.large-7.first,
.collapse td.large-7.last,
.collapse th.large-7.last {
  width: 346.3333333333px;
}

td.large-7 center,
th.large-7 center {
  min-width: 290.3333333333px;
}

.body .columns td.large-7,
.body .column td.large-7,
.body .columns th.large-7,
.body .column th.large-7 {
  width: 58.333333%;
}

td.large-8,
th.large-8 {
  width: 370.6666666667px;
  padding-left: 8px;
  padding-right: 8px;
}

td.large-8.first,
th.large-8.first {
  padding-left: 16px;
}

td.large-8.last,
th.large-8.last {
  padding-right: 16px;
}

.collapse > tbody > tr > td.large-8,
.collapse > tbody > tr > th.large-8 {
  padding-right: 0;
  padding-left: 0;
  width: 386.6666666667px;
}
.collapse td.large-8.first,
.collapse th.large-8.first,
.collapse td.large-8.last,
.collapse th.large-8.last {
  width: 394.6666666667px;
}

td.large-8 center,
th.large-8 center {
  min-width: 338.6666666667px;
}

.body .columns td.large-8,
.body .column td.large-8,
.body .columns th.large-8,
.body .column th.large-8 {
  width: 66.666666%;
}

td.large-9,
th.large-9 {
  width: 419px;
  padding-left: 8px;
  padding-right: 8px;
}

td.large-9.first,
th.large-9.first {
  padding-left: 16px;
}

td.large-9.last,
th.large-9.last {
  padding-right: 16px;
}

.collapse > tbody > tr > td.large-9,
.collapse > tbody > tr > th.large-9 {
  padding-right: 0;
  padding-left: 0;
  width: 435px;
}
.collapse td.large-9.first,
.collapse th.large-9.first,
.collapse td.large-9.last,
.collapse th.large-9.last {
  width: 443px;
}

td.large-9 center,
th.large-9 center {
  min-width: 387px;
}

.body .columns td.large-9,
.body .column td.large-9,
.body .columns th.large-9,
.body .column th.large-9 {
  width: 75%;
}

td.large-10,
th.large-10 {
  width: 467.3333333333px;
  padding-left: 8px;
  padding-right: 8px;
}

td.large-10.first,
th.large-10.first {
  padding-left: 16px;
}

td.large-10.last,
th.large-10.last {
  padding-right: 16px;
}

.collapse > tbody > tr > td.large-10,
.collapse > tbody > tr > th.large-10 {
  padding-right: 0;
  padding-left: 0;
  width: 483.3333333333px;
}
.collapse td.large-10.first,
.collapse th.large-10.first,
.collapse td.large-10.last,
.collapse th.large-10.last {
  width: 491.3333333333px;
}

td.large-10 center,
th.large-10 center {
  min-width: 435.3333333333px;
}

.body .columns td.large-10,
.body .column td.large-10,
.body .columns th.large-10,
.body .column th.large-10 {
  width: 83.333333%;
}

td.large-11,
th.large-11 {
  width: 515.6666666667px;
  padding-left: 8px;
  padding-right: 8px;
}

td.large-11.first,
th.large-11.first {
  padding-left: 16px;
}

td.large-11.last,
th.large-11.last {
  padding-right: 16px;
}

.collapse > tbody > tr > td.large-11,
.collapse > tbody > tr > th.large-11 {
  padding-right: 0;
  padding-left: 0;
  width: 531.6666666667px;
}
.collapse td.large-11.first,
.collapse th.large-11.first,
.collapse td.large-11.last,
.collapse th.large-11.last {
  width: 539.6666666667px;
}

td.large-11 center,
th.large-11 center {
  min-width: 483.6666666667px;
}

.body .columns td.large-11,
.body .column td.large-11,
.body .columns th.large-11,
.body .column th.large-11 {
  width: 91.666666%;
}

td.large-12,
th.large-12 {
  width: 564px;
  padding-left: 8px;
  padding-right: 8px;
}

td.large-12.first,
th.large-12.first {
  padding-left: 16px;
}

td.large-12.last,
th.large-12.last {
  padding-right: 16px;
}

.collapse > tbody > tr > td.large-12,
.collapse > tbody > tr > th.large-12 {
  padding-right: 0;
  padding-left: 0;
  width: 640px;
}
.collapse td.large-12.first,
.collapse th.large-12.first,
.collapse td.large-12.last,
.collapse th.large-12.last {
  width: 648px;
}

td.large-12 center,
th.large-12 center {
  min-width: 532px;
}

.body .columns td.large-12,
.body .column td.large-12,
.body .columns th.large-12,
.body .column th.large-12 {
  width: 100%;
}

td.large-offset-1,
td.large-offset-1.first,
td.large-offset-1.last,
th.large-offset-1,
th.large-offset-1.first,
th.large-offset-1.last {
  padding-left: 64.3333333333px;
}

td.large-offset-2,
td.large-offset-2.first,
td.large-offset-2.last,
th.large-offset-2,
th.large-offset-2.first,
th.large-offset-2.last {
  padding-left: 112.6666666667px;
}

td.large-offset-3,
td.large-offset-3.first,
td.large-offset-3.last,
th.large-offset-3,
th.large-offset-3.first,
th.large-offset-3.last {
  padding-left: 161px;
}

td.large-offset-4,
td.large-offset-4.first,
td.large-offset-4.last,
th.large-offset-4,
th.large-offset-4.first,
th.large-offset-4.last {
  padding-left: 209.3333333333px;
}

td.large-offset-5,
td.large-offset-5.first,
td.large-offset-5.last,
th.large-offset-5,
th.large-offset-5.first,
th.large-offset-5.last {
  padding-left: 257.6666666667px;
}

td.large-offset-6,
td.large-offset-6.first,
td.large-offset-6.last,
th.large-offset-6,
th.large-offset-6.first,
th.large-offset-6.last {
  padding-left: 306px;
}

td.large-offset-7,
td.large-offset-7.first,
td.large-offset-7.last,
th.large-offset-7,
th.large-offset-7.first,
th.large-offset-7.last {
  padding-left: 354.3333333333px;
}

td.large-offset-8,
td.large-offset-8.first,
td.large-offset-8.last,
th.large-offset-8,
th.large-offset-8.first,
th.large-offset-8.last {
  padding-left: 402.6666666667px;
}

td.large-offset-9,
td.large-offset-9.first,
td.large-offset-9.last,
th.large-offset-9,
th.large-offset-9.first,
th.large-offset-9.last {
  padding-left: 451px;
}

td.large-offset-10,
td.large-offset-10.first,
td.large-offset-10.last,
th.large-offset-10,
th.large-offset-10.first,
th.large-offset-10.last {
  padding-left: 499.3333333333px;
}

td.large-offset-11,
td.large-offset-11.first,
td.large-offset-11.last,
th.large-offset-11,
th.large-offset-11.first,
th.large-offset-11.last {
  padding-left: 547.6666666667px;
}

td.expander,
th.expander {
  visibility: hidden;
  width: 0;
  padding: 0 !important;
}

table.container.radius {
  border-radius: 0;
  border-collapse: separate;
}

.block-grid {
  width: 100%;
  max-width: 640px;
}
.block-grid td {
  display: inline-block;
  padding: 8px;
}

.up-2 td {
  width: 274px !important;
}

.up-3 td {
  width: 177px !important;
}

.up-4 td {
  width: 129px !important;
}

.up-5 td {
  width: 100px !important;
}

.up-6 td {
  width: 80px !important;
}

.up-7 td {
  width: 66px !important;
}

.up-8 td {
  width: 56px !important;
}

table.text-center,
th.text-center,
td.text-center,
h1.text-center,
h2.text-center,
h3.text-center,
h4.text-center,
h5.text-center,
h6.text-center,
p.text-center,
span.text-center {
  text-align: center;
}
table.text-left,
th.text-left,
td.text-left,
h1.text-left,
h2.text-left,
h3.text-left,
h4.text-left,
h5.text-left,
h6.text-left,
p.text-left,
span.text-left {
  text-align: left;
}
table.text-right,
th.text-right,
td.text-right,
h1.text-right,
h2.text-right,
h3.text-right,
h4.text-right,
h5.text-right,
h6.text-right,
p.text-right,
span.text-right {
  text-align: right;
}

span.text-center {
  display: block;
  width: 100%;
  text-align: center;
}

@media only screen and (max-width: 596px) {

    html, 
    body {
        background-color: white !important;
        min-width: unset !important;
    }

    body {
        height:100% !important;
        margin:0 !important;
        padding:0 !important;
        width:100vw !important;
    }

  .small-float-center {
    margin: 0 auto !important;
    float: none !important;
    text-align: center !important;
  }

  .small-text-center {
    text-align: center !important;
  }

  .small-text-left {
    text-align: left !important;
  }

  .small-text-right {
    text-align: right !important;
  }
}
img.float-left {
  float: left;
  text-align: left;
}

img.float-right {
  float: right;
  text-align: right;
}

img.float-center,
img.text-center {
  margin: 0 auto;
  Margin: 0 auto;
  float: none;
  text-align: center;
}

table.float-center,
td.float-center,
th.float-center {
  margin: 0 auto;
  Margin: 0 auto;
  float: none;
  text-align: center;
}

.hide-for-large {
  display: none !important;
  mso-hide: all;
  overflow: hidden;
  max-height: 0;
  font-size: 0;
  width: 0;
  line-height: 0;
}
@media only screen and (max-width: 596px) {
  .hide-for-large {
    display: block !important;
    width: auto !important;
    overflow: visible !important;
    max-height: none !important;
    font-size: inherit !important;
    line-height: inherit !important;
  }
}

table.body table.container .hide-for-large * {
  mso-hide: all;
}

@media only screen and (max-width: 596px) {
  table.body table.container .hide-for-large,
  table.body table.container .row.hide-for-large {
    display: table !important;
    width: 100% !important;
  }
}

@media only screen and (max-width: 596px) {
  table.body table.container .callout-inner.hide-for-large {
    display: table-cell !important;
    width: 100% !important;
  }
}

@media only screen and (max-width: 596px) {
  table.body table.container .show-for-large {
    display: none !important;
    width: 0;
    mso-hide: all;
    overflow: hidden;
  }
}

body,
table.body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
td,
th,
a {
  color: #0a0a0a;
  font-family: Lucida, Arial, sans-serif;
  font-weight: normal;
  padding: 0;
  margin: 0;
  Margin: 0;
  text-align: left;
  line-height: 1.3;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: inherit;
  word-wrap: normal;
  font-family: Lucida, Arial, sans-serif;
  font-weight: normal;
  margin-bottom: 10px;
  Margin-bottom: 10px;
}

h1 {
  font-size: 34px;
}

h2 {
  font-size: 30px;
}

h3 {
  font-size: 28px;
}

h4 {
  font-size: 24px;
}

h5 {
  font-size: 20px;
}

h6 {
  font-size: 18px;
}

body,
table.body,
p,
td,
th {
  font-size: 16px;
  line-height: 1.3;
}

p {
  margin-bottom: 10px;
  Margin-bottom: 10px;
}
p.lead {
  font-size: 20px;
  line-height: 1.6;
}
p.subheader {
  margin-top: 4px;
  margin-bottom: 8px;
  Margin-top: 4px;
  Margin-bottom: 8px;
  font-weight: normal;
  line-height: 1.4;
  color: #8a8a8a;
}

small {
  font-size: 80%;
  color: #cacaca;
}

a {
  color: #2199e8;
  text-decoration: none;
}
a:hover {
  color: #147dc2;
}
a:active {
  color: #147dc2;
}
a:visited {
  color: #2199e8;
}

h1 a,
h1 a:visited,
h2 a,
h2 a:visited,
h3 a,
h3 a:visited,
h4 a,
h4 a:visited,
h5 a,
h5 a:visited,
h6 a,
h6 a:visited {
  color: #2199e8;
}

pre {
  background: #f3f3f3;
  margin: 30px 0;
  Margin: 30px 0;
}
pre code {
  color: #cacaca;
}
pre code span.callout {
  color: #8a8a8a;
  font-weight: bold;
}
pre code span.callout-strong {
  color: #ff6908;
  font-weight: bold;
}

table.hr {
  width: 100%;
}
table.hr th {
  height: 0;
  max-width: 640px;
  border-top: 0;
  border-right: 0;
  border-bottom: 1px solid #0a0a0a;
  border-left: 0;
  margin: 20px auto;
  Margin: 20px auto;
  clear: both;
}

.stat {
  font-size: 40px;
  line-height: 1;
}
p + .stat {
  margin-top: -16px;
  Margin-top: -16px;
}

span.preheader {
  display: none !important;
  visibility: hidden;
  mso-hide: all !important;
  font-size: 1px;
  color: #f3f3f3;
  line-height: 1px;
  max-height: 0px;
  max-width: 0px;
  opacity: 0;
  overflow: hidden;
}

table.button {
  width: auto;
  margin: 0 0 16px 0;
  Margin: 0 0 16px 0;
}
table.button table td {
  text-align: left;
  color: #fefefe;
  background: #2199e8;
  border: 2px solid #2199e8;
}
table.button table td a {
  font-family: Lucida, Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #fefefe;
  text-decoration: none;
  display: inline-block;
  padding: 8px 16px 8px 16px;
  border: 0 solid #2199e8;
  border-radius: 3px;
}
table.button.radius table td {
  border-radius: 3px;
  border: none;
}
table.button.rounded table td {
  border-radius: 500px;
  border: none;
}

table.button:hover table tr td a,
table.button:active table tr td a,
table.button table tr td a:visited,
table.button.tiny:hover table tr td a,
table.button.tiny:active table tr td a,
table.button.tiny table tr td a:visited,
table.button.small:hover table tr td a,
table.button.small:active table tr td a,
table.button.small table tr td a:visited,
table.button.large:hover table tr td a,
table.button.large:active table tr td a,
table.button.large table tr td a:visited {
  color: #fefefe;
}

table.button.tiny table td,
table.button.tiny table a {
  padding: 4px 8px 4px 8px;
}
table.button.tiny table a {
  font-size: 10px;
  font-weight: normal;
}

table.button.small table td,
table.button.small table a {
  padding: 5px 10px 5px 10px;
  font-size: 16px;
}

table.button.large table a {
  padding: 10px 20px 10px 20px;
  font-size: 20px;
}

table.button.expand,
table.button.expanded {
  width: 100% !important;
}
table.button.expand table,
table.button.expanded table {
  width: 100%;
}
table.button.expand table a,
table.button.expanded table a {
  text-align: center;
  width: 100%;
  padding-left: 0;
  padding-right: 0;
}
table.button.expand center,
table.button.expanded center {
  min-width: 0;
}

table.button:hover table td,
table.button:visited table td,
table.button:active table td {
  background: #147dc2;
  color: #fefefe;
}

table.button:hover table a,
table.button:visited table a,
table.button:active table a {
  border: 0 solid #147dc2;
}

table.button.secondary table td {
  background: #777777;
  color: #fefefe;
  border: 0px solid #777777;
}
table.button.secondary table a {
  color: #fefefe;
  border: 0 solid #777777;
}

table.button.secondary:hover table td {
  background: #919191;
  color: #fefefe;
}
table.button.secondary:hover table a {
  border: 0 solid #919191;
}

table.button.secondary:hover table td a {
  color: #fefefe;
}

table.button.secondary:active table td a {
  color: #fefefe;
}

table.button.secondary table td a:visited {
  color: #fefefe;
}

table.button.success table td {
  background: #3adb76;
  border: 0px solid #3adb76;
}
table.button.success table a {
  border: 0 solid #3adb76;
}

table.button.success:hover table td {
  background: #23bf5d;
}
table.button.success:hover table a {
  border: 0 solid #23bf5d;
}

table.button.alert table td {
  background: #ec5840;
  border: 0px solid #ec5840;
}
table.button.alert table a {
  border: 0 solid #ec5840;
}

table.button.alert:hover table td {
  background: #e23317;
}
table.button.alert:hover table a {
  border: 0 solid #e23317;
}

table.button.warning table td {
  background: #ffae00;
  border: 0px solid #ffae00;
}
table.button.warning table a {
  border: 0px solid #ffae00;
}

table.button.warning:hover table td {
  background: #cc8b00;
}
table.button.warning:hover table a {
  border: 0px solid #cc8b00;
}

table.callout {
  margin-bottom: 16px;
  Margin-bottom: 16px;
}

th.callout-inner {
  width: 100%;
  border: 1px solid #cbcbcb;
  padding: 10px;
  background: #fefefe;
}
th.callout-inner.primary {
  background: #def0fc;
  border: 1px solid #444444;
  color: #0a0a0a;
}
th.callout-inner.secondary {
  background: #ebebeb;
  border: 1px solid #444444;
  color: #0a0a0a;
}
th.callout-inner.success {
  background: #e1faea;
  border: 1px solid #1b9448;
  color: #fefefe;
}
th.callout-inner.warning {
  background: #fff3d9;
  border: 1px solid #996800;
  color: #fefefe;
}
th.callout-inner.alert {
  background: #fce6e2;
  border: 1px solid #b42912;
  color: #fefefe;
}

.thumbnail {
  border: solid 4px #fefefe;
  box-shadow: 0 0 0 1px rgba(10, 10, 10, 0.2);
  display: inline-block;
  line-height: 0;
  max-width: 100%;
  transition: box-shadow 200ms ease-out;
  border-radius: 3px;
  margin-bottom: 16px;
}
.thumbnail:hover, .thumbnail:focus {
  box-shadow: 0 0 6px 1px rgba(33, 153, 232, 0.5);
}

body.outlook p {
  display: inline !important;
}

@media only screen and (max-width: 596px) {
  table.body img {
    width: auto;
    height: auto;
  }

  table.body center {
    min-width: 0 !important;
  }

  table.body .container {
    width: 95% !important;
  }

  table.body .columns,
  table.body .column {
    height: auto !important;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  table.body .columns .column,
  table.body .columns .columns,
  table.body .column .column,
  table.body .column .columns {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  table.body .collapse .columns, table.body .collapse .column {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  td.small-1,
  th.small-1 {
    display: inline-block !important;
    width: 8.333333% !important;
  }

  td.small-2,
  th.small-2 {
    display: inline-block !important;
    width: 16.666666% !important;
  }

  td.small-3,
  th.small-3 {
    display: inline-block !important;
    width: 25% !important;
  }

  td.small-4,
  th.small-4 {
    display: inline-block !important;
    width: 33.333333% !important;
  }

  td.small-5,
  th.small-5 {
    display: inline-block !important;
    width: 41.666666% !important;
  }

  td.small-6,
  th.small-6 {
    display: inline-block !important;
    width: 50% !important;
  }

  td.small-7,
  th.small-7 {
    display: inline-block !important;
    width: 58.333333% !important;
  }

  td.small-8,
  th.small-8 {
    display: inline-block !important;
    width: 66.666666% !important;
  }

  td.small-9,
  th.small-9 {
    display: inline-block !important;
    width: 75% !important;
  }

  td.small-10,
  th.small-10 {
    display: inline-block !important;
    width: 83.333333% !important;
  }

  td.small-11,
  th.small-11 {
    display: inline-block !important;
    width: 91.666666% !important;
  }

  td.small-12,
  th.small-12 {
    display: inline-block !important;
    width: 100% !important;
  }

  .columns td.small-12,
  .column td.small-12,
  .columns th.small-12,
  .column th.small-12 {
    display: block !important;
    width: 100% !important;
  }

  table.body td.small-offset-1,
  table.body th.small-offset-1 {
    margin-left: 8.333333% !important;
    Margin-left: 8.333333% !important;
  }

  table.body td.small-offset-2,
  table.body th.small-offset-2 {
    margin-left: 16.666666% !important;
    Margin-left: 16.666666% !important;
  }

  table.body td.small-offset-3,
  table.body th.small-offset-3 {
    margin-left: 25% !important;
    Margin-left: 25% !important;
  }

  table.body td.small-offset-4,
  table.body th.small-offset-4 {
    margin-left: 33.333333% !important;
    Margin-left: 33.333333% !important;
  }

  table.body td.small-offset-5,
  table.body th.small-offset-5 {
    margin-left: 41.666666% !important;
    Margin-left: 41.666666% !important;
  }

  table.body td.small-offset-6,
  table.body th.small-offset-6 {
    margin-left: 50% !important;
    Margin-left: 50% !important;
  }

  table.body td.small-offset-7,
  table.body th.small-offset-7 {
    margin-left: 58.333333% !important;
    Margin-left: 58.333333% !important;
  }

  table.body td.small-offset-8,
  table.body th.small-offset-8 {
    margin-left: 66.666666% !important;
    Margin-left: 66.666666% !important;
  }

  table.body td.small-offset-9,
  table.body th.small-offset-9 {
    margin-left: 75% !important;
    Margin-left: 75% !important;
  }

  table.body td.small-offset-10,
  table.body th.small-offset-10 {
    margin-left: 83.333333% !important;
    Margin-left: 83.333333% !important;
  }

  table.body td.small-offset-11,
  table.body th.small-offset-11 {
    margin-left: 91.666666% !important;
    Margin-left: 91.666666% !important;
  }

  table.body table.columns td.expander,
  table.body table.columns th.expander {
    display: none !important;
  }

  table.body .right-text-pad,
  table.body .text-pad-right {
    padding-left: 10px !important;
  }

  table.body .left-text-pad,
  table.body .text-pad-left {
    padding-right: 10px !important;
  }

  table.menu {
    width: 100% !important;
  }
  table.menu td,
  table.menu th {
    width: auto !important;
    display: inline-block !important;
  }
  table.menu.vertical td,
  table.menu.vertical th, table.menu.small-vertical td,
  table.menu.small-vertical th {
    display: block !important;
  }

  table.menu[align=""center""] {
    width: auto !important;
  }

    table.button.small-expand,
  table.button.small-expanded {
    width: 100% !important;
  }
table.button.small-expand table,
table.button.small-expanded table
{
    width: 100%;
}
table.button.small-expand table a,
  table.button.small-expanded table a {
    text-align: center !important;
    width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  table.button.small-expand center,
  table.button.small-expanded center
{
    min-width: 0;
}
}
.footer h5
{
    text-align: center;
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
}
.footer h5 a {
  color: #333 !important;
  font-weight: bold;
}

.footer p
{
    text-align: center;
    margin-bottom: 0px;
    font-size: 11px;
    color: #999;
}
.footer p a {
  color: #999;
  font-weight: bold;
}
.product-name {
    font-weight: bold;
}
.red-text {
    color: #e60000;
}
  .dl-horizontal dt {
    float: left;
    width: 160px;
    clear: left;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dl-horizontal dd {
    margin-left: 180px;
  }
    .padding-left-5 {
        padding-left: 5px;
    }
	p {
	    margin-top: 4px;
	    margin-bottom: 12px !important;
	}
	hr {
	margin-bottom: 2px;
	}
";

        public static readonly string FoundationEmailCSSNew = @".blue-white {
  background-color: #0c5aa2;
  color: white;
  padding-top: 15px; }

.blue-white * {
  color: white; }

.center-text {
  text-align: center; }

span.center-text {
  display: block !important;
  text-align: center !important; }

.large-text {
  overflow-wrap: normal;
  font-size: 125%;
  letter-spacing: 1px; }

.uppercase {
  text-transform: uppercase; }

.no-wrap {
  white-space: nowrap; }

.r-arrow {
  display: inline-block;
  font-size: 95%; }

.r-arrow.small {
  font-size: 80%;
  position: relative;
  padding-right: 15px; }

.padding-bottom-5 {
  padding-bottom: 5px; }

.small {
  font-size: 90%; }

.note {
  font-style: italic;
  font-weight: lighter; }

@media only screen and (max-width: 510px) {
  .large-text {
    font-size: 120%; } }

a {
  text-align: center !important; }

.heading,
.heading * {
  font-weight: bold !important;
  font-size: 18px !important; }

.text-bold {
  font-weight: bold !important; }

body {
  width: 100% !important;
  min-width: 100%;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  margin: 0;
  Margin: 0;
  padding: 0;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box; }

img {
  outline: none;
  text-decoration: none;
  -ms-interpolation-mode: bicubic;
  width: auto;
  max-width: 100%;
  clear: both;
  display: block; }

center {
  width: 100%;
  min-width: 720px; }

table {
  border-spacing: 0;
  border-collapse: collapse; }

td, th {
  word-wrap: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  hyphens: auto;
  border-collapse: collapse !important; }

table, tr, td, th {
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 0;
  padding-left: 0;
  vertical-align: top;
  text-align: left; }

@media only screen {
  html {
    min-height: 100%;
    background: #f3f3f3; } }

table.body {
  background: #f3f3f3;
  height: 100%;
  width: 100%; }

table.container {
  background: #fefefe;
  width: 720px;
  margin: 0 auto;
  Margin: 0 auto;
  text-align: inherit; }

table.row {
  padding: 0;
  width: 100%;
  position: relative; }

table.spacer {
  width: 100%; }
  table.spacer td {
    mso-line-height-rule: exactly; }

table.container table.row {
  display: table; }

th.columns {
  margin: 0 auto;
  Margin: 0 auto;
  padding-left: 16px;
  padding-bottom: 15px; }
  th.columns .columns.first {
    padding-left: 0 !important; }
  th.columns .columns.last {
    padding-right: 0 !important; }

th.columns.last {
  padding-right: 16px; }

th.columns table {
  width: 100%; }

th.large-1 {
  width: 44px;
  padding-left: 8px;
  padding-right: 8px; }

th.large-1.first {
  padding-left: 16px; }

.body .columns th.large-1 {
  width: 8.33333%; }

th.large-2 {
  width: 104px;
  padding-left: 8px;
  padding-right: 8px; }

.body .columns th.large-2 {
  width: 16.66667%; }

th.large-3 {
  width: 164px;
  padding-left: 8px;
  padding-right: 8px; }

th.large-3.first {
  padding-left: 16px; }

th.large-6 {
  width: 344px;
  padding-left: 8px;
  padding-right: 8px; }

th.large-6.first {
  padding-left: 16px; }

th.large-6.last {
  padding-right: 16px; }

th.large-9 {
  width: 524px;
  padding-left: 8px;
  padding-right: 8px; }

th.large-9.last {
  padding-right: 16px; }

.body .columns th.large-9 {
  width: 75%; }

th.large-12 {
  width: 704px;
  padding-left: 8px;
  padding-right: 8px; }

th.large-12.first {
  padding-left: 16px; }

th.large-12.last {
  padding-right: 16px; }

.collapse > tbody > tr > th.large-12 {
  padding-right: 0;
  padding-left: 0;
  width: 720px; }

.collapse th.large-12.first,
.collapse th.large-12.last {
  width: 728px; }

th.large-12 center {
  min-width: 672px; }

th.expander {
  visibility: hidden;
  width: 0;
  padding: 0 !important; }

p.text-center {
  text-align: center; }

p.text-left {
  text-align: left; }

th.text-right,
p.text-right {
  text-align: right; }

table.float-center {
  margin: 0 auto;
  Margin: 0 auto;
  float: none;
  text-align: center; }

body,
table.body,
p,
td,
th {
  color: #0a0a0a;
  font-family: ""Source Sans Pro"", Helvetica, Arial, sans-serif;
  font-weight: normal;
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 0;
  padding-left: 0;
  margin: 0;
  Margin: 0;
  text-align: left;
  line-height: 1.3; }

    body,
table.body,
p,
td,
th {
  font-size: 14px;
  line-height: 1.3; }

p
{
    margin - bottom: 0;
    Margin - bottom: 0;
}

a
{
    color: #2199e8;
  text - decoration: none;
    font - family: ""Source Sans Pro"", ""Lato"", Helvetica, Arial, sans - serif;
    font - weight: normal;
    padding: 0;
    text - align: left;
    line - height: 1.3;
}
a: hover {
    color: #147dc2; }
  a: active {
        color: #147dc2; }
  a: visited {
            color: #2199e8; }

span.preheader {
                display: none!important;
                visibility: hidden;
                mso - hide: all!important;
                font - size: 1px;
                color: #f3f3f3;
  line - height: 1px;
                max - height: 0px;
                max - width: 0px;
                opacity: 0;
                overflow: hidden;
            }

            @media only screen and(max-width: 736px) {
                table.body img {
                    width: auto;
                    height: auto;
                }
                table.body center {
                    min - width: 0!important;
                }
                table.body.container {
                    width: 95 % !important;
                }
                table.body.columns {
                    height: auto!important;
                    -moz - box - sizing: border - box;
                    -webkit - box - sizing: border - box;
                    box - sizing: border - box;
                    padding - left: 16px!important;
                    padding - right: 16px!important;
                }
                table.body.columns.columns {
                    padding - left: 0!important;
                    padding - right: 0!important;
                }
                table.body.collapse.columns {
                    padding - left: 0!important;
                    padding - right: 0!important;
                }
                th.small - 1 {
                    display: inline - block!important;
                    width: 8.33333 % !important;
                }
                th.small - 3 {
                    display: inline - block!important;
                    width: 25 % !important;
                }
                th.small - 6 {
                    display: inline - block!important;
                    width: 50 % !important;
                }
                th.small - 8 {
                    display: inline - block!important;
                    width: 66.66667 % !important;
                }
                th.small - 12 {
                    display: inline - block!important;
                    width: 100 % !important;
                }
            }

            body,
html,
.body {
                background: #f3f3f3 !important; }
";

        #endregion
            }

    // With great thanks: https://stackoverflow.com/questions/9062235/get-properties-in-order-of-declaration-using-reflection#answer-17998371
    [AttributeUsage(AttributeTargets.Property, Inherited = false, AllowMultiple = false)]
    public sealed class OrderedPropertyAttribute : Attribute
    {
        private readonly int order_;
        public OrderedPropertyAttribute([CallerLineNumber]int order = 0)
        {
            order_ = order;
        }

        public int Order { get { return order_; } }
    }

    public static class TimeSpanExtensions
    {
        public static int GetYears(this TimeSpan timespan)
        {
            return (int)(timespan.Days / 365.2425);
        }
        public static int GetMonths(this TimeSpan timespan)
        {
            return (int)(timespan.Days / 30.436875);
        }
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