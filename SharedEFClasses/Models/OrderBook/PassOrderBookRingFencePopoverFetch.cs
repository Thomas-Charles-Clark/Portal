using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    internal class PassOrderBookRingFencePopoverFetch
    {
        public IEnumerable<string> RingFenceIDs { get; set; } = Enumerable.Empty<string>();
    }
}
