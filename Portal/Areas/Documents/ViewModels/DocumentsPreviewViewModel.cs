using SharedEFClasses;
using SharedEFClasses.Models;

namespace Portal.Areas.Documents.ViewModels
{
    public class DocumentsPreviewViewModel : BaseViewModel
    {
        public DocumentsPreviewViewModel(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {

        }
    }
}