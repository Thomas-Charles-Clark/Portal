using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses
{
    public class BaseViewModel
    {
        public string ApplicationHeading { get; set; }
        public string ApplicationSubHeading { get; set; }
        public RoleProperties Properties { get; set; }

        public BaseViewModel(RoleProperties properties)
        {
            this.Properties = properties;
            this.ApplicationHeading = null;
            this.ApplicationSubHeading = null;
        }

        public BaseViewModel(RoleProperties properties,
                                string applicationHeading,
                                string applicationSubHeading)
        {
            this.Properties = properties;
            this.ApplicationHeading = applicationHeading;
            this.ApplicationSubHeading = applicationSubHeading;
        }
    }
}
