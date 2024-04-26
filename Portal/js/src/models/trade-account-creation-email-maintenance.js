const tradeAccountCreationEmailMaintenanceViewModel = () => {
    let self = {};

    self.editingRecord = ko.observable();

    self.busy = ko.observable(false);

    self.resultGridWidget = ko.observable();

    self.resultGridColumns = [{
            field: 'TradeAccountCreationEmailID',
            title: 'ID',
            width: 80,
            readonly: true,
            hidden: true,
            attributes: {
                'class': ''
            },
            template: function (r) {
                return r.TradeAccountCreationEmailID;
            }
        }, {
            field: 'SalesMarket.Name',
            title: 'Sales Market',
            width: 175,
            attributes: {
                'class': 'heading-cell'
            },
            //template: function (r) {
            //    var result = '';

            //    if (r.Heading)
            //        result = '<span class="heading">' + r.Heading + '</span>';

            //    if (r.SubHeading)
            //        result += '<span>' + r.SubHeading + '</span>';

            //    return result;
            //}
        }, {
            field: 'Attachments',
            title: 'Attachments'
        }, {
            title: 'Display Contact Details For:',
            columns: [{
                field: 'DisplayContactDetails_AccountManager',
                title: 'Account Manager',
                attributes: {
                    'class': 'text-center'
                },
                headerAttributes: {
                    'class': 'text-center'
                }
            }, {
                field: 'DisplayContactDetails_CustomerService',
                title: 'Customer Services',
                attributes: {
                    'class': 'text-center'
                },
                headerAttributes: {
                    'class': 'text-center'
                }
            }, {
                field: 'DisplayContactDetails_CreditControl',
                title: 'Credit Control',
                attributes: {
                    'class': 'text-center'
                },
                headerAttributes: {
                    'class': 'text-center'
                }
            },
                //{
                //field: 'DisplayB2BRegistrationRequest',
                //title: 'B2B Registration Request',
                //attributes: {
                //    'class': 'text-center'
                //},
                //headerAttributes: {
                //    'class': 'text-center'
                //}
                //},
            {
                field: 'DisplayLookbook',
                title: 'Lookbook',
                attributes: {
                    'class': 'text-center'
                },
                headerAttributes: {
                    'class': 'text-center'
                }
            }]
        }, {
            field: ''
        }];

    self.resultGridDataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {

                var webapi = new kendo.data.transports.webapi({ prefix: "" });
                var params = webapi.parameterMap(options.data);

                //var tradeAccountId = null;

                //if (self.tradeAccount.peek())
                //    tradeAccountId = self.tradeAccount.peek().TradeAccountID

                let data = {
                    salesMarketId: self.salesMarketId()
                };

                for (let propertyName in params) {
                    data[propertyName] = params[propertyName];
                }

                console.log('calling creationEmails with', data);

                $.ajax({
                    url: '/api/customermaintenance/CreationEmailsGridView',
                    type: 'GET',
                    data: data,
                    success: function (data) {
                        console.log('CreationEmailsGridView returned', data);
                        options.success(data);
                    },
                    error: function (xhr, s, a) {
                        self.busy(false);
                        $.showError(xhr, s, a);
                    }
                });
            }
        },
        pageSize: 30,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'TradeAccountCreationEmailID',
                fields: {
                    TradeAccountCreationEmailID: {
                        editable: false
                    },
                    SalesMarket: {
                        type: 'object',
                        editable: false
                    }
                }
            }
        }),
        requestStart: function (e) {
            self.busy(true);
        },
        requestEnd: function (e) {
            self.busy(false);
        }
    });

    self.resultGridSettings = {
        autoBind: true,
        widget: self.resultGridWidget,
        columns: self.resultGridColumns,
        data: self.resultGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'creation-email-row-template',
        scrollable: false,
        sortable: true,
        filterable: false,
        reorderable: false,
        paging: true,
        pageSize: 30,
        pageable: {
            pageSize: 30,
            pageSizes: [30, 50, 100, 250, 500, 'all']
        },
        editable: false,
        selectable: "single",
        change: function (e) {
            if (!e.sender.editable) {
                if (self.resultGridWidget().select()) {
                    self.resultGridWidget().editRow(self.resultGridWidget().select());
                }
            }},
        dataBound: function (e) {
        },
        filterMenuInit: function (e) {
        }
    };

    self.salesMarkets = getAvailableSalesMarkets();

    self.salesMarketId = ko.observable();

    self.salesMarketId.subscribe(nv => {
        console.log(nv);
    });

    self.salesMarket = ko.observable();

    self.salesMarketParams = {
        label: 'Sales Market',
        observable: self.salesMarketId,
        busy: self.busy,
        revertible: false,
        clearable: true,
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false,
        controlClass: 'form-control',
        disable: ko.observable(false),
        enable: ko.observable(true),
        dropDownListSettings: {
            value: self.salesMarketId,
            dataItem: self.salesMarket,
            dataValueField: 'SalesMarketID',
            dataTextField: 'Name',
            height: 420,
            widget: ko.observable(),
            enabled: true,
            open: (e) => {
                $(self.salesMarketId.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: (e) => {
                $(self.salesMarketId.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            dataSource: new kendo.data.DataSource({
                data: self.salesMarkets,
                schema: $.extend({}, kendo.data.schemas.webapi, {
                    model: {
                        id: 'SalesMarketID',
                        fields: {
                            SalesMarket: {
                                editable: false,
                                nullable: false
                            },
                            Name: {
                                type: 'string',
                                validation: {
                                    required: true,
                                    nullable: false
                                }
                            }
                        }
                    }
                }),
            }),
            data: self.productTypes, //
            valuePrimitive: false,
            autoWidth: false,
            autoBind: true,
            optionLabel: ' ',
            filter: 'startswith'
        },
        clearFunction: function () {
            self.salesMarketParams.dropDownListSettings.widget().value(null);
            self.salesMarketId.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
            self.salesMarketId.mdcSelect.label_.float(false);
            self.salesMarketId(null);
        }
    };

    self.editRecord = (r) => {
        console.log(r);
        let record = editModel(r);
        self.editingRecord(record);
        let element = document.getElementById('creation-email-edit-modal');
        let modal = bootstrap.Modal.getOrCreateInstance(element);
        modal.show();
    }

    self.saveRecord = () => {
        let record = self.editingRecord();

        record.validateNow(true);

        if (record.errors().length) {
            record.errors.showAllMessages(true);
        } else {
            record.busy(true);
            fetch('/api/customermaintenance/SaveTradeAccountCreationEmail', {
                method: 'POST',
                headers: window.fetchHeaders,
                body: JSON.stringify({
                    tradeAccountCreationEmailId: record.TradeAccountCreationEmailID,
                    displayAccountManager: record.displayAccountManager(),
                    displayCustomerService: record.displayCustomerService(),
                    displayCreditControl: record.displayCreditControl(),
                    displayB2BRegistration: true,
                    displayLookbook: record.displayLookbook(),
                    attachments: [...document.querySelectorAll("#attachment-manager .sort-item")].map((e, i) => {
                        let a = ko.dataFor(e);
                        return {
                            tradeAccountCreationEmailAttachmentId: a.TradeAccountCreationEmailAttachmentID,
                            name: a.name(),
                            path: a.path(),
                            salesMarket: record.SalesMarket.Name,
                            fileSizeBytes: a.fileSizeBytes(),
                            sortOrder: i + 1
                        }
                    })
                })
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.busy(false);
                    let element = document.getElementById('creation-email-edit-modal');
                    let modal = bootstrap.Modal.getOrCreateInstance(element);
                    element.addEventListener('hide.bs.modal', () => {
                        self.editingRecord(undefined);
                    }, { once: true });
                    modal.hide();
                    self.resultGridWidget().dataSource.read();
                })
                .catch(err => {
                    record.busy(false);
                    window.showError(err.Message);
                })
        }
    }

    return self;
}

const editModel = (props) => {
    let self = {
        ...props
    };

    self.busy = ko.observable(false);

    self.validateNow = ko.observable(true);

    self.emailer = emailer({ parent: self, sendLabel: 'Send <span class="bi bi-send ms-2"></span>' });

    self.emailer.body('[This body purposefully left empty!]');
    self.emailer.bodyParams.visible(false);

    self.emailer.to(getUserEmail());
    self.emailer.subject(`Trade Account Creation Test - ${props.SalesMarket.Name}`);

    self.emailer.send = () => {
        self.validateNow(true);
        self.emailer.validateSendNow(true);

        var errors = self.emailer.emailErrors().concat(self.errors());

        if (errors.length) {
            self.emailer.emailErrors.showAllMessages(true);
            self.emailer.emailErrors.filter(function (x) {
                x.isValid.notifySubscribers(x.isValid());
            });
            self.errors.showAllMessages(true);
            self.errors.filter(function (x) {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            self.busy(true);
            fetch('/api/customermaintenance/SendTestCreationEmail', {
                method: 'POST',
                dataType: 'json',
                headers: window.fetchHeaders,
                body: JSON.stringify({
                    to: self.emailer.to(),
                    subject: self.emailer.subject(),
                    displayAccountManager: self.displayAccountManager(),
                    displayCustomerService: self.displayCustomerService(),
                    displayCreditControl: self.displayCreditControl(),
                    displayB2BRegistration: true,
                    attachments: [...document.querySelectorAll("#attachment-manager .sort-item")].map((e, i) => {
                        let a = ko.dataFor(e);
                        return {
                            name: a.name(),
                            path: a.path(),
                            salesMarket: self.SalesMarket.Name,
                            sortOrder: i + 1
                        }
                    })

                })
            }).then(async resp => {
                if (resp.ok)
                    return resp.json();
                else {
                    let t = await resp.json();
                    console.error(t);
                    throw new Error("Whoops...");
                }
            })
                .then(data => {
                    self.busy(false);
                    self.emailer.sentTo(self.emailer.to());
                    self.emailer.showLastSentTo(true);
                    window.setTimeout(function () {
                        self.emailer.showLastSentTo(false);
                    }, 5000);
                })
                .catch(err => {
                    self.busy(false);
                    window.showError("Sorry, there was an error sending that test email.");
                    //window.catchFetchError(err);
                });
        }
    }

    self.displayAccountManager = ko.observable(props.DisplayContactDetails_AccountManager);

    self.displayAccountManagerProps = {
        label: 'Display Account Manager Section?',
        checkboxId: `display-account-manager`,
        observable: self.displayAccountManager,
        originalValue: props.DisplayContactDetails_AccountManager,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.displayCustomerService = ko.observable(props.DisplayContactDetails_CustomerService);

    self.displayCustomerServiceProps = {
        label: 'Display Customer Service Section?',
        checkboxId: `display-customer-service`,
        observable: self.displayCustomerService,
        originalValue: props.DisplayContactDetails_CustomerService,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.displayCreditControl = ko.observable(props.DisplayContactDetails_CreditControl);

    self.displayCreditControlProps = {
        label: 'Display Credit Control Section?',
        checkboxId: `display-credit-control`,
        observable: self.displayCreditControl,
        originalValue: props.DisplayContactDetails_CreditControl,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    //self.displayB2BRegistration = ko.observable(props.DisplayB2BRegistrationRequest);
    self.displayB2BRegistration = ko.observable(true);

    self.displayB2BRegistrationProps = {
        label: 'Display B2B Registration Request?',
        checkboxId: `display-b2b-registration`,
        observable: self.displayB2BRegistration,
        originalValue: props.DisplayB2BRegistrationRequest,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.displayLookbook = ko.observable(props.DisplayLookbook);

    self.displayLookbookProps = {
        label: 'Display Lookbook?',
        checkboxId: `display-lookbook`,
        observable: self.displayLookbook,
        originalValue: props.DisplayLookbook,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.attachmentsManager = {
        attachments: ko.observableArray([]),
        attachmentsSizeSum: ko.observable(props.EmailAttachments.reduce((a, e) => a + e.FileSizeBytes, 0)).extend({
            //max: {
            //    params: 20,
            //    message: 'You may not exceed 20mb of attachments total'
            //}
        }),
        addNewAttachment: function () {
            let a = emailAttachment({
                TradeAccountCreationEmailAttachmentID: [...Math.random(32).toString()].splice(2).join('')
            }, self);
            self.attachmentsManager.attachments.push(a);
            setTimeout(() => {
                a.name.DOMElement.focus();
            }, 0);

            self.errors = new ko.validation.group([
                self.name,
                self.attachmentsManager.attachmentsSizeSum,
                self.attachmentsManager.attachments()
            ], {
                deep: true
            });
        },
        removeAttachment: (a) => {
            window.showConfirm('Are you sure?', `This will remove the attachment from the list.`, () => {
                self.attachmentsManager.attachments(self.attachmentsManager.attachments().filter(b => b.TradeAccountCreationEmailAttachmentID != a.TradeAccountCreationEmailAttachmentID))

                self.errors = new ko.validation.group([
                    self.name,
                    self.attachmentsManager.attachmentsSizeSum,
                    self.attachmentsManager.attachments()
                ], {
                    deep: true
                });
            }, null)
        },
        checkAttachment: (a) => {
            return fetch('/api/customermaintenance/checkCreationEmailAttachment', {
                method: 'POST',
                headers: window.fetchHeaders,
                dataType: 'json',
                body: JSON.stringify({
                    path: a.path(),
                    salesMarket: self.SalesMarket.Name
                })
            }).then(async resp => {
                if (resp.ok)
                    return resp.json();
                else {
                    let t = await resp.json();
                    console.error(t);
                    throw new error(t.Message);
                }
            });
        }
    }

    self.attachmentsManager.attachments.subscribe(nv => {
        window.setTimeout(() => {
            $('#attachment-manager .list-group').sortable({
                handle: '.sort-handle',
                items: '.sort-item',
                beforeStop: (e) => {
                    console.log(e);
                }
            });
        }, 0);
    });

    self.attachmentsManager.sortedAttachments = ko.computed(() => {
        return self.attachmentsManager.attachments().sort((a, b) => a.SortOrder > b.SortOrder ? 1 : -1);
    }, self);

    if (props.EmailAttachments.length) {
        self.attachmentsManager.attachments(props.EmailAttachments.sort((a, b) => a.SortOrder > b.SortOrder ? 1 : -1).map(e => emailAttachment(e, self)));
    }

    self.attachmentsManager.attachmentsSizeComputer = ko.computed(() => {
        var result = Math.round((self.attachmentsManager.attachments().reduce((acc, x) => acc + x.fileSizeBytes() ?? 0, 0) / 1024 / 1024) * 100) / 100;
        if (!isNaN(result))
            return self.attachmentsManager.attachmentsSizeSum(result);
        else
            return null;
    }, self);

    self.errors = new ko.validation.group([
        self.name,
        self.attachmentsManager.attachmentsSizeSum,
        self.attachmentsManager.attachments()
    ], {
        deep: true
    });

    self.selectedEmailAttachmentId = ko.observable();

    self.selectedEmailAttachment = ko.observable();

    //$('#creation-email-edit-modal').on('show.bs.modal', () => {
    //    self.attachmentsManager.attachmentsListParams.dropDownListSettings.widget()
    //})

    self.attachmentsManager.attachmentsListParams = {
        label: 'Attachments',
        observable: self.selectedEmailAttachmentId,
        busy: self.busy,
        revertible: false,
        clearable: true,
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false,
        controlClass: 'form-control',
        disable: ko.observable(false),
        enable: ko.observable(true),
        dropDownListSettings: {
            popup: {
                appendTo: $('#creation-email-edit-modal')
            },
            optionLabel: 'Add Attachment From List',
            value: self.selectedEmailAttachmentId,
            dataItem: self.selectedEmailAttachment,
            dataValueField: 'TradeAccountCreationEmailAttachmentID',
            dataTextField: 'Name',
            height: 420,
            widget: ko.observable(),
            enabled: true,
            open: (e) => {
                $(self.selectedEmailAttachmentId.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: (e) => {
                $(self.selectedEmailAttachmentId.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            data: new kendo.data.DataSource({
                serverFiltering: false,
                serverSorting: false,
                serverGrouping: false,
                serverPaging: false,
                transport: {
                    read: function (options) {
                        var webapi = new kendo.data.transports.webapi({ prefix: "" });
                        var mapped = webapi.parameterMap(options.data);
                        var data = {};
                        for (var propertyName in mapped) {
                            data[propertyName] = mapped[propertyName];
                        }

                        data.salesMarketId = self.SalesMarketID;

                        $.ajax({
                            url: "/api/customermaintenance/GetTradeAccountCreationEmailAttachments",
                            type: "GET",
                            data: data,
                            success: function (data) {
                                //console.log(valueField + ' returned', data);
                                options.success(data);
                            },
                            error: function (data) {
                                options.error();
                            }
                        });
                    }
                },
                schema: $.extend({}, kendo.data.schemas.webapi, {
                    data: "Data",
                    total: "Total",
                    filters: "Filters",
                    aggregates: "Aggregates",
                    errors: "Errors",
                    model: {
                        id: 'GetTradeAccountCreationEmailAttachments',
                        fields: {
                            GetTradeAccountCreationEmailAttachments: {
                                editable: false,
                                nullable: false
                            },
                            Name: {
                                type: 'string',
                                validation: {
                                    required: true,
                                    nullable: false
                                }
                            },
                            FilePath: {
                                type: 'string',
                                validation: {
                                    required: true,
                                    nullable: false
                                }
                            },
                        }
                    }
                }),
            }),
            valuePrimitive: false,
            autoWidth: false,
            autoBind: true,
            filter: 'startswith',
            select: (e) => {
                console.log('select', e);
                self.attachmentsManager.attachments.push(emailAttachment({
                    Attachment: {
                        Name: e.dataItem.Name, FilePath: e.dataItem.FilePath
                    },
                    ...e.dataItem, // spread to grab the other properties such as, and most importantly, TradeAccountCreationEmailAttachmentID
                }, self));
                window.setTimeout(() => {
                    self.attachmentsManager.attachmentsListParams.clearFunction();
                }, 0);
            }
        },
        clearFunction: function () {
            self.attachmentsManager.attachmentsListParams.dropDownListSettings.widget().value(null);
            self.selectedEmailAttachmentId(null);
        }
    }

    //$('#creation-email-edit-modal').on('shown.bs.modal', () => {
    //    self.attachmentsManager.attachmentsListParams.dropDownListSettings.widget().setOptions({
    //        popup: { appendTo: $('#attachment-manager') }
    //    });
    //});

    return self;
};

const emailAttachment = (props, parent) => {
    let self = {
        ...props,
        validateNow: parent.validateNow ?? ko.observable(false),
        removeAttachment: parent.attachmentsManager.removeAttachment,
        checkAttachment: parent.attachmentsManager.checkAttachment
    };

    let path = props.Attachment?.FilePath ?? undefined;

    self.fileCheckPerformed = ko.observable(path ? true : false).extend({
        equals: {
            params: true,
            onlyIf: self.validateNow(),
            message: 'File check not performed'
        }
    });

    self.fileFound = ko.observable(path ? true : false).extend({
        equals: {
            params: true,
            onlyIf: self.validateNow(),
            message: 'File not found'
        }
    });

    self.busy = ko.observable(false);

    self.name = ko.observable(props.Attachment?.Name ?? undefined).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow();
            },
            message: 'Provide a name'
        },
        isUnique: {
            params: {
                array: parent.attachmentsManager.attachments,
                predicate: (a, b) => {
                    return a.name() === b
                },
            },
            message: 'Please provide unique names'
        },
        rateLimit: {
            timeout: 500,
            method: 'notifyWhenChangesStop'
        }
    });

    self.pathParams = {
        label: '',
        observable: self.path,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 280
        }
    }

    self.path = ko.observable(path).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow();
            },
            message: 'Provide a file path'
        },
        pattern: {
            params: /^\\\\(?:files|vm-web1|vm-web2|vm-web)/i,
            message: 'provide a path to a file either on the files server or on our vm-web server.'
        },
        rateLimit: {
            timeout: 500,
            method: 'notifyWhenChangesStop'
        }
    });

    self.pathParams = {
        label: '',
        observable: self.path,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 280
        }
    }

    self.fileSizeBytes = ko.observable(props.Attachment?.FileSizeBytes);

    self.checkPath = () => {
        if (self.path.isValid()) {
            self.busy(true);
            self.checkAttachment(self)
                .then(data => {
                    console.log('filecheck', data.success);
                    self.fileSizeBytes(data.fileSizeBytes)
                    self.busy(false);
                    self.fileCheckPerformed(true);
                    self.fileFound(data.success);
                })
                .catch(err => {
                    self.busy(false);
                    self.fileSizeBytes(undefined);
                    self.fileCheckPerformed(true);
                    self.fileFound(false);
                })
        }
    }

    self.path.subscribe(nv => self.checkPath);

    self.path.valueHasMutated();

    self.isValid = ko.computed(() => {
        return (self.busy() === false) &&
            (self.name.isValid() === true) &&
            (self.path.isValid() === true) &&
            (self.fileCheckPerformed() === true) &&
            (self.fileFound() === true);
    }, self)

    self.isInvalid = ko.computed(() => {
        return !self.isValid();
    }, self);

    self.readonly = ko.observable(false);

    return self;
}
