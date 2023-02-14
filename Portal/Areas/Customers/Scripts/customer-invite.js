var userRecord = function (a) {
    var self = this;

    self.saved = true;

    self.rowClass = '';

    self.admin = false;

    //self.unsavedChanges = ko.observable(false);

    self.editEmail = false;

    self.checkEmailBusy = ko.observable(false);

    self.permissionsAlreadyExist = ko.observable(false);

    self.memberId = a.MemberID;
    self.fullName = a.FullName;
    self.email = ko.observable(a.Email);
    self.daysRemaining = ko.observable(a.DaysRemainingToRegister);
    self.tradeAuthenticationComplete = a.TradeAuthenticationComplete;
    self.manageAccount = ko.observable(a.TradePermissionAccountAdmin);
    self.placeOrders = ko.observable(a.TradePermissionPlaceOrder);
    self.requestSamples = ko.observable(a.TradePermissionRequestSample);
    self.viewAccounts = ko.observable(a.TradePermissionViewAccounts);
    self.downloadPricelistsBrochures = ko.observable(a.TradePermissionDownloadPricelistsBrochures);
    self.downloadProductFeeds = ko.observable(a.TradePermissionDownloadProductFeeds);
    self.tradePricingDisplay = a.DisplayTradePrice;

    self.manageAccount.subscribe(function (newValue) {
        //viewModel.unsavedChanges(true);
        //self.unsavedChanges(true);
    });

    self.placeOrders.subscribe(function (newValue) {
        //viewModel.unsavedChanges(true);
        //self.unsavedChanges(true);
    });

    self.requestSamples.subscribe(function (newValue) {
        //viewModel.unsavedChanges(true);
        //self.unsavedChanges(true);
    });

    self.viewAccounts.subscribe(function (newValue) {
        //viewModel.unsavedChanges(true);
        //self.unsavedChanges(true);
    });

    self.downloadPricelistsBrochures.subscribe(function (newValue) {
        //viewModel.unsavedChanges(true);
        //self.unsavedChanges(true);
    });

    self.downloadProductFeeds.subscribe(function (newValue) {
        //viewModel.unsavedChanges(true);
        //self.unsavedChanges(true);
    });


    self.validateNow = ko.observable(false);

    // need an array validation... where at least one element in the array is true

    self.permissionsValid = ko.computed(function () {
        var pO = self.placeOrders();
        var rS = self.requestSamples();
        var vA = self.viewAccounts();
        var vSS = self.downloadPricelistsBrochures();
        var d = self.downloadProductFeeds();

        if (pO || vA || vSS || d)
            return true;
        else
            return false;
    }, self).extend({
        equal: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: ' '
        }
    });

    self.get = function () {
        return {
            MemberID: self.memberId,
            FullName: self.fullName,
            Email: self.email,
            ManageAccount: self.manageAccount(),
            PlaceOrders: self.placeOrders(),
            RequestSamples: self.requestSamples(),
            ViewAccounts: self.viewAccounts(),
            DownloadPricelistsBrochures: self.downloadPricelistsBrochures(),
            DownloadProductFeeds: self.downloadProductFeeds(),
            CountryID: getCountryID(),
            LanguageID: getLanguageID()
        }
    }
}

var customerInviteViewModel = function () {
    var self = this;

    self.busy = ko.observable(false);
    self.busyMessage = ko.observable('Working...');

    self.resendRecipient = ko.observable();
    self.checkResult = ko.observable();
    self.tradeInfo = ko.observable();
    self.tradeAdmins = ko.observableArray([]);
    self.tradeUsers = ko.observableArray([]);
    self.showLastSentTo = ko.observable(false);
    self.lastSentTo = ko.observable();

    self.selectAccount = function (account) {
        self.checkResult(undefined);
        self.tradeInfo(undefined);
        self.tradeAdmins([]);
        self.tradeUsers([]);
        self.checkViability();
    }

    self.tradeAccountSelector = new tradeAccountSelector(getPreselectedTradeAccount(), self.selectAccount, self);

    self.validateSendNow = ko.observable(false);

    self.to = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateSendNow();
            },
            message: 'Recipient Email Required'
        },
        email: {
            params: true,
            onlyIf: function () {
                return self.validateSendNow();
            },
            message: 'Invalid Email'
        }
    });

    self.originalTo = ko.observable();

    self.toParams = {
        label: 'Email To',
        originalValue: self.originalTo,
        observable: self.to,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false,
        readOnly: false,
        disabled: false,
        busy: ko.observable(false),
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        revertFunction: function () {
            self.toParams.busy(true);
            $.ajax({
                url: '/api/customerinvite/refreshTradeEmail',
                type: 'POST',
                dataType: 'json',
                data: {
                    accountNumber: self.tradeAccountSelector.selected().Code
                },
                success: function (data) {
                    self.toParams.busy(false);
                    self.to(data);
                },
                error: function (xhr, s, a) {
                    self.toParams.busy(false);
                    $.showError(xhr, s, a);
                }
            });
        },
        charsRemainingOptions: {
            maxLength: 254
        }
    }

    /* 
        revertFunction: function () {
            self.to(self.originalTo());
            $(self.to.DOMElement).focus();
        },

    */

    self.originalName = ko.observable();

    self.name = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateSendNow();
            },
            message: 'Name Required'
        }
    });

    self.nameParams = {
        label: 'Name',
        originalValue: self.originalName,
        observable: self.name,
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
            maxLength: 1000
        }
    };

    self.sendErrors = new ko.validation.group([
        self.to,
        self.name
    ]);

    // despite all appearances, this whole thing doesn't actually send an email
    // because of stupid reasons, the powers that be want me to invoke the user's
    // email client in order to let them send the email from their own account.
    // This simply holds the results from portal.TradeAccount_InviteToB2B
    self.inviteResult = ko.observable();

    self.buildTradeInfo = function (tradeInfo) {
        var tradeAdmins = [];
        var tradeUsers = [];

        if (tradeInfo) {
            for (var i = 0; i < tradeInfo.administrators.length; i++) {
                tradeAdmins.push(new userRecord(tradeInfo.administrators[i]));
            }

            for (var i = 0; i < tradeInfo.users.length; i++) {
                tradeUsers.push(new userRecord(tradeInfo.users[i]));
            }

            self.tradeAdmins(tradeAdmins);
            self.tradeUsers(tradeUsers);
        }
    }

    self.checkViability = function (clearFields) {
        self.busyMessage('Working...');
        clearFields = typeof clearFields === 'undefined' ? true : clearFields
        self.busy(true);
        var data = {
            tradeAccountId: self.tradeAccountSelector.selected().TradeAccountID
        }
        console.log('checkViability calling with', data);
        $.ajax({
            url: '/api/customerinvite/checkViability',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.busy(false);
                console.log('checkViability returned', data);
                self.checkResult(data.viability);
                if (clearFields) {
                    self.to(data.viability.Email);
                    self.name(undefined);
                }
                self.originalTo(data.viability.Email);
                self.originalName(data.viability.Name);
                if (data.hasOwnProperty('tradeAccountModel')) {
                    self.tradeInfo(data.tradeAccountModel);
                    self.buildTradeInfo(self.tradeInfo());
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.resendUserInvite = function (user) {
        self.busyMessage('Resending User Invite to ' + user.fullName);
        self.busy(true);
        var data = {
            memberId: user.memberId
        };
        console.log('calling resendUserInvite with', data);
        $.ajax({
            url: '/api/customerinvite/resendUserInvite',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('resendUserInvite returned', data);
                self.busy(false);
                user.daysRemaining(data.daysRemainingToRegister);
                $.info('Invitiation Resent', user.fullName + ' has been resent an invitation. They have ' + data.daysRemainingToRegister + ' days remaining to register.');
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.resendAdminInvite = function (user) {
        self.busyMessage('Resending Admin Invite to ' + user.fullName);
        self.busy(true);
        var data = {
            memberId: user.memberId
        };
        console.log('calling resendAdminInvite with', data);
        $.ajax({
            url: '/api/customerinvite/resendAdminInvite',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('resendAdminInvite returned', data);
                self.busy(false);
                user.daysRemaining(data.daysRemainingToRegister);
                $.info('Invitiation Resent', user.fullName + ' has been resent an invitation. They have ' + data.daysRemainingToRegister + ' days remaining to register.');
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.inviteCustomer = function () {
        self.validateSendNow(true);
        if (self.sendErrors().length) {
            self.sendErrors.filter(function (x) {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            var data = {
                tradeAccountId: self.tradeAccountSelector.selected().TradeAccountID,
                name: self.name(),
                email: self.to()
            }
            console.log('calling inviteCustomer with', data);
            self.busyMessage('Running PreFlight Checks &amp; Sending Email...');
            self.busy(true);
            $.ajax({
                url: '/api/customerinvite/inviteCustomer',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('inviteCustomer returned', data);
                    //if (data.InviteErrors == null) {
                    //    self.sendInvite();
                    //} else {

                    window.setTimeout(function () {
                        self.inviteResult(data);
                        self.busy(false);
                        if (data.InviteErrors == null) {
                            self.showLastSentTo(true);
                            self.lastSentTo(self.to());
                        }
                    }, 2000)

                    //}

                    self.checkViability(false);
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError(xhr, s, a);
                }
            });
        }
    }

    //self.sendInvite = function () {
    //    var data = {
    //        tradeAccountId: self.tradeAccountSelector.selected().TradeAccountID,
    //        name: self.name(),
    //        email: self.to()
    //    }
    //    console.log('calling sendInvite with', data);
    //    self.busy(true);
    //    self.busyMessage('Sending Email...');
    //    $.ajax({
    //        url: '/api/customerinvite/sendInvite',
    //        type: 'POST',
    //        dataType: 'json',
    //        data: data,
    //        success: function (data) {
    //            self.busy(false);
    //            console.log('sendInvite returned', data);
    //            self.lastSentTo(self.to());
    //            self.showLastSentTo(true);
    //            //window.setTimeout(function () {
    //            //    self.showLastSentTo(false);
    //            //}, 10000);
    //            self.inviteResult(data);
    //            self.checkViability(false);
    //        },
    //        error: function (xhr, s, a) {
    //            self.busy(false);
    //            $.showError(xhr, s, a);
    //        }
    //    });
    //}

    if (getPreselectedTradeAccount()) {
        self.selectAccount();
    }
}