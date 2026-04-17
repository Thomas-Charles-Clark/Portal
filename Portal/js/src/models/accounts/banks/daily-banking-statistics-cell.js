const dailyBankingStatisticsCellViewModel = ({
    rec,
    row,
    column,
    validateNow
} = {
    rec: {},
    row: {},
    column: {},
    validateNow: ko.observable(false)
}) => {
    let self = Object.assign(rec, {
        row,
        column
    });

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(true);

    self.busyMessage = ko.observable('Please Wait');

    self.value = ko.observable(self.Value);

    self.originalValue = ko.observable(self.Value);

    self.dataType = self.column.DataType?.toLowerCase()?.replace(/\(\d+\)/gm, '');

    //console.log(`Row: ${self.row.SortOrder}, Column: ${self.column.SortOrder} "${self.column.Label}" - ${self.dataType}`);

    //console.log(self.dataType);

    switch (self.dataType) {
        case "nvarchar":
            let maxLength = +self.column.DataType.replace(/[^\d+]/gm, '');
            self.value.extend({
                required: {
                    params: self.column.Required ?? false,
                    onlyIf: () => {
                        return self.column.Required && self.validateNow()
                    },
                    message: `Row: ${self.row.RowID} - Column: ${self.column.ColumnID} - text value required`
                },
                charsRemaining: {
                    maxLength: maxLength,
                    elementId: `#text-${self.row.RowID}-${self.column.ColumnID}`
                },
                rateLimit: {
                    method: 'notifyWhenChangesStop',
                    timeout: 300
                }
            })
            break;
        case "decimal":
            self.value.extend({
                required: {
                    params: self.column.Required ?? false,
                    onlyIf: () => {
                        return self.column.Required && self.validateNow()
                    },
                    message: `Row: ${self.row.RowID} - Column: ${self.column.ColumnID} - decimal value required`
                },
                numberFormatted: {
                    digits: self.row.FormattingDigits ?? 2,
                    currency: {
                        FormattingCulture: self.row.FormattingCulture ?? 'en-GB'
                    }
                }
            });
        case "money":
            self.value.extend({
                required: {
                    params: self.column.Required ?? false,
                    onlyIf: () => {
                        return self.column.Required && self.validateNow()
                    },
                    message: `Row: ${self.row.RowID} - Column: ${self.column.ColumnID} - money value required`
                },
                currencyFormatted: {
                    digits: self.row.FormattingDigits ?? 2,
                    currency: {
                        FormattingCulture: self.row.FormattingCulture ?? 'en-GB',
                        Code: self.row.CurrencyCode ?? 'GBP',
                    }
                }

                //numberFormatted: {
                //    digits: 2,
                //    currency: {
                //        FormattingCulture: self.FormattingCulture
                //    }
                //}
            });
            break;
        default:

            break;
    }

    //#endregion



    //#region Components

    switch (self.dataType) {
        case 'nvarchar':
            self.valueParams = {
                observable: self.value,
                originalValue: self.originalValue,
                useNativeValidation: false,
                insertValidationMessages: false,
                decorateInputElement: false,
                busy: ko.observable(false),
                enable: ko.observable(true),
                disable: ko.observable(false),
                revertible: ko.observable(true),
                clearable: ko.observable(true),
                buttons: false,
                rows: 2,
                revertFunction: function () {
                    let self = this;
                    this.observable(self.originalValue());
                },
                clearFunction: function () {
                    let self = this;
                    this.observable(undefined);
                }
            }
            break;
        case 'decimal':
        case 'money':
            self.valueParams = {
                label: '',
                inputType: 'text',
                minValue: 0,
                maxValue: Number.MAX_SAFE_INTEGER,
                step: 1,
                observable: self.value,
                originalValue: self.originalValue,
                busy: self.busy,
                useNativeValidation: false,
                decorateInputElement: true,
                insertValidationMessages: false,
                showClear: false,
                buttons: false,
                enable: ko.observable(true),
                disable: ko.observable(false),
                revertible: true,
                clearable: true,
                revertFunction: () => {
                    self.value(self.originalValue())
                },
                clearFunction: () => {
                    self.value(undefined);
                }
            }
            break;
        default:
            console.warning(self);
            break;
        //    break;
        //case 'date':
        //    self.valueParams = {
        //        observable: self.value,
        //        originalValue: self.originalValue(),
        //        displayObservable: ko.observable(),
        //        dateTimePickerOptions: {
        //            localization: {
        //                locale: 'en-GB',
        //                format: 'dd/MM/yyyy'
        //            },
        //            display: {
        //                sideBySide: false,
        //                components: {
        //                    clock: false,
        //                    calendar: true,
        //                    date: true,
        //                    month: true,
        //                    year: true,
        //                    decades: false,
        //                    clock: false,
        //                    hours: false,
        //                    minutes: false,
        //                    seconds: false
        //                },
        //                viewMode: 'calendar',
        //                cellSize: '3rem'
        //            },
        //            restrictions: {
        //                disabledDates: [],
        //                maxDate: new Date(),
        //            },
        //            allowInputToggle: true,
        //            useCurrent: false,
        //            keepInvalid: true,
        //            debug: false
        //        },
        //        clearable: ko.observable(true),
        //        clearFunction: () => {
        //            self.value(undefined);
        //            self.valueParams.observable.tempusDominus.clear();
        //            self.valueParams.observable.tempusDominus.updateOptions({
        //                display: {
        //                    viewMode: 'calendar'
        //                }
        //            });
        //        },
        //        revertible: ko.observable(true),
        //        revertFunction: () => {
        //            self.valueParams.observable(self.valueParams.originalValue);
        //        },
        //        useNativeValidation: false,
        //        insertValidationMessages: false,
        //        decorateInputElement: true,
        //        popupSettings: {
        //            appendTo: `#row-${self.RowID}-column-${self.ColumnID}-date`
        //        }
        //    }
        //    break;
    }

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions

    //self.value.subscribe(nv => {

    //})

    //#endregion



    //#region Methods

    self.init = () => {

    }

    self.template = () => {
        //console.log('template: ', self.dataType);
        switch (self.dataType) {
            case 'nvarchar':
                return `<div data-bind="component: { name: 'mdc-text-area-component', params: valueParams }"></div>`
                break;
            case 'decimal':
            case 'money':
            default: 
                return `<div data-bind="component: { name: 'mdc-text-field-numeric-component', params: valueParams }"></div>`;
            //case 'date':
            //    return `<div id="row-${self.RowID}-column-${self.ColumnID}-date" data-bind="component: { name: 'tempus-dominus-date-picker-component', params: valueParams }"></div>`;
            //default:
            //    return 'daily-banking-statistics-cell.js:167'
        }
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};