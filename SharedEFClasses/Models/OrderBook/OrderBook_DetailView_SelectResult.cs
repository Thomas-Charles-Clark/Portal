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
        public DateTime AccurateAsOfDT { get; set; }
        public object Data { get; set; }
        public object Columns { get; set; }
    }
}
