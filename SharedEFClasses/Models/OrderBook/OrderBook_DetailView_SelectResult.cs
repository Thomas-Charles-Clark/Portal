using Microsoft.Owin.Security;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_DetailView_SelectResult
    {
        public IEnumerable<OrderBook_DetailView_DataRow> Data { get; set; }
    }
}
