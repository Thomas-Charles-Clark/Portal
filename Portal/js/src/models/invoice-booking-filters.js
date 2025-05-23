const dateRanges = [{
    dateRangeId: 30,
    name: 'Last 30 Days'
}, {
    dateRangeId: 1,
    name: 'This Month'
}, {
    dateRangeId: 6,
    name: 'Last 6 Months'
}, {
    dateRangeId: 12,
    name: 'Last 12 Months'
}, {
    dateRangeId: -1,
    name: 'Custom'
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

    self.departmentId = ko.observable('');
    self.department = ko.observable();

    self.budgetHolderCode = ko.observable('');
    self.budgetHolder = ko.observable();

    self.supplierCode = ko.observable('');
    self.supplier = ko.observable();

    self.emailStatusId = ko.observable('');
    self.emailStatus = ko.observable();

    self.computer = ko.observable(true).extend({
        rateLimit: {
            timeout: 0,
            method: 'notifyWhenChangesStop'
        }
    });

    self.fromDate = ko.observable();

    self.toDate = ko.observable();

    self.dateRangeId = ko.observable('');

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

            if (defaultOp.indexOf("Department") == -1) {
                departmentId = self.departmentId();
            } else {
                departmentId = self.departmentId.peek();
            }

            if (defaultOp.indexOf('Department') == -1 && departmentId != '') {
                filters.push(`GroupID eq ${departmentId}`);
            }

            if (defaultOp.indexOf("BudgetHolder") == -1) {
                budgetHolderCode = self.budgetHolderCode();
            } else {
                budgetHolderCode = self.budgetHolderCode.peek();
            }

            if (defaultOp.indexOf('BudgetHolder') == -1 && budgetHolderCode != '') {
                filters.push(`BudgetHolderCode eq '${budgetHolderCode}'`);
            }

            if (defaultOp.indexOf("Supplier") == -1) {
                supplierCode = self.supplierCode();
            } else {
                supplierCode = self.supplierCode.peek();
            }

            if (defaultOp.indexOf('Supplier') == -1 && supplierCode != '') {
                filters.push(`SupplierCode eq '${supplierCode}'`);
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

    self.departmentParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Department',
        odata: true,
        endPoint: '/odata/BudgetHolderSuperSet',
        textField: 'Department.Name',
        valueField: 'Department.GroupID',
        virtual: false,
        template: self.departmentTemplate,
        valueTemplate: self.departmentValueTemplate,
        idObservable: self.departmentId,
        objObservable: self.department,
        locked: ko.observable(self.departmentId() != ''),
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
            field: 'Department.Name'
        },
        select: function (e) {
            console.log('departmentParams select', e);
        },
        clearFunction: () => {
            self.departmentId('');
            self.department(undefined);
        },
        parameterMap: self.generateSuperSetParameterMap(self.departmentGroupBy),
        popupSettings: {
            appendTo: document.getElementById('department-prefilter')
        }
    });

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
        skipCascade: true,
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
        locked: ko.observable(self.budgetHolderCode() != ''),
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
        clearFunction: () => {
            self.budgetHolderCode('');
            self.budgetHolder(undefined);
        },
        parameterMap: self.generateSuperSetParameterMap(self.budgetHolderGroupBy),
        popupSettings: {
            appendTo: document.getElementById('budget-holder-prefilter')
        }
    });

    self.supplierGroupBy = `groupby((Supplier/Code,Supplier/Name))/filter((Supplier/Code ne null))`;

    self.budgetHolderTemplate = (e) => {
        if (e.Supplier && e.Supplier.Code && e.Supplier.Name) {
            return `<span title="${e.Supplier.Name} (${e.Supplier.Code})">${e.Supplier.Name}</span>`;
        } else {
            return '';
        }
    }

    self.SupplierValueTemplate = (e) => {
        if (e.Supplier && e.Supplier.Code && e.Supplier.Name) {
            return `<span title="${e.Supplier.Name} (${e.Supplier.Code})">${e.Supplier.Name}</span>`;
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
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        autoBind: true,
        clearFunction: () => {
            self.dateRangeId('');
        },
        afterClear: () => {

        }
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
    });

    self.emailStatusId.subscribe(nv => {
        if (nv == null) {
            let filters = self.parent.mailboxGridParams.widget().dataSource.filter();

            filters.filters = filters.filters.filter(f => f.field != 'EmailStatusID');

            self.parent.mailboxGridParams.widget().dataSource.filter(filters);
        } else {
            self.parent.mailboxGridParams.widget().dataSource.filter({
                field: 'EmailStatusID',
                operator: 'eq',
                value: nv
            });
        }
    })

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