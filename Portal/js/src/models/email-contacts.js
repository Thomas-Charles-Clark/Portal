const EMPTY_STRING = '',
    yesNoOptions = [{
        text: 'Yes',
        value: true
    }, {
        text: 'No',
        value: false
    }],
    legalBasisOptions = [{
        text: 'Legitimate Interest',
        value: 'Legitimate Interest'
    }, {
        text: 'Consent',
        value: 'Consent'
    }];

const emailContactsViewModel = (() => {
    var self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable("Please wait");

    self.emailBusy = ko.observable(true);

    self.memberId = ko.observable();

    self.member = ko.observable();

    self.memberDetails = ko.observable();

    self.validateAccountChangeNow = ko.observable(false);

    self.destinationDotDigitalAccountId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateAccountChangeNow();
            },
            message: "You must select a destination account"
        }
    });

    self.destinationDotDigitalAccount = ko.observable();

    self.changeAccountModalElement = document.querySelector('#change-account-modal');

    self.changeAccountModal = bootstrap.Modal.getOrCreateInstance(self.changeAccountModalElement);

    self.validateNewContactNow = ko.observable(false);

    self.newSourceId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNewContactNow();
            },
            message: "You must select a source"
        }
    });

    self.newSource = ko.observable();

    self.newOperatorCode = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNewContactNow() && self.newSource() && self.newSource().Retail;
            },
            message: "You must select an operator"
        }
    });

    self.newOperator = ko.observable();

    self.newEmailExtantCheckPerformed = ko.observable(false);

    self.newEmailExtantCheckPassed = ko.observable(false).extend({
        equal: {
            params: true,
            onlyIf: () => {
                return self.newEmailExtantCheckPerformed();
            },
            message: "That email address is already registered"
        }
    });

    self.emailExists = ko.computed(() => {
        return (self.newEmailExtantCheckPerformed() == true) &&
            (self.newEmailExtantCheckPassed() == false);
    }, self);

    self.newEmail = ko.observable().extend({
        email: {
            params: true,
            onlyIf: () => {
                return self.validateNewContactNow();
            },
            message: "Invalid email format"
        },
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNewContactNow();
            },
            message: "Email is required"
        },
        validation: {
            validator: function (val, otherVal) {
                return self.emailExists() == false;
            },
            params: false,
            message: 'Email is extant'
        }
    });

    self.newFullName = ko.observable().extend({
        maxLength: {
            params: 100,
            onlyIf: () => {
                return self.validateNewContactNow();
            },
            message: "FullName must be 0 to 100 characters"
        }
    });

    self.newDotDigitalAccountId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNewContactNow();
            },
            message: "Dot Digital Account is required"
        }
    });

    self.newDotDigitalAccount = ko.observable();

    self.newCheckConfirmation = ko.observable(false).extend({
        equal: {
            params: true,
            onlyIf: () => {
                return self.validateNewContactNow();
            },
            message: "You must acknowledge that you have explicit permission to add this contact to our emailing list." 
        }
    });

    //#endregion

    //#region Lifted Methods

    self.genericUnsavedChangesClear = (e) => {
        self.checkUnsavedChangesThenClear(e);
    }

    self.checkUnsavedChangesThenClear = async (options) => {
        await self.unsavedChanges().then(() => {
            var self = options; // self is now the params of the control the user just interacted with

            if (ko.isObservableArray(self.observable)) {
                self.observable([]);
            } else {
                self.observable(EMPTY_STRING);
            }

            if (self.dropDownListSettings.widget()) {

                if (ko.isObservableArray(self.observable)) {
                    self.dropDownListSettings.widget().value([]);
                } else {
                    self.dropDownListSettings.widget().value(EMPTY_STRING);
                }

                self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.getDefaultFoundation().adapter_.closeOutline();

                if (self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_ != null)
                    self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_.float(false);
            }

            if (typeof self.afterClear === 'function') {
                self.afterClear();
            }

        }).catch((e) => { });
    }

    self.unsavedChanges = () => {
        return new Promise((resolve, reject) => {

            let array = [];

            let unsaved = false; // array.find(p => p.unsavedChanges());

            if (unsaved) {
                window.showConfirm('Unsaved changes', 'You have unsaved changes. If you proceed your changes will be lost. Proceed?', () => {
                    resolve();
                }, () => {
                    reject();
                });
            } else {
                resolve();
            }
        });
    }

    //#endregion

    //#region Components (Knockout-specific)

    self.memberTemplate = (item) => {
        if (item.FullName != null && item.FullName != '') {
            return `<span class="member-label">${item.FullName} - ${item.Email}</span>`;
        } else {
            return `<span class="member-label">${item.Email}</span>`;
        }
    }

    self.emailParams = kendoMDCDropDownList({
        cascadeEnabled: true,
        label: 'Email Address',
        autoBind: false,
        odata: true,
        endPoint: '/odata/Members/Default.MembersForEmailContacts()',
        textField: 'Email',
        valueField: 'Id',
        virtual: true,
        minLength: 5,
        pageSize: 40,
        busy: self.emailBusy,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/Members/Default.MemberValueMapper(Id=${options.value})`,
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
        template: self.memberTemplate,
        valueTemplate: self.memberTemplate,
        idObservable: self.memberId,
        objObservable: self.member,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: [{
            dir: 'asc',
            field: 'Email'
        }],
        requestStart: (e) => {
            self.emailBusy(true);
        },
        requestEnd: (e) => {
            self.emailBusy(false);
        },
        clearFunction: self.genericUnsavedChangesClear,
        afterClear: () => {
            self.member(undefined);
            self.memberDetails(undefined);
        },
        parameterMap: (data) => {

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            let filters = [];

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Email")) {
                let f = data.filter.filters.find(f => f.field === "Email");
                let lowered = f.value.toLowerCase();

                //filters.push(`tolower(Email) eq '${lowered}'`);
                //filters.push(`tolower(FullName) eq '${lowered}'`);
                filters.push(`startswith(tolower(Email),'${lowered}')`);
                //filters.push(`startswith(tolower(FullName), '${lowered}')`);

                if (!isNaN(+f.value)) {
                    filters.push(`Id eq ${+f.value}`);
                }
                if (d.$filter) {
                    delete d.$filter;
                }
            }

            if (filters.length) {
                let filterString = filters.join(' or ');
                d.$apply = `filter(${filterString})`;
            }

            if (!d.$apply) {
                delete d.$apply;
            } else {
                console.log(d.$apply);
            }

            return d;
        },
        popupSettings: {
            appendTo: document.getElementById('email-prefilter')
        }
    });

    self.destinationDotDigitalAccountParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'To',
        textField: 'Name',
        valueField: 'DotDigitalAccountID',
        data: getDotDigitalAccounts(),
        idObservable: self.destinationDotDigitalAccountId,
        objObservable: self.destinationDotDigitalAccount,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: false,
        sort: [{
            dir: 'asc',
            field: 'DotDigitalAccountID'
        }],
        popupSettings: {
            appendTo: document.getElementById('change-account-modal')
        }
    });

    self.newSourceParams = kendoMDCDropDownList({
        skipCascade: true,
        idObservable: self.newSourceId,
        objObservable: self.newSource,
        label: 'Source',
        textField: 'Name',
        valueField: 'SourceID',
        data: getSources(),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: false,
        sort: [{
            dir: 'asc',
            field: 'Name'
        }]
    });

    self.newOperatorParams = kendoMDCDropDownList({
        skipCascade: true,
        idObservable: self.newOperatorCode,
        objObservable: self.newOperator,
        label: 'Operator',
        textField: 'Label',
        valueField: 'OperatorCode',
        odata: true,
        endPoint: '/odata/Mertex_Operators',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/Mertex_Operators/Default.Mertex_OperatorValueMapper(code=${options.value})`,
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
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: false,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            if (data && data.filter && data.filter.filters && data.filter.filters.length) {
                data.pageSize = 40;
            } else {
                data.pageSize = 0;
            }

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(Label)' === 0)) {
                d.$filter = `(tolower(OperatorCode) eq '${data.filter.filters[0].value.toLowerCase()}') or ${d.$filter.replace("Label", "Name")} or ${d.$filter.replace("Label", "Email")}`;
            }

            return d;
        },
        filter: "startswith",
        sort: [{
            dir: 'asc',
            field: 'Name'
        }]
    });

    self.newEmailParams = {
        label: 'Email Address',
        originalValue: ko.observable(),
        observable: self.newEmail,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        charsRemainingOptions: {
            maxLength: 254
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false)
    };

    self.newFullNameParams = {
        label: 'Name',
        originalValue: ko.observable(),
        observable: self.newFullName,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        charsRemainingOptions: {
            maxLength: 100
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false)
    };

    self.newDotDigitalAccountParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Dot Digital Account',
        textField: 'Name',
        valueField: 'DotDigitalAccountID',
        data: getDotDigitalAccounts(),
        idObservable: self.newDotDigitalAccountId,
        objObservable: self.newDotDigitalAccount,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: false,
        sort: [{
            dir: 'asc',
            field: 'DotDigitalAccountID'
        }]
    });

    self.newCheckConfirmationParams = {
        label: 'The owner of this email address has given me explicit permission to add them to our email mailing list',
        checkboxId: `new-check-confirmation`,
        observable: self.newCheckConfirmation,
        originalValue: ko.observable(false),
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    //#endregion


    //#region Subscriptions

    self.newSourceId.subscribe(nv => {
        if (nv == null || nv == '' || +nv == 74) {
            self.newOperatorParams.clearFunction();
        }
    })

    self.memberId.subscribe(nv => {
        if (nv) {
            self.fetchDetails();
        }
    });

    self.newEmail.subscribe(nv => {
        self.newEmailExtantCheckPerformed(false);
    });

    //#endregion


    //#region Computeds

    self.memberDetailsLoaded = ko.computed(() => {
        return self.memberDetails() != null;
    }, self);

    self.jsonMarkup = ko.computed(() => {
        if (self.member() && self.memberDetails()) {
            let props = Object.assign(self.member(), { tfnc_MemberControl: self.memberDetails() });
            delete props.Roles;
            delete props.Logins;
            return PR.prettyPrintOne(JSON.stringify(props, null, 4));
        }
    }, self);

    self.checkNewEmail = ko.computed(function () {

        if (self.newEmail() &&
            self.newEmail.isValid()) {
            var email = self.newEmail();
            if (email) {
                //self.busy(true);

                fetch('/api/emailcontactsapi/ExtantEmailCheck', {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    cache: 'no-store',
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        email: self.newEmail()
                    })
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        self.newEmailExtantCheckPerformed(true);

                        self.busy(false);

                        if (data == true) {
                            // this email IS extant
                            self.newEmailExtantCheckPassed(false);
                            self.newEmail.DOMElement.classList.add('validation-element');
                            self.newEmailExtantCheckPassed.isModified(true);
                        } else {
                            self.newEmailExtantCheckPassed(true);
                            self.newEmail.DOMElement.classList.remove('validation-element');
                            self.newEmailExtantCheckPassed.isModified(true);
                        }
                    })
                    .catch(err => {
                        self.busy(false);
                        self.newEmailExtantCheckPerformed(true);
                        self.newEmailExtantCheckPassed(false);
                        self.newEmailExtantCheckPassed.isModified(true);
                    });
            }
        }
    }, self).extend({
        rateLimit: {
            timeout: 300,
            method: 'notifyWhenChangesStop'
        }
    });

    self.createNewDisabled = ko.computed(() => {
        let performed = self.newEmailExtantCheckPerformed();
        let exists = self.emailExists();
        let ddaid = self.newDotDigitalAccountId();

        if (!performed) {
            return true;
        }

        if (exists) {
            return true;
        }

        if (ddaid == null) {
            return true;
        }

        return false;

    }, self);

    //#endregion


    //#region Validation Groups

    self.changeAccountErrors = ko.validation.group([
        self.destinationDotDigitalAccountId
    ]);

    self.newContactErrors = ko.validation.group([
        self.newSourceId,
        self.newOperatorId,
        self.newEmail,
        self.newFullName,
        self.newDotDigitalAccountId,
        self.newCheckConfirmation
    ]);

    //#endregion


    //#region Methods

    self.showChangeAccountModal = () => {
        self.changeAccountModal.show();
    }

    self.hideChangeAccountModal = () => {
        self.changeAccountModal.hide();
    }

    self.saveAccountChange = () => {
        self.validateAccountChangeNow(true);

        if (self.changeAccountErrors().length) {
            self.changeAccountErrors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            window.showConfirm("Are you sure?", "This will change the DotDigital account the customer resides within.", () => {
                self.changeAccount();
            }, () => {

            });
        }
    }

    self.reset = () => {
        self.errors.showAllMessages(false);

        self.memberId(undefined);
        self.member(undefined);
        self.memberDetails(undefined);
    }

    self.resetNewContact = () => {
        self.validateNewContactNow(false);
        self.newSourceParams.clearFunction();
        self.newOperatorParams.clearFunction();
        self.newEmail(undefined);
        self.newFullName(undefined);
        self.newDotDigitalAccountParams.clearFunction();
        self.newCheckConfirmation(false);
    }

    self.fetchDetails = () => {
        //self.busy(true);

        let params = {
            memberId: self.memberId()
        };

        self.memberDetails(undefined);

        console.log('fetchDetails calling with', params);

        fetch('/api/emailcontactsapi/FetchDetails', {
            method: 'POST',
            headers: window.fetchHeaders,
            credentials: 'same-origin',
            cache: 'no-cache',
            body: JSON.stringify(params)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                //self.busy(false);
                console.log('fetchDetails returned', data);
                self.memberDetails(data);
            })
            .catch(err => {
                //self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.changeAccount = () => {
        self.busy(true);

        let params = {
            memberId: self.memberId(),
            email: self.member().Email,
            sourceAccountId: self.memberDetails().DotDigitalAccountID,
            destinationAccountId: self.destinationDotDigitalAccount().DotDigitalAccountID,
            destinationCountryId: self.destinationDotDigitalAccount().CountryID,
            destinationAccountTypeId: self.destinationDotDigitalAccount().DotDigitalAccountTypeID
        };

        fetch('/api/emailcontactsapi/ChangeAccount', {
            method: 'POST',
            headers: window.fetchHeaders,
            credentials: 'same-origin',
            cache: 'no-cache',
            body: JSON.stringify(params)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.busy(false);
                window.showInfo("Done", "This change will be actioned with DotDigital shortly.", () => {
                    self.fetchDetails();
                    self.hideChangeAccountModal();
                }, () => {

                });
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.resubscribe = () => {

        window.showConfirm('Are you sure?', 'This action will send the recipient our resubscribe email. They will need to click the link in that email to confirm their desire to resubscribe to our marketing emails.', () => {

            self.busy(true);

            let params = {
                guid: self.member().GUID
            };

            fetch('/api/emailcontactsapi/Resubscribe', {
                method: 'POST',
                headers: window.fetchHeaders,
                credentials: 'same-origin',
                cache: 'no-cache',
                body: JSON.stringify(params)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.busy(false);
                    window.showInfo("Done", "The resubscribe email has been sent.", () => {
                        self.fetchDetails();
                        self.hideChangeAccountModal();
                    }, () => {

                    });
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                })
        }, () => {

        });
    }

    self.unsubscribe = () => {

        window.showConfirm('Are you sure?', 'This action will unsubscribe the contact from our marketing emails.', () => {

            self.busy(true);

            let params = {
                memberId: self.memberId(),
                guid: self.member().GUID,
                email: self.member().Email
            };

            fetch('/api/emailcontactsapi/Unsubscribe', {
                method: 'POST',
                headers: window.fetchHeaders,
                credentials: 'same-origin',
                cache: 'no-cache',
                body: JSON.stringify(params)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.busy(false);
                    window.showInfo("Done", "The unsubscribe has been actioned.", () => {
                        self.fetchDetails();
                    }, () => {

                    });
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                })
        }, () => {

        });
    }

    self.createNew = () => {

        self.validateNewContactNow(true);

        if (self.newContactErrors().length) {
            self.newContactErrors.showAllMessages(true);
            self.newContactErrors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            // go

            window.showConfirm("Are you sure?", "Please double check before submitting this new contact.", () => {
                let params = {
                    sourceId: self.newSourceId(),
                    operatorCode: self.newOperatorCode(),
                    email: self.newEmail(),
                    fullName: self.newFullName(),
                    dotDigitalAccountId: self.newDotDigitalAccountId()
                }

                console.log("createNew calling with", params);

                self.busy(true);

                fetch('/api/emailcontactsapi/CreateNew', {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    body: JSON.stringify(params)
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        self.busy(false);
                        window.showInfo("Thank you", "Contact created successfully.");
                        self.resetNewContact();
                    })
                    .catch(err => {
                        self.busy(false);
                        window.catchFetchError(err);
                    })
            }, null);
        }
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
});