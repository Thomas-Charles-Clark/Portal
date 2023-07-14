using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<int> SendTradeAccountCreationEmailTest(SendTradeAccountCreationEmailTestDto dto)
        {
            var attachments = new DataTable();

            attachments.Columns.Add("Name", typeof (string));
            attachments.Columns.Add("FilePathUNC", typeof (string));

            foreach (var a in dto.attachments)
            {
                //attachments.Rows.Add(a.name, System.Web.HttpUtility.UrlEncode(a.path));
                attachments.Rows.Add(a.name, $"{a.FinalFilePath}");
            }

            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[TradeAccountCreationEmail_Send]", new
            {
                To = dto.to,
                Subject = dto.subject,
                TradeAccountCode = "AB123456",
                TradeAccountName = "Test Account",
                DisplayContactDetails_AccountManager = dto.displayAccountManager,
                DisplayContactDetails_CustomerService = dto.displayCustomerService,
                DisplayContactDetails_CreditControl = dto.displayCreditControl,
                DisplayB2BRegistrationRequest = dto.displayB2BRegistration,
                DisplayLookbook = dto.displayLookbook,
                FileAttachments = attachments
            }, null, null, System.Data.CommandType.StoredProcedure);

            var user = results.ReadSingle<string>();

            var result = results.ReadSingle<int>();

            return result;
        }

        public async Task<int> SaveTradeAccountCreationEmailTest(SaveTradeAccountCreationEmailDto dto)
        {
            var r = this.TradeAccountCreationEmails.SingleOrDefault(p => p.TradeAccountCreationEmailID == dto.tradeAccountCreationEmailId);

            if (r == null)
            {
                r = new TradeAccountCreationEmail();
                this.TradeAccountCreationEmails.Add(r);
                this.SaveChanges();
            }

            r.DisplayB2BRegistrationRequest = dto.displayB2BRegistration;
            r.DisplayLookbook = dto.displayLookbook;
            r.DisplayContactDetails_AccountManager = dto.displayAccountManager;
            r.DisplayContactDetails_CustomerService = dto.displayCustomerService;
            r.DisplayContactDetails_CreditControl = dto.displayCreditControl;

            var attachmentLinker = new List<TradeAccountCreationEmail_TradeAccountCreationEmailAttachment>();

            if (r.EmailAttachments.Any())
            {
                var toRemove = new List<TradeAccountCreationEmail_TradeAccountCreationEmailAttachment>();

                foreach(var ea in r.EmailAttachments)
                {
                    if (dto.attachments.SingleOrDefault(a => a.TradeAccountCreationEmailAttachmentID == ea.TradeAccountCreationEmailAttachmentID) == null)
                    {
                        toRemove.Add(ea);
                    }
                }

                foreach (var removal in toRemove)
                {
                    r.EmailAttachments.Remove(removal);
                }

                this.SaveChanges();
            }

            foreach (var a in dto.attachments)
            {
                var attachment = this.TradeAccountCreationEmailAttachments.SingleOrDefault(p => p.TradeAccountCreationEmailAttachmentID == a.TradeAccountCreationEmailAttachmentID);

                if (attachment == null)
                {
                    attachment = new TradeAccountCreationEmailAttachment()
                    {
                        Name = a.name,
                        FilePath = a.FinalFilePath,
                        FileSizeBytes = a.fileSizeBytes,
                        CreatedDT = DateTime.Now
                    };

                    this.TradeAccountCreationEmailAttachments.Add(attachment);

                    this.SaveChanges();

                    a.TradeAccountCreationEmailAttachmentID = attachment.TradeAccountCreationEmailAttachmentID;
                }
                else
                {
                    // we only permit creation, not editing, of attachment records...?
                    attachment.Name = a.name;
                    attachment.FilePath = a.FinalFilePath;
                    attachment.FileSizeBytes = a.fileSizeBytes;
                }

                attachmentLinker.Add(new TradeAccountCreationEmail_TradeAccountCreationEmailAttachment()
                {
                    TradeAccountCreationEmailID = r.TradeAccountCreationEmailID,
                    TradeAccountCreationEmailAttachmentID = a.TradeAccountCreationEmailAttachmentID,
                    SortOrder = a.sortOrder
                });
            }

            r.EmailAttachments = attachmentLinker;

            this.SaveChanges();

            return 0;
        }
    }
}
