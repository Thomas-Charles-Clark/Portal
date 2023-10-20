using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementDataRecord
    {
        public int ProductID { get; set; }
        public string Range_Status { get; set; }
        public decimal Range_Planned { get; set; }
        public decimal Range_Actual { get; set; }
        public decimal Range_Required { get; set; }
        public decimal? Range_InProgress { get; set; }
        public decimal UnitCostPriceGBP { get; set; }
        public string Action_Recomendation { get; set; }
        public decimal Action_TransferToBranchQuantity { get; set; }
        public string Action_TransferToBranchHighlight { get; set; }
        public decimal Action_TransferToWarehouseQuantity { get; set; }
        public string Action_TransferToWarehouseHighlight { get; set; }
        public string Stock_Summary { get; set; }
        public string Stock_Cover { get; set; }
        public decimal Stock_WH_FreeStock { get; set; }
        public decimal Stock_WH_NextPOFreeStock { get; set; }
        public string Stock_WH_NextPODueDate { get; set; }
        public decimal Stock_KR_FreeStock { get; set; }
        public decimal Stock_MHS_FreeStock { get; set; }
        public decimal Stock_FW_FreeStock { get; set; }
        public decimal? Stock_RingFence { get; set; }
        public string Sales_Summary { get; set; }
        public decimal Sales_180Day_Total { get; set; }
        public decimal Sales_180Day_KR { get; set; }
        public decimal Sales_180Day_MHS { get; set; }
        public decimal Sales_180Day_FW { get; set; }
        public decimal Sales_180Day_UKEcommerce { get; set; }
        public decimal Sales_180Day_UKTrade { get; set; }
        public decimal Sales_180Day_ROWTrade { get; set; }
    }
}
