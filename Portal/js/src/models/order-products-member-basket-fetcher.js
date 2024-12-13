const memberBasketFetcher = (parent = {}) => {
    let self = {
        parent
    };

    //#region Properties

    self.busy = ko.observable(false);

    self.basketCount = ko.observable();

    self.importBasketCount = ko.observable();

    self.submittedBasketCount = ko.observable();

    self.focDeliveryBasketCount = ko.observable();

    self.customerHeldBasketsCount = ko.observable();

    self.jsonViewer = ko.observable();

    self.displayPrefilteredString = ko.observable(false);

    self.prefilteredDisplayProperty = ko.observable();

    // this sodding thing is no longer displaying because the column is no longer filterable ARGH
    self.customHeldReasonFilterActive = ko.observable(false);

    self.initialFilters = null;

    self.resultGridWidget = ko.observable();

    self.importResultGridWidget = ko.observable();

    self.submittedGridWidget = ko.observable();

    self.focDeliveryGridWidget = ko.observable();

    self.customerHeldBasketsGridWidget = ko.observable();

    self.customResultStatusFilterActive = ko.observable();

    self.customImportStatusFilterActive = ko.observable(false);

    self.customImportSourceFilterActive = ko.observable(false);

    self.heldOrdersMarketId = ko.observable(window.getMarketToLoad());

    self.heldOrdersMarket = ko.observable();

    self.heldOrdersHoldReasons = ko.observableArray([]);

    self.heldOrdersHoldReasonIds = ko.observableArray([]);
    self.heldOrdersHoldReasonIdsJson = ko.observable(self.heldOrdersHoldReasonIds().length ? JSON.stringify(self.heldOrdersHoldReasonIds()) : null);

    self.heldOrdersSearchTerm = ko.observable();

    self.heldOrdersGridWidget = ko.observable();

    self.holdReasons = ko.observableArray([]);

    self.holdReasonSummaryPods = ko.observableArray([]);

    self.basketSubmissionResults = self.parent.orderFactory.basketSubmissionResults;

    self.submissionResultText = self.parent.orderFactory.submissionResultText;

    self.justMyOrders = ko.observable(typeof getMemberId === 'function' ? true : false);

    self.submittedOrderHeadId = ko.observable();

    self.submittedOrderTradeAccountId = ko.observable();

    self.memberId = ko.observable(typeof getMemberId === 'function' ? getMemberId() : null);

    self.heldReasonListSelection = ko.observableArray([]);
    self.heldReasonListSelectionJson = ko.observable(self.heldReasonListSelection().length ? JSON.stringify(self.heldReasonListSelection()) : null);

    self.heldOrdersHoldReasonWidget = ko.observable();

    self.myHeldOrdersCount = ko.observable();

    self.myHeldOrdersGridWidget = ko.observable();

    self.customMyHeldReasonFilterActive = ko.observable(false);

    self.ordersToApproveFiltersLoadCompletion = {
        holdReasonIds: false,
        searchTerm: false,
        pods: false
    };

    self.activeHeldOrderReasonGroupId = ko.observable(window.getHeldOrderReasonGroupIdToLoad());

    // if we've selected a pod via query string parameter, we want to clear the active hold reason on next change of heldReasonListSelection
    self.clearActiveHoldReasonOnNextSubscriptionFire = window.getHeldOrderReasonGroupIdToLoad() == null; 

    // if we've clicked a held order group pod, that click is going to fire the grid filter with the heldOrderReasonString ~3~ thing.
    // it will also mutate the heldOrdersHoldReasonIds array, which could cause a secondary firing of the grid, which is undesirable.
    // this toggle mitigates that consequence.
    self.skipNextHeldOrderGridRead = false;

    //#endregion


    //#region Templates

    self.popoverTemplate = function () {
        return `<div class="popover basket-details-popover" role="tooltip">
            <div class="arrow"></div>
            <h4 class="popover-title"></h4>
            <div class="popover-wrapper">
                <div class="popover-content"></div>
            </div>
        </div>`
    }

    self.botErrorPopoverTemplate = function () {
        return `<div class="popover basket-details-popover bot-errors" role="tooltip">
            <div class="arrow"></div>
            <h4 class="popover-title"></h4>
            <div class="popover-wrapper">
                <div class="popover-content"></div>
            </div>
        </div>`
    }

    self.submittedGridColumns = [{
        field: 'BasketID',
        title: 'Basket ID',
        width: 90
    }, {
        field: 'OrderDetails',
        title: 'Order(s)',
        width: 320
    }, {
        field: 'TradeAccountCode',
        title: 'Trade Account',
        width: 300
    }, {
        field: 'OrderReference',
        title: 'Order Reference'
    }, {
        field: 'MemberName',
        title: 'Order Taker',
        width: 240
    }, {
        field: 'CreatedDT',
        title: 'Submitted',
        width: 180
    }];

    self.heldOrdersGridColumns = [{
        field: 'Reference',
        title: 'Reference',
        width: 240,
        filterable: false
    }, {
        field: 'Market',
        title: 'Market',
        width: 95,
        filterable: false,
        hidden: true
    }, {
        field: 'Label',
        title: 'Trade Account',
        filterable: false
    }, {
        field: 'CustomerReference',
        title: 'Order Reference',
        width: 130,
        filterable: false
    }, {
        field: 'Value',
        title: 'Value',
        width: 100,
        filterable: false
    }, {
        field: 'HasAllocations',
        title: ' ',
        filterable: false,
        width: 45,
        attributes: {
            class: 'text-center'
        }
    }, {
        field: 'HeldSince',
        title: 'Held Since',
        width: 180
    }, {
        field: 'HeldReasons',
        title: 'Held Reasons',
        width: 200,
        filterable: false
    },{
        field: 'Controls',
        title: 'Controls',
        width: 180,
        filterable: false
    }];

    self.basketSubmissionResultGridColumns = [{
        field: 'Reference',
        title: 'Reference',
        width: 160
    }, {
        field: 'Market',
        title: 'Market',
        width: 95
    }, {
        field: 'Label',
        title: 'Trade Account',
    }, {
        field: 'CustomerReference',
        title: 'Order Reference',
        width: 130
    }, {
        field: 'Value',
        title: 'Value',
        width: 100
    }, {
        field: 'HasAllocations',
        title: ' ',
        width: 45,
        attributes: {
            class: 'text-center'
        }
    }, {
        field: 'HeldReasons',
        title: 'Held Reasons',
        width: 200
    }, {
        field: 'Controls',
        title: 'Controls',
        width: 180,
        filterable: false
    }];

    self.resultGridColumns = [{
        field: 'Status',
        title: 'Status',
        width: 80,
        filterable: {
            multi: true,
            dataSource: getMyHeldOrderImportStatuses()
        }
    }, {
        field: 'BasketID',
        title: 'Basket ID',
        width: 140,
        filterable: {
            multiple: false
        }
    }, {
        field: 'HeldReason',
        title: 'Held Reason',
        width: 140,
        filterable: false
    }, {
        field: 'Market',
        title: 'Market',
        width: 95,
        filterable: {
            extra: false
        }
    }, {
        field: 'CustomerCode',
        title: 'Customer Code',
        width: 100,
        filterable: {
            extra: false
        }
    }, {
        field: 'Customer',
        title: 'Customer',
        width: 200,
        filterable: {
            extra: false
        }
    }, {
        field: 'OrderReference',
        title: 'Order Reference',
        filterable: {
            extra: false
        }
    }, {
        field: 'BasketValue',
        title: 'Basket Value',
        filterable: false
    }, {
        field: 'HasAllocations',
        title: 'Has Allocations',
        filterable: false,
        attributes: {
            class: 'text-center'
        }
    }, {
        field: 'Modified',
        title: 'Modified',
        filterable: false
    }, {
        field: 'Expires',
        title: 'Expires',
        filterable: false
    }, {
        title: ' ',
        width: 38
    }, {
        field: 'CustomerRequestDeliveryServiceName',
        hidden: true
    }, {
        field: 'CustomerRequestHaulierCode',
        hidden: true
    }, {
        field: 'CustomerRequestServiceCode',
        hidden: true
    }, {
        field: 'CustomerRequestHaulierAccountNumberForShippingCharge',
        hidden: true
    }, {
        field: 'CustomerRequestHaulierAccountNumberForDuty',
        hidden: true
    }, {
        field: 'CustomerRequestDeliveryTerms',
        hidden: true
    }, {
        field: 'CustomerRequestDeliveryType',
        hidden: true
    }, {
        field: 'CustomerRequestsFullDespatch',
        hidden: true
    }, {
        field: 'Imported',
        hidden: true
    }, {
        field: 'DeletePermitted',
        hidden: true
    }];


    self.importResultGridColumns = [{
        field: 'Status',
        title: 'Order Type',
        filterable: {
            multi: true,
            dataSource: getOrderImportStatuses()
        }
    }, {
        field: 'OrderImportSourceID',
        title: 'Source',
        filterable: {
            multi: true,
            dataSource: getOrderImportSources()
        }
    }, {
        field: 'CreatedDT',
        title: 'Created',
        width: 140,
        filterable: {
            extra: false
        }
    }, {
        field: 'Market',
        title: 'Market',
        width: 90,
        filterable: {
            extra: false
        }
    }, {
        field: 'CustomerCode',
        title: 'Customer Code',
        width: 100,
        filterable: {
            extra: false
        }
    }, {
        field: 'Customer',
        title: 'Customer',
        width: 200,
        filterable: {
            extra: false
        }
    }, {
        field: 'OrderReference',
        title: 'Order Reference',
        filterable: {
            extra: false
        }
    }, {
        field: 'BasketValue',
        title: 'Basket Value',
        filterable: false,
        width: 90
    }, {
        field: 'HasAllocations',
        title: 'Has Allocations',
        filterable: false,
        attributes: {
            class: 'text-center'
        }
    }, {
        field: 'Modified',
        title: 'Modified',
        filterable: false
    }, {
        field: 'Expires',
        title: 'Expires',
        filterable: false
    }, {
        title: ' ',
        width: 38
    }, {
        field: 'CustomerRequestDeliveryServiceName',
        hidden: true
    }, {
        field: 'CustomerRequestHaulierCode',
        hidden: true
    }, {
        field: 'CustomerRequestServiceCode',
        hidden: true
    }, {
        field: 'CustomerRequestHaulierAccountNumberForShippingCharge',
        hidden: true
    }, {
        field: 'CustomerRequestHaulierAccountNumberForDuty',
        hidden: true
    }, {
        field: 'CustomerRequestDeliveryTerms',
        hidden: true
    }, {
        field: 'CustomerRequestDeliveryType',
        hidden: true
    }, {
        field: 'CustomerRequestsFullDespatch',
        hidden: true
    }, {
        field: 'DeletePermitted',
        hidden: true
    }, {
        field: 'BasketBOTError',
        hidden: true
    }];


    self.myHeldOrdersGridColumns = [{
        field: 'Reference',
        title: 'Reference',
        width: 160
    }, {
        field: 'Market',
        title: 'Market',
        width: 95
    }, {
        field: 'Label',
        title: 'Trade Account',
    }, {
        field: 'CustomerReference',
        title: 'Order Reference',
        width: 130
    }, {
        field: 'Value',
        title: 'Basket Value',
        width: 100
    }, {
        field: 'HasAllocations',
        title: ' ',
        filterable: false,
        width: 45,
        attributes: {
            class: 'text-center'
        }
    }, {
        field: 'HeldReasons',
        title: 'Held Reasons',
        width: 240,
        filterable: {
            multi: true,
            dataSource: getHoldReasons(),
            operators: {
                contains: "Contains"
            }
        }
    }, {
        field: 'Controls',
        title: 'Controls',
        width: 180,
        filterable: false
    }];

    //#endregion


    //#region Methods

    self.clearHoldReasonIds = () => {
        // this is attached to the checkboxes in the dropdown
        self.heldReasonListSelection([]);

        // this is the pod highlighted
        self.activeHeldOrderReasonGroupId(null);

        // this is the multiselect which is showing/hiding the checkbox dropdown for some stupid reason
        self.heldOrdersHoldReasonsParams.multiSelectSettings.value([]);
        self.heldOrdersHoldReasonsParams.multiSelectSettings.widget().value([]);
        self.heldOrdersHoldReasonsParams.multiSelectSettings.widget().trigger('change');

        // this is the grid filtering
        let filterConfig = self.heldOrdersGridWidget().dataSource.filter();

        if (filterConfig) {
            let singularFilters = filterConfig.filters.filter(f => !Object.hasOwn(f, 'filters')) ?? [];
            let multipleFilters = filterConfig.filters.find(f => Object.hasOwn(f, 'filters')) ?? {
                logic: 'or'
            };

            singularFilters = singularFilters.filter(f => f.field != 'HoldReasonIDsString');

            if (Object.hasOwn(multipleFilters, 'filters')) {
                multipleFilters.filters = multipleFilters.filters.filter(f => f.field != 'HoldReasonIDsString');
            } else {
                multipleFilters.filters = [];
            }

            filterConfig.filters = [];
            filterConfig.logic = "and";

            if (singularFilters.length) {
                singularFilters.forEach(f => filterConfig.filters.push(f));
            }

            if (multipleFilters.filters.length) {
                filterConfig.filters.push(multipleFilters);
            }
        }

        self.heldOrdersGridWidget().dataSource.filter(filterConfig);
    }

    self.buildInitialFilters = () => {

        let filters = [];

        let basketIdToLoad = window.getBasketIdToLoad();

        if (basketIdToLoad) {
            console.log(`basketIdToLoad`, basketIdToLoad);
            self.prefilteredDisplayProperty(`Basket ID: ${basketIdToLoad}`);
        }

        let transactionIdToLoad = window.getTransactionIdToLoad();

        if (transactionIdToLoad) {
            console.log(`transactionIdToLoad`, transactionIdToLoad);
            self.prefilteredDisplayProperty(`Transaction ID: ${transactionIdToLoad}`);
        }

        let orderHeadIdToLoad = window.getOrderHeadIdToLoad();

        if (orderHeadIdToLoad) {
            console.log(`orderHeadIdToLoad`, orderHeadIdToLoad);
            self.prefilteredDisplayProperty(`Order ID: ${orderHeadIdToLoad}`);
        }

        let heldOrderReasonIdToLoad = window.getHeldOrderReasonIdToLoad();

        if (heldOrderReasonIdToLoad) {
            console.log(`heldOrderReasonIdToLoad`, heldOrderReasonIdToLoad);
            self.prefilteredDisplayProperty(`Held Order Reason ID: ${heldOrderReasonIdToLoad}`);
        }

        let heldOrderReasonGroupIdToLoad = window.getHeldOrderReasonGroupIdToLoad();

        if (heldOrderReasonGroupIdToLoad) {
            console.log(`heldOrderReasonGroupIdToLoad`, heldOrderReasonGroupIdToLoad);
            self.prefilteredDisplayProperty(`Held Order Reason Group ID: ${heldOrderReasonGroupIdToLoad}`);
        }

        let tabToLoad = window.getTabToLoad();

        if (basketIdToLoad == null &&
            transactionIdToLoad == null &&
            orderHeadIdToLoad == null) {
            self.ordersToApproveFiltersLoadCompletion.searchTerm = true;
        }

        if (tabToLoad == "ordersToApprove") {

            if (basketIdToLoad) {
                filters.push({ field: 'Reference', operator: 'contains', value: basketIdToLoad.toString() });
                self.heldOrdersSearchTerm(basketIdToLoad.toString());
            }

            if (transactionIdToLoad) {
                filters.push({ field: 'Reference', operator: 'contains', value: transactionIdToLoad.toString() });
                self.heldOrdersSearchTerm(transactionIdToLoad.toString());
            }

            if (orderHeadIdToLoad) {
                filters.push({ field: 'Reference', operator: 'contains', value: orderHeadIdToLoad.toString() });
                self.heldOrdersSearchTerm(orderHeadIdToLoad.toString());
            }

            self.ordersToApproveFiltersLoadCompletion.searchTerm = true;



            if (heldOrderReasonIdToLoad) {

                self.heldOrderReasonIdToLoad = heldOrderReasonIdToLoad;

                filters.push({ field: 'HoldReasonIDsString', operator: 'contains', value: `~${heldOrderReasonIdToLoad}~` });

                self.heldReasonListSelection([heldOrderReasonIdToLoad]);

                self.customHeldReasonFilterActive(true);
            }

            if (heldOrderReasonGroupIdToLoad) {

                filters.push({ field: 'HoldReasonGroupIDsString', operator: 'contains', value: `~${self.activeHeldOrderReasonGroupId()}~` });

                self.customHeldReasonFilterActive(true);


            }
        }
        else {
            if (basketIdToLoad) {
                filters.push({ field: 'BasketID', operator: 'eq', value: basketIdToLoad.toString() });
            }
        }

        if (self.customHeldReasonFilterActive() == false) {
            self.ordersToApproveFiltersLoadCompletion.holdReasonIds = true;
        }

        if (filters.length) {
            self.displayPrefilteredString(true);
        }

        history.pushState({}, null, window.location.href.split('?')[0]);

        return filters;
    }

    self.fetch = function () {
        self.busy(true);
        $.ajax({
            url: '/api/componentapi/FetchMemberBaskets',
            type: 'GET',
            dataType: 'json',
            data: {},
            success: function (data) {

                // Necessary because this loads out a full TradeAccount entity associated to the Basket;
                // Whereas generally we are going to be dealing with the results of the TradeAccount Autocomplete
                //for (var i in data) {
                //    data[i].TradeAccount.PaymentTerms = data[i].TradeAccount.PaymentTerms.Name;
                //    data[i].TradeAccount.TradePriceList = data[i].TradeAccount.TradePriceList.Name;
                //}

                self.baskets(data);
                self.busy(false);
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.fetchTransactionView = function (transaction) {
        self.busy(true);
        $.ajax({
            url: '/api/orderproducts/FetchTransactionView',
            type: 'POST',
            dataType: 'json',
            data: {
                transactionId: transaction.TransactionID
            },
            success: function (data) {
                self.jsonViewer(JSON.stringify(data.json, null, '\t'));
                //self.jsonViewer(data.JSON);
                self.busy(false);
                window.setTimeout(function () {
                    PR.prettyPrint();
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $("#json-viewer").offset().top - 60
                    }, 500);
                }, 0);
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.fetchBasketView = function (basket) {
        self.busy(true);
        $.ajax({
            url: '/api/orderproducts/FetchBasketView',
            type: 'POST',
            dataType: 'json',
            data: {
                basketId: basket.BasketID
            },
            success: function (data) {
                self.jsonViewer(JSON.stringify(data.json, null, '\t'));
                //self.jsonViewer(data.JSON);
                self.busy(false);
                window.setTimeout(function () {
                    PR.prettyPrint();
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $("#json-viewer").offset().top - 60
                    }, 500);
                }, 0);
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.statusFilter = function (element) {

        var container = $(element).parent().empty();

        var sampleButton = $('<button class="basket-status-filter-btn">Sample Orders</button>');

        sampleButton.kendoButton({
            text: 'Sample Orders',
            click: function (e) {
                self.resultGridWidget().dataSource.filter(
                    { field: 'Status', operator: 'contains', value: 'Sample Order' }
                );
            }
        });

        sampleButton.appendTo(container);

        var allButton = $('<button class="basket-status-filter-btn">All Orders</button>');

        allButton.kendoButton({
            text: 'Sample Orders',
            click: function (e) {
                self.resultGridWidget().dataSource.filter({});
            }
        });

        allButton.appendTo(container);
    }

    self.closeSubmissionModal = function () {
        self.parent.tradeAccountSelector.clearSearch();
        $("#order-products-modal").modal('hide');

        self.requeryAllGrids();

        $('#submitted-basket-modal').modal('hide');
    }

    self.requeryAllGrids = function () {

        if (self.resultGridWidget()) {
            self.resultGridWidget().dataSource.query({
                page: 1,
                pageSize: self.resultGridWidget().dataSource.pageSize()
            });
        }

        if (self.importResultGridWidget()) {
            self.importResultGridWidget().dataSource.query({
                page: 1,
                pageSize: self.importResultGridWidget().dataSource.pageSize()
            });
        }

        if (self.submittedGridWidget()) {
            self.submittedGridWidget().dataSource.query({
                page: 1,
                pageSize: self.submittedGridWidget().dataSource.pageSize()
            });
        }

        if (self.heldOrdersGridWidget()) {
            self.heldOrdersGridWidget().dataSource.query({
                page: 1,
                pageSize: self.heldOrdersGridWidget().dataSource.pageSize()
            });
        }

        if (self.myHeldOrdersGridWidget()) {
            self.myHeldOrdersGridWidget().dataSource.query({
                page: 1,
                pageSize: self.myHeldOrdersGridWidget().dataSource.pageSize()
            });
        }

        if (self.focDeliveryGridWidget()) {
            self.focDeliveryGridWidget().dataSource.query({
                page: 1,
                pageSize: self.focDeliveryGridWidget().dataSource.pageSize()
            });
        }

        if (self.customerHeldBasketsGridWidget()) {
            self.customerHeldBasketsGridWidget().dataSource.query({
                page: 1,
                pageSize: self.customerHeldBasketsGridWidget().dataSource.pageSize()
            });
        }
    }

    self.cancelRetailPaymentModal = function () {
        $("#retail-payment-modal").modal('hide');
        if (self.basketLocker) {
            self.basketLocker.unlockBasket();
        }
        self.parent.orderFactory.reset();
    }

    self.resultGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {
            memberId: self.memberId(),
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/componentapi/FetchMemberBaskets',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.basketCount(data.Total);
                ko.utils.arrayForEach(data.Data, function (d) {
                    d.bootstrapPopoverDetails = {
                        title: 'Status',
                        label: d.Status,
                        content: d.BasketItemCustomerLineMemoDisplay,
                        placement: 'right',
                        template: self.popoverTemplate()
                    }
                });
                options.success(data);
            },
            error: function (xhr, s, a) {
                options.error();
                $.showError(xhr, s, a);
            }
        });
    };

    self.importResultGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var mapped = webapi.parameterMap(options.data);
        var data = {
            memberId: self.memberId()
        };
        for (var propertyName in mapped) {
            data[propertyName] = mapped[propertyName];
        }

        $.ajax({
            url: '/api/componentapi/FetchImportedBaskets',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.importBasketCount(data.Total);
                ko.utils.arrayForEach(data.Data, function (d) {
                    d.bootstrapPopoverDetails = {
                        title: 'Status',
                        label: d.Status,
                        content: d.BasketItemCustomerLineMemoDisplay,
                        placement: 'right',
                        template: self.popoverTemplate()
                    };
                    if (d.BasketBOTError != null) {
                        d.botErrorPopoverDetails = {
                            title: 'BOT Error',
                            label: d.BasketBOTError,
                            content: '<pre>' + PR.prettyPrintOne(JSON.stringify($.extend({ error: d.BasketBOTError }, d.basketBotErrorDetails), null, 4)) + '</pre>',
                            placement: 'left',
                            template: self.botErrorPopoverTemplate()
                        }
                    }
                });
                options.success(data);
            },
            error: function (xhr, s, a) {
                options.error();
                $.showError(xhr, s, a);
            }
        });
    }

    self.submittedOrderSearch = function () {
        self.submittedGridWidget().dataSource.query({
            page: 1,
            pageSize: self.submittedGridWidget().dataSource.pageSize()
        });
    }

    self.submittedGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {};

        if (self.justMyOrders()) {
            data.memberId = self.memberId();
        }

        if (self.submittedOrderTradeAccountId.peek()) {
            data.tradeAccountId = self.submittedOrderTradeAccountId.peek();
        }

        if (self.submittedOrderHeadId.peek()) {
            data.searchTerm = self.submittedOrderHeadId.peek()
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        //let qs = new URLSearchParams(data);

        $.ajax({
            url: `/api/orderproducts/TransactionSearch`,
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.submittedBasketCount(data.Total);
                ko.utils.arrayForEach(data.Data, function (d) {
                    ko.utils.arrayForEach(d.orderDetails, function (od) {
                        var dataCarry = JSON.parse(JSON.stringify(od)); // poor man's clone!
                        od.bootstrapPopoverDetails = {
                            title: 'Order Details',
                            label: od.label,
                            orderLinesGrid: {
                                data: od.orderLines,
                                useKOTemplates: true,
                                rowTemplate: 'order-line-row-template',
                                selectable: false,
                                scrollable: false,
                                columns: [{
                                    field: 'code',
                                    title: 'Product Code',
                                    width: 140
                                }, {
                                    field: 'quantity',
                                    title: 'Quantity',
                                    width: 140
                                }, {
                                    field: 'priceEx',
                                    title: 'Price Ex. VAT',
                                    width: 140
                                }, {
                                    field: 'priceInc',
                                    title: 'Price Inc. VAT',
                                    width: 140
                                }, {
                                    field: 'status',
                                    title: 'Status',
                                    width: 140
                                }]
                            },
                            data: dataCarry,
                            content: function () {
                                console.log(od);
                                return `<div class="popover-details-wrapper" data-bind="with: data">
                                            <div class="grid-container">
                                                <div>
                                                    <h4 data-bind="text: 'Order: ' + orderHeadId"></h4>
                                                    <p data-bind="html: orderDescription"></p>
                                                    <h5>
                                                        Order Total Inc. VAT: <span data-bind="text: formatCurrency(orderTotalIncVAT, 2, formattingCulture, currencyCode)"></span>
                                                    </h5>
                                                </div>
                                                <div>
                                                    <h4>Delivery Address</h5>
                                                    <div data-bind="template: { name: 'popover-address-template', data: delivery }"></div>
                                                </div>
                                                <div>
                                                    <h4>Documents</h4>
                                                    <!-- ko if: documents == null -->
                                                        N/A
                                                    <!-- /ko -->
                                                    <!-- ko if: documents != null -->
                                                        <!-- ko foreach: documents -->
                                                        <button class="btn btn-green" data-bind="click: function () { $parentContext.$parentContext.$parentContext.$parentContext.$parent.fetchDocument($data, $parent); }">
                                                            <span data-bind="text: label"></span>
                                                        </button>
                                                        <!-- /ko -->
                                                    <!-- /ko -->
                                                </div>
                                            </div>
                                            <div data-bind="kendoGrid: $parent.orderLinesGrid"></div>
                                        </div>
                                        <div class="basket-line-memo-footer" data-bind="text: label"></div>`
                            },
                            placement: 'right',
                            template: self.popoverTemplate()
                        }
                    });
                    d.bootstrapPopoverDetails = {
                        title: 'Status',
                        label: d.Status,
                        content: d.BasketItemCustomerLineMemoDisplay,
                        placement: 'right',
                        template: self.popoverTemplate()
                    }
                });
                options.success(data);
            },
            error: function (xhr, s, a) {
                options.error();
                $.showError(xhr, s, a);
            }
        });
    }

    self.clearResultGridFilters = function () {
        self.resultGridWidget().dataSource.filter({});
    }

    self.focDeliveryGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {
            memberId: self.memberId(),
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/componentapi/FetchFoCDeliveryBaskets',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.focDeliveryBasketCount(data.Total);
                ko.utils.arrayForEach(data.Data, function (d) {
                    d.bootstrapPopoverDetails = {
                        title: 'Status',
                        label: d.Status,
                        content: d.BasketItemCustomerLineMemoDisplay,
                        placement: 'right',
                        template: self.popoverTemplate()
                    }
                });
                options.success(data);
            },
            error: function (xhr, s, a) {
                options.error();
                $.showError(xhr, s, a);
            }
        });
    };

    self.generateHeldReasonList = () => {

        //let listContainerElement = document.createElement("div");// "<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck);

        //listContainerElement.setAttribute("id", "held-order-filter-list");

        //listContainerElement.setAttribute("unselectable", "on");
        //listContainerElement.setAttribute("tabindex", "-1");

        //listContainerElement.classList.add('custom-filter-checkbox-container');

        let holdReasons = self.holdReasons();

        let outerList = document.createElement("ul");

        outerList.classList.add("k-reset");
        outerList.classList.add("k-list");
        outerList.classList.add("list-group");
        outerList.classList.add("hold-reason-group-outer-list");


        let groupedRoles = Object.groupBy(holdReasons, (hr, idx) => {
            return hr.RoleID;
        });

        let roleGroups = [];

        Object.keys(groupedRoles).forEach(roleId => {
            let roleHoldReasons = groupedRoles[roleId];
            roleHoldReasons = roleHoldReasons.sort((a, b) => a.RoleSortOrder > b.RoleSortOrder ? 1 : -1);

            roleGroups.push({
                roleId: roleId,
                roleName: roleHoldReasons[0].RoleName,
                roleSortOrder: roleHoldReasons[0].RoleSortOrder,
                roleHoldReasons: roleHoldReasons,
                count: roleHoldReasons.reduce((a, i) => a = a + i.Count, 0)
            })
        });

        let counter = 0;

        roleGroups.forEach(roleGroup => {

            let groupedReasons = Object.groupBy(roleGroup.roleHoldReasons, (reason, idx) => {
                return `${reason.HoldReasonGroupID}`;
            });

            let holdReasonGroups = [];

            Object.keys(groupedReasons).forEach(holdReasonGroupId => {
                let holdReasons = groupedReasons[holdReasonGroupId];
                holdReasons = holdReasons.sort((a, b) => a.HoldReasonSortOrder > b.HoldReasonSortOrder ? 1 : -1);

                holdReasonGroups.push({
                    holdReasonGroupId: +holdReasonGroupId,
                    holdReasonGroupSortOrder: holdReasons[0].HoldReasonGroupSortOrder,
                    holdReasons: holdReasons
                })
            });

            holdReasonGroups = holdReasonGroups.sort((a, b) => a.holdReasonGroupSortOrder > b.holdReasonGroupSortOrder ? 1 : -1);

            roleGroup.roleHoldReasons = holdReasonGroups;
        });

        roleGroups.forEach(rg => {

            let roleId = rg.roleId;

            let roleHeadLi = document.createElement("li");

            roleHeadLi.dataset.offsetIndex = counter++;

            roleHeadLi.classList.add("k-item");
            roleHeadLi.classList.add("list-group-item");
            roleHeadLi.classList.add("role-group");

            let roleHeadLiText = document.createElement("span");

            roleHeadLiText.innerHTML = rg.roleName;

            let roleHeadLiCount = document.createElement("span");

            roleHeadLiCount.innerHTML = `(${rg.count})`;

            let roleHeadLiSelectAll = document.createElement("span");

            roleHeadLiSelectAll.classList.add("btn");
            roleHeadLiSelectAll.classList.add("bi");
            roleHeadLiSelectAll.classList.add("bi-check2-all");
            roleHeadLiSelectAll.addEventListener("click", () => {
                console.log("woo");
                self.activeHeldOrderReasonGroupId(null);

                let newSelection = [];
                document.querySelectorAll(`input[type="checkbox"][data-hold-reason-role-id="${roleId}"]`).forEach(e => {
                    newSelection.push(+e.dataset.holdReasonId);
                    e.checked = true;
                });

                self.heldReasonListSelection([...new Set(self.heldReasonListSelection().concat(newSelection))]);


                window.setTimeout(() => {
                    self.heldOrdersHoldReasonWidget().close();
                }, 0);
            });

            let roleHeadLiClear = document.createElement("span");

            roleHeadLiClear.classList.add("btn");
            roleHeadLiClear.classList.add("bi");
            roleHeadLiClear.classList.add("bi-x");
            roleHeadLiClear.addEventListener("click", () => {
                console.log("hoo");
                self.activeHeldOrderReasonGroupId(null);

                let removals = [];
                document.querySelectorAll(`input[type="checkbox"][data-hold-reason-role-id="${roleId}"]`).forEach(e => {
                    removals.push(+e.dataset.holdReasonId);
                    e.checked = false;
                });

                self.heldReasonListSelection(self.heldReasonListSelection().filter(x => {
                    if (removals.indexOf(x) == -1)
                        return x;
                }));

                self.heldOrdersHoldReasonWidget().value(self.heldReasonListSelection());
                self.heldOrdersHoldReasonWidget().trigger('change');

                window.setTimeout(() => {
                    self.heldOrdersHoldReasonWidget().close();
                }, 0);
            });

            roleHeadLi.appendChild(roleHeadLiText);

            roleHeadLi.appendChild(roleHeadLiCount);

            roleHeadLi.appendChild(roleHeadLiSelectAll);

            roleHeadLi.appendChild(roleHeadLiClear);

            outerList.appendChild(roleHeadLi);

            rg.roleHoldReasons.forEach(g => {
                let reasons = g.holdReasons;

                let holdReasonGroupId = g.holdReasonGroupId;

                let group = reasons[0].HoldReasonGroup;

                let headLi = document.createElement("li");

                headLi.classList.add("k-item");
                headLi.classList.add("list-group-item");
                headLi.classList.add("hold-reason-group");

                let headLiText = document.createElement("span");

                headLiText.classList.add("me-auto");

                headLiText.innerHTML = group.Name;

                let headLiSelectAll = document.createElement("span");

                headLiSelectAll.classList.add("btn");
                headLiSelectAll.classList.add("bi");
                headLiSelectAll.classList.add("bi-check2-all");
                headLiSelectAll.addEventListener("click", () => {
                    console.log("woowoo");
                    self.activeHeldOrderReasonGroupId(null);

                    let newSelection = [];
                    document.querySelectorAll(`input[type="checkbox"][data-hold-reason-group-id="${holdReasonGroupId}"]`).forEach(e => {
                        newSelection.push(+e.dataset.holdReasonId);
                        e.checked = true;
                    });

                    self.heldReasonListSelection([...new Set(self.heldReasonListSelection().concat(newSelection))]);

                    window.setTimeout(() => {
                        self.heldOrdersHoldReasonWidget().close();
                    }, 0);
                });

                let headLiClear = document.createElement("span");

                headLiClear.classList.add("btn");
                headLiClear.classList.add("bi");
                headLiClear.classList.add("bi-x");
                headLiClear.addEventListener("click", () => {
                    console.log("hoohoo");
                    self.activeHeldOrderReasonGroupId(null);

                    let removals = [];
                    document.querySelectorAll(`input[type="checkbox"][data-hold-reason-group-id="${holdReasonGroupId}"]`).forEach(e => {
                        removals.push(+e.dataset.holdReasonId);
                        e.checked = false;
                    });

                    self.heldReasonListSelection(self.heldReasonListSelection().filter(x => {
                        if (removals.indexOf(x) == -1)
                            return x;
                    }));

                    self.heldOrdersHoldReasonWidget().value(self.heldReasonListSelection());
                    self.heldOrdersHoldReasonWidget().trigger('change');

                    window.setTimeout(() => {
                        self.heldOrdersHoldReasonWidget().close();
                    }, 0);
                });

                headLi.appendChild(headLiText);

                headLi.appendChild(headLiSelectAll);

                headLi.appendChild(headLiClear);

                outerList.appendChild(headLi);

                reasons.forEach(r => {
                    let childLi = document.createElement("li");

                    childLi.classList.add("k-item");

                    childLi.classList.add("list-group-item");

                    childLi.classList.add("hold-reason-group-child");

                    let checkWrapper = document.createElement("div");

                    checkWrapper.classList.add("form-check")

                    let checkInput = document.createElement("input");

                    checkInput.classList.add("hold-order-checkbox");

                    checkInput.classList.add("form-check-input");

                    checkInput.type = "checkbox";

                    checkInput.value = r.HoldReasonID;

                    //if (self.selectedHoldReasonIds.indexOf(r.HoldReasonID) > -1) {
                    //    checkInput.checked = true;
                    //}

                    let checkId = `hold-reason-${r.HoldReasonID}-checkbox`;

                    checkInput.setAttribute("id", checkId);

                    checkInput.setAttribute("tabindex", -1);

                    checkInput.setAttribute("inert", "");

                    checkInput.dataset.holdReasonRoleId = roleId;

                    checkInput.dataset.holdReasonGroupId = r.HoldReasonGroupID;

                    checkInput.dataset.holdReasonId = r.HoldReasonID;

                    checkInput.setAttribute("data-bind", `checked: heldReasonListSelection, checkedValue: ${r.HoldReasonID}`);

                    let checkLabel = document.createElement("label");

                    let checkSpan = document.createElement("span");

                    checkSpan.innerHTML = r.Name;

                    checkLabel.classList.add("form-check-label");

                    checkLabel.setAttribute("for", checkId);
                    
                    checkLabel.appendChild(checkInput);

                    checkLabel.appendChild(checkSpan);

                    checkWrapper.appendChild(checkLabel);

                    childLi.appendChild(checkWrapper);

                    outerList.appendChild(childLi);
                });

            });
        });

        return outerList;
    }

    self.heldOrdersGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {
            memberId: self.memberId(),
            marketCode: self.heldOrdersMarketId() ?? "",
            searchTerm: self.heldOrdersSearchTerm() ?? "",
            holdReasonIds: self.heldOrdersHoldReasonIdsJson() ?? ""
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        console.log("memberBasketFetcher FetchHeldOrdersManagement calling with", data);

        $.ajax({
            url: '/api/componentapi/FetchHeldOrdersManagement',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log("memberBasketFetcher FetchHeldOrdersManagement returned", data);

                ko.utils.arrayForEach(data.kendoResult.Data, function (d) {
                    d.bootstrapPopoverDetails = {
                        title: 'Status',
                        label: d.Status,
                        content: d.BasketItemCustomerLineMemoDisplay,
                        placement: 'right',
                        template: self.popoverTemplate()
                    }
                });

                self.holdReasons(data.holdReasons);

                self.holdReasonSummaryPods([]);

                if (data.holdReasonSummaryPods.length) {

                    let holdReasonPods = data.holdReasonSummaryPods;

                    holdReasonPods = holdReasonPods.sort((a, b) => {
                        if (a.RoleSortOrder > b.RoleSortOrder) {
                            return 1;
                        } else if (a.RoleSortOrder < b.RoleSortOrder) {
                            return -1;
                        }

                        if (a.HoldReasonGroupSortOrder > b.HoldReasonGroupSortOrder)
                            return 1;
                        else if (a.HoldReasonGroupSortOrder < b.HoldReasonGroupSortOrder) {
                            return -1;
                        }

                        return 0;
                    }).map(p => holdReasonSummaryPod({
                        active: self.activeHeldOrderReasonGroupId() == p.HoldReasonGroupID,
                        rec: p,
                        parent: self
                    }));

                    self.holdReasonSummaryPods(holdReasonPods);

                    self.ordersToApproveFiltersLoadCompletion.pods = true;
                }

                if (self.activeHeldOrderReasonGroupId()) {

                    console.log("woo");

                    let newSelection = [];

                    self.holdReasons().forEach(e => {
                        if (e.HoldReasonGroupID == self.activeHeldOrderReasonGroupId())
                            newSelection.push(e.HoldReasonID);
                    });

                    window.setTimeout(() => {
                        self.heldOrdersHoldReasonWidget().value(newSelection);
                        self.heldOrdersHoldReasonWidget().trigger('change');
                    }, 10);

                    self.heldReasonListSelection(newSelection);

                    self.ordersToApproveFiltersLoadCompletion.holdReasonIds = true;

                } else {
                    self.ordersToApproveFiltersLoadCompletion.holdReasonIds = true;
                }
                

                if (self.heldOrderReasonIdToLoad) {

                    console.log("woo");

                    let newSelection = [self.heldOrderReasonIdToLoad];

                    window.setTimeout(() => {
                        self.heldOrdersHoldReasonWidget().value(newSelection);
                        self.heldOrdersHoldReasonWidget().trigger('change');
                    }, 10);

                    self.ordersToApproveFiltersLoadCompletion.holdReasonIds = true;

                    self.heldOrderReasonIdToLoad = null;

                } else {
                    self.heldOrderReasonIdToLoad = null;

                    self.ordersToApproveFiltersLoadCompletion.holdReasonIds = true;
                }



                options.success(data.kendoResult);
            },
            error: function (xhr, s, a) {
                options.error();
                $.showError(xhr, s, a);
            }
        });
    }

    self.fetchDocument = function (document, parent) {
        let objJsonStr = JSON.stringify({
            documentType: document.documentType,
            basketId: parent.BasketID,
            transactionId: parent.TransactionID,
            orderHeadId: document.orderHeadId,
            languageId: parent.LanguageID || parent.languageId
        });
        let objJsonB64 = btoa(objJsonStr);

        window.open('/documents/view?' + new URLSearchParams({
            d: objJsonB64
        }).toString(), '_blank');
    }

    self.uniqueForField = function (data, field) {
        var map = {};
        var result = [];
        var item;
        for (var i = 0; i < data.length; i++) {
            item = data[i];
            if (!map[item[field]]) {
                result.push(item.toJSON());
                map[item[field]] = true;
            }
        }
        return result;
    }

    self.removeFiltersForField = function (expression, field) {
        if (expression.filters) {
            expression.filters = $.grep(expression.filters, function (filter) {
                self.removeFiltersForField(filter, field);
                if (filter.filters) {
                    return filter.filters.length;
                } else {
                    return filter.field != field;
                }
            });
        }
    }

    self.editBasket = function (heldOrder) {

        self.busy(true);

        heldOrder.CanEditBasket = heldOrder.AllowBasketEdit;

        self.basketStatus.editBasket(heldOrder, () => {
            self.busy(false);
        })

    }

    self.provideRetailPaymentDetails = function (heldOrder) {
        self.busy(true);
        self.parent.orderFactory.loadBasketForRetailPayment(heldOrder, function () {
            self.busy(false);
        });
    }

    self.releaseBasket = function (heldOrder) {
        $.confirm('Are you sure?', 'This will release Basket ' + heldOrder.BasketID, function () {
            self.busy(true);
            $.ajax({
                url: '/api/componentapi/ReleaseBasket',
                type: 'POST',
                dataType: 'json',
                data: {
                    basketId: heldOrder.BasketID
                },
                success: function (data) {
                    self.busy(false);
                    self.heldOrdersGridWidget().dataSource.read();
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError(xhr, s, a);
                }
            });
        }, null);
    }

    self.editTransaction = function (heldOrder) {
        $.confirm('Are you sure?', 'This will remove Transaction records for ' + heldOrder.TransactionID + ' and enable Basket Editing.', function () {
            self.busy(true);
            $.ajax({
                url: '/api/componentapi/EditTransaction',
                type: 'POST',
                dataType: 'json',
                data: {
                    transactionId: heldOrder.TransactionID
                },
                success: function (data) {
                    self.busy(false);
                    $.info('Result', data);
                    self.heldOrdersGridWidget().dataSource.read();
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError(xhr, s, a);
                }
            });
        }, null);
    }

    self.releaseTransaction = function (heldOrder) {
        $.confirm('Are you sure?', 'This will release Transaction ' + heldOrder.TransactionID, function () {
            self.busy(true);
            $.ajax({
                url: '/api/componentapi/ReleaseTransaction',
                type: 'POST',
                dataType: 'json',
                data: {
                    transactionId: heldOrder.TransactionID
                },
                success: function (data) {
                    self.busy(false);
                    if (self.heldOrdersGridWidget()) {
                        self.heldOrdersGridWidget().dataSource.query({
                            page: 1,
                            pageSize: self.heldOrdersGridWidget().dataSource.pageSize()
                        });
                    }
                    if (self.myHeldOrdersGridWidget()) {
                        self.myHeldOrdersGridWidget().dataSource.query({
                            page: 1,
                            pageSize: self.myHeldOrdersGridWidget().dataSource.pageSize()
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

    self.deleteTransaction = function (heldOrder) {
        $.confirm('Are you sure?', 'This will <span class="text-danger bold">DELETE</span> Transaction ' + heldOrder.TransactionID, function () {
            self.busy(true);
            $.ajax({
                url: '/api/orderproducts/DeleteTransaction',
                type: 'POST',
                dataType: 'json',
                data: {
                    transactionId: heldOrder.TransactionID
                },
                success: function (data) {
                    self.busy(false);
                    self.closeSubmissionModal();
                    if (self.heldOrdersGridWidget()) {
                        self.heldOrdersGridWidget().dataSource.query({
                            page: 1,
                            pageSize: self.heldOrdersGridWidget().dataSource.pageSize()
                        });
                    }
                    if (self.myHeldOrdersGridWidget()) {
                        self.myHeldOrdersGridWidget().dataSource.query({
                            page: 1,
                            pageSize: self.myHeldOrdersGridWidget().dataSource.pageSize()
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

    self.myHeldOrdersGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {
            memberId: self.memberId(),
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/componentapi/FetchHeldOrdersOperator',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.myHeldOrdersCount(data.Total);
                ko.utils.arrayForEach(data.Data, function (d) {
                    d.bootstrapPopoverDetails = {
                        title: 'Status',
                        label: d.Status,
                        content: d.BasketItemCustomerLineMemoDisplay,
                        placement: 'right',
                        template: self.popoverTemplate()
                    }
                });
                //// testing...
                //ko.utils.arrayForEach(data.Data, function (d) {
                //    ko.utils.arrayForEach(Object.keys(d), function (k) {
                //        if (k.indexOf('Allo') === 0) {
                //            d[k] = true;
                //        }
                //    })
                //});
                options.success(data);
            },
            error: function (xhr, s, a) {
                options.error();
                $.showError(xhr, s, a);
            }
        });
    }

    self.initBasketStatus = () => {
        //window.addEventListener('message', (event) => {
        //    if (event.origin != window.origin) {
        //        return;
        //    } else {
        //        switch (event.data.message) {
        //            case 'basketId event':
        //                self.busy(true);
        //                self.parent.orderFactory.loadBasket(Object.assign({
        //                    mertexVATLookupSuccessful: ko.observable(event.data.dataItem.MertexVATLookupSuccessful)
        //                }, event.data.dataItem), () => {
        //                    self.busy(false);
        //                });
        //                break;
        //            case 'requestAnimationFrame event':
        //                document.getElementById('basket-status-iframe').height = event.data.height;
        //                break;
        //            default:
        //                break;
        //        }
        //    }
        //})
    };

    self.customerHeldBasketsGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {
            memberId: self.memberId(),
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/componentapi/FetchCustomerHeldBaskets',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.focDeliveryBasketCount(data.Total);
                ko.utils.arrayForEach(data.Data, function (d) {
                    d.bootstrapPopoverDetails = {
                        title: 'Status',
                        label: d.Status,
                        content: d.BasketItemCustomerLineMemoDisplay,
                        placement: 'right',
                        template: self.popoverTemplate()
                    }
                });
                options.success(data);
            },
            error: function (xhr, s, a) {
                options.error();
                $.showError(xhr, s, a);
            }
        });
    };

    self.clearMyHeldOrdersGridFilters = function () {
        self.myHeldOrdersGridWidget().dataSource.filter({});
    }

    self.clearHeldOrdersGridFilters = function () {
        self.heldOrdersMarketParams.clearFunction();

        self.heldOrdersHoldReasonsParams.clearFunction();
        self.activeHeldOrderReasonGroupId(null);
        self.heldOrderReasonIdToLoad = null;

        self.heldOrdersSearchTermParams.clearFunction();
        self.transactionIdToLoad = null;
        self.orderHeadIdToLoad = null;
        self.basketIdToLoad = null;

        self.heldOrdersHoldReasonIds([]);
        self.customHeldReasonFilterActive(false);

        self.heldOrdersGridWidget().dataSource.filter({});
    }

    self.clearImportGridFilters = () => {
        self.importResultGridWidget().dataSource.filter({});
    }

    self.clearCustomerHeldGridFilters = () => {
        self.customerHeldBasketsGridWidget().dataSource.filter({});
    }

    self.clearSubmittedGridFilters = () => {
        self.submittedGridWidget().dataSource.filter({});
    }

    //#endregion


    //#region Components

    self.basketStatus = basketStatusViewModel({
        parent: self
    });

    self.basketSubmissionResultGrid = {
        autoBind: true,
        widget: ko.observable(),
        columns: self.basketSubmissionResultGridColumns,
        data: self.basketSubmissionResults,
        useKOTemplates: true,
        rowTemplate: 'held-order-row-template',
        sortable: false,
        filterable: false,
        reorderable: false,
        paging: false,
        selectable: false
    };

    self.justMyOrderParams = {
        checkboxId: 'just-my-orders',
        label: 'Display just my orders',
        observable: self.justMyOrders,
        useNativeValidation: false
    }

    self.submittedOrderHeadParams = {
        label: 'Search by Order Number or Order Reference',
        observable: self.submittedOrderHeadId,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.submittedOrderHeadParams.observable(undefined);
            self.submittedOrderSearch();
        },
        enterKey: function () {
            self.submittedOrderSearch();
        }
    };

    self.submittedOrderTradeAccountParams = kendoMDCDropDownList({
        optionLabelTemplate: null,
        optionLabel: null,
        label: 'Trade Account',
        odata: true,
        endPoint: '/odata/TradeAccounts',
        textField: 'Name',
        valueField: 'TradeAccountID',
        template: (r) => `${r.Code} - ${r.Name}`,
        idObservable: self.submittedOrderTradeAccountId,
        objObservable: ko.observable(),
        virtual: true,
        pageSize: 40,
        widget: ko.observable(),
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/TradeAccounts/Default.TradeAccountValueMapper(tradeAccountId=${options.value})`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            if (data.value.length == 1) {
                                self.submittedOrderTradeAccountParams.dropDownListSettings.dataItem(data.value[0]);
                            }
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        showClear: true,
        //clearFunction: function () {
        //    self.submittedOrderTradeAccountId(undefined);
        //},
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'startswith',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Code'
        },
        popupSettings: {
            appendTo: $('#order-search-trade-account')
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount

            d.$count = true;

            if (data.filter &&
                data.filter.filters.length &&
                data.filter.filters[0].value != '') {

                let filterValue = data.filter.filters[0].value;

                d.$filter = `StartsWith(ToLower(Name), '${filterValue}') OR StartsWith(ToLower(Code), '${filterValue}')`;
            }

            return d;
        }
    });

    self.resultGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.resultGridDataSourceRead
        },
        //pageSize: 0,
        sortable: true,
        filterable: true,
        grouping: false,
        serverGrouping: false,
        serverFiltering: false,
        serverPaging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'BasketID',
                fields: {
                    BasketID: { type: 'number' },
                    Status: { type: 'string' },
                    HeldReason: { type: 'string' },
                    Market: { type: 'string' },
                    CustomerCode: { type: 'string' },
                    Customer: { type: 'string' },
                    OrderReference: { type: 'string' },
                    BasketValue: { type: 'string' },
                    HasAllocations: { type: 'string' },
                    Modified: { type: 'string' },
                    Expires: { type: 'string' },
                    DeleteColumn: { type: 'string' },
                    DeletePermitted: { type: 'string' },
                    CustomerRequestDeliveryServiceName: { type: 'string' },
                    CustomerRequestHaulierCode: { type: 'string' },
                    CustomerRequestServiceCode: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForShippingCharge: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForDuty: { type: 'string' },
                    CustomerRequestDeliveryTerms: { type: 'string' },
                    CustomerRequestDeliveryType: { type: 'string' },
                    CustomerRequestsFullDespatch: { type: 'bool' },
                    Imported: { type: 'bool' },
                    MertexVATLookupSuccessful: { type: 'bool' },
                    CreatedDT: { type: 'date' },
                    TradeAccountID: { type: 'number' }
                }
            }
        }),
        sort: {
            field: 'Expires',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        }
    });

    self.submittedGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.submittedGridDataSourceRead
        },
        sortable: true,
        filterable: true,
        grouping: false,
        serverGrouping: false,
        serverFiltering: false,
        serverPaging: true,
        pageSize: 10,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'BasketID',
                fields: {
                    BasketID: { type: 'number' },
                    Status: { type: 'string' },
                    HeldReason: { type: 'string' },
                    Market: { type: 'string' },
                    CustomerCode: { type: 'string' },
                    Customer: { type: 'string' },
                    OrderReference: { type: 'string' },
                    BasketValue: { type: 'string' },
                    HasAllocations: { type: 'string' },
                    Modified: { type: 'string' },
                    Expires: { type: 'string' },
                    DeleteColumn: { type: 'string' },
                    DeletePermitted: { type: 'string' },
                    CustomerRequestDeliveryServiceName: { type: 'string' },
                    CustomerRequestHaulierCode: { type: 'string' },
                    CustomerRequestServiceCode: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForShippingCharge: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForDuty: { type: 'string' },
                    CustomerRequestDeliveryTerms: { type: 'string' },
                    CustomerRequestDeliveryType: { type: 'string' },
                    CustomerRequestsFullDespatch: { type: 'bool' },
                    OfferReceipt: { type: 'bool' },
                    Imported: { type: 'bool' }
                }
            }
        }),
        sort: {
            field: 'Expires',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        }
    });

    self.importResultGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.importResultGridDataSourceRead
        },
        sortable: true,
        filterable: true,
        grouping: false,
        serverFiltering: true,
        serverGrouping: false,
        serverPaging: true,
        pageSize: 10,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            filters: "Filters",
            model: {
                id: 'BasketID',
                fields: {
                    BasketID: { type: 'number' },
                    Status: { type: 'string' },
                    HeldReason: { type: 'string' },
                    Market: { type: 'string' },
                    CustomerCode: { type: 'string' },
                    Customer: { type: 'string' },
                    OrderReference: { type: 'string' },
                    BasketValue: { type: 'string' },
                    HasAllocations: { type: 'string' },
                    Modified: { type: 'string' },
                    Expires: { type: 'string' },
                    DeleteColumn: { type: 'string' },
                    DeletePermitted: { type: 'string' },
                    CustomerRequestDeliveryServiceName: { type: 'string' },
                    CustomerRequestHaulierCode: { type: 'string' },
                    CustomerRequestServiceCode: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForShippingCharge: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForDuty: { type: 'string' },
                    CustomerRequestDeliveryTerms: { type: 'string' },
                    CustomerRequestDeliveryType: { type: 'string' },
                    CustomerRequestsFullDespatch: { type: 'bool' },
                    Imported: { type: 'bool' },
                    OrderImportSourceID: { type: 'number' },
                    OrderImportSource: { type: 'string' },
                    CreatedDT: { type: 'date' }
                }
            }
        }),
        sort: {
            field: 'Expires',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        }
    });

    self.resultGridSettings = {
        autoBind: true,
        widget: self.resultGridWidget,
        columns: self.resultGridColumns,
        data: self.resultGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'basket-row-template',
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
        selectable: "single, row",
        change: function (e) {
            if (self.resultGridWidget().select()) {
                self.busy(true);
                var selectedItem = self.resultGridWidget().dataItem(self.resultGridWidget().select());
                if (selectedItem != null) {
                    self.parent.orderFactory.loadBasket(selectedItem, function () {
                        self.busy(false);
                    });
                } else {
                    self.busy(false);
                }
            }
        },
        dataBound: function (e) {
            if (self.customResultStatusFilterActive()) {
                window.setTimeout(function () {
                    $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
                }, 0);
            } else {
                $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            }
        },
        filterMenuInit: function (e) {

            var ds = [];
            var filterToggle = null;
            var operator = null;

            switch (e.field) {
                case 'Status':
                    ds = getMyHeldOrderImportStatuses();
                    operator = "contains";
                    filterToggle = self.customResultStatusFilterActive;
                    break;
                default: break;
            }

            if (filterToggle != null) {
                var popup = e.container.data("kendoPopup");
                var dataSource = this.dataSource;
                var field = e.field;
                var element = e.container.children(":first");

                var originalMultiCheck = e.container.children(":first");
                // helpTextElement.nextUntil(":has(.k-button)").remove();
                var element = $("<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck).kendoListView({
                    dataSource: ds,
                    template: "<label><input type='checkbox' value='#:" + field + "#'/>#:Name#</label>"
                });
                originalMultiCheck.remove();
                e.container.children('.k-filter-selected-items').remove();

                e.container.find("[type='submit']").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var filter = dataSource.filter() || { logic: "and", filters: [] };
                    var fieldFilters = $.map(element.find('input[type="checkbox"]:checked'), function (input) {
                        return {
                            field: field,
                            operator: operator,
                            value: input.value
                        };
                    });
                    if (fieldFilters.length) {
                        self.removeFiltersForField(filter, field);
                        filter.filters.push({
                            logic: "or",
                            filters: fieldFilters
                        });
                        dataSource.filter(filter);
                        filterToggle(true);
                    }
                    popup.close();
                });

                e.container.find("[type='reset']").click(function (e) {
                    filterToggle(false);
                });
            }
        },
        filterMenuOpen: (e) => {
            if (self.customResultStatusFilterActive()) {
                window.setTimeout(function () {
                    $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
                }, 0);
            } else {
                $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            }
        }
    };

    self.focDeliveryGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.focDeliveryGridDataSourceRead
        },
        //pageSize: 0,
        sortable: true,
        filterable: true,
        grouping: false,
        serverGrouping: false,
        serverFiltering: false,
        serverPaging: true,
        pageSize: 10,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'BasketID',
                fields: {
                    BasketID: { type: 'number' },
                    Status: { type: 'string' },
                    HeldReason: { type: 'string' },
                    Market: { type: 'string' },
                    CustomerCode: { type: 'string' },
                    Customer: { type: 'string' },
                    OrderReference: { type: 'string' },
                    BasketValue: { type: 'string' },
                    HasAllocations: { type: 'string' },
                    Modified: { type: 'string' },
                    Expires: { type: 'string' },
                    DeleteColumn: { type: 'string' },
                    DeletePermitted: { type: 'string' },
                    CustomerRequestDeliveryServiceName: { type: 'string' },
                    CustomerRequestHaulierCode: { type: 'string' },
                    CustomerRequestServiceCode: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForShippingCharge: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForDuty: { type: 'string' },
                    CustomerRequestDeliveryTerms: { type: 'string' },
                    CustomerRequestDeliveryType: { type: 'string' },
                    CustomerRequestsFullDespatch: { type: 'bool' },
                    Imported: { type: 'bool' },
                    CreatedDT: { type: 'date' }
                }
            }
        }),
        sort: {
            field: 'Expires',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        }
    });


    self.focDeliveryGridSettings = {
        autoBind: true,
        widget: self.focDeliveryGridWidget,
        columns: self.resultGridColumns,
        data: self.focDeliveryGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'basket-row-template',
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
        selectable: "single, row",
        change: function (e) {
            if (self.focDeliveryGridWidget().select()) {
                self.busy(true);
                var selectedItem = self.focDeliveryGridWidget().dataItem(self.focDeliveryGridWidget().select());
                if (selectedItem != null) {
                    self.parent.orderFactory.loadBasket(selectedItem, function () {
                        self.busy(false);
                    });
                } else {
                    self.busy(false);
                }
            }
        }
    };

    self.submittedGridSettings = {
        autoBind: true,
        widget: self.submittedGridWidget,
        columns: self.submittedGridColumns,
        data: self.submittedGridDataSource,
        useKOTemplates: true,
        scrollable: false,
        rowTemplate: 'transaction-row-template',
        //height: 685,
        sortable: true,
        filterable: true,
        reorderable: false,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: "single, row",
        //change: function (e) {
        //    if (self.submittedGridWidget().select()) {
        //        self.busy(true);
        //        var selectedItem = self.submittedGridWidget().dataItem(self.submittedGridWidget().select());
        //        if (selectedItem != null) {
        //            self.parent.orderFactory.loadBasketForReceipt(selectedItem, function () {
        //                self.busy(false);
        //            });
        //        } else {
        //            self.busy(false);
        //        }
        //    }
        //}
    };

    self.importResultGridSettings = {
        autoBind: true,
        widget: self.importResultGridWidget,
        columns: self.importResultGridColumns,
        data: self.importResultGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'imported-basket-row-template',
        scrollable: false,
        sortable: true,
        filterable: true,
        filter: function (e) {
            console.log('importResultGrid filter', e);
        },
        reorderable: false,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: "single, row",
        change: function (e) {
            if (self.importResultGridWidget().select()) {
                self.busy(true);
                var selectedItem = self.importResultGridWidget().dataItem(self.importResultGridWidget().select());
                if (selectedItem != null) {
                    self.parent.orderFactory.loadBasket(selectedItem, function () {
                        self.busy(false);
                    });
                } else {
                    self.busy(false);
                }
            }
        },
        dataBound: function (e) {
            if (self.customImportStatusFilterActive()) {
                window.setTimeout(function () {
                    $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
                }, 0);
            } else {
                $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            }
            if (self.customImportSourceFilterActive()) {
                window.setTimeout(function () {
                    $('th[data-field="OrderImportSourceID"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
                }, 0);
            } else {
                $('th[data-field="OrderImportSourceID"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            }
        },
        filterMenuInit: function (e) {

            var ds = [];
            var filterToggle = null;
            var operator = null;

            switch (e.field) {
                case 'Status':
                    ds = getOrderImportStatuses();
                    operator = "contains";
                    filterToggle = self.customImportStatusFilterActive;
                    break;
                case 'OrderImportSourceID':
                    ds = getOrderImportSources();
                    operator = "eq";
                    filterToggle = self.customImportStatusFilterActive;
                    break;
                default: break;
            }

            if (filterToggle != null) {
                var popup = e.container.data("kendoPopup");
                var dataSource = this.dataSource;
                var field = e.field;
                var element = e.container.children(":first");

                var originalMultiCheck = e.container.children(":first");
                // helpTextElement.nextUntil(":has(.k-button)").remove();
                var element = $("<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck).kendoListView({
                    dataSource: ds,
                    template: "<label><input type='checkbox' value='#:" + field + "#'/>#:Name#</label>"
                });
                originalMultiCheck.remove();
                e.container.children('.k-filter-selected-items').remove();

                e.container.find("[type='submit']").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var filter = dataSource.filter() || { logic: "and", filters: [] };
                    var fieldFilters = $.map(element.find('input[type="checkbox"]:checked'), function (input) {
                        return {
                            field: field,
                            operator: operator,
                            value: input.value
                        };
                    });
                    if (fieldFilters.length) {
                        self.removeFiltersForField(filter, field);
                        filter.filters.push({
                            logic: "or",
                            filters: fieldFilters
                        });
                        dataSource.filter(filter);
                        filterToggle(true);
                    }
                    popup.close();
                });

                e.container.find("[type='reset']").click(function (e) {
                    filterToggle(false);
                });
            }
        },
        filterMenuOpen: (e) => {
            if (self.customImportStatusFilterActive()) {
                window.setTimeout(function () {
                    $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
                }, 0);
            } else {
                $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            }
            if (self.customImportSourceFilterActive()) {
                window.setTimeout(function () {
                    $('th[data-field="OrderImportSourceID"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
                }, 0);
            } else {
                $('th[data-field="OrderImportSourceID"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            }
        }
    };

    self.heldOrdersMarketParams = kendoMDCDropDownList({
        label: 'Market',
        odata: true,
        endPoint: '/odata/SalesMarkets',
        textField: 'Label',
        valueField: 'Code',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/SalesMarkets/Default.SalesMarketValueMapperByCode(code='${options.value}')`,
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
        idObservable: self.heldOrdersMarketId,
        objObservable: self.heldOrdersMarket,
        enable: ko.observable(true),
        disable: ko.observable(false),
        showClear: true,
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Name'
        },
        clearFunction: (e) => {
            self.heldOrdersMarketId(undefined);
            self.heldOrdersMarket(undefined);
            self.heldOrdersMarketParams.dropDownListSettings.widget().value('');
            self.heldOrdersMarketParams.dropDownListSettings.widget().trigger('change');
        },
        dataBound: function (e) {
            //self.genericSelectSoleResult(e, self.salesMarketId)k
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Label")) {
                let f = data.filter.filters.find(f => f.field === "Label");
                data.filter.filters = data.filter.filters.filter(f => f.field != "Label");
                data.filter.logic = "or";
                data.filter.filters = [{
                    field: "Name",
                    ignoreCase: true,
                    operator: "contains",
                    value: f.value
                }, {
                    field: "Code",
                    ignoreCase: true,
                    operator: "startswith",
                    value: f.value
                }];
            }
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        },
    });

    self.heldOrdersHoldReasonsDataSource = new kendo.data.DataSource({
        dataValueField: 'HoldReasonID',
        dataTextField: 'Name',
        serverFiltering: false,
        serverSorting: false,
        serverGrouping: false,
        serverPaging: false,
        data: self.holdReasons,
        sort: "Name",
        pageSize: 20,
        serverPaging: false,
        serverSorting: false,
        serverFiltering: false,
        autoSync: false,
        schema: {
            errors: 'error',
            model: {
                id: 'HoldReasonID',
                fields: {
                    HoldReasonID: {
                        type: 'number',
                        editable: false
                    },
                    Name: {
                        type: 'string',
                        editable: false
                    },
                    Description: {
                        type: 'string',
                        editable: false
                    },
                    HoldReasonGroupID: {
                        type: 'number',
                        editable: false
                    },
                    RoleID: {
                        type: 'number',
                        editable: false
                    }
                }
            }
        }
    });

    self.heldOrdersHoldReasonsParams = {
        observable: self.heldOrdersHoldReasons,
        validate: self.heldOrdersHoldReasonIds,
        showClear: true,
        label: 'Hold Reason(s)',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        multiSelectSettings: {
            dataValueField: "HoldReasonID",
            dataTextField: "Name",
            value: self.heldOrdersHoldReasonIds,
            dataItems: self.heldOrdersHoldReasons,
            data: self.holdReasons,
            height: 'auto',
            widget: self.heldOrdersHoldReasonWidget,
            filterable: false,
            open: function (e) {

                e.sender.popup.element[0].querySelector('.k-list-scroller').setAttribute('id', 'held-order-filter-list');

                e.sender.popup.element[0].querySelector('.k-list-scroller ul').replaceWith(self.generateHeldReasonList());//.outerHTML;

                e.sender.popup.element[0].classList.add('held-order-reason-popup');

                let list = e.sender.popup.element[0].querySelector('.k-list-scroller ul');

                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');

                ko.cleanNode(list);

                ko.applyBindings(self, list);

            },
            close: function (e) {
                //e.preventDefault();
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            tagTemplate: (e) => {
                let count = e.values.length;

                return `${count} selected`;
            },
            valuePrimitive: true,
            autoWidth: true,
            autoBind: true,
            autoClose: false,
            optionLabel: ' ',
            filter: false,
            tagMode: 'single'
        },
        clearFunction: () => {
            self.clearHoldReasonIds();
        }
    };

    self.heldOrdersSearchTermParams = {
        label: 'Search by Order Number, Basket ID, Trade Account Code, etc.',
        observable: self.heldOrdersSearchTerm,
        showClear: true,
        clearFunction: function () {
            self.heldOrdersSearchTerm(undefined);
        },
        enterKey: function () {
            let filters = [];

            let market = self.heldOrdersMarketId();

            let holdReasonIds = self.heldOrdersHoldReasonIds().map(r => `~${r}~`);

            let searchTerm = self.heldOrdersSearchTerm();

            if (market) {
                filters.push({
                    field: 'Market',
                    operator: 'eq',
                    value: market
                });
            }

            if (holdReasonIds.length) {
                let holdReasonFilters = [];

                holdReasonIds.forEach(r => {
                    holdReasonFilters.push({
                        field: 'HoldReasonIDsString',
                        operator: 'contains',
                        value: r
                    });
                });

                filters.push({
                    logic: 'or',
                    filters: holdReasonFilters
                });
            }

            if (searchTerm) {
                filters.push({
                    logic: 'or',
                    filters: [{
                        field: 'Reference',
                        operator: 'contains',
                        value: searchTerm
                    }, {
                        field: 'CustomerCode',
                        operator: 'eq',
                        value: searchTerm
                    }, {
                        field: 'CustomerName',
                        operator: 'contains',
                        value: searchTerm
                    }, {
                        field: 'CustomerReference',
                        operator: 'contains',
                        value: searchTerm
                    }]
                });
            }

            self.heldOrdersGridWidget().dataSource.filter(filters);
        }
    };

    self.heldOrdersGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.heldOrdersGridDataSourceRead,
        },
        sortable: true,
        filterable: true,
        grouping: false,
        serverFiltering: true,
        serverGrouping: false,
        serverPaging: true,
        pageSize: 100,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'Reference',
                fields: {
                    Reference: { type: 'string' },
                    HeldReasons: { type: 'string' },
                    heldReaons: { type: 'object' },
                    Market: { type: 'string' },
                    MertexMarket: { type: 'object' },
                    CustomerCode: { type: 'string' },
                    CustomerName: { type: 'string' },
                    CustomerReference: { type: 'string' },
                    Value: { type: 'string' },
                    HasAllocations: { type: 'bool' },
                    ModifiedDT: { type: 'string' },
                    Expires: { type: 'string' },
                    AllowBasketView: { type: 'bool' },
                    AllowBasketEdit: { type: 'bool' },
                    AllowBasketRelease: { type: 'bool' },
                    AllowBasketDelete: { type: 'bool' },
                    AllowTransactionView: { type: 'bool' },
                    AllowTransactionEdit: { type: 'bool' },
                    AllowTransactionRelease: { type: 'bool' },
                    Documents: { type: 'string' },
                    documents: { type: 'object' },
                    BasketID: { type: 'number' },
                    LanguageID: { type: 'number' },
                    TransactionID: { type: 'number' },
                    Imported: { type: 'bool' },
                    HeldSince: { type: 'date' }
                }
            }
        }),
        sort: {
            field: 'Expires',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        },
        noDataTemplate: 'There are no Held Orders for your consideration.',
        filter: self.buildInitialFilters()
    });

    self.heldOrdersResultGridSettings = {
        autoBind: true,
        widget: self.heldOrdersGridWidget,
        columns: self.heldOrdersGridColumns,
        data: self.heldOrdersGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'held-order-row-template',
        sortable: true,
        filterable: true,
        reorderable: false,
        paging: true,
        pageSize: 100,
        pageable: {
            pageSize: 100,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: false,
        dataBound: function (e) {
            if (self.customHeldReasonFilterActive()) {
                window.setTimeout(function () {
                    $('th[data-field="HeldReasons"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
                }, 0);
            } else {
                $('th[data-field="HeldReasons"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            }

            if (self.activeHeldOrderReasonGroupId()) {
                let ele = document.querySelector(`.hold-reason-summary-pod[data-hold-reason-group-id="${self.activeHeldOrderReasonGroupId()}"]`);
                ele && ele.classList.add("active");
            }
        },
        filterMenuInit: function (e) {

        },
        filterMenuOpen: (e) => {
            if (self.customHeldReasonFilterActive()) {
                window.setTimeout(function () {
                    $('th[data-field="HeldReasons"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
                }, 0);
            } else {
                $('th[data-field="HeldReasons"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            }
        }
    }

    self.myHeldOrdersGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.myHeldOrdersGridDataSourceRead,
        },
        sortable: true,
        filterable: true,
        grouping: false,
        serverFiltering: true,
        serverGrouping: false,
        serverPaging: true,
        pageSize: 20,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'Reference',
                fields: {
                    Reference: { type: 'string' },
                    HeldReasons: { type: 'string' },
                    heldReaons: { type: 'object' },
                    Market: { type: 'string' },
                    MertexMarket: { type: 'object' },
                    CustomerCode: { type: 'string' },
                    CustomerName: { type: 'string' },
                    CustomerReference: { type: 'string' },
                    Value: { type: 'string' },
                    HasAllocations: { type: 'bool' },
                    ModifiedDT: { type: 'string' },
                    Expires: { type: 'string' },
                    AllowBasketView: { type: 'bool' },
                    AllowBasketEdit: { type: 'bool' },
                    AllowBasketRelease: { type: 'bool' },
                    AllowBasketDelete: { type: 'bool' },
                    AllowRetailPaymentDetails: { type: 'bool' },
                    AllowTransactionView: { type: 'bool' },
                    AllowTransactionEdit: { type: 'bool' },
                    AllowTransactionRelease: { type: 'bool' },
                    AllowTransactionDelete: { type: 'bool' },
                    Documents: { type: 'string' },
                    documents: { type: 'object' },
                    HeldSince: { type: 'date' },
                    BasketID: { type: 'number' },
                    LanguageID: { type: 'number' },
                    TransactionID: { type: 'number' },
                    Imported: { type: 'bool' }
                }
            }
        }),
        sort: {
            field: 'Expires',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        },
        noDataTemplate: 'There are no Held Orders for your consideration.'
    });

    self.myHeldOrdersResultGridSettings = {
        autoBind: true,
        widget: self.myHeldOrdersGridWidget,
        columns: self.myHeldOrdersGridColumns,
        data: self.myHeldOrdersGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'held-order-row-template',
        sortable: true,
        filterable: {
            operators: {
                string: {
                    contains: "Contains",
                    eq: "Equal to",
                    neq: "Not equal to"
                }
            }
        },
        reorderable: false,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: false,
        dataBound: function (e) {
            if (self.customMyHeldReasonFilterActive()) {
                $('th[data-field="HeldReasons"]').find('a.k-grid-filter').addClass('k-state-active');
            } else {
                $('th[data-field="HeldReasons"]').find('a.k-grid-filter').removeClass('k-state-active');
            }
        },
        filterMenuInit: function (e) {
            if (e.field === 'HeldReasons') {
                var popup = e.container.data("kendoPopup");
                var dataSource = this.dataSource;
                var field = e.field;
                var element = e.container.children(":first");

                var originalMultiCheck = e.container.children(":first");
                // helpTextElement.nextUntil(":has(.k-button)").remove();
                var element = $("<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck).kendoListView({
                    dataSource: getHoldReasons(),
                    template: "<label><input type='checkbox' value='#:" + field + "#'/>#:" + field + "#</label>"
                });
                originalMultiCheck.remove();
                e.container.children('.k-filter-selected-items').remove();

                e.container.find("[type='submit']").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var filter = dataSource.filter() || { logic: "and", filters: [] };
                    var fieldFilters = $.map(element.find('input[type="checkbox"]:checked'), function (input) {
                        return {
                            field: field,
                            operator: "contains",
                            value: input.value
                        };
                    });
                    if (fieldFilters.length) {
                        self.removeFiltersForField(filter, field);
                        filter.filters.push({
                            logic: "or",
                            filters: fieldFilters
                        });
                        dataSource.filter(filter);
                        self.customMyHeldReasonFilterActive(true);
                    }
                    popup.close();
                });

                e.container.find("[type='reset']").click(function (e) {
                    self.customMyHeldReasonFilterActive(false);
                });
            }
        },
        filterMenuOpen: (e) => {
            if (self.customMyHeldReasonFilterActive()) {
                $('th[data-field="HeldReasons"]').find('a.k-grid-filter').addClass('k-state-active');
            } else {
                $('th[data-field="HeldReasons"]').find('a.k-grid-filter').removeClass('k-state-active');
            }
        },
        noDataTemplate: 'There are no Held Orders for your consideration.'
    }

    self.customerHeldBasketsGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.customerHeldBasketsGridDataSourceRead
        },
        //pageSize: 0,
        sortable: true,
        filterable: true,
        grouping: false,
        serverGrouping: false,
        serverFiltering: false,
        serverPaging: true,
        pageSize: 10,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'BasketID',
                fields: {
                    BasketID: { type: 'number' },
                    Status: { type: 'string' },
                    HeldReason: { type: 'string' },
                    Market: { type: 'string' },
                    CustomerCode: { type: 'string' },
                    Customer: { type: 'string' },
                    OrderReference: { type: 'string' },
                    BasketValue: { type: 'string' },
                    HasAllocations: { type: 'string' },
                    Modified: { type: 'string' },
                    Expires: { type: 'string' },
                    DeleteColumn: { type: 'string' },
                    DeletePermitted: { type: 'string' },
                    CustomerRequestDeliveryServiceName: { type: 'string' },
                    CustomerRequestHaulierCode: { type: 'string' },
                    CustomerRequestServiceCode: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForShippingCharge: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForDuty: { type: 'string' },
                    CustomerRequestDeliveryTerms: { type: 'string' },
                    CustomerRequestDeliveryType: { type: 'string' },
                    CustomerRequestsFullDespatch: { type: 'bool' },
                    Imported: { type: 'bool' },
                    CreatedDT: { type: 'date' }
                }
            }
        }),
        sort: {
            field: 'Expires',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        }
    });

    self.customerHeldBasketsGridSettings = {
        autoBind: true,
        widget: self.customerHeldBasketsGridWidget,
        columns: self.resultGridColumns,
        data: self.customerHeldBasketsGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'basket-row-template',
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
        selectable: "single, row",
        change: function (e) {
            if (self.customerHeldBasketsGridWidget().select()) {
                self.busy(true);
                var selectedItem = self.customerHeldBasketsGridWidget().dataItem(self.customerHeldBasketsGridWidget().select());
                if (selectedItem != null) {
                    self.parent.orderFactory.loadBasket(selectedItem, function () {
                        self.busy(false);
                    });
                } else {
                    self.busy(false);
                }
            }
        }
    };


    //#endregion


    //#region Computeds

    self.prefilteredDisplayString = ko.computed(() => {

        let property = self.prefilteredDisplayProperty();

        if (self.displayPrefilteredString()) {

            if (property)
                return `This display is filtered to ${property}`;
            else
                return null;

        }

        return null;

    }, self);

    self.heldOrdersCount = ko.computed(() => {

        let pods = self.holdReasonSummaryPods();

        if (pods.length) {
            return pods.reduce((a, i) => a += i.Count, 0);
        }

        return null;
    }, self);

    self.priorityHeldOrdersCount = ko.computed(() => {

        let priorityPods = self.holdReasonSummaryPods().filter(p => p.Priority == true);

        if (priorityPods.length) {
            return priorityPods.reduce((a, i) => a += i.Count, 0);
        }

        return null;
    }, self);

    //#endregion


    //#region Subscriptions

    self.activeHeldOrderReasonGroupId.subscribe(nv => {
        console.log('activeHeldOrderReasonGroupId', nv);
    })

    self.submittedOrderTradeAccountId.subscribe(nv => {
        self.submittedOrderSearch();
    });

    self.memberId.subscribe(function (newValue) {
        if (newValue == null) {
            self.justMyOrders(false);
        }
        self.requeryAllGrids();
    });

    self.heldOrdersMarketId.subscribe(nv => {

        console.log('heldOrdersMarketId', nv);

        // self.heldOrdersGridWidget().dataSource.filter()
        // can be either a single object or an array
        // if you've only filtered one column, you'll see a singular object be returned
        // if you've filtered more than one column, you'll see an array of objects returned

        let filterConfig = self.heldOrdersGridWidget().dataSource.filter();

        // we want to remove any extant market filter before potentially adding this one.

        if (filterConfig) {

            //let example = {
            //    "logic": "and",
            //    "filters": [
            //        { // this is a set of "singular" filters
            //            "field": "Market",
            //            "operator": "eq",
            //            "value": "H"
            //        },
            //        { // the singular filters potentially get AND'ed together with the filters OR'ing between themselves
            //
            //            "logic": "or", // this object contains multiple filters OR'ed together
            //            "filters": [
            //                {
            //                    "field": "HeldSince",
            //                    "operator": "eq",
            //                    "value": "2024/11/21"
            //                },
            //                {
            //                    "field": "HeldSince",
            //                    "operator": "eq",
            //                    "value": "2024/11/20"
            //                }
            //            ]
            //        }
            //    ]
            //}

            let singularFilters = filterConfig.filters.filter(f => !Object.hasOwn(f, 'filters')) ?? [];
            let multipleFilters = filterConfig.filters.find(f => Object.hasOwn(f, 'filters')) ?? {
                logic: 'or'
            };

            singularFilters = singularFilters.filter(f => f.field != 'Market');

            if (Object.hasOwn(multipleFilters, 'filters')) {
                multipleFilters.filters = multipleFilters.filters.filter(f => f.field != 'Market');
            } else {
                multipleFilters.filters = [];
            }

            if (nv) {
                singularFilters.push({
                    field: 'Market',
                    operator: 'eq',
                    value: nv
                });
            }

            filterConfig.filters = [];

            if (singularFilters.length) {
                filterConfig.filters = [...singularFilters];
            }

            if (multipleFilters.filters.length) {
                filterConfig.filters.push(multipleFilters);
            }
            
            self.heldOrdersGridWidget().dataSource.filter(filterConfig);

        } else {
            if (nv) {
                self.heldOrdersGridWidget().dataSource.filter({
                    field: 'Market',
                    operator: 'eq',
                    value: nv
                });
            }
        }
    });

    self.heldOrdersHoldReasonIds.subscribe(nv => {
        if (nv.length != 0) {
            self.heldOrdersHoldReasonIdsJson(JSON.stringify(nv));
        } else {
            self.heldOrdersHoldReasonIdsJson(null);
        }
    });

    self.heldOrdersHoldReasonIdsJson.subscribe(nv => {

        nv = JSON.parse(nv);

        console.log('heldOrdersHoldReasonIds', nv);

        if (self.ordersToApproveFiltersLoadCompletion.holdReasonIds) {
            
            let filterConfig = self.heldOrdersGridWidget().dataSource.filter();

            if (self.skipNextHeldOrderGridRead) {
                self.skipNextHeldOrderGridRead = false;
            } else {
                if (filterConfig) {

                    let singularFilters = filterConfig.filters.filter(f => !Object.hasOwn(f, 'filters')) ?? [];
                    let multipleFilters = filterConfig.filters.find(f => Object.hasOwn(f, 'filters')) ?? {
                        logic: 'or'
                    };

                    singularFilters = singularFilters.filter(f => f.field != 'HoldReasonIDsString');

                    if (Object.hasOwn(multipleFilters, 'filters')) {
                        multipleFilters.filters = multipleFilters.filters.filter(f => f.field != 'HoldReasonIDsString');
                    } else {
                        multipleFilters.filters = [];
                    }

                    if (nv && nv.length) {
                        let holdReasonIds = nv.map(r => `~${r}~`);

                        holdReasonIds.forEach(r => {
                            multipleFilters.filters.push({
                                field: 'HoldReasonIDsString',
                                operator: 'contains',
                                value: r
                            });
                        });
                    }

                    filterConfig.filters = []; 

                    if (singularFilters.length) {
                        singularFilters.forEach(f => filterConfig.filters.push(f));
                    }

                    if (multipleFilters.filters.length) {
                        filterConfig.filters.push(multipleFilters);
                    }

                    self.heldOrdersGridWidget().dataSource.filter(filterConfig);

                } else {
                    if (nv && nv.length) {
                        let multipleFilters = {
                            logic: 'or',
                            filters: []
                        }

                        let holdReasonIds = nv.map(r => `~${r}~`);

                        holdReasonIds.forEach(r => {
                            multipleFilters.filters.push({
                                field: 'HoldReasonIDsString',
                                operator: 'contains',
                                value: r
                            });
                        });

                        let filterConfig = {
                            logic: 'and',
                            filters: [multipleFilters]
                        }

                        self.heldOrdersGridWidget().dataSource.filter(filterConfig);
                    }
                }
            }
        }
    });

    self.heldReasonListSelection.subscribe(nv => {
        self.heldReasonListSelectionJson(JSON.stringify(nv));
        window.setTimeout(() => {
            self.heldOrdersHoldReasonWidget().close();
        }, 0);
    });

    self.heldReasonListSelectionJson.subscribe(nv => {

        nv = JSON.parse(nv);

        console.log('heldReasonListSelection', nv);

        if (self.ordersToApproveFiltersLoadCompletion.holdReasonIds) {

            // hilariously enough clicking the pod causes the heldReasonListSelection to change...
            if (self.clearActiveHoldReasonOnNextSubscriptionFire == true) {
                self.activeHeldOrderReasonGroupId(null); // this is necessary because you might no longer be looking just a pod
            } else {
                self.clearActiveHoldReasonOnNextSubscriptionFire = true;
            }

            self.heldOrdersHoldReasonWidget().value(nv);
            self.heldOrdersHoldReasonWidget().trigger('change');
        }
    });

    //#endregion


    //#region Events

    //self.parent.ready.subscribe(nv => {
    //    if (nv) {

    //        let basketIdToLoad = window.getBasketIdToLoad();

    //        if (basketIdToLoad) {
    //            console.log(`basketIdToLoad`, basketIdToLoad);
    //        }

    //        let marketToLoad = window.getMarketToLoad();

    //        if (marketToLoad) {
    //            console.log(`marketToLoad`, marketToLoad);
    //        }

    //        let transactionIdToLoad = window.getTransactionIdToLoad();

    //        if (transactionIdToLoad) {
    //            console.log(`transactionIdToLoad`, transactionIdToLoad);
    //        }

    //        let orderHeadIdToLoad = window.getOrderHeadIdToLoad();

    //        if (orderHeadIdToLoad) {
    //            console.log(`orderHeadIdToLoad`, orderHeadIdToLoad);
    //        }

    //        let heldOrderReasonIdToLoad = window.getHeldOrderReasonIdToLoad();

    //        if (heldOrderReasonIdToLoad) {
    //            console.log(`heldOrderReasonIdToLoad`, heldOrderReasonIdToLoad);
    //        }

    //        let heldOrderReasonGroupIdToLoad = window.getHeldOrderReasonGroupIdToLoad();

    //        if (heldOrderReasonGroupIdToLoad) {
    //            console.log(`heldOrderReasonGroupIdToLoad`, heldOrderReasonGroupIdToLoad);
    //        }

    //        let tradeAccountCodeToLoad = window.getTradeAccountCodeToLoad();

    //        if (tradeAccountCodeToLoad) {
    //            console.log(`tradeAccountCodeToLoad`, tradeAccountCodeToLoad);
    //        }

    //        let tabToLoad = window.getTabToLoad();

    //        let gridWidget = null;

    //        switch (tabToLoad) {
    //            case "mySavedOrders":
    //                gridWidget = self.resultGridWidget();
    //                break;
    //            case "myHeldOrders":
    //                gridWidget = self.myHeldOrdersGridWidget();
    //                break;
    //            case "customerHeldOrders":
    //                gridWidget = self.customerHeldBasketsGridWidget();
    //                break;
    //            case "ordersToApprove":
    //                gridWidget = self.heldOrdersGridWidget();
    //                break;
    //            default: break;
    //        }

    //        if (gridWidget) {
    //            let filters = [];

    //            if (tabToLoad == "ordersToApprove") {
    //                if (basketIdToLoad) {
    //                    filters.push({ field: 'Reference', operator: 'contains', value: basketIdToLoad.toString() });
    //                }
    //                if (marketToLoad) {
    //                    filters.push({ field: 'Market', operator: 'eq', value: marketToLoad });
    //                    self.heldOrdersMarketParams.dropDownListSettings.widget().value(marketToLoad);
    //                    self.heldOrdersMarketParams.dropDownListSettings.widget().trigger('change');
    //                }
    //                if (transactionIdToLoad) {
    //                    filters.push({ field: 'Reference', operator: 'contains', value: transactionIdToLoad.toString() });
    //                }
    //                if (orderHeadIdToLoad) {
    //                    filters.push({ field: 'Reference', operator: 'contains', value: orderHeadIdToLoad.toString() });
    //                }
    //                if (tradeAccountCodeToLoad) {
    //                    filters.push({ field: 'CustomerCode', operator: 'equals', value: tradeAccountCodeToLoad.toString() });
    //                }

    //                if (transactionIdToLoad ||
    //                    orderHeadIdToLoad ||
    //                    basketIdToLoad
    //                ) {
    //                    self.heldOrdersSearchTerm(transactionIdToLoad || orderHeadIdToLoad || basketIdToLoad);
    //                    self.heldOrdersSearchTermParams.enterKey();
    //                }


    //                if (heldOrderReasonIdToLoad) {
    //                    filters.push({ field: 'HoldReasonIDsString', operator: 'contains', value: `~${heldOrderReasonIdToLoad}~` });
    //                    //self.selectedHoldReasonIds = [heldOrderReasonIdToLoad];

    //                    self.heldOrderReasonIdToLoad = heldOrderReasonIdToLoad;

    //                    self.customHeldReasonFilterActive(true);
    //                }

    //                if (heldOrderReasonGroupIdToLoad) {

    //                    // this is necessary here because the filterMenuOpen event handler needs to check the relevant checkboxes
    //                    self.heldOrderReasonGroupIdToLoad = heldOrderReasonGroupIdToLoad;

    //                    filters.push({ field: 'HoldReasonGroupIDsString', operator: 'contains', value: `~${heldOrderReasonGroupIdToLoad}~` });

    //                    self.customHeldReasonFilterActive(true);
    //                }

    //            }
    //            else {
    //                if (basketIdToLoad) {
    //                    filters.push({ field: 'BasketID', operator: 'eq', value: basketIdToLoad.toString() });
    //                }
    //            }

    //            if (filters.length) {
    //                gridWidget.dataSource.filter(filters);
    //            } else {
    //                gridWidget.dataSource.read();
    //            }
    //        }
    //    }
    //})

    //#endregion


    return self;
}

const holdReasonSummaryPod = ({ active, rec, parent } = { rec: {}, parent: {} }) => {
    let self = Object.assign({
        parent
    }, rec);

    self.active = ko.computed(() => {
        return self.HoldReasonGroupID == self.parent.activeHeldOrderReasonGroupId();
    }, self);

    self.apply = () => {

        self.parent.activeHeldOrderReasonGroupId(self.HoldReasonGroupID);

        // because this action necessarily causes a change of  self.parent.heldReasonListSelection
        // and that has a subscription above which clears the activeHeldOrderReasonGroupId
        // we need to flag whether or not to actually clear the activeHeldOrderReasonGroupId
        self.parent.clearActiveHoldReasonOnNextSubscriptionFire = false;

        self.parent.skipNextHeldOrderGridRead = true;

        let holdReasonIds = [];

        document.querySelectorAll(`input[type="checkbox"][data-hold-reason-role-id="${self.RoleID}"]`).forEach(e => {
            e.checked = true;
            holdReasonIds.push(+e.dataset.holdReasonId);
        });

        self.parent.heldOrdersGridWidget().dataSource.filter({
            field: 'HoldReasonGroupIDsString',
            operator: 'contains',
            value: `~${self.HoldReasonGroupID}~`
        });

        self.parent.customHeldReasonFilterActive(true);
    }

    return self;
};