using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portal.UPSShipping
{
    public class Address
    {
        /// <summary>
        /// Location Name
        /// </summary>
        public string LocationName { get; set; }

        /// <summary>
        /// The Company Name
        /// </summary>
        public string CompanyName { get; set; }

        /// <summary>
        /// The Human Name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 1st Line of Address
        /// </summary>
        public string AddressLine1 { get; set; }

        /// <summary>
        /// 2nd Line of Address
        /// </summary>
        public string AddressLine2 { get; set; }

        /// <summary>
        /// Town / City
        /// </summary>
        public string Town { get; set; }

        /// <summary>
        /// County
        /// </summary>
        public string County { get; set; }

        /// <summary>
        /// State or Province code - important for US and Canada, and probably Australia too
        /// </summary>
        public string StateProvinceCode { get; set; }

        /// <summary>
        /// Postal code
        /// </summary>
        public string Postcode { get; set; }

        /// <summary>
        /// Country Code ISO 3166-1 Alpha 2
        /// </summary>
        public string CountryCodeISOAlpha2 { get; set; }

        /// <summary>
        /// Tax ID
        /// </summary>
        public string TaxID { get; set; }

        /// <summary>
        /// CountryID: this is intended to be set / determined from CountryCode...
        /// </summary>
        public short? CountryID { get; set; }

        /// <summary>
        /// Contact Email
        /// </summary>
        public string Email { get; set; }
        
        /// <summary>
        /// Contact Phone
        /// </summary>
        public string Phone { get; set; }

        public bool Residential { get; set; }

        public bool Valid
        {
            get
            {
                return (!String.IsNullOrEmpty(CompanyName ?? Name)) 
                    && !String.IsNullOrEmpty(AddressLine1)
                    && !String.IsNullOrEmpty(CountryCodeISOAlpha2);
            }
        }
    }
}
