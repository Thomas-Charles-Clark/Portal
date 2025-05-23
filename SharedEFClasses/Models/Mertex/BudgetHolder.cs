using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("BudgetHolder", Schema = "Mertex")]
    public class BudgetHolder
    {
        [Key]
        public string Code { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public int? MemberID { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        [ForeignKey("MemberID")]
        public virtual Member Member { get; set; }
        /*
         
         [Code] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL,
[Name] [nvarchar] (50) COLLATE Latin1_General_CI_AS NULL,
[Email] [nvarchar] (256) COLLATE Latin1_General_CI_AS NULL,
[MemberID] [int] NULL,
[CreatedDT] [datetime2] (2) NOT NULL CONSTRAINT [DF_Mertex_BudgetHolder_CreatedDT] DEFAULT (sysdatetime()),
[ModifiedDT] [datetime2] (2) NOT NULL CONSTRAINT [DF_Mertex_BudgetHolder_ModifiedDT] DEFAULT (sysdatetime())

         */
    }
}
