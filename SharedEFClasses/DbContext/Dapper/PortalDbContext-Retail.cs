using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Mertexer;

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
        public async Task<IEnumerable<RetailTill>> FetchRetailTills()
        {
            var results = await this.Database.Connection.QueryAsync("[portal].[RetailTill_Select]", new
            {

            }, null, 300, CommandType.StoredProcedure);
            
            return results.Select(rt =>
            {
                var result = new RetailTill((string)rt.TillNumber);
                result.Description = (string)rt.Name;
                return result;
            });
        }

        public async Task<IEnumerable<RetailTillSession>> FetchRetailTillSessions()
        {
            var results = await this.Database.Connection.QueryAsync("[portal].[RetailTillSession_Select]", new
            {

            }, null, 300, CommandType.StoredProcedure);

            return results.Select(rt =>
            {
                var result = new RetailTillSession((string)rt.SessionNumber);
                result.Open = (bool)rt.Open;
                result.OpenedDT = (DateTime)rt.OpenedDT;
                result.OpenedBy = (string)rt.OpenedBy;
                result.TillNumber = (string)rt.TillNumber;
                return result;
            });
        }
    }
}