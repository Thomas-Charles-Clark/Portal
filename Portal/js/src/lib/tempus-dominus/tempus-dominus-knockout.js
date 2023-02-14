(() => {
    if (typeof window.ko === 'undefined') {
        console.error('tempus-dominus-knockout demands window.ko exists before registering tempusDominus bindingHandler');
        return;
    }
    if (typeof window.tempusDominus === 'undefined') {
        console.error('tempus-dominus-knockout demands window.tempusDominus exists before registering tempusDominus bindingHandler');
        return;
    }

    tempusDominus.extend(tempusDominus.plugins.customDateFormat);

    ko.bindingHandlers['tempusDominus'] = {
        init: (element, valueAccessor, allBindingsAccessor) => {
            let td = new tempusDominus.TempusDominus(element, allBindingsAccessor().dateTimePickerOptions);
            let dateValue = ko.unwrap(valueAccessor());
            if (dateValue && typeof valueAccessor().isValid === 'function' && valueAccessor().isValid()) {
                //let parsedDate = td.dates.parseInput();
                let dt = new window.tempusDominus.DateTime(dateValue);
                let formattedDate = td.dates.formatInput(dt);
                td.dates.setValue(dt);
                allBindingsAccessor().value(formattedDate);
            }
            td.subscribe('change.td', (ev) => {
                if (!ev.isClear)
                    valueAccessor()(new Date(ev.date));
                else
                    valueAccessor()(undefined);

                if (allBindingsAccessor().dateTimePickerOptions.eventHandlers) {
                    if (typeof allBindingsAccessor().dateTimePickerOptions.eventHandlers.onChange === 'function') {
                        allBindingsAccessor().dateTimePickerOptions.eventHandlers.onChange(ev);
                    }
                }
            });
            valueAccessor().tempusDominus = td;
        },
        update: (element, valueAccessor, allBindingsAccessor) => {
            //console.log('tempusDominus observable bindingHandler update hit');
            let displayObservable = ko.unwrap(valueAccessor()); // form dependency on observable
            if (displayObservable) {
                allBindingsAccessor().value(valueAccessor().tempusDominus.dates.formatInput(valueAccessor().tempusDominus.viewDate));
            } else {
                if (allBindingsAccessor().value()) {
                    allBindingsAccessor().value(displayObservable);
                    valueAccessor().tempusDominus.clear();
                }
            }
        }
    }
})();