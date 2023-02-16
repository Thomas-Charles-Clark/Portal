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
                objEnquiry.MemberID
            }, null, null, System.Data.CommandType.StoredProcedure);

            return new PaintOrderHeadSelectResponse()
            {
                Orders = results.Read<PaintOrderHeadSelect>()
            };
        }

        public async Task<PaintOrderLineSelectResponse> PaintOrderLineSelect(PassPaintOrderLineSelect objEnquiry)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[paint].[OrderLine_Select]", new
            {
                objEnquiry.OrderID,
                objEnquiry.MemberID
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
            }, null, null, System.Data.CommandType.StoredProcedure);

            return result;
        }

        public async Task<PaintOrderLineCancelResponse> PaintOrderLineCancel(PassPaintOrderLineCancel objCancel)
        {
            var result = await this.Database.Connection.QuerySingleAsync<PaintOrderLineCancelResponse>("[paint].[OrderLine_Cancel]", new
            {
                objCancel.OrderID,
                objCancel.MemberID
            }, null, null, System.Data.CommandType.StoredProcedure);

            return result;
        }

        public async Task<PaintGenerateBoxLabelResponse> PaintGenerateBoxLabels(PassPaintBoxLabelSelect objEnquiry)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[paint].[GenerateBoxLabel]", new
            {
                objEnquiry.MixingSessionID
            }, null, null, System.Data.CommandType.StoredProcedure);

            return new PaintGenerateBoxLabelResponse()
            {
                BoxLabels = results.Read<PaintBoxLabel>(),
                Notices = results.ReadSingle<PaintNotice>()
            };
        }
    }
}