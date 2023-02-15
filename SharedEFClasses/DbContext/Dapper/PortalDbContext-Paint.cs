using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using UPSShippingWebService.Classes;

namespace SharedEFClasses.Models
{
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
                MixingSessions = results.Read<PaintOrderLineMixingSession>()
            };
        }

        public async Task<PaintOrderLineSaveResponse> PaintOrderLineSave(PassPaintOrderLineSave objSave)
        {
            var result = await this.Database.Connection.QuerySingleAsync<PaintOrderLineSaveResponse>("[paint].[OrderLine_Save]", new
            {
                objSave.OrderID,
                objSave.MemberID,
                objSave.OrderLines,
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
    }
}