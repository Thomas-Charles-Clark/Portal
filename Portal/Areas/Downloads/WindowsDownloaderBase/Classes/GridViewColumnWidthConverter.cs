using System;
using System.Globalization;
using System.Windows.Controls;
using System.Windows.Data;

namespace DG_Asset_Downloader.Classes
{

    /// <summary>
    /// Credit & thanks to author of leghumped.com
    /// 
    /// Calculates the column width required to fill the view in a GridView
    /// For usage examples, see http://leghumped.com/blog/2009/03/11/wpf-gridview-column-width-calculator/
    /// </summary>
    public class GridViewColumnWidthConverter : IValueConverter
    {
        /// <summary>
        /// Converts the specified value.
        /// </summary>
        /// <param name="value">The parent Listview.</param>
        /// <param name="type">The type.</param>
        /// <param name="parameter">
        /// If no parameter is given, the remaining width will be returned.
        /// If the parameter is an integer acts as MinimumWidth, the remaining with will be returned only if it's greater than the parameter
        /// If the parameter is anything else, it's taken to be a percentage. Eg: 0.3* = 30%, 0.15* = 15%
        /// </param>
        /// <param name="culture">The culture.</param>
        /// <returns>The width, as calculated by the parameter given</returns>
        public object Convert(object value, Type type, object parameter, CultureInfo culture)
        {
            if (value == null) return null;
            ListView listView = value as ListView;
            GridView grdView = listView.View as GridView;
            int minWidth = 0;
            bool widthIsPercentage = parameter != null && !int.TryParse(parameter.ToString(), out minWidth);

            double result = 0.0;

            if (widthIsPercentage)
            {
                string widthParam = parameter.ToString();
                double percentage = double.Parse(widthParam.Substring(0, widthParam.Length - 1));
                result = listView.Width * percentage;
            }
            else
            {
                double total = 0;
                for (int i = 0; i < grdView.Columns.Count - 1; i++)
                {
                    total += grdView.Columns[i].Width;
                }
                double remainingWidth = listView.Width - total;
                if (remainingWidth > minWidth)
                { // fill the remaining width in the ListView
                    result = remainingWidth;
                }
                else
                { // fill remaining space with MinWidth
                    result = minWidth;
                }
            }

            return (double)(result - 35.0);
        }

        public object ConvertBack(object o, Type type, object parameter, CultureInfo culture)
        {
            throw new NotSupportedException();
        }
    }
}