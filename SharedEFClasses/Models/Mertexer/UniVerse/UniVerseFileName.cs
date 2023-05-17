using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    internal class UniVerseFileNameAttribute : Attribute
    {
        protected string fileName;

        public UniVerseFileNameAttribute(string n)
        {
            fileName = n;
        }

        public string FileName
        {
            get
            {
                return fileName;
            }
        }
    }
}
