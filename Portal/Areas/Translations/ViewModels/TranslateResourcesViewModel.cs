using DocumentFormat.OpenXml.Wordprocessing;

using Portal.Models;
using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Translations;
using SharedEFClasses.Models.General;

using System;
using System.Collections.Generic;
using System.Linq;

namespace Portal.Areas.Translations.ViewModels
{
    public class TranslateResourcesViewModel : BaseViewModel
    {
        public string LanguageCode { get; set; }
        public byte? LanguageID { get; set; }
        public bool? Approval { get; set; }

        public IEnumerable<Translation_DashboardResult> DashboardPods { get; set; }

        public TranslateResourcesViewModel(
            string languageCode,
            bool? approved,
            RoleProperties properties, 
            string applicationHeading, 
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            LanguageCode = languageCode;
            Approval = approved;

            using (var db = new PortalDbContext())
			{
				if (!String.IsNullOrEmpty(LanguageCode))
				{
                    LanguageID = db.Languages.FirstOrDefault(l => l.Deleted == false && l.Code == languageCode)?.LanguageID;
				}

                DashboardPods = db.Translation_Dashboard_Select(new PassTranslationDashboardDTO()
                {
                    LanguageID = LanguageID
                });
            }
        }
    }
}