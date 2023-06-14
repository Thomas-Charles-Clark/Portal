using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [Table("SalesDivision", Schema = "Maintenance")]
    public class SalesDivision
    {
        [Key]
        public string SalesDivisionCode { get; set; }
        public string Name { get; set; }
    }
}
