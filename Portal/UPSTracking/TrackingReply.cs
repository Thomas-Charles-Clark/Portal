using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackNS = Portal.Track;

namespace Portal.UPSTracking
{
    public class TrackingReply
    {
        public TrackNS.TrackResponse Response { get; set; }
        public string ErrorDetails { get; set; }

        public string ResponseString
        {
            get
            {
                return JsonConvert.SerializeObject(Response, Formatting.Indented);
            }
        }

        private System.Globalization.CultureInfo ci
        {
            get
            {
                return System.Threading.Thread.CurrentThread.CurrentCulture;
            }
        }

        public DateTime? Date
        {
            get
            {
                if (Response != null)
                {
                    if (Response.Shipment.Any())
                    {
                        if (Response.Shipment[0].Package.Any())
                        {
                            if (Response.Shipment[0].Package[0].Activity.Any())
                            {
                                var d = DateTime.MinValue;

                                if (DateTime.TryParseExact(Response.Shipment[0].Package[0].Activity[0].Date, "yyyyMMdd", ci, System.Globalization.DateTimeStyles.None, out d))
                                {
                                    return d;
                                }
                            }
                        }
                    }
                }

                return null;
            }
        }

        public TimeSpan? Time
        {
            get
            {
                var t = TimeSpan.MinValue;

                if (Response != null)
                {
                    if (Response.Shipment.Any())
                    {
                        if (Response.Shipment[0].Package.Any())
                        {
                            if (Response.Shipment[0].Package[0].Activity.Any())
                            {
                                if (TimeSpan.TryParseExact(Response.Shipment[0].Package[0].Activity[0].Time, "hhmmss", ci.DateTimeFormat, System.Globalization.TimeSpanStyles.None, out t))
                                {
                                    return t;
                                }
                            }
                        }
                    }
                }

                return null;
            }
        }

        public string ServiceCode
        {
            get
            {
                if (Response != null)
                {
                    if (Response.Shipment.Any())
                    {
                        return Response.Shipment[0].Service?.Code;
                    }
                }

                return null;
            }
        }

        public string ServiceDescription
        {
            get
            {
                if (Response != null)
                {
                    if (Response.Shipment.Any())
                    {
                        return Response.Shipment[0].Service?.Description;
                    }
                }

                return null;
            }
        }

        public string StatusCode
        {
            get
            {
                if (Response != null)
                {
                    if (Response.Shipment.Any())
                    {
                        if (Response.Shipment[0].Package.Any())
                        {
                            if (Response.Shipment[0].Package[0].Activity.Any())
                            {
                                return Response.Shipment[0].Package[0].Activity[0].Status.Code;
                            }
                        }
                    }
                }

                return null;
            }
        }

        public string StatusDescription
        {
            get
            {
                if (Response != null)
                {
                    if (Response.Shipment.Any())
                    {
                        if (Response.Shipment[0].Package.Any())
                        {
                            if (Response.Shipment[0].Package[0].Activity.Any())
                            {
                                return Response.Shipment[0].Package[0].Activity[0].Status.Description;
                            }
                        }
                    }
                }

                return null;
            }
        }

        public string LocationPostalCode
        {
            get
            {
                if (Response != null)
                {
                    if (Response.Shipment.Any())
                    {
                        if (Response.Shipment[0].Package.Any())
                        {
                            if (Response.Shipment[0].Package[0].Activity.Any())
                            {
                                return Response.Shipment[0].Package[0].Activity[0].ActivityLocation?.Address?.PostalCode;
                            }
                        }
                    }
                }

                return null;
            }
        }

        public string LocationCountryCode
        {
            get
            {
                if (Response != null)
                {
                    if (Response.Shipment.Any())
                    {
                        if (Response.Shipment[0].Package.Any())
                        {
                            if (Response.Shipment[0].Package[0].Activity.Any())
                            {
                                return Response.Shipment[0].Package[0].Activity[0].ActivityLocation?.Address?.CountryCode;
                            }
                        }
                    }
                }

                return null;
            }
        }

        public string LocationDescription
        {
            get
            {
                if (Response != null)
                {
                    if (Response.Shipment.Any())
                    {
                        if (Response.Shipment[0].Package.Any())
                        {
                            if (Response.Shipment[0].Package[0].Activity.Any())
                            {
                                return Response.Shipment[0].Package[0].Activity[0].ActivityLocation?.Description;
                            }
                        }
                    }
                }

                return null;
            }
        }

        public string SignedForBy
        {
            get
            {
                if (Response != null)
                {
                    if (Response.Shipment.Any())
                    {
                        if (Response.Shipment[0].Package.Any())
                        {
                            if (Response.Shipment[0].Package[0].Activity.Any())
                            {
                                return Response.Shipment[0].Package[0].Activity[0].ActivityLocation?.SignedForByName;
                            }
                        }
                    }
                }

                return null;
            }
        }
    }
}
