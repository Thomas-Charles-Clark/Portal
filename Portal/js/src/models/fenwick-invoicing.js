'use strict';

const fenwickInvoicingViewModel = (() => {
    let self = {

    };

    //#region Properties

    self.busy = ko.observable(false);

    self.billingPeriodDate = ko.observable();

    self.billingPeriod = ko.observable();

    self.branch = ko.observable();

    self.selfBillInvoices = ko.observableArray();

    self.selectedSelfBillInvoice = ko.observable();

    self.validateNow = ko.observable(false);

    self.parent = {
        ready: ko.observable(true)
    }

    self.signedOff = ko.observable(false);

    self.invoiceTotalGrossSales = fieldFactory.createField({
        fieldId: "invoice-total-gross-sales",
        fieldName: "InvoiceTotalGrossSales",
        label: "Total Gross Sales",
        layoutClass: "mb-3",
        tooltip: null,
        note: null,
        required: true,
        postable: true,
        disabled: false,
        fieldTypeId: 11.1,
        sortOrder: 0,
        numericPrecision: 18,
        numericScale: 2,
        numericMin: 0,
        numericMax: 99999999,
        numericStep: 100,
        buttons: false,
        formattingCulture: 'en-GB',
        currencyCode: 'GBP'
    }, self);

    self.invoiceTotalGrossSales.params.disable = self.signedOff;

    self.invoiceTotalVAT = fieldFactory.createField({
        fieldId: "invoice-total-vat",
        fieldName: "InvoiceTotalVAT",
        label: "Total VAT",
        layoutClass: "mb-3",
        tooltip: null,
        note: null,
        required: true,
        postable: true,
        disabled: false,
        fieldTypeId: 11.1,
        sortOrder: 0,
        numericPrecision: 18,
        numericScale: 2,
        numericMin: 0,
        numericMax: 99999999,
        numericStep: 100,
        buttons: false,
        formattingCulture: 'en-GB',
        currencyCode: 'GBP'
    }, self);

    self.invoiceTotalVAT.params.disable = self.signedOff;

    self.invoiceTotalCommission = fieldFactory.createField({
        fieldId: "invoice-total-commission",
        fieldName: "InvoiceTotalCommission",
        label: "Total Commission",
        layoutClass: null,
        tooltip: null,
        note: null,
        required: false,
        postable: true,
        disabled: false,
        fieldTypeId: 11.1,
        sortOrder: 0,
        numericPrecision: 18,
        numericScale: 2,
        numericMin: 0,
        numericMax: 99999999,
        numericStep: 100,
        buttons: false,
        formattingCulture: 'en-GB',
        currencyCode: 'GBP'
    }, self);

    self.invoiceTotalCommission.params.disable = self.signedOff;

    self.signOffNotes = fieldFactory.createField({
        fieldId: "sign-off-notes",
        fieldName: "SignOffNotes",
        label: "Sign-Off Notes",
        layoutClass: "mb-3",
        tooltip: null,
        note: null,
        required: true,
        postable: true,
        disabled: false,
        fieldTypeId: 2,
        sortOrder: 0,
        maxLength: 500
    }, self);

    self.signOffNotes.params.disable = self.signedOff;

    self.invoiceDocumentPdf = ko.observable();

    self.invoiceDocumentBase64 = ko.observable();

    self.reconciliationResults = ko.observableArray([]);

    self.invoiceResults = ko.observableArray([]);

    self.notifications = ko.observableArray([]);

    //#endregion


    //#region Components

    self.genericUnsavedChangesSelect = (e, cb) => {
        e.preventDefault(); // this prevents the Kendo control from actively selecting the thing the user selected
        self.checkUnsavedChangesThenSelect(e, cb); // this does our check; async promise, confirm dialog, la la la...
    }

    self.genericUnsavedChangesClear = (e) => {
        self.checkUnsavedChangesThenClear(e);
    }

    self.billingPeriodParams = kendoMDCDropDownList({
        label: 'Billing Period',
        odata: false,
        endPoint: '/api/FenwickInvoicingAPI/GetSelfBillInvoices',
        textField: 'Label',
        valueField: 'InvoiceDate',
        virtual: false,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/SelfBillInvoices/Default.SelfBillInvoiceValueMapper(selfBillInvoiceId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.billingPeriod(data.value[0]);
                        }
                    }
                });
            }
        },
        idObservable: self.billingPeriodDate,
        objObservable: self.billingPeriod,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        select: (e) => {
            self.genericUnsavedChangesSelect(e, (e) => {
                self.fetchSelfBillInvoicesForDate(e.dataItem.InvoiceDate);
            });
        },
        clearFunction: self.genericUnsavedChangesClear,
        sort: {
            field: 'InvoiceDate',
            dir: 'desc'
        }
    });

    self.invoiceDocumentPdfParams = {
        buttonText: ko.computed(() => {
            return self.invoiceDocumentBase64() ? "Click to replace the above Self Bill Invoice PDF" : "Click here to upload the relevant Self Bill Invoice PDF"
        }, self),
        accept: ".pdf",
        label: ".pdf",
        observable: self.invoiceDocumentPdf,
        busy: ko.observable(false),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.observable(true),
        disable: self.signedOff,
        clearable: ko.observable(false),
        revertible: ko.observable(false)
    }

    self.signOffErrors = new ko.validation.group([
        //self.invoiceTotalGrossSales.value,
        //self.invoiceTotalVAT.value,
        //self.invoiceTotalCommission.value,
        //self.signOffNotes.value
    ]);

    self.exportToExcel = function (e) {
        var sheet = e.workbook.sheets[0];
        var grid = e.sender;
        var data = grid.dataSource.data();
        var gridColumns = grid.columns;
        var columns = gridColumns.map(function (col) {
            return {
                value: col.title ? col.title : col.field,
                autoWidth: true,
                background: "#7a7a7a",
                color: "#fff"
            };
        });

        var rows = [{ cells: columns, type: "header" }];

        for (var i = 0; i < data.length; i++) {
            var rowCells = [];
            for (var j = 0; j < gridColumns.length; j++) {
                var cellValue = data[i][gridColumns[j].field];
                if (typeof cellValue === 'string')
                    cellValue = cellValue.replace(/T00:00:00/g, '');
                rowCells.push({ value: cellValue });
            }
            rows.push({ cells: rowCells, type: "data" });
        }
        sheet.rows = rows;
    }

    self.detailGridSettings = {
        autoBind: true,
        widget: ko.observable(),
        useKOTemplates: true,
        rowTemplate: "detail-row-template",
        columns: [{
            field: "InvoiceID",
            title: "ID"
        }, {
            field: "InvoiceDate",
            title: "Date",
            template: "#= renderDate(InvoiceDate) #"
        }, {
            field: "SaleOrCredit",
            title: "(S)ale or<br/>(C)redit"
        }, {
            field: "ProductCode",
            title: "Product Code"
        }, {
            field: "Quantity",
            title: "Quantity"
        }, {
            field: "GrossSales",
            title: "Gross Sales"
        }, {
            field: "Discount",
            title: "Discount"
        }, {
            field: "NetSales",
            title: "Net Sales"
        }, {
            field: "DepartmentID",
            title: "Department ID"
        }, {
            field: "TillID",
            title: "Till ID"
        }, {
            field: "StaffID",
            title: "Staff ID"
        }, {
            field: "FenwickTransactionID",
            title: "Fenwick Transaction ID"
        }, {
            field: "EAN",
            title: "EAN"
        }, {
            field: "Processed",
            title: "Processed"
        }],
        data: new kendo.data.DataSource({
            page: 1,
            pageSize: 20,
            schema: {
                model: {
                    id: "InvoiceID",
                    fields: {
                        InvoiceID: { type: 'number' },
                    }
                }
            }
        }),
        sortable: true,
        filterable: {
            extra: false
        },
        reorderable: true,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        },
        excelExport: self.exportToExcel
    };
    //#endregion


    //#region Computeds

    self.selectedBranchId = ko.computed(() => {
        return self.selectedSelfBillInvoice()?.BranchID;
    }, self);

    //#endregion


    //#region Subscriptions

    self.invoiceTotalGrossSales.focusObservable.subscribe(nv => nv === false && self.save());

    self.invoiceTotalVAT.focusObservable.subscribe(nv => nv === false && self.save());

    self.invoiceTotalCommission.focusObservable.subscribe(nv => nv === false && self.save());

    self.signOffNotes.focusObservable.subscribe(nv => nv === false && self.save());

    self.billingPeriodDate.subscribe(nv => {

        self.selectedSelfBillInvoice(undefined);

        self.validateNow(false);

        self.invoiceTotalGrossSales.value(undefined);
        self.invoiceTotalGrossSales.originalValue(undefined);

        self.invoiceTotalVAT.value(undefined);
        self.invoiceTotalVAT.originalValue(undefined);

        self.invoiceTotalCommission.value(undefined);
        self.invoiceTotalCommission.originalValue(undefined);

        self.signOffNotes.value(undefined);
        self.signOffNotes.originalValue(undefined);

        self.invoiceDocumentPdf(undefined);

        self.invoiceDocumentBase64(undefined);

        self.reconciliationResults([]);

        self.invoiceResults([]);

        self.notifications([]);
    });

    self.selectedSelfBillInvoice.subscribe(nv => {
        nv && self.load();
    });

    self.invoiceDocumentPdf.subscribe(nv => {
        let fd = new FormData(document.getElementById('invoice-document-form'));

        let params = {
            obj: JSON.stringify({
                selfBillInvoiceId: self.selectedSelfBillInvoice().SelfBillInvoiceID
            })
        }

        for (const key in params) {
            fd.append(key, params[key]);
        }

        self.invoiceDocumentPdfParams.busy(true);

        let headers = Object.assign({}, window.fetchHeaders);

        delete headers["content-type"];// = "multipart/form-data";

        fetch('/api/FenwickInvoicingAPI/InvoiceDocumentUpsert', {
            method: 'POST',
            headers: headers,
            body: fd
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('InvoiceDocumentUpsert returned', data);
                self.invoiceDocumentBase64(data.InvoiceDocumentBase64);
                self.invoiceDocumentPdfParams.busy(false);
            })
            .catch(err => {
                self.invoiceDocumentPdfParams.busy(false);
                window.catchFetchError(err);
            });
    });

    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions

    //self.fetchBranches = (sb) => {
    //    fetch('/api/FenwickInvoicingAPI/FetchSelfBillInvoiceBranches', {
    //        method: 'POST',
    //        headers: window.fetchHeaders,
    //        body: JSON.stringify({
    //            selfBillInvoiceId: selfBillInvoiceId
    //        })
    //    }).then(window.handleFetchResponse)
    //        .then(data => {
    //            let bp = self.billingPeriod();

    //            bp.Branches = data;

    //            self.billingPeriod(bp);
    //        })
    //        .catch(err => window.catchFetchError);
    //}

    self.ready = () => {
        self.busy(false);
    }

    self.checkUnsavedChangesThenSelect = async (event, callback) => {
        await self.unsavedChanges().then((d) => {
            //console.log('go', event.sender.options.dataValueField, event.dataItem[event.sender.options.dataValueField]);
            event.sender._widgetOptions.value(event.dataItem[event.sender.options.dataValueField]);

        }).then(() => {
            if (typeof callback === 'function')
                callback(event);
        }).catch((e) => { });
    }

    self.checkUnsavedChangesThenClear = async (options) => {
        await self.unsavedChanges().then(() => {
            var self = options; // self is now the params of the control the user just interacted with

            if (ko.isObservableArray(self.observable)) {
                self.observable([]);
            } else {
                self.observable(undefined);
            }
            if (self.dropDownListSettings.widget()) {
                if (ko.isObservableArray(self.observable)) {
                    self.dropDownListSettings.widget().value([]);
                } else {
                    self.dropDownListSettings.widget().value('');
                }
                self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                if (self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_ != null)
                    self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_.float(false);
            }
            if (typeof self.afterClear === 'function') {
                self.afterClear();
            }
        }).catch((e) => { });
    }

    self.checkUnsavedChangesThenExecute = async (event, fn, args) => {
        await self.unsavedChanges().then((d) => {
            fn(args);
        }).catch((e) => { });
    }

    self.unsavedChanges = () => {
        return new Promise((resolve, reject) => {
            let unsaved = self.invoiceTotalGrossSales.unsavedChanges() ||
                self.invoiceTotalVAT.unsavedChanges() ||
                self.invoiceTotalCommission.unsavedChanges() ||
                self.signOffNotes.unsavedChanges();

            if (unsaved) {
                window.showConfirm('Unsaved changes', 'You have unsaved changes. If you proceed your changes will be lost. Proceed?', () => {
                    resolve();
                }, () => {
                    reject();
                });
            } else {
                resolve();
            }
        });
    }

    self.selectBranch = (b, e) => {
        if (b.BranchID != self.selectedBranchId()) {
            self.checkUnsavedChangesThenExecute(e, self.selectedSelfBillInvoice, b);
            //self.selectedSelfBillInvoice(b);
        }
    }

    self.fetchSelfBillInvoicesForDate = (sbid, onComplete) => {
        self.busy(true);

        let data = {
            invoiceDate: sbid
        }

        console.log("fetchSelfBillInvoicesForDate calling with", data);

        fetch(`/api/FenwickInvoicingAPI/FetchSelfBillInvoicesForDate`, {
            method: "POST",
            headers: window.fetchHeaders,
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log("fetchSelfBillInvoicesForDate returned", data);
                self.selfBillInvoices(data.map(d => {
                    return Object.assign({
                        bootstrapPopoverDetails: {
                            title: "Details",
                            html: true,
                            sanitize: false,
                            busy: ko.observable(false),
                            data: ko.observable(),
                            element: ko.observable(),
                            container: 'td.text-center',
                            placement: 'left',
                            fallbackPlacements: ['top'],
                            customClass: 'invoices-popover',
                            content: (element) => {
                                let e = ko.dataFor(element);
                                return `<span class="d-block">Processed: ${new moment(e.ProcessedDT).format('DD/MM/YYYY HH:mm:ss')}</span>
                                <span class="d-block">OrderHeadID: ${e.OrderHeadID}</span>
                                <span class="d-block">Accepted By Mertex: ${(e.OrderHead?.AcceptedByMertexDT == null ? "Not Yet" : new moment(e.OrderHead?.AcceptedByMertexDT).format('DD/MM/YYYY HH:mm:ss'))}</span>`;
                            },
                            trigger: 'click',
                            //container: 'td',
                            solo: true,
                            show: null,
                            shown: null,
                            hide: null,
                            hidden: null,
                            inserted: async function (event) {
                                
                            },
                            popperConfig: function (defaultBsPopperConfig) {
                                return defaultBsPopperConfig;
                            }
                        }
                    }, d);
                }));

                window.setTimeout(() => {
                    document.addEventListener("click", (e) => {
                        if (e.target.closest('.invoices-popover') == null) {
                            document.querySelectorAll('[data-bind*="actualBootstrapPopover"]').forEach(e => {
                                let p = bootstrap.Popover.getInstance(e);
                                if (p) {
                                    p.hide();
                                }
                            });
                        }
                    });
                }, 0);

                if (typeof onComplete == 'function')
                    onComplete();
                else
                    self.busy(false);
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })

    }

    self.load = (onComplete) => {
        self.busy(true);

        let date = self.billingPeriodDate().slice(0, 10);

        fetch(`/api/FenwickInvoicingAPI/BranchSelfBillInvoiceSelect?branchId=${self.selectedBranchId()}&date=${date}`, {
            method: 'GET',
            headers: window.fetchHeaders
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log("load returned", data);
                self.invoiceDocumentBase64(data.InvoiceDocumentBase64);
                self.reconciliationResults(data.Reconciliations);
                self.invoiceResults(data.Invoices);
                self.notifications(data.Notifications);

                self.detailGridSettings.widget().dataSource.data(self.invoiceResults());

                self.invoiceTotalGrossSales.value(self.selectedSelfBillInvoice().TotalGrossSales);
                self.invoiceTotalGrossSales.originalValue(self.invoiceTotalGrossSales.value());

                self.invoiceTotalCommission.value(self.selectedSelfBillInvoice().TotalCommission);
                self.invoiceTotalCommission.originalValue(self.invoiceTotalCommission.value());

                self.invoiceTotalVAT.value(self.selectedSelfBillInvoice().TotalVAT);
                self.invoiceTotalVAT.originalValue(self.invoiceTotalVAT.value());

                self.signOffNotes.value(self.selectedSelfBillInvoice().Notes);
                self.signOffNotes.originalValue(self.signOffNotes.value());

                self.signedOff(self.selectedSelfBillInvoice().SignedOff);

                if (typeof onComplete === 'function') {
                    onComplete();
                } else {
                    self.busy(false);
                }
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.openInvoiceDocument = () => {
        let base64 = self.invoiceDocumentBase64();

        if (self.invoiceDocumentBase64()?.indexOf('application/pdf') > -1 ||
            self.invoiceDocumentBase64()?.indexOf('image/') > -1) {
            var x = window.open();

            x.document.open();

            let iframe = x.document.createElement("iframe");// ""<iframe width='100%' height='100%'></iframe>"

            iframe.src = base64;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.binvoice = 0;

            let wrapper = x.document.createElement('div');

            wrapper.style.width = '100vh';
            wrapper.style.height = '100vh';
            wrapper.style.display = 'flex';
            wrapper.style.padding = '1em';
            wrapper.style['align-items'] = 'center';
            wrapper.style['justify-content'] = 'center';

            wrapper.appendChild(iframe);

            x.document.appendChild(wrapper);

            x.document.close();

        } else {
            window.open(self.invoiceDocumentBase64(), '_self');
        }
    }

    self.save = (signOff = false) => {
        //self.validateNow(true);

        //let canProceed = true;

        //self.signOffErrors.showAllMessages(false);

        //self.signOffErrors.forEach(x => {
        //    if (!x.isValid()) {
        //        canProceed = false;
        //        x.isValid.notifySubscribers(x.isValid());
        //    }
        //});

        //if (canProceed) {
        //    console.log("signOff permitted");

        let complete = (signOff) => {
            self.busy(true);

            fetch("/api/FenwickInvoicingAPI/SaveSelfBillInvoice", {
                method: "POST",
                headers: window.fetchHeaders,
                body: JSON.stringify({
                    selfBillInvoiceId: self.selectedSelfBillInvoice().SelfBillInvoiceID,
                    grossSales: self.invoiceTotalGrossSales.value(),
                    vat: self.invoiceTotalVAT.value(),
                    commission: self.invoiceTotalCommission.value(),
                    notes: self.signOffNotes.value(),
                    signedOff: signOff
                })
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    //self.validateNow(false);

                    //self.invoiceTotalGrossSales.originalValue(self.invoiceTotalGrossSales.value());
                    //self.invoiceTotalCommission.originalValue(self.invoiceTotalCommission.value());
                    //self.invoiceTotalVAT.originalValue(self.invoiceTotalVAT.value());
                    //self.signOffNotes.originalValue(self.signOffNotes.value());

                    //// so we don't need to cause a reload cascade?
                    //self.selectedSelfBillInvoice().TotalGrossSales = self.invoiceTotalGrossSales.value();
                    //self.selectedSelfBillInvoice().TotalVAT = self.invoiceTotalVAT.value();
                    //self.selectedSelfBillInvoice().TotalCommission = self.invoiceTotalCommission.value();
                    //self.selectedSelfBillInvoice().Notes = self.signOffNotes.value();

                    //self.reload();

                    //

                    self.fetchSelfBillInvoicesForDate(self.billingPeriodDate(), () => {
                        let selectedSelfBillInvoiceId = self.selectedSelfBillInvoice().SelfBillInvoiceID;
                        self.selectedSelfBillInvoice(self.selfBillInvoices().find(sbi => sbi.SelfBillInvoiceID == selectedSelfBillInvoiceId));
                    });

                    //if (signOff) {
                    //    self.reload();
                    //} else {
                    //    self.reload();
                    //    self.busy(false);
                    //}
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                });
        }

        if (signOff) {
            window.showConfirm("Are you sure?", "Please double check before saving.", () => {
                complete(signOff);
            }, null);
        } else {
            complete(signOff);
        }
    }

    self.submitSignedOffInvoices = () => {
        let submit = () => {
            self.busy(true);
            fetch("/api/FenwickInvoicingAPI/SubmitSignedOffInvoices", {
                method: "POST",
                headers: window.fetchHeaders
            })
            .then(window.handleFetchResponse)
            .then(data => {
                self.busy(false);
                window.showInfo("Information", "Signed-off invoices queued for submission to Mertex.");
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            });
        }

        window.showConfirm("Are you sure?", "Submitting signed-off invoices cannot be undone.", () => {
            submit();
        }, null);
    }

    self.deleteACLSales = () => {
        let submit = () => {
            self.busy(true);
            fetch("/api/FenwickInvoicingAPI/DeleteACLSales", {
                method: "POST",
                headers: window.fetchHeaders
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.busy(false);
                    window.showInfo("Information", "ACL Sales deleted.");
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                });
        }

        window.showConfirm("Are you sure?", "Deleting ACL Sales cannot be undone.", () => {
            submit();
        }, null);
    }

    self.reload = () => {
        self.load(() => {
            self.fetchSelfBillInvoicesForDate(self.billingPeriodDate());
        });

        //self.billingPeriodParams.dropDownListSettings.widget().one('dataBound', (e) => {

        //    let bp = self.billingPeriodParams.dropDownListSettings.widget().dataSource.data().find(d => d.InvoiceDate == self.billingPeriodDate());
        //    self.billingPeriod(bp);
        //    let b = bp.Branches.find(d => d.BranchID === self.selectedBranchId());
        //    self.selectBranch(b);
        //});

        //self.billingPeriodParams.dropDownListSettings.widget().dataSource.query({});
        //self.billingPeriodParams.dropDownListSettings.widget().trigger("change");
    }

    //#endregion

    //#region Events


    //#endregion

    return self;
});

const otherViewModel = ((data, parent) => {
    let self = Object.assign(data, {

    });

    //#region Properties



    //#endregion


    //#region Computeds



    //#endregion


    //#region Components



    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions



    //#endregion


    //#region Events



    //#endregion

    return self;
});