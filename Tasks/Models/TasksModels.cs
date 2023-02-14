using Newtonsoft.Json;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Tasks.Models
{
    public class TaskDashboardResult
    {
        public int Unread { get; set; }
        public int UnreadCompleted { get; set; }
        public int UnreadExternal { get; set; }
        public int Urgent { get; set; }
        public int UrgentCompleted { get; set; }
        public int UrgentExternal { get; set; }
        public int Chased { get; set; }
        public int ChasedCompleted { get; set; }
        public int ChasedExternal { get; set; }
        public int Overdue { get; set; }
        public int OverdueCompleted { get; set; }
        public int OverdueExternal { get; set; }

        public int DueToday { get; set; }
        public int DueTodayCompleted { get; set; }
        public int DueTodayExternal { get; set; }
        public int DueThisWeek { get; set; }
        public int DueThisWeekCompleted { get; set; }
        public int DueThisWeekExternal { get; set; }
        public int DueThisMonth { get; set; }
        public int DueThisMonthCompleted { get; set; }
        public int DueThisMonthExternal { get; set; }
        public int CurrentWorkloadTotal { get; set; }
        public int CurrentWorkloadTotalCompleted { get; set; }
        public int CurrentWorkloadTotalExternal { get; set; }

        public int AllTimeTotal { get; set; }
        public int AllTimeTotalExternal { get; set; }

        public int PipelineDue30 { get; set; }
        public int PipelineDue30Completed { get; set; }
        public int PipelineDue30External { get; set; }
        public int PipelineDue60 { get; set; }
        public int PipelineDue60Completed { get; set; }
        public int PipelineDue60External { get; set; }
        public int PipelineDue90 { get; set; }
        public int PipelineDue90Completed { get; set; }
        public int PipelineDue90External { get; set; }
        public int PipelineDue120Plus { get; set; }
        public int PipelineDue120PlusCompleted { get; set; }
        public int PipelineDue120PlusExternal { get; set; }
    }

    public class TaskGridResult
    {
        public List<TaskGridRecord> Results { get; set; } 
    }

    public class TaskGridRecord
    {
        public long TaskDueID { get; set; }
    }
}