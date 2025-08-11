const invoiceBookingEmailAttachmentCreditNoteViewModel = ({
    rec,
    parent
} = {

    }) => {
    let self = Object.assign({
        validateNow: parent.validateNow,
        modalBusy: parent.modalBusy,
        modalBusyMessage: parent.modalBusyMessage,
        attachmentTypeId: parent.attachmentTypeId,
        attachmentId: parent.AttachmentID,
        save: parent.save,
        skipValidation: parent.skipValidation,
        reset: parent.reset,
        modal: parent.modal,
        formatDateString: parent.formatDateStringForHumans
    }, rec);

    console.log('invoiceBookingEmailAttachmentInvoiceViewModel instantiated with', rec);

    //#region Properties

    self.today = new Date();

    self.busy = ko.observable(false);

    self.validatePreambleSumNow = ko.observable(false);

    self.supplierCode = ko.observable(rec.supplierCode ?? '').extend({
        notEqual: {
            params: '',
            onlyIf: self.validateNow,
            message: 'Please specify a Supplier'
        }
    });

    self.supplier = ko.observable(rec.supplier);

    self.supplierCurrency = rec.supplierCurrency ? ko.observable(rec.supplierCurrency) : ko.computed(() => {
        if (self.loadedCurrency)
            return self.loadedCurrency;
        else
            return self.supplier() && self.supplier().Currency;
    }, self);

    self.exchangeRate = rec.exchangeRate ? ko.observable(rec.exchangeRate) : ko.computed(() => {
        if (self.supplier())
            return self.supplier().ExchangeRate.SterlingExchangeRate
        else
            return 1;
    }, self);

    self.supplierCurrencyDisplay = ko.computed(() => {
        return self.supplierCurrency() && `${self.supplierCurrency().ISO_4217} - ${self.supplierCurrency().Name}`
    }, self);

    self.supplierInvoiceReference = ko.observable(rec.supplierInvoiceReference ?? null).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide a Credit Note Reference'
        },
        charsRemainingOptions: {
            maxLength: 100
        },
        rateLimit: {
            timeout: 300,
            method: 'notifyWhenChangesStop'
        }
    });

    self.invoiceDate = ko.observable(rec.invoiceDate).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide a Document Date'
        },
        validation: {
            validator: function (val) {
                if (self.validateNow()) {
                    val = self.invoiceDateParams.displayObservable();

                    if (val == null || val == 'Invalid Date' || new Date(val.split('/').reverse().join('/')) == 'Invalid Date')
                        return false
                    else
                        return moment.isDate(new Date(val));

                } else {
                    return true;
                }
            },
            message: 'You must provide a valid Document Date'
        }
    });

    //self.dueDate = ko.observable(rec.invoiceDueDT).extend({
    //    required: {
    //        params: true,
    //        onlyIf: self.validateNow,
    //        message: 'You must provide an Invoice Due Date'
    //    },
    //    validation: {
    //        validator: function (val) {
    //            if (self.validateNow()) {
    //                if (val == null || val == 'Invalid Date')
    //                    return false
    //                else
    //                    return moment.isDate(val);
    //            } else {
    //                return true;
    //            }
    //        },
    //        message: 'You must provide a valid Due Date'
    //    }
    //});

    //self.settlementDate = ko.observable(rec.settlementDT).extend({
    //    required: {
    //        params: true,
    //        onlyIf: self.validateNow,
    //        message: 'You must provide a Settlement Date'
    //    },
    //    validation: {
    //        validator: function (val) {
    //            if (self.validateNow()) {
    //                if (val == null || val == 'Invalid Date')
    //                    return false
    //                else
    //                    return moment.isDate(val);
    //            } else {
    //                return true;
    //            }
    //        },
    //        message: 'You must provide a valid Settlement Date'
    //    }
    //});

    self.paymentTermsCode = ko.observable(rec.paymentTermsCode).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must specify Payment Terms'
        }
    });

    self.paymentTerms = ko.observable();

    self.documentCurrencyCode = ko.observable(rec.invoiceCurrencyCode ?? '').extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must specify the document currency'
        }
    });

    self.documentCurrency = ko.observable();

    self.dispute = ko.observable(rec.dispute);

    self.invoiceTotalIncVATCurrency = ko.observable(rec.invoiceTotalIncVATInCurrency).extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validatePreambleSumNow() || self.validateNow()
            },
            message: 'You must provide an Invoice Total'
        },
        currencyFormatted: {
            digits: 2,
            currency: self.supplierCurrency,
            minValue: 0
        },
        minValue: {
            params: 0,
            onlyIf: self.validateNow,
            message: 'Invoice Total must be zero or +ve'
        }
    });

    self.vatTotalCurrency = ko.observable(rec.vatTotalCurrency).extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validatePreambleSumNow() || self.validateNow()
            },
            message: 'You must provide a VAT total'
        },
        currencyFormatted: {
            digits: 2,
            currency: self.supplierCurrency,
            minValue: 0
        },
        minValue: {
            params: 0,
            onlyIf: self.validateNow,
            message: 'VAT Total must be zero or +ve'
        }
    });

    self.netTotalCurrency = ko.observable(self.netTotalCurrency).extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validatePreambleSumNow() || self.validateNow()
            },
            message: 'You must provide a Net total'
        },
        currencyFormatted: {
            digits: 2,
            currency: self.supplierCurrency,
            minValue: 0
        },
        minValue: {
            params: 0,
            onlyIf: self.validateNow,
            message: 'Net Total must be zero or +ve'
        }
    });

    /* Lifted Preamble Properties purposefully: must exist for generalLedgerEntries and vatEntries to be instantiated */
    self.preambleErrorGroup = ko.validation.group([
        self.netTotalCurrency,
        self.vatTotalCurrency,
        self.invoiceTotalIncVATCurrency
    ])

    self.preambleComputer = ko.computed(() => {
        let net = self.netTotalCurrency();
        let gross = self.invoiceTotalIncVATCurrency();
        let vat = self.vatTotalCurrency();

        if (net != null && vat != null && gross != null) {

            self.validatePreambleSumNow(true);

            return net == Math.round((gross - vat) * 100) / 100;
        } else {
            return false;
        }
    }, self);

    self.preambleSatisfied = ko.computed(() => {
        return self.preambleComputer() && self.preambleErrorGroup().length == 0;
    }, self)
    /* End of Lifted Preamble Properties  */

    self.generalLedgerEntries = ko.observableArray(rec?.generalLedgerEntries?.map((gl, i) => invoiceBookingEmailInvoiceGLViewModel({
        rec: gl,
        parent: self
    })) ?? [invoiceBookingEmailInvoiceGLViewModel({
        rec: {
            generalLedgerCode: '9999999999'
        },
        parent: self
    })]);

    self.vatEntries = ko.observableArray(rec?.vatEntries?.map((v, i) => invoiceBookingEmailInvoiceVATViewModel({
        rec: v,
        parent: self
    })) ?? [invoiceBookingEmailInvoiceVATViewModel({
        rec: {
            vatCode: self.supplier()?.DefaultVATCode
        },
        parent: self // want parent to carry forexParams by here
    })]);

    // This begins true because on load of untouched record the factors at play are both NaN / 0 / undefined.
    // This holds when you load a previous record: you can't save without these flags being true, so... yeah.
    self.generalLedgerSumEqualsTotalMinusVAT = ko.observable(true).extend({
        equal: {
            params: true,
            onlyIf: self.validateNow,
            message: 'Sum of General Ledger Breakdown must equal Net Total'
        }
    });

    self.vatableSumEqualsTotalNET = ko.observable(true).extend({
        equal: {
            params: true,
            onlyIf: self.validateNow,
            message: 'Sum of VATable Breakdown must equal Net Total'
        }
    });

    self.vatInCurrencyBreakdownEqualsTotalVATInCurrency = ko.observable(true).extend({
        equal: {
            params: true,
            onlyIf: self.validateNow,
            message: 'The sum of the "VATable Amount in Currency" must equal the "Net Invoice Total in Currency" above.'
        }
    });

    self.netTotalCurrencyEqualsInvoiceTotalCurrencyMinusVAT = ko.observable(true).extend({
        equal: {
            params: true,
            onlyIf: self.validatePreambleSumNow,
            message: 'Gross total must equal Net total plus VAT total'
        }
    });

    self.documentCurrencyEqualsSupplierCurrency = ko.observable(false).extend({
        equal: {
            params: true,
            onlyIf: self.validateNow,
            message: 'Document Currency must equal Supplier Currency'
        }
    });

    self.duplicateResults = ko.observableArray(rec.duplicateResults ?? []);

    self.isFlaggedAsDuplicate = ko.observable(rec.isFlaggedAsDuplicate);

    self.undoingDuplicate = ko.observable(false);

    self.duplicateWarningAccepted = ko.observable(false);

    self.vatInCurrencyEpsilon = ko.observable(1.0); // ± 1%

    self.vatInCurrencyBreakdownPercentageVariance = ko.observable(0);

    self.vatInCurrencyBreakdownWithinEpsilon = ko.observable(false);

    self.vatInCurrencyBreakdownMatchesTotal = ko.observable(false);

    self.vatInCurrencyBreakdownBeyondEpsilon = ko.observable(false).extend({
        equal: {
            params: false,
            onlyIf: self.validateNow,
            message: function () {
                let currency = self.supplierCurrency();
                if (currency) {
                    return `Please ensure the VAT breakdown total aligns with the stated VAT total on the invoice.<br/><br/>
                      The VAT breakdown total is: ${formatCurrency(ko.unwrap(self.vatableAmountSumComputer), 2, currency.FormattingCulture, currency.Code)}.<br/>The permissible tolerance is ±${formatNumber(ko.unwrap(self.vatInCurrencyEpsilon), 2, 'en-GB')}%, and the current variance is ${formatNumber(ko.unwrap(self.vatInCurrencyBreakdownPercentageVariance), 2, 'en-GB')}%.`
                }
            }
        }
    });

    self.vatEpsilonWarningAcceptance = ko.observable(false).extend({
        equal: {
            params: true,
            onlyIf: () => {
                return self.vatInCurrencyBreakdownWithinEpsilon() && self.validateNow();
            },
            message: function () {
                let currency = self.supplierCurrency();
                if (currency) {
                    return `The VAT breakdown total is: ${formatCurrency(ko.unwrap(self.vatableAmountSumComputer), 2, currency.FormattingCulture, currency.Code)}.<br/>
                    The permissible tolerance is ±${formatNumber(ko.unwrap(self.vatInCurrencyEpsilon), 2, 'en-GB')}% and the current variance is ${formatNumber(ko.unwrap(self.vatInCurrencyBreakdownPercentageVariance), 2, 'en-GB')}%<br/><br/>
                    If you are happy that this is a small rounding variance (due to the recalculation of the VAT), tick this box to accept the variance and continue.`
                }
            }
        }
    });

    self.invoiceTotalIncVATInSterlingExceedsSupplierInvoiceWarningThresholdGBP = ko.observable(false);

    self.invoiceTotalIncVATInSterlingExceedsSupplierInvoiceWarningAccepted = ko.observable(false).extend({
        equal: {
            params: true,
            onlyIf: self.invoiceTotalIncVATInSterlingExceedsSupplierInvoiceWarningThresholdGBP,
            message: 'Gross total must not exceed Supplier Invoice Warning Threshold'
        }
    });

    //#endregion


    //#region Lifted Bits



    //#endregion



    //#region Computeds

    self.invoiceTotalIncVATInSterling = rec.invoiceTotalIncVATInSterling ? ko.observable(rec.invoiceTotalIncVATInSterling) : ko.computed(() => {

        if (self.supplier() && self.invoiceTotalIncVATCurrency())
            return Math.round(self.invoiceTotalIncVATCurrency() / (self.supplier().ExchangeRate.SterlingExchangeRate) * 10000) / 10000;
        else
            return 0;

    }, self);

    self.invoiceTotalIncVATInSterlingFormatted = ko.computed({
        read: () => {
            if (self.invoiceTotalIncVATInSterling() != null)
                return formatCurrency(self.invoiceTotalIncVATInSterling(), 2, 'en-GB', 'GBP');
            else
                return formatCurrency(0, 2, 'en-GB', 'GBP');
        },
        write: (v) => {

        }
    }, self);

    self.vatTotalInSterling = rec.vatTotalInSterling ? ko.observable(rec.vatTotalInSterling) : ko.computed(() => {
        if (self.supplier() && self.vatTotalCurrency())
            return Math.round(self.vatTotalCurrency() / ((self.loadedExchangeRate ? +self.loadedExchangeRate : self.supplier().ExchangeRate.SterlingExchangeRate)) * 10000) / 10000;
        else
            return 0;
    }, self);

    self.vatTotalInSterlingFormatted = ko.computed({
        read: () => {
            if (self.vatTotalInSterling() != null)
                return formatCurrency(self.vatTotalInSterling(), 2, 'en-GB', 'GBP');
            else
                return formatCurrency(0, 2, 'en-GB', 'GBP');
        },
        write: (v) => {

        }
    }, self);

    self.netTotalInSterling = rec.netTotalInSterling ? ko.observable(rec.netTotalInSterling) : ko.computed(() => {
        if (self.supplier() && self.netTotalCurrency())
            return Math.round(self.netTotalCurrency() / ((self.loadedExchangeRate ? +self.loadedExchangeRate : self.supplier().ExchangeRate.SterlingExchangeRate)) * 10000) / 10000;
        else
            return 0;
    }, self);

    self.netTotalInSterlingFormatted = ko.computed({
        read: () => {
            if (self.netTotalInSterling() != null)
                return formatCurrency(self.netTotalInSterling(), 2, 'en-GB', 'GBP');
            else
                return formatCurrency(0, 2, 'en-GB', 'GBP');
        },
        write: (v) => {

        }
    }, self);

    self.forexDisplay = ko.computed(() => {
        return `Forex (${self.loadedCurrency ? self.loadedCurrency.Code : self.supplierCurrency() && self.supplierCurrency().Code} to GBP): ${formatNumber(self.loadedExchangeRate ? +self.loadedExchangeRate : self.supplier() && self.supplier().ExchangeRate.SterlingExchangeRate, 2, 'en-GB', 'GBP')}`;
    })

    self.invoiceTotalExVatInSterling = ko.computed(() => {

        let totalInc = self.invoiceTotalIncVATInSterling();
        let totalVat = self.vatTotalInSterling()

        if (totalInc &&
            totalVat) {
            return totalInc - totalVat;
        }
    }, self);

    self.invoiceTotalExVatInSterlingFormatted = ko.computed(() => {
        if (self.invoiceTotalExVatInSterling() != null)
            return formatCurrency(self.invoiceTotalExVatInSterling(), 2, 'en-GB', 'GBP');
        else
            return formatCurrency(0, 2, 'en-GB', 'GBP');
    }, self);

    self.generalLedgerBreakdownSum = ko.computed(() => {
        return self.generalLedgerEntries().reduce((a, i) => a += +(ko.unwrap(i.amountExVATInCurrency) ?? 0), 0);
    });

    self.generalLedgerSumComputer = ko.computed(() => {
        let breakdown = +self.generalLedgerBreakdownSum();
        let total = +self.invoiceTotalIncVATCurrency();
        let vat = +self.vatTotalCurrency();

        ko.ignoreDependencies(() => {
            if (breakdown == Math.round((total - vat) * 100) / 100) {
                self.generalLedgerSumEqualsTotalMinusVAT(true);
            } else {
                self.generalLedgerSumEqualsTotalMinusVAT(false);
            }
        });
    });

    self.netComputer = ko.computed(() => {
        let net = +self.netTotalCurrency();
        let total = +self.invoiceTotalIncVATCurrency();
        let vat = +self.vatTotalCurrency();

        ko.ignoreDependencies(() => {
            if (net == Math.round((total - vat) * 100) / 100) {
                self.netTotalCurrencyEqualsInvoiceTotalCurrencyMinusVAT(true);
            } else {
                self.netTotalCurrencyEqualsInvoiceTotalCurrencyMinusVAT(false);
            }
        });
    });

    self.vatableAmountBreakdownSum = ko.computed(() => {
        return self.vatEntries().reduce((a, i) => a += +(ko.unwrap(i.vatableAmountCurrency) ?? 0), 0);
    });

    self.vatableAmountSumComputer = ko.computed(() => {
        let breakdown = +self.vatableAmountBreakdownSum();
        let total = +self.netTotalCurrency();

        ko.ignoreDependencies(() => {
            if (breakdown == total) {
                self.vatableSumEqualsTotalNET(true);
            } else {
                self.vatableSumEqualsTotalNET(false);
            }
        });

        return breakdown;
    });

    self.vatInCurrencyBreakdownSum = ko.computed(() => {
        return Math.round(self.vatEntries().reduce((a, i) => a += +(ko.unwrap(i.vatInCurrency) ?? 0), 0) * 100) / 100;
    });

    self.vatInCurrencySumComputer = ko.computed(() => {
        let breakdown = +self.vatInCurrencyBreakdownSum();
        let total = +self.vatTotalCurrency();

        ko.ignoreDependencies(() => {
            if (breakdown == total) {
                self.vatInCurrencyBreakdownEqualsTotalVATInCurrency(true);
            } else {
                self.vatInCurrencyBreakdownEqualsTotalVATInCurrency(false);
            }
        });
    });

    self.vatInCurrencyEpsilonComputer = ko.computed(() => {

        let breakdown = self.vatInCurrencyBreakdownSum() ?? 0;
        let total = self.vatTotalCurrency() ?? 0;
        let epsilon = self.vatInCurrencyEpsilon();

        let vatRate = self.vatEntries()[0].vatRate();

        let vatRatePlusOne = vatRate + 1;

        let variance = Math.round(Math.abs(breakdown - total) * 100) / 100;

        let variancePercentage = variance == 0 && total == 0 ? 0 : ((variance / total) * 100);

        let roundedVariancePercentage = Math.round(variancePercentage * 100) / 100;

        if (roundedVariancePercentage == 0) {
            self.vatInCurrencyBreakdownMatchesTotal(true);
        } else {
            self.vatInCurrencyBreakdownMatchesTotal(false);
        }

        ko.ignoreDependencies(() => {

            console.log(`vatInCurrencyEpsilonComputer variance: ${variance}; ${roundedVariancePercentage}%`);

            self.vatInCurrencyBreakdownPercentageVariance(breakdown - total > 0 ? 1 * roundedVariancePercentage : -1 * roundedVariancePercentage);

            if (roundedVariancePercentage == 0) {
                self.vatInCurrencyBreakdownWithinEpsilon(false);
                self.vatInCurrencyBreakdownBeyondEpsilon(false);
            } else {
                if (roundedVariancePercentage < epsilon) {
                    self.vatInCurrencyBreakdownWithinEpsilon(true);
                    self.vatInCurrencyBreakdownBeyondEpsilon(false);
                } else {
                    self.vatInCurrencyBreakdownWithinEpsilon(false);
                    self.vatInCurrencyBreakdownBeyondEpsilon(true);
                }
            }
        });

    }, self);

    self.invoiceTotalIncVATInSterlingExceedsSupplierInvoiceWarningThresholdGBPComputer = ko.computed(() => {
        let invoiceTotalIncVATInSterling = self.invoiceTotalIncVATInSterling();

        if (self.supplier()) {
            let result = invoiceTotalIncVATInSterling > self.supplier().InvoiceWarningThresholdGBP;

            console.log('invoiceTotalIncVATInSterlingExceedsSupplierInvoiceWarningThresholdGBPComputer computed', result);

            ko.ignoreDependencies(() => {
                self.invoiceTotalIncVATInSterlingExceedsSupplierInvoiceWarningThresholdGBP(result);
            });
        }

    }, self);

    self.currencyEqualityComputer = ko.computed(() => {
        let supplier = self.supplierCurrency();
        let document = self.documentCurrency();

        ko.ignoreDependencies(() => {
            if (supplier && document && supplier.Code == document.Code) {
                self.documentCurrencyEqualsSupplierCurrency(true);
            } else {
                self.documentCurrencyEqualsSupplierCurrency(false);
            }
        });
    });

    self.duplicateCheck = ko.computed(() => {

        if ((!self.readOnly()) &&
            self.supplierCode() &&
            self.attachmentTypeId() == 2 && // invoice only
            (self.invoiceDate() || self.supplierInvoiceReference() || self.invoiceTotalIncVATCurrency())) {

            let params = {
                attachmentId: self.attachmentId,
                attachmentTypeId: self.attachmentTypeId(),
                formDataJson: JSON.stringify({
                    attachmentId: self.AttachmentID,
                    attachmentTypeId: self.attachmentTypeId(),
                    invoiceDate: self.invoiceDate(),
                    supplierCode: self.supplierCode(),
                    supplierInvoiceReference: self.supplierInvoiceReference(),
                    invoiceTotalInCurrencyIncVAT: self.invoiceTotalIncVATCurrency(),
                })
            }

            let previousMessage = null;

            ko.ignoreDependencies(() => {
                self.modalBusy(true);

                previousMessage = self.modalBusyMessage();

                self.modalBusyMessage('Checking for duplicates...');
            });

            console.log('InvoiceDuplicateCheck calling with', params);

            fetch('/api/InvoiceBookingAPI/InvoiceDuplicateCheck', {
                method: 'POST',
                headers: window.fetchHeaders,
                credentials: 'same-origin',
                cache: 'no-cache',
                body: JSON.stringify(params)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log('InvoiceDuplicateCheck returned', data);

                    ko.ignoreDependencies(() => {

                        self.modalBusy(false);

                        self.modalBusyMessage(previousMessage);

                        self.duplicateResults(data.Duplicates);

                    })
                })
                .catch(err => {
                    self.modalBusy(false);
                    window.catchFetchError(err);
                })

        }

    }, self);

    self.acknowledgeDuplicate = () => {

        window.showConfirm('Are you sure?', `<p class="mb-0">
            Are you sure you wish to mark this attachment as being a duplicate?
        </p>`, () => {
            self.skipValidation(true);
            self.isFlaggedAsDuplicate(true);
            self.save(() => {
                self.skipValidation(false);
            })
        }, null);

    }

    self.undoDuplicate = () => {

        window.showConfirm('Are you sure?', `<p class="mb-0">
            Are you sure this item is not a duplicate?
        </p>`, () => {
            self.skipValidation(true);
            self.undoingDuplicate(true);
            self.save(() => {
                self.skipValidation(false);
            })
        }, null);

    }

    //#endregion

    //#region Components

    self.supplierParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Supplier',
        odata: true,
        endPoint: '/odata/MertexLiveSuppliers?$expand=Currency,ExchangeRate,PaymentTerms,VATCode',
        textField: 'Name',
        valueField: 'Code',
        template: (e) => {
            return `${e.Code} - ${e.Name}`;
        },
        valueTemplate: (e) => {
            return `${e.Code} - ${e.Name}`;
        },
        idObservable: self.supplierCode,
        objObservable: self.supplier,
        originalValue: self.supplierCode(),
        virtual: true,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/MertexLiveSuppliers/Default.MertexLiveSupplierValueMapper(supplierCode='${options.value}')?$expand=Currency,ExchangeRate,PaymentTerms,VATCode`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            self.supplier(data.value[0]);
                            if (self.paymentTermsCode() == null) {
                                self.paymentTermsCode(data.value[0].PaymentTerms?.Code);
                            }
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        locked: ko.observable(self.supplierCode() != ''),
        enable: ko.computed(() => {
            return !self.readOnly()
        }, self),
        disable: ko.observable(self.supplierCode() != '' || self.readOnly()),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: self.readOnly,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Name'
        },
        changeBtnVisible: ko.computed(() => {
            return self.readOnly() == false && self.supplierCode() != '';
        }, self),
        select: function (e) {
            console.log('supplierParams select', e);
            self.supplierParams.locked(true);
        },
        clearFunction: () => {
            self.supplierParams.dropDownListSettings.widget().select(-1);
            self.supplierParams.dropDownListSettings.widget().trigger('change');
            self.supplierParams.locked(false);
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            let filters = [];

            if (data.filter && data.filter.filters.length) {
                let f = data.filter.filters.find(f => f.field === "Name");
                filters.push(`(contains(Name, '${f.value}') or contains(SortName, '${f.value}') or startswith(tolower(Code), '${f.value}') or startswith(tolower(Postcode), '${f.value}'))`);

                if (d.$filter) {
                    delete d.$filter;
                }
            }

            if (filters.length) {
                let filterString = filters.join(' and ');
                d.$apply = `filter(${filterString})`;
            }

            d.$count = true;

            return d;
        },
        popupSettings: {
            appendTo: document.querySelector('#email-modal .modal-body')
        }
    });

    self.supplierCode.subscribe(nv => {
        if (nv != '') {
            self.supplierParams.locked(true);
        } else {
            self.supplierParams.locked(false);
        }
    });

    self.invoiceTotalIncVATCurrencyParams = {
        label: 'Gross Credit Total (Inc. VAT) in Currency',
        buttons: false,
        observable: self.invoiceTotalIncVATCurrency,
        originalValue: self.invoiceTotalIncVATCurrency(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.computed(() => {
            return !self.readOnly()
        }, self),
        disable: self.readOnly,
        locked: self.readOnly,
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: 0,
        maxValue: null,
        step: null,
        clearFunction: () => {
            self.invoiceTotalIncVATCurrency(undefined);
        },
        revertFunction: () => {
            self.invoiceTotalIncVATCurrency(self.invoiceTotalIncVATCurrencyParams.originalValue);
        }
    }

    self.vatTotalCurrencyParams = {
        label: 'VAT Total in Currency',
        buttons: false,
        observable: self.vatTotalCurrency,
        originalValue: self.vatTotalCurrency(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.computed(() => {
            return !self.readOnly()
        }, self),
        disable: self.readOnly,
        locked: self.readOnly,
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: 0,
        maxValue: null,
        step: null,
        clearFunction: () => {
            self.vatTotalCurrency(undefined);
        },
        revertFunction: () => {
            self.vatTotalCurrency(self.vatTotalCurrencyParams.originalValue);
        }
    }

    self.netTotalCurrencyParams = {
        label: 'Net Credit Total (Ex. VAT) in Currency',
        buttons: false,
        observable: self.netTotalCurrency,
        originalValue: self.netTotalCurrency(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.computed(() => {
            return !self.readOnly()
        }, self),
        disable: self.readOnly,
        locked: self.readOnly,
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: 0,
        maxValue: null,
        step: null,
        clearFunction: () => {
            self.netTotalCurrency(undefined);
        },
        revertFunction: () => {
            self.netTotalCurrency(self.netTotalCurrencyParams.originalValue);
        }
    }

    self.invoiceDateParams = {
        label: `Document Date (e.g. ${self.formatDateString(self.today)})`,
        id: "invoice-date",
        observable: self.invoiceDate,
        originalValue: self.invoiceDate(),
        displayObservable: ko.observable().extend({
            validation: {
                validator: function (val) {
                    if (val == null || val == 'Invalid Date' || new Date(val.split('/').reverse().join('/')) == 'Invalid Date')
                        return false
                    else
                        return true;
                },
                message: 'You must provide a valid Invoice Date'
            }
        }),
        showCalendarButton: true,
        dateTimePickerOptions: {
            bindToParentNode: true,
            localization: {
                locale: 'en-GB',
                format: 'dd/MM/yyyy'
            },
            display: {
                sideBySide: false,
                components: {
                    clock: false,
                    calendar: true,
                    date: true,
                    month: true,
                    year: true,
                    decades: false,
                    clock: false,
                    hours: false,
                    minutes: false,
                    seconds: false
                },
                viewMode: 'calendar',
                cellSize: '3rem'
            },
            restrictions: {
                disabledDates: []
            },
            allowInputToggle: false,
            useCurrent: false,
            keepInvalid: true,
            debug: false,
            viewDate: self.readOnly() ? new Date(Date.parse(self.invoiceDate())) : self.invoiceDate() ? new Date(self.invoiceDate().getFullYear(), self.invoiceDate().getMonth(), self.invoiceDate().getDate(), 12, 0, 0, 0) : new Date()
        },
        disabled: self.readOnly,
        locked: self.readOnly,
        clearable: ko.observable(false),
        clearFunction: () => {
            self.invoiceDate(undefined);
        },
        revertible: ko.observable(false),
        revertFunction: () => {
            self.invoiceDateParams.observable(self.invoiceDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.paymentTermsParams = kendoMDCDropDownList({
        autoBind: true,
        label: 'Payment Terms',
        odata: true,
        endPoint: '/odata/SupplierPaymentTerms',
        textField: 'Name',
        valueField: 'Code',
        virtual: false,
        idObservable: self.paymentTermsCode,
        objObservable: self.paymentTerms,
        template: (e) => {
            return `${e.Name} (${e.Code})`;
        },
        valueTemplate: (e) => {
            return `${e.Name} (${e.Code})`;
        },
        enable: ko.observable(true),
        disable: self.readOnly,
        locked: self.readOnly,
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        height: 340,
        sort: {
            field: 'SortOrder',
            dir: 'asc'
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            /// thanks, https://stackoverflow.com/questions/28995757/a-binary-operator-with-incompatible-types-was-detected-found-operand-types-edm/48919770
            delete d.$inlinecount; // <-- remove inlinecount
            //delete d.$format; // <-- remove format
            //delete d.$callback; // <-- remove callback

            d.$count = true;

            if (data.filter &&
                data.filter.filters.length &&
                data.filter.filters[0].value != '') {

                let filterValue = data.filter.filters[0].value;

                d.$filter = `StartsWith(ToLower(Name), '${filterValue}') OR StartsWith(ToLower(Code), '${filterValue}')`;
            }

            return d;
        },
        popupSettings: {
            appendTo: '#invoice-terms'
        }
    });

    self.documentCurrencyParams = kendoMDCDropDownList({
        autoBind: true,
        label: 'Document Currency',
        odata: true,
        endPoint: '/odata/Currencies/Default.InvoiceRegistrationCurrencies()',
        textField: 'Name',
        valueField: 'Code',
        virtual: false,
        idObservable: self.documentCurrencyCode,
        objObservable: self.documentCurrency,
        template: (e) => {
            return `${e.Name} (${e.Code})`;
        },
        valueTemplate: (e) => {
            if (e.Name && e.Code) {
                return `${e.Name} (${e.Code})`;
            } else {
                return '';
            }
        },
        enable: ko.computed(() => {
            return !self.readOnly()
        }, self),
        disable: self.readOnly,
        locked: self.readOnly,
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        height: 340,
        sort: {
            field: 'CurrencyID',
            dir: 'asc'
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            /// thanks, https://stackoverflow.com/questions/28995757/a-binary-operator-with-incompatible-types-was-detected-found-operand-types-edm/48919770
            delete d.$inlinecount; // <-- remove inlinecount
            //delete d.$format; // <-- remove format
            //delete d.$callback; // <-- remove callback

            d.$count = true;

            if (data.filter &&
                data.filter.filters.length &&
                data.filter.filters[0].value != '') {

                let filterValue = data.filter.filters[0].value;

                d.$filter = `StartsWith(ToLower(Name), '${filterValue}') OR StartsWith(ToLower(Code), '${filterValue}')`;
            }

            return d;
        },
        popupSettings: {
            appendTo: '#document-currency'
        }
    });

    self.invoiceReferenceParams = {
        label: 'Supplier Credit Note Reference',
        observable: self.supplierInvoiceReference,
        charsRemainingOptions: {
            maxLength: 100
        },
        busy: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        clearFunction: () => {
            self.supplierInvoiceReference(undefined);
        },
        revertible: ko.observable(false),
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
        disable: self.readOnly,
        locked: self.readOnly
    };

    self.disputeParams = {
        checkboxId: 'dispute',
        label: 'Dispute this Invoice with the Supplier?',
        observable: self.dispute,
        useNativeValidation: false,
        enable: ko.observable(true),
        disable: self.readOnly,
        busy: ko.observable(false)
    }

    self.forexParams = () => {
        return {
            buttons: false,
            label: ko.computed(() => {
                if (self.supplierCurrency())
                    return `FX Rate ${(self.supplierCurrency() && self.supplierCurrency().Code)} to GBP`;
                else
                    return '';
            }, self),
            observable: ko.computed(() => {
                if (self.loadedCurrency && self.loadedExchangeRate && self.invoiceTotalExVatInSterlingFormatted()) {
                    return formatNumber(self.loadedExchangeRate, 4, 'en-GB', 'GBP');
                } else {
                    return self.supplier() && formatNumber(self.supplier().ExchangeRate.SterlingExchangeRate, 4, 'en-GB', 'GBP');
                }
            }, self),
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            enable: ko.observable(true),
            disable: ko.observable(true),
            locked: ko.observable(true),
            clearable: ko.observable(false),
            revertible: ko.observable(false),
            busy: ko.observable(false),
            inputType: 'text',
            minValue: 0.01,
            maxValue: null,
            step: 1
        };
    };

    self.invoiceTotal = {
        highlightOnNull: self.invoiceTotalIncVATCurrencyParams.observable,
        inputParams: self.invoiceTotalIncVATCurrencyParams,
        forexParams: self.forexParams(),
        convertedParams: {
            label: 'Gross Invoice Total (Inc. VAT) in Sterling',
            buttons: false,
            observable: self.invoiceTotalIncVATInSterlingFormatted,
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            enable: ko.observable(false),
            disable: ko.observable(true),
            locked: ko.observable(true),
            clearable: ko.observable(false),
            revertible: ko.observable(false),
            busy: ko.observable(false),
            inputType: 'text',
            minValue: 0.01,
            maxValue: null,
            step: 1
        }
    }

    self.vatTotal = {
        highlightOnNull: self.vatTotalCurrencyParams.observable,
        inputParams: self.vatTotalCurrencyParams,
        forexParams: self.forexParams(),
        convertedParams: {
            label: 'VAT Total in Sterling',
            buttons: false,
            observable: self.vatTotalInSterlingFormatted,
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            enable: ko.observable(false),
            disable: ko.observable(true),
            locked: ko.observable(true),
            clearable: ko.observable(false),
            revertible: ko.observable(false),
            busy: ko.observable(false),
            inputType: 'text',
            minValue: 0.01,
            maxValue: null,
            step: 1
        }
    }

    self.netTotal = {
        highlightOnNull: self.netTotalCurrencyParams.observable,
        inputParams: self.netTotalCurrencyParams,
        forexParams: self.forexParams(),
        convertedParams: {
            label: 'Net Total in Sterling',
            buttons: false,
            observable: self.netTotalInSterlingFormatted,
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            enable: ko.observable(false),
            disable: ko.observable(true),
            locked: ko.observable(true),
            clearable: ko.observable(false),
            revertible: ko.observable(false),
            busy: ko.observable(false),
            inputType: 'text',
            minValue: 0.01,
            maxValue: null,
            step: 1
        }
    }

    self.vatEpsilonWarningAcceptanceParams = {
        observable: self.vatEpsilonWarningAcceptance,
        checkboxId: 'vat-epsilon-warning',
        disable: ko.observable(false),
        enable: ko.observable(true)
    }

    self.vatErrors = ko.observable(false).extend({
        equal: {
            params: false,
            onlyIf: self.validateNow,
            message: 'There\'s some sort of VAT related error!'
        }
    });

    self.vatErrorsComputer = ko.computed(() => {

        let validateNow = self.validateNow();

        validateNow += 1;

        var vatableSumEqualsTotalNET = self.vatableSumEqualsTotalNET();

        var vatInCurrencyBreakdownMatchesTotal = self.vatInCurrencyBreakdownMatchesTotal();

        var vatInCurrencyBreakdownBeyondEpsilon = self.vatInCurrencyBreakdownBeyondEpsilon();

        var vatInCurrencyBreakdownWithinEpsilon = self.vatInCurrencyBreakdownWithinEpsilon();

        var vatEpsilonWarningAcceptance = self.vatEpsilonWarningAcceptance();

        if (vatableSumEqualsTotalNET == false) {
            self.vatErrors(true);
            return;
        }

        if (vatInCurrencyBreakdownMatchesTotal == true) {
            self.vatErrors(false);
        } else {
            if (vatInCurrencyBreakdownBeyondEpsilon) {
                self.vatErrors(true);
            } else {
                if (
                    (vatableSumEqualsTotalNET)
                    &&
                    (
                        (vatInCurrencyBreakdownWithinEpsilon == true && vatEpsilonWarningAcceptance == true)
                    )) {
                    self.vatErrors(false);
                } else {
                    self.vatErrors(true);
                }
            }
        }

    }, self);

    self.duplicateWarningAcceptedParams = {
        checkboxId: 'duplicate-warning',
        label: 'I have double checked, this is not a duplicate and I want to register this invoice.',
        observable: self.duplicateWarningAccepted,
        useNativeValidation: false,
        enable: ko.observable(true),
        disable: self.readOnly,
        busy: ko.observable(false)
    }

    self.invoiceTotalIncVATCurrencyExceedsSupplierInvoiceWarningParams = {
        checkboxId: 'total-inc-warning',
        label: ko.computed(() => {
            return `The Gross Credit Total in Currency exceeds this Supplier\'s Warning Threshold of ${formatCurrency(ko.unwrap(self.supplier).InvoiceWarningThresholdGBP, 0, 'en-GB', 'GBP')}
            <br/>
            I have double checked and am sure that ${formatCurrency(ko.unwrap(self.invoiceTotalIncVATCurrency), 2, ko.unwrap(self.supplierCurrency).FormattingCulture, ko.unwrap(self.supplierCurrency).Code)} is the correct and valid amount.`
        }, self),
        observable: self.invoiceTotalIncVATInSterlingExceedsSupplierInvoiceWarningAccepted,
        useNativeValidation: false,
        enable: ko.observable(true),
        disable: self.readOnly,
        busy: ko.observable(false)
    }

    self.errorables = [
        self.supplierInvoiceReference,
        self.invoiceDate,
        //self.dueDate,
        //self.settlementDate,
        self.paymentTermsCode,
        self.generalLedgerEntries,
        self.vatEntries,
        self.invoiceTotalIncVATCurrency,
        self.vatTotalCurrency,
        self.netTotalCurrency,
        self.netTotalCurrencyEqualsInvoiceTotalCurrencyMinusVAT,
        self.generalLedgerSumEqualsTotalMinusVAT,
        self.invoiceTotalIncVATInSterlingExceedsSupplierInvoiceWarningAccepted,
        self.documentCurrencyCode,
        self.documentCurrencyEqualsSupplierCurrency,
        self.vatErrors
    ];

    //#endregion


    //#region Subscriptions

    //self.invoiceDate.subscribe(nv => {
    //    if (nv && self.paymentTermsCode()) {
    //        self.fetchInvoiceDates();
    //    }
    //})

    //self.paymentTermsCode.subscribe(nv => {
    //    if (nv && self.invoiceDate()) {
    //        self.fetchInvoiceDates();
    //    } else {

    //    }
    //})

    self.supplier.subscribe(nv => {
        if (nv) {
            self.vatEntries().forEach(v => {
                if (!v.vatCode()) {
                    v.vatCode(nv.DefaultVATCode);
                }
            })
            self.supplierCurrency(nv.Currency);
        } else {
            self.supplierCurrency(undefined);
        }
    })

    //self.netTotalCurrency.subscribe(nv => {

    //})

    self.preambleSatisfied.subscribe(nv => {
        if (nv) {
            let vatRemainder = self.netTotalCurrency() - self.vatableAmountBreakdownSum();

            if (vatRemainder) {
                self.vatEntries().forEach(v => {
                    if (!v.vatableAmountCurrency())
                        v.vatableAmountCurrency(vatRemainder);
                })
            }

            let generalLedgerRemainder = self.netTotalCurrency() - self.generalLedgerBreakdownSum();

            if (generalLedgerRemainder) {
                self.generalLedgerEntries().forEach(gl => {
                    if (!gl.amountExVATInCurrency()) {
                        gl.amountExVATInCurrency(generalLedgerRemainder);
                    }
                })
            }
        } else {
            //self.vatEntries().forEach(v => v.vatableAmountCurrency(undefined));
            //self.generalLedgerEntries().forEach(v => v.amountExVATInCurrency(undefined));
        }
    });

    //#endregion


    //#region Methods

    //self.fetchInvoiceDates = () => {

    //    let id = self.invoiceDate();

    //    let params = {
    //        invoiceDate: new Date(id.getFullYear(), id.getMonth(), id.getDate(), 12, 0, 0, 0),
    //        supplierPaymentTermsCode: self.paymentTermsCode()
    //    }

    //    console.log('FetchInvoiceDates calling with', params);

    //    fetch('/api/InvoiceBookingAPI/FetchInvoiceDates', {
    //        method: 'POST',
    //        headers: window.fetchHeaders,
    //        credentials: 'same-origin',
    //        cache: 'no-cache',
    //        body: JSON.stringify(params)
    //    })
    //        .then(window.handleFetchResponse)
    //        .then(data => {

    //            console.log('FetchInvoiceDates returned', data);

    //            self.dueDate(new Date(data.InvoiceDueDate.replace('00:00:00', '12:00:00')));

    //            self.settlementDate(new Date(data.InvoiceSettlementDate.replace('00:00:00', '12:00:00')));

    //        })
    //        .catch(window.catchFetchError);

    //}

    self.addGeneralLedgerEntry = () => {
        self.generalLedgerEntries.push(invoiceBookingEmailInvoiceGLViewModel({
            rec: {
                generalLedgerCode: '9999999999'
            },
            parent: self
        }));
    }

    self.addVATEntry = () => {
        self.vatEntries.push(invoiceBookingEmailInvoiceVATViewModel({
            rec: {
                VATCode: self.supplier()?.DefaultVATCode
            },
            parent: self
        }));
    }

    self.removeGeneralLedgerEntry = (data) => {
        self.generalLedgerEntries.remove(data);
    }

    self.removeVATEntry = (data) => {
        self.vatEntries.remove(data);
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
}