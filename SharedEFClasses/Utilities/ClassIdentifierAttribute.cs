using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Utilities
{
    public class ClassIdentifierAttribute : Attribute
    {
        public string Identifier { get; set; }

        public ClassIdentifierAttribute(string identifier)
        {
            Identifier = identifier;
        }
    }
}
