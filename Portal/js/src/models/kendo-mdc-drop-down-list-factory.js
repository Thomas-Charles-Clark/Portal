function kendoMDCDropDownList({
    widget,
    endPoint,
    data,
    odata,
    textField,
    valueField,
    idObservable,
    objObservable,
    label,
    height,
    template,
    valueTemplate,
    groupTemplate,
    noDataTemplate,
    useKOTemplates,
    additionalParams,
    optionLabel,
    filter,
    filtering,
    showClear,
    disabled,
    disable,
    enable,
    clearable,
    revertible,
    readOnly,
    virtual,
    virtualOptions,
    valueMapper,
    optionLabelTemplate,
    sort,
    schema,
    dataBound,
    permitRevert,
    popupSettings,
    grouping,
    autoWidth,
    clearFunction,
    afterClear,
    autoBind,
    pageSize,
    method,
    cascade,
    parameterMap,
    select,
    aggregate,
    requestStart,
    requestEnd,
    skipCascade,
    ignoreCase
} = {
        widget: ko.observable(),
        endPoint: null,
        data: null,
        odata: false,
        textField,
        valueField,
        idObservable: ko.observable(),
        objObservable: ko.observable(),
        label: 'List',
        height: 200,
        template: '#:' + textField + '#',
        valueTemplate: '#:' + textField + '#',
        groupTemplate: '#:' + textField + '#',
        noDataTemplate: 'NO DATA FOUND.',
        useKOTemplates: false,
        additionalParams: {},
        optionLabel: ' ',
        filter: 'startswith',
        filtering: undefined,
        showClear: true,
        disabled: false,
        readOnly: false,
        virtual: false,
        virtualOptions: null,
        valueMapper: null,
        optionLabelTemplate: null,
        sort: [],
        schema: {},
        permitRevert: false,
        popupSettings: {
            appendTo: null
        },
        grouping: [],
        autoWidth: false,
        clearFunction: null,
        afterClear: null,
        autoBind: true,
        pageSize: null,
        method: "GET",
        parameterMap: null,
        aggregate: null,
        select: (e) => { },
        dataBound: (e) => { },
        requestStart: (e) => { },
        requestEnd: (e) => { },
        skipCascade: false,
        ignoreCase: true
    }) {

    if (endPoint == null && data == null) {
        console.error('kendoMDCDropDownList demands either endPoint or data array')
    }
    if (textField === 'undefined') {
        console.error('kendoMDCDropDownList demands textField')
    }
    if (valueField === 'undefined') {
        console.error('kendoMDCDropDownList demands valueField')
    }

    if (filter == null && filtering != null)
        filter = "startswith";

    var dataSource = null;

    if (Array.isArray(data)) {
        dataSource = new kendo.data.DataSource({
            serverFiltering: false,
            serverSorting: false,
            serverGrouping: false,
            data: data,
            group: grouping,
            aggregate: aggregate,
            sort: sort,
            schema: schema
        });
    } else if (ko.isObservableArray(data)) {
        dataSource = data;
    } else if (odata) {
        dataSource = new kendo.data.DataSource({
            serverFiltering: true,
            serverSorting: true,
            serverGrouping: true,
            serverPaging: true,
            pageSize: virtual ? pageSize ? pageSize : Math.floor((height / 34) * 4) : undefined,
            type: 'odata-v4',
            group: grouping,
            aggregate: aggregate,
            transport: {
                read: {
                    url: endPoint
                },
                parameterMap: parameterMap,
                data: additionalParams
            },
            sort: sort,
            schema: schema
        });
    } else {
        dataSource = new kendo.data.DataSource({
            serverFiltering: true,
            serverSorting: true,
            serverGrouping: true,
            serverPaging: virtual,
            pageSize: virtual ? pageSize ? pageSize : Math.floor((height / 34) * 4) : undefined,
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                filters: "Filters",
                aggregates: "Aggregates",
                errors: "Errors"
            }),
            group: grouping,
            aggregate: aggregate,
            sort: sort,
            transport: {
                read: function (options) {
                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var mapped = webapi.parameterMap(options.data);
                    var data = {};
                    for (var propertyName in mapped) {
                        data[propertyName] = mapped[propertyName];
                    }
                    data = $.extend(data, additionalParams);
                    $.ajax({
                        url: endPoint,
                        type: method,
                        data: data,
                        success: function (data) {
                            //console.log(valueField + ' returned', data);
                            options.success(data);
                        },
                        error: function (data) {
                            options.error();
                        }
                    });
                }
            }
        });
    }

    dataSource.requestStart = requestStart;

    dataSource.requestEnd = requestEnd;

    var result = {
        originalValue: ko.unwrap(idObservable),
        observable: idObservable,
        showClear: showClear,
        label: label,
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        disabled: disabled,
        readOnly: readOnly,
        dropDownListSettings: {
            isKendoMDCDropDownList: true,
            enable: !disabled,
            widget: widget,
            value: idObservable,
            useKOTemplates: useKOTemplates,
            dataItem: objObservable,
            dataValueField: valueField,
            dataTextField: textField,
            widget: ko.observable(),
            height: height,
            noDataTemplate: noDataTemplate,
            groupTemplate: groupTemplate,
            open: function (e) {
                $(e.sender._widgetOptions.value.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: function (e) {
                $(e.sender._widgetOptions.value.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            select: select,
            data: dataSource,
            dataBound: dataBound,
            valuePrimitive: false,
            autoWidth: autoWidth,
            autoBind: autoBind,
            filter: filter,
            popup: popupSettings,
            virtual: virtual ? virtualOptions ? virtualOptions : {
                itemHeight: 34,
                mapValueTo: 'index',
                valueMapper: valueMapper
            } : false,
            skipCascade: skipCascade
        },
        clearFunction: clearFunction ? function () { clearFunction(this) } : function () {
            var self = this;
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
        },
        afterClear: afterClear,
        permitRevert: permitRevert,
        revertFunction: function () {
            var self = this;
            self.observable(ko.unwrap(self.originalValue));
            if (self.dropDownListSettings.widget()) {
                if (self.dropDownListSettings.widget())
                    self.dropDownListSettings.widget().value(self.originalValue);
            }
        }
    }

    if (template != null) {
        result.dropDownListSettings.template = template;
    }

    if (valueTemplate != null) {
        result.dropDownListSettings.valueTemplate = valueTemplate;
    }

    if (optionLabel != null) {
        result.dropDownListSettings.optionLabel = optionLabel;
    }

    if (optionLabelTemplate != null) {
        result.dropDownListSettings.optionLabelTemplate = optionLabelTemplate;
    }

    if (typeof filtering === 'function') {
        result.dropDownListSettings.filtering = filtering;
    }

    if (typeof popupSettings === 'object') {
        result.dropDownListSettings.popupSettings = popupSettings;
    }

    if (typeof enable === 'function') {
        result.enable = enable;
    }

    if (typeof disable === 'function') {
        result.disable = disable;
    }

    if (typeof clearable === 'function') {
        result.clearable = clearable;
    }

    if (typeof revertible === 'function') {
        result.revertible = revertible;
    }

    if (ignoreCase != null) {
        result.dropDownListSettings.ignoreCase = ignoreCase;
    } 

    return result;
}