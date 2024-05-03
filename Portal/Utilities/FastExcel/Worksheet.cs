using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.IO;
using System.Xml.Linq;
using System.Collections;
using System.Data;
using System.Dynamic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace FastExcel
{
    /// <summary>
    /// Excel Worksheet
    /// </summary>
    public class Worksheet
    {
        /// <summary>
        /// Collection of rows in this worksheet
        /// </summary>
        public IEnumerable<Row> Rows { get; set; }

        /// <summary>
        /// Heading Names
        /// </summary>
        public IEnumerable<string> Headings { get; set; }

        /// <summary>
        /// Index of this worksheet (Starts at 1)
        /// </summary>
        public int Index { get; internal set; }

        /// <summary>
        /// Name of this worksheet
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Is there any existing heading rows
        /// </summary>
        public int ExistingHeadingRows { get; set; }
        private int? InsertAfterIndex { get; set; }

        /// <summary>
        /// Template
        /// </summary>
        public bool Template { get; set; }

        internal string Headers { get; set; }
        internal string Footers { get; set; }


        internal byte? HeadingStyleID { get; set; }
        internal byte? StandardStyleID { get; set; }
        internal byte? IndentedHeadingStyleID { get; set; }
        internal byte? IndentedStyleID { get; set; }
        internal bool UppercaseHeadings { get; set; }
        internal bool AutoWidthColumns { get; set; }

        public List<Column> Columns { get; set; }

        /// <summary>
        /// Fast Excel
        /// </summary>
        public FastExcel FastExcel { get; private set; }

        internal string FileName
        {
            get
            {
                return GetFileName(Index);
            }
        }

        /// <summary>
        /// Get the internal file name of this worksheet
        /// </summary>
        internal static string GetFileName(int index)
        {
            return string.Format("xl/worksheets/sheet{0}.xml", index);
        }

        private const string DEFAULT_HEADERS = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?><worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\"><sheetData>";
        private const string DEFAULT_FOOTERS = "</sheetData></worksheet>";

        /// <summary>
        /// Constructor
        /// </summary>
        public Worksheet()
        {
            Columns = new List<Column>();
        }

        /// <summary>
        /// Constructor
        /// </summary>
        public Worksheet(FastExcel fastExcel)
        {
            FastExcel = fastExcel;
        }

        /// <summary>
        /// Populate rows
        /// </summary>
        public void PopulateRows<T>(
            IEnumerable<T> rows,
            bool uppercaseHeadings = false,
            bool autoWidthColumns = false,
            byte? headingStyleId = null,
            byte? standardStyleId = null,
            byte? indentedHeadingStyleId = null,
            byte? indentedStyleId = null)
        {
            UppercaseHeadings = uppercaseHeadings;
            AutoWidthColumns = autoWidthColumns;
            HeadingStyleID = headingStyleId;
            StandardStyleID = standardStyleId;
            IndentedHeadingStyleID = indentedHeadingStyleId;
            IndentedStyleID = indentedStyleId;

            if (rows.FirstOrDefault() as XElement != null)
            {
                PopulateRowsFromXElements(rows as IEnumerable<XElement>);
            }
            else if ((rows.FirstOrDefault() as IEnumerable<object>) == null)
            {
                PopulateRowsFromObjects(rows);
            }
            else
            {
                PopulateRowsFromIEnumerable(rows as IEnumerable<ExpandoObject>);
            }
        }

        /// <summary>
        /// Populate rows from datatable
        /// </summary>
        public void PopulateRowsFromDataTable(DataTable table, int existingHeadingRows = 0)
        {
            var rowNumber = existingHeadingRows + 1;
            var headingColumnNumber = 1;

            var headingCells = (from c in table.Columns.OfType<DataColumn>() select new Cell(headingColumnNumber++, c.ColumnName)).ToArray();
            var headingRow = new Row(rowNumber++, headingCells);
            var newRows = new List<Row>() { headingRow };

            for (var rowIndex = 0; rowIndex < table.Rows.Count; rowIndex++)
            {
                var cells = new List<Cell>();

                for (var columnIndex = 0; columnIndex < table.Columns.Count; columnIndex++)
                {
                    object value = table.Rows[rowIndex].ItemArray[columnIndex];
                    if (value == null) continue;

                    var cell = new Cell(columnIndex + 1, value);
                    cells.Add(cell);
                }

                var row = new Row(rowNumber++, cells);
                newRows.Add(row);
            }

            Rows = newRows;
        }

        /// <summary>
        /// Get Header Column Name from [ExcelColumn(Name="column1")] or the property name
        /// </summary>
        private string GetHeaderName(PropertyInfo propertyInfo)
        {
            var descriptionAttribute = propertyInfo.GetCustomAttribute<ExcelColumnAttribute>();
            if (descriptionAttribute != null && !string.IsNullOrWhiteSpace(descriptionAttribute.Name))
            {
                return descriptionAttribute.Name;
            }
            return propertyInfo.Name;
        }

        private void PopulateRowsFromObjects<T>(IEnumerable<T> rows)
        {
            int overallRowCounter = 1;
            int indentationCounter = 0;

            Rows = WriteExpandoObjectList(rows as IEnumerable<ExpandoObject>, ref overallRowCounter, ref indentationCounter, null);

            if (AutoWidthColumns)
            {
                if (Rows.Any())
                {
                    for (var i = 0; i < Rows.Select(p => p.Cells.Count()).Max(); i++)
                    {
                        Columns.Add(new Column()
                        {
                            Index = i + 1,
                            LongestContentWidth = null
                        });
                    }
                }

                Columns.ForEach(c =>
                {
                    c.LongestContentWidth = Rows.SelectMany(p => p.Cells.Where(q => q.ColumnNumber == c.Index).Select(q => q.Length)).Max() + 3;
                });
            }
        }

        private void PopulateRowsFromXElements(IEnumerable<XElement> rows)
        {
            int overallRowCounter = 1;

            Rows = WriteXElementList(rows, ref overallRowCounter);

            if (AutoWidthColumns)
            {
                if (Rows.Any())
                {
                    for (var i = 0; i < Rows.Select(p => p.Cells.Count()).Max(); i++)
                    {
                        Columns.Add(new Column()
                        {
                            Index = i + 1,
                            LongestContentWidth = null
                        });
                    }
                }

                Columns.ForEach(c =>
                {
                    c.LongestContentWidth = Rows.SelectMany(p => p.Cells.Where(q => q.ColumnNumber == c.Index).Select(q => q.Length)).Max() + 3;
                });
            }
        }

        private void PopulateRowsFromIEnumerable(IEnumerable<ExpandoObject> rows)
        {
            int overallRowCounter = 1;
            int indentationCounter = 0;

            Rows = WriteExpandoObjectList(rows, ref overallRowCounter, ref indentationCounter, null);

            if (AutoWidthColumns)
            {
                for (var i = 0; i < Rows.Select(p => p.Cells.Count()).Max(); i++)
                {
                    Columns.Add(new Column()
                    {
                        Index = i + 1,
                        LongestContentWidth = null
                    });
                }

                Columns.ForEach(c =>
                {
                    c.LongestContentWidth = Rows.SelectMany(p => p.Cells.Where(q => q.ColumnNumber - 1 == c.Index).Select(q => q.Length)).Max() + 3;
                });
            }
        }

        List<Row> WriteExpandoObjectList(IEnumerable<ExpandoObject> data, ref int overallRowCounter, ref int indentationCounter, string subTableLabel = null)
        {
            List<Row> rows = new List<Row>();

            int thisTableRowCounter = 1;

            foreach (var item in data)
            {
                IDictionary<string, object> propertyValues = item;

                if (thisTableRowCounter == 1)
                {
                    var cells = new List<Cell>();

                    thisTableRowCounter++;

                    var headerCellCounter = 1;

                    for (var i = 0; i < indentationCounter; i++)
                    {
                        cells.Add(new Cell(headerCellCounter++, null));
                    }

                    var headerStyleIndex = indentationCounter == 0 ? HeadingStyleID : IndentedHeadingStyleID; // 15 : 5

                    propertyValues.Keys.ToList().ForEach(k =>
                    {
                        if (propertyValues[k] as List<object> != null)
                        {
                            // We have a thing we want to indent and display as related data but of a different set
                            // The first step here is, yes, to NOT write a column in teh main set for these types
                        }
                        else
                        {
                            var heading = k?.Replace(",", " ").Replace("\r\n", " ").Replace("\n", " ");//?.SplitCamelCase();

                            if (UppercaseHeadings)
                                cells.Add(new Cell(headerCellCounter++, heading.ToUpperInvariant(), headerStyleIndex));
                            else
                                cells.Add(new Cell(headerCellCounter++, heading, headerStyleIndex));
                        }
                    });

                    var headerRow = new Row(overallRowCounter++, cells);

                    rows.Add(headerRow);
                }

                var dataCells = new List<Cell>();

                var dataCellCounter = 1;

                // what about having MULTIPLE properties which could be arrays, think about that
                List<Tuple<string, List<object>>> AdditionalDataSets = new List<Tuple<string, List<object>>>();

                for (var i = 0; i < indentationCounter; i++)
                {
                    if (i == indentationCounter - 1 && !String.IsNullOrEmpty(subTableLabel))
                    {
                        dataCells.Add(new Cell(dataCellCounter++, UppercaseHeadings ? subTableLabel.ToUpperInvariant() : subTableLabel, IndentedHeadingStyleID)); // bold it
                    }
                    else
                    {
                        dataCells.Add(new Cell(dataCellCounter++, null));
                    }
                }

                var styleIndex = indentationCounter == 0 ? StandardStyleID : IndentedStyleID; // 13 : 26

                propertyValues.Keys.ToList().ForEach(k =>
                {
                    var v = propertyValues[k];

                    if (v is List<object> list)
                    {
                        AdditionalDataSets.Add(new Tuple<string, List<object>>(k, list));
                    }
                    else
                    {
                        dataCells.Add(new Cell(dataCellCounter++, v?.ToString().Replace(",", " ").Replace("\r\n", " ").Replace("\n", " ") ?? "", styleIndex));
                    }
                });

                var dataRow = new Row(overallRowCounter++, dataCells);

                rows.Add(dataRow);

                if (AdditionalDataSets.Where(p => p.Item2.Count > 0).Any())
                {
                    indentationCounter += 2;

                    for (var i = 0; i < AdditionalDataSets.Count; i++)
                    {
                        var c = AdditionalDataSets[i];

                        if (c.Item2.Count > 0)
                        {
                            rows.Add(new Row(overallRowCounter++, new List<Cell>()));

                            var eo = JsonConvert.DeserializeObject<IEnumerable<ExpandoObject>>(JsonConvert.SerializeObject(c.Item2), new ExpandoObjectConverter());

                            rows.AddRange(WriteExpandoObjectList(eo, ref overallRowCounter, ref indentationCounter, c.Item1));
                        }
                    }

                    indentationCounter = 0;

                    overallRowCounter += 2;
                }
            }

            return rows;
        }

        List<Row> WriteXElementList(IEnumerable<XElement> data, ref int overallRowCounter)
        {
            List<Row> rows = new List<Row>();

            int thisTableRowCounter = 1;

            foreach (var item in data)
            {
                if (thisTableRowCounter == 1)
                {
                    var cells = new List<Cell>();

                    thisTableRowCounter++;

                    var headerCellCounter = 1;

                    //cells.Add(new Cell(headerCellCounter++, null));

                    var headerStyleIndex = HeadingStyleID;

                    item.Elements().ToList().ForEach(k =>
                    {
                        var heading = k.Name.LocalName.Replace(",", " ").Replace("\r\n", " ").Replace("\n", " ");//?.SplitCamelCase();

                        if (UppercaseHeadings)
                            cells.Add(new Cell(headerCellCounter++, heading.ToUpperInvariant(), headerStyleIndex));
                        else
                            cells.Add(new Cell(headerCellCounter++, heading, headerStyleIndex));
                    });

                    var headerRow = new Row(overallRowCounter++, cells);

                    rows.Add(headerRow);
                }

                var dataCells = new List<Cell>();

                var dataCellCounter = 1;

                var styleIndex = StandardStyleID;

                item.Elements().ToList().ForEach(k =>
                {
                    var v = k.Value;

                    dataCells.Add(new Cell(dataCellCounter++, v?.ToString().Replace(",", " ").Replace("\r\n", " ").Replace("\n", " ") ?? "", styleIndex));
                });

                var dataRow = new Row(overallRowCounter++, dataCells);

                rows.Add(dataRow);
            }

            return rows;
        }

        /// <summary>
        /// Add a row using a collection of value objects
        /// </summary>
        /// <param name="cellValues">Collection of objects</param>
        public void AddRow(params object[] cellValues)
        {
            if (Rows == null)
            {
                Rows = new List<Row>();
            }

            var cells = new List<Cell>();

            int columnNumber = 1;
            foreach (object value in cellValues)
            {
                if (value != null)
                {
                    var cell = new Cell(columnNumber++, value);
                    cells.Add(cell);
                }
                else
                {
                    columnNumber++;
                }
            }

            var row = new Row(Rows.Count() + 1, cells);
            (Rows as List<Row>).Add(row);
        }

        /// <summary>
        /// Note: This method is slow
        /// </summary>
        public void AddValue(int rowNumber, int columnNumber, object value)
        {
            if (Rows == null)
            {
                Rows = new List<Row>();
            }

            Row row = (from r in Rows
                       where r.RowNumber == rowNumber
                       select r).FirstOrDefault();
            Cell cell = null;

            if (row == null)
            {
                cell = new Cell(columnNumber, value);
                row = new Row(rowNumber, new List<Cell> { cell });
                (Rows as List<Row>).Add(row);
            }

            if (cell == null)
            {
                cell = (from c in row.Cells
                        where c.ColumnNumber == columnNumber
                        select c).FirstOrDefault();

                if (cell == null)
                {
                    cell = new Cell(columnNumber, value);
                    (row.Cells as List<Cell>).Add(cell);
                }
            }

        }

        /// <summary>
        /// Merges the parameter into the current DatSet object, the parameter takes precedence
        /// </summary>
        /// <param name="data">A DataSet to merge</param>
        public void Merge(Worksheet data)
        {
            // Merge headings
            if (Headings == null || !Headings.Any())
            {
                Headings = data.Headings;
            }

            // Merge rows
            Rows = data.MergeRows(Rows);
            // data.Rows = MergeRows(data.Rows);

        }

        private IEnumerable<Row> MergeRows(IEnumerable<Row> rows)
        {
            foreach (var row in Rows.Union(rows).GroupBy(r => r.RowNumber))
            {
                int count = row.Count();
                if (count == 1)
                {
                    yield return row.First();
                }
                else
                {
                    row.First().Merge(row.Skip(1).First());

                    yield return row.First();
                }
            }
        }

        /// <summary>
        /// Does the file exist
        /// </summary>
        public bool Exists
        {
            get
            {
                return !string.IsNullOrEmpty(FileName);
            }
        }

        internal void Read(int? sheetNumber = null, string sheetName = null, int existingHeadingRows = 0)
        {
            GetWorksheetProperties(FastExcel, sheetNumber, sheetName);
            Read(existingHeadingRows);
        }

        /// <summary>
        /// Read the worksheet
        /// </summary>
        /// <param name="existingHeadingRows"></param>
        public void Read(int existingHeadingRows = 0)
        {
            FastExcel.CheckFiles();
            FastExcel.PrepareArchive();

            ExistingHeadingRows = existingHeadingRows;

            IEnumerable<Row> rows = null;

            var headings = new List<string>();
            using (Stream stream = FastExcel.Archive.GetEntry(FileName).Open())
            {
                var document = XDocument.Load(stream);
                int skipRows = 0;

                var rowElement = document.Descendants().FirstOrDefault(d => d.Name.LocalName == "row");
                if (rowElement != null)
                {
                    var possibleHeadingRow = new Row(rowElement, this);
                    if (ExistingHeadingRows == 1 && possibleHeadingRow.RowNumber == 1)
                    {
                        foreach (var headerCell in possibleHeadingRow.Cells)
                        {
                            headings.Add(headerCell.Value.ToString());
                        }
                    }
                }
                rows = GetRows(document.Descendants().Where(d => d.Name.LocalName == "row").Skip(skipRows));
            }

            Headings = headings;
            Rows = rows;
        }

        /// <summary>
        /// Returns cells using provided range
        /// </summary>
        /// <param name="cellRange">Definition of range to use</param>
        /// <returns></returns>
        public IEnumerable<Cell> GetCellsInRange(CellRange cellRange)
        {
            IEnumerable rows;

            if (cellRange.RowEnd.HasValue)
            {
                rows = (from row in Rows
                        where row.RowNumber >= cellRange.RowStart && row.RowNumber <= cellRange.RowEnd
                        select row);
            }
            else
            {
                rows = (from row in Rows
                        where row.RowNumber >= cellRange.RowStart
                        select row);
            }

            var rangeResult = new List<Cell>();
            foreach (Row row in rows)
            {
                rangeResult.InsertRange(rangeResult.Count,
                    (from cell in row.Cells
                     where cell.ColumnNumber >= Cell.GetExcelColumnNumber(cellRange.ColumnStart) && cell.ColumnNumber <= Cell.GetExcelColumnNumber(cellRange.ColumnEnd)
                     select cell).ToList());
            }

            return rangeResult;
        }

        private IEnumerable<Row> GetRows(IEnumerable<XElement> rowElements)
        {
            foreach (var rowElement in rowElements)
            {
                yield return new Row(rowElement, this);
            }
        }

        /// <summary>
        /// Read the existing sheet and copy some of the existing content
        /// </summary>
        /// <param name="stream">Worksheet stream</param>
        /// <param name="worksheet">Saves the header and footer to the worksheet</param>
        internal void ReadHeadersAndFooters(StreamReader stream, ref Worksheet worksheet)
        {
            var headers = new StringBuilder();
            var footers = new StringBuilder();

            bool headersComplete = false;
            bool rowsComplete = false;

            int existingHeadingRows = worksheet.ExistingHeadingRows;

            while (stream.Peek() >= 0)
            {
                string line = stream.ReadLine();
                int currentLineIndex = 0;

                if (!headersComplete)
                {
                    if (line.Contains("<sheetData/>"))
                    {
                        currentLineIndex = line.IndexOf("<sheetData/>");
                        headers.Append(line.Substring(0, currentLineIndex));
                        //remove the read section from line
                        line = line.Substring(currentLineIndex, line.Length - currentLineIndex);

                        headers.Append("<sheetData>");

                        // Headers complete now skip any content and start footer
                        headersComplete = true;
                        footers = new StringBuilder();
                        footers.Append("</sheetData>");

                        //There is no rows
                        rowsComplete = true;
                    }
                    else if (line.Contains("<sheetData>"))
                    {
                        currentLineIndex = line.IndexOf("<sheetData>");
                        headers.Append(line.Substring(0, currentLineIndex));
                        //remove the read section from line
                        line = line.Substring(currentLineIndex, line.Length - currentLineIndex);

                        headers.Append("<sheetData>");

                        // Headers complete now skip any content and start footer
                        headersComplete = true;
                        footers = new StringBuilder();
                        footers.Append("</sheetData>");
                    }
                    else
                    {
                        headers.Append(line);
                    }
                }

                if (headersComplete && !rowsComplete)
                {
                    if (existingHeadingRows == 0)
                    {
                        rowsComplete = true;
                    }

                    if (!rowsComplete)
                    {
                        while (!string.IsNullOrEmpty(line) && existingHeadingRows != 0)
                        {
                            if (line.Contains("<row"))
                            {
                                if (line.Contains("</row>"))
                                {
                                    int index = line.IndexOf("<row");
                                    currentLineIndex = line.IndexOf("</row>") + "</row>".Length;
                                    headers.Append(line.Substring(index, currentLineIndex - index));

                                    //remove the read section from line
                                    line = line.Substring(currentLineIndex, line.Length - currentLineIndex);
                                    existingHeadingRows--;
                                }
                                else
                                {
                                    int index = line.IndexOf("<row");
                                    headers.Append(line.Substring(index, line.Length - index));
                                    line = string.Empty;
                                }
                            }
                            else if (line.Contains("</row>"))
                            {
                                currentLineIndex = line.IndexOf("</row>") + "</row>".Length;
                                headers.Append(line.Substring(0, currentLineIndex));

                                //remove the read section from line
                                line = line.Substring(currentLineIndex, line.Length - currentLineIndex);
                                existingHeadingRows--;
                            }
                        }
                    }

                    if (existingHeadingRows == 0)
                    {
                        rowsComplete = true;
                    }
                }

                if (rowsComplete)
                {
                    if (line.Contains("</sheetData>"))
                    {
                        int index = line.IndexOf("</sheetData>") + "</sheetData>".Length;
                        var foot = line.Substring(index, line.Length - index);
                        footers.Append(foot);
                    }
                    else if (line.Contains("<sheetData/>"))
                    {
                        int index = line.IndexOf("<sheetData/>") + "<sheetData/>".Length;
                        footers.Append(line.Substring(index, line.Length - index));
                    }
                    else
                    {
                        footers.Append(line);
                    }
                }
            }

            if (Columns.Any())
            {
                var columns = $"<cols>{String.Join(System.Environment.NewLine, Columns.Select(p => $"<col min=\"{p.Index}\" max=\"{p.Index}\" width=\"{p.LongestContentWidth}\" customWidth=\"1\"/>"))}</cols>";

                headers = headers.Replace("<sheetData>", $"{columns}<sheetData>");
            }

            worksheet.Headers = headers.ToString();
            worksheet.Footers = footers.ToString();
        }


        /// <summary>
        /// Get worksheet file name from xl/workbook.xml
        /// </summary>
        internal void GetWorksheetProperties(FastExcel fastExcel, int? sheetNumber = null, string sheetName = null)
        {
            GetWorksheetPropertiesAndValidateNewName(fastExcel, sheetNumber, sheetName);
        }

        private bool GetWorksheetPropertiesAndValidateNewName(FastExcel fastExcel, int? sheetNumber = null, string sheetName = null, string newSheetName = null)
        {
            FastExcel = fastExcel;
            bool newSheetNameExists = false;

            FastExcel.CheckFiles();
            FastExcel.PrepareArchive();

            //If index has already been loaded then we can skip this function
            if (Index != 0)
            {
                return true;
            }

            if (!sheetNumber.HasValue && string.IsNullOrEmpty(sheetName))
            {
                throw new Exception("No worksheet name or number was specified");
            }

            using (Stream stream = FastExcel.Archive.GetEntry("xl/workbook.xml").Open())
            {
                var document = XDocument.Load(stream);

                if (document == null)
                {
                    throw new Exception("Unable to load workbook.xml");
                }

                var sheetsElements = document.Descendants().Where(d => d.Name.LocalName == "sheet").ToList();

                XElement sheetElement = null;

                if (sheetNumber.HasValue)
                {
                    if (sheetNumber.Value <= sheetsElements.Count)
                    {
                        sheetElement = sheetsElements[sheetNumber.Value - 1];
                    }
                    else
                    {
                        throw new Exception(string.Format("There is no sheet at index '{0}'", sheetNumber));
                    }
                }
                else if (!string.IsNullOrEmpty(sheetName))
                {
                    sheetElement = (from sheet in sheetsElements
                                    from attribute in sheet.Attributes()
                                    where attribute.Name == "name" && attribute.Value.Equals(sheetName, StringComparison.OrdinalIgnoreCase)
                                    select sheet).FirstOrDefault();

                    if (sheetElement == null)
                    {
                        throw new Exception(string.Format("There is no sheet named '{0}'", sheetName));
                    }

                    if (!string.IsNullOrEmpty(newSheetName))
                    {
                        newSheetNameExists = (from sheet in sheetsElements
                                              from attribute in sheet.Attributes()
                                              where attribute.Name == "name" && attribute.Value.Equals(newSheetName, StringComparison.OrdinalIgnoreCase)
                                              select sheet).Any();

                        if (FastExcel.MaxSheetNumber == 0)
                        {
                            FastExcel.MaxSheetNumber = (from sheet in sheetsElements
                                                        from attribute in sheet.Attributes()
                                                        where attribute.Name == "sheetId"
                                                        select int.Parse(attribute.Value)).Max();
                        }
                    }
                }

                Index = sheetsElements.IndexOf(sheetElement) + 1;

                Name = (from attribute in sheetElement.Attributes()
                        where attribute.Name == "name"
                        select attribute.Value).FirstOrDefault();
            }

            if (!Exists)
            {
                throw new Exception("No worksheet was found with the name or number was specified");
            }

            if (string.IsNullOrEmpty(newSheetName))
            {
                return false;
            }
            else
            {
                return !newSheetNameExists;
            }
        }

        internal void ValidateNewWorksheet(FastExcel fastExcel, int? insertAfterSheetNumber = null, string insertAfterSheetName = null)
        {
            if (string.IsNullOrEmpty(Name))
            {
                // TODO possibly could calulcate a new worksheet name
                throw new Exception("Name for new worksheet is not specified");
            }

            // Get worksheet details
            var previousWorksheet = new Worksheet(fastExcel);
            bool isNameValid = previousWorksheet.GetWorksheetPropertiesAndValidateNewName(fastExcel, insertAfterSheetNumber, insertAfterSheetName, Name);
            InsertAfterIndex = previousWorksheet.Index;

            if (!isNameValid)
            {
                throw new Exception(string.Format("Worksheet name '{0}' already exists", Name));
            }

            fastExcel.MaxSheetNumber += 1;
            Index = fastExcel.MaxSheetNumber;

            if (string.IsNullOrEmpty(Headers))
            {
                Headers = DEFAULT_HEADERS;
            }

            if (string.IsNullOrEmpty(Footers))
            {
                Footers = DEFAULT_FOOTERS;
            }
        }

        internal WorksheetAddSettings AddSettings
        {
            get
            {
                if (InsertAfterIndex.HasValue)
                {
                    return new WorksheetAddSettings()
                    {
                        Name = Name,
                        SheetId = Index,
                        InsertAfterSheetId = InsertAfterIndex.Value
                    };
                }
                else
                {
                    return null;
                }
            }
        }
    }
}