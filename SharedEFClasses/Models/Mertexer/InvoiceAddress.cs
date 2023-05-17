using Newtonsoft.Json;
using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [UniVerseFileName("SLCUST")]
    public class InvoiceAddress : UniVerseSerializationBase<string>
    {
        [JsonConstructor]
        public InvoiceAddress(string key) : base(key)
        {
            Initialise();
        }

        public InvoiceAddress() : base()
        {
            Initialise();
        }

        public override void Initialise()
        {
            typeof(InvoiceAddress).GetProperties().ToList().ForEach(p => Framework.InitialiseUniProperty(this, p));
            this.DeliveryReference = "C";
        }

        /// <summary>
        /// Invoice Address Line 1
        /// </summary>
        [UniVerseIndex(1, 2)]
        [UniVerseFieldName("CUSADD1X")]
        public string AddressLine1 { get; set; }

        /// <summary>
        /// Invoice Address Line 2
        /// </summary>
        [UniVerseIndex(1, 3)]
        [UniVerseFieldName("CUSADD2X")]
        public string AddressLine2 { get; set; }

        /// <summary>
        /// Invoice Address Town
        /// </summary>
        [UniVerseIndex(1, 4)]
        [UniVerseFieldName("CUSADD3X")]
        public string Town { get; set; }

        /// <summary>
        /// Invoice Address County
        /// </summary>
        [UniVerseIndex(1, 5)]
        [UniVerseFieldName("CUSADD4X")]
        public string County { get; set; }

        /// <summary>
        /// Invoice Address Postcode
        /// </summary>
        [UniVerseIndex(1, 6)]
        [UniVerseFieldName("CUSPCODE")]
        public string Postcode { get; set; }

        /// <summary>
        /// Invoice Address Country
        /// </summary>
        [UniVerseIndex(77)]
        [UniVerseFieldName("COUNTRY")]
        public string CountryCode { get; set; }


        // Intentionally not mapped to Mertex: Invoice Addresses necessarily do not have Delivery References.
        public string DeliveryReference { get; set; }

        public string CompanyName { get; set; }

        public string CountryName { get; set; }

        public short CountryID { get; set; }

        public bool EU { get; set; }

        public string Email { get; set; }

        public InvoiceAddress(string addressLine1,
            string addressLine2,
            string town,
            string county,
            string postcode,
            string countryCode)
        {
            AddressLine1 = addressLine1;
            AddressLine2 = addressLine2;
            Town = town;
            County = county;
            Postcode = postcode;
            CountryCode = countryCode;

            DeliveryReference = "C";
        }
    }
}
