using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async void SaveErrorToLog(
            int userId,
            string exceptionType,
            string exceptionMessage,
            string exceptionSource,
            string exceptionStackTrace,
            string innerExceptionType,
            string innerExceptionMessage,
            string innerExceptionSource, 
            string innerExceptionStackTrace,
            string urlOfPage,
            string userAgent,
            string ipAddress)
        {
            await this.Database.Connection.QueryAsync("[pub].[LogError]", new
            {
                ErrorDT = DateTime.Now,
                ExceptionType = exceptionType,
                ExceptionMessage = exceptionMessage,
                ExceptionSource = exceptionSource,
                StackTrace = exceptionStackTrace,
                InnerExceptionType = innerExceptionType,
                InnerExceptionMessage = innerExceptionMessage,
                InnerExceptionSource = innerExceptionSource,
                InnerExceptionStackTrace = innerExceptionStackTrace,
                URL = urlOfPage,
                UserAgent = userAgent,
                IP = ipAddress,
                PlatformSwitch = 2,
                MemberID = userId
            }, null, null, System.Data.CommandType.StoredProcedure);
        }

        public Task<IEnumerable<object>> FetchDataList(PassListEnquiry objEnquiry)
        {
            return this.Database.Connection.QueryAsync<object>($"SELECT * FROM {objEnquiry.ReferenceDataSetDecrypted}", null, null, 30, CommandType.Text);
        }

        private IEnumerable<TItem> ExecuteGeneric<TItem>(PassListEnquiry objEnquiry) where TItem : MaintenanceListItem, new()
        {
            return this.Database.Connection.Query<TItem>($"SELECT * FROM {objEnquiry.ReferenceDataSetDecrypted}", null, null, true, 30, CommandType.Text);
        }

        public IEnumerable<MaintenanceListItem> FetchDataList(Type type, PassListEnquiry objEnquiry)
        {
            MethodInfo methodInfo = this.GetType().GetMethod("ExecuteGeneric", BindingFlags.Instance | BindingFlags.NonPublic);

            MethodInfo genericMethodInfo = methodInfo.MakeGenericMethod(new Type[] { type });

            object result = genericMethodInfo.Invoke(this, new object[] { objEnquiry });

            int count = (int)result.GetType().GetProperty("Count").GetValue(result, null);

            PropertyInfo indexer = result.GetType().GetProperty("Item");

            var retval = new List<MaintenanceListItem>();

            for (int ix = 0; ix < count; ++ix)
            {
                object elem = indexer.GetValue(result, new object[] { ix });
                retval.Add((MaintenanceListItem)elem);
            }

            return retval;
        }

        public Task<object> FetchDataItem(PassDataItemEnquiry objEnquiry)
        {
            return this.Database.Connection.QuerySingleAsync<object>($"SELECT * FROM {objEnquiry.ReferenceDataSetDecrypted} WHERE {objEnquiry.FieldName} = {objEnquiry.Value}", null, null, 30, CommandType.Text);
        }

        public IEnumerable<object> FetchDataItems(PassDataItemsEnquiry objEnquiry)
        {
            var results = new List<object>();

            foreach(var v in objEnquiry.Values)
            {
                results.Add(this.Database.Connection.QuerySingle<object>($"SELECT * FROM {objEnquiry.ReferenceDataSetDecrypted} WHERE {objEnquiry.FieldName} = {v}", null, null, 30, CommandType.Text));
            }

            return results;
        }

        public Task<string> FetchPaymentTerms(string tradeAccountCode)
        {
            return this.Database.Connection.QuerySingleAsync<string>($"[portal].[TradeAccount_PaymentTerms_Select]", new { 
                TradeAccountCode = tradeAccountCode
            }, null, 30, CommandType.StoredProcedure);
        }

        public Task<string> FetchEORINumber(string tradeAccountCode)
        {
            return this.Database.Connection.QuerySingleAsync<string>($"[portal].[TradeAccount_EORINumber_Select]", new
            {
                TradeAccountCode = tradeAccountCode
            }, null, 30, CommandType.StoredProcedure);
        }

        public async Task<SharedEFClasses.Models.Products.FetchLinkedDocumentsResult> FetchLinkedDocuments(SharedEFClasses.Models.Orders.PassProductCode objCode)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[Product_LinkedDocuments_Select]", new
            {
                ProductCode = objCode.code
            }, null, null, System.Data.CommandType.StoredProcedure);

            return new SharedEFClasses.Models.Products.FetchLinkedDocumentsResult()
            {
                LinkedDocuments = results.Read<SharedEFClasses.Models.Products.LinkedDocument>().ToList()
            };
        }
    }
}
