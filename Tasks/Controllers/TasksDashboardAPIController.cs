using Tasks.Models;
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
using System.Threading.Tasks;
using System.Web;
using MertexerV2SQL.Models.Misc;

namespace Tasks.Controllers
{
    [System.Web.Http.Authorize]
    public class TasksDashboardAPIController : ApiController
    {
        [HttpPost]
        public IHttpActionResult NotifyTest()
        {
            var userId = RequestContext.Principal.Identity.GetUserId<int>();

            GlobalHost.ConnectionManager.GetHubContext<SharedEFClasses.SignalR.Hubs.TaskAlertHub>()
                .Clients.User(userId.ToString()).receiveAlert(new UserAlertNotification(
                    1,
                    TaskAlertType.TaskChase,
                    $"Testing",
                    "Tom",
                    data: null
                ));

            return Ok(new { });
        }

        private PortalDbContext portalDb { get; set; }
        private TasksDbContext tasksDb { get; set; }

        public TasksDashboardAPIController(PortalDbContext portalDb, TasksDbContext tasksDb)
        {
            this.portalDb = portalDb;
            this.tasksDb = tasksDb;
        }

        [HttpGet]
        public IHttpActionResult TaskDashboard([FromUri]PassTaskDashboardFilters objFilters)
        {
            var results = tasksDb.TaskDashboard(objFilters);

            return Ok(results);
        }
        
        [HttpGet]
        public DataSourceResult TaskGrid(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassTaskGridFilters objFilters)
        {
            var preResults = tasksDb.TaskGrid(objFilters);

            var taskDueIds = preResults.Results.Select(q => q.TaskDueID).ToList();

            var results = portalDb.TaskDues.Where(p => taskDueIds.Contains(p.TaskDueID))
                                            .OrderBy(p => p.Due)
                                            .ThenByDescending(p => p.TaskDueID)
                                            .ToList();

            var gridTaskDues = results.Select(p => new GridTaskDue(p)).ToList();

            return gridTaskDues.AsQueryable().ToDataSourceResult(request);
        }

        [HttpPost]
        public IHttpActionResult GetTaskStatuses()
        {
            var data = portalDb.TaskStatuses.ToList();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult GetProjects()
        {
            var data = portalDb.Projects.Where(p => 
                p.Deleted == false &&
                p.Tasks.Where(q => 
                    q.TaskDues.Any() &&
                    q.TaskDues.OrderBy(t => t.Due).FirstOrDefault().CompletedDT == null
                ).Any()
            ).ToList();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult GetTaskTypes()
        {
            var data = portalDb.TaskTypes.ToList();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult ExternalCompanyAutocomplete([FromBody]PassAutocompleteTerm objAutocomplete)
        {
            var results = portalDb.ExternalCompanies.Where(p => p.Name.Contains(objAutocomplete.term)).ToList();

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult AddExternalCompany([FromBody]PassNameString objName)
        {
            var result = portalDb.ExternalCompanies.Add(new ExternalCompany() { Name = objName.Name });

            portalDb.SaveChanges();

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult FetchExternalStatuses([FromBody]PassExternalStatusAutocomplete objAutocomplete)
        {
            var results = portalDb.ExternalStatuses.Where(p =>
                p.ExternalCompanyID == objAutocomplete.ExternalCompanyID).OrderBy(p => p.Name).ToList();

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult ExternalStatusAutocomplete([FromBody]PassExternalStatusAutocomplete objAutocomplete)
        {
            var results = portalDb.ExternalStatuses.Where(p =>
                p.ExternalCompanyID == objAutocomplete.ExternalCompanyID &&
                p.Name.Contains(objAutocomplete.Term)).OrderBy(p => p.Name).ToList();

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult AddExternalStatus([FromBody]PassNewExternalStatus objStatus)
        {
            var result = portalDb.ExternalStatuses.Add(new ExternalStatus()
            {
                ExternalCompanyID = objStatus.ExternalCompanyID,
                Name = objStatus.Name
            });

            portalDb.SaveChanges();

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult NewTask([FromBody]PassNewTask objSave)
        {
            var authorMemberId = RequestContext.Principal.Identity.GetUserId<int>();

            var creationDt = DateTime.Now;

            var newTask = portalDb.Tasks.Add(new SharedEFClasses.Models.Task()
            {
                Urgent = objSave.Urgent,
                Core = objSave.Core,
                AuthorDescription = objSave.AuthorDescription,
                AuthorMemberID = authorMemberId,
                OwnerMemberID = objSave.AssignedToMemberID,
                OwnerAssignedDT = creationDt,
                ProjectID = objSave.ProjectID,
                TaskTypeID = objSave.TaskTypeID,
                ExternalCompanyID = objSave.ExternalCompanyID,
                ExternalStatusID = objSave.ExternalStatusID,
                ExternalContact = objSave.ExternalContact,
                ExternalReference = objSave.ExternalReference,
                ExternalPhone = objSave.ExternalPhone,
                ExternalEmail = objSave.ExternalEmail,
                ExternallyAssigned = objSave.ExternalCompanyID.HasValue
            });
            
            portalDb.SaveChanges();

            if (!String.IsNullOrEmpty(objSave.Comment))
            {
                newTask.Comments = new List<TaskComment>();

                newTask.Comments.Add(new TaskComment() {
                    CreatedMemberID = authorMemberId,
                    Comment = objSave.Comment
                });
            }

            if (objSave.Recurring)
            {
                newTask.Schedule = new Schedule() {
                    ScheduleTypeID = objSave.Schedule.ScheduleType.ScheduleTypeID,
                    ScheduleFrequencyID = objSave.Schedule.Frequency?.ScheduleFrequencyID,
                    Interval = objSave.Schedule.Interval,
                    StartDate = objSave.Schedule.StartDate,
                    EndDate = objSave.Schedule.EndDate
                };
                
                if (objSave.Schedule?.Days?.Any() == true)
                {
                    newTask.Schedule.Schedule_Days = objSave.Schedule.Days.Select(p => new Schedule_Day()
                    {
                        DayID = p.DayID
                    }).ToList();
                }
            }
            else
            {
                // add a TaskDue record directly.
                newTask.TaskDues = new List<TaskDue>();

                newTask.TaskDues.Add(new TaskDue()
                {
                    Due = objSave.DueDate.Value,
                    ExpectedDeliveryDT = objSave.DueDate.Value,
                    ExpectedDeliveryChangedReadDT = creationDt
                });
            }

            portalDb.SaveChanges();

            var assignment = portalDb.TaskAssignmentHistories.Add(new TaskAssignmentHistory()
            {
                AssignedByMemberID = authorMemberId,
                AssignedToMemberID = objSave.AssignedToMemberID,
                TaskID = newTask.TaskID,
                AssignmentDT = creationDt
            });


            #region Attachments

            if (!String.IsNullOrWhiteSpace(objSave.UploadGUID))
            {
                var sourceRoot = HttpContext.Current.Server.MapPath($"~/downloads/tasks/temp/{objSave.UploadGUID}");

                var destRoot = HttpContext.Current.Server.MapPath($"~/downloads/tasks/{newTask.TaskID}");

                if (!System.IO.Directory.Exists(destRoot))
                {
                    System.IO.Directory.CreateDirectory(destRoot);
                }

                objSave.Attachments?.ForEach(c =>
                {
                    var sourceFile = $"{sourceRoot}\\{c}";
                    var destFile = $"{destRoot}\\{c}";

                    if (System.IO.File.Exists(sourceFile))
                    {
                        System.IO.File.Move(sourceFile, destFile);
                    }

                    System.IO.File.Delete(sourceFile);

                    if (newTask.Attachments == null)
                    {
                        newTask.Attachments = new List<Task_Attachment>();
                    }

                    newTask.Attachments.Add(new Task_Attachment()
                    {
                        Name = $"{c}",
                        FilePath = $"/downloads/tasks/{newTask.TaskID}/{c}",
                        UploadedByMemberID = authorMemberId
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


            portalDb.SaveChanges();

            if (objSave.Recurring)
            {
                portalDb.TaskDue_Generate(newTask.TaskID);
            }

            var task = portalDb.Tasks.Include("TaskDues").Where(p => p.TaskID == newTask.TaskID).Single();
            var taskDue = task.NextDue;
            
            var assignmentRecord = portalDb.TaskAssignmentHistories
                .Include("AssignedByMember")
                .Include("AssignedToMember")
                .Where(p => p.TaskAssignmentHistoryID == assignment.TaskAssignmentHistoryID)
                .Single();

            GlobalHost.ConnectionManager.GetHubContext<SharedEFClasses.SignalR.Hubs.TaskAlertHub>()
                .Clients.User(objSave.AssignedToMemberID.ToString()).receiveAlert(
                new UserAlertNotification(
                    taskDue.TaskDueID,
                    TaskAlertType.Task,
                    $"{taskDue.Task.AuthorDescription}",
                    assignmentRecord.AssignedByMember.FullName,
                    data: new GridTaskDue(taskDue)
                ));

            return Ok(newTask.NextDue);
        }

        [HttpPost]
        public IHttpActionResult UpdateTask([FromBody]PassUpdateTask objUpdate)
        {
            if (objUpdate.OwnerMemberID == 0)
            {
                throw new HttpResponseException(HttpStatusCode.ExpectationFailed);
            }

            var updaterMemberId = RequestContext.Principal.Identity.GetUserId<int>();

            var updaterMember = portalDb.Users.Where(p => p.Id == updaterMemberId).Single();

            var task = portalDb.Tasks.Where(p => p.TaskID == objUpdate.TaskID).Single();

            task.TaskTypeID = objUpdate.TaskTypeID;
            task.OwnerDescription = objUpdate.OwnerDescription;

            if (task.NextDue.ExpectedDeliveryDT != objUpdate.ExpectedDelivery)
            {
                //notify author that current owner has changed the expected delivery date
                // ... but if we're notifying on a whole load of things...
                // that'll get pretty redundant pretty quickly?
                // deal with that potential issue when it's mentioned, eh?
                task.NextDue.ExpectedDeliveryChangedReadDT = null;
                GlobalHost.ConnectionManager.GetHubContext<TaskAlertHub>()
                    .Clients.User(task.AuthorMemberID.ToString()).receiveAlert(
                    new UserAlertNotification(
                        task.TaskID,
                        TaskAlertType.ExpectedDeliveryChanged,
                        $"{objUpdate.ExpectedDelivery?.ToString("dd/MM/yyyy")}",
                        updaterMember.FullName,
                        data: new GridTaskDue(task.NextDue)
                    ));
            }

            task.NextDue.ExpectedDeliveryDT = objUpdate.ExpectedDelivery;
            task.NextDue.TaskStatusID = null;
            
            if (objUpdate.OwnerMemberID != task.OwnerMemberID)
            {
                task.OwnerMemberID = objUpdate.OwnerMemberID;

                portalDb.TaskAssignmentHistories.Add(new TaskAssignmentHistory()
                {
                    AssignedByMemberID = updaterMemberId,
                    AssignedToMemberID = objUpdate.OwnerMemberID,
                    TaskID = objUpdate.TaskID,
                    AssignmentDT = DateTime.Now
                });
            }

            task.ProjectID = objUpdate.ProjectID;
            task.ExternalCompanyID = objUpdate.ExternalCompanyID;
            task.ExternalStatusID = objUpdate.ExternalStatusID;
            task.ExternalContact = objUpdate.ExternalContact;
            task.ExternalReference = objUpdate.ExternalReference;
            task.ExternalPhone = objUpdate.ExternalPhone;
            task.ExternalEmail = objUpdate.ExternalEmail;
            task.ExternallyAssigned = objUpdate.ExternalCompanyID.HasValue;

            if (objUpdate.NewComment != null)
            {
                task.Comments.Add(new TaskComment()
                {
                    Comment = objUpdate.NewComment,
                    CreatedMemberID = updaterMemberId
                });

                task.NextDue.NewCommentReadDT = null;

                if (updaterMemberId == objUpdate.OwnerMemberID)
                {
                    task.NextDue.NewCommentTargetMemberID = task.AuthorMemberID;

                    // Commenter is current owner, do not alert them - alert the Author.
                    GlobalHost.ConnectionManager.GetHubContext<TaskAlertHub>()
                        .Clients.User(task.AuthorMemberID.ToString()).receiveAlert(
                        new UserAlertNotification(
                            task.TaskID,
                            TaskAlertType.TaskCommented,
                            $"{objUpdate.NewComment}",
                            task.CurrentAssignment.AssignedToMember.FullName,
                            data: new GridTaskDue(task.NextDue)
                        ));
                }
                if (updaterMemberId == task.AuthorMemberID)
                {
                    task.NextDue.NewCommentTargetMemberID = objUpdate.OwnerMemberID;

                    // Commenter is author, alert the current owner.
                    GlobalHost.ConnectionManager.GetHubContext<TaskAlertHub>()
                        .Clients.User(objUpdate.OwnerMemberID.ToString()).receiveAlert(
                        new UserAlertNotification(
                            task.TaskID,
                            TaskAlertType.TaskCommented,
                            $"{objUpdate.NewComment}",
                            task.Author.FullName,
                            data: new GridTaskDue(task.NextDue)
                        ));
                }
            }

            #region Attachments

            if (!String.IsNullOrWhiteSpace(objUpdate.UploadGUID))
            {
                var sourceRoot = HttpContext.Current.Server.MapPath($"~/downloads/tasks/temp/{objUpdate.UploadGUID}");

                var destRoot = HttpContext.Current.Server.MapPath($"~/downloads/tasks/{objUpdate.TaskID}");

                if (!System.IO.Directory.Exists(destRoot))
                {
                    System.IO.Directory.CreateDirectory(destRoot);
                }

                objUpdate.Attachments?.ForEach(c =>
                {
                    var sourceFile = $"{sourceRoot}\\{c}";
                    var destFile = $"{destRoot}\\{c}";

                    if (System.IO.File.Exists(sourceFile))
                    {
                        System.IO.File.Move(sourceFile, destFile);
                    }

                    System.IO.File.Delete(sourceFile);

                    if (task.Attachments == null)
                    {
                        task.Attachments = new List<Task_Attachment>();
                    }

                    task.Attachments.Add(new Task_Attachment()
                    {
                        Name = $"{c}",
                        FilePath = $"/downloads/tasks/{task.ProjectID}/{c}",
                        UploadedByMemberID = updaterMemberId
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

            portalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult CompleteTask([FromBody]PassTaskCompletion objTaskDue)
        {
            var taskDue = portalDb.TaskDues.Where(p => p.TaskDueID == objTaskDue.TaskDueID).Single();

            var updaterMemberId = RequestContext.Principal.Identity.GetUserId<int>();

            taskDue.CompletedDT = DateTime.Now;
            taskDue.CompletedComment = objTaskDue.CompletedComment ?? $"Task {taskDue.Task.TaskID} Completed";
            taskDue.TaskStatusID = null;

            taskDue.Task.Comments.Add(new TaskComment()
            {
                Comment = "Task Complete",
                CreatedMemberID = updaterMemberId
            });

            taskDue.Task.NextDue.NewCommentReadDT = null;
            
            // alert the author
            GlobalHost.ConnectionManager.GetHubContext<TaskAlertHub>()
                .Clients.User(taskDue.Task.AuthorMemberID.ToString()).receiveAlert(
                new UserAlertNotification(
                    taskDue.Task.TaskID,
                    TaskAlertType.TaskCompleted,
                    objTaskDue.CompletedComment ?? $"Task {taskDue.Task.TaskID} Complete",
                    taskDue.Task.CurrentAssignment.AssignedToMember.FullName,
                    data: new GridTaskDue(taskDue)
                ));
            
            portalDb.SaveChanges();
            
            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult ProjectsAutocomplete([FromBody]PassAutocompleteTerm objTerm)
        {
            var results = portalDb.Projects.Where(
                p =>
                p.Deleted == false &&
                p.LostDT == null &&
                p.Name.Contains(objTerm.term)).ToList();

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult AddTaskType([FromBody]PassNameString objTaskType)
        {
            var project = portalDb.TaskTypes.Add(new TaskType()
            {
                Name = objTaskType.Name
            });

            portalDb.SaveChanges();

            return Ok(project);
        }

        [HttpPost]
        public IHttpActionResult TaskTypeAutocomplete([FromBody]PassAutocompleteTerm objTerm)
        {
            var results = portalDb.TaskTypes.Where(p => p.Name.Contains(objTerm.term)).ToList();

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult MarkTaskAsRead([FromBody]PassTaskDueID objTaskDue)
        {
            var taskDue = portalDb.TaskDues.Where(p => p.TaskDueID == objTaskDue.TaskDueID).Single();

            var now = DateTime.Now;

            taskDue.ReadDT = now;
            taskDue.ChaseReadDT = now;
            taskDue.NewCommentReadDT = now;
            taskDue.ExpectedDeliveryChangedReadDT = now;

            taskDue.TaskStatusID = null;

            portalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult MarkTaskAsUnread([FromBody]PassTaskDueID objTaskDue)
        {
            var taskDue = portalDb.TaskDues.Where(p => p.TaskDueID == objTaskDue.TaskDueID).Single();

            taskDue.ReadDT = null;
            taskDue.TaskStatusID = null;
            
            portalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult ChaseTask([FromBody]PassTaskDueID objTaskDue)
        {
            var taskDue = portalDb.TaskDues.Where(p => p.TaskDueID == objTaskDue.TaskDueID).Single();

            if (taskDue.LastChaseDT.HasValue)
            {
                if (taskDue.LastChaseDT.Value.Date == DateTime.Now.Date) // already chased today, sorry... 
                {
                    // no need to tell the user that, just let them think that it has been chased?
                }
                else
                {
                    taskDue.ChaseCount++;
                    taskDue.LastChaseDT = DateTime.Now;
                    taskDue.ChaseReadDT = null;
                    taskDue.TaskStatusID = null;

                    GlobalHost.ConnectionManager.GetHubContext<SharedEFClasses.SignalR.Hubs.TaskAlertHub>()
                        .Clients.User(taskDue.Task.CurrentAssignment.AssignedToMemberID.ToString()).receiveAlert(
                        new UserAlertNotification(
                            taskDue.TaskDueID,
                            TaskAlertType.TaskChase,
                            $"{taskDue.Task.AuthorDescription}",
                            taskDue.Task.CurrentAssignment.AssignedByMember.FullName,
                            data: new GridTaskDue(taskDue)
                        ));

                    portalDb.SaveChanges();
                }
            }
            else
            {
                taskDue.ChaseCount++;
                taskDue.LastChaseDT = DateTime.Now;
                taskDue.ChaseReadDT = null;
                taskDue.TaskStatusID = null;

                GlobalHost.ConnectionManager.GetHubContext<SharedEFClasses.SignalR.Hubs.TaskAlertHub>()
                    .Clients.User(taskDue.Task.CurrentAssignment.AssignedToMemberID.ToString()).receiveAlert(
                    new UserAlertNotification(
                        taskDue.TaskDueID,
                        TaskAlertType.TaskChase,
                        $"{taskDue.Task.AuthorDescription}",
                        taskDue.Task.CurrentAssignment.AssignedByMember.FullName,
                        data: new GridTaskDue(taskDue)
                    ));

                portalDb.SaveChanges();
            }

            return Ok(new { });
        }

        [HttpGet]
        public IHttpActionResult TaskStatusList()
        {
            return Ok(portalDb.TaskStatuses.ToList());
        }

        [HttpGet]
        public IHttpActionResult ExternalCompanyList()
        {
            return Ok(portalDb.ExternalCompanies.ToList());
        }

        [HttpGet]
        public IHttpActionResult ProjectsList()
        {
            return Ok(portalDb.Projects.Where(p =>
                p.Deleted == false &&
                p.Tasks.Where(q =>
                    q.TaskDues.Any() && 
                    q.NextDue.CompletedDT == null
                ).Any()
            ).ToList());
        }

        [HttpGet]
        public DataSourceResult MemberList(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            var results = portalDb.Users.Where(p => p.Departments.Any()).ToList();

            return results.AsQueryable().ToDataSourceResult(request);
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

                string root = HttpContext.Current.Server.MapPath("~/Downloads/tasks/temp");

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

            string root = HttpContext.Current.Server.MapPath("~/Downloads/tasks/temp");

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
        public IHttpActionResult RemoveFirmAttachment([FromBody]PassTaskAttachmentID objAttachment)
        {
            var taskAttachment = portalDb.TaskAttachments.Where(p => p.TaskAttachmentID == objAttachment.TaskAttachmentID).Single();

            var filePath = HttpContext.Current.Server.MapPath(taskAttachment.FilePath);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            taskAttachment.DeletedDT = DateTime.Now;

            portalDb.SaveChanges();

            return Ok(new { });
        }
    }
}