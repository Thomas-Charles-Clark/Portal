const EMPTY_STRING = '';

const advertiserMaintenanceViewModel = (() => {
    var self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable("Please wait");
    
    // exists just to satisfy demand from generic-form-fields.js:28
    self.parent = {
        ready: ko.observable(true)
    }

    self.validateNow = ko.observable(false);

    self.salesMarketId = ko.observable(getPreselectedSalesMarketId());

    self.salesMarket = ko.observable();

    self.advertiserClassId = ko.observable('');

    self.advertiserClass = ko.observable();

    self.filteredContent = ko.observableArray([]);

    self.attributes = ko.observableArray([]);

    self.visibleTradeAccounts = ko.observableArray([]);

    self.page = ko.observable(1);

    self.pageSize = ko.observable(25);

    self.addingToAdvertisingClass = ko.observable().extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must specify an Advertising Class to add to'
        }
    });

    self.addingTradeAccountModalElement = document.querySelector('#add-trade-account-modal');

    self.addingTradeAccountModal = bootstrap.Modal.getOrCreateInstance(self.addingTradeAccountModalElement);

    self.addingTradeAccountId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must specify a Trade Account to add'
        }
    });

    self.addingTradeAccount = ko.observable();

    self.searchingTradeAccountId = ko.observable();

    self.searchingTradeAccount = ko.observable();

    self.removeTradeAccountFromAdvertiserClass = (tradeAccount) => {

        let advertiserClass = self.addingToAdvertisingClass();

        window.showConfirm('Are you sure?', `This will remove "${tradeAccount.ShortLabel}" from Advertiser Class "${advertiserClass.Name}"`, () => {
            self.busy(true);

            let params = {
                tradeAccountId: tradeAccount.TradeAccountID,
                advertiserClassId: advertiserClass.AdvertiserClassID,
            }

            fetch('/api/AdvertiserMaintenanceAPI/RemoveTradeAccountFromAdvertiserClass', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-cache',
                credentials: 'same-origin',
                body: JSON.stringify(params)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.addingTradeAccountModal.hide();
                    self.advertiserClassGridParams.widget().dataSource.read();
                    self.busy(false);
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                })

        }, null);
    }

    self.detailExportPromises = [];

    //#endregion


    //#region Components (Knockout-specific)

    self.salesMarketParams = kendoMDCDropDownList({
        label: 'Market',
        odata: true,
        endPoint: '/odata/SalesMarkets',
        textField: 'Label',
        valueField: 'SalesMarketID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/SalesMarkets/Default.SalesMarketValueMapper(salesMarketId=${options.value})`,
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
        idObservable: self.salesMarketId,
        objObservable: self.salesMarket,
        enable: ko.observable(true),
        disable: ko.observable(getPreselectedSalesMarketId() != ''),
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'SalesMarketID'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: function (e) {
            console.log('salesMarketParams dataBound', e);
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

    self.advertiserClassParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Advertiser Class',
        odata: true,
        endPoint: '/odata/AdvertiserClasses',
        textField: 'Name',
        valueField: 'AdvertiserClassID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/AdvertiserClasses/Default.AdvertiserClassValueMapper(advertiserClassId=${options.value})?$expand=TradeAccounts`,
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
        idObservable: self.advertiserClassId,
        objObservable: self.advertiserClass,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'AdvertiserClassID'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: function (e) {

        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        },
    });

    self.tradeAccountSearchParams = kendoMDCDropDownList({
        label: 'Trade Account',
        autoBind: true,
        odata: true,
        endPoint: '/odata/TradeAccounts',
        textField: 'ShortLabel',
        valueField: 'TradeAccountID',
        virtual: true,
        pageSize: 10,
        busy: ko.observable(),
        minLength: 2,
        enforceMinLength: true,
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
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: `#: ShortLabel #`,
        valueTemplate: `#: ShortLabel #`,
        noDataTemplate: `No Trade Accounts Found`,
        idObservable: self.searchingTradeAccountId,
        objObservable: self.searchingTradeAccount,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'equals',
        height: 340,
        sort: [{
            dir: 'asc',
            field: 'Code'
        }],
        requestStart: (e) => {
            self.tradeAccountSearchParams.busy(true);
        },
        requestEnd: (e) => {
            console.log(e);
            self.tradeAccountSearchParams.busy(false);
        },
        clearFunction: () => {
            self.tradeAccountSearchParams.dropDownListSettings.widget().select(-1);
            self.tradeAccountSearchParams.dropDownListSettings.widget().trigger('change');
        },
        afterClear: () => {
            self.searchingTradeAccount(undefined);
        },
        select: (e) => {
            console.log('tradeAccountSearcher select', e);
            if (e.dataItem.AdvertiserClassID == null) {
                window.showInfo('Info', `Trade Account "${e.dataItem.ShortLabel}" is not a member of any Advertiser Group.`);
                self.tradeAccountSearchParams.clearFunction();
            } else {
                self.salesMarketParams.dropDownListSettings.widget().value(e.dataItem.SalesMarketID);
                self.salesMarketParams.dropDownListSettings.widget().trigger('change');
                self.advertiserClassParams.dropDownListSettings.widget().value(e.dataItem.AdvertiserClassID);
                self.advertiserClassParams.dropDownListSettings.widget().trigger('change');
            }
        },
        parameterMap: (data) => {

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            let filters = [];

            if (d.$filter != null) {
                let value = data.filter.filters[0].value;
                d.$filter = `(startswith(Code, '${value}') or contains(Name, '${value}'))`
            }

            //else {

            //}

            //if (self.salesMarketId()) {
            //    if (d.$filter == null) {
            //        d.$filter = `(SalesMarketID eq ${self.salesMarketId()})`;
            //    } else {
            //        d.$filter += ` and (SalesMarketID eq ${self.salesMarketId()})`;
            //    }
            //}

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        }
    });

    self.advertiserClassGridParams = {
        autoBind: false,
        widget: ko.observable(),
        selectable: false,
        columns: [{
            field: 'Name',
            title: 'Advertiser Class'
        }, {
            field: 'ImaginaryField',
            title: 'Members',
            template: (e) => {
                let length = e.TradeAccounts.length;
                return `${length}`;
            },
            filterable: false
        }],
        detailTemplate: kendo.template($("#detail-template").html()),
        detailInit: (e) => {

            // initiallize a new jQuery Deferred http://api.jquery.com/jQuery.Deferred/
            let deferred = $.Deferred();

            self.detailExportPromises.push(deferred);

            let detailRow = e.detailRow;

            let masterRowIndex = e.masterRow.index(".k-master-row");

            window.setTimeout(() => {

                let dataItem = self.advertiserClassGridParams.widget().dataSource.getByUid(e.masterRow.data("uid")); 

                let model = {
                    gridParams: {
                        useKOTemplates: true,
                        rowTemplate: 'trade-account-row-template',
                        data: dataItem.TradeAccounts.map(ta => Object.assign(ta, { AdvertiserClassName: dataItem.Name })).sort((a, b) => {
                            return a.Code > b.Code ? 1 : -1
                        }),
                        sortable: true,
                        columns: [
                            {
                                field: "Code",
                                title: "Code",
                                width: "90px",
                                sortable: true
                            }, {
                                field: 'Name',
                                title: 'Name',
                                width: "500px",
                                sortable: true
                            }, {
                                field: 'AdvertiserSinceDT',
                                title: 'Member Since',
                                sortable: true
                            },
                            {
                                field: "AdvertiserClassName",
                                title: " ",
                                width: "39px",
                                headerTemplate: (e) => {
                                    self.addingToAdvertisingClass(dataItem);
                                    return `<button type="button" class="btn p-0 fs-4" data-bs-toggle="modal" data-bs-target="#add-trade-account-modal"><i class="bi bi-plus-lg"></i></button>`;
                                },
                                sortable: false,
                                exportable: true,
                                headerAttributes: {
                                    class: "bg-green-100"
                                }
                            }
                        ],
                        excelExport: function (e) {
                            e.preventDefault();

                            deferred.resolve({
                                masterRowIndex: masterRowIndex,
                                sheet: e.workbook.sheets[0]
                            })
                        }
                    },
                    removeTradeAccountFromAdvertiserClass: self.removeTradeAccountFromAdvertiserClass
                }

                ko.applyBindings(model, detailRow[0]);
            }, 0);
        },
        group: [{
            field: 'AdvertiserClassID'
        }],
        noDataTemplate: () => {
            if (!self.salesMarketId())
                return 'Please select a Sales Market';
        },
        editable: false,
        data: new kendo.data.DataSource({
            serverFiltering: true,
            serverSorting: true,
            serverGrouping: true,
            serverPaging: true,
            pageSize: self.pageSize(),
            type: 'odata-v4',
            aggregate: [],
            transport: {
                read: {
                    url: () => `/odata/AdvertiserClasses?$expand=TradeAccounts`,
                },
                parameterMap: (data, type) => {

                    let d = kendo.data.transports['odata-v4'].parameterMap(data);

                    delete d.$inlinecount; // <-- remove inlinecount
                    delete d.$format; // <-- remove format
                    delete d.$callback; // <-- remove callback

                    d.$count = true;

                    if (d.$filter != null) {
                        let value = data.filter.filters[0].value;
                        d.$filter = `(startswith(Code, '${value}') or contains(Name, '${value}'))`
                    } else {

                    }

                    if (+self.salesMarketId()) {
                        if (d.$filter == null) {
                            d.$filter = `TradeAccounts/any(t: t/SalesMarketID eq ${self.salesMarketId()})`
                        } else {
                            d.$filter += ` and TradeAccounts/any(t: t/SalesMarketID eq ${self.salesMarketId()})`
                        }
                    }

                    if (+self.advertiserClassId()) {
                        if (d.$filter == null) {
                            d.$filter = `(advertiserClassId eq ${self.advertiserClassId()})`
                        } else {
                            d.$filter += ` and (advertiserClassId eq ${self.advertiserClassId()})`
                        }
                    }

                    return d;
                }
            },
            sort: [{
                field: 'AdvertiserClassID',
                dir: 'asc'
            }],
            schema: {
                model: {
                    id: 'AdvertiserClassID',
                    fields: {
                        AdvertiserClassID: { type: 'number' },
                        Name: { type: 'string' },
                        TradeAccounts: { type: 'object' }
                    }
                }
            },
            requestStart: (e) => {
                console.log('advertiserClassGridParams.dataSource.requestStart', e);
                self.busy(true);
            },
            requestEnd: (e) => {
                console.log('advertiserClassGridParams.dataSource.requestEnd', e);
                self.busy(false);
            },
        }),
        sortable: true,
        filterable: {
            extra: false,
            operators: {
                string: {
                    contains: "Contains",
                    eq: "Equal to",
                    neq: "Not equal to"
                }
            }
        },
        pageable: false,
        dataBound: function (e) {
            console.log('advertiserClassGridParams.dataBound'. e)
            self.detailExportPromises = [];
            if (self.advertiserClassId()) {
                let model = self.advertiserClassGridParams.widget().dataSource.get(self.advertiserClassId());
                let rowIndex = self.advertiserClassGridParams.widget().dataSource.indexOf(model);
                self.advertiserClassGridParams.widget().expandRow(this.tbody[0].querySelectorAll("tr.k-master-row")[rowIndex]);
            } else {
                self.advertiserClassGridParams.widget().expandRow(this.tbody.find("tr.k-master-row").first());
            }
        },
        excelExport: function (e) {
            // prevent saving the file because we will update the workbook
            e.preventDefault();

            self.busy(true);

            var workbook = e.workbook;

            let headerCell = {
                background: '#7a7a7a',
                color: '#fff',
                colSpan: 1,
                rowSpan: 1
            }

            workbook.sheets[0].rows[0].cells[0].value = 'Advertiser Class';

            workbook.sheets[0].rows[0].cells[1].value = 'Trade Account Code';

            workbook.sheets[0].columns.push({
                width: NaN,
                autoWidth: true
            });

            workbook.sheets[0].rows[0].cells.push(Object.assign({
                value: 'Trade Account Name'
            }, headerCell));

            workbook.sheets[0].columns.push({
                width: 94,
                autoWidth: false
            });

            workbook.sheets[0].rows[0].cells.push(Object.assign({
                value: 'Member Since'
            }, headerCell));

            workbook.sheets[0].rows.splice(1);

            for (var i = 0; i < self.advertiserClassGridParams.widget().items().length; i++) {
                var item = self.advertiserClassGridParams.widget().items()[i]
                self.advertiserClassGridParams.widget().expandRow(item);
            };

            window.setTimeout(() => {

                // Export all detail grids
                document.querySelectorAll("#membership-grid [data-role=grid]").forEach(e => {
                    $(e).data("kendoGrid").saveAsExcel();
                });

                // wait for all detail grids to finish exporting
                $.when.apply(null, self.detailExportPromises).then(function () {
                    // get the export results
                    var detailExports = $.makeArray(arguments);

                    /*
                       need to recalculate the master row indexes of each export
                       everytime you click expand in the master grid, the master row indexes are recalculated by Kendo
                       e.g. you expand row 4 (which will display a grid with 6 rows), then you expand row 1 (which will display a grid with 12 rows)
                       when you do this, the index of "row 4" is updated with 4 + 12. So the new index of "row 4" is actually 16
                    */

                    // first we need to create a copy of the original values, otherwise every subsequent export will have the already updated rows and it will try to update again
                    for (var i = 0; i < detailExports.length; i++)
                        detailExports[i].newMasterRowIndex = detailExports[i].masterRowIndex;

                    for (var i = 1; i < detailExports.length; i++) {
                        for (var j = 0; j < i; j++) {
                            if (detailExports[i].newMasterRowIndex <= detailExports[j].newMasterRowIndex) {
                                detailExports[j].newMasterRowIndex = detailExports[j].newMasterRowIndex + detailExports[i].sheet.rows.length - 1; // -1 to discount header
                                if (detailExports[i].sheet.rows[detailExports[i].sheet.rows.length - 1].type == "footer")
                                    detailExports[j].newMasterRowIndex = detailExports[j].newMasterRowIndex - 1
                            }
                        }
                    }

                    // sort by masterRowIndex
                    detailExports.sort(function (a, b) {
                        return a.newMasterRowIndex - b.newMasterRowIndex;
                    });

                    // merge the detail export sheet rows with the master sheet rows
                    var rowCount = 0;
                    for (var i = 0; i < detailExports.length; i++) {
                        // and not simply after it as you would normally do when you have only two grids
                        var masterRowIndex = rowCount + detailExports[i].newMasterRowIndex + 1; // +1 to compensate for the header row

                        var sheet = detailExports[i].sheet;

                        if (sheet.rows[0].type == "header")
                            sheet.rows.splice(0, 1); // don't export the header

                        if (sheet.rows[sheet.rows.length - 1].type == "footer")
                            sheet.rows.splice(-1, 1); // don't export the footer

                        // prepend an empty cell to each row
                        for (var ci = 0; ci < sheet.rows.length; ci++) {

                            //sheet.rows[ci].cells.reverse();
                            // Code, Name, MemberSince, Class
                            // needs to become
                            // Class, Code, Name, MemberSince

                            sheet.rows[ci].cells.unshift(sheet.rows[ci].cells.splice(-1, 1)[0]);

                            sheet.rows[ci].cells[3].value = sheet.rows[ci].cells[3].value.substring(0, 10);

                            //if (sheet.rows[ci].cells[0].value) {
                            //    sheet.rows[ci].cells.unshift({});
                            //}

                            //for (var cellIndex = 1; cellIndex < sheet.rows[ci].cells.length; cellIndex++) {

                            //        sheet.rows[ci].cells[cellIndex].color = "#000";
                            //        sheet.rows[ci].cells[cellIndex].background = "#fff";
                            //}
                        }

                        let dataRows = sheet.rows;

                        let sortedRows = dataRows.sort((a, b) => {
                            if (a.cells[0].value > b.cells[0].value)
                                return 1
                            if (a.cells[0].value < b.cells[0].value)
                                return - 1;
                            if (a.cells[1].value > b.cells[1].value)
                                return 1;
                            if (a.cells[1].value < b.cells[1].value)
                                return -1;
                        });

                        sheet.rows = sortedRows;

                        rowCount = rowCount + 1;

                        // insert the detail sheet rows in the correct place
                        [].splice.apply(workbook.sheets[0].rows, [masterRowIndex + 1, 0].concat(sheet.rows));
                    }

                    // update the indexes of the rows so they are exported correctly
                    for (var i = 0; i < workbook.sheets[0].rows.length; i++) {
                        workbook.sheets[0].rows[i].index = i;
                    }

                    // save the workbook
                    kendo.saveAs({
                        dataURI: new kendo.ooxml.Workbook(workbook).toDataURL(),
                        fileName: `Designers-Guild-Advertisers_${self.salesMarket().Name.replace(' ', '_')}.xlsx`
                    })

                    self.busy(false);
                });
            }, 0);

        }
    }

    self.tradeAccountSelectorParams = kendoMDCDropDownList({
        label: 'Trade Account',
        autoBind: true,
        odata: true,
        endPoint: '/odata/TradeAccounts',
        textField: 'ShortLabel',
        valueField: 'TradeAccountID',
        virtual: true,
        pageSize: 10,
        busy: ko.observable(),
        minLength: 2,
        enforceMinLength: true,
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
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: `#: ShortLabel #`,
        valueTemplate: `#: ShortLabel #`,
        noDataTemplate: `No Trade Accounts Found`,
        idObservable: self.addingTradeAccountId,
        objObservable: self.addingTradeAccount,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'equals',
        height: 340,
        sort: [{
            dir: 'asc',
            field: 'Code'
        }],
        requestStart: (e) => {
            self.tradeAccountSelectorParams.busy(true);
        },
        requestEnd: (e) => {
            console.log(e);
            self.tradeAccountSelectorParams.busy(false);
        },
        clearFunction: () => {
            self.tradeAccountSelectorParams.dropDownListSettings.widget().select(-1);
        },
        afterClear: () => {
            self.addingTradeAccount(undefined);
        },
        parameterMap: (data) => {

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            let filters = [];

            if (d.$filter != null) {
                let value = data.filter.filters[0].value;
                d.$filter = `(startswith(Code, '${value}') or contains(Name, '${value}'))`
            } else {

            }

            if (self.salesMarketId()) {
                if (d.$filter == null) {
                    d.$filter = `(SalesMarketID eq ${self.salesMarketId()})`;
                } else {
                    d.$filter += ` and (SalesMarketID eq ${self.salesMarketId()})`;
                }
            }

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        },
        popupSettings: {
            appendTo: '#add-trade-account-modal'
        }
    });

    //#endregion


    //#region Subscriptions

    self.salesMarketId.subscribe(nv => {
        console.log('salesMarketId', nv);
        self.advertiserClassGridParams.widget().dataSource.read();
    });

    self.searchingTradeAccountId.subscribe(nv => {
        if (nv) {
            if (self.advertiserClassId()) {
                if (self.advertiserClassGridParams.widget().expandRow(self.advertiserClassGridParams.widget())) {
                    let model = self.advertiserClassGridParams.widget().dataSource.get(self.advertiserClassId());
                    let rowIndex = self.advertiserClassGridParams.widget().dataSource.indexOf(model);
                    self.advertiserClassGridParams.widget().expandRow(self.advertiserClassGridParams.widget().tbody[0].querySelectorAll("tr.k-master-row")[rowIndex]);
                }
            } else {
                if (self.advertiserClassGridParams.widget().expandRow(self.advertiserClassGridParams.widget()))
                    self.advertiserClassGridParams.widget().expandRow(self.advertiserClassGridParams.widget().tbody.find("tr.k-master-row").first());
            }
        }
    });

    //#endregion


    //#region Computeds



    //#endregion


    //#region Validation Groups

    self.errors = ko.validation.group([
        self.addingTradeAccountId,
        self.addingToAdvertisingClass
    ]);

    //#endregion


    //#region Methods

    self.reset = () => {
        self.errors.showAllMessages(false);
    }

    self.setTest = () => {

    }

    self.addTradeAccountToAdvertiserClass = () => {

        self.validateNow(true);

        if (self.errors().length) {
            self.errors.filter(x => {
                x.isValid.notifySubscribers(x.isValid())
            });
        } else {

            let tradeAccount = self.addingTradeAccount();
            let advertiserClass = self.addingToAdvertisingClass();

            window.showConfirm('Are you sure?', `This will add "${tradeAccount.ShortLabel}" to Advertiser Class "${advertiserClass.Name}"`, () => {
                self.busy(true);

                let params = {
                    tradeAccountId: tradeAccount.TradeAccountID,
                    advertiserClassId: advertiserClass.AdvertiserClassID,
                }

                fetch('/api/AdvertiserMaintenanceAPI/AddTradeAccountToAdvertiserClass', {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    body: JSON.stringify(params)
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        self.addingTradeAccountModal.hide();
                        self.advertiserClassGridParams.widget().dataSource.read();
                        self.busy(false);
                    })
                    .catch(err => {
                        self.busy(false);
                        window.catchFetchError(err);
                    })

            }, null);
        }
    }

    self.downloadtoExcel = () => {
        self.advertiserClassGridParams.widget().saveAsExcel();
    }

    //#endregion


    //#region Events

    self.addingTradeAccountModalElement.addEventListener('bs.modal.hide', () => {
        self.addingTradeAccount(undefined);
        self.addingToAdvertisingClass(undefined);
    })

    //#endregion

    return self;
});