using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SharedEFClasses.Utilities
{
    public static class StringExtension
    {
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

        private static readonly System.Globalization.TextInfo TextInfo = new System.Globalization.CultureInfo("en-GB").TextInfo;

        public static string ToCamelCase(this string value)
        {
            if (String.IsNullOrEmpty(value))
            {
                return null;
            }
            else
            {
                var regexed = Regex.Replace(value, "([a-z])([A-Z])", "$1 $2").Trim();

                regexed = Regex.Replace(regexed, "([A-Z])([A-Z])", "$1 $2").Trim();

                var split = regexed.Split(new char[] { ' ' }).Select(s => TextInfo.ToTitleCase(s.ToLowerInvariant())).ToList();

                var firstWord = split.First();

                var firstLetter = firstWord[0].ToString().ToLowerInvariant();

                firstWord = firstWord.Substring(1);

                split.RemoveAt(0);

                split.Insert(0, $"{firstLetter}{firstWord}");

                split.ForEach(s =>
                {
                    if (s == "ID")
                    {
                        s = "Id";
                    }
                });

                var result = String.Join("", split);

                if (result.EndsWith("ID"))
                {
                    result = result.TrimEnd(new char[] { 'D' });
                    result += "d";
                }

                return result;
            }
        }
    }
}
