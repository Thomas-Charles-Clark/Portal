using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Mertexer;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public class TradeAccountCreationEmailAttachmentDto
    {
        public int TradeAccountCreationEmailAttachmentID { get; set; }
        public string name { get; set; }
        public string path { get; set; }
        public string salesMarket { get; set; }
        public int fileSizeBytes { get; set; }
        public byte sortOrder { get; set; }

        public string PathRoot
        {
            get
            {
                return "\\\\vm-web1\\brochures\\trade-account-creation-email";
            }
        }

        public string SalesMarketFolderName
        {
            get
            {
                return $"{salesMarket.ToLowerInvariant().Replace(" ", "-")}";
            }
        }

        public string DestinationFileName
        {
            get
            {
                return System.Text.RegularExpressions.Regex.Replace(System.IO.Path.GetFileName(path).ToLowerInvariant(), "[^\\w\\d.]+", "-");
            }
        }

        public string FinalFilePath
        {
            get
            {
                return $"{PathRoot}\\{SalesMarketFolderName}\\{DestinationFileName}";
            }
        }
    }

    public class SendTradeAccountCreationEmailTestDto
    {
        public string to { get; set; }
        public string subject { get; set; }

        public bool displayAccountManager { get; set; }
        public bool displayCustomerService { get; set; }
        public bool displayCreditControl { get; set; }
        public bool displayB2BRegistration { get; set; }
        public bool displayLookbook { get; set; }
        public IEnumerable<TradeAccountCreationEmailAttachmentDto> attachments { get; set; }
    }

    [Table("TradeAccountCreationEmail", Schema = "portal")]
    public class TradeAccountCreationEmail
    {
        [Key]
        public int TradeAccountCreationEmailID { get; set; }
        public byte SalesMarketID { get; set; }
        public string MertexLanguageCode { get; set; }
        public byte? LanguageID { get; set; }
        public bool DisplayContactDetails_AccountManager { get; set; }
        public bool DisplayContactDetails_CustomerService { get; set; }
        public bool DisplayContactDetails_CreditControl { get; set; }
        public bool DisplayB2BRegistrationRequest { get; set; }
        public bool DisplayLookbook { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("SalesMarketID")]
        public virtual SalesMarket SalesMarket { get; set; }

        [ForeignKey("MertexLanguageCode")]
        public virtual MertexLanguage MertexLanguage { get; set; }

        [ForeignKey("LanguageID")]
        public virtual Language Language { get; set; }

        [InverseProperty("Email")]
        public virtual ICollection<TradeAccountCreationEmail_TradeAccountCreationEmailAttachment> EmailAttachments { get; set; }
    }

    public class SaveTradeAccountCreationEmailDto
    {
        public int tradeAccountCreationEmailId { get; set; }

        public bool displayAccountManager { get; set; }
        public bool displayCustomerService { get; set; }
        public bool displayCreditControl { get; set; }
        public bool displayB2BRegistration { get; set; }
        public bool displayLookbook { get; set; }
        public IEnumerable<TradeAccountCreationEmailAttachmentDto> attachments { get; set; }
    }
}
