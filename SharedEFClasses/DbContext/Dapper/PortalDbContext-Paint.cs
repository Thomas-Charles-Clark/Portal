using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Unity.Interception.Utilities;

using UPSShippingWebService.Classes;

namespace SharedEFClasses.Models
{
    /*
        
        USE Flock;
		UPDATE paint.OrderHead SET LockedByMemberID = NULL, LockedDT = NULL;
        UPDATE paint.OrderLine SET MixingSessionID = NULL;
        GO
        DELETE FROM paint.MixingSession;
        GO
        DBCC CHECKIDENT ('paint.MixingSession', RESEED, 0);
        GO

     */

    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<PaintOrderHeadSelectResponse> PaintOrderHeadSelect(PassPaintOrderHeadSelect objEnquiry)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[paint].[OrderHead_Select]", new
            {
                objEnquiry.MixingLocationID,
                objEnquiry.MemberID,
                Mode = 'M'
            }, null, null, CommandType.StoredProcedure);

            return new PaintOrderHeadSelectResponse()
            {
                Orders = results.Read<PaintOrderHeadSelect>()
            };
        }

        public async Task<PaintOrderHeadSelectResponse> PaintOrderHistorySelect(PassPaintOrderHistorySelect objEnquiry)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[paint].[OrderHead_Select]", new
            {
                objEnquiry.MixingLocationID,
                objEnquiry.MemberID,
                Mode = 'H',
                objEnquiry.FromDT,
                objEnquiry.ToDT,
                objEnquiry.SearchTerm
            }, null, null, CommandType.StoredProcedure);

            return new PaintOrderHeadSelectResponse()
            {
                Orders = results.Read<PaintOrderHeadSelect>()
            };
        }

        public async Task<PaintBasePaintOrdersToInvoiceResponse> PaintOrdersToInvoice(PassPaintOrdersToInvoice objEnquiry)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[paint].[BasePaintOrders_Select]", new
            {
                objEnquiry.MixingLocationID,
                Mode = String.IsNullOrEmpty(objEnquiry.Mode) ? "D" : objEnquiry.Mode,
                //objEnquiry.MemberID
            }, null, null, CommandType.StoredProcedure);

            return new PaintBasePaintOrdersToInvoiceResponse()
            {
                Orders = results.Read<BasePaintOrderToInvoice>(),
                Notices = results.ReadSingle<PaintNotice>()
            };
        }

        public async Task<PaintTransferOrdersResponse> PaintTransferOrders(PassTransferGridSelect objEnquiry)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[paint].[Transfer_SelectList]", new
            {
                objEnquiry.MixingLocationID,
                Mode = String.IsNullOrEmpty(objEnquiry.Mode) ? "P" : objEnquiry.Mode
            }, null, null, System.Data.CommandType.StoredProcedure);

            var result = new PaintTransferOrdersResponse()
            {
                Orders = results.Read<PaintTransferOrder>(),
                Notices = results.ReadSingle<PaintNotice>()
            };

            result.Dates = result.Orders.Select(o => o.Date).Distinct();

            return result;
        }

        public async Task<PaintOrderLineSelectResponse> PaintOrderLineSelect(PassPaintOrderLineSelect objEnquiry)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[paint].[OrderLine_Select]", new
            {
                objEnquiry.OrderID,
                objEnquiry.MemberID,
                objEnquiry.Mode
            }, null, null, System.Data.CommandType.StoredProcedure);

            return new PaintOrderLineSelectResponse()
            {
                OrderLines = results.Read<PaintOrderLineSelect>(),
                MixingSessions = results.Read<PaintOrderLineMixingSession>(),
                Notices = results.ReadSingle<PaintNotice>()
            };
        }

        public async Task<PaintOrderLineSaveResponse> PaintOrderLineSave(PassPaintOrderLineSave objSave)
        {
            var orderLines = new DataTable();

            orderLines.Columns.Add("Value");

            objSave.OrderLineIDs.ForEach(ol => orderLines.Rows.Add(ol));

            var result = await this.Database.Connection.QuerySingleAsync<PaintOrderLineSaveResponse>("[paint].[OrderLine_Save]", new
            {
                objSave.OrderID,
                objSave.MemberID,
                OrderLines = orderLines.AsTableValuedParameter("NVARCHAR30TableType"),
                objSave.BoxCount
            }, null, null, CommandType.StoredProcedure);

            return result;
        }

        public async Task<PaintOrderLineCancelResponse> PaintOrderLineCancel(PassPaintOrderLineCancel objCancel)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[paint].[OrderLine_Cancel]", new
            {
                objCancel.OrderID,
                objCancel.MemberID
            }, null, null, CommandType.StoredProcedure);

            return new PaintOrderLineCancelResponse()
            {
                Notices = results.ReadSingle<PaintNotice>()
            };
        }

        public async Task<PaintGenerateBoxLabelResponse> PaintGenerateBoxLabels(PassMixingSessionID objEnquiry)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[paint].[GenerateBoxLabel]", new
            {
                objEnquiry.MixingSessionID
            }, null, null, CommandType.StoredProcedure);

            return new PaintGenerateBoxLabelResponse()
            {
                BoxLabels = results.Read<PaintBoxLabel>(),
                Notices = results.ReadSingle<PaintNotice>()
            };
        }

        public async Task<PaintTransferSaveResponse> PaintTransferSave(PassPaintTransferSave objSave)
        {
            var mixingSessions = new DataTable();

            mixingSessions.Columns.Add("I");

            objSave.TransferOrders.ForEach(o => mixingSessions.Rows.Add(o.MixingSessionID));

            var results = await this.Database.Connection.QueryMultipleAsync("[paint].[Transfer_Save]", new
            {
                MixingSessionIDs = mixingSessions.AsTableValuedParameter("BIGINTTableType")
            }, null, null, CommandType.StoredProcedure);

            return new PaintTransferSaveResponse()
            {
                //Orders = results.Read<TransferSaveResult>(),
                Notices = results.ReadSingle<PaintNotice>()
            };
        }

        public async Task<PaintUpdateOrderStatusResult> PaintUpdateOrderStatus(PassNullableMixingSessionID objEnquiry)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[paint].[BasePaintOrderStatusUpdate]", new
            {
                SingleMixingSessionID = objEnquiry.MixingSessionID
            }, null, null, CommandType.StoredProcedure);

            return new PaintUpdateOrderStatusResult();
        }

        public async Task<PaintUpdateOrderStatusResult> PaintStockOrdersToInvoiceUpdateAll()
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[paint].[BasePaintOrderStatusUpdate]", new
            {

            }, null, 300, CommandType.StoredProcedure);

            var nextResults = await this.Database.Connection.QueryMultipleAsync("[paint].[BasePaintOrderGenerate]", new
            {

            }, null, 300, CommandType.StoredProcedure);

            return new PaintUpdateOrderStatusResult();
        }
    }
}