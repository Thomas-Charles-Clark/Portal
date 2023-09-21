using DocumentFormat.OpenXml.CustomXmlSchemaReferences;

using Kendo.Mvc.UI;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Stock.Models
{
    public class SalesHistoryDataSourceResult : DataSourceResult
    {
        public object Schema { get; set; }
        public object Columns { get; set; }

        public SalesHistoryDataSourceResult(DataSourceResult dsr, object schema, object columns) 
        {
            this.Errors = dsr.Errors;
            this.Data = dsr.Data;
            this.AggregateResults = dsr.AggregateResults;
            this.Total = dsr.Total;

            this.Schema = schema;
            this.Columns = columns;
        }
    }
}