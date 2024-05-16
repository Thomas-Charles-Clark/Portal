using Newtonsoft.Json;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("Task", Schema = "portal")]
    public class PortalTask
    {
        [Key]
        public int TaskID { get; set; }
        public int AuthorMemberID { get; set; }
        public string AuthorDescription { get; set; }
        public int OwnerMemberID { get; set; }
        public string OwnerDescription { get; set; }
        public DateTime OwnerAssignedDT { get; set; }
        public int? ProjectID { get; set; }
        public short? TaskTypeID { get; set; }
        public bool Urgent { get; set; }
        public bool Core { get; set; }
        public int? ExternalCompanyID { get; set; }
        public string ExternalContact { get; set; }
        public string ExternalPhone { get; set; }
        public string ExternalEmail { get; set; }
        public string ExternalReference { get; set; }
        public short? ExternalStatusID { get; set; }
        public bool ExternallyAssigned { get; set; }
        //public DateTime? ReadDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime? LastModifiedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public long? ScheduleID { get; set; }

        public virtual TaskType TaskType { get; set; }

        [JsonIgnore]
        public virtual Project Project { get; set; }

        public virtual Member Author { get; set; }

        public virtual Member OwnerMember { get; set; }

        public virtual ExternalCompany OwnerExternalCompany { get; set; }

        public virtual ExternalStatus ExternalStatus { get; set; }

        public virtual ICollection<TaskAssignmentHistory> TaskAssignmentHistory { get; set; }

        [NotMapped]
        public TaskAssignmentHistory CurrentAssignment
        {
            get
            {
                return TaskAssignmentHistory.OrderByDescending(p => p.AssignmentDT).First();
            }
        }

        [NotMapped]
        [JsonIgnore]
        public TaskDue NextDue
        {
            get
            {
                return TaskDues.OrderBy(p => p.Due).First();
            }
        }

        [ForeignKey("ScheduleID")]
        public virtual Schedule Schedule { get; set; }

        [InverseProperty("Task")]
        public virtual ICollection<TaskComment> Comments { get; set; }

        [InverseProperty("Task")]
        [JsonIgnore]
        public virtual ICollection<TaskDue> TaskDues { get; set; }

        [InverseProperty("Task")]
        public virtual ICollection<TaskChase> Chases { get; set; }

        [NotMapped]
        public TaskComment MostRecentComment
        {
            get
            {
                return Comments?.OrderByDescending(p => p.CreatedDT).FirstOrDefault();
            }
        }

        [InverseProperty("Task")]
        public virtual ICollection<Task_Attachment> Attachments { get; set; }
    }

    [Table("TaskType", Schema = "portal")]
    public class TaskType
    {
        [Key]
        public short TaskTypeID { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<PortalTask> Tasks { get; set; }
    }

    [Table("TaskStatus", Schema = "portal")]
    public class TaskStatus
    {
        [Key]
        public byte TaskStatusID { get; set; }
        public byte TaskStatusGroupID { get; set; }
        public string Name { get; set; }

        public virtual TaskStatusGroup TaskStatusGroup { get; set; }

        //[JsonIgnore]
        //public virtual ICollection<TaskDue> TaskDues { get; set; }
    }

    [Table("TaskStatusGroup", Schema = "portal")]
    public class TaskStatusGroup
    {
        [Key]
        public byte TaskStatusGroupID { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<TaskStatus> TaskStatuses { get; set; }
    }

    [Table("ExternalStatus", Schema = "portal")]
    public class ExternalStatus
    {
        [Key]
        public short ExternalStatusID { get; set; }

        public int ExternalCompanyID { get; set; }
        
        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        [JsonIgnore]
        public virtual ExternalCompany Company { get; set; }

        [JsonIgnore]
        public virtual ICollection<PortalTask> Tasks { get; set; }
    }

    [Table("ExternalCompany", Schema = "portal")]
    public class ExternalCompany
    {
        [Key]
        public int ExternalCompanyID { get; set; }
        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<ExternalStatus> Statuses { get; set; }

        [JsonIgnore]
        public virtual ICollection<PortalTask> CurrentlyAssignedTasks { get; set; }
    }

    [Table("TaskAssignmentHistory", Schema = "portal")]
    public class TaskAssignmentHistory
    {
        [Key]
        public long TaskAssignmentHistoryID { get; set; }
        public int TaskID { get; set; }
        public int? AssignedToMemberID { get; set; }
        public DateTime AssignmentDT { get; set; }
        public int AssignedByMemberID { get; set; }

        [JsonIgnore]
        public virtual PortalTask Task { get; set; }

        [ForeignKey("AssignedToMemberID")]
        public virtual Member AssignedToMember { get; set; }

        [ForeignKey("AssignedByMemberID")]
        public virtual Member AssignedByMember { get; set; }
    }

    [Table("ScheduleType", Schema = "Portal")]
    public class ScheduleType
    {
        [Key]
        public byte ScheduleTypeID { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Schedule> Schedules { get; set; }
    }

    [Table("Schedule", Schema = "Portal")]
    public class Schedule
    {
        [Key]
        public long ScheduleID { get; set; }

        public byte ScheduleTypeID { get; set; }

        public byte? ScheduleFrequencyID { get; set; }

        public byte Interval { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("ScheduleFrequencyID")]
        public virtual ScheduleFrequency ScheduleFrequency { get; set; }

        [ForeignKey("ScheduleTypeID")]
        public virtual ScheduleType ScheduleType { get; set; }

        public virtual ICollection<Schedule_Day> Schedule_Days { get; set; }
    }

    [Table("Schedule_Day", Schema = "Portal")]
    public class Schedule_Day
    {
        [Key]
        [Column(Order = 1)]
        public long ScheduleID { get; set; }

        [Key]
        [Column(Order = 2 )]
        public byte DayID { get; set; }
        
        [ForeignKey("ScheduleID")]
        [JsonIgnore]
        public virtual Schedule Schedule { get; set; }

        [ForeignKey("DayID")]
        [JsonIgnore]
        public virtual Day Day { get; set; }
    }

    [Table("ScheduleFrequency", Schema = "Portal")]
    public class ScheduleFrequency
    {
        [Key]
        public byte ScheduleFrequencyID { get; set; }

        public string Name { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<Schedule> Schedules { get; set; }
    }

    [Table("Day", Schema = "Portal")]
    public class Day
    {
        [Key]
        public byte DayID { get; set; }

        public string Name { get; set; }

        public byte SortOrder { get; set; }
        
        public virtual ICollection<Schedule_Day> Schedule_Days { get; set; }
    }

    [Table("TaskComment", Schema = "portal")]
    public class TaskComment
    {
        [Key]
        public long TaskCommentID { get; set; }

        public int TaskID { get; set; }

        public string Comment { get; set; }

        public int CreatedMemberID { get; set; }
        
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }
        
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("TaskID")]
        [JsonIgnore]
        public virtual PortalTask Task { get; set; }

        [ForeignKey("CreatedMemberID")]
        public virtual Member CreatedBy { get; set; }
    }

    [Table("TaskDue", Schema = "Portal")]
    public class TaskDue
    {
        [Key]
        public long TaskDueID { get; set; }

        public int TaskID { get; set; }
        
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public byte? TaskStatusID { get; set; }

        public DateTime? ReadDT { get; set; }

        public DateTime Due { get; set; }

        public DateTime? ExpectedDeliveryDT { get; set; }

        public DateTime? ExpectedDeliveryChangedReadDT { get; set; }

        public int ChaseCount { get; set; }

        public DateTime? LastChaseDT { get; set; }

        public DateTime? ChaseReadDT { get; set; }

        public int? NewCommentTargetMemberID { get; set; }

        public DateTime? NewCommentReadDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public string CompletedComment { get; set; }

        public DateTime? CompletedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("TaskID")]
        public virtual PortalTask Task { get; set; }

        [NotMapped]
        public object Project
        {
            get
            {
                return new
                {
                    Name = Task.Project?.Name,
                    Readonly = true
                };
            }
        }

        //[ForeignKey("TaskStatusID")]
        //public virtual TaskStatus TaskStatus { get; set; }
    }

    [Table("TaskChase", Schema = "portal")]
    public class TaskChase
    {
        [Key]
        public long TaskChaseID { get; set; }

        public int TaskID { get; set; }

        public int CreatedMemberID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        [ForeignKey("TaskID")]
        [JsonIgnore]
        public virtual PortalTask Task { get; set; }

        [ForeignKey("CreatedMemberID")]
        [JsonIgnore]
        public virtual Member ChasedBy { get; set; }
    }
    
    /// <summary>
    /// Yes, I know it looks crazy. This is so that Telerik's ToDataSourceResult can access the properties of the Task object
    /// despite actually being handed a TaskDue... or something like that.
    /// </summary>
    public class GridTaskDue
    {
        public TaskDue TaskDue { get; set; }
        public PortalTask Task { get; set; }

        public GridTaskDue(TaskDue taskDue)
        {
            TaskDue = taskDue;
            Task = taskDue.Task;
        }

        public long TaskDueID { get { return TaskDue.TaskDueID; } }
        public byte? TaskStatusID { get { return TaskDue.TaskStatusID; } }
        public DateTime Due { get { return TaskDue.Due; } }
        public DateTime? ExpectedDeliveryDT { get { return TaskDue.ExpectedDeliveryDT; } }
        public DateTime CreatedDT { get { return TaskDue.CreatedDT; } }
        public string CompletedComment { get { return TaskDue.CompletedComment; } }
        public DateTime? CompletedDT { get { return TaskDue.CompletedDT; } }
        public DateTime? DeletedDT { get { return TaskDue.DeletedDT; } }
        public bool Deleted { get { return TaskDue.Deleted; } }
        //public virtual TaskStatus TaskStatus { get { return TaskDue.TaskStatus; } }

        public int TaskID { get { return Task.TaskID; } }
        public int AuthorMemberID { get { return Task.AuthorMemberID; } }
        public string AuthorDescription { get { return Task.AuthorDescription; } }
        public int OwnerMemberID { get { return Task.OwnerMemberID; } }
        public string OwnerDescription { get { return Task.OwnerDescription; } }
        public DateTime OwnerAssignedDT { get { return Task.OwnerAssignedDT; } }
        public int? ProjectID { get { return Task.ProjectID; } }
        public short? TaskTypeID { get { return Task.TaskTypeID; } }
        public bool Urgent { get { return Task.Urgent; } }
        public bool Core { get { return Task.Core; } }
        public int ChaseCount { get { return TaskDue.ChaseCount; } }
        public int? ExternalCompanyID { get { return Task.ExternalCompanyID; } }
        public string ExternalContact { get { return Task.ExternalContact; } }
        public string ExternalPhone { get { return Task.ExternalPhone; } }
        public string ExternalEmail { get { return Task.ExternalEmail; } }
        public string ExternalReference { get { return Task.ExternalReference; } }
        public short? ExternalStatusID { get { return Task.ExternalStatusID; } }
        public DateTime? ReadDT { get { return TaskDue.ReadDT; } }
        public DateTime? LastModifiedDT { get { return Task.LastModifiedDT; } }
        public long? ScheduleID { get { return Task.ScheduleID; } }
        public virtual TaskType TaskType { get { return Task.TaskType; } }
        public virtual Project Project { get { return Task.Project; } }
        public virtual Member Author { get { return Task.Author; } }
        public virtual Member OwnerMember { get { return Task.OwnerMember; } }
        public virtual ExternalCompany OwnerExternalCompany { get { return Task.OwnerExternalCompany; } }
        public virtual ExternalStatus ExternalStatus { get { return Task.ExternalStatus; } }
        public virtual ICollection<TaskAssignmentHistory> TaskAssignmentHistory { get { return Task.TaskAssignmentHistory; } }
        public TaskAssignmentHistory CurrentAssignment { get { return Task.CurrentAssignment; } }
        public DateTime AssignmentDT { get { return CurrentAssignment.AssignmentDT; } }
        public int AssignedByMemberID { get { return CurrentAssignment.AssignedByMemberID; } }
        public int? AssignedToMemberID { get { return CurrentAssignment.AssignedToMemberID; } }
        public TaskDue NextDue { get { return Task.NextDue; } }
        public virtual Schedule Schedule { get { return Task.Schedule; } }
        public virtual ICollection<TaskComment> Comments { get { return Task.Comments; } }
        public virtual ICollection<TaskDue> TaskDues { get { return Task.TaskDues; } }
        public virtual ICollection<TaskChase> Chases { get { return Task.Chases; } }
        public int? NewCommentTargetMemberID { get { return TaskDue.NewCommentTargetMemberID;  } }
        public DateTime? NewCommentReadDT { get { return TaskDue.NewCommentReadDT;  } }
        public DateTime? ExpectedDeliveryChangedReadDT { get { return TaskDue.ExpectedDeliveryChangedReadDT; } }
    }

    [Table("Task_Attachment", Schema = "portal")]
    public class Task_Attachment
    {
        [Key]
        public int TaskAttachmentID { get; set; }
        public int TaskID { get; set; }
        public string Name { get; set; }
        public string FilePath { get; set; }
        public int UploadedByMemberID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual PortalTask Task { get; set; }

        [ForeignKey("UploadedByMemberID")]
        public virtual Member UploadedByMember { get; set; }
    }

}