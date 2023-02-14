using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Utilities.ModelBinderAttributes
{
    //Cheers, Tom!
    //http://www.tomdupont.net/2009/08/mvc-json-model-binder.html
    public class JsonBinderAttribute : CustomModelBinderAttribute
    {
        public override IModelBinder GetBinder()
        {
            return new JsonModelBinder();
        }

        public class JsonModelBinder : IModelBinder
        {
            public object BindModel(
                ControllerContext controllerContext,
                ModelBindingContext bindingContext)
            {
                var json = controllerContext.HttpContext.Request
                            .Params[bindingContext.ModelName];

                if (String.IsNullOrWhiteSpace(json))
                    return null;

                // Swap this out with whichever Json deserializer you prefer.
                var model = Newtonsoft.Json.JsonConvert
                        .DeserializeObject(json, bindingContext.ModelType);


                // DataAnnotation Validation
                var validationResult = from prop in TypeDescriptor.GetProperties(model).Cast<PropertyDescriptor>()
                                        from attribute in prop.Attributes.OfType<ValidationAttribute>()
                                        where !attribute.IsValid(prop.GetValue(model))
                                        select new { Property = prop.DisplayName ?? prop.Name, ErrorMessage = attribute.FormatErrorMessage(string.Empty) };

                // Add the ValidationResult's to the ModelState
                foreach (var validationResultItem in validationResult)
                    bindingContext.ModelState.AddModelError(validationResultItem.Property, validationResultItem.ErrorMessage);

                return model;
            }
        }
    }
}