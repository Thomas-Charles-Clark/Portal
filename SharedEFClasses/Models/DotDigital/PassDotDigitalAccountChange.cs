using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.DotDigital
{
    public class PassDotDigitalAccountChange
    {
        public int MemberID { get; set; }

        public byte? SourceAccountID { get; set; }

        public byte DestinationAccountID { get; set; }

        public byte DestinationAccountTypeID { get; set; }

        public short DestinationCountryID { get; set; }

        public string Email { get; set; }
    }
}