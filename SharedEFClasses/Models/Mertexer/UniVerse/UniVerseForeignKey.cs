using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{

    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    internal class UniVerseForeignKeyAttribute : Attribute
    {
        protected string propertyName;
        protected string propertyType;

        public UniVerseForeignKeyAttribute(string propertyName, string propertyTypeFullyQualifiedAssemblyName)
        {
            this.propertyName = propertyName;
            propertyType = propertyTypeFullyQualifiedAssemblyName;
        }

        public string PropertyName
        {
            get
            {
                return propertyName;
            }
        }

        public string PropertyType
        {
            get
            {
                return propertyType;
            }
        }
    }
}
