const dateRanges = [{
    dateRangeId: '-2',
    name: 'All Time',
    class: null
}, {
    dateRangeId: '-3',
    name: 'Overdue ( > 3 working days)',
    class: 'date-danger'
}, {
    dateRangeId: '30',
    name: 'Last 30 Days',
    class: null
}, {
    dateRangeId: '1',
    name: 'This Month',
    class: null
}, {
    dateRangeId: '6',
    name: 'Last 6 Months',
    class: null
}, {
    dateRangeId: '12',
    name: 'Last 12 Months',
    class: null
}, {
    dateRangeId: '-1',
    name: 'Custom',
    class: null
}];

const invoiceBookingFiltersViewModel = ({
    parent
} = {

    }) => {
    let self = {
        parent: parent
    }

    //#region Properties

    self.busy = ko.observable(false);

    self.departmentIds = ko.observableArray(window.getDepartmentRestrictions());
    self.departments = ko.observableArray([]);
    self.availableDepartments = ko.observableArray([]);

    self.budgetHolderCode = ko.observable(window.getBudgetHolderRestriction());
    self.budgetHolder = ko.observable();

    self.supplierTypeCode = ko.observable('');
    self.supplierType = ko.observable();

    self.supplierCode = ko.observable('');
    self.supplier = ko.observable();

    self.emailStatusId = ko.observable(self.parent.dashboard.selectedPod().EmailStatusID);
    self.emailStatus = ko.observable();

    self.computer = ko.observable(true).extend({
        rateLimit: {
            timeout: 0,
            method: 'notifyWhenChangesStop'
        }
    });

    self.fromDate = ko.observable();

    self.toDate = ko.observable();

    self.dateRangeId = ko.observable('-2');

    self.dateRanges = dateRanges;

    self.validateSearchNow = ko.observable(true);

    self.fromDate.extend({
        date: {
            params: true,
            message: 'From must be a date'
        },
        required: {
            params: true,
            onlyIf: function () {
                return self.validateSearchNow() && self.dateRangeId() == -1 && self.toDate() != null
            },
            message: 'Please provide From Date'
        }
    });

    self.toDate.extend({
        date: {
            params: true,
            message: 'To must be a date'
        }
    });

    self.hasAttachments = ko.observable();

    //#endregion


    //#region Lifted Bits

    self.generateSuperSetParameterMap = (defaultODataOperation) => {
        return (data) => {
            let defaultOp = defaultODataOperation;

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            let filters = [];

            let departmentId = null;
            let budgetHolderCode = null;
            let supplierCode = null;
            let supplierTypeCode = null;

            if (defaultOp.indexOf("Department") == -1) {
                departmentIds = self.departmentIds();
            } else {
                departmentIds = self.departmentIds.peek();
            }

            let departmentRestrictions = window.getDepartmentRestrictions();

            if (departmentRestrictions.length) {
                filters.push(`GroupID in (${departmentRestrictions})`);
            }

            if (defaultOp.indexOf("Department") == -1 && departmentIds.length) {
                filters.push(`GroupID in (${departmentIds})`)
            }

            if (defaultOp.indexOf("BudgetHolder") == -1) {
                budgetHolderCode = self.budgetHolderCode();
            } else {
                budgetHolderCode = self.budgetHolderCode.peek();
            }

            if (defaultOp.indexOf('BudgetHolder') == -1 && budgetHolderCode != '') {
                filters.push(`BudgetHolderCode eq '${budgetHolderCode}'`);
            }

            if (defaultOp.indexOf("Supplier/") == -1) {
                supplierCode = self.supplierCode();
            } else {
                supplierCode = self.supplierCode.peek();
            }

            if (defaultOp.indexOf('Supplier/') == -1 && supplierCode != '') {
                filters.push(`SupplierCode eq '${supplierCode}'`);
            }

            if (defaultOp.indexOf("SupplierType") == -1) {
                supplierTypeCode = self.supplierTypeCode();
            } else {
                supplierTypeCode = self.supplierTypeCode.peek();
            }

            if (defaultOp.indexOf('SupplierType') == -1 && supplierTypeCode != '') {
                filters.push(`Supplier/SupplierType/Code eq '${supplierTypeCode}'`);
            }

            if (defaultOp.indexOf('Supplier/') > -1) {
                if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Supplier.Name")) {
                    let f = data.filter.filters.find(f => f.field === "Supplier.Name");
                    filters.push(`(contains(Supplier/Name, '${f.value}') or startswith(tolower(Supplier/Code), '${f.value}'))`);

                    if (d.$filter) {
                        delete d.$filter;
                    }
                }
            }

            d.$apply = defaultOp;

            if (filters.length) {
                let filterString = filters.join(' and ');
                d.$apply = `filter(${filterString})`;

                if (defaultOp) {
                    d.$apply = `${d.$apply}/${defaultOp}`;
                }
            }

            if (!d.$apply) {
                delete d.$apply;
            } else {
                //console.log(d.$apply);
            }

            return d;
        }
    }


    //#endregion


    //#region Components

    self.departmentGroupBy = `groupby((Department/GroupID,Department/Name))/filter((Department/GroupID ne null))`;

    self.departmentTemplate = (e) => {
        if (e.Department && e.Department.GroupID && e.Department.Name) {
            return `<span title="${e.Department.Name} ([ad].[Group].[GroupID]: ${e.Department.GroupID})">${e.Department.Name}</span>`;
        } else {
            return '';
        }
    }

    self.departmentValueTemplate = (e) => {
        if (e.Department && e.Department.GroupID && e.Department.Name) {
            return `<span title="${e.Department.Name} ([ad].[Group].[GroupID]: ${e.Department.GroupID})">${e.Department.Name}</span>`;
        } else {
            return '';
        }
    }

    self.departmentParams = {
        observable: self.departmentIds,
        validate: self.departmentIds,
        showClear: true,
        width: 'auto',
        label: 'Department',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        locked: ko.computed(() => self.availableDepartments().length == 1, self),
        enable: ko.observable(true),
        disable: ko.computed(() => self.availableDepartments().length == 1, self),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        controlClass: 'form-control',
        multiSelectSettings: {
            value: ko.observableArray([]),
            dataItems: self.departments,
            observableArray: self.departmentIds,
            dataValueField: 'Department.GroupID',
            dataTextField: 'Department.Name',
            height: 300,
            widget: ko.observable(),
            class: "",
            open: function (e) {
                var self = this;
                //$(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: function (e) {
                //$(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            data: new kendo.data.DataSource({
                serverFiltering: true,
                serverSorting: true,
                serverGrouping: true,
                serverPaging: true,
                pageSize: 0,
                type: 'odata-v4',
                transport: {
                    read: {
                        url: '/odata/BudgetHolderSuperSet'
                    },
                    parameterMap: self.generateSuperSetParameterMap(self.departmentGroupBy)
                },
                schema: $.extend({}, kendo.data.schemas['odata-v4'], {
                    data: "value",
                    total: "Total",
                    errors: "Errors",
                    aggregates: "Aggregates",
                    model: {
                        fields: {
                            GroupID: { type: 'number', editable: false },
                            Department: {
                                type: 'object',
                                fields: {
                                    GroupID: { type: 'number', editable: false },
                                    Name: { type: 'string', editable: false }
                                }
                            }
                        }
                    }
                }),
                sort: {
                    field: 'Department.Name',
                    dir: 'asc'
                },
                requestEnd: (data) => {
                    //console.log("salesMarketsParams.multiSelectSettings.dataSource.requestEnd", data);
                    self.availableDepartments(data.response.value.map(d => {
                        return {
                            disabled: false,
                            value: d.Department.GroupID,
                            label: d.Department.Name
                        }
                    }));
                }
            }),
            options: self.availableDepartments,
            valuePrimitive: true,
            autoWidth: false,
            autoBind: true,
            autoClose: false,
            optionLabel: ' ',
            filter: false,
            popup: {
                appendTo: document.getElementById('department-prefilter')
            },
            label: ko.computed(() => {

                let plural = 's';

                let d = {
                    values: self.departmentIds()
                }

                let count = d.values.length;

                if (count === 1) {
                    plural = '';
                }

                if (count == 1) {
                    let rec = self.availableDepartments().find(dat => dat.value == d.values[0]);
                    if (rec)
                        return rec.label;
                }

                if (count === 0) {
                    return 'Department(s)';
                } else {
                    return `${count} Department${plural} Selected`;
                }
            }, self),
        },
        clearFunction: function () {
            self.departmentIds([]);
            self.budgetHolderParams.dropDownListSettings.widget().dataSource.read();
            self.parent.dashboard.fetch();
        }
    };

    self.budgetHolderGroupBy = `groupby((BudgetHolder/Code,BudgetHolder/Name))/filter((BudgetHolder/Code ne null))`;

    self.budgetHolderTemplate = (e) => {
        if (e.BudgetHolder && e.BudgetHolder.Code && e.BudgetHolder.Name) {
            return `<span title="${e.BudgetHolder.Name} (${e.BudgetHolder.Code})">${e.BudgetHolder.Name}</span>`;
        } else {
            return '';
        }
    }

    self.budgetHolderValueTemplate = (e) => {
        if (e.BudgetHolder && e.BudgetHolder.Code && e.BudgetHolder.Name) {
            return `<span title="${e.BudgetHolder.Name} (${e.BudgetHolder.Code})">${e.BudgetHolder.Name}</span>`;
        } else {
            return '';
        }
    }

    self.budgetHolderParams = kendoMDCDropDownList({
        skipCascade: false,
        label: 'Budget Holder',
        odata: true,
        endPoint: '/odata/BudgetHolderSuperSet',
        textField: 'BudgetHolder.Name',
        valueField: 'BudgetHolder.Code',
        virtual: false,
        template: self.budgetHolderTemplate,
        valueTemplate: self.budgetHolderValueTemplate,
        idObservable: self.budgetHolderCode,
        objObservable: self.budgetHolder,
        locked: ko.observable(window.getBudgetHolderRestriction() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'BudgetHolder.Name'
        },
        select: function (e) {
            console.log('budgetHolderParams select', e);
        },
        open: (e) => { 
            console.trace('budgetHolderParams open');
        },
        clearFunction: () => {
            self.budgetHolderCode('');
            self.budgetHolder(undefined);
            self.parent.dashboard.fetch();
        },
        parameterMap: self.generateSuperSetParameterMap(self.budgetHolderGroupBy),
        popupSettings: {
            appendTo: document.getElementById('budget-holder-prefilter')
        }
    });


    self.supplierTypeGroupBy = `groupby((SupplierType/Code,SupplierType/Name))/filter((SupplierType/Code ne null))`;

    self.supplierTypeTemplate = (e) => {
        if (e.SupplierType && e.SupplierType.Code && e.SupplierType.Name) {
            return `<span title="${e.SupplierType.Name} (${e.SupplierType.Code})">${e.SupplierType.Name}</span>`;
        } else {
            return '';
        }
    }

    self.budgetHolderValueTemplate = (e) => {
        if (e.SupplierType && e.SupplierType.Code && e.SupplierType.Name) {
            return `<span title="${e.SupplierType.Name} (${e.SupplierType.Code})">${e.SupplierType.Name}</span>`;
        } else {
            return '';
        }
    }

    self.supplierTypeParams = kendoMDCDropDownList({
        skipCascade: false,
        label: 'Supplier Type',
        odata: true,
        endPoint: '/odata/BudgetHolderSuperSet',
        textField: 'SupplierType.Name',
        valueField: 'SupplierType.Code',
        template: self.supplierTypeTemplate,
        valueTemplate: self.supplierTypeValueTemplate,
        idObservable: self.supplierTypeCode,
        objObservable: self.supplierType,
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'SupplierType.Name'
        },
        select: function (e) {
            console.log('supplierTypeParams select', e);
        },
        open: (e) => {
            console.log('supplierTypeParams open', e);
        },
        clearFunction: () => {
            self.supplierTypeCode('');
            self.supplierType(undefined);
            self.parent.dashboard.fetch();
        },
        parameterMap: self.generateSuperSetParameterMap(self.supplierTypeGroupBy),
        popupSettings: {
            appendTo: document.getElementById('supplier-type-prefilter')
        }
    });

    self.supplierGroupBy = `groupby((Supplier/Code,Supplier/Name))/filter((Supplier/Code ne null))`;

    self.supplierTemplate = (e) => {
        if (e.Supplier && e.Supplier.Code && e.Supplier.Name) {
            return `<span title="${e.Supplier.Name} (${e.Supplier.Code})">${e.Supplier.Code} - ${e.Supplier.Name}</span>`;
        } else {
            return '';
        }
    }

    self.SupplierValueTemplate = (e) => {
        if (e.Supplier && e.Supplier.Code && e.Supplier.Name) {
            return `<span title="${e.Supplier.Name} (${e.Supplier.Code})">${e.Supplier.Code} - ${e.Supplier.Name}</span>`;
        } else {
            return '';
        }
    }

    self.supplierParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Supplier',
        odata: true,
        endPoint: '/odata/BudgetHolderSuperSet',
        textField: 'Supplier.Name',
        valueField: 'Supplier.Code',
        virtual: false,
        template: self.supplierTemplate,
        valueTemplate: self.supplierValueTemplate,
        idObservable: self.supplierCode,
        objObservable: self.supplier,
        locked: ko.observable(self.supplierCode() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Supplier.Name'
        },
        select: function (e) {
            console.log('supplierParams select', e);
        },
        clearFunction: () => {
            self.supplierCode('');
            self.supplier(undefined);
            self.parent.dashboard.fetch();
        },
        parameterMap: self.generateSuperSetParameterMap(self.supplierGroupBy),
        popupSettings: {
            appendTo: document.getElementById('supplier-prefilter')
        }
    });

    self.emailStatusParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Status',
        odata: true,
        endPoint: '/odata/EmailStatuses',
        textField: 'Name',
        valueField: 'EmailStatusID',
        virtual: false,
        idObservable: self.emailStatusId,
        objObservable: self.emailStatus,
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'EmailStatusID'
        },
        select: function (e) {
            console.log('emailStatus select', e);
        },
        clearFunction: () => {
            self.emailStatusId('');
            self.emailStatus(undefined);
            self.parent.dashboard.fetch();
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        },
        popupSettings: {
            appendTo: document.getElementById('email-status-prefilter')
        }
    });

    self.dateRangeParams = kendoMDCDropDownList({
        label: 'Date Range',
        data: self.dateRanges,
        textField: 'name',
        valueField: 'dateRangeId',
        idObservable: self.dateRangeId,
        objObservable: ko.observable(),
        template: (e) => `<span class="date-range ${e.class}">${e.name}</span>`,
        valueTemplate: (e) => `<span class="date-range ${e.class}">${e.name}</span>`,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        readOnly: false,
        autoBind: true,
        clearFunction: () => {
            self.dateRangeId('');
        },
        afterClear: () => {

        },
        popupSettings: {
            appendTo: document.getElementById('order-date-type-prefilter')
        },
    });

    self.fromDateParams = {
        label: "From Date",
        observable: self.fromDate,
        originalValue: self.fromDate(),
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
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
                viewMode: 'months',
                cellSize: '3rem'
            },
            restrictions: {
                disabledDates: []
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false,
            eventHandlers: {
                onChange: (e) => {

                }
            }
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.fromDate(undefined);
            self.fromDateParams.observable.tempusDominus.clear();
            self.fromDateParams.observable.tempusDominus.updateOptions({
                display: {
                    viewMode: 'months'
                }
            })
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.fromDate.observable(self.fromDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.toDateParams = {
        label: "To Date",
        observable: self.toDate,
        originalValue: self.toDate(),
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
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
                viewMode: 'months',
                cellSize: '3rem'
            },
            restrictions: {
                disabledDates: []
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false,
            eventHandlers: {
                onChange: (e) => {

                }
            }
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.toDate(undefined);
            self.toDateParams.observable.tempusDominus.clear();
            self.toDateParams.observable.tempusDominus.updateOptions({
                display: {
                    viewMode: 'months'
                }
            })
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.toDate.observable(self.toDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    //#endregion


    //#region Computeds

    self.fromPreceedsTo = ko.pureComputed(() => {
        if (self.fromDate() && self.toDate()) {
            return self.fromDate().getTime() <= self.toDate().getTime();
        }
    }, self).extend({
        equal: {
            params: true,
            onlyIf: function () {
                return self.fromDate() && self.toDate()
            },
            message: 'From Date must preceed To Date'
        }
    }, self);

    //#endregion


    //#region Subscriptions

    self.availableDepartments.subscribe(nv => {
        if (nv.length == 1) {
            self.departmentIds([nv[0].value]);
        }
        //self.budgetHolderParams.dropDownListSettings.widget().dataSource.read();
    });

    self.dateRangeId.subscribe(nv => {
        if (nv != -1) {
            self.parent.dashboard.fetch();
            self.parent.mailboxGridParams.widget().dataSource.page(1);
        }
    });

    self.fromDate.subscribe(nv => {
        //console.trace();
        if (nv) {
            if (self.toDate() && +self.toDate() < nv) {
                self.toDate(undefined);
            }

            let oneDayMilliseconds = 1000 * 60 * 60 * 24;

            self.toDate.tempusDominus.updateOptions({
                restrictions: {
                    minDate: new Date(nv.getTime())// + oneDayMilliseconds)
                }
            });
        } else {

            self.toDate.tempusDominus.updateOptions({
                restrictions: {
                    minDate: undefined
                }
            });
        }
        self.parent.mailboxGridParams.widget().dataSource.page(1);
    });

    self.toDate.subscribe(nv => {
        //console.trace();
        if (nv) {
            if (self.fromDate() && +self.fromDate() > nv) {
                self.fromDate(undefined);
            }

            let oneDayMilliseconds = 1000 * 60 * 60 * 24;

            self.fromDate.tempusDominus.updateOptions({
                restrictions: {
                    maxDate: new Date(nv.getTime())// - oneDayMilliseconds)
                }
            });
        } else {
            self.fromDate.tempusDominus.updateOptions({
                restrictions: {
                    maxDate: undefined
                }
            });
        }
        self.parent.mailboxGridParams.widget().dataSource.page(1);
    });

    self.departmentIds.subscribe(nv => {
        self.parent.dashboard.fetch();
        self.parent.mailboxGridParams.widget().dataSource.page(1);
    });

    //self.emailStatusId.subscribe(nv => {
    //    if (nv == null) {
    //        let filters = self.parent.mailboxGridParams.widget().dataSource.filter();

    //        filters.filters = filters.filters.filter(f => f.field != 'EmailStatusID');

    //        self.parent.mailboxGridParams.widget().dataSource.filter(filters);
    //    } else {
    //        self.parent.mailboxGridParams.widget().dataSource.filter({
    //            field: 'EmailStatusID',
    //            operator: 'eq',
    //            value: nv
    //        });
    //    }
    //})

    self.supplierCode.subscribe(nv => {
        if (nv == null || nv == '') {
            let filters = self.parent.mailboxGridParams.widget().dataSource.filter();
            
            filters.filters = filters.filters.filter(f => f.field != 'SupplierCode');

            self.parent.mailboxGridParams.widget().dataSource.filter(filters);
        } else {
            self.parent.mailboxGridParams.widget().dataSource.filter({
                field: 'SupplierCode',
                operator: 'eq',
                value: nv
            });
        }
    })

    self.supplierTypeCode.subscribe(nv => {
        if (nv == null || nv == '') {
            let filters = self.parent.mailboxGridParams.widget().dataSource.filter();

            filters.filters = filters.filters.filter(f => f.field != 'SupplierTypeCode');

            self.parent.mailboxGridParams.widget().dataSource.filter(filters);
        } else {
            self.parent.mailboxGridParams.widget().dataSource.filter({
                field: 'Supplier.SupplierType.Code',
                operator: 'eq',
                value: nv
            });
        }
    })

    // No, boo, this causes headaches and acrimony
    //self.emailStatusId.subscribe(nv => {
    //    switch (nv) {
    //        case 1:
    //            self.parent.dashboard.selectedPod(self.parent.dashboard.pods().find(f => f.Label == 'New / Unprocessed'))
    //            break;
    //        case 2:
    //            self.parent.dashboard.selectedPod(self.parent.dashboard.pods().find(f => f.Label == 'Processed'))
    //            break;
    //        case 3:
    //            self.parent.dashboard.selectedPod(self.parent.dashboard.pods().find(f => f.Label == 'Junk'))
    //            break;
    //        default:
    //            self.parent.dashboard.selectedPod(undefined);
    //            break;
    //    }
    //})

    //#endregion


    //#region Methods


    //#endregion


    //#region Events



    //#endregion

    return self;
}