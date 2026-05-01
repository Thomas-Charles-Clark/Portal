const dailyBankingStatisticsBreakdownItemViewModel = ({
    rec,
    validateNow,
    labels
} = {
        rec: {},
        validateNow: ko.observable(false),
        labels: ko.observableArray([])
}) => {
    let self = Object.assign({
        validateNow,
        labels,
    }, rec);

    //#region Properties

    self.uniVerseAccountId = ko.observable(self.UniVerseAccount ?? '').extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must specify a UniVerse Account'
        }
    });

    self.uniVerseAccount = ko.observable();

    self.labelId = ko.observable(self.LabelID ?? '').extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNow()
            },
            message: 'You must specify a Label'
        }
    });

    self.label = ko.observable();

    self.tradeAccountCode = ko.observable(self.TradeAccountCode).extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.labelId() == 'Customer Account' && self.validateNow();
            },
            message: 'You must specify a Label'
        }
    });

    self.tradeAccount = ko.observable();

    self.orderId = ko.observable(self.OrderID);

    self.order = ko.observable();

    self.invoiceId = ko.observable(self.InvoiceID);

    self.invoice = ko.observable();

    self.availableLabels = ko.observableArray([]);

    self.uniVerseAccount.subscribe(nv => {
        self.labelId('');
        if (nv) {
            self.availableLabels(self.labels().filter(x => x.group == nv.name));
        }
    });

    //    ko.computed(() => {
    //    let uniVerseAccount = self.uniVerseAccount();
    //    if (uniVerseAccount) {
    //        return self.labels().filter(x => x.group == uniVerseAccount.name);
    //    }
    //    else {
    //        return [];
    //    }
    //}, self);

    self.value = ko.observable(self.Value).extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNow()
            },
            message: 'You must specify a Value'
        },
        currencyFormatted: {
            digits: 2,
            currency: {
                Code: self.CurrencyCode,
                FormattingCulture: self.FormattingCulture
            }
        }
    });

    //#endregion


/*

-----------------------------------
	--[
	--	{
	--	"UniverseAccount":"MERTEX",
	--	"Label":"Customer Account",
	--  "Value":100,
	--	"TradeAccountCode":"K0099",
	--  "OrderID":NULL,
	--  "InvoiceID":"SI123456"
	--	},
	--	{
	--	"UniverseAccount":"MERTEX_INC",
	--	"Label":"Customer Account",
	--  "Value":200,
	--	"TradeAccountCode":"K0099",
	--  "OrderID":"123445678",
	--  "InvoiceID":NULL
	--	}
	--]


*/


    //#region Components

    self.uniVerseAccountParams = kendoMDCDropDownList({
        label: 'UniVerse Account',
        data: UniVerseAccounts,
        textField: 'name',
        valueField: 'value',
        virtual: false,
        idObservable: self.uniVerseAccountId,
        objObservable: self.uniVerseAccount,
        filter: false,
        autoBind: true,
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
    });

    self.labelParams = kendoMDCDropDownList({
        label: 'Label',
        noDataTemplate: 'Please select a UniVerse Account',
        data: self.availableLabels,
        textField: 'name',
        valueField: 'value',
        virtual: false,
        idObservable: self.labelId,
        objObservable: self.label,
        filter: false,
        autoBind: true,
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
    });

    self.tradeAccountParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account',
        odata: true,
        endPoint: () => `/odata/TradeAccounts_Live/Default.GetTradeAccountsForCreditControl(includeClosedAccounts=true, includeDeletedAccounts=false)`,
        textField: 'ShortLabel',
        valueField: 'Code',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/TradeAccounts_Live/Default.TradeAccountLiveValueMapper(tradeAccountCode='${options.value}')`,
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
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            if ((e.ShortLabel != '') && (e.Code != null))
                return `<span title="${e.ShortLabel}">Trade Account: ${e.ShortLabel}</span>`
            else
                return '';
        },
        idObservable: self.tradeAccountCode,
        objObservable: self.tradeAccount,
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: [{
            dir: 'asc',
            field: 'Code'
        }, {
            dir: 'asc',
            field: 'Name'
        }],
        select: function (e) {
            console.log('statementsTradeAccountParams select', e);
        },
        requestStart: function (e) {

        },
        clearFunction: () => {
            self.tradeAccountCode('');
            self.tradeAccount(undefined);
            self.tradeAccountParams.dropDownListSettings.widget().value('');
            self.tradeAccountParams.dropDownListSettings.widget().trigger('change');
        },
        parameterMap: (data) => {

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            let filters = [];

            if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "ShortLabel")) {
                let f = data.filter.filters.find(f => f.field === "ShortLabel");
                filters.push(`(contains(Name,'${f.value}') or startswith(Code,'${f.value}'))`);
            }

            if (d.$filter) {
                delete d.$filter;
            }

            // regardless whether or not a filter has a selection it must be refreshed if ANOTHER filter changes.
            // the implementation beneath is *not quite* sufficient  

            if (filters.length) {
                let filterString = filters.join(' and ');
                d.$apply = `filter(${filterString})`;
            }

            if (!d.$apply) {
                delete d.$apply;
            }

            return d;
        },
        popupSettings: {
            appendTo: `#breakdown-modal .modal-body`
        }
    });

    self.orderParams = kendoMDCDropDownList({
        odata: true,
        label: 'Order',
        endPoint: `/odata/Orders`,
        textField: 'ShortLabel',
        valueField: 'OrderID',
        virtual: true,
        autoBind: false,
        minLength: 3,
        enforceMinLength: true,
        pageSize: 10,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/Orders/Default.OrderValueMapper(orderId='${options.value}')`,
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
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        idObservable: self.orderId,
        objObservable: self.order,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'desc',
            field: 'OrderID'
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            if (data && data.filter && data.filter.filters && data.filter.filters.length) {
                data.pageSize = 40;
            } else {
                data.pageSize = 0;
            }

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "CustomerOrderReference")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "OrderID")}`;
            }

            return d;
        },
        popupSettings: {
            appendTo: `#breakdown-modal .modal-body`
        }
    });

    self.invoiceParams = kendoMDCDropDownList({
        odata: true,
        label: 'Invoice',
        endPoint: `/odata/Invoices`,
        textField: 'ShortLabel',
        valueField: 'InvoiceID',
        virtual: true,
        autoBind: false,
        minLength: 3,
        enforceMinLength: true,
        pageSize: 10,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/Orders/Default.InvoiceValueMapper(invoiceId='${options.value}')`,
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
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        idObservable: self.invoiceId,
        objObservable: self.invoice,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'desc',
            field: 'OrderID'
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            if (data && data.filter && data.filter.filters && data.filter.filters.length) {
                data.pageSize = 40;
            } else {
                data.pageSize = 0;
            }

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            let filters = [];

            if (self.tradeAccountCode()) {
                filters.push(`(TradeAccountCode eq '${self.tradeAccountCode()}')`)
            }

            if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "ShortLabel")) {
                let f = data.filter.filters.find(f => f.field === "ShortLabel");
                filters.push(`(contains(Name,'${f.value}') or startswith(Code,'${f.value}'))`);
            }

            if (d.$filter) {
                delete d.$filter;
            }

            // regardless whether or not a filter has a selection it must be refreshed if ANOTHER filter changes.
            // the implementation beneath is *not quite* sufficient  

            if (filters.length) {
                let filterString = filters.join(' and ');
                d.$apply = `filter(${filterString})`;
            }

            return d;
        },
        popupSettings: {
            appendTo: `#breakdown-modal .modal-body`
        }
    });

    self.valueParams = {
        label: 'Value',
        buttons: false,
        observable: self.value,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        originalValue: self.value(),
        enable: ko.observable(true),
        disable: ko.observable(false),
        locked: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        busy: ko.observable(false),
        revertFunction: () => {
            self.value(self.valueParams.originalValue);
        },
        clearFunction: () => {
            self.value(undefined);
        },
        inputType: 'text',
        minValue: 0.01,
        maxValue: null,
        step: 1
    }

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