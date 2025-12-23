using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SharedEFClasses.Models.Mertexer
{
    [Table("CreditController", Schema = "Maintenance")]
    public class CreditController
    {
        [Key]
        public string CreditControllerCode { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Region { get; set; }

        public int? MemberID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
    }
}
