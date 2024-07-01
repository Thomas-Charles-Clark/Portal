using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.SignalR;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Documents;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.SignalR.Hubs;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using SharedEFClasses.Models.TradeAccounts;
using Dapper;
using System.Threading.Tasks;
using NLog.Internal;
using PassAutocompleteTerm = SharedEFClasses.Models.TradeAccounts.PassAutocompleteTerm;
using SharedEFClasses.Models.Mertexer;
using DeliveryTerm = SharedEFClasses.Models.Mertexer.DeliveryTerm;
using SharedEFClasses.Models.Mertex;
using System.Web.Http.Results;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public long CreateBasket(PassBasketCreation objCreation)
        {
            var basketId = -1L;

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@MemberID", objCreation.MemberID),
                new SqlParameter("@TradeAccountID", objCreation.TradeAccountID)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Basket_Insert]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                basketId = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<long>(reader).Single();
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

            return basketId;
        }

        public BasketStatusCheckResult BasketStatusCheck(PassBasketPhaseChange objPhaseChange, int memberId)
        {
            var result = new BasketStatusCheckResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objPhaseChange.BasketID),
                new SqlParameter("@MemberID", memberId),
                new SqlParameter("@PhaseID", objPhaseChange.PhaseID)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Basket_StatusCheck]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketStatusCheckResult>(reader).Single();
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

        public BasketItemAddResult AddBasketItem(PassBasketItemAdd objItem)
        {
            var result = new BasketItemAddResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@MemberID", objItem.MemberID),
                new SqlParameter("@BasketID", objItem.BasketID),
                new SqlParameter("@BasketItemTypeID", objItem.BasketItemTypeID),
                new SqlParameter("@ProductID",  objItem.ProductID),
                new SqlParameter("@Quantity", objItem.Quantity),
                new SqlParameter("@StockLocationID", objItem.StockLocationID),
                new SqlParameter("@LineReference", objItem.LineReference ?? (object)DBNull.Value),
                new SqlParameter("@FulfilmentTypeID", objItem.FulfilmentTypeID),
                new SqlParameter("@OrderTypeID", objItem.OrderTypeID),
                new SqlParameter("@ForwardOrderDate", objItem.ForwardOrderDate ?? (object)DBNull.Value),
                new SqlParameter("@FeelerProductID", objItem.FeelerProductID ?? (object)DBNull.Value),
                //new SqlParameter("@Memo", objItem.Memo ?? (object)DBNull.Value),
                new SqlParameter("@HeaderWidth", objItem.HeaderWidth ?? (object)DBNull.Value),
                new SqlParameter("@FeelerLength", objItem.FeelerLength ?? (object)DBNull.Value),
                new SqlParameter("@WaterfallRequired", objItem.WaterfallRequired ?? (object)DBNull.Value),
                new SqlParameter("@BespokeWidth", objItem.BespokeWidth ?? (object)DBNull.Value),
                new SqlParameter("@BespokeLength", objItem.BespokeLength ?? (object)DBNull.Value),
                new SqlParameter("@BespokeDiameter", objItem.BespokeDiameter ?? (object)DBNull.Value),
                new SqlParameter("@CADEmail", objItem.CADEmail ?? (object)DBNull.Value),
                new SqlParameter("@BespokeSize", objItem.BespokeSize ?? (object)DBNull.Value),
                new SqlParameter("@BespokeModelProductID", objItem.BespokeModelProductID ?? (object)DBNull.Value),
                new SqlParameter("@ProcessAnswersJSON", objItem.ProcessAnswersJSON ?? (object)DBNull.Value),
                new SqlParameter("@WithBatchCutting", objItem.WithBatchCutting),
                new SqlParameter("@SupplierAccountCode", objItem.SupplierAccountCode ?? (object)DBNull.Value),
                new SqlParameter("@SupplierFullName", objItem.SupplierFullName ?? (object)DBNull.Value),
                new SqlParameter("@SupplierCompanyName", objItem.SupplierCompanyName ?? (object)DBNull.Value),
                new SqlParameter("@SupplierAddressLine1", objItem.SupplierAddressLine1 ?? (object)DBNull.Value),
                new SqlParameter("@SupplierAddressLine2", objItem.SupplierAddressLine2 ?? (object)DBNull.Value),
                new SqlParameter("@SupplierTown", objItem.SupplierTown ?? (object)DBNull.Value),
                new SqlParameter("@SupplierCounty", objItem.SupplierCounty ?? (object)DBNull.Value),
                new SqlParameter("@SupplierPostcode", objItem.SupplierPostcode ?? (object)DBNull.Value),
                new SqlParameter("@SupplierPhoneNumber", objItem.SupplierPhoneNumber ?? (object)DBNull.Value),
                new SqlParameter("@SupplierCountryCode", objItem.SupplierCountryCode ?? (object)DBNull.Value),
                new SqlParameter("@SupplierCountryID", objItem.SupplierCountryID ?? (object)DBNull.Value),
                new SqlParameter("@PurchaseOrderLineNumber", objItem.PurchaseOrderLineNumber ?? (object)DBNull.Value),
            };

            var nonNull = parameters.Where(v => v.Value != (object)DBNull.Value);

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_Add]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemAddResult>(reader).Single();
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

        public BasketItemAllocationFetchResult FetchBasketItemAllocation(PassBasketItemAllocationFetch objFetch)
        {
            var result = new BasketItemAllocationFetchResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@TradeAccountID", objFetch.TradeAccountID),
                new SqlParameter("@BasketItemID",  objFetch.BasketItemID)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_ReviewAllocation_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Allocations = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemAllocation>(reader).ToList();

                reader.NextResult();

                result.StockLocations = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<AllocationStockLocation>(reader).ToList();

                reader.NextResult();

                result.AllocationNotices = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<AllocationNotice>(reader).Single();

                reader.NextResult();

                result.BasketItemDetails = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<AllocationDetails>(reader).Single();

                reader.NextResult();

                result.WideWidthFabricControls = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<WideWidthFabricControl>(reader).ToList();
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

        public List<BasketItemAllocationStockFetchResult> FetchBasketItemAllocationStock(PassBasketItemAllocationFetch objFetch)
        {
            var results = new List<BasketItemAllocationStockFetchResult>();

            var productIdTable = new DataTable();

            productIdTable.Columns.Add("ProductID", typeof(int));

            productIdTable.Rows.Add(objFetch.ProductID);

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketItemID",  objFetch.BasketItemID),
                new SqlParameter("@TradeAccountID", objFetch.TradeAccountID),
                new SqlParameter("@ProductIDs",  productIdTable)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[dbo].[ProductIDsTableType]"
                 }
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Stock_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemAllocationStockFetchResult>(reader).ToList();
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

            return results;
        }

        public int SaveBasketItemAllocationDetails(PassBasketItemAllocationSave objSave)
        {
            var result = -1;

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketItemID",  objSave.BasketItemID),
                new SqlParameter("@PackingMethodID", objSave.PackingMethodID),
                new SqlParameter("@CutLengthJSON", objSave.CutLengthJSON),
                new SqlParameter("@BatchCuttingIndicator", objSave.BatchCuttingIndicator)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_ReviewAllocation_Save]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                result = cmd.ExecuteNonQuery();
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

        public BasketItem_Edit_SelectResult FetchBasketItemForEdit(PassBasketItemEditFetch objBasketItem)
        {
            var result = new BasketItem_Edit_SelectResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID",  objBasketItem.BasketID),
                new SqlParameter("@BasketItemID",  objBasketItem.BasketItemID),
                new SqlParameter("@TradeAccountID", objBasketItem.TradeAccountID)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_Edit_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.SearchResult = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductSearchResult>(reader).Single();

                reader.NextResult();

                result.ExtensionFields = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductSearchResultExtension>(reader).Single();
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

        public int UpdateBasket(PassBasket objBasket)
        {
            var result = 0;

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketID", objBasket.BasketID),
                new SqlParameter("@OrderReference", objBasket.OrderReference)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_Update]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                result = cmd.ExecuteNonQuery();
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

        public int ReleaseBasket(int memberId, PassBasketID objBasketId)
        {
            var result = 0;

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketID", objBasketId.BasketID),
                new SqlParameter("@MemberID", memberId)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_HoldReason_Release]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                result = cmd.ExecuteNonQuery();
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

        public int ReleaseTransaction(int memberId, PassTransactionID objTransactionId)
        {
            var result = 0;

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TransactionID", objTransactionId.TransactionID),
                new SqlParameter("@MemberID", memberId)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[mbr].[Transaction_HoldReason_Release]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                result = cmd.ExecuteNonQuery();
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

        public List<BasketSelectResult> FetchMemberBaskets(int memberId, string enquiryType)
        {
            var results = new List<BasketSelectResult>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@MemberID", memberId),
                new SqlParameter("@EnquiryType", enquiryType)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_SelectList]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketSelectResult>(reader).ToList();
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

            //results.ForEach(c =>
            //{
            //c.TradeAccount = this.TradeAccounts.Where(p => p.Code == c.CustomerCode).Single();
            //c.BasketItemLineMemos = this.BasketItemLineMemos.Where(p => p.BasketItem.BasketID == c.BasketID).ToList();

            //c.BasketItemLineMemos.ForEach(d =>
            //{
            //    d.LineMemoType = this.LineMemoTypes.Where(p => p.LineMemoTypeID == d.LineMemoTypeID).Single();
            //});
            //});

            return results;
        }

        public List<HeldOrderSelectResult> FetchHeldOrdersManagement(int memberId)
        {
            var results = new List<HeldOrderSelectResult>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@MemberID", memberId)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_HeldForApproval_ManagementView]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<HeldOrderSelectResult>(reader).ToList();
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

            return results;
        }

        public List<HeldOrderSelectResult> FetchHeldOrdersOperator(int memberId)
        {
            var results = new List<HeldOrderSelectResult>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@MemberID", memberId)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_HeldForApproval_OperatorView]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<HeldOrderSelectResult>(reader).ToList();
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

            return results;
        }

        public List<TransactionSelectResult> FetchTransactions(PassTransactionSearch objSearch)
        {
            var results = new List<TransactionSelectResult>();

            if (objSearch.basketId.HasValue)
            {
                objSearch.memberId = null;
                objSearch.marketCode = null;
                objSearch.tradeAccountCode = null;
                objSearch.searchTerm = null;
            }

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketID", objSearch.basketId ?? (object)DBNull.Value),
                new SqlParameter("@MemberID", objSearch.memberId ?? (object)DBNull.Value),
                new SqlParameter("@MarketCode", objSearch.marketCode ?? (object)DBNull.Value),
                new SqlParameter("@TradeAccountCode", objSearch.tradeAccountCode ?? (object)DBNull.Value),
                new SqlParameter("@TradeAccountID", objSearch.tradeAccountId ?? (object)DBNull.Value),
                new SqlParameter("@SearchTerm", objSearch.searchTerm ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Transaction_SelectList]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<TransactionSelectResult>(reader).ToList();
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

            return results;
        }

        public int DeleteBasket(PassBasket objBasket, int memberId)
        {
            var result = 0;

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketID", objBasket.BasketID),
                new SqlParameter("@MemberID", memberId)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_Delete]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandTimeout = 120;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                result = cmd.ExecuteNonQuery();
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

        public int DeleteTransaction(PassTransactionID objTransactionId)
        {
            var result = 0;

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TransactionID", objTransactionId.TransactionID),
                new SqlParameter("@DeleteAssociatedBasket", true)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[adm].[Transaction_Delete]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                result = cmd.ExecuteNonQuery();
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

        public DatabaseJSONResult FetchBasketItemNotifications(long basketItemId)
        {
            var result = new DatabaseJSONResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketItemID",  basketItemId)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_Notification]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                var sb = new System.Text.StringBuilder();

                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }

                result.JSON = sb.ToString();
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

        public List<BasketItemAdvancedOrderStepResult> FetchBasketItemStageInformation(long basketItemId, int tradeAccountId)
        {
            var results = new List<BasketItemAdvancedOrderStepResult>();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketItemID",  basketItemId),
                new SqlParameter("@TradeAccountID", tradeAccountId)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_AdvancedOrderStep_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemAdvancedOrderStepResult>(reader).ToList();
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

            return results;
        }

        public BasketItemPreAllocationUpsertResult InsertBasketItemPreAllocation(PassBasketItemAllocation objAlloc)
        {
            var results = new BasketItemPreAllocationUpsertResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketItemID",  objAlloc.BasketItemID),
                new SqlParameter("@MemberID", objAlloc.MemberID),
                new SqlParameter("@Batch", objAlloc.Batch),
                new SqlParameter("@Piece", objAlloc.Piece),
                new SqlParameter("@Quantity", objAlloc.Quantity),
                new SqlParameter("@RingFencePreAllocationID", objAlloc.RingFencePreAllocationID)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketPreAllocation_Insert]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemPreAllocationUpsertResult>(reader).Single();
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

            return results;
        }

        public BasketItemPreAllocationUpsertResult UpdateBasketItemPreAllocation(PassBasketItemAllocation objAlloc)
        {
            var results = new BasketItemPreAllocationUpsertResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketPreAllocationID",  objAlloc.BasketPreAllocationID),
                new SqlParameter("@MemberID", objAlloc.MemberID),
                new SqlParameter("@Quantity", objAlloc.Quantity)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketPreAllocation_Update]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemPreAllocationUpsertResult>(reader).Single();
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

            return results;
        }

        public BasketItemPreAllocationDeleteResult DeleteBasketItemPreAllocation(PassBasketItemAllocation objAlloc)
        {
            var results = new BasketItemPreAllocationDeleteResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketPreAllocationID",  objAlloc.BasketPreAllocationID),
                new SqlParameter("@MemberID", objAlloc.MemberID)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketPreAllocation_Delete]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemPreAllocationDeleteResult>(reader).Single();
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

            return results;
        }

        public ClearBasketItemAllocationsResult ClearBasketItemPreAllocations(PassBasketItemAllocation objAlloc)
        {
            var results = new ClearBasketItemAllocationsResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketItemID",  objAlloc.BasketItemID),
                new SqlParameter("@MemberID", objAlloc.MemberID)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketPreAllocation_DeleteAll]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results.PreAllocationErrorIDs = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<long?>(reader).ToList();
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

            return results;
        }

        public List<DiscountFOCPromoCode> TradePromotionCodeSelect()
        {
            var results = new List<DiscountFOCPromoCode>();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[TradePromotionCode_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DiscountFOCPromoCode>(reader).ToList();
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

            return results;
        }

        public BasketItemReviewPricesSelectResult BasketItemReviewPrices(PassBasketItemReviewPricesSelect objBasketItem)
        {
            var result = new BasketItemReviewPricesSelectResult();

            var dt = new DataTable();

            dt.Columns.Add("BasketItemID", typeof(long));
            dt.Columns.Add("OperatorDiscountPercentage", typeof(decimal));
            dt.Columns.Add("OperatorEnteredChargeEx", typeof(decimal));
            dt.Columns.Add("DiscountReasonID", typeof(byte));
            dt.Columns.Add("DiscountReasonComment", typeof(string));
            dt.Columns.Add("TradePromotionCodeID", typeof(int));
            dt.Columns.Add("CurrentDiscounterState", typeof(bool));

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketItemID",  objBasketItem.BasketItemID)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_ReviewPrice_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.SystemDiscounts = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemDiscountRecord>(reader).ToList();

                reader.NextResult();

                result.DiscountReasons = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DiscountReasonRecord>(reader).ToList();

                reader.NextResult();

                result.FOCPromotionCodes = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DiscountFOCPromoCode>(reader).ToList();
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

        public BasketItemReviewPriceCalculateFinalPriceRecord BasketItemReviewPricesCalculateFinalPrice(PassBasketItemReviewPricesSave objSave)
        {
            var result = new BasketItemReviewPriceCalculateFinalPriceRecord();

            var dt = new DataTable();

            dt.Columns.Add("BasketItemID", typeof(long));
            dt.Columns.Add("OperatorDiscountPercentage", typeof(decimal));
            dt.Columns.Add("OperatorEnteredChargeEx", typeof(decimal));
            dt.Columns.Add("DiscountReasonID", typeof(byte));
            dt.Columns.Add("DiscountReasonComment", typeof(string));
            dt.Columns.Add("TradePromotionCodeID", typeof(int));

            foreach (var disco in objSave.Discounts)
            {
                dt.Rows.Add(
                    disco.BasketItemID,
                    disco.OperatorDiscountPercentage,
                    disco.OperatorEnteredChargeEx,
                    disco.DiscountReasonID,
                    disco.DiscountReasonComment,
                    disco.TradePromotionCodeID);
            }

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@Discounts",  dt)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[portal].[BasketItemDiscountTableType]"
                }
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_ReviewPrice_Recalculate]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemReviewPriceCalculateFinalPriceRecord>(reader).Single();
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


        public int BasketItemReviewPricesSave(PassBasketItemReviewPricesSave objBasketItemReviewPrices)
        {
            var result = -1;

            var dt = new DataTable();

            dt.Columns.Add("BasketItemID", typeof(long));
            dt.Columns.Add("OperatorDiscountPercentage", typeof(decimal));
            dt.Columns.Add("OperatorEnteredChargeEx", typeof(decimal));
            dt.Columns.Add("DiscountReasonID", typeof(byte));
            dt.Columns.Add("DiscountReasonComment", typeof(string));
            dt.Columns.Add("TradePromotionCodeID", typeof(int));

            foreach (var disco in objBasketItemReviewPrices.Discounts)
            {
                dt.Rows.Add(
                    disco.BasketItemID,
                    disco.OperatorDiscountPercentage,
                    disco.OperatorEnteredChargeEx,
                    disco.DiscountReasonID,
                    disco.DiscountReasonComment,
                    disco.TradePromotionCodeID);
            }

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objBasketItemReviewPrices.BasketID),
                new SqlParameter("@Discounts",  dt)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[portal].[BasketItemDiscountTableType]"
                },
                new SqlParameter("@AddAll", objBasketItemReviewPrices.AddAll)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_ReviewPrice_Save]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                result = cmd.ExecuteNonQuery();
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

        public BasketItemMemoResult FetchBasketItemMemos(PassBasketItemID objBasketItemId)
        {
            var result = new BasketItemMemoResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketItemID", objBasketItemId.BasketItemID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[BasketItem_ReviewLineMemo_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.DocumentTypes = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentType>(reader).ToList();

                reader.NextResult();

                result.LineMemos = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemLineMemoPass>(reader).ToList();

                reader.NextResult();

                result.DocumentTypeCodes = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemLineMemoDocumentType>(reader).ToList();
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

        public int SaveBasketItemMemos(PassBasketItemMemoSave objSave)
        {
            var result = -1;

            var basketItemTable = new DataTable();

            basketItemTable.Columns.Add("BasketItemLineMemoID", typeof(byte));
            basketItemTable.Columns.Add("LineMemo", typeof(string));

            var basketItemDocumentTypeTable = new DataTable();

            basketItemDocumentTypeTable.Columns.Add("BasketItemLineMemoID", typeof(byte));
            basketItemDocumentTypeTable.Columns.Add("DocumentTypeCode", typeof(string));

            if (objSave.LineMemos != null)
            {
                foreach (var i in objSave.LineMemos)
                {
                    basketItemTable.Rows.Add(i.BasketItemLineMemoID, i.LineMemo);

                    foreach (var j in i.SelectedDocumentTypes)
                    {
                        basketItemDocumentTypeTable.Rows.Add(i.BasketItemLineMemoID, j);
                    }
                }
            }

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketItemID", objSave.BasketItemID),
                new SqlParameter("@BasketItemLineMemo",  basketItemTable)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[portal].[BasketItemLineMemoTableType]"
                },
                new SqlParameter("@BasketItemLineMemo_DocumentType", basketItemDocumentTypeTable)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[portal].[BasketItemLineMemo_DocumentTypeTableType]"
                }
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_ReviewLineMemo_Save]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                result = cmd.ExecuteNonQuery();
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


        public BasketClauseResult FetchOrderClauses(PassBasketID objBasketId)
        {
            var result = new BasketClauseResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objBasketId.BasketID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_Clause_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Orders = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketSplitResult>(reader).ToList();

                reader.NextResult();

                result.Clauses = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<OrderClause>(reader).ToList();

                reader.NextResult();

                result.ExistingClauses = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketSplitClause>(reader).ToList();
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

        public int SaveOrderClauses(PassOrderClauses objSave)
        {
            var result = -1;

            var orderClauseTable = new DataTable();

            orderClauseTable.Columns.Add("BasketClauseID");
            orderClauseTable.Columns.Add("BasketSplitID");
            orderClauseTable.Columns.Add("Clause");

            objSave.Clauses?.ForEach(c =>
            {
                orderClauseTable.Rows.Add(c.BasketClauseID, c.BasketSplitID, c.Clause);
            });

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objSave.BasketID),
                new SqlParameter("@BasketClause",  orderClauseTable)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[portal].[BasketClauseTableType]"
                }
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Basket_Clause_Save]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                result = cmd.ExecuteNonQuery();
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

        public BasketItemTreatmentResult FetchBasketItemTreatments(PassBasketItemID objBasketItemId)
        {
            var result = new BasketItemTreatmentResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketItemID", objBasketItemId.BasketItemID)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_ReviewTreatment_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Treatments = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemTreatmentProvider>(reader).ToList();

                reader.NextResult();

                result.ExpressTreatmentPrices = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ExpressTreatmentPrice>(reader).ToList();

                reader.NextResult();

                result.TreatmentNotes = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<TreatmentNotice>(reader).ToList();

                reader.NextResult();

                result.Express = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ExpressTreatmentSelected>(reader).SingleOrDefault();

                reader.NextResult();

                result.TreatmentTypeMandates = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<TreatmentTypeMandatory>(reader).ToList();
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

            result.Treatments.ForEach(c =>
            {
                c.ExpressPrice = result.ExpressTreatmentPrices.Where(p => p.TreatmentProviderID == c.TreatmentProviderID).SingleOrDefault()?.PriceEx;
            });

            return result;
        }

        public bool BasketItemUpdate(PassBasketItem objBasketItem)
        {
            var result = false;

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@MemberID", objBasketItem.MemberID),
                new SqlParameter("@BasketItemID",  objBasketItem.BasketItemID),
                new SqlParameter("@Quantity", objBasketItem.Quantity),
                new SqlParameter("@BackOrder", objBasketItem.BackOrder),
                new SqlParameter("@Memo", objBasketItem.Memo),
                new SqlParameter("@StockLocationID",  objBasketItem.StockLocationID ?? (object)DBNull.Value),
                new SqlParameter("@FulfilmentTypeID",  objBasketItem.FulfilmentTypeID ?? (object)DBNull.Value),
                new SqlParameter("@ForwardOrderDate",  objBasketItem.ForwardOrderDate ?? (object)DBNull.Value),
                new SqlParameter("@LineReference", objBasketItem.LineReference ?? (object)DBNull.Value),
                new SqlParameter("@FeelerProductID", objBasketItem.FeelerProductID ?? (object)DBNull.Value),
                new SqlParameter("@FeelerLength", objBasketItem.FeelerLength ?? (object)DBNull.Value),
                new SqlParameter("@ProcessAnswersJSON", objBasketItem.ProcessAnswersJSON ?? (object)DBNull.Value),
                new SqlParameter("@BespokeSize", objBasketItem.BespokeSize ?? (object)DBNull.Value)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_Update]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandTimeout = 120;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteNonQuery();

                if (reader == 1)
                    result = true;
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

        public bool ToggleBatchCuttingExpress(PassBatchCuttingExpressIndicator objIndicator, int memberId)
        {
            var result = false;

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@MemberID", memberId),
                new SqlParameter("@BasketID",  objIndicator.BasketID),
                new SqlParameter("@Toggle", objIndicator.SendBatchCuttingsExpress)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Basket_BatchCuttingExpress_Toggle]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteNonQuery();

                if (reader == -1)
                    result = true;
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

        public bool CancelBasketItem(PassBasketItemAllocation objBasketItem)
        {
            var result = false;

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketItemID",  objBasketItem.BasketItemID),
                new SqlParameter("@MemberID", objBasketItem.MemberID)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_Delete]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteNonQuery();

                result = true;
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

        public FetchBasketResult FetchBasket(PassBasketFetch objBasket)
        {
            var result = new FetchBasketResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID",  objBasket.BasketID),
                new SqlParameter("@RecalculatePrices", objBasket.RecalculatePrices ?? (object)DBNull.Value)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            cmd.CommandTimeout = 120;

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.PopupNotices = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemPopupNotice>(reader).ToList();

                reader.NextResult();

                result.BasketItems = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemSelectResult>(reader).ToList();
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

            result.BasketItems.ForEach(c =>
            {
                c.BasketItemLineMemos = this.BasketItemLineMemos.Where(p => p.BasketItemID == c.BasketItemID).ToList();

                c.BasketItemLineMemos.ForEach(d =>
                {
                    d.LineMemoType = this.LineMemoTypes.Where(p => p.LineMemoTypeID == d.LineMemoTypeID).Single();
                });
            });

            return result;
        }

        //public List<FetchMemberBasketResult> FetchMemberBaskets(int memberId)
        //{
        //    var results = new List<FetchMemberBasketResult>();

        //    var parameters = new List<SqlParameter>()
        //    {
        //        new SqlParameter("@MemberID",  memberId)
        //    };

        //    var cmd = this.Database.Connection.CreateCommand();

        //    cmd.CommandText = "[portal].[Basket_Select]";
        //    cmd.CommandType = CommandType.StoredProcedure;

        //    cmd.Parameters.AddRange(parameters.ToArray());

        //    try
        //    {
        //        this.Database.Connection.Open();

        //        var reader = cmd.ExecuteReader();

        //        results = ((IObjectContextAdapter)this)
        //            .ObjectContext
        //            .Translate<FetchMemberBasketResult>(reader).ToList();
        //    }
            //catch (SqlException e)
            //{
            //    PortalFramework.LogErrorToDatabase(e);
            //}
    //    finally
    //    {
    //        this.Database.Connection.Close();
    //    }

    //    return results;
    //}

    public Basket_DeliveryAddress_SelectResult FetchBasketDeliveryAddress(PassBasketTradeAccount objBasketId)
        {
            var result = new Basket_DeliveryAddress_SelectResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID",  objBasketId.BasketID)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Basket_DeliveryAddress_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.DeliveryAddress = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketDeliveryAddress>(reader).SingleOrDefault();

                reader.NextResult();

                result.MiscInvoiceAddress = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<MiscellaneousInvoiceAddress>(reader).SingleOrDefault();

                reader.NextResult();

                result.ForbiddenDestinationCountries = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ForbiddenDestinationCountry>(reader).ToList();
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

        public TradeAccountAddressResponse FetchTradeAccountAddresses(string tradeAccountCode)
        {
            var result = new TradeAccountAddressResponse();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@TradeAccountCode",  tradeAccountCode)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[TradeAccount_Address_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.InvoiceAddress = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<InvoiceAddress>(reader).SingleOrDefault();

                reader.NextResult();

                result.DefaultDeliveryAddress = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DeliveryAddress>(reader).SingleOrDefault();

                reader.NextResult();

                result.DeliveryAddresses = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DeliveryAddress>(reader).ToList();
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

        public IEnumerable<string> FetchTradeAccountEndCustomers(PassAutocompleteTerm objTerm)
        {
            var results = new List<string>();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@TradeAccountCode",  objTerm.tradeAccountCode),
                new SqlParameter("@SearchTerm",  objTerm.term ?? ""),
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[TradeAccount_EndCustomer_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<string>(reader).ToList();
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

            return results;
        }


        public IEnumerable<DeliveryAddress> DeliveryAddressSearch(string tradeAccountCode, string searchTerm)
        {
            var result = new List<DeliveryAddress>();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@TradeAccountCode",  tradeAccountCode), 
                new SqlParameter("@SearchTerm",  searchTerm ?? "")
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[TradeAccount_Address_Search]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                while(reader.Read())
                {
                    result.Add(new DeliveryAddress(
                        deliveryReference: reader.GetString(0),
                        companyName: reader.IsDBNull(1) ? null : reader.GetString(1),
                        addressLine1: reader.IsDBNull(2) ? null : reader.GetString(2),
                        addressLine2: reader.IsDBNull(3) ? null : reader.GetString(3),
                        town: reader.IsDBNull(4) ? null : reader.GetString(4),
                        county: reader.IsDBNull(5) ? null : reader.GetString(5),
                        postcode: reader.IsDBNull(6) ? null : reader.GetString(6),
                        domesticOrTrade: reader.IsDBNull(7) ? null : reader.GetString(7),
                        tradeAccountCode: reader.IsDBNull(8) ? null : reader.GetString(8),
                        phoneNumber: reader.IsDBNull(9) ? null : reader.GetString(9),
                        countryCode: reader.IsDBNull(10) ? null : reader.GetString(10),
                        email: reader.IsDBNull(11) ? null : reader.GetString(11),
                        haulierCode: reader.IsDBNull(12) ? null : reader.GetString(12),
                        carriageCode: reader.IsDBNull(13) ? null : reader.GetString(13),
                        usTaxExemptionCertificateReference: reader.IsDBNull(14) ? null : reader.GetString(14),
                        usStateCode: reader.IsDBNull(15) ? null : reader.GetString(15),
                        usCountyCode: reader.IsDBNull(16) ? null : reader.GetString(16),
                        countryId: reader.IsDBNull(17) ? (short?)null : reader.GetInt16(17),
                        isDefaultDeliveryAddress: reader.GetBoolean(18))
                    );
                }
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

        public IEnumerable<DeliveryAddressExistsResult> DeliveryAddressExists(
            string tradeAccountCode,
            DeliveryAddress address)
        {
            var results = new List<DeliveryAddressExistsResult>();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@TradeAccountCode", tradeAccountCode),
                new SqlParameter("@CompanyName", address.CompanyName),
                new SqlParameter("@ContactName", address.ContactName),
                new SqlParameter("@AddressLine1", address.AddressLine1),
                new SqlParameter("@AddressLine2", address.AddressLine2),
                new SqlParameter("@Town", address.Town),
                new SqlParameter("@County", address.County),
                new SqlParameter("@Postcode", address.Postcode),
                new SqlParameter("@CountryCode", address.CountryCode),
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[TradeAccount_DeliveryAddress_Exists]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    results.Add(new DeliveryAddressExistsResult()
                    {
                        DeliveryReference = reader.GetString(0),
                        IsDefault = reader.GetBoolean(1)
                    });
                }
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

            return results;
        }

        public string DeliveryAddressUpsert(
            string tradeAccountCode,
            DeliveryAddress address)
        {
            var result = (string)null;

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@TradeAccountCode", tradeAccountCode),
                new SqlParameter("@DeliveryReference", address.DeliveryReference),
                new SqlParameter("@CompanyName", address.CompanyName),
                new SqlParameter("@ContactName", address.ContactName),
                new SqlParameter("@AddressLine1", address.AddressLine1),
                new SqlParameter("@AddressLine2", address.AddressLine2),
                new SqlParameter("@Town", address.Town),
                new SqlParameter("@County", address.County),
                new SqlParameter("@Postcode", address.Postcode),
                new SqlParameter("@CountryCode", address.CountryCode),
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[TradeAccount_DeliveryAddress_Upsert]";

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    result =  reader.GetString(0);
                }
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


        public List<ForbiddenDestinationCountry> FetchBasketDeliveryRestrictions(long basketId, string invoiceCountryCode, string invoicePostcode, string deliveryCountryCode, string deliveryPostcode)
        {
            var results = new List<ForbiddenDestinationCountry>();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", basketId),
                new SqlParameter("@InvoiceAddress_CountryCode", invoiceCountryCode ?? (object)DBNull.Value),
                new SqlParameter("@InvoiceAddress_PostCode", invoicePostcode ?? (object)DBNull.Value),
                new SqlParameter("@DeliveryAddress_CountryCode", deliveryCountryCode ?? (object)DBNull.Value),
                new SqlParameter("@DeliveryAddress_PostCode", deliveryPostcode ?? (object)DBNull.Value)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Basket_DeliveryAddress_Restrictions]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ForbiddenDestinationCountry>(reader).ToList();
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

            return results;
        }

        public int SaveBasketDeliveryAddress(PassBasketAddress objBasketId)
        {
            var result = -1;

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID",  objBasketId.basketId),
                new SqlParameter("@DeliveryReference", objBasketId.deliveryReference ?? (object)DBNull.Value),
                new SqlParameter("@DeliveryName",  objBasketId.deliveryName ?? (object)DBNull.Value),
                new SqlParameter("@DeliveryCompanyName",  objBasketId.deliveryCompanyName ?? (object)DBNull.Value),
                new SqlParameter("@DeliveryAddressLine1",  objBasketId.deliveryAddressLine1 ?? (object)DBNull.Value),
                new SqlParameter("@DeliveryAddressLine2",  objBasketId.deliveryAddressLine2 ?? (object)DBNull.Value),
                new SqlParameter("@DeliveryTown",  objBasketId.deliveryTown ?? (object)DBNull.Value),
                new SqlParameter("@DeliveryCounty",  objBasketId.deliveryCounty ?? (object)DBNull.Value),
                new SqlParameter("@DeliveryPostcode",  objBasketId.deliveryPostcode ?? (object)DBNull.Value),
                new SqlParameter("@DeliveryCountryID",  objBasketId.deliveryCountryId ?? (object)DBNull.Value),
                new SqlParameter("@DeliveryPhoneNumber",  objBasketId.deliveryPhoneNumber ?? (object)DBNull.Value),
                new SqlParameter("@EndCustomerTradeAccountCode",  objBasketId.endCustomerCode ?? (object)DBNull.Value),
                new SqlParameter("@EndCustomerTradeAccountName",  objBasketId.endCustomerName ?? (object)DBNull.Value),
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Basket_DeliveryAddress_Save]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                result = cmd.ExecuteNonQuery();
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

        public int SaveBasketMiscInvoiceAddress(PassMiscellaneousInvoiceAddress objAddress)
        {
            try
            {
                var basket = Baskets.Where(p => p.BasketID == objAddress.basketId).Single();

                basket.MiscellaneousAccountInvoiceFullName = objAddress.deliveryName;
                basket.MiscellaneousAccountInvoiceCompanyName = objAddress.deliveryCompanyName;
                basket.MiscellaneousAccountInvoiceAddressLine1 = objAddress.deliveryAddressLine1;
                basket.MiscellaneousAccountInvoiceAddressLine2 = objAddress.deliveryAddressLine2;
                basket.MiscellaneousAccountInvoiceTown = objAddress.deliveryTown;
                basket.MiscellaneousAccountInvoiceCounty = objAddress.deliveryCounty;
                basket.MiscellaneousAccountInvoicePostcode = objAddress.deliveryPostcode;
                basket.MiscellaneousAccountInvoicePhoneNumber = objAddress.deliveryPhoneNumber;
                basket.MiscellaneousAccountInvoiceCountryCode = objAddress.deliveryCountryCode;
                basket.MiscellaneousAccountInvoiceCountryID = objAddress.deliveryCountryId;
                basket.MiscellaneousAccountInvoiceEmail = objAddress.email;

                return SaveChanges();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public List<BasketShippingRestrictionResult> BasketShippingRestrictionCheck(PassBasketID objBasketId)
        {
            var results = new List<BasketShippingRestrictionResult>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketID", objBasketId.BasketID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_ShippingRestrictionCheck]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketShippingRestrictionResult>(reader).ToList();
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

            return results;
        }


        public Basket_DeliveryService_Result Basket_DeliveryService_Select(PassBasketSplit objBasketId, int userId)
        {
            var result = new Basket_DeliveryService_Result();

            //// Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_DeliveryService_Select]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 600;

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketID", objBasketId.BasketID),
                new SqlParameter("@BasketSplitID", objBasketId.BasketSplitID ?? (object)DBNull.Value)
            };

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.BasketSplitResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketSplitResult>(reader).ToList();

                reader.NextResult();

                result.CustomerAccountNumbers = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerAccountNumber>(reader).ToList();

                reader.NextResult();

                result.DiscountReasons = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DiscountReason>(reader).ToList();

                //GlobalHost.ConnectionManager.GetHubContext<BasketLockHub>()
                //   .Clients.User($"{userId}").receiveNewParentBusyMessage("<br/><sub>...awaiting responses from UPS...</sub>");

                reader.NextResult();

                result.SelectedDeliveryServices = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DeliveryServiceResult>(reader).ToList();

                reader.NextResult();

                result.DeliveryServices = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DeliveryServiceResult>(reader).ToList();

                reader.NextResult();

                result.CustomerDeliveryDefaults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerDeliveryDefault>(reader).ToList();

                reader.NextResult();

                result.DeliveryTerms = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<SharedEFClasses.Models.Orders.DeliveryTerm>(reader).ToList();

                reader.NextResult();

                result.DeliveryErrors = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DeliveryError>(reader).ToList();

                reader.NextResult();

                result.CustomerRequests = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerDeliveryRequests>(reader).SingleOrDefault();

                reader.NextResult();

                var notices = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<string>(reader).Single();

                reader.NextResult();

                result.ParcelEstimateBreakdowns = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<string>(reader).Single();

                result.Notifications = new DatabaseJSONResult()
                {
                    JSON = notices
                };
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

        public DispatchFactorySaveResult SaveBasketSplitDeliveryOption(PassDispatchFactorySave objSave)
        {
            var result = new DispatchFactorySaveResult();

            var serviceTable = new DataTable();

            var properties = from property in typeof(DeliveryServiceResult).GetProperties()
                             where Attribute.IsDefined(property, typeof(OrderedPropertyAttribute))
                             orderby ((OrderedPropertyAttribute)property
                                       .GetCustomAttributes(typeof(OrderedPropertyAttribute), false)
                                       .Single()).Order
                             select property;

            foreach (PropertyInfo property in properties)
            {
                serviceTable.Columns.Add(property.Name);
            }

            foreach (var objService in objSave.deliveryServices)
            {
                List<object> values = new List<object>();

                foreach (PropertyInfo property in properties)
                {
                    values.Add(property.GetValue(objService, null));
                }

                serviceTable.Rows.Add(values.ToArray());
            }

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID",  objSave.basketId),
                new SqlParameter("@BasketSplitID", objSave.basketSplitId),
                new SqlParameter("@DeliveryService", serviceTable)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[portal].[DeliveryServiceTableType1]"
                },
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Basket_DeliveryService_Save]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            cmd.CommandTimeout = 120;

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DispatchFactorySaveResult>(reader).Single();
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

        public List<ProductSearchResult> FetchAdditionalProducts(PassAdditionalProductsFetch objFetch)
        {
            var results = new List<ProductSearchResult>();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@ProductID", objFetch.ProductID),
                new SqlParameter("@TradeAccountID", objFetch.TradeAccountID)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Product_AdditionalProducts_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductSearchResult>(reader).ToList();
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

            return results;
        }

        public BasketCommentResult FetchBasketComments(PassBasketID objBasketId)
        {
            var result = new BasketCommentResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objBasketId.BasketID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_Comment_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.DocumentTypes = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentType>(reader).ToList();

                reader.NextResult();

                result.Comments = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketComment>(reader).ToList();

                reader.NextResult();

                result.DocumentTypeCodes = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketCommentDocumentType>(reader).ToList();
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

        public BasketNoteResult FetchBasketNotes(PassBasketID objBasketId)
        {
            var result = new BasketNoteResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objBasketId.BasketID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_Note_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Notes = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketNote>(reader).ToList();
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

        public int SaveBasketComments(PassBasketCommentSave objSave)
        {
            var result = -1;

            var basketCommentTable = new DataTable();

            basketCommentTable.Columns.Add("BasketCommentID");
            basketCommentTable.Columns.Add("BasketSplitID");
            basketCommentTable.Columns.Add("BasketCommentTypeID");
            basketCommentTable.Columns.Add("Comment");

            var basketCommentDocumentTypeTable = new DataTable();

            basketCommentDocumentTypeTable.Columns.Add("BasketCommentID");
            basketCommentDocumentTypeTable.Columns.Add("BasketSplitID");
            basketCommentDocumentTypeTable.Columns.Add("BasketCommentTypeID");
            basketCommentDocumentTypeTable.Columns.Add("DocumentTypeCode");

            if (objSave.Comments != null)
            {
                foreach (var i in objSave.Comments)
                {
                    basketCommentTable.Rows.Add(i.BasketCommentID, i.BasketSplitID, i.BasketCommentTypeID, i.Comment);

                    foreach (var j in i.SelectedDocumentTypes)
                    {
                        basketCommentDocumentTypeTable.Rows.Add(i.BasketCommentID, i.BasketSplitID, i.BasketCommentTypeID, j);
                    }
                }
            }

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objSave.BasketID),
                new SqlParameter("@BasketComment",  basketCommentTable)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[portal].[BasketCommentTableType]"
                },
                new SqlParameter("@BasketCommentDocumentMap", basketCommentDocumentTypeTable)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[portal].[BasketComment_DocumentTypeTableType]"
                }
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Basket_Comment_Save]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                result = cmd.ExecuteNonQuery();
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


        public int SaveBasketNotes(PassBasketNoteSave objSave)
        {
            var result = -1;

            var basketNoteTable = new DataTable();

            basketNoteTable.Columns.Add("BasketSplitID");
            basketNoteTable.Columns.Add("BasketNoteTypeID");
            basketNoteTable.Columns.Add("BasketNoteID");
            basketNoteTable.Columns.Add("Note");

            if (objSave.Notes != null)
            {
                foreach (var i in objSave.Notes)
                {
                    basketNoteTable.Rows.Add(i.BasketSplitID, i.BasketNoteTypeID, i.BasketNoteID, i.Note);
                }
            }

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objSave.BasketID),
                new SqlParameter("@BasketNotes",  basketNoteTable)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[portal].[BasketNoteTableType]"
                }
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Basket_Note_Save]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                result = cmd.ExecuteNonQuery();
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

        public BasketParametersResult FetchBasketParameters(PassBasketID objBasketId)
        {
            var result = new BasketParametersResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objBasketId.BasketID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_Parameters_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.PatternBookSchemes = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<PatternBookSchemeResult>(reader).ToList();

                reader.NextResult();

                result.BasketDetails = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketDetail>(reader).Single();
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

        public bool SaveBasketDetails(PassBasketParameters objParams)
        {
            try
            {
                var basket = this.Baskets.Where(p => p.BasketID == objParams.BasketID).Single();

                basket.OrderReference = objParams.OrderReference;
                basket.Email = objParams.Email;

                if (basket.DeliveryAlertEmail == null)
                    basket.DeliveryAlertEmail = objParams.Email;

                basket.OrderTaker = objParams.OrderTaker;
                basket.PaymentTermsID = objParams.PaymentTermsID;
                basket.SalesRepresentativeID = objParams.SalesRepresentativeID;
                basket.SalesAgentID = objParams.SalesAgentID;
                basket.TransactionTypeID = objParams.TransactionTypeID;
                basket.RaisedAsResultOfClaim = objParams.RaisedAsResultOfClaim;
                basket.AllocateProforma = objParams.AllocateProforma;
                basket.HeldForSales = objParams.HeldForSales;
                basket.HeldForSalesReasonCode = objParams.HeldForSalesReasonCode;
                basket.IsContractOrder = objParams.ContractOrder;
                basket.USTaxExemptionCertificate = objParams.USTaxExemptionCertificate;
                basket.VATNumber = objParams.VATNumber;
                basket.VATCountryCode = objParams.VATCountryCode;
                basket.ValidVATNumber = objParams.ValidVATNumber;
                basket.ReplacementOrderComment = objParams.ReplacementOrderComment;
                basket.CallTypeID = objParams.CallTypeID;
                basket.CallerName = objParams.CallerName;
                basket.EORI = objParams.EORINumber;
                basket.VIESConsultationNumber = objParams.VIESConsultationNumber;

                this.SaveChanges();

                return true;
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public bool SaveBasketEUExitDetails(PassBasketEUExitParameters objParams)
        {
            try
            {
                var basket = this.Baskets.Where(p => p.BasketID == objParams.BasketID).Single();

                //basket.EUExitCode = objParams.EUExitCode;

                basket.EUExitingConfirmed = objParams.EUExitingConfirmed;

                if (objParams.EUExitingConfirmed)
                    basket.EUExitCode = "EUEXITCODE";
                else
                    basket.EUExitCode = null;

                basket.EUExitFullName = objParams.Address.deliveryName;
                basket.EUExitCompanyName = objParams.Address.deliveryCompanyName;
                basket.EUExitAddressLine1 = objParams.Address.deliveryAddressLine1;
                basket.EUExitAddressLine2 = objParams.Address.deliveryAddressLine2;
                basket.EUExitTown = objParams.Address.deliveryTown;
                basket.EUExitCounty = objParams.Address.deliveryCounty;
                basket.EUExitPostcode = objParams.Address.deliveryPostcode;
                basket.EUExitPhoneNumber = objParams.Address.deliveryPhoneNumber;
                basket.EUExitCountryCode = objParams.Address.deliveryCountryCode;
                basket.EUExitCountryID = objParams.Address.deliveryCountryId;

                this.SaveChanges();

                return true;
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public TradeAccountVATNumber VATNumberLookup(PassBasketID objBasketId) 
        {
            var result = new TradeAccountVATNumber();

            result.Errored = false;

            try
            {
                var parameters = new List<SqlParameter>()
                {
                    new SqlParameter("@BasketID", objBasketId.BasketID)
                };

                // Create a SQL command to execute the sproc
                var cmd = this.Database.Connection.CreateCommand();
                cmd.CommandText = "[portal].[VATNumber_Select]";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddRange(parameters.ToArray());

                try
                {
                    this.Database.Connection.Open();
                    // Run the sproc 
                    var reader = cmd.ExecuteReader();

                    result = ((IObjectContextAdapter)this)
                        .ObjectContext
                        .Translate<TradeAccountVATNumber>(reader).Single();
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
            }
            catch (Exception)
            {
                result.Errored = true;
            }

            return result;
        }

        public DeliveryServicesRefreshResult RefreshDeliveryServicesList(PassDeliveryServiceOptions objOptions)
        {
            var result = new DeliveryServicesRefreshResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objOptions.BasketID),
                new SqlParameter("@BasketSplitID", objOptions.BasketSplitID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_DeliveryService_SelectList]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.DeliveryServices = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DeliveryServiceResult>(reader).ToList();
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

        public SaveCustomerTransportAccountNumberReturn SaveCustomerTransportAccountNumber(PassCustomerTransportAccountNumber objAccount)
        {
            var result = new SaveCustomerTransportAccountNumberReturn();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objAccount.BasketID),
                new SqlParameter("@BasketSplitID", objAccount.BasketSplitID),
                new SqlParameter("@CustomerTransportAccountNumber", objAccount.CustomerTransportAccountNumber)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_DeliveryService_CustomerTransportAccountCode_Save]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                result.Result = cmd.ExecuteNonQuery();
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

        public int SaveBasketReason(PassSaveBasketReason objReason)
        {
            try
            {
                var b = this.Baskets.Where(p => p.BasketID == objReason.BasketID).Single();

                b.SavedBasketReasonID = objReason.SavedBasketReasonID;

                return this.SaveChanges();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }


        public BasketReviewResult FetchBasketReview(PassBasketID objBasketId)
        {
            var result = new BasketReviewResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objBasketId.BasketID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_Review_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandTimeout = 600;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.SummaryNotices = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketSummaryNotice>(reader).ToList();

                reader.NextResult();

                result.BasketItemNotices = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemNotice>(reader).ToList();

                reader.NextResult();

                result.SalesManagers = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<SalesManager>(reader).ToList();

                reader.NextResult();

                result.DeliveryServiceUpdates = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DeliveryServiceResult>(reader).ToList();

                reader.NextResult();

                var sb = new StringBuilder();

                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }

                var notices = sb.ToString();

                result.Notifications = new DatabaseJSONResult()
                {
                    JSON = notices
                };
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

        public int SaveBasketReview(PassBasketReviewSave objSave)
        {
            var result = 0;

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objSave.BasketID),
                new SqlParameter("@DiscountApprovedByManagerMemberID", objSave.DiscountApprovedByManagerMemberID),
                new SqlParameter("@DiscountManagerMessage", objSave.DiscountManagerMessage),
                new SqlParameter("@DuplicateLineAcknowledgement", objSave.DuplicateLineAcknowledgement),
                new SqlParameter("@HeldForSalesReasonCode", objSave.HeldForSalesReasonCode),
                new SqlParameter("@HeldForSalesAdditionalInformation", objSave.HeldForSalesAdditionalInformation),
                new SqlParameter("@HaltInvalidVATNumber", objSave.Halt ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_Review_Save]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                result = cmd.ExecuteNonQuery();
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

        public BasketItemPreAllocationSelectResult FetchBasketItemPreAllocations(PassBasketItemID objBasketItemId)
        {
            var result = new BasketItemPreAllocationSelectResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketItemID", objBasketItemId.BasketItemID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[BasketPreAllocation_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.PreAllocations = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemPreAllocationInfo>(reader).ToList();
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

        public DeliveryGroupBulkDiscountResult FetchDeliveryGroup_BulkDiscount(PassBasketDeliveryGroup objDeliveryGroup)
        {
            var result = new DeliveryGroupBulkDiscountResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objDeliveryGroup.BasketID),
                new SqlParameter("@DeliveryGroupID", objDeliveryGroup.DeliveryGroupID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_BulkDiscount]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Products = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DeliveryGroupBulkDiscountProductResult>(reader).ToList();
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

        public BasketReceipt Basket_FetchReceipt(long basketId)
        {
            var result = new BasketReceipt();

            SqlParameter basketIdParam = new SqlParameter("@BasketID", basketId);

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = @"portal.[BasketReceipt_Select]";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Add(basketIdParam);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.OrderHeads = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketReceiptOrderHeadDetail>(reader).ToList();

                reader.NextResult();

                result.OrderLines = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketReceiptOrderLineDetail>(reader).ToList();

                reader.NextResult();

                result.Payments = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketReceiptPaymentDetail>(reader).ToList();
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

        public int FurnitureMaterialBreakdownMerge(PassFurnitureMaterialBreakdown objSave)
        {
            var result = -1;

            var recordsDt = new DataTable();

            recordsDt.Columns.Add("SupplierID", typeof(short));
            recordsDt.Columns.Add("ComponentID", typeof(short));
            recordsDt.Columns.Add("MaterialGroupID", typeof(short));
            recordsDt.Columns.Add("Quantity", typeof(decimal));

            foreach (var r in objSave.records)
            {
                recordsDt.Rows.Add(r.SupplierID,
                            r.ComponentID,
                            r.MaterialGroupID,
                            r.Quantity);
            }

            var seatCushionFillings = new DataTable();

            seatCushionFillings.Columns.Add("CushionFillingID", typeof(short));

            foreach (var r in objSave.designSeatCushionFillingIds)
            {
                seatCushionFillings.Rows.Add(r.cushionFillingId);
            }

            var backCushionFillings = new DataTable();

            backCushionFillings.Columns.Add("CushionFillingID", typeof(short));

            foreach (var r in objSave.designBackCushionFillingIds)
            {
                backCushionFillings.Rows.Add(r.cushionFillingId);
            }

            var coverTypes = new DataTable();

            coverTypes.Columns.Add("CoverTypeID", typeof(short));
            coverTypes.Columns.Add("SupplierID", typeof(short));

            foreach (var r in objSave.designSupplierCoverTypeIds)
            {
                coverTypes.Rows.Add(r.coverTypeId, r.supplierId);
            }

            var legTypes = new DataTable();

            legTypes.Columns.Add("LegTypeID", typeof(short));

            foreach (var r in objSave.designLegTypeIds)
            {
                legTypes.Rows.Add(r.legTypeId);
            }

            var productsDt = new DataTable();

            productsDt.Columns.Add("ProductID", typeof(int));

            foreach (var r in objSave.designFabricRestrictions)
            {
                productsDt.Rows.Add(r.productId);
            }

            var stitchColoursDt = new DataTable();

            stitchColoursDt.Columns.Add("StitchColourID", typeof(short));

            foreach (var r in objSave.designStitchColourRestrictions)
            {
                stitchColoursDt.Rows.Add(r.stitchColourId);
            }

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[furniture].[MaterialBreakdown_Merge]";
            cmd.CommandType = CommandType.StoredProcedure;

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@ModelID", objSave.modelId),
                new SqlParameter("@DesignID", objSave.designId),
                new SqlParameter("@Width", objSave.width),
                new SqlParameter("@Height", objSave.height),
                new SqlParameter("@Depth", objSave.depth),
                new SqlParameter("@SeatHeight", objSave.seatHeight),
                new SqlParameter("@SeatDepth", objSave.seatDepth),
                new SqlParameter("@SeatCount", objSave.seatCount),
                new SqlParameter("@SeatCushionCount", objSave.seatCushionCount),
                new SqlParameter("@BackCushionCount", objSave.backCushionCount),
                new SqlParameter("@Interline", objSave.interline),
                new SqlParameter("@Button", objSave.button),
                new SqlParameter("@Trim", objSave.trim),
                new SqlParameter("@Stitching", objSave.stitching),
                new SqlParameter("@LeatherAvailable", objSave.leatherAvailable),
                new SqlParameter("@LegsRemovable", objSave.legsRemovable),
                new SqlParameter("@LegNotes", objSave.legNotes ?? (object)DBNull.Value),
                new SqlParameter("@ImageID", objSave.imageId ?? (object)DBNull.Value),
                new SqlParameter("@WoodenArms", objSave.woodenArms),
                new SqlParameter("@Comments", objSave.comments ?? (object)DBNull.Value),
                new SqlParameter("@Discontinued", objSave.discontinued),
                new SqlParameter("@PermitMixedFabric", objSave.designPermitMixedFabric),
                new SqlParameter("@PermitAdditionalCover", objSave.permitAdditionalCover),
                new SqlParameter("@DesignSeatCushionFillingIDs",  seatCushionFillings)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[furniture].[CushionFillingIDTableType]"
                },
                new SqlParameter("@DesignBackCushionFillingIDs",  backCushionFillings)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[furniture].[CushionFillingIDTableType]"
                },
                new SqlParameter("@CoverTypeIDsSupplierIDs",  coverTypes)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[furniture].[CoverTypeIDSupplierIDTableType]"
                },
                new SqlParameter("@LegTypeIDs",  legTypes)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[furniture].[LegTypeIDTableType]"
                },
                new SqlParameter("@ModelDetails",  recordsDt)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[furniture].[MaterialBreakdownTableType]"
                },
                new SqlParameter("@FabricRestrictions", productsDt)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[dbo].[ProductIDsTableType]"
                },
                new SqlParameter("@StitchColourRestrictions", stitchColoursDt)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[furniture].[StitchColourIDTableType]"
                }
            };

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                result = cmd.ExecuteNonQuery();
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

        public DocumentSelectResult SelectDocument(PassDocumentIdentifier objDoc)
        {
            var result = new DocumentSelectResult(objDoc.documentType);

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@DocumentID", objDoc.documentType),
                new SqlParameter("@BasketID", objDoc.basketId),
                new SqlParameter("@TransactionID", objDoc.transactionId ?? (object)DBNull.Value),
                new SqlParameter("@OrderHeadID", objDoc.orderHeadId ?? (object)DBNull.Value),
                new SqlParameter("@LanguageID", objDoc.languageId),
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Document_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Resources = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ResourceSelect>(reader).ToList();

                reader.NextResult();

                result.Document.DocumentPreHeader = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentPreHeader>(reader).Single();

                reader.NextResult();

                result.Document.DocumentHeader = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentHeader>(reader).Single();

                reader.NextResult();

                result.Document.OrderHeaders = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentOrderHeader>(reader).ToList();

                reader.NextResult();

                result.Document.ColumnHeadings = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentColumnHeading>(reader).ToList();

                reader.NextResult();

                result.Document.OrderLines = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentOrderLine>(reader).ToList();

                reader.NextResult();

                result.Document.OrderLineMemos = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentOrderLineMemo>(reader).ToList();

                reader.NextResult();

                result.Document.OrderTotals = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentOrderTotal>(reader).ToList();

                reader.NextResult();

                result.Document.OrderMemos = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentOrderMemo>(reader).ToList();

                reader.NextResult();

                result.Document.OrderFooters = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentOrderFooter>(reader).ToList();

                reader.NextResult();

                result.Document.DocumentFooter = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentFooter>(reader).Single();

                reader.NextResult();

                result.Document.PageFooter = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<PageFooter>(reader).FirstOrDefault();

                reader.NextResult();

                result.Document.DocumentEmail = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentEmail>(reader).FirstOrDefault();
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

        public DatabaseJSONResult FetchTransactionView(PassTransactionID objTransactionId)
        {
            var result = new DatabaseJSONResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TransactionID", objTransactionId.TransactionID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Transaction_View]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                var sb = new StringBuilder();

                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }

                reader.Close();

                this.Database.Connection.Close();

                result.JSON = sb.ToString();
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

        public DatabaseJSONResult FetchBasketView(PassBasketID objBasketId)
        {
            var result = new DatabaseJSONResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketID", objBasketId.BasketID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_View]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                var sb = new StringBuilder();

                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }

                reader.Close();

                this.Database.Connection.Close();

                result.JSON = sb.ToString();
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

        public int BasketReload(int memberId, long basketId)
        {
            var result = -1;

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@MemberID", memberId),
                new SqlParameter("@BasketID", basketId)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_Reload]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                result = cmd.ExecuteNonQuery();

                this.Database.Connection.Close();
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

        public string TransactionEdit(int transactionId, int memberId)
        {
            var result = "";

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@MemberID", memberId),
                new SqlParameter("@TransactionID", transactionId)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Transaction_Edit]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    result = reader.IsDBNull(0) ? "Whoops, something went wrong!" : reader.GetString(0);
                }

                reader.Close();

                this.Database.Connection.Close();
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

        public PaymentTermsResult FetchPaymentTerms(PassPaymentTermsSearch objSearch)
        {
            var result = new PaymentTermsResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objSearch.basketId),
                new SqlParameter("@TradeAccountID", objSearch.tradeAccountId),
                new SqlParameter("@SearchTerm", objSearch.searchTerm ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[PaymentTerms_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<PaymentTermsSelectResult>(reader).ToList();
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

        public DesignFabricSearchResultWrapper DesignFabricRestrictionSearch(PassDesignFabricSearch objSearch)
        {
            var result = new DesignFabricSearchResultWrapper();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@DesignID", objSearch.designId),
                new SqlParameter("@SearchString", objSearch.searchTerm ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Design_FabricRestriction_Search]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DesignFabricSearchResult>(reader).ToList();
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

        public List<MertexReportDataOrderSearchResult> TradeOrder_SearchByReference(string customerOrderReference)
        {
            var results = new List<MertexReportDataOrderSearchResult>();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@CustomerOrderReference", $"{customerOrderReference}%")
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = @"SELECT  TOP 100 
                                        SORDNO AS OrderNumber, 
                                        CUSREF AS TradeAccountCode, 
                                        DATEONFILE AS DateOnFile,
                                        CUSORDNO_DES AS CustomerOrderReference
                                FROM    MertexReportData.dbo.XITOEHEAD 
                                WHERE   CUSORDNO_DES LIKE @CustomerOrderReference
                                ORDER BY DATEONFILE DESC";
            cmd.CommandType = CommandType.Text;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<MertexReportDataOrderSearchResult>(reader).ToList();
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

            return results;
        }

        public DatabaseJSONResult BasketTradeAccountCheck(PassTradeAccountID objTradeAccountId)
        {
            var result = new DatabaseJSONResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TradeAccountID", objTradeAccountId.tradeAccountId)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_TradeAccount_Check]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                var sb = new StringBuilder();

                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }

                reader.Close();

                this.Database.Connection.Close();

                result.JSON = sb.ToString();
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

        public int ImportInternalOrderFile(int memberId, string fileName, string tradeAccountNumber,
            string email, string contents, DateTime date)
        {
            int result = -1;

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@MemberID", memberId),
                new SqlParameter("@FileName", fileName),
                new SqlParameter("@TradeAccountNumber", tradeAccountNumber),
                new SqlParameter("@Email", email),
                new SqlParameter("@Contents", contents),
                new SqlParameter("@UploadedDT", date),
                new SqlParameter("@CreatedDT", date)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = @"INSERT INTO [portal].[TradeOrderImport_File]
                                            (ImportedByMemberID
                                            ,FileName
                                            ,TradeAccountNumber
                                            ,Email
                                            ,Contents
                                            ,UploadedDT
                                            ,CreatedDT)
                                VALUES (
                                    @MemberID,
                                    @FileName,
                                    @TradeAccountNumber,
                                    @Email,
                                    @Contents,
                                    @UploadedDT,
                                    @CreatedDT
                                )";
            cmd.CommandType = CommandType.Text;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                result = cmd.ExecuteNonQuery();

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

        public Task<IEnumerable<BasketStatusResult>> FetchBasketStatuses(PassBasketStatusEnquiry objEnquiry)
        {
            return this.Database.Connection.QueryAsync<BasketStatusResult>("[portal].[BasketStatusCheck]", new { 
                objEnquiry.TradeAccountID,
                objEnquiry.CustomerReference,
                objEnquiry.OrderNumber,
                From = objEnquiry.FromDT,
                To = objEnquiry.ToDT
            }, null, 30, CommandType.StoredProcedure);
        }

        public IEnumerable<Reason> HeldForSalesReasonAutocomplete(PassAutocompleteTerm objTerm)
        {
            return this.Database.Connection.QueryAsync("[portal].[HeldForSalesReason_Search]", new
            {
                SearchTerm = objTerm.term
            }, null, 30, CommandType.StoredProcedure).Result.Select(row =>
            {
                var r = new Reason((string)row.Code);
                r.Name = (string)row.Name;
                return r;
            });
        }

        public async Task<int> DeleteBasketSplitDeliveryService(PassBasketSplit objBasketSplit)
        {
            return await this.Database.Connection.QuerySingleAsync<int>("[portal].[Basket_DeliveryService_Delete]", new
            {
                objBasketSplit.BasketID,
                objBasketSplit.BasketSplitID
            }, null, 30, CommandType.StoredProcedure);
        }
    }
}