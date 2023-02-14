using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public void TaskDue_Generate(int taskId)
        {
            try 
            {
                SqlParameter taskIdParam = new SqlParameter("@TaskID", taskId);
                var results = this.Database.ExecuteSqlCommand("portal.TaskDue_Generate @TaskID",
                    taskIdParam);
            }
            catch (Exception e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }
    }
}
