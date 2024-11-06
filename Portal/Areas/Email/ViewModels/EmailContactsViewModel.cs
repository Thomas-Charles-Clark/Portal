using Portal.Areas.Fenwick.ViewModels;
using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Diagnostics.Contracts;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.TradeAccounts;
using System.Data.Entity;
using SharedEFClasses.Models.DotDigital;
using Kendo.Mvc.UI.Html;

namespace Portal.Areas.Email.ViewModels
{
    public class EmailContactsViewModel : BaseViewModel
    {
        public string DefaultOperatorCode { get; set; }

        public List<Country> Countries { get; set; }

        public List<Market> Markets { get; set; }

        public List<PriceList> PriceLists { get; set; }

        public List<DotDigitalAccount> DotDigitalAccounts { get; set; }

        public List<Source> Sources { get; set; }

        private EmailContactsViewModel(
            string defaultOperatorCode,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading) : base(properties, applicationHeading, applicationSubHeading)
        {
            DefaultOperatorCode = defaultOperatorCode;
        }

        public static async Task<EmailContactsViewModel> CreateAsync(
            string defaultOperatorCode,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new EmailContactsViewModel(defaultOperatorCode, properties, applicationHeading, applicationSubHeading);

            await result.Initialise();

            return result;
        }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
        protected async Task Initialise()
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
        {
            var db = new SharedEFClasses.Models.PortalDbContext();            
            
            Countries = db.Countries.Where(c => c.IsCountry && c.DeletedDT == null).ToList();
            
            Markets = db.Markets.ToList();
            
            PriceLists = db.PriceLists.ToList();

            DotDigitalAccounts = db.DotDigitalAccounts.ToList();

            var allowedSourceIds = new byte[] 
            {
                74,  // Join Mailing List - (Portal - eCommerce)
                201, // Join Mailing List - (Retail - Other)
                204, // Join Mailing List - (Warehouse Sale)
                205, // Join Mailing List - (Retail - Paris Showroom)
                206, // Join Mailing List - (Retail - New York Showroom)
                208, // Join Mailing List - (Retail - Munich Paint Shop)
                209, // Join Mailing List - (Retail - Kings Road)
                210  // Join Mailing List - (Retail - Marylebone)
            };

            var sources = db.Sources.ToList();

            Sources = sources.Where(s => allowedSourceIds.Contains(s.SourceID)).ToList();
        }
    }
}