using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Utilities
{
    // ta: https://stackoverflow.com/questions/56933494/how-to-sort-properties-alphabetically-when-serializing-json-using-netwonsoft-lib#answer-56933615
    public class OrderedContractResolver : Newtonsoft.Json.Serialization.DefaultContractResolver
    {
        protected override System.Collections.Generic.IList<Newtonsoft.Json.Serialization.JsonProperty> CreateProperties(System.Type type, Newtonsoft.Json.MemberSerialization memberSerialization)
        {
            var @base = base.CreateProperties(type, memberSerialization);
            var ordered = @base
                .OrderBy(p => p.Order ?? int.MaxValue)
                .ThenBy(p => p.PropertyName)
                .ToList();
            return ordered;
        }
    }
}
