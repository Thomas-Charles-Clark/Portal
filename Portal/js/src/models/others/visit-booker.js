var visitBooker = function (tradeAccount, parent, afterSave) {
    var self = this;

    self.parent = parent;

    self.selectedTradeAccount = tradeAccount;

    //self.orderProductsDrilldown = new orderProductsDrilldownViewModel(self, 'main');

    //self.orderProductsDrilldownFurnitureComponents = new orderProductsDrilldownViewModel(self, 'bespokeFurniture');

    //self.currentlyActiveDrilldown = ko.observable(self.orderProductsDrilldown);

    //self.orderFactory = new orderProductsViewModel(self, self.selectedTradeAccount);

    self.afterSave = afterSave || function () { };

    self.selectedTradeAccount = tradeAccount;

    self.selectedTradeAccountVisitId = ko.observable();

    self.visitOrders = ko.observableArray([]);

    self.deliveryAddress = new addressViewModel({
        labelClass: 'col-form-label',
        controlClass: '',
        propertiesToValidate: [],
        defaultCountry: 81
    });

    self.selectedTradeAccountId = ko.computed(function () {
        if (self.selectedTradeAccount()) {
            return self.selectedTradeAccount().TradeAccountID;
        }
    });

    self.validateNow = ko.observable(false);

    self.visitDate = ko.observable(null).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'Please specify a date.'
        }
    });

    self.timeOptions = [
        '08:00', '08:15', '08:30', '08:45',
        '09:00', '09:15', '09:30', '09:45',
        '10:00', '10:15', '10:30', '10:45',
        '11:00', '11:15', '11:30', '11:45',
        '12:00', '12:15', '12:30', '12:45',
        '13:00', '13:15', '13:30', '13:45',
        '14:00', '14:15', '14:30', '14:45',
        '15:00', '15:15', '15:30', '15:45',
        '16:00', '16:15', '16:30', '16:45',
        '17:00', '17:15', '17:30', '17:45',
        '18:00', '18:15', '18:30', '18:45',
        '19:00', '19:15', '19:30', '19:45', '20:00'];

    self.visitTime = ko.observable().extend({
        required: {
            params: true,
            message: 'Please specify a time.'
        },
        pattern: {
            message: 'Invalid time: please use 24 hour format e.g. 16:45.',
            params: /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
        }
    });

    self.timeComboBoxParams = {
        data: self.timeOptions,
        value: self.visitTime
    }

    self.notes = ko.observable().extend({
        //charsRemaining: {
        //    maxLength: 2000,
        //    elementId: '#new-visit-notes'
        //}
    });

    self.attendees = ko.observableArray([]).extend({
        notify: 'always'
    });

    self.tradeAccountContactId = ko.observable();

    self.tradeAccountContactSlicer = ko.observable();

    //// #region Edit Contact Stuff

    //self.contactBusy = ko.observable(false);
    //self.editContactId = ko.observable();
    //self.editContactTitle = ko.observable();
    //self.editContactTypeId = ko.observable();
    //self.editContactDecisionMaker = ko.observable(false);
    //self.editContactFullName = ko.observable().extend({
    //    maxLength: 50,
    //    required: {
    //        params: true,
    //        message: 'Please provide a name'
    //    },
    //    charsRemaining: {
    //        maxLength: 50,
    //        elementId: '.trade-contact-fullname'
    //    }
    //});
    //self.editContactEmail = ko.observable().extend({
    //    maxLength: 256,
    //    email: {
    //        params: true,
    //        message: 'Invalid email format'
    //    },
    //    charsRemaining: {
    //        maxLength: 256,
    //        elementId: '.trade-contact-email'
    //    }
    //});
    //self.editContactWorkPhone = ko.observable().extend({
    //    charsRemaining: {
    //        maxLength: 20,
    //        elementId: '.trade-contact-work-phone'
    //    }
    //});
    //self.editContactMobilePhone = ko.observable().extend({
    //    charsRemaining: {
    //        maxLength: 20,
    //        elementId: '.trade-contact-mobile-phone'
    //    }
    //});
    //self.editContactHomePhone = ko.observable().extend({
    //    charsRemaining: {
    //        maxLength: 20,
    //        elementId: '.trade-contact-home-phone'
    //    }
    //});
    //self.editContactSkype = ko.observable().extend({
    //    charsRemaining: {
    //        maxLength: 256,
    //        elementId: '.trade-contact-skype'
    //    }
    //});
    //self.editContactWhatsApp = ko.observable().extend({
    //    charsRemaining: {
    //        maxLength: 256,
    //        elementId: '.trade-contact-whatsapp'
    //    }
    //});
    //self.editContactLinkedIn = ko.observable().extend({
    //    charsRemaining: {
    //        maxLength: 256,
    //        elementId: '.trade-contact-linkedin'
    //    }
    //});
    //self.editContactWebsite = ko.observable().extend({
    //    charsRemaining: {
    //        maxLength: 256,
    //        elementId: '.trade-contact-website'
    //    }
    //});
    //self.editContactFacebook = ko.observable().extend({
    //    charsRemaining: {
    //        maxLength: 256,
    //        elementId: '.trade-contact-facebook'
    //    }
    //});
    //self.editContactTwitter = ko.observable().extend({
    //    charsRemaining: {
    //        maxLength: 256,
    //        elementId: '.trade-contact-twitter'
    //    }
    //});
    //self.editContactInstagram = ko.observable().extend({
    //    charsRemaining: {
    //        maxLength: 256,
    //        elementId: '.trade-contact-instagram'
    //    }
    //});
    //self.editContactYouTube = ko.observable().extend({
    //    charsRemaining: {
    //        maxLength: 256,
    //        elementId: '.trade-contact-youtube'
    //    }
    //});
    //self.editContactPinterest = ko.observable().extend({
    //    charsRemaining: {
    //        maxLength: 256,
    //        elementId: '.trade-contact-pinterest'
    //    }
    //});
    //self.editContactNotes = ko.observable().extend({
    //    charsRemaining: {
    //        maxLength: 500,
    //        elementId: '.trade-contact-notes'
    //    }
    //});
    //self.editContactBirthday = ko.observable();

    //self.editContactWebsiteHref = ko.pureComputed({
    //    read: function () {
    //        if (self.editContactWebsite()) {
    //            var r = self.editContactWebsite();
    //            if (r.indexOf('https://') > -1) {
    //                return r;
    //            }
    //            if (r.indexOf('http://') > -1) {
    //                return r;
    //            }
    //            return 'http://' + r;
    //        }
    //    }
    //}, self);

    //self.editContactFacebookHref = ko.pureComputed({
    //    read: function () {
    //        if (self.editContactFacebook()) {
    //            return 'https://www.facebook.com/' + self.editContactFacebook();
    //        }
    //    }
    //}, self);

    //self.editContactTwitterHref = ko.pureComputed({
    //    read: function () {
    //        if (self.editContactTwitter()) {
    //            return 'https://www.twitter.com/' + self.editContactTwitter();
    //        }
    //    }
    //}, self);

    //self.editContactInstagramHref = ko.pureComputed({
    //    read: function () {
    //        if (self.editContactInstagram()) {
    //            return 'https://www.instagram.com/' + self.editContactInstagram();
    //        }
    //    }
    //}, self);

    //self.editContactYouTubeHref = ko.pureComputed({
    //    read: function () {
    //        if (self.editContactYouTube()) {
    //            return 'https://www.youtube.com/' + self.editContactYouTube();
    //        }
    //    }
    //}, self);

    //self.editContactPinterestHref = ko.pureComputed({
    //    read: function () {
    //        if (self.editContactPinterest()) {
    //            return 'https://www.pinterest.com/' + self.editContactPinterest();
    //        }
    //    }
    //}, self);

    //self.editContactErrors = ko.validation.group([
    //    self.editContactFullName,
    //    self.editContactEmail
    //]);

    //self.loadContactForEdit = function (contact) {
    //    self.editContactId(contact.LeadContactID);
    //    self.editContactTitle(contact.TitleID);
    //    self.editContactFullName(contact.FullName);
    //    self.editContactTypeId(contact.LeadContactTypeID);
    //    self.editContactDecisionMaker(contact.DecisionMaker);
    //    self.editContactEmail(contact.Email);
    //    self.editContactWorkPhone(contact.WorkPhone);
    //    self.editContactMobilePhone(contact.MobilePhone);
    //    self.editContactHomePhone(contact.HomePhone);
    //    self.editContactSkype(contact.SkypeID);
    //    self.editContactWhatsApp(contact.WhatsApp);
    //    self.editContactLinkedIn(contact.LinkedIn);
    //    self.editContactNotes(contact.Notes);
    //    self.editContactBirthday(contact.Birthday);
    //    self.editContactWebsite(contact.Website);
    //    self.editContactInstagram(contact.Instagram);
    //    self.editContactFacebook(contact.Facebook);
    //    self.editContactTwitter(contact.Twitter);
    //    self.editContactYouTube(contact.YouTube);
    //    self.editContactPinterest(contact.Pinterest);

    //    self.editContactErrors.showAllMessages(false);
    //    $("#trade-account-contact-modal").modal('show');
    //}

    //self.deleteContact = function (contact) {
    //    $.ajax({
    //        url: '/api/LeadsAPI/DeleteTradeAccountContact',
    //        type: 'POST',
    //        dataType: 'json',
    //        cache: false,
    //        data: contact,
    //        success: function (data) {
    //            console.log('delete trade account contact returned', data);
    //        },   
    //        error: function (xhr, s, a) {

    //        }
    //    });
    //}

    //self.saveContact = function () {

    //    if (self.editContactErrors().length > 0) {
    //        self.editContactErrors.showAllMessages(true);
    //    } else {
    //        $("#trade-account-contact-modal").modal('hide');

    //        // We have at least one existing lead contact; this contact is to be
    //        // added to or updated immediately.
    //        self.contactBusy(true);

    //        var birthday = null;

    //        if (self.editContactBirthday()) {
    //            try {
    //                birthday = self.editContactBirthday().toISOString();
    //            } catch (e) {
    //                birthday = self.editContactBirthday();
    //            }
    //        }

    //        var submit = {
    //            TradeAccountID: self.selectedTradeAccountId(),
    //            TradeAccountContactID: self.editContactId(),
    //            DecisionMaker: self.editContactDecisionMaker(),
    //            TradeAccountContactTypeID: self.editContactTypeId(),
    //            TitleID: self.editContactTitle(),
    //            FullName: self.editContactFullName(),
    //            WorkPhone: self.editContactWorkPhone(),
    //            MobilePhone: self.editContactMobilePhone(),
    //            HomePhone: self.editContactHomePhone(),
    //            Email: self.editContactEmail(),
    //            SkypeID: self.editContactSkype(),
    //            LinkedIn: self.editContactLinkedIn(),
    //            WhatsApp: self.editContactWhatsApp(),
    //            Website: self.editContactWebsite(),
    //            Instagram: self.editContactInstagram(),
    //            Facebook: self.editContactFacebook(),
    //            Twitter: self.editContactTwitter(),
    //            YouTube: self.editContactYouTube(),
    //            Pinterest: self.editContactPinterest(),
    //            Birthday: birthday,
    //            Notes: self.editContactNotes()
    //        };

    //        $.ajax({
    //            url: '/api/LeadsAPI/UpsertTradeAccountContact',
    //            type: 'POST',
    //            dataType: 'json',
    //            cache: false,
    //            data: submit,
    //            success: function (data) {

    //                console.log('UpsertTradeAccountContact returned', data);

    //                self.parent.tradeAccountContacts.push(data);

    //                self.attendees.push(data);

    //                self.resetContact();

    //                $('#trade-account-contact-modal').modal('hide');

    //                self.contactBusy(false);
    //            },
    //            error: function (xhr, e, s) {
    //                self.contactBusy(false);
    //                //$.showError(xhr, e, s);
    //            }
    //        });
    //    }
    //}

    //// #endregion

    //self.tradeAccountContactListParams = {
    //    widget: self.tradeAccountContactSlicer,
    //    controlClass: '',
    //    displayName: 'Attendees',
    //    name: 'tradeAccountContactAddableList',

    //    itemsList: self.parent.tradeAccountContacts,

    //    // if this ever differs from the
    //    // target:, the lovely checky business fails... unless... the exact
    //    // same object instances occur in both arrays
    //    itemClick: function (data, event) {
    //        self.loadContactForEdit(data, event);
    //    },
    //    itemListDelete: function (data, event) {
    //        var name = '';

    //        if (data.Title) {
    //            name += data.Title.Title + ' ' + data.FullName;
    //        } else {
    //            name = data.FullName;
    //        }

    //        $.confirm('Are you sure?', 'This will delete ' + name + '.', function () {

    //            self.deleteContact(data);

    //            var attendee = Enumerable.From(self.attendees()).Where(function (x) {
    //                return x.TradeAccountContactID == data.TradeAccountContactID;
    //            }).SingleOrDefault();

    //            if (attendee) {
    //                self.attendees.remove(attendee);
    //                self.parent.tradeAccountContacts.remove(attendee);
    //            }

    //        }, null);
    //    },
    //    autocompleteMaxLength: 200,
    //    autocompleteElementId: 'trade-account-contact',
    //    target: self.attendees, // ko.observableArray
    //    additionalData: {
    //        TradeAccountID: self.selectedTradeAccountId
    //    },
    //    valueField: 'TradeAccountContactID',
    //    textField: 'FullName',
    //    autocompleteEndpoint: '/api/LeadsAPI/TradeAccountContactSlicerEndpoint',
    //    listPull: 'pull-right',
    //    customAddFunction: function (term) {
    //        self.editContactFullName(term.Name);
    //        $('a[href="#trade-contact-general"]').tab('show');
    //        $('#trade-account-contact-modal').modal('show');
    //    }
    //};

    //self.saveNewTradeAccountContact = function () {
    //    console.log('save new trade account contact called');
    //    self.saveContact();
    //}

    self.loadVisitForEdit = function (tradeAccountVisit) {
        $('a[href="#visit-booking-container"]').tab('show');
        self.visitDate(tradeAccountVisit.VisitDT);

        var mo = moment(self.visitDate());

        var visitTime = mo.get('hour') + ':' + mo.get('minute');

        self.visitTime(visitTime);

        if (tradeAccountVisit.DeliveryAddress)
            self.deliveryAddress.load(tradeAccountVisit.DeliveryAddress);

        self.notes(tradeAccountVisit.Notes);

        self.attendees([]);

        var undeletedAttendees = Enumerable.From(tradeAccountVisit.Attendees).Where(function (x) {
            return x.TradeAccountContact.Deleted == false
        }).ToArray();

        for (var i = 0; i < undeletedAttendees.length; i++) {

            var a = Enumerable.From(self.parent.tradeAccountContacts()).Where(function (x) {
                return x.TradeAccountContactID == undeletedAttendees[i].TradeAccountContactID;
            }).Single();

            self.attendees.push(a);
        }
        self.selectedTradeAccountVisitId(tradeAccountVisit.TradeAccountVisitID);

        $("div.field-error").empty();

        $("#VisitDT").removeClass("alert alert-danger");

        self.fetchVisitOrders();

        self.show();
    }

    self.fetchVisitOrders = function () {
        console.log('visitBooker calling fetchVisitOrders', self.selectedTradeAccountVisitId())
        $.ajax({
            url: '/api/componentapi/FetchVisitOrders',
            type: 'POST',
            dataType: 'json',
            data: {
                TradeAccountVisitID: self.selectedTradeAccountVisitId()
            },
            success: function (data) {
                console.log('visitBooker fetchVisitOrders returned', data);
                self.visitOrders(data);
            },
            error: function (xhr, s, a) {
                $.showError(xhr, s, a);
            }
        });
    }

    self.show = function () {
        $("#visit-edit-modal").modal("show");
    }

    self.close = function () {
        self.newVisit();
        $("#visit-edit-modal").modal('hide');
    }

    self.newVisit = function () {
        $('a[href="#visit-booking-container"]').tab('show');
        self.selectedTradeAccountVisitId(undefined);
        self.visitDate(undefined);
        self.visitTime(undefined);
        self.notes(undefined);
        self.attendees([]);
        self.validateNow(false);
        self.errors.showAllMessages(false);
        self.deliveryAddress.reset();
        self.visitOrders([]);

        self.resetContact();

        self.show();
    }

    self.resetContact = function () {

        //self.contactBusy(false);
        //self.editContactId(undefined);
        //self.editContactTitle(undefined);
        //self.editContactFullName(undefined);
        //self.editContactTypeId(undefined);
        //self.editContactDecisionMaker(false);
        //self.editContactEmail(undefined);
        //self.editContactWorkPhone(undefined);
        //self.editContactMobilePhone(undefined);
        //self.editContactHomePhone(undefined);
        //self.editContactSkype(undefined);
        //self.editContactWhatsApp(undefined);
        //self.editContactLinkedIn(undefined);
        //self.editContactWebsite(undefined);
        //self.editContactFacebook(undefined);
        //self.editContactTwitter(undefined);
        //self.editContactInstagram(undefined);
        //self.editContactYouTube(undefined);
        //self.editContactPinterest(undefined);
        //self.editContactNotes(undefined);
        //self.editContactBirthday(undefined);

        //self.errors.showAllMessages(false);
    }

    self.removeFromAttendees = function (removal) {
        self.attendees.remove(function (item) { return item.MemberID == removal.MemberID; });
    }

    self.errors = ko.validation.group([
        self.visitDate,
        self.visitTime
    ]);

    self.save = function () {
        self.validateNow(true);
        if (self.errors().length) {
            self.errors.showAllMessages(true);
            return;
        } else {

            var visitDt = moment(self.visitDate());//.toISOString() : null;

            var timeMoment = moment(self.visitTime(), 'HH:mm');

            visitDt = visitDt.set({
                'hour': timeMoment.get('hour'),
                'minute': timeMoment.get('minute')
            });

            visitDt = visitDt.toISOString();

            //console.log('visitBooker save hit, selectedTradeAccountId was: ' + self.selectedTradeAccount().TradeAccountID)
            var tradeAccountId = ko.unwrap(self.selectedTradeAccount).TradeAccountID;

            var tradeAccountVisitId = self.selectedTradeAccountVisitId();

            var notes = self.notes();

            var attendees = [];

            ko.utils.arrayForEach(self.attendees(), function (item) {
                attendees.push({ TradeAccountContactID: item.TradeAccountContactID });
            });

            var data = {
                TradeAccountVisitID: tradeAccountVisitId,
                TradeAccountID: tradeAccountId,
                VisitDT: visitDt,
                Notes: notes,
                Attendees: attendees
            };

            self.parent.busy(true);

            console.log('visitBooker calling saveVisit', data);

            $.ajax({
                url: '/api/leadsapi/saveCustomerVisit',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {

                    console.log('visitBooker saveVisit returned', data);

                    $("#visit-edit-modal").modal('hide');

                    self.afterSave();

                    self.parent.busy(false);
                },
                error: function (xhr, textStatus, errorThrown) {
                    self.parent.busy(false);
                    $.showError(xhr, textStatus, errorThrown);
                }
            });
        }
    }

    //self.showOrderFactory = function () {
    //    if (self.selectedTradeAccountVisitId())
    //        self.orderFactory.show(self.selectedTradeAccountVisitId());
    //}
}

var tradeAccountContact = function (_tradeAccountContact) {
    var self = this;
    self.tradeAccountId = ko.observable(_tradeAccountContact.TradeAccountID);
    self.leadContactId = ko.observable(_tradeAccountContact.TradeAccountContactID);
    self.titleId = ko.observable(_tradeAccountContact.TitleID);
    self.title = ko.pureComputed({
        read: function () {
            var title = Enumerable.From(getAvailableTitles()).Where(function (x) {
                return x.TitleID == self.titleId()
            }).SingleOrDefault();
            if (title)
                return title.Title;
            else
                return null;
        }
    }, self);
    self.fullName = ko.observable(_tradeAccountContact.FullName);
    self.nameDisplay = ko.pureComputed({
        read: function () {
            var result = self.fullName();
            if (self.title()) {
                return self.title() + ' ' + result;
            } else {
                return result;
            }
        }
    }, self);
    self.tradeAccountContactTypeId = ko.observable(_tradeAccountContact.TradeAccountContactTypeID);
    self.TradeAccountContactTypeDisplay = ko.pureComputed({
        read: function () {
            if (self.tradeAccountContactTypeId()) {
                return Enumerable.From(getAvailableTradeAccountContactTypes()).Where("$.TradeAccountContactTypeID == " + self.tradeAccountContactTypeId()).Select("$.Name").Single();
            } else {
                return null;
            }
        }
    }, self);
    self.decisionMaker = ko.observable(_tradeAccountContact.DecisionMaker);
    self.decisionMakerDisplay = ko.pureComputed({
        read: function () {
            return (self.decisionMaker() ? 'Yes' : 'No')
        }
    }, self);
    self.email = ko.observable(_tradeAccountContact.Email);
    self.workPhone = ko.observable(_tradeAccountContact.WorkPhone);
    self.mobilePhone = ko.observable(_tradeAccountContact.MobilePhone);
    self.homePhone = ko.observable(_tradeAccountContact.HomePhone);
    self.skype = ko.observable(_tradeAccountContact.SkypeID);
    self.whatsApp = ko.observable(_tradeAccountContact.WhatsApp);
    self.linkedIn = ko.observable(_tradeAccountContact.LinkedIn);
    self.website = ko.observable(_tradeAccountContact.Website);
    self.instagram = ko.observable(_tradeAccountContact.Instagram);
    self.facebook = ko.observable(_tradeAccountContact.Facebook);
    self.twitter = ko.observable(_tradeAccountContact.Twitter);
    self.youTube = ko.observable(_tradeAccountContact.YouTube);
    self.pinterest = ko.observable(_tradeAccountContact.Pinterest);
    self.notes = ko.observable(_tradeAccountContact.Notes);
    self.birthday = ko.observable(_tradeAccountContact.Birthday);

    self.websiteHref = ko.pureComputed({
        read: function () {
            if (self.website()) {
                var r = self.website();
                if (r.indexOf('https://') > -1) {
                    return r;
                }
                if (r.indexOf('http://') > -1) {
                    return r;
                }
                return 'http://' + r;
            }
        }
    }, self);

    self.instagramHref = ko.pureComputed({
        read: function () {
            if (self.instagram()) {
                return 'https://www.instagram.com/' + self.instagram();
            }
        }
    }, self);

    self.facebookHref = ko.pureComputed({
        read: function () {
            if (self.facebook()) {
                return 'https://www.facebook.com/' + self.facebook();
            }
        }
    }, self);

    self.twitterHref = ko.pureComputed({
        read: function () {
            if (self.twitter()) {
                return 'https://www.twitter.com/' + self.twitter();
            }
        }
    }, self);

    self.youTubeHref = ko.pureComputed({
        read: function () {
            if (self.youTube()) {
                return 'https://www.youtube.com/' + self.youTube();
            }
        }
    }, self);

    self.pinterestHref = ko.pureComputed({
        read: function () {
            if (self.pinterest()) {
                return 'https://www.pinterest.com/' + self.pinterest();
            }
        }
    }, self);

    self.toJSON = function () {
        var copy = this;
        delete copy.title; // ui
        delete copy.nameDisplay; // ui
        return copy;
    }
}