using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.TradeAccounts
{
	public class TradeAccountMaintenance_TradeAccount_Member_Select_Record
	{
		public string FullName { get; set; }
		public string Email { get; set; }
		public long TradeAccountMemberID { get; set; }
		public int TradeAccountID { get; set; }
		public int MemberID { get; set; }
		public DateTime CreatedDT { get; set; }
		public DateTime? ModifiedDT { get; set; }
		public DateTime? DeletedDT { get; set; }
		public bool Deleted { get; set; }
		public bool TradeAccountRegistrationComplete { get; set; }
		public bool TradePermissionAccountAdmin { get; set; }
		public bool TradePermissionPlaceOrder { get; set; }
		public bool TradePermissionRequestSample { get; set; }
		public bool TradePermissionViewAccounts { get; set; }
		public bool TradePermissionDownloadPricelistsBrochures { get; set; }
		public bool TradePermissionDownloadProductFeeds { get; set; }
		public bool CommunicationPreference_OrderNotifications { get; set; }
		public bool CommunicationPreference_DeliveryNotifications { get; set; }
		public bool CommunicationPreference_Invoices { get; set; }
		public bool CommunicationPreference_CreditNotes { get; set; }
		public bool CommunicationPreference_StatementsOfAccountAndPaymentRequests { get; set; }
		public bool CommunicationPreference_ProofOfDelivery { get; set; }
		public bool CommunicationPreference_PriceLists { get; set; }
		public bool CommunicationPreference_SalesMarketingAndPromotionalInformation { get; set; }
		public string OtherTradeAccountAssociations { get; set; }
	}
}
