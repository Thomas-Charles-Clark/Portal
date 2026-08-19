using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderEntry
{
	public class Product_SelectByBrandProductTypeResult
	{
		public int ProductID { get; set; }
		public string Code { get; set; }
		public string Name { get; set; }
		public decimal? FreeStock { get; set; }
		public string StockStatus { get; set; }
		public decimal? POFreeStock { get; set; }
		public DateTime? PODueDate { get; set; }
		public long? ImageID { get; set; }
		public decimal? RollLength { get; set; }
	}
}
