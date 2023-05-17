using FileWriter;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Utilities.BouncyCastle;
using SharedEFClasses.Utilities.NewtonsoftExtensions;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation.Language;
using System.Threading.Tasks;
using System.Web;

namespace Portal.Areas.Products.ViewModels
{
    public class PaintMixingViewModel : BaseViewModel
    {
        public short MixingLocationID { get; set; }

        public MixingLocation MixingLocation { get; set; }

        private PaintMixingViewModel(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading) : base(properties, applicationHeading, applicationSubHeading)
        {

        }

        public static PaintMixingViewModel Create(
            short mixingLocationId,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new PaintMixingViewModel(properties, applicationHeading, applicationSubHeading);

            result.Initialise(mixingLocationId);

            return result;
        }

        protected void Initialise(short mixingLocationId)
        {
            var db = new SharedEFClasses.Models.PortalDbContext();

            MixingLocationID = mixingLocationId;

            MixingLocation = db.MixingLocations.SingleOrDefault(ml => ml.MixingLocationID == MixingLocationID);
        }
    }
}