using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderEntry
{
	public class PassFetchProductsByBrandProductType
	{
		public int tradeAccountId { get; set; }

		public byte brandId { get; set; }

		public byte productTypeId { get; set; }
	}
}
