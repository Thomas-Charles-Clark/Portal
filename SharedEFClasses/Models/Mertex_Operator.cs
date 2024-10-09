using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("Mertex_Operator", Schema = "adm")]
    public class Mertex_Operator
    {
        [Key]
        public string OperatorCode { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        [NotMapped]
        public string Label
        {
            get
            {
                return $"{OperatorCode} - {Name} - {Email}";
            }
        }
    }
}
