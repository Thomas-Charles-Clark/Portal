using OpenXmlPowerTools;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Xml.Linq;

namespace Downloads.Utilities
{
    public static class SpreadsheetHelper
    {
        public static void WriteSpreadsheet(bool displayClearance, string filePath, List<XElement> productResults)
        {
            // index into [i].ChildNodes get values to columns

            TextInfo ti = new System.Globalization.CultureInfo("en-GB", true).TextInfo;

            string[] productColumnHeadings = new[] {
                "Product Code",
                "Season",
                "Product Type",
                "Brand",
                "Collection",
                "Design",
                "Colourway",
                "Pattern",
                "Product Page ID",
                "Product Page Heading",
                "Product Page Subheading",
                "Product Page Description",
                "Related Product Page ID",
                "Product Name",
                "Status",
                "New",
                "Weight",
                "Width",
                "DimensionsMetric",
                "DimensionsImperial",
                "Colour",
                "Composition",
                "Attributes",
                "Vertical Pattern Repeat",
                "Horizontal Pattern Repeat",
                "Martindale",
                "GSM (Grams / Square Metre)",
                "GLM (Grams / Linear Metre)",
                "Care Instructions",
                "Roll Length",
                "Roll Width",
                "Paste the Wall",
                "Country of Origin",
                "Commodity Code",
                "Intrastat",
                "EAN Code",
                "RRP",
                "Default Product Image",
                "Reverse Product Image",
                "Styled Product Image",
                "Closeup Product Image",
                "Additional Image 1",
                "Additional Image 2",
                "Additional Image 3",
                "Additional Image 4",
                "Additional Image 5"
            };

            if (displayClearance)
            {
                productColumnHeadings = new[] {
                    "Product Code",
                    "Season",
                    "Product Type",
                    "Brand",
                    "Collection",
                    "Design",
                    "Colourway",
                    "Pattern",
                    "Product Page ID",
                    "Product Page Heading",
                    "Product Page Subheading",
                    "Product Page Description",
                    "Related Product Page ID",
                    "Product Name",
                    "Clearance Discount",
                    "Status",
                    "New",
                    "Weight",
                    "Width",
                    "DimensionsMetric",
                    "DimensionsImperial",
                    "Colour",
                    "Composition",
                    "Attributes",
                    "Vertical Pattern Repeat",
                    "Horizontal Pattern Repeat",
                    "Martindale",
                    "GSM (Grams / Square Metre)",
                    "GLM (Grams / Linear Metre)",
                    "Care Instructions",
                    "Roll Length",
                    "Roll Width",
                    "Paste the Wall",
                    "Country of Origin",
                    "Commodity Code",
                    "Intrastat",
                    "EAN Code",
                    "RRP",
                    "Default Product Image",
                    "Reverse Product Image",
                    "Styled Product Image",
                    "Closeup Product Image",
                    "Additional Image 1",
                    "Additional Image 2",
                    "Additional Image 3",
                    "Additional Image 4",
                    "Additional Image 5"
                };
            }

            var data = new[] {
                new {
                    SheetName = "Products",
                    ColumnHeadings = productColumnHeadings,
                    Data = productResults,
                    NumberColumns = productColumnHeadings.Length,
                    NumberRows = productResults.Count
                }
            };
            WorkbookDfn wb = new WorkbookDfn
            {
                Worksheets = data.Select(d => new WorksheetDfn
                {
                    Name = d.SheetName,
                    ColumnHeadings = Enumerable.Range(0, d.NumberColumns)
                    .Select(c => new CellDfn
                    {
                        Value = d.ColumnHeadings[c],
                        Bold = true
                    }),
                    Rows = Enumerable.Range(0, d.NumberRows)
                    .Select(r => new RowDfn()
                    {
                        Cells = Enumerable.Range(0, d.NumberColumns)
                        .Select(c =>
                        {
                            var text = "";

                            if (displayClearance == false)
                            {
                                switch (d.SheetName)
                                {
                                    case "Products":
                                        switch (c)
                                        {
                                            case 0:
                                                text = d.Data[r].Element("ProductCode").Value.ToString();
                                                break;

                                            case 1:
                                                text = d.Data[r].Element("Season").Value.ToString();
                                                break;

                                            case 2:
                                                text = d.Data[r].Element("ProductType").Value.ToString();
                                                break;

                                            case 3:
                                                text = d.Data[r].Element("Brand").Value.ToString();
                                                break;

                                            case 4:
                                                text = d.Data[r].Element("Collection").Value.ToString();
                                                break;

                                            case 5:
                                                text = d.Data[r].Element("Design").Value.ToString();
                                                break;

                                            case 6:
                                                text = d.Data[r].Element("Colourway").Value.ToString();
                                                break;

                                            case 7:
                                                text = d.Data[r].Element("Pattern").Value.ToString();
                                                break;

                                            case 8:
                                                text = d.Data[r].Element("ProductPageID").Value.ToString();
                                                break;

                                            case 9:
                                                text = d.Data[r].Element("ProductPageHeading").Value.ToString();
                                                break;

                                            case 10:
                                                text = d.Data[r].Element("ProductPageSubHeading").Value.ToString();
                                                break;

                                            case 11:
                                                text = d.Data[r].Element("ProductPageDescription").Value.ToString();
                                                break;

                                            case 12:
                                                text = d.Data[r].Element("RelatedProductPageID").Value.ToString();
                                                break;

                                            case 13:
                                                text = d.Data[r].Element("ProductName").Value.ToString();
                                                break;

                                            case 14:
                                                text = d.Data[r].Element("Status").Value.ToString();
                                                break;

                                            case 15:
                                                text = d.Data[r].Element("New").Value.ToString();
                                                break;

                                            case 16:
                                                text = d.Data[r].Element("Weight").Value.ToString();
                                                break;

                                            case 17:
                                                text = d.Data[r].Element("Width").Value.ToString();
                                                break;

                                            case 18:
                                                text = d.Data[r].Element("DimensionsMetric").Value.ToString();
                                                break;

                                            case 19:
                                                text = d.Data[r].Element("DimensionsImperial").Value.ToString();
                                                break;

                                            case 20:
                                                text = d.Data[r].Element("Colour").Value.ToString();
                                                break;

                                            case 21:
                                                text = d.Data[r].Element("Composition").Value.ToString();
                                                break;

                                            case 22:
                                                text = d.Data[r].Element("Attributes").Value.ToString();
                                                break;

                                            case 23:
                                                text = d.Data[r].Element("VerticalPatternRepeat").Value.ToString();
                                                break;

                                            case 24:
                                                text = d.Data[r].Element("HorizontalPatternRepeat").Value.ToString();
                                                break;

                                            case 25:
                                                text = d.Data[r].Element("Martindale").Value.ToString();
                                                break;

                                            case 26:
                                                text = d.Data[r].Element("GSM").Value?.ToString();
                                                break;

                                            case 27:
                                                text = d.Data[r].Element("GLM").Value?.ToString();
                                                break;

                                            case 28:
                                                text = d.Data[r].Element("CareInstructions").Value.ToString();
                                                break;

                                            case 29:
                                                text = d.Data[r].Element("RollLength").Value.ToString();
                                                break;

                                            case 30:
                                                text = d.Data[r].Element("RollWidth").Value.ToString();
                                                break;

                                            case 31:
                                                text = d.Data[r].Element("PasteTheWall").Value.ToString();
                                                break;

                                            case 32:
                                                text = d.Data[r].Element("CountryOfOrigin").Value.ToString();
                                                break;

                                            case 33:
                                                text = d.Data[r].Element("CommodityCode").Value.ToString();
                                                break;

                                            case 34:
                                                text = d.Data[r].Element("Intrastat").Value.ToString();
                                                break;

                                            case 35:
                                                text = d.Data[r].Element("EAN").Value.ToString();
                                                break;

                                            case 36:
                                                text = d.Data[r].Element("RRP").Value.ToString();
                                                break;

                                            case 37:
                                                text = d.Data[r].Element("DefaultProductImage").Value.ToString();
                                                break;

                                            case 38:
                                                text = d.Data[r].Element("ReverseProductImage").Value.ToString();
                                                break;

                                            case 39:
                                                text = d.Data[r].Element("StyledProductImage").Value.ToString();
                                                break;

                                            case 40:
                                                text = d.Data[r].Element("CloseUpProductImage").Value.ToString();
                                                break;

                                            case 41:
                                                text = d.Data[r].Element("AdditionalImage1").Value.ToString();
                                                break;

                                            case 42:
                                                text = d.Data[r].Element("AdditionalImage2").Value.ToString();
                                                break;

                                            case 43:
                                                text = d.Data[r].Element("AdditionalImage3").Value.ToString();
                                                break;

                                            case 44:
                                                text = d.Data[r].Element("AdditionalImage4").Value.ToString();
                                                break;

                                            case 45:
                                                text = d.Data[r].Element("AdditionalImage5").Value.ToString();
                                                break;

                                            default: break;
                                        }
                                        break;

                                    default: break;
                                }
                            }
                            else
                            {
                                switch (d.SheetName)
                                {
                                    case "Products":
                                        switch (c)
                                        {
                                            case 0:
                                                text = d.Data[r].Element("ProductCode").Value.ToString();
                                                break;

                                            case 1:
                                                text = d.Data[r].Element("Season").Value.ToString();
                                                break;

                                            case 2:
                                                text = d.Data[r].Element("ProductType").Value.ToString();
                                                break;

                                            case 3:
                                                text = d.Data[r].Element("Brand").Value.ToString();
                                                break;

                                            case 4:
                                                text = d.Data[r].Element("Collection").Value.ToString();
                                                break;

                                            case 5:
                                                text = d.Data[r].Element("Design").Value.ToString();
                                                break;

                                            case 6:
                                                text = d.Data[r].Element("Colourway").Value.ToString();
                                                break;

                                            case 7:
                                                text = d.Data[r].Element("Pattern").Value.ToString();
                                                break;

                                            case 8:
                                                text = d.Data[r].Element("ProductPageID").Value.ToString();
                                                break;

                                            case 9:
                                                text = d.Data[r].Element("ProductPageHeading").Value.ToString();
                                                break;

                                            case 10:
                                                text = d.Data[r].Element("ProductPageSubHeading").Value.ToString();
                                                break;

                                            case 11:
                                                text = d.Data[r].Element("ProductPageDescription").Value.ToString();
                                                break;

                                            case 12:
                                                text = d.Data[r].Element("RelatedProductPageID").Value.ToString();
                                                break;

                                            case 13:
                                                text = d.Data[r].Element("ProductName").Value.ToString();
                                                break;

                                            case 14:
                                                text = d.Data[r].Element("ClearanceDisplay")?.Value.ToString();
                                                break;

                                            case 15:
                                                text = d.Data[r].Element("Status").Value.ToString();
                                                break;

                                            case 16:
                                                text = d.Data[r].Element("New").Value.ToString();
                                                break;

                                            case 17:
                                                text = d.Data[r].Element("Weight").Value.ToString();
                                                break;

                                            case 18:
                                                text = d.Data[r].Element("Width").Value.ToString();
                                                break;

                                            case 19:
                                                text = d.Data[r].Element("DimensionsMetric").Value.ToString();
                                                break;

                                            case 20:
                                                text = d.Data[r].Element("DimensionsImperial").Value.ToString();
                                                break;

                                            case 21:
                                                text = d.Data[r].Element("Colour").Value.ToString();
                                                break;

                                            case 22:
                                                text = d.Data[r].Element("Composition").Value.ToString();
                                                break;

                                            case 23:
                                                text = d.Data[r].Element("Attributes").Value.ToString();
                                                break;

                                            case 24:
                                                text = d.Data[r].Element("VerticalPatternRepeat").Value.ToString();
                                                break;

                                            case 25:
                                                text = d.Data[r].Element("HorizontalPatternRepeat").Value.ToString();
                                                break;

                                            case 26:
                                                text = d.Data[r].Element("Martindale").Value.ToString();
                                                break;

                                            case 27:
                                                text = d.Data[r].Element("GSM").Value?.ToString();
                                                break;

                                            case 28:
                                                text = d.Data[r].Element("GLM").Value?.ToString();
                                                break;

                                            case 29:
                                                text = d.Data[r].Element("CareInstructions").Value.ToString();
                                                break;

                                            case 30:
                                                text = d.Data[r].Element("RollLength").Value.ToString();
                                                break;

                                            case 31:
                                                text = d.Data[r].Element("RollWidth").Value.ToString();
                                                break;

                                            case 32:
                                                text = d.Data[r].Element("PasteTheWall").Value.ToString();
                                                break;

                                            case 33:
                                                text = d.Data[r].Element("CountryOfOrigin").Value.ToString();
                                                break;

                                            case 34:
                                                text = d.Data[r].Element("CommodityCode").Value.ToString();
                                                break;

                                            case 35:
                                                text = d.Data[r].Element("Intrastat").Value.ToString();
                                                break;

                                            case 36:
                                                text = d.Data[r].Element("EAN").Value.ToString();
                                                break;

                                            case 37:
                                                text = d.Data[r].Element("RRP").Value.ToString();
                                                break;

                                            case 38:
                                                text = d.Data[r].Element("DefaultProductImage").Value.ToString();
                                                break;

                                            case 39:
                                                text = d.Data[r].Element("ReverseProductImage").Value.ToString();
                                                break;

                                            case 40:
                                                text = d.Data[r].Element("StyledProductImage").Value.ToString();
                                                break;

                                            case 41:
                                                text = d.Data[r].Element("CloseUpProductImage").Value.ToString();
                                                break;

                                            case 42:
                                                text = d.Data[r].Element("AdditionalImage1").Value.ToString();
                                                break;

                                            case 43:
                                                text = d.Data[r].Element("AdditionalImage2").Value.ToString();
                                                break;

                                            case 44:
                                                text = d.Data[r].Element("AdditionalImage3").Value.ToString();
                                                break;

                                            case 45:
                                                text = d.Data[r].Element("AdditionalImage4").Value.ToString();
                                                break;

                                            case 46:
                                                text = d.Data[r].Element("AdditionalImage5").Value.ToString();
                                                break;

                                            default: break;
                                        }
                                        break;

                                    default: break;
                                }
                            }

                            return new CellDfn
                            {
                                Value = text,
                                CellDataType = CellDataType.String
                            };
                        })
                    })
                })
            };

            SpreadsheetWriter.Write(filePath, wb);
        }

        public static void WriteEarlyAccessSpreadsheet(bool displayClearance, string filePath, List<XElement> productResults)
        {
            // index into [i].ChildNodes get values to columns

            TextInfo ti = new System.Globalization.CultureInfo("en-GB", true).TextInfo;

            string[] productColumnHeadings = new[] {
                "Product Code",
                "Season",
                "Product Type",
                "Brand",
                "Collection",
                "Design",
                "Colourway",
                "Product Name",
                "Status",
                "New",
                "Weight",
                "Width",
                "DimensionsMetric",
                "DimensionsImperial",
                "Colour",
                "Composition",
                "Vertical Pattern Repeat",
                "Horizontal Pattern Repeat",
                "Martindale",
                "Care Instructions",
                "Roll Length",
                "Roll Width",
                "Paste the Wall",
                "Country of Origin",
                "Commodity Code",
                "Intrastat",
                "EAN Code",
                "Default Product Image",
                "Reverse Product Image",
                "Styled Product Image",
                "Closeup Product Image",
                "Release Date"
            };

            if (displayClearance)
            {
                productColumnHeadings = new[] {
                    "Product Code",
                    "Season",
                    "Product Type",
                    "Brand",
                    "Collection",
                    "Design",
                    "Colourway",
                    "Product Name",
                    "Clearance Discount",
                    "Status",
                    "New",
                    "Weight",
                    "Width",
                    "DimensionsMetric",
                    "DimensionsImperial",
                    "Colour",
                    "Composition",
                    "Vertical Pattern Repeat",
                    "Horizontal Pattern Repeat",
                    "Martindale",
                    "Care Instructions",
                    "Roll Length",
                    "Roll Width",
                    "Paste the Wall",
                    "Country of Origin",
                    "Commodity Code",
                    "Intrastat",
                    "EAN Code",
                    "Default Product Image",
                    "Reverse Product Image",
                    "Styled Product Image",
                    "Closeup Product Image",
                    "Release Date"
                };
            }

            var data = new[] {
                new {
                    SheetName = "Products",
                    ColumnHeadings = productColumnHeadings,
                    Data = productResults,
                    NumberColumns = productColumnHeadings.Length,
                    NumberRows = productResults.Count
                }
            };

            WorkbookDfn wb = new WorkbookDfn
            {
                Worksheets = data.Select(d => new WorksheetDfn
                {
                    Name = d.SheetName,
                    ColumnHeadings = Enumerable.Range(0, d.NumberColumns)
                    .Select(c => new CellDfn
                    {
                        Value = d.ColumnHeadings[c],
                        Bold = true
                    }),
                    Rows = Enumerable.Range(0, d.NumberRows)
                    .Select(r => new RowDfn()
                    {
                        Cells = Enumerable.Range(0, d.NumberColumns)
                        .Select(c =>
                        {
                            var text = "";

                            if (displayClearance == false)
                            {
                                switch (d.SheetName)
                                {
                                    case "Products":
                                        switch (c)
                                        {
                                            case 0:
                                                text = d.Data[r].Element("ProductCode").Value.ToString();
                                                break;

                                            case 1:
                                                text = d.Data[r].Element("Season").Value.ToString();
                                                break;

                                            case 2:
                                                text = d.Data[r].Element("ProductType").Value.ToString();
                                                break;

                                            case 3:
                                                text = d.Data[r].Element("Brand").Value.ToString();
                                                break;

                                            case 4:
                                                text = d.Data[r].Element("Collection").Value.ToString();
                                                break;

                                            case 5:
                                                text = d.Data[r].Element("Design").Value.ToString();
                                                break;

                                            case 6:
                                                text = d.Data[r].Element("Colourway").Value.ToString();
                                                break;

                                            case 7:
                                                text = d.Data[r].Element("ProductName").Value.ToString();
                                                break;

                                            case 8:
                                                text = d.Data[r].Element("Status").Value.ToString();
                                                break;

                                            case 9:
                                                text = d.Data[r].Element("New").Value.ToString();
                                                break;

                                            case 10:
                                                text = d.Data[r].Element("Weight").Value.ToString();
                                                break;

                                            case 11:
                                                text = d.Data[r].Element("Width").Value.ToString();
                                                break;

                                            case 12:
                                                text = d.Data[r].Element("DimensionsMetric").Value.ToString();
                                                break;

                                            case 13:
                                                text = d.Data[r].Element("DimensionsImperial").Value.ToString();
                                                break;

                                            case 14:
                                                text = d.Data[r].Element("Colour").Value.ToString();
                                                break;

                                            case 15:
                                                text = d.Data[r].Element("Composition").Value.ToString();
                                                break;

                                            case 16:
                                                text = d.Data[r].Element("VerticalPatternRepeat").Value.ToString();
                                                break;

                                            case 17:
                                                text = d.Data[r].Element("HorizontalPatternRepeat").Value.ToString();
                                                break;

                                            case 18:
                                                text = d.Data[r].Element("Martindale").Value.ToString();
                                                break;

                                            case 19:
                                                text = d.Data[r].Element("CareInstructions").Value.ToString();
                                                break;

                                            case 20:
                                                text = d.Data[r].Element("RollLength").Value.ToString();
                                                break;

                                            case 21:
                                                text = d.Data[r].Element("RollWidth").Value.ToString();
                                                break;

                                            case 22:
                                                text = d.Data[r].Element("PasteTheWall").Value.ToString();
                                                break;

                                            case 23:
                                                text = d.Data[r].Element("CountryOfOrigin").Value.ToString();
                                                break;

                                            case 24:
                                                text = d.Data[r].Element("CommodityCode").Value.ToString();
                                                break;

                                            case 25:
                                                text = d.Data[r].Element("Intrastat").Value.ToString();
                                                break;

                                            case 26:
                                                text = d.Data[r].Element("EAN").Value.ToString();
                                                break;

                                            case 27:
                                                text = d.Data[r].Element("DefaultProductImage").Value.ToString();
                                                break;

                                            case 28:
                                                text = d.Data[r].Element("ReverseProductImage").Value.ToString();
                                                break;

                                            case 29:
                                                text = d.Data[r].Element("StyledProductImage").Value.ToString();
                                                break;

                                            case 30:
                                                text = d.Data[r].Element("CloseUpProductImage").Value.ToString();
                                                break;

                                            case 31:
                                                text = d.Data[r].Element("ReleaseDate").Value.ToString();
                                                break;

                                            default: break;
                                        }
                                        break;

                                    default: break;
                                }
                            }
                            else
                            {
                                switch (d.SheetName)
                                {
                                    case "Products":
                                        switch (c)
                                        {
                                            case 0:
                                                text = d.Data[r].Element("ProductCode").Value.ToString();
                                                break;

                                            case 1:
                                                text = d.Data[r].Element("Season").Value.ToString();
                                                break;

                                            case 2:
                                                text = d.Data[r].Element("ProductType").Value.ToString();
                                                break;

                                            case 3:
                                                text = d.Data[r].Element("Brand").Value.ToString();
                                                break;

                                            case 4:
                                                text = d.Data[r].Element("Collection").Value.ToString();
                                                break;

                                            case 5:
                                                text = d.Data[r].Element("Design").Value.ToString();
                                                break;

                                            case 6:
                                                text = d.Data[r].Element("Colourway").Value.ToString();
                                                break;

                                            case 7:
                                                text = d.Data[r].Element("ProductName").Value.ToString();
                                                break;

                                            case 8:
                                                text = d.Data[r].Element("ClearanceDisplay")?.Value.ToString();
                                                break;

                                            case 9:
                                                text = d.Data[r].Element("Status").Value.ToString();
                                                break;

                                            case 10:
                                                text = d.Data[r].Element("New").Value.ToString();
                                                break;

                                            case 11:
                                                text = d.Data[r].Element("Weight").Value.ToString();
                                                break;

                                            case 12:
                                                text = d.Data[r].Element("Width").Value.ToString();
                                                break;

                                            case 13:
                                                text = d.Data[r].Element("DimensionsMetric").Value.ToString();
                                                break;

                                            case 14:
                                                text = d.Data[r].Element("DimensionsImperial").Value.ToString();
                                                break;

                                            case 15:
                                                text = d.Data[r].Element("Colour").Value.ToString();
                                                break;

                                            case 16:
                                                text = d.Data[r].Element("Composition").Value.ToString();
                                                break;

                                            case 17:
                                                text = d.Data[r].Element("VerticalPatternRepeat").Value.ToString();
                                                break;

                                            case 18:
                                                text = d.Data[r].Element("HorizontalPatternRepeat").Value.ToString();
                                                break;

                                            case 19:
                                                text = d.Data[r].Element("Martindale").Value.ToString();
                                                break;

                                            case 20:
                                                text = d.Data[r].Element("CareInstructions").Value.ToString();
                                                break;

                                            case 21:
                                                text = d.Data[r].Element("RollLength").Value.ToString();
                                                break;

                                            case 22:
                                                text = d.Data[r].Element("RollWidth").Value.ToString();
                                                break;

                                            case 23:
                                                text = d.Data[r].Element("PasteTheWall").Value.ToString();
                                                break;

                                            case 24:
                                                text = d.Data[r].Element("CountryOfOrigin").Value.ToString();
                                                break;

                                            case 25:
                                                text = d.Data[r].Element("CommodityCode").Value.ToString();
                                                break;

                                            case 26:
                                                text = d.Data[r].Element("Intrastat").Value.ToString();
                                                break;

                                            case 27:
                                                text = d.Data[r].Element("EAN").Value.ToString();
                                                break;

                                            case 28:
                                                text = d.Data[r].Element("DefaultProductImage").Value.ToString();
                                                break;

                                            case 29:
                                                text = d.Data[r].Element("ReverseProductImage").Value.ToString();
                                                break;

                                            case 30:
                                                text = d.Data[r].Element("StyledProductImage").Value.ToString();
                                                break;

                                            case 31:
                                                text = d.Data[r].Element("CloseUpProductImage").Value.ToString();
                                                break;

                                            case 32:
                                                text = d.Data[r].Element("ReleaseDate").Value.ToString();
                                                break;

                                            default: break;
                                        }
                                        break;

                                    default: break;
                                }
                            }

                            return new CellDfn
                            {
                                Value = text,
                                CellDataType = CellDataType.String
                            };
                        })
                    })
                })
            };

            SpreadsheetWriter.Write(filePath, wb);
        }
    }
}