using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Parcel
{
    [Table("ParcelType", Schema = "parcel")]
    public class ParcelType
    {
        [Key]
        public byte ParcelTypeID { get; set; }

        public string Name { get; set; }
    }
}
