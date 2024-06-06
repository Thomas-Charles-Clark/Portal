using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class PassOrderBookOrderLinePopoverFetch
    {
        public IEnumerable<string> OrderLineIDs { get; set; } = Enumerable.Empty<string>();
    }
}
