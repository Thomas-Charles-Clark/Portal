using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Payment
{
	public class PaymentRequestUpdateDTO
	{
		[JsonProperty("models")]
		public IEnumerable<PaymentRequest> Models { get; set; }
	}
}
