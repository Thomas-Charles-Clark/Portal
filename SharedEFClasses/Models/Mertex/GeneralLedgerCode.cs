using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertex
{
    [Table("GeneralLedgerCode", Schema = "Mertex")]
    public class GeneralLedgerCode
    {
        [Key]
        public string Code { get; set; }

        public string AccountCode { get; set; }

        public string ReportingGroup { get; set; }

        public string AccountType { get; set; }

        public string AnalysisCodeD { get; set; }

        public string AnalysisCodeDescription { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string DisplayLabel { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("AccountType")]
        public virtual GeneralLedgerAccountType Type { get; set; }

        [ForeignKey("AnalysisCodeD")]
        public virtual GeneralLedgerAnalysisGroupD GroupD { get; set; }
    }
}
