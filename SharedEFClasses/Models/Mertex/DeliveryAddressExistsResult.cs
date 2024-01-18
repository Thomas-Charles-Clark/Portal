using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertex
{
    public class DeliveryAddressExistsResult
    {
        public string DeliveryReference { get; set; }
        public bool IsDefault { get; set; }
    }
}
