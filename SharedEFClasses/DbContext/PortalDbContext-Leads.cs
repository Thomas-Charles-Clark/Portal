using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Utilities;

using SimpleImpersonation;

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Principal;

using static Kendo.Mvc.UI.UIPrimitives;

using CreditController = SharedEFClasses.Models.General.CreditController;

namespace SharedEFClasses.Models
{

    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public LeadSearchViewResult LeadSearch(PassLeadSearch objLeadSearch)
        {
            SqlParameter searchString = new SqlParameter("@SearchString", objLeadSearch.term ?? (object)DBNull.Value);
            SqlParameter countryId = new SqlParameter("@CountryID", objLeadSearch.countryId);
            SqlParameter leadStatusId = new SqlParameter("@LeadStatusID", objLeadSearch.status ?? (object)DBNull.Value);

            SqlParameter leadSourceId = new SqlParameter("@LeadSourceID", objLeadSearch.leadSourceId ?? (object)DBNull.Value);
            SqlParameter sourceMemberId = new SqlParameter("@SourceMemberID", objLeadSearch.createdBy?.MemberID ?? (object)DBNull.Value);
            SqlParameter ownerMemberId = new SqlParameter("@OwnerMemberID", objLeadSearch.assignedTo?.MemberID ?? (object)DBNull.Value);
            SqlParameter memberTypeId = new SqlParameter("@MemberTypeID", objLeadSearch.memberTypeId ?? (object)DBNull.Value);
            SqlParameter distributor = new SqlParameter("@Distributor", objLeadSearch.distributor);
            SqlParameter widget = new SqlParameter("@Widget", objLeadSearch.widget);

            switch (objLeadSearch.period)
            {
                case "today":
                    objLeadSearch.to = null;
                    objLeadSearch.from = DateTime.Now.Date;
                    break;

                case "last-30-days":
                    objLeadSearch.to = null;
                    objLeadSearch.from = DateTime.Now.AddDays(-30);
                    break;

                case "last-3-months":
                    objLeadSearch.to = null;
                    objLeadSearch.from = DateTime.Now.AddMonths(-3);
                    break;

                case "last-6-months":
                    objLeadSearch.to = null;
                    objLeadSearch.from = DateTime.Now.AddMonths(-6);
                    break;

                case "all-time":
                    objLeadSearch.to = null;
                    objLeadSearch.from = null;
                    break;

                default:
                    if (objLeadSearch.period != null)
                    {
                        var year = DateTime.Now.Year;
                        if (Int32.TryParse(objLeadSearch.period, out year))
                        {
                            // we've parsed a year... what year was it!
                            objLeadSearch.from = new DateTime(year, 1, 1);
                            if (year != DateTime.Now.Year)
                            {
                                objLeadSearch.to = new DateTime(year + 1, 1, 1);
                            }
                        }
                    }
                    break;
            }

            SqlParameter from = new SqlParameter("@From", (object)objLeadSearch.from ?? DBNull.Value);
            SqlParameter to = new SqlParameter("@To", (object)objLeadSearch.to ?? DBNull.Value);

            var result = new LeadSearchViewResult();

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Lead_Search]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add(searchString);
            cmd.Parameters.Add(countryId);
            cmd.Parameters.Add(leadStatusId);
            cmd.Parameters.Add(from);
            cmd.Parameters.Add(to);
            cmd.Parameters.Add(leadSourceId);
            cmd.Parameters.Add(sourceMemberId);
            cmd.Parameters.Add(ownerMemberId);
            cmd.Parameters.Add(memberTypeId);
            cmd.Parameters.Add(distributor);
            cmd.Parameters.Add(widget);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                var searchResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<LeadSearchResult>(reader);

                result.Leads = searchResults.ToList();

                //reader.NextResult();
                //result.TotalResultsCount = ((IObjectContextAdapter)this)
                //    .ObjectContext
                //    .Translate<int>(reader).Single();

            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                this.Database.Connection.Close();
            }
            
            result.Leads.ForEach(p => {
                p.OpenSince = PortalFramework.ToRelativeDateString(p.CreatedDT, true);
                p.Modified = p.ModifiedDT.HasValue ? PortalFramework.ToRelativeDateString(p.ModifiedDT.Value, true) : null; 
                p.TransferredToCCSince = p.TransferredToCreditControlDT.HasValue ? PortalFramework.ToRelativeDateString(p.TransferredToCreditControlDT.Value, true) : null;
            });

            return result;
        }

        public MiscCustomerSearchViewResult MiscCustomerSearch(PassCustomerSearch objSearch)
        {
            var result = new MiscCustomerSearchViewResult();
            
            var parameters = new SqlParameter[]
            {
                new SqlParameter("@SalesMarketID", objSearch?.SalesMarketID ?? (object)DBNull.Value),
                new SqlParameter("@CurrencyID", objSearch?.CurrencyID ?? (object)DBNull.Value),
                new SqlParameter("@SalesAreaID", objSearch?.SalesAreaID ?? (object)DBNull.Value),
                new SqlParameter("@TradeAccountTypeID", objSearch?.TradeAccountTypeID ?? (object)DBNull.Value),
                new SqlParameter("@SalesRepresentativeID", objSearch?.SalesRepresentativeID ?? (object)DBNull.Value),
                new SqlParameter("@SalesAgentID", objSearch?.SalesRepresentativeID ?? (object)DBNull.Value),
                new SqlParameter("@SearchString", objSearch?.searchTerm ?? (object)DBNull.Value),
                new SqlParameter("@Widget", objSearch?.widget ?? (object)DBNull.Value)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[MiscellaneousCustomer_Search]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Customers = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<MiscCustomerResult>(reader).ToList();

            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                this.Database.Connection.Close();
            }
            
            return result;
        }
        
        public CustomerSearchViewResult CustomerSearch(PassCustomerSearch objSearch)
        {
            SqlParameter salesMarketId = new SqlParameter("@SalesMarketID", objSearch?.SalesMarketID ?? (object)DBNull.Value);
            SqlParameter currencyId = new SqlParameter("@CurrencyID", objSearch?.CurrencyID ?? (object)DBNull.Value);
            SqlParameter salesAreaId = new SqlParameter("@SalesAreaID", objSearch?.SalesAreaID ?? (object)DBNull.Value);
            SqlParameter tradeAccountTypeId = new SqlParameter("@TradeAccountTypeID", objSearch?.TradeAccountTypeID ?? (object)DBNull.Value);
            SqlParameter salesRepresentativeId = new SqlParameter("@SalesRepresentativeID", objSearch?.SalesRepresentativeID ?? (object)DBNull.Value);
            SqlParameter salesAgentId = new SqlParameter("@SalesAgentID", objSearch?.SalesRepresentativeID ?? (object)DBNull.Value);
            SqlParameter searchString = new SqlParameter("@SearchString", objSearch?.searchTerm ?? (object)DBNull.Value);
            SqlParameter widget = new SqlParameter("@Widget", objSearch?.widget ?? (object)DBNull.Value);
            SqlParameter userId = new SqlParameter("@MemberID", objSearch?.userId ?? (object)DBNull.Value);
            SqlParameter pageNumber = new SqlParameter("@PageNumber", objSearch?.Page ?? 1);
            SqlParameter pageSize = new SqlParameter("@PageSize", objSearch?.PageSize ?? 10);

            var result = new CustomerSearchViewResult();

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Customer_Search]";
            cmd.CommandType = CommandType.StoredProcedure;
            
            cmd.Parameters.Add(salesMarketId);
            cmd.Parameters.Add(currencyId);
            cmd.Parameters.Add(salesAreaId);
            cmd.Parameters.Add(tradeAccountTypeId);
            
            switch (objSearch?.SalesRepOrAgent)
            {
                case true:
                    cmd.Parameters.Add(salesRepresentativeId);
                    break;
                case false:
                    cmd.Parameters.Add(salesAgentId);
                    break;
                case null:
                    cmd.Parameters.Add(salesRepresentativeId);
                    cmd.Parameters.Add(salesAgentId);
                    break;
            }

            cmd.Parameters.Add(searchString);
            cmd.Parameters.Add(widget);

            cmd.Parameters.Add(pageNumber);
            cmd.Parameters.Add(pageSize);

            var dt = new DataTable();

            dt.Columns.Add("TagID", typeof(int));

            if (objSearch.Tags != null)
            {
                objSearch.Tags.ForEach(tid =>
                {
                    dt.Rows.Add(tid);
                });
            }

            cmd.Parameters.Add(new SqlParameter("@TagIDs", dt) 
            {
                SqlDbType = SqlDbType.Structured,
                TypeName = "[dbo].[TagIDsTableType]"
            });

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Customers = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerResult>(reader).ToList();

                reader.NextResult();

                result.TotalResultsCount = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<int>(reader).Single();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                this.Database.Connection.Close();
            }

            result.Customers.ForEach(c => {
                c.VisitAddress = this.LeadAddresses.Where(p => p.LeadAddressID == c.VisitLeadAddressID).SingleOrDefault();
            });
            
            return result;
        }

        public LeadCheckResult LeadCheck(PassLeadCheck objLeadCheck)
        {
            SqlParameter companyName = new SqlParameter("@CompanyName", objLeadCheck.companyName ?? (object)DBNull.Value);
            SqlParameter fullName = new SqlParameter("@FullName", objLeadCheck.fullName ?? (object)DBNull.Value);
            SqlParameter languageId = new SqlParameter("@LanguageID", objLeadCheck.languageId);
            SqlParameter email = new SqlParameter("@Email", objLeadCheck.email ?? (object)DBNull.Value);
            SqlParameter postcode = new SqlParameter("@Postcode", objLeadCheck.postcode ?? (object)DBNull.Value);
            SqlParameter leadsPageNumber = new SqlParameter("@LeadsPageNumber", objLeadCheck.existingLeadsPageNumber);
            SqlParameter leadsPageSize = new SqlParameter("@LeadsPageSize", objLeadCheck.existingLeadsPageSize);
            SqlParameter tradeAccountsPageNumber = new SqlParameter("@TradeAccountsPageNumber", objLeadCheck.existingTradeAccountsPageNumber);
            SqlParameter tradeAccountsPageSize = new SqlParameter("@TradeAccountsPageSize", objLeadCheck.existingTradeAccountsPageSize);

            var result = new LeadCheckResult();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "[portal].[Lead_Check]";

            cmd.Parameters.Add(companyName);
            cmd.Parameters.Add(fullName);
            cmd.Parameters.Add(languageId);
            cmd.Parameters.Add(email);
            cmd.Parameters.Add(postcode);
            cmd.Parameters.Add(leadsPageNumber);
            cmd.Parameters.Add(leadsPageSize);
            cmd.Parameters.Add(tradeAccountsPageNumber);
            cmd.Parameters.Add(tradeAccountsPageSize);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.existingLeads = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<LeadCheckExistingLeadResult>(reader).ToList();

                reader.NextResult();

                result.totalLeadResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<int>(reader).Single();

                reader.NextResult();

                result.existingTradeAccounts = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<LeadCheckExistingTradeAccountResult>(reader).ToList();

                reader.NextResult();

                result.totalTradeAccountResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<int>(reader).Single();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                this.Database.Connection.Close();
            }

            result.existingLeads.ForEach(p => p.OpenSince = PortalFramework.DateTimeDistanceString(p.CreatedDT, true, false));
            result.existingTradeAccounts.ForEach(p => p.OpenSince = PortalFramework.DateTimeDistanceString(p.CreatedDT, true, false));

            return result;
        }

        public LeadUpsertResult LeadUpsert(PassLeadUpsert objLeadUpsert, int _sourceMemberId, bool shouldNotify = true)
        {
            var result = new LeadUpsertResult();

            // you *have* to use an Integrated Security connection to send emails with attachments
            var credentials = new UserCredentials("DESIGNERSGUILD\\SQLAgentFileAccess", "34949C02-4677-4711-999C-8E038E26B10F");

            var token = credentials.LogonUser(LogonType.Interactive);

            WindowsIdentity.RunImpersonated(token, () =>
            {
                using (var conn = new SqlConnection(ConfigurationManager.ConnectionStrings["VM-SQL-IntegratedConnectionString"].ConnectionString))
                {
                    if (objLeadUpsert.TradeAccountCreationEmail_Attachments?.Any() == true)
                    {
                        this.CreationEmailAttachments.RemoveRange(this.CreationEmailAttachments.Where(cea => cea.LeadID == objLeadUpsert.LeadID));

                        foreach (var tacea in objLeadUpsert.TradeAccountCreationEmail_Attachments)
                        {
                            var attachment = this.TradeAccountCreationEmailAttachments.SingleOrDefault(p => p.TradeAccountCreationEmailAttachmentID == tacea.TradeAccountCreationEmailAttachmentID);

                            if (attachment == null)
                            {
                                attachment = new TradeAccountCreationEmailAttachment()
                                {
                                    Name = tacea.name,
                                    FilePath = tacea.FinalFilePath,
                                    FileSizeBytes = tacea.fileSizeBytes,
                                    CreatedDT = DateTime.Now
                                };

                                this.TradeAccountCreationEmailAttachments.Add(attachment);

                                this.SaveChanges();

                                tacea.TradeAccountCreationEmailAttachmentID = attachment.TradeAccountCreationEmailAttachmentID;
                            }

                            this.CreationEmailAttachments.Add(new Lead_TradeAccountCreationEmailAttachment()
                            {
                                LeadID = objLeadUpsert.LeadID.Value,
                                TradeAccountCreationEmailAttachmentID = tacea.TradeAccountCreationEmailAttachmentID,
                                SortOrder = tacea.sortOrder
                            });
                        }

                        this.SaveChanges();
                    }

                    var objParams = new List<SqlParameter>()
                {
                    new SqlParameter("@LeadStatusID", objLeadUpsert.LeadStatusID ?? (object)DBNull.Value),
                    new SqlParameter("@LeadStatusReason", objLeadUpsert.LeadStatusReason ?? (object)DBNull.Value),
                    new SqlParameter("@LeadSourceID", objLeadUpsert.LeadSourceID ?? (object)DBNull.Value),
                    new SqlParameter("@StarRating", objLeadUpsert.StarRating ?? (object)DBNull.Value),
                    new SqlParameter("@LeadMagnitudeID", objLeadUpsert.LeadMagnitudeID ?? (object)DBNull.Value),
                    new SqlParameter("@LeadTypeID", objLeadUpsert.LeadTypeID ?? (object)DBNull.Value),
                    new SqlParameter("@SourceMemberID", _sourceMemberId),
                    new SqlParameter("@OwnerMemberID", objLeadUpsert.OwnerMemberID ?? (object)DBNull.Value),
                    new SqlParameter("@ChannelID", objLeadUpsert.ChannelID),
                    new SqlParameter("@Description", objLeadUpsert.Description ?? (object)DBNull.Value),
                    new SqlParameter("@AnnualRevenue", objLeadUpsert.AnnualRevenue ?? (object)DBNull.Value),
                    new SqlParameter("@CurrencyID", objLeadUpsert.CompanyCurrency?.CurrencyID ?? (object)DBNull.Value),
                    new SqlParameter("@CompanyName", objLeadUpsert.CompanyName ?? (object)DBNull.Value),
                    new SqlParameter("@CountryID", objLeadUpsert.CountryID),
                    new SqlParameter("@LanguageID", objLeadUpsert.LanguageID),
                    new SqlParameter("@VATNumber", objLeadUpsert.CompanyVATNumber ?? (object)DBNull.Value),
                    new SqlParameter("@VATCountryID", objLeadUpsert.VATCountryID ?? (object)DBNull.Value),
                    new SqlParameter("@VATNumberDisplay", objLeadUpsert.VATNumberDisplay ?? (object)DBNull.Value),
                    new SqlParameter("@EORINumber", objLeadUpsert.EORINumber ?? (object)DBNull.Value),
                    new SqlParameter("@CompanyNumber", objLeadUpsert.CompanyRegistration ?? (object)DBNull.Value),
                    new SqlParameter("@CompanyTypeID", objLeadUpsert.CompanyTypeID ?? (object)DBNull.Value),
                    new SqlParameter("@WillBuyPatternBooks", objLeadUpsert.WillBuyPatternBooks ?? (object)DBNull.Value),
                    new SqlParameter("@BankName", objLeadUpsert.BankName ?? (object)DBNull.Value),
                    new SqlParameter("@BankAddressLine1", objLeadUpsert.BankAddressLine1 ?? (object)DBNull.Value),
                    new SqlParameter("@BankAddressLine2", objLeadUpsert.BankAddressLine2 ?? (object)DBNull.Value),
                    new SqlParameter("@BankTown", objLeadUpsert.BankTown ?? (object)DBNull.Value),
                    new SqlParameter("@BankCounty", objLeadUpsert.BankCounty ?? (object)DBNull.Value),
                    new SqlParameter("@BankPostcode", objLeadUpsert.BankPostcode ?? (object)DBNull.Value),
                    new SqlParameter("@BankCountryID", objLeadUpsert.BankCountryID ?? (object)DBNull.Value),
                    new SqlParameter("@BankAccountNumber", objLeadUpsert.BankAccountNumber ?? (object)DBNull.Value),
                    new SqlParameter("@BankSortCode", objLeadUpsert.BankSortCode ?? (object)DBNull.Value),
                    new SqlParameter("@BankIBAN", objLeadUpsert.BankIBAN ?? (object)DBNull.Value),
                    new SqlParameter("@PaymentTermsID", objLeadUpsert.PaymentTermsID ?? (object)DBNull.Value),
                    new SqlParameter("@PaymentOptionID", objLeadUpsert.PaymentOptionID ?? (object)DBNull.Value),
                    new SqlParameter("@CreditLimit", objLeadUpsert.CreditLimit ?? (object)DBNull.Value),
                    new SqlParameter("@RequestedCreditLimit", objLeadUpsert.RequestedCreditLimit ?? (object)DBNull.Value),
                    new SqlParameter("@CompanyLetterHeadChecked", objLeadUpsert.CompanyLetterHeadChecked),
                    new SqlParameter("@SalesMarketID", objLeadUpsert.SalesMarketID ?? (object)DBNull.Value),
                    new SqlParameter("@SalesRepresentativeID", objLeadUpsert.SalesRepresentativeID ?? (object)DBNull.Value),
                    new SqlParameter("@SaleAgentID", objLeadUpsert.SalesAgentID ?? (object)DBNull.Value),
                    new SqlParameter("@SalesAreaID", objLeadUpsert.SalesAreaID ?? (object)DBNull.Value),
                    new SqlParameter("@TradePriceListID", objLeadUpsert.TradePriceListID ?? (object)DBNull.Value),
                    new SqlParameter("@AccountTypeID", objLeadUpsert.AccountTypeID ?? (object)DBNull.Value),
                    new SqlParameter("@CustomerTypeID", objLeadUpsert.CustomerTypeID ?? (object)DBNull.Value),
                    new SqlParameter("@HasPatternBookLibrary", objLeadUpsert.HasPatternBookLibrary ?? (object)DBNull.Value),
                    new SqlParameter("@HasShowroom", objLeadUpsert.HasShowroom ?? (object)DBNull.Value),
                    new SqlParameter("@ShowroomByAppointmentOnly", objLeadUpsert.ShowroomByAppointmentOnly ?? (object)DBNull.Value),
                    new SqlParameter("@SellOnline", objLeadUpsert.SellOnline),
                    new SqlParameter("@NumberOfPatternBooksPurchased", objLeadUpsert.NumberOfPatternBooksPurchased ?? (object)DBNull.Value),
                    new SqlParameter("@FirstOrderValue", objLeadUpsert.FirstOrderValue ?? (object)DBNull.Value),
                    new SqlParameter("@JoinedPatternBookScheme", objLeadUpsert.JoinedPatternBookScheme ?? (object)DBNull.Value),
                    new SqlParameter("@PaymentTermsNotes", objLeadUpsert.paymentTermsNotes ?? (object)DBNull.Value),
                    new SqlParameter("@Notify", shouldNotify),
                    new SqlParameter("@TradeAccountClassCode", objLeadUpsert.TradeAccountClass ?? (object)DBNull.Value),
                    new SqlParameter("@CreditControllerCode", objLeadUpsert.CreditController ?? (object)DBNull.Value),
                    new SqlParameter("@BankCode", objLeadUpsert.BankCode ?? (object)DBNull.Value),
                    new SqlParameter("@InsuredCreditLimit", objLeadUpsert.InsuredCreditLimit ?? (object)DBNull.Value),
                    new SqlParameter("@PurchaseOrderRequired", objLeadUpsert.PurchaseOrderRequired ?? (object)DBNull.Value),
                    new SqlParameter("@TradeAccountGroupCode", objLeadUpsert.TradeAccountGroup ?? (object)DBNull.Value),
                    new SqlParameter("@SalesDivisionCode", objLeadUpsert.SalesDivision ?? (object)DBNull.Value),
                    new SqlParameter("@DeliveryTermCode", objLeadUpsert.DeliveryTerms ?? (object)DBNull.Value),
                    new SqlParameter("@TaxID", objLeadUpsert.TaxID ?? (object)DBNull.Value),
                    new SqlParameter("@MertexLanguageCode", objLeadUpsert.MertexLanguageCode ?? (object)DBNull.Value),

                    new SqlParameter("@ShouldSendTradeAccountCreationEmail", objLeadUpsert.ShouldSendTradeAccountCreationEmail ?? (object)DBNull.Value),
                    new SqlParameter("@TradeAccountCreationEmail_DisplayAccountManager", objLeadUpsert.TradeAccountCreationEmail_DisplayAccountManager ?? (object)DBNull.Value),
                    new SqlParameter("@TradeAccountCreationEmail_DisplayCustomerService", objLeadUpsert.TradeAccountCreationEmail_DisplayCustomerService ?? (object)DBNull.Value),
                    new SqlParameter("@TradeAccountCreationEmail_DisplayCreditControl", objLeadUpsert.TradeAccountCreationEmail_DisplayCreditControl ?? (object)DBNull.Value),
                    new SqlParameter("@TradeAccountCreationEmail_DisplayB2BRegistration", objLeadUpsert.TradeAccountCreationEmail_DisplayB2BRegistration ?? (object)DBNull.Value),
                    new SqlParameter("@TradeAccountCreationEmail_DisplayLookbook", objLeadUpsert.TradeAccountCreationEmail_DisplayLookbook ?? (object) DBNull.Value),

                    new SqlParameter("@ShouldSendPricelists", objLeadUpsert.ShouldSendPricelists ?? (object)DBNull.Value),
                    new SqlParameter("@BelongToGroupAccount", objLeadUpsert.BelongToGroupAccount ?? (object)DBNull.Value),
                };

                    if (objLeadUpsert.OrderDocument != null &&
                        objLeadUpsert.OrderDocument.Length > 0)
                    {
                        var orderDocParam = new SqlParameter("@OrderDocument", SqlDbType.VarBinary, objLeadUpsert.OrderDocument.Length);
                        orderDocParam.Value = objLeadUpsert.OrderDocument;

                        objParams.Add(orderDocParam);
                        objParams.Add(new SqlParameter("@OrderDocumentFileType", objLeadUpsert.OrderDocumentFileType ?? (object)DBNull.Value));
                    }

                    /*
                        cmd.Parameters.Add(tradeAccountClass);
                    cmd.Parameters.Add(creditController);
                    cmd.Parameters.Add(bankCode);
                    cmd.Parameters.Add(insuredCreditLimit);
                    cmd.Parameters.Add(purchaseOrderRequired);
                    cmd.Parameters.Add(tradeAccountGroup);
                    cmd.Parameters.Add(salesDivision);
                    cmd.Parameters.Add(deliveryTerms);
                        */

                    var tradingSince = new SqlParameter("@TradingSince", DBNull.Value);
                    var leadId = new SqlParameter("@LeadID", objLeadUpsert.LeadID ?? (object)DBNull.Value);

                    leadId.Direction = ParameterDirection.InputOutput;
                    leadId.Size = 8;
                    leadId.SqlDbType = SqlDbType.BigInt;

                    // tradingSince is an interesting one: it'll hold 01/02/2016 and I have to calculate an ID from that
                    // based on how long ago it is in years
                    // so if they select < 1 year, what date should we record?
                    // just... yesterday? a month ago? six months ago, benefit of the doubt?
                    // it'll mean that they will appear to have been trading 1 year after 6 months, so... err away from
                    // giving the benefit of the doubt in this case?

                    // tradingSince, when loaded out, will be 0 to 5.
                    // if this has been changed from what it was loaded out to be, THEN update the lead record.
                    // if it has not been changed, do not change the datetime recorded.

                    // < 1 year = 0
                    // 1 to < 2 years = 1
                    // 2 to < 3 years = 2
                    // 3 to < 4 years = 3
                    // 4 to < 5 years = 4
                    // 5 to > 5 years = 5

                    if (objLeadUpsert.ShouldUpdateTradingSince)
                    {
                        DateTime? tradingSinceDT = null;

                        if (objLeadUpsert.TradingSinceID.HasValue)
                        {
                            DateTime adjust = DateTime.Now;

                            switch (objLeadUpsert.TradingSinceID.Value)
                            {
                                case 0:
                                    adjust = DateTime.Now.AddMonths(3);
                                    tradingSinceDT = new DateTime(adjust.Year, adjust.Month, 1);
                                    break;
                                case 1:
                                    adjust = DateTime.Now.AddMonths(-6);
                                    tradingSinceDT = new DateTime(adjust.Year, adjust.Month, 1);
                                    break;
                                case 2:
                                    adjust = DateTime.Now.AddYears(-1);
                                    tradingSinceDT = new DateTime(adjust.Year, adjust.Month, 1);
                                    break;
                                case 3:
                                    adjust = DateTime.Now.AddYears(-2);
                                    tradingSinceDT = new DateTime(adjust.Year, adjust.Month, 1);
                                    break;
                                case 4:
                                    adjust = DateTime.Now.AddYears(-3);
                                    tradingSinceDT = new DateTime(adjust.Year, adjust.Month, 1);
                                    break;
                                case 5:
                                    adjust = DateTime.Now.AddYears(-4);
                                    tradingSinceDT = new DateTime(adjust.Year, adjust.Month, 1);
                                    break;
                                case 6:
                                    adjust = DateTime.Now.AddYears(-5);
                                    tradingSinceDT = new DateTime(adjust.Year, adjust.Month, 1);
                                    break;
                            }

                            tradingSince.Value = tradingSinceDT;
                        }
                    }

                    var cmd = conn.CreateCommand();

                    cmd.CommandText = "[portal].[Lead_Upsert]";
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(leadId);
                    cmd.Parameters.Add(tradingSince);
                    cmd.Parameters.AddRange(objParams.ToArray());

                    try
                    {
                        conn.Open();

                        cmd.ExecuteNonQuery();

                        conn.Close();

                        result.LeadID = cmd.Parameters["@LeadID"].Value as long?;

                        List<LeadInterest> interests = new List<LeadInterest>();

                        if (objLeadUpsert.LeadInterests != null)
                        {
                            foreach (var i in objLeadUpsert.LeadInterests)
                            {
                                if (i != null)
                                {
                                    interests.Add(new LeadInterest()
                                    {
                                        LeadID = objLeadUpsert.LeadID ?? result.LeadID.Value,
                                        BrandID = i.brandId,
                                        ProductTypeGroupID = i.productTypeGroupId
                                    });
                                }
                            }
                        }

                        var l = this.Leads.Where(p => p.LeadID == (objLeadUpsert.LeadID ?? result.LeadID.Value)).Single();

                        l.LeadInterests.Clear();

                        l.LeadInterests = interests;

                        List<Lead_Competitor> competitors = new List<Lead_Competitor>();

                        if (objLeadUpsert.BrandsWorkedWith != null)
                        {
                            foreach (var i in objLeadUpsert.BrandsWorkedWith)
                            {
                                competitors.Add(new Lead_Competitor()
                                {
                                    LeadID = objLeadUpsert.LeadID ?? result.LeadID.Value,
                                    CompetitorID = i.CompetitorID
                                });
                            }
                        }

                        l.BrandsWorkedWith.Clear();

                        l.BrandsWorkedWith = competitors;

                        List<Lead_Tag> tags = new List<Lead_Tag>();

                        if (objLeadUpsert.Tags != null)
                        {
                            foreach (var i in objLeadUpsert.Tags)
                            {
                                tags.Add(new Lead_Tag()
                                {
                                    LeadID = objLeadUpsert.LeadID ?? result.LeadID.Value,
                                    TagID = i.TagID
                                });
                            }
                        }

                        l.Tags.Clear();

                        l.Tags = tags;

                        this.SaveChanges();
                    }
                    catch (SqlException e)
                    {
                        PortalFramework.LogErrorToDatabase(e);
                        throw e;
                    }
                }
            });

            return result;
        }

        public LeadPotentialUpsertResult UpsertLeadPotential(PassLeadPotential objLeadPotential)
        {
            LeadPotentialUpsertResult result = new LeadPotentialUpsertResult();

            try
            {
                if (objLeadPotential.editingPotentialId.HasValue)
                {
                    var record = this.LeadPotential.Where(p => p.LeadPotentialID == objLeadPotential.editingPotentialId).Single();

                    if (record.Potential == true && objLeadPotential.editingPotential == false)
                    {
                        record.NoPotentialDT = DateTime.Now;
                        result.NoPotentialSince = PortalFramework.DateTimeDistanceString(record.NoPotentialDT, true, true);
                    }

                    if (objLeadPotential.editingPotential == true)
                        record.NoPotentialDT = null;

                    record.Value = objLeadPotential.editingValue;
                    record.Potential = objLeadPotential.editingPotential;
                    record.FinancialYear = objLeadPotential.editingFinancialYear;
                    record.Note = objLeadPotential.editingNote;
                    
                    this.SaveChanges();

                    result.LeadPotentialID = objLeadPotential.editingPotentialId.Value;
                }
                else
                {
                    DateTime? noPotentialDt = objLeadPotential.editingPotential ? null : (DateTime?)DateTime.Now;

                    var added = this.LeadPotential.Add(new LeadPotential() {
                        Potential = objLeadPotential.editingPotential,
                        NoPotentialDT = noPotentialDt,
                        Value = objLeadPotential.editingValue,
                        FinancialYear = objLeadPotential.editingFinancialYear,
                        BrandID = objLeadPotential.editingBrandId,
                        ProductTypeGroupID = objLeadPotential.editingProductTypeGroupId,
                        LeadID = objLeadPotential.editingLeadId,
                        Note = objLeadPotential.editingNote
                    });

                    this.SaveChanges();
                    
                    result.LeadPotentialID = added.LeadPotentialID;
                    result.NoPotentialSince = PortalFramework.DateTimeDistanceString(noPotentialDt, true, true);
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                if (this.Database.Connection.State != ConnectionState.Closed)
                    this.Database.Connection.Close();
            }

            return result;
        }

        public LeadContactUpsertResult LeadContactUpsert(PassLeadContactUpsert objLeadUpsert)
        {
            SqlParameter leadContactId = new SqlParameter("@LeadContactID", SqlDbType.BigInt);
            SqlParameter decisionMaker = new SqlParameter("@DecisionMaker", objLeadUpsert.decisionMaker ?? false);
            SqlParameter leadId = new SqlParameter("@LeadID", objLeadUpsert.leadId);
            SqlParameter titleId = new SqlParameter("@TitleID", objLeadUpsert.titleId ?? (object)DBNull.Value);
            SqlParameter leadContactTypeId = new SqlParameter("@LeadContactTypeID", objLeadUpsert.leadContactTypeId ?? (object)DBNull.Value);
            SqlParameter fullName = new SqlParameter("@FullName", objLeadUpsert.fullName ?? (object)DBNull.Value);
            SqlParameter email = new SqlParameter("@Email", objLeadUpsert.email ?? (object)DBNull.Value);
            SqlParameter homePhone = new SqlParameter("@HomePhone", objLeadUpsert.homePhone ?? (object)DBNull.Value);
            SqlParameter workPhone = new SqlParameter("@WorkPhone", objLeadUpsert.workPhone ?? (object)DBNull.Value);
            SqlParameter mobilePhone = new SqlParameter("@MobilePhone", objLeadUpsert.mobilePhone ?? (object)DBNull.Value);
            SqlParameter birthday = new SqlParameter("@Birthday", objLeadUpsert.birthday ?? (object)DBNull.Value);
            SqlParameter linkedIn = new SqlParameter("@LinkedIn", objLeadUpsert.linkedIn ?? (object)DBNull.Value);
            SqlParameter skypeId = new SqlParameter("@SkypeID", objLeadUpsert.skypeId ?? (object)DBNull.Value);
            SqlParameter whatsApp = new SqlParameter("@WhatsApp", objLeadUpsert.whatsApp ?? (object)DBNull.Value);
            SqlParameter notes = new SqlParameter("@Notes", objLeadUpsert.notes ?? (object)DBNull.Value);
            SqlParameter website = new SqlParameter("@Website", objLeadUpsert.website ?? (object)DBNull.Value);
            SqlParameter facebook = new SqlParameter("@Facebook", objLeadUpsert.facebook ?? (object)DBNull.Value);
            SqlParameter twitter = new SqlParameter("@Twitter", objLeadUpsert.twitter ?? (object)DBNull.Value);
            SqlParameter pinterest = new SqlParameter("@Pinterest", objLeadUpsert.pinterest ?? (object)DBNull.Value);
            SqlParameter youTube = new SqlParameter("@YouTube", objLeadUpsert.youTube ?? (object)DBNull.Value);
            SqlParameter instagram = new SqlParameter("@Instagram", objLeadUpsert.instagram ?? (object)DBNull.Value);

            var result = new LeadContactUpsertResult();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = "[portal].[LeadContact_Upsert]";

            cmd.Parameters.Add(leadContactId);

            cmd.Parameters["@LeadContactID"].Value = objLeadUpsert.leadContactId ?? (object)DBNull.Value;
            cmd.Parameters["@LeadContactID"].Direction = ParameterDirection.InputOutput;
            
            cmd.Parameters.Add(leadId);
            cmd.Parameters.Add(decisionMaker);
            cmd.Parameters.Add(titleId);
            cmd.Parameters.Add(leadContactTypeId);
            cmd.Parameters.Add(fullName);
            cmd.Parameters.Add(email);
            cmd.Parameters.Add(homePhone);
            cmd.Parameters.Add(workPhone);
            cmd.Parameters.Add(mobilePhone);
            cmd.Parameters.Add(birthday);
            cmd.Parameters.Add(linkedIn);
            cmd.Parameters.Add(skypeId);
            cmd.Parameters.Add(whatsApp);
            cmd.Parameters.Add(notes);
            cmd.Parameters.Add(website);
            cmd.Parameters.Add(facebook);
            cmd.Parameters.Add(twitter);
            cmd.Parameters.Add(pinterest);
            cmd.Parameters.Add(youTube);
            cmd.Parameters.Add(instagram);

            try
            {
                this.Database.Connection.Open();
                
                cmd.ExecuteNonQuery();

                this.Database.Connection.Close();

                result.LeadContactID = Convert.ToInt64(cmd.Parameters["@LeadContactID"].Value);
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                if (this.Database.Connection.State != ConnectionState.Closed)
                    this.Database.Connection.Close();
            }

            return result;
        }

        public LeadAddressUpsertResult LeadAddressUpsert(PassLeadAddress objLeadAddressUpsert)
        {
            var result = new LeadAddressUpsertResult();

            SqlParameter leadId = new SqlParameter("@LeadID", objLeadAddressUpsert.leadId);
            SqlParameter leadAddressId = new SqlParameter("@LeadAddressID", SqlDbType.BigInt);
            
            DataTable leadAddressTable = new DataTable();

            leadAddressTable.Columns.Add("LeadAddressID", typeof(long));
            leadAddressTable.Columns.Add("Label", typeof(string));
            leadAddressTable.Columns.Add("AddressLine1", typeof(string));
            leadAddressTable.Columns.Add("AddressLine2", typeof(string));
            leadAddressTable.Columns.Add("Town", typeof(string));
            leadAddressTable.Columns.Add("County", typeof(string));
            leadAddressTable.Columns.Add("Postcode", typeof(string));
            leadAddressTable.Columns.Add("CountryID", typeof(short));
            leadAddressTable.Columns.Add("DefaultInvoiceAddress", typeof(bool));
            leadAddressTable.Columns.Add("DefaultDeliveryAddress", typeof(bool));
            leadAddressTable.Columns.Add("DefaultVisitAddress", typeof(bool));

            leadAddressTable.Rows.Add(
                objLeadAddressUpsert.leadAddressId,
                objLeadAddressUpsert.label,
                objLeadAddressUpsert.line1,
                objLeadAddressUpsert.line2,
                objLeadAddressUpsert.town,
                objLeadAddressUpsert.county,
                objLeadAddressUpsert.postcode,
                objLeadAddressUpsert.countryId,
                objLeadAddressUpsert.defaultInvoiceAddress,
                objLeadAddressUpsert.defaultDeliveryAddress,
                objLeadAddressUpsert.defaultVisitAddress
            );

            SqlParameter leadAddress = new SqlParameter("@LeadAddresses", leadAddressTable);

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "[portal].[LeadAddress_Upsert]";

            cmd.Parameters.Add(leadId);
            cmd.Parameters.Add(leadAddressId);
            cmd.Parameters.Add(leadAddress);

            cmd.Parameters["@LeadAddressID"].Value = objLeadAddressUpsert.leadAddressId ?? (object)DBNull.Value;
            cmd.Parameters["@LeadAddressID"].Direction = ParameterDirection.InputOutput;

            try
            {
                this.Database.Connection.Open();

                cmd.ExecuteNonQuery();

                this.Database.Connection.Close();

                result.LeadAddressID = Convert.ToInt64(cmd.Parameters["@LeadAddressID"].Value);
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                if (this.Database.Connection.State != ConnectionState.Closed)
                    this.Database.Connection.Close();
            }

            return result;
        }

        public LeadDashboardSelectResult LeadDashboardSelect(PassLeadDashboard objDashboard)
        {
            SqlParameter memberId = new SqlParameter("@MemberID", objDashboard?.member?.MemberID ?? (object)DBNull.Value);
            SqlParameter countryId = new SqlParameter("@CountryID", objDashboard?.countryId ?? (object)DBNull.Value);
            SqlParameter leadTypeId = new SqlParameter("@LeadTypeID", objDashboard?.leadTypeId ?? (object)DBNull.Value);

            var result = new LeadDashboardSelectResult();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = "[portal].[Lead_DashboardSelect]";

            cmd.Parameters.Add(memberId);
            cmd.Parameters.Add(countryId);
            cmd.Parameters.Add(leadTypeId);
            
            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<LeadDashboardSelectResult>(reader).Single();

                this.Database.Connection.Close();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                if (this.Database.Connection.State != ConnectionState.Closed)
                    this.Database.Connection.Close();
            }

            return result;
        }
        
        public CustomerDashboardSelectResult CustomerDashboardSelect(PassCustomerDashboard objDashboard)
        {
            SqlParameter salesMarketId = new SqlParameter("@SalesMarketID", objDashboard?.SalesMarketID ?? (object)DBNull.Value);
            SqlParameter currencyId = new SqlParameter("@CurrencyID", objDashboard?.CurrencyID ?? (object)DBNull.Value);
            SqlParameter salesAreaId = new SqlParameter("@SalesAreaID", objDashboard?.SalesAreaID ?? (object)DBNull.Value);
            SqlParameter tradeAccountTypeId = new SqlParameter("@TradeAccountTypeID", objDashboard?.TradeAccountTypeID ?? (object)DBNull.Value);
            SqlParameter salesRepresentativeId = new SqlParameter("@SalesRepresentativeID", objDashboard?.SalesRepresentativeID ?? (object)DBNull.Value);
            SqlParameter salesAgentId = new SqlParameter("@SalesAgentID", objDashboard?.SalesRepresentativeID ?? (object)DBNull.Value);
            SqlParameter searchString = new SqlParameter("@SearchString", objDashboard?.searchTerm ?? (object)DBNull.Value);
            
            var result = new CustomerDashboardSelectResult();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = "[portal].[Customer_DashboardSelect]";

            cmd.Parameters.Add(salesMarketId);
            cmd.Parameters.Add(currencyId);
            cmd.Parameters.Add(salesAreaId);
            cmd.Parameters.Add(tradeAccountTypeId);
            
            switch (objDashboard?.SalesRepOrAgent)
            {
                case true:
                    cmd.Parameters.Add(salesRepresentativeId);
                    break;
                case false:
                    cmd.Parameters.Add(salesAgentId);
                    break;
                case null:
                    cmd.Parameters.Add(salesRepresentativeId);
                    cmd.Parameters.Add(salesAgentId);
                    break;
            }

            cmd.Parameters.Add(searchString);
            
            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerDashboardSelectResult>(reader).Single();

                this.Database.Connection.Close();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                if (this.Database.Connection.State != ConnectionState.Closed)
                    this.Database.Connection.Close();
            }

            return result;
        }

        public MiscCustomerDashboardSelectResult MiscCustomerDashboardSelect(PassCustomerDashboard objDashboard)
        {
            var result = new MiscCustomerDashboardSelectResult();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "[portal].[MiscellaneousCustomer_DashboardSelect]";
            
            var parameters = new SqlParameter[]
            {
                new SqlParameter("@SalesMarketID", objDashboard?.SalesMarketID ?? (object)DBNull.Value),
                new SqlParameter("@CurrencyID", objDashboard?.CurrencyID ?? (object)DBNull.Value),
                new SqlParameter("@SalesAreaID", objDashboard?.SalesAreaID ?? (object)DBNull.Value),
                new SqlParameter("@TradeAccountTypeID", objDashboard?.TradeAccountTypeID ?? (object)DBNull.Value),
                new SqlParameter("@SalesRepresentativeID", objDashboard?.SalesRepresentativeID ?? (object)DBNull.Value),
                new SqlParameter("@SalesAgentID", objDashboard?.SalesRepresentativeID ?? (object)DBNull.Value),
                new SqlParameter("@SearchString", objDashboard?.searchTerm ?? (object)DBNull.Value)
            };

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<MiscCustomerDashboardSelectResult>(reader).Single();

                this.Database.Connection.Close();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                if (this.Database.Connection.State != ConnectionState.Closed)
                    this.Database.Connection.Close();
            }

            return result;
        }

        public void SetLeadPrimaryContact(long leadId, long leadContactId)
        {
            try
            {
                var lead = this.Leads.Where(p => p.LeadID == leadId).Single();
                lead.LeadContactID = leadContactId;

                this.SaveChanges();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public void SetLeadPrimaryAddress(long leadId, long leadAddressId)
        {
            try
            {
                var lead = this.Leads.Where(p => p.LeadID == leadId).Single();
                lead.LeadAddressID = leadAddressId;

                this.SaveChanges();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public void SetLeadDefaultInvoicingAddress(long leadId, long leadAddressId)
        {
            try
            {
                var lead = this.Leads.Where(p => p.LeadID == leadId).Single();
                lead.DefaultInvoiceLeadAddressID = leadAddressId;

                this.SaveChanges();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public void SetLeadDefaultDeliveryAddress(long leadId, long leadAddressId)
        {
            try
            {
                var lead = this.Leads.Where(p => p.LeadID == leadId).Single();
                lead.DefaultDeliveryLeadAddressID = leadAddressId;

                this.SaveChanges();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public void SetLeadDefaultVisitAddress(long leadId, long leadAddressId)
        {
            try
            {
                var lead = this.Leads.Where(p => p.LeadID == leadId).Single();
                lead.DefaultVisitLeadAddressID = leadAddressId;

                this.SaveChanges();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public Lead_TradeAccount_ProximityCheckResult Lead_TradeAccountProximity_Select(PassLeadProximitySelect objProximitySelect)
        {
            SqlParameter leadId = new SqlParameter("@LeadID", objProximitySelect.leadId);
            SqlParameter proximity = new SqlParameter("@Proximity", objProximitySelect.proximity);
            SqlParameter countryId = new SqlParameter("@CountryID", (object)DBNull.Value); //"@CountryID", objProximitySelect.countryId ?? 
            SqlParameter memberId = new SqlParameter("@MemberID", objProximitySelect.memberId ?? (object)DBNull.Value); //"@CountryID", objProximitySelect.countryId ?? 

            var result = new Lead_TradeAccount_ProximityCheckResult();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = "[portal].[Lead_TradeAccountProximity_Select]";

            cmd.Parameters.Add(leadId);
            cmd.Parameters.Add(proximity);
            cmd.Parameters.Add(countryId);
            cmd.Parameters.Add(memberId);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Lead_TradeAccountProximity>(reader).ToList();

                this.Database.Connection.Close();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                if (this.Database.Connection.State != ConnectionState.Closed)
                    this.Database.Connection.Close();
            }

            return result;
        }
        
        public void LeadAddress_UpdateLatLng(PassLeadAddressCoordinates objCoords)
        {
            try
            {
                var a = this.LeadAddresses.Where(p => p.LeadAddressID == objCoords.leadAddressId).Single();

                a.Latitude = objCoords.lat;
                a.Longitude = objCoords.lng;

                this.SaveChangesAsync();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public LeadStage_SelectResult LeadStage_Select(long leadId)
        {
            SqlParameter leadIdParam = new SqlParameter("@LeadID", leadId);
            
            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = "[portal].[LeadStage_Select]";

            cmd.Parameters.Add(leadIdParam);

            var LeadStages = new List<LeadStageInformation>();

            var LeadStageStatuses = new List<LeadStageLeadStatus>();
            
            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                LeadStages = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<LeadStageInformation>(reader).ToList();

                reader.NextResult();

                LeadStageStatuses = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<LeadStageLeadStatus>(reader).ToList();

                //reader.NextResult();

                //LeadStages = ((IObjectContextAdapter)this)
                //    .ObjectContext
                //    .Translate<LeadStageInformation>(reader).ToList();

                this.Database.Connection.Close();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                if (this.Database.Connection.State != ConnectionState.Closed)
                    this.Database.Connection.Close();
            }

            var result = new LeadStage_SelectResult(LeadStages, LeadStageStatuses);

            return result;
        }

        public CreditController_SelectResult CreditController_SelectList(PassCreditControllerDefaultInfo dto)
        {
            var result = new CreditController_SelectResult();

            SqlParameter languageId = new SqlParameter("@LanguageID", dto.LanguageID ?? (object)DBNull.Value);
            SqlParameter salesMarketId = new SqlParameter("@SalesMarketID", dto.SalesMarketID ?? (object)DBNull.Value);
            SqlParameter mertexLanguageCode = new SqlParameter("@MertexLanguageCode", dto.MertexLanguageCode ?? (object)DBNull.Value);

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = "[portal].[CreditControllerAssignment_SelectList]";

            cmd.Parameters.Add(languageId);
            cmd.Parameters.Add(salesMarketId);
            cmd.Parameters.Add(mertexLanguageCode);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.CreditControllers = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CreditController>(reader).ToList();
                
                this.Database.Connection.Close();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                if (this.Database.Connection.State != ConnectionState.Closed)
                    this.Database.Connection.Close();
            }

            return result;
        }

        public CustomerPatternBookResult FetchCustomerPatternBooks(PassCustomerPatternBook objSearch)
        {
            var result = new CustomerPatternBookResult();
            
            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TradeAccountID", objSearch.TradeAccountID),
                new SqlParameter("@Held", objSearch.Held ?? (object)DBNull.Value),
                new SqlParameter("@ProductFilterID", objSearch.ProductFilterID ?? (object)DBNull.Value),
                new SqlParameter("@InStock", objSearch.InStock ?? (object)DBNull.Value),
                new SqlParameter("@BrandID", objSearch.BrandID ?? (object)DBNull.Value),
                new SqlParameter("@SearchString", objSearch.SearchTerm ?? (object)DBNull.Value)
            };
            
            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = "[portal].[Customer_PatternBooks]";

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.newPatternBooks = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<NewPatternBookResult>(reader).ToList();

                reader.NextResult();

                result.bestPatternBooks = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BestPatternBookResult>(reader).ToList();
                
                this.Database.Connection.Close();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                if (this.Database.Connection.State != ConnectionState.Closed)
                    this.Database.Connection.Close();
            }

            return result;
        }
    }
}