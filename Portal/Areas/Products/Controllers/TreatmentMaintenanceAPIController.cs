using System.Linq;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Maintenance;
using System.Web.Http;
using System;
using SharedEFClasses.Models.Products;
using System.Web.Http.ModelBinding;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;

namespace Portal.Areas.Products.Controllers
{
    [System.Web.Http.Authorize]
    public partial class ProductMaintenanceAPIController : ApiController
    {
        [HttpGet]
        public DataSourceResult GetTreatmentProviders([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request, bool includeEU = true)
        {
            var results = PortalDb.TreatmentProviders.OrderBy(p => p.SortOrder).ToList();

            return results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpPost]
        public IHttpActionResult FabricQualityAutocomplete([FromBody] MertexerV2SQL.Models.Misc.PassAutocompleteTerm objTerm)
        {
            var results = PortalDb.FabricQualityAutocomplete(objTerm);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchExistingQualityTreatments([FromBody]PassQualityID objQualityId)
        {
            var results = PortalDb.FetchExistingTreatments(objQualityId);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult SaveQualityTreatmentProviders([FromBody]PassQualityTreatmentProviderSave objSave)
        {
            var results = PortalDb.SaveQualityTreatmentProviders(objSave);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult TreatmentProductCodeAutocomplete([FromBody]PassGenericAutocomplete objTerm)
        {
            var results = PortalDb.Products.Where(p => p.Code.StartsWith("BAC") &&
                (p.Code.Contains(objTerm.searchTerm) ||
                 p.Name.Contains(objTerm.searchTerm))).ToList();

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult TreatmentAutocomplete([FromBody]PassTreatmentAutocomplete objTerm)
        {
            var results = PortalDb.Treatments.Where(p =>
                p.Deleted == false &&
                (
                    objTerm.TreatmentID == p.TreatmentID ||
                    objTerm.searchTerm == null ||
                    (
                        objTerm.searchTerm != null &&
                        (
                            p.TreatmentType.Name.Contains(objTerm.searchTerm) ||
                            p.Name.Contains(objTerm.searchTerm) ||
                            p.Description.StartsWith(objTerm.searchTerm)
                        )
                    )
                )
            )
            .OrderBy(p => p.TreatmentProvider.Name)
            .ThenBy(p => p.TreatmentType.Name)
            .ThenBy(p => p.Name).ToList();

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult SortTreatmentsWithinType([FromBody]PassTreatmentTypeSort objTreatmentTypeSort)
        {
            objTreatmentTypeSort.TreatmentSortOrders.ForEach((t) =>
            {
                var treatmentRecord = PortalDb.Treatments.Where(p => p.TreatmentID == t.TreatmentID).Single();
                treatmentRecord.SortOrder = t.SortOrder;
            });

            PortalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult SaveTreatment([FromBody]PassTreatmentSave objSave)
        {
            Treatment treatmentSaveResult = null;

            var treatmentId = objSave.TreatmentID;

            if (objSave.TreatmentID.HasValue)
            {
                var treatmentRecord = PortalDb.Treatments.Where(p => p.TreatmentID == objSave.TreatmentID).Single();

                treatmentRecord.Name = objSave.Name;
                treatmentRecord.ProductFilterGroupID = objSave.ProductFilterGroupID;
                treatmentRecord.ProductID = objSave.ProductID;
                treatmentRecord.Description = treatmentRecord.Description ?? objSave.Description;

                treatmentRecord.Countries.Clear();

                PortalDb.SaveChanges();

                treatmentRecord.Countries.AddRange(objSave.CountryIDs.Select(c => new Treatment_Country()
                {
                    TreatmentID = treatmentRecord.TreatmentID,
                    CountryID = c
                }).ToArray());

                PortalDb.SaveChanges();

                treatmentSaveResult = treatmentRecord;
            } 
            else
            {
                var treatmentRecord = new Treatment()
                {
                    Name = objSave.Name,
                    SortOrder = objSave.SortOrder,
                    TreatmentTypeID = objSave.TreatmentTypeID,
                    ProductFilterGroupID = objSave.ProductFilterGroupID,
                    TreatmentProviderID = objSave.TreatmentProviderID,
                    ProductID = objSave.ProductID,
                    Description = objSave.Description,
                    CreatedDT = DateTime.Now
                };

                PortalDb.Treatments.Add(treatmentRecord);

                PortalDb.SaveChanges();

                treatmentRecord.Countries = objSave.CountryIDs.Select(c => new Treatment_Country()
                {
                    TreatmentID = treatmentRecord.TreatmentID,
                    CountryID = c
                }).ToArray();

                PortalDb.SaveChanges();

                treatmentSaveResult = treatmentRecord;
            }

            return Ok(treatmentSaveResult);
        }

        [HttpPost]
        public IHttpActionResult DeleteTreatment([FromBody]PassTreatmentID objTreatmentId)
        {
            var treatment = PortalDb.Treatments.Where(p => p.TreatmentID == objTreatmentId.TreatmentID).Single();

            treatment.DeletedDT = DateTime.Now;

            PortalDb.SaveChanges();

            return Ok(new { });
        }
    }
}
