using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    internal class UniVerseIndexAttribute : Attribute
    {
        protected int fieldIndex;
        protected int? valueIndex;
        protected int? subValueIndex;

        public UniVerseIndexAttribute(
            int fieldIndex,
            int valueIndex = 0,
            int subValueIndex = 0)
        {
            this.fieldIndex = fieldIndex;
            this.valueIndex = valueIndex;
            this.subValueIndex = subValueIndex;
        }

        public int FieldIndex
        {
            get
            {
                return fieldIndex;
            }
        }

        public int ValueIndex
        {
            get
            {
                return fieldIndex;
            }
        }

        public int SubValueIndex
        {
            get
            {
                return fieldIndex;
            }
        }
    }
}
