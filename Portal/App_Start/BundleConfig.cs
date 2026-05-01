using System.Text.RegularExpressions;
using System;
using System.Web;
using System.Web.Optimization;
using System.Linq;
using System.Web.UI.WebControls;
using System.Collections.Generic;

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
            var cssPrefix = "~/css/dist";
            var cssSuffix = ".css";

            var jsPrefix = "~/js/src";
            var jsSuffix = ".js";
#else
            var cssPrefix = "~/css/dist";
            var cssSuffix = ".min.css";

            var jsPrefix = "~/js/dist";
            var jsSuffix = ".min.js";
#endif

            bundles.Add(new StyleBundle("~/bundles/css/components").Include(
                    $"{cssPrefix}/lib/tiny-slider/tiny-slider{cssSuffix}",
                    $"{cssPrefix}/models/order-search{cssSuffix}",
                    $"{cssPrefix}/models/order-products/order-products-a{cssSuffix}",
                    $"{cssPrefix}/models/order-products/order-products-b{cssSuffix}",
                    $"{cssPrefix}/models/order-products/order-products-c{cssSuffix}",
                    $"{cssPrefix}/models/order-products/order-products-d{cssSuffix}",
                    $"{cssPrefix}/models/order-products/order-products-e{cssSuffix}",
                    $"{cssPrefix}/models/stock-viewer{cssSuffix}",
                    $"{cssPrefix}/models/care-search{cssSuffix}",
                    $"{cssPrefix}/models/task-search{cssSuffix}",
                    $"{cssPrefix}/models/visit-search{cssSuffix}",
                    $"{cssPrefix}/models/visit-booker{cssSuffix}",
                    $"{cssPrefix}/models/member-search{cssSuffix}",
                    $"{cssPrefix}/models/recently-used-members{cssSuffix}",
                    $"{cssPrefix}/models/business-potential{cssSuffix}",
                    $"{cssPrefix}/models/slicer-component{cssSuffix}",
                    $"{cssPrefix}/lib/owl-carousel/owl.carousel{cssSuffix}",
                    $"{cssPrefix}/lib/owl-carousel/owl.theme.default{cssSuffix}"
                ).Include($"{cssPrefix}/lib/intl-tel-input/intl-tel-input{cssSuffix}", new CssRewriteUrlTransform()));

            bundles.Add(new StyleBundle("~/bundles/css/mdc-custom").Include(
                      $"{cssPrefix}/lib/mdc/mdc-custom{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/order-search").Include(
                      $"{cssPrefix}/models/order-search{cssSuffix}"
                ));


            bundles.Add(new StyleBundle("~/bundles/css/care-search").Include(
                      $"{cssPrefix}/models/care-search{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/task-search").Include(
                      $"{cssPrefix}/models/task-search{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/visit-search").Include(
                      $"{cssPrefix}/models/visit-search{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/member-search").Include(
                        $"{cssPrefix}/models/recently-used-members{cssSuffix}",
                        $"{cssPrefix}/models/member-search{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/visit-booker").Include(
                        $"{cssPrefix}/models/visit-booker{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/lead-search").Include(
                        $"{cssPrefix}/models/lead-search{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/download-products").Include(
                        $"{cssPrefix}/models/download-products{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/projects-dashboard").Include(
                        $"{cssPrefix}/models/projects-dashboard{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/tasks-dashboard").Include(
                        $"{cssPrefix}/models/tasks-dashboard{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-tagging").Include(
                        $"{cssPrefix}/models/customer-tagging{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/sales-statistics").Include(
                        $"{cssPrefix}/models/sales-statistics{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/gdpr-survey").Include(
                        $"{cssPrefix}/models/gdpr-survey{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/sample-request-dg").Include(
                      $"{cssPrefix}/models/sample-request-dg{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/sample-request").Include(
                      $"{cssPrefix}/models/sample-request{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/alternative-products").Include(
                      $"{cssPrefix}/models/alternative-products{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-enquiry").Include(
                      $"{cssPrefix}/models/customer-enquiry{cssSuffix}"
                ));


            bundles.Add(new StyleBundle("~/bundles/css/pricing-enquiry").Include(
                      $"{cssPrefix}/models/pricing-enquiry{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-visit").Include(
                        $"{cssPrefix}/models/customer-visit{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-care").Include(
                        $"{cssPrefix}/models/customer-care{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/lead-enquiry").Include(
                        $"{cssPrefix}/models/price-checker{cssSuffix}",
                        $"{cssPrefix}/models/visit-search{cssSuffix}",
                        $"{cssPrefix}/models/visit-booker{cssSuffix}",
                        $"{cssPrefix}/models/member-search{cssSuffix}",
                        $"{cssPrefix}/models/lead-search{cssSuffix}",
                        $"{cssPrefix}/models/care-search{cssSuffix}",
                        $"{cssPrefix}/models/lead-enquiry{cssSuffix}",
                        $"{cssPrefix}/models/trade-account-creation-email-maintenance{cssSuffix}"
                ).Include($"{cssPrefix}/lib/intl-tel-input/intl-tel-input{cssSuffix}", new CssRewriteUrlTransform()));

            bundles.Add(new StyleBundle("~/bundles/css/order-products").Include(
                        $"{cssPrefix}/models/order-products/order-products-a{cssSuffix}",
                        $"{cssPrefix}/models/order-products/order-products-b{cssSuffix}",
                        $"{cssPrefix}/models/order-products/order-products-c{cssSuffix}",
                        $"{cssPrefix}/models/order-products/order-products-d{cssSuffix}",
                        $"{cssPrefix}/models/order-products/order-products-e{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/product-maintenance").Include(
                        $"{cssPrefix}/models/product-maintenance{cssSuffix}",
                        $"{cssPrefix}/models/product-maintenance-treatments{cssSuffix}",
                        $"{cssPrefix}/models/product-maintenance-products{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/product-type-maintenance").Include(
                        $"{cssPrefix}/lib/codemirror/codemirror{cssSuffix}",
                        $"{cssPrefix}/models/product-type-maintenance{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/basket-status").Include(
                        $"{cssPrefix}/models/basket-status{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/product-delivery").Include(
                        $"{cssPrefix}/models/product-delivery{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/product-categories").Include(
                        $"{cssPrefix}/models/product-categories{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/order-tracking").Include(
                        $"{cssPrefix}/models/order-tracking{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/ring-fenced-stock").Include(
                        $"{cssPrefix}/models/ring-fenced-stock{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/translations").Include(
                        $"{cssPrefix}/models/translations/translations-dashboard{cssSuffix}",
                        $"{cssPrefix}/models/translations/translations{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/marketing-messages").Include(
                        $"{cssPrefix}/models/marketing-messages{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/marketing-budget").Include(
                        $"{cssPrefix}/models/marketing-budget{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/bare").Include(
                      $"{cssPrefix}/lib/jquery-ui/jquery-ui{cssSuffix}",
                      $"{cssPrefix}/lib/bootstrap-3.3.7/bootstrap-3.3.7{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/master").Include(
                        $"{cssPrefix}/lib/jquery-ui/jquery-ui{cssSuffix}",
                        $"{cssPrefix}/lib/bootstrap-3.3.7/bootstrap-3.3.7{cssSuffix}",
                        $"{cssPrefix}/lib/bootstrap-switch/bootstrap-switch{cssSuffix}",
                        $"{cssPrefix}/models/site{cssSuffix}",
                        $"{cssPrefix}/models/css-shake{cssSuffix}"
                ).Include($"{cssPrefix}/lib/bootstrap-icons/bootstrap-icons{cssSuffix}", new CssRewriteUrlTransform())
                 .Include($"{cssPrefix}/fonts/fonts{cssSuffix}", new CssRewriteUrlTransform()));

            bundles.Add(new StyleBundle("~/bundles/css/master-5.3.1").Include(
                        $"{cssPrefix}/lib/jquery-ui/jquery-ui{cssSuffix}",
                        $"{cssPrefix}/lib/bootstrap-5.3.1/scss/bootstrap-5.3.1{cssSuffix}",
                        $"{cssPrefix}/lib/bootstrap-switch/bootstrap-switch{cssSuffix}",
                        $"{cssPrefix}/models/site{cssSuffix}",
                        $"{cssPrefix}/models/site-new{cssSuffix}",
                        $"{cssPrefix}/models/css-shake{cssSuffix}"
                ).Include($"{cssPrefix}/lib/bootstrap-icons/bootstrap-icons{cssSuffix}", new CssRewriteUrlTransform())
                 .Include($"{cssPrefix}/fonts/fonts{cssSuffix}", new CssRewriteUrlTransform()));

            bundles.Add(new StyleBundle("~/bundles/css/kendo-custom").Include(
                        $"{cssPrefix}/lib/kendo/custom/kendo-custom{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/order-returns").Include(
                        $"{cssPrefix}/lib/kendo/custom/kendo-custom{cssSuffix}",
                        $"{cssPrefix}/models/order-returns{cssSuffix}"
                ).Include($"{cssPrefix}/lib/intl-tel-input/intl-tel-input{cssSuffix}", new CssRewriteUrlTransform()));

            bundles.Add(new StyleBundle("~/bundles/css/furniture-maintenance").Include(
                        $"{cssPrefix}/models/furniture-maintenance{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/documents-preview").Include(
                $"{cssPrefix}/lib/tempus-dominus/tempus-dominus{cssSuffix}",
                        $"{cssPrefix}/models/documents-preview{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/application-groups").Include(
                        $"{cssPrefix}/models/application-groups{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-invite").Include(
                        $"{cssPrefix}/models/customer-invite{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/treatment-invoice-approval").Include(
                        $"{cssPrefix}/models/invoice-approval-shared{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/paint-invoice-approval").Include(
                        $"{cssPrefix}/models/invoice-approval-shared{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/furniture-invoice-approval").Include(
                        $"{cssPrefix}/models/invoice-approval-shared{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-ordering-notes").Include(
                        $"{cssPrefix}/models/customer-ordering-notes{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/order-import").Include(
                        $"{cssPrefix}/models/order-import{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/generic-forms").Include(
                        $"{cssPrefix}/models/generic-forms{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/tempus-dominus").Include(
                        $"{cssPrefix}/lib/tempus-dominus/tempus-dominus{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/customer-maintenance").Include(
                      $"{cssPrefix}/models/common{cssSuffix}",
                      $"{cssPrefix}/models/customer-maintenance{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/paint-mixing").Include(
                        $"{cssPrefix}/models/paint-mixing{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/trade-account-creation-email-maintenance").Include(
                        $"{cssPrefix}/models/trade-account-creation-email-maintenance{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/retail-store-members").Include(
                        $"{cssPrefix}/models/retail-store-members{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/press-contacts").Include(
                        $"{cssPrefix}/models/press-contacts{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/stock-management").Include(
                        $"{cssPrefix}/models/stock-management{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/fenwick-invoicing").Include(
                        $"{cssPrefix}/models/fenwick-invoicing{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/range-management").Include(
                $"{cssPrefix}/models/full-width-app{cssSuffix}",
                $"{cssPrefix}/models/range-management{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/contract-pricing").Include(
                        $"{cssPrefix}/mopdels/shared/virtual-scrolling-deferred-data{cssSuffix}",
                        $"{cssPrefix}/lib/tempus-dominus/tempus-dominus{cssSuffix}",
                        $"{cssPrefix}/models/contract-pricing{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/virtual-scrolling-deferred-data").Include(
                        $"{cssPrefix}/models/shared/virtual-scrolling-deferred-data{cssSuffix}"
                ));

            bundles.Add(new StyleBundle("~/bundles/css/order-book").Include(
                $"{cssPrefix}/models/full-width-app{cssSuffix}",
                $"{cssPrefix}/lib/tempus-dominus/tempus-dominus{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-user-defined-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-date-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-pre-defined-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-sales{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-orders{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/order-book-detail").Include(
                $"{cssPrefix}/mopdels/shared/virtual-scrolling-deferred-data{cssSuffix}",
                $"{cssPrefix}/models/full-width-app{cssSuffix}",
                $"{cssPrefix}/lib/tempus-dominus/tempus-dominus{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-user-defined-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-date-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-pre-defined-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-sales{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-orders{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-advanced-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-detail{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/order-book-reallocate-stock").Include(
                $"{cssPrefix}/mopdels/shared/virtual-scrolling-deferred-data{cssSuffix}",
                $"{cssPrefix}/models/full-width-app{cssSuffix}",
                $"{cssPrefix}/lib/tempus-dominus/tempus-dominus{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-user-defined-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-date-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-pre-defined-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-sales{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-orders{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-advanced-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-reallocate-stock{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/order-book-back-orders-without-purchase-orders").Include(
                $"{cssPrefix}/mopdels/shared/virtual-scrolling-deferred-data{cssSuffix}",
                $"{cssPrefix}/models/full-width-app{cssSuffix}",
                $"{cssPrefix}/lib/tempus-dominus/tempus-dominus{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-user-defined-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-date-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-pre-defined-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-sales{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-orders{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-advanced-filters{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book{cssSuffix}",
                $"{cssPrefix}/models/order-book/order-book-back-orders-without-purchase-orders{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/parcel-calculator").Include(
                $"{cssPrefix}/models/parcel-calculator{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/pattern-books").Include(
                $"{cssPrefix}/lib/tempus-dominus/tempus-dominus{cssSuffix}",
                $"{cssPrefix}/models/pattern-books{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/gift-vouchers").Include(
                $"{cssPrefix}/lib/tempus-dominus/tempus-dominus{cssSuffix}",
                $"{cssPrefix}/models/gift-vouchers{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/invoice-booking").Include(
                $"{cssPrefix}/lib/tempus-dominus/tempus-dominus{cssSuffix}",
                $"{cssPrefix}/models/invoice-booking{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/invoice-booking-email-viewer").Include(
                $"{cssPrefix}/models/invoice-booking-email-viewer{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/email-contacts").Include(
                $"{cssPrefix}/lib/tempus-dominus/tempus-dominus{cssSuffix}",
                $"{cssPrefix}/models/email-contacts{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/marylebone-boxing").Include(
                $"{cssPrefix}/models/marylebone-boxing{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/neiman-marcus-order-status").Include(
                $"{cssPrefix}/models/neiman-marcus/neiman-marcus-order-status{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/full-width-app").Include(
                $"{cssPrefix}/models/full-width-app{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/advertiser-maintenance").Include(
                $"{cssPrefix}/models/advertiser-maintenance{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/documents-sent-report").Include(
                    $"{cssPrefix}/models/documents-sent-report{cssSuffix}"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/credit-control").Include(
                    $"{cssPrefix}/models/credit-control/credit-control{cssSuffix}",
                    $"{cssPrefix}/models/credit-control/credit-control-sidebar{cssSuffix}",
                    $"{cssPrefix}/models/credit-control/credit-control-payments{cssSuffix}",
                    $"{cssPrefix}/models/credit-control/credit-control-performance{cssSuffix}",
					$"{cssPrefix}/models/credit-control/credit-control-order-release{cssSuffix}",
					$"{cssPrefix}/models/credit-control/credit-control-close-brothers{cssSuffix}",
					$"{cssPrefix}/models/credit-control/credit-control-allocate-holding-account-cash{cssSuffix}",
					$"{cssPrefix}/models/credit-control/credit-control-virtual-scroller{cssSuffix}",
					$"{cssPrefix}/models/credit-control/credit-control-sales-ledger{cssSuffix}",
					$"{cssPrefix}/models/credit-control/credit-control-manage-ledger{cssSuffix}",
					$"{cssPrefix}/models/trade-account-contacts-widener{cssSuffix}"
			));

			bundles.Add(new StyleBundle("~/bundles/css/trade-account-contacts").Include(
					$"{cssPrefix}/models/trade-account-contacts{cssSuffix}"
			));

			bundles.Add(new StyleBundle("~/bundles/css/trade-account-contacts-widener").Include(
					$"{cssPrefix}/models/trade-account-contacts-widener{cssSuffix}"
			));

			bundles.Add(new StyleBundle("~/bundles/css/supplier-payments").Include(
                    $"{cssPrefix}/models/full-width-app{cssSuffix}",
                    $"{cssPrefix}/models/suppliers/payments/supplier-payments{cssSuffix}",
                    $"{cssPrefix}/models/suppliers/payments/supplier-payments-sidebar{cssSuffix}",
					$"{cssPrefix}/models/suppliers/payments/supplier-payments-approvals-basket{cssSuffix}"
			));

			bundles.Add(new StyleBundle("~/bundles/css/common-2026").Include(
					$"{cssPrefix}/models/common/common-2026{cssSuffix}"
			));

			bundles.Add(new StyleBundle("~/bundles/css/bank-accounts").Include(
					$"{cssPrefix}/models/full-width-app{cssSuffix}",
					$"{cssPrefix}/models/accounts/banks/bank-accounts{cssSuffix}"
			));

			bundles.Add(new StyleBundle("~/bundles/css/daily-banking-statistics").Include(
					$"{cssPrefix}/models/full-width-app{cssSuffix}",
					$"{cssPrefix}/models/accounts/banks/daily-banking-statistics{cssSuffix}"
			));

			//  
			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			//
			// Scripts
			//
			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			//

			bundles.Add(new ScriptBundle("~/bundles/js/bootstrap").Include(
                      $"{jsPrefix}/lib/bootstrap-3.3.7/bootstrap-3.3.7{jsSuffix}",
                      $"{jsPrefix}/lib/respond/respond{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/bootstrap-5.3.1").Include(
                      $"{jsPrefix}/lib/bootstrap-5.3.1/bootstrap.bundle-5.3.1{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/bootstrap-switch").Include(
                      $"{jsPrefix}/lib/bootstrap-switch/bootstrap-switch{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/kendo").Include(
                      $"{jsPrefix}/lib/kendo/kendo.2018.3.1017.all{jsSuffix}"
                ));

			bundles.Add(new ScriptBundle("~/bundles/js/kendo-2023").Include(
					  $"{jsPrefix}/lib/kendo/kendo.2023.1.314.all{jsSuffix}"
				));

			bundles.Add(new ScriptBundle("~/bundles/js/telerik-license").Include(
					  $"{jsPrefix}/lib/kendo/telerik-license-2025{jsSuffix}"
				));

			bundles.Add(new ScriptBundle("~/bundles/js/popper").Include(
                      $"{jsPrefix}/lib/popper-2.11.6/popper-2.11.6{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/knockout").Include(
                      $"{jsPrefix}/lib/knockout/knockout-3.5.0{jsSuffix}",
                      $"{jsPrefix}/lib/knockout/knockout-fast-foreach{jsSuffix}",
                      $"{jsPrefix}/lib/knockout/knockout-mapping-latest{jsSuffix}",
                      $"{jsPrefix}/lib/knockout/knockout-kendo{jsSuffix}",
                      $"{jsPrefix}/lib/knockout/knockout-validation{jsSuffix}",
                      $"{jsPrefix}/lib/knockout/knockout-extensions{jsSuffix}",
                      $"{jsPrefix}/lib/knockout/knockout-infinite-scroll{jsSuffix}",
                      $"{jsPrefix}/lib/knockout/knockout-sortable{jsSuffix}",
                      $"{jsPrefix}/lib/owl-carousel/owl-carousel{jsSuffix}",
                      $"{jsPrefix}/lib/tiny-slider/tiny-slider{jsSuffix}",
                      $"{jsPrefix}/lib/knockout/knockout-owl-carousel{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/jquery").Include(
                        $"{jsPrefix}/lib/jquery-3.1.1/jquery-3.1.1{jsSuffix}",
                        "~/js/dist/models/extensions{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/jqueryui").Include(
                        $"{jsPrefix}/lib/jquery-ui-1.12.1/jquery-ui-1.12.1{jsSuffix}",
                        $"{jsPrefix}/lib/jquery-ui-1.12.1/jquery-ui-extensions{jsSuffix}",
                        $"{jsPrefix}/lib/jquery-ui-1.12.1/jquery-ui-touch-punch{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/jqueryval").Include(
                        $"{jsPrefix}/lib/jquery-3.1.1/jquery.validate{jsSuffix}",
                        $"{jsPrefix}/lib/jquery-3.1.1/jquery.validate.unobtrusive{jsSuffix}"
                        //$"{jsPrefix}/lib/jquery-3.1.1/jquery.validate-vsdoc{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/kendo-modernizr").Include(
                        $"{jsPrefix}/lib/kendo/kendo.modernizr.custom{jsSuffix}"));

            bundles.Add(new ScriptBundle("~/bundles/js/components").Include(
                    $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                    $"{jsPrefix}/models/others/trade-account-selector{jsSuffix}",
                    $"{jsPrefix}/models/others/product-search{jsSuffix}",
                    $"{jsPrefix}/models/others/order-search{jsSuffix}",
                    $"{jsPrefix}/models/others/order-products-basket-splitter{jsSuffix}",
                    $"{jsPrefix}/models/others/stock-check-request{jsSuffix}",
                    $"{jsPrefix}/models/others/order-products{jsSuffix}",
                    $"{jsPrefix}/models/others/order-products-drilldown{jsSuffix}",
                    $"{jsPrefix}/models/others/order-products-member-basket-fetcher{jsSuffix}",
                    $"{jsPrefix}/models/others/care-search{jsSuffix}",
                    $"{jsPrefix}/models/others/task-search{jsSuffix}",
                    $"{jsPrefix}/models/others/visit-search{jsSuffix}",
                    $"{jsPrefix}/models/others/visit-booker{jsSuffix}",
                    $"{jsPrefix}/models/others/member-search{jsSuffix}",
                    $"{jsPrefix}/models/others/recently-used-members{jsSuffix}",
                    $"{jsPrefix}/models/others/address{jsSuffix}",
                    $"{jsPrefix}/lib/jquery-3.1.1/jquery.twbsPagination{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/datetime-picker").Include(
                    $"{jsPrefix}/lib/bootstrap-datetime-picker/bootstrap-datetime-picker{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/tempus-dominus").Include(
                    $"{jsPrefix}/lib/popper-2.11.6/popper-2.11.6{jsSuffix}",
                    $"{jsPrefix}/lib/tempus-dominus/tempus-dominus{jsSuffix}",
                    $"{jsPrefix}/lib/tempus-dominus/custom-date-format{jsSuffix}",
                    $"{jsPrefix}/lib/tempus-dominus/tempus-dominus-knockout{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/intl-tel").Include(
                    $"{jsPrefix}/lib/intl-tel-input/intl-tel-input{jsSuffix}",
                    $"{jsPrefix}/lib/intl-tel-input/utils{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/address").Include(
                    $"{jsPrefix}/models/others/address{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/trade-account-selector").Include(
                    $"{jsPrefix}/models/others/trade-account-selector{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-search").Include(
                        $"{jsPrefix}/models/others/product-search{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-search").Include(
                        $"{jsPrefix}/lib/jquery-3.1.1/jquery.twbsPagination{jsSuffix}",
                        $"{jsPrefix}/lib/bootstrap-datetime-picker/bootstrap-datetime-picker{jsSuffix}",
                        $"{jsPrefix}/models/others/order-search{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/care-search").Include(
                      $"{jsPrefix}/models/others/care-search{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/task-search").Include(
                      $"{jsPrefix}/models/others/task-search{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-maintenance").Include(
                      $"{jsPrefix}/models/others/customer-maintenance{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/visit-search").Include(
                        $"{jsPrefix}/lib/jquery-3.1.1/jquery.twbsPagination{jsSuffix}",
                        $"{jsPrefix}/lib/bootstrap-datetime-picker/bootstrap-datetime-picker{jsSuffix}",
                        $"{jsPrefix}/models/others/visit-search{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/member-search").Include(
                        $"{jsPrefix}/models/others/recently-used-members{jsSuffix}",
                        $"{jsPrefix}/models/others/member-search{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/visit-booker").Include(
                        $"{jsPrefix}/models/others/visit-booker{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/lead-search").Include(
                        $"{jsPrefix}/lib/jquery-3.1.1/jquery.twbsPagination{jsSuffix}",
                        $"{jsPrefix}/lib/bootstrap-datetime-picker/bootstrap-datetime-picker{jsSuffix}",
                        $"{jsPrefix}/models/others/lead-search{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/download-products").Include(
                        $"{jsPrefix}/models/others/download-products{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/projects-dashboard").Include(
                        $"{jsPrefix}/models/others/projects-dashboard{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/tasks-dashboard").Include(
                        $"{jsPrefix}/models/others/tasks-dashboard{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-tagging").Include(
                        $"{jsPrefix}/models/others/customer-tagging{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/sales-statistics").Include(
                        $"{jsPrefix}/models/others/sales-statistics{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/gdpr-survey").Include(
                        $"{jsPrefix}/models/others/gdpr-survey{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/home").Include(
                        $"{jsPrefix}/models/others/home{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/sample-request").Include(
                        $"{jsPrefix}/models/others/sample-request{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/sample-request-dg").Include(
                        $"{jsPrefix}/models/others/stock-check-request{jsSuffix}",
                        $"{jsPrefix}/models/others/sample-request-dg{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/alternative-products").Include(
                        $"{jsPrefix}/models/others/alternative-products{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/trade-order-enquiry").Include(
                        $"{jsPrefix}/models/others/trade-order-enquiry{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-enquiry").Include(
                      $"{jsPrefix}/models/others/business-potential{jsSuffix}",
                      $"{jsPrefix}/models/others/price-checker{jsSuffix}",
                      $"{jsPrefix}/models/others/customer-enquiry{jsSuffix}"
				));

            bundles.Add(new ScriptBundle("~/bundles/js/pricing-enquiry").Include(
                        $"{jsPrefix}/models/others/price-checker{jsSuffix}",
                      $"{jsPrefix}/models/others/pricing-enquiry{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-visit").Include(
                        $"{jsPrefix}/models/others/customer-visit{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-care").Include(
                        $"{jsPrefix}/models/others/customer-care{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/lead-enquiry").Include(
                    $"{jsPrefix}/models/others/lead-enquiry{jsSuffix}",
                    $"{jsPrefix}/models/others/price-checker{jsSuffix}",
                    $"{jsPrefix}/lib/jquery-3.1.1/jquery.twbsPagination{jsSuffix}",
                    $"{jsPrefix}/lib/bootstrap-datetime-picker/bootstrap-datetime-picker{jsSuffix}",
                    $"{jsPrefix}/models/others/address{jsSuffix}",
                    $"{jsPrefix}/models/others/trade-account-contact{jsSuffix}",
                    $"{jsPrefix}/models/others/business-potential{jsSuffix}",
                    $"{jsPrefix}/lib/google-maps/google-maps-marker-clusterer{jsSuffix}",
                    $"{jsPrefix}/models/others/lead-search{jsSuffix}",
                    $"{jsPrefix}/models/others/visit-search{jsSuffix}",
                    $"{jsPrefix}/models/others/visit-booker{jsSuffix}",
                    $"{jsPrefix}/models/others/member-search{jsSuffix}",
                    $"{jsPrefix}/models/others/care-search{jsSuffix}",
                    $"{jsPrefix}/models/others/trade-account-creation-email-maintenance{jsSuffix}",
					$"{jsPrefix}/models/trade-accounts/trade-account-contact{jsSuffix}"

				));

            bundles.Add(new ScriptBundle("~/bundles/js/order-products-base").Include(
                        $"{jsPrefix}/models/others/order-products-base{jsSuffix}",
                        $"{jsPrefix}/models/others/basket-status{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-maintenance").Include(
                        $"{jsPrefix}/models/others/product-maintenance{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/treatment-maintenance").Include(
                        $"{jsPrefix}/models/others/treatment-maintenance{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-type-maintenance").Include(
                        $"{jsPrefix}/models/others/product-type-maintenance-code-mirror.bundle{jsSuffix}",
                        $"{jsPrefix}/models/others/product-type-maintenance{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/basket-status").Include(
                        $"{jsPrefix}/models/others/basket-status{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/translations").Include(
                    $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                    $"{jsPrefix}/models/translations/translations-dashboard-pod{jsSuffix}",
                    $"{jsPrefix}/models/translations/translations{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-delivery").Include(
                        $"{jsPrefix}/models/others/product-delivery{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/product-categories").Include(
                        $"{jsPrefix}/models/others/product-categories{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-tracking").Include(
                        $"{jsPrefix}/models/others/emailer{jsSuffix}",
                        $"{jsPrefix}/models/others/order-tracking{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/ring-fenced-stock").Include(
                        $"{jsPrefix}/models/others/ring-fenced-stock{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/marketing-messages").Include(
                        $"{jsPrefix}/models/others/marketing-messages{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/marketing-budget").Include(
                        $"{jsPrefix}/models/others/marketing-budget{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/global").Include(
                        $"{jsPrefix}/lib/money/money{jsSuffix}",
                        $"{jsPrefix}/lib/moment/moment-with-locales{jsSuffix}",
                        $"{jsPrefix}/lib/linq/linq{jsSuffix}",
                        $"{jsPrefix}/models/others/functions{jsSuffix}",
                        $"{jsPrefix}/models/others/extensions{jsSuffix}",
                        $"{jsPrefix}/lib/jquery-3.1.1/jquery.signalR{jsSuffix}",
                        $"{jsPrefix}/lib/debounce/debounce{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/global-new").Include(
                        $"{jsPrefix}/lib/money/money{jsSuffix}",
                        $"{jsPrefix}/lib/moment/moment-with-locales{jsSuffix}",
                        $"{jsPrefix}/lib/linq/linq{jsSuffix}",
                        $"{jsPrefix}/models/others/functions-new{jsSuffix}",
                        $"{jsPrefix}/models/others/extensions{jsSuffix}",
                        $"{jsPrefix}/lib/jquery-3.1.1/jquery.signalR{jsSuffix}",
                        $"{jsPrefix}/lib/debounce/debounce{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-returns").Include(
                        $"{jsPrefix}/models/others/address{jsSuffix}",
                        $"{jsPrefix}/lib/bootstrap-datetime-picker/bootstrap-datetime-picker{jsSuffix}",
                        $"{jsPrefix}/lib/moment/moment-with-locales{jsSuffix}",
                        $"{jsPrefix}/lib/intl-tel-input/intl-tel-input{jsSuffix}",
                        $"{jsPrefix}/lib/intl-tel-input/utils{jsSuffix}",
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/ups-references{jsSuffix}",
                        $"{jsPrefix}/models/others/trade-order-returns{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/documents-preview").Include(
                        $"{jsPrefix}/models/others/emailer{jsSuffix}",
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/documents-preview{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/application-groups").Include(
                        $"{jsPrefix}/models/others/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/others/application-groups{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-invite").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/customer-invite{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/treatment-invoice-approval").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/treatment-invoice-approval{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/paint-invoice-approval").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/paint-invoice-approval{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/furniture-invoice-approval").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/furniture-invoice-approval{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/furniture-maintenance").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/furniture-maintenance{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/customer-ordering-notes").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/customer-ordering-notes{jsSuffix}"
                ));
            bundles.Add(new ScriptBundle("~/bundles/js/order-import").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/order-import{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/generic-forms").Include(
                        $"{jsPrefix}/models/others/generic-form-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/generic-form-field{jsSuffix}",
                        $"{jsPrefix}/models/others/generic-form-panel{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/common-modals").Include(
                        $"{jsPrefix}/models/others/common-modals{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/common-modals-old").Include(
                        $"{jsPrefix}/models/others/common-modals-old{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/paint-mixing").Include(
                        $"{jsPrefix}/models/others/paint-mixing{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/notifications").Include(
                        $"{jsPrefix}/models/others/notifications{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/trade-account-creation-email-maintenance").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/emailer{jsSuffix}",
                        $"{jsPrefix}/models/others/trade-account-creation-email-maintenance{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/retail-store-members").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/emailer{jsSuffix}",
                        $"{jsPrefix}/models/others/retail-store-members{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/press-contacts").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/emailer{jsSuffix}",
                        $"{jsPrefix}/models/others/press-contacts{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/stock-management").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/stock-management{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/fenwick-invoicing").Include(
                        $"{jsPrefix}/models/others/fenwick-invoicing{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/range-management").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/range-management{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/contract-pricing").Include(
                        $"{jsPrefix}/models/shared/virtual-scrolling-deferred-data{jsSuffix}",
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/contract-pricing{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/virtual-scrolling-deferred-data").Include(
                        $"{jsPrefix}/models/shared/virtual-scrolling-deferred-data{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/image-download-tasks").Include(
                    $"{jsPrefix}/models/image-download-tasks/controllers/image-download-task-header-controller{jsSuffix}",
                    $"{jsPrefix}/models/image-download-tasks/controllers/image-download-tasks-controller{jsSuffix}",
                    $"{jsPrefix}/models/image-download-tasks/models/image-download-task-model{jsSuffix}",
                    $"{jsPrefix}/models/image-download-tasks/models/image-download-task-progress-model{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-book").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-summary-filter{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-user-defined-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-date-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-pre-defined-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-sales-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-orders-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-main-cell{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-book-detail").Include(
                        $"{jsPrefix}/models/shared/virtual-scrolling-deferred-data{jsSuffix}",
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-advanced-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-summary-filter{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-user-defined-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-date-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-pre-defined-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-sales-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-orders-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-advanced-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-main-cell{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-detail{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-book-reallocate-stock").Include(
                        $"{jsPrefix}/models/shared/virtual-scrolling-deferred-data{jsSuffix}",
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/emailer{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-advanced-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-summary-filter{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-user-defined-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-date-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-pre-defined-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-sales-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-orders-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-advanced-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-main-cell{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-reallocate-stock{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/order-book-back-orders-without-purchase-orders").Include(
                        $"{jsPrefix}/models/shared/virtual-scrolling-deferred-data{jsSuffix}",
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/emailer{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-advanced-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-summary-filter{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-user-defined-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-date-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-pre-defined-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-sales-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-orders-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-advanced-filters{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-main-cell{jsSuffix}",
                        $"{jsPrefix}/models/order-book/order-book-back-orders-without-purchase-orders{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/parcel-calculator").Include(
                        $"{jsPrefix}/models/others/parcel-calculator{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/pattern-books").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/emailer{jsSuffix}",
                        $"{jsPrefix}/models/others/pattern-books{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/gift-vouchers").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/emailer{jsSuffix}",
                        $"{jsPrefix}/models/others/gift-vouchers{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/invoice-booking").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/lib/tiff/tiff{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/controllers/invoice-document-download-task-header-controller{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/controllers/invoice-document-download-tasks-controller{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/models/document-download-task-model{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/models/document-download-task-progress-model{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/invoice-booking-email{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/invoice-booking-email-attachment{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/invoice-booking-email-attachment-supplier-only{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/invoice-booking-email-attachment-invoice{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/invoice-booking-email-attachment-proforma{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/invoice-booking-email-attachment-credit-note{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/invoice-booking-email-attachment-invoice-VAT{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/invoice-booking-email-attachment-invoice-GL{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/invoice-booking-filters{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/invoice-booking-dashboard{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/invoice-booking-document-viewer{jsSuffix}",
                        $"{jsPrefix}/models/invoice-booking/invoice-booking{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/email-contacts").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/email-contacts{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/marylebone-boxing").Include(
                        $"{jsPrefix}/models/others/marylebone-boxing{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/neiman-marcus-order-status").Include(
                        $"{jsPrefix}/models/neiman-marcus/neiman-marcus-order-status{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/advertiser-maintenance").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/emailer{jsSuffix}",
                        $"{jsPrefix}/models/others/pager{jsSuffix}",
                        $"{jsPrefix}/models/others/advertiser-maintenance{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/documents-sent-report").Include(
                        $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
                        $"{jsPrefix}/models/others/emailer{jsSuffix}",
                        $"{jsPrefix}/models/documents/sent-report/documents-sent-report-filters{jsSuffix}",
                        $"{jsPrefix}/models/documents/sent-report/documents-sent-report-dashboard{jsSuffix}",
                        $"{jsPrefix}/models/documents/sent-report/documents-sent-report-viewing-document{jsSuffix}",
                        $"{jsPrefix}/models/documents/sent-report/documents-sent-report{jsSuffix}"
                ));

            bundles.Add(new ScriptBundle("~/bundles/js/credit-control").Include(
                         $"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
					                $"{jsPrefix}/models/others/trade-account-selector{jsSuffix}",
									$"{jsPrefix}/models/others/basket-status{jsSuffix}",
									$"{jsPrefix}/models/others/order-products-member-basket-fetcher{jsSuffix}",
									$"{jsPrefix}/models/shared/virtual-scrolling-deferred-data{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-close-brothers{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-close-brothers-record{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-sales-breakdown{jsSuffix}",
						            $"{jsPrefix}/models/credit-control/credit-control-sales-breakdown-pod{jsSuffix}",
						            $"{jsPrefix}/models/credit-control/credit-control-sales-breakdown-record{jsSuffix}",
						            $"{jsPrefix}/models/credit-control/credit-control-other-breakdown{jsSuffix}",
						            $"{jsPrefix}/models/credit-control/credit-control-other-breakdown-pod{jsSuffix}",
						            $"{jsPrefix}/models/credit-control/credit-control-other-breakdown-record{jsSuffix}",
						            $"{jsPrefix}/models/credit-control/credit-control-claims-breakdown{jsSuffix}",
						            $"{jsPrefix}/models/credit-control/credit-control-claims-breakdown-pod{jsSuffix}",
						            $"{jsPrefix}/models/credit-control/credit-control-claims-breakdown-record{jsSuffix}",
						            $"{jsPrefix}/models/credit-control/credit-control-sales-ledger{jsSuffix}",
                                    $"{jsPrefix}/models/credit-control/credit-control-sales-ledger-pod{jsSuffix}",
                                    $"{jsPrefix}/models/credit-control/credit-control-sales-ledger-record{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-statements{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-statements-pod{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-statements-record{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-orders-breakdown{jsSuffix}",
						            $"{jsPrefix}/models/credit-control/credit-control-orders-breakdown-pod{jsSuffix}",
						            $"{jsPrefix}/models/credit-control/credit-control-orders-breakdown-record{jsSuffix}",
						            $"{jsPrefix}/models/credit-control/credit-control-dashboard-pod{jsSuffix}",
						            $"{jsPrefix}/models/credit-control/credit-control-trade-account-search-result{jsSuffix}",
                                    $"{jsPrefix}/models/credit-control/credit-control-filters{jsSuffix}",
                                    $"{jsPrefix}/models/credit-control/credit-control-performance{jsSuffix}",
                                    $"{jsPrefix}/models/credit-control/credit-control-performance-pod{jsSuffix}",
                                    $"{jsPrefix}/models/credit-control/credit-control-performance-record{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-payments-history{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-payments-history-pod{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-payments-history-record{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-allocate-holding-account-cash{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-allocate-holding-account-cash-record{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-allocate-holding-account-cash-pod{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control-main-grid-column{jsSuffix}",
                                    $"{jsPrefix}/models/credit-control/credit-control-main-grid-row{jsSuffix}",
									$"{jsPrefix}/models/credit-control/credit-control{jsSuffix}"
                            ));

			bundles.Add(new ScriptBundle("~/bundles/js/trade-account-contacts").Include(
						$"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
						$"{jsPrefix}/models/trade-accounts/trade-account{jsSuffix}",
						$"{jsPrefix}/models/trade-accounts/trade-account-contacts-filters{jsSuffix}",
						$"{jsPrefix}/models/trade-accounts/trade-account-contacts{jsSuffix}",
						$"{jsPrefix}/models/trade-accounts/trade-account-contacts-dashboard-pod{jsSuffix}",
						$"{jsPrefix}/models/trade-accounts/trade-account-contact{jsSuffix}"
				));

			bundles.Add(new ScriptBundle("~/bundles/js/accounts/bank-accounts").Include(
						$"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
						$"{jsPrefix}/models/accounts/banks/bank-accounts{jsSuffix}"
				));

			bundles.Add(new ScriptBundle("~/bundles/js/supplier-payments").Include(
						$"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments-approval{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments-approvals{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments-approvals-basket{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments-budgets{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments-dashboard{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments-decision{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments-history-summary{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments-history-detail{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments-filters{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments-request{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments-requests{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments-supplier{jsSuffix}",
						$"{jsPrefix}/models/suppliers/payments/supplier-payments-suppliers{jsSuffix}"
				));

			bundles.Add(new ScriptBundle("~/bundles/js/accounts/daily-banking-statistics").Include(
						$"{jsPrefix}/models/others/kendo-mdc-drop-down-list-factory{jsSuffix}",
						$"{jsPrefix}/models/accounts/banks/daily-banking-statistics-breakdown-item{jsSuffix}",
						$"{jsPrefix}/models/accounts/banks/daily-banking-statistics-breakdown{jsSuffix}",
						$"{jsPrefix}/models/accounts/banks/daily-banking-statistics-row{jsSuffix}",
						$"{jsPrefix}/models/accounts/banks/daily-banking-statistics-cell{jsSuffix}",
						$"{jsPrefix}/models/accounts/banks/daily-banking-statistics{jsSuffix}"
				));

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
        
    }
}
