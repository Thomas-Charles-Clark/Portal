using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [UniVerseFileName("OETILLNO")]
    public class RetailTill : UniVerseSerializationBase<string>
    {
        public RetailTill(string key) : base(key)
        {

        }

        public RetailTill() : base()
        {
            Initialise();
        }

        public override void Initialise()
        {
            typeof(RetailTill).GetProperties().ToList().ForEach(p => Framework.InitialiseUniProperty(this, p));
        }

        /// <summary>
        /// Description
        /// </summary>
        [UniVerseIndex(1)]
        [UniVerseFieldName("DESCRIPTION")]
        public string Description { get; set; }
    }
}
