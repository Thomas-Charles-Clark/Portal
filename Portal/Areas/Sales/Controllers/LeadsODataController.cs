using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.ModelBinding;
using Portal.Models;
using System.Web.Http;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Leads;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Query;

namespace Portal.Areas.Sales.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using Microsoft.AspNet.OData.Builder;
    using Microsoft.AspNet.OData.Extensions;
    using Portal.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Lead>("LeadsOData");
    builder.EntitySet<Channel>("Channels"); 
    builder.EntitySet<Country>("Countries"); 
    builder.EntitySet<Currency>("Currencies"); 
    builder.EntitySet<Language>("Languages"); 
    builder.EntitySet<LeadContact>("LeadContacts"); 
    builder.EntitySet<LeadSource>("LeadSources"); 
    builder.EntitySet<LeadMagnitude>("LeadMagnitudes"); 
    builder.EntitySet<Member>("Members"); 
    builder.EntitySet<LeadStatus>("LeadStatus"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All)]
    public class LeadsODataController : ODataController
    {
        private PortalDbContext db = new PortalDbContext();

        // GET: odata/LeadsOData
        [EnableQuery]
        public IQueryable<Lead> GetLeadsOData()
        {
            return db.Leads;
        }

        // GET: odata/LeadsOData(5)
        [EnableQuery]
        public SingleResult<Lead> GetLead([FromODataUri] long key)
        {
            return SingleResult.Create(db.Leads.Where(lead => lead.LeadID == key));
        }
        
        // GET: odata/LeadsOData(5)/Channel
        [EnableQuery]
        public SingleResult<Channel> GetChannel([FromODataUri] long key)
        {
            return SingleResult.Create(db.Leads.Where(m => m.LeadID == key).Select(m => m.Channel));
        }

        // GET: odata/LeadsOData(5)/Country
        [EnableQuery]
        public SingleResult<Country> GetCountry([FromODataUri] long key)
        {
            return SingleResult.Create(db.Leads.Where(m => m.LeadID == key).Select(m => m.Country));
        }

        // GET: odata/LeadsOData(5)/Currency
        [EnableQuery]
        public SingleResult<Currency> GetCurrency([FromODataUri] long key)
        {
            return SingleResult.Create(db.Leads.Where(m => m.LeadID == key).Select(m => m.Currency));
        }

        // GET: odata/LeadsOData(5)/Language
        [EnableQuery]
        public SingleResult<Language> GetLanguage([FromODataUri] long key)
        {
            return SingleResult.Create(db.Leads.Where(m => m.LeadID == key).Select(m => m.Language));
        }

        // GET: odata/LeadsOData(5)/LeadContact
        [EnableQuery]
        public SingleResult<LeadContact> GetLeadContact([FromODataUri] long key)
        {
            return SingleResult.Create(db.Leads.Where(m => m.LeadID == key).Select(m => m.LeadContact));
        }

        // GET: odata/LeadsOData(5)/LeadSource
        [EnableQuery]
        public SingleResult<LeadSource> GetLeadSource([FromODataUri] long key)
        {
            return SingleResult.Create(db.Leads.Where(m => m.LeadID == key).Select(m => m.LeadSource));
        }

        // GET: odata/LeadsOData(5)/Magnitude
        [EnableQuery]
        public SingleResult<LeadMagnitude> GetMagnitude([FromODataUri] long key)
        {
            return SingleResult.Create(db.Leads.Where(m => m.LeadID == key).Select(m => m.Magnitude));
        }

        // GET: odata/LeadsOData(5)/OwnerMember
        [EnableQuery]
        public SingleResult<Member> GetOwnerMember([FromODataUri] long key)
        {
            return SingleResult.Create(db.Leads.Where(m => m.LeadID == key).Select(m => m.OwnerMember));
        }

        // GET: odata/LeadsOData(5)/SecondaryContacts
        [EnableQuery]
        public IQueryable<LeadContact> GetSecondaryContacts([FromODataUri] long key)
        {
            return db.Leads.Where(m => m.LeadID == key).SelectMany(m => m.SecondaryContacts);
        }

        // GET: odata/LeadsOData(5)/SourceMember
        [EnableQuery]
        public SingleResult<Member> GetSourceMember([FromODataUri] long key)
        {
            return SingleResult.Create(db.Leads.Where(m => m.LeadID == key).Select(m => m.SourceMember));
        }

        // GET: odata/LeadsOData(5)/Status
        [EnableQuery]
        public SingleResult<LeadStatus> GetStatus([FromODataUri] long key)
        {
            return SingleResult.Create(db.Leads.Where(m => m.LeadID == key).Select(m => m.Status));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool LeadExists(long key)
        {
            return db.Leads.Count(e => e.LeadID == key) > 0;
        }
    }
}
