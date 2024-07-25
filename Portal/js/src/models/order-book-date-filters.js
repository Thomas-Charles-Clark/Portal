const orderBookDateFiltersViewModel = ((parent) => {

    //#region Properties
     
    let self = {
        parent: parent
    };

    self.busy = self.parent.busy;

    self.summaries = ko.observableArray([]);

    self.fromDate = ko.observable();

    self.toDate = ko.observable();

    self.displayModes = self.parent.datesDisplayModes;

    self.dateFiltersElement = document.querySelector("#date-filters .pre-defined-filter-list");

    self.skipFromDateFilterSubscription = ko.observable(false);

    self.skipToDateFilterSubscription = ko.observable(false);

    self.latch = {};

    //#endregion


    //#region Events

    // This disables the "hold ctrl to do disparate selection" behaviour
    self.dateFiltersElement.addEventListener('selectablestart', function (e) {
        e.originalEvent.ctrlKey = false;
        e.originalEvent.metaKey = false;
    });


    //#endregion


    //#region Components

    self.dateFiltersSelect = $(self.dateFiltersElement).selectable({
        distance: 2,
        create: (event, ui) => {
            //console.log('create', event, ui);
        },
        start: (event, ui) => {
            //console.log('start', event, ui);
            if (event.originalEvent.ctrlKey)
                event.originalEvent.ctrlKey = false;
        },
        selecting: (event, ui) => {
            //console.log('selecting', event, ui);
        },
        unselecting: (event, ui) => {
            //console.log('unselecting', event, ui);
        },
        selected: (event, ui) => {
            //console.log('selected', event, ui);
        },
        unselected: (event, ui) => {
            //console.log('selected', event, ui);
        },
        stop: (event, ui) => {
            let selection = [].slice.call(self.dateFiltersElement.querySelectorAll('.filter-card.ui-selected'), 0),
                startDate = null,
                endDate = null;

            selection.reverse();

            selection.forEach((e, i) => {
                if (i === 0) {
                    startDate = ko.dataFor(e).StartDate;
                }
                if (i === selection.length - 1) {
                    endDate = ko.dataFor(e).EndDate;
                }
            });

            if (startDate && endDate) {
                self.skipFromDateFilterSubscription(true);
                self.skipToDateFilterSubscription(true);

                self.parent.userDefinedFilters.fromDate(new Date(startDate));
                self.parent.userDefinedFilters.toDate(new Date(endDate));
            } else {
                self.skipFromDateFilterSubscription(true);
                self.skipToDateFilterSubscription(true);

                self.parent.userDefinedFilters.fromDateParams.clearFunction();
                self.parent.userDefinedFilters.toDateParams.clearFunction();
            }

            console.log('stop', startDate, endDate);
        }
    });

    //#endregion


    //#region Computeds

    self.computerBooting = true;

    // this looks a curious beast but it is carefully crafted: just like any other,
    // it sets up the subscriptions which cause this computed function to be re-evaluated
    self.computer = ko.computed(() => {
        let dat = {
            fromDate: self.fromDate(),
            skipFrom: self.skipFromDateFilterSubscription(),
            toDate: self.toDate(),
            skipTo: self.skipToDateFilterSubscription()
        };
        if (self.computerBooting === true) {
            self.computerBooting = false;
        } else {
            if (dat.skipFrom === true) {
                self.skipFromDateFilterSubscription(false);
            }
            if (dat.skipTo === true) {
                self.skipToDateFilterSubscription(false);
            }
        }
    }).extend({
        rateLimit: {
            timeout: 300,
            method: 'notifyWhenChangesStop'
        }
    });

    //#endregion


    //#region Subscriptions

    self.parent.userDefinedFilters.fromDate.subscribe(nv => {
        if (self.skipFromDateFilterSubscription() === false) {
            self.dateFiltersElement.querySelectorAll('.filter-card.ui-selected').forEach(e => {
                e.classList.remove('ui-selected');
            });
        }
    });

    self.parent.userDefinedFilters.toDate.subscribe(nv => {
        if (self.skipFromDateFilterSubscription() === false) {
            self.dateFiltersElement.querySelectorAll('.filter-card.ui-selected').forEach(e => {
                e.classList.remove('ui-selected');
            });
        }
    });

    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions

    self.click = (data, event) => {

        let selected = [].slice.call(self.dateFiltersElement.querySelectorAll('.filter-card.ui-selected'), 0);

        let selectedLength = selected.length;

        let deselection = event.currentTarget.classList.contains('ui-selected');

        selected.forEach(e => {
            e.classList.remove('ui-selected');

            if (selectedLength == 1 && e == event.currentTarget)
                deselection = true;
        })

        //console.log('click', selectedLength);

        if (deselection == false) {
            event.currentTarget.classList.add('ui-selected');
        }

        $(self.dateFiltersElement).selectable("option", "stop")();
    }

    self.parse = (dateSummaries) => {
        let selection = [];

        self.dateFiltersElement.querySelectorAll('.filter-card').forEach((e, i) => {
            if (e.classList.contains('ui-selected')) {
                selection.push(i);
            }
        });

        self.summaries(dateSummaries.map(ds => orderBookSummaryFilter({
            parent: self,
            data: ds
        })));

        window.setTimeout(() => {
            self.dateFiltersElement.querySelectorAll('.filter-card').forEach((e, i) => {
                if (selection.indexOf(i) > -1) {
                    e.classList.add('ui-selected');
                }
            });
        }, 0);
    }

    //#endregion

    self.parse(getDateSummaries());

    return self;
});