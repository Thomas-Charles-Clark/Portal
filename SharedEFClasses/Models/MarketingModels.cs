using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models.Marketing
{
    public class MarketingMessage
    {
        [Key]
        public int MarketingMessageID { get; set; }
        public string Name { get; set; }
        public string Message { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        public bool Deleted { get; set; }
    }

    #region Data Passing

    public class PassMarketingMessageID
    {
        public int MarketingMessageID { get; set; }
    }


    public class PassMarketingMessagesSearch
    {
        public string SearchTerm { get; set; }
        public string Period { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }

    public class MarketingMessagesSearchResult
    {
        public List<MarketingMessageRecord> Results { get; set; }
    }

    public class MarketingMessageRecord
    {
        public int MarketingMessageID { get; set; }
        public string Name { get; set; }
        public string Message { get; set; }
        public DateTime CreatedDT { get; set; }
    }

    public class PassMarketingMessage
    {
        public int? MarketingMessageID { get; set; }
        public string Name { get; set; }
        public string Message { get; set; }
    }
    
    #endregion
}