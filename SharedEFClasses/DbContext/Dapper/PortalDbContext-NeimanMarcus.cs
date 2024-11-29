using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;
using SharedEFClasses.Models.Fenwick;
using SharedEFClasses.Models.StockManagement;
using UPSShippingWebService.Classes;
using SharedEFClasses.Models.NeimanMarcus;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<NeimanMarcusOrderStatusResponse> NeimanMarcus_OrderInspect(NeimanMarcusOrderStatusGridDto dto)
        {
            DateTime? toDt = DateTime.Now;

            DateTime? fromDt = null;

            switch (dto.dateRangeId)
            {
                case 12:
                    fromDt = DateTime.Now.AddYears(-1);
                    break;
                case 6:
                    fromDt = DateTime.Now.AddMonths(-6);
                    break;
                case 1:
                    fromDt = DateTime.Now.AddDays(-DateTime.Now.Day).AddDays(1);
                    break;
                case -1:
                    toDt = dto.toDate;
                    fromDt = dto.fromDate;
                    break;
            }

            var reply = await this.Database.Connection.QueryMultipleAsync("[NeimanMarcus].[Order_Inspect]", new
            {
                Status = dto.status,
                From = fromDt,
                To = toDt,
                SearchTerm = dto.searchTerm
            }, null, 300, CommandType.StoredProcedure);

            return new NeimanMarcusOrderStatusResponse()
            {
                Orders = reply.Read<NeimanMarcusOrderStatusOrderResult>(),
                TitleExplanations = reply.ReadSingle<NeimanMarcusOrderStatusTitleExplanationResult>(),
            };
        }
    }
}
