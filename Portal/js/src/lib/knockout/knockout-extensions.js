// thanks: https://stackoverflow.com/questions/27269621/how-can-i-make-a-string-default-to-null-instead-of#answer-27270620
// unfortunately this mucks up knockout validation... hm.
// rather, the validation still functions but the styling and messages aren't displayed.
// probably because this returns a wrapping computed observable.
//      therefore... probably server side, once mapping is complete, convert empty string
//      properties to null. abandon use of this helper.
//      or... make it an extender

//window.forceNullObservable = function (obs) {
//    return ko.computed({
//        read: function () {
//            return obs();
//        },
//        write: function (val) {
//            if (val === '') {
//                val = null;
//            }
//            obs(val);
//        }
//    });
//};

// CHEERS: https://stackoverflow.com/questions/17983118/change-observable-but-dont-notify-subscribers-in-knockout-js#answer-37961239
ko.observable.fn.silentUpdate = function (value) {
    this.notifySubscribers = function () { };
    this(value);
    this.notifySubscribers = function () {
        ko.subscribable.fn.notifySubscribers.apply(this, arguments);
    };
};

// Or... do this?
ko.bindingHandlers.forceNullOnEmpty = {
    update: function (element, valueAccessor) {
        var val = valueAccessor();
        if (ko.unwrap(val) === '')
            val(null);
    }
}

// Or... do this?
ko.bindingHandlers.forceNullOnZero = {
    update: function (element, valueAccessor) {
        var val = valueAccessor();
        if (ko.unwrap(val) == 0)
            val(undefined);
    }
}

// Or... do this?
ko.bindingHandlers.forceZeroOnEmpty = {
    update: function (element, valueAccessor) {
        var val = valueAccessor();
        if (ko.unwrap(val) === '' || ko.unwrap(val) == null)
            val(0);
    }
}

// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();

        var fadeSpeed = undefined;
        if (allBindingsAccessor().fadeSpeed) {
            fadeSpeed = allBindingsAccessor().fadeSpeed;
        }

        ko.unwrap(value) ?
            $(element).stop().fadeIn(fadeSpeed) :
            $(element).stop().fadeOut(fadeSpeed);
    }
};

ko.bindingHandlers.fadeSwapVisible = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        var unwrapped = ko.unwrap(value);
        // so inside the valueAccessor we get the object provided for this bindingHandler
        // I've defined "boolean" which is the value to watch
        //              "visibleWhen" which is the state we need element to be visible in
        //              "swapWith" which is the element which needs to be hidden when we're visible.
        if (!typeof ko.unwrap(unwrapped.boolean) === 'boolean') {
            console.error('fadeSwapVisible bindingHandler error - parameter "boolean" is not a boolean', element, unwrapped);
        }
        if (!typeof ko.unwrap(unwrapped.visibleWhen) === 'boolean') {
            console.error('fadeSwapVisible bindingHandler error - parameter "visibleWhen" is not a boolean', element, unwrapped);
        }
        if ($(unwrapped.swapWith).length == 0) {
            console.error('fadeSwapVisible bindingHandler error - parameter "swapWith" was not a found element', element, unwrapped);
        }
    },
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        if (ko.unwrap(value.boolean) == value.visibleWhen) {
            $(value.swapWith).css('position', 'absolute').hide().stop().fadeOut();
            $(element).css('position', 'static').stop().fadeIn();
        } else {
            $(value.swapWith).css('position', 'static').stop().fadeIn();
            $(element).css('position', 'absolute').hide().stop().fadeOut();
        }
    }
}

ko.bindingHandlers.fadeBetweenMany = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        var unwrapped = ko.unwrap(value);
        // so inside the valueAccessor we get the object provided for this bindingHandler
        // I've defined "condition" which is the function to evaluate
        //              "visibleWhen" which is the state we need element to be visible in
        //              "swapWith" which is the element which needs to be hidden when we're visible.
        //              - because you might be providing part of the selector at binding time, I'm no longer testing for
        //                the existence of $(swapWith) in the init function.
        if (!ko.isObservable(unwrapped.observable)) {
            console.error('fadeBetweenMany bindingHandler error - parameter "observable" is not an observable', element, unwrapped);
        }
        if (!typeof ko.hasOwnProperty(unwrapped.visibleWhen)) {
            console.error('fadeBetweenMany bindingHandler error - parameter "visibleWhen" is not present', element, unwrapped);
        }
        if (!typeof ko.hasOwnProperty(unwrapped.swapWith)) {
            console.error('fadeBetweenMany bindingHandler error - parameter "swapWith" is not present', element, unwrapped);
        }
    },
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());

        if (typeof value.visibleWhen === 'function') {
            if (value.visibleWhen(ko.unwrap(value.observable))) {
                $(value.swapWith).css('position', 'absolute').hide().stop().fadeOut();
                $(element).css('position', 'static').stop().fadeIn();
            } else {
                // do not fade others in: that's their business, not yours
                //$(value.swapWith).css('position', 'static').stop().fadeIn();
                $(element).css('position', 'absolute').hide().stop().fadeOut();
            }
        } else {
            if (ko.unwrap(value.observable) == value.visibleWhen) {
                $(value.swapWith).css('position', 'absolute').hide().stop().fadeOut();
                $(element).css('position', 'static').stop().fadeIn();
            } else {
                $(element).css('position', 'absolute').hide().stop().fadeOut();
            }
        }
    }
}

ko.bindingHandlers.slideVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function (element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ?
            $(element).stop().slideDown() :
            $(element).stop().slideUp();
    }
};

ko.bindingHandlers.fadeSlideVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function (element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ?
            $(element).stop().fadeIn({ queue: false }).css('display', 'none').slideDown() :
            $(element).stop().fadeOut({ queue: false }).slideUp();
    }
};

ko.bindingHandlers.horizontalSlideVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        var allBindings = ko.unwrap(allBindingsAccessor());

        ko.unwrap(value) ?
            $(element).stop(true, true).fadeIn({ queue: false }).show('slide', { direction: allBindings.slideDirection }, 500) :
            $(element).stop(true, true).fadeOut({ queue: false }).hide('slide', { direction: allBindings.slideDirection }, 500, function () {
                if (typeof allBindings.hiddenFunction === 'function')
                    allBindings.hiddenFunction();
            });

        //ko.unwrap(value.boolean) ?
        //    $(element).stop().fadeIn({ queue: false }).stop().effect('slide', { direction: "right", mode: 'show' }, 1000) :
        //    $(element).stop().fadeOut({ queue: false }).stop().effect('slide', { direction: "left", mode: 'hide' }, 1000, function () {
        //        if (typeof value.hiddenFunction === 'function')
        //            value.hiddenFunction();
        //    });
    }
};

// Thanks to http://stackoverflow.com/questions/17048468/make-an-input-only-numeric-type-on-knockout
ko.bindingHandlers.numeric = {
    init: function (element, valueAccessor) {
        $(element).on("keydown", function (event) {

            // Allow: backspace, delete, tab, escape, and enter
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow: Ctrl+V
                (event.keyCode == 86 && event.ctrlKey === true) ||
                // Allow: Ctrl+C
                (event.keyCode == 67 && event.ctrlKey === true) ||
                // Allow: Ctrl+X
                (event.keyCode == 88 && event.ctrlKey === true) ||
                // Allow: numpad -, or toprow - without shift key
                (event.keyCode == 109 || (event.shiftKey === false && event.keyCode == 189)) ||
                // Allow: both . keys (comma is event.keyCode == 188) if the Europeans complain about formatting...
                (event.keyCode == 190 || event.keyCode == 110 && (valueAccessor() ? ko.unwrap(valueAccessor().toString()).indexOf('.') == -1 : true)) ||
                // Allow: home, end, left, right, up, down
                (event.keyCode >= 35 && event.keyCode <= 40)) {
                // let the keypress occur
                return;
            }
            else {
                // Ensure that it is a number and stop the keypress
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        });

        // tagged out because of use on sales/leads
        // any other uses should be brought in line
        //$(element).on("keyup", function (event) {
        //    if (isNaN($(element).val())) {
        //        failValidation($(this));
        //    } else {
        //        $(this).css("background-color", "transparent");
        //    }
        //});
    }
};


// Thanks to http://stackoverflow.com/questions/17048468/make-an-input-only-numeric-type-on-knockout
ko.bindingHandlers.numericWhole = {
    init: function (element, valueAccessor) {
        $(element).on("keydown", function (event) {

            // Allow: backspace, delete, tab, escape, and enter
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow: home, end, left, right, up, down
                (event.keyCode >= 35 && event.keyCode <= 40)) {

                // let the keypress occur
                return;
            }
            else {
                // Ensure that it is a number and stop the keypress
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        });

        //$(element).on("keyup", function (event) {
        //    if (isNaN($(element).val())) {
        //        failValidation($(this));
        //    } else {
        //        $(this).css("background-color", "transparent");
        //    }
        //});
    }
};

//http://knockoutjs.com/documentation/extenders.html
ko.extenders.roundedNumeric = function (target, precision) {
    //create a writable computed observable to intercept writes to our observable
    var result = ko.pureComputed({
        read: target,  //always return the original observables value
        write: function (newValue) {


            if (newValue === "" || newValue === undefined)
                newValue = null;

            var current = target(),
                roundingMultiplier = Math.pow(10, precision),
                newValueAsNum = isNaN(newValue) ? 0 : +newValue,
                valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;

            valueToWrite = Number(valueToWrite).toFixed(precision);

            // only write if it has changed

            if (newValue === null && current === null)
                return;

            if (newValue === null)
                valueToWrite = null;

            if (isNaN(newValue) && newValue !== null) {
                return;
            }

            // and if both new and current are not null
            //if (newValue !== null && current !== null) {
            if (+valueToWrite !== +current) {
                target(valueToWrite);
            } else {
                //if the rounded value is the same, but a different value was written, force a notification for the current field
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
            //}
        }
    }).extend({ notify: 'always' });

    //initialize with current value to make sure it is rounded appropriately
    result(target());

    //return the new computed observable
    return result;
};


// Tom's own magic...
// 'Characters remaining' helper.
// I'd like very much to be able to say 'I want to display the remaining characters for this input property' in one simple binding.
ko.extenders.charsRemaining = function (observable, options) {

    if (options == null || options.maxLength == null)
        return;

    if (!options.hasOwnProperty('maxLength'))
        console.error('charsRemaining extender - options does not have property maxLength');
    if (!options.hasOwnProperty('elementId') && !options.hasOwnProperty('element') && !observable.DOMElement)
        console.error('charsRemaining extender - options does not have property elementId nor element, and observable does not have DOMElement');
    if (isNaN(options.maxLength))
        console.error('charsRemaining extender - options.maxLength was NaN');

    observable.maxLength = options.maxLength;

    var element = $(options.element || options.elementId || observable.DOMElement);

    var label = element.closest('.form-group').find(".col-form-label");

    if (!label.length) {
        label = element.closest('.mdc-validating-field').find(".mdc-floating-label");
    }

    //if (!label.length) {
    //    console.log(element, ' charsRemaining extender - input element must be inside a .form-group containing a .col-form-label, or a .mdc-validating-field containing an .mdc-floating-label', options);
    //}

    observable.charsRemaining = ko.pureComputed({
        read: function () {
            var value = ko.unwrap(observable());
            if (value == null)
                value = "";
            return '(' + (observable.maxLength - value.length) + ')';
        }
    }, this, { disposeWhenNodeIsRemoved: label });

    element.attr('maxlength', observable.maxLength);

    // upgraded to permit having duplicate input elements tied to same observable... lovely.
    $(label).each(function (index, ele) {
        var sup = document.createElement('sup');
        sup.className = "remaining";
        $(ele).find('sup').remove();
        $(ele).append(sup);
        ko.applyBindingsToNode(sup, { html: observable.charsRemaining });
    });
};

ko.bindingHandlers.charsRemaining = {
    init: function (element, valueAccessor, allBindings, data, context) {
        if (data.charsRemainingOptions) {
            data.observable.extend({
                charsRemaining: {
                    maxLength: data.charsRemainingOptions.maxLength,
                    element: element
                }
            });
        }
    }
}

// http://eonasdan.github.io/bootstrap-datetimepicker/Installing/#knockout
// modified to handle nulls.
ko.bindingHandlers.dateTimePicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional 

        var options = allBindingsAccessor().dateTimePickerOptions || {};
        $(element).datetimepicker(options);

        //when a user changes the date, update the view model
        ko.utils.registerEventHandler(element, "dp.change", function (event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                if (event.date != null && !(event.date instanceof Date)) {
                    if (event.date.hasOwnProperty("toDate")) {
                        value(event.date.toDate());
                    } else {
                        if (event.date != false) {
                            value(event.date);
                        } else {
                            // clear() in bootstrap-datetimepicker.js sets event.date to false.
                            value(undefined);
                        }
                    }
                } else {
                    if (event.date != false) {
                        value(event.date);
                    }
                }
            }
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            var picker = $(element).data("DateTimePicker");
            if (picker) {
                picker.destroy();
            }
        });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var picker = $(element).data("DateTimePicker");
        //when the view model is updated, update the widget
        if (picker) {
            var koDate = ko.utils.unwrapObservable(valueAccessor());

            if (koDate != null && koDate !== false) {

                if (koDate.toString().indexOf('Date') > -1)
                    koDate = (typeof (koDate) !== 'object') ? new Date(parseFloat(koDate.replace(/[^0-9]/g, ''))) : koDate;
                else
                    koDate = moment(koDate).format(allBindings().dateTimePickerOptions.format);
                //in case return from server datetime i am get in this form for example /Date(93989393)/ then fomat this
                // koDate = (typeof (koDate) !== 'object') ? new Date(parseFloat(koDate.replace(/[^0-9]/g, ''))) : koDate;
            }

            if (typeof koDate === "undefined") {
                koDate = null;
            }

            if (koDate === false) {
                koDate = null;
            }

            picker.date(koDate);
        }
    }
};

// with thanks: https://theweeklybyte.wordpress.com/2014/04/19/three-useful-knockoutjs-extenders/
//Add formatted observable to the target observable.
ko.extenders.currencyFormatted = function (target, options) {

    if (typeof options !== 'object') {
        console.error('currencyFormatted extender requires options { digits: [N], currency: ko.observable({ FormattingCulture: "[en-GB]", Code: "[GBP]" }) }');
    }
    if (!options.hasOwnProperty('digits')) {
        console.error('currencyFormatted extender requires options { digits: [N], currency: ko.observable({ FormattingCulture: "[en-GB]", Code: "[GBP]" }) }');
    }

    target.formatted = ko.computed({
        read: function () {
            var val = target();

            if (typeof val === 'undefined' || val == null)
                return val;

            if (options.currency) {
                var formattedValue = formatCurrency(val, options.digits, ko.unwrap(options.currency).FormattingCulture, ko.unwrap(options.currency).Code);

                return formattedValue;
            }
            else {
                return val;
            }

            //var formattedValue = ('R ' + val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        write: function (newValue) {
            var current = target();
            var valueToWrite = formatToNumberHelper(newValue, options.digits, options.maxValue, options.minValue);

            if (newValue === "")
                newValue = null;

            // only write if it has changed
            if (newValue === null && current === null)
                return;

            if (newValue === null)
                valueToWrite = null;


            //only write if it changed
            if (valueToWrite !== current) {
                target(valueToWrite);
            } else {
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
        }
    }).extend({
        rateLimit: {
            timeout: 0,
            method: 'notifyWhenChangesStop'
        },
        notify: 'always'
    });
    return target;
};

ko.extenders.numberFormatted = function (target, options) {

    if (typeof options !== 'object') {
        console.error('numberFormatted extender requires options { digits: [N], currency: ko.observable({ FormattingCulture: "[en-GB]" }) }');
    }
    if (!options.hasOwnProperty('digits')) {
        console.error('numberFormatted extender requires options { digits: [N], currency: ko.observable({ FormattingCulture: "[en-GB]" }) }');
    }
    if (!options.hasOwnProperty('currency')) {
        console.error('numberFormatted extender requires options { digits: [N], currency: ko.observable({ FormattingCulture: "[en-GB]" }) }');
    }

    target.formatted = ko.computed({
        read: function () {
            var val = target();

            if (typeof val === 'undefined' || val == null)
                return val;

            if (ko.unwrap(options.currency)) {
                var formattedValue = formatNumber(val, options.digits, ko.unwrap(options.currency).FormattingCulture);

                return formattedValue;
            }
            else {
                return val;
            }
        },
        write: function (newValue) {
            var current = target();
            var valueToWrite = formatToNumberHelper(newValue, options.digits, options.maxValue, options.minValue);

            if (newValue === "")
                newValue = null;

            // only write if it has changed
            if (newValue === null && current === null)
                return;

            if (newValue === null)
                valueToWrite = null;

            if (typeof options.skipExtraNotify === 'undefined') {
                target(valueToWrite);
                target.notifySubscribers(valueToWrite);
            } else {
                if (options.skipExtraNotify) {
                    //only write if it changed
                    if (valueToWrite !== current) {
                        target(valueToWrite);
                    } else {
                        if (newValue !== current) {
                            target.notifySubscribers(valueToWrite);
                        }
                    }
                } else {
                    target(valueToWrite);
                    target.notifySubscribers(valueToWrite);
                }
            }

        }
    }).extend({ notify: 'always' });
    return target;
};


ko.extenders.numberUnformatted = function (target, options) {

    if (typeof options !== 'object') {
        console.error('numberUnformatted extender requires options { digits: [N] }');
    }
    if (!options.hasOwnProperty('digits')) {
        console.error('numberUnformatted extender requires options { digits: [N] }');
    }
    if (!options.hasOwnProperty('currency')) {
        console.error('numberUnformatted extender requires options { digits: [N] }');
    }

    target.formatted = ko.computed({
        read: function () {
            var val = target();

            if (typeof val === 'undefined' || val == null)
                return val;

            return val;
        },
        write: function (newValue) {
            var current = target();
            var valueToWrite = formatToNumberHelper(newValue, options.digits, options.maxValue, options.minValue);

            if (newValue === "")
                newValue = null;

            // only write if it has changed
            if (newValue === null && current === null)
                return;

            if (newValue === null)
                valueToWrite = null;

            if (typeof options.skipExtraNotify === 'undefined') {
                target(valueToWrite);
                target.notifySubscribers(valueToWrite);
            } else {
                if (options.skipExtraNotify) {
                    //only write if it changed
                    if (valueToWrite !== current) {
                        target(valueToWrite);
                    } else {
                        if (newValue !== current) {
                            target.notifySubscribers(valueToWrite);
                        }
                    }
                } else {
                    target(valueToWrite);
                    target.notifySubscribers(valueToWrite);
                }
            }

        }
    }).extend({ notify: 'always' });
    return target;
};

//ko.bindingHandlers.numericBetween = {
//    init: function (element, valueAccessor) {
//        var value = valueAccessor();

//        $(element).on("keydown", function (event) {

//            // Allow: backspace, delete, tab, escape, and enter
//            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
//                // Allow: Ctrl+A
//                (event.keyCode == 65 && event.ctrlKey === true) ||
//                // Allow: both . keys (comma is event.keyCode == 188) if the Europeans complain about formatting...
//                (event.keyCode == 190 || event.keyCode == 110) ||
//                // Allow: home, end, left, right, up, down
//                (event.keyCode >= 35 && event.keyCode <= 40)) {

//                // let the keypress occur
//                return;
//            }
//            else {
//                // Ensure that it is a number and stop the keypress
//                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
//                    event.preventDefault();
//                }
//            }
//        });
//    },
//    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

//        var current = allBindings().hasOwnProperty('value') ? allBindings().value : allBindings().textInput;

//        var val = current();

//        var config = ko.utils.unwrapObservable(valueAccessor());

//        window.setTimeout(function () {

//            current = allBindings().hasOwnProperty('value') ? allBindings().value : allBindings().textInput;
//            config = ko.utils.unwrapObservable(valueAccessor());

//            var valueToWrite = formatToNumberHelper(current(), config.digits, ko.unwrap(config.maxValue), ko.unwrap(config.minValue));

//            if (valueToWrite === "")
//                valueToWrite = null;

//            // only write if it has changed
//            if (valueToWrite === null && current() === null)
//                return;


//            //only write if it changed
//            if (valueToWrite !== current()) {
//                current(valueToWrite);
//            } else {
//                if (valueToWrite !== current()) {
//                    current.notifySubscribers(valueToWrite);
//                }
//            }
//        }, 0)
//    }
//}


function formatToNumberHelper(str, decimals, maxValue, minValue) {
    var roundingMultiplier = Math.pow(10, decimals);

    //Strip out everything except numbers and decimals (also strip out '%' and 'R')
    var newValueAsNum = new String(str).replace(/[^0-9\.-]/g, '');
    if (isNaN(newValueAsNum)) {
        //can happen with two decimals.
        newValueAsNum = 0;
    }
    var valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;

    maxValue = ko.unwrap(maxValue);
    minValue = ko.unwrap(minValue);

    if (!isNaN(maxValue)) {
        if (maxValue >= 0) {
            if (valueToWrite > maxValue)
                valueToWrite = maxValue;
        } else {
            if (valueToWrite < maxValue)
                valueToWrite = maxValue;
        }
    }

    if (!isNaN(minValue)) {
        if (valueToWrite < minValue)
            valueToWrite = minValue;
    }

    return valueToWrite;
}


// Here's another home cooked one then:
ko.extenders.pcaPredict = function (observable, options) {

    if (options === null) {
        console.error('pcaPredict extender requires options');
    }
    if (!options.hasOwnProperty("elementId") && !options.hasOwnProperty('element')) {
        console.error('pcaPredict extender options object requires elementId OR element');
    }
    if (!options.hasOwnProperty("mapFunction")) {
        console.error('pcaPredict extender options object requires mapFunction to utilise results');
    }
    if (typeof options.mapFunction !== 'function') {
        console.error('pcaPredict extender options object requires mapFunction function taking params: line1, line2, line3, line4 & postalCode')
    }
    if (!options.hasOwnProperty("country")) {
        console.error('pcaPredict extender options object requires countryCode observable');
    }

    observable.PCASearchId = ko.observable();
    observable.PCAContainer = ko.observable();

    $(options.elementId || options.element).autocomplete({
        appendTo: 'body',// $(options.elementId || options.element).parent(),
        source: function (request, response) {
            if (ko.unwrap(options.country)) {
                if (ko.unwrap(options.country).hasOwnProperty('Code')) {
                    $(options.elementId || options.element).parent().find('.pca-failure').remove();
                    $.ajax({
                        url: "/Products/Enquiry/PCAPredictFind",
                        type: "POST",
                        dataType: "json",
                        data: {
                            id: observable.PCASearchId(),
                            text: observable(),
                            container: observable.PCAContainer(),
                            origin: null,
                            countries: ko.unwrap(options.country).Code,
                        },
                        success: function (data) {
                            $(options.elementId || options.element).removeClass('ui-autocomplete-loading');
                            if (observable.PCASearchId() != null) {
                                if (data.length == 1) {
                                    var county = data[0].Province || data[0].ProvinceName || data[0].ProvinceCode || data[0].AdminAreaName || data[0].AdminAreaCode;
                                    if (data[0].City === "London" && ko.unwrap(options.country).Code == "GB")
                                        county = "London";
                                    var line1 = data[0].Line1;
                                    if (data[0].Company != "") {
                                        line1 = data[0].Company + ", " + line1;
                                    }

                                    options.mapFunction(line1,
                                        data[0].Line2,
                                        data[0].City,
                                        county,
                                        data[0].PostalCode);

                                    $(options.elementId || options.element).autocomplete("close");

                                    observable.PCASearchId(null);
                                    observable.PCAContainer(null);

                                    return false;
                                } else {
                                    response($.map(data, function (item) {
                                        var county = item.Province || item.ProvinceName || item.ProvinceCode || item.AdminAreaName || item.AdminAreaCode;
                                        if (item.City === "London" && ko.unwrap(options.country).Code == "GB")
                                            county = "London";
                                        var line1 = data[0].Line1;
                                        if (item.Company != "") {
                                            line1 = data[0].Company + ", " + line1;
                                        }
                                        return {
                                            customCatch: true,
                                            label: item.Label,
                                            value: item.Id,
                                            addressLine1: line1,
                                            addressLine2: item.Line2,
                                            addressLine3: item.City,
                                            addressLine4: county,
                                            Postcode: item.PostalCode
                                        }
                                    }));
                                    return false;
                                }
                            }

                            observable.PCASearchId(null);
                            observable.PCAContainer(null);

                            response($.map(data, function (item) {
                                if (item.hasOwnProperty('Type')) {
                                    if ((item.Type === "Address") || (item.Type === "Residential")) {
                                        return {
                                            id: item.Id,
                                            label: item.Text + ", " + item.Description,
                                            value: item.Id,
                                            type: item.Type,
                                            text: item.Text
                                            // highlight: item.Highlight
                                        };
                                    } else {
                                        return {
                                            id: item.Id,
                                            label: item.Description,
                                            value: item.Id,
                                            type: item.Type,
                                            text: item.Text
                                            // highlight: item.Highlight
                                        };
                                    }
                                } else {
                                    return {
                                        label: item.Label,
                                        value: item.Id
                                    }
                                }
                            }));
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            console.log('pcaPredict failure', errorThrown);
                            $(options.elementId || options.element).removeClass('ui-autocomplete-loading');
                            $(options.elementId || options.element).parent().find('.pca-failure').remove();
                            $(options.elementId || options.element).parent().append('<span class="pca-failure alert alert-danger">Lookup Failure. Please try again.</span>');
                            //$.showError(xhr, textStatus, errorThrown);
                        }
                    });
                    return;
                }
            }

            $(options.elementId || options.element).removeClass('ui-autocomplete-loading');
            response($.map([{
                id: '',
                label: 'Please select a Country before searching',
                value: null,
                type: null,
                text: 'Please select a Country before searching'
            }], function (item) {
                return {
                    id: item.id,
                    label: item.label,
                    value: item.value,
                    type: item.type,
                    text: item.text
                }
            }));

        },
        open: function (event, ui) {
            $('.ui-autocomplete').off('menufocus hover mouseover');
        },
        minLength: 1,
        select: function (event, ui) {
            if (ui.item.hasOwnProperty('type')) {
                switch (ui.item.type) {
                    case 'Address':
                    case 'Residential':
                        jQuery.extend(event.originalEvent, { keepOpen: true });
                        observable.PCASearchId(ui.item.id);
                        observable.PCAContainer(null);
                        break;
                    default:
                        jQuery.extend(event.originalEvent, { keepOpen: true });
                        //modify value as required
                        observable.PCASearchId(null);
                        observable.PCAContainer(ui.item.id);
                        //$("#pca-find").autocomplete('search');
                        return false;
                }
            } else if (ui.item.hasOwnProperty('customCatch')) {

                options.mapFunction(ui.item.addressLine1,
                    ui.item.addressLine2,
                    ui.item.addressLine3,
                    ui.item.addressLine4,
                    ui.item.Postcode);
                //self.setAddress(new Address({
                //    Name: self.address().Name(),
                //    AddressLine1: ui.item.addressLine1,
                //    AddressLine2: ui.item.addressLine2,
                //    AddressLine3: ui.item.addressLine3,
                //    AddressLine4: ui.item.addressLine4,
                //    Postcode: ui.item.Postcode,
                //    Country: self.address().Country()
                //}));
                $(options.elementId || options.element).autocomplete("close");

                observable.PCASearchId(null);
                observable.PCAContainer(null);

                if (observable.hasOwnProperty('PCASearchTerm'))
                    observable.PCASearchTerm(null);
            }

            return false;
        },
        focus: function (event, ui) {
            event.preventDefault();
        },
        autoFocus: typeof options.autoFocus === 'undefined' ? true : options.autoFocus,
        position: options.position || { my: "left top", at: "left bottom", collision: "none" }
    });
}

// same as the above, but instead of rendering results as a dropdown they're injected into a list-group ul
// named 'searchResultsList'
ko.extenders.pcaPredictList = function (observable, options) {

    if (options === null) {
        console.error('pcaPredictList extender requires options');
    }
    if (!options.hasOwnProperty('element')) {
        console.error('pcaPredictList extender options object requires element');
    }
    if (!options.hasOwnProperty("mapFunction")) {
        console.error('pcaPredictList extender options object requires mapFunction to utilise results');
    }
    if (typeof options.mapFunction !== 'function') {
        console.error('pcaPredictList extender options object requires mapFunction function taking params: line1, line2, line3, line4 & postalCode')
    }
    if (!options.hasOwnProperty("country")) {
        console.error('pcaPredictList extender options object requires countryCode observable');
    }
    if (!options.hasOwnProperty('searchResultsList'))
        console.error('pcaPredictList extender options object requires searchResultsList observableArray')

    if (!options.hasOwnProperty('searchEndpoint'))
        console.error('pcaPredictList extender options object requires searchEndpoint observable')

    observable.PCASearchId = ko.observable();
    observable.PCAContainer = ko.observable();
    observable.searchEndpoint = options.searchEndpoint;
    observable.busy = options.busy;

    observable.performSearch = function (response) {

        if (!observable.busy()) {

            observable.busy(true);

            var data = {
                id: observable.PCASearchId(),
                text: observable() ?? '',
                container: observable.PCAContainer(),
                origin: null,
                countries: ko.unwrap(options.country).Code,
                tradeAccountCode: ko.unwrap(options.tradeAccount).Code,
                endCustomerTradeAccountCode: ko.unwrap(options.endCustomerTradeAccount)?.Code
            };

            console.log(`pcaPredictList calling ${observable.searchEndpoint()} with`, data);

            $.ajax({
                url: observable.searchEndpoint(),//"/Products/Enquiry/PCAPredictFind",
                type: "POST",
                dataType: "json",
                data: data,
                success: function (data) {
                    $(options.elementId || options.element).removeClass('ui-autocomplete-loading');
                    console.log('pcaPredictList performSearch returned', data)
                    //if (observable.PCASearchId() != null || (observable.searchEndpoint().indexOf('mertex') > -1)) {

                    var results = $.map(data.mertexResults, function (item) {
                        var county = item.County;
                        if (item.Town === "London" && ko.unwrap(options.country).Code == "GB")
                            county = "London";
                        return {
                            customCatch: true,
                            label: item.Label,
                            value: item.Id,
                            companyName: item.CompanyName,
                            name: item.ContactName,
                            addressLine1: item.AddressLine1,
                            addressLine2: item.AddressLine2,
                            addressLine3: item.Town,
                            addressLine4: county,
                            postcode: item.Postcode,
                            phone: item.PhoneNumber,
                            email: item.Email,
                            deliveryReference: item.Code,
                            obj: item,
                            type: item.type,
                            loqateAddress: false,
                            countryId: item.CountryID
                        };
                    });

                    if (observable.PCASearchId() != null) {
                        results = results.concat($.map(data.results, function (item) {
                            var county = item.Province || item.ProvinceName || item.ProvinceCode || item.AdminAreaName || item.AdminAreaCode;
                            if (item.City === "London" && ko.unwrap(options.country).Code == "GB")
                                county = "London";
                            return {
                                customCatch: true,
                                label: item.Label,
                                value: item.Id,
                                companyName: item.Company,
                                name: item.Name,
                                addressLine1: item.Line1,
                                addressLine2: item.Line2,
                                addressLine3: item.City,
                                addressLine4: county,
                                postcode: item.PostalCode,
                                phone: item.Phone,
                                email: item.Email,
                                deliveryReference: item.DeliveryReference,
                                obj: item,
                                type: item.Type,
                                loqateAddress: true,
                                countryId: ko.unwrap(options.country).CountryID
                            };
                        }));

                    } else {
                        results = results.concat($.map(data.results, function (item) {
                            if (item.hasOwnProperty('Type')) {
                                switch (item.Type) {
                                    case 'Address':
                                    case 'Residential':
                                        return {
                                            id: item.Id,
                                            label: item.Text + ", " + item.Description,
                                            value: item.Id,
                                            type: item.Type,
                                            text: item.Text
                                        };
                                    case 'Commercial':
                                        return {
                                            id: item.Id,
                                            label: item.Label,
                                            value: item.Id,
                                            type: item.Type,
                                            text: item.Label
                                        };
                                        break;
                                    default:
                                        return {
                                            id: item.Id,
                                            label: item.Description,
                                            value: item.Id,
                                            type: item.Type,
                                            text: item.Text
                                        }
                                }
                            } else {
                                return {
                                    label: item.Label,
                                    value: item.Id
                                }
                            }
                        }));
                    }


                    observable.PCASearchId(null);
                    observable.PCAContainer(null);

                    //response();
                    //return false;

                    //            //response(results);

                    //        options.searchResultsList($.map(data, function (item) {
                    //            //var county = item.Province || item.ProvinceName || item.ProvinceCode || item.AdminAreaName || item.AdminAreaCode;
                    //            //if (item.City === "London" && ko.unwrap(options.country).Code == "GB")
                    //            //    county = "London";

                    //            return {
                    //                customCatch: true,
                    //                label: item.Label,
                    //                value: item.Id,
                    //                companyName: item.Company,
                    //                name: item.Name,
                    //                addressLine1: item.Line1,
                    //                addressLine2: item.Line2,
                    //                addressLine3: item.City,
                    //                addressLine4: county,
                    //                postcode: item.PostalCode,
                    //                phone: item.Phone,
                    //                email: item.Email,
                    //                deliveryReference: item.DeliveryReference,
                    //                obj: item
                    //            }
                    //        }));
                    //        observable.busy(false);
                    //        response();
                    //        return false;

                    ////}


                    //options.searchResultsList($.map(data, function (item) {
                    //    if (item.hasOwnProperty('Type')) {
                    //        if ((item.Type === "Address") || (item.Type === "Residential")) {
                    //            return {
                    //                id: item.Id,
                    //                label: item.Text + ", " + item.Description,
                    //                value: item.Id,
                    //                type: item.Type,
                    //                text: item.Text,
                    //                obj: item
                    //                // highlight: item.Highlight
                    //            };
                    //        } else {
                    //            return {
                    //                id: item.Id,
                    //                label: item.Description,
                    //                value: item.Id,
                    //                type: item.Type,
                    //                text: item.Text,
                    //                obj: item
                    //                // highlight: item.Highlight
                    //            };
                    //        }
                    //    } else {
                    //        return {
                    //            label: item.Label,
                    //            value: item.Id,
                    //            obj: item
                    //        }
                    //    }
                    //}));

                    options.searchResultsList(results);

                    observable.busy(false);

                    response();
                },
                error: function (xhr, textStatus, errorThrown) {
                    observable.busy(false);
                    console.log('pcaPredict failure', errorThrown);
                    $(options.elementId || options.element).removeClass('ui-autocomplete-loading');
                    $(options.elementId || options.element).parent().find('.pca-failure').remove();
                    $(options.elementId || options.element).parent().append('<span class="pca-failure alert alert-danger">Lookup Failure. Please try again.</span>');
                    //$.showError(xhr, textStatus, errorThrown);
                }
            });
        }
    }

    $(options.element).autocomplete({
        appendTo: 'body',
        source: function (request, response) {
            if (ko.unwrap(options.country)) {
                if (ko.unwrap(options.country).hasOwnProperty('Code')) {
                    $(options.elementId || options.element).parent().find('.pca-failure').remove();
                    observable.performSearch(response);
                    return;
                }
            }

            $(options.elementId || options.element).removeClass('ui-autocomplete-loading');

            options.searchResultsList($.map([{
                id: '',
                label: 'Please select a Country before searching',
                value: null,
                type: null,
                text: 'Please select a Country before searching'
            }], function (item) {
                return {
                    id: item.id,
                    label: item.label,
                    value: item.value,
                    type: item.type,
                    text: item.text,
                    obj: item
                }
            }));
            response();

        },
        open: function (event, ui) {
            $('.ui-autocomplete').off('menufocus hover mouseover');
        },
        minLength: typeof options.minLength === 'undefined' ? 1 : options.minLength, // this... this cannot be one character for Mertex purposes; we want the complete list.
        select: function (event, ui) {
            return false;
        },
        focus: function (event, ui) {
            event.preventDefault();
        },
        autoFocus: typeof options.autoFocus === 'undefined' ? true : options.autoFocus,
        delay: options.delay ?? 500,
        position: options.position || { my: "left top", at: "left bottom", collision: "none" }
    });
}

ko.bindingHandlers.pcaPredict = {
    init: function (element, valueAccessor, allBindingsAccessor) {

        //console.log('autocomplete binding handler init', element);

        var params = ko.unwrap(valueAccessor());
        var otherBindings = ko.unwrap(allBindingsAccessor());

        params.element = element;

        otherBindings.textInput.extend({
            pcaPredict: params
        });
    }
}

ko.bindingHandlers.pcaPredictList = {
    init: function (element, valueAccessor, allBindingsAccessor) {

        //console.log('autocomplete binding handler init', element);

        var params = ko.unwrap(valueAccessor());
        var otherBindings = ko.unwrap(allBindingsAccessor());

        params.element = element;

        otherBindings.textInput.extend({
            pcaPredictList: params
        });
    }
}

ko.extenders.autocomplete = function (observable, options) {

    if (options === null) {
        console.error('autocomplete extender requires options');
    }
    if (!options.hasOwnProperty("elementId") && !options.hasOwnProperty('element')) {
        console.error('autocomplete extender options object requires elementId OR element');
    }
    //if (!options.hasOwnProperty("mapFunction")) {
    //    console.log('autocomplete extender options object has no mapFunction');
    //}
    //if (typeof options.mapFunction !== 'function') {
    //    console.log('autocomplete extender options object has no mapFunction');
    //}
    //if (!options.hasOwnProperty('autocompleteEndpoint')) {
    //    console.log('autocomplete extender options object has no autocompleteEndpoint')
    //}

    $(options.elementId || options.element).autocomplete({
        appendTo: $(options.elementId || options.element).parent(),
        source: options.source || function (request, response) {

            $(options.elementId || options.element).parent().find('.pca-failure').remove();

            var data = ko.toJS(options.additionalParams || {});

            data.searchTerm = request.term;

            console.log('autocomplete called', data);

            var localData = ko.unwrap(options.localData);

            if (localData) {
                var re = $.ui.autocomplete.escapeRegex(request.term);
                var matcher = new RegExp("" + re, "i");
                response($.grep(localData, function (item) {
                    return matcher.test(item.label);
                }));
                return;
            }

            $.ajax({
                url: options.autocompleteEndpoint,
                type: "POST",
                dataType: "json",
                data: data,
                success: function (data) {
                    console.log('autocompleter returned', data);
                    response($.map(data, options.mapFunction));
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log('autocomplete failure', errorThrown);
                    $(options.elementId || options.element).removeClass('ui-autocomplete-loading');
                    $(options.elementId || options.element).parent().append('<span class="pca-failure alert alert-danger">Autocomplete Failure. Please try again.</span>');
                    //$.showError(xhr, textStatus, errorThrown);
                }
            });
        },
        minLength: options.minLength,
        select: options.select,
        focus: typeof options.focus === 'function' ? options.focus : function (ev, ui) {
            ev.preventDefault();
        },
        autoFocus: typeof options.autoFocus === 'undefined' ? true : options.autoFocus,
        create: options.create,
        search: options.search,
        change: options.change,
        open: options.open,
        close: options.close,
        classes: options.classes
    });
}

ko.bindingHandlers.autocomplete = {
    init: function (element, valueAccessor, allBindingsAccessor) {

        //console.log('autocomplete binding handler init', element);

        var params = ko.unwrap(valueAccessor());
        var otherBindings = ko.unwrap(allBindingsAccessor());

        params.element = element;

        otherBindings.value.extend({
            autocomplete: params
        });
    }
}

// thanks: https://stackoverflow.com/questions/9465200/get-element-an-observable-is-bound-to-with-knockout#answer-12187273
ko.extenders.element = function (target, element) {
    if (target.DOMElement) {
        target.previousDOMElement = target.DOMElement;
    }
    target.DOMElement = element;
}

ko.bindingHandlers.keepElement = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        valueAccessor().extend({ element: element });
    }
};

ko.bindingHandlers.enterKey = {
    init: function (element, valueAccessor, allBindings, data, context) {
        var wrapper = function (data, event) {
            if (event.keyCode === 13) {
                if (valueAccessor())
                    valueAccessor().call();
            }
        };
        ko.applyBindingsToNode(element, { event: { keyup: wrapper } }, context);
    }
}

/*****************************************************************************
 *  thanks to:
 *  https://github.com/knockout/knockout/wiki/Bindings---uri-templates-and-uri-query-params
 *  helper used by both urlq and urlt binding handlers
 *
 ****************************************************************************/
function urlAttrForTagName(element) {
    //var tagName = ko.utils.tagNameLower(element);
    var tagName = element && element.tagName && element.tagName.toLowerCase();
    if (tagName == "img") {
        return 'src';
    } else if (tagName == "a") {
        return 'href';
    } else if (tagName == "form") {
        return 'action';
    } else {
        return;
    }
}
/*****************************************************************************
 *
 *  urlq KO binding handler
 *
 *  Purpose:
 *  Control a url's query parameters for href attribute of <a> tags,  src
 *  attribute of <img> tags, action attribute of <form> tags
 *
 *  Dependencies:
 *  Requires URI.js from: http://medialize.github.com/URI.js/
 *
 *  Usage:
 *  data-bind="urlq: { foo: fooValue, bar: barValue }"
 *
 *  Will synchronize ?foo=abc&bar=xyz portion of url in src/href attribute
 *  to the respective observables. (one-way binding)
 *
 *  Only replaces query parameters explicitly specified--any others in the
 *  attribute's original value are unchanged.
 *
 *  Interaction with an overlapping attr binding handler is undefined.
 *  I *think* it will always reapply after the attr handler makes changes,
 *  but am not sure.
 *
 *  Getting this to play nicely with attr: { href/src: } may be difficult.
 *
 ****************************************************************************/
ko.bindingHandlers.urlq = {
    update: function (element, valueAccessor) {
        var value;
        var paramName;
        var paramValue;
        var url;
        var attr = urlAttrForTagName(element);
        if (!attr) {
            return;
        }
        url = URI(element.getAttribute(attr));
        value = ko.utils.unwrapObservable(valueAccessor()) || {};
        for (paramName in value) {
            if (typeof paramName != "string") {
                continue;
            }
            paramValue = ko.utils.unwrapObservable(value[paramName]);
            url.removeSearch(paramName);
            if (paramValue !== null &&
                paramValue != undefined) {
                url.addSearch(paramName, paramValue);
            }
        }
        element.setAttribute(attr, url.toString());
    }
};

var simulatedObservable = (function () {

    var timer = null;
    var items = [];

    var check = function () {
        items = items.filter(function (item) {
            return !!item.elem.parents('html').length;
        });
        if (items.length === 0) {
            clearInterval(timer);
            timer = null;
            return;
        }
        items.forEach(function (item) {
            item.obs(item.getter());
        });
    };

    return function (elem, getter) {
        var obs = ko.observable(getter());
        items.push({ obs: obs, getter: getter, elem: $(elem) });
        if (timer === null) {
            timer = setInterval(check, 100);
        }
        return obs;
    };
})();

ko.bindingHandlers.ordinal = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        console.log('ordinal binding init', element);
        $(element).css('position', 'relative'); // be relatively positioned

    },
    update: function (element, valueAccessor, allBindingsAccessor) {

    }
}

ko.extenders.ordinal = function (observable, options) {

    if (options == null)
        console.error('ordinal extender - options was null', ko.unwrap(observable));
    if (!options.hasOwnProperty('elementId'))
        console.error('ordinal extender - options does not have property elementId', ko.unwrap(observable));

    var wrapperParent = $(options.elementId).closest('.ordinal-wrapper');

    if (!wrapperParent.length) {
        console.error(options.elementId + ' - ordinal extender - input element must be inside an element with class .ordinal-wrapper');
    }

    observable.ordinalDisplay = ko.pureComputed({
        read: function () {
            var value = ko.unwrap(observable());
            if (value == null || isNaN(value))
                return;
            else {
                return moment('2018-01-' + value).format("Do").replace(value, '');
            }
        }
    }, this, { disposeWhenNodeIsRemoved: $(options.elementId) });

    // upgraded to permit having duplicate input elements tied to same observable... lovely.

    var span = document.createElement('span');
    span.className = "date-ordinal";
    $(options.elementId).parent('.ordinal-wrapper').find('span.date-ordinal').remove();
    $(options.elementId).parent('.ordinal-wrapper').append(span);
    ko.applyBindingsToNode(span, { html: observable.ordinalDisplay });
}

ko.bindingHandlers.highlightNullField = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        // valueAccessor might be an observable or an observableArray.
        // we need to know if it is undefined, null, or empty and if it is apply alert-info.

        var value = ko.unwrap(valueAccessor());
        var applyAlertInfo = false;

        if (value != null) {
            if (value.hasOwnProperty('length')) {
                if (!value.length) {
                    applyAlertInfo = true;
                }
            }
        } else {
            applyAlertInfo = true;
        }

        if (applyAlertInfo) {
            $(element).addClass('alert-info');
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = ko.unwrap(valueAccessor());
        var applyAlertInfo = false;

        if (value != null) {
            if (value.hasOwnProperty('length')) {
                if (!value.length) {
                    applyAlertInfo = true;
                }
            }
        } else {
            applyAlertInfo = true;
        }

        if (applyAlertInfo) {
            if (!$(element).hasClass('alert-info')) {
                $(element).addClass('alert-info');
            }
        } else {
            $(element).removeClass('alert-info');
        }
    }
}

ko.bindingHandlers.virtualScroll = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {

        var clone = $(element).clone();
        $(element).empty();

        var config = ko.utils.unwrapObservable(valueAccessor());
        var rowHeight = ko.utils.unwrapObservable(config.rowHeight);

        ko.computed(function () {
            $(element).css({
                height: config.rows().length * rowHeight
            });
        });

        if (element && element.nodeName === "#comment") {
            element = $(element).prev();
        }

        var offset = simulatedObservable(element, function () {
            return $(element).offset().top - $(window).scrollTop();
        });

        var containerHeight = simulatedObservable(element, function () {
            //if (config.container)
            //    return $(config.container).innerHeight;
            //else
            return window.innerHeight;
        });

        var created = {};

        var refresh = function () {
            var o = offset();
            var data = config.rows();
            var top = Math.max(0, Math.floor(-o / rowHeight) - 10);
            var bottom = Math.min(data.length, Math.ceil((-o + containerHeight()) / rowHeight));

            for (var row = top; row < bottom; row++) {
                if (!created[row]) {
                    var rowDiv = $('<div></div>');
                    rowDiv.css({
                        position: 'absolute',
                        height: config.rowHeight,
                        left: 0,
                        right: 0,
                        top: row * config.rowHeight
                    });
                    rowDiv.append(clone.clone().children());
                    ko.applyBindingsToDescendants(context.createChildContext(data[row]), rowDiv[0]);
                    created[row] = rowDiv;
                    $(element).append(rowDiv);
                }
            }

            Object.keys(created).forEach(function (rowNum) {
                if (rowNum < top || rowNum >= bottom) {
                    created[rowNum].remove();
                    delete created[rowNum];
                }
            });
        };

        config.rows.subscribe(function () {
            Object.keys(created).forEach(function (rowNum) {
                created[rowNum].remove();
                delete created[rowNum];
            });
            refresh();
        });

        ko.computed(refresh);

        return { controlsDescendantBindings: true };
    }
};

ko.virtualElements.allowedBindings.virtualScroll = true;

// sorta sucks that I ended up having to make this tied to the GDPR survey for the sake
// of passing supplierId and dataCategoryId - time constaints and ignorance ftl...
// for the most part borrowed from the checkbox & radio "checkedValue" binding
ko.bindingHandlers['GDPRSurveySelectIntoArray'] = {
    'init': function (element, valueAccessor, allBindings) {
        var optionsValue = ko.pureComputed(function () {
            return ko.utils.unwrapObservable(allBindings.get('optionsValue'));
        });

        function updateModel() {

            // When we're first setting up this computed, don't change any model state.
            if (ko.computedContext.isInitial() || element.selectedIndex === -1) {
                return;
            }

            var elemValue = ko.selectExtensions.readValue(element.options[element.selectedIndex]);

            var modelValue = ko.dependencyDetection.ignore(valueAccessor);
            if (valueIsArray) {
                var writableValue = rawValueIsNonArrayObservable ? modelValue.peek() : modelValue;

                if (elemValue != null) {
                    elemValue.SupplierID = supplierId;
                    elemValue.DataCategoryID = dataCategoryId;
                }

                console.log('oldElemValue', oldElemValue);

                if (oldElemValue !== elemValue) {
                    // When we're responding to the optionsValue changing, and the element is
                    // currently selected, replace the old elem value with the new elem value
                    // in the model array.
                    if (elemValue) {

                        console.log(elemValue);

                        ko.utils.addOrRemoveItem(writableValue, elemValue, true);
                        ko.utils.addOrRemoveItem(writableValue, oldElemValue, false);
                    } else {
                        ko.utils.addOrRemoveItem(writableValue, oldElemValue, false);
                    }

                    oldElemValue = elemValue;
                } else {
                    // When we're responding to the user having unselected an option,
                    // add/remove the element value to the model array.

                    // there is no change to make...? oldElemValue === elemValue.

                    //ko.utils.addOrRemoveItem(writableValue, elemValue, isChecked);
                }
                if (rawValueIsNonArrayObservable && ko.isWriteableObservable(modelValue)) {
                    modelValue(writableValue);
                }
            }
        };

        function updateView() {
            // This updates the view value from the model value.
            // It runs in response to changes in the bound (checked) value.
            var modelValue = ko.utils.unwrapObservable(valueAccessor());

            if (valueIsArray) {
                // When a checkbox is bound to an array, being checked represents its value being present in that array
                element.selected = ko.utils.arrayIndexOf(modelValue, optionsValue()) >= 0;
            }
        };

        var isSelect = element.type == "select-one";

        // Only bind to check boxes and radio buttons
        if (!isSelect) {
            console.error('selectIntoToArray used on', element, 'which is not a single-select, it is an', element.type);
            return;
        }

        var rawValue = valueAccessor(),
            valueIsArray = isSelect && (ko.utils.unwrapObservable(rawValue) instanceof Array),
            rawValueIsNonArrayObservable = !(valueIsArray && rawValue.push && rawValue.splice),
            oldElemValue = valueIsArray ? optionsValue() : undefined,
            useOptionsValue = valueIsArray,
            supplierId = optionsValue().SupplierID,
            dataCategoryId = optionsValue().DataCategoryID;

        // IE 6 won't allow radio buttons to be selected unless they have a name
        //if (!element.name)
        //    ko.bindingHandlers['uniqueName']['init'](element, function () { return true });

        // Set up two computeds to update the binding:

        console.log('GDPRSurveySelectIntoArray', optionsValue().SupplierID, optionsValue().DataCategoryID);

        // The first responds to changes in the optionsValue value and to element clicks
        ko.computed(updateModel, null, { disposeWhenNodeIsRemoved: element });
        ko.utils.registerEventHandler(element, "change", updateModel);

        // The second responds to changes in the model value (the one associated with the checked binding)
        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });

        rawValue = undefined;
    }
};

ko.bindingHandlers.bootstrapPopover = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var properties = ko.utils.unwrapObservable(valueAccessor());

        function buildPopover(properties) {
            //console.log('bootstrapPopover init', element);

            $(element).on('click', function (event) {
                event.stopPropagation();
            });

            var pop = $(element).popover({
                container: properties.container || false,
                selector: properties.selector || element,
                placement: properties.placement,
                title: properties.title,
                content: properties.content,
                html: true,
                trigger: properties.trigger || 'click',
                template: properties.template || '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
            });

            properties.popObject = pop;

            pop.on('inserted.bs.popover', function (event) {
                if (event.currentTarget.nextSibling == null) {
                    window.setTimeout(function () {
                        ko.cleanNode($('#' + $(event.currentTarget).attr('aria-describedby'))[0]);
                        ko.applyBindingsToDescendants(bindingContext.createChildContext(properties), $('#' + $(event.currentTarget).attr('aria-describedby'))[0]);
                        $('#' + $(event.currentTarget).attr('aria-describedby')).on('click', function (event) {
                            event.stopPropagation();
                        });
                    }, 0);
                }
                else {
                    ko.cleanNode(event.currentTarget.nextSibling);
                    ko.applyBindingsToDescendants(bindingContext.createChildContext(properties), event.currentTarget.nextSibling);
                    $(event.currentTarget.nextSibling).on('click', function (event) {
                        event.stopPropagation();
                    });
                }
                if (typeof properties.onInserted === 'function') {
                    properties.onInserted(event);
                }
            });
        }

        if (ko.isObservable(valueAccessor())) {
            valueAccessor().subscribe(nv => {
                buildPopover(nv)
            });
        }

        if (properties) {
            buildPopover(properties);
        }
    }
} 

ko.bindingHandlers.actualBootstrapPopover = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var params = ko.utils.unwrapObservable(valueAccessor());

        var options = params.details;

        var pop = new bootstrap.Popover(element, {
            element: element,
            html: options.html ?? true,
            sanitize: options.sanitize ?? false,
            customClass: options.customClass,
            content: options.content || `<div class="blocker" style="display: flex; opacity: 1">
                        <div class="loading-spinner"></div>
                        <h4 class="mt-3">
                            Please wait...
                        </h4>
                    </div>`,
            trigger: options.trigger || 'hover focus click',
            container: element.closest(options.container) || 'body',
            placement: options.placement || 'auto',
            fallbackPlacements: options.fallbackPlacements || ['top', 'right', 'bottom', 'left'],
            popperConfig: options.popperConfig ?? {}
        });

        params.details.popover = pop;
        params.details.popoverElement = element;

        element.addEventListener('show.bs.popover', options.show);
        element.addEventListener('shown.bs.popover', options.shown);
        element.addEventListener('hide.bs.popover', options.hide);
        element.addEventListener('hidden.bs.popover', options.hidden);
        element.addEventListener('inserted.bs.popover', options.inserted);
    }
}

// Ryan, you beautiful person... thank you once more.
// http://www.knockmeout.net/2011/05/creating-smart-dirty-flag-in-knockoutjs.html
ko.dirtyFlag = function (root, isInitiallyDirty) {
    var result = function () { },
        _initialState = ko.observable(ko.toJSON(root)),
        _isInitiallyDirty = ko.observable(isInitiallyDirty);

    result.isDirty = ko.computed(function () {
        return _isInitiallyDirty() || _initialState() !== ko.toJSON(root);
    });

    result.reset = function () {
        _initialState(ko.toJSON(root));
        _isInitiallyDirty(false);
    };

    return result;
};

ko.bindingHandlers.mdcTextField = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        if (!window.mdc) {
            console.error('mdcTextField binding handler: global mdc was not defined', element)
            return;
        }

        var params = valueAccessor();

        if (ko.isObservable(params)) {
            params.mdcTextField = new mdc.textField.MDCTextField(element);
            params.mdcTextField.layout();
        } else {
            element.MDCTextField = new mdc.textField.MDCTextField(element);
            params.boundTo.mdcTextField = element.MDCTextField;
            if (params.hasOwnProperty('useNativeValidation')) {
                if (params.useNativeValidation == false && params.boundTo.hasOwnProperty('isValid')) {
                    params.boundTo.mdcTextField.useNativeValidation = params.useNativeValidation;
                    params.boundTo.isValid.subscribe(function (newValue) {
                        //console.log('isValid subscribe hit', newValue, element);
                        if (newValue === true) {
                            params.boundTo.mdcTextField.valid = true;
                        }
                        if (newValue === false) {
                            params.boundTo.mdcTextField.valid = false;
                        }
                    });
                }
            }
            params.boundTo.mdcTextField.layout();
        }

        $('input', element).on('focus', function () {
            $('input', element).select();
        });

        assignVisibilityCallback(element, function (visible) {
            //console.log('mdcTextField visibleCallback hit', visible, element);
            if (visible) {
                window.setTimeout(function () {
                    if (params.boundTo() != null) {
                        params.boundTo.mdcTextField.label_.float(true);
                        params.boundTo.mdcTextField.getDefaultFoundation().adapter_.notchOutline(params.boundTo.mdcTextField.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                    } else {
                        params.boundTo.mdcTextField.label_.float(false);
                        params.boundTo.mdcTextField.getDefaultFoundation().adapter_.closeOutline();
                    }
                }, 100);
            }
        });
    }
}

ko.bindingHandlers.mdcSelect = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        if (!window.mdc) {
            console.error('mdcSelect binding handler: global mdc was not defined', element)
            return;
        }

        var params = valueAccessor();

        if (ko.isObservable(params)) {
            params.mdcSelect = new mdc.select.MDCSelect(element);
            params.mdcSelect.layout();
        } else {
            params.boundTo.mdcSelect = new mdc.select.MDCSelect(element);
            if (params.hasOwnProperty('useNativeValidation')) {
                if (params.useNativeValidation == false && params.boundTo.hasOwnProperty('isValid')) {
                    params.boundTo.mdcSelect.useNativeValidation = params.useNativeValidation;

                    params.boundTo.isValid.subscribe(function (newValue) {
                        if (newValue === true) {
                            params.boundTo.mdcSelect.valid = true;
                        }
                        if (newValue === false) {
                            params.boundTo.mdcSelect.valid = false;
                        }
                    });
                }
            }
            params.boundTo.mdcSelect.layout();
        }

        params.boundTo.subscribe(function (newValue) {
            if (newValue != null && newValue != '') {
                if (!$(params.boundTo.mdcSelect.label_.root_).hasClass('mdc-floating-label--float-above')) {
                    window.setTimeout(function () {
                        params.boundTo.mdcSelect.label_.float(true);
                        params.boundTo.mdcSelect.getDefaultFoundation().adapter_.notchOutline(params.boundTo.mdcSelect.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                    }, 50);
                }
            } else {
                if ($(params.boundTo.mdcSelect.label_.root_).hasClass('mdc-floating-label--float-above')) {
                    window.setTimeout(function () {
                        params.boundTo.mdcSelect.label_.float(false);
                        params.boundTo.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                    }, 50);
                }
            }
        });

        assignVisibilityCallback(element, function (visible) {
            //console.log('mdcSelectComponent visibleCallback hit', visible, element);
            if (visible) {
                window.setTimeout(function () {
                    if (params.boundTo() != null) {
                        params.boundTo.mdcSelect.label_.float(true);
                        params.boundTo.mdcSelect.getDefaultFoundation().adapter_.notchOutline(params.boundTo.mdcSelect.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                    } else {
                        params.boundTo.mdcSelect.label_.float(false);
                        params.boundTo.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                    }
                }, 100);
            }
        });
    }
}

/** New - see /home/testbed **/

ko.bindingHandlers.mdcTextFieldComponent = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        if (!window.mdc) {
            console.error('mdcTextFieldNew binding handler: global mdc was not defined', element)
            return;
        }

        var params = valueAccessor();

        element.MDCTextField = new mdc.textField.MDCTextField(element);

        params.boundTo.mdcTextField = element.MDCTextField;

        params.boundTo.mdcTextField.useNativeValidation = params.useNativeValidation;

        // legacy
        if (params.hasOwnProperty('disabled')) {
            if (ko.isObservable(params.disabled)) {
                params.disabled.subscribe(function (newValue) {
                    params.boundTo.mdcTextField.disabled = newValue;
                });
            }
            params.boundTo.mdcTextField.disabled = ko.unwrap(params.disabled);
        }

        // newer
        if (params.hasOwnProperty('disable')) {
            if (ko.isObservable(params.disable)) {
                params.disable.subscribe(function (newValue) {
                    params.boundTo.mdcTextField.disabled = newValue;
                });
            }
            params.boundTo.mdcTextField.disabled = ko.unwrap(params.disable);
        }

        // newer
        if (params.hasOwnProperty('enable')) {
            if (ko.isObservable(params.enable)) {
                params.enable.subscribe(function (newValue) {
                    params.boundTo.mdcTextField.disabled = !newValue;
                });
            }
            params.boundTo.mdcTextField.disabled = !ko.unwrap(params.enable);
        }

        if (params.useNativeValidation == false) {
            if (!params.boundTo.hasOwnProperty('isValid')) {
                //console.warn('mdcTextFieldComponent observable has no isValid - did you forget some validation?', element);
            } else {
                params.boundTo.isValid.extend({
                    notify: 'always'
                });
                params.boundTo.isValid.subscribe(function (newValue) {
                    if (newValue === true) {
                        params.boundTo.mdcTextField.valid = true;
                        //params.boundTo.mdcTextField.root_.classList.remove("shake");
                    }
                    if (newValue === false) {
                        params.boundTo.mdcTextField.valid = false;
                        if (params.label) {
                            if (!$(params.boundTo.mdcTextField.label_.root_).hasClass('mdc-floating-label--float-above')) {
                                params.boundTo.mdcTextField.label_.shake(true);
                            }
                        } else {
                            //params.boundTo.mdcTextField.root_.classList.add("shake");
                            //window.setTimeout(() => {
                            //    params.boundTo.mdcTextField.root_.classList.remove("shake");
                            //}, 150);
                        }
                    }
                });
            }
        }

        params.boundTo.subscribe(function (newValue) {
            if (newValue === '') {
                newValue = null;
            }
            if (newValue != null) {
                if (!$(params.boundTo.mdcTextField.label_.root_).hasClass('mdc-floating-label--float-above')) {
                    //window.setTimeout(function () {
                    params.boundTo.mdcTextField.label_.float(true);
                    params.boundTo.mdcTextField.getDefaultFoundation().adapter_.notchOutline(params.boundTo.mdcTextField.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                    //}, 50);
                }
            } else {
                if ($(params.boundTo.mdcTextField.label_.root_).hasClass('mdc-floating-label--float-above')) {
                    //window.setTimeout(function () {
                    params.boundTo.mdcTextField.label_.float(false);
                    params.boundTo.mdcTextField.getDefaultFoundation().adapter_.closeOutline();
                    //}, 50);
                }
            }
        });

        //if (params.boundTo() != null) {
        //    // We're starting with some value; float the label!
        //    params.boundTo.mdcTextField.label_.float(true);
        //}

        //window.setTimeout(function () {
        //    params.boundTo.mdcTextField.layout();
        //}, 0);

        assignVisibilityCallback(element, function (visible) {
            //console.log('mdcTextField visibleCallback hit', visible, element);
            if (visible) {
                window.setTimeout(function () {
                    if (params.boundTo() != null && params.boundTo() !== '') {
                        params.boundTo.mdcTextField.label_.float(true);
                        params.boundTo.mdcTextField.getDefaultFoundation().adapter_.notchOutline(params.boundTo.mdcTextField.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                    } else {
                        params.boundTo.mdcTextField.label_.float(false);
                        params.boundTo.mdcTextField.getDefaultFoundation().adapter_.closeOutline();
                    }
                }, 100);
            }
        });

        $('input', element).on('focus', function () {
            $('input', element).select();
        });
    }
}


ko.bindingHandlers.mdcTextFieldComponentNoOutline = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        if (!window.mdc) {
            console.error('mdcTextFieldComponentNoOutline binding handler: global mdc was not defined', element)
            return;
        }

        var params = valueAccessor();

        element.MDCTextField = new mdc.textField.MDCTextField(element);

        params.boundTo.mdcTextField = element.MDCTextField;

        params.boundTo.mdcTextField.useNativeValidation = params.useNativeValidation;

        // legacy
        if (params.hasOwnProperty('disabled')) {
            if (ko.isObservable(params.disabled)) {
                params.disabled.subscribe(function (newValue) {
                    params.boundTo.mdcTextField.disabled = newValue;
                });
            }
            params.boundTo.mdcTextField.disabled = ko.unwrap(params.disabled);
        }

        // newer
        if (params.hasOwnProperty('disable')) {
            if (ko.isObservable(params.disable)) {
                params.disable.subscribe(function (newValue) {
                    params.boundTo.mdcTextField.disabled = newValue;
                });
            }
            params.boundTo.mdcTextField.disabled = ko.unwrap(params.disable);
        }

        // newer
        if (params.hasOwnProperty('enable')) {
            if (ko.isObservable(params.enable)) {
                params.enable.subscribe(function (newValue) {
                    params.boundTo.mdcTextField.disabled = !newValue;
                });
            }
            params.boundTo.mdcTextField.disabled = !ko.unwrap(params.enable);
        }

        if (params.useNativeValidation == false) {
            if (!params.boundTo.hasOwnProperty('isValid')) {
                //console.warn('mdcTextFieldComponent observable has no isValid - did you forget some validation?', element);
            } else {
                params.boundTo.isValid.extend({
                    notify: 'always'
                });
                params.boundTo.isValid.subscribe(function (newValue) {
                    if (newValue === true) {
                        params.boundTo.mdcTextField.valid = true;
                        $(params.boundTo.DOMElement).removeClass('alert-danger');
                    }
                    if (newValue === false) {
                        params.boundTo.mdcTextField.valid = false;
                        $(params.boundTo.DOMElement).addClass('alert-danger');
                    }
                });
            }
        }

        $('input', element).on('focus', function () {
            $('input', element).select();
        });
    }
}


ko.bindingHandlers.mdcCheckboxComponent = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        if (!window.mdc) {
            console.error('mdcCheckBoxComponent binding handler: global mdc was not defined', element)
            return;
        }

        var params = valueAccessor();

        element.MDCheckbox = new mdc.checkbox.MDCCheckbox(element);

        params.observable.mdcCheckbox = element.MDCheckbox;

        params.observable.DOMElement = $(element).find('input[type="checkbox"]');

        params.observable.mdcCheckbox.useNativeValidation = params.useNativeValidation;

        params.observable.formField = new mdc.formField.MDCFormField($(element).parent()[0]);
        params.observable.formField.input = params.observable.mdcCheckbox;

        if (params.useNativeValidation == false) {
            if (!params.observable.hasOwnProperty('isValid')) {
                //console.warn('mdcTextFieldComponent observable has no isValid - did you forget some validation?', element);
            } else {
                params.observable.isValid.extend({
                    notify: 'always'
                });
                params.observable.isValid.subscribe(function (newValue) {
                    if (newValue === true) {
                        params.observable.mdcCheckbox.valid = true;
                        $(element).removeClass('mdc-checkbox-error');
                    }
                    if (newValue === false) {
                        params.observable.mdcCheckbox.valid = false;
                        $(element).addClass('mdc-checkbox-error');
                        params.observable.mdcCheckbox.ripple_.foundation_.animateActivation_()
                    }
                });
            }
        }
    }
}

ko.bindingHandlers.mdcSelectComponent = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        if (!window.mdc) {
            console.error('mdcSelectComponent binding handler: global mdc was not defined', element)
            return;
        }

        var params = valueAccessor();

        //console.log('init mdcSelectComponent for', $(element).parent());

        element.MDCSelect = new mdc.select.MDCSelect(element);

        params.boundTo.mdcSelect = element.MDCSelect;

        params.boundTo.mdcSelect.useNativeValidation = params.useNativeValidation;

        // legacy
        if (params.hasOwnProperty('disabled')) {
            if (ko.isObservable(params.disabled)) {
                params.disabled.subscribe(function (newValue) {
                    params.boundTo.mdcSelect.disabled = newValue;
                });
            }
            params.boundTo.mdcSelect.disabled = ko.unwrap(params.disabled);
        }

        // newer
        if (params.hasOwnProperty('disable')) {
            if (ko.isObservable(params.disable)) {
                params.disable.subscribe(function (newValue) {
                    params.boundTo.mdcTextField.disabled = newValue;
                });
            }
            params.boundTo.mdcTextField.disabled = ko.unwrap(params.disable);
        }

        // newer
        if (params.hasOwnProperty('enable')) {
            if (ko.isObservable(params.enable)) {
                params.enable.subscribe(function (newValue) {
                    params.boundTo.mdcTextField.disabled = !newValue;
                });
            }
            params.boundTo.mdcTextField.disabled = !ko.unwrap(params.enable);
        }

        if (params.useNativeValidation == false) {
            if (!params.boundTo.hasOwnProperty('isValid')) {
                //console.warn('mdcSelectComponent observable has no isValid - did you forget some validation?', element);
            } else {
                params.boundTo.isValid.extend({
                    notify: 'always'
                });
                params.boundTo.isValid.subscribe(function (newValue) {
                    if (newValue === true) {
                        params.boundTo.mdcSelect.valid = true;
                    }
                    if (newValue === false) {
                        params.boundTo.mdcSelect.valid = false;
                        // this works but it looks wrong if the label is already floated...
                        // can we get isFloating?
                        if (params.boundTo.mdcSelect.label_) {
                            if (!$(params.boundTo.mdcSelect.label_.root_).hasClass('mdc-floating-label--float-above')) {
                                params.boundTo.mdcSelect.label_.shake(true);
                            }
                        }
                    }
                });
            }
        }

        params.boundTo.subscribe(function (newValue) {
            if (params.boundTo.mdcSelect.label_) {
                if (newValue != null && newValue !== '') {
                    if (!$(params.boundTo.mdcSelect.label_.root_).hasClass('mdc-floating-label--float-above')) {
                        window.setTimeout(function () {
                            params.boundTo.mdcSelect.label_.float(true);
                            params.boundTo.mdcSelect.getDefaultFoundation().adapter_.notchOutline(params.boundTo.mdcSelect.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                        }, 50);
                    }
                } else {
                    if ($(params.boundTo.mdcSelect.label_.root_).hasClass('mdc-floating-label--float-above')) {
                        window.setTimeout(function () {
                            params.boundTo.mdcSelect.label_.float(false);
                            params.boundTo.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                        }, 50);
                    }
                }
            }
        });

        //if (params.boundTo()) {
        //    params.boundTo.mdcSelect.label_.float(true);
        //}

        //window.setTimeout(function () {
        //    params.boundTo.mdcSelect.layout();
        //}, 0);

        assignVisibilityCallback(element, function (visible) {
            //console.log('mdcSelectComponent visibleCallback hit', visible, element);
            if (visible) {
                window.setTimeout(function () {
                    if (params.boundTo() != null && params.boundTo() !== '') {
                        if (params.boundTo.mdcSelect.label_) {
                            if (params.boundTo().hasOwnProperty(params.optionsValue)) {
                                if (params.boundTo()[params.optionsValue] != null) {
                                    params.boundTo.mdcSelect.label_.float(true);
                                    params.boundTo.mdcSelect.getDefaultFoundation().adapter_.notchOutline(params.boundTo.mdcSelect.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                                } else {
                                    params.boundTo.mdcSelect.label_.float(false);
                                    params.boundTo.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                                }
                            } else {
                                if (params.boundTo() != null) {
                                    params.boundTo.mdcSelect.label_.float(true);
                                    params.boundTo.mdcSelect.getDefaultFoundation().adapter_.notchOutline(params.boundTo.mdcSelect.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                                } else {
                                    params.boundTo.mdcSelect.label_.float(false);
                                    params.boundTo.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                                }
                            }
                        }
                    }
                }, 100);
            }
        });
    }
}

ko.bindingHandlers.mdcSelectComponentNoOutline = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        if (!window.mdc) {
            console.error('mdcSelectComponentNoOutline binding handler: global mdc was not defined', element)
            return;
        }

        var params = valueAccessor();

        element.MDCSelect = new mdc.select.MDCSelect(element);

        params.boundTo.mdcSelect = element.MDCSelect;

        params.boundTo.mdcSelect.useNativeValidation = params.useNativeValidation;

        // legacy
        if (params.hasOwnProperty('disabled')) {
            if (ko.isObservable(params.disabled)) {
                params.disabled.subscribe(function (newValue) {
                    params.boundTo.mdcSelect.disabled = newValue;
                });
            }
            params.boundTo.mdcSelect.disabled = ko.unwrap(params.disabled);
        }

        // newer
        if (params.hasOwnProperty('disable')) {
            if (ko.isObservable(params.disable)) {
                params.disable.subscribe(function (newValue) {
                    params.boundTo.mdcTextField.disabled = newValue;
                });
            }
            params.boundTo.mdcTextField.disabled = ko.unwrap(params.disable);
        }

        // newer
        if (params.hasOwnProperty('enable')) {
            if (ko.isObservable(params.enable)) {
                params.enable.subscribe(function (newValue) {
                    params.boundTo.mdcTextField.disabled = !newValue;
                });
            }
            params.boundTo.mdcTextField.disabled = !ko.unwrap(params.enable);
        }

        if (params.useNativeValidation == false) {
            if (!params.boundTo.hasOwnProperty('isValid')) {
                //console.warn('mdcSelectComponentNoOutline observable has no isValid - did you forget some validation?', element);
            } else {
                params.boundTo.isValid.extend({
                    notify: 'always'
                });
                params.boundTo.isValid.subscribe(function (newValue) {
                    if (newValue === true) {
                        params.boundTo.mdcSelect.valid = true;
                        $(params.boundTo.DOMElement).removeClass('alert-danger');
                    }
                    if (newValue === false) {
                        params.boundTo.mdcSelect.valid = false;
                        $(params.boundTo.DOMElement).addClass('alert-danger');
                    }
                });
            }
        }
    }
}


ko.bindingHandlers.mdcMultiSelectComponent = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        if (!window.mdc) {
            console.error('mdcMultiSelectComponent binding handler: global mdc was not defined', element)
            return;
        }

        var params = valueAccessor();

        //console.log('init mdcMultiSelectComponent for', $(element).parent());

        element.MDCSelect = new mdc.select.MDCSelect(element);

        params.boundTo.mdcSelect = element.MDCSelect;

        params.boundTo.mdcSelect.useNativeValidation = params.useNativeValidation;

        if (typeof params.widget === 'function') {
            if (params.widget()) {
                params.widget().input[0].addEventListener('blur', (e) => {
                    if (!params.boundTo().length && !params.widget().input[0].value) {
                        params.boundTo.mdcSelect.label_.float(false);
                        params.boundTo.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                    }
                });
                params.widget().input[0].addEventListener('keyup', (e) => {
                    if (params.widget().input[0].value) {
                        params.boundTo.mdcSelect.label_.float(true);
                        params.boundTo.mdcSelect.getDefaultFoundation().adapter_.notchOutline(params.boundTo.mdcSelect.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                    } else if (!params.boundTo().length) {
                        params.boundTo.mdcSelect.label_.float(false);
                        params.boundTo.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                    }
                });
            } else {
                params.widget.subscribe(nv => {
                    params.widget().input[0].addEventListener('blur', (e) => {
                        if (!params.boundTo().length && !params.widget().input[0].value) {
                            params.boundTo.mdcSelect.label_.float(false);
                            params.boundTo.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                        }
                    });
                    nv.input[0].addEventListener('keyup', (e) => {
                        if (params.widget().input[0].value) {
                            params.boundTo.mdcSelect.label_.float(true);
                            params.boundTo.mdcSelect.getDefaultFoundation().adapter_.notchOutline(params.boundTo.mdcSelect.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                        } else if (!params.boundTo().length) {
                            params.boundTo.mdcSelect.label_.float(false);
                            params.boundTo.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                        }
                    });
                });
            }
        }

        if (params.useNativeValidation == false) {
            if (!params.hasOwnProperty('validate')) {
                //console.warn('mdcMultiSelectComponent params had no validate property', element);
            } else {
                if (!params.validate.hasOwnProperty('isValid')) {
                    //console.warn('mdcMultiSelectComponent params.validate had no isValid property', element);
                } else {
                    params.validate.isValid.extend({
                        notify: 'always'
                    });
                    params.validate.isValid.subscribe(function (newValue) {
                        if (newValue === true) {
                            params.boundTo.mdcSelect.valid = true;
                        }
                        if (newValue === false) {
                            params.boundTo.mdcSelect.valid = false;
                            if (!$(params.boundTo.mdcSelect.label_.root_).hasClass('mdc-floating-label--float-above')) {
                                params.boundTo.mdcSelect.label_.shake(true);
                            }
                        }
                    });
                }
            }
        }

        params.boundTo.subscribe(function (newValue) {
            if (newValue.length) {
                if (!$(params.boundTo.mdcSelect.label_.root_).hasClass('mdc-floating-label--float-above')) {
                    window.setTimeout(function () {
                        params.boundTo.mdcSelect.label_.float(true);
                        params.boundTo.mdcSelect.getDefaultFoundation().adapter_.notchOutline(params.boundTo.mdcSelect.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                    }, 50);
                }
            } else {
                if ($(params.boundTo.mdcSelect.label_.root_).hasClass('mdc-floating-label--float-above')) {
                    window.setTimeout(function () {
                        params.boundTo.mdcSelect.label_.float(false);
                        params.boundTo.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                    }, 50);
                }
            }
        });

        assignVisibilityCallback(element, function (visible) {
            //console.log('mdcMultiSelectComponent visibleCallback hit', visible, element);
            if (visible) {
                window.setTimeout(function () {
                    if (params.boundTo() != null) {
                        if (params.boundTo().length) {
                            params.boundTo.mdcSelect.label_.float(true);
                            params.boundTo.mdcSelect.getDefaultFoundation().adapter_.notchOutline(params.boundTo.mdcSelect.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                        }
                    } else {
                        params.boundTo.mdcSelect.label_.float(false);
                        params.boundTo.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                    }
                }, 100);
            }
        });
    }
}


ko.bindingHandlers.mdcBootstrapDateTimePicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        if (!window.mdc) {
            console.error('bootstrapDateTimePicker binding handler: global mdc was not defined', element)
            return;
        }

    }
}

ko.bindingHandlers.intlMobile = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var params = valueAccessor();

        params.phone.intlTel = window.intlTelInput(element, {
            utilsScript: '/Scripts/int-tel/utils.js',
            dropdownContainer: document.body,
            initialCountry: params.country() ? params.country().Code : undefined,
            preferredCountries: params.preferredCountries,
            autoPlaceholder: params.autoPlaceholder || 'polite',
            placeholderNumberType: params.placeholderNumberType || 'MOBILE'
        });

        let country = params.phone.intlTel.getSelectedCountryData();
        let typeDesc = params.numberType === intlTelInputUtils.numberType.MOBILE ? 'Mobile' : 'Landline';

        params.phone.numberFormat = ko.observable(`${country.name} ${typeDesc} Number Format: ${element.placeholder}`);

        element.addEventListener("countrychange", function () {
            country = params.phone.intlTel.getSelectedCountryData();
            if (params.hasOwnProperty('country')) {
                params.country(country.iso2.toUpperCase());
            }
            params.phone.numberFormat(`${country.name} ${typeDesc} Number Format: ${element.placeholder}`);
            params.phone.valueHasMutated();
        });

        params.phone.subscribe(function (newValue) {
            if (params.phone.hasOwnProperty('isValid')) {
                params.phone.isValid.notifySubscribers(true);
            }
        });

        if (params.numberType != null) {

            if (typeof params.validateNow === 'undefined') {
                params.validateNow = ko.observable(true);
            }

            params.phone.numberTypeValid = ko.computed(function () {
                let val = params.phone();
                let validateNow = params.validateNow();
                if (val && validateNow) {
                    if (params.numberType === intlTelInputUtils.numberType.MOBILE) {
                        if ((params.phone.intlTel.getNumberType() == params.numberType) ||
                            (params.phone.intlTel.getNumberType() == intlTelInputUtils.numberType.FIXED_LINE_OR_MOBILE)) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        if (params.phone.intlTel.getNumberType() != intlTelInputUtils.numberType.MOBILE) {
                            if (params.phone.intlTel.getNumberType() == -1 ||
                                Enumerable.From(intlTelInputUtils.numberType).Select('$.Value').ToArray().indexOf(params.phone.intlTel.getNumberType()) == -1)
                                return false;
                            else
                                return params.phone.intlTel.getNumberType() != intlTelInputUtils.numberType.MOBILE;
                        } else {
                            return false;
                        }
                    }
                } else {
                    return true;
                }
            }).extend({
                equal: {
                    params: true,
                    onlyIf: function () {
                        return params.validateNow();
                    },
                    message: function () {
                        var num = params.phone();

                        var thisType = params.phone.intlTel.getNumberType() === intlTelInputUtils.numberType.MOBILE ? ' mobile' : ' landline';

                        if (params.phone.intlTel.getNumberType() == -1 ||
                            Enumerable.From(intlTelInputUtils.numberType).Select('$.Value').ToArray().indexOf(params.phone.intlTel.getNumberType()) == -1)
                            thisType = 'n unrecognised';

                        var demandedType = params.numberType === intlTelInputUtils.numberType.MOBILE ? ' mobile' : ' landline';

                        if (params.phone.hasOwnProperty('isValid')) {
                            params.phone.isValid.notifySubscribers(false);
                        }

                        return `A ${demandedType} number is required. You have provided a${thisType} number.`
                    }
                }
            });
        } else {
            params.phone.numberTypeValid = ko.observable();
        }
    }
}


///// https://github.com/thinkloop/knockout-js-infinite-scroll/blob/master/knockout-js-infinite-scroll.js
//// cheeeers
//(function (factory) {
//    // Module systems magic dance.

//    /* istanbul ignore next - (code coverage ignore) */
//    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
//        // CommonJS or Node: hard-coded dependency on "knockout"
//        factory(require("knockout"), exports);
//    } else if (typeof define === "function" && define["amd"]) {
//        // AMD anonymous module with hard-coded dependency on "knockout"
//        define(["knockout", "exports"], factory);
//    } else {
//        // <script> tag: use the global `ko` object
//        factory(ko, {});
//    }
//}(function (ko, exports) {
ko.extenders.infiniteScroll = function (target, args) {
    var props = {};

    target.infiniteScroll = props;

    props.numPagesPadding = ko.observable(parseFloat(args.numPagesPadding) || 1);

    // dimensions
    props.viewportWidth = ko.observable(-1);
    props.viewportHeight = ko.observable(-1);

    props.itemWidth = ko.observable(args.itemWidth || -1);
    props.itemHeight = ko.observable(args.itemHeight || -1);

    props.scrollY = ko.observable(0);

    // if using the main browser scroller to scroll a container that is not 100% tall,
    // the gap between the scroller height and div height is the scrollYOffset in px.
    props.scrollYOffset = ko.observable(0);

    // calculations
    props.numColsPerPage = ko.computed(function () {
        if (args.numColsPerPage)
            return args.numColsPerPage
        else
            var viewportWidth = parseInt(props.viewportWidth()),
                itemWidth = parseInt(props.itemWidth()) || -1;
        return Math.max(Math.floor(viewportWidth / itemWidth), 0);
    });
    props.numRowsPerPage = ko.computed(function () {
        if (args.numRowsPerPage)
            return args.numRowsPerPage
        else
            var viewportHeight = parseInt(props.viewportHeight()),
                itemHeight = parseInt(props.itemHeight()) || -1;
        return Math.max(Math.ceil(viewportHeight / itemHeight), 0);
    });
    props.numItemsPerPage = ko.computed(function () {
        var numColsPerPage = parseInt(props.numColsPerPage()),
            numRowsPerPage = parseInt(props.numRowsPerPage());
        return numColsPerPage * numRowsPerPage;
    });
    props.numItemsPadding = ko.computed(function () {
        var numItemsPerPage = props.numItemsPerPage(),
            numPagesPadding = props.numPagesPadding(),
            numColsPerPage = props.numColsPerPage();
        return Math.max(Math.floor(numItemsPerPage * numPagesPadding / numColsPerPage) * numColsPerPage, 0);
    });
    props.firstVisibleIndex = ko.computed(function () {
        var scrollY = parseInt(props.scrollY()),
            scrollYOffset = parseInt(props.scrollYOffset()),
            itemHeight = parseInt(props.itemHeight()) || -1,
            numColsPerPage = props.numColsPerPage();
        return Math.max(Math.floor((scrollY - scrollYOffset) / itemHeight) * numColsPerPage, 0);
    });
    props.lastVisibleIndex = ko.computed(function () {
        return props.firstVisibleIndex() + props.numItemsPerPage() - 1;
    });
    props.firstHiddenIndex = ko.computed(function () {
        return Math.max(props.firstVisibleIndex() - 1 - props.numItemsPadding(), 0);
    });
    props.lastHiddenIndex = ko.computed(function () {
        return Math.min(props.lastVisibleIndex() + 1 + props.numItemsPadding(), target().length);
    });
    props.heightBefore = ko.computed(function () {
        return Math.max(props.firstHiddenIndex() / props.numColsPerPage() * props.itemHeight(), 0);
    });
    props.heightAfter = ko.computed(function () {
        return Math.max(((target().length - 1 - props.lastHiddenIndex()) / props.numColsPerPage()) * props.itemHeight(), 0);
    });

    // display items
    props.displayItems = ko.observableArray([]);
    ko.computed(function () {
        var oldDisplayItems = props.displayItems.peek(),
            newDisplayItems = target.slice(0, props.lastHiddenIndex());

        if (oldDisplayItems.length !== newDisplayItems.length) {
            props.displayItems(newDisplayItems);
            return;
        }

        // if collections are not identical, skip, replace with new items
        for (var i = newDisplayItems.length - 1; i >= 0; i--) {
            if (newDisplayItems[i] !== oldDisplayItems[i]) {
                props.displayItems(newDisplayItems);
                return;
            }
        }
    });
};
//}));

// http://www.knockmeout.net/2012/05/quick-tip-skip-binding.html Thanks again, Ryan.
ko.bindingHandlers.stopBinding = {
    init: function () {
        return { controlsDescendantBindings: true };
    }
};

ko.virtualElements.allowedBindings.stopBinding = true;

ko.bindingHandlers.matrixLoader = {
    init: function (element, valueAccessor, allBindingsAccessor) {

        var self = $.extend(ko.unwrap(valueAccessor()), {});

        self.parent = $(element).parent()[0];

        self.resize = function () {
            self.determineSize();
            self.reset();
        }

        window.addEventListener('resize', self.resize);

        self.visible.subscribe(function (newValue) {
            if (newValue) {
                self.startAnimating();
            } else {
                self.reset();
            }
        });

        //0x2744 snowflake...?
        self.newCharArray = function () {//U+26F7
            //Spring
            return [
                String.fromCodePoint(0x1F490), // Bouquet of flowers
                String.fromCodePoint(0x1F994), // Hedgehog
                String.fromCodePoint(0x1F338), // Pink flower
                String.fromCodePoint(0x1F407), // White rabbit
                String.fromCodePoint(0x1F33C), // Daisy
                String.fromCodePoint(0x1F343), // Leaf
                String.fromCodePoint(0x1F331), // Sprouting seedling
                String.fromCodePoint(0x1F337), // Tulip
                String.fromCodePoint(0x1F423), // Chick hatching
                String.fromCodePoint(0x1F340)  // Four-leaf clover
            ]

            //Winter
            //return [String.fromCodePoint(0x1F341), String.fromCodePoint(0x1F342), String.fromCodePoint(0x1F343), String.fromCodePoint(0x2614), String.fromCodePoint(0x1F36C), String.fromCodePoint(0x26C4), String.fromCodePoint(0x1F3BF), String.fromCodePoint(0x1F3C2), String.fromCodePoint(0x2B50)]

            //Christmas
            //return [String.fromCodePoint(0x2744),
            //    String.fromCodePoint(0x26C4),
            //    String.fromCodePoint(0x1F381),
            //    String.fromCodePoint(0x1F380), // ribbon
            //    String.fromCodePoint(0x1F384), // christmas tree
            //    String.fromCodePoint(0x2B50),
            //    String.fromCodePoint(0x1F385),
            //    String.fromCodePoint(0x1F98C),
            //    String.fromCodePoint(0x1F328),
            //    String.fromCodePoint(0x1F384), // christmas tree
            //    String.fromCodePoint(0x2603),
            //    String.fromCodePoint(0x1F941), // drum
            //    String.fromCodePoint(0x26C4),
            //    String.fromCodePoint(0x2728),
            //    String.fromCodePoint(0x1F56F), // candle
            //    String.fromCodePoint(0x1F384), // christmas tree
            //    String.fromCodePoint(0x1F514), // bell
            //    String.fromCodePoint(0x1F370)
            //]

            //Valentine's
            //return [String.fromCodePoint(0x1F970), // smiling face with hearts
            //String.fromCodePoint(0x1F3F5), // yellow rosette
            //String.fromCodePoint(0x1F490), // bouquet
            //String.fromCodePoint(0x1F490), // bouquet
            //String.fromCodePoint(0x1F490), // bouquet
            //String.fromCodePoint(0x1F337), // tuplip
            //String.fromCodePoint(0x1F33C), // daisy
            //String.fromCodePoint(0x1F380), // ribbon
            //String.fromCodePoint(0x1F33A), // hibiscus
            //String.fromCodePoint(0x1F36D), // lollipop
            //String.fromCodePoint(0x2764), // red heart
            //String.fromCodePoint(0x1F9E1), // orange heart
            //String.fromCodePoint(0x1F49B), // yellow heart
            //String.fromCodePoint(0x1F49A), // green heart
            //String.fromCodePoint(0x1F499), // blue heart
            //String.fromCodePoint(0x1F49C),  // purple heart
            //String.fromCodePoint(0x1F49D), // heart with ribbon
            //String.fromCodePoint(0x1F498), // heart with arrow
            //String.fromCodePoint(0x1F49F), // heart decoration
            //String.fromCodePoint(0x1F49E), // revolving hearts
            //]

            /*
             
Lianne's contribution:
Summer theme
bg #1ca9c9
*/
            //return [
            //    String.fromCodePoint(0x1F60E), //smiling face w / sunglasses
            //    String.fromCodePoint(0x1F33B), //sunflower
            //    String.fromCodePoint(0x1F334), //palm tree
            //    String.fromCodePoint(0x1F34D), //pineapple
            //    String.fromCodePoint(0x1F965), //coconut
            //    String.fromCodePoint(0x1F3C4), //person surfing
            //    String.fromCodePoint(0x1F42C), //dolphin
            //    String.fromCodePoint(0x1F41A), //spiral seashell
            //    String.fromCodePoint(0x1F98B), //butterfly
            //    String.fromCodePoint(0x2708), //aeroplane
            //    String.fromCodePoint(0x2600), //sun
            //    String.fromCodePoint(0x1F30A), //cresting wave
            //    String.fromCodePoint(0x1F453), //glasses
            //    String.fromCodePoint(0x1F366), //ice cream cone
            //    String.fromCodePoint(0x1F379), //tropical drink
            //    String.fromCodePoint(0x1F3D6), //beach w / umbrella
            //    String.fromCodePoint(0x1F3DD), //desert island
            //    String.fromCodePoint(0x1F9A9), //flamingo
            //    String.fromCodePoint(0x1F99C), //parrot
            //]

            /*
            Jubilee theme
            String.fromCodePoint(0x1F482), // beefeater
            String.fromCodePoint(0x1F451), // crown
            String.fromCodePoint(0x1F48E), // gem (diamond?)
            String.fromCodePoint(0x1F478), // princess (queen)
            */

            //Summer
            //return [String.fromCodePoint(0x1F31E), String.fromCodePoint(0x1F33B), String.fromCodePoint(0x1F3BE), String.fromCodePoint(0x1F349), String.fromCodePoint(0x1F353), String.fromCodePoint(0x1F343), String.fromCodePoint(0x1F33E), String.fromCodePoint(0x1F337), String.fromCodePoint(0x1F425), String.fromCodePoint(0x1F3CF)]

            // Autumn
            //return [String.fromCodePoint(0x1F341), String.fromCodePoint(0x1F342), String.fromCodePoint(0x1F343), String.fromCodePoint(0x1F480), String.fromCodePoint(0x1F383), String.fromCodePoint(0x1F47B), String.fromCodePoint(0x2614), String.fromCodePoint(0x1F987), String.fromCodePoint(0x1F36C), String.fromCodePoint(0x1F578), String.fromCodePoint(0x1F577)]

            // Halloween
            //return [String.fromCodePoint(0x1F341), String.fromCodePoint(0x1F342), String.fromCodePoint(0x1F343), String.fromCodePoint(0x1F480), String.fromCodePoint(0x1F383), String.fromCodePoint(0x1F47B), String.fromCodePoint(0x2614), String.fromCodePoint(0x1F987), String.fromCodePoint(0x1F36C), String.fromCodePoint(0x1F578), String.fromCodePoint(0x1F577)]

            //return [String.fromCodePoint(0x1F337), String.fromCodePoint(0x1F33C), String.fromCodePoint(0x1F33A), String.fromCodePoint(0x1F98B), String.fromCharCode(0x2734), String.fromCharCode(0x2747), String.fromCharCode(0x2734), String.fromCharCode(0x2600), String.fromCharCode(0x2B50)]

            //return [...Array(Math.round(1))].map(() => String.fromCharCode(0x2744));
            //return [...Array(Math.round(60))].map(() => String.fromCharCode(0x1F030 + Math.random() * (0x1F3BE - 0x0460 + 1)));
        }

        self.canvas = element;
        self.ctx = self.canvas.getContext('2d');

        self.canvas2 = $(self.canvas).parent().find('canvas').last()[0];
        self.ctx2 = self.canvas2.getContext('2d');
        self.ctx2cache = [];

        self.charArr = self.newCharArray();
        self.fallingCharArr = [];
        self.fontSize = 48;
        self.fpsInterval = 1000 / 120;
        self.then = null;
        self.startTime = null;

        self.reset = function () {

            //self.ctx.fillStyle = "#020202"; // black
            //self.ctx.fillStyle = "rgba(0,0,0,0.25)";

            //self.ctx.fillStyle = "#da5e04"; // autumn (bright)
            //self.ctx.fillStyle = '#c86e2d'; // autumn (darker)
            //self.ctx.fillStyle = "#f0b447"; // autumn (golden yellow)

            //self.ctx.fillStyle = "#66b8ff"; //winter
            //self.ctx.fillStyle = "#ffbbd7"; //valentine's (pink)
            //self.ctx.fillStyle = '#f8c9dd'; // spring (pink)
            self.ctx.fillStyle = '#53bfea'; // spring (sky blue)
            //self.ctx.fillStyle = '#c1e0ff'; // summer
            //self.ctx.fillStyle = '#1ca9c9'; // summer, Lianne's Pacific Ocean Blue

            self.ctx.clearRect(0, 0, self.cw, self.ch);
            self.ctx.fillRect(0, 0, self.cw, self.ch);

            self.ctx2.fillStyle = "rgba(255,255,255,1.0)";
            self.ctx2.clearRect(0, 0, self.cw, self.ch);
            self.ctx2.fillRect(0, 0, self.cw, self.ch);

            self.charArr = self.newCharArray();
            self.fallingCharArr = [];

            //self.cw = $(self.parent).closest('.modal-body').outerWidth();
            //self.ch = $(self.parent).closest('.modal-body').outerHeight();

            //if (self.canvas.width == 0) {
            //self.canvas.width = self.cw;
            //self.canvas.height = self.ch;
            //self.canvas.width = self.canvas2.width = self.cw;
            //self.canvas.height = self.canvas2.height = self.ch;
            //}

            console.log('matrixLoader resetting, charCount: ', self.maxColumns);

            for (var i = 0; i < self.maxColumns; i++) {
                self.fallingCharArr.push(new self.Point(i * self.fontSize, self.randomFloat(-500, 0)));
            }

            self.drawCharArrayToCanvas2();

            let imagePromises = self.fallingCharArr.map((fca, i) => {
                return createImageBitmap(self.ctx2.getImageData(i * (self.textWidth), 0, self.textWidth, self.textHeight));
            });

            Promise.all(imagePromises).then(images => {
                self.ctx2cache = images;
            });
        }

        self.randomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        self.randomFloat = function (min, max) {
            return Math.random() * (max - min) + min;
        }

        self.Point = function (x, y) {
            this.charIndex = self.randomInt(0, self.charArr.length);
            this.x = x;
            this.originalX = x;
            this.y = y;
            this.ySpeed = self.randomFloat(2, 3.5);
            this.value = self.charArr[this.charIndex];//.toUpperCase();
            this.xSpeed = self.randomInt(-1.5, 1.5);
            this.rotation = self.randomFloat(-(Math.PI / 45), (Math.PI / 45));
        }

        self.textHeightOffset = 0;
        self.textWidth = 48;
        self.textHeight = 48;

        self.canvas3 = document.createElement('canvas');
        self.ctx3 = self.canvas3.getContext('2d');

        self.canvas.parentElement.appendChild(self.canvas3);

        //self.putImageDataCalls = 0;

        self.Point.prototype.draw = function () {

            let imageBitmap = self.ctx2cache[this.charIndex];

            if (this.value == String.fromCodePoint(0x2744)) {
                self.ctx.translate(this.x, this.y);
                self.ctx.setTransform(1, 0, 0, 1, this.x - self.imageWidth * 2, this.y - self.textHeight * 2);
                self.ctx.rotate(this.rotation);
            }
            else {
                self.ctx.setTransform(1, 0, 0, 1, 0, 0);
            }

            self.ctx.drawImage(imageBitmap, this.x, this.y);

            if (this.xSpeed > 0) {
                this.xSpeed -= (this.ySpeed);
            } else {
                this.xSpeed += (this.ySpeed);
            }

            if (this.rotation > 0) {
                this.rotation += (this.ySpeed / 400);
            } else {
                this.rotation -= (this.ySpeed / 400);
            }

            this.x += this.xSpeed;
            this.y += this.ySpeed;

            if (this.y > self.ch || this.x > self.cw) {
                this.x = this.originalX;
                this.y = self.randomFloat(-50, 0);
                this.ySpeed = self.randomFloat(2, 3.5);
            }

            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
        }

        for (var i = 0; i < self.maxColumns; i++) {
            self.fallingCharArr.push(new self.Point(i * self.fontSize, self.randomFloat(-500, 0)));
        }

        self.drawCharArrayToCanvas2 = function () {
            self.ctx2.fillStyle = "#020202";
            self.ctx2.clearRect(0, 0, self.cw, self.ch);

            var ca = self.newCharArray().join('');

            // ta https://stackoverflow.com/questions/56814735/origin-point-for-html5-canvas-filltext#answer-68077015
            let groupMetrics = self.ctx2.measureText(ca);

            self.textHeightOffset = groupMetrics.actualBoundingBoxAscent + groupMetrics.actualBoundingBoxDescent;

            let c = self.newCharArray();

            for (var i = 0; i < c.length; i++) {
                self.ctx2.fillText(c[i], i * self.textWidth, 0 + self.textHeightOffset - 3);
            }

            let imagePromises = self.fallingCharArr.map((fca, i) => {
                return createImageBitmap(self.ctx2.getImageData(i * (self.textWidth), 0, self.textWidth, self.textHeight));
            });

            Promise.all(imagePromises).then(images => {
                self.ctx2cache = images;
            });
        }

        self.drawCharArrayToCanvas2();

        //self.canvas.width = self.cw;
        //self.canvas.height = self.ch;
        //self.canvas2.width = self.cw;
        //self.canvas2.height = self.ch;

        self.canvas3.width = self.textWidth;
        self.canvas3.height = self.textHeight;

        self.determineSize = function () {
            self.canvas2.width = self.canvas.width = self.canvas.parentElement.clientWidth;
            self.canvas2.height = self.canvas.height = self.canvas.parentElement.clientHeight;

            self.cw = self.canvas.width;
            self.ch = self.canvas.height;

            self.originalWidth = self.cw;
            self.originalHeight = self.ch;

            self.fontSize = 24;

            self.maxColumns = Math.round(((self.cw / self.fontSize) * 100) / 100);

            self.ctx.font = self.fontSize + "px Segoe UI Emoji";
            self.ctx.font = self.fontSize + "px Segoe UI Emoji";
            self.ctx2.font = self.fontSize + "px Segoe UI Emoji";
        }

        self.startAnimating = function () {

            self.determineSize();

            self.reset();

            self.then = window.performance.now();
            self.startTime = self.then;
            self.update(window.performance.now());
        }

        self.frameCount = 0;

        self.update = function (newTime) {
            if (!self.visible())
                return;

            requestAnimationFrame(self.update);

            now = newTime;
            elapsed = now - self.then;

            if (elapsed > self.fpsInterval) {

                self.ctx.fillRect(0, 0, self.cw, self.ch);
                self.ctx2.clearRect(0, 0, self.cw, self.ch);
                self.ctx3.clearRect(0, 0, self.cw, self.ch);

                // with thanks: http://jsfiddle.net/chicagogrooves/nRpVD/2/
                // Get ready for next frame by setting then=now, but...
                // Also, adjust for fpsInterval not being multiple of 16.67
                self.then = now - (elapsed % self.fpsInterval);

                var i = self.fallingCharArr.length;

                while (i--) {
                    self.fallingCharArr[i].draw();
                }

                if (self.visible())
                    requestAnimationFrame(self.update);

                self.frameCount++;

                //console.log(`frame: ${self.frameCount}, putImageData calls: ${self.putImageDataCalls}`);
            }
        }
    }
}

//Cheeeeers: https://stackoverflow.com/questions/19586182/multiple-email-validation-using-ko-observable#answer-19586586
ko.validation.rules['emailList'] = {
    validator: function (val, validate) {
        if (!validate) return true;
        if (ko.validation.utils.isEmptyVal(val)) return true;

        var emailrule = ko.validation.rules['email'];

        var vals = val.split(/\s*[,;]\s*/);
        for (var i = 0; i < vals.length; i++) {
            if (!emailrule.validator(vals[i].trim(), true)) {
                return false;
            }
        }

        return true;
    },
    message: 'Please enter proper comma-separated email addresses'
};
ko.validation.addExtender('emailList');

ko.validation.rules['validJson'] = {
    validator: function (val, validate) {
        if (!validate) return true;
        if (ko.validation.utils.isEmptyVal(val)) return false;

        var result = true;

        try {
            var parsed = JSON.parse(val);
        } catch (e) {
            result = false;
        }

        return result;
    },
    message: 'Invalid JSON detected.'
};
ko.validation.addExtender('validJson');

//Cheeeeers: https://stackoverflow.com/questions/19586182/multiple-email-validation-using-ko-observable#answer-19586586
ko.validation.rules['mustBeEmptyArray'] = {
    validator: function (val, validate) {
        if (!validate) return true;

        let unwrapped = ko.unwrap(val);

        if (!Array.isArray(unwrapped)) return false;

        if (unwrapped.length == 0)
            return true;
        else
            return false;
    },
    message: 'Array must be empty'
};
ko.validation.addExtender('mustBeEmptyArray');

//Cheeeeers: https://stackoverflow.com/questions/19586182/multiple-email-validation-using-ko-observable#answer-19586586
ko.validation.rules['mustNotExistIn'] = {
    validator: function (val, params) {

        let value = ko.unwrap(val);

        let lookIn = ko.unwrap(params.set);

        // chicken and egg problem with this one.
        // we expect to find precisely one entry in the array with this value: the value itself, 
        // because it is a property belonging to an entry already in the array.
        if (lookIn.flatMap(v => ko.unwrap(v[params.propertyName]) == value ? [value] : []).length == 1) {
            return true;
        } else {
            return false;
        }
    },
    message: 'Must not already exist in given array'
};
ko.validation.addExtender('mustNotExistIn');

ko.bindingHandlers.remove = {
    init: function (element) {
        element.remove();
    }
}

ko.bindingHandlers.flexVisible = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        var unwrapped = ko.unwrap(value);
        if (!typeof ko.unwrap(unwrapped.boolean) === 'boolean') {
            console.error('flexVisible bindingHandler error - parameter "boolean" is not a boolean', element, unwrapped);
        }
        if (value) {
            element.style.display = 'flex';
        }
    },
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        if (value) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    }
}

ko.bindingHandlers.flexFadeVisible = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        var unwrapped = ko.unwrap(value);
        if (!typeof ko.unwrap(unwrapped.boolean) === 'boolean') {
            console.error('flexVisible bindingHandler error - parameter "boolean" is not a boolean', element, unwrapped);
        }
        if (value) {
            element.classList.remove('d-none');
            element.classList.add('opacity-100');
            element.style.display = 'flex';
        }
    },
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        if (value) {
            //element.style.display = 'flex';
            element.classList.remove('d-none');
            element.classList.add('d-flex');
            setTimeout(() => {
                element.classList.add('opacity-100');
            }, 0);
        } else {
            element.classList.remove('opacity-100');
            setTimeout(() => {
                element.classList.remove('d-flex');
                element.classList.add('d-none');
            }, 150);
        }
    }
}

ko.bindingHandlers.inlineFlexVisible = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        var unwrapped = ko.unwrap(value);
        if (!typeof ko.unwrap(unwrapped.boolean) === 'boolean') {
            console.error('inlineFlexVisible bindingHandler error - parameter "boolean" is not a boolean', element, unwrapped);
        }
        if (value) {
            element.style.display = 'inline-flex';
        }
    },
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        if (value) {
            element.style.display = 'inline-flex';
        } else {
            element.style.display = 'none';
        }
    }
}

ko.bindingHandlers.addressAutocompleteKeyPress = {
    init: function (element, valueAccessor) {
        element.addEventListener('keydown', function (event) {
            // tab and down arrow should focus the first li
            if (event.keyCode == 9) {
                if (element.parentElement.querySelectorAll('.address-autocomplete > li').length) {
                    element.parentElement.querySelector('.address-autocomplete > li:first-of-type').focus();
                }
            }
            return;
        });
    }
}


ko.bindingHandlers.stopBinding = {
    init: function () {
        return { controlsDescendantBindings: true };
    }
}


ko.bindingHandlers.codeMirror = {
    init: (element, valueAccessor, allBindingsAccessor) => {
        var value = valueAccessor();
        if (typeof window.createJSCodeMirrorEditor === 'undefined') {
            console.error('knockout codeMirror binding handler demands window.createCodeMirror - use rollup to bundle codemirror creation script see https://codemirror.net/examples/bundle/')
        } else {
            value.codeMirror = window.createJSCodeMirrorEditor(element, allBindingsAccessor().codeMirrorSettings)
        }
    },
    //update: (element, valueAccessor) => {
    //    var value = ko.unwrap(valueAccessor());
    //    let cm = valueAccessor().codeMirror;
    //    if (value) {
    //        cm.clearTo(value)
    //    }
    //    //if (value) {
    //    //    cm.dispatch({
    //    //        changes: {
    //    //            from: 0,
    //    //            to: cm.state.length,
    //    //            insert: 
    //    //        }
    //    //    });
    //    //}
    //}
}

ko.validation.rules['numeric'] = {
    validator: function (value, params) {
        if (params.required && value == null)
            return false;

        if (!isNaN(params.maxValue)) {
            if (params.maxValue >= 0) {
                if (value > params.maxValue)
                    return false;
            } else {
                if (value < params.maxValue)
                    return false;
            }
        }

        if (!isNaN(params.minValue)) {
            if (value < params.minValue)
                return false;
        }

        if (isNaN(value))
            return false;

        return true;
    },
    message: 'Invalid value for numeric'
};
ko.validation.addExtender('validJson');

ko.bindingHandlers.toggleOpacity = {
    init: function (element, valueAccessor) {
        var blockerVisible = ko.unwrap(valueAccessor());
        if (blockerVisible) {
            element.classList.remove('d-none');
            element.classList.add('opacity-100');
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var blockerVisible = ko.unwrap(valueAccessor());
        if (blockerVisible) {
            element.classList.remove('d-none');
            element.classList.add('opacity-100');
        } else {
            element.classList.remove('opacity-100');
            setTimeout(() => element.classList.add('d-none'), 150);
        }
    }
}

ko.validation.rules['isUnique'] = {
    validator: function (newVal, options) {
        if (options.predicate && typeof options.predicate !== "function")
            throw new Error("Invalid option for isUnique validator. The 'predicate' option must be a function.");

        var array = options.array || options;
        var count = 0;
        ko.utils.arrayMap(ko.utils.unwrapObservable(array), function (existingVal) {
            if (equalityDelegate()(existingVal, newVal)) count++;
        });
        return count < 2;

        function equalityDelegate() {
            return options.predicate ? options.predicate : function (v1, v2) { return v1 === v2; };
        }
    }
};

ko.bindingHandlers.virtualScrollComponent = {
    init: function (element, valueAccessor) {
       
        var self = ko.unwrap(valueAccessor)();

        self.scrollingElement = self.scrollingElement || element;

        self.displayItems = ko.observableArray();
        self.firstRenderedIndex = ko.observable(-1);
        self.lastRenderedIndex = ko.observable(-1);
        self.fakedItemHeight = ko.computed(function () {
            // care about the 'IE8 1342177 pixels' problem
            // same problem occurs with other browsers/versions too, if we have very huge lists to show
            return Math.min(120, 1000000 / self.items().length);
        });
        self.precedingHeight = ko.computed(function () {
            var i = self.firstRenderedIndex();
            if (i >= 0) {
                return Math.round(i * self.fakedItemHeight());
            } else {
                return 0;
            }
        });
        self.trailingHeight = ko.computed(function () {
            var i = self.lastRenderedIndex();
            if (i >= 0) {
                return Math.floor((self.items().length - 1 - i) * self.fakedItemHeight());
            } else {
                return Math.floor((self.items().length) * self.fakedItemHeight());;
            }
        });
        self.goto = function (newIndex) {
            console.log('goto', newIndex);
            if (!isNaN(newIndex) && newIndex >= 0 && newIndex < self.items().length) {
                self.updateScope(newIndex);
                element.scrollTo(element.scrollLeft, element.querySelector(`#t${newIndex}`).offsetTop - 20);
            }
        };

        // detect resize
        window.addEventListener('resize', debounce(function () {
            var fl = evalFirstLastVisible(element, element.scrollTop);
            self.updateScope(parseInt(fl.topLeft.id.slice(1)), parseInt(fl.btmRight.id.slice(1)));
        }, 50));

        // (debounce is important for all browsers)
        self.scrollingElement.addEventListener('scroll', debounce(function () {
            var st = element.scrollTop,
                sh = element.scrollHeight;
            //console.log("scrollHeight: " + sh);
            //console.log("scrollTop: " + st);

            var fl = self.evalFirstLastVisible(self.scrollingElement, st);
            if (!fl.topLeft.id) {
                if (st >= sh - element.clientHeight) {
                    self.goto(self.items().length - 1); // ensure the last one
                } else {
                    self.goto(Math.floor(self.items().length * st / sh));
                }
            } else if (self.updateScope(parseInt(fl.topLeft.id.slice(1)), parseInt(fl.btmRight.id.slice(1)))) {
                var nsp = element.querySelector(`#${document.getElementById(fl.topLeft.id).offsetTop}`);
                element.scrollTo(element.scrollLeft, nsp - fl.topLeft.dt); // repositioning 
            }

        }, 100));

        // returns:
        // topLeft.id defined ==> near scroll (btmRight.id is defined too, no need for check)
        // topLeft.id undefined, btmRight.id undefined ==> wide scroll upwards
        // topLeft.id undefined, btmRight.id defined ==> wide scroll downwards        
        self.evalFirstLastVisible = function(scrollingElement, scrollTop) {
            //console.time('evalFirstLastVisible');
            var topLim = scrollTop;
            var botLim = scrollTop + scrollingElement.innerHeight || scrollingElement.clientHeight;

            var result = { topLeft: {}, btmRight: {} }, pos, id;
            element.querySelectorAll(`.sct-target`).forEach((e) => {
                //pos = $(this).offset().top, // offset().top is document relativ (entire document scrolling)
                pos = e.offsetTop; // we are in a box (<ul>), so we need the relative offset to the ul

                if (pos > botLim) {
                    return false;   // ==> break iteration
                }

                id = e.id;
                if (!result.topLeft.id && pos >= topLim) {
                    result.topLeft.id = id; // first entire visible top-left item
                    result.topLeft.dt = pos - topLim; // delta for exact repositioning
                }
                result.btmRight.id = id;
            });

            //console.timeEnd('evalFirstLastVisible');
            return result;
        }

        self.updateScope = function (firstVisibleIndex, lastVisibleIndex) {
            console.log('updateScope', firstVisibleIndex, lastVisibleIndex);
            var forced = !lastVisibleIndex, // data has changed
                padding = 20,
                res = false;
            if (forced) {
                lastVisibleIndex = firstVisibleIndex;
            } else {
                padding = Math.max(lastVisibleIndex - firstVisibleIndex, padding);
            }
            var fri = Math.max(firstVisibleIndex - padding, 0),
                lri = Math.min(lastVisibleIndex + padding, self.items().length - 1),
                threshold = padding / 2;
            if (fri < threshold || lri > self.items().length - threshold)
                threshold = 0;

            //if (forced)
            //    console.log("desired index: " + firstVisibleIndex);
            //else
            //    console.log("firstVisibleIndex: " + firstVisibleIndex + "  lastVisibleIndex: " + lastVisibleIndex);

            if (fri < self.firstRenderedIndex() - threshold || lri > self.lastRenderedIndex() + threshold) {
                self.firstRenderedIndex(fri);
                self.displayItems(self.items().slice(fri, lri + 1));
                self.lastRenderedIndex(lri);

                //console.log("rendered items: " + fri + " to " + lri);
                res = true;
            }
            return res;
        };
    },
    update: function (element, valueAccessor, allBindingsAccessor) {

    }
}

// cheers: https://stackoverflow.com/questions/51368941/using-css3-variables-in-knockout-style-binding
ko.bindingHandlers['style'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        ko.utils.objectForEach(value, function (styleName, styleValue) {
            styleValue = ko.utils.unwrapObservable(styleValue);

            if (styleValue === null || styleValue === undefined || styleValue === false) {
                // Empty string removes the value, whereas null/undefined have no effect
                styleValue = "";
            }

            if (styleName.substring(0, 2) === "--") {
                element.style.setProperty(styleName, styleValue);
            } else {
                element.style[styleName] = styleValue;
            }
        });
    }
};