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

namespace Portal.Areas.Email.ViewModels
{
    public class EmailContactsViewModel : BaseViewModel
    {
        public List<Country> Countries { get; set; }

        public List<Market> Markets { get; set; }

        public List<PriceList> PriceLists { get; set; }

        public List<DotDigitalAccount> DotDigitalAccounts { get; set; }

        private EmailContactsViewModel(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading) : base(properties, applicationHeading, applicationSubHeading)
        {

        }

        public static async Task<EmailContactsViewModel> CreateAsync(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new EmailContactsViewModel(properties, applicationHeading, applicationSubHeading);

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
        }
    }
}