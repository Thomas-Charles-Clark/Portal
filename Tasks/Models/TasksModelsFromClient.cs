using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Tasks.Models
{
    public class PassNewExternalStatus
    {
        public int ExternalCompanyID { get; set; }
        public string Name { get; set; }
    }

    public class PassExternalStatusAutocomplete
    {
        public int ExternalCompanyID { get; set; }
        public string Term { get; set; }
    }

    public class PassClientTaskAttribution
    {
        public string Type { get; set; }
        public int ID { get; set;}
    }

    public class PassTaskDashboardFilters
    {
        public int? CreatedByMemberID { get; set; }
        public short? CreatedByDepartmentID { get; set; }
        public byte? CreatedByLocationID { get; set; }

        public int? AssignedToMemberID { get; set; }
        public short? AssignedToDepartmentID { get; set; }
        public byte? AssignedToLocationID { get; set; }

        public byte? TaskStatusID { get; set; }
        public int? ProjectID { get; set; }
        public byte? TaskTypeID { get; set; }
    }

    public class PassTaskGridFilters : PassTaskDashboardFilters
    {
        public string Widget { get; set; }
        public bool ShowCompleted { get; set; }
    }

    public class PassNewTask
    {
        public bool Recurring { get; set; }

        public bool Urgent { get; set; }
        public bool Core { get; set; }
        public string AuthorDescription { get; set; }
        public DateTime? DueDate { get; set; }
        public int AssignedToMemberID { get; set; }
        public string Comment { get; set; }
        public int? ProjectID { get; set; }
        public short? TaskTypeID { get; set; }

        public int? ExternalCompanyID { get; set; }
        public short? ExternalStatusID { get; set; }
        public string ExternalContact { get; set; }
        public string ExternalReference { get; set; }
        public string ExternalPhone { get; set; }
        public string ExternalEmail { get; set; }

        public PassSchedule Schedule { get; set; }

        public string UploadGUID { get; set; }
        public List<string> Attachments { get; set; }

        public PassNewTask()
        {
            Attachments = new List<string>();
        }
    }

    public class PassSchedule
    {
        public PassScheduleType ScheduleType { get; set; }
        public byte Interval { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public List<PassSchedule_Day> Days { get; set; }
        public PassScheduleFrequency Frequency { get; set; }
    }

    public class PassScheduleType
    {
        public byte ScheduleTypeID { get; set; }
    }

    public class PassSchedule_Day
    {
        public byte DayID { get; set; }
    }

    public class PassScheduleFrequency
    {
        public byte ScheduleFrequencyID { get; set; }
    }

    public class PassUpdateTask
    {
        public int TaskID { get; set; }
        public long TaskDueID { get; set; }
        public string OwnerDescription { get; set; }
        public DateTime? ExpectedDelivery { get; set; }
        public byte? TaskTypeID { get; set; }
        public int OwnerMemberID { get; set; }
        public int? ExternalCompanyID { get; set; }
        public short? ExternalStatusID { get; set; }
        public string ExternalContact { get; set; }
        public string ExternalReference { get; set; }
        public string ExternalPhone { get; set; }
        public string ExternalEmail { get; set; }
        public string NewComment { get; set; }
        public int? ProjectID { get; set; }

        public string UploadGUID { get; set; }
        public List<string> Attachments { get; set; }

        public PassUpdateTask()
        {
            Attachments = new List<string>();
        }
    }

    public class PassTaskCompletion
    {
        public long TaskDueID { get; set; }
        public string CompletedComment { get; set; }
    }

    public class PassTaskDueID
    {
        public long TaskDueID { get; set; }
    }

    public class PassTaskAttachmentID
    {
        public int TaskAttachmentID { get; set; }
    }
}