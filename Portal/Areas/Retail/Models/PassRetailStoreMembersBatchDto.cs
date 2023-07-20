using SharedEFClasses.Models.Retail;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Portal.Areas.Retail.Models
{
    public class RetailStoreMemberCreation
    {
        [StringLength(10)]
        public string Title { get; set; }

        [StringLength(50)]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string LastName { get; set; }

        [StringLength(100)]
        public string PersonalisationName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        [StringLength(256)]
        public string Email { get; set; }

        [StringLength(100)]
        public string Store { get; set; }

        [StringLength(100)]
        public string SaleRepresentative { get; set; }

        [StringLength(50)]
        public string Status { get; set; }
    }

    public class RetailStoreMemberUpdate
    {
        public int RetailStoreMemberID { get; set; }

        [StringLength(10)]
        public string Title { get; set; }

        [StringLength(50)]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string LastName { get; set; }

        [StringLength(100)]
        public string PersonalisationName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        [StringLength(256)]
        public string Email { get; set; }

        [StringLength(100)]
        public string Store { get; set; }

        [StringLength(100)]
        public string SaleRepresentative { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        public bool Deleted { get; set; }
    }

    public class PassRetailStoreMembersCreationBatchDto
    {
        public List<RetailStoreMemberCreation> models { get; set; }
    }

    public class PassRetailStoreMembersBatchDto
    {
        public List<RetailStoreMemberUpdate> models { get; set; }
    }
}