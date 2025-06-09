using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class FullEmail
    {
        [Key]
        public long EmailID { get; set; }

        public string EmailMessageID { get; set; }

        public int MailboxID { get; set; }

        public string FromEmail { get; set; }

        public string FromName { get; set; }

        public string ReplyToEmails { get; set; }

        public string ReplyToNames { get; set; }

        public string RecipientEmails { get; set; }

        public string RecipientNames { get; set; }

        public string CCRecipientEmails { get; set; }

        public string CCRecipientNames { get; set; }

        public string BCCRecipientEmails { get; set; }

        public string BCCRecipientNames { get; set; }

        public string Headers { get; set; }

        [StringLength(200)]
        public string Subject { get; set; }

        public string Body { get; set; }

        [StringLength(255)]
        public string BodyPreview { get; set; }

        public string UniqueBody { get; set; }

        [StringLength(50)]
        public string Importance { get; set; }

        [StringLength(50)]
        public string InferenceClassification { get; set; }

        [StringLength(200)]
        public string Version { get; set; }

        [StringLength(200)]
        public string ConversationID { get; set; }

        [StringLength(200)]
        public string ConversationIndex { get; set; }

        public bool HasNonInlineAttachments { get; set; }

        public bool IsRead { get; set; }

        [StringLength(200)]
        public string ParentFolderID { get; set; }

        public string Weblink { get; set; }

        public DateTime ReceivedDT { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool Deleted { get; set; }

        public DateTime? ProcessedDT { get; set; }

        public int Processed { get; set; }

        public int? ProcessedMemberID { get; set; }

        [StringLength(50)]
        public string SupplierCode { get; set; }

        public MertexLive.SupplierLive Supplier { get; set; }

        //public virtual ICollection<Attachment> Attachments
        //{
        //    get; set;
        //}
    }
}
