/*

    Okay, this because virtual scrolling from Telerik was too unwieldy and limiting.

    Essentially we provide virtual scrolling functionality, coupled potentially with deferred expensive data fetching.

    The crux of the approach is thus: we assume we have some large number of search results, say 20k.
    We need to display useful interactive content foreach row. 
    The data behind each row can be prohibitively time consuming to query for all at once: we may need to defer the 
    secondary data fetch and execute it only for "visible" rows: those that are actually on the screen now.

    <table>
        <tbody class="virtual-spacing">
            <tr>
                <td colspan="#" style="height: 0px;" data-bind="style: { height: `${gridScrollTopPadding()}px` }"></td>
            </tr>
        </tbody>
        <tbody data-bind="foreach: visibleItems">
            <tr>
                [... interesting interactive gubbins ...]
            </tr>
        </tbody>
        <tbody class="virtual-spacing">
            <tr class="final-row">
                <td colspan="#" style="height: 0px;" data-bind="style: { height: `${gridScrollBottomPadding()}px` }"></td>
            </tr>
        </tbody>
    </table>

    We hook into the scroll event (on window, on somewhere else, whatever) and as we scroll we update properties
    which fire our computations which determine how much padding there should be both top and bottom and which items
    are actually visible!

    If that sounds extremely difficult and specific and like it'd be impossible to build a general solution, you're...
    ... not far off the mark, actually. Even typing this now, I'm not sure how I'm going to get this worked out.

    For uses, see ContractPricing and Order Book Detail
*/
const virtualScrollingDeferredDataFactory = ({
    busy,
    tableSelector,
    rowHeight,
    primaryFetchParams,
    primaryFetchMethod,
    primaryFetchEndpoint,
    primaryFetchBeforeFn,
    primaryFetchAfterFn,
    primaryFetchResultFn,
    primaryFetchResultSetName,
    secondaryFetchQueueRecordId,
    secondaryFetchParams,
    secondaryFetchMethod,
    secondaryFetchEndpoint,
    secondaryFetchResultSetName,
    secondaryFetchResultProcessingFn,
    container,
    gridHeaderHeight,
    gridPositionTop,
    unfilledRecordFn,
    maxYMultiplier,
    primaryFetchSortFn,
} = {
        busy: ko.observable(false),
        tableSelector: "#virtual-scrolling-table",
        rowHeight: ko.observable(50),
        primaryFetchParams: ko.computed(() => {
            //console.trace();
            // build some set of parameters required by primaryFetch
        }),
        primaryFetchMethod: "GET",
        primaryFetchEndpoint: "/api/some-endpoint",
        primaryFetchBeforeFn: () => { },
        primaryFetchAfterFn: () => { },
        primaryFetchResultFn: (rec) => {
            return Object.assign({
                loaded: ko.observable(false),
                busy: ko.observable(false)
            }, rec);
        },
        primaryFetchResultSetName: "Results",
        secondaryFetchQueueRecordId: `a-b-c-d`,
        secondaryFetchParams: ko.computed(() => {
            //console.trace();
            // build some set of params required by the secondaryFetch
        }),
        secondaryFetchMethod: "POST",
        secondaryFetchEndpoint: "/api/some-other-endpoint",
        secondaryFetchResultProcessingFn: (record, data) => {
            record.loaded(true);
            record.busy(false);
        },
        secondaryFetchResultSetName: "Results",
        container: window,
        gridHeaderHeight: ko.observable(57),
        gridPositionTop: 206,
        unfilledRecordFn: (rec = {

        }) => {
            let self = {};

            self.id = "id";

            return self;
        },
        maxYMultiplier: 1,
        primaryFetchSortFn: (a, b) => {
            return 1;
        }
    }) => {
    let self = {};

    // the question is this: how can I provide bare-bones fetches which just know about the endpoint...
    // I... can't really, I can just ask for the end point though?


    if (!document.querySelector(tableSelector)) {
        console.warn(`tableSelector "${tableSelector}" did not exist`);
    }

    //#region Properties

    self.busy = busy;

    self.rateLimitFactor = 1 / 30;

    self.rowHeight = ko.isObservable(rowHeight) ? rowHeight : ko.observable(rowHeight);

    self.scrollY = ko.observable(0);

    self.tableSelector = tableSelector;

    self.container = container;

    self.maxYMultiplier = maxYMultiplier ?? 1;

    self.gridHeaderHeight = ko.isObservable(gridHeaderHeight) ? gridHeaderHeight : ko.observable(gridHeaderHeight);

    self.maxY = ko.observable(+window.getComputedStyle(self.container)['max-height'].replace(/px/, '') - self.gridHeaderHeight());

    self.gridTotalHeight = ko.observable();

    self.finalRowVisible = ko.observable(false);

    self.gridPositionTop = gridPositionTop;

    self.primaryFetchParams = primaryFetchParams;

    self.primaryFetchEndpoint = primaryFetchEndpoint;

    self.primaryFetchResultSetName = primaryFetchResultSetName;

    self.primaryFetchBeforeFn = primaryFetchBeforeFn;

    self.primaryFetchAfterFn = primaryFetchAfterFn;

    self.primaryFetchResultFn = primaryFetchResultFn;

    self.primaryFetchSortFn = primaryFetchSortFn;

    self.secondaryFetchParams = secondaryFetchParams;

    self.secondaryFetchEndpoint = secondaryFetchEndpoint;

    self.secondaryFetchResultSetName = secondaryFetchResultSetName;

    self.secondaryFetchQueueRecordId = secondaryFetchQueueRecordId;

    self.secondaryFetchResultProcessingFunction = secondaryFetchResultProcessingFn;

    self.searchResults = ko.observableArray([]);

    self.haveSearchResults = ko.observable(false);

    //// this is used to hold the records we need to data fetch for those which the dataSource has deemed to be "in view"
    self.secondaryFetchQueue = ko.observableArray([]);

    //// this holds those records which have been fleshed out by the fetchData results
    self.secondaryFetchedRecords = ko.observableArray([]);

    self.intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            self.finalRowVisible(entry.isIntersecting);
        });
    }, {
        rootMargin: "0px"
    });

    self.unfilledRecordFn = unfilledRecordFn;

    //#endregion


    //#region Computeds

    self.unfilledRecords = ko.computed(() => {
        //console.trace();
        let results = [...new Set(self.secondaryFetchQueue().filter(vr => {
            let r = self.secondaryFetchedRecords().find(fr =>
                fr[self.secondaryFetchQueueRecordId] == vr[self.secondaryFetchQueueRecordId]
            );
            return (r == null || r && r.loaded() == false);
        }).map((cr) => {
            return typeof self.unfilledRecordFn === 'function'
                ? self.unfilledRecordFn(cr)
                : cr;
        }))];
        return results;
    }, self).extend({
        rateLimit: {
            timeout: 100,
            method: "notifyWhenChangesStop"
        }
    });

    self.finalRowObservationComputer = ko.computed(() => {
        //console.trace();
        if (self.haveSearchResults()) {

            window.setTimeout(() => {
                document.querySelectorAll(`${self.tableSelector} .final-row`).forEach(tr => {
                    if (tr)
                        self.intersectionObserver.observe(tr);
                })
            }, 0);

        } else {

            self.gridTotalHeight(0);

        }

    }, self);

    if (self.secondaryFetchEndpoint) {
        self.visibleItems = ko.computed(() => {

            let scrollY = self.scrollY();

            let maxY = self.maxY();

            let toFetch = [];

            let filledRecords = self.secondaryFetchedRecords.peek();

            let results = [];

            results = self.searchResults().filter((i, index) => {

                let actuallyVisible = (i.offsetY) >= (scrollY) && (i.offsetY) <= (maxY);

                let dataFetchVisible = actuallyVisible;

                if (dataFetchVisible && !filledRecords.find(fr => fr[self.secondaryFetchQueueRecordId] == i[self.secondaryFetchQueueRecordId])) {
                    toFetch.push(i);
                }

                return actuallyVisible;
            });

            if (toFetch.length)
                ko.utils.arrayPushAll(self.secondaryFetchQueue, toFetch);
        
            return results;
        });
    }
    else {
        self.visibleItems = ko.computed(() => {

            let maxY = self.maxY();

            let scrollY = self.scrollY();

            return self.searchResults().filter((i, index) => {

                let actuallyVisible = (i.offsetY) >= (scrollY) && (i.offsetY) <= (maxY);

                return actuallyVisible;
            });
        });
    }

    self.gridScrollTopPadding = ko.computed(() => {
        //console.trace();

        let maxY = self.maxY();

        let scrollY = self.scrollY();
        let result = 0;
        let rowHeight = self.rowHeight();
        let cumulativeHeight = self.searchResults.peek().length * rowHeight;

        self.searchResults.peek().forEach(ir => {
            if (scrollY > ir.runningHeight) {
                result += rowHeight;
            }
        });

        self.gridTotalHeight(cumulativeHeight);

        console.log('gridScrollTopPadding', result);

        return result;
    }, self);

    self.gridScrollBottomPadding = ko.computed(() => {
        //console.trace();
        //let s = self.scrollY();

        let maxY = self.maxY();

        let result = 0;

        if (!self.finalRowVisible()) {
            result = self.gridTotalHeight.peek() - (self.visibleItems().length * self.rowHeight.peek()) - self.gridScrollTopPadding.peek() - self.gridPositionTop
        }

        console.log("gridScrollBottomPadding", result)

        return result;
    }, self);


    /*
    
    
    self.gridScrollTopPadding = ko.computed(() => {
        //console.trace();

        let scrollY = self.scrollY();
        let result = 0;

        self.searchResults().forEach(ir => {
            if (scrollY > ir.runningHeight) {
                result += self.rowHeight;
            }
        });

        return result;
    }, self);

    self.gridScrollBottomPadding = ko.computed(() => {
        //console.trace();

        if (self.finalRowVisible()) {
            return 0;
        } else {
            return self.gridTotalHeight() - self.gridScrollTopPadding() - self.gridHeaderHeight - self.gridPositionTop;
        }
    }, self);


    */
    
    
    //#endregion


    //#region Subscriptions

    if (self.primaryFetchSortFn) {
        self.primaryFetchSortFn.subscribe(nv => {
            let data = self.searchResults();

            let gridHeaderHeight = self.gridHeaderHeight();

            let rowHeight = self.rowHeight();

            let startingOffset = self.gridPositionTop + gridHeaderHeight;

            let additionalOffset = startingOffset;


            if (typeof nv === 'function') {

                data.sort(nv);

                data.forEach((result, index) => {
                    result.offsetY = (((index) * rowHeight) + additionalOffset) - gridHeaderHeight;
                });

                self.searchResults(data);
            } else {

                data.sort((a, b) => {
                    return a.originalOffsetY > b.originalOffsetY ? 1 : -1;
                });

                data.forEach((result, index) => {
                    result.offsetY = (((index) * rowHeight) + additionalOffset) - gridHeaderHeight;
                });

                self.searchResults(data);
            }
        });
    }

    //#endregion


    //#region Methods



    self.primaryFetch = ko.computed(() => {
        //console.trace();

        let data = self.primaryFetchParams();

        if (data) {

            if (typeof data === 'string') {
                data = JSON.parse(data);
            }

            if (typeof self.primaryFetchBeforeFn == 'function') {
                self.primaryFetchBeforeFn();
            }

            self.busy(true);

            self.searchResults([]);

            self.haveSearchResults(false);

            self.secondaryFetchedRecords([]);

            console.log('virtualScrollingDeferredDataFactory primaryFetch calling with', data);

            fetch(self.primaryFetchEndpoint, {
                method: "POST",
                headers: window.fetchHeaders,
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log('virtualScrollingDeferredDataFactory primaryFetch returned', data);

                    self.busy(false);

                    if (data[self.primaryFetchResultSetName].length > 0)
                        self.haveSearchResults(true);

                    let gridHeaderHeight = self.gridHeaderHeight();

                    let rowHeight = self.rowHeight();

                    let startingOffset = self.gridPositionTop + gridHeaderHeight;

                    let additionalOffset = startingOffset;

                    let cumulativeHeight = 0;

                    let results = data[self.primaryFetchResultSetName].map((result, index) => {

                        result.offsetY = (((index + 1) * rowHeight) + additionalOffset) - gridHeaderHeight;

                        result.originalOffsetY = result.offsetY;

                        cumulativeHeight += rowHeight;

                        result.runningHeight = cumulativeHeight;

                        return self.primaryFetchResultFn(result);
                        //return result;
                    });

                    if (self.primaryFetchSortFn && self.primaryFetchSortFn()) {
                        results.sort(self.primaryFetchSortFn());
                    } 

                    self.gridTotalHeight(cumulativeHeight);

                    self.searchResults(results);

                    self.haveSearchResults(true);

                    if (typeof self.primaryFetchAfterFn == 'function') {
                        self.primaryFetchAfterFn(data);
                    }
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                });
        }
    }, self);

    self.secondaryFetch = ko.computed(() => {
        //console.trace();

        if (self.secondaryFetchEndpoint) {
            let urpids = self.unfilledRecords();

            if (urpids.length) {

                console.log("virtualScrollingDeferredDataFactory self.unfilledRecords()", urpids);

                //urpids.forEach(urpid => urpid.busy(true));

                window.setTimeout(() => {

                    let callStart = new Date();

                    let data = self.secondaryFetchParams.call(self, urpids);

                    console.log('virtualScrollingDeferredDataFactory self.secondaryFetch calling with', data);

                    fetch(self.secondaryFetchEndpoint, {
                        method: "POST",
                        headers: window.fetchHeaders,
                        body: JSON.stringify(data)
                    })
                        .then(window.handleFetchResponse)
                        .then(data => {

                            let callReturn = new Date();

                            console.log(`virtualScrollingDeferredDataFactory self.secondaryFetch returned in ${callReturn - callStart}ms`, data);

                            let records = self.searchResults.peek();
                            let affectedRecords = [];
                            let filledRecords = self.secondaryFetchedRecords.peek();
                            let forcedRemovals = [];

                            urpids.forEach(stub => {

                                //console.log(virtualScrollingDeferredDataFactory stub);

                                // if record is null here, we've fetched data for something which is no longer amongst our search results.
                                // this will readily cause chaos: remove it from the 'to be fetched' collection.
                                records.filter(p => p[self.secondaryFetchQueueRecordId] == stub[self.secondaryFetchQueueRecordId])
                                    .forEach(record => {

                                        if (record != null) {

                                            //console.log('virtualScrollingDeferredDataFactory record found');

                                            let dataResult = data[self.secondaryFetchResultSetName].find(p => p[self.secondaryFetchQueueRecordId] == stub[self.secondaryFetchQueueRecordId]);

                                            let filledRecord = filledRecords.find(p => p[self.secondaryFetchQueueRecordId] == stub[self.secondaryFetchQueueRecordId]);

                                            let add = filledRecord == null;

                                            if (dataResult) {

                                                if (filledRecord == null) {
                                                    filledRecord = record;
                                                    //record = impactSearchResult({
                                                    //    rec: record
                                                    //});
                                                } else {
                                                    add = false;
                                                    filledRecord.loaded(true);
                                                    record = filledRecord;
                                                }

                                                //let modelledRecord = self.primaryFetchResultFn(record);

                                                //self.searchResults.replace(record, modelledRecord);

                                                //record = modelledRecord;

                                                self.secondaryFetchResultProcessingFunction.call(record, dataResult);

                                                record.busy(false);

                                                record.loaded(true);
                                            } else {
                                                record.loaded = ko.observable(true);
                                                record.ErrorMessage = `<h5 class="mb-0">[portal].[ContractManagement_SalesData_Select] did not return a result for Product/Quality ${record.ProductID || record.QualityID}</h5>`;
                                            }

                                            if (add) {
                                                affectedRecords.push(record);
                                            }
                                        } else {

                                            console.log('virtualScrollingDeferredDataFactory RECORD NOT FOUND');

                                            forcedRemovals.push(stub);
                                        }
                                    });
                            });

                            ko.ignoreDependencies(() => {
                                affectedRecords.forEach(ar => {
                                    self.secondaryFetchQueue.remove(rtdf => rtdf.ProductOrQuality == ar.ProductOrQuality &&
                                        rtdf.ProductID === ar.ProductID &&
                                        rtdf.QualityID === ar.QualityID);
                                });

                                forcedRemovals.forEach(fr => {
                                    self.secondaryFetchQueue.remove(rtdf => rtdf.ProductOrQuality == fr.ProductOrQuality &&
                                        rtdf.ProductID === fr.ProductID &&
                                        rtdf.QualityID === fr.QualityID);
                                })

                                ko.utils.arrayPushAll(self.secondaryFetchedRecords, affectedRecords);
                            });

                            let callBound = new Date();

                            window.setTimeout(() => {
                                console.log(`virtualScrollingDeferredDataFactory secondaryFetch bound in ${callBound - callReturn}ms`);
                            }, 0);
                        })
                        .catch(err => {
                            self.busy(false);
                            window.catchFetchError(err)
                        });
                }, 300);
            }
        }

    }, self).extend({
        rateLimit: {
            timeout: 100,
            method: 'notifyWhenChangesStop'
        }
    });

    self.reset = () => {

        self.searchResults([]);

        self.haveSearchResults(false);

        self.secondaryFetchedRecords([]);

    }

    //#endregion


    //#region Events

    self.container.addEventListener("scroll", (event) => {
        if (self.finalRowVisible()) {
            if (self.container.scrollTop < self.scrollY()) {
                self.scrollY(self.container.scrollTop);
                self.maxY(self.scrollY() + +window.getComputedStyle(self.container)['max-height'].replace(/px/, '') * self.maxYMultiplier);
            }
        } else {
            self.scrollY(self.container.scrollTop);
            self.maxY(self.scrollY() + +window.getComputedStyle(self.container)['max-height'].replace(/px/, '') * self.maxYMultiplier); //eh?
        }
    });

    window.addEventListener("resize", debounce((event) => {
        //if (self.finalRowVisible()) {
        //    self.finalRowVisible(false);
        //}
        //if (self.container.scrollY < self.scrollY()) {
        self.maxY(self.scrollY() + +window.getComputedStyle(self.container)['max-height'].replace(/px/, '') * self.maxYMultiplier);
        //}
        //} else {
        //    self.maxY(self.scrollY() + window.innerHeight);
        //}
    }, 50));

    //#endregion

    return self;
}