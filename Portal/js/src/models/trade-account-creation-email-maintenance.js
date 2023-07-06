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
        }, {
            field: 'DisplayB2BRegistrationRequest',
            title: 'B2B Registration Request',
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

    self.resultGridDataSource =
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
            }
            //this.editRow(this.select());
            ////if (self.resultGridWidget().select()) {
            ////    self.busy(true);
            ////    var selectedItem = self.resultGridWidget().dataItem(self.resultGridWidget().select());
            ////    if (selectedItem != null) {
            ////        self.parent.orderFactory.loadBasket(selectedItem, function () {
            ////            self.busy(false);
            ////        });
            ////    } else {
            ////        self.busy(false);
            ////    }
            ////}
        },
        dataBound: function (e) {
            //if (self.customResultStatusFilterActive()) {
            //    window.setTimeout(function () {
            //        $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
            //    }, 0);
            //} else {
            //    $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            //}
        },
        filterMenuInit: function (e) {

            //var ds = [];
            //var filterToggle = null;
            //var operator = null;

            //switch (e.field) {
            //    case 'Status':
            //        ds = getMyHeldOrderImportStatuses();
            //        operator = "contains";
            //        filterToggle = self.customResultStatusFilterActive;
            //        break;
            //    default: break;
            //}

            //if (filterToggle != null) {
            //    var popup = e.container.data("kendoPopup");
            //    var dataSource = this.dataSource;
            //    var field = e.field;
            //    var element = e.container.children(":first");

            //    var originalMultiCheck = e.container.children(":first");
            //    // helpTextElement.nextUntil(":has(.k-button)").remove();
            //    var element = $("<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck).kendoListView({
            //        dataSource: ds,
            //        template: "<label><input type='checkbox' value='#:" + field + "#'/>#:Name#</label>"
            //    });
            //    originalMultiCheck.remove();
            //    e.container.children('.k-filter-selected-items').remove();

            //    e.container.find("[type='submit']").click(function (e) {
            //        e.preventDefault();
            //        e.stopPropagation();
            //        var filter = dataSource.filter() || { logic: "and", filters: [] };
            //        var fieldFilters = $.map(element.find('input[type="checkbox"]:checked'), function (input) {
            //            return {
            //                field: field,
            //                operator: operator,
            //                value: input.value
            //            };
            //        });
            //        if (fieldFilters.length) {
            //            self.removeFiltersForField(filter, field);
            //            filter.filters.push({
            //                logic: "or",
            //                filters: fieldFilters
            //            });
            //            dataSource.filter(filter);
            //            filterToggle(true);
            //        }
            //        popup.close();
            //    });

            //    e.container.find("[type='reset']").click(function (e) {
            //        filterToggle(false);
            //    });
            //}
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
        revertable: false,
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

    return self;
}

const editModel = (props) => {
    let self = { ...props };

    self.busy = ko.observable(false);

    self.validateNow = ko.observable(false);

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
                    displayB2BRegistration: self.displayB2BRegistration(),
                    attachments: self.attachmentsManager.attachments().map(a => {
                        return {
                            name: a.name(),
                            path: a.path()
                        }
                    })
                })
            }).then(resp => resp.json())
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
                    window.catchFetchError(err);
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

    self.displayB2BRegistration = ko.observable(props.DisplayB2BRegistrationRequest);

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

    self.attachmentsManager = {
        attachments: ko.observableArray(props.EmailAttachments.map(e => emailAttachment(e))),
        addAttachment: function () {
            let a = emailAttachment({
                TradeAccountCreationEmailAttachmentID: [...Math.random(32).toString()].splice(2).join('')
            }, self);
            self.attachmentsManager.attachments.push(a);
            setTimeout(() => {
                a.name.DOMElement.focus();
            }, 0);

            self.errors = new ko.validation.group([
                self.name,
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
                    path: a.path()
                })
            }).then(resp => resp.json())
        }
    }

    self.errors = new ko.validation.group([
        self.name,
        self.attachmentsManager.attachments()
    ], {
        deep: true
    });

    self.save = () => {
        self.validateNow(true);

        if (self.errors().length) {
            self.errors.showAllMessages(true);
        } else {
            self.busy(true);
            setTimeout(() => {
                self.busy(false);
            }, 3000);
        }
    }

    return self;
};

const emailAttachment = (props, parent) => {
    let self = {
        ...props,
        validateNow: parent.validateNow,
        removeAttachment: parent.attachmentsManager.removeAttachment,
        checkAttachment: parent.attachmentsManager.checkAttachment
    };

    self.fileCheckPerformed = ko.observable(false).extend({
        equals: {
            params: true,
            onlyIf: self.validateNow(),
            message: 'File check not performed'
        }
    });

    self.fileFound = ko.observable(false).extend({
        equals: {
            params: true,
            onlyIf: self.validateNow(),
            message: 'File not found'
        }
    });

    self.busy = ko.observable(false);

    self.name = ko.observable(props.Name).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow();
            },
            message: 'Provide a name'
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

    self.path = ko.observable(props.FilePathUNC).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow();
            },
            message: 'Provide a file path'
        },
        //pattern: {
        //    params: /^\\\\(?:files|vm-web1)/,
        //    message: 'Provide a path to a file either on the Files server or on VM-WEB1.'
        //},
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

    self.path.subscribe(nv => {
        if (self.path.isValid()) {
            self.busy(true);
            self.checkAttachment(self)
                .then(data => {
                    console.log('filecheck', data.success);
                    self.busy(false);
                    self.fileCheckPerformed(true);
                    self.fileFound(data.success);
                })
                .catch(err => window.catchFetchError(err));
        }
    });

    self.path.valueHasMutated();

    self.isValid = ko.computed(() => {
        return self.name.isValid() && self.path.isValid() && self.fileCheckPerformed() && self.fileFound();
    }, self)

    self.isInvalid = ko.computed(() => {
        return !self.isValid();
    }, self)

    return self;
}
