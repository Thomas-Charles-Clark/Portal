using SharedEFClasses.Models.Retail;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Portal.Areas.Press.Models
{
    public class PressContactCreation
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
        public string Segment { get; set; }

        [StringLength(100)]
        public string Market { get; set; }

        [StringLength(50)]
        public string Status { get; set; }
    }

    public class PressContactUpdate
    {
        public int PressContactID { get; set; }

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
        public string Segment { get; set; }

        [StringLength(100)]
        public string Market { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        public bool Deleted { get; set; }
    }

    public class PassPressContactsCreationBatchDto
    {
        public List<PressContactCreation> models { get; set; }
    }

    public class PassPressContactsBatchDto
    {
        public List<PressContactUpdate> models { get; set; }
    }
}