using Newtonsoft.Json;

using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NotificationsCLRTester
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;

            Console.WriteLine("Testing Notification CLR");

            var notice = new PortalDbContext("vm-sql").Notifications.FirstOrDefault();

            var serialized = JsonConvert.SerializeObject(notice, Formatting.Indented);

            Console.WriteLine(serialized);

            Console.WriteLine();

            Console.ForegroundColor = ConsoleColor.Green;

            Console.WriteLine(NotificationsCLR.NotificationsCLR.Notify(serialized));

            Console.WriteLine();

            Console.WriteLine("Press any key to continue...");

            Console.ReadKey();
        }
    }
}
