using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;

using SimpleImpersonation;

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<int> SendTradeAccountCreationEmailTest(SendTestCreationEmailDto dto)
        {
            int result = -1;

            var attachments = new DataTable();

            attachments.Columns.Add("Name", typeof (string));
            attachments.Columns.Add("FilePathUNC", typeof (string));

            foreach (var a in dto.attachments)
            {
                attachments.Rows.Add(a.name, a.path);
            }

            var credentials = new UserCredentials("DESIGNERSGUILD\\tclark", "Theta9Trio");

            var token = credentials.LogonUser(LogonType.Interactive);

            WindowsIdentity.RunImpersonated(token, () => 
            {
                using (var db = new DbContext("Data Source=vm-sql1;Initial Catalog=Flock;Integrated Security=true;MultipleActiveResultSets=true"))
                {
                    var results = this.Database.Connection.QueryMultiple("[portal].[TradeAccountCreationEmail_Send]", new
                    {
                        To = dto.to,
                        Subject = dto.subject,
                        TradeAccountCode = "AB123456",
                        TradeAccountName = "Test Account",
                        DisplayContactDetails_AccountManager = dto.displayAccountManager,
                        DisplayContactDetails_CustomerService = dto.displayCustomerService,
                        DisplayContactDetails_CreditControl = dto.displayCreditControl,
                        DisplayB2BRegistrationRequest = dto.displayB2BRegistration,
                        FileAttachments = attachments
                    }, null, null, System.Data.CommandType.StoredProcedure);

                    var user = results.ReadSingle<string>();

                    result = results.ReadSingle<int>();
                }
            });

            return result;
        }
    }
}
