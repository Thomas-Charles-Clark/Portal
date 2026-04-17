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

using SimpleImpersonation;
using SharedEFClasses.Models.NeimanMarcus;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Models.CreditControl;
using NLog.LayoutRenderers;
using SharedEFClasses.Models.Banking;
using SharedEFClasses.Models.Reporting.CloseBrothers;
using Newtonsoft.Json;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
		public async Task<CloseBrothers_Fundability_Select_Result> CloseBrothers_Fundability_Select(CloseBrothers_Fundability_Select_DTO dto)
		{
			var result = new CloseBrothers_Fundability_Select_Result();

#if DEBUG
			var fileName = $"{AppDomain.CurrentDomain.BaseDirectory}\\rpt.CB_Fundability.json";

			if (System.IO.File.Exists(fileName))
			{
				result = JsonConvert.DeserializeObject<CloseBrothers_Fundability_Select_Result>(System.IO.File.ReadAllText(fileName));

				return result;
			}
#endif

			var reply = await this.Database.Connection.QueryMultipleAsync("[rpt].[CB_Fundability]", new
			{
				//FromDate = dto.From.Value.Date,
				//ToDate = dto.To.Value.Date
			}, null, 300, CommandType.StoredProcedure);

			result.Records = await reply.ReadAsync<CloseBrothers_Fundability_Select_Record>();

#if DEBUG
			System.IO.File.WriteAllText(fileName, JsonConvert.SerializeObject(result));
#endif

			return result;
		}
	}
}
