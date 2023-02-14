using System;
using System.Collections.Generic;

namespace DG_Asset_Downloader.Classes
{
    static class BasketContents
    {
        public static long RequiredDiskSpaceInBytes
        {
            get
            {
                return 153600L; // == 1MiB == 1024KiB
            }
        }

        public static List<long> DownloadList
        {
            get 
            {
                return new List<long>() 
                {
                    18884
                };
            }
        }
    }
}