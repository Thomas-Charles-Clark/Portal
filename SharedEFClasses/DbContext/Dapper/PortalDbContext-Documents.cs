using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using Org.BouncyCastle.Asn1.Mozilla;

using SharedEFClasses.Models;
using SharedEFClasses.Models.Documents;
using SharedEFClasses.Models.OrderBook;
using SharedEFClasses.Models.Orders;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
	{
		public async Task<DocumentSentReportResult> FetchDocumentSentReport(PassDocumentSentReportDto dto)
		{
			var results = await this.Database.Connection.QueryMultipleAsync("[portal].[DocumentSent_Report]", new
			{
				dto.DocumentID,
				dto.Page,
				dto.PageSize,
				dto.SearchString,
				dto.FromDate,
				dto.ToDate,
				dto.SentDTSortDirection,
				dto.TradeAccountID
			}, null, null, CommandType.StoredProcedure);

			return new DocumentSentReportResult()
			{
				DashboardPods = results.Read<DocumentSentReport_Pod>(),
				Records = results.Read<DocumentSentReport_Record>()
			};
		}

		public async Task<DocumentListResult> FetchDocumentList(PassDocumentListDto dto) 
		{
			var results = await this.Database.Connection.QueryAsync<DocumentRecord>("portal.Document_List", dto, null, null, CommandType.StoredProcedure);

			return new DocumentListResult()
			{
				Results = results
			};
		}
    }
}
