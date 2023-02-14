using Newtonsoft.Json;
using SharedEFClasses.Models.Products;
using SharedEFClasses.ReturnModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("ClaimLine", Schema = "Mertex")]
    public class ClaimLine
    {
        [Key]
        public string ClaimLineID { get; set; }

        public string ClaimID { get; set; }

        public string OrderLineID { get; set; }

        public string ProductCode { get; set; }

        public string FaultCode { get; set; }

        public string InvoiceNumber { get; set; }

        public DateTime? InvoiceDT { get; set; }

        public decimal? ClaimQuantity { get; set; }

        public decimal? AcceptedQuantity { get; set; }

        public decimal? ReturnedQuantity { get; set; }

        public decimal? CreditAmount { get; set; }

        public bool? ReturnToStock { get; set; }

        public decimal? OrderPriceSterlingEx { get; set; }

        public decimal? DiscountPercentage { get; set; }

        public string Notes { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public DateTime? CompletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Completed { get; set; }

        public string ErrorDetails { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Error { get; set; }

        [JsonIgnore]
        [ForeignKey("ClaimID")]
        public virtual ClaimHead ClaimHead { get; set; }


        [JsonIgnore]
        [InverseProperty("ClaimLine")]
        public virtual ICollection<ReturnParcel_Product> Products { get; set; }

        [NotMapped]
        public Product Product
        {
            get
            {
                return new PortalDbContext().Products.Where(p => p.Code == ProductCode).SingleOrDefault();
            }
        }
    }
}
