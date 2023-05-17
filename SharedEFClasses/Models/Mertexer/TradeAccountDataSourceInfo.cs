using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum EnquiryType
    {
        General,
        Address,
        CreditCheck,
        Invoice,
        CheckOrders,
        PlaceOrder,
        Contact,
        Account,
        EndCustomers,
        CreditControls,
        CreditStatus
    }

    public class TradeAccountDataSourceInfo
    {
        public List<EnquiryDescriptor> EnquiryTypes { get; set; }
    }

    public class EnquiryDescriptor
    {
        public EnquiryType EnquiryType { get; set; }
        public List<DataSourceCustomerReference> DataSources { get; set; }
    }

    public class DataSourceCustomerReference
    {
        public string UniVerseAccount { get; set; }
        public string CustomerReference { get; set; }
    }
}
