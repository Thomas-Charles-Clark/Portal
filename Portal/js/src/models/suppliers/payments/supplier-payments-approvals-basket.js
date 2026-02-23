const supplierPaymentsApprovalsBasketViewModel = ({
    ready,
    busy,
    busyMessage,
    filters,
    refreshApprovals,
    refreshDashboard
} = {
    ready: ko.observable(false),
    busy: ko.observable(false),
    busyMessage: ko.observable('Please Wait'),
    filters: {},
    refreshApprovals: () => { },
    refreshDashboard: () => { }
}) => {

    let self = {
        ready,
        busy,
        busyMessage,
        filters,
        refreshApprovals,
        refreshDashboard
    };

    //#region Properties

    self.basketElement = document.querySelector('#basket-sidebar');

    self.items = ko.observableArray([]);

    self.gridWidget = ko.observable();

    self.readOnlyMode = ko.observable(false);

    //#endregion


    //#region Lifted Methods

    self.showPeriodClosedWarning = () => {

        let di = self.filters.paymentPeriodParams.dropDownListSettings.widget().dataItem();

        window.showInfo('Period Finalised', `Period ${di.Label}: ${moment(di.FinalisedDT).format('dddd DD/MM/YYYY')}.`);

    }

    //#endregion


    //#region Components


    self.gridDataSource = new kendo.data.DataSource({
        sortable: true,
        filterable: true,
        grouping: true,
        group: [{
            field: 'RequestType',
            dir: 'asc',
            aggregates: [{
                field: 'Request_OutstandingAmount_CUR',
                aggregate: 'sum'
            }, {
                field: 'Request_OutstandingAmount_GBP',
                aggregate: 'sum'
            }, {
                field: 'Decision_Amount_GBP',
                aggregate: 'sum'
            }, {
                field: 'Decision_Amount_CUR',
                aggregate: 'sum'
            }]
        }, {
            field: 'CurrencyCode',
            dir: 'asc',
            aggregates: [{
                field: 'Request_OutstandingAmount_CUR',
                aggregate: 'sum'
            }, {
                field: 'Request_OutstandingAmount_GBP',
                aggregate: 'sum'
            }, {
                field: 'Decision_Amount_GBP',
                aggregate: 'sum'
            }, {
                field: 'Decision_Amount_CUR',
                aggregate: 'sum'
            }]
        }],
        serverGrouping: false,
        serverFiltering: true,
        serverPaging: false,
        page: 1,
        pageSize: undefined,
        batch: true,
        type: "odata-v4",
        transport: {
            read: {
                url: () => {
                    let filters = self.filters.basketFilters();
                    return `/supplier-payments-odata/SupplierPaymentApproval_Basket_SelectRecords/SupplierPayments.SupplierPaymentsBasketGridRead(dto=@d)?@d={"PeriodID":${filters.periodId}}`;
                }
            },
            update: {
                url: function (item) {
                    return `/supplier-payments-odata/SupplierPaymentApproval_Basket_SelectRecords(PaymentDecisionID=${item.PaymentDecisionID},CurrencyCode='${item.CurrencyCode}')`
                }
            },
            create: {
                url: '/supplier-payments-odata/SupplierPaymentApproval_Basket_SelectRecords'
            },
            batch: {
                url: '/supplier-payments-odata/$batch'
            },
            destroy: {
                url: function (item) {
                    return `/supplier-payments-odata/SupplierPaymentApproval_Basket_SelectRecords(PaymentDecisionID=${item.PaymentDecisionID},CurrencyCode='${item.CurrencyCode}')`
                }
            },
            parameterMap: function (options, type) {

                console.log(type, options);

                var result = kendo.data.transports["odata-v4"].parameterMap(options, type);

                return result;
            }
        },
        schema: {
            errors: function (response) {
                if (response && response.responses) {
                    var errors = [];
                    response.responses.forEach(function (r) {
                        if (r.status < 200 || r.status >= 300) {
                            // Extract the message from the body
                            errors.push(r.body && r.body.error ? r.body.error.message : "Unknown Error");
                        }
                    });
                    if (errors.length > 0) return errors.join(", ");
                }
                return null;
            },
            // 2. Ensure data returns an array even if segments failed
            data: function (response) {
                // If the parser failed to populate 'collections', 
                // you may need to return an empty array to prevent a crash
                return response.value || (response.responses ? [] : response);
            },
            parse: function (data) {
                console.log(`paymentApprovalsBasket schema.parse called with`, data);

                if (Array.isArray(data)) {
                    data.forEach(d => {
                        delete d['@odata.context'];
                    });
                } else {
                    for (let i = 0; i < data.value.length; i++) {
                        if (data.value[i].PurchaseOrders != null) {
                            data.value[i].PurchaseOrders = JSON.parse(data.value[i].PurchaseOrders);
                        }
                    }
                }

                self.readOnlyMode(false);

                return data;
            },
            model: {
                id: 'PaymentDecisionID',
                fields: {
                    PaymentDecisionID: {
                        type: 'number',
                        editable: false
                    },
                    CurrencyCode: {
                        type: 'string',
                        editable: false
                    },
                    SortOrder: {
                        type: 'number',
                        editable: false
                    },
                    RequestType: {
                        type: 'string',
                        editable: false
                    },
                    RequesterComments: {
                        type: 'string',
                        editable: false
                    },
                    SupplierCode: {
                        type: 'string',
                        editable: false
                    },
                    SupplierName: {
                        type: 'string',
                        editable: false
                    },
                    RequesterName: {
                        type: 'string',
                        editable: false
                    },
                    RequesterEmail: {
                        type: 'string',
                        editable: false
                    },
                    FormattingCulture: {
                        type: 'string',
                        editable: false
                    },
                    Request_OutstandingAmount_CUR: {
                        type: 'number',
                        editable: false
                    },
                    Request_OutstandingAmount_GBP: {
                        type: 'number',
                        editable: false
                    },
                    Decision_Amount_CUR: {
                        type: 'number'
                    },
                    Decision_Amount_GBP: {
                        type: 'number',
                        editable: false
                    },
                    PayOnDate: {
                        type: 'date',
                        format: 'dd/MM/yyyy',
                        defaultValue: new Date(),
                        editable: true,
                        validation: {
                            required: {
                                message: 'You must specify a Pay On Date'
                            }
                        }
                    }
                }
            }
        },
        error: function (e) {
            if (e.xhr &&
                e.xhr.responseJSON &&
                e.xhr.responseJSON.error &&
                e.xhr.responseJSON.error.innererror &&
                e.xhr.responseJSON.error.innererror.message.indexOf('period has been finalised') > -1) {

                self.readOnlyMode(true);

                if (document.querySelector('#approvals-tab-pane').classList.contains('show') == false) {
                    document.querySelector('#approvals-tab-btn').addEventListener('show.bs.tab', self.showPeriodClosedWarning)
                } else {
                    self.showPeriodClosedWarning();
                }
            }
            else {
                if (typeof window.showError == 'function') {
                    window.showError("supplierPaymentBasketGrid errors: <br/><br/><pre class='prettyprint linenums bg-dark'>" + PR.prettyPrintOne(JSON.stringify(e, null, '\t')) + "</pre>");
                } else {
                    window.addEventListener('load', () => {
                        window.showError("supplierPaymentBasketGrid errors: <br/><br/><code class='prettyprint linenums'>" + PR.prettyPrintOne(JSON.stringify(e, null, '\t')) + "</code>");
                    })
                }

            }
        },
        requestStart: (e) => {
            //self.busy(true);
            console.log(`supplierPaymentBasketGrid dataSource requestStart`, e);

            if (e.type != 'submit') {
                if (e.sender.hasChanges()) {
                    e.preventDefault();
                    self.busy(false);
                    console.log('supplierPaymentBasketGrid showing unsavedChanges info');
                    window.showInfo('Unsaved Changes', 'You have unsaved changes. Please cancel or save them before performing any other action.');
                }
            }
        },
        requestEnd: (e) => {
            document.querySelector('#approvals-tab-btn').removeEventListener('show.bs.tab', self.showPeriodClosedWarning);

            console.log(`supplierPaymentBasketGrid dataSource requestEnd`);

            self.busy(false);
        },
        noDataTemplate: 'Nothing to display',
        change: (e) => {
            console.log(`supplierPaymentBasketGrid dataSource change`, e);

            if (e.action === "itemchange") {
                let model = e.items[0];
                switch (e.field) {
                    case "PaymentDueDate":
                        let periodId = moment(model.PaymentDueDate).weekdayWithStartWeekday(0, 1).format('YYYYMMDD');
                        model.set('PeriodID', +periodId);
                        break;
                    default: break;
                }

                $(`#basket-grid-container .k-button.k-grid-save-changes`).show();
                $(`#basket-grid-container .k-button.k-grid-cancel-changes`).show();
            }
        }
    });

    self.gridToolbar = [
        'save',
        'cancel'
    ];

    self.gridColumns = [
    //{
    //    field: 'PeriodID',
    //    title: 'Period',
    //    attributes: {
    //        "class": "readonly"
    //    },
    //    template: (e) => {
    //        if (e.PeriodID) {
    //            let arraySplit = e.PeriodID.toString().match(/(\d\d\d?\d?)(\d\d)(\d\d)/);
    //            let dateString = `${arraySplit[1]}/${arraySplit[2]}/${arraySplit[3]}`;
    //            return moment(Date.parse(dateString)).weekdayWithStartWeekday(0, 1).format('DD/MM/YYYY');
    //        } else {
    //            let momentFormatted = '';

    //            if (e.PaymentDueDate) {
    //                momentFormatted = moment(e.PaymentDueDate).weekdayWithStartWeekday(0, 1).format('DD/MM/YYYY');
    //            }

    //            return momentFormatted;
    //        }
    //    },
    //    valueTemplate: (e) => {
    //        if (e.PeriodID) {
    //            let arraySplit = e.PeriodID.toString().match(/(\d\d\d?\d?)(\d\d)(\d\d)/);
    //            let dateString = `${arraySplit[1]}/${arraySplit[2]}/${arraySplit[3]}`;
    //            return moment(Date.parse(dateString)).weekdayWithStartWeekday(0, 1).format('DD/MM/YYYY');
    //        } else {
    //            return '';
    //        }
    //    }
    //},
    {
        field: 'PaymentDecisionID',
        title: 'Payment Decision ID',
        hidden: true
    },
    {
        field: 'CurrencyCode',
        title: 'Currency Code',
        hidden: true,
        groupHeaderTemplate: (data) => {

            let result = data.value ? `${data.value}` : ``;

            let resultArray = [
                `<span class="d-inline-block">${data.value}</span>`,
                `<span class="d-inline-block ps-3">${formatCurrency(data.Request_OutstandingAmount_CUR.sum, 2, data.items[0].FormattingCulture, data.items[0].CurrencyCode)}</span>`,
                `<span class="d-inline-block ps-3">${formatCurrency(data.Decision_Amount_CUR.sum, 2, data.items[0].FormattingCulture, data.items[0].CurrencyCode)}</span>`,
            ];

            return resultArray.join(' ');

        }
    }, {
        field: 'SortOrder',
        title: 'Sort Order',
        hidden: true
    }, {
        field: 'RequestType',
        title: 'Request Type',
        hidden: true,
        groupHeaderTemplate: (data) => {
            let result = data.value ? `${data.value}` : ``;

            let resultArray = [
                `<span class="d-inline-block">${data.value}</span>`,
                `<span class="d-inline-block ps-3">${formatCurrency(data.Request_OutstandingAmount_GBP.sum, 2, 'en-GB', 'GBP')}</span>`,
                `<span class="d-inline-block ps-3">${formatCurrency(data.Decision_Amount_GBP.sum, 2, 'en-GB', 'GBP')}</span>`,
            ];

            return resultArray.join(' ');

            //if (aggregates.Request_OutstandingAmount_CUR) {
            //    totals.push(aggregates.Request_OutstandingAmount_CUR.value);
            //}

            /*
            
            [{
                field: 'Request_OutstandingAmount_CUR',
                aggregate: 'sum'
            }, {
                field: 'Request_OutstandingAmount_GBP',
                aggregate: 'sum'
            }, {
                field: 'Decision_Amount_CUR',
                aggregate: 'sum'
            }]

            */

            return result;
        },
        template: (e) => {
            if (e.RequestType) {
                return e.RequestType;
            } else {
                return '';
            }
        },
        valueTemplate: (e) => {
            if (e.RequestType) {
                return e.RequestType;
            } else {
                return '';
            }
        }
    }, {
        field: 'RequesterComments',
        title: 'Requester Comments',
        width: 300
        //width: 36,
        //template: (dataItem) => {
        //    return `<a tabindex="0"
        //                class="bi bi-info-circle fs-4"
        //                data-bs-html="true"
        //                data-bs-trigger="focus"
        //                data-bs-toggle="popover"
        //                data-bs-title="Requester Comments"
        //                data-bs-content="${(dataItem.RequesterComments ?? 'None')}"></a>`;
        //},
        //valueTemplate: (dataItem) => {
        //    return `<a tabindex="0"
        //                class="bi bi-info-circle fs-4"
        //                data-bs-html="true"
        //                data-bs-trigger="focus"
        //                data-bs-toggle="popover"
        //                data-bs-title="Requester Comments"
        //                data-bs-content="${(dataItem.RequesterComments ?? 'None')}"></a>`;
        //},
    }, {
        field: 'SupplierCode',
        title: 'Supplier',
        editable: false,
        template: (e) => {
            return `${e.SupplierCode} - ${e.SupplierName}`;
        }
    }, {
        field: 'RequesterName',
        title: 'Requested By',
        width: 200,
        editable: false,
        template: (e) => {
            return `<a href="mailto:${e.RequesterEmail}">${e.RequesterName}</a>`;
        }
    }, {
        field: 'Request_OutstandingAmount_CUR',
        title: 'Requested Amount',
        width: 200,
        attributes: {
            "class": "readonly"
        },
        template: (e) => {
            return formatCurrency(e.Request_OutstandingAmount_CUR, 2, e.FormattingCulture, e.CurrencyCode);
        },
        valueTemplate: (e) => {
            return formatCurrency(e.Request_OutstandingAmount_CUR, 2, e.FormattingCulture, e.CurrencyCode);
            }
    },
        //{
        //field: 'Request_OutstandingAmount_GBP',
        //title: 'Outstanding Amount in Sterling',
        //attributes: {
        //    "class": "readonly"
        //},
        //template: (e) => {
        //    return formatCurrency(e.Request_OutstandingAmount_GBP, 2, 'en-GB', 'GBP');
        //},
        //valueTemplate: (e) => {
        //    return formatCurrency(e.Request_OutstandingAmount_GBP, 2, 'en-GB', 'GBP');
        //},
        //},
    {
        field: 'Decision_Amount_CUR',
        title: 'To Pay',
        width: 200,
        template: (e) => {
            return formatCurrency(e.Decision_Amount_CUR, 2, e.FormattingCulture, e.CurrencyCode);
        },
        valueTemplate: (e) => {
            return formatCurrency(e.Decision_Amount_CUR, 2, e.FormattingCulture, e.CurrencyCode);
        },
        editor: (container, options) => {
            $('<input required data-bind="value:' + options.field + '" name="' + options.field + '" validationMessage="You must specify an Amount"/>')
                .appendTo(container)
                .kendoNumericTextBox({
                    format: "n2",
                    decimals: 2,
                    selectOnFocus: true,
                    change: (e) => {
                        console.log('paymentApprovalsBasket decisionAmount change', e);
                    }
                });
        }
    }, {
        field: 'Decision_Amount_GBP',
        title: 'To Pay GBP',
        width: 200,
        attributes: {
            "class": "readonly"
        },
        template: (e) => {
            if (e.Decision_Amount_GBP) {
                return formatCurrency(e.Decision_Amount_GBP, 2, 'en-GB', 'GBP');
            } else {
                return formatCurrency(e.Decision_Amount_CUR / e.ExchangeRate, 2, 'en-GB', 'GBP');
            }
        },
        valueTemplate: (e) => {
            if (e.Decision_Amount_GBP) {
                return formatCurrency(e.Decision_Amount_GBP, 2, 'en-GB', 'GBP');
            } else {
                return formatCurrency(e.Decision_Amount_CUR / e.ExchangeRate, 2, 'en-GB', 'GBP');
            }
        },
    }, {
        field: 'PayOnDate',
        title: 'Pay On Date',
        width: 150,
        format: 'dd/MM/yyyy',
        parseFormats: ["dd/MM/yyyy", "dd/MM/yy"],
        autoCorrectParts: true,
        editable: true,
        template: (e) => {
            if (e.PayOnDate) {
                return moment(e.PayOnDate).format('DD/MM/YYYY');
            } else {
                return moment(new Date()).weekdayWithStartWeekday(0, 1).format('DD/MM/YYYY');
            }
        },
        valueTemplate: (e) => {
            if (e.PayOnDate) {
                return moment(e.PayOnDate).format('DD/MM/YYYY');
            } else {
                return moment(new Date()).weekdayWithStartWeekday(0, 1).format('DD/MM/YYYY');
            }
        }
    }, {
        command: [{
            name: 'Remove',
            className: 'btn-danger',
            click: function (e) {
                console.log('remove', e);
                e.preventDefault();
                let tr = $(e.target).closest("tr");
                let data = this.dataItem(tr);

                // I liked this, Matt didn't
                //if (!self.basketElement.classList.contains('pinned'))
                //    self.basketElement.classList.add('pinned');

                window.showConfirm('Are you sure?', 'Please confirm removal of this payment approval', () => {
                    self.removeBasketItem(data);
                }, null);
            }
        }]
    }];

    self.skipEditEvent = true;

    self.gridParams = {
        autoBind: false,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: self.gridDataSource,
        toolbar: self.gridToolbar,
        scrollable: false,
        sortable: true,
        filterable: true,
        reorderable: false,
        groupable: false,
        paging: true,
        pageable: {
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        beforeEdit: function (e) {

        },
        selectable: false,
        editable: {
            createAt: "top"
        },
        edit: function (e) {

            console.log('paymentApprovalsBasket edit', e);

            //if (e.model.isNew() && self.skipEditEvent) {

            //    e.preventDefault();

            //    self.skipEditEvent = false;

            //    e.sender.editCell($(e.sender.element.find('tr.k-grid-edit-row td:eq(3)')));

            //    return;
            //} else {

            //    window.setTimeout(() => {

            //        let dropdown = e.container.find("[data-role=dropdownlist]").data("kendoDropDownList");

            //        if (dropdown) {
            //            dropdown.open();
            //            return;
            //        }

            //        let datePicker = e.container.find("[data-role=datepicker]").data("kendoDatePicker");

            //        if (datePicker) {
            //            datePicker.setOptions({
            //                close: (event) => {
            //                    console.log('close fired', event);
            //                    e.sender.editCell($(e.container).closest('tr').find("td:eq(4)"));
            //                }
            //            });

            //            datePicker.open();
            //        }

            //        self.skipEditEvent = false;

            //    }, 0);
            //}
        },
        dataBound: (e) => {
            console.log('paymentApprovalsBasket dataBound', e);
            self.gridWidget.valueHasMutated();

            let grid = e.sender;

            let rows = grid.items();

            let items = [];

            $(rows).each(function () {
                let dataItem = grid.dataItem(this);

                items.push(dataItem);
            });

            self.items(items);

            self.refreshDashboard();

            window.setTimeout(() => {
                const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
                const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl, {
                    container: popoverTriggerEl
                }));
            }, 0);
        },
        saveChanges: (e) => {
            console.log('paymentApprovalsBasket saveChanges', e);
            
            let data = e.sender.dataSource.data();

            for (let i = 0; i < data.length; i++) {

                let item = data[i];

                if (item.isNew() || item.dirty) {

                    if (item.Decision_Amount_GBP == null) {
                        item.Decision_Amount_GBP = 0;
                    }

                    item.PayOnDate = new Date();
                }
            }

            //self.skipEditEvent = true;
        },
        save: (data) => {
            console.log('paymentRequests save', data);

            //if (Object.hasOwn(data.values, 'PaymentDueDate')) {
            //    window.setTimeout(() => {
            //        data.sender.editCell($(data.sender.table).find('td:eq(4)'));
            //    }, 0);
            //} else if (Object.hasOwn(data.values, 'SupplierCode')) {
            //    window.setTimeout(() => {
            //        data.sender.editCell($(data.sender.table).find('td:eq(6)'));
            //    })
            //} else if (Object.hasOwn(data.values, 'AmountInCurrency')) {
            //    window.setTimeout(() => {
            //        if (data.sender.options.identifier == 'paymentPlanGrid') {
            //            data.sender.editCell($(data.sender.table).find('td:eq(10)'));
            //        } else {
            //            data.sender.editCell($(data.sender.table).find('td:eq(9)'));
            //        }
            //    })
            //}
        },
        error: function (e) {
            console.error(`paymentRequests errors`, e);

            // e.xhr contains the full response from the server
            var response = JSON.parse(e.xhr.responseText);

            var message = JSON.stringify(response.error, null, '\t');

            self.busy(false);

            window.showInfo('Errors', PR.prettyPrintOne(message));

            // Revert changes in the grid, possibly? maybe not
            self.gridWidget().cancelChanges();
        }
    };


    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds

    self.countDisplay = ko.computed(() => {
        let total = self.gridWidget() ? self.gridWidget().dataSource.total() : 0;
        return `(${total} item${total == 1 ? '' : 's'})`;
    }, 0);

    self.canClearBasket = ko.computed(() => {
        return (self.readOnlyMode() == false) && (self.gridWidget() && self.gridWidget().dataSource.data().length != 0);
    }, self);

    //#endregion



    //#region Subscriptions

    self.readOnlyMode.subscribe(nv => {
        if (nv) {
            self.gridParams.widget().setOptions({
                editable: {
                    mode: 'incell',
                    editable: false,
                    readonly: true
                },
                toolbar: null
            });
        } else {
            document.querySelector('#approvals-tab-btn').removeEventListener('show.bs.tab', self.showPeriodClosedWarning);
            self.gridParams.widget().setOptions({
                editable: {
                    mode: 'incell',
                    editable: true,
                    readonly: false
                },
                toolbar: self.gridToolbar
            });
        }
    });

    //#endregion



    //#region Methods

    self.clear = () => {

        // I liked this, Matt didn't
        //if (!self.basketElement.classList.contains('pinned'))
        //    self.basketElement.classList.add('pinned');

        window.showConfirm('Are you sure?', 'This will clear all the items from your basket.', () => {
            self.removeAllBasketItems();
        }, null)
    }

    self.togglePinning = (data, event, forced) => {
        if (typeof forced != 'undefined') {
            if (forced) {
                self.basketElement.classList.add('pinned');
            } else {
                self.basketElement.classList.remove('pinned');
            }
        } else {
            self.basketElement.classList.toggle('pinned');
        }
        event && event.target.closest('button') && event.target.closest('button').blur();
    }

    self.addBasketItem = (item) => {
        //item.busy(true);

        let data = {
            paymentRequestId: item.PaymentRequestID,
            amountInCurrency: item.OutstandingAmountInCurrency,
            payOnDate: item.PayOnDate
        }

        console.log('addBasketItem calling with', data);

        fetch('/api/SupplierPayments/AddBasketItem', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                //item.busy(false);

                console.log('addBasketItem returned', data);

                self.refresh();

                self.refreshApprovals();
            })
            .catch(err => {
                //item.busy(false);
                window.catchFetchError(err);
            })
    }

    self.updateBasketItem = (item) => {
        //item.busy(true);

        let data = {
            paymentDecisionId: item.PaymentDecisionID,
            amountInCurrency: item.amountApprovedInCurrency()
        }

        console.log('updateBasketItem calling with', data);

        fetch('/api/SupplierPayments/UpdateBasketItem', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('updateBasketItem returned', data);
                //item.busy(false);
                self.refresh();
            })
            .catch(err => {
                //item.busy(false);
                window.catchFetchError(err);
            })
    }

    self.removeBasketItem = (item) => {
        //item.busy(true);

        let data = {
            paymentDecisionId: item.PaymentDecisionID
        }

        console.log('removeBasketItem calling with', data);

        fetch('/api/SupplierPayments/RemoveBasketItem', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                //item.busy(false)

                console.log('removeBasketItem returned', data);

                self.refresh();

                self.refreshApprovals();
            })
            .catch(err => {
                //item.busy(false);
                window.catchFetchError(err);
            })
    }

    self.removeAllBasketItems = () => {
        // this call is already window.showConfirm wrapped

        let data = {
            paymentDecisionIds: self.gridWidget().dataSource.data().map(d => d.PaymentDecisionID)
        };

        console.log('removeAllBasketItemsForPeriod calling with', data);

        fetch('/api/SupplierPayments/RemoveAllBasketItemsForPeriod', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('removeAllBasketItemsForPeriod returned', data);
                self.refreshApprovals();
                self.refresh();
            })
            .catch (window.catchFetchError)
    }

    self.finaliseBasket = () => {

        // I liked this, Matt didn't
        //if (!self.basketElement.classList.contains('pinned'))
        //    self.basketElement.classList.add('pinned');

        let di = self.filters.paymentPeriodParams.dropDownListSettings.widget().dataItem();

        window.showConfirm('Are you sure?', `This action will finalise the period ${di.Label}`, () => {

            self.busy(true);

            let data = {
                periodId: di.PeriodID,
                basketItems: self.gridParams.widget().dataSource.data().map(i => {
                    return {
                        paymentDecisionId: i.PaymentDecisionID,
                        paymentRequestId: i.PaymentRequestID,
                        amountApprovedInCurrency: i.AmountInCurrency
                    }
                })
            }

            fetch('/api/SupplierPayments/FinaliseApprovalBasket', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-cache',
                credentials: 'same-origin',
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    if (data.SuccessMessage) {
                        window.showInfo('Complete', data.SuccessMessage);
                    } else {
                        window.showError('Error', `Error No. ${data.ErrorNumber}<br/><br/>${data.ErrorMessage}`);
                    }
                    self.busy(false);

                    self.refreshApprovals();
                })
                .catch(err => {
                    window.catchFetchError(err);
                    self.busy(false);
                })
        }, null);
    }

    self.refresh = () => {
        self.gridWidget().dataSource.query({
            page: self.gridWidget().dataSource.page(),
            pageSize: self.gridWidget().dataSource.pageSize(),
            filter: self.gridWidget().dataSource.filter(),
            sort: self.gridWidget().dataSource.sort(),
            group: self.gridWidget().dataSource.group()
        }); 
    }

    //#endregion



    //#region Events

    //self.basketElement.addEventListener('show.bs.collapse', () => {
    //    self.refreshApprovals();
    //});

    //self.basketElement.addEventListener('shown.bs.collapse', (event) => {
    //    self.togglePinning(null, event, true);
    //});

    //self.basketElement.addEventListener('hide.bs.collapse', () => {
    //    self.refreshApprovals();
    //});

    document.querySelector('.body-content').addEventListener('click', (event) => {
        self.togglePinning(null, event, false);
    });

    document.querySelector('nav.navbar.navbar-default').addEventListener('click', (event) => {
        self.togglePinning(null, event, false);
    });

    self.basketElement.addEventListener('click', (event) => {
        self.togglePinning(null, event, true);
        event.stopPropagation();
    });

    //#endregion


    return self;
};