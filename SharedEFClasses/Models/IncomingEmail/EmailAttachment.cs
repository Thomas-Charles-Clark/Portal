using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class EmailAttachment
    {
        public string EmailAttachmentID { get; set; }

        public string ContentType { get; set; }

        public string FileExtension { get; set; }

        public bool IsInline { get; set; }

        public string Name { get; set; }

        public int Size { get; set; }

        public byte[] ContentBytes { get; set; }
    }
}
