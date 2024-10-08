using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.DotDigital;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<DotDigitalMemberControl> FetchDotDigitalMemberControls(long memberId)
        {
            var email = this.Users.Single(m => m.Id == memberId).Email;

            var result = await this.Database.Connection.QuerySingleOrDefaultAsync<DotDigitalMemberControl>("SELECT * FROM DotDigital.tfnc_MemberControl() WHERE Email = @Email", new
            {
                Email = email
            }, null, null, CommandType.Text);

            return result;
        }

        public async Task<bool> DotDigitalUnsubscribe(PassDotDigitalAccountChange dto)
        {
            var unsubResult = await this.Database.Connection.QuerySingleAsync<string>("SELECT DotDigital.clr_fnc_Contact_Unsubscribe(@AccountID, @Email)", new
            {
                AccountID = dto.SourceAccountID,
                Email = dto.Email
            }, null, null, CommandType.Text);

            return false;
        }

        public async Task<bool> ChangeDotDigitalAccount(PassDotDigitalAccountChange dto)
        {
            var changeResult = await this.Database.Connection.QueryAsync("UPDATE mbr.Member SET MarketingCountryID = @MarketingCountryID WHERE MemberID = @MemberID", new
            {
                MemberID = dto.MemberID,
                MarketingCountryID = dto.DestinationCountryID
            }, null, null, CommandType.Text);

            var populateResult = await this.Database.Connection.QueryAsync("DotDigital.MemberQueue_Populate", new
            {
                MemberID = dto.MemberID,
                MinMemberID = dto.MemberID,
                MaxMemberID = dto.MemberID,
                AccountID = dto.DestinationAccountID,
                AccountTypeID = dto.DestinationAccountTypeID,
                Priority = 1
            }, null, null, CommandType.StoredProcedure);

            return false;
        }

        public async Task<bool> Member_Subscribe(int memberId)
        {
            var result = await this.Database.Connection.QueryAsync("[DotDigital].[MemberQueue_AddToAddressBook]", new
            {
                MemberID = memberId
            }, null, null, CommandType.StoredProcedure);

            return false;
        }

        public async Task<bool> Member_Resubscribe(string guid)
        {
            var result = await this.Database.Connection.QueryAsync("[pub].[Member_Resubscribe_Begin]", new
            {
                GUID = guid
            }, null, null, CommandType.StoredProcedure);

            return false;
        }

        public async Task<bool> Member_Unsubscribe(PassMember objMember)
        {
            var result = await this.Database.Connection.QueryAsync("[pub].[Member_Unsubscribe]", new
            {
                GUID = objMember.GUID,
                Email = objMember.Email,
                UnsubscribeReasonID = (byte?)null,
                SourceEmailName = (string)null,
                UnsubscribeSourceID = (byte)3
            }, null, null, CommandType.StoredProcedure);

            return false;
        }

        public async Task<bool> Member_ExtantCheck(PassEmail objEmail)
        {
            var result = await this.Database.Connection.QuerySingleOrDefaultAsync<int?>("[pub].[Member_EmailExistsCheck]", new
            {
                Email = objEmail.Email
            }, null, null, CommandType.StoredProcedure);

            return result != null;
        }

        public async Task<bool> EmailContact_Create(PassCreateContact dto)
        {
            var result = await this.Database.Connection.QuerySingleOrDefaultAsync<int?>("[portal].[EmailContact_Create]", new
            {
                Email = dto.Email,
                FullName = dto.FullName,
                DotDigitalAccountID = dto.DotDigitalAccountID
            }, null, null, CommandType.StoredProcedure);

            return result != null;
        }
    }
}
