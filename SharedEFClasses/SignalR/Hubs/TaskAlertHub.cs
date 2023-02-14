using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.Identity;
using SharedEFClasses.Models;
using SharedEFClasses.Utilities;

namespace SharedEFClasses.SignalR.Hubs
{
    public class TaskAlertHub : Hub
    {
        private PortalDbContext portalDb { get; set; }

        public TaskAlertHub(PortalDbContext portalDb)
        {
            this.portalDb = portalDb;
        }

        public void Notify(string userId, string message)
        {
            //Clients.User(userId).receiveAlert(new { message = message, type = "task" });
        }

        public void ReadAlert(string alertId)
        {
            //var b = alertId;
        }

        public void FetchAlerts()
        {
            //var userId = Context.User.Identity.GetUserId<int>();

            //var now = DateTime.Now;

            //var unreadTaskDues = portalDb.TaskDues.Where(p => 
            //    p.Task.OwnerMemberID == userId && 
            //    p.ReadDT == null &&
            //    p.CompletedDT == null &&
            //    p.Deleted == false &&
            //    p.Due.Year == now.Year &&
            //    p.Due.Month == now.Month &&
            //    p.Due.Day == now.Day
            //).ToList();

            //var unreadTaskChases = portalDb.TaskDues.Where(p =>
            //    p.Task.OwnerMemberID == userId &&
            //    p.ChaseCount > 0 &&
            //    p.ChaseReadDT == null &&
            //    p.CompletedDT == null &&
            //    p.Deleted == false &&
            //    p.Due.Year == now.Year &&
            //    p.Due.Month == now.Month &&
            //    p.Due.Day == now.Day
            //).ToList();
            
            //var unreadCommentedTasks = portalDb.TaskDues.Where(p =>
            //    p.NewCommentReadDT == null &&
            //    p.NewCommentTargetMemberID == userId &&
            //    p.CompletedDT == null &&
            //    p.Deleted == false &&
            //    p.Due.Year == now.Year &&
            //    p.Due.Month == now.Month &&
            //    p.Due.Day == now.Day
            //).ToList();

            //var unreadTaskCompletions = portalDb.TaskDues.Where(p =>
            //    p.NewCommentReadDT == null &&
            //    p.NewCommentTargetMemberID == userId &&
            //    p.CompletedDT != null &&
            //    p.Deleted == false
            //).ToList();

            //var unreadTaskExpectedDeliveryChanges = portalDb.TaskDues.Where(p =>
            //    p.ExpectedDeliveryChangedReadDT == null &&
            //    p.Task.AuthorMemberID == userId &&
            //    p.CompletedDT != null &&
            //    p.Deleted == false
            //).ToList();

            //var comparer = new TaskDueComparer();

            //unreadCommentedTasks = unreadCommentedTasks.Except(unreadTaskDues, comparer).ToList();
            //unreadCommentedTasks = unreadCommentedTasks.Except(unreadTaskChases, comparer).ToList();
            
            //var notices = new List<UserAlertNotification>();

            //foreach (var d in unreadTaskDues)
            //{
            //    notices.Add(new UserAlertNotification(
            //        d.TaskDueID, 
            //        TaskAlertType.Task, 
            //        $"{d.Task.AuthorDescription}", 
            //        d.Task.CurrentAssignment.AssignedByMember.FullName,
            //        new GridTaskDue(d)
            //    ));
            //}

            //foreach (var c in unreadTaskChases)
            //{
            //    notices.Add(new UserAlertNotification(
            //        c.TaskDueID,
            //        TaskAlertType.TaskChase,
            //        $"{c.Task.AuthorDescription}",
            //        c.Task.CurrentAssignment.AssignedByMember.FullName,
            //        new GridTaskDue(c)
            //    ));
            //}

            //foreach (var c in unreadCommentedTasks)
            //{
            //    notices.Add(new Hubs.UserAlertNotification(
            //        c.TaskDueID,
            //        TaskAlertType.TaskCommented,
            //        $"{c.Task.MostRecentComment.Comment}",
            //        c.Task.MostRecentComment.CreatedBy.FullName,
            //        new GridTaskDue(c)
            //    ));
            //}

            //foreach (var c in unreadTaskCompletions)
            //{
            //    notices.Add(new UserAlertNotification(
            //        c.TaskDueID,
            //        TaskAlertType.TaskCompleted,
            //        $"{c.Task.MostRecentComment.Comment}",
            //        c.Task.MostRecentComment.CreatedBy.FullName,
            //        new GridTaskDue(c)
            //    ));
            //}

            //foreach (var c in unreadTaskExpectedDeliveryChanges)
            //{
            //    notices.Add(
            //        new UserAlertNotification(
            //            c.TaskDueID,
            //            TaskAlertType.ExpectedDeliveryChanged,
            //            $"{c.Task.AuthorDescription} - {c.ExpectedDeliveryDT?.ToString("dd/MM/yyyy")}",
            //            c.Task.OwnerMember.FullName,
            //            data: new GridTaskDue(c)
            //        ));
            //}

            //Clients.User(userId.ToString()).setAlerts(notices);
        }
    }

    internal class TaskDueComparer : IEqualityComparer<TaskDue>
    {
        public bool Equals(TaskDue x, TaskDue y)
        {
            return x.TaskDueID == y.TaskDueID;
        }

        public int GetHashCode(TaskDue obj)
        {
            if (obj == null)
                return 0;

            return obj.TaskDueID.GetHashCode();
        }
    }

    public class UserAlertNotification

    {
        public TaskAlertType alertType { get; set; }
        public string message { get; set; }
        public long id { get; set; }
        public string source { get; set; }
        public object data { get; set; }

        public UserAlertNotification(long id, TaskAlertType alertType, string message, string source, object data)
        {
            this.id = id;
            this.alertType = alertType;
            this.message = message;
            this.source = source;
            this.data = data;
        }
    }
}