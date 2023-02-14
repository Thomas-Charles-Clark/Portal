var tradeOrderReturnsViewModel = function () {
    var self = this;

    //#region Properties

    self.tradeAccountSelector = new tradeAccountSelector(getPreselectedTradeAccount(), undefined, self);

    self.tradeAccount = self.tradeAccountSelector.selected;

    self.validateSearchNow = ko.observable(false);

    self.tradeAccountSelector.selected.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateSearchNow();
            },
            message: 'Please Select a Trade Account'
        }
    });

    self.ready = ko.observable(false);

    self.busy = ko.observable(true);

    self.busyMessage = ko.observable();

    self.trackingOrderNumber = ko.observable();
    self.trackingResults = ko.observableArray([]);

    self.orderDetailsOrderNumber = ko.observable();
    self.orderDetailsOrderDate = ko.observable();
    self.orderDetailsDeliveryInfo = ko.observable();
    self.orderDetailsOrderLines = ko.observableArray([]);

    self.viewingStatus = ko.observable('despatchedOrders');

    self.searchTerm = ko.observable();

    self.sampleOrders = ko.observable(false);

    self.dateRange = ko.observable(12);

    self.dateRangeType = ko.observable(1);

    self.dateRanges = [{
        dateRangeId: 12,
        name: 'Last 12 Months'
    }, {
        dateRangeId: 6,
        name: 'Last 6 Months'
    }, {
        dateRangeId: 1,
        name: 'This Month'
    }, {
        dateRangeId: -1,
        name: 'Custom'
    }];

    self.allDateRangeTypes = [{
        dateRangeTypeId: 1,
        name: 'Order Date'
    }, {
        dateRangeTypeId: 2,
        name: 'Status Date'
    }, {
        dateRangeTypeId: 3,
        name: 'Due Date'
    }];

    self.dateRangeTypes = ko.observableArray([]);

    self.customFromDate = ko.observable();
    self.customToDate = ko.observable();

    self.customFromDate.extend({
        date: {
            params: true,
            message: 'From must be a date'
        },
        required: {
            params: true,
            onlyIf: function () {
                return self.validateSearchNow() && self.dateRange() == -1 && self.customToDate() != null
            },
            message: 'Please provide From Date'
        }
    });

    self.customToDate.extend({
        date: {
            params: true,
            message: 'To must be a date'
        }
    });

    self.schema = $.extend({}, kendo.data.schemas.webapi, {
        data: "Data",
        total: "Total",
        errors: "Errors",
        aggregates: "Aggregates",
        model: {
            id: 'ReturnID',
            fields: {
                ReturnID: {
                    type: 'number'
                },
                TradeAccountID: {
                    type: 'number'
                },
                TradeAccount: { 
                    type: 'object'
                },
                UPSAccountID: {
                    type: 'number'
                },
                TotalCharge: {
                    type: 'number'
                },
                CollectName: {
                    type: 'string'
                },
                CollectCompanyName: {
                    type: 'string'
                },
                CollectAddressLine1: {
                    type: 'string'
                },
                CollectAddressLine2: {
                    type: 'string'
                },
                CollectTown: {
                    type: 'string'
                },
                CollectStateProvinceCode: {
                    type: 'string'
                },
                CollectPostcode: {
                    type: 'string'
                },
                CollectCountryCode: {
                    type: 'string'
                },
                CollectCountryID: {
                    type: 'number'
                },
                CollectEmail: {
                    type: 'string'
                },
                CollectPhone: {
                    type: 'string'
                },
                CollectTaxID: {
                    type: 'string'
                },
                CCRNumber: {
                    type: 'string'
                },
                ShipmentReference1: {
                    type: 'string'
                },
                ShipmentReference2: {
                    type: 'string'
                },
                PDFBase64: {
                    type: 'string'
                },
                ChargesJSON: {
                    type: 'string'
                },
                CreatedDT: {
                    type: 'date'
                },
                VoidedDT: {
                    type: 'date'
                },
                Voided: {
                    type: 'bool'
                }
            }
        }
    });

    self.selectedReturn = ko.observable();

    self.claimId = ko.observable();

    self.extantReturnInfo = ko.observable();

    self.validateCollectionAddressNow = ko.observable(false);

    self.collectionAddress = new addressViewModel({
        labelClass: 'collect-label',
        controlClass: 'form-control mdc-text-field__input',
        validateNow: self.validateCollectionAddressNow,
        phoneIntlMobile: true,
        email: true,
        emailValidation: {
            email: true,
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateCollectionAddressNow();
                },
                message: 'Email required'
            }
        },
        phoneValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateCollectionAddressNow();
                },
                message: 'Phone Required'
            }
        }
    });

    self.collectionAddress.phone.validateNow = self.validateCollectionAddressNow;
    self.collectionAddress.phone.numberType = intlTelInputUtils.numberType.MOBILE;
    self.collectionAddress.phone.placeholderNumberType = 'MOBILE';

    self.collectResidential = ko.observable(false);

    self.collectResidentialParams = {
        checkboxId: 'residential',
        label: 'Is this a Residential Address?',
        observable: self.collectResidential,
        useNativeValidation: false,
        disabled: false
    };

    self.collectionAddressConfirmed = ko.observable(false);

    self.validateParcelCountNow = ko.observable(false);

    self.desiredParcelCount = ko.observable(1).extend({
        roundedNumeric: 0,
        validation: {
            validator: function (val, params) {
                if (self.validateParcelCountNow())
                    return +val > +params;
                else
                    return true;
            },
            message: ' ',
            params: 0
        }
    });

    self.returningParcels = ko.observableArray([]);

    self.ccrDetails = ko.observable();

    self.returnLineConsideringQuantity = ko.observable();

    self.shipConfirmResponse = ko.observable();

    self.upsAccountNumber = ko.observable('5WR515');

    self.upsAccountDetails = ko.observable();

    self.upsAccountParams = kendoMDCDropDownList({
        label: 'Destination',
        template: '#: LocationName #',
        valueTemplate: '#: LocationName #',
        //valueTemplate: '#: AccountNumber # - #: LocationName #',
        optionLabelTemplate: null,
        optionLabel: null,
        textField: 'LocationName',
        valueField: 'AccountNumber',
        data: getUPSAccounts(),
        idObservable: self.upsAccountNumber,
        objObservable: self.upsAccountDetails,
        showClear: false,
        permitRevert: false,
        height: 300,
        filter: false,
        disabled: true,
        readOnly: true
    });

    self.validateTrackingNumberNow = ko.observable();

    self.trackingNumber = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateTrackingNumberNow()
            },
            message: ' '
        }
    });

    self.trackingNumberParams = {
        label: 'Tracking Number',
        originalValue: null,
        observable: self.trackingNumber,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        validateNow: self.validateTrackingNumberNow,
        secondaryObservable: self.selectedReturn,
        clearFunction: function () {
            var self = this;
            self.validateNow(false);
            self.secondaryObservable(undefined);
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        charsRemainingOptions: {
            maxLength: 20
        }
    }

    self.labelResult = ko.observable();

    self.validateCollectNow = ko.observable(false);

    self.collectionDate = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateCollectNow()
            },
            message: 'Collection Date is Required'
        }
    });

    self.collectionDateParams = {
        label: 'Collection Date',
        observable: self.collectionDate,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: true,
        clearFunction: function () {
            this.observable(undefined);
        },
        disabled: false,
        dateTimePickerOptions: {
            locale: 'en-gb',
            format: 'DD/MM/YYYY',
            ignoreReadonly: true,
            showClear: true,
            allowInputToggle: true,
            sideBySide: true,
            useCurrent: false,
            minDate: new moment().add(0, 'day').toDate(),
            disabledDates: [],
            showClose: true,
            keepInvalid: true,
            debug: false
        }
    };

    self.timeOptions = [{
        time: '08:00',
        value: '0800'
    }, {
        time: '09:00',
        value: '0900'
    }, {
        time: '10:00',
        value: '1000'
    }, {
        time: '11:00',
        value: '1100'
    }, {
        time: '12:00',
        value: '1200'
    }, {
        time: '13:00',
        value: '1300'
    }, {
        time: '14:00',
        value: '1400'
    }, {
        time: '15:00',
        value: '1500'
    }, {
        time: '16:00',
        value: '1600'
    }, {
        time: '17:00',
        value: '1700'
    }, {
        time: '18:00',
        value: '1800'
    }];

    self.collectionReadyTime = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateCollectNow()
            },
            message: 'Collection Ready Time is Required'
        }
    });

    self.collectionReadyTimeParams = {
        label: 'Ready From',
        widget: ko.observable(),
        observable: self.collectionReadyTime,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: self.timeOptions,
        optionsText: 'time',
        optionsValue: 'value',
        optionsCaption: ' ',
        width: 'auto',
        showClear: true,
        onSelect: function () {

        }
    };

    self.collectionCloseTime = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateCollectNow()
            },
            message: 'Collection Close Time is Required'
        }
    });

    self.collectionCloseTimeParams = {
        label: 'Closed At',
        widget: ko.observable(),
        observable: self.collectionCloseTime,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: self.timeOptions,
        optionsText: 'time',
        optionsValue: 'value',
        optionsCaption: ' ',
        width: 'auto',
        showClear: true,
        onSelect: function () {

        }
    };

    self.collectErrors = ko.validation.group([
        self.collectionDate,
        self.collectionReadyTime,
        self.collectionCloseTime
    ]);

    //#endregion

    //#region Computeds

    self.isSelectionVoided = ko.pureComputed(function () {
        if (self.selectedReturn()) {
            return self.selectedReturn().voided();
        } else {
            return false;
        }
    }, self);

    self.doesSelectionHaveActiveCollection = ko.pureComputed(function () {
        if (self.selectedReturn()) {
            return Enumerable.From(self.selectedReturn().collections()).Where(function (x) {
                return x.Cancelled == false
            }).Any();
        } else {
            return false;
        }
    }, self);

    self.isMiscTradeAccount = ko.pureComputed(function () {
        if (self.tradeAccount()) {
            return self.tradeAccount().MiscellaneousAccount || false;
        }
    }, self);

    self.showSampleControl = ko.pureComputed(function () {
        switch (self.viewingStatus()) {
            case 'backOrders':
            case 'despatchedOrders':
            case 'ordersInProgress':
                return true;
            default:
                return false;
        }
    }, self);

    self.availableDateRangeTypes = ko.pureComputed(function () {
        switch (self.viewingStatus()) {
            case 'outstanding':
                return [{
                    dateRangeTypeId: 1,
                    name: 'Order Date'
                }]
                break;
            case 'backOrders':
                return [{
                    dateRangeTypeId: 1,
                    name: 'Order Date'
                }, {
                    dateRangeTypeId: 5,
                    name: 'Due Date'
                }]
                break;
            case 'reserveOrders':
                return [{
                    dateRangeTypeId: 1,
                    name: 'Order Date'
                }, {
                    dateRangeTypeId: 4,
                    name: 'Expiry Date'
                }]
                break;
            case 'despatchedOrders':
                return [{
                    dateRangeTypeId: 1,
                    name: 'Order Date'
                }, {
                    dateRangeTypeId: 3,
                    name: 'Despatch Date'
                }]
                break;
            case 'ordersInProgress':
                return [{
                    dateRangeTypeId: 1,
                    name: 'Order Date'
                }, {
                    dateRangeTypeId: 2,
                    name: 'Status Date'
                }]
            case 'held':
                return [{
                    dateRangeTypeId: 1,
                    name: 'Order Date'
                }]
                break;
                break;
        }
    }, self);

    self.fromPreceedsTo = ko.pureComputed(function () {
        if (self.customFromDate() && self.customToDate()) {
            return self.customFromDate().getTime() <= self.customToDate().getTime();
        }
    }, self).extend({
        equal: {
            params: true,
            onlyIf: function () {
                return self.customFromDate() && self.customToDate()
            },
            message: 'From Date must preceed To Date'
        }
    });

    self.canProduceLabel = ko.pureComputed(function () {
        if (self.ccrDetails()) {
            if (self.collectionAddressConfirmed()) {
                if (self.returnLineConsideringQuantity() == null) {
                    if (self.ccrDetails().products().length == 0) {
                        if (self.returningParcels().length > 0) {
                            if (Enumerable.From(self.returningParcels()).Where(function (x) {
                                return x.products().length == 0
                            }).Any()) {

                            } else {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }, self);

    //#endregion

    //#region Purposefully Lifted Functions

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

    self.generateReturnsDataSource = function () {
        return new kendo.data.DataSource({
            schema: self.schema,
            serverFiltering: true,
            serverSorting: true,
            serverGrouping: false,
            serverPaging: true,
            pageSize: 10,
            sort: {
                field: 'CreatedDT',
                dir: 'desc'
            },
            transport: {
                read: function (options) {
                    //self.validateSearchNow(true);
                    //if (self.searchErrors().length) {
                    //    self.searchErrors.showAllMessages(true);
                    //    self.searchErrors.filter(function (x) {
                    //        x.notifySubscribers(x.isValid())
                    //    });
                    //} else {
                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var params = webapi.parameterMap(options.data);

                    var data = {
                        //tradeAccountNumber: self.tradeAccountSelector.selected().Code,
                        //orderStatus: self.viewingStatus(),
                        //dateRange: self.dateRange(),
                        //dateRangeType: self.dateRangeType(),
                        //searchTerm: self.searchTerm.peek(),
                        //sampleOrders: self.sampleOrders()
                    };

                    //if (self.dateRange() == -1) {
                    //    data.fromDate = self.customFromDate() ? self.customFromDate().toISOString() : null;
                    //    data.toDate = self.customToDate() ? self.customToDate().toISOString() : null;
                    //}

                    for (var propertyName in params) {
                        data[propertyName] = params[propertyName];
                    }

                    $.ajax({
                        url: '/api/orderreturns/ReturnsGrid',
                        type: "GET",
                        dataType: 'json',
                        data: data,
                        success: function (data) {
                            //ko.utils.arrayForEach(data.Data, function (i) {
                            //    i.selectedParams = {
                            //        checkboxName: 'selected',
                            //        checkedValue: i.Identifier,
                            //        observable: self.selectedReturn,
                            //        useNativeValidation: false
                            //    }
                            //});
                            options.success(data);
                        },
                        error: function (xhr, s, a) {
                            $.ajaxSettings.error(xhr, s, a);
                            options.error();
                        }
                    });
                    //}
                }
            }
        });
    }

    self.fetchCCRDetails = function (onComplete) {
        self.busy(true);
        self.busyMessage('Fetching CCR Details, Please Wait...');
        $.ajax({
            url: '/api/orderreturns/fetchCCRDetails',
            type: 'POST',
            dataType: 'json',
            data: {
                claimId: self.claimId()
            },
            success: function (data) {
                self.busy(false);
                console.log('fetchCCRDetails returned', data);
                data.products = ko.observableArray(data.ClaimLines.map(function (x) {
                    return returnLine({ line: x });
                }));
                self.returningParcels([returnParcel({ parent: self })]);
                self.collectionAddress.loadTradeAccountAddress({
                    Name: data.CollectionName,
                    CompanyName: data.CollectionCompanyName,
                    AddressLine1: data.CollectionAddressLine1,
                    AddressLine2: data.CollectionAddressLine2,
                    Town: data.CollectionTown,
                    County: data.CollectionCounty,
                    Postcode: data.CollectionPostcode,
                    CountryID: data.Country?.CountryID,
                    Phone: data.OrderHead?.DeliveryAlertMobilePhoneNumber ?? data.OrderHead?.DeliveryAlertLandlinePhoneNumber,
                    Email: data.OrderHead?.DeliveryAlertEmail
                }, false);
                self.ccrDetails(data);
                self.addressSearch.showEditModal();
                if (typeof onComplete === 'function') {
                    onComplete();
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.confirmCollectionAddress = function (onComplete) {
        console.log('confirmCollectionAddress called');
        self.validateCollectionAddressNow(true);
        var canProceed = true;

        if (self.collectionAddress.phone.observable.numberTypeValid()) {
            
        } else {
            canProceed = false;
            self.collectionAddress.phone.observable.numberTypeValid.notifySubscribers(false);
        }

        if (self.collectionAddress.isValid() && canProceed) {
            self.collectionAddressConfirmed(true);
            self.addressSearch.closeEditModal();
            //self.showParcelCountModal();
            if (typeof onComplete === 'function') {
                onComplete();
            }
        }
    }

    //#endregion

    //#region Components

    self.customFromDatePicker = {
        widget: ko.observable(),
        value: self.customFromDate,
        format: 'dd/MM/yyyy',
        clear: function () {
            self.customFromDate(undefined);
            self.customFromDatePicker.widget().value(null);
            self.customFromDatePicker.widget().trigger('change');
        }
    };

    self.customToDatePicker = {
        widget: ko.observable(),
        value: self.customToDate,
        format: 'dd/MM/yyyy',
        clear: function () {
            self.customToDate(undefined);
            self.customToDatePicker.widget().value(null);
            self.customToDatePicker.widget().trigger('change');
        }
    };

    self.returnsGrid = {
        autoBind: true,
        widget: ko.observable(),
        data: self.generateReturnsDataSource(),
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50]
        },
        filterable: {
            extra: false
        },
        useKOTemplates: true,
        rowTemplate: 'returns-row-template',
        columns: [{
            field: 'ReturnID',
            title: 'Return ID',
            width: 110,
            filterable: true
        }, {
            field: 'ShipmentIdentificationNumber',
            title: 'Tracking Number(s)',
            width: 180
        }, {
            field: 'CCRNumber',
            title: 'CCR Number',
            width: 140
        }, {
            field: 'TradeAccountCode',
            title: 'Trade Account',
            template: '#: TradeAccount.Code #',
            //width: 130
        }, {
            field: 'ParcelCount',
            title: 'No. Parcels',
            width: 120
        }, {
            field: 'CreatedDT',
            title: 'Created'
        }],
        sortable: true,
        noRecords: {
            template: 'No records to display.'
        },
        selectable: 'row',
        persistSelection: true,
        change: function (e) {
            var dataItem = this.dataItem(this.select());
            if (dataItem) {
                self.selectedReturn(returnOrder({ record: dataItem, parent: self }));
                self.trackingNumber(dataItem.ShipmentIdentificationNumber);
            }
        },
        dataBound: function (e) {
            if (typeof self.returnsGridAfterBound === 'function') {
                self.returnsGridAfterBound();
                self.returnsGridAfterBound = null;
            }
        },
        excelExport: self.exportToExcel
    };

    self.ordersDetailsGrid = {
        widget: ko.observable(),
        data: self.orderDetailsOrderLines,
        dataSource: new kendo.data.DataSource({
            schema: self.schema,
            serverFiltering: false,
            serverSorting: false,
            serverGrouping: false,
            serverPaging: false,
            pageSize: 10,
            sort: {
                field: 'LineNumber',
                dir: 'asc'
            },
        }),
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50]
        },
        columns: [{
            field: 'LineNumber',
            title: 'Line No.',
            hidden: true
        }, {
            field: 'Product',
            title: 'Product',
            width: 120
        }, {
            field: 'Batch',
            title: 'Batch',
            width: 120
        }, {
            field: 'Description',
            title: 'Description'
        }, {
            field: 'Quantity',
            title: 'Quantity',
            width: 100,
            attributes: {
                'class': 'text-right'
            }
        }, {
            field: 'BatchNumber',
            title: 'Batch No.',
            width: 100
        }, {
            field: 'CustomerOrderReference',
            title: 'Your Reference',
            width: 115
        }, {
            field: 'OrderStatus',
            title: 'Status',
            width: 90,
            //template: "#: DespatchStatusDate ? kendo.toString(kendo.parseDate(DespatchStatusDate, 'yyyy-MM-ddTHH:mm:ss'), 'dd/MM/yyyy') : DespatchStatusDateMessage #",
            attributes: {
                'class': 'text-right'
            }
        }, {
            field: 'DespatchStatus',
            title: 'Despatch',
            width: 100,
            //template: "#: DespatchStatusDate ? kendo.toString(kendo.parseDate(DespatchStatusDate, 'yyyy-MM-ddTHH:mm:ss'), 'dd/MM/yyyy') : DespatchStatusDateMessage #",
            attributes: {
                'class': 'text-right'
            }
        }, {
            field: 'Tracking',
            title: 'Track',
            template: function (dataItem) {
                if (dataItem.Tracking) {
                    return '<a href="javascript:;" onclick="viewModel.checkParcel(\'' + dataItem.Tracking + '\')">Track</a>'
                } else {
                    return ''
                }
            }
        }],
        sortable: true,
        noRecords: {
            template: 'No records to display.'
        },
        selectable: 'row',
        change: function (e) {
            var dataItem = this.dataItem(this.select());
            //window.open('/downloads/trade-document?docref=' + encodeURIComponent(dataItem.DocumentNumber), '_blank');
        },
        excelExport: self.exportToExcel
    };

    self.claimRecordAutocomplete = {
        label: 'Customer Claim Record Search',
        observable: ko.observable(),
        focusObservable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        disabled: false,
        enterKeyFunction: function () {
            $(self.claimRecordAutocomplete.observable.DOMElement).autocomplete('search');
        },
        clearFunction: function () {
            self.claimId(undefined);
            self.claimRecordAutocomplete.observable(undefined);
            self.collectionAddress.reset();
            self.collectionAddressConfirmed(false);
            $(self.claimRecordAutocomplete.observable.DOMElement).val(undefined);
            $(self.claimRecordAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        autocompleteSettings: {
            value: self.claimId,
            appendTo: 'body',
            mapFunction: function (i) {
                return {
                    label: i,
                    value: i,
                    obj: i
                }
            },
            source: function (request, response) {
                if (self.tradeAccount()) {
                    var data = {
                        term: request.term,
                        tradeAccountCode: self.tradeAccount().Code
                    };
                    $.ajax({
                        url: '/api/ComponentAPI/CustomerCareRecordAutocomplete',
                        type: "POST",
                        dataType: "json",
                        data: data,
                        success: function (data) {
                            response($.map(data, function (item) {
                                return {
                                    label: item.Item2,
                                    value: item.Item1,
                                    obj: item
                                };
                            }));
                        }
                    });
                } else {
                    response([]);
                }
            },
            minLength: 0,
            select: function (event, ui) {
                event.preventDefault();
                self.collectionAddress.reset();
                self.collectionAddressConfirmed(false);
                self.checkExtantReturns(ui.item.value, function () {
                    self.claimId(ui.item.value);
                    self.claimRecordAutocomplete.observable(ui.item.label);
                    $(self.claimRecordAutocomplete.observable.DOMElement).val(ui.item.label);
                    self.fetchCCRDetails();
                });
            },
            autoFocus: true,
            classField: 'ccr-result',
            create: function () {
                $(this).data("ui-autocomplete")._renderItem = function (ul, item) {
                    var li = $("<li>");
                    var div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "</div>");
                    return li.appendTo(ul);
                };
            }
        }
    };

    self.checkExtantReturns = function (ccrNumber, onComplete) {
        self.busy(true);
        self.busyMessage('Checking for Extant Returns...');

        $.ajax({
            url: '/api/orderreturns/extantReturnCheck',
            type: 'POST',
            dataType: 'json',
            data: {
                ccrNumber: ccrNumber
            },
            success: function (data) {
                self.busy(false);
                if (data.extantReturns.length) {
                    self.extantReturnInfo(data);
                    self.showExtantReturnModal();
                    self.arrangeReturnRegardlessOfExtant = function () {
                        self.cancelCCRSelection();
                        onComplete();
                    }
                } else {
                    onComplete();
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.showExtantReturnModal = function () {
        $('#extant-return-modal').modal('show');
    }

    self.hideExtantReturnModal = function () {
        $('#extant-return-modal').modal('hide');
    }

    self.cancelCCRSelection = function () {
        self.extantReturnInfo(undefined);
        self.hideExtantReturnModal();
    }

    self.arrangeReturnRegardlessOfExtant = function () {

    }

    self.inspectReturn = function (returnId) {
        self.returnsGridAfterBound = function () {
            if (self.returnsGrid.widget().dataSource.data().length == 1)
                self.returnsGrid.widget().select($('#extant-return-grid .k-grid-content tr:eq(0)'));
        }
        self.returnsGrid.widget().dataSource.filter({
            field: 'ReturnID',
            operator: 'eq',
            value: returnId
        });
        $('#return-tabs a[href="#extant-returns"]').tab('show');
        self.hideExtantReturnModal();
        self.extantReturnInfo(undefined);
    } 

    self.addressSearch = new addressSearchFactory(
        self.tradeAccount,
        'Collection',
        'Collect from',
        self.collectionAddress,
        null, // needs its own busy observable
        null, // message probably not required
        self.confirmCollectionAddress, // save function
        self.isMiscTradeAccount, // is this a misc trade account we're talking about
        ko.observable(), // basketId
        ko.observableArray([]), // forbidden countries
        self // parent
    );

    self.collectionAddress.tradeAccount = self.tradeAccount;

    //#endregion

    //#region Subscriptions

    self.selectedReturn.subscribe(function (newValue) {
        console.log('selectedReturn subscribe hit', newValue);
    });

    self.collectionAddressConfirmed.subscribe(function (newValue) {
        if (newValue) {
            if (self.ccrDetails()) {
                if (self.ccrDetails().ClaimLines.length == 1) {
                    if (self.ccrDetails().ClaimLines[0].AcceptedQuantity == 1) {
                        if (self.returningParcels().length == 1) {
                            self.returningParcels()[0].products.push(self.ccrDetails().products().pop());
                        }
                    }
                }
            }
        }
    })

    self.tradeAccount.subscribe(function (newValue) {
        //if (newValue == null) {
            self.reset();
        //}
    });

    self.dateRange.subscribe(function (newValue) {
        if (newValue != -1) {
            self.refresh(self.viewingStatus(), true);
        }
    });

    self.dateRangeType.subscribe(function (newValue) {
        if (self.dateRange() != -1) {
            self.refresh(self.viewingStatus(), true);
        }
    });

    self.sampleOrders.subscribe(function (newValue) {
        self.search();
    });

    self.returnLineConsideringQuantity.subscribe(function (newValue) {
        if (newValue)
            self.showReturnLineQuantityModal();
    });

    self.busy.subscribe(function (newValue) {
        if (!newValue) {
            self.busyMessage(undefined);
        }
    });

    //#endregion

    //#region Validation Groups

    self.errors = ko.validation.group([

    ]);

    //self.searchErrors = ko.validation.group([
    //    self.tradeAccountSelector.selected,
    //    self.customFromDate,
    //    self.customToDate,
    //    self.fromPreceedsTo
    //]);

    //#endregion

    //#region Functions

    self.addParcel = function () {
        self.returningParcels.push(returnParcel({ parent: self }));
    }

    self.removeParcel = function () {
        if (self.returningParcels().length > 1) {
            var rp = self.returningParcels.pop();
            ko.utils.arrayForEach(rp.products(), function (p) {
                rp.removeLine(p);
            });
        }
    }

    //self.search = function () {
    //    self.refresh(self.viewingStatus(), true);
    //}

    //self.refresh = function (orderStatus, force, clean) {
    //    if (clean) {
    //        //self.dateRange(12);
    //        //self.dateRangeType(?);
    //        self.searchTerm(undefined);
    //    }

    //    self.validateSearchNow(true);

    //    self.searchErrors.showAllMessages(false);

    //    window.setTimeout(function () {
    //        if (self.searchErrors().length) {
    //            self.searchErrors.showAllMessages(true);
    //            self.searchErrors.filter(function (x) {
    //                x.notifySubscribers(x.isValid())
    //            });
    //        } else {
    //            self.returnsGrid.widget().dataSource.page(1);
    //        }
    //    }, 0);
    //}

    //self.checkParcel = function (text) {

    //    self.busy(true);

    //    $.ajax({
    //        url: '/api/tradeapi/GetParcelCount',
    //        type: 'POST',
    //        dataType: 'json',
    //        data: {
    //               tradeAccountNumber: self.tradeAccount().Code,
    //            documentNumber: text
    //        },
    //        success: function (data) {
    //            self.busy(false);
    //            if (data.Results.length == 1) {
    //                window.open(data.Results[0].TrackingURL, '_blank');
    //            } else {
    //                self.trackingOrderNumber(text.split(',')[1]);
    //                self.trackingResults(data.Results);
    //                self.showTrackingModal();
    //            }
    //        },
    //        error: function (xhr, s, a) {
    //            affectingBusy(false);
    //            $.showError(xhr, s, a);
    //        }
    //    });
    //}

    //self.showParcelCountModal = function () {
    //    $('#parcel-count-modal').modal('show');
    //}

    //self.hideParcelCountModal = function () {
    //    $('#parcel-count-modal').modal('hide');
    //}

    self.showReturnLineQuantityModal = function () {
        $('#quantity-modal').modal('show');
    }

    self.hideReturnLineQuantityModal = function () {
        $('#quantity-modal').modal('hide');
    }

    self.showTrackingModal = function () {
        $('#tracking-modal').modal('show');
    }

    self.hideTrackingModal = function () {
        self.trackingResults([]);
        $('#tracking-modal').modal('hide');
    }

    self.showOrderDetailModal = function () {
        $('#order-detail-modal').modal('show');
    }

    self.hideOrderDetailModal = function () {
        $('#order-detail-modal').modal('hide');
    }

    self.confirmParcelCount = function () {
        var parcels = [];
        for (var i = 0; i < self.desiredParcelCount(); i++) {
            parcels.push(returnParcel({ parent: self }));
        }
        self.returningParcels(parcels);
        self.hideParcelCountModal();
        window.setTimeout(function () {
            //$('.return-parcel').sortable({
            //    accept: '.return-line'
            //});
            //$('.return-line').draggable({
            //    revert: 'invalid',
            //    connectToSortable: '.return-parcel'
            //});
        }, 0);
    }

    self.cancelParcellingLine = function () {
        self.returnLineConsideringQuantity().quantityParcelled(0);
        ko.utils.arrayForEach(self.returningParcels(), function (p) {
            p.products.remove(self.returnLineConsideringQuantity());
        });
        self.ccrDetails().products.push(self.returnLineConsideringQuantity());
        self.returnLineConsideringQuantity(undefined);
        self.hideReturnLineQuantityModal();
    }

    self.confirmParcellingLine = function () {
        var rl = self.returnLineConsideringQuantity();
        if (rl.quantityParcelled() < rl.quantity()) {
            // need to split returnLine
            var newSibling = returnLine({ line: rl });
            newSibling.quantity(rl.quantity() - rl.quantityParcelled());
            rl.quantity(rl.quantityParcelled());
            self.ccrDetails().products.push(newSibling);
        }
        self.returnLineConsideringQuantity(undefined);
        self.hideReturnLineQuantityModal();
    }

    self.fetchOrderDetails = function (orderNumber, orderDate) {

        var affectingBusy = null;

        switch (self.viewingStatus()) {
            case 'outstanding':
                affectingBusy = self.outstandingOrdersBusy;
                break;
            case 'backOrders':
                affectingBusy = self.backOrdersBusy;
                break;
            case 'reserveOrders':
                affectingBusy = self.reserveOrdersBusy;
                break;
            case 'despatchedOrders':
                affectingBusy = self.despatchedOrdersBusy;
                break;
            case 'ordersInProgress':
                affectingBusy = self.ordersInProgressBusy;
                break;
            case 'held':
                affectingBusy = self.heldOrdersBusy;
                break;
        }

        affectingBusy(true);

        $.ajax({
            url: '/api/tradeapi/GetOrderDeliveryInfo',
            type: 'POST',
            dataType: 'json',
            data: {
                orderNumber: orderNumber
            },
            success: function (data) {
                console.log('GetOrderDeliveryInfo returned', data);

                self.orderDetailsOrderDate(orderDate);
                self.orderDetailsOrderNumber(orderNumber);
                self.orderDetailsDeliveryInfo(data.DeliveryInfo);
                self.orderDetailsOrderLines(data.OrderLines);

                affectingBusy(false);

                self.showOrderDetailModal();
            },
            error: function (xhr, s, a) {
                affectingBusy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.getReturnData = function () {
        var parcels = self.returningParcels().map(function (x) {
            return {
                products: x.products(),
                references: [] //...?
            }
        });

        return {
            upsAccountNumber: self.upsAccountNumber(),
            ccrNumber: self.ccrDetails().ClaimID,
            orderNumber: self.ccrDetails().OrderID,
            customerOrderReference: self.ccrDetails().CustomerOrderReference,
            shipmentReference1: self.ccrDetails().Header.OrderNumber + ' - ' + self.ccrDetails().CCRNumber,
            shipmentReference2: getUserName(),
            tradeAccountId: self.tradeAccount().TradeAccountID,
            upsAccountId: self.upsAccountDetails().AccountID,
            header: {
                ccrNumber: self.ccrDetails().CCRNumber,
                fromAddress: {
                    locationName: null,
                    companyName: self.collectionAddress.companyName.observable(),
                    name: self.collectionAddress.name.observable(),
                    addressLine1: self.collectionAddress.addressLine1.observable(),
                    addressLine2: self.collectionAddress.addressLine2.observable(),
                    town: self.collectionAddress.town.observable(),
                    county: self.collectionAddress.county.observable(),
                    stateProvinceCode: null, // *** important for US! Not gathered anywhere!
                    postcode: self.collectionAddress.postcode.observable(),
                    countryCodeIsoAlpha2: self.collectionAddress.country().Code,
                    taxId: self.ccrDetails().TaxID, // The hell is this?!
                    countryId: self.collectionAddress.country().CountryID,
                    email: self.collectionAddress.email.observable(),
                    phone: self.collectionAddress.phone.observable(),
                    residential: self.collectResidential()
                }
            },
            parcels: parcels,
            products: Enumerable.From(self.returningParcels()).SelectMany(function (x) {
                return x.products()
            }).ToArray()
        };
    }

    self.assessReturn = function () {
        // this function needs to determine... something
    }

    self.fetchLabelPricing = function () {
        self.busy(true);
        self.busyMessage('Fetching Return Label Pricing');

        var data = self.getReturnData();

        console.log('calling fetchReturnPricing with', data);

        $.ajax({
            url: '/api/orderreturns/fetchReturnPricing',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.busy(false);
                console.log('fetchReturnPricing returned', data);
                if (data.ErrorDetails != null) {
                    $.showError({ responseText: data.ErrorDetails });
                } else {
                    var finalCharge = data.Response.shipmentResultsField.negotiatedRateChargesField == null ?
                        data.Response.shipmentResultsField.shipmentChargesField.totalChargesField.monetaryValueField :
                        data.Response.shipmentResultsField.negotiatedRateChargesField.totalChargeField.monetaryValueField;
                    var currencyCode = data.Response.shipmentResultsField.shipmentChargesField.totalChargesField.currencyCodeField;

                    var itemizedChargesBreakdown = '';
                    if (data.Response.shipmentResultsField.shipmentChargesField != null) {

                        // itemizedChargesField
                        ko.utils.arrayForEach(data.Response.shipmentResultsField.shipmentChargesField.itemizedChargesField, function (x) {
                            itemizedChargesBreakdown += '<span class="display-block">' + x.codeField + ' - ' +
                                Enumerable.From(ups.accessorialSurchargeCodes).Where(function (y) {
                                    return x.codeField == y.value
                                }).Select(function (y) {
                                    return y.description
                                }).SingleOrDefault('[Unknown]') +
                                ': <strong>' + formatCurrency(x.monetaryValueField,
                                    2,
                                    'en-GB',
                                    currencyCode) + '</strong></span>';
                        });
                    }

                    $.confirm('UPS Return Rate', 'UPS have quoted the following rate for this return: ' +
                        '<strong>' +
                        formatCurrency(finalCharge,
                            2,
                            'en-GB',
                            currencyCode) +
                        '</strong>' +
                        '<br/><br/>' +
                        'They provided the following itemised charges breakdown:' +
                        itemizedChargesBreakdown +
                        '<i class="small">The breakdown may not sum to the overall rate.</i>' +
                        '<br/>' +
                        '<br/>' +
                        'Would you like to accept this rate and generate your return label(s)?',
                        function () {
                            self.acceptUPSReturnRate(data.Response.shipmentResultsField.shipmentDigestField);
                        }, function () {
                            console.log('Rejected :(');
                        });
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.acceptUPSReturnRate = function (digestive) {
        self.busy(true);
        self.busyMessage('Fetching UPS Return Label(s)...');

        var data = self.getReturnData();
        data.digest = digestive;

        $.ajax({
            url: '/api/orderreturns/acceptShip',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.busy(false);
                console.log('acceptShip returned', data);

                if (data.ErrorDetails != null) {
                    $.showError({ responseText: data.ErrorDetails });
                } else {
                    //data.collections = ko.observableArray([]);
                    //data.voided = ko.observable(false);
                    self.selectedReturn(returnOrder({ record: data, parent: self }));
                    self.trackingNumber(data.ShipmentIdentificationNumber);
                    self.returnsGrid.widget().dataSource.query({
                        page: 1,
                        pageSize: self.returnsGrid.widget().dataSource.pageSize()
                    });
                    $('a[href="#extant-returns"]').trigger('click');
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(self.base64toBlob(data.PDFBase64));
                    link.download = self.trackingNumber() + '.pdf';
                    link.click();
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.recoverLabel = function (view) {
        
        self.validateTrackingNumberNow(true);

        if (self.trackingNumber.isValid()) {
            $('a[href="#extant-returns"]').trigger('click');
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(self.base64toBlob(self.selectedReturn().PDFBase64));
            link.download = self.trackingNumber() + '.pdf';
            link.click();
        } else {
            self.trackingNumber.notifySubscribers(false);
            self.trackingNumber.DOMElement.focus();
        }
    }

    // Cheers guy: https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
    self.base64toBlob = function(base64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 1024;
        var byteCharacters = atob(base64Data);
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var byteArrays = new Array(slicesCount);

        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);

            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    }

    self.voidLabel = function () {
        $.confirm('Are you sure?', 'This will void Shipment Number ' + self.trackingNumber(), function () {
            self.busy(true);
            self.busyMessage('Voiding Shipment Number ' + self.trackingNumber());
            $.ajax({
                url: '/api/orderreturns/voidLabel',
                type: 'POST',
                dataType: 'json',
                data: {
                    returnId: self.selectedReturn().ReturnID,
                    trackingNumber: self.trackingNumber()
                },
                success: function (data) {
                    self.busy(false);
                    console.log('voidLabel returned', data);
                    if (data.ErrorDetails != null) {
                        $.showError({ responseText: data.ErrorDetails });
                    } else {
                        self.labelResult(undefined);
                        $.info('Void', 'Successfully voided ' + self.trackingNumber());
                        self.selectedReturn().voided(true);
                        self.trackingNumber(undefined);
                        self.validateTrackingNumberNow(false);
                    }
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError(xhr, s, a);
                }
            });
        }, null);
    }

    self.getCollectionRate = function () {
        self.validateCollectNow(false);
        self.validateCollectNow(true);
        window.setTimeout(function () {
            if (self.collectErrors().length) {
                self.collectErrors.filter(function (x) {
                    x.notifySubscribers(x.isValid());
                });
            } else {
                self.busy(true);
                self.busyMessage('Fetching Collection Rate...');
                var data = {
                    serviceDateOption: '03',
                    pickupDate: moment(self.collectionDate()).toISOString(),
                    readyTime: self.collectionReadyTime(),
                    closeTime: self.collectionCloseTime(),
                    returnId: self.selectedReturn().ReturnID
                };
                console.log('calling fetchCollectionRate with', data);
                $.ajax({
                    url: '/api/orderreturns/FetchCollectionRate',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        self.busy(false);
                        console.log('fetchCollectionRate returned', data);

                        if (data.ErrorDetails != null) {
                            $.showError({ responseText: data.ErrorDetails });
                        } else {
                            var finalCharge = data.Response.rateResultField.grandTotalOfAllChargeField;
                            var currencyCode = data.Response.rateResultField.currencyCodeField;

                            var itemizedChargesBreakdown = '';
                            if (data.Response.rateResultField.chargeDetailField != null) {
                                ko.utils.arrayForEach(data.Response.rateResultField.chargeDetailField, function (x) {
                                    itemizedChargesBreakdown += '<span class="display-block">' + x.chargeCodeField + ' - ' +
                                        x.chargeDescriptionField +
                                        ': <strong>' + formatCurrency(x.chargeAmountField,
                                        2,
                                        'en-GB',
                                        currencyCode) + '</strong></span>';
                                });
                            }

                            $.confirm('UPS Collection Rate', 'UPS have quoted the following rate for this collection: ' +
                                '<strong>' +
                                formatCurrency(finalCharge,
                                    2,
                                    'en-GB',
                                    currencyCode) +
                                '</strong>' +
                                '<br/><br/>' +
                                'They provided the following itemised charges breakdown:' +
                                itemizedChargesBreakdown +
                                '<i class="small">The breakdown may not sum to the overall rate.</i>' +
                                '<br/>' +
                                '<br/>' +
                                'Would you like to accept this rate and confirm the collection?',
                                function () {
                                    self.acceptUPSCollectionRate(finalCharge);
                                }, function () {
                                    console.log('Rejected :(');
                                });
                        }
                    },
                    error: function (xhr, s, a) {
                        self.busy(false);
                        $.showError(xhr, s, a);
                    }
                });
            }
        }, 0);
    }

    self.acceptUPSCollectionRate = function (totalChargeInc) {
        //CreateCollection
        self.busy(true);
        self.busyMessage('Confirming Collection...');
        var data = {
            serviceDateOption: '03',
            pickupDate: moment(self.collectionDate()).toISOString(),
            readyTime: self.collectionReadyTime(),
            closeTime: self.collectionCloseTime(),
            returnId: self.selectedReturn().ReturnID,
            totalChargeInc: totalChargeInc
        };
        console.log('confirmCollection calling with', data);
        $.ajax({
            url: '/api/orderreturns/CreateCollection',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.busy(false);
                console.log('confirmCollection returned', data);
                if (data.ErrorDetails != null) {
                    if (data.ErrorDetails.indexOf('No Pickup days available') > -1) {
                        $.showError({ responseText: 'UPS declined to collect on the specified day within the specified timeframe. Please try again.' })
                    } else {
                        $.showError({ responseText: data.ErrorDetails });
                    }
                } else {
                    data.cancelled = ko.observable(false);
                    self.selectedReturn().collections.push(data);
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.cancelCollection = function (prn, collectionId) {
        $.confirm('Are you sure?', 'This will cancel the Collection Reference ' + prn, function () {
            self.busy(true);
            self.busyMessage('Cancelling Collection ' + prn);
            var data = {
                collectionId: collectionId,
                prn: prn
            };
            console.log('cancelCollection calling with', data);
            $.ajax({
                url: '/api/orderreturns/CancelCollection',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    self.busy(false);
                    console.log('cancelCollection returned', data);
                    if (data.ErrorDetails != null) {
                        $.showError({ responseText: data.ErrorDetails });
                    } else {
                        $.info('Cancel', 'Successfully cancelled Collection ' + prn);
                        self.selectedReturn().collections.remove(function (x) {
                            return x.CollectionID = collectionId
                        });
                    }
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError(xhr, s, a);
                }
            });
        }, null);
    }

    self.reset = function () {
        console.log('tradeOrderReturnsViewModel reset called');
        self.errors.showAllMessages(false);
        //self.searchErrors.showAllMessages(false);
        self.validateSearchNow(false);
        self.busy(false);
        if (self.returnsGrid.widget()) {
            self.returnsGrid.widget().setDataSource(self.generateReturnsDataSource());
            self.returnsGrid.widget().dataSource.data([]);
        }
        self.claimId(undefined);
        self.claimRecordAutocomplete.clearFunction();
        self.customerCareRecord(undefined);
        self.customerCareRecordDetail(undefined);
        self.addressSearch.reset();
        self.collectionAddressConfirmed(false);
        self.desiredParcelCount(1);
        self.validateParcelCountNow(false);
        self.ccrDetails(undefined);
        self.returningParcels([]);
        self.returnLineConsideringQuantity(undefined);
        //self.hideParcelCountModal();
        self.hideReturnLineQuantityModal();
        self.shipConfirmResponse(undefined);
        self.upsAccountNumber('5WR515');
        self.upsAccountDetails(undefined);
        self.trackingNumber(undefined);
        self.labelResult(undefined);
        self.collectionDate(undefined);
        self.selectedReturn(undefined);
        self.collectResidential(false);
        self.collectionReadyTime(undefined);
        self.collectionCloseTime(undefined);
    }

    //#endregion

    //#region Events

    //#endregion
}

const returnOrder = ({
    record,
    parent
} = {}) => (function () {
    var self = $.extend(JSON.parse(JSON.stringify(record)), {});

    self.parent = parent;

    if (self.Collections == null)
        self.Collections = [];

    for (var i = 0; i < self.Collections.length; i++) {
        self.Collections[i].cancelled = ko.observable(record.Collections[i].Cancelled);
    }

    self.collections = ko.observableArray(record.Collections);

    self.voided = ko.observable(record.Voided);

    self.trackingReply = ko.observable();

    self.returnParcels = ko.observableArray([]);

    self.refreshTracking = function () {
        self.parent.busy(true);
        self.parent.busyMessage('Fetching Tracking Info...');
        $.ajax({
            url: '/api/orderreturns/RefreshReturnTracking',
            type: 'POST',
            dataType: 'json',
            data: {
                returnId: self.ReturnID
            },
            success: function (data) {
                self.trackingReply(data.TrackingReply);
                self.returnParcels(ko.utils.arrayMap(self.ReturnParcels, function (rp) {
                    return returnParcel({ record: rp, parent: self });
                }));
                self.parent.busy(false);
            },
            error: function (xhr, s, a) {
                self.parent.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.refreshTracking();

    return self;
})();

const returnLine = ({
    line
} = {}) => (function () {
    var self = $.extend(JSON.parse(JSON.stringify(line)), {});

    self.quantity = ko.observable(self.AcceptedQuantity);

    //delete self.Quantity;

    //self.initialQuantity = ko.observable(line.Quantity);

    self.quantityParcelled = ko.observable(0).extend({
        numberFormatted: {
            digits: 0,
            currency: {
                FormattingCulture: 'en-GB'
            }
        },
        min: {
            params: 0,
            message: 'Minimum 0'
        },
        max: {
            params: self.AcceptedQuantity,
            message: 'Maximum Exceeded'
        }
    });

    //self.quantityRemaining = ko.pureComputed(function () {
    //    return self.initialQuantity() - self.quantityParcelled();
    //}, self);

    //self.siblings = ko.observableArray([]); // why do I need to know of my siblings?
    // Might need to gather other important properties of a returnParcel

    return self;
})();

const returnParcel = ({
    record = {},
    parent = {}
} = {}) => (function () {
    var self = $.extend(record, {});

    self.parent = parent;

    self.removeLine = function (line) {
        var sibling = Enumerable.From(self.parent.ccrDetails().products()).Where(function (p) {
            return p.ToelineID == line.ToelineID
        }).SingleOrDefault();
        if (sibling != null) {
            //sibling.initialQuantity(sibling.initialQuantity() + line.quantityParcelled());
            sibling.quantity(sibling.quantity() + line.quantityParcelled());
            self.products.remove(line);
            delete line;
        } else {
            self.products.remove(line);
            self.parent.ccrDetails().products.unshift(line);
        }
    }

    self.products = ko.observableArray([]);

    self.products.subscribe(function (changes) {
        console.log(changes);
        ko.utils.arrayForEach(changes, function (c) {
            switch (c.status) {
                case 'added':
                    if (Enumerable.From(self.products()).Where(function (x) {
                        return x.ToelineID == c.value.ToelineID
                    }).Count() > 1) {
                        // modify the first one, remove this one
                        var toModify = Enumerable.From(self.products()).Where(function (x) {
                            return x.ToelineID == c.value.ToelineID && x != c.value
                        }).Single();
                        toModify.quantityParcelled(+toModify.quantityParcelled() + +c.value.quantity());
                        toModify.quantity(+toModify.quantityParcelled());
                        window.setTimeout(function () {
                            self.products.remove(c.value);
                        }, 10);
                    } else {
                        if (c.value.quantity() > 1) {
                            c.value.quantityParcelled(+c.value.quantity());
                            self.parent.returnLineConsideringQuantity(c.value);
                        } else {
                            c.value.quantityParcelled(+c.value.quantity());
                        }
                    }
                    break;
                case 'deleted':
                    c.value.quantityParcelled(0);
                    break;
            }
        });



    }, self, 'arrayChange');

    self.trackingUpdates = ko.observableArray();

    if (self.parent.hasOwnProperty('trackingReply')) {
        var tr = self.parent.trackingReply();

        if (tr.Response != null) {
            if (tr.Response.shipmentField != null) {
                // desired:
                var thisParcel = Enumerable.From(tr.Response.shipmentField[0].packageField).Where(function (p) {
                    return p.trackingNumberField == self.TrackingNumber
                }).SingleOrDefault();

                // testing:
                //var thisParcel = Enumerable.From(tr.Response.shipmentField[0].packageField).Where(function (p) {
                //    return true;
                //}).FirstOrDefault();

                if (thisParcel) {
                    self.trackingUpdates(thisParcel.activityField);
                }
            }
        }
    }

    self.haulier = ko.observable();

    return self;
})();