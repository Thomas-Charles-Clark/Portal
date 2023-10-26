using Org.BouncyCastle.Bcpg;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementProductFetchDto
    {
        public byte BranchID { get; set; }
        public byte? ProductFilterGroupID { get; set; }
        public byte? ProductFilterID { get; set; }
        public short? LaunchID { get; set; }
        public byte? BrandID { get; set; }
        public byte? StatusGroupID { get; set; }
        public string StockStatusCode { get; set; }
        public string SearchTerm { get; set; }
    }
}
