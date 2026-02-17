using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentApproval
{
	public class SupplierPaymentApproval_SelectResult
	{
		public IEnumerable<SupplierPaymentApproval_SupplierSummaryRecord> SupplierSummaryRecords { get; set; }
		public IEnumerable<SupplierPaymentApproval_SupplierDetailRecord> SupplierDetailRecords { get; set; }
		public SupplierPaymentApproval_NewCollectionProductHeadings NewCollectionProductHeadings { get; set; }
 	}
}
