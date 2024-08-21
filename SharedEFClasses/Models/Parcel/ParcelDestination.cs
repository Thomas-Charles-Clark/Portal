using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Parcel
{
    [Table("Destination", Schema = "parcel")]
    public class ParcelDestination
    {
        [Key]
        public short DestinationID { get; set; }

        public string Name { get; set; }
    }
}
