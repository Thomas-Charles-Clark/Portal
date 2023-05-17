using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Maintenance;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public FabricQualityAutocompleteReturn FabricQualityAutocomplete(PassAutocompleteTerm objTerm)
        {
            var result = new FabricQualityAutocompleteReturn();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@SearchTerm", objTerm.searchTerm)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Fabric_Quality_Autocomplete]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<FabricQualityAutocompleteResult>(reader).ToList();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }

        public QualityExistingTreatmentResult FetchExistingTreatments(PassQualityID objQualityId)
        {
            var result = new QualityExistingTreatmentResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@QualityID", objQualityId.QualityID)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Quality_ExistingTreatment_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.ExistingTreatments = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemTreatmentProvider>(reader).ToList();

                reader.NextResult();

                result.TestsPassed = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<QualityTestPassed>(reader).ToList();

                reader.NextResult();

                result.QualityCompositions = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<QualityComposition>(reader).ToList();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }

        public int SaveQualityTreatmentProviders(PassQualityTreatmentProviderSave objSave)
        {
            var result = -1;

            var qualityTreatmentProviderTable = new DataTable();

            qualityTreatmentProviderTable.Columns.Add("QualityID", typeof(short));
            qualityTreatmentProviderTable.Columns.Add("TreatmentID", typeof(byte));
            qualityTreatmentProviderTable.Columns.Add("TreatmentStatusID", typeof(byte));
            qualityTreatmentProviderTable.Columns.Add("Note", typeof(string));

            objSave.QualityTreatments.ForEach(c => 
            {
                qualityTreatmentProviderTable.Rows.Add(objSave.QualityID, c.TreatmentID, c.TreatmentStatusID, c.Note);    
            });

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@QualityID", objSave.QualityID),
                new SqlParameter("@QualityTreatments", qualityTreatmentProviderTable)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[portal].[QualityTreatmentTableType]"
                 }
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Quality_Treatment_Save]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                result = cmd.ExecuteNonQuery();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        } 
    }
}
