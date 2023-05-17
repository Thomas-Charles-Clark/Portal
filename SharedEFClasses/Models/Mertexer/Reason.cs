using Newtonsoft.Json;
using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [UniVerseFileName("STREASON")]
    public class Reason : UniVerseSerializationBase<string>
    {
        [JsonConstructor]
        public Reason(string key) : base(key)
        {
            Initialise();
        }

        public Reason() : base()
        {
            Initialise();
        }

        public override void Initialise()
        {
            typeof(Reason).GetProperties().ToList().ForEach(p => Framework.InitialiseUniProperty(this, p));
        }


        /// <summary>
        /// Name
        /// </summary>
        [UniVerseIndex(1)]
        [UniVerseFieldName("DESCRIPTION")]
        public string Name { get; set; }
    }
}
