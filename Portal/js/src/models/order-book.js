const DISPLAY_MODE_VALUE_SUM = 1,
    DISPLAY_MODE_QUANTITY_SUM = 2,
    DISPLAY_MODE_LINE_COUNT = 3,
    DISPLAY_MODE_ORDER_COUNT = 4,
    DISPLAY_MODE_PERCENTAGE_FULL = 5,
    DISPLAY_MODE_PERCENTAGE_FILTER = 6,
    DISPLAY_MODE_BUDGET = 7,
    DISPLAY_MODE_CREDIT_SUM = 8,
    DISPLAY_MODE_COMBINED = 9,
    DISPLAY_MODE_CANCELLED_LINE_COUNT = 10,
    DISPLAY_MODE_CANCELLED_TOTAL = 11,
    DISPLAY_MODE_ORDER_TOTAL = 12

const DISPLAY_MODES = [{
    label: 'Order Value £',
    value: DISPLAY_MODE_VALUE_SUM,
    children: [{
        label: '% of Full Order Book',
        value: DISPLAY_MODE_PERCENTAGE_FULL
    }, {
        label: '% of Filtered Order Book',
        value: DISPLAY_MODE_PERCENTAGE_FILTER
    }]
}, {
    label: 'Order Quantity',
    value: DISPLAY_MODE_QUANTITY_SUM,
    children: []
}, {
    label: 'No. of Lines',
    value: DISPLAY_MODE_LINE_COUNT,
    children: []
}, {
    label: 'No. of Orders',
    value: DISPLAY_MODE_ORDER_COUNT,
    children: []
}]

const DISPLAY_MODES_SALES = [{
    label: 'Sales vs Budget',
    value: DISPLAY_MODE_BUDGET,
    children: []
}, {
    label: 'Net Sales (Sales - Credits)',
    value: DISPLAY_MODE_COMBINED,
    children: []
}, {
    label: 'Sales before Credits',
    value: DISPLAY_MODE_VALUE_SUM,
    children: []
}, {
    label: 'Credits Issued',
    value: DISPLAY_MODE_CREDIT_SUM,
    children: []
}, {
    label: 'Number of Orders',
    value: DISPLAY_MODE_QUANTITY_SUM,
    children: []
}, {
    label: 'Number of Lines',
    value: DISPLAY_MODE_LINE_COUNT,
    children: []
}]

const DISPLAY_MODES_ORDERS = [{
    label: 'Value of Orders',
    value: DISPLAY_MODE_ORDER_TOTAL,
    children: []
}, {
    label: 'Number of Orders',
    value: DISPLAY_MODE_ORDER_COUNT,
    children: []
}, {
    label: 'No. of Order Lines',
    value: DISPLAY_MODE_LINE_COUNT,
    children: []
}, {
    label: 'Value of Cancelled Orders',
    value: DISPLAY_MODE_CANCELLED_TOTAL,
    children: []
}, {
    label: 'No. of Cancelled Lines',
    value: DISPLAY_MODE_CANCELLED_LINE_COUNT,
    children: []
}]

const orderBookViewModel = (() => {

    //#region Properties

    let self = {};

    self.busy = ko.observable(false);

    let emptyParams = {
        dateBasis: 'O'
    };

    self.userDefinedFilters = orderBookUserDefinedFiltersViewModel({ parent: self, params: emptyParams });

    window.udf = self.userDefinedFilters;

    self.defaultConfig = {
        totals: [DISPLAY_MODE_VALUE_SUM],
        dates: [DISPLAY_MODE_VALUE_SUM, DISPLAY_MODE_ORDER_COUNT],
        datesCollapse: false,
        pods: [DISPLAY_MODE_VALUE_SUM, DISPLAY_MODE_ORDER_COUNT],
        podsCollapse: false,
        predefinedFiltersTabsSelectedGroupId: 1,
        sales: [DISPLAY_MODE_BUDGET, DISPLAY_MODE_COMBINED],
        salesCollapse: false,
        orders: [DISPLAY_MODE_ORDER_TOTAL, DISPLAY_MODE_ORDER_COUNT],
        ordersCollapse: false,
        gridCollapse: false,
        orderGroups: [],
        columnHeadings: [],
        managementPromptTabs: []
    }
    
    let loadedConfig = localStorage.getItem("orderBookDisplayConfig");

    if (loadedConfig == null || loadedConfig == 'null') {
        self.displayConfig = self.defaultConfig;// JSON.parse(localStorage.getItem("orderBookDefaultDisplayConfig"));

        localStorage.setItem("orderBookDisplayConfig", JSON.stringify(self.displayConfig));
    } else {
        self.displayConfig = JSON.parse(loadedConfig);
    }


    self.displayModes = ko.observableArray(self.displayConfig.totals); 

    self.datesDisplayModes = ko.observableArray(self.displayConfig.dates);
    self.datesCollapse = ko.observable(self.displayConfig.datesCollapse);
    self.dateFilters = orderBookDateFiltersViewModel(self);


    self.podsDisplayModes = ko.observableArray(self.displayConfig.pods);
    self.podsCollapse = ko.observable(self.displayConfig.podsCollapse);
    self.predefinedFiltersTabsSelectedGroupId = ko.observable(self.displayConfig.predefinedFiltersTabsSelectedGroupId);
    self.preDefinedFilters = orderBookPreDefinedFiltersViewModel(self);


    self.salesDisplayModes = ko.observableArray(self.displayConfig.sales);
    self.salesCollapse = ko.observable(self.displayConfig.salesCollapse);
    self.salesFilters = orderBookSalesFiltersViewModel(self);

    self.ordersDisplayModes = ko.observableArray(self.displayConfig.orders);
    self.ordersCollapse = ko.observable(self.displayConfig.ordersCollapse);
    self.ordersFilters = orderBookOrdersFiltersViewModel(self);


    self.gridCollapse = ko.observable(self.displayConfig.gridCollapse);


    window.pdf = self.preDefinedFilters;

    self.columnHeadings = ko.observableArray([]);

    self.displayColumnHeadings = ko.observableArray([].slice.call(self.displayConfig.columnHeadings));

    self.rowHeadings = ko.observableArray([]);

    self.results = ko.observableArray([]);

    self.accurateAsOfDateTime = ko.observable();

    self.accuracyCheckInterval = null;

    self.accuracyMessage = ko.observable();

    self.inaccuracyMilliseconds = null;

    self.defaultView = ko.observable();

    self.defaultProcedure = ko.observable();

    self.detailModalElement = document.querySelector("#order-book-detail-modal");

    self.detailModalTitleElement = document.querySelector("#order-book-detail-modal-title");

    self.detailModaliFrameTargetElement = document.querySelector("#order-book-detail-iframe-target");

    self.detailModaliFrame = null;

    self.detailModal = bootstrap.Modal.getOrCreateInstance(self.detailModalElement);

    self.detailModalBusy = ko.observable(false);

    self.displayColumnHeadingsSelection = ko.observableArray([].slice.call(self.displayConfig.columnHeadings));

    self.availableDisplayModes = ko.observableArray(DISPLAY_MODES);

    self.availableDisplayModesSales = ko.observableArray(DISPLAY_MODES_SALES);

    self.availableDisplayModesOrders = ko.observableArray(DISPLAY_MODES_ORDERS);

    self.orderBookSummaryModalElement = document.querySelector("#order-book-summary-modal");

    self.orderBookSummaryModal = bootstrap.Modal.getOrCreateInstance(self.orderBookSummaryModalElement);

    self.orderBookSummaryBusy = ko.observable(true);

    self.orderBookSummaryResults = ko.observableArray([]);

    self.fetchAbortController = new AbortController();

    //#endregion


    //#region Components

    let defaultDisplayConfigColumnHeadings = [];

    self.displayColumnHeadingsParams = {
        widget: ko.observable(),
        btnMarkup: `<i class="bi bi-collection ms-auto"></i>`,
        displayClass: null,
        elementId: "column-groups-btn",
        controls: {
            selectAll: () => {
                //console.log('selectAll');
                self.displayColumnHeadingsSelection(window.getOrderLineDetailedStatusGroups().map(d => d.OrderStatusGroupID));
            },
            deselectAll: () => {
                //console.log('deselectAll');
                self.displayColumnHeadingsSelection([]);
            },
            applySelection: (hide) => {
                //console.log('apply');
                if (hide != false) {
                    bootstrap.Dropdown.getOrCreateInstance(`#${self.displayColumnHeadingsParams.elementId}`).hide();
                }

                let a = JSON.stringify(self.displayColumnHeadings());
                let b = JSON.stringify(self.displayColumnHeadingsSelection());

                if (a != b) {
                    self.displayColumnHeadings(JSON.parse(b));
                    self.fetch(self.userDefinedFilters.json());
                }
            }
        },
        observableArray: self.displayColumnHeadingsSelection,
        options: window.getOrderLineDetailedStatusGroups().reduce((array, current) => {
            let extant = array.find(gh => gh.orderStatusGroupId == current.OrderStatusGroupID);
            if (extant) {
                extant.orderStatuses.push({
                    orderStatusId: current.OrderStatusID,
                    orderStatusName: current.OrderStatusName,
                    orderStatusSortOrder: current.OrderStatusSortOrder,
                    orderStatusGroupId: current.OrderStatusGroupID,
                    view: current.View,
                    procedure: current.Procedure
                })
            } else {
                array.push({
                    orderStatusGroupId: current.OrderStatusGroupID,
                    orderStatusGroupName: current.OrderStatusGroupName,
                    orderStatusGroupSortOrder: current.OrderStatusGroupSortOrder,
                    view: current.View,
                    procedure: current.Procedure,
                    disabled: ko.computed(() => {
                        return self.displayColumnHeadingsSelection().length == 1 && self.displayColumnHeadingsSelection()[0] === current.OrderStatusGroupID;
                    }, self),
                    orderStatuses: [{
                        orderStatusId: current.OrderStatusID,
                        orderStatusName: current.OrderStatusName,
                        orderStatusSortOrder: current.OrderStatusSortOrder,
                        orderStatusGroupId: current.OrderStatusGroupID,
                        view: current.View,
                        procedure: current.Procedure
                    }]
                });

                defaultDisplayConfigColumnHeadings.push(current.OrderStatusGroupID);
            }
            return array;
        }, []).sort((a, b) => {
            return a.orderStatusGroupSortOrder < b.orderStatusGroupSortOrder ? -1 : 1;
        })
    }

    self.defaultConfig.columnHeadings = defaultDisplayConfigColumnHeadings;

    //#endregion


    //#region Computeds

    self.orderStatuses = ko.computed(() => {
        return self.columnHeadings().flatMap(ch => ch.orderStatuses);
    }, self);

    self.visibleColumns = ko.computed(() => {
        let result = self.columnHeadings().filter(ch => self.displayColumnHeadings().indexOf(ch.orderStatusGroupId) > -1);
        return result;
    }, self);

    self.visibleOrderStatuses = ko.computed(() => {
        return self.visibleColumns().flatMap(ch => ch.orderStatuses);
    }, self);

    self.visibleColumnsJson = ko.computed(() => {
        return JSON.stringify(self.visibleColumns());
    });

    self.displayComputer = ko.computed(() => {

        let orderGroups = self.rowHeadings();

        let totals = self.displayModes();
        let dates = self.datesDisplayModes();
        let datesCollapse = self.datesCollapse();
        let pods = self.podsDisplayModes();
        let podsCollapse = self.podsCollapse();
        let predefinedFiltersTabsSelectedGroupId = self.predefinedFiltersTabsSelectedGroupId();
        let sales = self.salesDisplayModes();
        let salesCollapse = self.salesCollapse();
        let orders = self.ordersDisplayModes();
        let ordersCollapse = self.ordersCollapse();

        let gridCollapse = self.gridCollapse();

        let columnHeadings = self.columnHeadings();

        let displayColumnHeadings = self.displayColumnHeadings();

        let managementPromptTabs = self.preDefinedFilters.displayTabs();

        if (orderGroups.length) {

            let result = {
                totals: totals,
                dates: dates,
                datesCollapse: datesCollapse,
                pods: pods,
                podsCollapse: podsCollapse,
                predefinedFiltersTabsSelectedGroupId: predefinedFiltersTabsSelectedGroupId,
                sales: sales,
                salesCollapse: salesCollapse,
                orders: orders,
                ordersCollapse: ordersCollapse,
                gridCollapse: gridCollapse,
                orderGroups: orderGroups.map(h => {
                    return {
                        orderGroupId: h.orderGroupId,
                        displayModes: h.displayModes(),
                        collapsed: h.collapsed()
                    }
                }),
                columnHeadings: displayColumnHeadings,
                managementPromptTabs: managementPromptTabs
            }

            self.displayConfig = result;

            //console.log("orderBookDisplayConfig", result);

            localStorage.setItem("orderBookDisplayConfig", JSON.stringify(self.displayConfig));

            localStorage.setItem("orderBookDefaultDisplayConfig", JSON.stringify(self.defaultConfig));
        }

    }, self).extend({
        rateLimit: {
            timeout: 10,
            method: 'notifyWhenChangesStop'
        }
    });

    //#endregion


    //#region Subscriptions


    self.preDefinedFilters.displayTabs.subscribe(nv => {
        // if your active tab is in this nv list, fine
        // if not, set active tab zeroth in this list
        window.setTimeout(() => {
            // need to relinquish to the engine to allow the tabs to actually change
            let active = document.querySelector('#pre-defined-filters-tab-container button.active');

            if (active) {
                // noop
            } else {
                if (nv.length) {
                    let zeroth = document.querySelector(`#pre-defined-filters-tab-container button[data-group-id="${nv[0]}"]`);

                    if (zeroth) {
                        bootstrap.Tab.getOrCreateInstance(zeroth).show();
                    }
                }
            }
        }, 0);
    });

    self.displayModes.subscribe(changes => {
        if (changes.find(c => c.status == 'deleted' && c.value == DISPLAY_MODE_VALUE_SUM)) {
            self.displayModes.remove(dm => {
                return dm == DISPLAY_MODE_PERCENTAGE_FULL || dm == DISPLAY_MODE_PERCENTAGE_FILTER;
            });
        }
    }, self, 'arrayChange');

    self.userDefinedFilters.json.subscribe((nv) => {
        if (nv)
            self.fetch(nv);
    });

    self.columnHeadings.subscribe(nv => {
        if (self.displayColumnHeadings().length == 0) {
            let orderStatusGroupIds = nv.map((c, i) => c.orderStatusGroupId);
            self.displayColumnHeadings(orderStatusGroupIds);
        }
    });

    //self.salesCollapse.subscribe(nv => {
    //    if (nv == false && self.salesFilters.groups().length === 0) {
    //        self.salesFilters.fetch(JSON.parse(self.userDefinedFilters.json()));
    //    }
    //})

    self.busy.subscribe(nv => {
        console.log('busy', nv);
    });

    //self.displayColumnHeadingsJson.subscribe(nv => {
    //    self.fetch(self.userDefinedFilters.json());
    //});

    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions

    self.showSummaryModal = () => {
        self.fetchOrderBookSummary(self.userDefinedFilters.json());
        self.orderBookSummaryModal.show();
    }

    self.toggleDates = (data, event) => {
        event.currentTarget.classList.toggle('collapsed');

        bootstrap.Collapse.getOrCreateInstance('#header-accordion-one').toggle();

        self.datesCollapse(event.currentTarget.classList.contains('collapsed'));
    }

    self.togglePrompts = (data, event) => {
        event.currentTarget.classList.toggle('collapsed');

        bootstrap.Collapse.getOrCreateInstance('#header-accordion-two').toggle();

        self.podsCollapse(event.currentTarget.classList.contains('collapsed'));
    }

    self.toggleSales = (data, event) => {
        event.currentTarget.classList.toggle('collapsed');

        bootstrap.Collapse.getOrCreateInstance('#header-accordion-three').toggle();

        self.salesCollapse(event.currentTarget.classList.contains('collapsed'));
    }

    self.toggleOrders = (data, event) => {
        event.currentTarget.classList.toggle('collapsed');

        bootstrap.Collapse.getOrCreateInstance('#header-accordion-five').toggle();

        self.ordersCollapse(event.currentTarget.classList.contains('collapsed'));
    }

    self.toggleGrid = (data, event) => {
        event.currentTarget.classList.toggle('collapsed');

        bootstrap.Collapse.getOrCreateInstance('#main-grid-container-wrapper').toggle();

        bootstrap.Collapse.getOrCreateInstance('#date-filters').toggle();

        self.gridCollapse(event.currentTarget.classList.contains('collapsed'));
    }

    self.hideValueDropdowns = (data, event) => {

        let showing = event.currentTarget.parentNode.querySelector('.display-mode-list');

        document.querySelectorAll('.display-mode-list').forEach(el => {
            if (el != showing) {
                el.classList.remove('show');
            }
        });

        return true;
    }

    self.toggleOrderGroupCollapse = (data, event) => {
        //let totalToggleEl = document.querySelector('.first-column.grand-total-row');

        event.currentTarget.classList.toggle('collapsed');

        bootstrap.Collapse.getOrCreateInstance(`.order-group-${data.orderGroupId}`).toggle();

        //totalToggleEl.classList.toggle('collapsed');

        data.collapsed(!data.collapsed());

        //if (document.querySelector(`.order-group-${data.orderGroupId}`).classList.contains('collapsing')) {
        //    totalToggleEl.classList.remove('collapsed');
        //    data.collapsed(true);
        //} else {
        //    totalToggleEl.classList.add('collapsed');
        //    data.collapsed(false);
        //}
    }

    self.toggleAllOrderGroups = () => {

        let toggleEl = document.querySelector('.first-column.grand-total-row');

        let collapseElementList = [].slice.call(document.querySelectorAll('.order-group-collapsible'));

        let collapseList = collapseElementList.map(e => bootstrap.Collapse.getOrCreateInstance(e));

        toggleEl.classList.toggle('collapsed');

        if (toggleEl.classList.contains('collapsed')) {

            collapseList.forEach(cl => {
                cl.hide();
            });

            document.querySelectorAll('.order-group-heading.order-group-row').forEach(el => el.classList.add('collapsed'));

            self.rowHeadings().forEach(rh => {
                rh.collapsed(true);
            });

        } else {

            collapseList.forEach(cl => {
                cl.show();
            });

            document.querySelectorAll('.order-group-heading.order-group-row').forEach(el => el.classList.remove('collapsed'));

            self.rowHeadings().forEach(rh => {
                rh.collapsed(false);
            });

        }
    }

    self.getCell = (orderStatus, stockLocation) => {
        let record = null;

        record = self.results().find(r =>
            r.OrderStatusID == orderStatus.orderStatusId &&
            r.OrderStatusGroupID == orderStatus.orderStatusGroupId &&
            r.StockLocationGroupID == stockLocation?.stockLocationGroupId &&
            r.OrderGroupID == stockLocation?.orderGroupId);

        return record;
    } 

    self.getRowHeading = () => {
        return self.rowHeadings().find(rh => {
            return rh.orderGroupId == c.orderGroupId
        });
    }

    self.parse = (result, fetchOtherFilters) => {

        //let rowHeadingsStartMs = +new Date();

        self.inaccuracyMilliseconds = 0;

        self.accurateAsOfDateTime(result.AccurateAsOfDT);

        self.defaultView(result.Defaults.View);
        self.defaultProcedure(result.Defaults.Procedure);

        let defaultDisplayConfigOrderGroups = [];

        let rowHeadings = result.RowHeadings.reduce((array, current) => {
            let extant = array.find(gh => gh.orderGroupId == current.OrderGroupID);
            if (extant) {
                extant.stockLocationGroups.push({
                    stockLocationGroupId: current.StockLocationGroupID,
                    stockLocationGroupName: current.StockLocationGroupName,
                    stockLocationGroupSortOrder: current.StockLocationGroupSortOrder,
                    orderGroupId: current.OrderGroupID
                })
            } else {
                let displayConfig = self.displayConfig.orderGroups.find(og => og.orderGroupId == current.OrderGroupID);

                let rowHeading = {
                    orderGroupId: current.OrderGroupID,
                    orderGroupName: current.OrderGroupName,
                    orderGroupSortOrder: current.OrderGroupSortOrder,
                    stockLocationGroupId: current.StockLocationGroupID,
                    displayModes: ko.observableArray(displayConfig?.displayModes ?? [current.OrderGroupDefaultDisplayMode]),
                    collapsed: ko.observable(displayConfig?.collapsed ?? false),
                    stockLocationGroups: [{
                        stockLocationGroupId: current.StockLocationGroupID,
                        stockLocationGroupName: current.StockLocationGroupName,
                        stockLocationGroupSortOrder: current.StockLocationGroupSortOrder,
                        orderGroupId: current.OrderGroupID
                    }]
                }

                defaultDisplayConfigOrderGroups.push({
                    orderGroupId: current.OrderGroupID,
                    displayModes: [current.OrderGroupDefaultDisplayMode],
                    collapsed: ko.observable(false)
                });

                rowHeading.displayModes.subscribe(changes => {
                    if (changes.find(c => c.status == 'deleted' && c.value == DISPLAY_MODE_VALUE_SUM)) {
                        rowHeading.displayModes.remove(dm => {
                            return dm == DISPLAY_MODE_PERCENTAGE_FULL || dm == DISPLAY_MODE_PERCENTAGE_FILTER;
                        });
                    }
                }, self, 'arrayChange');

                array.push(rowHeading);
            }
            return array;
        }, []).sort((a, b) => {
            return a.orderGroupSortOrder < b.orderGroupSortOrder ? -1 : 1;
        });

        //let rowHeadingsEndMs = +new Date();

        //console.log(`fetchMain primary parse: rowHeadings s1 took ${rowHeadingsEndMs - rowHeadingsStartMs}ms`);

        self.defaultConfig.orderGroups = defaultDisplayConfigOrderGroups;

        rowHeadings.forEach(rh => {
            rh.stockLocationGroups.sort((a, b) => {
                return a.stockLocationGroupSortOrder < b.stockLocationGroupSortOrder ? -1 : 1;
            });
        });

        // this is SLOW on the order of 4s with... the second call? for some reason?
        // don't know why the first time is relatively quick and the second is relatively slow but... hmph
        window.setTimeout(() => {
            self.rowHeadings(rowHeadings);
        }, 0);

        //let rowHeadingsCompleteMs = +new Date();

        //console.log(`fetchMain primary parse: rowHeadings complete took ${rowHeadingsCompleteMs - rowHeadingsStartMs}ms`);

        //let columnHeadingsStartMs = +new Date();

        let defaultDisplayConfigColumnHeadings = [];

        let columnHeadings = result.ColumnHeadings.reduce((array, current) => {
        //let columnHeadings = window.getOrderLineDetailedStatusGroups().reduce((array, current) => {
            let extant = array.find(gh => gh.orderStatusGroupId == current.OrderStatusGroupID);
            if (extant) {
                extant.orderStatuses.push({
                    orderStatusId: current.OrderStatusID,
                    orderStatusName: current.OrderStatusName,
                    orderStatusSortOrder: current.OrderStatusSortOrder,
                    orderStatusGroupId: current.OrderStatusGroupID,
                    view: current.View,
                    procedure: current.Procedure
                })
            } else {
                array.push({
                    orderStatusGroupId: current.OrderStatusGroupID,
                    orderStatusGroupName: current.OrderStatusGroupName,
                    orderStatusGroupSortOrder: current.OrderStatusGroupSortOrder,
                    view: current.View,
                    procedure: current.Procedure,
                    disabled: ko.computed(() => {
                        return self.displayColumnHeadingsSelection().length == 1 && self.displayColumnHeadingsSelection()[0] === current.OrderStatusGroupID;
                    }, self),
                    orderStatuses: [{
                        orderStatusId: current.OrderStatusID,
                        orderStatusName: current.OrderStatusName,
                        orderStatusSortOrder: current.OrderStatusSortOrder,
                        orderStatusGroupId: current.OrderStatusGroupID,
                        view: current.View,
                        procedure: current.Procedure
                    }]
                });
            }
            return array;
        }, []).sort((a, b) => {
            return a.orderStatusGroupSortOrder < b.orderStatusGroupSortOrder ? -1 : 1;
        });

        //let columnHeadingsEndMs = +new Date();

        //console.log(`fetchMain primary parse: columnHeadings s1 took ${columnHeadingsEndMs - columnHeadingsStartMs}ms`);

        columnHeadings.forEach(ch => {
            if (ch.orderStatuses.length > 1) {
                ch.orderStatuses.push({
                    orderStatusId: null,
                    orderStatusName: "Total",
                    orderStatusSortOrder: ch.orderStatuses.length,
                    orderStatusGroupId: ch.orderStatusGroupId,
                    view: "view-one",
                    procedure: "ViewOne"
                })
            }

            ch.orderStatuses.sort((a, b) => {
                return a.orderStatusSortOrder < b.orderStatusSortOrder ? -1 : 1;
            });
        });

        //let columnHeadingsCompleteMs = +new Date();

        //console.log(`fetchMain primary parse: columnHeadings s2 took ${columnHeadingsCompleteMs - columnHeadingsStartMs}ms`);

        //let resultsFillStartMs = +new Date();

        self.results(result.Data.map(d => {
            let parent = rowHeadings.find(rh => {
                return rh.orderGroupId == d.OrderGroupID
            }) ?? self;

            let cell = orderBookMainCell({
                parent: parent, // I want parent from here to be the rowHeading the cell resides in
                data: d
            });

            return cell;
        }));

        //let resultsFillEndMs = +new Date();

        //console.log(`fetchMain primary parse: resultsFill took ${resultsFillEndMs - resultsFillStartMs}ms`);

        // this will only be true on the first run through
        //if (self.columnHeadings().length == 0) {

        //let columnHeadingsFillStartMs = +new Date();

        self.columnHeadings(columnHeadings);

        //let columnHeadingsFillEndMs = +new Date();

        //console.log(`fetchMain primary parse: columnHeadings fill took ${columnHeadingsFillEndMs - columnHeadingsFillStartMs}ms`);

        if (fetchOtherFilters) {
            self.salesFilters.fetch(JSON.parse(self.userDefinedFilters.json()));
            self.ordersFilters.fetch(JSON.parse(self.userDefinedFilters.json()));
        }

        //}
    }

    self.fetch = (params, afterFetch) => {

        self.busy(true);

        let fetchOtherFiltersAfterParse = true;

        if (self.columnHeadings().length > 0) {
            let p = JSON.parse(params);
            self.salesFilters.fetch(p);
            self.ordersFilters.fetch(p);
            fetchOtherFiltersAfterParse = false;
        }

        let body = JSON.parse(params);

        body.orderLineDetailedStatusGroupIds = self.displayColumnHeadings();

        if (self.fetchAbortController.fetch == null) {
            console.log("FetchMain calling with", body);
        } else {
            self.fetchAbortController.abort();
        }

        //self.fetchAbortController.fetch =
        fetch("/api/orderbook/Refresh", {
            method: "POST",
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify(body),
            signal: self.fetchAbortController.signal
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log("FetchMain returned", data);

                let startMs = +new Date();

                self.parse(data.mainResult, fetchOtherFiltersAfterParse);

                let endMs = +new Date();
                
                console.log(`FetchMain primary parsing took ${endMs - startMs}ms`);

                let dateFilterParsingStart = +new Date();

                self.dateFilters.parse(data.dateFilters);

                endMs = +new Date();

                console.log(`FetchMain dateFilters parsing took ${endMs - dateFilterParsingStart}ms`);

                let preDefinedFilterParsingStart = +new Date();

                self.preDefinedFilters.parse(data.preDefinedFilters);
                
                endMs = +new Date();

                console.log(`FetchMain preDefinedFilters parsing took ${endMs - preDefinedFilterParsingStart}ms`);

                bootstrap.Collapse.getOrCreateInstance(document.querySelector("#accuracy-collapse")).hide();

                if (typeof afterFetch === 'function') {
                    window.setTimeout(() => {
                        afterFetch();
                    }, 0);
                } else {
                    self.busy(false);

                    endMs = +new Date();

                    console.log(`FetchMain overall parsing took ${endMs - startMs}ms`);
                }
            })
            .catch((err) => {
                self.busy(false);
                window.catchFetchError(err);
                //delete self.fetchAbortController.fetch;
                //self.fetchAbortController.fetch = undefined;
            });
    }

    self.fetchOrderBookSummary = (params) => {

        self.orderBookSummaryBusy(true);

        let body = JSON.parse(params);

        body.orderLineDetailedStatusGroupIds = self.displayColumnHeadings();

        console.log("FetchOrderBookSummary calling with", body);

        fetch("/api/orderbook/FetchOrderBookSummary", {
            method: "POST",
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify(body)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log("fetchOrderBookSummary returned", data);
                self.orderBookSummaryBusy(false);
                let groups = Object.groupBy(data.summaryResult.Results, g => g.GroupID);

                let orderBookSummaryResults = [];

                Object.keys(groups).forEach(g => {
                    let rows = groups[g].sort((a, b) => {
                        a.RowID > b.RowID ? 1 : -1
                    });

                    orderBookSummaryResults.push({
                        groupId: isNaN(+g) ? null : +g,
                        groupName: rows[0].GroupName,
                        rows: rows
                    });
                })

                self.orderBookSummaryResults(orderBookSummaryResults.sort((a, b) => {
                    return a.groupId > b.groupId ? 1 : -1
                }));
            })
            .catch(err => {
                self.orderBookSummaryBusy(false);
                window.catchFetchError(err);
            })
    }

    self.reset = () => {
        window.showConfirm("Are you sure?", "This will clear all of your current filters.", () => {
            self.userDefinedFilters.reset();
        }, null);
    };

    self.resetDisplay = () => {
        window.showConfirm("Are you sure?", "This will reset the Order Book to the default display configuration.", () => {

            self.busy(true);

            window.setTimeout(() => {

                self.displayModes(self.defaultConfig.totals);

                self.datesDisplayModes(self.defaultConfig.dates);
                self.datesCollapse(self.defaultConfig.datesCollapse);

                self.podsDisplayModes(self.defaultConfig.pods);
                self.podsCollapse(self.defaultConfig.podsCollapse);
                self.predefinedFiltersTabsSelectedGroupId(self.defaultConfig.predefinedFiltersTabsSelectedGroupId);

                self.salesDisplayModes(self.defaultConfig.sales);
                self.salesCollapse(self.defaultConfig.salesCollapse);

                self.gridCollapse(self.defaultConfig.gridCollapse);

                self.displayColumnHeadings([]);

                self.preDefinedFilters.displayTabs(self.defaultConfig.managementPromptTabs);

                self.defaultConfig.orderGroups.forEach(og => {
                    let rh = self.rowHeadings().find(rh => rh.orderGroupId == og.orderGroupId);
                    rh.collapsed(og.collapsed());
                    rh.displayModes(og.displayModes);
                });

                self.fetch(self.userDefinedFilters.json(), () => {
                    self.displayColumnHeadingsSelection(self.columnHeadings().map(d => d.orderStatusGroupId));
                    self.busy(false);
                });

            }, 0);

        }, null);
    }

    self.refresh = () => {
        self.fetch(self.userDefinedFilters.json());
    }

    self.showDetail = (cell, displayModes) => {
        console.log("showDetail called", cell);

        let iFrame = document.createElement("iframe");

        let params = JSON.parse(self.userDefinedFilters.json());

        let view = cell.view ?? self.defaultView();
        let procedure = cell.procedure ?? self.defaultProcedure();
        let filterable = cell.filterable ?? true;

        let preDefinedFilterCriteria = {
            displayModes: typeof displayModes == 'function' ? displayModes() : self.displayModes(),
            orderLineDetailedStatusGroupIds: self.visibleColumns().map(v => v.orderStatusGroupId),
            accurateAsOfDateTime: self.accurateAsOfDateTime(),
            procedure: procedure,
            view: view,
            filterable: filterable
        };

        if (cell.hasOwnProperty('orderGroupId'))
            preDefinedFilterCriteria.orderGroupId = cell.orderGroupId;

        if (cell.hasOwnProperty('orderStatusGroupId'))
            preDefinedFilterCriteria.orderStatusGroupId = cell.orderStatusGroupId;

        if (cell.hasOwnProperty('orderStatusId'))
            preDefinedFilterCriteria.orderStatusId = cell.orderStatusId;

        if (cell.hasOwnProperty('stockLocationGroupId'))
            preDefinedFilterCriteria.stockLocationGroupId = cell.stockLocationGroupId;

        Object.assign(params, preDefinedFilterCriteria);

        let title = [];

        if (cell.orderStatusGroupName)
            title.push(`<span data-bind="attr: { title: 'OrderStatusGroupID: ${cell.orderStatusGroupId} - ${cell.orderStatusGroupName}' }">Order Status Group: ${cell.orderStatusGroupName}</span>`);

        if (cell.orderStatusName)
            title.push(`<span data-bind="attr: { title: 'OrderStatusID: ${cell.orderStatus} - ${cell.orderStatusName}' }">Order Status: ${cell.orderStatusName}</span>`);

        if (cell.orderGroupName)
            title.push(`<span data-bind="attr: { title: 'OrderGroupID: ${cell.orderGroupId} - ${cell.orderGroupName}' }">Order Group: ${cell.orderGroupName}</span>`);

        if (cell.stockLocationGroupName)
            title.push(`<span data-bind="attr: { title: 'StockLocationGroupID: ${cell.stockLocationGroupId} - ${cell.stockLocationGroupName}' }">Stock Location Group: ${cell.stockLocationGroupName}</span>`);

        title.push(`<span class="detail-view-name ms-5" data-bind="attr: { title: '${view}'' }">${view}</span>`);

        self.detailModalTitleElement.innerHTML = title.join("");

        let qs = new URLSearchParams(params).toString();

        let src = `/order-book/detail/${view}?partial=true&${qs}`;

        console.log(src);

        iFrame.src = src;

        self.detailModalBusy(true);

        iFrame.onload = () => {
            self.detailModalBusy(false);
        }

        self.detailModaliFrameTargetElement.replaceChildren(iFrame);

        self.detailModaliFrame = iFrame;

        self.detailModal.show();
    }

    self.exportDetail = () => {
        
        self.detailModaliFrame.contentWindow.postMessage({
            action: 'exportDetail'
        });
    }

    self.copyLink = () => {

        self.detailModaliFrame.contentWindow.postMessage({
            action: 'copyLink'
        });

    }

    self.toggleFilters = () => {

        self.detailModaliFrame.contentWindow.postMessage({
            action: 'toggleFilters'
        });

    }

    //#endregion


    //#region Events

    self.fetch(self.userDefinedFilters.json());

    //if (self.salesCollapse() == false) {
    //    self.salesFilters.fetch(JSON.parse(self.userDefinedFilters.json()));
    //}

    document.addEventListener('setDetailModalTitle', (e) => {
        self.detailModalTitleElement.innerHTML = e.detail.join("");
    }, false);

    document.addEventListener('copyLinkToClipboard', async (e) => {
        await self.writeClipboardText(e.detail.text);
    }, false);

    document.addEventListener('click', async (e) => {
        let ele = document.getElementById("copy-to-clipboard-btn");
        if (ele) {
            let bstt = bootstrap.Tooltip.getOrCreateInstance(ele);
            if (bstt) {
                bstt.hide();
            }
        }
    }, false);

    self.writeClipboardText = async (text) => {
        try {
            await navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${text}`)
                .then(ev => {
                    console.log("copied link to clipboard", text);
                    let ele = document.getElementById("copy-to-clipboard-btn");
                    let bstt = bootstrap.Tooltip.getOrCreateInstance(ele);
                    bstt.show();
                });
        } catch (error) {
            window.showError(error.message);
        }
    }

    self.accuracyCheck = () => {
        fetch("/api/orderbook/AccuracyCheck", {
            method: "POST",
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin'
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log("accuracyCheckInterval returned", data);

                let currentTimeMs = Date.parse(self.accurateAsOfDateTime());

                let newTimeMs = Date.parse(data);

                console.log("accuracyCheckInterval current", currentTimeMs, " new ", newTimeMs);

                // if the data has remained stale for e.g. an hour, then there's a problem
                // so we should, regardless of what the user's preference for nag screens is, nag them
                // to tell them that the data is now e.g. an hour stale and should've been updated 45 minutes ago.

                let nagBlocked = document.cookie.split(';').find(c => c.indexOf('orderBookNag') === 0)?.split('=')[1] === "false";

                if (!nagBlocked) {
                    if (newTimeMs > currentTimeMs) {
                        // newer data is available, prompt the user - unless they've specifically asked you not to
                        self.accuracyMessage(`<p>Newer data is available. Would you like to refresh your view now?</p>
                        <p><span class="bold">Current view was accurate: </span>${moment(new Date(currentTimeMs)).format("DD/MM/YYYY HH:mm:ss")}</p>                        
                        <p><span class="bold">Refresh to update to: </span>${moment(new Date(newTimeMs)).format("DD/MM/YYYY HH:mm:ss")}</p>                        
                    `);
                        bootstrap.Collapse.getOrCreateInstance(document.querySelector("#accuracy-collapse")).show();
                    }
                } else {
                    console.log("data accuracy reminder is disabled");
                }

                if (newTimeMs > currentTimeMs) {
                    self.inaccuracyMilliseconds = 0;
                }
            })
            .catch(window.catchFetchError);
    }

    self.accuracyPleaseStopRemindingMe = () => {
        window.showConfirm('Are you sure?', 'This will disable the Order Book data accuracy reminder for 24 hours.', () => {
            bootstrap.Collapse.getOrCreateInstance(document.querySelector("#accuracy-collapse")).hide();
            document.cookie = "orderBookNag=false; max-age=86400";
        }, () => {

        });
    }

    self.accuracyRefresh = () => {
        bootstrap.Collapse.getOrCreateInstance(document.querySelector("#accuracy-collapse")).hide();
        self.refresh();
    }

    self.inaccuracyTimer = window.setInterval(() => {
        self.inaccuracyMilliseconds += 1000;

        if (self.inaccuracyMilliseconds > 3600000) {
            bootstrap.Collapse.getOrCreateInstance(document.querySelector("#accuracy-error-collapse")).show();
            //window.showError("More accurate data should be available by now but doesn't appear to be. Please contact <a href='mailto:itsupport@designersguild.com'>itsupport@designersguild.com</a>.");
            self.inaccuracyMilliseconds = 0;
        }
    }, 1000);

    self.accuracyCheckInterval = window.setInterval(
        self.accuracyCheck
        , 900000); // this is 15m in ms
        //, 10000); // this is 10s in ms



    //#endregion

    return self;
});