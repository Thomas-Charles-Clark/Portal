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

    self.loadedEmail = ko.observable();

    //#endregion


    //#region Lifted Bits

    //#endregion


    //#region Components

    self.mailboxFoldersTreeViewParams = {
        widget: ko.observable(),
        dataTextField: "Name",
        dataSource: new kendo.data.HierarchicalDataSource({
            virtual: true,
            transport: {
                read: (options) => {

                    let data = {
                        mailboxId: self.mailboxId
                    }

                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var params = webapi.parameterMap(options.data);

                    for (let propertyName in params) {
                        data[propertyName] = params[propertyName];
                    }

                    fetch('/api/InvoiceBookingAPI/InvoiceMailboxFolders', {
                        method: 'POST',
                        cache: 'no-cache',
                        headers: window.fetchHeaders,
                        body: JSON.stringify(data)
                    })
                        .then(window.handleFetchResponse)
                        .then(result => {
                            options.success(result)
                        })
                        .catch(window.catchFetchErrors)
                }
            },
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                aggregates: "AggregateResults",
                model: {
                    id: "MailboxFolderID",
                    hasChildren: "HasChildren",
                    fields: {
                        Name: { type: 'string', editable: false }
                    }
                }
            }),
            sort: {
                field: 'Name',
                dir: 'asc'
            }
        })
    }

    self.mailboxGridParams = {
        widget: ko.observable(),
        columns: [{
            field: '',
            title: 'From',
            width: 220
        }, {
            field: 'Subject',
            title: 'Subject'
        }, {
            field: 'ReceivedDT',
            title: 'Received',
            width: 132 
        }, {
            field: 'RegularAttachmentCount',
            title: 'Attachments',
            width: 132,
            filterable: {
                extra: false
            }
        }],
        data: new kendo.data.DataSource({
            pageSize: 10,
            transport: {
                read: (options) => {

                    let data = {
                        mailboxId: self.mailboxId
                    }

                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var params = webapi.parameterMap(options.data);

                    for (let propertyName in params) {
                        data[propertyName] = params[propertyName];
                    }

                    fetch('/api/InvoiceBookingAPI/MailboxGrid', {
                        method: 'POST',
                        cache: 'no-cache',
                        headers: window.fetchHeaders,
                        body: JSON.stringify(data)
                    })
                        .then(window.handleFetchResponse)
                        .then(data => {
                            data.Data = data.Data.map(d => invoiceBookingEmailViewModel({
                                rec: d
                            }));
                            options.success(data);
                        })
                        .catch(err => {
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
                        FromName: { type: 'string', editable: false },
                        Subject: { type: 'string', editable: false },
                        BodyPreview: { type: 'string', editable: false },
                        ProcessedDT: { type: 'datetime', editable: false },
                        Processed: { type: 'boolean', editable: false },
                        ProcessedMemberID: { type: 'number', editable: false },
                        SupplierCode: { type: 'string', editable: false }
                    }
                }
            }),
            sort: {
                field: 'ReceivedDT',
                dir: 'desc'
            },
            serverFiltering: true,
            serverGrouping: true,
            serverPaging: true,
            serverAggregates: true,
            serverSorting: true
        }),
        useKOTemplates: true,
        rowTemplate: 'email-stub-row-template',
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 200]
        },
        sortable: true,
        filterable: true,
        groupable: false,
        selectable: 'single',
        change: (event, data) => {
            console.log('change', event, data);

            let stub = event.sender.dataItem(event.sender.select());

            self.loadEmail(stub);
        },
        select: (event) => {
            console.log('select', event)
        }
    }

    //#endregion


    //#region Computeds

    self.selectedAttachment = ko.computed(() => {
        if (self.loadedEmail()) {
            return ko.unwrap(self.loadedEmail().selectedAttachment);
        }
    }, self);

    //#endregion


    //#region Subscriptions

    //#endregion


    //#region Methods

    self.loadEmail = (stub) => {
        self.busy(true);
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
                self.loadedEmail(invoiceBookingEmailViewModel({
                    rec: data.message,
                    attachments: data.attachments
                }));
                console.log('loadEmailMessage returned', data);
                self.busy(false);
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.init = () => {
        self.busy(false);

        //self.mailboxFoldersTreeViewParams.widget().one('dataBound', (e) => {
        //    let inboxFolder = self.mailboxFoldersTreeViewParams.widget().findByText('Inbox');
        //    e.sender.select(inboxFolder);
        //})
    }

    //#endregion


    //#region Events

    //#endregion


    return self;
}