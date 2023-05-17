using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    internal class UniVerseFieldNameAttribute : Attribute
    {
        protected string name;

        public UniVerseFieldNameAttribute(string n)
        {
            name = n;
        }

        public string Name
        {
            get
            {
                return name;
            }
        }
    }
}
