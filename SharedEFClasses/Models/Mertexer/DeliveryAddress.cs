using Newtonsoft.Json;

using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [UniVerseFileName("DELADD")]
    public class DeliveryAddress : UniVerseSerializationBase<string>
    {
        [JsonConstructor]
        public DeliveryAddress(string key) : base(key)
        {
            Initialise();
        }

        public DeliveryAddress() : base()
        {
            Initialise();
        }

        public override void Initialise()
        {
            typeof(DeliveryAddress).GetProperties().ToList().ForEach(p => Framework.InitialiseUniProperty(this, p));
        }
        
        public string Label
        {
            get
            {
                var lines = new List<string>()
                {
                    ContactName,
                    CompanyName,
                    AddressLine1,
                    AddressLine2,
                    Town,
                    County,
                    Postcode
                }.ToList();

                lines.RemoveAll(c => String.IsNullOrEmpty(c));

                var displayLine = String.Join(", ", lines);

                return $"{Key} - {displayLine}";
            }
        }
        public string DeliveryReference { get; set; }

        public short? CountryID { get; set; }

        public string CountryName { get; set; }

        public bool EU { get; set; }

        public string MD5Hash
        {
            get
            {
                string result = null;

                using (var md5 = System.Security.Cryptography.MD5.Create())
                {
                    addString(md5, String.IsNullOrEmpty(TradeAccountCode) ? "|" : $"{TradeAccountCode}|");
                    addString(md5, String.IsNullOrEmpty(AddressLine1) ? "|" : $"{AddressLine1}|");
                    addString(md5, String.IsNullOrEmpty(AddressLine1) ? "|" : $"{AddressLine1}|");
                    addString(md5, String.IsNullOrEmpty(Town) ? "|" : $"{Town}|");
                    addString(md5, String.IsNullOrEmpty(County) ? "|" : $"{County}|");
                    addString(md5, String.IsNullOrEmpty(Postcode) ? "|" : $"{Postcode}|");
                    addString(md5, $"{CountryCode}");

                    md5.TransformFinalBlock(new byte[0], 0, 0);

                    var sb = new System.Text.StringBuilder();

                    foreach (var b in md5.Hash)
                    {
                        sb.Append(b.ToString("x2"));
                    }

                    result = sb.ToString();
                }

                return result;
            }
        }

        void addString(System.Security.Cryptography.ICryptoTransform transform, string inputString)
        {
            var buff = System.Text.Encoding.UTF8.GetBytes(inputString);
            transform.TransformBlock(buff, 0, buff.Length, buff, 0);
        }

        /// <summary>
        /// Company Name
        /// </summary>
        [UniVerseIndex(2, 1)]
        [UniVerseFieldName("DELNAME")]
        public string CompanyName { get; set; }

        /// <summary>
        /// Address Line 1
        /// </summary>
        [UniVerseIndex(2, 2)]
        [UniVerseFieldName("DELADDR1")]
        public string AddressLine1 { get; set; }

        /// <summary>
        /// Address Line 2
        /// </summary>
        [UniVerseIndex(2, 3)]
        [UniVerseFieldName("DELADDR2")]
        public string AddressLine2 { get; set; }

        /// <summary>
        /// Town
        /// </summary>
        [UniVerseIndex(2, 4)]
        [UniVerseFieldName("DELADDR3")]
        public string Town { get; set; }

        /// <summary>
        /// County
        /// </summary>
        [UniVerseIndex(2, 5)]
        [UniVerseFieldName("DELADDR4")]
        public string County { get; set; }

        /// <summary>
        /// Postcode
        /// </summary>
        [UniVerseIndex(2, 6)]
        [UniVerseFieldName("DELPCODE")]
        public string Postcode { get; set; }

        /// <summary>
        /// Domestic or Trade Destination Indicator
        /// </summary>
        [UniVerseIndex(2, 8)]
        public string DomesticOrTrade { get; set; }

        /// <summary>
        /// Trade Account Code
        /// </summary>
        [UniVerseIndex(3)]
        [UniVerseFieldName("CUSREF")]
        public string TradeAccountCode { get; set; }

        /// <summary>
        /// Delivery Phone
        /// </summary>
        [UniVerseIndex(7)]
        [UniVerseFieldName("PHONE")]
        public string PhoneNumber { get; set; }

        /// <summary>
        /// Country
        /// </summary>
        [UniVerseIndex(19)]
        [UniVerseFieldName("COUNTRY")]
        public string CountryCode { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        [UniVerseIndex(21)]
        [UniVerseFieldName("E.MAIL")]
        public string Email { get; set; }

        /// <summary>
        /// Haulier
        /// </summary>
        [UniVerseIndex(30)]
        [UniVerseFieldName("HAULIER")]
        public string HaulierCode { get; set; }

        /// <summary>
        /// Carriage
        /// </summary>
        [UniVerseIndex(31)]
        [UniVerseFieldName("SERVICE")]
        public string CarriageCode { get; set; }

        /// <summary>
        /// US County
        /// </summary>
        [UniVerseIndex(87)]
        [UniVerseFieldName("TAX.EXEMPT.CERT")]
        public string USTaxExemptionCertificate { get; set; }

        /// <summary>
        /// US State
        /// </summary>
        [UniVerseIndex(88)]
        [UniVerseFieldName("US.STATE.CODE")]
        public string USStateCode { get; set; }

        /// <summary>
        /// US County
        /// </summary>
        [UniVerseIndex(89)]
        [UniVerseFieldName("US.STATE.COUNTY")]
        public string USCountyCode { get; set; }

        /// <summary>
        /// Contact Name
        /// </summary>
        [UniVerseIndex(262)]
        [UniVerseFieldName("CONTACT")]
        public string ContactName { get; set; }

        public DateTime? LastConfirmedDT { get; set; }

        public string NotUsed
        {
            get
            {
                return null;
            }
        }

        public string PipeDelimitedDeliveryString
        {
            get
            {
                return $"{CompanyName}|{AddressLine1}|{AddressLine2}|{Town}|{County}|{Postcode}|{PhoneNumber}|{DomesticOrTrade}|{CountryCode}|Y|{USStateCode}|{USCountyCode}";
            }
        }

        public string type
        {
            get
            {
                return "Mertex";
            }
        }

        public int DeliveryReferenceID
        {
            get
            {
                var delRef = System.Text.RegularExpressions.Regex.Replace(Key?.Replace($"{TradeAccountCode}-", "") ?? "", "[^0-9\\-]*", "");

                if (delRef.Length >= 3)
                {
                    delRef = System.Text.RegularExpressions.Regex.Replace(delRef.Split(new char[] { '-' })[0], "[^0-9]*", "");
                }

                if (String.IsNullOrWhiteSpace(delRef))
                {
                    delRef = "0";
                }

                return Convert.ToInt32(delRef);
            }
        }

        // This will only be true if the user has selected the Default Delivery Address and HASN'T changed it.
        public bool IsDefaultDeliveryAddress { get; set; }

        public DeliveryAddress(
            string tradeAccountCode,
            string addressLine1,
            string addressLine2,
            string town,
            string county,
            string postcode,
            string countryCode,
            string contactName = null,
            string companyName = null,
            string phoneNumber = null,
            string email = null,
            string deliveryReference = null,
            string domesticOrTrade = null,
            string haulierCode = null,
            string carriageCode = null,
            string usStateCode = null,
            string usCountyCode = null,
            string usTaxExemptionCertificateReference = null,
            string lastConfirmedDt = null,
            short? countryId = null,
            bool isDefaultDeliveryAddress = false) : base(deliveryReference)
        {
            TradeAccountCode = tradeAccountCode;
            AddressLine1 = addressLine1;
            AddressLine2 = addressLine2;
            Town = town;
            County = county;
            Postcode = postcode;
            CountryCode = countryCode;
            DomesticOrTrade = domesticOrTrade;
            ContactName = contactName;
            CompanyName = companyName;
            PhoneNumber = phoneNumber;
            Email = email;
            HaulierCode = haulierCode;
            CarriageCode = carriageCode;
            USStateCode = usStateCode;
            USCountyCode = usCountyCode;
            USTaxExemptionCertificate = usTaxExemptionCertificateReference;
            CountryID = countryId;
            DeliveryReference = deliveryReference;
            IsDefaultDeliveryAddress = isDefaultDeliveryAddress;

            if (!String.IsNullOrEmpty(lastConfirmedDt))
            {
                var ci = System.Threading.Thread.CurrentThread.CurrentCulture;

                if (DateTime.TryParseExact(lastConfirmedDt, "dd/MM/yyyy", ci, System.Globalization.DateTimeStyles.None, out DateTime dt))
                {
                    LastConfirmedDT = dt;
                }
            }
        }

        public DeliveryAddress(string deliveryReference, DeliveryAddress that) : base(deliveryReference)
        {
            this.AddressLine1 = that.AddressLine1;
            this.AddressLine2 = that.AddressLine2;
            this.Town = that.Town;
            this.County = that.County;
            this.Postcode = that.Postcode;
            this.CountryCode = that.CountryCode;
            this.HaulierCode = that.HaulierCode;
            this.CarriageCode = that.CarriageCode;
            this.CompanyName = that.CompanyName;
            this.ContactName = that.ContactName;
            this.LastConfirmedDT = that.LastConfirmedDT;
            this.PhoneNumber = that.PhoneNumber;
            this.Email = that.Email;
            this.CountryID = that.CountryID;
            this.DomesticOrTrade = that.DomesticOrTrade;
            this.TradeAccountCode = that.TradeAccountCode;
            this.USTaxExemptionCertificate = that.USTaxExemptionCertificate;
            this.USStateCode = that.USStateCode;
            this.USCountyCode = that.USCountyCode;
        }

        // This is legacy stuff for Reflex's ASPLINK routines to consume
        public string InsertWebData()
        {
            return $@"{TradeAccountCode}
{NotUsed}
{PipeDelimitedDeliveryString}
{Email}
{NotUsed}
{HaulierCode}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{CarriageCode}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{USTaxExemptionCertificate}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{ContactName}";
        }

        // This is legacy stuff for Reflex's ASPLINK routines to consume
        public string UpdateWebData()
        {
            return $@"{TradeAccountCode}
{Key}
{PipeDelimitedDeliveryString}
{Email}
{NotUsed}
{HaulierCode}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{CarriageCode}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{USTaxExemptionCertificate}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{NotUsed}
{ContactName}";
        }

        public string DeleteWebData()
        {
            return $@"{TradeAccountCode}
{Key}";
        }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }

        public string MertexAddressLine
        {
            get
            {
                return PipeDelimitedDeliveryString.Replace('|', (char)253);
                //return $"{CompanyName}{(char)253}{AddressLine1}{(char)253}{AddressLine2}{(char)253}{Town}{(char)253}{County}{(char)253}{Postcode}";
            }
        }
    }

    ///// <summary>
    ///// This was necessary because... wait, why was this necessary?
    ///// </summary>
    //public class DeliveryAddressSurrogate : DeliveryAddress
    //{
    //    public string DeliveryReference { get { return Key; } }

    //    public DeliveryAddressSurrogate(
    //        string Code,
    //        string CompanyName,
    //        string AddressLine1,
    //        string AddressLine2,
    //        string Town,
    //        string County,
    //        string Postcode,
    //        string DomesticOrTrade,
    //        string TradeAccountCode,
    //        string PhoneNumber,
    //        string CountryCode,
    //        string Email,
    //        string HaulierCode,
    //        string CarriageCode,
    //        string USTaxExemptionCertificate,
    //        string USStateCode,
    //        string USCountyCode
    //        ) : base(Code)
    //    {
    //        this.CompanyName = CompanyName;
    //        this.AddressLine1 = AddressLine1;
    //        this.AddressLine2 = AddressLine2;
    //        this.Town = Town;
    //        this.County = County;
    //        this.Postcode = Postcode;
    //        this.DomesticOrTrade = DomesticOrTrade;
    //        this.TradeAccountCode = TradeAccountCode;
    //        this.PhoneNumber = PhoneNumber;
    //        this.CountryCode = CountryCode;
    //        this.Email = Email;
    //        this.HaulierCode = HaulierCode;
    //        this.CarriageCode = CarriageCode;
    //        this.USTaxExemptionCertificate = USTaxExemptionCertificate;
    //        this.USStateCode = USStateCode;
    //        this.USCountyCode = USCountyCode;
    //    }
    //}
}
