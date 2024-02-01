using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.ContractPricing
{
    public class ContractManagement_ContractList_SelectResult
    {
        public string TradeAccountContractJSON { get; set; }

        public object tradeAccountContractJson
        {
            get
            {
                return JsonConvert.SerializeObject(TradeAccountContractJSON);
            }
        }

        public string TradeAccountGroupContractJSON { get; set; }

        public object tradeAccountGroupContractJson
        {
            get
            {
                return JsonConvert.SerializeObject(TradeAccountGroupContractJSON);
            }
        }
    }
}
