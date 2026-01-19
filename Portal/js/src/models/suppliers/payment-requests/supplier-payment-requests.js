const supplierPaymentRequestsViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait');

    self.filters = supplierPaymentRequestsFiltersViewModel({
        params: {},
        parent: self
    });

    self.paymentPlanGridWidget = ko.observable();

    self.otherPaymentRequestStatusesGridWidget = ko.observable();

    //#endregion



    //#region Components
    
    self.createGridDataSource = (defaultPaymentRequestStatusId = null) => {
        var ds = new kendo.data.DataSource({
            sortable: true,
            filterable: true,
            grouping: true,
            serverGrouping: true,
            serverFiltering: true,
            serverPaging: true,
            pageSize: 10,
            pageable: {
                pageSize: 10,
                pageSizes: [10, 20, 50, 100, 250, 500, 'all']
            },
            batch: true,
            type: "odata-v4",
            transport: {
                read: {
                    url: '/odata/PaymentRequests?$expand=Supplier,Currency'
                },//self.gridDataSourceRead,
                update: {
                    url: function (item) {
                        return `/odata/PaymentRequests(${item.PaymentRequestID})?$expand=Supplier,Currency`
                    }
                },//self.gridDataSourceUpdate,
                create: {
                    url: function (request) {


                        return '/odata/PaymentRequests?$expand=Supplier,Currency'

                    }
                },
                batch: {
                    url: '/odata/$batch'
                },
                //create: {
                //    url: function (item) {
                //        delete item.PaymentRequestID;
                //        return `/odata/PaymentRequests?$expand=Supplier,Currency`
                //    }
                //},
                destroy: {
                    url: function (item) {
                        return `/odata/PaymentRequests(${item.PaymentRequestID})?$expand=Supplier,Currency`
                    }
                },
                parameterMap: function (data, type) {

                    if (type === "create") {

                        data.models.forEach(item => {

                            item.CurrencyID = item.Currency.CurrencyID;

                            delete item.PaymentRequestID;
                            delete item.Currency;
                            delete item.Supplier;
                            delete item.PaymentRequestStatus;
                            delete item.RequestedByMember;
                            delete item.Supplier;

                        });
                    }


                    var result = kendo.data.transports["odata-v4"].parameterMap(data, type);

                    console.log(type, data);

                    return result;
                }
            },
            schema: $.extend({}, kendo.data.schemas['odata-v4'], {
                //data: "Data",
                //total: "Total",
                //errors: "Errors",
                //aggregates: "Aggregates",
                errors: 'error',
                model: {
                    id: 'PaymentRequestID',
                    fields: {
                        WeekCommencing: {
                            type: 'date',
                            nullable: true,
                            editable: false,
                        },
                        PaymentRequestID: {
                            type: 'number'
                        },
                        PaymentRequestStatusID: {
                            type: 'number',
                            nullable: true,
                            editable: defaultPaymentRequestStatusId == null ? true : false,
                            defaultValue: defaultPaymentRequestStatusId,
                            validation: {
                                required: {
                                    message: 'You must specify a Status'
                                }
                            }
                        },
                        PaymentRequestStatus: {
                            type: 'object',
                            fields: {
                                PaymentRequestStatusID: {
                                    type: 'number'
                                },
                                Name: {
                                    type: 'string'
                                }
                            },
                            defaultValue: defaultPaymentRequestStatusId == null ? null : {
                                PaymentRequestStatusID: 7,
                                Name: 'Payment Plan'
                            }
                        },
                        PaymentDueDT: {
                            type: 'date',
                            nullable: false,
                            validation: {
                                required: {
                                    message: 'You must specify a Pay Date'
                                }
                            }
                        },
                        RequestedByMemberID: {
                            type: 'number',
                            nullable: true,
                            editable: false
                        },
                        RequestedByMember: {
                            type: 'object',
                            fields: {
                                RequestedByMemberID: {
                                    type: 'number'
                                },
                                FullName: {
                                    type: 'string',
                                    defaultValue: getUserName()
                                },
                                Email: {
                                    type: 'string'
                                }
                            },
                            defaultValue: {
                                RequestedByMemberID: getUserId(),
                                FullName: getUserName(),
                                Email: getUserEmail()
                            }
                        },
                        CurrencyID: {
                            type: 'number',
                            nullable: true,
                            editable: false,
                            validation: {
                                required: {
                                    message: 'You must specify a Currency'
                                }
                            }
                        },
                        Currency: {
                            type: 'object',
                            fields: {
                                CurrencyID: {
                                    type: 'number'
                                },
                                Code: {
                                    type: 'string'
                                },
                                Name: {
                                    type: 'string'
                                },
                                Symbol: {
                                    type: 'string'
                                }
                            }
                        },
                        SupplierCode: {
                            type: 'string',
                            nullable: false,
                            validation: {
                                required: {
                                    message: 'You must specify a Supplier'
                                }
                            }
                        },
                        Supplier: {
                            type: 'object',
                            fields: {
                                Code: {
                                    type: 'string',
                                    editable: false
                                },
                                Name: {
                                    type: 'string',
                                    editable: false
                                }
                            }
                        },
                        PurchaseOrderHeadIDs: { type: 'object' },
                        ProformaNumber: { type: 'string' },
                        AmountInCurrency: {
                            type: 'number',
                            nullable: true,
                            required: {
                                message: 'You must specify an Amount'
                            }
                        },
                        AmountInSterling: { type: 'number' },
                        ExchangeRate: {
                            type: 'number',
                            editable: false
                        },
                        RequesterComments: { type: 'string' },
                        DeciderComments: { type: 'string' },
                        CreatedDT: {
                            type: 'date',
                            defaultValue: new Date(),
                            editable: false
                        },
                        ModifiedDT: { type: 'date' },
                        DeletedDT: { type: 'date' },
                        Deleted: { type: 'boolean' },
                        AmountApprovedInCurrency: {
                            type: 'number'
                        }
                    }
                }
            }),
            requestStart: (e) => {
                self.busy(true);
                if (e.type != 'create') {
                    if (e.sender.hasChanges()) {
                        e.preventDefault();
                        self.busy(false);
                        window.showInfo('Unsaved Changes', 'You have unsaved changes. Please cancel or save them before performing any other action.');
                    }
                }
            },
            sort: {
                field: 'CreatedDT',
                dir: 'desc'
            },
            noDataTemplate: 'Nothing to display',
            change: (e) => {
                if (e.action === "itemchange") {
                    let model = e.items[0];
                    switch (e.field) {
                        case "Supplier":
                            model.set("CurrencyID", model.Supplier.CurrencyID);
                            model.set("Currency", model.Supplier.Currency);
                            break;
                        default: break;
                    }
                    if (defaultPaymentRequestStatusId == 7) {
                        self.paymentPlanGridWidget().refresh();
                    } else {
                        self.otherPaymentRequestStatusesGridWidget().refresh();
                    }
                }
            },
            requestEnd: (e) => {

                window.setTimeout(() => {
                    document.addEventListener("click", (e) => {
                        if (e.target.closest('.purchase-orders-popover') == null) {
                            document.querySelectorAll('[data-bind*="actualBootstrapPopover"]').forEach(e => {
                                let p = bootstrap.Popover.getInstance(e);
                                if (p) {
                                    p.hide();
                                }
                            });
                        }
                    });
                }, 0);

                self.busy(false);
            }
        });

        return ds;
    };

    self.gridToolbar = ['create', 'save', 'cancel'];

    self.createGridColumns = (paymentRequestStatusLockedTo = []) => {
        return [{
            field: 'WeekCommencing',
            title: 'Week Comm.',
            editable: false,
            attributes: {
                "class": "readonly"
            },
            template: (e) => {
                if (e.PaymentDueDT) {
                    return moment(e.PaymentDueDT).weekdayWithStartWeekday(0, 1).format('DD/MM/YYYY')
                } else {
                    return '';
                }
            }
        }, {
            field: 'RequestedByMemberID',
            title: 'Requested By',
            editable: false,
            attributes: {
                "class": "readonly"
            },
            template: (e) => {
                if (e.RequestedByMember) {
                    return e.RequestedByMember.FullName;
                } else {
                    return '';
                }
            },
            valueTemplate: (e) => {
                if (e.RequestedByMember) {
                    return e.RequestedByMember.FullName;
                } else {
                    return '';
                }
            }
        }, {
            field: 'CreatedDT',
            title: 'Date Requested',
            width: 180,
            editable: false,
            attributes: {
                "class": "readonly"
            },
            template: (e) => {
                if (e.CreatedDT) {
                    return moment(e.CreatedDT).format('DD/MM/YYYY')
                }
            },
            valueTemplate: (e) => {
                if (e.CreatedDT) {
                    return moment(e.CreatedDT).format('DD/MM/YYYY')
                }
            }
        }, {
            field: 'PaymentDueDT',
            title: 'Pay Date',
            width: 180,
            attributes: {
                "class": "relative",
                "required": true,
                validationMessage: "You must specify a Pay Date"
            },
            template: (e) => {
                if (e.PaymentDueDT) {
                    return moment(e.PaymentDueDT).format('DD/MM/YYYY')
                }
            },
            valueTemplate: (e) => {
                if (e.PaymentDueDT) {
                    return moment(e.PaymentDueDT).format('DD/MM/YYYY')
                }
            }
        }, {
            field: 'SupplierCode',
            title: 'Supplier',
            width: 280,
            attributes: {
                "class": "dropdown-container-cell"
            },
            editor: (container, options) => {
                $(`<input type="text" required name="${options.field}" validationMessage="You must specify a Supplier" />`)
                    .appendTo(container)
                    .kendoDropDownList({
                        dataTextField: 'Name',
                        dataValueField: 'Code',
                        value: options.model.SupplierCode,
                        autoWidth: true,
                        filter: 'startswith',
                        template: (e) => {
                            if (e.Code && e.Name) {
                                return `${e.Code} - ${e.Name}`
                            } else {
                                return `${e.Code} - [UNNAMED]`
                            }
                        },
                        valueTemplate: (e) => {
                            if (e.Code && e.Name) {
                                return `${e.Code} - ${e.Name}`
                            } else {
                                return `${e.Code} - [UNNAMED]`
                            }
                        },
                        dataSource: new kendo.data.DataSource({
                            type: 'odata-v4',
                            serverFiltering: true,
                            serverSorting: true,
                            serverPaging: true,
                            sort: [{
                                field: "Code", dir: "asc"
                            }, {
                                field: "Name", dir: "asc"
                            }],
                            page: 1,
                            pageSize: 10,
                            transport: {
                                read: '/odata/MertexLiveSuppliers?$expand=Currency',
                                parameterMap: (data, operation) => {

                                    //Generate parameters in odata v4 format
                                    let d = kendo.data.transports['odata-v4'].parameterMap(data);

                                    delete d.$inlinecount; // <-- remove inlinecount
                                    delete d.$format; // <-- remove format
                                    delete d.$callback; // <-- remove callback

                                    d.$count = true;

                                    let filters = [];

                                    if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Name")) {
                                        let f = data.filter.filters.find(f => f.field === "Name");
                                        filters.push(`(contains(Name,'${f.value}') or startswith(tolower(Code),'${f.value}'))`);
                                    }

                                    if (filters.length) {
                                        let filterString = filters.join(' and ');
                                        d.$apply = `filter(${filterString})`;
                                    }

                                    // evidently .$filter is taking precedence over .$apply, and I prefer apply, so...
                                    if (d.$filter) {
                                        delete d.$filter;
                                    }

                                    if (!d.$apply) {
                                        delete d.$apply;
                                    } else {
                                        //console.log(d.$apply);
                                    }

                                    return d;

                                }
                            }
                        }),
                        change: (e) => {
                            let dataItem = e.sender.dataItem();
                            options.model.set('Supplier', dataItem);
                        },
                        height: 340,
                        virtual: {
                            itemHeight: 34,
                            mapValueTo: 'dataItem',
                            valueMapper: function (options) {
                                if (options.value) {
                                    $.ajax({
                                        url: `/odata/MertexLiveSuppliers/Default.MertexLiveSupplierValueMapper(supplierCode='${options.value || "null"}')?$expand=Currency`,
                                        type: 'GET',
                                        success: function (data) {
                                            options.success(data.value);
                                        }
                                    });
                                } else {
                                    options.success();
                                }
                            }
                        }
                    });
            },
            template: (e) => {
                if (e.Supplier) {
                    return `${e.Supplier.Code} - ${e.Supplier.Name}`;
                } else {
                    return '';
                }
            },
            valueTemplate: (e) => {
                if (e.Supplier) {
                    return `${e.Supplier.Code} - ${e.Supplier.Name}`;
                } else {
                    return '';
                }
            },
        }, {
            field: 'CurrencyID',
            title: 'Currency',
            width: 100,
            editable: false,
            attributes: {
                "class": "readonly"
            },
            template: (e) => {
                if (e.Currency) {
                    return `${e.Currency.Name} (${e.Currency.Symbol})`;
                } else {
                    return '';
                }
            },
            editor: (container, options) => {
                $(`<input type="text" required name='${options.field}' validationMessage="You must specify a Currency" />`)
                    .appendTo(container)
                    .kendoDropDownList({
                        autoBind: true,
                        autoWidth: true,
                        value: options.model.CurrencyID,
                        dataTextField: 'Name',
                        dataValueField: 'CurrencyID',
                        dataSource: new kendo.data.DataSource({
                            type: 'odata-v4',
                            sort: {
                                field: "Name", dir: "asc"
                            },
                            transport: {
                                read: '/odata/Currencies'
                            }
                        }),
                        change: (e) => {
                            let dataItem = e.sender.dataItem();
                            options.model.set('CurrencyID', dataItem.CurrencyID);
                            options.model.set('Currency', dataItem);
                        },
                        template: (e) => {
                            if (e.CurrencyID) {
                                return `${e.Name} (${e.Symbol})`;
                            } else {
                                return '';
                            }
                        },
                        valueTemplate: (e) => {
                            if (e.CurrencyID) {
                                return `${e.Name} (${e.Symbol})`;
                            } else {
                                return '';
                            }
                        }
                    });
            }
        }, {
            field: 'AmountInCurrency',
            title: 'Amount (Currency)',
            attributes: {
                /*"class": "text-end"*/ // This is not the way. So sayeth Sarah, 16/01/2026.
            },
            template: (e) => {
                if (e.AmountInCurrency) {
                    if (e.Currency) {
                        return formatCurrency(e.AmountInCurrency, 2, e.Currency.FormattingCulture, e.Currency.Code);
                    } else {
                        return e.AmountInCurrency;
                    }
                } else {
                    return '';
                }
            }
        }, {
            field: 'ExchangeRate',
            title: 'Ex. Rate',
            attributes: {
                "class": "text-center readonly",
            },
            editable: false,
            template: (e) => {
                if (e.Currency) {
                    if (e.Currency.SterlingExchangeRate == 1) {
                        return '1';
                    } else {
                        return formatNumber(e.Currency.SterlingExchangeRate, 6, 'en-GB')
                    }
                } else {
                    return '';
                }
            }
        }, {
            field: 'AmountInSterling',
            title: 'Amount (Sterling)',
            attributes: {
                /*"class": "text-end"*/ // This is not the way. So sayeth Sarah, 16/01/2026.
            },
            template: (e) => {
                if (e.AmountInCurrency) {
                    if (e.Currency) {
                        return formatCurrency(e.AmountInCurrency / e.Currency.SterlingExchangeRate, 2, 'en-GB', 'GBP');
                    } else {
                        return '';
                    }
                } else {
                    return '';
                }
            }
        }, {
            field: 'PaymentRequestStatusID',
            title: 'Status',
            width: 220,
            attributes: {
                "class": "dropdown-container-cell"
            },
            template: (e) => {
                if (e.PaymentRequestStatus) {
                    return `${e.PaymentRequestStatus.Name}`;
                } else {
                    return '';
                }
            },
            editor: (container, options) => {
                $(`<input type="text" required name='${options.field}' validationMessage="You must specify a Status" />`)
                    .appendTo(container)
                    .kendoDropDownList({
                        autoBind: true,
                        autoWidth: true,
                        value: options.model.PaymentRequestStatusID,
                        dataTextField: 'Name',
                        dataValueField: 'PaymentRequestStatusID',
                        dataSource: new kendo.data.DataSource({
                            type: 'odata-v4',
                            sort: {
                                field: "SortOrder", dir: "asc"
                            },
                            transport: {
                                read: paymentRequestStatusLockedTo?.length ? 
                                    `/odata/PaymentRequestStatuses?$filter=(${paymentRequestStatusLockedTo.map(p => {
                                        return "PaymentRequestStatusID eq " + p.toString()
                                    }).join(' or ')})`
                                    : '/odata/PaymentRequestStatuses'
                            }
                        }),
                        change: (e) => {
                            let dataItem = e.sender.dataItem();
                            options.model.set('PaymentRequestStatusID', dataItem.PaymentRequestStatusID);
                            options.model.set('PaymentRequestStatus', dataItem);
                        },
                        template: (e) => {
                            if (e.PaymentRequestStatusID) {
                                return e.Name;
                            } else {
                                return '';
                            }
                        },
                        valueTemplate: (e) => {
                            if (e.PaymentRequestStatusID) {
                                return e.Name;
                            } else {
                                return '';
                            }
                        }
                    });
            }
        }, {
            field: 'PurchaseOrderHeadIDs',
            title: 'Purchase Order(s)',
            width: 200,
            attributes: {
                "class": "relative"
            },
            template: (e) => {
                if (e.PurchaseOrderHeadIDs) {
                    let list = e.PurchaseOrderHeadIDs.map(i => i.PurchaseOrderHeadID);
                    return list.join(', ');
                } else {
                    return '';
                }
            },
            //template: (e) => {
            //    if (e.PurchaseOrderHeadIDs) {
            //        let list = document.createElement('ul');
            //        list.setAttribute('role', 'listbox');
            //        list.setAttribute('deselectable', 'on');
            //        list.classList.add('k-reset');
            //        e.PurchaseOrderHeadIDs.forEach(p => {
            //            let li = document.createElement('li');

            //            li.classList.add('k-button');

            //            let s1 = document.createElement('span');
            //            s1.setAttribute('deselectable', 'on');
            //            s1.innerHTML = p.PurchaseOrderHeadID;

            //            let s2 = document.createElement('span');
            //            s2.setAttribute('unselectable', 'on');
            //            s2.setAttribute('aria-label', 'delete');
            //            s2.classList.add('k-select');

            //            let s3 = document.createElement('span');
            //            s3.classList.add('k-icon');
            //            s3.classList.add('k-i-close');

            //            li.appendChild(s1);
            //            li.appendChild(s2);
            //            s2.appendChild(s3);

            //            list.appendChild(li);
            //        });
            //        return list.outerHTML;
            //    } else {
            //        return '';
            //    }
            //},
            editor: (container, options) => {
                $(`<textarea type="text" name='${options.field}'></textarea>`)
                    .appendTo(container)
                    .kendoMultiSelect({
                        autoBind: true,
                        autoWidth: true,
                        value: options.model.PurchaseOrderHeadIDs ?? [],
                        dataTextField: 'PurchaseOrderHeadID',
                        dataValueField: 'PurchaseOrderHeadID',
                        filter: 'startswith',
                        height: 340,
                        virtual: {
                            itemHeight: 34,
                            mapValueTo: 'dataItem',
                            valueMapper: (options) => {
                                if (options.value) {
                                    $.ajax({
                                        url: `/odata/PurchaseOrderHeads/Default.PurchaseOrderHeadValueMapper(purchaseOrderHeadIds='${options.value || "null"}')`,
                                        type: 'GET',
                                        success: function (data) {
                                            options.success(data.value);
                                        }
                                    });
                                } else {
                                    options.success();
                                }
                            }
                        },
                        dataSource: new kendo.data.DataSource({
                            type: 'odata-v4',
                            serverFiltering: true,
                            serverSorting: true,
                            serverPaging: true,
                            page: 1,
                            pageSize: 40,
                            sort: {
                                field: 'CreatedDT',
                                dir: 'desc'
                            },
                            transport: {
                                read: {
                                    url: '/odata/PurchaseOrderHeads',
                                    //data: function () {
                                    //    let identifier = paymentRequestStatusLockedTo.length == 1 && paymentRequestStatusLockedTo[0] == 7
                                    //        ? ".payment-plans .k-multiselect input[data-role=multiselect]"
                                    //        : ".other-statuses .k-multiselect input[data-role=multiselect]";

                                    //    var ms = $(identifier).data("kendoMultiSelect");

                                    //    return {
                                    //        selectedIds: ms ? ms.value().length == 1
                                    //            ? ms.value()[0].PurchaseOrderHeadID
                                    //            : ms.value().join(",")
                                    //            : ""
                                    //    };
                                    //},
                                },
                                parameterMap: (data, operation) => {

                                    //Generate parameters in odata v4 format
                                    let d = kendo.data.transports['odata-v4'].parameterMap(data);

                                    delete d.$inlinecount; // <-- remove inlinecount
                                    delete d.$format; // <-- remove format
                                    delete d.$callback; // <-- remove callback

                                    d.$count = true;

                                    let filters = [];

                                    return d;

                                }
                            },
                        }),
                        change: function (e) {

                        },
                        template: (e) => {
                            if (e.PurchaseOrderHeadID) {
                                return e.PurchaseOrderHeadID;
                            } else {
                                return '';
                            }
                        },
                        valueTemplate: (e) => {
                            if (e.PurchaseOrderHeadID) {
                                return e.PurchaseOrderHeadID;
                            } else {
                                return '';
                            }
                        },
                        popup: {
                            appendTo: $('.k-edit-cell'),
                            position: 'top left'
                        }
                    });
            }
        }, {
            field: 'ProformaNumber',
            title: 'Proforma Number'
        }, {
            field: 'RequesterComments',
            title: 'Requester Comments',
            editor: (container, options) => {
                let textarea = document.createElement('textarea');

                textarea.value = options.model[options.field];

                textarea.classList.add('form-control');
                textarea.setAttribute('rows', '3');
                textarea.setAttribute('id', 'textarea-editor');

                container[0].appendChild(textarea);

                $("#textarea-editor").on('blur', (event) => {
                    if (textarea.value) {
                        options.model.set('RequesterComments', textarea.value);
                    } else {
                        options.model.set('RequesterComments', null);
                    }
                })
            },
            template: (e) => {
                if (e.RequesterComments) {
                    return e.RequesterComments?.replace(/\n/gm, '<br/>');
                } else {
                    return '';
                }
            }
        }, {
            field: 'DeciderComments',
            title: 'Approver Comments',
            editor: (container, options) => {
                let textarea = document.createElement('textarea');

                textarea.value = options.model[options.field];

                textarea.classList.add('form-control');
                textarea.setAttribute('rows', '3');
                textarea.setAttribute('id', 'textarea-editor');

                container[0].appendChild(textarea);

                $("#textarea-editor").on('blur', (event) => {
                    if (textarea.value) {
                        options.model.set('DeciderComments', textarea.value);
                    } else {
                        options.model.set('DeciderComments', null);
                    }
                })
            },
            template: (e) => {
                if (e.DeciderComments) {
                    return e.DeciderComments?.replace(/\n/gm, '<br/>');
                } else {
                    return '';
                }
            }
        }, {
            title: " ",
            width: "100px",
            hidden: !window.canApprove(),
            attributes: {
                "class": "text-center command-column"
            },
            command: [{
                text: "Approve",
                click: (event, sender) => {
                    let grid = $(event.delegateTarget).data("kendoGrid");

                    let dataItem = grid.dataItem(event.target.closest("tr"));

                    dataItem.set('AmountApprovedInCurrency', dataItem.AmountInCurrency);

                    grid.editCell($(event.delegateTarget).find("td:eq(15)"));

                    window.setTimeout(() => {
                        $(event.delegateTarget).find("td:eq(15)").find('input').select();
                    }, 0);
                }
            }, {
                text: "Reject",
                click: (event, sender) => {
                    let grid = $(event.delegateTarget).data("kendoGrid");

                    let dataItem = grid.dataItem(event.target.closest("tr"));

                    dataItem.set('Rejected', true);
                }
            }]
        }, {
            hidden: !window.canApprove(),
            field: 'AmountApprovedInCurrency',
            title: 'Amount Approved (Currency)',
            attributes: {
                "class": "text-end"
            },
            template: (e) => {
                if (window.canApprove() && e.AmountApprovedInCurrency) {
                    if (e.AmountApprovedInCurrency == null) {
                        if (e.AmountInCurrency != null) {
                            if (e.Currency) {
                                return formatCurrency(e.AmountInCurrency, 2, e.Currency.FormattingCulture, e.Currency.Code);
                            } else {
                                return e.AmountInCurrency;
                            }
                        } else {
                            if (e.Currency) {
                                return formatCurrency(e.AmountApprovedInCurrency, 2, e.Currency.FormattingCulture, e.Currency.Code);
                            } else {
                                return '';
                            }
                        }
                    } else {
                        if (e.Currency) {
                            return formatCurrency(e.AmountApprovedInCurrency, 2, e.Currency.FormattingCulture, e.Currency.Code);
                        } else {
                            return e.AmountApprovedInCurrency;
                        }
                    }
                } else {
                    return '';
                }
            }
        }]
    };

    self.createGridDefinition = (name, widget, paymentRequestStatusLockedTo = []) => {
        return {
            autoBind: true,
            widget: widget,
            identifier: name,
            columns: self.createGridColumns(paymentRequestStatusLockedTo),
            data: self.createGridDataSource(paymentRequestStatusLockedTo?.length == 1 ? paymentRequestStatusLockedTo[0] : null),
            toolbar: self.gridToolbar,
            //useKOTemplates: true,
            //rowTemplate: 'grid-row-template',
            scrollable: false,
            sortable: true,
            filterable: true,
            reorderable: false,
            paging: true,
            pageSize: 10,
            pageable: {
                pageSize: 10,
                pageSizes: [10, 20, 50, 100, 250, 500, 'all']
            },
            selectable: false,
            editable: true,
            edit: function (e) {
                window.setTimeout(() => {

                    let dropdown = $(e.container).find("[data-role=dropdownlist]").data("kendoDropDownList");

                    if (dropdown) {
                        dropdown.open();
                        return;
                    }

                    //let multiselect = $(e.container).find("[data-role=multiselect]").data("kendoMultiSelect");

                    //if (multiselect) {
                    //    multiselect.open();
                    //    return;
                    //}


                    let datePicker = e.container.find("[data-role=datepicker]").data("kendoDatePicker");

                    if (datePicker) {
                        datePicker.setOptions({
                            close: (event) => {
                                console.log('close fired', event);
                                e.sender.editCell($(e.container).closest('tr').find("td:eq(4)"));
                            }
                        });

                        datePicker.open();
                    }
                }, 0);
            },
            dataBound: (e) => {

            },
            save: (data) => {
                console.log('save', data);
                if (Object.hasOwn(data.values, 'PaymentDueDT')) {
                    window.setTimeout(() => {
                        data.sender.editCell($(data.sender.table).find('td:eq(4)'));
                    }, 0);
                } else if (Object.hasOwn(data.values, 'SupplierCode')) {
                    window.setTimeout(() => {
                        data.sender.editCell($(data.sender.table).find('td:eq(6)'));
                    })
                } else if (Object.hasOwn(data.values, 'AmountInCurrency')) {
                    window.setTimeout(() => {
                        if (data.sender.options.identifier == 'paymentPlanGrid') {
                            data.sender.editCell($(data.sender.table).find('td:eq(10)'));
                        } else {
                            data.sender.editCell($(data.sender.table).find('td:eq(9)'));
                        }
                    })
                }
            }
        };
    }

    self.paymentPlanGridParams = self.createGridDefinition('paymentPlanGrid', self.paymentPlanGridWidget, [7]);

    self.paymentPlanGridParams.columns[9].filterable = false;

    self.otherPaymentRequestStatusesGridParams = self.createGridDefinition('otherPaymentRequestStatusesGrid', self.otherPaymentRequestStatusesGridWidget, [1, 2, 3, 4, 5, 6]);

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods



    //#endregion



    //#region Events



    //#endregion


    return self;
};