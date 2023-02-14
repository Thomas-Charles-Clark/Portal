/**
 * Custom binding for Owl Carousel 2.1
 * @link http://owlcarousel2.github.io/OwlCarousel2/
 *
 *
 * @markup
 * <pre>
 *   <div
 *     class="owl-carousel"
 *       data-bind="foreach: $data.items,
 *       owlCarousel: {
 *         items: 1 // @see http://owlcarousel2.github.io/OwlCarousel2/docs/api-options.html 
 *       }"
 *     >
 *     ... item of carousel ...
 *   </div>
 * </pre>
 *
 */

//ko.bindingHandlers.owlCarousel = {
//    init: function (element, valueAccessor) {

//        // The options that have been configured with the owlCarousel binding
//        var options = ko.utils.unwrapObservable(valueAccessor()) || {};

//        // The bound element as a jQuery object
//        var $owlElement = $(element);

//        // Initialize carousel with options
//        $owlElement.owlCarousel(options);

//        // the owl instance that has just been created
//        var owl = $owlElement.data('owl.carousel');

//        // Register a callback that is being executed when the element is removed
//        // in that case the carousel is no longer required and can be destroyed
//        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
//            if (owl) {
//                owl.trigger('destroy.owl.carousel');
//            }
//        });
//    }
//};

/*
 * ****************************************************************************************************
 * This file contains custom KnockoutJS bindings for OWL Carousel (http://owlgraphic.com/owlcarousel/).
 * It is a wrapper for the built in 'template' binding.
 *
 * @author      Hauke Jaeger, hauke.jaeger@googlemail.com
 * @license     MIT http://www.opensource.org/licenses/mit-license.php
 * ****************************************************************************************************
 */
; (function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["knockout", "jquery", "jquery.ui.sortable"], factory);
    } else {
        factory(window.ko, jQuery);
    }
})(function (ko, $, undefined) {
    /**
     * Helper function that refreshes the items of the given owl instance.
     *
     * @param {{ $owlWrapper: jQuery, $owlItems: jQuery, $userItems: jQuery, itemsAmount: number }} owl
     *          The owl carousel instance that should be refreshed
     */
    var refreshOwl = function (owl) {
        // find all owl items that are currently wrapped in the owl wrapper element
        //owl._items = owl.$stage.children(".owl-item");

        //owl._items = [];//.push(item);
        console.log('refreshOwl called');

        // don't want to be cleaning nodes and detaching and reattaching them!!

        var tmp = [];

        $.each(owl.$stage.children(".owl-item"), function (idx, item) {
            tmp.push({ index: idx, model: ko.contextFor(item) });
            ko.cleanNode(item);
        });

        owl.replace(owl.$stage.children(".owl-item"));

        owl.trigger('refresh.owl.carousel');

        $.each(owl.$stage.children(".owl-item"), function (idx, item) {
            var found = Enumerable.From(tmp).Where(function (x) {
                return x.index == idx
            }).Single();
            ko.applyBindings(found.model, item);
        });
    };

    /**
     * Helper function for creating an options object that can be passed to ko.bindingHandlers.template.init as a value for
     * the 'valueAccessor' parameter.
     *
     * @param {{data: *, as: string, afterRender: function, afterAdd: function, beforeRemove: function}} options
     * @param {function} afterRender
     * @returns {{foreach: *, as: string, afterRender: function, afterAdd: function, beforeRemove: function}}
     */
    var makeTemplateBindingOptions = function (options, afterRender) {
        var templateOptions = {
            foreach: options.data,
            as: options.as,
            afterRender: afterRender,
            afterAdd: options.afterAdd,
            beforeRemove: options.beforeRemove
        };

        if (options.afterRender) {
            var userAfterRender = options.afterRender;

            templateOptions.afterRender = function (element, data) {
                if (afterRender) {
                    afterRender.call(data, element, data);
                }

                userAfterRender(data, element, data);
            };
        }

        return templateOptions;
    };

    ko.bindingHandlers.owlCarousel = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            // the options that have been configured with the owlCarousel binding
            var options = ko.utils.unwrapObservable(valueAccessor());

            // the bound element as a jQuery object
            var $elem = $(element);

            // a dummy <div> element
            var $dummy = null;

            // check whether the owlCarousel binding has beeing initialized on an empty container element
            if ($elem.children().length === 0) {
                // create a dummy element and add it to the owlContainer element
                // this is necessary for initializing OWL Carousel without errors.
                $dummy = $('<div class="knockout-owlCarousel-dummy"></div>');
                $elem.append($dummy);
            }

            // initialize owl carousel
            var owlOptions = options.owlOptions || {};
            $elem.owlCarousel(owlOptions);

            // WHY OH WHY OH WHY does it insist that it should have just one _item

            // Because the owlCarousel is first called by this, the bindingHandler init
            // it actually only has one DUMMY item, which is the very template it's expected to reproduce
            // for each object in the array... the dummy item which should not be counted! 
            // 

            // the owl instance that has just been created
            var owl = $elem.data("owl.carousel");

            // remove the dummy element if it was required
            if ($dummy !== null) {
                owl.removeItem(0); // This does not exist
            }

            // register a callback that is being executed when the element is removed
            // in that case the carousel is no longer required and can be destroyed
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                if (owl) {
                    owl.trigger('destroy.owl.carousel');
                }
            });

            // create options for the template binding with a afterRender event hook
            // that causes the carousel to refresh its internal state
            var templateOptions = makeTemplateBindingOptions(options, function () {
                refreshOwl(owl);
            });

            return ko.bindingHandlers.template.init(owl.$stage[0], function () { return templateOptions; }, allBindingsAccessor, viewModel, bindingContext);
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            // the options that have been configured with the owlCarousel binding
            var options = ko.utils.unwrapObservable(valueAccessor());

            // the bound element as a jQuery object
            var $elem = $(element);

            // the owl instance that has been associated with the element
            var owl = $elem.data("owl.carousel");

            // create options for the template binding with a afterRender event hook
            // that causes the carousel to refresh its internal state
            var templateOptions = makeTemplateBindingOptions(options, function (element, data) {
                refreshOwl(owl);
            });

            refreshOwl(owl);

            //ko.bindingHandlers.template.update(owl.$element[0], function () { return templateOptions; }, allBindingsAccessor, viewModel, bindingContext);

            ko.bindingHandlers.template.update(owl.$stage[0], function () { return templateOptions; }, allBindingsAccessor, viewModel, bindingContext);
        }
    };
});

// so... at the moment, when update is called, the wrong thing happens - we want to be passing in... the outer






///*
// * ****************************************************************************************************
// * This file contains custom KnockoutJS bindings for OWL Carousel (http://owlgraphic.com/owlcarousel/).
// * It is a wrapper for the built in 'template' binding.
//
//          This is compatible with Owl 1.3.3
//
// *
// * @author      Hauke Jaeger, hauke.jaeger@googlemail.com
// * @license     MIT http://www.opensource.org/licenses/mit-license.php
// * ****************************************************************************************************
// */
//; (function (factory) {
//    if (typeof define === "function" && define.amd) {
//        define(["knockout", "jquery", "jquery.ui.sortable"], factory);
//    } else {
//        factory(window.ko, jQuery);
//    }
//})(function (ko, $, undefined) {
//    /**
//     * Helper function that refreshes the items of the given owl instance.
//     *
//     * @param {{ $owlWrapper: jQuery, $owlItems: jQuery, $userItems: jQuery, itemsAmount: number }} owl
//     *          The owl carousel instance that should be refreshed
//     */
//    var refreshOwl = function (owl) {
//        // find all owl items that are currently wrapped in the owl wrapper element
//        owl.$owlItems = owl.$owlWrapper.children(".owl-item");

//        // extract the elements that are wrapped in the owl items
//        owl.$userItems = owl.$owlItems.children();
//        owl.itemsAmount = owl.$userItems.length;

//        // TODO: check if items have been removed and adjust owl's internal current position

//        // recalculate internal values
//        owl.calculateAll();

//        // refresh pagination
//        owl.updatePagination();

//        // refresh the controls block (make it visible)
//        owl.updateControls();
//    };

//    /**
//     * Helper function for creating an options object that can be passed to ko.bindingHandlers.template.init as a value for
//     * the 'valueAccessor' parameter.
//     *
//     * @param {{data: *, as: string, afterRender: function, afterAdd: function, beforeRemove: function}} options
//     * @param {function} afterRender
//     * @returns {{foreach: *, as: string, afterRender: function, afterAdd: function, beforeRemove: function}}
//     */
//    var makeTemplateBindingOptions = function (options, afterRender) {
//        var templateOptions = {
//            foreach: options.data,
//            as: options.as,
//            afterRender: afterRender,
//            afterAdd: options.afterAdd,
//            beforeRemove: options.beforeRemove
//        };

//        if (options.afterRender) {
//            var userAfterRender = options.afterRender;

//            templateOptions.afterRender = function (element, data) {
//                if (afterRender) {
//                    afterRender.call(data, element, data);
//                }

//                userAfterRender(data, element, data);
//            };
//        }

//        return templateOptions;
//    };

//    ko.bindingHandlers.owlCarousel = {
//        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
//            // the options that have been configured with the owlCarousel binding
//            var options = ko.utils.unwrapObservable(valueAccessor());

//            // the bound element as a jQuery object
//            var $elem = $(element);

//            // a dummy <div> element
//            var $dummy = null;

//            // check whether the owlCarousel binding has beeing initialized on an empty container element
//            if ($elem.children().length === 0) {
//                // create a dummy element and add it to the owlContainer element
//                // this is necessary for initializing OWL Carousel without errors.
//                $dummy = $('<div class="knockout-owlCarousel-dummy"></div>');
//                $elem.append($dummy);
//            }

//            // initialize owl carousel
//            var owlOptions = options.owlOptions || {};
//            $elem.owlCarousel(owlOptions);

//            // the owl instance that has just been created
//            var owl = $elem.data("owlCarousel");

//            // remove the dummy element if it was required
//            if ($dummy !== null) {
//                owl.removeItem(0);
//            }

//            // register a callback that is being executed when the element is removed
//            // in that case the carousel is no longer required and can be destroyed
//            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
//                if (owl) {
//                    owl.destroy();
//                }
//            });

//            // create options for the template binding with a afterRender event hook
//            // that causes the carousel to refresh its internal state
//            var templateOptions = makeTemplateBindingOptions(options, function () {
//                refreshOwl(owl);
//            });

//            return ko.bindingHandlers.template.init(owl.$owlWrapper[0], function () { return templateOptions; }, allBindingsAccessor, viewModel, bindingContext);
//        },
//        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
//            // the options that have been configured with the owlCarousel binding
//            var options = ko.utils.unwrapObservable(valueAccessor());

//            // the bound element as a jQuery object
//            var $elem = $(element);

//            // the owl instance that has been associated with the element
//            var owl = $elem.data("owlCarousel");

//            // create options for the template binding with a afterRender event hook
//            // that causes the carousel to refresh its internal state
//            var templateOptions = makeTemplateBindingOptions(options, function (element, data) {
//                refreshOwl(owl);
//            });

//            ko.bindingHandlers.template.update(owl.$owlWrapper[0], function () { return templateOptions; }, allBindingsAccessor, viewModel, bindingContext);
//        }
//    };
//});
