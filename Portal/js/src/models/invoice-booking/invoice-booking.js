const EMPTY_STRING = '';

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

    // begin in the 'root' folder
    self.currentMailboxFolderId = ko.observable(null);

    self.mailboxFolders = ko.observableArray([]);

    self.selectedEmail = ko.observable();

    self.mode = ko.observable('emails');

    self.modalElement = document.getElementById('email-modal');

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

    self.modalBusy = ko.observable(false);

    self.modalBusyMessage = ko.observable('Please wait');

    self.itemCount = ko.observable();

    self.selectedEmailIndex = ko.observable();

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

    //#endregion


    //#region Lifted Bits

    self.getParameters = () => {
        let data = {
            mailboxId: self.mailboxId
        }

        data = Object.assign({
            emailStatusId: self.filters.emailStatusId() ?? null,
            fromDate: typeof self.filters.fromDate() == 'object' ? self.filters.fromDate().toUTCString() : self.filters.fromDate(),
            toDate: typeof self.filters.toDate() == 'object' ? self.filters.toDate().toUTCString() : self.filters.toDate(),
            dateRangeId: self.filters.dateRangeId() ?? null
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

        if (self.mode() == 'documents') {
            if (self.filters.documentTypeId()) {
                data.documentTypeId = self.filters.documentTypeId();
            }

            if (self.filters.documentStatusId()) {
                data.documentStatusId = self.filters.documentStatusId();
            }

            if (self.filters.documentDateAffectorId()) {
                data.documentDateAffectorId = self.filters.documentDateAffectorId()
            }
        }

        return data;
    }

    //#endregion


    //#region Components

    self.dashboard = invoiceBookingDashboardViewModel({
        parent: self
    });

    self.filters = invoiceBookingFiltersViewModel({
        parent: self
    });

    self.mailboxGridParams = {
        widget: ko.observable(),
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
            title: ' ',
            width: 40,
            headerAttributes: {
                class: 'text-center attachment-count-header-cell'
            },
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

                    console.log('MailboxGrid calling with', data);

                    fetch('/api/InvoiceBookingAPI/MailboxGrid?' + params, {
                        method: 'GET',
                        cache: 'no-cache',
                        headers: window.fetchHeaders
                    })
                        .then(window.handleFetchResponse)
                        .then(data => {
                            console.log("MailboxGrid returned", data);
                            self.itemCount(data.Total);

                            if (self.mailboxGridParams.widget().dataSource.group().length) {
                                data.Data = data.Data.map(dat => {
                                    dat.Items = dat.Items.map(d => invoiceBookingEmailViewModel({
                                        parent: self,
                                        rec: d
                                    }));
                                    return dat;
                                })
                            } else {
                                data.Data = data.Data.map(d => invoiceBookingEmailViewModel({
                                    parent: self,
                                    rec: d
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
                        SearchKeywords: { type: 'string', editable: false }
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
            serverSorting: true
        }),
        useKOTemplates: true,
        rowTemplate: 'email-stub-row-template',
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        },
        sortable: true,
        filterable: true,
        groupable: false,
        selectable: 'single',
        change: (event, data) => {

            console.log('change', event, data);

            let stub = event.sender.dataItem(event.sender.select());

            self.selectedEmailIndex(event.sender.dataSource.indexOf(stub));

            self.loadEmail(stub);
            
        },
        select: (event) => {
            console.log('select', event)
        },
        databound: (event) => {
            self.gridGroupCount(event.sender.dataSource.group().length);
        }
    }

    self.documentGridParams = {
        widget: ko.observable(),
        columns: [{
            title: 'Type',
            field: 'AttachmentTypeID',
            width: 200
        }, {
            title: 'Supplier',
            field: 'Email.Supplier.Code',
            width: 200,
            filterable: false,
            groupHeaderTemplate: (e) => {
                if (e.SupplierCode) {
                    return `Supplier: ${e.SupplierCode} - ${e.Supplier.Name}`;
                } else {
                    return `Supplier: Not Identified`
                }
            }
        }, {
            title: 'Budget Holder',
            field: 'BudgetHolder.Code'
        }, {
            field: 'Status',
            title: 'Status'
        }, {
            field: 'ReceivedDT',
            title: 'Received Date',
            width: 142,
        }, {
            field: 'DocumentDate',
            title: 'Document Date',
            width: 150,
        }, {
            field: 'DocumentDueDate',
            title: 'Due Date',
            width: 142,
        }, {
            field: 'DocumentTotalInc',
            title: 'Total',
            width: 180
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

                    console.log('DocumentsGrid calling with', data);

                    fetch('/api/InvoiceBookingAPI/DocumentsGrid?' + params, {
                        method: 'GET',
                        cache: 'no-cache',
                        headers: window.fetchHeaders
                    })
                        .then(window.handleFetchResponse)
                        .then(data => {
                            console.log("DocumentsGrid returned", data);

                            if (self.documentGridParams.widget().dataSource.group().length) {
                                data.Data = data.Data.map(dat => {
                                    dat.Items = dat.Items.map(d => invoiceBookingEmailAttachmentViewModel({
                                        parent: Object.assign({
                                            EmailID: d.Email.EmailID,
                                            EmailMessageID: d.Email.EmailMessageID,
                                            parent: {
                                                // fake parents!
                                            }
                                        }, self),
                                        rec: d
                                    }));
                                    return dat;
                                })
                            } else {
                                data.Data = data.Data.map(d => invoiceBookingEmailAttachmentViewModel({
                                    parent: Object.assign({
                                        parent: {
                                        // fake parents!
                                        }
                                    }, self),
                                    rec: d
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
                        AttachmentStatus: {
                            type: 'object',
                            fields: {
                                AttachmentStatusID: { type: 'number', editable: false },
                                Name: { type: 'string', editable: false }
                            }
                        },
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
                field: 'Email.Supplier.Code',
                dir: 'asc'
            }, {
                field: 'Email.ReceivedDT',
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
            serverSorting: true
        }),
        useKOTemplates: true,
        rowTemplate: 'attachment-stub-row-template',
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        },
        sortable: true,
        filterable: false,
        groupable: false,
        selectable: 'single',
        change: (e) => {

            console.log('documentGrid change', e);

            self.documentViewer.load(e.sender.dataItem(e.sender.select()));

            //let stub = event.sender.dataItem(event.sender.select());

            //self.selectedEmailIndex(event.sender.dataSource.indexOf(stub));

            //self.loadEmail(stub);

        },
        select: (event) => {
            console.log('select', event)
        },
        databound: (event) => {
            self.gridGroupCount(event.sender.dataSource.group().length);
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
        self.mailboxGridParams.widget().dataSource.read();
    }

    self.reset = () => {
        self.selectedEmail(undefined);
        self.refresh();
    }

    self.loadEmail = (stub, onLoad) => {

        return new Promise((resolve, reject) => {

            //self.selectedEmail(undefined);

            self.modalBusy(true);

            self.modal.show();

            let data = {
                mailboxId: self.mailboxId,
                emailMessageId: stub.EmailMessageID,
                emailId: stub.EmailID
            };

            fetch('/api/InvoiceBookingAPI/LoadEmailMessage', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-cache',
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log('loadEmailMessage returned', data);
                    self.selectedEmail(invoiceBookingEmailViewModel({
                        parent: self,
                        emailStatus: data.emailStatus,
                        additionalInfo: data.additionalInfo,
                        rec: data.message,
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
                    if (typeof onLoad === 'function') {
                        onLoad();
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
                if (self.selectedEmailIndex() == self.mailboxGridParams.widget().dataSource.pageSize() - 1) {
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
                    self.mailboxGridParams.widget().select(`tr:eq(${self.selectedEmailIndex() + 1})`);
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
                if (self.selectedEmailIndex() == 0) {
                    // we must page backwards, wait for the paging to be successful, then select the zeroth row on the resultant page

                    self.mailboxGridParams.widget().dataSource.one('requestEnd', (event) => {
                        self.mailboxGridParams.widget().select(`tr:eq(${self.mailboxGridParams.widget().dataSource.pageSize() - 1})`);
                        self.mailboxGridParams.widget().trigger('change');
                    });

                    let currentPage = self.mailboxGridParams.widget().dataSource.page();

                    self.mailboxGridParams.widget().dataSource.page(currentPage - 1);
                } else {
                    self.modalBusy(true);
                    self.mailboxGridParams.widget().select(`tr:eq(${self.selectedEmailIndex() - 1})`);
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

                self.invoiceRegistrationSubmissionSuspended(!self.invoiceRegistrationSubmissionSuspended());
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }
    
    //#endregion

    //#region Events

    self.emailGridTabButton.addEventListener('show.bs.tab', (ev) => {
        self.mode('emails');
    });

    self.documentGridTabButton.addEventListener('show.bs.tab', (ev) => {
        self.mode('documents');
    })

    //#endregion

    return self;
}