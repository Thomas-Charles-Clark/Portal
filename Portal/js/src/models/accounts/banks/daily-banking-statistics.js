const UniVerseAccounts = [{
    name: 'Mertex',
    value: 'MERTEX'
}, {
    name: 'DG Europe',
    value: 'DG_EUROPE'
}, {
    name: 'Mertex Inc.',
    value: 'MERTEX_INC'
}]

const dailyBankingStatisticsViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(true);

    self.busyMessage = ko.observable('Please Wait');

    self.validateNow = ko.observable(false);

    self.gridWidget = ko.observable();

    let now = new Date();

    self.date = ko.observable(now);

    self.previousDate = ko.observable(now);

    self.responseValues = ko.observableArray([]);

    self.responseRows = ko.observableArray([]);

    self.responseColumns = ko.observableArray([]);

    self.gridColumns = ko.observableArray([]);

    self.rowLabelColumnWidthPixels = ko.observable('200px');

    self.breaker = dailyBankingStatisticsBreakdownViewModel({
        gridColumns: self.gridColumns
    });

    //#endregion

    //#region Lifted Methods

    self.valueLookupFn = (rowId, columnId) => {
        return self.responseValues().find(r => {
            return r.RowID == rowId && r.ColumnID == columnId;
        });
    };

    self.dirtyRecords = ko.computed(() => {
        return self.responseValues().filter(x => {
            if (Object.hasOwn(x, 'value')) {
                return x.value() != x.originalValue();
            } else {
                return false;
            }
        })
    });

    //#endregion

    //#region Components

    self.gridDataSourceRead = (options) => {
        var webapi = new kendo.data.transports.webapi({ prefix: "" });

        var mapped = webapi.parameterMap(options.data);

        var additionalParameters = {};

        ko.ignoreDependencies(() => {
            additionalParameters.date = self.date().toUTCString()
        })

        var params = new URLSearchParams();

        var data = Object.assign(mapped, additionalParameters);

        for (var propertyName in data) {
            if (Array.isArray(data[propertyName])) {
                data[propertyName].forEach(v => {
                    params.append(propertyName, v);
                });
            } else {
                params.append(propertyName, data[propertyName]);
            }
        }

        console.log('dailyBankingStatistics gridDataSourceRead calling with', data);

        self.busy(true);

        fetch('/api/dailybankingstatisticsapi/BankingStatistics_Select?' + params, {
            method: 'GET',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin'
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log('dailyBankingStatistics gridDataSourceRead returned', data);

                ko.ignoreDependencies(() => {

                    if (Object.hasOwn(data, 'errorMessage')) {

                        document.querySelector('#info-modal').addEventListener('hide.bs.modal', self.refresh);
                        options.success([]);
                        window.showInfo('Sorry', data.errorMessage);

                    } else {
                        document.querySelector('#info-modal')?.removeEventListener('hide.bs.modal', self.refresh);

                        self.rowLabelColumnWidthPixels(data.rowLabel.RowLabelColumnWidthPixels)

                        self.responseValues(data.values);
                        self.responseColumns(data.columns);
                        self.responseRows(data.rows);

                        var grouped = Object.groupBy(data.columns.sort((a, b) => {
                            return a.SortOrder > b.SortOrder ? 1 : -1;
                        }), (g) => g.GroupLabel == null ? `~${g.SortOrder}` : g.GroupLabel);

                        //let rowGroupResults = Object.keys(grouped).forEach((k, items) => {
                        //    console.log(k, items);
                        //    return { k, items };
                        //});
                        
                        let mapped = Object.keys(grouped).map((c, i) => {
                            return {
                                title: c ? c.replace(/(~\d+)/gm, '') ?? "" : " ",
                                index: i,
                                columns: [...grouped[c]].map((column, index) => {
                                    return {
                                        title: `${(column.Label ?? "nbsp;")}`,
                                        field: column.Label,
                                        index: index,
                                        attributes: {
                                            class: 'row-label-cell'
                                        },
                                        width: column.WidthPixels,
                                        editable: () => false,
                                        template: (dataItem) => {
                                            let result = dataItem.template(column.Label, column.SortOrder);
                                            return result;
                                        },
                                        groupHeaderTemplate: (dataItem) => `${dataItem.value}`,
                                    }
                                }).sort((a, b) => {
                                    return a.index > b.index ? 1 : -1;
                                })
                            }
                        });

                        self.gridColumns([{
                            field: 'GroupLabel',
                            title: ' ',
                            index: 0,
                            attributes: {
                                class: 'row-label-cell'
                            },
                            width: self.rowLabelColumnWidthPixels() ?? '200px',
                            editable: () => false,
                            template: (dataItem) => {
                                return `<span>${dataItem.Label}</span><a class="stretched-link" href="javascript:;" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${dataItem.Tooltip}"></a>`;
                            },
                            locked: true,
                            groupHeaderTemplate: (dataItem) => `${dataItem.value}`,
                        },
                        ...mapped
                        ]);

                        options.success(data.gridData);
                    }

                    if (typeof callback == 'function') {
                        callback();
                    } else {
                        self.busy(false);
                    }
                });

            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.dateParams = {
        label: "From",
        observable: self.date,
        originalValue: self.date(),
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'dddd Do MMMM (dd/MM/yyyy)',
                ordinal: (n) => {
                    const s = ['th', 'st', 'nd', 'rd'];
                    const v = n % 100;
                    return n + (s[(v - 20) % 10] || s[v] || s[0]);
                }
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
                viewMode: 'calendar',
                cellSize: '3rem'
            },
            restrictions: {
                disabledDates: [],
                //maxDate: new Date(),
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false
        },
        clearable: ko.observable(false),
        revertible: ko.observable(true),
        revertFunction: () => {
            self.dateParams.observable(self.dateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
        popupSettings: {
            appendTo: `#daily-statistics-date`
        }
    };

    self.gridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.gridDataSourceRead
        },
        batch: true,
        pageSize: 50,
        serverPaging: false,
        serverSorting: false,
        serverFiltering: false,
        autoSync: false,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data", 
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'RowID',
                fields: {
                    RowID: { type: 'number' },
                    Label: { type: 'string' },
                    Tooltip: { type: 'string' },
                    SortOrder: { type: 'number' },
                    GroupLabel: { type: 'string' }
                }
            },
            parse: (response) => {

                let mappedData = [];

                response.Data.forEach((d, i) => {
                    mappedData.push(dailyBankingStatisticsRowViewModel({
                        row: d,
                        columns: self.responseColumns(),
                        valueLookupFn: self.valueLookupFn,
                        validateNow: self.validateNow
                    }));
                });

                response.Data = mappedData;

                return response;
            }
        }),
        group: {
            field: 'GroupLabel',
            dir: 'asc'
        },
        requestStart: function (e) {
            console.log('requestStart', e);
            if (e.type === 'read') {
                console.log('requestStart was a read');
                if (self.dirtyRecords.peek().length > 0) {
                    e.preventDefault();
                    window.showInfo('Unsaved Changes', 'You have unsaved changes. Please save or cancel them before continuing.');
                }
            }
            //if (e.type == 'read') {
            //    if (self.dirtyRecords().length) {
            //        e.preventDefault();
            //    }
            //    self.gridWidget().refresh();
            //}
        },
        requestEnd: function (e) {
            //if (e.type == "create") {
            //    this.read();
            //}
            self.gridWidget().setOptions({
                autoBind: false,
                columns: self.gridColumns()
            })
        },
    });

    self.showUnsavedChanges = (onClose) => {
        window.showInfo('Unsaved Changes', 'You have unsaved changes. Please either save or cancel them before navigating.', onClose);
    }

    self.gridDataBinding = (e) => {
        console.log('gridDataBinding');
        if (self.gridWidget()) {
            if (self.dirtyRecords().length) {
                if (e.action === "rebind") {
                    e.preventDefault();
                    self.showUnsavedChanges();
                }
            }
        }
    };

    self.gridParams = {
        autoBind: true,
        widget: self.gridWidget,
        columns: self.gridColumns(),
        editable: true,
        batch: true,
        //toolbar: ["save", "cancel"],
        data: self.gridDataSource,
        edit: function (e) {
            if (e.model.isNew()) {
                if (e.sender.options.editable != 'inline') {
                    e.sender.setOptions({ editable: 'inline' });
                    e.sender.one('dataBound', function (x) {
                        window.setTimeout(function () {
                            e.sender.addRow();
                            e.sender.one('dataBound', function (y) {
                                window.setTimeout(function () {
                                    e.sender.setOptions({ editable: 'incell' });
                                }, 0);
                            });
                        }, 0);
                    });
                }
            }
        },
        dataBound: function (e) {

            self.previousDate(self.date());

            console.log('dataBound');

            ko.ignoreDependencies(() => {

                ko.utils.arrayForEach(e.sender.dataSource.view(), function (groupItem, index) {

                    groupItem.items.forEach(item => {

                        // this is necessary because if you have locked columns you will have multiple <tr> sharing the one uid
                        let rows = document.querySelectorAll(`[data-uid="${item.uid}"]`);

                        rows.forEach(row => {

                            ko.cleanNode(row);

                            let cells = row.querySelectorAll('td');

                            cells.forEach((c, i) => {
                                ko.cleanNode(c);
                                ko.applyBindings(item.cells()[i], c);
                            })
                        });
                    })
                });
            });

            window.setTimeout(() => {
                const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

                const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => {
                    if (tooltipTriggerEl.getAttribute('title'))
                        new bootstrap.Tooltip(tooltipTriggerEl);
                });

                document.querySelectorAll('[data-bind*="actualBootstrapPopover"]').forEach(e => {
                    let p = bootstrap.Popover.getInstance(e);
                    if (p) {
                        p.hide();
                    }
                });
            }, 0);

            self.responseValues.valueHasMutated();

            $(".k-grid-cancel-changes").off("click");
            $(".k-grid-cancel-changes").on("click", self.cancelChanges);

            $(".k-grid-save-changes").off("click");
            $(".k-grid-save-changes").on("click", self.saveChanges);

            $(".k-grid-save-changes").addClass('d-inline-flex');
            $(".k-grid-cancel-changes").addClass('d-inline-flex');
        },
        saveChanges: (e) => {
            console.log('saveChanges', e);

            self.saveChanges();
        },
        cancel: (e) => {
            console.log('cancel');

            self.dirtyRecords().filter(x => {
                x.value(x.originalValue());
            });
        },
        sortable: true,
        filterable: false,
        reorderable: true,
        pageable: {
            pageSize: 50,
            pageSizes: [10, 20, 50, 100, 200]
        },
        scrollable: true,
        height: 'calc(100vh - 230px)'
    };

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions

    self.skipDateSubscription = false;

    self.date.subscribe(nv => {

        if (self.skipDateSubscription == true) {
            self.skipDateSubscription = false;
        } else {

            if (self.dirtyRecords().length) {

                self.showUnsavedChanges(() => {

                    self.date.tempusDominus.dates.setValue(new tempusDominus.DateTime(self.previousDate()));

                });

                self.skipDateSubscription = true;

                self.date(self.previousDate());

                self.skipDateSubscription = true;
            } else {
                self.reload();
            }
        }
    });

    self.onbeforeunload = (event) => {
        event.preventDefault();
    }

    self.dirtyRecords.subscribe(nv => {
        if (nv.length) {
            window.addEventListener('beforeunload', self.onbeforeunload);
        } else {
            window.removeEventListener('beforeunload', self.onbeforeunload);
        }
    }, 'arrayChange');

    //#endregion



    //#region Methods

    self.init = () => {

    }

    self.cancelChanges = () => {
        if (self.dirtyRecords().length) {
            self.dirtyRecords().forEach(r => {
                r.value(r.originalValue());
            })
            self.gridWidget().dataSource.cancelChanges(); // Force the actual data revert
        } else {
            window.showInfo('Information', 'You have no unsaved changes to cancel.');
        }
    }

    self.reload = () => {
        if (self.gridWidget()) {
            self.gridWidget().dataSource.data([]);
            self.gridWidget().dataSource.query({
                page: 1,
                pageSize: self.gridWidget().dataSource.pageSize(),
                group: self.gridWidget().dataSource.group()
            });
        }
    }

    self.saveChanges = () => {

        if (self.dirtyRecords().length) {

            self.busy(true);

            let data = {
                date: self.date().toUTCString(),
                records: self.dirtyRecords().map(dr => {
                    return {
                        rowId: dr.row.RowID,
                        columnId: dr.column.ColumnID,
                        value: dr.value()
                    }
                })
            }

            console.log('saveChanges calling with', data);

            fetch('/api/DailyBankingStatisticsAPI/SaveChanges', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-cache',
                credentials: 'same-origin',
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.busy(false);
                    self.dirtyRecords().forEach(r => {
                        r.originalValue(r.value());
                    });
                    window.showInfo('Success', 'Saved successfully.');
                    self.reload();
                })
                .catch(err => {
                    self.busy(false)
                    window.catchFetchError(err);
                })
        } else {
            window.showInfo('Information', 'You have no pending changes to save.');
        }
    }

    self.showBreakdownModal = (cell) => {
        console.log('showBreakdownModal', cell);
        if (cell.breakdownEnabled()) {
            self.breaker.loadAndShow(cell);
        }
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};