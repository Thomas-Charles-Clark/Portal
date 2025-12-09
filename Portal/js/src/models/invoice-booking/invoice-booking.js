const invoiceBookingViewModel = ({
    mailboxId
} = {
    mailboxId: 1
}) => {
    let self = Object.assign({}, {
        mailboxId
    });

    //#region Properties

    self.busy = ko.observable(true);

    self.busyMessage = ko.observable("Loading");

    self.firstLight = ko.observable(true);

    // begin in the 'root' folder
    self.currentMailboxFolderId = ko.observable(null);

    self.mailboxFolders = ko.observableArray([]);

    self.selectedEmail = ko.observable();

    self.mode = ko.observable('emails');

    self.modalElement = document.getElementById('email-modal');

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

    self.documentViewerModalElement = document.getElementById('document-viewer-modal');

    self.documentViewerModal = bootstrap.Modal.getOrCreateInstance(self.documentViewerModalElement);

    self.modalBusy = ko.observable(false);

    self.modalBusyMessage = ko.observable('Please wait');

    self.itemCount = ko.observable();

    self.documentCount = ko.observable();

    self.selectedIndex = ko.observable();

    self.selectedDocumentIndex = ko.observable();
    
    self.gridGroupCount = ko.observable(1);

    self.invoiceRegistrationSubmissionSuspended = ko.observable(window.getInvoiceRegistrationSubmissionSuspended());

    self.testDateInput = ko.observable();

    self.testDateOutput = ko.observable();

    self.testDateComputer = ko.computed(() => {

        let input = self.testDateInput();

        if (input) {

            let matches = input.matchAll(/(\d+)[\/-](\d+)[\/-](\d+)/g);

            let output = null;

            matches.forEach(match => {
                console.log('match', match);

                let inputDay = match[1];
                let inputMonth = match[2];
                let inputYear = match[3];

                let outputDay = inputDay.padStart(2, '0');
                let outputMonth = inputMonth.padStart(2, '0');
                let outputYear = inputYear;

                if (outputYear.length == 2) {
                    outputYear = `20${outputYear}`;
                }

                output = `${outputDay}/${outputMonth}/${outputYear}`

                ko.ignoreDependencies(() => {
                    self.testDateOutput(output);
                });
            });
        }

    });

    self.emailGridTabButton = document.querySelector('#emails-grid-tab');

    self.documentGridTabButton = document.querySelector('#documents-grid-tab');

    self.documentGridSelectAllToggleState = ko.observable(false);

    self.documentGridResultSetKeys = ko.observableArray([]);

    self.documentGridSelectedKeys = ko.observableArray([]);

    self.mailboxGridParamsWidget = ko.observable();

    self.documentGridParamsWidget = ko.observable();

    //#endregion


    //#region Lifted Bits

    self.getParameters = () => {
        let data = {
            mailboxId: self.mailboxId,
            dateRangeId: self.filters.dateRangeId() ?? null,
            fromDt: typeof self.filters.fromDate() == 'object' ? self.filters.fromDate().toUTCString() : self.filters.fromDate(),
            toDt: typeof self.filters.toDate() == 'object' ? self.filters.toDate().toUTCString() : self.filters.toDate()
        }

        data = Object.assign({
            emailStatusId: self.filters.emailStatusId() ?? null,
        }, data);

        if (self.filters.departmentIds().length) {
            data.activeDirectoryGroupIds = self.filters.departmentIds();
        }

        if (self.filters.budgetHolderCode()) {
            data.budgetHolderCode = self.filters.budgetHolderCode()
        }

        if (self.filters.supplierCode()) {
            data.supplierCode = self.filters.supplierCode()
        }

        if (self.filters.freeTextSearch()) {
            data.freeTextSearch = self.filters.freeTextSearch();
        }

        return data;
    }

    self.getDocumentsParameters = () => {
        let data = {
            mailboxId: self.mailboxId
        }

        data = Object.assign({
            emailStatusId: self.documentFilters.emailStatusId() ?? null,
            dateRangeId: self.documentFilters.documentDateRangeId() ?? null,
            fromDt: typeof self.documentFilters.documentFromDate() == 'object' ? self.documentFilters.documentFromDate().toUTCString() : self.documentFilters.documentFromDate(),
            toDt: typeof self.documentFilters.documentToDate() == 'object' ? self.documentFilters.documentToDate().toUTCString() : self.documentFilters.documentToDate()

        }, data);

        if (self.documentFilters.departmentIds().length) {
            data.activeDirectoryGroupIds = self.documentFilters.departmentIds();
        }

        if (self.documentFilters.budgetHolderCode()) {
            data.budgetHolderCode = self.documentFilters.budgetHolderCode()
        }

        if (self.documentFilters.supplierCode()) {
            data.supplierCode = self.documentFilters.supplierCode()
        }

        if (self.documentFilters.freeTextSearch()) {
            data.freeTextSearch = self.documentFilters.freeTextSearch();
        }

        if (self.documentFilters.documentTypeId()) {
            data.attachmentTypeId = self.documentFilters.documentTypeId();
        }

        if (self.documentFilters.documentStatusId()) {
            data.attachmentStatusId = self.documentFilters.documentStatusId();
        }

        if (self.documentFilters.documentDateAffectorId()) {
            data.dateAffectorId = self.documentFilters.documentDateAffectorId();
            data.dateAffector = ko.unwrap(self.documentFilters.documentDateAffector()).name;
        }

        return data;
    }

    //#endregion


    //#region Components

    self.dashboard = invoiceBookingDashboardViewModel({
        parent: self
    });

    self.filters = invoiceBookingFiltersViewModel({
        parent: self,
        appendTo: '#email-grid-prefilters'
    });

    self.documentFilters = invoiceBookingFiltersViewModel({
        parent: self,
        appendTo: '#document-grid-prefilters'
    });

    self.mailboxGridParams = {
        widget: self.mailboxGridParamsWidget,
        columns: [{
            title: 'Supplier',
            field: 'SupplierCode',
            width: 200,
            filterable: false,
            template: (e) => {
                if (e.Supplier)
                    return `${e.SupplierCode} - ${e.Supplier.Name}`;
                else
                    return '';
            },
            groupHeaderTemplate: (e) => {
                if (e.SupplierCode) {
                    return `Supplier: ${e.SupplierCode} - ${e.Supplier.Name}`;
                } else {
                    return `Supplier: Not Identified`
                }
            }
        }, {
            field: 'FromEmail',
            title: 'From',
            width: 300,
            filterable: true,
            template: (e) => {
                return e.FromEmail;
            }
        }, {
            field: 'Subject',
            title: 'Subject',
            template: (e) => {
                if (e.Subject)
                    return e.Subject;
                else
                    return '';
            }
        }, {
            field: 'ReceivedDT',
            title: 'Received',
            width: 132,
            template: `#:moment(ReceivedDT).format('DD/MM/YYYY HH:mm')#`,
            attributes: {
                title: `#:moment(ReceivedDT).format('dddd Do MMM YYYY HH:mm')#`
            }
        }, {
            field: 'BudgetHolderCode',
            title: 'Budget Holder',
            width: 240,
            filterable: false,
            template: (e) => {
                if (e.Supplier)
                    if (e.Supplier.BudgetHolder == null)
                        return 'n/a';
                    else
                        return e.Supplier.BudgetHolder.Name;
                else
                    return '';
            }
        }, {
            field: 'RegularAttachmentCount',
            title: "<span class='b bi-paperclip fs-4'></span>",
            width: 80,
            headerAttributes: {
                class: 'text-center attachment-count-header-cell'
            },
            sortable: true,
            filterable: {
                extra: false
            },
            template: (e) => {
                if (e.RegularAttachmentCount) {
                    return `<i class="bi bi-paperclip" title="${e.RegularAttachmentCount} attachment${(e.RegularAttachmentCount > 1 ? 's' : '')}"></i>`;
                } else {
                    return '';
                }
            }
        }, {
            title: 'SearchKeywords',
            field: 'SearchKeywords',
            hidden: true,
            template: ''
        }],
        data: new kendo.data.DataSource({
            pageSize: 20,
            transport: {
                read: (options) => {

                    self.busy(true);

                    let data = {};

                    ko.ignoreDependencies(() => {
                        data = self.getParameters();
                    });

                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var params = webapi.parameterMap(options.data);

                    for (let propertyName in params) {
                        data[propertyName] = params[propertyName];
                    }

                    console.log('mailboxGrid calling with', data);

                    var params = new URLSearchParams();

                    for (var propertyName in data) {
                        if (Array.isArray(data[propertyName])) {
                            data[propertyName].forEach(v => {
                                params.append(propertyName, v);
                            })
                        } else {
                            params.append(propertyName, data[propertyName]);
                        }
                    }

                    fetch('/api/InvoiceBookingAPI/MailboxGrid?' + params, {
                        method: 'GET',
                        cache: 'no-cache',
                        headers: window.fetchHeaders
                    })
                        .then(window.handleFetchResponse)
                        .then(data => {

                            console.log('mailboxGrid returned', data);

                            self.itemCount(data.Total);

                            if (self.mailboxGridParams.widget().dataSource.group().length) {
                                data.Data = data.Data.map(dat => {
                                    dat.Items = dat.Items.map(d => invoiceBookingEmailViewModel({
                                        parent: self,
                                        rec: d,
                                        gridWidget: self.mailboxGridParamsWidget
                                    }));
                                    return dat;
                                })
                            } else {
                                data.Data = data.Data.map(d => invoiceBookingEmailViewModel({
                                    parent: self,
                                    rec: d,
                                    gridWidget: self.mailboxGridParamsWidget
                                }));
                            }

                            ko.ignoreDependencies(() => {
                                options.success(data);

                                self.busy(false);
                            })
                        })
                        .catch(err => {
                            self.busy(false);
                            window.catchFetchError(err);
                            options.error();
                        })
                },
                contentType: 'application/json',
                dataType: 'json'
            },
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                aggregates: "AggregateResults",
                model: {
                    id: "EmailID",
                    fields: {
                        EmailID: { type: 'number', editable: false },
                        EmailMessageID: { type: 'string', editable: false },
                        FromEmail: { type: 'string', editable: false },
                        EmailStatusID: { type: 'number', editable: false },
                        EmailStatus: {
                            type: 'object',
                            fields: {
                                EmailStatusID: { type: 'string', editable: false },
                                Name: { type: 'string', editable: false }
                            }
                        },
                        FromName: { type: 'string', editable: false },
                        Subject: { type: 'string', editable: false },
                        BodyPreview: { type: 'string', editable: false },
                        ProcessedDT: { type: 'datetime', editable: false },
                        Processed: { type: 'boolean', editable: false },
                        ProcessedMemberID: { type: 'number', editable: false },
                        SupplierCode: { type: 'string', editable: false },
                        EmailStatusID: { type: 'number', editable: false },
                        RegularAttachmentCount: { type: 'number', editable: false },
                        Forwarded: { type: 'boolean', editable: false },
                        ForwardedDT: { type: 'datetime', editable: false },
                        ForwardedToMemberID: { type: 'number', editable: false },
                        ForwardedToMember: {
                            type: 'object',
                            fields: {
                                FullName: { type: 'string', editable: false },
                                Email: { type: 'string', editable: false }
                            }
                        },
                        ForwardedByMemberID: { type: 'number', editable: false },
                        ForwardedByMember: {
                            type: 'object',
                            fields: {
                                FullName: { type: 'string', editable: false },
                                Email: { type: 'string', editable: false }
                            }
                        },
                        Supplier: {
                            type: 'object',
                            fields: {
                                Code: { type: 'string', editable: false },
                                Name: { type: 'number', editable: false },
                                SupplierType: {
                                    type: 'object',
                                    fields: {
                                        Code: { type: 'string', editable: false },
                                        Name: { type: 'string', editable: false }
                                    }
                                }
                            }
                        },
                        SearchKeywords: { type: 'string', editable: false },
                        BankDetails: {
                            type: 'object',
                            fields: {
                                BankName: { type: 'string', editable: false },
                                AccountNumber: { type: 'string', editable: false },
                                SortCode: { type: 'string', editable: false },
                                IBAN: { type: 'string', editable: false },
                                BIC: { type: 'string', editable: false }
                            }
                        }
                    }
                }
            }),
            sort: [{
                field: 'SupplierCode',
                dir: 'asc'
            }, {
                field: 'ReceivedDT',
                dir: 'asc'
            }],
            //group: {
            //    field: 'SupplierCode',
            //    dir: 'asc'
            //},
            serverFiltering: true,
            serverGrouping: true,
            serverPaging: true,
            serverAggregates: true,
            serverSorting: true,
            requestStart: (e) => {
                //console.log('mailboxGrid requestStart', e);
            },
            requestEnd: (e) => {
                //console.log('mailboxGrid requestEnd', e);

                self.dashboard.fetch();
            }
        }),
        useKOTemplates: true,
        rowTemplate: 'email-stub-row-template',
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        },
        selectable: 'single',
        sortable: true,
        filterable: true,
        groupable: false,
        change: (event, data) => {
            console.log('maibloxGrid change', event, data);

            let stub = event.sender.dataItem(event.sender.select());

            self.selectedIndex(event.sender.dataSource.indexOf(stub));

            self.loadEmail(stub);
        },
        select: (event) => {
            console.log('mailboxGrid select', event)
        },
        dataBound: (event) => {
            //console.log("mailboxGrid dataBound", event);
            self.gridGroupCount(event.sender.dataSource.group().length);
        }
    }

    self.documentGridParams = {
        autoBind: false,
        widget: self.documentGridParamsWidget,
        columns: [{
            headerTemplate: '<div class="form-checkbox"><input type="checkbox" class="form-check-input" onclick="viewModel.toggleDocumentsGridSelection()"/></div>',
            width: 34,
            exportable: false
        }, {
            title: 'Type',
            field: 'AttachmentTypeID',
            template: (e) => {
                if (e.AttachmentType) {
                    return e.AttachmentType.Name;
                } else {
                    return '';
                }
            },
            width: 140
        }, {
            title: 'Supplier Code',
            field: 'Supplier.Code',
            template: (e) => {
                if (e.Supplier) {
                    return e.Supplier.Code;
                } else {
                    return '';
                }
            },
            filterable: false
        }, {
            title: 'Supplier Name',
            field: 'Supplier.Name',
            template: (e) => {
                if (e.Supplier) {
                    return e.Supplier.Name
                } else {
                    return '';
                }
            },
            hidden: true
        }, {
            title: 'Budget Holder Code',
            field: 'BudgetHolder.Code',
            template: (e) => {
                if (e.BudgetHolder) {
                    return e.BudgetHolder.Code;
                } else {
                    return '';
                }
            },
        }, {
            title: 'Budget Holder Name',
            field: 'BudgetHolder.Name',
            template: (e) => {
                if (e.BudgetHolder) {
                    return e.BudgetHolder.Name;
                } else {
                    return '';
                }
            },
            hidden: true
        }, {
            title: 'Processed By',
            field: 'ProcessedByMemberID',
            template: (e) => {
                if (e.ProcessedBy) {
                    return e.ProcessedBy.FullName;
                } else {
                    return '';
                }
            },
        }, {
            field: 'AttachmentStatusName',
            title: 'Status',
            template: (e) => {
                if (e.AttachmentStatusName) {
                    return e.AttachmentStatusName;
                } else {
                    return '';
                }
            },
        }, {
            title: 'DG Reference',
            field: 'MertexCode',
            template: (e) => {
                if (e.MertexCode) {
                    return e.MertexCode;
                } else {
                    return '';
                }
            },
        }, {
            title: 'Supplier Reference',
            field: 'SupplierDocumentReference',
            template: (e) => {
                if (e.SupplierDocumentReference) {
                    return e.SupplierDocumentReference;
                } else {
                    return '';
                }
            },
        }, {
            field: 'ReceivedDT',
            title: 'Received Date',
            template: (e) => {
                if (e.ReceivedDT) {
                    return moment(ReceivedDT).format('DD/MM/YYYY HH:mm');
                } else {
                    return '';
                }
            },
            width: 142
        }, {
            field: 'DocumentDate',
            title: 'Document Date',
            template: (e) => {
                if (e.DocumentDate) {
                    return moment(DocumentDate).format('DD/MM/YYYY');
                } else {
                    return '';
                }
            },
            width: 150
        }, {
            field: 'DocumentDueDate',
            title: 'Due Date',
            template: (e) => {
                if (e.DocumentDueDate) {
                    return moment(DocumentDueDate).format('DD/MM/YYYY');
                } else {
                    return '';
                }
            },
            width: 142
        }, {
            field: 'DocumentTotalInc',
            title: 'Total',
            template: (e) => {
                if (e.DocumentTotalInc) {
                    return DocumentTotalInc;
                } else {
                    return '';
                }
            },
            width: 140
        }],
        data: new kendo.data.DataSource({
            pageSize: 20,
            transport: {
                read: (options) => {

                    self.busy(true);

                    let data = {};

                    ko.ignoreDependencies(() => {
                        data = self.getDocumentsParameters();
                    });

                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var params = webapi.parameterMap(options.data);

                    for (let propertyName in params) {
                        data[propertyName] = params[propertyName];
                    }

                    console.log('documentsGrid calling with', data);

                    var params = new URLSearchParams();

                    for (var propertyName in data) {
                        if (Array.isArray(data[propertyName])) {
                            data[propertyName].forEach(v => {
                                params.append(propertyName, v);
                            })
                        } else {
                            params.append(propertyName, data[propertyName]);
                        }
                    }

                    fetch('/api/InvoiceBookingAPI/DocumentsGrid?' + params, {
                        method: 'GET',
                        cache: 'no-cache',
                        headers: window.fetchHeaders
                    })
                        .then(window.handleFetchResponse)
                        .then(data => {

                            console.log('documentsGrid returned', data);

                            self.documentGridResultSetKeys(data.allKeys);

                            self.documentCount(data.dataSourceResult.Total);

                            if (self.documentGridParams.widget().dataSource.group().length) {
                                data.dataSourceResult.Data = data.dataSourceResult.Data.map(dat => {
                                    dat.Items = dat.Items.map(d => invoiceBookingEmailAttachmentViewModel({
                                        parent: Object.assign({
                                            EmailID: d.EmailID,
                                            EmailMessageID: d.EmailMessageID,
                                            ReceivedDT: d.ReceivedDT,
                                            parent: {
                                                // fake parents!
                                            }
                                        }, self),
                                        rec: d
                                    }));
                                    return dat;
                                })
                            } else {
                                data.dataSourceResult.Data = data.dataSourceResult.Data.map(d => invoiceBookingEmailAttachmentViewModel({
                                    parent: Object.assign({
                                        EmailID: d.EmailID,
                                        EmailMessageID: d.EmailMessageID,
                                        ReceivedDT: d.ReceivedDT,
                                        parent: {
                                        // fake parents!
                                        }
                                    }, self),
                                    rec: d
                                }));
                            }

                            ko.ignoreDependencies(() => {
                                options.success(data.dataSourceResult);

                                self.busy(false);
                            })
                        })
                        .catch(err => {
                            self.busy(false);
                            window.catchFetchError(err);
                            options.error();
                        })
                },
                contentType: 'application/json',
                dataType: 'json'
            },
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                aggregates: "AggregateResults",
                model: {
                    id: "AttachmentID",
                    fields: {
                        AttachmentID: { type: 'number', editable: false },
                        Supplier: {
                            type: 'object',
                            fields: {
                                Code: { type: 'string', editable: false },
                                Name: { type: 'number', editable: false },
                                SupplierType: {
                                    type: 'object',
                                    fields: {
                                        Code: { type: 'string', editable: false },
                                        Name: { type: 'string', editable: false }
                                    }
                                }
                            }
                        },
                        BudgetHolder: {
                            type: 'object',
                            fields: {
                                Code: { type: 'string', editable: false },
                                Name: { type: 'string', editable: false }
                            }
                        },
                        AttachmentStatusName: { type: 'string', editable: false },
                        AttachmentType: {
                            type: 'object',
                            fields: {
                                AttachmentTypeID: { type: 'number', editable: false },
                                Name: { type: 'string', editable: false } 
                            }
                        },
                        AttachmentTypeName: { type: 'string', editable: false },
                        Status: { type: 'string', editable: false },
                        ReceivedDT: { type: 'datetime', editable: false },
                        DocumentDate: { type: 'date', editable: false },
                        DocumentDueDate: { type: 'date', editable: false },
                        DocumentTotalInc: { type: 'number', editable: false },
                        SearchKeywords: { type: 'string', editable: false }
                    }
                }
            }),
            sort: [{
                field: 'ReceivedDT',
                dir: 'desc'
            }],
            //group: {
            //    field: 'SupplierCode',
            //    dir: 'asc'
            //},
            serverFiltering: true,
            serverGrouping: true,
            serverPaging: true,
            serverAggregates: true,
            serverSorting: true,
            requestStart: (e) => {
                //console.log('documentGrid requestStart', e);
            },
            requestEnd: (e) => {
                //console.log('documentGrid requestEnd', e);
                self.dashboard.documentsFetch();
            }
        }),
        useKOTemplates: true,
        rowTemplate: 'attachment-stub-row-template',
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200, 'all']
        },
        sortable: true,
        filterable: false,
        groupable: false,
        persistSelection: true,
        selectable: 'single, row',
        change: (event) => {

            console.log('documentGrid change', event);

            //e.sender.select().toArray().forEach(d => {
            //    let item = e.sender.dataItem(d);
            //    item.selectedFromGrid(!item.selectedFromGrid());
            //});

            let attachment = event.sender.dataItem(event.sender.select());

            self.selectedDocumentIndex(event.sender.dataSource.indexOf(attachment));

            self.documentViewer.load(event.sender.dataItem(event.sender.select()));
        },
        select: (event) => {
            console.log('documentGrid select', event)
        },
        dataBound: (event) => {

            console.log("documentGrid dataBound", event);

            event.sender.element[0].querySelectorAll('td.checkbox-column').forEach(c => c.addEventListener("click", function (e) {

                e.stopPropagation();
                //e.preventDefault();
            }));

            event.sender.dataSource.data().forEach(d => {
                if (self.documentGridSelectedKeys().find(f => f == d.AttachmentID)) {
                    d.selectedFromGrid(true);
                }
            });

            //self.gridGroupCount(event.sender.dataSource.group().length);
        },
        excelExport: (e) => {
            let data = e.data;
            let gridColumns = e.sender.columns;
            let sheet = e.workbook.sheets[0];
            let visibleGridColumns = [];
            let columnTemplates = [];
            let dataItem;
            // Create element to generate templates in.
            let elem = document.createElement('div');

            // Get a list of visible columns
            for (let i = 0; i < gridColumns.length; i++) {
                if (gridColumns[i].exportable !== false) {
                    visibleGridColumns.push(gridColumns[i]);
                }
            }

            // Create a collection of the column templates, together with the current column index
            for (let i = 0; i < visibleGridColumns.length; i++) {
                if (visibleGridColumns[i].template) {
                    columnTemplates.push({
                        cellIndex: i,
                        template: kendo.template(visibleGridColumns[i].template)
                    });
                }
            }

            let header = sheet.rows.find(r => r.type == 'header');

            header.cells.splice(2, 0, {
                background: "#7a7a7a",
                colSpan: 1,
                color: "#fff",
                rowSpan: 1,
                value: "Supplier Name"
            });

            header.cells.splice(4, 0, {
                background: "#7a7a7a",
                colSpan: 1,
                color: "#fff",
                rowSpan: 1,
                value: "Budget Holder Name"
            });

            // Traverse all exported rows.
            for (let i = 1; i < sheet.rows.length; i++) {
                let row = sheet.rows[i];
                // Traverse the column templates and apply them for each row at the stored column position.

                // Splice back in the hidden columns, because of annoying reasons. Shush. 
                row.cells.splice(2, 0, { value: null });
                row.cells.splice(4, 0, { value: null });

                // Get the data item corresponding to the current row.
                let dataItem = data[i - 1];
                for (let j = 0; j < columnTemplates.length; j++) {
                    let columnTemplate = columnTemplates[j];
                    // Generate the template content for the current cell.
                    elem.innerHTML = columnTemplate.template(dataItem);
                    if (row.cells[columnTemplate.cellIndex] != undefined)
                        row.cells[columnTemplate.cellIndex].type = "string";
                        // Output the text content of the templated cell into the exported cell.
                        row.cells[columnTemplate.cellIndex].value = elem.textContent || elem.innerText || "";
                }
            }

            e.workbook.fileName = "Documents.xlsx";
        }
    }

    self.documentViewer = invoiceBookingDocumentViewerViewModel({
        parent: self
    });

    //#region Computeds

    self.selectedAttachment = ko.computed(() => {
        if (self.selectedEmail()) {
            return ko.unwrap(self.selectedEmail().selectedAttachment);
        }
    }, self);

    self.invoiceRegistrationSuspensionLabel = ko.computed(() => {
        let suspended = self.invoiceRegistrationSubmissionSuspended();

        if (suspended) {
            return `Enable Submission to Mertex`;
        } else {
            return `Suspend Submission to Mertex`;
        }
    }, self);

    self.documentSelectionLabel = ko.computed(() => {
        let count = self.documentGridSelectedKeys().length;

        if (count == 0) {
            return '';
        }

        if (count == 1) {
            return '(1 document selected)';
        }

        return `(${count} documents selected)`;

    }, self);

    //#endregion


    //#region Subscriptions

    self.filters.hasAttachments.subscribe(nv => {
        switch (nv) {
            case true:
                self.mailboxGridParams.widget().dataSource.filter({
                    field: "RegularAttachmentCount",
                    operator: "gt",
                    value: 0
                });
                break;
            case false:
                self.mailboxGridParams.widget().dataSource.filter({
                    field: "RegularAttachmentCount",
                    operator: "eq",
                    value: 0
                });
                break;
            default:
                self.mailboxGridParams.widget().dataSource.filter([]);
                break;
        }
    });

    //#endregion


    //#region Methods

    self.refresh = () => {
        self.dashboard.fetch();
        self.dashboard.documentsFetch();
        self.mailboxGridParams.widget().dataSource.read();
        if (self.documentGridParams.widget()) {
            self.documentGridParams.widget().dataSource.read();
        }
    }

    self.reset = () => {
        self.selectedEmail(undefined);
        self.documentViewer.selectedEmail(undefined);
        self.refresh();
    }

    self.loadEmail = (stub, onLoad) => {

        return new Promise((resolve, reject) => {

            self.modalBusy(true);

            if (typeof onLoad == 'undefined' || onLoad == null) {
                self.modal.show();
            }

            let data = {
                mailboxId: self.mailboxId,
                emailMessageId: stub.EmailMessageID,
                emailId: stub.EmailID
            };

            console.log('loadEmail calling with', data);

            fetch('/api/InvoiceBookingAPI/LoadEmailMessage', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-cache',
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log('loadEmailMessage returned', data);
                    if (typeof onLoad === 'function') {
                        onLoad(data);
                    } else {
                        self.selectedEmail(invoiceBookingEmailViewModel({
                            parent: self,
                            emailStatus: data.emailStatus,
                            additionalInfo: data.additionalInfo,
                            rec: Object.assign(data.message, {
                                BankDetails: data.bankDetails
                            }),
                            gridWidget: self.mailboxGridParamsWidget,
                            attachments: [{
                                AttachmentID: -1,
                                EmailID: data.message.EmailID,
                                AttachmentTypeID: null,
                                FileExtension: "html",
                                FileName: "View Email",
                                IsInline: false,
                                Body: data.message.Body,
                                SupplierCode: data.message.SupplierCode,
                                Supplier: data.message.Supplier,
                                FileSizeDisplay: `${formatNumber((data.message.Body.length * 2) / 1024, 2, 'en-GB')} KB`
                            }, ...data.attachments.map(a => {
                                a.SupplierCode = a.SupplierCode ?? data.message.SupplierCode;
                                a.Supplier = a.Supplier ?? data.message.Supplier;
                                return a;
                            })]
                        }));
                    }
                    self.modalBusy(false);
                    resolve();
                })
                .catch(err => {
                    self.modalBusy(false);
                    window.catchFetchError(err);
                    reject();
                })
        })
    }

    self.init = () => {
        self.busy(false);
    }

    self.next = () => {

        self.selectedEmail()
            .selectedAttachment()
            .unsavedChanges()
            .then(() => {
                if (self.selectedIndex() == self.mailboxGridParams.widget().dataSource.pageSize() - 1) {
                    // we must page forwards, wait for the paging to be successful, then select the zeroth row on the resultant page

                    self.modalBusy(true);

                    self.mailboxGridParams.widget().dataSource.one('requestEnd', (event) => {
                        self.mailboxGridParams.widget().select(`tr:eq(0)`);
                        self.mailboxGridParams.widget().trigger('change');
                    });

                    let currentPage = self.mailboxGridParams.widget().dataSource.page();

                    self.mailboxGridParams.widget().dataSource.page(currentPage + 1);

                } else {
                    self.modalBusy(true);
                    self.mailboxGridParams.widget().select(`tr:eq(${self.selectedIndex() + 1})`);
                    self.mailboxGridParams.widget().trigger('change');
                }
            })
            .catch(err => {

            })
    }

    self.previous = () => {

        self.selectedEmail()
            .selectedAttachment()
            .unsavedChanges()
            .then(() => {
                if (self.selectedIndex() == 0) {
                    // we must page backwards, wait for the paging to be successful, then select the zeroth row on the resultant page

                    self.mailboxGridParams.widget().dataSource.one('requestEnd', (event) => {
                        self.mailboxGridParams.widget().select(`tr:eq(${self.mailboxGridParams.widget().dataSource.pageSize() - 1})`);
                        self.mailboxGridParams.widget().trigger('change');
                    });

                    let currentPage = self.mailboxGridParams.widget().dataSource.page();

                    self.mailboxGridParams.widget().dataSource.page(currentPage - 1);
                } else {
                    self.modalBusy(true);
                    self.mailboxGridParams.widget().select(`tr:eq(${self.selectedIndex() - 1})`);
                    self.mailboxGridParams.widget().trigger('change');
                }
            })
            .catch(err => {

            })
    }

    //#endregion


    //#region Events

    self.modalElement.addEventListener('shown.bs.modal', () => {
        window.setTimeout(() => {
            self.modalElement.querySelectorAll('.btn').forEach((e) => {
                new bootstrap.Ripple(e);
            });
        }, 0);
    });

    self.suppressHide = true;

    self.modalElement.addEventListener('hide.bs.modal', (ev) => {

        if (self.suppressHide) {
            ev.preventDefault();
        }

        if (self.selectedEmail() && self.selectedEmail().selectedAttachment()) {
            self.selectedEmail()
                .selectedAttachment()
                .unsavedChanges()
                .then(() => {
                    self.suppressHide = false;
                    self.modal.hide();
                    self.reset();
                })
                .catch(() => {

                })
        } else {
            self.reset();
        }
    });

    self.modalElement.addEventListener('hidden.bs.modal', (ev) => {
        self.suppressHide = true;
    })

    self.modalElement.addEventListener('hide.bs.modal', (ev) => {
        self.selectedEmail(undefined);
    });

    self.modalElement.addEventListener('shown.bs.modal', () => {
        window.setTimeout(() => {
            self.modalElement.querySelectorAll('.btn').forEach((e) => {
                new bootstrap.Ripple(e);
            });
        }, 0);
    });

    self.suppressDocumentViewerHide = true;

    self.documentViewerModalElement.addEventListener('hide.bs.modal', (ev) => {

        if (self.suppressDocumentViewerHide) {
            ev.preventDefault();
        }

        if (self.documentViewer.selectedEmail()) {
            self.documentViewer.selectedEmail()
                .selectedAttachment()
                .unsavedChanges()
                .then(() => {
                    self.suppressDocumentViewerHide = false;
                    self.documentViewerModal.hide();
                    self.reset();
                })
                .catch(() => {

                })
        } else {
            self.reset();
        }
    });

    self.documentViewerModalElement.addEventListener('hidden.bs.modal', (ev) => {
        self.suppressDocumentViewerHide = true;
    })

    self.toggleInvoiceRegistrationSuspension = () => {
        self.busy(true);

        let data = {
            suspended: !self.invoiceRegistrationSubmissionSuspended()
        }

        fetch('/api/InvoiceBookingAPI/ToggleInvoiceRegistrationSuspension', {
            method: 'POST',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: window.fetchHeaders,
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('toggleInvoiceRegistrationSuspension returned', data);

                self.dashboard.fetch(() => {
                    self.busy(false);
                });

                self.dashboard.documentsFetch(() => {
                    self.busy(false);
                });

                self.invoiceRegistrationSubmissionSuspended(!self.invoiceRegistrationSubmissionSuspended());
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.toggleDocumentsGridSelection = (event, data) => {
        console.log('toggleDocumentsGridSelection', event, data);
        self.documentGridSelectAllToggleState(!self.documentGridSelectAllToggleState());

        if (self.documentGridSelectAllToggleState()) {

            self.documentGridSelectedKeys(self.documentGridResultSetKeys());

            self.documentGridParams.widget().select(self.documentGridParams.widget().dataSource.data())
            self.documentGridParams.widget().dataSource.data().forEach(i => {
                i.selectedFromGrid(true);
            })
        } else {

            self.documentGridSelectedKeys([]);

            self.documentGridParams.widget().dataSource.data().forEach(i => {
                i.selectedFromGrid(false);
            })
        }
    };

    self.beginDownloadDocuments = () => {
        self.busy(true);

        let data = {
            attachmentIds: self.documentGridSelectedKeys()
        }

        if (data.attachmentIds.length > 5) {
            window.showConfirm('Are you sure?', `You are requesting ${data.attachmentIds.length} documents. If you intended to request this many, please click the Yes button to continue.`, () => {
                self.actuallyDownloadDocuments(data);
            }, () => {

            })
        } else {
            self.actuallyDownloadDocuments(data);
        }
    }

    self.actuallyDownloadDocuments = (data) => {
        fetch('/api/InvoiceBookingAPI/DownloadDocuments', {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {

                document.getElementById('archives-leading-text').innerHTML = document.getElementById('archives-leading-text').innerHTML.replace('{COUNT}', data.documentCount);

                bootstrap.Modal.getOrCreateInstance(document.querySelector('#archives-modal')).show();

                self.busy(false);

            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    //#endregion

    //#region Events

    self.emailGridTabButton.addEventListener('show.bs.tab', (ev) => {
        console.log('emailGridTabButton show.bs.tab fired');
        self.mode('emails');
        self.mailboxGridParams.widget().dataSource.read();
    });

    self.documentGridTabButton.addEventListener('show.bs.tab', (ev) => {
        console.log('documentGridTabButton show.bs.tab fired');
        self.mode('documents');
        self.documentGridParams.widget().dataSource.read();
    });

    self.setAttachmentBudgetHolderPopupAppendTo = () => {
        window.setTimeout(() => {
            self.selectedAttachment().forwardToBudgetHolderParams.dropDownListSettings.widget().setOptions({
                popup: {
                    appendTo: document.querySelector('#destination-budget-holder')
                }
            });
        }, 100);
    }

    self.selectedAttachment.subscribe(nv => {
        if (nv) {
            nv.forwardAttachmentModal._element.removeEventListener('shown.bs.modal', self.setAttachmentBudgetHolderPopupAppendTo);
            nv.forwardAttachmentModal._element.addEventListener('shown.bs.modal', self.setAttachmentBudgetHolderPopupAppendTo);
        }
    });

    self.setChangeBudgetHolderPopupAppendTo = () => {
        self.selectedEmail().changeBudgetHolderParams.dropDownListSettings.widget().setOptions({
            popup: {
                appendTo: '#change-budget-holder'
            }
        });
    }

    self.selectedEmail.subscribe(nv => {
        if (nv) {
            nv.changeBudgetHolderModal._element.removeEventListener('shown.bs.modal', self.setChangeBudgetHolderPopupAppendTo);
            nv.changeBudgetHolderModal._element.addEventListener('shown.bs.modal', self.setChangeBudgetHolderPopupAppendTo);

            window.setTimeout(() => {
                if (nv.Supplier.BudgetHolderCode == '101') {
                    nv.modalBusy(true);
                    nv.changeBudgetHolderModal.show();
                }
            }, 0);
        }
    })

    self.exportDocumentGrid = () => {
        self.documentGridParams.widget().saveAsExcel();
    }

    //#endregion

    return self;
}