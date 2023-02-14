using Projects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SharedEFClasses.Models;
using Kendo.Mvc.UI;
using System.Web.Http.ModelBinding;
using Kendo.Mvc.Extensions;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Models.General;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.SignalR;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Utilities;
using SharedEFClasses.SignalR.Hubs;
using System.Web;
using System.Threading.Tasks;
using MertexerV2SQL.Models.Misc;

namespace Projects.Controllers
{
    [System.Web.Http.Authorize]
    public class ProjectsDashboardAPIController : ApiController
    {
        private PortalDbContext portalDb { get; set; }
        private ProjectsDbContext projectsDb { get; set; }

        public ProjectsDashboardAPIController(PortalDbContext portalDb, ProjectsDbContext projectsDb)
        {
            this.portalDb = portalDb;
            this.projectsDb = projectsDb;
        }

        [HttpGet]
        public IHttpActionResult ProjectDashboard([FromUri]PassProjectDashboardFilters objFilters)
        {
            var results = projectsDb.ProjectDashboard(objFilters);

            return Ok(results);
        }
        
        [HttpGet]
        public DataSourceResult ProjectGrid(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassProjectGridFilters objFilters)
        {
            var preResults = projectsDb.ProjectGrid(objFilters);

            var projectIds = preResults.Results.Select(p => p.ProjectID).ToList();

            var results = portalDb.Projects.Where(p => projectIds.Contains(p.ProjectID)).ToList();

            results.ForEach(p => 
            {
                p.Attachments = p.Attachments.Where(q => q.Deleted == false).ToList();
            });

            return results.AsQueryable().ToDataSourceResult(request);
        }
        
        [HttpPost]
        public IHttpActionResult GetProjectCategories()
        {
            var data = portalDb.ProjectCategories.Where(p =>
                p.Deleted == false
            ).ToList();

            return Ok(data);
        }

        //[HttpPost]
        //public IHttpActionResult CompleteProject([FromBody]PassProjectCompletion objProject)
        //{
        //    return Ok(new { });
        //}

        [HttpPost]
        public IHttpActionResult SaveProject([FromBody]PassProjectSave objProject)
        {
            var actioningMemberId = RequestContext.Principal.Identity.GetUserId<int>();
            
            Project project;

            if (objProject.ProjectID != null)
            {
                project = portalDb.Projects.Where(p => p.ProjectID == objProject.ProjectID).Single();
            }
            else
            {
                project = portalDb.Projects.Add(new Project()
                {
                    Name = objProject.Name,
                    AuthorMemberID = actioningMemberId
                });
                portalDb.SaveChanges();
            }
            
            project.Name = objProject.Name;
            project.Description = objProject.Description;
            project.ProjectCategoryID = objProject.ProjectCategoryID;
            project.CountryID = objProject.CountryID;
            project.OwnerMemberID = objProject.OwnerMemberID;
            project.CurrencyID = objProject.CurrencyID;
            project.EstimatedValue = objProject.EstimatedValue;
            project.FirstEnquiryDate = objProject.FirstEnquiryDate;
            project.ExpectedCompletionYear = objProject.ExpectedCompletionYear;
            project.ExpectedCompletionMonth = objProject.ExpectedCompletionMonth;
            project.ExpectedCompletionDate = objProject.ExpectedCompletionDate;
            project.ExpectedCompletionDate = objProject.ExpectedCompletionDate;
            project.TradeMarketID = objProject.TradeMarketID;

            #region Tags

            if (project.Tags == null)
            {
                project.Tags = objProject.Tags?.ConvertAll(c =>
                {
                    var t = new Project_Tag()
                    {
                        ProjectID = project.ProjectID,
                        TagID = c.TagID
                    };
                    return t;
                });
            }
            else
            {
                var currentTags = project.Tags.ToList();
                var toRemove = new List<int>();

                for (var i = 0; i < currentTags.Count; i++)
                {
                    var s = currentTags[i];
                    var incoming = objProject.Tags?.Where(p => p.TagID == s.TagID).SingleOrDefault();
                    if (incoming == null)
                    {
                        // incoming tags does not contain this extant tag; remove extant...
                        toRemove.Add(s.TagID);
                    }
                    else
                    {
                        // great, update this one
                        s.ProjectID = project.ProjectID;
                        s.TagID = incoming.TagID;

                        objProject.Tags?.Remove(incoming);
                    }
                }

                currentTags.RemoveAll(c => { return toRemove.Contains(c.TagID); });

                // in theory, anything left in objProject.Stakeholders should now be a new addition:
                foreach (var c in objProject.Tags)
                {
                    var tag = new Project_Tag()
                    {
                        ProjectID = project.ProjectID,
                        TagID = c.TagID
                    };

                    currentTags.Add(tag);
                }

                project.Tags = currentTags;
            }

            #endregion

            #region Stakeholders

            if (project.ProjectStakeholders == null)
            {
                project.ProjectStakeholders = objProject.Stakeholders.ConvertAll(c =>
                {
                    var stakeHolder = new ProjectStakeholder()
                    {
                        AuthorMemberID = actioningMemberId,
                        ProjectStakeholderTypeID = c.ProjectStakeholderType.ProjectStakeholderTypeID,
                        ProjectID = project.ProjectID,
                        DecisionMaker = c.DecisionMaker,
                        Name = c.Name,
                        PhoneNumber = c.Phone,
                        Email = c.Email,
                        Website = c.Website,
                        CompanyName = c.CompanyName,
                        CountryID = c.Address.countryId,
                        AddressLine1 = c.Address.addressLine1,
                        AddressLine2 = c.Address.addressLine2,
                        Town = c.Address.town,
                        County = c.Address.county,
                        Postcode = c.Address.postcode,
                        TradeAccountID = c.TradeAccountID,
                        MemberID = c.MemberID,
                        LeadID = c.LeadID,
                        LeadContactID = c.LeadContactID
                    };
                    if (c.ProjectStakeholderID < 0)
                    {
                        c.ProjectStakeholderID = null;
                    }
                    if (c.ProjectStakeholderID.HasValue)
                    {
                        stakeHolder.ProjectStakeholderID = c.ProjectStakeholderID.Value;
                    }
                    return stakeHolder;
                });
            }
            else
            {
                var currentStakeholders = project.ProjectStakeholders.ToList();
                var toRemove = new List<long>();

                for (var i = 0; i < currentStakeholders.Count; i++)
                {
                    var s = currentStakeholders[i];
                    var incoming = objProject.Stakeholders.Where(p => p.ProjectStakeholderID == s.ProjectStakeholderID).SingleOrDefault();
                    if (incoming == null)
                    {
                        // incoming stakeholders does not contain this extant stakeholder; remove extant...
                        toRemove.Add(s.ProjectStakeholderID);
                    }
                    else
                    {
                        // great, update this one
                        s.ProjectStakeholderTypeID = incoming.ProjectStakeholderType.ProjectStakeholderTypeID;
                        s.ProjectID = project.ProjectID;
                        s.DecisionMaker = incoming.DecisionMaker;
                        s.Name = incoming.Name;
                        s.PhoneNumber = incoming.Phone;
                        s.Email = incoming.Email;
                        s.Website = incoming.Website;
                        s.CompanyName = incoming.CompanyName;
                        s.CountryID = incoming.Address.countryId;
                        s.AddressLine1 = incoming.Address.addressLine1;
                        s.AddressLine2 = incoming.Address.addressLine2;
                        s.Town = incoming.Address.town;
                        s.County = incoming.Address.county;
                        s.Postcode = incoming.Address.postcode;
                        s.TradeAccountID = incoming.TradeAccountID;
                        s.MemberID = incoming.MemberID;
                        s.LeadID = incoming.LeadID;
                        s.LeadContactID = incoming.LeadContactID;

                        objProject.Stakeholders.Remove(incoming);
                    }
                }

                currentStakeholders.RemoveAll(c => { return toRemove.Contains(c.ProjectStakeholderID); });

                // in theory, anything left in objProject.Stakeholders should now be a new addition:
                foreach (var c in objProject.Stakeholders)
                {
                    var stakeHolder = new ProjectStakeholder()
                    {
                        AuthorMemberID = actioningMemberId, // this doesn't hold if we care to retain who added who as a stakeholder.
                                                            // this will always overwrite... I should cause it to modify if extant.
                        ProjectStakeholderTypeID = c.ProjectStakeholderType.ProjectStakeholderTypeID,
                        ProjectID = project.ProjectID,
                        DecisionMaker = c.DecisionMaker,
                        Name = c.Name,
                        PhoneNumber = c.Phone,
                        Email = c.Email,
                        Website = c.Website,
                        CompanyName = c.CompanyName,
                        CountryID = c.Address.countryId,
                        AddressLine1 = c.Address.addressLine1,
                        AddressLine2 = c.Address.addressLine2,
                        Town = c.Address.town,
                        County = c.Address.county,
                        Postcode = c.Address.postcode,
                        TradeAccountID = c.TradeAccountID,
                        MemberID = c.MemberID,
                        LeadID = c.LeadID,
                        LeadContactID = c.LeadContactID
                    };

                    currentStakeholders.Add(stakeHolder);
                }

                project.ProjectStakeholders = currentStakeholders;
            }

            #endregion

            #region Competitors

            if (project.ProjectCompetitors == null)
            {
                project.ProjectCompetitors = objProject.Competitors.ConvertAll(c =>
                {
                    var competitor = new Project_Competitor()
                    {
                        CompetitorID = c.CompetitorID,
                        ProjectID = project.ProjectID,
                        Quotes = c.ProductQuotes.ConvertAll(x =>
                        {
                            var quote = new Project_CompetitorQuote()
                            {
                                CompetitorID = c.CompetitorID,
                                ProjectID = project.ProjectID,
                                ProductName = x.ProductName,
                                ProductCode = x.ProductCode,
                                Quantity = x.Quantity,
                                CurrencyID = x.Currency.CurrencyID,
                                Price = x.Price,
                                Comment = x.Comment
                            };
                            if (x.ProjectCompetitorQuoteID.HasValue)
                            {
                                quote.ProjectCompetitorQuoteID = x.ProjectCompetitorQuoteID.Value;
                            }
                            return quote;
                        })
                    };
                    return competitor;
                });
            }
            else
            {
                var currentCompetitors = project.ProjectCompetitors.ToList();
                var toRemove = new List<short>();

                for (var i = 0; i < currentCompetitors.Count; i++)
                {
                    var s = currentCompetitors[i];
                    var incoming = objProject.Competitors.Where(p => p.CompetitorID == s.CompetitorID).SingleOrDefault();
                    if (incoming == null)
                    {
                        // incoming competitors does not contain this extant competitor; remove extant...
                        toRemove.Add(s.CompetitorID);
                    }
                    else
                    {
                        // Competitor needs updating: this has to touch the quotes from the competitor

                        var currentQuotes = s.Quotes.ToList();
                        var quotesToRemove = new List<long>();

                        for (var j = 0; j < currentQuotes.Count; j++)
                        {
                            var k = currentQuotes[j];
                            var incomingQuote = incoming.ProductQuotes.Where(p => p.ProjectCompetitorQuoteID == k.ProjectCompetitorQuoteID).SingleOrDefault();
                            if (incomingQuote == null)
                            {
                                // incoming quote does not contain this extant quote, remove extant
                                quotesToRemove.Add(k.ProjectCompetitorQuoteID);
                            }
                            else
                            {
                                // great, update this quote
                                k.ProductName = incomingQuote.ProductName;
                                k.ProductCode = incomingQuote.ProductCode;
                                k.Quantity = incomingQuote.Quantity;
                                k.CurrencyID = incomingQuote.Currency.CurrencyID;
                                k.Price = incomingQuote.Price;
                                k.Comment = incomingQuote.Comment;

                                incoming.ProductQuotes.Remove(incomingQuote);
                            }
                        }

                        currentQuotes.RemoveAll(c => { return quotesToRemove.Contains(c.ProjectCompetitorQuoteID); });

                        // in theory everything left in incoming.ProductQuotes is new
                        foreach (var x in incoming.ProductQuotes)
                        {
                            var q = new Project_CompetitorQuote()
                            {
                                CompetitorID = incoming.CompetitorID,
                                ProjectID = project.ProjectID,
                                ProductName = x.ProductName,
                                ProductCode = x.ProductCode,
                                Quantity = x.Quantity,
                                CurrencyID = x.Currency.CurrencyID,
                                Price = x.Price,
                                Comment = x.Comment
                            };
                            currentQuotes.Add(q);
                        }

                        s.Quotes = currentQuotes;
                        
                        objProject.Competitors.Remove(incoming);
                    }
                }

                currentCompetitors.RemoveAll(c => { return toRemove.Contains(c.CompetitorID); });

                // in theory, anything left in objProject.Competitors should now be a new addition:
                foreach (var c in objProject.Competitors)
                {
                    var competitor = new Project_Competitor()
                    {
                        CompetitorID = c.CompetitorID,
                        ProjectID = project.ProjectID,
                        Quotes = c.ProductQuotes.ConvertAll(x =>
                        {
                            var quote = new Project_CompetitorQuote()
                            {
                                CompetitorID = c.CompetitorID,
                                ProjectID = project.ProjectID,
                                ProductName = x.ProductName,
                                ProductCode = x.ProductCode,
                                Quantity = x.Quantity,
                                CurrencyID = x.Currency.CurrencyID,
                                Price = x.Price,
                                Comment = x.Comment
                            };
                            if (x.ProjectCompetitorQuoteID.HasValue)
                            {
                                quote.ProjectCompetitorQuoteID = x.ProjectCompetitorQuoteID.Value;
                            }
                            return quote;
                        })
                    };

                    currentCompetitors.Add(competitor);
                }

                project.ProjectCompetitors = currentCompetitors;
            }
            
            #endregion

            #region Notes

            if (objProject.Note != null)
            {
                if (project.ProjectNotes == null)
                {
                    project.ProjectNotes = new List<ProjectNote>();
                }
                project.ProjectNotes.Add(new ProjectNote()
                {
                    AuthorMemberID = actioningMemberId,
                    Note = objProject.Note
                });
            }

            #endregion

            #region Attachments

            if (!String.IsNullOrWhiteSpace(objProject.UploadGUID))
            {
                var sourceRoot = HttpContext.Current.Server.MapPath($"~/downloads/projects/temp/{objProject.UploadGUID}");

                var destRoot = HttpContext.Current.Server.MapPath($"~/downloads/projects/{project.ProjectID}");

                if (!System.IO.Directory.Exists(destRoot))
                {
                    System.IO.Directory.CreateDirectory(destRoot);
                }

                objProject.Attachments?.ForEach(c =>
                {
                    var sourceFile = $"{sourceRoot}\\{c}";
                    var destFile = $"{destRoot}\\{c}";

                    if (System.IO.File.Exists(sourceFile))
                    {
                        System.IO.File.Move(sourceFile, destFile);
                    }

                    System.IO.File.Delete(sourceFile);

                    if (project.Attachments == null)
                    {
                        project.Attachments = new List<Project_Attachment>();
                    }

                    project.Attachments.Add(new Project_Attachment()
                    {
                        Name = $"{c}",
                        FilePath = $"/downloads/projects/{project.ProjectID}/{c}",
                        UploadedByMemberID = actioningMemberId
                    });
                });

                if (System.IO.Directory.Exists(sourceRoot))
                {
                    if (System.IO.Directory.EnumerateFiles(sourceRoot).Count() == 0)
                    {
                        System.IO.Directory.Delete(sourceRoot);
                    }
                }
            }

            #endregion

            project.ModifiedDT = DateTime.Now;

            portalDb.SaveChanges();
            
            return Ok(project);
        }
        
        [HttpPost]
        public IHttpActionResult AddProjectCategory([FromBody]PassNameString objProjectCategory)
        {
            var authorMemberId = RequestContext.Principal.Identity.GetUserId<int>();

            var project = portalDb.ProjectCategories.Add(new ProjectCategory()
            {
                Name = objProjectCategory.Name,
                ModifiedDT = DateTime.Now,
                AuthorMemberID = authorMemberId
            });

            portalDb.SaveChanges();

            return Ok(project);
        }

        [HttpPost]
        public IHttpActionResult ProjectCategoryAutocomplete([FromBody]PassAutocompleteTerm objTerm)
        {
            var results = portalDb.ProjectCategories.Where(p => p.Name.StartsWith(objTerm.term)).ToList();

            return Ok(results);
        }


        [HttpPost]
        public IHttpActionResult AddProjectStakeholderType([FromBody]PassNameString objProjectStakeholderType)
        {
            var authorMemberId = RequestContext.Principal.Identity.GetUserId<int>();

            var project = portalDb.ProjectStakeholderTypes.Add(new ProjectStakeholderType()
            {
                Name = objProjectStakeholderType.Name,
                ModifiedDT = DateTime.Now,
                AuthorMemberID = authorMemberId
            });

            portalDb.SaveChanges();

            return Ok(project);
        }

        [HttpPost]
        public IHttpActionResult ProjectStakeholderTypeAutocomplete([FromBody]PassAutocompleteTerm objTerm)
        {
            var results = portalDb.ProjectStakeholderTypes.Where(p => p.Name.StartsWith(objTerm.term)).ToList();

            return Ok(results);
        }


        [HttpGet]
        public IHttpActionResult ExternalCompanyList()
        {
            return Ok(portalDb.ExternalCompanies.ToList());
        }
        
        [HttpGet]
        public DataSourceResult MemberList(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            var results = portalDb.Users.Where(p => p.Departments.Any()).ToList();

            return results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpPost]
        public IHttpActionResult GetProjectStatuses()
        {
            return Ok(portalDb.ProjectStatuses.Where(p => p.Deleted == false).ToList());
        }
        
        [HttpPost]
        public IHttpActionResult GetProjectTypes()
        {
            return Ok(portalDb.ProjectTypes.Where(p => p.Deleted == false).ToList());
        }

        [HttpPost]
        public IHttpActionResult GetTradeMarkets()
        {
            return Ok(portalDb.TradeMarkets.Where(p => p.Deleted == false).ToList());
        }

        [HttpPost]
        public IHttpActionResult GetCountries() {
            return Ok(portalDb.Countries.Where(p => p.DeletedDT == null &&
            p.IsCountry == true).ToList());
        }

        [HttpPost]
        public IHttpActionResult GetCurrencies()
        {
            return Ok(portalDb.Currencies.ToList());
        }

        [HttpPost]
        public IHttpActionResult ProjectCompetitorAutocomplete(PassAutocompleteTerm objAutocomplete)
        {
            var results = portalDb.Competitors.Where(p => p.Deleted == false && p.Name.Contains(objAutocomplete.term)).ToList();

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult GetProjectStakeholderTypes()
        {
            return Ok(portalDb.ProjectStakeholderTypes.OrderBy(p => p.Name).ToList());
        }

        [HttpPost]
        public IHttpActionResult ProjectStakeholderAutocomplete(PassAutocompleteTerm objAutocomplete)
        {
            var results = new List<ProjectStakeholderAutocompleteResult>();

            results.AddRange(portalDb.Users
                                .Where(p =>
                                    p.Deleted == false &&
                                    p.FullName.Contains(objAutocomplete.term)
                                )
                                .Take(10)
                                .Select(q => new ProjectStakeholderAutocompleteResult()
                                {
                                    Name = q.FullName,
                                    Class = "list-group-item-success",
                                    Data = q,
                                    Code = q.Id.ToString(),
                                    Type = "PERSON"
                                })
                                .ToList()
                        );

            results.AddRange(portalDb.ProjectStakeholders
                                .Where(p =>
                                    p.Deleted == false &&
                                    p.Name.Contains(objAutocomplete.term)
                                )
                                .Take(10)
                                .Select(q => new ProjectStakeholderAutocompleteResult()
                                {
                                    Name = q.Name,
                                    Class = "list-group-item-success",
                                    Data = q,
                                    Type = "STAKEHOLDER"
                                })
                                .ToList()
                        );

            results.AddRange(portalDb.TradeAccounts
                                .Where(p => 
                                    p.Status == "O" && (
                                        p.Name.Contains(objAutocomplete.term) || 
                                        p.Code.StartsWith(objAutocomplete.term)
                                    )
                                )
                                .Take(10)
                                .ToList()
                                .Select(q => new ProjectStakeholderAutocompleteResult()
                                {
                                    Name = q.Name,
                                    Class = "list-group-item-info",
                                    Data = q,
                                    Code = q.Code,
                                    Type = "TRADE ACCOUNT",
                                    Address = new {
                                        addressLine1 = q.AddressLine1,
                                        addressLine2 = q.AddressLine2,
                                        town = q.AddressLine3,
                                        county = q.AddressLine4,
                                        postcode = q.Postcode,
                                        countryId = q.CountryID
                                    }
                                })
                                .ToList()
                        );

            results.AddRange(portalDb.Leads
                                .Where(p => 
                                    p.LeadStatusID != 4 &&
                                    p.LeadStatusID != 5 &&
                                    p.LeadStatusID != 9 &&
                                    p.Deleted == false &&
                                    p.CompanyName.Contains(objAutocomplete.term)
                                )
                                .Take(10)
                                .Select(q => new ProjectStakeholderAutocompleteResult()
                                {
                                    Name = q.CompanyName,
                                    Class = "list-group-item-warning",
                                    Data = q,
                                    Code = q.LeadID.ToString(),
                                    Type = "LEAD",
                                    Address = new
                                    {
                                        addressLine1 = q.InvoiceAddress.AddressLine1,
                                        addressLine2 = q.InvoiceAddress.AddressLine2,
                                        town = q.InvoiceAddress.Town,
                                        county = q.InvoiceAddress.County,
                                        postcode = q.InvoiceAddress.PostCode,
                                        countryId = q.InvoiceAddress.CountryID
                                    },
                                    Contact = q.LeadContact
                                })
                                .ToList()
                        );

            results.AddRange(portalDb.LeadContacts
                                .Where(p => 
                                    p.Lead.LeadStatusID != 4 &&
                                    p.Lead.LeadStatusID != 5 &&
                                    p.Lead.LeadStatusID != 9 &&
                                    p.Deleted == false && (
                                        p.FullName.Contains(objAutocomplete.term) || 
                                        p.Email.StartsWith(objAutocomplete.term)
                                    )
                                )
                                .Take(10)
                                .Select(q => new ProjectStakeholderAutocompleteResult()
                                {
                                    Name = q.FullName,
                                    Class = "list-group-item-warning",
                                    Code = q.LeadID.ToString(),
                                    Data = q,
                                    Type = "LEAD CONTACT"
                                })
                                .ToList()
                        );

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> UploadAttachments()
        {
            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            try
            {
                var kvp = Request.Headers.Where(p => p.Key == "x-upload-guid").Select(p => p.Value).SingleOrDefault();

                string uploadDirectory = kvp.First();
                
                string root = HttpContext.Current.Server.MapPath("~/Downloads/projects/temp");

                root += $"/{uploadDirectory}";

                System.IO.Directory.CreateDirectory(root);

                var provider = new CustomMultipartFormDataStreamProvider(root);

                // Read the form data.
                await Request.Content.ReadAsMultipartAsync(provider);

                var fileNameList = new List<string>();

                // This illustrates how to get the file names.
                foreach (MultipartFileData file in provider.FileData)
                {
                    // Cool, so... while creating a new project or editing an existing project, 
                    // a unique temporary directory will be created 
                    // when SAVING that project, files from this temporary directory will need to be moved to
                    // the project-specific attachments folder: /Downloads/projects/###/attachments/
                    // 
                    // the temporary directory must then be cleared.
                    // the save process will send up an uploadGuid which identifies this temporary directory.

                    fileNameList.Add($"{System.IO.Path.GetFileName(file.LocalFileName)}");
                }

                return Ok(new { uploadGuid = uploadDirectory, files = fileNameList });
            }
            catch (Exception e)
            {
                var responseMsg = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);

                return ResponseMessage(responseMsg);
            }
        }

        [HttpPost]
        public IHttpActionResult RemoveAttachments([FromBody]PassKendoUploadRemoval objRemoval)
        {
            string uploadDirectory = null;

            var kvp = Request.Headers.Where(p => p.Key == "x-upload-guid").Select(p => p.Value).SingleOrDefault();

            if (kvp != null)
            {
                uploadDirectory = kvp.First();
            }

            if (uploadDirectory == null)
            {
                throw new HttpResponseException(HttpStatusCode.ExpectationFailed);
            }

            string root = HttpContext.Current.Server.MapPath("~/Downloads/projects/temp");

            root += $"\\{uploadDirectory}\\";

            foreach (var f in objRemoval.fileNames)
            {
                var file = $"{root}{f}";

                if (System.IO.File.Exists(file))
                {
                    System.IO.File.Delete(file);
                }
            }

            System.IO.Directory.Delete(root);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult MarkProjectLost([FromBody]PassProjectLost objLoss)
        {
            var actioningMemberId = RequestContext.Principal.Identity.GetUserId<int>();

            var project = portalDb.Projects.Where(p => p.ProjectID == objLoss.ProjectID).Single();

            project.LostDT = DateTime.Now;

            project.LostComment = objLoss.Comment;

            project.LostByMemberID = actioningMemberId;

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult RemoveFirmAttachment([FromBody]PassProjectAttachmentID objAttachment)
        {
            var projectAttachment = portalDb.ProjectAttachments.Where(p => p.ProjectAttachmentID == objAttachment.ProjectAttachmentID).Single();

            var filePath = HttpContext.Current.Server.MapPath(projectAttachment.FilePath);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            projectAttachment.DeletedDT = DateTime.Now;

            portalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult MarkProjectCompleted([FromBody]PassProjectCompleted objCompleted)
        {
            var actioningMemberId = RequestContext.Principal.Identity.GetUserId<int>();

            var project = portalDb.Projects.Where(p => p.ProjectID == objCompleted.ProjectID).Single();

            project.CompletedDT = DateTime.Now;

            project.CompletedComment = objCompleted.Comment;

            project.CompletedByMemberID = actioningMemberId;

            return Ok(new { });
        }
    }

    public class ProjectStakeholderAutocompleteResult
    {
        public string Class { get; set; }
        public string Name { get; set; }
        public object Data { get; set; }
        public string Type { get; set; }
        public string Code { get; set; }
        public object Address { get; set; }
        public object Contact { get; set; }
    }
}
