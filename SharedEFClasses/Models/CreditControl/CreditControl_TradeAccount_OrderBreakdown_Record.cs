using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_OrderBreakdown_Record
	{
		public string OrderLineID { get; set; }
		public string OrderID { get; set; }
		public DateTime? OrderDate { get; set; }
		public string DataSource { get; set; }
		public int ProductID { get; set; }
		public string ProductCode { get; set; }
		public string ProductName { get; set; }
		public decimal? QuantityOrdered { get; set; }
		public decimal? LineValueSterling { get; set; }
	}
}
