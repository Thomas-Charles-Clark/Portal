using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models.NeimanMarcus
{
    public class NeimanMarcusOrderStatusGridDto
    {
        public char? status { get; set; }
        public DateTime? fromDate { get; set; }
        public DateTime? toDate { get; set; }
        public sbyte? dateRangeId { get; set; }
        public string searchTerm { get; set; }
    }
}