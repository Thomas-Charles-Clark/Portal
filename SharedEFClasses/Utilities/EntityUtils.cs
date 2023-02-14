using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/// <summary>
/// With thanks:
/// https://stackoverflow.com/questions/41744949/map-generic-child-to-generic-parent-from-stored-procedure-results
/// </summary>

namespace SharedEFClasses.Utilities
{
    public static class EntityUtils
    {
        public static string GetEntitySetName<T>(this IObjectContextAdapter dbContext) where T : class
        {
            return dbContext.ObjectContext.CreateObjectSet<T>().EntitySet.Name;
        }

        public static ObjectResult<T> ReadSingleResult<T>(this IObjectContextAdapter dbContext, DbDataReader dbReader)
            where T : class
        {
            return dbContext.ObjectContext.Translate<T>(dbReader, dbContext.GetEntitySetName<T>(), MergeOption.AppendOnly);
        }

        public static void Load<T>(this ObjectResult<T> source) where T : class
        {
            // Consume the enumerable by iterating it
            using (var en = source.GetEnumerator())
                while (en.MoveNext()) { }
        }
    }

    public class StoredProcedureResult<T> : IEnumerable<T> where T : class
    {
        private readonly DbContext context;
        private readonly DbDataReader reader;
        private readonly IEnumerable<T> results;

        public StoredProcedureResult(DbContext context, DbDataReader reader)
        {
            this.context = context;
            this.reader = reader;
            this.results = this.context.ReadSingleResult<T>(this.reader).ToList();
        }

        public StoredProcedureResult<T> Include<TChild>() where TChild : class
        {
            if (this.reader.NextResult())
                this.context.ReadSingleResult<TChild>(this.reader).Load();
            return this;
        }

        public IEnumerator<T> GetEnumerator()
        {
            return this.results.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class StoredProcedureTranslator<TDbContext> : IDisposable where TDbContext : DbContext, new()
    {
        private DbCommand command;

        public StoredProcedureTranslator(TDbContext context)
        {
            if (context == null)
            {
                this.Context = new TDbContext();
            }
            else
            {
                this.Context = context;
            }
        }

        public DbContext Context { get; set; }

        public DbDataReader Reader { get; set; }

        public StoredProcedureResult<T> Translate<T>(string procedureName, SqlParameter[] parameters) where T : class
        {
            this.command = this.Context.Database.Connection.CreateCommand();
            this.command.CommandText = procedureName;
            if (parameters != null)
                this.command.Parameters.AddRange(parameters);
            this.command.CommandType = CommandType.StoredProcedure;
            this.Context.Database.Connection.Open();    
            this.Reader = this.command.ExecuteReader();    
            return new StoredProcedureResult<T>(this.Context, this.Reader);
        }

        public void Dispose()
        {
            this.Context.Dispose();
        }
    }
}
