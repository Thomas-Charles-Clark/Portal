using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.NeimanMarcus
{
    public class NeimanMarcusOrderStatusTitleExplanationResult
    {

        public string ReceivedExplanation { get; set; }

        public string ExplodedExplanation { get; set; }

        public string ImportedExplanation { get; set; }

        public string VerifiedExplanation { get; set; }

        public string AcknowledgedExplanation { get; set; }

        public string PackedExplanation { get; set; }

        public string DropShipExplanation { get; set; }

        public string ShippedExplanation { get; set; }

        public string InvoicedExplanation { get; set; }

        public string CancelledExplanation { get; set; }
    }
}
