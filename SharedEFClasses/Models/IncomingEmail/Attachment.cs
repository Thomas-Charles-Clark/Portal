using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

using Newtonsoft.Json;

using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Mertex;
using SharedEFClasses.Utilities;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("Attachment", Schema = "IncomingEmail")]
    public class Attachment
    {
        [Key]
        public long AttachmentID { get; set; }

        public long EmailID { get; set; }

        public string EmailAttachmentID { get; set; }

        public short AttachmentTypeID { get; set; }

        public string FileName { get; set; }

        public string FileExtension { get; set; }

        public int? ProcessedByMemberID { get; set; }

        public int Size { get; set; }

        public bool IsInline { get; set; }

        // This is the important one for inline attachments.
        public string ContentID { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public DateTime? ProcessedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Processed { get; set; }

        public DateTime? SubmittedToMertexDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool SubmittedToMertex { get; set; }

        public DateTime? DocumentDate { get; set; }

        public DateTime? DocumentDueDate { get; set; }

        public decimal? DocumentTotalInc { get; set; }

        public byte? DocumentCurrencyID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public byte? AttachmentStatusID { get; set; }

        [ForeignKey("DocumentCurrencyID")]
        public Currency DocumentCurrency { get; set; }

        public string SearchKeywords { get; set; }

        public string MertexCode { get; set; }

        public string SupplierDocumentReference { get; set; }

        public DateTime? ForwardedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Forwarded { get; set; }

        public DateTime? ForwardedNotificationSentDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool ForwardedNotificationSent { get; set; }

        public int? ForwardedByMemberID { get; set; }

        public int? ForwardedToMemberID { get; set; }

        [JsonIgnore]
        [ForeignKey("EmailID")]
        public virtual Email Email { get; set; }

        [NotMapped]
        public DateTime ReceivedDT
        {
            get
            {
                return Email.ReceivedDT;
            }
        }

        [NotMapped]
        public virtual SupplierLive Supplier 
        { 
            get
            {
                return Email.Supplier;
            } 
        }

        [NotMapped]
        public virtual BudgetHolder BudgetHolder
        {
            get
            {
                return Supplier?.BudgetHolder;
            }
        }

        [ForeignKey("AttachmentTypeID")]
        public virtual AttachmentType AttachmentType { get; set; }

        [NotMapped]
        public virtual string AttachmentTypeName 
        { 
            get
            {
                return AttachmentType?.Name;
            } 
        }

        //[ForeignKey("AttachmentStatusID")]
        //public virtual AttachmentStatus AttachmentStatus { get; set; }

        [ForeignKey("ProcessedByMemberID")]
        public virtual Member ProcessedBy { get; set; }

        [NotMapped]
        public string FileSizeDisplay
        {
            get
            {
                return $"{((decimal)Size / (decimal)1024 / (decimal)1024):0.00} MB";
            }
        }

        [NotMapped]
        public virtual IncomingEmail_Attachment_SelectResult SelectResult { get; set; }


        [NotMapped]
        public string AttachmentStatusName { get; set; }

        [NotMapped]
        public string AttachmentSharingLink 
        { 
            get 
            {
                return $"{HttpContext.Current.Request.Url.Scheme}://{HttpContext.Current.Request.Url.Authority}/invoices/booking?document={HttpUtility.UrlEncode(dgCrypto.Encrypt($"{AttachmentID}"))}";    
            }
        }

        //[ForeignKey("AttachmentStatusID")]
        //public virtual AttachmentStatus AttachmentStatus { get; set; }

        [ForeignKey("ForwardedToMemberID")]
        public virtual Member ForwardedToMember { get; set; }

        [ForeignKey("ForwardedByMemberID")]
        public virtual Member ForwardedByMember { get; set; }
    }
}
