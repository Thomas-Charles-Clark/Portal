using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [UniVerseFileName("OESESSION")]
    public class RetailTillSession : UniVerseSerializationBase<string>
    {
        public RetailTillSession(string key) : base(key)
        {

        }

        public RetailTillSession() : base()
        {
            Initialise();
        }

        public override void Initialise()
        {
            typeof(RetailTillSession).GetProperties().ToList().ForEach(p => Framework.InitialiseUniProperty(this, p));
        }

        [UniVerseIndex(1)]
        [UniVerseFieldName("OPEN.FLAG")]
        public bool Open { get; set; }

        /// <summary>
        /// Description
        /// </summary>
        [UniVerseIndex(10)]
        [UniVerseFieldName("OPENED.BY")]
        public string OpenedBy { get; set; }

        public DateTime? OpenedDT { get; set; }

        [UniVerseIndex(11)]
        [UniVerseFieldName("SS.OPENED.ON.INT")]
        public string OpenedOn
        {
            get
            {
                if (OpenedDT.HasValue)
                {
                    return Framework.UniVerseDateString(OpenedDT.Value);
                }
                else
                {
                    return null;
                }
            }
            set
            {
                if (!String.IsNullOrEmpty(value))
                {
                    if (Int32.TryParse(value, out int valInt))
                    {
                        OpenedDT = Framework.DateTimeFromUniVerseOffset(valInt);
                    }
                    else
                    {
                        OpenedDT = null;
                    }
                }
            }
        }

        public TimeSpan OpenedTime { get; set; }

        [UniVerseIndex(12)]
        [UniVerseFieldName("OPENED.AT")]
        public string OpenedAt
        {
            get
            {
                return $"{OpenedTime}";
            }
            set
            {
                OpenedTime = TimeSpan.FromSeconds(Convert.ToDouble(value));

                OpenedDT += OpenedTime;
            }
        }

        [UniVerseIndex(24)]
        [UniVerseFieldName("TILLNO")]
        public string TillNumber { get; set; }

        public string Label
        {
            get
            {
                return $"Session {Key} Opened: {OpenedDT?.ToString("dd/MM/yyyy HH:mm")} by: {OpenedBy}";
            }
        }
    }
}
