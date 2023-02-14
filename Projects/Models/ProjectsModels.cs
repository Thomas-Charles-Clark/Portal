using Newtonsoft.Json;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Projects.Models
{
    public class ProjectDashboardResult
    {
        public int Preparation { get; set; }
        public int Specification { get; set; }
        public int Quote { get; set; }
        public int Order { get; set; }
        public int Lost { get; set; }
        public int All { get; set; }
        
        public decimal PreparationValue { get; set; }
        public decimal SpecificationValue { get; set; }
        public decimal QuoteValue { get; set; }
        public decimal OrderValue { get; set; }
        public decimal LostValue { get; set; }
        public decimal AllValue { get; set; }
    }

    public class ProjectGridResult
    {
        public List<ProjectGridRecord> Results { get; set; } 
    }

    public class ProjectGridRecord
    {
        public int ProjectID { get; set; }
    }
}