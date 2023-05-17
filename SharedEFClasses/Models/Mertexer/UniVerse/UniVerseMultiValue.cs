using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    internal class UniVerseMultiValueAttribute : Attribute
    {
        public UniVerseMultiValueAttribute()
        {

        }
    }
}
