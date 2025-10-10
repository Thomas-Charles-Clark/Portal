using Portal.Areas.Customers.ViewModels;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models;
using SharedEFClasses;
using System.Collections.Generic;
using System.Threading.Tasks;
using SharedEFClasses.Models.Documents;
using System;

namespace Portal.Areas.Documents.ViewModels
{
    public class DocumentsSentReportViewModel : BaseViewModel
    {
        public PassDocumentSentReportDto Dto { get; set; }
        public DocumentSentReportResult SentReport { get; set; }

        public DocumentsSentReportViewModel(PassDocumentSentReportDto dto, RoleProperties properties, string applicationHeading, string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            Dto = dto;
        }

        public static async Task<DocumentsSentReportViewModel> CreateAsync(
            PassDocumentSentReportDto dto,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var portalDb = new PortalDbContext();

            var result = new DocumentsSentReportViewModel(dto, properties, applicationHeading, applicationSubHeading);

            result.SentReport = await portalDb.FetchDocumentSentReport(dto);

            return result;
        }
    }
}