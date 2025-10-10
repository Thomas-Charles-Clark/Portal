using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace SharedEFClasses.Models.Documents
{
    public class PassDocumentSentReportDto
    {
        [JsonProperty("dateRangeId")]
        public int? DateRangeID { get; set; }

        [JsonProperty("fromDate")]
        public DateTime? FromDate { get; set; }

        [JsonProperty("toDate")]
        public DateTime? ToDate { get; set; }

        [JsonProperty("documentId")]
        public short? DocumentID { get; set; }

        [JsonProperty("tradeAccountId")]
        public int? TradeAccountID { get; set; }

        [JsonProperty("searchString")]
        public string SearchString { get; set; }

        [JsonProperty("sentDtSortDirection")]
        public string SentDTSortDirection { get; set; }

        [JsonProperty("page")]
        public int Page { get; set; }

        [JsonProperty("pageSize")]
        public int PageSize { get; set; }
    }
}
