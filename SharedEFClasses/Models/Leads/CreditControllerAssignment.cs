using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Leads
{
    [Table("CreditControllerAssignment", Schema = "Maintenance")]
    public class CreditControllerAssignment
    {
        [Key]
        public int CreditControllerAssignmentID { get; set; }
    
        public string CreditControllerCode { get; set; }

        public string Name { get; set; }

        public string EmailAddress { get; set; }

        public byte? SalesMarketID { get; set; }

        public byte? LanguageID { get; set; }

        public int? TradeAccountGroupID { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
    }
}
