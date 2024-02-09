/*

    Okay, this because virtual scrolling from Telerik was too unwieldy and limiting.

    Essentially we provide virtual scrolling functionality, coupled potentially with deferred expensive data fetching.

    The crux of the approach is thus: we assume we have some large number of search results, say 20k.
    We need to display useful interactive content foreach row. 
    The data behind each row can be prohibitively time consuming to query for all at once: we need to defer the 
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
*/
const virtualScrollingDeferredDataFactory = ({
    tableSelector,
    rowHeight,
    primaryFetchParams,
    primaryFetchEndpoint,
    primaryFetchResultFn,
    secondaryFetchQueueRecordId,
    secondaryFetchParams,
    secondaryFetchEndpoint,
    secondaryFetchResultProcessingFn,
    container,
    gridHeaderHeight,
    gridPositionTop,
    unfilledRecordFn
} = {
    tableSelector: "#virtual-scrolling-table",
    rowHeight: 50,
    primaryFetchParams: ko.computed(() => {
        // build some set of parameters required by primaryFetch
    }),
    primaryFetchEndpoint: "/api/some-endpoint",
    primaryFetchResultFn: (rec) => {
        return Object.assign({
            loaded: ko.observable(false),
            busy: ko.observable(false)
        }, rec);
    },
    secondaryFetchQueueRecordId: `a-b-c-d`,
    secondaryFetchParams: ko.computed(() => {
        // build some set of params required by the secondaryFetch
    }),
    secondaryFetchEndpoint: "/api/some-other-endpoint",
    secondaryFetchResultProcessingFn: (record, data) => {
        record.loaded(true);
        record.busy(false);
    },
    container: window,
    gridHeaderHeight: 56,
    gridPositionTop: 206,
    unfilledRecordFn: (rec = {

    }) => {
        let self = {};

        self.id = "id";

        return self;
    }
}) => {
    let self = {};

    // the question is this: how can I provide bare-bones fetches which just know about the endpoint...
    // I... can't really, I can just ask for the end point though?


    if (!document.querySelector(tableSelector)) {
        console.warn(`tableSelector "${tableSelector}" did not exist`);
    }

    //#region Properties

    self.busy = ko.observable(false);

    self.rowHeight = rowHeight;

    self.scrollY = ko.observable(0);

    self.container = container;

    self.maxY = ko.observable(self.container.innerHeight);

    self.gridHeaderHeight = gridHeaderHeight;

    self.gridTotalHeight = ko.observable();

    self.gridScrollBottomPadding = ko.observable(0);

    self.finalRowVisible = ko.observable(false);

    self.gridPositionTop = gridPositionTop;

    self.primaryFetchParams = primaryFetchParams;

    self.primaryFetchEndpoint = primaryFetchEndpoint;

    self.primaryFetchResultFn = primaryFetchResultFn;

    self.secondaryFetchParams = secondaryFetchParams;

    self.secondaryFetchEndpoint = secondaryFetchEndpoint;

    self.secondaryFetchQueueRecordId = secondaryFetchQueueRecordId;

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
        let results = [...new Set(self.secondaryFetchQueue().filter(vr => {
            let r = self.secondaryFetchedRecords().find(fr =>
                fr[self.secondaryFetchQueueRecordId] == vr[self.secondaryFetchQueueRecordId]
            );
            return (r == null || r && r.loaded() == false);
        }).map((cr) => {
            return self.unfilledRecordFn(cr)
        }))];
        return results;
    }, self).extend({
        rateLimit: {
            timeout: 100,
            method: "notifyWhenChangesStop"
        }
    });

    self.finalRowObservationComputer = ko.computed(() => {

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

    console.warn("next up, we need to continue work on this encapsulation of the concept of virtual scrolling!");

    self.visibleItems = ko.computed(() => {

        let toFetch = [];

        let alreadyFetching = self.secondaryFetchQueue.peek();

        let filledRecords = self.secondaryFetchedRecords.peek();

        let results = self.searchResults().filter((i, index) => {

            let actuallyVisible = ((i.offsetY - self.gridHeaderHeight + self.rowHeight) >= (self.scrollY())) &&
                ((i.offsetY - self.gridHeaderHeight + self.rowHeight) <= (self.maxY()));

            //console.log(virtualScrollingDeferredDataFactory actuallyVisible);

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

    self.gridScrollTopPadding = ko.computed(() => {
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
        if (self.finalRowVisible()) {
            return 0;
        } else {
            return self.gridTotalHeight() - self.gridScrollTopPadding() - self.gridHeaderHeight - self.gridPositionTop;
        }
    }, self);


    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Methods



    self.primaryFetch = ko.computed(() => {

        self.busy(true);

        let data = self.primaryFetchParams();

        self.searchResults([]);

        self.haveSearchResults(false);

        self.secondaryFetchedRecords([]);

        console.log('virtualScrollingDeferredDataFactory primaryFetch calling with', data);

        fetch(self.primaryFetchEndpoint, {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('virtualScrollingDeferredDataFactory primaryFetch returned', data);

                self.busy(false);

                if (data.Results.length > 0)
                    self.haveSearchResults(true);

                let startingOffset = self.gridPositionTop + self.gridHeaderHeight;

                let additionalOffset = startingOffset;

                let cumulativeHeight = 0;

                let results = data.Results.map((result, index) => {

                    result.offsetY = (((index) * self.rowHeight) + additionalOffset);

                    cumulativeHeight += self.rowHeight;

                    result.runningHeight = cumulativeHeight;

                    return self.primaryFetchResultFn(result);
                });

                self.gridTotalHeight(cumulativeHeight - self.rowHeight - 1);

                self.searchResults(results);

                self.haveSearchResults(true);

            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            });
    }, self);

    self.secondaryFetch = ko.computed(() => {

        let urpids = self.unfilledRecords();

        console.log("virtualScrollingDeferredDataFactory self.unfilledRecords()", urpids);

        if (urpids.length) {

            window.setTimeout(() => {

                let callStart = new Date();

                let data = self.secondaryFetchParams();

                console.log('virtualScrollingDeferredDataFactory self.secondaryFetch calling with', data);

                fetch(self.secondaryFetchEndpoint, {
                    method: 'POST',
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

                            let record = records.find(p => p[self.secondaryFetchQueueRecordId] == stub[self.secondaryFetchQueueRecordId]);
                            // if record is null here, we've fetched data for something which is no longer amongst our search results.
                            // this will readily cause chaos: remove it from the 'to be fetched' collection.

                            if (record != null) {

                                //console.log('virtualScrollingDeferredDataFactory record found');

                                let dataResult = data.Results.find(p => p[self.secondaryFetchQueueRecordId] == stub[self.secondaryFetchQueueRecordId]);

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

                                    self.secondaryResultProcessingFunction(record, dataResult);

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
                        self.clearBusy();
                        window.catchFetchError(err)
                    });
            }, 300);
        }
    }, self).extend({
        rateLimit: {
            timeout: 100,
            method: 'notifyWhenChangesStop'
        }
    });

    //#endregion


    //#region Events



    //#endregion

    return self;
}