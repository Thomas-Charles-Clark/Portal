using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.UPS
{
    [Table("Consignment", Schema = "ups")]
    public class UPSConsignment
    {
        [Key]
        public int ConsignmentID { get; set; }
        public int? ReturnCollectionID { get; set; }
        public byte UPSAccountID { get; set; }
        public decimal TotalChargeEx { get; set; }
        public string CollectTaxID { get; set; }
        public string ShipmentReference1 { get; set; }
        public string ShipmentReference2 { get; set; }
        public string ShipmentIdentificationNumber { get; set; }
        public string PDFBase64 { get; set; }
        public string ChargesJSON { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? VoidedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Voided { get; set; }

        public DateTime? ReceivedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Received { get; set; }
        
        [JsonIgnore]
        [ForeignKey("ReturnCollectionID")]
        public virtual ReturnModels.ReturnCollection ReturnCollection { get; set; }
    }
}
