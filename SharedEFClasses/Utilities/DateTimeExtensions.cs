using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Utilities
{
	// Thanks to "Compile This": https://stackoverflow.com/questions/38039/how-can-i-get-the-datetime-for-the-start-of-the-week#answer-38064
	public static class DateTimeExtensions
	{
		public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
		{
			int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
			return dt.AddDays(-1 * diff).Date;
		}
	}
}
