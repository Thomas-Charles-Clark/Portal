using System.Text.RegularExpressions;
using System;
using System.Web;
using System.Web.Optimization;

namespace Portal
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            //
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //
            // Styles
            //
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //

 #if DEBUG

            bundles.Add(new StyleBundle("~/bundles/css/components").Include(
                    "~/css/dist/lib/tiny-slider/tiny-slider.css",
                    "~/css/dist/models/order-search.css",
                    "~/css/dist/models/order-products.css",
                    "~/css/dist/models/stock-viewer.css",
                    "~/css/dist/models/care-search.css",
                    "~/css/dist/models/task-search.css",
                    "~/css/dist/models/visit-search.css",
                    "~/css/dist/models/visit-booker.css",
                    "~/css/dist/models/member-search.css",
                    "~/css/dist/models/recently-used-members.css",
                    "~/css/dist/models/business-potential.css",
                    "~/css/dist/models/slicer-component.css",
                    "~/css/dist/lib/owl-carousel/owl.carousel.css",
                    "~/css/dist/lib/owl-carousel/owl.theme.default.css"
                ).Include("~/css/dist/lib/intl-tel-input/intl-tel-input.css", new CssRewriteUrlTransform()));

            bundles.Add(new StyleBundle("~/bundles/css/mdc-custom").Include(
                      "~/css/dist/models/order-search.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/order-search").Include(
                      "~/css/dist/models/order-search.css"
                ));


            bundles.Add(new StyleBundle("~/bundles/css/care-search").Include(
                      "~/css/dist/models/care-search.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/task-search").Include(
                      "~/css/dist/models/task-search.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/visit-search").Include(
                      "~/css/dist/models/visit-search.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/member-search").Include(
                        "~/css/dist/models/recently-used-members.css",
                        "~/css/dist/models/member-search.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/visit-booker").Include(
                        "~/css/dist/models/visit-booker.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/lead-search").Include(
                        "~/css/dist/models/lead-search.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/download-products").Include(
                        "~/css/dist/models/download-products.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/projects-dashboard").Include(
                        "~/css/dist/models/projects-dashboard.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/tasks-dashboard").Include(
                        "~/css/dist/models/tasks-dashboard.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-tagging").Include(
                        "~/css/dist/models/customer-tagging.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/sales-statistics").Include(
                        "~/css/dist/models/sales-statistics.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/gdpr-survey").Include(
                        "~/css/dist/models/gdpr-survey.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/sample-request-dg").Include(
                      "~/css/dist/models/sample-request-dg.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/sample-request").Include(
                      "~/css/dist/models/sample-request.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/alternative-products").Include(
                      "~/css/dist/models/alternative-products.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-enquiry").Include(
                      "~/css/dist/models/customer-enquiry.css"
                ));


            bundles.Add(new StyleBundle("~/bundles/css/pricing-enquiry").Include(
                      "~/css/dist/models/pricing-enquiry.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-visit").Include(
                        "~/css/dist/models/customer-visit.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-care").Include(
                        "~/css/dist/models/customer-care.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/lead-enquiry").Include(
                        "~/css/dist/models/price-checker.css",
                        "~/css/dist/models/visit-search.css",
                        "~/css/dist/models/visit-booker.css",
                        "~/css/dist/models/member-search.css",
                        "~/css/dist/models/lead-search.css",
                        "~/css/dist/models/care-search.css",
                        "~/css/dist/models/lead-enquiry.css"
                ).Include("~/css/dist/lib/intl-tel-input/intl-tel-input.css", new CssRewriteUrlTransform()));

            bundles.Add(new StyleBundle("~/bundles/css/order-products").Include(
                        "~/css/dist/models/order-products.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/product-maintenance").Include(
                        "~/css/dist/models/product-maintenance.css",
                        "~/css/dist/models/product-maintenance-treatments.css",
                        "~/css/dist/models/product-maintenance-products.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/product-type-maintenance").Include(
                        "~/css/dist/lib/codemirror/codemirror.css",
                        "~/css/dist/models/product-type-maintenance.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/basket-status").Include(
                        "~/css/dist/models/basket-status.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/product-delivery").Include(
                        "~/css/dist/models/product-delivery.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/product-categories").Include(
                        "~/css/dist/models/product-categories.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/order-tracking").Include(
                        "~/css/dist/models/order-tracking.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/ring-fenced-stock").Include(
                        "~/css/dist/models/ring-fenced-stock.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/translations").Include(
                        "~/css/dist/models/translations.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/marketing-messages").Include(
                        "~/css/dist/models/marketing-messages.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/bare").Include(
                      "~/css/dist/lib/jquery-ui/jquery-ui.css",
                      "~/css/dist/lib/bootstrap-3.3.7/bootstrap-3.3.7.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/master").Include(
                        "~/css/dist/lib/jquery-ui/jquery-ui.css",
                        "~/css/dist/lib/bootstrap-3.3.7/bootstrap-3.3.7.css",
                        "~/css/dist/lib/bootstrap-switch/bootstrap-switch.css",
                        "~/css/dist/models/site.css",
                        "~/css/dist/models/css-shake.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/master-5.3.1").Include(
                        "~/css/dist/lib/jquery-ui/jquery-ui.css",
                        "~/css/dist/lib/bootstrap-5.3.1/scss/bootstrap-5.3.1.css",
                        "~/css/dist/lib/bootstrap-icons/bootstrap-icons.css",
                        "~/css/dist/lib/bootstrap-switch/bootstrap-switch.css",
                        "~/css/dist/models/site.css",
                        "~/css/dist/models/site-new.css",
                        "~/css/dist/models/css-shake.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/kendo-custom").Include(
                        "~/css/dist/lib/kendo/custom/kendo-custom.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/order-returns").Include(
                        "~/css/dist/lib/kendo/custom/kendo-custom.css",
                        "~/css/dist/models/order-returns.css"
                ).Include("~/css/dist/lib/intl-tel-input/intl-tel-input.css", new CssRewriteUrlTransform()));

            bundles.Add(new StyleBundle("~/bundles/css/furniture-maintenance").Include(
                        "~/css/dist/models/furniture-maintenance.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/documents-preview").Include(
                        "~/css/dist/models/documents-preview.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/application-groups").Include(
                        "~/css/dist/models/application-groups.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-invite").Include(
                        "~/css/dist/models/customer-invite.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/treatment-invoice-approval").Include(
                        "~/css/dist/models/invoice-approval-shared.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/paint-invoice-approval").Include(
                        "~/css/dist/models/invoice-approval-shared.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/furniture-invoice-approval").Include(
                        "~/css/dist/models/invoice-approval-shared.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-ordering-notes").Include(
                        "~/css/dist/models/customer-ordering-notes.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/order-import").Include(
                        "~/css/dist/models/order-import.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/tempus-dominus").Include(
                        "~/css/dist/lib/tempus-dominus/tempus-dominus.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-maintenance").Include(
                      "~/css/dist/models/customer-maintenance.css"
                ));

#else

            bundles.Add(new StyleBundle("~/bundles/css/components").Include(
                    "~/css/dist/lib/tiny-slider/tiny-slider.min.css",
                    "~/css/dist/models/order-search.min.css",
                    "~/css/dist/models/order-products.min.css",
                    "~/css/dist/models/stock-viewer.min.css",
                    "~/css/dist/models/care-search.min.css",
                    "~/css/dist/models/task-search.min.css",
                    "~/css/dist/models/visit-search.min.css",
                    "~/css/dist/models/visit-booker.min.css",
                    "~/css/dist/models/member-search.min.css",
                    "~/css/dist/models/recently-used-members.min.css",
                    "~/css/dist/models/business-potential.min.css",
                    "~/css/dist/models/slicer-component.min.css",
                    "~/css/dist/lib/owl-carousel/owl.carousel.min.css",
                    "~/css/dist/lib/owl-carousel/owl.theme.default.min.css"
                ).Include("~/css/dist/lib/intl-tel-input/intl-tel-input.min.css", new CssRewriteUrlTransform()));


            bundles.Add(new StyleBundle("~/bundles/css/order-search").Include(
                      "~/css/dist/models/order-search.min.css"
                ));


            bundles.Add(new StyleBundle("~/bundles/css/care-search").Include(
                      "~/css/dist/models/care-search.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/task-search").Include(
                      "~/css/dist/models/task-search.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/visit-search").Include(
                      "~/css/dist/models/visit-search.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/member-search").Include(
                        "~/css/dist/models/recently-used-members.min.css",
                        "~/css/dist/models/member-search.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/visit-booker").Include(
                        "~/css/dist/models/visit-booker.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/lead-search").Include(
                        "~/css/dist/models/lead-search.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/download-products").Include(
                        "~/css/dist/models/download-products.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/projects-dashboard").Include(
                        "~/css/dist/models/projects-dashboard.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/tasks-dashboard").Include(
                        "~/css/dist/models/tasks-dashboard.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-tagging").Include(
                        "~/css/dist/models/customer-tagging.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/sales-statistics").Include(
                        "~/css/dist/models/sales-statistics.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/gdpr-survey").Include(
                        "~/css/dist/models/gdpr-survey.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/sample-request-dg").Include(
                      "~/css/dist/models/sample-request-dg.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/sample-request").Include(
                      "~/css/dist/models/sample-request.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/alternative-products").Include(
                      "~/css/dist/models/alternative-products.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-enquiry").Include(
                      "~/css/dist/models/customer-enquiry.min.css"
                ));


            bundles.Add(new StyleBundle("~/bundles/css/pricing-enquiry").Include(
                      "~/css/dist/models/pricing-enquiry.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-visit").Include(
                        "~/css/dist/models/customer-visit.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-care").Include(
                        "~/css/dist/models/customer-care.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/lead-enquiry").Include(
                        "~/css/dist/models/price-checker.min.css",
                        "~/css/dist/models/visit-search.min.css",
                        "~/css/dist/models/visit-booker.min.css",
                        "~/css/dist/models/member-search.min.css",
                        "~/css/dist/models/lead-search.min.css",
                        "~/css/dist/models/care-search.min.css",
                        "~/css/dist/models/lead-enquiry.min.css"
                ).Include("~/css/dist/lib/intl-tel-input/intl-tel-input.min.css", new CssRewriteUrlTransform()));

            bundles.Add(new StyleBundle("~/bundles/css/order-products").Include(
                        "~/css/dist/models/order-products.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/product-maintenance").Include(
                        "~/css/dist/models/product-maintenance.min.css",
                        "~/css/dist/models/product-maintenance-treatments.min.css",
                        "~/css/dist/models/product-maintenance-products.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/product-type-maintenance").Include(
                        "~/css/dist/lib/codemirror/codemirror.min.css",
                        "~/css/dist/models/product-type-maintenance.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/basket-status").Include(
                        "~/css/dist/models/basket-status.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/product-delivery").Include(
                        "~/css/dist/models/product-delivery.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/product-categories").Include(
                        "~/css/dist/models/product-categories.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/order-tracking").Include(
                        "~/css/dist/models/order-tracking.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/ring-fenced-stock").Include(
                        "~/css/dist/models/ring-fenced-stock.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/translations").Include(
                        "~/css/dist/models/translations.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/marketing-messages").Include(
                        "~/css/dist/models/marketing-messages.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/bare").Include(
                      "~/css/dist/lib/jquery-ui/jquery-ui.min.css",
                      "~/css/dist/lib/bootstrap-3.3.7/bootstrap-3.3.7.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/master").Include(
                        "~/css/dist/lib/jquery-ui/jquery-ui.min.css",
                        "~/css/dist/lib/bootstrap-3.3.7/bootstrap-3.3.7.min.css",
                        "~/css/dist/lib/bootstrap-switch/bootstrap-switch.min.css",
                        "~/css/dist/models/site.min.css",
                        "~/css/dist/models/css-shake.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/master-5.3.1").Include(
                        "~/css/dist/lib/jquery-ui/jquery-ui.min.css",
                        "~/css/dist/lib/bootstrap-5.3.1/scss/bootstrap-5.3.1.min.css",
                        "~/css/dist/lib/bootstrap-icons/bootstrap-icons.min.css",
                        "~/css/dist/lib/bootstrap-switch/bootstrap-switch.min.css",
                        "~/css/dist/models/site.min.css",
                        "~/css/dist/models/site-new.min.css",
                        "~/css/dist/models/css-shake.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/kendo-custom").Include(
                        "~/css/dist/lib/kendo/custom/kendo-custom.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/order-returns").Include(
                        "~/css/dist/lib/kendo/custom/kendo-custom.min.css",
                        "~/css/dist/models/order-returns.min.css"
                ).Include("~/css/dist/lib/intl-tel-input/intl-tel-input.min.css", new CssRewriteUrlTransform()));

            bundles.Add(new StyleBundle("~/bundles/css/furniture-maintenance").Include(
                        "~/css/dist/models/furniture-maintenance.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/documents-preview").Include(
                        "~/css/dist/models/documents-preview.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/application-groups").Include(
                        "~/css/dist/models/application-groups.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-invite").Include(
                        "~/css/dist/models/customer-invite.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/treatment-invoice-approval").Include(
                        "~/css/dist/models/invoice-approval-shared.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/paint-invoice-approval").Include(
                        "~/css/dist/models/invoice-approval-shared.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/furniture-invoice-approval").Include(
                        "~/css/dist/models/invoice-approval-shared.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-ordering-notes").Include(
                        "~/css/dist/models/customer-ordering-notes.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/order-import").Include(
                        "~/css/dist/models/order-import.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/tempus-dominus").Include(
                        "~/css/dist/lib/tempus-dominus/tempus-dominus.min.css"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-maintenance").Include(
                      "~/css/dist/models/customer-maintenance.min.css"
                ));

#endif

            //  
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //
            // Scripts
            //
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //

#if DEBUG

            bundles.Add(new ScriptBundle("~/bundles/js/bootstrap").Include(
                      "~/js/src/lib/bootstrap-3.3.7/bootstrap-3.3.7.js",
                      "~/js/src/lib/respond/respond.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/bootstrap-5.3.1").Include(
                      "~/js/src/lib/bootstrap-5.3.1/bootstrap.bundle-5.3.1.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/bootstrap-switch").Include(
                      "~/js/src/lib/bootstrap-switch/bootstrap-switch.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/kendo").Include(
                      "~/js/src/lib/kendo/kendo.2018.3.1017.all.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/popper").Include(
                      "~/js/src/lib/popper/popper.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/knockout").Include(
                      "~/js/src/lib/knockout/knockout-3.5.0.js",
                      "~/js/src/lib/knockout/knockout-fast-foreach.js",
                      "~/js/src/lib/knockout/knockout-mapping-latest.js",
                      "~/js/src/lib/knockout/knockout-kendo.js",
                      "~/js/src/lib/knockout/knockout-validation.js",
                      "~/js/src/lib/knockout/knockout-extensions.js",
                      "~/js/src/lib/knockout/knockout-infinite-scroll.js",
                      "~/js/src/lib/knockout/knockout-sortable.js",
                      "~/js/src/lib/owl-carousel/owl-carousel.js",
                      "~/js/src/lib/tiny-slider/tiny-slider.js",
                      "~/js/src/lib/knockout/knockout-owl-carousel.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/jquery").Include(
                        "~/js/src/lib/jquery-3.1.1/jquery-3.1.1.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/jqueryui").Include(
                        "~/js/src/lib/jquery-ui-1.12.1/jquery-ui-1.12.1.js",
                        "~/js/src/lib/jquery-ui-1.12.1/jquery-ui-extensions.js",
                        "~/js/src/lib/jquery-ui-1.12.1/jquery-ui-touch-punch.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/jqueryval").Include(
                        "~/js/src/lib/jquery-3.1.1/jquery.validate.js",
                        "~/js/src/lib/jquery-3.1.1/jquery.validate.unobtrusive.js",
                        "~/js/src/lib/jquery-3.1.1/jquery.validate-vsdoc.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/kendo-modernizr").Include(
                        "~/js/src/lib/kendo/kendo.modernizr.custom.js"));

            bundles.Add(new ScriptBundle("~/bundles/js/components").Include(
                    "~/js/src/models/kendo-mdc-drop-down-list-factory.js",
                    "~/js/src/models/trade-account-selector.js",
                    "~/js/src/models/product-search.js",
                    "~/js/src/models/order-search.js",
                    "~/js/src/models/order-products.js",
                    "~/js/src/models/order-products-drilldown.js",
                    "~/js/src/models/care-search.js",
                    "~/js/src/models/task-search.js",
                    "~/js/src/models/visit-search.js",
                    "~/js/src/models/visit-booker.js",
                    "~/js/src/models/member-search.js",
                    "~/js/src/models/recently-used-members.js",
                    "~/js/src/models/address.js",
                    "~/js/src/lib/jquery-3.1.1/jquery.twbsPagination.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/datetime-picker").Include(
                    "~/js/src/lib/bootstrap-datetime-picker/bootstrap-datetime-picker.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/tempus-dominus").Include(
                    "~/js/src/lib/tempus-dominus/tempus-dominus.js",
                    "~/js/src/lib/tempus-dominus/custom-date-format.js",
                    "~/js/src/lib/tempus-dominus/tempus-dominus-knockout.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/intl-tel").Include(
                    "~/js/src/lib/intl-tel-input/intl-tel-input.js",
                    "~/js/src/lib/intl-tel-input/utils.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/address").Include(
                    "~/js/src/models/address.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/trade-account-selector").Include(
                    "~/js/src/models/trade-account-selector.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-search").Include(
                        "~/js/src/models/product-search.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-search").Include(
                        "~/js/src/lib/jquery-3.1.1/jquery.twbsPagination.js",
                        "~/js/src/lib/bootstrap-datetime-picker/bootstrap-datetime-picker.js",
                        "~/js/src/models/order-search.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/care-search").Include(
                      "~/js/src/models/care-search.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/task-search").Include(
                      "~/js/src/models/task-search.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-maintenance").Include(
                      "~/js/src/models/customer-maintenance.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/visit-search").Include(
                        "~/js/src/lib/jquery-3.1.1/jquery.twbsPagination.js",
                        "~/js/src/lib/bootstrap-datetime-picker/bootstrap-datetime-picker.js",
                        "~/js/src/models/visit-search.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/member-search").Include(
                        "~/js/src/models/recently-used-members.js",
                        "~/js/src/models/member-search.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/visit-booker").Include(
                        "~/js/src/models/visit-booker.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/lead-search").Include(
                        "~/js/src/lib/jquery-3.1.1/jquery.twbsPagination.js",
                        "~/js/src/lib/bootstrap-datetime-picker/bootstrap-datetime-picker.js",
                        "~/js/src/models/lead-search.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/download-products").Include(
                        "~/js/src/models/download-products.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/projects-dashboard").Include(
                        "~/js/src/models/projects-dashboard.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/tasks-dashboard").Include(
                        "~/js/src/models/tasks-dashboard.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-tagging").Include(
                        "~/js/src/models/customer-tagging.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/sales-statistics").Include(
                        "~/js/src/models/sales-statistics.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/gdpr-survey").Include(
                        "~/js/src/models/gdpr-survey.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/home").Include(
                        "~/js/src/models/home.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/sample-request").Include(
                        "~/js/src/models/sample-request.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/sample-request-dg").Include(
                        "~/js/src/models/sample-request-dg.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/alternative-products").Include(
                        "~/js/src/models/alternative-products.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/trade-order-enquiry").Include(
                        "~/js/src/models/trade-order-enquiry.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-enquiry").Include(
                      "~/js/src/models/business-potential.js",
                      "~/js/src/models/customer-enquiry.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/pricing-enquiry").Include(
                        "~/js/src/models/price-checker.js",
                      "~/js/src/models/pricing-enquiry.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-visit").Include(
                        "~/js/src/models/customer-visit.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-care").Include(
                        "~/js/src/models/customer-care.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/lead-enquiry").Include(
                    "~/js/src/models/lead-enquiry.js",
                    "~/js/src/models/price-checker.js",
                    "~/js/src/lib/jquery-3.1.1/jquery.twbsPagination.js",
                    "~/js/src/lib/bootstrap-datetime-picker/bootstrap-datetime-picker.js",
                    "~/js/src/models/address.js",
                    "~/js/src/models/trade-account-contact.js",
                    "~/js/src/models/business-potential.js",
                    "~/js/src/lib/google-maps/google-maps-marker-clusterer.js",
                    "~/js/src/models/lead-search.js",
                    "~/js/src/models/visit-search.js",
                    "~/js/src/models/visit-booker.js",
                    "~/js/src/models/member-search.js",
                    "~/js/src/models/care-search.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-products-base").Include(
                        "~/js/src/models/order-products-base.js",
                        "~/js/src/models/basket-status.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-maintenance").Include(
                        "~/js/src/models/product-maintenance.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/treatment-maintenance").Include(
                        "~/js/src/models/treatment-maintenance.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-type-maintenance").Include(
                        "~/js/src/models/product-type-maintenance-code-mirror.bundle.js",
                        "~/js/src/models/product-type-maintenance.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/basket-status").Include(
                        "~/js/src/models/basket-status.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/translations").Include(
                    "~/js/src/models/kendo-mdc-drop-down-list-factory.js",
                    "~/js/src/models/translations-base.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-delivery").Include(
                        "~/js/src/models/product-delivery.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-categories").Include(
                        "~/js/src/models/product-categories.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-tracking").Include(
                        "~/js/src/models/emailer.js",
                        "~/js/src/models/order-tracking.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/ring-fenced-stock").Include(
                        "~/js/src/models/ring-fenced-stock.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/marketing-messages").Include(
                        "~/js/src/models/marketing-messages.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/global").Include(
                        "~/js/src/lib/money/money.js",
                        "~/js/src/lib/moment/moment-with-locales.js",
                        "~/js/src/lib/linq/linq.js",
                        "~/js/src/models/functions.js",
                        "~/js/src/models/extensions.js",
                        "~/js/src/lib/jquery-3.1.1/jquery.signalR.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-returns").Include(
                        "~/js/src/models/address.js",
                        "~/js/src/lib/bootstrap-datetime-picker/bootstrap-datetime-picker.js",
                        "~/js/src/lib/moment/moment-with-locales.js",
                        "~/js/src/lib/intl-tel-input/intl-tel-input.js",
                        "~/js/src/lib/intl-tel-input/utils.js",
                        "~/js/src/models/kendo-mdc-drop-down-list-factory.js",
                        "~/js/src/models/ups-references.js",
                        "~/js/src/models/trade-order-returns.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/documents-preview").Include(
                        "~/js/src/models/emailer.js",
                        "~/js/src/models/kendo-mdc-drop-down-list-factory.js",
                        "~/js/src/models/documents-preview.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/application-groups").Include(
                        "~/js/src/models/kendo-mdc-drop-down-list-factory.js",
                        "~/js/src/models/application-groups.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-invite").Include(
                        "~/js/src/models/emailer.js",
                        "~/js/src/models/kendo-mdc-drop-down-list-factory.js",
                        "~/js/src/models/customer-invite.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/treatment-invoice-approval").Include(
                        "~/js/src/models/kendo-mdc-drop-down-list-factory.js",
                        "~/js/src/models/treatment-invoice-approval.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/paint-invoice-approval").Include(
                        "~/js/src/models/kendo-mdc-drop-down-list-factory.js",
                        "~/js/src/models/paint-invoice-approval.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/furniture-invoice-approval").Include(
                        "~/js/src/models/kendo-mdc-drop-down-list-factory.js",
                        "~/js/src/models/furniture-invoice-approval.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/furniture-maintenance").Include(
                        "~/js/src/models/kendo-mdc-drop-down-list-factory.js",
                        "~/js/src/models/furniture-maintenance.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-ordering-notes").Include(
                        "~/js/src/models/kendo-mdc-drop-down-list-factory.js",
                        "~/js/src/models/customer-ordering-notes.js"
                ));
            bundles.Add(new ScriptBundle("~/bundles/js/order-import").Include(
                        "~/js/src/models/kendo-mdc-drop-down-list-factory.js",
                        "~/js/src/models/order-import.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/generic-forms").Include(
                        "~/js/src/models/generic-form-factory.js",
                        "~/js/src/models/generic-form-field.js",
                        "~/js/src/models/generic-form-panel.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/common-modals").Include(
                        "~/js/src/models/common-modals.js"
                ));

#else

            bundles.Add(new ScriptBundle("~/bundles/js/bootstrap").Include(
                      "~/js/dist/lib/bootstrap-3.3.7/bootstrap-3.3.7.min.js",
                      "~/js/dist/lib/respond/respond.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/bootstrap-5.3.1").Include(
                      "~/js/dist/lib/bootstrap-5.3.1/bootstrap.bundle-5.3.1.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/bootstrap-switch").Include(
                      "~/js/dist/lib/bootstrap-switch/bootstrap-switch.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/kendo").Include(
                      "~/js/dist/lib/kendo/kendo.2018.3.1017.all.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/popper").Include(
                      "~/js/dist/lib/popper/popper.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/knockout").Include(
                      "~/js/dist/lib/knockout/knockout-3.5.0.min.js",
                      "~/js/dist/lib/knockout/knockout-fast-foreach.min.js",
                      "~/js/dist/lib/knockout/knockout-mapping-latest.min.js",
                      "~/js/dist/lib/knockout/knockout-kendo.min.js",
                      "~/js/dist/lib/knockout/knockout-validation.min.js",
                      "~/js/dist/lib/knockout/knockout-extensions.min.js",
                      "~/js/dist/lib/knockout/knockout-infinite-scroll.min.js",
                      "~/js/dist/lib/knockout/knockout-sortable.min.js",
                      "~/js/dist/lib/owl-carousel/owl-carousel.min.js",
                      "~/js/dist/lib/tiny-slider/tiny-slider.min.js",
                      "~/js/dist/lib/knockout/knockout-owl-carousel.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/jquery").Include(
                        "~/js/dist/lib/jquery-3.1.1/jquery-3.1.1.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/jqueryui").Include(
                        "~/js/dist/lib/jquery-ui-1.12.1/jquery-ui-1.12.1.min.js",
                        "~/js/dist/lib/jquery-ui-1.12.1/jquery-ui-extensions.min.js",
                        "~/js/dist/lib/jquery-ui-1.12.1/jquery-ui-touch-punch.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/jqueryval").Include(
                        "~/js/dist/lib/jquery-3.1.1/jquery.validate.min.js",
                        "~/js/dist/lib/jquery-3.1.1/jquery.validate.unobtrusive.min.js",
                        "~/js/dist/lib/jquery-3.1.1/jquery.validate-vsdoc.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/kendo-modernizr").Include(
                        "~/js/dist/lib/kendo/kendo.modernizr.custom.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/js/components").Include(
                    "~/js/dist/models/kendo-mdc-drop-down-list-factory.min.js",
                    "~/js/dist/models/trade-account-selector.min.js",
                    "~/js/dist/models/product-search.min.js",
                    "~/js/dist/models/order-search.min.js",
                    "~/js/dist/models/order-products.min.js",
                    "~/js/dist/models/order-products-drilldown.min.js",
                    "~/js/dist/models/care-search.min.js",
                    "~/js/dist/models/task-search.min.js",
                    "~/js/dist/models/visit-search.min.js",
                    "~/js/dist/models/visit-booker.min.js",
                    "~/js/dist/models/member-search.min.js",
                    "~/js/dist/models/recently-used-members.min.js",
                    "~/js/dist/models/address.min.js",
                    "~/js/dist/lib/jquery-3.1.1/jquery.twbsPagination.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/datetime-picker").Include(
                    "~/js/dist/lib/bootstrap-datetime-picker/bootstrap-datetime-picker.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/tempus-dominus").Include(
                    "~/js/dist/lib/tempus-dominus/tempus-dominus.min.js",
                    "~/js/dist/lib/tempus-dominus/custom-date-format.min.js",
                    "~/js/dist/lib/tempus-dominus/tempus-dominus-knockout.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/intl-tel").Include(
                    "~/js/dist/lib/intl-tel-input/intl-tel-input.min.js",
                    "~/js/dist/lib/intl-tel-input/utils.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/address").Include(
                    "~/js/dist/models/address.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/trade-account-selector").Include(
                    "~/js/dist/models/trade-account-selector.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-search").Include(
                        "~/js/dist/models/product-search.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-search").Include(
                        "~/js/dist/lib/jquery-3.1.1/jquery.twbsPagination.min.js",
                        "~/js/dist/lib/bootstrap-datetime-picker/bootstrap-datetime-picker.min.js",
                        "~/js/dist/models/order-search.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/care-search").Include(
                      "~/js/dist/models/care-search.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/task-search").Include(
                      "~/js/dist/models/task-search.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-maintenance").Include(
                      "~/js/dist/models/customer-maintenance.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/visit-search").Include(
                        "~/js/dist/lib/jquery-3.1.1/jquery.twbsPagination.min.js",
                        "~/js/dist/lib/bootstrap-datetime-picker/bootstrap-datetime-picker.min.js",
                        "~/js/dist/models/visit-search.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/member-search").Include(
                        "~/js/dist/models/recently-used-members.min.js",
                        "~/js/dist/models/member-search.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/visit-booker").Include(
                        "~/js/dist/models/visit-booker.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/lead-search").Include(
                        "~/js/dist/lib/jquery-3.1.1/jquery.twbsPagination.min.js",
                        "~/js/dist/lib/bootstrap-datetime-picker/bootstrap-datetime-picker.min.js",
                        "~/js/dist/models/lead-search.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/download-products").Include(
                        "~/js/dist/models/download-products.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/projects-dashboard").Include(
                        "~/js/dist/models/projects-dashboard.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/tasks-dashboard").Include(
                        "~/js/dist/models/tasks-dashboard.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-tagging").Include(
                        "~/js/dist/models/customer-tagging.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/sales-statistics").Include(
                        "~/js/dist/models/sales-statistics.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/gdpr-survey").Include(
                        "~/js/dist/models/gdpr-survey.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/home").Include(
                        "~/js/dist/models/home.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/sample-request").Include(
                        "~/js/dist/models/sample-request.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/sample-request-dg").Include(
                        "~/js/dist/models/sample-request-dg.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/alternative-products").Include(
                        "~/js/dist/models/alternative-products.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/trade-order-enquiry").Include(
                        "~/js/dist/models/trade-order-enquiry.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-enquiry").Include(
                      "~/js/dist/models/business-potential.min.js",
                      "~/js/dist/models/customer-enquiry.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/pricing-enquiry").Include(
                    "~/js/dist/models/price-checker.min.js",
                      "~/js/dist/models/pricing-enquiry.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-visit").Include(
                        "~/js/dist/models/customer-visit.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-care").Include(
                        "~/js/dist/models/customer-care.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/lead-enquiry").Include(
                    "~/js/dist/models/lead-enquiry.min.js",
                    "~/js/dist/models/price-checker.min.js",
                    "~/js/dist/lib/jquery-3.1.1/jquery.twbsPagination.min.js",
                    "~/js/dist/lib/bootstrap-datetime-picker/bootstrap-datetime-picker.min.js",
                    "~/js/dist/models/address.min.js",
                    "~/js/dist/models/trade-account-contact.min.js",
                    "~/js/dist/models/business-potential.min.js",
                    "~/js/dist/lib/google-maps/google-maps-marker-clusterer.min.js",
                    "~/js/dist/models/lead-search.min.js",
                    "~/js/dist/models/visit-search.min.js",
                    "~/js/dist/models/visit-booker.min.js",
                    "~/js/dist/models/member-search.min.js",
                    "~/js/dist/models/care-search.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-products-base").Include(
                        "~/js/dist/models/order-products-base.min.js",
                        "~/js/dist/models/basket-status.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-maintenance").Include(
                        "~/js/dist/models/product-maintenance.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/treatment-maintenance").Include(
                        "~/js/dist/models/treatment-maintenance.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-type-maintenance").Include(
                        "~/js/dist/models/product-type-maintenance-code-mirror.bundle.min.js",
                        "~/js/dist/models/product-type-maintenance.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/basket-status").Include(
                        "~/js/dist/models/basket-status.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/translations").Include(
                    "~/js/dist/models/kendo-mdc-drop-down-list-factory.min.js",
                    "~/js/dist/models/translations-base.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-delivery").Include(
                        "~/js/dist/models/product-delivery.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-categories").Include(
                        "~/js/dist/models/product-categories.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-tracking").Include(
                        "~/js/dist/models/emailer.min.js",
                        "~/js/dist/models/order-tracking.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/ring-fenced-stock").Include(
                        "~/js/dist/models/ring-fenced-stock.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/marketing-messages").Include(
                        "~/js/dist/models/marketing-messages.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/global").Include(
                        "~/js/dist/lib/money/money.min.js",
                        "~/js/dist/lib/moment/moment-with-locales.min.js",
                        "~/js/dist/lib/linq/linq.min.js",
                        "~/js/dist/models/functions.min.js",
                        "~/js/dist/models/extensions.min.js",
                        "~/js/dist/lib/jquery-3.1.1/jquery.signalR.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-returns").Include(
                        "~/js/dist/models/address.min.js",
                        "~/js/dist/lib/bootstrap-datetime-picker/bootstrap-datetime-picker.min.js",
                        "~/js/dist/lib/moment/moment-with-locales.min.js",
                        "~/js/dist/lib/intl-tel-input/intl-tel-input.min.js",
                        "~/js/dist/lib/intl-tel-input/utils.min.js",
                        "~/js/dist/models/kendo-mdc-drop-down-list-factory.min.js",
                        "~/js/dist/models/ups-references.min.js",
                        "~/js/dist/models/trade-order-returns.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/documents-preview").Include(
                        "~/js/dist/models/emailer.min.js",
                        "~/js/dist/models/kendo-mdc-drop-down-list-factory.min.js",
                        "~/js/dist/models/documents-preview.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/application-groups").Include(
                        "~/js/dist/models/kendo-mdc-drop-down-list-factory.min.js",
                        "~/js/dist/models/application-groups.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-invite").Include(
                        "~/js/dist/models/emailer.min.js",
                        "~/js/dist/models/kendo-mdc-drop-down-list-factory.min.js",
                        "~/js/dist/models/customer-invite.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/treatment-invoice-approval").Include(
                        "~/js/dist/models/kendo-mdc-drop-down-list-factory.min.js",
                        "~/js/dist/models/treatment-invoice-approval.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/paint-invoice-approval").Include(
                        "~/js/dist/models/kendo-mdc-drop-down-list-factory.min.js",
                        "~/js/dist/models/paint-invoice-approval.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/furniture-invoice-approval").Include(
                        "~/js/dist/models/kendo-mdc-drop-down-list-factory.min.js",
                        "~/js/dist/models/furniture-invoice-approval.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/furniture-maintenance").Include(
                        "~/js/dist/models/kendo-mdc-drop-down-list-factory.min.js",
                        "~/js/dist/models/furniture-maintenance.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-ordering-notes").Include(
                        "~/js/dist/models/kendo-mdc-drop-down-list-factory.min.js",
                        "~/js/dist/models/customer-ordering-notes.min.js"
                ));
            bundles.Add(new ScriptBundle("~/bundles/js/order-import").Include(
                        "~/js/dist/models/kendo-mdc-drop-down-list-factory.min.js",
                        "~/js/dist/models/order-import.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/generic-forms").Include(
                        "~/js/dist/models/generic-form-factory.min.js",
                        "~/js/dist/models/generic-form-field.min.js",
                        "~/js/dist/models/generic-form-panel.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/common-modals").Include(
                        "~/js/dist/models/common-modals.min.js"
                ));

#endif

            foreach (var b in BundleTable.Bundles)
            {
                b.Transforms.Clear();
            }

#if DEBUG
            BundleTable.EnableOptimizations = false;
#else
            BundleTable.EnableOptimizations = true;
#endif

        }



        // adapted from: https://stackoverflow.com/questions/12577108/asp-net-mvc4-bundling-with-twitter-bootstrap#answer-17702773
        // with thanks
        public class SourceMappingURLTransform : IItemTransform
        {
            private static string ConvertUrlsToAbsolute(string baseUrl, string content)
            {
                if (string.IsNullOrWhiteSpace(content))
                {
                    return content;
                }

                var regex = new Regex("# sourceMappingURL\\=(?<path>.+\\.map)");

                return regex.Replace(content, (match) =>
                {
                    return $"/*# sourceMappingURL={HttpContext.Current.Request.Url.Scheme}://{HttpContext.Current.Request.Url.Authority}{RebaseUrlToAbsolute(baseUrl, match.Groups["path"].Value)} */";
                });
            }

            public string Process(string includedVirtualPath, string input)
            {
                if (includedVirtualPath == null)
                {
                    throw new ArgumentNullException("includedVirtualPath");
                }
                var directory = VirtualPathUtility.GetDirectory(includedVirtualPath);
                return ConvertUrlsToAbsolute(directory, input);
            }

            private static string RebaseUrlToAbsolute(string baseUrl, string url)
            {
                if (string.IsNullOrWhiteSpace(url) || string.IsNullOrWhiteSpace(baseUrl) || url.StartsWith("/", StringComparison.OrdinalIgnoreCase))
                {
                    return url;
                }
                if (!baseUrl.EndsWith("/", StringComparison.OrdinalIgnoreCase))
                {
                    baseUrl = string.Concat(baseUrl, "/");
                }
                return VirtualPathUtility.ToAbsolute(string.Concat(baseUrl, url));
            }
        }

        public class CustomCssRewriteUrlTransform : IItemTransform
        {
            public CustomCssRewriteUrlTransform()
            {
            }

            internal static string RebaseUrlToAbsolute(string baseUrl, string url)
            {
                if (string.IsNullOrWhiteSpace(url) || string.IsNullOrWhiteSpace(baseUrl) || url.StartsWith("/", StringComparison.OrdinalIgnoreCase))
                {
                    return url;
                }

                if (!baseUrl.EndsWith("/", StringComparison.OrdinalIgnoreCase))
                {
                    baseUrl += "/";
                }

                return VirtualPathUtility.ToAbsolute(baseUrl + url);
            }

            internal static string ConvertUrlsToAbsolute(string baseUrl, string content)
            {
                if (string.IsNullOrWhiteSpace(content))
                {
                    return content;
                }

                Regex regex = new Regex("url\\(['\"]?(?<url>[^(?!.*\"?data)][^)]+?)['\"]?\\)");
                return regex.Replace(content, (Match match) => "url(" + RebaseUrlToAbsolute(baseUrl, match.Groups["url"].Value) + ")");
            }

            public string Process(string includedVirtualPath, string input)
            {
                if (includedVirtualPath == null)
                {
                    throw new ArgumentNullException("includedVirtualPath");
                }

                string directory = VirtualPathUtility.GetDirectory(includedVirtualPath.Substring(1));
                return ConvertUrlsToAbsolute(directory, input);
            }
        }
    }
}
