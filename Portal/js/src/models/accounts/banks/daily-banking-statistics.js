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

    self.responseValues = ko.observableArray([]);

    self.responseRows = ko.observableArray([]);

    self.responseColumns = ko.observableArray([]);

    self.gridColumns = ko.observableArray([]);

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

        var additionalParameters = {
            date: self.date().toUTCString()
        };

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

                        self.responseValues(data.values);
                        self.responseColumns(data.columns);
                        self.responseRows(data.rows);

                        self.gridColumns([{
                            field: 'Label',
                            title: ' ',
                            attributes: {
                                class: 'row-label-cell'
                            },
                            width: '240px',
                            editable: () => false,
                            template: (dataItem) => {
                                return `<span>${dataItem.Label}</span><a class="stretched-link" href="javascript:;" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${dataItem.Tooltip}"></a>`;
                            },
                            locked: true
                        },
                        ...data.columns.map(c => {
                            return {
                                field: c.Label,
                                title: c.Label,
                                attributes: {
                                    'class': ''
                                },
                                width: c.WidthPixels ?? 160,
                                editable: () => false,
                                template: (dataItem) => dataItem.template(c),
                                headerTemplate: (dataItem) => {
                                    return `<span>${c.Label}</span><a class="stretched-link" href="javascript:;" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${c.Tooltip}"></a>`
                                }
                            }
                        })]);

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
        pageSize: 20,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
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
                    SortOrder: { type: 'number' }
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
        requestStart: function (e) {
            console.log('requestStart', e);
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

    self.gridParams = {
        autoBind: true,
        widget: self.gridWidget,
        columns: self.gridColumns(),
        editable: true,
        batch: true,
        toolbar: ["save", "cancel"],
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
        dataBound: (e) => {

            console.log('dataBound');

            ko.ignoreDependencies(() => {

                ko.utils.arrayForEach(e.sender.dataSource.view(), function (item, index) {

                    // this is necessary because if you have locked columns you will have multiple <tr> sharing the one uid
                    let rows = document.querySelectorAll('tr[data-uid="' + item.uid + '"]');

                    rows.forEach(row => {

                        ko.cleanNode(row);

                        let cells = row.querySelectorAll('td');

                        cells.forEach((c, i) => {
                            ko.cleanNode(c);
                            ko.applyBindings(item.cells()[i], c);
                        })
                    });
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

            $(".k-grid-save-changes").hide();
            $(".k-grid-cancel-changes").hide();
        },
        saveChanges: (e) => {
            console.log('saveChanges', e);

            self.saveChanges();
        },
        cancel: (e) => {
            console.log('cancel');

            var saveBtn = e.sender.element.find(".k-grid-save-changes");
            var cancelBtn = e.sender.element.find(".k-grid-cancel-changes");

            saveBtn.hide();
            cancelBtn.hide();

            self.dirtyRecords().filter(x => {
                x.value(x.originalValue());
            });
        },
        sortable: true,
        filterable: false,
        reorderable: true,
        pageable: {
            pageSize: 20,
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

    self.date.subscribe(nv => {
        self.reload();
    });

    //#endregion



    //#region Methods

    self.init = () => {

    }

    self.cancelChanges = () => {
        self.dirtyRecords().forEach(r => {
            r.value(r.originalValue());
        })
        self.gridWidget().dataSource.cancelChanges(); // Force the actual data revert
    }

    self.reload = () => {
        if (self.gridWidget()) {
            self.gridWidget().dataSource.data([]);
            self.gridWidget().dataSource.query({
                page: 1,
                pageSize: self.gridWidget().dataSource.pageSize()
            });
        }
    }

    self.saveChanges = () => {
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
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};