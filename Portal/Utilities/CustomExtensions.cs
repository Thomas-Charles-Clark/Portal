using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Text.RegularExpressions;

namespace Portal.Utilities
{
    public static class CustomExtensions
    {
        public static object GetPropertyValue(object src, string propName)
        {
            return src.GetType().GetProperty(propName).GetValue(src, null);
        }

        public static IEnumerable<string> Split(string str, int chunkSize)
        {
            return Enumerable.Range(0, str.Length / chunkSize)
                .Select(i => str.Substring(i * chunkSize, chunkSize));
        }

        public static string TrimReduceTruncate(this string str, int length)
        {
            if (str == null)
            {
                return "";
            }

            var result = ConvertWhitespacesToSingleSpaces(str).Trim();

            if (result.Length > length)
            {
                return result.Substring(0, length);
            }
            else
            {
                return result;
            }
        }

        public static string ConvertWhitespacesToSingleSpaces(this string value)
        {
            return Regex.Replace(value, @"\s+", " ");
        }
    }
}