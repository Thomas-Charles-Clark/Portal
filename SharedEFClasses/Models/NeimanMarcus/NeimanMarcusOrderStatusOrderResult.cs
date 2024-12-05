using Newtonsoft.Json;

using Org.BouncyCastle.Bcpg;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.NeimanMarcus
{
    public class NeimanMarcusOrderStatusOrderResult
    {
        public DateTime OrderDT { get; set; }

        public string NeimanMarcus_OrderID { get; set; }

        public string DSCO_OrderID { get; set; }

        public string DG_OrderID { get; set; }

        public string ProductCode { get; set; }

        public decimal Quantity { get; set; }

        public string SummaryStatus { get; set; }

        public string OrderDetails { get; set; }

        public string ReceivedCell { get; set; }

        public string ExplodedCell { get; set; }

        public string ImportedCell { get; set; }

        public string VerifiedCell { get; set; }

        public string AcknowledgedCell { get; set; }

        public string DropShipCell { get; set; }

        public string ShippedCell { get; set; }

        public string InvoicedCell { get; set; }

        public string CancelledCell { get; set; }

        public string ReceivedDetails { get; set; }

        public string ExplodedDetails { get; set; }

        public string ImportedDetails { get; set; }

        public string VerifiedDetails { get; set; }

        public string AcknowledgedDetails { get; set; }

        public string DropShipDetails { get; set; }

        public string ShippedDetails { get; set; }

        public string InvoicedDetails { get; set; }

        public string CancelledDetails { get; set; }

        /*
        public bool Received { get; set; }
		public bool Exploded { get; set; }			 
		public bool Imported { get; set; }
		public bool Verified { get; set; }
		public bool AcknowledgementRequested { get; set; }
		public bool AcknowledgementConfirmed { get; set; }
		public bool AcknowledgementError { get; set; }
		public bool Despatched { get; set; }
		public bool DropShipRequested { get; set; }
		public bool DropShipConfirmed { get; set; }
		public bool CancellationRequested { get; set; }
		public bool CancellationConfirmed { get; set; }
		public bool CancellationError { get; set; }
		public bool ShippedRequested { get; set; }
		public bool ShippedConfirmed { get; set; }
		public bool InvoiceRequested { get; set; }
		public bool InvoiceAccepted AS InvoiceConfirmed { get; set; }
		public bool InvoiceError { get; set; }
        */

        /*
        public DateTime ReceivedDT { get; set; }
		public DateTime ExplodedDT { get; set; }          
		public DateTime ImportedDT { get; set; }         
		public DateTime VerifiedDT { get; set; }
		public DateTime AcknowledgementRequestedDT { get; set; }
		public DateTime AcknowledgementConfirmedDT { get; set; }
		public DateTime AcknowledgementErrorDT { get; set; }
		public DateTime ertexDespatchedDT AS DespatchedDT { get; set; }
		public DateTime ScanGloablLogisticsNotifiedDT { get; set; }
		public DateTime ScanGlobalLogisticsTrackingNumberReceivedDT { get; set; }
		public DateTime CancellationRequestedDT { get; set; }
		public DateTime CancellationConfirmedDT { get; set; }
		public DateTime ShippedRequestedDT { get; set; }
		public DateTime ShippedConfirmedDT { get; set; }
		public DateTime InvoiceRequestedDT { get; set; }
		public DateTime InvoiceAcceptedDT AS InvoiceConfirmedDT { get; set; }
		public DateTime InvoiceErrorDT { get; set; }	
         */
    }
}
