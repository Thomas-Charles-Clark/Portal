using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementUpsertDto
    {
        public int BranchID { get; set; }

        public IEnumerable<RangeManagementProductUpsert> Range { get; set; }
    }
}
