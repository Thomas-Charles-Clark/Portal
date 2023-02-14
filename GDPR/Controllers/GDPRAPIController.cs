using GDPR.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GDPR.Controllers
{
    [Authorize]
    public class GDPRAPIController : ApiController
    {

        private GDPRDbContext dbContext { get; set; }

        public GDPRAPIController(GDPRDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IHttpActionResult GetDepartments()
        {
            return Json(dbContext.Departments.OrderBy(p => p.Name).ToList());
        }

        [HttpGet]
        public IHttpActionResult GetDataCategories()
        {
            return Json(dbContext.DataCategories.OrderBy(p => p.Name).ToList());
        }

        [HttpGet]
        public IHttpActionResult GetPreviouslySubmittedData([FromUri]byte departmentId)
        {
            var attendees = dbContext.Departments.Where(p => p.DepartmentID == departmentId).Select(p => p.Attendees).SingleOrDefault();

            var partners = dbContext.Suppliers.Where(p => p.CreatedByDepartmentID == departmentId).OrderBy(p => p.Name).ToList();

            var dataCategories_IndividualCategories = dbContext.DataCategory_IndividualCategories.Where(p => p.DepartmentID == departmentId).ToList();

            var dataCategories_DataStores = dbContext.DataCategory_DataStores.Where(p => p.DepartmentID == departmentId).ToList();

            var dataCategories_DataSources = dbContext.DataCategory_DataSources.Where(p => p.DepartmentID == departmentId).ToList();

            var dataCategories_Suppliers_DataTransmissionMethods = dbContext.DataCategory_Supplier_DataTransmissionMethods.Where(p => p.DepartmentID == departmentId).ToList();
            
            return Json(new {
                Attendees = attendees,
                DataCategories_IndividualCategories = dataCategories_IndividualCategories,
                DataCategories_DataStores = dataCategories_DataStores,
                DataCategories_DataSources = dataCategories_DataSources,
                DataCategories_Suppliers_DataTransmissionMethods = dataCategories_Suppliers_DataTransmissionMethods,
                Partners = partners
            });
        }

        [HttpGet]
        public IHttpActionResult GetDepartmentPartners([FromUri]byte departmentId)
        {
            return Json(dbContext.Suppliers.Where(p => p.CreatedByDepartmentID == departmentId).OrderBy(p => p.Name).ToList());
        }

        [HttpPost]
        public IHttpActionResult AddDataCategory([FromBody]PassName objCategory)
        {
            if (dbContext.DataCategories.Where(p => p.Name == objCategory.Name).SingleOrDefault() == null)
            {
                var dc = dbContext.DataCategories.Add(new DataCategory()
                {
                    Name = objCategory.Name
                });

                dbContext.SaveChanges();

                return Json(dc);
            }
            else
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.Conflict)
                {
                    Content = new StringContent($"{objCategory.Name} already exists.")
                };

                return ResponseMessage(httpResult);
            }
        }

        [HttpPost]
        public IHttpActionResult AddDataType([FromBody]PassDataType objType)
        {
            if (dbContext.DataTypes.Where(p => p.DataCategoryID == objType.DataCategoryID &&
                                               p.Name == objType.Name).SingleOrDefault() == null)
            {
                var dc = dbContext.DataTypes.Add(new DataType()
                {
                    DataCategoryID = objType.DataCategoryID,
                    Name = objType.Name
                });

                dbContext.SaveChanges();

                return Json(dc);
            }
            else
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.Conflict)
                {
                    Content = new StringContent($"{objType.Name} already exists in DataCategoryID {objType.DataCategoryID}")
                };

                return ResponseMessage(httpResult);
            }
        }

        [HttpPost]
        public IHttpActionResult AddIndividualCategory([FromBody]PassName objType)
        {
            if (dbContext.IndividualCategories.Where(p => p.Name == objType.Name).SingleOrDefault() == null)
            {
                var ic = dbContext.IndividualCategories.Add(new IndividualCategory()
                {
                    Name = objType.Name
                });

                dbContext.SaveChanges();

                return Json(ic);
            }
            else
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.Conflict)
                {
                    Content = new StringContent($"{objType.Name} already exists")
                };

                return ResponseMessage(httpResult);
            }
        }

        [HttpPost]
        public IHttpActionResult AddDataStore([FromBody]PassName objDataStore)
        {
            if (dbContext.DataStores.Where(p => p.Name == objDataStore.Name).SingleOrDefault() == null)
            {
                var ds = dbContext.DataStores.Add(new DataStore()
                {
                    Name = objDataStore.Name
                });

                dbContext.SaveChanges();

                return Json(ds);
            }
            else
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.Conflict)
                {
                    Content = new StringContent($"{objDataStore.Name} already exists")
                };

                return ResponseMessage(httpResult);
            }
        }

        [HttpPost]
        public IHttpActionResult AddDataSource([FromBody]PassName objDataSource)
        {
            if (dbContext.DataSources.Where(p => p.Name == objDataSource.Name).SingleOrDefault() == null)
            {
                var ds = dbContext.DataSources.Add(new DataSource()
                {
                    Name = objDataSource.Name
                });

                dbContext.SaveChanges();

                return Json(ds);
            }
            else
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.Conflict)
                {
                    Content = new StringContent($"{objDataSource.Name} already exists")
                };

                return ResponseMessage(httpResult);
            }
        }

        [HttpPost]
        public IHttpActionResult AddPartnerCategory([FromBody]PassName objCategory)
        {
            if (dbContext.SupplierCategories.Where(p => p.Name == objCategory.Name).SingleOrDefault() == null)
            {
                var ds = dbContext.SupplierCategories.Add(new SupplierCategory()
                {
                    Name = objCategory.Name
                });

                dbContext.SaveChanges();

                return Json(ds);
            }
            else
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.Conflict)
                {
                    Content = new StringContent($"{objCategory.Name} already exists")
                };

                return ResponseMessage(httpResult);
            }
        }

        [HttpPost]
        public IHttpActionResult AddPartner([FromBody]PassPartner objPartner)
        {
            if (dbContext.Suppliers.Where(p => p.Name == objPartner.Name).SingleOrDefault() == null)
            {
                var ds = dbContext.Suppliers.Add(new Supplier()
                {
                    Name = objPartner.Name,
                    SupplierCategoryID = objPartner.PartnerCategoryID,
                    DepartmentID = objPartner.DepartmentID,
                    CreatedByDepartmentID = objPartner.DepartmentID,
                    ContactName = objPartner.ContactName,
                    ContactEmail = objPartner.ContactEmail,
                    ContactPhone = objPartner.ContactPhone,
                    MertexReference = objPartner.MertexReference
                });

                dbContext.SaveChanges();

                var result = dbContext.Suppliers.Include("SupplierCategory").Where(p => p.SupplierID == ds.SupplierID).Single();

                return Json(ds);
            }
            else
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.Conflict)
                {
                    Content = new StringContent($"{objPartner.Name} already exists")
                };

                return ResponseMessage(httpResult);
            }
        }

        [HttpPost]
        public IHttpActionResult UpdatePartner([FromBody]PassPartner objPartner)
        {
            try
            {
                var ds = dbContext.Suppliers.Where(p => p.SupplierID == objPartner.SupplierID).Single();

                ds.Name = objPartner.Name;
                ds.SupplierCategoryID = objPartner.PartnerCategoryID;
                ds.ContactName = objPartner.ContactName;
                ds.ContactEmail = objPartner.ContactEmail;
                ds.ContactPhone = objPartner.ContactPhone;
                ds.MertexReference = objPartner.MertexReference;

                dbContext.SaveChanges();

                var result = dbContext.Suppliers.Include("SupplierCategory").Where(p => p.SupplierID == ds.SupplierID).Single();

                return Json(ds);
            }
            catch (Exception ex)
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent($"{ex.ToString()}")
                };

                return ResponseMessage(httpResult);
            }
        }

        [HttpPost]
        public IHttpActionResult AddDataTransmissionMethod([FromBody]PassName objMethod)
        {
            if (dbContext.DataTransmissionMethods.Where(p => p.Name == objMethod.Name).SingleOrDefault() == null)
            {
                var ds = dbContext.DataTransmissionMethods.Add(new DataTransmissionMethod()
                {
                    Name = objMethod.Name
                });

                dbContext.SaveChanges();

                return Json(ds);
            }
            else
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.Conflict)
                {
                    Content = new StringContent($"{objMethod.Name} already exists")
                };

                return ResponseMessage(httpResult);
            }
        }
       
        [HttpPost]
        public IHttpActionResult SaveSurveyDepartmentStage([FromBody]PassDepartmentStage objStage)
        {
            try
            {
                var department = dbContext.Departments.Where(p => p.DepartmentID == objStage.DepartmentID).Single();

                if (department.FirstReview == null)
                {
                    department.FirstReview = DateTime.Now;
                }
                else
                {
                    department.LastReview = DateTime.Now;
                }

                department.Attendees = objStage.Attendees;
                
                dbContext.SaveChanges();

                return Json(new { });
            }
            catch (Exception ex)
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent($"{ex.ToString()}")
                };

                return ResponseMessage(httpResult);
            }
        }

        [HttpPost]
        public IHttpActionResult SaveSurveyPersonalInfoWorkedStage([FromBody]PassPersonalInfoWorkedStage objStage)
        {
            try
            {
                var extant = dbContext.DataCategory_IndividualCategories.Where(p => p.DepartmentID == objStage.DepartmentID).ToList();

                var toRemove = extant.Except(objStage.DataCategories_IndividualCategories ?? new List<DataCategory_IndividualCategory>(), new DataCategory_IndividualCategoryEqualityComparer());

                dbContext.DataCategory_IndividualCategories.RemoveRange(toRemove);

                objStage.DataCategories_IndividualCategories?.ForEach(c =>
                {
                    var rec = dbContext.DataCategory_IndividualCategories.Where(p =>
                                            p.DepartmentID == c.DepartmentID &&
                                            p.DataCategoryID == c.DataCategoryID &&
                                            p.IndividualCategoryID == c.IndividualCategoryID)
                                        .SingleOrDefault();

                    if (rec == null)
                    {
                        c.ModifiedDT = DateTime.Now;
                        dbContext.DataCategory_IndividualCategories.Add(c);
                    }
                    else
                    {
                        rec.ModifiedDT = DateTime.Now;
                    }
                });
                
                dbContext.SaveChanges();

                return Json(new { });
            }
            catch (Exception ex)
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent($"{ex.ToString()}")
                };

                return ResponseMessage(httpResult);
            }
        }

        [HttpPost]
        public IHttpActionResult SaveSurveyPersonalInfoStoredStage([FromBody]PassPersonalInfoStoredStage objStage)
        {
            try
            {
                var extant = dbContext.DataCategory_DataStores.Where(p => p.DepartmentID == objStage.DepartmentID).ToList();

                var toRemove = extant.Except(objStage.DataCategories_DataStores ?? new List<DataCategory_DataStore>(), new DataCategory_DataStoreEqualityComparer());

                dbContext.DataCategory_DataStores.RemoveRange(toRemove);

                objStage.DataCategories_DataStores?.ForEach(c =>
                {
                    var rec = dbContext.DataCategory_DataStores.Where(p =>
                                            p.DepartmentID == c.DepartmentID &&
                                            p.DataCategoryID == c.DataCategoryID &&
                                            p.DataStoreID == c.DataStoreID)
                                        .SingleOrDefault();

                    if (rec == null)
                    {
                        c.ModifiedDT = DateTime.Now;
                        dbContext.DataCategory_DataStores.Add(c);
                    }
                    else
                    {
                        rec.ModifiedDT = DateTime.Now;
                    }
                });

                dbContext.SaveChanges();

                return Json(new { });
            }
            catch (Exception ex)
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent($"{ex.ToString()}")
                };

                return ResponseMessage(httpResult);
            }
        }

        [HttpPost]
        public IHttpActionResult SaveSurveyHowDoYouCollectStage([FromBody]PassHowDoYouCollectStage objStage)
        {
            try
            {
                var extant = dbContext.DataCategory_DataSources.Where(p => p.DepartmentID == objStage.DepartmentID).ToList();

                var toRemove = extant.Except(objStage.DataCategories_DataSources ?? new List<DataCategory_DataSource>(), new DataCategory_DataSourceEqualityComparer());

                dbContext.DataCategory_DataSources.RemoveRange(toRemove);

                objStage.DataCategories_DataSources?.ForEach(c =>
                {
                    var rec = dbContext.DataCategory_DataSources.Where(p =>
                                            p.DepartmentID == c.DepartmentID &&
                                            p.DataCategoryID == c.DataCategoryID &&
                                            p.DataSourceID == c.DataSourceID)
                                        .SingleOrDefault();

                    if (rec == null)
                    {
                        c.ModifiedDT = DateTime.Now;
                        dbContext.DataCategory_DataSources.Add(c);
                    }
                    else
                    {
                        rec.ModifiedDT = DateTime.Now;
                    }
                });

                dbContext.SaveChanges();

                return Json(new { });
            }
            catch (Exception ex)
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent($"{ex.ToString()}")
                };

                return ResponseMessage(httpResult);
            }
        }

        [HttpPost]
        public IHttpActionResult SaveSurveyWhoDoYouShareWithStage([FromBody]PassWhoDoYouShareWithStage objStage)
        {
            try
            {
                var extant = dbContext.DataCategory_Supplier_DataTransmissionMethods
                                        .Where(p => p.DepartmentID == objStage.DepartmentID).ToList();

                var toRemove = extant.Except(objStage.DataCategories_Suppliers_DataTransmissionMethods ?? new List<DataCategory_Supplier_DataTransmissionMethod>(), 
                    new DataCategory_Supplier_DataTransmissionMethodEqualityComparer());

                dbContext.DataCategory_Supplier_DataTransmissionMethods.RemoveRange(toRemove);

                objStage.DataCategories_Suppliers_DataTransmissionMethods?.ForEach(c =>
                {
                    var rec = dbContext.DataCategory_Supplier_DataTransmissionMethods.Where(p =>
                                            p.DepartmentID == c.DepartmentID &&
                                            p.DataCategoryID == c.DataCategoryID &&
                                            p.SupplierID == c.SupplierID &&
                                            p.DataTransmissionMethodID == c.DataTransmissionMethodID)
                                        .SingleOrDefault();

                    if (rec == null)
                    {
                        c.ModifiedDT = DateTime.Now;
                        dbContext.DataCategory_Supplier_DataTransmissionMethods.Add(c);
                    }
                    else
                    {
                        rec.ModifiedDT = DateTime.Now;
                    }
                });

                dbContext.SaveChanges();

                return Json(new { });
            }
            catch (Exception ex)
            {
                var httpResult = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent($"{ex.ToString()}")
                };

                return ResponseMessage(httpResult);
            }
        }
    }
}
