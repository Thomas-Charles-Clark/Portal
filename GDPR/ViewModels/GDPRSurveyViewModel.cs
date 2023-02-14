using GDPR.Models;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GDPR.ViewModels
{
    public class GDPRSurveyViewModel : BaseViewModel
    {
        public List<DataCategory> DataCategories { get; set; }

        public List<IndividualCategory> IndividualCategories { get; set; }

        public List<DataStore> DataStores { get; set; }

        public List<DataSource> DataSources { get; set; }

        public List<SupplierCategory> PartnerCategories { get; set; }

        public List<DataTransmissionMethod> DataTransmissionMethods { get; set; }

        public GDPRSurveyViewModel(
            List<DataCategory> dataCategories,
            List<IndividualCategory> individualCategories,
            List<DataStore> dataStores,
            List<DataSource> dataSources,
            List<SupplierCategory> partnerCategories,
            List<DataTransmissionMethod> dataTransmissionMethods,
            string applicationHeading, 
            string applicationSubHeading,
            RoleProperties roleProperties) 
            : base (roleProperties, applicationHeading, applicationSubHeading)
        {
            this.DataCategories = dataCategories;
            this.IndividualCategories = individualCategories;
            this.DataStores = dataStores;
            this.DataSources = dataSources;
            this.PartnerCategories = partnerCategories;
            this.DataTransmissionMethods = dataTransmissionMethods;
        }
    }
}