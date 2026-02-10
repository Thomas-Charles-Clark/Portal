using Dapper;

using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.Payments
{
	public class SupplierPaymentRequest_PurchaseOrderRecord
	{
		public int PaymentRequestID { get; set; }

		public string PurchaseOrderHeadID { get; set; }
	}

	public class SupplierPaymentRequest_PurchaseOrderRecord_TypeHandler : SqlMapper.TypeHandler<SupplierPaymentRequest_PurchaseOrderRecord>
	{
		public override SupplierPaymentRequest_PurchaseOrderRecord Parse(object value)
		{
			return JsonConvert.DeserializeObject<SupplierPaymentRequest_PurchaseOrderRecord>(value.ToString());
		}

		public override void SetValue(IDbDataParameter parameter, SupplierPaymentRequest_PurchaseOrderRecord value)
		{
			parameter.Value = (value == null)
				? (object)DBNull.Value
				: JsonConvert.SerializeObject(value);
			parameter.DbType = DbType.String;
		}
	}
}
