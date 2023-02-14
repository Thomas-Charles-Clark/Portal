var tradeAccountContactViewModel = function (options) {
    var self = this;

    options = options || {};

    self.validateNow = ko.observable(false);

    self.tradeAccount = options.tradeAccount;

    self.tradeAccountContactId = ko.observable();

    self.parent = options.parent;

    self.busy = ko.observable(false);

    self.receiveOrderConfirmations = ko.observable(false);
    self.receiveMarketing = ko.observable(false);
    self.receiveFinancial = ko.observable(false);
    self.receivePricelists = ko.observable(false);

    self.title = {
        observable: ko.observable(),
        label: 'Title', // do we want a label, or an options caption... or both...?
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: getAvailableTitles(),
        optionsText: 'Title',
        optionsValue: 'TitleID',
        optionsCaption: ' ',
        width: '100px'
    };

    self.name = {
        label: 'Name',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                }
            }
        }),
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
            maxLength: 50
        }
    };

    self.role = {
        label: 'Role',
        observable: ko.observable(),
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
            maxLength: 50
        }
    };

    self.mobile = {
        label: 'Mobile Phone',
        observable: ko.observable(),
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
            maxLength: 20
        }
    };

    self.work = {
        label: 'Work Phone',
        observable: ko.observable(),
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
            maxLength: 20
        }
    };

    self.email = {
        label: 'Email',
        observable: ko.observable().extend({
            email: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                }
            }
            //,required: {
            //    params: false,
            //    onlyIf: function () {
            //        return self.validateNow()
            //    }
            //}
        }),
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
            maxLength: 256
        }
    };

    self.skype = {
        label: 'Skype',
        observable: ko.observable(),
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
            maxLength: 256
        }
    };

    self.whatsApp = {
        label: 'WhatsApp',
        observable: ko.observable(),
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
            maxLength: 256
        }
    };

    self.website = {
        label: 'Website',
        observable: ko.observable(),
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
            maxLength: 256
        }
    };

    self.errors = ko.validation.group([
        self.name,
        self.email
    ], {
        deep: true
    });

    self.load = function (contact) {

        $('#trade-account-contact-modal').modal('show');

        self.validateNow(false);
        self.errors.showAllMessages(false);

        window.setTimeout(function () {

            self.tradeAccountContactId(contact.TradeAccountContactID);

            self.title.observable(contact.TitleID);
            self.name.observable(contact.FullName);
            self.role.observable(contact.Role);
            self.mobile.observable(contact.MobilePhone);
            self.work.observable(contact.WorkPhone);
            self.email.observable(contact.Email);
            self.skype.observable(contact.SkypeID);
            self.whatsApp.observable(contact.WhatsApp);
            self.website.observable(contact.Website);
            self.receiveOrderConfirmations(contact.ReceiveOrderConfirmations);
            self.receiveMarketing(contact.ReceiveMarketing);
            self.receiveFinancial(contact.ReceiveFinancial);
            self.receivePricelists(contact.ReceivePricelists);

        }, 300);
    }

    self.save = function () {
        self.validateNow(true);
        self.errors.showAllMessages(false);
        if (self.errors().length) {
            self.errors.showAllMessages(true);
        } else {
            self.busy(true);

            var data = self.toJS();

            $.ajax({
                url: '/api/leadsapi/upsertTradeAccountContact',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    self.busy(false);
                    self.reset();
                    self.hide();
                    self.parent.reload();
                },
                error: function (xhr, s, a) {
                    $.showError(xhr, s, a);
                }
            });
        }
    }

    self.deleteContact = function () {
        $.confirm('Are you sure?', 'This will mark the contact as deleted.', function () {
            self.busy(true);
            var data = {
                tradeAccountContactId: self.tradeAccountContactId()
            };
            $.ajax({
                url: '/api/leadsapi/deleteTradeAccountContact',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    self.busy(false);
                    self.reset();
                    self.hide();
                    self.parent.reload();
                },
                error: function (xhr, s, a) {
                    $.showError(xhr, s, a);
                }
            });
        });
    }

    self.reset = function () {
        self.busy(false);

        self.tradeAccountContactId(undefined);

        self.title.observable(undefined);
        self.name.observable(undefined);
        self.role.observable(undefined);
        self.mobile.observable(undefined);
        self.work.observable(undefined);
        self.email.observable(undefined);
        self.skype.observable(undefined);
        self.whatsApp.observable(undefined);
        self.website.observable(undefined);

        self.receiveOrderConfirmations(false);
        self.receiveMarketing(false);
        self.receiveFinancial(false);
        self.receivePricelists(false);

        self.validateNow(false);
        self.errors.showAllMessages(false);
    }

    self.toJS = function () {
        return {
            tradeAccountId: self.tradeAccount().TradeAccountID,
            tradeAccountContactId: self.tradeAccountContactId(),
            titleId: self.title.observable(),
            fullName: self.name.observable(),
            role: self.role.observable(),
            mobilePhone: self.mobile.observable(),
            workPhone: self.work.observable(),
            email: self.email.observable(),
            skypeId: self.skype.observable(),
            whatsApp: self.whatsApp.observable(),
            website: self.website.observable(),
            receiveOrderConfirmations: self.receiveOrderConfirmations(),
            receiveMarketing: self.receiveMarketing(),
            receiveFinancial: self.receiveFinancial(),
            receivePricelists: self.receivePricelists()
        };
    }

    self.show = function () {
        $('#trade-account-contact-modal').modal('show');
    }

    self.hide = function () {
        $('#trade-account-contact-modal').modal('hide');
    }
}