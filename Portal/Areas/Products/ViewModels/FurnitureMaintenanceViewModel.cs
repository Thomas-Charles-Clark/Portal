using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Products.ViewModels
{
    public class FurnitureMaintenanceViewModel : BaseViewModel
    {
        public int? PreselectedModelID { get; set; }

        public List<FurnitureSupplier> Suppliers { get; set; }

        public List<FurnitureComponent> Components { get; set; }

        public List<FurnitureMaterialGroup> MaterialGroups { get; set; }

        public List<FurnitureCushionFilling> CushionFillings { get; set; }

        public List<FurnitureCoverType> CoverTypes { get; set; }

        public List<FurnitureLegType> LegTypes { get; set; }

        public List<FurnitureLeg> Legs { get; set; }

        public FurnitureMaintenanceViewModel(
            int? preselectedModelId,
            List<FurnitureSupplier> suppliers,
            List<FurnitureComponent> components,
            List<FurnitureMaterialGroup> materialGroups,
            List<FurnitureCushionFilling> cushionFillings,
            List<FurnitureCoverType> coverTypes,
            List<FurnitureLegType> legTypes,
            List<FurnitureLeg> legs,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            PreselectedModelID = preselectedModelId;
            Suppliers = suppliers;
            Components = components;
            MaterialGroups = materialGroups;
            CushionFillings = cushionFillings;
            CoverTypes = coverTypes;
            LegTypes = legTypes;
            Legs = legs;
        }
    }
}