using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Maintenance
{
    public class FabricQualityAutocompleteReturn
    {
        public List<FabricQualityAutocompleteResult> Results { get; set; }
    }

    public class FabricQualityAutocompleteResult
    {
        public short QualityID { get; set; }
        public string Code { get; set; }
        public double? Width { get; set; }
        public double? Weight { get; set; }
        public double? HorizontalPatternRepeat { get; set; }
        public double? VerticalPatternRepeat { get; set; }
        public int? Martindale { get; set; }
        public string Composition { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? SortOrder { get; set; }
    }

    public class PassQualityID
    {
        public short QualityID { get; set; }
    }

    public class QualityExistingTreatmentResult
    {
        public List<BasketItemTreatmentProvider> ExistingTreatments { get; set; }
        public List<QualityTestPassed> TestsPassed { get; set; }
        public List<QualityComposition> QualityCompositions { get; set; }
    }

    public class QualityTreatmentProvider 
    {
        public byte TreatmentProviderID { get; set; }
        public byte TreatmentID { get; set; }
        public byte Preference { get; set; }
        public string TreatmentProviderName { get; set; }
        public decimal MinimumQuantity { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
    }

    public class QualityExistingTreatment
    {
        public byte TreatmentID { get; set; }
        public byte TreatmentStatusID { get; set; }
        public string TreatmentStatus { get; set; }
        public string TreatmentStatusAltName { get; set; }
        public string Note { get; set; }

        public List<QualityTreatmentProvider> TreatmentProviders { get; set; }

        public QualityExistingTreatment ()
        {
            TreatmentProviders = new List<QualityTreatmentProvider>();
        }
    }

    public class QualityTestPassed
    {
        public short TestID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class QualityComposition
    {
        public string CompositionCode { get; set; }
        public string CompositionName { get; set; }
        public string FlamcodeCode { get; set; }
        public string FlamcodeName { get; set; }
    }

    public class PassQualityTreatmentProviderSave
    {
        public short QualityID { get; set; }
        public List<PassQualityTreatmentProvider> QualityTreatments { get; set; }
    }

    public class PassQualityTreatmentProvider
    {
        public short QualityID { get; set; }
        public byte TreatmentID { get; set; }
        public byte TreatmentStatusID { get; set; }
        public string Note { get; set; }
    }

    public class PassTreatmentAutocomplete : PassGenericAutocomplete
    {
        public byte? TreatmentID { get; set; }
    }

    public class PassTreatmentTypeSort
    {
        public List<PassTreatmentSort> TreatmentSortOrders { get; set; }
    }

    public class PassTreatmentSort
    {
        public byte TreatmentID { get; set; }
        public byte SortOrder { get; set; }
    }

    public class PassTreatmentID
    {
        public byte TreatmentID { get; set; }
    }

    public class PassTreatmentSave
    {
        public byte? TreatmentID { get; set; }
        public string Name { get; set; }
        public short? CountryID { get; set; }
        public byte SortOrder { get; set; }
        public byte TreatmentTypeID { get; set; }
        public byte ProductFilterGroupID { get; set; }
        public byte TreatmentProviderID { get; set; }
        public int ProductID { get; set; }
        public string Description { get; set; }
        public List<short> CountryIDs { get; set; }
    }
}