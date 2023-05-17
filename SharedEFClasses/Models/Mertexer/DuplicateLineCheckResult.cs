using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    public class DuplicateLineCheckResult
    {
        public bool isCurrentBasketDuplicate { get; set; }
        public List<string> orderNumbers { get; set; }

        public DuplicateLineCheckResult()
        {
            isCurrentBasketDuplicate = false;
            orderNumbers = new List<string>();
        }
        public bool isDuplicate
        {
            get
            {
                return (orderNumbers?.Any() ?? false) || isCurrentBasketDuplicate;
            }
        }
    }
}
