// The base viewModel for LeadEnquiry.js
// Holds an instance of a leadSearch and one of a leadEdit.
// Also holds various static lists of data available to the user.
//
var leadEnquiryViewModel = function () {
    var self = this;

    // leadSearch handles the dashboard and result grid 
    self.leadSearch = new leadSearch();

    // leadEdit feeds the LeadEditModal
    // requires a reference to its parent
    self.leadEdit = new leadEdit(self);

    self.availableAccountTypes = getAvailableAccountTypes();

    self.availableChannels = getAvailableChannels();

    self.availableCompanyTypeOptions = getAvailableCompanyTypeOptions();

    self.availableCompetitors = ko.observableArray(getAvailableCompetitors());

    self.availableLeadTags = ko.observableArray(getAvailableLeadTags());

    self.availableCountries = getAvailableCountries();

    self.availableCurrencies = getAvailableCurrencies();

    self.availableCustomerTypes = getAvailableCustomerTypes();

    self.availableHasShowroomOptions = getYesNoDontKnowOptions();

    self.availableLanguages = getAvailableLanguages();

    self.availableMertexLanguages = getAvailableMertexLanguages().filter(x => x.SortOrder != null).sort((a, b) => a.SortOrder > b.SortOrder ? 1 : -1);

    self.availableLeadContactTypes = getAvailableLeadContactTypes();

    self.availableLeadMagnitudes = getAvailableLeadMagnitudes();

    self.availableLeadTypes = getAvailableLeadTypes();

    self.allPaymentTerms = getPaymentTerms();

    self.availablePatternBookCommitmentOptions = getYesNoDontKnowOptions();

    self.availablePatternBookLibraryOptions = getYesNoDontKnowOptions();

    self.availableSalesMarkets = getAvailableSalesMarkets();

    self.availableShowroomByAppointmentOnlyOptions = getYesNoDontKnowOptions();

    self.availableJoinPatternBookSchemeOptions = getYesNoOptions();

    self.availablePlacedOrderOptions = getYesNoOptions();

    self.availableSources = getAvailableSources();

    self.availableTitles = getAvailableTitles();

    self.availableTradingSinceOptions = getAvailableTradingSinceOptions();

    self.availablePaymentOptions = getAvailablePaymentOptions();

    self.availableTradeAccountClasses = getAvailableTradeAccountClasses();

    self.availablePurchaseOrderRequiredOptions = getYesNoDontKnowOptions();

    // defunct
    self.availableCreditControllers = getAvailableCreditControllers();

    // defunct
    self.creditControllerSalesMarketMap = getCreditControllerSalesMarketMap();

    self.creditControllerAssignments = getCreditControllerAssignments();

    self.availableBanks = getAvailableBanks();

    self.bankSalesMarketMap = getBankSalesMarketMap();

    self.availableTradeAccountGroups = getAvailableTradeAccountGroups();

    self.availableSendPricelistsOptions = getYesNoDontKnowOptions();

    self.availableBelongToGroupAccountOptions = getYesNoDontKnowOptions();

    //self.availableHauliers = getAvailableHauliers();

    //self.availableCarriages = getAvailableCarriages();

    //self.availableSampleHauliers = getAvailableSampleHauliers();

    //self.availableSampleCarriages = getAvailableSampleCarriages();

    self.availableSalesDivisions = getYesNoOptions();

    self.availableDeliveryTerms = getAvailableDeliveryTerms();

    self.exchangeRates = getAvailableExchangeRates();

    self.miscSearch = new miscCustomerSearch(self);

    self.customerSearch = new customerSearch(self);

    self.customerView = new customerView();
}

// LeadEdit. This does the heavy lifting in LeadEnquiry.
// Contains 190 observables... are they all resetting when appropriate?
// are they all sensibly used?
var leadEdit = function (parent) {

    var self = this;

    self.parent = parent;

    // #region Properties (observables, observableArrays, other)

    // this is now a nonsense and is confusing; it is a relic from 
    // a time long ago when we permitted people to create leads directly
    // and checked their details against an extant set of data,
    // etc. etc. It is a display setting for the modals, not a property inherently 
    // of any given lead loaded.
    self.stage = ko.observable(1);

    // if you've loaded and there's a modified greater than when you loaded when you save, guess what?
    self.loadedDt = null;

    self.busy = ko.observable(false);
    self.leadLoadBusy = ko.observable(false);
    self.leadSaveBusy = ko.observable(false);

    self.leadSaveBusy.subscribe(nv => {
        console.log('leadEdit leadSaveBusy', nv);
    });

    self.leadContactsBusy = ko.observable(false);
    self.viewLeadBusy = ko.observable(false);
    self.confirmNewLead = ko.observable(false);
    self.addingNewNote = ko.observable(false);
    self.newCompetitor = ko.observable(false);
    self.newLeadTag = ko.observable(false);
    self.leadId = ko.observable();
    self.viewingLead = ko.observable();
    self.salesMarket = ko.observable().extend({
        required: {
            params: true,
            message: 'You must specify a market'
        }
    });
    self.accountTypeId = ko.observable().extend({
        //required: {
        //    params: true,
        //    message: 'You must specify an account type'
        //}
    });
    self.customerTypeId = ko.observable().extend({
        required: {
            params: true,
            message: 'You must specify a customer type'
        }
    });
    self.companyCurrencyId = ko.observable().extend({
        required: {
            params: true,
            message: 'You must specify a currency'
        }
    });
    self.companyCurrency = ko.pureComputed({
        read: function () {
            if (self.companyCurrencyId()) {
                return Enumerable.From(self.parent.availableCurrencies).Where(function (x) {
                    return x.CurrencyID == self.companyCurrencyId()
                }).Single()
            } else {
                return self.gbpCurrency
            }
        }
    }, self);
    self.companyAnnualRevenue = ko.observable().extend({
        numberFormatted: {
            digits: 0,
            currency: self.companyCurrency,
            maxValue: 900000000000000,
            minValue: -900000000000000
        }
    });
    self.salesRepresentative = ko.observable().extend({
        required: {
            params: true,
            message: 'You must specify a representative'
        }
    });
    self.salesAgent = ko.observable();
    //.extend({
    //    required: {
    //        params: true,
    //        message: 'You must specify an agent'
    //    }
    //});
    self.salesArea = ko.observable().extend({
        required: {
            params: true,
            message: 'You must specify a sales area'
        }
    });
    self.tradePriceList = ko.observable().extend({
        required: {
            params: true,
            message: 'You must specify a price list'
        }
    });
    self.paymentTerms = ko.observable().extend({
        required: {
            params: true,
            message: 'You must specify payment terms'
        }
    });
    self.requestedPaymentOption = ko.observable().extend({
        required: {
            params: true,
            message: 'You must specify a payment option'
        }
    });
    self.leadTypeId = ko.observable();
    self.selectedLeadStatus = ko.observable().extend({
        required: {
            params: true,
            message: 'You must specify a status'
        }
    });
    self.loadedLeadStatus = ko.observable();
    self.loadedLeadStatusId = ko.observable();
    self.leadStatusReasonRequired = ko.pureComputed(function () {
        if (self.selectedLeadStatus()) {
            if ([4, 5, 9].indexOf(self.selectedLeadStatus().LeadStatusID) > -1)
                return true;
            else
                return false;
        } else {
            return false;
        }
    }, self)
    self.leadStatusReason = ko.observable().extend({
        charsRemaining: {
            maxLength: 250,
            elementId: '.lead-status-reason'
        },
        required: {
            params: true,
            onlyIf: self.leadStatusReasonRequired,
            message: 'Please provide a reason for this status'
        }
    });
    self.starRating = ko.observable();
    self.leadMagnitudeId = ko.observable();
    self.countryId = ko.observable(81).extend({
        required: {
            params: true,
            message: 'Please select a Market'
        }
    });
    self.languageId = ko.observable(1).extend({
        required: {
            params: true,
            message: 'Please select a Language'
        }
    });
    self.createdDt = ko.observable();
    self.createdSince = ko.observable();
    self.modifiedDt = ko.observable();
    self.modifiedSince = ko.observable();
    self.assignedDt = ko.observable();
    self.assignedSince = ko.observable();
    self.tradingSinceId = ko.observable();
    self.tradingSinceLoadedValue = ko.observable();
    self.sourceMember = ko.observable();
    self.brandsWorkedWith = ko.observableArray();
    self.leadTags = ko.observableArray();
    self.willBuyPatternBooks = ko.observable().extend({
        required: {
            params: true,
            message: 'You must answer this question'
        }
    });
    self.hasPatternBookLibrary = ko.observable().extend({
        required: {
            params: true,
            message: 'You must answer this question'
        }
    });
    self.hasShowroom = ko.observable().extend({
        required: {
            params: true,
            message: 'You must answer this question'
        }
    });
    self.showroomByAppointmentOnly = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.hasShowroom() == 1;
            },
            message: 'You must answer this question'
        }
    });
    self.companyTypeId = ko.observable();
    self.brandsWorkedWithAutocomplete = ko.observable();
    self.leadTagsAutocomplete = ko.observable();
    self.notes = ko.observableArray([]);
    self.leadAddresses = ko.observableArray([]);
    self.leadContactId = ko.observable();
    self.leadAddressId = ko.observable();
    self.defaultInvoicingAddressId = ko.observable();
    self.defaultDeliveryAddressId = ko.observable();
    self.defaultVisitAddressId = ko.observable();
    self.brandProductTypeGroupObjects = ko.observableArray([]);
    self.brandGroups = ko.observableArray([]);
    self.productTypeGroups = ko.observableArray([]);
    self.companyLetterHeadChecked = ko.observable(false);

    self.retailAppointmentShop = ko.observable();
    self.retailAppointmentTime = ko.observable();
    self.retailAppointmentDate = ko.observable();
    self.retailAppointmentType = ko.observable();
    self.availableRetailAppointmentTypes = ko.observableArray(getRetailAppointmentTypes());

    self.retailAppointmentActualShop = ko.observable();
    self.retailAppointmentActualTime = ko.observable();
    self.retailAppointmentActualDate = ko.observable();
    self.retailAppointmentActualTypeId = ko.observable();
    self.retailAppointmentActualType = ko.observable();
    self.retailAppointmentActualAssistant = ko.observable();

    self.displayRetailAppointmentActuals = ko.pureComputed(function () {
        return (self.retailAppointmentActualShop() ||
            self.retailAppointmentActualTime() ||
            self.retailAppointmentActualDate() ||
            self.retailAppointmentActualTypeId() ||
            self.retailAppointmentActualType() ||
            self.retailAppointmentActualAssistant())
    }, self);

    self.retailAppointmentActualDatePicker = {
        label: 'Date',
        observable: self.retailAppointmentActualDate,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: true,
        clearFunction: function () {
            this.observable(undefined);
        },
        dateTimePickerOptions: {
            locale: 'en-gb',
            format: 'DD/MM/YYYY',
            ignoreReadonly: true,
            showClear: true,
            allowInputToggle: true,
            sideBySide: true,
            useCurrent: true,
            //minDate: new moment().add(4, 'week').toDate(),
            showClose: true,
            keepInvalid: false
        }
    }

    self.channelId = ko.observable().extend({
        required: {
            params: true,
            message: 'Please select a Channel'
        }
    });
    self.ownerMember = ko.observable().extend({
        required: {
            params: true,
            message: 'Please assign this Lead'
        }
    });
    self.leadSourceId = ko.observable().extend({
        required: {
            params: true,
            message: 'Please select a Source'
        }
    });
    self.companyName = ko.observable().extend({
        maxLength: 100,
        charsRemaining: {
            maxLength: 100,
            elementId: '.lead-company-name'
        }
    });
    self.companyRegistration = ko.observable().extend({
        maxLength: 20,
        charsRemaining: {
            maxLength: 20,
            elementId: '.lead-company-reg'
        }
    });
  self.vatRegistered = ko.observable(false);
  self.companyVATNumber = ko.observable().extend({
    maxLength: 20,
    required: {
      params: true,
      onlyIf: self.vatRegistered,
      message: 'If they\'re registered for VAT, you must provide a VAT Number'
    },
        charsRemaining: {
            maxLength: 20,
            elementId: '.lead-company-vat-no'
        }
    });
    self.eoriNumber = ko.observable().extend({
        maxLength: 20,
        charsRemaining: {
            maxLength: 20,
            elementId: '.eori-number'
        }
    });
    self.newNote = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a note'
        },
        charsRemaining: {
            maxLength: 500,
            elementId: '.new-note'
        }
    });
    self.ownMarker = null;
    self.googleMapsRadiusClickListener = null;
    self.googleMapsBusy = ko.observable(false);
    self.googleMapsRadius = ko.observable(10);
    self.googleMapsRadiusCircle = null;
    self.googleMapsFailed = ko.observable(false);
    self.markerCluster = null;
    self.gbpCurrency = getGBPCurrency();

    self.displayPayByDirectDebitQuestion = ko.pureComputed(function () {
        if (self.salesMarket() && self.requestedPaymentOption()) {
            if (self.requestedPaymentOption().PaymentOptionID == 1) {
                if ([7, 19, 6, 15].indexOf(self.salesMarket().SalesMarketID) > -1) {
                    return true;
                }
            }
        }
        return false;
    }, self);

    self.wantToPayByDirectDebit = ko.observable().extend({
        required: {
            params: true,
            onlyIf: self.displayPayByDirectDebitQuestion,
            message: 'You must answer this question'
        }
    });

    self.displayPaymentDetails = ko.computed(function () {
        if (self.wantToPayByDirectDebit() == true)
            return true;
        else {
            return false;
        }
    }, self);

    self.displayBankDetails = ko.pureComputed(function () {
        if (self.wantToPayByDirectDebit() != null) {
            return self.wantToPayByDirectDebit()
        } else {
            return false;
        }
    }, self);

    self.bankCountryId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: self.displayBankDetails,
            message: 'Please provide a country'
        }
    });

    self.bankName = ko.observable().extend({
        charsRemaining: {
            maxLength: 50,
            elementId: '.bank-name'
        },
        required: {
            params: true,
            onlyIf: self.displayBankDetails,
            message: 'Please provide a name'
        }
    });

    self.bankAccountNumber = ko.observable().extend({
        charsRemaining: {
            maxLength: 20,
            elementId: '.bank-account-number'
        },
        required: {
            params: true,
            onlyIf: self.displayBankDetails,
            message: 'Please provide an account number'
        }
    });

    self.bankSortCode = ko.observable().extend({
        charsRemaining: {
            maxLength: 10,
            elementId: '.bank-sort-code'
        },
        required: {
            params: true,
            onlyIf: self.displayBankDetails,
            message: 'Please provide a sort code'
        }
    });

    self.bankIBAN = ko.observable().extend({
        charsRemaining: {
            maxLength: 34,
            elementId: '.bank-iban'
        },
        required: {
            params: true,
            onlyIf: self.displayBankDetails,
            message: 'Please provide an IBAN'
        }
    });

    self.creditLimit = ko.observable().extend({
        currencyFormatted: {
            digits: 0,
            currency: self.gbpCurrency,
            maxValue: 900000000000000,
            minValue: -900000000000000
        },
        required: {
            params: true,
            message: 'You must specify a credit limit'
        }
    });

    self.insuredCreditLimit = ko.observable().extend({
        currencyFormatted: {
            digits: 0,
            currency: self.gbpCurrency,
            maxValue: 900000000000000,
            minValue: -900000000000000
        }
    });

    self.requestedCreditLimit = ko.observable().extend({
        currencyFormatted: {
            digits: 0,
            currency: self.companyCurrency,
            maxValue: 5000000,
            minValue: 0
        },
        notEqual: {
            params: 0,
            onlyIf: () => {
                return self.requestedPaymentOption() && self.requestedPaymentOption().PaymentOptionID === 1;
            },
            message: 'You must provide a positive number. This is the spending limit for the account.'
        }
    });

    self.requestedCreditLimitSterling = ko.computed(() => {
        let companyCurrency = self.companyCurrency();
        if (self.requestedCreditLimit() &&
            companyCurrency &&
            companyCurrency.Code != 'GBP') {
            let exchangeRate = self.parent.exchangeRates.find(er => er.MertexCurrencyCode == companyCurrency.MertexCurrencyCode);
            return self.requestedCreditLimit() / exchangeRate.SterlingExchangeRate;
        }
    }).extend({
        currencyFormatted: {
            digits: 0,
            currency: ko.observable({ FormattingCulture: "en-GB", Code: "GBP" }),
            maxValue: 10000000,
            minValue: 0
        },
    });

    self.bankCountry = ko.pureComputed({
        read: function () {
            return Enumerable.From(self.parent.availableCountries).Where(function (x) {
                return x.CountryID == self.bankCountryId()
            }).FirstOrDefault();
        }
    });

    self.bankAddressLine1 = ko.observable().extend({
        charsRemaining: {
            maxLength: 60,
            elementId: '.bank-address-1'
        },
        pcaPredict: {
            elementId: '.bank-address-1',
            mapFunction: function (line1, line2, line3, line4, postcode) {
                self.bankAddressLine1(line1);
                self.bankAddressLine2(line2);
                self.bankTown(line3);
                self.bankCounty(line4);
                self.bankPostcode(postcode);
            },
            country: self.bankCountry
        },
        required: {
            params: true,
            onlyIf: self.displayBankDetails,
            message: 'Please provide Address Line 1'
        }
    });
    self.bankAddressLine2 = ko.observable().extend({
        charsRemaining: {
            maxLength: 60,
            elementId: '.bank-address-2'
        }
    });
    self.bankTown = ko.observable().extend({
        charsRemaining: {
            maxLength: 50,
            elementId: '.bank-town'
        },
        required: {
            params: true,
            onlyIf: self.displayBankDetails,
            message: 'Please provide a Town'
        }
    });
    self.bankCounty = ko.observable().extend({
        charsRemaining: {
            maxLength: 40,
            elementId: '.bank-county'
        },
        required: {
            params: true,
            onlyIf: self.displayBankDetails,
            message: 'Please provide a County'
        }
    });
    self.bankPostcode = ko.observable().extend({
        charsRemaining: {
            maxLength: 20,
            elementId: '.bank-postcode'
        },
        required: {
            params: true,
            onlyIf: self.displayBankDetails,
            message: 'Please provide a Postcode'
        }
    });

    self.editContactId = ko.observable();
    self.editContactTitle = ko.observable();
    self.editContactTypeId = ko.observable();
    self.editContactDecisionMaker = ko.observable(false);
    self.editContactFullName = ko.observable().extend({
        maxLength: 50,
        required: {
            params: true,
            message: 'Please provide a name'
        },
        charsRemaining: {
            maxLength: 50,
            elementId: '.new-contact-fullname'
        }
    });
    self.editContactEmail = ko.observable().extend({
        maxLength: 256,
        email: {
            params: true,
            message: 'Invalid email format'
        },
        charsRemaining: {
            maxLength: 256,
            elementId: '.new-contact-email'
        }
    });
    self.editContactWorkPhone = ko.observable().extend({
        charsRemaining: {
            maxLength: 20,
            elementId: '.new-contact-work-phone'
        }
    });
    self.editContactMobilePhone = ko.observable().extend({
        charsRemaining: {
            maxLength: 20,
            elementId: '.new-contact-mobile-phone'
        }
    });
    self.editContactHomePhone = ko.observable().extend({
        charsRemaining: {
            maxLength: 20,
            elementId: '.new-contact-home-phone'
        }
    });
    self.editContactSkype = ko.observable().extend({
        charsRemaining: {
            maxLength: 256,
            elementId: '.new-contact-skype'
        }
    });
    self.editContactWhatsApp = ko.observable().extend({
        charsRemaining: {
            maxLength: 256,
            elementId: '.new-contact-whatsapp'
        }
    });
    self.editContactLinkedIn = ko.observable().extend({
        charsRemaining: {
            maxLength: 256,
            elementId: '.new-contact-linkedin'
        }
    });
    self.editContactWebsite = ko.observable().extend({
        charsRemaining: {
            maxLength: 256,
            elementId: '.new-contact-website'
        }
    });
    self.editContactFacebook = ko.observable().extend({
        charsRemaining: {
            maxLength: 256,
            elementId: '.new-contact-facebook'
        }
    });
    self.editContactTwitter = ko.observable().extend({
        charsRemaining: {
            maxLength: 256,
            elementId: '.new-contact-twitter'
        }
    });
    self.editContactInstagram = ko.observable().extend({
        charsRemaining: {
            maxLength: 256,
            elementId: '.new-contact-instagram'
        }
    });
    self.editContactYouTube = ko.observable().extend({
        charsRemaining: {
            maxLength: 256,
            elementId: '.new-contact-youtube'
        }
    });
    self.editContactPinterest = ko.observable().extend({
        charsRemaining: {
            maxLength: 256,
            elementId: '.new-contact-pinterest'
        }
    });
    self.editContactNotes = ko.observable().extend({
        charsRemaining: {
            maxLength: 500,
            elementId: '.new-contact-notes'
        }
    });
    self.editContactBirthday = ko.observable();
    self.existingLeads = ko.observable([]);
    self.existingLeadsPageNumber = ko.observable(1);
    self.existingLeadsPageSize = ko.observable(10);
    self.existingLeadsPageCount = ko.observable(0);
    self.existingLeadsTotalCount = ko.observable(0);
    self.existingTradeAccounts = ko.observable([]);
    self.existingTradeAccountsPageNumber = ko.observable(1);
    self.existingTradeAccountsPageSize = ko.observable(10);
    self.existingTradeAccountsPageCount = ko.observable(0);
    self.existingTradeAccountsTotalCount = ko.observable(0);
    self.existingLeadContacts = ko.observableArray([]).extend({
        minLength: {
            params: 1,
            message: 'Leads must have at least one contact'
        }
    });
    self.leadInterests = ko.observableArray([]).extend({ rateLimit: 50 });
    self.justMyAccounts = ko.observable(false);
    self.proximalTradeAccounts = ko.observableArray([]).extend({
        infinitescroll: {
            itemsWidth: 239,
            itemsHeight: 435,
            itemWidth: 220,
            itemHeight: 249
        }
    });
    self.sellOnline = ko.observable(false);
    self.stageInformation = ko.observable();
    self.numberOfPatternBooksPurchased = ko.observable(null).extend({
        numberFormatted: {
            digits: 0,
            currency: self.companyCurrency,
            maxValue: 900000000000000,
            minValue: 0
        },
        required: {
            params: true,
            onlyIf: () => {
                return self.willBuyPatternBooks() == 1
            },
            message: 'Please provide a value'
        }
    });
    self.placedAnOrder = ko.observable().extend({
        required: {
            params: true,
            message: 'You must answer this question'
        }
    });

    self.placedAnOrder.subscribe(function (newValue) {
        if (newValue == false) {
            self.firstOrderValue(0);
        }
    });
    self.firstOrderValue = ko.observable(null).extend({
        currencyFormatted: {
            digits: 0,
            currency: self.companyCurrency
        },
        //required: {
        //    params: true,
        //    onlyIf: self.placedAnOrder,
        //    message: 'Please provide a value'
        //}
    });

    self.orderDocument = ko.observable().extend({
        //required: {
        //    params: true,
        //    onlyIf: self.placedAnOrder,
        //    message: "Please provide an order document"
        //}
    });

    self.orderDocument.subscribe(nv => console.log('orderdocument', nv));

    self.orderDocumentBase64 = ko.observable();

    self.openOrderDocument = () => {
        let base64 = self.orderDocumentBase64();

        if (self.orderDocumentBase64()?.indexOf('application/pdf') > -1 ||
            self.orderDocumentBase64()?.indexOf('image/') > -1) {
            var x = window.open();

            x.document.open();

            let iframe = x.document.createElement("iframe");// ""<iframe width='100%' height='100%'></iframe>"

            iframe.src = base64;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 0;

            let wrapper = x.document.createElement('div');

            wrapper.style.width = '100vh';
            wrapper.style.height = '100vh';
            wrapper.style.display = 'flex';
            wrapper.style.padding = '1em';
            wrapper.style['align-items'] = 'center';
            wrapper.style['justify-content'] = 'center';

            wrapper.appendChild(iframe);

            x.document.appendChild(wrapper);

            x.document.close();

        } else {
            window.open(self.orderDocumentBase64(), '_self');
        }
    }

    self.orderDocumentParams = {
        accept: ".pdf, .doc, .docx, .xls, .xlsx, .jpg, .jpeg",
        label: ".pdf, .doc, .docx, .xls, .xlsx, .jpg, .jpeg",
        observable: self.orderDocument,
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
            maxLength: 50
        }
    }

    self.joinedPatternBookScheme = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.willBuyPatternBooks() == 1
            },
            message: 'You must answer this question'
        }
    });
    self.availableCreditControllers = ko.observable([]);
    self.creditControllerFromList = ko.observable().extend({
        required: {
            params: true,
            message: 'Please select a Credit Controller'
        }
    });
    self.orderConfirmationsEmail = ko.observable();
    self.invoiceStatementsEmail = ko.observable();
    self.pricelistsProductsNewsEventsEmail = ko.observable();
    self.deliveryNotificationsEmails = ko.observable();
    self.paymentTermsNotes = ko.observable().extend({
        charsRemaining: {
            maxLength: 2000,
            elementId: '#payment-terms-notes'
        }
    });

    self.tradeAccountClass = ko.observable().extend({
        required: {
            params: true,
            message: 'You must specify a Trade Account Class'
        }
    });

    self.creditController = ko.observable().extend({
        required: {
            params: true,
            message: 'You must specify a Credit Controller'
        }
    });

    self.creditController.subscribe(nv => console.log(`creditController ${nv}`));

    self.bankCode = ko.observable().extend({
        required: {
            params: true,
            message: 'You must specify a Bank'
        }
    });

    self.bankCode.subscribe(function (newValue) {
      if (newValue) {
        try {
            let salesMarketId = self.salesMarket()?.SalesMarketID;

            // by and large, only one currency per sales market.
            // except for when you've potentially got two.
            // here, look the other way for a second would you...?
            if (salesMarketId == 5 && newValue == '360') {
                self.companyCurrencyId(3); // Magico Euro selection!
            } else {
                if (salesMarketId) {
                    let currency = self.parent.bankSalesMarketMap.find(b =>
                        b.BankCode === newValue &&
                        b.SalesMarketID == salesMarketId)
                        .SalesMarket.Currency;
                    self.companyCurrencyId(currency.CurrencyID);
                }
            }
        }
        catch (e) {
            $.showError({ responseText: `Error determining currency. Please contact <a href="mailto:itsupport@designersguild.com">itsupport@designersguild.com</a> providing error description and Lead ID ${self.leadId()}.` });
        }
      }
    });

    self.purchaseOrderRequired = ko.observable(undefined).extend({
        required: {
            params: true,
            message: 'You must answer this question'
        }
    });

    self.shouldSendPricelists = ko.observable(undefined).extend({
        required: {
            params: true,
            message: 'You must answer this question'
        }
    });

    self.belongToGroupAccount = ko.observable(undefined).extend({
        required: {
            params: true,
            message: 'You must answer this question'
        }
    });

    self.belongToGroupAccount.subscribe(nv => {
        if (nv) {
            let current = self.paymentTermsNotes();

            if (current == null || current?.indexOf('Please double check with the market manager which group account') == -1) {
                if (current) {
                    self.paymentTermsNotes(`${current}

Please double check with the market manager which group account this new customer belongs to. Once the account is opened in Mertex please manually add the appropriate group account.`)
                } else {
                    self.paymentTermsNotes(`Please double check with the market manager which group account this new customer belongs to. Once the account is opened in Mertex please manually add the appropriate group account.`)
                }
            }
        } else {

            if (self.paymentTermsNotes()) {
                self.paymentTermsNotes(self.paymentTermsNotes().replace('Please double check with the market manager which group account this new customer belongs to. Once the account is opened in Mertex please manually add the appropriate group account.', ''))
            }
        }
    });

    // This pertains to accounts doing the whole statement / child account dance
    // not something we handle in the Portal at this stage
    // important that this is set to "MI" for misc. for [all] accounts though
    self.tradeAccountGroup = ko.observable("MI").extend({
        //required: {
        //    params: true,
        //    message: 'Please provide a Trade Account Group'
        //}
    });

    //self.haulierCode = ko.observable("UPS");

    //self.carriageCode = ko.observable("PO13");

    //self.sampleHaulierCode = ko.observable("RM");
    
    //self.sampleCarriageCode = ko.observable("FC");

    self.salesDivision = ko.observable(false).extend({
        required: {
            params: true,
            onlyIf: () => {
                return (self.salesMarket() && ['E', 'Y'].indexOf(self.salesMarket().Code) > -1);
            },
            message: 'You must answer this question'
        }
    }); // Does the customer require their shipments to be consolidated ? YES = T, NO = N

    self.salesDivision.subscribe(nv => {
        if (nv) {
            let current = self.paymentTermsNotes();

            if (current == null || current?.indexOf('This customer wishes their deliveries to be consolidated') == -1) {
                if (current) {
                    self.paymentTermsNotes(`${current}

This customer wishes their deliveries to be consolidated. Please double check this with the market manager before opening the account.`)
                } else {
                    self.paymentTermsNotes(`This customer wishes their deliveries to be consolidated. Please double check this with the market manager before opening the account.`)
                }
            }
        }
    });

    self.salesDivisionVisible = ko.computed(() => {
        return self.salesMarket() && (['E', 'Y'].indexOf(self.salesMarket().Code) > -1);
    }, self);

    self.deliveryTerms = ko.observable(undefined).extend({ // 21/06/2023 Sarah wants to default this NULL to find out if it causes a throw in the Portal eventually
                                                           // 26/02/2025 Evidently it hasn't caused much of an issue so far...
        //required: {
        //    params: true,
        //    message: 'You must provide INCO Delivery Terms'
        //}
    });

    self.vatCountry = ko.observable().extend({
      required: {
        params: true,
        onlyIf: () => {
            return self.vatRegistered() && (self.countryId() != 238 && self.countryId() != 237 && self.countryId() != 41)
        },
        message: ' '
      }
    });

    self.vatNumberDisplay = ko.observable().extend({
      charsRemaining: {
        maxLength: 20,
        elementId: '.vat-number-display'
      }
    });

    self.vatCountry.subscribe(nv => {
        let vn = self.companyVATNumber() || '';
        if (nv && vn) {
          self.vatNumberDisplay(`${nv.Code}${vn}`);
        }
    });

    self.vatNumberValid = ko.observable(false);

    self.vatNumberError = ko.observable(false);

    self.vatNumberMessage = ko.observable(undefined);

    self.vatCheckBusy = ko.observable(false);

    self.vatNumberCheckPerformed = ko.observable(false);

    self.companyVATNumber.subscribe(nv => {
        if (self.vatCountry() && nv) {
            self.vatNumberDisplay(`${self.vatCountry().Code}${nv}`);
        }

        if (nv && self.vatCountry()) {

        }
    });

    self.mertexLanguageCode = ko.observable().extend({
        required: {
            params: true,
            message: 'You must specify a Mertex Language'
        }
    });

    // lifted here because we don't get hoisting with this factory function approach
    self.currentStage = ko.pureComputed(function () {
    if (self.stageInformation()) {
        return self.stageInformation().CurrentStage;
    } else {
        return 0;
    }
    }, self);

    self.validateVATNumnber = ko.computed(() => {
        let vatNumber = self.companyVATNumber();
        let vatCountry = self.vatCountry();
        let currentStage = self.currentStage();

        if (currentStage == 4 &&
            (
                vatNumber &&
                vatCountry &&
                vatCountry.CountryID != 238
            )
        ) {
            let data = {
                vatNumber: self.companyVATNumber(),
                countryCode: self.vatCountry()?.Code
            }
            console.log('leadEdit calling validateVATNumber with', data);
            self.vatCheckBusy(true);
            $.ajax({
                url: '/api/componentapi/ValidateVATNumber',
                type: 'POST',
                data: data,
                success: function (data) {
                    if (data.Body.valid) {
                        self.vatNumberValid(true);
                        self.vatNumberError(false);
                        self.vatNumberMessage('Confirmed valid VAT Number for: ' + data.Body.traderName);

                        //callback(true);
                    } else {
                        self.vatNumberValid(false);
                        self.vatNumberError(true);
                        if (self.vatCountry()?.Code?.indexOf('GB') === 0) {
                            self.vatNumberMessage(data.countryName + ': Incorrect or expired VAT number. Please refer to <a href="https://www.gov.uk/government/publications/check-a-uk-vat-number-service-availability-and-issues/check-a-uk-vat-number-service-availability-and-issues" target="_blank">The GOV.UK VAT Service Status Page</a> for information.');
                        } else {
                            self.vatNumberMessage(data.countryName + ': Incorrect or expired VAT number. Please refer to <a href="http://ec.europa.eu/taxation_customs/vies/faq.html#item_7" target="_blank">The European Union\'s V.I.E.S. FAQ</a> for assistance.<br/>You will not be able to submit this order until Credit Control have corrected the VAT number.');
                        }
                        //callback(false);
                    }

                    //if (data.Body && data.Body.requestIdentifier) {
                    //    self.vatNumberRequestIdentifier(data.Body.requestIdentifier);
                    //}

                    self.vatNumberCheckPerformed(true);
                    self.vatCheckBusy(false);
                },
                error: function (xhr, s, a) {
                    self.vatNumberValid(undefined);
                    self.vatNumberError(false);
                    self.vatNumberMessage('The EU VAT Number checking service cannot currently validate this VAT number.')

                    self.vatNumberCheckPerformed(true);
                    self.vatCheckBusy(false);
                    //callback(false);
                }
            });
        }

    }, self).extend({
        rateLimit: {
            timeout: 500,
            method: 'notifyWhenChangesStop'
        }
    });

      self.taxId = ko.observable().extend({
        required: {
          params: true,
          onlyIf: () => {
            return self.countryId() == 46;
          },
          message: 'You must provide a Tax ID for Swiss accounts'
        },
          charsRemaining: {
            maxLength: 20,
            elementId: '.tax-id'
          }
      });

    self.usSalesTaxExemptionCertificateBase64 = ko.observable();

    self.tradeAccountCreationEmail_send = ko.observable();

    self.tradeAccountCreationEmail_sendProps = {
        label: 'Send Trade Account Creation Email?',
        checkboxId: `send-trade-account-creation-email`,
        observable: self.tradeAccountCreationEmail_send,
        originalValue: undefined,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.tradeAccountCreationEmail_displayAccountManager = ko.observable();

    self.tradeAccountCreationEmail_displayAccountManagerSubscription = null;

    self.tradeAccountCreationEmail_displayAccountManagerProps = {
        label: 'Display Account Manager Section?',
        checkboxId: `display-account-manager`,
        observable: self.tradeAccountCreationEmail_displayAccountManager,
        originalValue: undefined,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.tradeAccountCreationEmail_displayCustomerService = ko.observable();

    self.tradeAccountCreationEmail_displayCustomerServiceSubscription = null;

    self.tradeAccountCreationEmail_displayCustomerServiceProps = {
        label: 'Display Customer Service Section?',
        checkboxId: `display-customer-service`,
        observable: self.tradeAccountCreationEmail_displayCustomerService,
        originalValue: undefined,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.tradeAccountCreationEmail_displayCreditControl = ko.observable();

    self.tradeAccountCreationEmail_displayCreditControlSubscription = null;

    self.tradeAccountCreationEmail_displayCreditControlProps = {
        label: 'Display Credit Control Section?',
        checkboxId: `display-credit-control`,
        observable: self.tradeAccountCreationEmail_displayCreditControl,
        originalValue: undefined,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.tradeAccountCreationEmail_displayB2BRegistration = ko.observable(true);

    self.tradeAccountCreationEmail_displayB2BRegistrationSubscription = null;

    self.tradeAccountCreationEmail_displayB2BRegistrationProps = {
        label: 'Display B2B Registration Request?',
        checkboxId: `display-b2b-registration`,
        observable: self.tradeAccountCreationEmail_displayB2BRegistration,
        originalValue: undefined,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.tradeAccountCreationEmail_displayLookbook = ko.observable();

    self.tradeAccountCreationEmail_displayLookbookSubscription = null;

    self.tradeAccountCreationEmail_displayLookbookProps = {
        label: 'Display Lookbook?',
        checkboxId: `display-lookbook`,
        observable: self.tradeAccountCreationEmail_displayLookbook,
        originalValue: undefined,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.selectedEmailAttachmentId = ko.observable();

    self.selectedEmailAttachment = ko.observable();

     // this is only here because const emailAttachment(..., parent) -- parent requires validateNow
    self.validateEmailAttachmentsNow = ko.observable(true);

    self.haveChangedCreationEmailSettings = ko.observable(false);

    self.attachmentsManager = {
        attachments: ko.observableArray([]),
        attachmentsSizeSum: ko.observable().extend({
            max: {
                params: 20,
                message: 'You may not exceed 20mb of attachments total'
            }
        }),
        removeAttachment: (a) => {
            window.showConfirm('Are you sure?', `This will remove the attachment from the list.`, () => {
                self.attachmentsManager.attachments(self.attachmentsManager.attachments().filter(b => b.TradeAccountCreationEmailAttachmentID != a.TradeAccountCreationEmailAttachmentID))

                self.haveChangedCreationEmailSettings(true);

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
                    salesMarket: self.salesMarket().Name
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

    self.attachmentsManager.attachmentsSizeComputer = ko.computed(() => {
        var result = Math.round((self.attachmentsManager.attachments().reduce((acc, x) => acc + x.fileSizeBytes() ?? 0, 0) / 1024 / 1024) * 100) / 100;
        if (!isNaN(result))
            return self.attachmentsManager.attachmentsSizeSum(result);
        else
            return null;
    }, self);

    self.emailAttachmentErrors = new ko.validation.group([
        self.attachmentsManager.attachmentsSizeSum,
        self.attachmentsManager.attachments
    ], {
        deep: true,
        live: true
    });

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
        disabled: ko.observable(false),
        enable: ko.observable(true),
        dropDownListSettings: {
            popup: {
                appendTo: $('#lead-edit-modal')
            },
            optionLabel: ' ',
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

                        var salesMarket = self.salesMarket();

                        data.salesMarketId = salesMarket?.SalesMarketID;
                        for (var propertyName in mapped) {
                            data[propertyName] = mapped[propertyName];
                        }
                        $.ajax({
                            url: "/api/customermaintenance/GetTradeAccountCreationEmailAttachments",
                            type: "GET",
                            data: data,
                            success: function (data) {
                                console.log('GetTradeAccountCreationEmailAttachments returned', data);
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
                            }
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
                if (e.dataItem.TradeAccountCreationEmailAttachmentID) {
                    if (self.attachmentsManager.attachments().find(a => a.TradeAccountCreationEmailAttachmentID === e.dataItem.TradeAccountCreationEmailAttachmentID)) {
                        $.info('Notice', 'That attachment is already present in the list of selected attachments.');
                    } else {
                        self.attachmentsManager.attachments.push(emailAttachment({
                            Attachment: {
                                Name: e.dataItem.Name,
                                FilePath: e.dataItem.FilePath,
                                FileSizeBytes: e.dataItem.FileSizeBytes
                            },
                            ...e.dataItem, // spread to grab the other properties such as, and most importantly, TradeAccountCreationEmailAttachmentID
                        }, self));

                        self.haveChangedCreationEmailSettings(true);
                    }
                }
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

    self.attachmentsManager.openAttachmentsList = () => {
        self.attachmentsManager.attachmentsListParams.dropDownListSettings.widget().open();
    }

    self.createTradeAccountCreationEmailSubscriptions = () => {

        self.tradeAccountCreationEmail_displayAccountManagerSubscription =
            self.tradeAccountCreationEmail_displayAccountManager.subscribe(nv => {
                self.haveChangedCreationEmailSettings(true);
            });

        self.tradeAccountCreationEmail_displayAccountManagerSubscription =
            self.tradeAccountCreationEmail_displayAccountManager.subscribe(nv => {
                self.haveChangedCreationEmailSettings(true);
            });

        self.tradeAccountCreationEmail_displayCreditControlSubscription =
            self.tradeAccountCreationEmail_displayCreditControl.subscribe(nv => {
                self.haveChangedCreationEmailSettings(true);
            });

        self.tradeAccountCreationEmail_displayB2BRegistrationSubscription =
            self.tradeAccountCreationEmail_displayB2BRegistration.subscribe(nv => {
                self.haveChangedCreationEmailSettings(true);
            });

        self.tradeAccountCreationEmail_displayLookbookSubscription =
            self.tradeAccountCreationEmail_displayLookbook.subscribe(nv => {
                self.haveChangedCreationEmailSettings(true);
            });
    }

    self.disposeTradeAccountCreationEmailSubscriptions = () => {
        if (self.tradeAccountCreationEmail_displayAccountManagerSubscription)
            self.tradeAccountCreationEmail_displayAccountManagerSubscription.dispose();

        if (self.tradeAccountCreationEmail_displayAccountManagerSubscription)
            self.tradeAccountCreationEmail_displayAccountManagerSubscription.dispose();

        if (self.tradeAccountCreationEmail_displayCreditControlSubscription)
            self.tradeAccountCreationEmail_displayCreditControlSubscription.dispose();

        if (self.tradeAccountCreationEmail_displayB2BRegistrationSubscription)
            self.tradeAccountCreationEmail_displayB2BRegistrationSubscription.dispose();

        if (self.tradeAccountCreationEmail_displayLookbookSubscription)
            self.tradeAccountCreationEmail_displayLookbookSubscription.dispose();
    }

    self.fetchTradeAccountCreationEmailDefaults = () => {
        console.log('getTradeAccountCreationEmailDefaults calling with salesMarketId', self.salesMarket().SalesMarketID);
        fetch(`/api/customermaintenance/getTradeAccountCreationEmailDefaults?salesMarketId=${self.salesMarket().SalesMarketID}`, {
            method: 'GET',
            headers: window.fetchHeaders
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('getTradeAccountCreationEmailDefaults returned', data);

                self.disposeTradeAccountCreationEmailSubscriptions();

                self.tradeAccountCreationEmail_displayAccountManager(data.DisplayContactDetails_AccountManager);

                self.tradeAccountCreationEmail_displayCustomerService(data.DisplayContactDetails_CustomerService);

                self.tradeAccountCreationEmail_displayCreditControl(data.DisplayContactDetails_CreditControl);

                //self.tradeAccountCreationEmail_displayB2BRegistration(data.DisplayB2BRegistrationRequest);

                self.tradeAccountCreationEmail_displayLookbook(data.DisplayLookbook);

                //self.attachmentsManager.attachments(data.EmailAttachments.sort((a, b) => a.SortOrder > b.SortOrder ? 1 : -1).map(e => emailAttachment(e, self)));

                self.haveChangedCreationEmailSettings(false);

                self.createTradeAccountCreationEmailSubscriptions();

                self.leadSaveBusy(false);
            })
            .catch(err => {
                self.leadSaveBusy(false);
            });
    }


    self.creditControllerErrors = ko.validation.group([
        self.creditControllerFromList,
        self.creditControllerCode,
        //self.numberOfPatternBooksPurchased,
        //self.firstOrderValue,
        //self.joinedPatternScheme
    ]);

    self.creditControlErrors = ko.validation.group([
        self.paymentTerms,
        self.creditLimit,
        self.insuredCreditLimit,
        self.companyVATNumber,
        self.vatCountry,

        //self.bankName,
        //self.bankCountryId,
        //self.bankAddressLine1,
        //self.bankAddressLine2,
        //self.bankTown,
        //self.bankCounty,
        //self.bankPostcode,
        //self.bankAccountNumber,
        //self.bankSortCode,
        //self.bankIBAN,
        self.bankCode,
        self.creditController,
        self.taxId,
        self.mertexLanguageCode
    ]);

    self.payByDirectDebitOptions = [{ Name: 'Yes', Value: true }, { Name: 'No', Value: false }];

    // #endregion

    // #region Misc Trade Account Assignment Stuff

    self.validateMiscNow = ko.observable(false);

    var preselectedRep = getPreselectedSalesRep();

    self.preselectedMiscRep = preselectedRep;

    self.preselectedMiscRepId = undefined;

    if (preselectedRep != null) {
        self.preselectedMiscRepId = preselectedRep.SalesRepresentativeID;
    }

    self.miscRepId = ko.observable(self.preselectedMiscRepId).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateMiscNow();
            },
            message: 'Please select a Sales Representative'
        }
    });

    self.miscRep = ko.observable();

    self.miscRepTradeAccountWidget = ko.observable();

    self.miscRepTradeAccounts = ko.observableArray([]);

    self.miscRepId.subscribe(function (newValue) {
        console.log('miscRepId subscribe hit', newValue);
    });

    self.miscRepSlicer = ko.observable();

    self.miscRepTradeAccountSlicer = ko.observable();

    self.miscRepSlicerParams = kendoMDCDropDownList({
        autoBind: true,
        label: 'Sales Person',
        valueField: 'SalesRepresentativeID',
        textField: 'Name',
        widget: self.miscRepSlicer,
        idObservable: self.miscRepId,
        objObservable: self.miscRep,
        height: 350,
        endPoint: '/api/leadsapi/MiscSalesRepresentativeSlicerEndpoint',
        dataBound: function (e) {
            console.log('miscRepSlicerParams dataBound', e);
        },
        sort: [{
            field: 'Name',
            dir: 'asc'
        }]
    });

    self.selectedMiscTradeAccount = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateMiscNow();
            },
            message: 'Please select a Miscellaneous Trade Account'
        }
    });

    self.miscRepTradeAccountSlicerParams = kendoMDCDropDownList({
        autoBind: false,
        label: 'Miscellaneous Account Number',
        valueField: 'TradeAccountID',
        textField: 'Code',
        widget: self.miscRepTradeAccountSlicer,
        idObservable: self.selectedMiscTradeAccount,
        endPoint: '/api/leadsapi/MiscSalesRepresentativeMiscAccountSlicerEndpoint',
        additionalParams: {
            salesRepId: self.miscRepId
        }
    });

    //self.miscRepSlicerParams.slicerCollection = [
    //    self.miscRepTradeAccountSlicerParams
    //];

    //self.miscRepTradeAccountSlicerParams.slicerCollection = [

    //];

    self.assignToMiscErrors = ko.validation.group([
        self.selectedMiscTradeAccount,
        self.miscRepId
    ]);

    // #endregion

    // #region Computeds

    self.mustPassToSalesManager = ko.computed(() => {
        if (
            (
                self.hasPatternBookLibrary() == 2 ||
                self.willBuyPatternBooks() == 2 ||
                self.hasShowroom() == 2 ||
                self.showroomByAppointmentOnly() == 2 ||
                (self.requestedPaymentOption() && self.requestedPaymentOption().PaymentOptionID == 3) ||
                self.purchaseOrderRequired() == 2 ||
                self.shouldSendPricelists() == 2 ||
                self.belongToGroupAccount() == 2
            )
        ) {
            return true;
        } else {
            return false;
        }
    }, self);

    self.passToCreditControlLabel = ko.computed(() => {
        if (self.mustPassToSalesManager() && (self.salesMarket() && (self.ownerMemberId() != self.salesMarket().MarketManagerMemberID))) {
            return "Pass to Sales Manager for Authorisation";
        } else {
            return "Pass to Credit Control to Open Account";
        }
    }, self);

    self.availablePaymentTerms = ko.pureComputed({
        read: function () {
            if (self.salesMarket()) {
                return Enumerable.From(self.parent.allPaymentTerms).Where("$.SalesMarketID == null || $.SalesMarketID == " + self.salesMarket().SalesMarketID).ToArray();
            } else {
                return Enumerable.From(self.parent.allPaymentTerms).Where("$.SalesMarketID == null").ToArray();
            }
        }
    }, self);

  self.availableBanks = ko.pureComputed({
    read: function () {
      let salesMarketId = self.salesMarket()?.SalesMarketID;
      if (salesMarketId) {
        const map = self.parent.bankSalesMarketMap.filter(m => m.SalesMarketID == salesMarketId).map(m => m.BankCode);
        return self.parent.availableBanks.filter(b => map.indexOf(b.BankCode) > -1);
      } else {
        return self.parent.availableBanks;
      }
    }
  }, self);

  self.availableSalesRep
    self.availableSalesRepresentatives = ko.pureComputed({
        read: function () {
            var result = [];
            var salesMarket = self.salesMarket();
            if (salesMarket) {
                $.ajax({
                    async: false,
                    url: '/api/ComponentAPI/SalesRepresentativeAutocomplete',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        term: null,
                        salesMarket: salesMarket
                    },
                    success: function (data) {
                        if (data.length) {
                            result = data;
                        } else {
                            result = { Name: 'No Results' };
                        }
                    }
                });
            }
            return result;
        }
    }, self);

    self.availableSalesAgents = ko.pureComputed({
        read: function () {
            var result = [];
            var salesMarket = self.salesMarket();
            if (salesMarket) {
                $.ajax({
                    async: false,
                    url: '/api/ComponentAPI/SalesRepresentativeAutocomplete',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        term: null,
                        salesMarket: salesMarket
                    },
                    success: function (data) {
                        if (data.length) {
                            result = data;
                        } else {
                            result = { Name: 'No Results' };
                        }
                    }
                });
            }
            return result;
        }
    }, self);

    self.availableSalesAreas = ko.pureComputed({
        read: function () {
            var result = [];
            var salesMarket = self.salesMarket();
            if (salesMarket) {
                $.ajax({
                    async: false,
                    url: '/api/ComponentAPI/SalesAreaAutocomplete',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        term: null,
                        salesMarket: salesMarket
                    },
                    success: function (data) {
                        if (data.length) {
                            result = data;
                        } else {
                            result = { Name: 'No Results' };
                        }
                    }
                });
            }
            return result;
        }
    }, self);

    self.availableTradePriceLists = ko.pureComputed({
        read: function () {
            var result = [];
            var salesMarket = self.salesMarket();
            if (salesMarket) {
                $.ajax({
                    async: false,
                    url: '/api/ComponentAPI/TradePriceListAutocomplete',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        term: null,
                        salesMarket: salesMarket
                    },
                    success: function (data) {
                        if (data.length) {
                            result = data;
                        } else {
                            result = { Name: 'No Results' };
                        }
                    }
                });
            }
            return result;
        }
    }, self);

    self.salesMarketComputed = ko.pureComputed({
        read: function () {
            if (self.salesMarket()) {
                return self.salesMarket().Name;
            }
        },
        write: function () {

        }
    }, self);

    self.accountType = ko.pureComputed({
        read: function () {
            if (self.accountTypeId()) {
                return Enumerable.From(self.parent.availableAccountTypes).Where("$.AccountTypeID == " + self.accountTypeId()).Single();
            } else {
                return null;
            }
        }
    }, self);

    self.customerType = ko.pureComputed({
        read: function () {
            if (self.customerTypeId()) {
                return Enumerable.From(self.parent.availableCustomerTypes).Where("$.CustomerTypeID == " + self.customerTypeId()).Single();
            } else {
                return null;
            }
        }
    }, self);

    self.companyAnnualRevenueCurrencyFormatted = ko.pureComputed({
        read: function () {
            if (self.companyCurrency()) {
                return formatCurrency(self.companyAnnualRevenue(), 0, self.companyCurrency().FormattingCulture, self.companyCurrency().Code);
            } else {
                return null;
            }
        }
    }, self);

    self.companyAnnualRevenueGBP = ko.pureComputed({
        read: function () {
            if (self.companyAnnualRevenue()) {
                if (self.companyCurrency()) {
                    if (self.companyCurrency().Code != 'GBP') {
                        return fx.convert(self.companyAnnualRevenue(), { from: self.companyCurrency().ISO_4217, to: 'GBP' }).toFixed(0);
                    }
                }
            }
            return null;
        }
    }, self).extend({
        currencyFormatted: {
            digits: 0,
            currency: self.gbpCurrency
        }
    });

    self.salesRepresentativeComputed = ko.pureComputed({
        read: function () {
            if (self.salesRepresentative()) {
                return self.salesRepresentative().Name;
            }
        },
        write: function () {

        }
    }, self);

    self.salesAgentComputed = ko.pureComputed({
        read: function () {
            if (self.salesAgent()) {
                return self.salesAgent().Name;
            }
        },
        write: function () {

        }
    }, self);

    self.salesAreaComputed = ko.pureComputed({
        read: function () {
            if (self.salesArea()) {
                return self.salesArea().Name;
            }
        },
        write: function () {

        }
    }, self);

    self.tradePriceListComputed = ko.pureComputed({
        read: function () {
            if (self.tradePriceList()) {
                return self.tradePriceList().Name;
            }
        },
        write: function () {

        }
    }, self);

    self.selectMarketPlaceholder = ko.pureComputed({
        read: function () {
            if (self.salesMarket()) {
                return 'Type to Search'
            } else {
                return 'Please Select a Market'
            }
        }
    }, self);

    self.displayRecipientEmails = ko.pureComputed({
        read: function () {
            if (self.orderConfirmationsEmail())
                return true;
            if (self.invoiceStatementsEmail())
                return true;
            if (self.pricelistsProductsNewsEventsEmail())
                return true;
            if (self.deliveryNotificationsEmails())
                return true;
            return false;
        }
    }, self);

    self.displayBankingAddressSummary = ko.pureComputed({
        read: function () {
            if (self.bankName())
                return true;
            if (self.bankAddressLine1())
                return true;
            if (self.bankAddressLine2())
                return true;
            if (self.bankTown())
                return true;
            if (self.bankCounty())
                return true;
            if (self.bankPostcode())
                return true;
            if (self.bankCountry())
                return true;
            return false;
        }
    }, self);

    self.displayCreditControlSummary = ko.pureComputed({
        read: function () {
            if (self.companyRegistration())
                return true;
            if (self.companyVATNumber())
                return true;
            if (self.eoriNumber())
                return true;
            if (self.paymentTerms())
                return true;
            if (self.creditLimit())
                return true;
            if (self.companyLetterHeadChecked())
                return true;
            if (self.bankName())
                return true;
            if (self.bankAddressLine1())
                return true;
            if (self.bankAddressLine2())
                return true;
            if (self.bankTown())
                return true;
            if (self.bankCounty())
                return true;
            if (self.bankPostcode())
                return true;
            if (self.bankCountry())
                return true;
            if (self.bankAccountNumber())
                return true;
            if (self.bankSortCode())
                return true;
            if (self.bankIBAN())
                return true;
            return false;
        }
    }, self);

    self.displaySalesSummary = ko.pureComputed({
        read: function () {
            if (self.salesMarket())
                return true;
            if (self.salesRepresentative())
                return true;
            if (self.salesArea())
                return true;
            if (self.tradePriceList())
                return true;
            if (self.companyCurrency())
                return true;
            if (self.leadTags().length > 0)
                return true;
            if (self.customerType())
                return true;
            if (self.accountType())
                return true;
            if (self.requestedPaymentOption())
                return true;
            if (self.requestedCreditLimit())
                return true;
            if (self.sellOnline())
                return true;
            if (self.willBuyPatternBooks() != null)
                return true;
            if (self.hasShowroom() != null)
                return true;
            if (self.showroomByAppointmentOnly() != null)
                return true;
            if (self.leadPotential.totalBusinessPotential())
                return true;
            return false;
        }
    }, self);

    self.language = ko.pureComputed({
        read: function () {
            return Enumerable.From(self.parent.availableLanguages).Where("$.LanguageID == " + self.languageId()).Single();
        }
    }, self);

    self.country = ko.pureComputed({
        read: function () {
            return Enumerable.From(getAvailableCountries()).Where(function (x) {
                return x.CountryID == self.countryId()
            }).FirstOrDefault();
        }
    });

    self.channel = ko.pureComputed({
        read: function () {
            if (self.channelId() != null)
                return Enumerable.From(self.parent.availableChannels).Where("$.ChannelID == " + self.channelId()).Single();
            else
                return null;
        }
    }, self);

    self.leadType = ko.pureComputed({
        read: function () {
            if (self.leadTypeId())
                return Enumerable.From(self.parent.availableLeadTypes).Where("$.LeadTypeID == " + self.leadTypeId()).Single();
            else
                return null;
        }
    }, self);

    self.allStatuses = Enumerable.From(getAvailableStatuses()).Where(function (x) {
        return x.LeadStatusID != 253;
    }).ToArray();

    // LeadStatusID 253 is "Redirected to Trade Account Request Form".
    self.availableStatuses = ko.computed(function () {
        if (self.stageInformation()) {
            return self.stageInformation().LeadStageStatuses
        } else {
            return [];
        }
        //if (self.stageInformation()) {
        //    return Enumerable.From(self.allStatuses).Where(function (x) {
        //        return (x.LeadStatusID != 253) && (Enumerable.From(self.stageInformation().LeadStageStatuses).Select("$.LeadStatusID").ToArray().indexOf(x.LeadStatusID) > -1);
        //    }).ToArray();
        //} else {
        //    return self.allStatuses;
        //}
    }, self);

    self.status = ko.pureComputed({
        read: function () {
            if (self.selectedLeadStatus()) {
                var result = Enumerable.From(getAvailableStatuses()).Where(function (x) {
                    return x.LeadStatusID == self.selectedLeadStatus().LeadStatusID
                }).SingleOrDefault();

                if (result)
                    return result.Name;
                else
                    return null;
            } else {
                return null;
            }
        }
    }, self);

    self.leadMagnitude = ko.pureComputed({
        read: function () {
            if (self.leadMagnitudeId()) {
                return Enumerable.From(self.parent.availableLeadMagnitudes).Where("$.LeadMagnitudeID == " + self.leadMagnitudeId()).Single();
            } else {
                return null;
            }
        }
    }, self);

    self.created = ko.pureComputed({
        read: function () {
            if (self.createdDt())
                return renderDate(self.createdDt()) + ' (' + self.createdSince() + ')';
            else
                return 'Not yet saved';
        }
    }, self);

    self.owner = ko.pureComputed({
        read: function () {
            if (self.ownerMember()) {
                var fullName = '[No Name]';
                if (self.ownerMember().FullName) {
                    fullName = self.ownerMember().FullName;
                }
                if (self.assignedDt()) {
                    return fullName + ' - ' + self.assignedSince();
                } else {
                    return fullName;
                }
            }
            else
                return 'Not set';
        }
    }, self);

    self.ownerMemberId = ko.pureComputed({
        read: function () {
            if (self.ownerMember())
                return self.ownerMember().MemberID
            else
                return null;
        }
    });

    self.createdBy = ko.pureComputed({
        read: function () {
            if (self.sourceMember()) {
                var fullName = '[No Name]';
                if (self.sourceMember().FullName) {
                    fullName = self.sourceMember().FullName;
                }
                return fullName;
            }
            else
                return 'Not set';
        }
    }, self);

    self.leadSource = ko.pureComputed({
        read: function () {
            if (self.leadSourceId()) {
                return Enumerable.From(self.parent.availableSources).Where("$.LeadSourceID == " + self.leadSourceId()).Single();
            } else {
                return null
            }
        }
    }, self);

    self.tradingSinceDisplay = ko.pureComputed({
        read: function () {
            if (self.tradingSinceId()) {
                return Enumerable.From(self.parent.availableTradingSinceOptions).Where("$.Value == " + self.tradingSinceId()).Single().Name
            } else {
                return null;
            }
        }
    }, self);

    self.shouldUpdateTradingSince = false;
    //ko.pureComputed({
    //    read: function () {
    //        return self.tradingSinceId() != self.tradingSinceLoadedValue()
    //    }
    //}, self);

    self.willBuyPatternBooksDisplay = ko.pureComputed({
        read: function () {
            if (self.willBuyPatternBooks() != null) {
                return Enumerable.From(self.parent.availablePatternBookCommitmentOptions).Where("$.Value == " + self.willBuyPatternBooks()).Single().Name;
            } else {
                return null
            }
        }
    }, self);

    self.hasPatternBookLibraryDisplay = ko.pureComputed({
        read: function () {
            if (self.hasPatternBookLibrary() != null) {
                return Enumerable.From(self.parent.availablePatternBookLibraryOptions).Where("$.Value == " + self.hasPatternBookLibrary()).Single().Name;
            } else {
                return null
            }
        }
    }, self);

    self.hasShowroomDisplay = ko.pureComputed({
        read: function () {
            if (self.hasShowroom() != null) {
                return Enumerable.From(self.parent.availableHasShowroomOptions).Where("$.Value == " + self.hasShowroom()).Single().Name;
            } else {
                return null
            }
        }
    }, self);

    self.showroomByAppointmentOnlyDisplay = ko.pureComputed({
        read: function () {
            if (self.showroomByAppointmentOnly() != null) {
                return Enumerable.From(self.parent.availableShowroomByAppointmentOnlyOptions).Where("$.Value == " + self.showroomByAppointmentOnly()).Single().Name;
            } else {
                return null;
            }
        }
    }, self);

    self.companyType = ko.pureComputed({
        read: function () {
            if (self.companyTypeId()) {
                return Enumerable.From(self.parent.availableCompanyTypeOptions).Where("$.CompanyTypeID == " + self.companyTypeId()).Single().Name;
            } else {
                return null
            }
        }
    }, self);

    self.editContactWebsiteHref = ko.pureComputed({
        read: function () {
            if (self.editContactWebsite()) {
                var r = self.editContactWebsite();
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

    self.editContactFacebookHref = ko.pureComputed({
        read: function () {
            if (self.editContactFacebook()) {
                return 'https://www.facebook.com/' + self.editContactFacebook();
            }
        }
    }, self);

    self.editContactTwitterHref = ko.pureComputed({
        read: function () {
            if (self.editContactTwitter()) {
                return 'https://www.twitter.com/' + self.editContactTwitter();
            }
        }
    }, self);

    self.editContactInstagramHref = ko.pureComputed({
        read: function () {
            if (self.editContactInstagram()) {
                return 'https://www.instagram.com/' + self.editContactInstagram();
            }
        }
    }, self);

    self.editContactYouTubeHref = ko.pureComputed({
        read: function () {
            if (self.editContactYouTube()) {
                return 'https://www.youtube.com/' + self.editContactYouTube();
            }
        }
    }, self);

    self.editContactPinterestHref = ko.pureComputed({
        read: function () {
            if (self.editContactPinterest()) {
                return 'https://www.pinterest.com/' + self.editContactPinterest();
            }
        }
    }, self);

    self.leadDisplayLine = ko.pureComputed({
        read: function () {
            if (self.companyName() && self.leadAddresses()) {
                if (self.leadAddresses().length > 0) {
                    var line = '';

                    line += self.companyName();

                    if (self.leadAddresses()[0].line1())
                        line += ', ' + self.leadAddresses()[0].line1();
                    if (self.leadAddresses()[0].line2())
                        line += ', ' + self.leadAddresses()[0].line2();
                    if (self.leadAddresses()[0].town())
                        line += ', ' + self.leadAddresses()[0].town();
                    if (self.leadAddresses()[0].county())
                        line += ', ' + self.leadAddresses()[0].county();
                    if (self.leadAddresses()[0].postcode())
                        line += ', ' + self.leadAddresses()[0].postcode();

                    return line;
                }
            } else {
                return null;
            }
        }
    }, self);

    self.proximalTradeAccountsLine = ko.pureComputed({
        read: function () {
            if (self.proximalTradeAccounts()) {
                if (self.proximalTradeAccounts().length == 0) {
                    return 'There are no existing trade accounts within a ' + self.googleMapsRadius() + ' mile radius of this lead.';
                }
                if (self.proximalTradeAccounts().length == 1) {
                    return 'There is one existing trade account within a ' + self.googleMapsRadius() + ' mile radius of this lead.';
                }
                return 'There are ' + self.proximalTradeAccounts().length + ' existing trade accounts within a ' + self.googleMapsRadius() + ' mile radius of this lead.'
            }
            return null;
        }
    }, self);

    self.primaryLeadContact = ko.pureComputed({
        read: function () {
            if (self.existingLeadContacts().length > 0 && self.leadContactId()) {
                return Enumerable.From(self.existingLeadContacts()).Where("$.leadContactId() == " + self.leadContactId()).FirstOrDefault();
            } else {
                return null;
            }
        }
    }, self);

    self.availableTradeAccountClasses = ko.pureComputed({
        read: () => {

        }
    }, self);

    // #endregion

    // #region Components

    self.leadPotential = new businessPotential(self.companyCurrency, self);

    self.assignedToMemberSearch = new memberSearch(null, function (member) {
        self.ownerMember(member);
    }, '/Component/LeadOwnerSearch', false);

    self.assignedToMemberSearch.searchTerm.extend({
        required: {
            params: true,
            message: 'Please assign this Lead'
        }
    });

    // #endregion

    // #region Validation Groups

    self.newNoteErrors = ko.validation.group([
        self.newNote
    ]);

    self.companyErrors = ko.validation.group([
        //self.selectedLeadStatus,
        self.channelId,
        self.leadSourceId,
        self.companyName,
        self.countryId,
        self.languageId,
        self.assignedToMemberSearch.searchTerm,
        self.ownerMember,
        self.leadStatusReason
    ]);

    self.businessPotentialErrors = ko.validation.group([
        //self.selectedLeadStatus,
        self.companyCurrencyId
    ]);

    self.contactErrors = ko.validation.group([
        //self.selectedLeadStatus,
        self.existingLeadContacts
    ]);

    self.contactErrorsComputed = ko.pureComputed(function () {
        return self.contactErrors().length && self.contactErrors.isAnyMessageShown();
    }, self);

    self.editContactErrors = ko.validation.group([
        self.editContactFullName,
        self.editContactEmail
    ]);

    self.salesRepErrors = new ko.validation.group([
        //self.selectedLeadStatus,
        self.salesMarket,
        self.tradeAccountClass,
        self.tradeAccountGroup,
        self.salesRepresentative,
        self.salesAgent,
        self.salesArea,
        self.tradePriceList,
        self.companyCurrencyId,
        self.customerTypeId,
        self.purchaseOrderRequired,
        self.shouldSendPricelists,
        self.belongToGroupAccount,
        self.salesDivision,
        self.deliveryTerms,
        self.requestedPaymentOption,
        self.requestedCreditLimit,
        self.hasPatternBookLibrary,
        self.willBuyPatternBooks,
        self.numberOfPatternBooksPurchased,
        self.firstOrderValue,
        self.orderDocument,
        self.hasShowroom,
        self.showroomByAppointmentOnly,
        self.joinedPatternBookScheme,
        self.placedAnOrder,
        self.wantToPayByDirectDebit,
        self.bankName,
        self.bankCountryId,
        self.bankAddressLine1,
        self.bankAddressLine2,
        self.bankTown,
        self.bankCounty,
        self.bankPostcode,
        self.bankAccountNumber,
        self.bankSortCode,
        self.bankIBAN
    ]);

    // #endregion

    // #region Subscriptions

    self.salesRepresentative.subscribe(nv => {
      self.salesAgent(nv);
    });

    self.paymentTerms.subscribe(function (newValue) {
        window.setTimeout(function () {
            self.creditControlErrors.showAllMessages(false);
        }, 0)
    });

    self.selectedLeadStatus.subscribe(function (newValue) {
        if (newValue) {
            if (newValue.AssignToCreditControl == true) {
                $("#credit-controller-modal").modal('show');
            }
        }
    });

    self.leadInterests.subscribe(function (newValues) {
        //console.log('leadInterests sub hit');

        $("span.lead-potential-span").removeClass('alert-info');

        if (newValues) {
            for (var i in newValues) {
                var t = newValues[i];
                if (t)
                    $("span.lead-potential-span[data-brand-id='" + t.brandId + "'][data-product-type-group-id='" + t.productTypeGroupId + "']")
                        .addClass('alert-info');
            }
        }
    });

    self.googleMapsRadius.subscribe(function (newValue) {
        if (self.googleMapsRadiusCircle) {
            self.googleMapsRadiusCircle.setRadius(newValue * 1610);
            _googleMap.fitBounds(self.googleMapsRadiusCircle.getBounds());
            self.loadTradeAccountsWithinProximity();
        }
    });

    self.companyErrors.subscribe(function (newValues) {
        if (self.companyErrors.isAnyMessageShown()) {
            $("#lead-form-company-heading").parent().addClass('panel-danger');
        } else {
            $("#lead-form-company-heading").parent().removeClass('panel-danger');
        }
    });

    self.businessPotentialErrors.subscribe(function (newValues) {
        if (self.businessPotentialErrors.isAnyMessageShown()) {
            $("#lead-form-potential-heading").parent().addClass('panel-danger');
        } else {
            $("#lead-form-potential-heading").parent().removeClass('panel-danger');
        }
    });

    self.contactErrors.subscribe(function (newValues) {
        if (self.contactErrors.isAnyMessageShown()) {
            $("#lead-form-contacts-heading").parent().addClass('panel-danger');
        } else {
            $("#lead-form-contacts-heading").parent().removeClass('panel-danger');
        }
    });

    self.existingLeadsPageNumber.subscribe(function (newValue) {
        self.performCheck();
    });

    self.existingLeadsPageSize.subscribe(function (newValue) {
        self.performCheck();
    });

    self.existingTradeAccountsPageNumber.subscribe(function (newValue) {
        self.performCheck();
    });

    self.existingTradeAccountsPageSize.subscribe(function (newValue) {
        self.performCheck();
    });

    self.hasShowroom.subscribe(function (newValue) {
        if (!newValue) {
            self.showroomByAppointmentOnly(undefined);
        }
    });

    self.brandsWorkedWithAutocomplete.subscribe(function (newValue) {
        if (newValue == "" || newValue == null) {
            self.newCompetitor(false);
        }
    });

    self.leadTagsAutocomplete.subscribe(function (newValue) {
        if (newValue == "" || newValue == null) {
            self.newLeadTag(false);
        }
    });

    self.addingNewNote.subscribe(function (newValue) {
        if (newValue === false) {
            self.newNote(undefined);
            self.newNoteErrors.showAllMessages(false);
        }
    });

    self.salesMarket.subscribe(function (newValue) {
        //console.log('salesMarket subscribe hit');
        //self.leadSaveBusy(true);

        self.fetchAvailableCreditControllers();

        self.salesRepresentative(undefined);
        self.salesAgent(undefined);
        self.salesArea(undefined);
        self.tradePriceList(undefined);

        self.wantToPayByDirectDebit(undefined);
        self.bankName(undefined);
        self.bankAddressLine1(undefined);
        self.bankAddressLine2(undefined);
        self.bankTown(undefined);
        self.bankCounty(undefined);
        self.bankPostcode(undefined);
        self.bankCountryId(undefined);
        self.bankAccountNumber(undefined);
        self.bankSortCode(undefined);
        self.bankIBAN(undefined);

        self.salesDivision(false); // this is actually "groupage" question

        if (self.paymentTermsNotes()) {
            self.paymentTermsNotes(self.paymentTermsNotes().replace('Please double check with the market manager which group account this new customer belongs to. Once the account is opened in Mertex please manually add the appropriate group account.', ''))
        }

        if (newValue) {
            // this should only ever be true for a lead that hasn't saved the rep page before
            if (self.tradeAccountCreationEmail_skipLoadingDefault) {
                self.tradeAccountCreationEmail_skipLoadingDefault = false;
            } else {
                self.tradeAccountCreationEmail_displayAccountManager(undefined);
                self.tradeAccountCreationEmail_displayCustomerService(undefined);
                self.tradeAccountCreationEmail_displayCreditControl(undefined);
                //self.tradeAccountCreationEmail_displayB2BRegistration(true);
                self.tradeAccountCreationEmail_displayLookbook(undefined);

                self.attachmentsManager.attachments([]);

                self.fetchTradeAccountCreationEmailDefaults();
            }

            if (self.attachmentsManager.attachmentsListParams.dropDownListSettings.widget()) {
                self.attachmentsManager.attachmentsListParams.dropDownListSettings.widget().dataSource.read();
            }
        }
    });

    self.ownerMember.subscribe(function (newValue) {
        if (newValue) {
            self.assignedToMemberSearch.searchTerm(newValue.FullName);
        }
    });
    
    self.companyAnnualRevenue.subscribe(function (newValue) {
        if (newValue) {
            self.businessPotentialErrors.showAllMessages(true);
        } else {
            self.businessPotentialErrors.showAllMessages(false);
            $("#lead-form-potential-heading").parent().removeClass('panel-danger');
        }
    });

    self.countryId.subscribe(function (newValue) {
        //console.log('countryId subscribe hit', newValue);
    });

    // #endregion

    // #region Functions

    self.openExemptionCertificate = () => {
        let base64 = self.usSalesTaxExemptionCertificateBase64();
       
        var x = window.open();

        x.document.open();

        let iframe = x.document.createElement("iframe");// ""<iframe width='100%' height='100%'></iframe>"

        iframe.src = base64;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 0;

        let wrapper = x.document.createElement('div');

        wrapper.style.width = '100vh';
        wrapper.style.height = '100vh';
        wrapper.style.display = 'flex';
        wrapper.style.padding = '1em';
        wrapper.style['align-items'] = 'center';
        wrapper.style['justify-content'] = 'center';

        wrapper.appendChild(iframe);

        x.document.appendChild(wrapper);

        x.document.close();

    }

    self.saveActualRetailAppointmentDetails = function () {
        $.ajax({
            url: '/api/leadsapi/saveActualRetailAppointmentDetails',
            type: 'POST',
            dataType: 'json',
            data: {
                leadId: self.leadId(),
                shop: self.retailAppointmentActualShop(),
                date: self.retailAppointmentActualDate() ? self.retailAppointmentActualDate().format() : null,
                time: self.retailAppointmentActualTime(),
                type: self.retailAppointmentActualTypeId(),
                assistant: self.retailAppointmentActualAssistant()
            },
            success: function () {
                $('#actual-appointment-save').fadeIn('fast');
                window.setTimeout(function () {
                    $('#actual-appointment-save').fadeOut('slow');
                }, 3000);
            },
            error: function (xhr, s, a) {
                $.showError(xhr, s, a);
            }
        });
    }

    self.processApplicationSave = function () {
        if (self.tradeAccountCreationEmail_send() && self.emailAttachmentErrors().length > 0) {
            self.emailAttachmentErrors.showAllMessages(true);
            return;
        } else {
            // if you haven't interacted with the creation email stuff
            if (self.tradeAccountCreationEmail_send() && self.haveChangedCreationEmailSettings() === false) {
                let displayProps = [];
                if (self.tradeAccountCreationEmail_displayAccountManager())
                    displayProps.push("Account Manager");
                if (self.tradeAccountCreationEmail_displayCustomerService())
                    displayProps.push("Customer Service");
                if (self.tradeAccountCreationEmail_displayCreditControl())
                    displayProps.push("Credit Control");
                if (self.tradeAccountCreationEmail_displayLookbook())
                    displayProps.push("Lookbook");

                if (displayProps.length === 0)
                    displayProps.push("(none)");

                let lastProp = displayProps.pop();

                let displayPropString = displayProps.length ? `${displayProps.join(", ")} and ${lastProp}`.trim() : lastProp;

                let attachmentsString = self.attachmentsManager.attachments().length
                    ? `<p>
                        The following attachments will be sent:
                    </p>
                    <ul class="list-group margin-bottom-15">
                        ${self.attachmentsManager.attachments().map(a => `<li class="list-group-item bold">${a.name()}</li>`).join("")}
                    </ul>`
                    : `<p class="bold margin-bottom-15">
                        No attachments will be sent!
                    </p>`;

                window.showConfirm('Are you sure?',
                    `<p>You have left the Trade Account Creation Email settings at their default for Sales Market: ${self.salesMarket().Name}</p>
                    ${attachmentsString}
                    <p>
                    The following sections of the email will be included:
                    </p>
                    <p class="bold margin-bottom-15">
                    ${displayPropString}
                    </p>
                    <p>
                    If you're absolutely sure you can click Yes to proceed. If not, please click No and make any changes you deem necessary.
                    </p>
                `, () => {
                    $('#credit-controller-modal').modal('show');
                }, null);
                return;
            }
                
            $('#credit-controller-modal').modal('show');
        }
    }

    self.saveCreditControllerDetails = function () {
        if (self.creditControllerErrors().length > 0) {
            self.creditControllerErrors.showAllMessages(true);
        } else {
            $("#trade-account-creation-email-attachment-modal").modal("hide");
            $("#credit-controller-modal").modal('hide');
            if (self.mustPassToSalesManager()) {
                self.ownerMember({
                    ...self.salesMarket().MarketManager
                });
                self.submit('close');
            } else {
                self.ownerMember(self.creditControllerFromList());
                self.changeStatusAndSubmit('close');
            }
        }
    }

    self.saveMarketManagerDetails = function () {
        var marketManager = null;

        if (self.salesMarket().Code == 'T') {
            marketManager = { FullName: 'Conchita Valentino', MemberID: 548350 };
        }
        else if (self.salesMarket().Code == 'P') {
            marketManager = { FullName: 'Fatima Gonzalez', MemberID: 5471 };
        }

        if (marketManager == null) {
            $.error('Sorry', 'Early error assigning to Market Manager. Please contact administrator.');
        }
        else {
            $("#market-manager-modal").modal('hide');

            self.ownerMember(marketManager);

            window.setTimeout(function () {
                self.submit('close');
            }, 0);
        }
    }

    self.fetchAvailableCreditControllers = function () {
        let data = {
            LeadID: self.leadId(),
            LanguageID: self.languageId(),
            SalesMarketID: self.salesMarket() ? self.salesMarket().SalesMarketID : null,
            MertexLanguageCode: self.mertexLanguageCode()
        }

        console.log('fetchAvailableCreditControllers calling with', data)
        $.ajax({
            url: '/api/leadsapi/CreditControllerSelectList',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('fetchAvailableCreditControllers returned', data);

                self.availableCreditControllers(data);
                window.setTimeout(function () {
                    var defaultCreditController = Enumerable.From(self.availableCreditControllers()).Where("$.DefaultCreditController").FirstOrDefault();
                    if (defaultCreditController)
                        self.creditControllerFromList(defaultCreditController);
                }, 0);
            }
        });
    }

    self.showStage = function (stage) {

        self.stage(stage);

        switch (stage) {
            case 1:
                $("#lead-stage-one").collapse('show');
                break;
            case 2:
                $("#lead-stage-two").collapse('show');
                break;
            case 3:
                $("#lead-stage-three").collapse('show');
                break;
            case 4:
                $("#new-lead-contact-modal").modal('show');
                break;
            default: break;
        }
    };

    self.initAutocomplete = function (element, endpoint, observable, extraData) {
        $(element).autocomplete({
            appendTo: $(element).closest('.col-xs-12'),
            source: function (request, response) {
                $(element).addClass('ui-autocomplete-loading');
                var params = {
                    term: request.term
                };
                if (typeof extraData != 'undefined') {
                    extraData.forEach(function (p) {
                        params[p.name] = ko.unwrap(p.value);
                    });
                }
                $.ajax({
                    url: endpoint,
                    type: "POST",
                    dataType: "json",
                    data: params,
                    success: function (data) {
                        $(element).removeClass('ui-autocomplete-loading');
                        response($.map(data, function (item) {
                            return {
                                label: item.Name,
                                value: item
                            };
                        }));
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $(element).removeClass('ui-autocomplete-loading');
                        //$.showError(xhr, textStatus, errorThrown);
                    }
                });
            },
            minLength: 0,
            focus: function (event, ui) {
                event.preventDefault();
            },
            select: function (event, ui) {
                event.preventDefault();
                observable(ui.item.value);
                $(element).val(ui.item.label);
                return false;
            },
            autoFocus: false,
            search: function (e, ui) {
                $(this).data('ui-autocomplete').menu.bindings = $();
            }
        });
        return true;
    }

    self.fireAutocomplete = function (event) {
        $(event.target).closest('.input-group').find('input').autocomplete('search');
    }

    self.saveNewNote = function () {
        self.newNoteErrors.showAllMessages(false);
        if (self.newNoteErrors().length) {
            self.newNoteErrors.showAllMessages(true);
        } else {
            self.leadSaveBusy(true);
            $.ajax({
                url: '/sales/leads/saveNewNote',
                type: 'POST',
                dataType: 'json',
                data: {
                    LeadID: self.leadId(),
                    Note: self.newNote()
                },
                success: function (data) {
                    //console.log('SaveNewNote returned:');
                    //console.log(data);
                    self.leadSaveBusy(false);
                    self.notes(data);
                    self.newNote(undefined);
                    self.addingNewNote(false);
                    self.newNoteErrors.showAllMessages(false);
                }
            });
        }
    }

    self.setPrimaryLeadContact = function (leadContact) {
        self.leadSaveBusy(true);
        $.ajax({
            url: '/api/LeadsAPI/SetLeadPrimaryContact',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                leadId: self.leadId(),
                leadContactId: leadContact.leadContactId()
            },
            success: function (data) {
                self.loadLeadForEdit(self.leadId(), null, false);
            },
            error: function (xhr, e, s) {
                self.leadSaveBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.setPrimaryLeadAddress = function (leadAddressId) {
        self.leadSaveBusy(true);
        $.ajax({
            url: '/api/LeadsAPI/SetLeadPrimaryAddress',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                leadId: self.leadId(),
                leadAddressId: leadAddressId
            },
            success: function (data) {
                self.loadLeadForEdit(self.leadId(), null, false);
            },
            error: function (xhr, e, s) {
                self.leadSaveBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.setLeadDefaultInvoicingAddress = function (leadAddressId) {
        self.leadSaveBusy(true);
        $.ajax({
            url: '/api/LeadsAPI/setLeadDefaultInvoicingAddress',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                leadId: self.leadId(),
                leadAddressId: leadAddressId
            },
            success: function (data) {
                self.loadLeadForEdit(self.leadId(), null, false);
            },
            error: function (xhr, e, s) {
                self.leadSaveBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.setLeadDefaultDeliveryAddress = function (leadAddressId) {
        self.leadSaveBusy(true);
        $.ajax({
            url: '/api/LeadsAPI/SetLeadDefaultDeliveryAddress',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                leadId: self.leadId(),
                leadAddressId: leadAddressId
            },
            success: function (data) {
                self.loadLeadForEdit(self.leadId(), null, false);
            },
            error: function (xhr, e, s) {
                self.leadSaveBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.setLeadDefaultVisitAddress = function (leadAddressId) {
        self.leadSaveBusy(true);
        $.ajax({
            url: '/api/LeadsAPI/SetLeadDefaultVisitAddress',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                leadId: self.leadId(),
                leadAddressId: leadAddressId
            },
            success: function (data) {
                self.loadLeadForEdit(self.leadId(), null, false);
            },
            error: function (xhr, e, s) {
                self.leadSaveBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.deleteLeadContact = function (_leadContactId) {
        $.confirm('Are you sure?', 'This will remove this contact.', function () {
            self.leadSaveBusy(true);
            var leadContactId = _leadContactId;
            $.ajax({
                url: '/api/LeadsAPI/RemoveLeadContact',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    leadContactId: leadContactId
                },
                success: function (data) {
                    self.loadLeadForEdit(self.leadId(), null, false);
                },
                error: function (xhr, e, s) {
                    self.leadSaveBusy(false);

                    //$.showError(xhr, e, s);
                }
            });
        }, null);
    }

    self.getBrandProductTypeGroupObject = function (brandId, productTypeGroupId) {

        var result = Enumerable.From(self.brandProductTypeGroupObjects()).Where("$.brandId == " + brandId + " && $.productTypeGroupId == " + productTypeGroupId).SingleOrDefault();

        if (result) {
            return result;
        }
    }

    self.loadTradeAccountProximityData = function () {
        //console.log('loadTradeAccountProximityData called');
        if (typeof _googleMap === 'object') {
            self.googleMapsBusy(true);
            //console.log('loadTradeAccountProximityData set googleMapsBusy true');
            //console.log('loadTradeAccountProximityData step 1 : _googleMap was defined.');

            // so we can't just go leadAddresses()[0]
            // the proc returns us the invoice or if null the delivery address

            var address = Enumerable.From(self.leadAddresses()).Where(function (x) {
                return x.leadAddressId() == self.defaultInvoicingAddressId();
            }).SingleOrDefault();

            if (address == null) {
                address = Enumerable.From(self.leadAddresses()).Where(function (x) {
                    return x.leadAddressId() == self.defaultDeliveryAddressId();
                }).SingleOrDefault();
            }

            if (address == null) {
                self.googleMapsFailed(true);
                return;
            }

            if (address.latitude() && address.longitude()) {
                //console.log('loadTradeAccountProximityData step 2 : latitude and longitude for leadAddresses()[0] were defined.');
                var here = {
                    lat: address.latitude(),
                    lng: address.longitude()
                };
                if (self.ownMarker) {
                    self.ownMarker.setMap(null);
                    delete self.ownMarker;
                }
                self.ownMarker = new google.maps.Marker({
                    position: here,
                    map: _googleMap,
                    title: self.companyName(),
                    optimized: false,
                    zIndex: Number(Number(self.proximalTradeAccounts().length) + Number(1))
                });

                //markers.push(ownMarker);
                _googleMap.setCenter(here);

                var radius = self.googleMapsRadiusCircle || new google.maps.Circle({
                    strokeColor: '#4472c7',
                    strokeOpacity: 0.6,
                    strokeWeight: 2,
                    fillColor: '#aec1e4',
                    fillOpacity: 0.25,
                    map: _googleMap,
                    center: here,
                    radius: (self.googleMapsRadius() * 1610)
                });
                radius.setCenter(here);
                // store reference so we can call setRadius later
                self.googleMapsRadiusCircle = radius;

                // create the drawn radius to demonstrate trade accounts within N

                if (self.googleMapsRadiusClickListener == null)
                    google.maps.event.addListener(radius, 'click', iwClose);

                _googleMap.fitBounds(self.googleMapsRadiusCircle.getBounds());

                for (var i = 0; i < self.proximalTradeAccounts().length; i++) {

                    var tradeAccount = self.proximalTradeAccounts()[i];

                    var loc = {
                        lat: tradeAccount.Latitude,
                        lng: tradeAccount.Longitude
                    };

                    var title = tradeAccount.Code + ' - ' + tradeAccount.Name + ' (' + tradeAccount.Distance + ' miles away)';
                    var fytd = '';
                    var lytd = '';

                    if (tradeAccount.SalesTY_FullFinancialYear)
                        fytd += formatCurrency(tradeAccount.SalesTY_FullFinancialYear, 0, self.gbpCurrency.FormattingCulture, self.gbpCurrency.Code);
                    if (tradeAccount.SalesLY_FullFinancialYear)
                        lytd += formatCurrency(tradeAccount.SalesLY_FullFinancialYear, 0, self.gbpCurrency.FormattingCulture, self.gbpCurrency.Code);

                    var mark = new google.maps.Marker({
                        position: loc,
                        //map: _googleMap,
                        icon: tradeAccount.AccountType === 'Retail' ? greenIcon : blueIcon,
                        label: tradeAccount.Code,//Number(Number(i) + 1).toString(),
                        title: title + ' ' + fytd + ' ' + lytd,
                        zIndex: Number(Number(self.proximalTradeAccounts().length) - Number(i)),
                        originalZIndex: Number(Number(self.proximalTradeAccounts().length) - Number(i))
                    });

                    mark.iconType = tradeAccount.AccountType === 'Retail' ? 'greenIcon' : 'blueIcon'

                    var iwContent = '<div class="info-window row no-gutters">\
	<div class="col-xs-12">\
		<label class="col-form-label">\
			(<span data-bind="text: SortOrder">' + (Number(i) + 1) + '</span>) ' + title + '</span>\
		</label>\
	</div>\
	<div class="col-xs-12">\
		<span class="address-span">' + (tradeAccount.AddressLine1 || '') + '</span>\
		<span class="address-span">' + (tradeAccount.AddressLine2 || '') + '</span>\
		<span class="address-span">' + (tradeAccount.AddressLine3 || '') + '</span>\
		<span class="address-span">' + (tradeAccount.AddressLine4 || '') + '</span>\
		<span class="address-span">' + (tradeAccount.Postcode || '') + '</span>\
	</div>\
	<div class="col-xs-12 trade-account-financials">\
		<label>FYTD: <span style="font-weight: normal">' + (fytd || '£0') + '</span></label>\
		<label>LYTD: <span style="font-weight: normal">' + (lytd || '£0') + '</span></label>\
	</div>\
    <div class="col-xs-12">\
        <span class="address-span">Type: ' + (tradeAccount.AccountType || '') + '</span>\
        <span class="address-span">Rep: ' + (tradeAccount.SalesRepresentative || '') + '</span>\
    </div>\
</div>';

                    mark.iwContent = iwContent;

                    self.buildEventListeners(mark);
                    self.proximalTradeAccounts()[i].mark = mark;

                    if (window.oms) {
                        window.oms.addMarker(mark, function (e) {

                        });
                    }
                }

                //console.log('loadTradeAccountProximityData step 6 : creating markerClusterer');

                if (!self.markerCluster) {
                    self.markerCluster = new MarkerClusterer(_googleMap, window.oms.getMarkers(), { maxZoom: 15 });
                } else {
                    self.markerCluster.clearMarkers();
                    self.markerCluster = new MarkerClusterer(_googleMap, window.oms.getMarkers(), { maxZoom: 15 });
                }
            }
            else {
                // no lat,lng from primary lead address - fail gracefully..
                // after saving, if this is open... well, we have a race condition against the geocoding response
                // if primary address's googleMapsHref isn't yet done, this hits and... there's not much I can do about it.
                //console.log('loadTradeAccountProximityData failure: no latitude, longitude from leadAddresses[0]');
                self.googleMapsFailed(true);
                //console.log('loadTradeAccountProximityData set googleMapsFailed true');
            }
            self.googleMapsBusy(false);
            //console.log('loadTradeAccountProximityData set googleMapsBusy false');
        } else {
            //console.log('loadTradeAccountProximityData found _googleMap undefined');
        }

        // Create the Radius slider
        var handle = $("#custom-radius-handle");
        var valMap = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
        $("#proximity-radius").steppedSlider({
            create: function () {
                handle.text(valMap[5]);
            },
            value: valMap.indexOf(self.googleMapsRadius()),
            trueValues: valMap,
            callback: function (slide) {
                handle.text(valMap[slide.position]);
            },
            change: function (event, ui) {
                handle.text(valMap[ui.value]);
                self.googleMapsRadius(valMap[ui.value]);
            }
        });

        //console.log('loadTradeAccountProximityData complete');
    }

    self.buildEventListeners = function (mark) {
        var m = mark;
        m.addListener('mouseover', function () {
            self.bringMarkerForward(m);
        });
        m.addListener('mouseout', function () {
            self.setMarkerBack(m);
        });
        m.addListener('click', function () {
            infoWindow.setContent(m.iwContent);
            infoWindow.open(_googleMap, m);
            //_googleMap.fitBounds(new google.maps.LatLngBounds().extend(m.getPosition()))
        });
    }

    self.bringMarkerForward = function (m) {
        if (m.hasOwnProperty('mark')) {
            m.mark.setZIndex(Number(Number(self.proximalTradeAccounts().length) + Number(2)));
            m.mark.previousIcon = m.mark.getIcon();
            if (m.mark.previousIcon.url.indexOf('plus') > -1) {
                m.mark.setIcon(yellowIconPlus);
            } else {
                m.mark.setIcon(yellowIcon);
            }
        } else {
            if (typeof m.setZIndex === 'function') {
                m.setZIndex(Number(Number(self.proximalTradeAccounts().length) + Number(2)));
                m.previousIcon = m.getIcon();
                if (m.previousIcon.url.indexOf('plus') > -1) {
                    m.setIcon(yellowIconPlus);
                } else {
                    m.setIcon(yellowIcon);
                }
            }
        }
    }

    self.setMarkerBack = function (m) {
        if (m.hasOwnProperty('mark')) {
            m.mark.setZIndex(m.mark.originalZIndex);
            if (m.mark.hasOwnProperty('previousIcon')) {
                m.mark.setIcon(m.mark.previousIcon);
                delete m.mark.previousIcon;
            } else {
                m.mark.setIcon(blueIcon);
            }
        } else {
            if (typeof m.setZIndex === 'function') {
                m.setZIndex(m.originalZIndex);
                if (m.hasOwnProperty('previousIcon')) {
                    m.setIcon(m.previousIcon);
                    delete m.previousIcon;
                } else {
                    m.setIcon(blueIcon);
                }
            }
        }
    }

    self.loadTradeAccountsWithinProximity = function () {
        self.googleMapsBusy(true);
        //console.log('loadTradeAccountsWithinProximity called:')
        //console.log('leadId: ' + self.leadId() + ', proximity: ' + self.googleMapsRadius() + ', countryId: ' + self.countryId());

        var data = {
            leadId: self.leadId(),
            proximity: self.googleMapsRadius(),
            countryId: self.countryId()
        };

        if (self.justMyAccounts()) {
            data.memberId = getUserId();
        }

        $.ajax({
            url: '/api/LeadsAPI/LeadTradeAccountsWithinProximity',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: data,
            success: function (data) {
                console.log('loadTradeAccountsWithinProximity returned', data)
                //console.log(data);

                if (self.googleMapsRadiusCircle) {
                    self.googleMapsRadiusCircle.setMap(null);
                    delete self.googleMapsRadiusCircle;
                }
                if (self.markerCluster) {
                    self.markerCluster.clearMarkers();
                    self.markerCluster = null;
                }
                if (window.oms) {
                    window.oms.removeAllMarkers();
                }

                self.proximalTradeAccounts(data.Results);
                self.loadTradeAccountProximityData();
            },
            error: function (xhr, e, s) {
                self.googleMapsBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.performCheck = function () {
        if (self.preliminaryErrors().length > 0) {
            self.preliminaryErrors.showAllMessages(true);
        } else {
            self.leadSaveBusy(true);
            $.ajax({
                url: '/api/LeadsAPI/LeadCheck',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    companyName: self.companyName(),
                    fullName: self.leadCheckFullName(),
                    languageId: self.languageId(),
                    email: self.editContactEmail(),
                    postcode: self.leadCheckPostcode(),
                    existingLeadsPageNumber: self.existingLeadsPageNumber(),
                    existingLeadsPageSize: self.existingLeadsPageSize(),
                    existingTradeAccountsPageNumber: self.existingTradeAccountsPageNumber(),
                    existingTradeAccountsPageSize: self.existingTradeAccountsPageSize()
                },
                success: function (data) {
                    self.newLeadErrors.showAllMessages(false);
                    self.leadSaveBusy(false);
                    if (data.existingLeads) {
                        self.existingLeadsPageCount(Math.ceil(data.totalLeadResults / self.existingLeadsPageSize()));
                        self.existingLeadsTotalCount(data.totalLeadResults);
                        self.existingLeads(data.existingLeads);

                        if ($('.existing-leads-pagination').data("twbs-pagination")) {
                            $('.existing-leads-pagination').twbsPagination('destroy');
                        }

                        if (self.existingLeadsPageCount()) {
                            $('.existing-leads-pagination').twbsPagination({
                                startPage: self.existingLeadsPageNumber(),
                                totalPages: self.existingLeadsPageCount(),
                                visiblePages: (self.existingLeadsPageCount() > 6 ? 6 : self.existingLeadsPageCount()),
                                initiateStartPageClick: false,
                                loop: true,
                                onPageClick: function (event, page) {
                                    self.existingLeadsPageNumber(page);
                                },
                                listItemClass: ''
                            });
                        } else {
                            $('.existing-leads-pagination').twbsPagination({
                                startPage: self.existingLeadsPageNumber(),
                                totalPages: 1,
                                visiblePages: 1,
                                initiateStartPageClick: false,
                                loop: true,
                                onPageClick: function (event, page) {
                                    self.existingLeadsPageNumber(page);
                                },
                                listItemClass: ''
                            });
                        }
                    }
                    if (data.existingTradeAccounts) {
                        self.existingTradeAccountsPageCount(Math.ceil(data.totalTradeAccountResults / self.existingTradeAccountsPageSize()));
                        self.existingTradeAccountsTotalCount(data.totalTradeAccountResults);
                        self.existingTradeAccounts(data.existingTradeAccounts);

                        if ($('.existing-trade-accounts-pagination').data("twbs-pagination")) {
                            $('.existing-trade-accounts-pagination').twbsPagination('destroy');
                        }

                        if (self.existingTradeAccountsPageCount()) {
                            $('.existing-trade-accounts-pagination').twbsPagination({
                                startPage: self.existingTradeAccountsPageNumber(),
                                totalPages: self.existingTradeAccountsPageCount(),
                                visiblePages: (self.existingTradeAccountsPageCount() > 6 ? 6 : self.existingTradeAccountsPageCount()),
                                initiateStartPageClick: false,
                                onPageClick: function (event, page) {
                                    self.existingTradeAccountsPageNumber(page);
                                },
                                listItemClass: ''
                            });
                        } else {
                            $('.existing-trade-accounts-pagination').twbsPagination({
                                startPage: self.existingTradeAccountsPageNumber(),
                                totalPages: 1,
                                visiblePages: 1,
                                initiateStartPageClick: false,
                                onPageClick: function (event, page) {
                                    self.existingTradeAccountsPageNumber(page);
                                },
                                listItemClass: ''
                            });
                        }
                    }

                    if (self.existingLeads().length == 0 && self.existingTradeAccounts().length == 0) {
                        self.showStage(2);
                        window.setTimeout(function () {
                            self.confirmNewLead(true);
                            $("#edit-lead-modal").scrollTop(900);
                        }, 0);
                    } else {
                        self.showStage(2);
                    }



                },
                error: function (xhr, e, s) {
                    self.leadSaveBusy(false);

                    //$.showError(xhr, e, s);
                }
            });
        }
    }

    self.createNewLead = function () {
        if (self.newLeadErrors().length > 0) {
            self.newLeadErrors.showAllMessages(true);
        } else {
            self.leadSaveBusy(true);

            $.ajax({
                url: '/sales/Leads/CreateNewLead',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    LeadID: self.leadId(),
                    LeadSourceID: self.leadSourceId(),
                    OwnerMemberID: self.ownerMemberId(),
                    ChannelID: self.channelId(),
                    LeadStatusID: 0,
                    //Description: self.description(),
                    CompanyName: self.companyName(),
                    CountryID: self.countryId(),
                    LanguageID: self.languageId(),
                    CompanyRegistration: self.companyRegistration(),
                    CompanyVATNumber: self.companyVATNumber(),
                    EORINumber: self.eoriNumber(),
                    CompanyTypeID: self.companyTypeId(),
                    TradingSinceID: self.tradingSinceId(),
                    WillBuyPatternBooks: self.willBuyPatternBooks(),
                    HasPatternBookLibrary: self.hasPatternBookLibrary(),
                    HasShowroom: self.hasShowroom(),
                    ShowroomByAppointmentOnly: self.showroomByAppointmentOnly(),
                    ShouldUpdateTradingSince: self.shouldUpdateTradingSince,
                    BrandsWorkedWith: self.brandsWorkedWith(),
                    LeadTags: self.leadTags(),
                    Note: self.newNote(),
                    LeadContact: {
                        fullName: self.leadCheckFullName() || null,
                        email: self.editContactEmail() || null
                    },
                    LeadAddress: {
                        line1: self.newLeadAddressLine1(),
                        line2: self.newLeadAddressLine2(),
                        town: self.newLeadTown(),
                        county: self.newLeadCounty(),
                        postcode: self.leadCheckPostcode(),
                        countryId: self.countryId()
                    }
                },
                success: function (data) {
                    self.loadLeadForEdit(data.LeadID, 'potential');
                    self.parent.leadSearch.availableDashboardMembers(data.dashboardMembers);
                    self.parent.leadSearch.dashboardSelect();
                },
                error: function (xhr, e, s) {
                    self.leadSaveBusy(false);
                    //$.showError(xhr, e, s);
                }
            });
        }
    }

    self.loadLeadForView = function (leadId) {

        if (!$("#view-lead-modal").hasClass('in')) {
            $("#view-lead-modal").modal('show');
        }

        self.viewLeadBusy(true);

        $.ajax({
            url: '/api/LeadsAPI/LoadLead',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                leadId: leadId
            },
            success: function (data) {
                //console.log(data);
                self.viewingLead(new leadView(data.Lead, data.ProductTypeGroups));
                self.viewLeadBusy(false);
            },
            error: function (xhr, e, s) {
                self.viewLeadBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.loadTradeAccountForView = function (tradeAccountId) {
        $.info('Load Trade Account for View', 'Not yet implemented');
    }

    self.stageInformation.subscribe(function (newValue) {
        var stage = newValue.CurrentStage;
        if ([0, 1, 2, 5, 9, 253].indexOf(self.loadedLeadStatusId()) > -1) {
            $('[href="#tab-one"]').tab('show');
            return;
        }
        switch (stage) {
            case 3:
                $('[href="#tab-sales-rep"]').tab('show');
                break;
            case 4:
                if (self.ownerMemberId() == getUserId())
                    $('[href="#tab-credit-control"]').tab('show');
                else
                    $('[href="#tab-one"]').tab('show');
                break;
            default: break;
        }
    });

    self.loadLeadForEdit = function (leadId, showSection, hideCurrent) {

        if (hideCurrent) {
            self.leadLoadBusy(true);
        }

        $("#lead-form-potential-heading").parent().removeClass('panel-danger');
        $("#lead-form-company-heading").parent().removeClass('panel-danger');
        $("#lead-form-contacts-heading").parent().removeClass('panel-danger');

        if (!$("#edit-lead-modal").hasClass('in')) {
            $("#edit-lead-modal").modal('show');
            //window.setTimeout(function () {
            //    if (!$("#lead-form-summary").hasClass('in'))
            //        $("#lead-form-summary").collapse('show');
            //}, 0);
        }

        self.leadSaveBusy(true);
        self.showStage(3);

        var showSection = showSection || false;

        $.ajax({
            url: '/api/LeadsAPI/LoadLead',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                leadId: leadId
            },
            success: function (data) {

                console.log('loadLead returned', data);

                self.retailAppointmentShop(data.Lead.RetailAppointmentShop);
                self.retailAppointmentTime(data.Lead.RetailAppointmentTime);
                self.retailAppointmentDate(data.Lead.RetailAppointmentDate);
                self.retailAppointmentType(data.Lead.RetailAppointmentType);

                self.retailAppointmentActualShop(data.Lead.RetailAppointmentActualShop);
                self.retailAppointmentActualTime(data.Lead.RetailAppointmentActualTime);
                self.retailAppointmentActualDate(data.Lead.RetailAppointmentActualDate);
                self.retailAppointmentActualTypeId(data.Lead.RetailAppointmentActualTypeID);
                self.retailAppointmentActualType(data.Lead.RetailAppointmentActualType);
                self.retailAppointmentActualAssistant(data.Lead.RetailAppointmentActualAssistant);

                self.loadedLeadStatusId(data.Lead.Status.LeadStatusID);
                self.ownerMember(data.Lead.OwnerMember); // this is actually set in loadLeadResult,
                // but thanks to a recent modification it is necessary to check
                // ownerMemberId in currentStage.subscribe
                self.stageInformation(data.StageInformation);

                //window.setTimeout(function () {
                //    if ([1, 2, 5].indexOf(self.currentStage()) > -1) {
                //        $('[href="#tab-one"]').tab('show');
                //    } else if (self.currentStage() == 3) {
                //        $('[href="#tab-sales-rep"]').tab('show');
                //    } else if (self.currentStage() == 4) {
                //        $('[href="#tab-credit-control"]').tab('show');
                //    }
                //}, 100);

                self.assignedToMemberSearch.searchTerm(null);
                self.loadLeadResult(data, showSection);

                self.leadSaveBusy(false);
                self.leadLoadBusy(false);
            },
            error: function (xhr, e, s) {
                self.leadSaveBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.loadedOwnerMember = ko.observable();
    self.loadedOwnerMemberId = ko.observable();

    self.loadLeadResult = function (data, showSection) {

        //console.log(data);

        self.loadedDt = data.Lead.LoadedDT;

        self.leadId(data.Lead.LeadID);
        self.leadContactId(data.Lead.LeadContactID);
        self.leadAddressId(data.Lead.LeadAddressID);

        self.defaultInvoicingAddressId(data.Lead.DefaultInvoiceLeadAddressID);
        self.defaultDeliveryAddressId(data.Lead.DefaultDeliveryLeadAddressID);
        self.defaultVisitAddressId(data.Lead.DefaultVisitLeadAddressID);

        self.countryId(data.Lead.CountryID);
        self.languageId(data.Lead.LanguageID);
        self.confirmNewLead(false);
        self.leadStatusReason(data.Lead.LeadStatusReason);

        var status = Enumerable.From(self.stageInformation().LeadStageStatuses).Where("$.LeadStatusID == " + data.Lead.Status.LeadStatusID).SingleOrDefault();

        // if the lead status coming at us from the database is in the list of available statuses for this
        // stage, great - apply it as the current leadStatus and have the selects select it.
        if (status) {
            self.loadedLeadStatus(status);
            self.selectedLeadStatus(status);
        }
        // if the lead status coming from the database is NOT rendered available by this stage,
        // no matter - the selectedLeadStatus must be undefined, and if it remains undefined we will pass
        // the loaded lead status back to the submit procedure


        self.leadStatusReason(data.Lead.LeadStatusReason);
        self.leadMagnitudeId(data.Lead.LeadMagnitudeID);
        self.ownerMember(data.Lead.OwnerMember);

        self.loadedOwnerMember(data.Lead.OwnerMember);
        self.loadedOwnerMemberId(data.Lead.OwnerMemberID);

        self.sourceMember(data.Lead.SourceMember);
        self.createdDt(data.Lead.CreatedDT);
        self.createdSince(data.Lead.CreatedSince);
        self.modifiedDt(data.Lead.ModifiedDT);
        self.modifiedSince(data.Lead.ModifiedSince);
        self.assignedDt(data.Lead.AssignedDT);
        self.assignedSince(data.Lead.AssignedSince);
        self.channelId(data.Lead.Channel.ChannelID);
        self.leadTypeId(data.Lead.LeadTypeID);
        self.leadSourceId(data.Lead.LeadSource.LeadSourceID);

        if (data.Lead.AccountTypeID)
            self.accountTypeId(data.Lead.AccountTypeID);
        else
            self.accountTypeId(undefined);

        if (data.Lead.CustomerTypeID)
            self.customerTypeId(data.Lead.CustomerTypeID);
        else
            self.customerTypeId(undefined);

        self.bankName(data.Lead.BankName);
        self.bankAccountNumber(data.Lead.BankAccountNumber);
        self.bankSortCode(data.Lead.BankSortCode);
        self.bankIBAN(data.Lead.BankIBAN);

        var paymentTerms = Enumerable.From(self.availablePaymentTerms()).Where("$.PaymentTermsID == " + data.Lead.PaymentTermsID).SingleOrDefault();

        if (paymentTerms)
            self.paymentTerms(paymentTerms);
        else
            self.paymentTerms(undefined);

        var paymentOption = Enumerable.From(self.parent.availablePaymentOptions).Where("$.PaymentOptionID == " + data.Lead.PaymentOptionID).SingleOrDefault();

        if (paymentOption) {
            self.requestedPaymentOption(paymentOption)
        } else {
            self.requestedPaymentOption(undefined);
        }

        self.tradeAccountCreationEmail_send(data.Lead.ShouldSendTradeAccountCreationEmail);

        if (data.Lead.TradeAccountCreationEmail_DisplayAccountManager == null) {
            self.tradeAccountCreationEmail_skipLoadingDefault = false;
        } else {
            self.tradeAccountCreationEmail_skipLoadingDefault = true;

            self.tradeAccountCreationEmail_displayAccountManager(data.Lead.TradeAccountCreationEmail_DisplayAccountManager);
            self.tradeAccountCreationEmail_displayCustomerService(data.Lead.TradeAccountCreationEmail_DisplayCustomerService);
            self.tradeAccountCreationEmail_displayCreditControl(data.Lead.TradeAccountCreationEmail_DisplayCreditControl);
            //self.tradeAccountCreationEmail_displayB2BRegistration(true);
            self.tradeAccountCreationEmail_displayLookbook(data.Lead.TradeAccountCreationEmail_DisplayLookbook);

            let attachments = data.Lead.TradeAccountCreationEmailAttachments.sort((a, b) => a.SortOrder > b.SortOrder ? 1 : -1)
                .map(e => emailAttachment(e, { ...self, validateNow: self.validateEmailAttachmentsNow }));

            self.attachmentsManager.attachments(attachments);

            self.haveChangedCreationEmailSettings(true);
        }

        if (data.Lead.SalesMarket != null) {
            var rec = Enumerable.From(self.parent.availableSalesMarkets).Where("$.SalesMarketID == " + data.Lead.SalesMarket.SalesMarketID).SingleOrDefault();
            if (rec) {
                self.salesMarket(rec);
            }
        } else {
            self.salesMarket(undefined);
        }

        self.creditLimit(data.Lead.CreditLimit);

        if (data.Lead.RequestedCreditLimit)
            self.requestedCreditLimit(Math.round(+data.Lead.RequestedCreditLimit * 100) / 100);
        else
            self.requestedCreditLimit(undefined);

        self.companyLetterHeadChecked(data.Lead.CompanyLetterHeadChecked);

        if (data.Lead.BankCountryID)
            self.bankCountryId(data.Lead.BankCountryID);
        else
            self.bankCountryId(undefined);

        self.bankName(data.Lead.BankName);
        self.bankAddressLine1(data.Lead.BankAddressLine1);
        self.bankAddressLine2(data.Lead.BankAddressLine2);
        self.bankTown(data.Lead.BankTown);
        self.bankCounty(data.Lead.BankCounty);
        self.bankPostcode(data.Lead.BankPostcode);
        self.bankAccountNumber(data.Lead.BankAccountNumber);
        self.bankSortCode(data.Lead.BankSortCode);
        self.bankIBAN(data.Lead.BankIBAN);

        if (self.bankName())
            self.wantToPayByDirectDebit(true);

        if (data.Lead.SalesRepresentative) {
            self.salesRepresentative({
                SalesRepresentativeID: data.Lead.SalesRepresentative.SalesRepresentativeID,
                Name: data.Lead.SalesRepresentative.Name
            });
        } else {
            self.salesRepresentative(undefined);
        }

        // salesAgent now always defaults based on salesRep
        //if (data.Lead.SalesAgent) {
        //    self.salesAgent({
        //        SalesRepresentativeID: data.Lead.SalesAgent.SalesRepresentativeID,
        //        Name: data.Lead.SalesAgent.Name
        //    });
        //} else {
        //    self.salesAgent(undefined);
        //}

        if (data.Lead.SalesArea) {
            self.salesArea({
                SalesAreaID: data.Lead.SalesArea.SalesAreaID,
                Name: data.Lead.SalesArea.Name
            });
        } else {
            self.salesArea(undefined);
        }

        if (data.Lead.TradePriceList) {
            self.tradePriceList(data.Lead.TradePriceList);
            //{
            //    TradePriceListID: data.Lead.TradePriceList.TradePriceListID,
            //    Name: data.Lead.TradePriceList.Code + ' - ' + data.Lead.TradePriceList.Name
            //});
        } else {
            self.tradePriceList(undefined);
        }

        self.tradingSinceId(data.Lead.TradingSinceID);
        self.tradingSinceLoadedValue(data.TradingSince);

        self.brandsWorkedWith([]);

        self.leadTags([]);

        for (var i in data.Lead.Competitors) {
            var o = data.Lead.Competitors[i];
            var obj = Enumerable.From(self.parent.availableCompetitors()).Where("$.CompetitorID == " + o.CompetitorID).SingleOrDefault();
            if (obj) {
                self.brandsWorkedWith.push(obj);
            }
        }
        var tags = Enumerable.From(data.Lead.Tags).Select("$.Tag").ToArray()
        for (var i in tags) {
            var o = tags[i];
            var obj = Enumerable.From(self.parent.availableLeadTags()).Where("$.TagID == " + o.TagID).SingleOrDefault();
            if (obj) {
                self.leadTags.push(obj);
            }
        }

        if (data.Lead.WillBuyPatternBooks != null)
            self.willBuyPatternBooks(data.Lead.WillBuyPatternBooks);
        else
            self.willBuyPatternBooks(undefined);

        if (data.Lead.HasPatternBookLibrary != null)
            self.hasPatternBookLibrary(data.Lead.HasPatternBookLibrary);
        else
            self.hasPatternBookLibrary(undefined);

        if (data.Lead.HasShowroom != null)
            self.hasShowroom(data.Lead.HasShowroom);
        else
            self.hasShowroom(undefined);

        if (data.Lead.ShowroomByAppointmentOnly != null)
            self.showroomByAppointmentOnly(data.Lead.ShowroomByAppointmentOnly);
        else
            self.showroomByAppointmentOnly(undefined);

        self.companyTypeId(data.Lead.CompanyTypeID);
        self.brandsWorkedWithAutocomplete(undefined);
        self.leadTagsAutocomplete(undefined);

        if (data.Lead.CompanyName)
            self.companyName(data.Lead.CompanyName);
        else
            self.companyName(undefined);
        self.companyRegistration(data.Lead.CompanyNumber);
      self.companyVATNumber(data.Lead.VATNumber);
      self.vatRegistered(self.companyVATNumber() != null);
        self.eoriNumber(data.Lead.EORI);
        self.starRating(data.Lead.StarRating);
        //self.description(data.Lead.Description);
        self.notes(data.Lead.LeadNotes);

        self.companyAnnualRevenue(data.Lead.AnnualRevenue);

        if (data.Lead.Currency)
            self.companyCurrencyId(data.Lead.Currency.CurrencyID);
        else
            self.companyCurrencyId(undefined);

        $("#lead-form-potential-heading").parent().removeClass('panel-danger');

        self.businessPotentialErrors.showAllMessages(false);

        self.editContactId(undefined);
        self.editContactTitle(undefined);
        if (data.Lead.LeadContact != null)
            self.editContactFullName(data.Lead.LeadContact.FullName);
        self.editContactTypeId(undefined);
        self.editContactDecisionMaker(false);
        self.editContactEmail(undefined);
        self.editContactWorkPhone(undefined);
        self.editContactMobilePhone(undefined);
        self.editContactHomePhone(undefined);
        self.editContactSkype(undefined);
        self.editContactWhatsApp(undefined);
        self.editContactLinkedIn(undefined);
        self.editContactWebsite(undefined);
        self.editContactFacebook(undefined);
        self.editContactTwitter(undefined);
        self.editContactInstagram(undefined);
        self.editContactYouTube(undefined);
        self.editContactPinterest(undefined);
        self.editContactNotes(undefined);
        self.editContactBirthday(undefined);


        self.existingLeadContacts([]);

        for (var i in data.Lead.SecondaryContacts) {
            self.existingLeadContacts.push(new leadContact(data.Lead.SecondaryContacts[i]));
        }

        self.leadAddresses([]);

        for (var i in data.Lead.LeadAddresses) {
            var addr = data.Lead.LeadAddresses[i];

            self.leadAddresses.push(new leadAddress(addr));
        }

        if (data.Lead.OrderDocumentFileType) {
            self.placedAnOrder(true);
            self.orderDocumentBase64(data.Lead.OrderDocumentBase64);
        } else {
            self.orderDocument(undefined);
        }

        self.leadPotential.load(data.Lead.Potentials, data.ProductTypeGroups);

        if (showSection) {
            if (!$("#lead-form-" + showSection).hasClass('in')) {
                $("#lead-form-" + showSection).collapse('show');
            }
        }

        self.leadInterests([]);
        self.brandProductTypeGroupObjects([]);

        self.brandGroups(Enumerable.From(Enumerable.From(data.ProductTypeGroups).OrderBy("$.Brand.SortOrder").ToArray())
            .GroupBy(
                "$.Brand",
                "$.Brand",
                "key, e => key",
                "$.BrandID"
            ).ToArray());

        self.productTypeGroups(Enumerable.From(Enumerable.From(data.ProductTypeGroups).OrderBy("$.ProductTypeGroup.SortOrder").ToArray())
            .GroupBy(
                "$.ProductTypeGroup", // Group on ProductTypeGroup object
                "", // Select everything
                "key, e => e", // Standard result selector
                "$.ProductTypeGroupID" // Compare just on ProductTypeGroupID property of ProductTypeGroup object
            ).ToArray());

        for (var i in self.productTypeGroups()) {
            var d = self.productTypeGroups()[i];
            for (var j in d.source) {

                self.brandProductTypeGroupObjects.push({ brandId: d.source[j].BrandID, productTypeGroupId: d.Key().ProductTypeGroupID });
            }
        }

        for (var i in data.Lead.LeadInterests) {
            var interest = data.Lead.LeadInterests[i];

            $("span.lead-potential-span[data-brand-id='" + interest.BrandID + "'][data-product-type-group-id='" + interest.ProductTypeGroupID + "']")
                .addClass('alert-info');
            self.leadInterests.push(self.getBrandProductTypeGroupObject(interest.BrandID, interest.ProductTypeGroupID));
        }

        if ($("#proximity-radius").data('uiSlider'))
            $("#proximity-radius").slider('value', 5);

        self.proximalTradeAccounts(data.ProximalTradeAccounts || []);

        self.sellOnline(data.Lead.SellOnline);

        if (data.Lead.NumberOfPatternBooksPurchased != null)
            self.numberOfPatternBooksPurchased(data.Lead.NumberOfPatternBooksPurchased);


        if (data.Lead.JoinedPatternBookScheme != null)
            self.joinedPatternBookScheme(data.Lead.JoinedPatternBookScheme);

        self.mertexLanguageCode(data.Lead.MertexLanguageCode);

        self.fetchAvailableCreditControllers();

        self.orderConfirmationsEmail(data.Lead.OrderConfirmationsEmail);
        self.invoiceStatementsEmail(data.Lead.InvoiceStatementsEmail);
        self.pricelistsProductsNewsEventsEmail(data.Lead.ProductNewsEventsEmail);
        self.deliveryNotificationsEmails(data.Lead.PricelistsEmail);
        self.paymentTermsNotes(data.Lead.PaymentTermsNotes);

        // new bits 14/06/2023

        self.tradeAccountClass(data.Lead.TradeAccountClassCode);

        let defaultCreditController = self.parent.creditControllerSalesMarketMap.find(m => m.SalesMarketID == data.Lead.SalesMarketID);

        self.creditController(data.Lead.CreditControllerCode || defaultCreditController?.CreditControllerCode);

        let defaultBanks = self.parent.bankSalesMarketMap.flatMap(b => b.SalesMarketID == data.Lead.SalesMarketID ? [b] : []);

        let defaultBank = null;

        if (defaultBanks.length == 1)
            defaultBank = defaultBanks[0];

        if (defaultBanks.length > 1) {
            defaultBank = defaultBanks.find(b => b.MertexLanguageCode == data.Lead.MertexLanguageCode);
        }

        self.bankCode(data.Lead.BankCode || defaultBank?.BankCode);

        self.insuredCreditLimit(data.Lead.InsuredCreditLimit);
        self.purchaseOrderRequired(data.Lead.PurchaseOrderRequired);
        self.shouldSendPricelists(data.Lead.ShouldSendPricelists);
        self.belongToGroupAccount(data.Lead.BelongToGroupAccount);
        //self.tradeAccountGroup(data.Lead.TradeAccountGroupCode);
        self.salesDivision(data.Lead.SalesDivisionCode ? data.Lead.SalesDivisionCode == "T" ? true : false : false);
        self.deliveryTerms(data.Lead.DeliveryTermsCode);
        self.taxId(data.Lead.TaxID);
        self.usSalesTaxExemptionCertificateBase64(data.Lead.USSalesTaxExemptionCertificateBase64);

        let vatCountry = self.parent.availableCountries.find(c => c.CountryID == data.Lead.VATCountryID);

        self.vatCountry(vatCountry);

        window.setTimeout(() => {
            self.vatNumberDisplay(data.Lead.VATNumberDisplay || (vatCountry?.Code && data.Lead.VATNumber ? `${vatCountry?.Code}${data.Lead.VATNumber}` : undefined));
        }, 0)

        if (data.Lead.FirstOrderValue === 0) {
            self.placedAnOrder(false);
        }

        // get appointment stuff

        switch (self.stageInformation().CurrentStage)
        {
              case null:
              case 0:
              case 1:
              case 2:
              case 5:
                  $('a[href="#tab-one"]').tab('show');
                  $("#prepare-lead-collapse").collapse('show');
                  break;
              case 3:
                  $('a[href="#tab-sales-rep"]').tab('show');
                  $("#complete-application-collapse").collapse('show');
                  setTimeout(() => {
                      self.salesRepErrors.showAllMessages(false);
                      self.emailAttachmentErrors.showAllMessages(false);
                  }, 100)
                  break;
              case 4:
                  if (self.ownerMemberId() == getUserId()) {
                      $('a[href="#tab-credit-control"]').tab('show');
                      $("#specify-payment-terms-collapse").collapse('show');
                  } else {
                      $('a[href="#tab-one"]').tab('show');
                      $("#prepare-lead-collapse").collapse('show');
                  }
                  break;
              default:
                  $.error('Error', 'Could not ascertain Lead Stage, please contact system administrator.', function () { }, function () { self.reset(); });
                  break;
          }


        self.companyErrors.showAllMessages(false);
        self.businessPotentialErrors.showAllMessages(false);
        self.contactErrors.showAllMessages(false);
        self.editContactErrors.showAllMessages(false);
        self.salesRepErrors.showAllMessages(false);
        self.creditControlErrors.showAllMessages(false);

    }

    self.interestedInAllProductTypesForBrand = function (brandId) {

        var anyFound = false;
        for (var i in self.productTypeGroups()) {
            var ptg = self.productTypeGroups()[i];
            var avail = Enumerable.From(ptg.source).Where("$.BrandID == " + brandId + " && $.Available").ToArray();
            for (var j in avail) {
                var rec = avail[j];

                var obj = self.getBrandProductTypeGroupObject(rec.BrandID, rec.ProductTypeGroupID);

                var ext = Enumerable.From(self.leadInterests()).Where(function (item) {
                    return item == obj
                }).SingleOrDefault();

                if (ext) {
                    anyFound = true;
                    // at least one exists already; remove all and add none
                    self.leadInterests.remove(ext);
                }
            }
        }

        if (!anyFound) {
            for (var i in self.productTypeGroups()) {
                var ptg = self.productTypeGroups()[i];
                var avail = Enumerable.From(ptg.source).Where("$.BrandID == " + brandId + " && $.Available").ToArray();
                for (var j in avail) {
                    var rec = avail[j];

                    var obj = self.getBrandProductTypeGroupObject(rec.BrandID, rec.ProductTypeGroupID);

                    self.leadInterests.push(obj);
                }
            }
        }

        //console.log(self.leadInterests());
    }

    self.interestedInAllBrandsForProductType = function (productTypeGroupId) {

        for (var i in self.productTypeGroups()) {
            var ptg = self.productTypeGroups()[i];
            var avail = Enumerable.From(ptg.source).Where("$.ProductTypeGroupID == " + productTypeGroupId + " && $.Available").ToArray();
            var anyFound = false;
            for (var j in avail) {
                var rec = avail[j];

                var obj = self.getBrandProductTypeGroupObject(rec.BrandID, rec.ProductTypeGroupID);

                var ext = Enumerable.From(self.leadInterests()).Where(function (item) {
                    return item == obj
                }).SingleOrDefault();

                if (ext) {
                    anyFound = true;
                    // at least one exists already; remove all and add none
                    self.leadInterests.remove(ext);
                }
            }
            if (!anyFound) {
                // none found; add all avail
                for (var j in avail) {
                    var rec = avail[j];

                    var obj = self.getBrandProductTypeGroupObject(rec.BrandID, rec.ProductTypeGroupID);

                    self.leadInterests.push(obj);
                }
            }
        }
        //console.log(self.leadInterests());
    }

    self.interestedInEverything = function () {
        if (self.leadInterests().length == 0) {
            for (var i in self.brandProductTypeGroupObjects()) {
                var obj = self.brandProductTypeGroupObjects()[i];
                self.leadInterests.push(obj);
            }
        } else {
            self.leadInterests([]);
        }
    }

    self.loadLeadContactForEdit = function (leadContactId) {
        $('a[href="#lead-contact-general"]').tab('show');
        if (leadContactId == null) {
            $("#new-lead-contact-modal").modal('show');
        }
        else {
            self.leadContactsBusy(true);
            $("#new-lead-contact-modal").modal('show');
            $.ajax({
                url: '/api/LeadsAPI/LoadLeadContact',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    leadContactId: leadContactId
                },
                success: function (data) {
                    self.loadLeadContactResult(data);
                    self.leadContactsBusy(false);
                },
                error: function (xhr, e, s) {
                    self.leadContactsBusy(false);
                    //$.showError(xhr, e, s);
                }
            });
        }
    }

    self.loadLeadContactResult = function (leadContact) {
        self.editContactId(leadContact.LeadContactID);
        self.editContactTitle(leadContact.TitleID);
        self.editContactFullName(leadContact.FullName);
        self.editContactTypeId(leadContact.LeadContactTypeID);
        self.editContactDecisionMaker(leadContact.DecisionMaker);
        self.editContactEmail(leadContact.Email);
        self.editContactWorkPhone(leadContact.WorkPhone);
        self.editContactMobilePhone(leadContact.MobilePhone);
        self.editContactHomePhone(leadContact.HomePhone);
        self.editContactSkype(leadContact.SkypeID);
        self.editContactWhatsApp(leadContact.WhatsApp);
        self.editContactLinkedIn(leadContact.LinkedIn);
        self.editContactNotes(leadContact.Notes);
        self.editContactBirthday(leadContact.Birthday);
        self.editContactWebsite(leadContact.Website);
        self.editContactInstagram(leadContact.Instagram);
        self.editContactFacebook(leadContact.Facebook);
        self.editContactTwitter(leadContact.Twitter);
        self.editContactYouTube(leadContact.YouTube);
        self.editContactPinterest(leadContact.Pinterest);

        self.editContactErrors.showAllMessages(false);
    }

    self.showNewLeadContactForm = function () {
        self.resetNewLeadContact();
        self.showStage(4);
    }

    self.saveLeadContact = function () {

        if (self.editContactErrors().length > 0) {
            self.editContactErrors.showAllMessages(true);
        } else {
            $("#new-lead-contact-modal").modal('hide');

            // We have at least one existing lead contact; this contact is to be
            // added to or updated immediately.
            self.leadContactsBusy(true);

            var birthday = null;

            if (self.editContactBirthday()) {
                try {
                    birthday = self.editContactBirthday().toISOString();
                } catch (e) {
                    birthday = self.editContactBirthday();
                }
            }

            $.ajax({
                url: '/api/LeadsAPI/UpsertLeadContact',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    leadId: self.leadId(),
                    leadContactId: self.editContactId(),
                    decisionMaker: self.editContactDecisionMaker(),
                    leadContactTypeId: self.editContactTypeId(),
                    titleId: self.editContactTitle(),
                    fullName: self.editContactFullName(),
                    workPhone: self.editContactWorkPhone(),
                    mobilePhone: self.editContactMobilePhone(),
                    homePhone: self.editContactHomePhone(),
                    email: self.editContactEmail(),
                    skypeId: self.editContactSkype(),
                    linkedIn: self.editContactLinkedIn(),
                    whatsApp: self.editContactWhatsApp(),
                    website: self.editContactWebsite(),
                    instagram: self.editContactInstagram(),
                    facebook: self.editContactFacebook(),
                    twitter: self.editContactTwitter(),
                    youTube: self.editContactYouTube(),
                    pinterest: self.editContactPinterest(),
                    birthday: birthday,
                    notes: self.editContactNotes()
                },
                success: function (data) {

                    var extant = Enumerable.From(self.existingLeadContacts()).Where(function (x) {
                        return (x.leadContactId() === data.LeadContactID)
                    }).SingleOrDefault();

                    if (extant) {
                        extant.titleId(self.editContactTitle());
                        extant.fullName(self.editContactFullName());
                        extant.leadContactTypeId(self.editContactTypeId());
                        extant.decisionMaker(self.editContactDecisionMaker());
                        extant.email(self.editContactEmail());
                        extant.workPhone(self.editContactWorkPhone());
                        extant.mobilePhone(self.editContactMobilePhone());
                        extant.homePhone(self.editContactHomePhone());
                        extant.skype(self.editContactSkype());
                        extant.whatsApp(self.editContactWhatsApp());
                        extant.linkedIn(self.editContactLinkedIn());
                        extant.website(self.editContactWebsite());
                        extant.instagram(self.editContactInstagram());
                        extant.facebook(self.editContactFacebook());
                        extant.twitter(self.editContactTwitter());
                        extant.youTube(self.editContactYouTube());
                        extant.pinterest(self.editContactPinterest());
                        extant.notes(self.editContactNotes());
                        extant.birthday(self.editContactBirthday());
                    } else {
                        self.existingLeadContacts.push(new leadContact({
                            LeadContactID: data.LeadContactID,
                            TitleID: self.editContactTitle(),
                            FullName: self.editContactFullName(),
                            LeadContactTypeID: self.editContactTypeId(),
                            DecisionMaker: self.editContactDecisionMaker(),
                            Email: self.editContactEmail(),
                            WorkPhone: self.editContactWorkPhone(),
                            MobilePhone: self.editContactMobilePhone(),
                            HomePhone: self.editContactHomePhone(),
                            SkypeID: self.editContactSkype(),
                            WhatsApp: self.editContactWhatsApp(),
                            LinkedIn: self.editContactLinkedIn(),
                            Website: self.editContactWebsite(),
                            Instagram: self.editContactInstagram(),
                            Facebook: self.editContactFacebook(),
                            Twitter: self.editContactTwitter(),
                            YouTube: self.editContactYouTube(),
                            Pinterest: self.editContactPinterest(),
                            Notes: self.editContactNotes(),
                            Birthday: self.editContactBirthday()
                        }));
                    }

                    self.leadContactsBusy(false);
                },
                error: function (xhr, e, s) {
                    self.leadContactsBusy(false);
                    //$.showError(xhr, e, s);
                }
            });
        }
    }

    self.editingAddress = ko.observable(new leadAddress({ LeadID: self.leadId() }));

    self.editLeadAddress = function (leadAddressId) {
        self.leadSaveBusy(true);
        $.ajax({
            url: '/api/LeadsAPI/LoadLeadAddress',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                leadAddressId: leadAddressId
            },
            success: function (data) {
                self.editingAddress(new leadAddress(data));
                self.leadSaveBusy(false);
                $("#lead-address-modal").modal('show');
            },
            error: function (xhr, e, s) {
                self.leadSaveBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.newLeadAddress = function () {
        self.editingAddress(new leadAddress({ LeadID: self.leadId(), CountryID: self.countryId() }));
        $("#lead-address-modal").modal('show');
    }

    self.saveLeadAddress = function () {
        if (self.editingAddress().errors().length > 0) {
            self.editingAddress().errors.showAllMessages(true);
        }
        else {
            self.leadSaveBusy(true);
            $("#lead-address-modal").modal('hide');

            // need to clear out this lead address's pano just in case the address changed.
            if (self.editingAddress().leadAddressId())
                saveLeadAddressPanoramaLink(self.editingAddress().leadAddressId(), null);

            $.ajax({
                url: '/api/LeadsAPI/SaveLeadAddress',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: ko.mapping.toJS(self.editingAddress, {
                    ignore: [
                        "findPanorama",
                        "fetchGoogleStreetView",
                        "saveLatLng",
                        "displayLine"
                    ]
                }),
                success: function (data) {
                    self.loadLeadForEdit(self.editingAddress().leadId(), null, false);
                },
                error: function (xhr, e, s) {
                    self.leadSaveBusy(false);
                    //$.showError(xhr, e, s);
                }
            });
        }
    }

    self.deleteLeadAddress = function (leadAddressId) {
        $.confirm('Are you sure?', 'This will delete the address.', function () {

            self.leadSaveBusy(true);
            $.ajax({
                url: '/api/LeadsAPI/RemoveLeadAddress',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    leadId: self.leadId(),
                    leadAddressId: leadAddressId
                },
                success: function () {
                    self.loadLeadForEdit(self.leadId(), null, false);
                },
                error: function (xhr, e, s) {
                    self.leadSaveBusy(false);
                    //$.showError(xhr, e, s);
                }
            });
        }, null);
    }

    self.initBrandsWorkedWithAutocomplete = function () {
        $(".brands-worked-with").autocomplete({
            //classes: {

            //},
            appendTo: 'body',
            source: function (request, response) {
                $.ajax({
                    url: "/Component/CompetitorAutocomplete",
                    type: "POST",
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function (data) {

                        self.newCompetitor(true);

                        data.forEach(function (item) {
                            if (item.Name.toLowerCase() == request.term.toLowerCase()) {
                                self.newCompetitor(false);
                            }
                        });

                        //if (data.length) {
                        //    self.newCompetitor(false);
                        //} else {
                        //    self.newCompetitor(true);
                        //}

                        response($.map(data, function (item) {
                            return {
                                label: item.Name,
                                value: item
                            };
                        }));
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //$.showError(xhr, textStatus, errorThrown);
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                var obj = Enumerable.From(self.parent.availableCompetitors()).Where("$.CompetitorID == " + ui.item.value.CompetitorID).Single();
                self.brandsWorkedWith.remove(obj);
                self.brandsWorkedWith.push(obj);
                $(".brands-worked-with").val(null);
                self.newCompetitor(false);
                return false;
            },
            focus: function (event, ui) {
                return false;
            },
            autoFocus: true
        });

        return true;
    }

    self.initBrandsWorkedWithAutocomplete();

    self.addCompetitor = function (name) {
        $.ajax({
            url: '/api/LeadsAPI/AddCompetitor',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                name: name
            },
            success: function (data) {

                var obj = { CompetitorID: data.CompetitorID, Name: data.Name };

                var ext = Enumerable.From(self.parent.availableCompetitors()).Where("$.CompetitorID == " + data.CompetitorID).SingleOrDefault();
                if (ext) {

                } else {
                    self.parent.availableCompetitors.push(obj);
                }

                var extBra = Enumerable.From(self.brandsWorkedWith()).Where("$.CompetitorID == " + data.CompetitorID).SingleOrDefault();

                if (extBra) {

                } else {
                    self.brandsWorkedWith.push(obj);
                }

                self.newCompetitor(false);

                self.brandsWorkedWithAutocomplete(undefined);
            },
            error: function (xhr, e, s) {
                self.leadSaveBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.initLeadTagsAutocomplete = function () {
        $(".lead-tags").autocomplete({
            appendTo: 'body',
            source: function (request, response) {
                $.ajax({
                    url: "/api/componentapi/TagAutocomplete",
                    type: "POST",
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function (data) {

                        self.newLeadTag(true);

                        data.forEach(function (item) {
                            if (item.Name.toLowerCase() == request.term.toLowerCase()) {
                                self.newLeadTag(false);
                            }
                        });

                        response($.map(data, function (item) {
                            return {
                                label: item.Name,
                                value: item
                            };
                        }));
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //$.showError(xhr, textStatus, errorThrown);
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                var obj = Enumerable.From(self.parent.availableLeadTags()).Where("$.TagID == " + ui.item.value.TagID).Single();
                self.leadTags.remove(obj);
                self.leadTags.push(obj);
                $(".lead-tags").val(null);
                self.newLeadTag(false);
                return false;
            },
            focus: function (event, ui) {
                return false;
            },
            autoFocus: true
        });

        return true;
    }

    self.initLeadTagsAutocomplete();

    self.addLeadTag = function (name) {
        $.ajax({
            url: '/api/ComponentAPI/AddTag',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                name: name
            },
            success: function (data) {

                var obj = { TagID: data.TagID, Name: data.Name };

                var ext = Enumerable.From(self.parent.availableLeadTags()).Where("$.TagID == " + data.TagID).SingleOrDefault();
                if (ext) {

                } else {
                    self.parent.availableLeadTags.push(obj);
                }

                var extBra = Enumerable.From(self.leadTags()).Where("$.TagID == " + data.TagID).SingleOrDefault();

                if (extBra) {

                } else {
                    self.leadTags.push(obj);
                }

                self.newLeadTag(false);

                self.leadTagsAutocomplete(undefined);
            },
            error: function (xhr, e, s) {
                self.leadSaveBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.progressButtonText = ko.pureComputed(function () {
        switch (self.currentStage()) {
            case 1:
                return 'Process Application';
                break;
            case 2:
                return 'Complete Application'
                break;
            case 3:
                return 'Account Approved'
                break;
            case 4:
                return 'Open Account'
                break;
            case 5:
                return 'Should not see this'
                break;
            default:
                break;
        }
    }, self);

    self.changeStatusAndSubmit = function (action) {
        // determine what status
        // set it to self.selectedLeadStatus
        //call submit with no action
        var nextStatus = null;

        switch (self.currentStage()) {
            case 1:
                nextStatus = { LeadStatusID: 10, Name: 'Process Lead' };
                break;
            case 2:
                nextStatus = { LeadStatusID: 10, Name: 'Complete Application' };
                break;
            case 3:
                nextStatus = { LeadStatusID: 11, Name: 'Account Approved' };
                let earlyReturn = false;
                if (self.salesRepErrors().length > 0) {
                    self.salesRepErrors.showAllMessages(true);
                    earlyReturn = true;
                }
                if (self.emailAttachmentErrors().length > 0) {
                    self.emailAttachmentErrors.showAllMessages(true);
                    earlyReturn = true;
                }
                if (earlyReturn)
                    return;

                break;
            case 4:
                nextStatus = { LeadStatusID: 7, Name: 'Open Account' };
                if (self.creditControlErrors().length > 0) {
                    self.creditControlErrors.showAllMessages(true);
                    return;
                }
                break;
            //case 5: 
            //    nextStatus = self.selectedLeadStatus();
            //    break;
            default:
                break;
        }

        if (action == 'open') {
            $.confirm('Are you absolutely sure?', 'Please ensure you have double checked everything before opening this account.', () => {
                var previousLeadStage = Enumerable.From(self.stageInformation().LeadStages).Where("$.LeadStageID == 3").Single();

                // must assign to previous stage's owner 
                self.ownerMember({
                    MemberID: previousLeadStage.MemberID,
                    FullName: previousLeadStage.FullName
                });
                console.log('assigning lead to', self.ownerMember());

                self.selectedLeadStatus(nextStatus);

                self.submit(action);
            });
        } else {

            self.selectedLeadStatus(nextStatus);

            self.submit(action);
        }
    }

    self.cancelDecline = function () {
        // restore previous status

        $('#decline-reason').hide();

        self.selectedLeadStatus(self.loadedLeadStatus());
        // close modal
        $("#decline-account-modal").modal('hide');
    }

    self.leadContacted = function () {
        self.selectedLeadStatus({ LeadStatusID: 1, Name: 'Contacted, awaiting response' });
        self.submit('close');
    }

    self.approveForTradeAccount = function () {
        $.confirm('Are you sure?', 'Are you sure you want to approve this lead for a Trade Account?', function () {
            self.selectedLeadStatus({ LeadStatusID: 2, Name: 'Application to be completed by Rep' });
            self.submit(); // this should not close: it should reload the lead in the next stage.
        }, function () {

        });
    }

    self.showMiscConfirm = function () {
        //self.miscRepSlicer().widget().value(null);
        self.miscRep(undefined);
        self.miscRepId(self.preselectedMiscRepId);
        self.selectedMiscTradeAccount(undefined);
        //self.miscRepTradeAccountWidget().widget().value(null);
        //self.selectedMiscTradeAccount(undefined);
        self.validateMiscNow(false);
        self.assignToMiscErrors.showAllMessages(false);
        $('#misc-confirm-modal').modal('show');
    }

    self.approveForMiscAccount = function () {
        self.validateMiscNow(true);
        if (self.assignToMiscErrors().length) {
            self.assignToMiscErrors.showAllMessages(true);
        } else {
            $('#misc-confirm-modal').modal('hide');
            self.selectedLeadStatus({ LeadStatusID: 13, Name: 'Approved for a Miscellaneous Account' });
            window.setTimeout(function () { self.submit('close') }, 100);
        }

        //$.confirm('Please Confirm', 'If you are sure that you want to approve this lead for a Miscellaneous Account, please ', function () {
        //    self.selectedLeadStatus({ LeadStatusID: 13, Name: 'Approved for a Miscellaneous Account' });
        //    window.setTimeout(function() { self.submit('close') }, 100);
        //}, function () {

        //});
    }

    self.tradeAccountCreationEmailModal = () => {
        if (self.salesRepErrors().length > 0) {
            self.salesRepErrors.showAllMessages(true);
        } else {
            $("#trade-account-creation-email-attachment-modal").modal("show");
        }
    }

    self.passToCreditControl = function () {
        // Now we need to pop the modal and ask the questions in there trade-account-creation-email-attachment-modal
        // We cannot mandate the selection of any particular count of attachments but we need the thing to be in their faces.

        self.processApplicationSave();
    }

    self.resendEmailInvite = function () {
        if (self.primaryLeadContact()) {
            if (self.primaryLeadContact().email()) {
                $.ajax({
                    url: '/component/resendTradeAccountRequestFormEmail',
                    type: 'POST',
                    dataType: 'json',
                    cache: false,
                    data: {
                        leadId: self.leadId(),
                        email: self.primaryLeadContact().email(),
                        countryId: self.countryId(),
                        languageId: self.languageId()
                    },
                    success: function (data) {
                        $.info('Done', 'This lead\'s invitation email has been resent to: ' + self.primaryLeadContact().email())
                    },
                    error: function (xhr, e, s) {
                        self.leadSaveBusy(false);
                        //$.showError(xhr, e, s);
                    }
                });
            } else {
                $.error('Sorry', 'No email was found for this lead\'s primary contact.');
            }
        } else {
            $.error('Sorry', 'No primary contact information was found for this lead.');
        }
    }

    self.lostAndSubmit = function () {
        if (self.leadStatusReason.isValid()) {
            self.selectedLeadStatus({ LeadStatusID: 5, Name: 'Lost Lead' });
            self.submit('close');
        } else {
            self.leadStatusReason.isModified(true);
        }
    }

    self.declineAndSubmit = function () {
        if (self.leadStatusReason.isValid()) {
            self.selectedLeadStatus({ LeadStatusID: 9, Name: 'Account Declined' });
            self.submit('close');
        } else {
            self.leadStatusReason.isModified(true);
        }
        return;
    }

    self.submit = function (action) {

        //if (self.companyErrors().length > 0) {
        //    self.companyErrors.showAllMessages(true);
        //    $("#lead-form-company-heading").parent().addClass('panel-danger');
        //}

        if (self.contactErrors().length > 0) {
            self.contactErrors.showAllMessages(true);
            //$("#lead-form-contacts-heading").parent().addClass('alert-danger');
        }

        if (self.companyAnnualRevenue()) {
            if (self.businessPotentialErrors().length > 0) {
                self.businessPotentialErrors.showAllMessages(true);
                //$("#lead-form-potential-heading").parent().addClass('alert-danger');
                return;
            }
        }

        if (self.selectedLeadStatus()) {
            if (self.selectedLeadStatus().LeadStatusID == 5) {
                if (self.salesRepErrors().length > 0) {
                    //self.salesRepErrors.showAllMessages(true);
                    //$("#lead-form-representative").parent().addClass('alert-danger');
                    //$("#complete-application-collapse").parent().addClass('alert-danger');
                    //return;
                }
                if (self.emailAttachmentErrors().length > 0) {
                    self.emailAttachmentErrors.showAllMessages(true);
                    return;
                }
            }
            if (self.selectedLeadStatus().LeadStatusID == 6) {
                if (self.creditControlErrors().length > 0) {
                    //self.creditControlErrors.showAllMessages(true);
                    //$("#lead-form-credit-control").parent().addClass('alert-danger');
                    //$("#specify-payment-terms-collapse").parent().addClass('alert-danger');
                    //return;
                }
            }
        }

        if (self.companyErrors().length == 0 &&
            self.contactErrors().length == 0) {

            self.leadSaveBusy(true);

            if (self.addingNewNote()) {
                self.saveNewNote();
            }

            let salesDivision = null;

            if (self.salesDivision() === true) {
              salesDivision = "T";
            }

            if (self.salesDivision() === false) {
              salesDivision = "N";
            }

            var actionToTake = action;

            var data = {
                LeadID: self.leadId(),
                LoadedDT: self.loadedDt,
                LeadStatusReason: self.leadStatusReason(),
                LeadSourceID: self.leadSourceId(),
                StarRating: self.starRating(),
                LeadMagnitudeID: self.leadMagnitudeId(),
                OwnerMemberID: self.ownerMemberId(),
                ChannelID: self.channelId(),
                LeadTypeID: self.leadTypeId(),
                AnnualRevenue: self.companyAnnualRevenue(),
                CompanyName: self.companyName(),
                CountryID: self.countryId(),
                LanguageID: self.languageId(),
                CompanyRegistration: self.companyRegistration(),
                CompanyVATNumber: self.companyVATNumber(),
                VATCountryID: self.vatCountry() ? self.vatCountry().CountryID : null,
                VATNumberDisplay: this.vatNumberDisplay(),
                EORINumber: self.eoriNumber(),
                CompanyTypeID: self.companyTypeId(),
                TradingSinceID: self.tradingSinceId(),
                WillBuyPatternBooks: self.willBuyPatternBooks(),
                HasPatternBookLibrary: self.hasPatternBookLibrary(),
                HasShowroom: self.hasShowroom(),
                ShowroomByAppointmentOnly: self.showroomByAppointmentOnly(),
                BankName: self.bankName(),
                BankAddressLine1: self.bankAddressLine1(),
                BankAddressLine2: self.bankAddressLine2(),
                BankTown: self.bankTown(),
                BankCounty: self.bankCounty(),
                BankPostcode: self.bankPostcode(),
                BankCountryID: self.bankCountryId(),
                BankAccountNumber: self.bankAccountNumber(),
                BankSortCode: self.bankSortCode(),
                BankIBAN: self.bankIBAN(),
                //PaymentTermsID: self.paymentTerms(),
                CreditLimit: self.creditLimit(),
                RequestedCreditLimit: self.requestedCreditLimit(),
                CompanyLetterHeadChecked: self.companyLetterHeadChecked(),
                AccountTypeID: self.accountTypeId(),
                CustomerTypeID: self.customerTypeId(),
                SalesMarketID: self.salesMarket() ?
                    self.salesMarket().SalesMarketID :
                    null,
                SalesRepresentativeID: self.salesRepresentative() ?
                    self.salesRepresentative().SalesRepresentativeID :
                    null,
                SalesAreaID: self.salesArea() ?
                    self.salesArea().SalesAreaID :
                    null,
                SalesAgentID: self.salesAgent() ?
                    self.salesAgent().SalesRepresentativeID :
                    null,
                TradePriceListID: self.tradePriceList() ?
                    self.tradePriceList().TradePriceListID :
                    null,
                shouldUpdateTradingSince: self.shouldUpdateTradingSince,
                brandsWorkedWith: self.brandsWorkedWith(),
                Tags: self.leadTags(),
                leadInterests: self.leadInterests(),
                SellOnline: self.sellOnline(),
                NumberOfPatternBooksPurchased: self.numberOfPatternBooksPurchased(),
                FirstOrderValue: self.firstOrderValue(),
                JoinedPatternBookScheme: self.joinedPatternBookScheme(),
                PaymentTermsNotes: self.paymentTermsNotes(),
                miscSalesRepId: self.miscRepId(),
                miscTradeAccountId: self.selectedMiscTradeAccount(),
                tradeAccountClass: self.tradeAccountClass(),
                creditController: self.creditController(),
                bankCode: self.bankCode(),
                mertexLanguageCode: self.mertexLanguageCode(),
                insuredCreditLimit: self.insuredCreditLimit(),
                purchaseOrderRequired: self.purchaseOrderRequired(),
                shouldSendPricelists: self.shouldSendPricelists(),
                belongToGroupAccount: self.belongToGroupAccount(),
                tradeAccountGroup: self.tradeAccountGroup(),
                salesDivision: salesDivision,
                deliveryTerms: self.deliveryTerms(),
                taxId: self.taxId(),
                shouldSendTradeAccountCreationEmail: self.tradeAccountCreationEmail_send() ?? false,
                tradeAccountCreationEmail_displayAccountManager: self.tradeAccountCreationEmail_displayAccountManager(),
                tradeAccountCreationEmail_displayCustomerService: self.tradeAccountCreationEmail_displayCustomerService(),
                tradeAccountCreationEmail_displayCreditControl: self.tradeAccountCreationEmail_displayCreditControl(),
                tradeAccountCreationEmail_displayB2BRegistration: true,
                tradeAccountCreationEmail_displayLookbook: self.tradeAccountCreationEmail_displayLookbook(),
                TradeAccountCreationEmail_attachments: self.salesMarket()
                    ? self.attachmentsManager.attachments().map(a => {
                            return {
                                tradeAccountCreationEmailAttachmentId: a.TradeAccountCreationEmailAttachmentID,
                                name: a.name(),
                                path: a.path(),
                                salesMarket: self.salesMarket().Name,
                                fileSizeBytes: a.fileSizeBytes(),
                                sortOrder: a.SortOrder
                            }
                        })
                    : []
            }

            if (self.paymentTerms()) {
                data.PaymentTermsID = self.paymentTerms().PaymentTermsID;
            }

            if (self.selectedLeadStatus()) {
                data.LeadStatusID = self.selectedLeadStatus().LeadStatusID;
            } else {
                data.LeadStatusID = self.loadedLeadStatusId();
            }

            if (self.companyCurrency()) {
                data.CompanyCurrency = self.companyCurrency();
            }
            if (self.requestedPaymentOption()) {
                data.PaymentOptionID = self.requestedPaymentOption().PaymentOptionID;
            }

            let fd = new FormData(document.getElementById('lead-form'));

            var params = {
                obj: JSON.stringify(data)
            }

            for (const key in params) {
                fd.append(key, params[key]);
            }

            $.ajax({
                url: '/api/LeadsAPI/LeadUpsert',
                type: 'POST',
                type: 'POST',
                data: fd,
                processData: false,
                contentType: false,
                success: function (data) {

                    self.parent.leadSearch.dashboardSelect(true);
                    var idToHighlight = $(".dash-panel.panel-primary").attr('id');
                    if (idToHighlight)
                        self.parent.leadSearch.elementToHighlight('#' + idToHighlight);
                    self.parent.leadSearch.performSearch(self.parent.leadSearch.lastSearchType());

                    switch (actionToTake) {
                      case 'new':
                        self.leadSaveBusy(false);
                            self.reset(actionToTake);
                            self.showStage(1);
                            break;
                      case 'close':
                        self.leadSaveBusy(false);
                            $("#edit-lead-modal").modal('hide');
                        break;
                      case 'open':
                        $.ajax({
                          url: '/api/leadsapi/OpenTradeAccount',
                          type: 'post',
                          dataType: 'json',
                          cache: false,
                          data: {
                            leadId: self.leadId(),
                          },
                          success: (result) => {
                            $.info('Success', `Trade Account <b>${result.tradeAccountCode}</b> has been opened in Mertex.`, null, () => {
                              self.leadSaveBusy(false);
                              $("#edit-lead-modal").modal('hide');
                            });
                          },
                          error: function (xhr, e, s) {
                            //self.resetLeadToCreditControl();
                            $.showError(xhr, e, s);
                          }
                        });
                        break;
                      default:
                            self.leadSaveBusy(false);
                            self.leadId(data.LeadID);
                            self.leadContactId(data.LeadContactID);
                            self.loadLeadForEdit(data.LeadID, null, false);
                            break;
                    }
                },
                error: function (xhr, e, s) {
                    self.leadSaveBusy(false);
                    $.showError({ responseText: xhr.responseJSON.ExceptionMessage }, e, s);
                    self.parent.leadSearch.resultGridWidget().dataSource.read();
                }
            });
        }
    }

    self.resetLeadToCreditControl = () => {
        $.ajax({
            url: '/api/leadsapi/ResetLeadToCreditControl',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {
            leadId: self.leadId()
            },
            success: () => {
            //self.loadLeadForEdit(self.leadId(), null, false);
            window.setTimeout(() => {
                self.parent.leadSearch.dashboardSelect();
                self.leadSaveBusy(false);
            }, 0);
            },
            error: (xhr, s, a) => {
            self.leadSaveBusy(false);
            $.showError(xhr, s, a);
            }
        });
    }

    self.reset = function (stayOpen) {

        console.log('reset called');

        self.showStage(1);
        self.busy(false);
        self.leadLoadBusy(false);
        self.leadSaveBusy(false);
        self.leadContactsBusy(false);
        self.viewLeadBusy(false);
        self.confirmNewLead(false);
        self.addingNewNote(false);
        self.newCompetitor(false);
        self.newLeadTag(false);

        self.loadedOwnerMember(undefined);
        self.loadedOwnerMemberId(undefined);

        self.leadId(undefined);
        self.viewingLead(undefined);
        self.salesMarket(undefined);
        self.accountTypeId(undefined);
        self.customerTypeId(undefined);
        self.companyCurrencyId(undefined);
        self.companyAnnualRevenue(undefined);
        self.salesRepresentative(undefined);
        self.salesAgent(undefined);
        self.salesArea(undefined);
        self.tradePriceList(undefined);
        self.paymentTerms(undefined);
        self.requestedPaymentOption(undefined);
        self.leadTypeId(undefined);
        self.selectedLeadStatus(undefined);
        self.loadedLeadStatus(undefined);
        self.starRating(undefined);
        self.leadMagnitudeId(undefined);
        self.countryId(81);
        self.languageId(1);
        self.createdDt(undefined);
        self.createdSince(undefined);
        self.modifiedDt(undefined);
        self.modifiedSince(undefined);
        self.assignedDt(undefined);
        self.assignedSince(undefined);
        self.tradingSinceId(undefined);
        self.tradingSinceLoadedValue(undefined);
        self.sourceMember(undefined);
        self.brandsWorkedWith([]);
        self.leadTags([]);
        self.willBuyPatternBooks(undefined);
        self.hasPatternBookLibrary(undefined);
        self.hasShowroom(undefined);
        self.showroomByAppointmentOnly(undefined);
        self.companyTypeId(undefined);
        self.brandsWorkedWithAutocomplete(undefined);
        self.leadTagsAutocomplete(undefined);
        self.notes([]);
        self.leadAddresses([]);
        self.leadContactId(undefined);
        self.leadAddressId(undefined);
        self.defaultInvoicingAddressId(undefined);
        self.defaultDeliveryAddressId(undefined);
        self.defaultVisitAddressId(undefined);
        self.brandProductTypeGroupObjects([]);
        self.brandGroups([]);
        self.productTypeGroups([]);
        self.companyLetterHeadChecked(false);
        self.leadCheckFullName(undefined);
        self.leadCheckPostcode(undefined);
        self.channelId(undefined);
        self.ownerMember(undefined);
        self.leadSourceId(undefined);
        self.companyName(undefined);
        self.companyRegistration(undefined);
      self.companyVATNumber(undefined);
      self.vatRegistered(false);
        self.eoriNumber(undefined);
        self.newNote(undefined);
        if (self.ownMarker) {
            self.ownMarker.setMap(null);
            delete self.ownMarker;
        }
        if (self.googleMapsRadiusClickListener)
            google.maps.event.removeListener(self.googleMapsRadiusClickListener)
        self.googleMapsRadiusClickListener = null;
        self.googleMapsBusy(false);
        self.googleMapsFailed(false);
        self.googleMapsRadius(10);
        if (self.googleMapsRadiusCircle) {
            self.googleMapsRadiusCircle.setMap(null);
            delete self.googleMapsRadiusCircle;
        }
        if (self.markerCluster) {
            self.markerCluster.clearMarkers();
            self.markerCluster = null;
        }
        if (window.oms) {
            window.oms.removeAllMarkers();
        }
        self.justMyAccounts(false);
        self.bankCountryId(undefined);
        self.bankName(undefined);
        self.bankAccountNumber(undefined);
        self.bankSortCode(undefined);
        self.bankIBAN(undefined);
        self.creditLimit(undefined);
        self.requestedCreditLimit(undefined);
        self.bankAddressLine1(undefined);
        self.bankAddressLine2(undefined);
        self.bankTown(undefined);
        self.bankCounty(undefined);
        self.bankPostcode(undefined);

        self.resetNewLeadContact();

        self.existingLeads([]);
        self.existingLeadsPageNumber(1);
        self.existingLeadsPageSize(10);
        self.existingLeadsPageCount(0);
        self.existingLeadsTotalCount(0);
        self.existingTradeAccounts([]);
        self.existingTradeAccountsPageNumber(1);
        self.existingTradeAccountsPageSize(10);
        self.existingTradeAccountsPageCount(0);
        self.existingTradeAccountsTotalCount(0);
        self.existingLeadContacts([]);
        self.newLeadAddressLine1(undefined);
        self.newLeadAddressLine2(undefined);
        self.newLeadTown(undefined);
        self.newLeadCounty(undefined);
        self.leadInterests([]);
        self.proximalTradeAccounts([]);
        self.sellOnline(false);
        self.numberOfPatternBooksPurchased(null);
        self.firstOrderValue(null);
        self.placedAnOrder(undefined);
        self.joinedPatternBookScheme(undefined);
        self.creditControllerFromList(undefined);
        self.orderConfirmationsEmail(undefined);
        self.invoiceStatementsEmail(undefined);
        self.pricelistsProductsNewsEventsEmail(undefined);
        self.deliveryNotificationsEmails(undefined);
        self.paymentTermsNotes(undefined);
        self.wantToPayByDirectDebit(undefined);
        //self.stageInformation(undefined); // not necessary as this is always overwritten on load...?

        // other... bits.

        self.tradeAccountClass(undefined);
        self.creditController(undefined);
        self.bankCode(undefined);
        self.mertexLanguageCode(undefined);
        self.insuredCreditLimit(undefined);
        self.purchaseOrderRequired(undefined);
        self.shouldSendPricelists(undefined);
        self.belongToGroupAccount(undefined);
        self.tradeAccountGroup("MI");
        self.salesDivision(false);
        self.deliveryTerms(undefined);
        self.taxId(undefined);
        self.usSalesTaxExemptionCertificateBase64(undefined);

        self.vatCountry(undefined);
        self.vatNumberDisplay(undefined);
        self.vatNumberValid(false);
        self.vatNumberError(false);
        self.vatNumberMessage(undefined);
        self.vatCheckBusy(false);
        self.vatNumberCheckPerformed(false);

        self.preliminaryErrors.showAllMessages(false);
        self.newLeadErrors.showAllMessages(false);
        self.companyErrors.showAllMessages(false);
        self.businessPotentialErrors.showAllMessages(false);
        self.contactErrors.showAllMessages(false);
        self.editContactErrors.showAllMessages(false);
        self.newNoteErrors.showAllMessages(false);

        if (!stayOpen)
            $("#edit-lead-modal").modal('hide');

        $(".assignedToMemberSearch").val(null);

        self.assignedToMemberSearch.searchTerm(null);

        self.leadPotential.reset();

        self.editingAddress(new leadAddress({}));

        self.selectedMiscTradeAccount(undefined);

        self.editContactErrors.showAllMessages(false);
        self.preliminaryErrors.showAllMessages(false);
        self.newLeadErrors.showAllMessages(false);
        self.companyErrors.showAllMessages(false);
        self.contactErrors.showAllMessages(false);
        self.businessPotentialErrors.showAllMessages(false);
        self.assignToMiscErrors.showAllMessages(false);

        self.validateMiscNow(false);

        self.retailAppointmentShop(undefined);
        self.retailAppointmentTime(undefined);
        self.retailAppointmentDate(undefined);
        self.retailAppointmentType(undefined);

        self.retailAppointmentActualShop(undefined);
        self.retailAppointmentActualTime(undefined);
        self.retailAppointmentActualDate(undefined);
        self.retailAppointmentActualTypeId(undefined);
        self.retailAppointmentActualType(undefined);
        self.retailAppointmentActualAssistant(undefined);

        self.tradeAccountCreationEmail_displayAccountManager(undefined);
        self.tradeAccountCreationEmail_displayCustomerService(undefined);
        self.tradeAccountCreationEmail_displayCreditControl(undefined);
        self.tradeAccountCreationEmail_displayB2BRegistration(true);
        self.tradeAccountCreationEmail_displayLookbook(undefined);

        self.attachmentsManager.attachments([]);

        $("#lead-form-potential-heading").parent().removeClass('alert-danger');
        $("#lead-form-company-heading").parent().removeClass('alert-danger');
        $("#lead-form-contacts-heading").parent().removeClass('alert-danger');
        $("span.lead-potential-span").removeClass('alert-info');

        $("#default-credit-controller-selected").hide();
        $("#credit-controller-list-selected").hide();
    }

    self.resetNewLeadContact = function () {
        self.editContactId(undefined);
        self.editContactTitle(undefined);
        self.editContactTypeId(undefined);
        self.editContactDecisionMaker(false);
        self.editContactFullName(undefined);
        self.editContactEmail(undefined);
        self.editContactWorkPhone(undefined);
        self.editContactMobilePhone(undefined);
        self.editContactHomePhone(undefined);
        self.editContactSkype(undefined);
        self.editContactWhatsApp(undefined);
        self.editContactLinkedIn(undefined);
        self.editContactWebsite(undefined);
        self.editContactFacebook(undefined);
        self.editContactTwitter(undefined);
        self.editContactInstagram(undefined);
        self.editContactYouTube(undefined);
        self.editContactPinterest(undefined);
        self.editContactNotes(undefined);
        self.editContactBirthday(undefined);
    }

    // #endregion
}

// LeadView. This is currently very much the poor relation;
// it is accessed by clicking on Existing Leads in the New Lead creation process.
var leadView = function (lead, productTypeGroups) {
    var self = this;

    //console.log(lead);

    self.companyName = ko.observable(lead.CompanyName);
    self.companyRegistration = ko.observable(lead.CompanyNumber);
    self.companyVATNumber = ko.observable(lead.VATNumber);
    self.eoriNumber = ko.observable(lead.EORI);
    self.notes = ko.observable(lead.LeadNotes);
    self.secondaryContacts = ko.observableArray(lead.SecondaryContacts);
    self.leadAddresses = ko.observableArray([]);

    self.leadAddresses.push(new leadAddress(lead.LeadAddresses[0]));

    self.status = ko.observable(lead.Status);

    self.ownerMember = ko.observable(lead.OwnerMember);

    self.country = ko.observable(lead.Country);

    self.language = ko.observable(lead.Language);

    self.channel = ko.observable(lead.Channel);

    self.currency = ko.observable(lead.Currency);

    self.totalPotential = ko.observable(lead.TotalPotential);

    self.starRating = ko.observable(lead.StarRating);

    self.annualRevenue = ko.observable(lead.AnnualRevenue);

    self.leadSource = ko.observable(lead.LeadSource);

    self.sourceMember = ko.observable(lead.SourceMember);

    //self.description = ko.observable(lead.Description);

    self.notes = ko.observableArray(lead.LeadNotes);

    //console.log('will buy pattern books: ' + lead.WillBuyPatternBooks);

    self.willBuyPatternBooks = ko.observable(lead.WillBuyPatternBooks);

    self.willBuyPatternBooksDisplay = ko.pureComputed({
        read: function () {
            if (self.willBuyPatternBooks() != null) {
                return Enumerable.From(viewModel.availablePatternBookCommitmentOptions).Where("$.Value == " + self.willBuyPatternBooks()).Single().Name;
            } else {
                return null
            }
        }
    }, self);

    self.hasPatternBookLibrary = ko.observable(lead.HasPatternBookLibrary);

    self.hasPatternBookLibraryDisplay = ko.pureComputed({
        read: function () {
            if (self.hasPatternBookLibrary() != null) {
                return Enumerable.From(viewModel.availablePatternBookLibraryOptions).Where("$.Value == " + self.hasPatternBookLibrary()).Single().Name;
            } else {
                return null
            }
        }
    }, self);

    self.hasShowroom = ko.observable(lead.HasShowroom);

    self.hasShowroomDisplay = ko.pureComputed({
        read: function () {
            if (self.hasShowroom() != null) {
                return Enumerable.From(viewModel.availableHasShowroomOptions).Where("$.Value == " + self.hasShowroom()).Single().Name;
            } else {
                return null
            }
        }
    }, self);

    self.showroomByAppointmentOnly = ko.observable(lead.ShowroomByAppointmentOnly);

    self.showroomByAppointmentOnlyDisplay = ko.pureComputed({
        read: function () {
            if (self.showroomByAppointmentOnly()) {
                return Enumerable.From(viewModel.availableShowroomByAppointmentOnlyOptions).Where("$.Value == " + self.showroomByAppointmentOnly()).Single().Name;
            } else {
                return null;
            }
        }
    }, self);

    self.companyTypeId = ko.observable(lead.CompanyTypeID);

    self.companyType = ko.pureComputed({
        read: function () {
            if (self.companyTypeId()) {
                return Enumerable.From(viewModel.availableCompanyTypeOptions).Where("$.CompanyTypeID == " + self.companyTypeId()).Single().Name;
            } else {
                return null
            }
        }
    }, self);

    self.tradingSinceId = ko.observable(lead.TradingSinceID);

    self.tradingSinceDisplay = ko.pureComputed({
        read: function () {
            if (self.tradingSinceId()) {
                return Enumerable.From(viewModel.availableTradingSinceOptions).Where("$.Value == " + self.tradingSinceId()).Single().Name
            } else {
                return null;
            }
        }
    }, self);

    self.brandProductTypeGroupObjects = ko.observableArray([]);

    self.getBrandProductTypeGroupObject = function (brandId, productTypeGroupId) {

        var result = Enumerable.From(self.brandProductTypeGroupObjects()).Where("$.brandId == " + brandId + " && $.productTypeGroupId == " + productTypeGroupId).SingleOrDefault();

        if (result) {
            return result;
        }
    }

    self.leadInterests = ko.observableArray([]);
    self.brandGroups = ko.observableArray([]);
    self.productTypeGroups = ko.observableArray([]);

    self.brandGroups(Enumerable.From(Enumerable.From(productTypeGroups).OrderBy("$.Brand.SortOrder").ToArray())
        .GroupBy(
            "$.Brand",
            "$.Brand",
            "key, e => key",
            "$.BrandID"
        ).ToArray());

    self.productTypeGroups(Enumerable.From(Enumerable.From(productTypeGroups).OrderBy("$.ProductTypeGroup.SortOrder").ToArray())
        .GroupBy(
            "$.ProductTypeGroup", // Group on ProductTypeGroup object
            "", // Select everything
            "key, e => e", // Standard result selector
            "$.ProductTypeGroupID" // Compare just on ProductTypeGroupID property of ProductTypeGroup object
        ).ToArray());

    for (var i in self.productTypeGroups()) {
        var d = self.productTypeGroups()[i];
        for (var j in d.source) {

            self.brandProductTypeGroupObjects.push({ brandId: d.source[j].BrandID, productTypeGroupId: d.Key().ProductTypeGroupID });
        }
    }

    for (var i in lead.LeadInterests) {
        var interest = lead.LeadInterests[i];

        $("span.lead-potential-span[data-brand-id='" + interest.BrandID + "'][data-product-type-group-id='" + interest.ProductTypeGroupID + "']")
            .addClass('alert-info');
        self.leadInterests.push(self.getBrandProductTypeGroupObject(interest.BrandID, interest.ProductTypeGroupID));
    }

    self.competitors = ko.observableArray(lead.Competitors);
}

var leadContact = function (_leadContact) {
    var self = this;
    self.leadId = ko.observable(_leadContact.LeadID);
    self.leadContactId = ko.observable(_leadContact.LeadContactID);
    self.titleId = ko.observable(_leadContact.TitleID);
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
    self.fullName = ko.observable(_leadContact.FullName);
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
    self.leadContactTypeId = ko.observable(_leadContact.LeadContactTypeID);
    self.leadContactTypeDisplay = ko.pureComputed({
        read: function () {
            if (self.leadContactTypeId()) {
                return Enumerable.From(getAvailableLeadContactTypes()).Where("$.LeadContactTypeID == " + self.leadContactTypeId()).Select("$.Name").Single();
            } else {
                return null;
            }
        }
    }, self);
    self.decisionMaker = ko.observable(_leadContact.DecisionMaker);
    self.decisionMakerDisplay = ko.pureComputed({
        read: function () {
            return (self.decisionMaker() ? 'Yes' : 'No')
        }
    }, self);
    self.email = ko.observable(_leadContact.Email);
    self.workPhone = ko.observable(_leadContact.WorkPhone);
    self.mobilePhone = ko.observable(_leadContact.MobilePhone);
    self.homePhone = ko.observable(_leadContact.HomePhone);
    self.skype = ko.observable(_leadContact.SkypeID);
    self.whatsApp = ko.observable(_leadContact.WhatsApp);
    self.linkedIn = ko.observable(_leadContact.LinkedIn);
    self.website = ko.observable(_leadContact.Website);
    self.instagram = ko.observable(_leadContact.Instagram);
    self.facebook = ko.observable(_leadContact.Facebook);
    self.twitter = ko.observable(_leadContact.Twitter);
    self.youTube = ko.observable(_leadContact.YouTube);
    self.pinterest = ko.observable(_leadContact.Pinterest);
    self.notes = ko.observable(_leadContact.Notes);
    self.birthday = ko.observable(_leadContact.Birthday);

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

var leadAddress = function (address) {
    var self = this;
    //console.log(address);
    self.leadAddressId = ko.observable(address.LeadAddressID);

    self.leadId = ko.observable(address.LeadID);

    self.defaultInvoiceAddress = ko.observable(address.DefaultInvoiceAddress);
    self.defaultDeliveryAddress = ko.observable(address.DefaultDeliveryAddress);
    self.googlePanoLink = ko.observable(address.GooglePanoramaLink);

    self.countryId = ko.observable(address.CountryID).extend({
        required: {
            params: true,
            message: 'Please select a country'
        }
    });

    self.country = ko.pureComputed({
        read: function () {
            return Enumerable.From(getAvailableCountries()).Where(function (x) {
                return x.CountryID == self.countryId()
            }).FirstOrDefault();
        }
    });

    //console.log(address);

    self.label = ko.observable(address.Label).extend({
        charsRemaining: {
            maxLength: 50,
            elementId: '.address-label'
        }
    });

    self.line1 = ko.observable(address.AddressLine1).extend({
        charsRemaining: {
            maxLength: 100,
            elementId: '.address-1'
        },
        pcaPredict: {
            elementId: '.address-1',
            mapFunction: function (line1, line2, line3, line4, postcode) {
                self.line1(line1);
                self.line2(line2);
                self.town(line3);
                self.county(line4);
                self.postcode(postcode);
            },
            country: self.country
        }
    });

    self.line2 = ko.observable(address.AddressLine2).extend({
        charsRemaining: {
            maxLength: 100,
            elementId: '.address-2'
        }
    });

    self.town = ko.observable(address.Town).extend({
        charsRemaining: {
            maxLength: 70,
            elementId: '.address-town'
        }
    });

    self.county = ko.observable(address.County).extend({
        charsRemaining: {
            maxLength: 50,
            elementId: '.address-county'
        }
    });

    self.postcode = ko.observable(address.PostCode).extend({
        charsRemaining: {
            maxLength: 20,
            elementId: '.address-postcode'
        }
    });

    self.errors = ko.validation.group([
        self.countryId
    ]);

    self.appleMapsButton = ko.pureComputed({
        read: function () {
            if (self.latitude() && self.longitude()) {
                var appleMapsHref = 'https://www.google.com/maps?saddr=My+Location&daddr=' + self.latitude() + ',' + self.longitude();
                //encodeURIComponent(self.line1().replace(/\,$/, '')) + ',' +
                //encodeURIComponent(self.postcode()) + ',' +
                //encodeURIComponent(self.country().Code);
                var appleButton = '<a class="btn btn-secondary-blue directions-link btn-sm" target="_blank" href="' + appleMapsHref + '">Google Maps</a>'

                return appleButton;
            } else {
                var appleButton = '<a class="btn btn-secondary-blue directions-link btn-sm" href="javascript:;" onclick="$.info(\'Sorry\', \'Latitude and Longitude not found for this address.\');">Google Maps</a>'
            }
        }
    }, self);

    self.wazeButton = ko.pureComputed({
        read: function () {
            if (self.line1() && self.country()) {
                var wazeHref = 'waze://?q=' +
                    encodeURIComponent(self.line1().replace(/\,$/, '')) + ',' +
                    encodeURIComponent(self.postcode()) + ',' +
                    encodeURIComponent(self.country().Code);
                var wazeButton = '<a class="btn btn-secondary-blue directions-link btn-sm" target="_blank" href="' + wazeHref + '">Waze</a>';

                return wazeButton;
            }
        }
    }, self);

    self.googleStreetViewBusy = ko.observable(false);

    self.latitude = ko.observable(address.Latitude);
    self.longitude = ko.observable(address.Longitude);
    self.latLngFailure = ko.observable(false);

    self.findPanorama = function (radius, panoRequest) {
        var failureResult = 'javascript:$.info("Sorry", "Google\'s Maps API was unable to return a panorama for this address within a 500m radius");';
        var svService = new google.maps.StreetViewService();
        panoRequest.radius = radius;
        //console.log('findPanorama called: ', panoRequest);
        svService.getPanorama(panoRequest, function (panoData, status) {
            if (status === google.maps.StreetViewStatus.OK) {
                //console.log('findPanorama status was: ', status);
                //console.log('findPanorama got: ', panoData);
                if (panoData.links.length) {
                    self.googlePanoLink('https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + self.latitude() + ',' + self.longitude() + '&pano=' + panoData.links[0].pano);
                    self.googleStreetViewBusy(false);
                    saveLeadAddressPanoramaLink(self.leadAddressId(), self.googlePanoLink());
                } else {
                    //console.log('findPanorama status was OK at ' + radius + 'm, but had 0 results. Extending search.');

                    if (radius > 500) {
                        //console.log('findPanorama tried radius up to 500m, street view pano not available.')
                        self.googlePanoLink(failureResult);
                        self.googleStreetViewBusy(false);
                    } else {
                        self.findPanorama(radius + 10, panoRequest);
                    }
                }
            } else {
                //console.log('findPanorama status was: ', status);
                //console.log('findPanorama returned: ', panoData);
                if (radius > 500) {
                    //console.log('findPanorama tried radius up to 500m, street view pano not available.')
                    self.googlePanoLink(failureResult);
                    self.googleStreetViewBusy(false);
                } else {
                    self.findPanorama(radius + 10, panoRequest);
                }
            }
        });
    };

    self.googleMapsApiKey = "AIzaSyA_d3HoXoCV7M85_xduYJUze1GOscDnjUw";

    self.fetchGoogleStreetView = function () {
        //console.log('fetchGoogleStreetView called');
        if (!self.googlePanoLink()) { // if we don't already have a Panorama link...

            if (!self.latitude() || !self.longitude()) {

                // get lat / long for address
                // build streetmaps url using https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=lat,long
                // launch into new window

                self.googleStreetViewBusy(true);

                // get address 
                if (self.line1() || self.line2() || self.town() || self.county() || self.postcode()) {
                    var addressLine = "";
                    if (self.line1())
                        addressLine += self.line1();
                    if (self.line2())
                        addressLine += ',' + self.line2();
                    if (self.town())
                        addressLine += ',' + self.town();
                    if (self.county())
                        addressLine += ',' + self.county();
                    if (self.postcode())
                        addressLine += ',' + self.postcode();
                    if (self.country().Code)
                        addressLine += ',' + self.country().Code;

                    addressLine = encodeURIComponent(addressLine);

                    self.geoCode(addressLine);

                    var lat = null;
                    var long = null;
                    var failureResult = 'javascript:$.info("Sorry", "Google\'s StreetView API was unable to return a panorama for this address within a 500m radius");';
                    if (addressLine == "") {
                        self.googleStreetViewBusy = ko.observable(false);
                        self.googlePanoLink(failureResult);
                        return;
                    }
                    try {
                        // cannot return value to function from an ajax operation; loadGoogleStreetView returns before this ajax function has
                        // finished so result is not set.
                        // hmm.
                        // assigning to an observable would work but... we want to be able to do this for 
                        // Address objects returned directly from the server, which are not modelled client side.


                        //having changed primary address, the new address did lend a marker but the old marker still existed
                        // and the old marker was centered upon

                        var url = `https://maps.googleapis.com/maps/api/geocode/json?key=${self.googleMapsApiKey}&address=${addressLine}`;

                        $.ajax({
                            dataType: "json",
                            url: url,
                            success: function (data) {
                                if (data.status == "OK") {
                                    if (data.results.length > 0) {
                                        // hopefully they order it by relevance. If not, oh well.
                                        if (data.results[0].hasOwnProperty('geometry')) {
                                            if (data.results[0].geometry.hasOwnProperty('location')) {
                                                lat = data.results[0].geometry.location.lat;
                                                lng = data.results[0].geometry.location.lng;

                                                var panoRequest = {
                                                    location: data.results[0].geometry.location,
                                                    preference: google.maps.StreetViewPreference.NEAREST,
                                                    radius: 50,
                                                    source: google.maps.StreetViewSource.OUTDOOR
                                                };

                                                self.findPanorama(50, panoRequest);

                                                self.latitude(lat);
                                                self.longitude(lng);

                                                self.saveLatLng();
                                            }
                                        }
                                    } else {
                                        self.googlePanoLink(failureResult);
                                        self.latLngFailure(true);
                                    }
                                } else {
                                    var secondAttempt = "";

                                    if (viewModel.leadEdit.companyName())
                                        secondAttempt += viewModel.leadEdit.companyName()
                                    if (self.line2())
                                        secondAttempt += ',' + self.line2();
                                    if (self.town())
                                        secondAttempt += ',' + self.town();
                                    if (self.county())
                                        secondAttempt += ',' + self.county();
                                    if (self.postcode())
                                        secondAttempt += ',' + self.postcode();
                                    if (self.country().Code)
                                        secondAttempt += ',' + self.country().Code;

                                    secondAttempt = encodeURIComponent(secondAttempt);

                                    url = `https://maps.googleapis.com/maps/api/geocode/json?key=${self.googleMapsApiKey}&address=${secondAttempt}`;

                                    $.ajax({
                                        dataType: "json",
                                        url: url,
                                        success: function (data2) {
                                            if (data2.status == "OK") {
                                                if (data2.results.length > 0) {
                                                    // hopefully they order it by relevance. If not, oh well.
                                                    if (data2.results[0].hasOwnProperty('geometry')) {
                                                        if (data2.results[0].geometry.hasOwnProperty('location')) {
                                                            lat = data2.results[0].geometry.location.lat;
                                                            lng = data2.results[0].geometry.location.lng;

                                                            var svService = new google.maps.StreetViewService();
                                                            var panoRequest = {
                                                                location: data2.results[0].geometry.location,
                                                                preference: google.maps.StreetViewPreference.NEAREST,
                                                                radius: 50,
                                                                source: google.maps.StreetViewSource.OUTDOOR
                                                            };

                                                            self.findPanorama(50, panoRequest);

                                                            self.latitude(lat);
                                                            self.longitude(lng);

                                                            self.saveLatLng();
                                                        }
                                                    }
                                                } else {
                                                    self.googlePanoLink(failureResult);
                                                    self.googleStreetViewBusy(false);
                                                    self.latLngFailure(true);
                                                }
                                            } else {

                                                // third attempt
                                                var thirdAttempt = "";

                                                //if (viewModel.leadEdit.companyName())
                                                //    thirdAttempt += viewModel.leadEdit.companyName()
                                                //if (self.line1())
                                                //    thirdAttempt += self.line1();
                                                //if (self.town())
                                                //    thirdAttempt += ',' + self.town();
                                                //if (self.county())
                                                //    thirdAttempt += ',' + self.county();
                                                //if (self.postcode())
                                                thirdAttempt += self.postcode();
                                                if (self.country().Code)
                                                    thirdAttempt += ',' + self.country().Code;

                                                thirdAttempt = encodeURIComponent(thirdAttempt);

                                                url = `https://maps.googleapis.com/maps/api/geocode/json?key=${self.googleMapsApiKey}&address=${thirdAttempt}`;

                                                $.ajax({
                                                    dataType: "json",
                                                    url: url,
                                                    success: function (data3) {
                                                        if (data3.status == "OK") {
                                                            if (data3.results.length > 0) {
                                                                // hopefully they order it by relevance. If not, oh well.
                                                                if (data3.results[0].hasOwnProperty('geometry')) {
                                                                    if (data3.results[0].geometry.hasOwnProperty('location')) {
                                                                        lat = data3.results[0].geometry.location.lat;
                                                                        lng = data3.results[0].geometry.location.lng;

                                                                        var svService = new google.maps.StreetViewService();
                                                                        var panoRequest = {
                                                                            location: data3.results[0].geometry.location,
                                                                            preference: google.maps.StreetViewPreference.NEAREST,
                                                                            radius: 50,
                                                                            source: google.maps.StreetViewSource.OUTDOOR
                                                                        };

                                                                        self.findPanorama(50, panoRequest);

                                                                        self.latitude(lat);
                                                                        self.longitude(lng);
                                                                        //self.googleStreetViewBusy(false);
                                                                        self.saveLatLng();
                                                                    }
                                                                }
                                                            } else {
                                                                self.googlePanoLink(failureResult);
                                                                self.googleStreetViewBusy(false);
                                                                self.latLngFailure(true);
                                                            }
                                                        } else {
                                                            console.log(data3.status);
                                                            if (data3.status == "OVER_QUERY_LIMIT")
                                                                failureResult = 'javascript:$.info("Sorry", "We\'ve exceeded our Google Maps API request quota for the day.");';
                                                            self.googlePanoLink(failureResult);
                                                            self.googleStreetViewBusy(false);
                                                            self.latLngFailure(true);
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    } catch (e) {
                        self.googlePanoLink(failureResult);
                        self.googleStreetViewBusy(false);
                        self.latLngFailure(true);
                    }
                } else {
                    self.googlePanoLink(failureResult);
                    self.googleStreetViewBusy(false);
                    self.latLngFailure(true);
                }
            } else {
                var loc = new google.maps.LatLng({ lat: self.latitude(), lng: self.longitude() });

                //console.log('fetchGoogleStreetView did not need geolocation: we had ', loc);

                var svService = new google.maps.StreetViewService();

                var panoRequest = {
                    location: loc,
                    preference: google.maps.StreetViewPreference.NEAREST,
                    radius: 50,
                    source: google.maps.StreetViewSource.OUTDOOR
                };

                self.findPanorama(50, panoRequest);
            }
        } else {
            //console.log('fetchGoogleStreetView aborted: we had a googlePanoLink for leadAddressId: ', self.leadAddressId())
        }
    }

    self.geoCode = function (addressLine) {

    }

    if (self.leadId()) {
        self.fetchGoogleStreetView();
    }

    // Essentially, if we don't have Latitude and Longitude, we want to pass address info to Google
    // until they give us coordinates.

    // Once we have coordinates, we ought to save them immediately to prevent future botheration.

    // Having coordinates, we then want to be calling to get a Google Panorama.

    // Once having a Google Panorama, we ought really to SAVE THE DAMNED THING TO THE ADDRESS RECORD.
    // So as to prevent future botheration.




    self.toJSON = function () {
        var copy = this;

        delete copy.appleMapsButton;
        delete copy.wazeButton;
        delete copy.googleStreetView;
        delete copy.displayLine;
        delete copy.latLngFailure;
        delete copy.fetchGoogleStreetView;

        return copy;
    }

    self.saveLatLng = function () {
        //console.log('saveLatLng called for leadAddressId: ' + self.leadAddressId());
        $.ajax({
            url: '/api/leadsAPI/SaveLeadAddressLatLng',
            type: 'POST',
            dataType: 'json',
            data: {
                leadAddressId: self.leadAddressId(),
                lat: self.latitude(),
                lng: self.longitude()
            }
        });
    }

    self.displayLine = ko.pureComputed({
        read: function () {
            var addressLine = "";
            if (self.line1())
                addressLine += self.line1();
            if (self.line2())
                addressLine += ',' + self.line2();
            if (self.town())
                addressLine += ',' + self.town();
            if (self.county())
                addressLine += ',' + self.county();
            if (self.postcode())
                addressLine += ',' + self.postcode();
            if (self.country().Code)
                addressLine += ',' + self.country().Code;
            return addressLine;
        }
    }, self);
}

$("#lead-stage-two").on('show.bs.collapse', function () {
    viewModel.leadEdit.stage(2);
});

$("#lead-stage-three").on('show.bs.collapse', function () {
    viewModel.leadEdit.stage(3);
});

$("#edit-lead-modal").on('hidden.bs.modal', function () {
    hideAllModals();
    //viewModel.leadEdit.reset();
});

function saveLeadAddressPanoramaLink(leadAddressId, panoLink) {
    $.ajax({
        url: '/api/leadsapi/UpdateLeadAddressPano',
        type: 'POST',
        dataType: 'json',
        data: {
            LeadAddressID: leadAddressId,
            GooglePanoramaLink: panoLink
        },
        success: function (response) {
            //console.log("updated leadaddress pano", response);
        }
    });
}

var miscCustomerSearch = function (parent) {
    var self = this;

    // count & sales last 12 months,
    // count & sales last 48 months

    self.parent = parent;

    self.slicerGroup = new customerSearchSlicerModel(self);

    self.slicerGroup.widget('Zero');

    self.searchBusy = ko.observable(false);

    self.elementToHighlight = ko.observable("#all-misc-panel");

    self.dashboardBusy = ko.observable(false);

    self.dashboardAll = ko.observable(0);
    self.dashboardZero = ko.observable(0);
    self.dashboardOneOff = ko.observable(0);
    self.dashboardConsider = ko.observable(0);

    self.dashboardAllWorth = ko.observable(0);
    self.dashboardZeroWorth = ko.observable(0);
    self.dashboardOneOffWorth = ko.observable(0);
    self.dashboardConsiderWorth = ko.observable(0);

    self.resultGridWidget = ko.observable();

    self.haveSearched = ko.observable(false);

    self.dashboardSelect = ko.computed(function () {
        if (self.resultGridWidget()) {
            self.dashboardBusy(true);

            var values = ko.toJS(self.slicerGroup.values);

            var data = {};

            ko.utils.arrayForEach(values, function (v) {
                data[Object.keys(v)[0]] = v[Object.keys(v)[0]]
            });
            console.log('miscCustomerSearch dashboardSelect called', data);

            $.ajax({
                url: '/api/LeadsAPI/MiscCustomerDashboardSelect',
                type: "POST",
                dataType: "json",
                cache: false,
                data: data,
                success: function (data) {
                    console.log('misc dashboardSelect returned', data);
                    self.dashboardAll(data.All);
                    self.dashboardZero(data.Zero);
                    self.dashboardOneOff(data.OneOff);
                    self.dashboardConsider(data.Consider);

                    self.dashboardAllWorth(data.AllWorth);
                    self.dashboardZeroWorth(data.ZeroWorth);
                    self.dashboardOneOffWorth(data.OneOffWorth);
                    self.dashboardConsiderWorth(data.ConsiderWorth);

                    self.dashboardBusy(false);

                    if (self.resultGridWidget()) {
                        self.resultGridWidget().dataSource.query({
                            page: 1,
                            pageSize: self.resultGridWidget().dataSource.pageSize()
                        });
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    self.dashboardBusy(false);
                }
            });
        }
    }, self).extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 100
        }
    });

    self.dashboardOverrideAll = function () {
        self.slicerGroup.widget('All');
        $('#misc-dashboard-collapse .dash-panel').removeClass('panel-primary');
        $('#all-misc-panel').addClass('panel-primary');
    }

    self.dashboardOverrideZero = function () {
        self.slicerGroup.widget('Zero');
        $('#misc-dashboard-collapse .dash-panel').removeClass('panel-primary');
        $('#zero-order-panel').addClass('panel-primary');
    }

    self.dashboardOverrideOneOff = function () {
        self.slicerGroup.widget('OneOff');
        $('#misc-dashboard-collapse .dash-panel').removeClass('panel-primary');
        $('#one-off-panel').addClass('panel-primary');
    }

    self.dashboardOverrideConsider = function () {
        self.slicerGroup.widget('Consider');
        $('#misc-dashboard-collapse .dash-panel').removeClass('panel-primary');
        $('#consider-panel').addClass('panel-primary');
    }

    self.clearAdvancedSearch = function () {
        self.searchTerm(undefined);
        self.assignedTo(undefined);
        self.assignedToMemberSearch().searchTerm(undefined);
        self.createdBy(undefined);
        self.createdByMemberSearch().searchTerm(undefined);
    }

    self.resultGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var values = ko.toJS(self.slicerGroup.values);

        var data = {};

        ko.utils.arrayForEach(values, function (v) {
            data[Object.keys(v)[0]] = v[Object.keys(v)[0]]
        });

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        console.log('miscCustomerSearch calling with', data);

        $.ajax({
            url: '/api/leadsAPI/MiscCustomerSearch',
            type: "GET",
            data: data,
            success: function (data) {
                console.log('miscCustomerSearch returned', data);

                options.success(data);
            },
            error: function (data) {
                options.error();
            }
        });
    };

    self.resultGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.resultGridDataSourceRead
        },
        pageSize: 10,
        serverPaging: false,
        serverSorting: false,
        serverFiltering: false,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                fields: {
                    Market: { type: 'string' },
                    Company: { type: 'string' },
                    Name: { type: 'string' },
                    Potential: { type: 'number' },
                    OpenedSince: { type: 'string' },
                    Status: { type: 'string' },
                    SourcedBy: { type: 'string' },
                    AssignedTo: { type: 'string' },
                    LeadID: { type: 'number' },
                    Tags: { type: 'object' }
                }
            }
        }),
        requestStart: function (e) {
            $("#misc-grid-loading").show();
        },
        requestEnd: function (e) {
            $("#misc-grid-loading").hide();
        }
    });

    self.resultGridSettings = {
        autoBind: false,
        widget: self.resultGridWidget,
        useKOTemplates: true,
        rowTemplate: 'misc-row-template',
        columns: [{
            field: 'Code',
            title: 'Code',
            width: 120
        }, {
            field: 'Name',
            title: 'Name',
            width: 120
        }, {
            field: 'DeliveryAddress',
            title: 'Delivery Address',
            width: 200
        }, {
            field: 'SalesLast12Months',
            title: 'Sales Last 12 Months'
        }, {
            field: 'OrderCountLast12Months',
            title: 'Order Count Last 12 Months'
        }, {
            field: 'SalesLast48Months',
            title: 'Sales Last 48 Months'
        }, {
            field: 'SalesLast48Months',
            title: 'Order Count Last 48 Months'
        }],
        data: self.resultGridDataSource,
        //height: 685,
        sortable: true,
        filterable: false,
        reorderable: true,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 200]
        },
        dataBound: function (e) {
            //console.log('leadSearch resultGridSettings.dataBound hit');
        },
        filterMenuInit: function (e) {
            if (e.field == "Status") {
                e.container.find(".k-filter-help-text").hide();
                var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");
                setTimeout(function () {
                    firstValueDropDown.wrapper.hide();
                });
            }
        },
        selectable: false,// "single, row",
        change: function (e) {

        }
    };

    self.viewMap = function (item) {
        self.viewingMapFor(item);
        $('#misc-map-modal').modal('show');
    }

    self.viewingMapFor = ko.observable();

    self.viewingMapFor.subscribe(function (newValue) {
        if (newValue) {
            if (miscMap) {
                if (typeof miscMapMarker === 'object') {
                    miscMapMarker.setMap(null);
                    delete miscMapMarker;
                }
                var position = {
                    lat: newValue.VisitAddress.Latitude,
                    lng: newValue.VisitAddress.Longitude
                }
                miscMap.setCenter(position);
                window.miscMapMarker = new google.maps.Marker({
                    position: position,
                    map: miscMap
                });
            }
        }
    });
}

$('a[href="my-misc-customers"]').on('show.bs.tab', function () {
    viewModel.miscSearch.dashboardSelect();
});

var customerSearch = function (parent) {
    var self = this;

    self.parent = parent;

    self.slicerGroup = new customerSearchSlicerModel(self);

    self.searchBusy = ko.observable(false);

    self.elementToHighlight = ko.observable('#active-customers-panel');

    self.dashboardBusy = ko.observable(false);

    self.selectedCustomerKeys = ko.observableArray([]);

    self.selectedCustomerKeys.subscribe(function (newValues) {
        console.log('selectedCustomerKeys subscribe hit', newValues);
    });

    self.customerGridBusy = ko.observable(false);

    self.dashboardAll = ko.observable(0);
    self.dashboardNew = ko.observable(0);
    self.dashboardTop = ko.observable(0);
    self.dashboardActive = ko.observable(0);
    self.dashboardLapsing = ko.observable(0);
    self.dashboardLapsed = ko.observable(0);
    self.dashboardStop = ko.observable(0);
    self.dashboardSpecifiers = ko.observable(0);

    self.dashboardAllWorth = ko.observable(0);
    self.dashboardNewWorth = ko.observable(0);
    self.dashboardTopWorth = ko.observable(0);
    self.dashboardActiveWorth = ko.observable(0);
    self.dashboardLapsingWorth = ko.observable(0);
    self.dashboardLapsedWorth = ko.observable(0);
    self.dashboardStopWorth = ko.observable(0);
    self.dashboardSpecifiersWorth = ko.observable(0);

    self.resultGridWidget = ko.observable();

    self.haveSearched = ko.observable(false);

    self.dashboardSelect = ko.computed(function () {
        if (self.resultGridWidget()) {
            self.dashboardBusy(true);

            var values = ko.toJS(self.slicerGroup.values);

            var data = {};

            ko.utils.arrayForEach(values, function (v) {
                data[Object.keys(v)[0]] = v[Object.keys(v)[0]]
            });

            console.log('customerSearch dashboardSelect called', data);

            $.ajax({
                url: '/api/LeadsAPI/CustomerDashboardSelect',
                type: "POST",
                dataType: "json",
                cache: false,
                data: data,
                success: function (data) {
                    console.log('customerSearch dashboardSelect returned', data);
                    self.dashboardAll(data.All);
                    self.dashboardNew(data.New);
                    self.dashboardTop(data.Top);
                    self.dashboardActive(data.Active);
                    self.dashboardLapsing(data.Lapsing);
                    self.dashboardLapsed(data.Lapsed);
                    self.dashboardStop(data.Stop);
                    self.dashboardSpecifiers(data.Specifier);

                    self.dashboardAllWorth(data.AllWorth);
                    self.dashboardNewWorth(data.NewWorth);
                    self.dashboardTopWorth(data.TopWorth);
                    self.dashboardActiveWorth(data.ActiveWorth);
                    self.dashboardLapsingWorth(data.LapsingWorth);
                    self.dashboardLapsedWorth(data.LapsedWorth);
                    self.dashboardStopWorth(data.StopWorth);
                    self.dashboardSpecifiersWorth(data.SpecifierWorth);

                    self.dashboardBusy(false);

                    if (self.resultGridWidget()) {
                        self.resultGridWidget().dataSource.query({
                            page: 1,
                            pageSize: self.resultGridWidget().dataSource.pageSize()
                        });
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    self.dashboardBusy(false);
                }
            });
        }
    }, self).extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 100
        }
    });

    self.dashboardOverrideAll = function () {
        self.slicerGroup.widget('All');
        $('#customer-dashboard-collapse .dash-panel').removeClass('panel-primary');
        $("#all-customers-panel").addClass('panel-primary');
    }

    self.dashboardOverrideNew = function () {
        self.slicerGroup.widget('New');
        $('#customer-dashboard-collapse .dash-panel').removeClass('panel-primary');
        $("#new-customers-panel").addClass('panel-primary');
    }

    self.dashboardOverrideTop = function () {
        self.slicerGroup.widget('Top');
        $('#customer-dashboard-collapse .dash-panel').removeClass('panel-primary');
        $("#top-customers-panel").addClass('panel-primary');
    }

    self.dashboardOverrideActive = function () {
        self.slicerGroup.widget('Active');
        $('#customer-dashboard-collapse .dash-panel').removeClass('panel-primary');
        $("#active-customers-panel").addClass('panel-primary');
    }

    self.dashboardOverrideSpecifiers = function () {
        self.slicerGroup.widget('Specifier');
        $('#customer-dashboard-collapse .dash-panel').removeClass('panel-primary');
        $("#specifiers-panel").addClass('panel-primary');
    }

    self.dashboardOverrideLapsing = function () {
        self.slicerGroup.widget('Lapsing');
        $('#customer-dashboard-collapse .dash-panel').removeClass('panel-primary');
        $("#lapsing-customers-panel").addClass('panel-primary');
    }

    self.dashboardOverrideLapsed = function () {
        self.slicerGroup.widget('Lapsed');
        $('#customer-dashboard-collapse .dash-panel').removeClass('panel-primary');
        $("#lapsed-customers-panel").addClass('panel-primary');
    }

    self.dashboardOverrideStop = function () {
        self.slicerGroup.widget('Stop');
        $('#customer-dashboard-collapse .dash-panel').removeClass('panel-primary');
        $("#stop-customers-panel").addClass('panel-primary');
    }

    self.resultGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var values = ko.toJS(self.slicerGroup.values);

        var data = {};

        ko.utils.arrayForEach(values, function (v) {
            data[Object.keys(v)[0]] = v[Object.keys(v)[0]]
        });

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        console.log('customerSearch calling with', data);

        $.ajax({
            url: '/api/leadsAPI/CustomerSearch',
            type: "POST",
            data: data,
            success: function (data) {
                console.log('customerSearch resultGridDataSourceRead returned', data);
                options.success(data);
            },
            error: function (data) {
                options.error();
            }
        });
    };

    self.resultGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.resultGridDataSourceRead
        },
        page: 1,
        pageSize: 10,
        serverPaging: true,
        serverSorting: false,
        serverFiltering: false,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Customers",
            total: "TotalResultsCount",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'TradeAccountID',
                fields: {
                    TradeAccountID: { type: 'number' },
                    Market: { type: 'string' },
                    Company: { type: 'string' },
                    Name: { type: 'string' },
                    Potential: { type: 'number' },
                    OpenedSince: { type: 'string' },
                    Status: { type: 'string' },
                    SourcedBy: { type: 'string' },
                    AssignedTo: { type: 'string' },
                    LeadID: { type: 'number' }
                }
            }
        }),
        requestStart: function (e) {
            self.customerGridBusy(true);
        },
        requestEnd: function (e) {
            self.customerGridBusy(false);
        }
    });

    //self.toggleAllRows = function (event) {
    //    var isChecked = event.currentTarget.checked;
    //    var rows = [];
    //    $('.row-checkbox').each(function (index, item) {
    //        if (isChecked) {
    //            if (!$(item)[0].checked) {
    //                $(item).click();
    //                rows.push($(item).closest('tr')[0]);
    //            }
    //        } else {
    //            if ($(item)[0].checked) {
    //                $(item).click();
    //                rows.push($(item).closest('tr')[0]);
    //            }
    //        }
    //    });
    //    if (isChecked) {
    //        if (self.resultGridWidget().select().length) {
    //            rows = rows.concat(self.resultGridWidget().select());
    //        }
    //        self.resultGridWidget().select(rows);
    //    } else {
    //        if (self.resultGridWidget().select().length) {
    //            let selection = self.resultGridWidget().select();

    //            ko.utils.arrayForEach(rows, function (removal) {
    //                var extant = ko.utils.arrayFirst(selection, function (s) {
    //                    return s.dataset.tradeAccountCode == removal.dataset.tradeAccountCode;
    //                });
    //                if (extant != null) {
    //                    ko.utils.arrayRemoveItem(selection, extant);
    //                }
    //            });
    //        }
    //    }
    //}

    self.loadCustomerForView = function (c) {
        self.parent.customerView.loadView(c);
    }

    self.resultGridSettings = {
        autoBind: false,
        widget: self.resultGridWidget,
        columns: [{
            //headerTemplate: "<label><input id='checkAll' class='header-checkbox' data-bind='click: function (data, event) { toggleAllRows(event); return true; }'  type='checkbox' /></label>",
            selectable: true,
            field: 'Select',
            attributes: {
                class: 'check-column'
            },
            width: "50px"
        }, {
            field: 'Button',
            width: 100,
            attributes: {
                class: 'view-button'
            },
            title: ' ',
            template: '<button type="button" class="btn btn-flat" data-bind="click: function (data, event) { $parent.loadCustomerForView(data); }">View <span class="material-icons">search</span></button>'
        }, {
            field: 'Code',
            title: 'Code',
            width: 100
        }, {
            field: 'Name',
            title: 'Name',
            width: 100
        }, {
            field: 'Contact',
            title: 'Contact',
            width: 100
        }, {
            field: 'Phone',
            title: 'Phone',
            width: 100,
            template: function (e) {
                if (e.Phone) {
                    `<a data-bind="attr: { href: 'tel:#: Phone #' }, text: '#: Phone #'"></a>`
                } else {
                    return ``;
                }
            }
        }, {
            field: 'Email',
            title: 'Email',
            width: 140,
            template: `<a data-bind="attr: { href: 'mailto:#: Email #' }, text: '#: Email #'"></a>`
        }, {
            field: 'tags',
            title: 'Tags',
            width: 240,
            template: function (rec) {
                var results = '';
                rec.tags.forEach(function (t) {
                    results += '<span class="label label-primary tag">' + t.Name + '</span>';
                });
                return results;
            }
        }, {
            field: 'Website',
            title: 'Website',
            width: 100
        }, {
            field: 'Market',
            title: 'Market',
            width: 120
        }, {
            field: 'Area',
            title: 'Area',
            width: 120
        }, {
            field: 'Rep',
            title: 'Rep',
            width: 120
        }, {
            field: 'Agent',
            title: 'Agent',
            width: 120
        }, {
            field: 'Type',
            title: 'Type',
            width: 120
        }, {
            field: 'Pricelist',
            title: 'Pricelist',
            width: 120
        }, {
            field: 'CreditTerms',
            title: 'Credit Terms',
            width: 120
        }],
        //useKOTemplates: true,
        //rowTemplate: 'customer-row-template',
        data: self.resultGridDataSource,
        sortable: false,
        filterable: false,
        reorderable: false,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 200]
        },
        dataBound: function (e) {

            var pristine = e.sender.dataSource.data().toJSON();

            ko.cleanNode($("#customer-grid .k-grid-header tr")[0]);

            ko.applyBindings(self, $("#customer-grid .k-grid-header tr")[0]);

            ko.utils.arrayForEach(e.sender.dataSource.data(), function (item, index) {
                if ($('tr[data-uid="' + item.uid + '"]').length) {
                    pristine[index].$parent = self;
                    ko.cleanNode($('tr[data-uid="' + item.uid + '"]')[0]);
                    ko.applyBindings(pristine[index], $('tr[data-uid="' + item.uid + '"]')[0]);
                }
            });

        },
        filterMenuInit: function (e) {
            //console.log(e);
            if (e.field == "Status") {
                e.container.find(".k-filter-help-text").hide();
                var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");
                setTimeout(function () {
                    firstValueDropDown.wrapper.hide();
                });
            }
        },
        //selectable: "multiple, row",
        persistSelection: true,
        //change: function (e) {
        //    if (self.resultGridWidget().select()) {
        //        var selectedItem = self.resultGridWidget().dataItem(self.resultGridWidget().select());
        //        if (selectedItem != null) {
        //            self.parent.customerView.loadView(selectedItem);
        //        }
        //    }
        //    self.selectedCustomerKeys(e.sender.selectedKeyNames());
        //}
    };


    self.fetchContactSpreadsheet = function () {

        if (self.resultGridWidget() && self.resultGridWidget().selectedKeyNames().length) {

            self.customerGridBusy(true);

            let fileName = 'customer-contact-info'

            fetch('/api/leadsAPI/CustomerContactSpreadsheet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tradeAccountIds: self.resultGridWidget().selectedKeyNames()
                }),
                responseType: 'arraybuffer'
            }).then((res) => {
                if (!res.ok) {
                    const responseStatusText = res.statusText
                    const errorMessage = `${responseStatusText}`
                    throw new Error(errorMessage);
                }
                self.customerGridBusy(false);
                return res.arrayBuffer();
            }).then((ab) => {
                // BE endpoint sends a readable stream of bytes
                const byteArray = new Uint8Array(ab);
                const a = window.document.createElement('a');
                a.href = window.URL.createObjectURL(
                    new Blob([byteArray], {
                        type:
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    }),
                );
                a.download = `${fileName}.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                self.customerGridBusy(false);
            }).catch(error => {
                self.customerGridBusy(false);
                $.info('Sorry', 'An error occurred. Please contact <a href="mailto:itsupport@designersguild.com">itsupport@designersguild.com</a>')
                throw new Error('Error occurred:' + error);
            });
        }
    }

    self.viewMap = function (item) {
        self.viewingMapFor(item);
        $('#misc-map-modal').modal('show');
    }

    self.viewingMapFor = ko.observable();

    self.viewingMapFor.subscribe(function (newValue) {
        if (newValue) {
            if (miscMap) {
                if (typeof miscMapMarker === 'object') {
                    miscMapMarker.setMap(null);
                    delete miscMapMarker;
                }
                var position = {
                    lat: newValue.VisitAddress.Latitude,
                    lng: newValue.VisitAddress.Longitude
                }
                miscMap.setCenter(position);
                window.miscMapMarker = new google.maps.Marker({
                    position: position,
                    map: miscMap
                });
            }
        }
    });
}

var customerSearchSlicerModel = function (parent) {
    var self = this;

    self.parent = parent;

    self.skipFirst = false;

    self.marketSlicer = ko.observable();
    self.areaSlicer = ko.observable();
    self.accountTypeSlicer = ko.observable();
    self.accountGroupSlicer = ko.observable();
    self.repSlicer = ko.observable();
    self.repOrAgentSlicer = ko.observable();
    self.taggingSlicer = ko.observable();

    var preselectedRep = getPreselectedSalesRep();

    self.searchTerm = ko.observable();

    self.widget = ko.observable('Active');

    // Sweden hardcoding: marketId set to 18 permanently, control readonly.
    // marketSlicer clearValue is 18.

    /*
        Louise - Everyone
    
        Stina - Her own and Frida's.
    
        Martina - Her own.
    
        Frida - Her own.
    */

    // 04/12/2019 - undone for Sarah's testing only
    var salesAreaStina = 365;
    var salesAreaMartina = 126;

    var userId = getUserId();

    var marketReadonly = true;
    var marketId = 18;
    var areaId = null;
    var accountTypeId = null;
    var accountGroupId = null;
    var repId = null;
    var repOrAgent = null;

    var repLocked = false;
    var areaLocked = false;

    if ([28871].indexOf(userId) > -1) {
        areaId = null;
        areaLocked = false;
        repLocked = false;
        marketId = 18;
    }

    // Lena Eriksson and Eva Ehlin (1583444) - 19/06/2024.
    if ([1583702, 1583444].indexOf(userId) > -1) {
        areaId = salesAreaStina;
        areaLocked = true;
    }

    // Lena Eriksson (1583702) 19/06/2024 should be able to view both Stina and Martina's customers. Market locked, not rep locked.
    if ([1583702].indexOf(userId) > -1) {
        areaId = null;
        areaLocked = false;
        marketId = 18;
    }

    // Frida (566864)
    if ([566864].indexOf(userId) > -1) {
        areaId = salesAreaStina;
        areaLocked = true;
        repId = 149;
        repLocked = true;
    }

    // Martina (236869)
    if ([236869].indexOf(userId) > -1) {
        areaId = salesAreaMartina;
        areaLocked = true;
        repId = 42;
        repLocked = true;
    }

    // Me (8), Ida (43438), Lisa Antilla (1395354)
    if ([8, 43438, 1395354].indexOf(userId) > -1) {
        areaId = null;
        areaLocked = false;
        repLocked = false;
        marketId = null;
        marketReadonly = false;
    }

    // Louise!
    // (Louise can see EVERYYYYTHIIIINNNNG)

    //if (preselectedRep != null) {
    //    repId = preselectedRep.SalesRepresentativeID;
    //    marketId = preselectedRep.SalesMarketID;
    //}

    self.preselectedRep = preselectedRep;

    self.selectedCurrency = ko.observable();
    self.selectedCurrencyId = ko.observable();
    self.currencyDisplay = ko.observable(false);

    self.currencyDisplay.subscribe(function (newValue) {
        window.setTimeout(function () {
            self.clearSlicers();
            self.marketSlicer().dataSource.read();
            switch (newValue) {
                case true:
                    //self.parent.hideGBPColumns();
                    //self.parent.showCurrencyColumns();
                    break;
                case false:
                    self.selectedCurrency(undefined);
                    self.selectedCurrencyId(undefined);
                    //self.parent.hideCurrencyColumns();
                    //self.parent.showGBPColumns();
                    break;
                default: break;
            }
        }, 400);
    });

    self.marketId = ko.observable(marketId);
    self.salesMarket = ko.observable();

    self.areaId = ko.observable(areaId);
    self.salesArea = ko.observable();

    self.accountTypeId = ko.observable(accountTypeId);
    self.accountType = ko.observable();

    self.accountGroupId = ko.observable(accountGroupId);
    self.accountGroup = ko.observable();

    self.repId = ko.observable(repId);
    self.rep = ko.observable();

    self.repOrAgentId = ko.observable(repOrAgent);
    self.repOrAgent = ko.observable();

    self.tags = ko.observableArray([]);
    self.tagIds = ko.observableArray([]);

    self.searchTerm = ko.observable().extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 300
        }
    });

    self.values = [{
        salesMarketId: self.marketId
    }, {
        salesAreaId: self.areaId
    }, {
        tradeAccountTypeId: self.accountTypeId,
    }, {
        tradeAccountGroupId: self.accountGroupId,
    }, {
        salesRepresentativeId: self.repId,
    }, {
        salesRepOrAgent: self.repOrAgentId,
    }, {
        searchTerm: self.searchTerm
    }, {
        tags: self.tags
    }, {
        widget: self.widget
    }];

    self.marketParams = kendoMDCDropDownList({
        label: 'Sales Market',
        endPoint: '/api/leadsapi/SalesMarketSlicerEndpoint',
        textField: 'Name',
        valueField: 'SalesMarketID',
        idObservable: self.marketId,
        objObservable: self.salesMarket,
        height: 300,
        showClear: !marketReadonly,
        additionalParams: {
            salesAreaId: self.areaId,
            currencyDisplay: self.currencyDisplay
        }
    });

    self.areaParams = kendoMDCDropDownList({
        label: 'Sales Area',
        endPoint: '/api/leadsapi/SalesAreaSlicerEndpoint',
        textField: 'Name',
        valueField: 'SalesAreaID',
        idObservable: self.areaId,
        objObservable: self.salesArea,
        showClear: !areaLocked,
        readOnly: areaLocked,
        disabled: areaLocked,
        height: 300,
        additionalParams: {
            salesMarketId: self.marketId
        }
    });

    self.accountTypeParams = kendoMDCDropDownList({
        label: 'Account Type',
        endPoint: '/api/leadsapi/TradeAccountTypeSlicerEndpoint',
        textField: 'Name',
        valueField: 'TradeAccountTypeID',
        idObservable: self.accountTypeId,
        objObservable: self.accountType,
        height: 300,
        additionalParams: {}
    });

    self.accountGroupParams = kendoMDCDropDownList({
        label: 'Account Group',
        endPoint: '/api/leadsapi/TradeAccountGroupSlicerEndpoint',
        textField: 'Name',
        valueField: 'TradeAccountGroupID',
        idObservable: self.accountGroupId,
        objObservable: self.accountGroup,
        height: 300,
        additionalParams: {}
    });

    self.repParams = kendoMDCDropDownList({
        label: 'Sales Person',
        endPoint: '/api/leadsapi/SalesRepresentativeSlicerEndpoint',
        textField: 'Name',
        valueField: 'SalesRepresentativeID',
        showClear: !repLocked,
        readOnly: repLocked,
        disabled: repLocked,
        idObservable: self.repId,
        objObservable: self.rep,
        additionalParams: {
            salesMarketId: self.marketId,
            salesAreaId: self.areaId
        },
        height: 340,
        virtual: true,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: '/api/leadsapi/SalesRepresentativeValueMapper',
                    type: 'POST',
                    data: {
                        salesRepresentativeId: options.value
                    },
                    success: function (data) {
                        if (typeof options.success === 'function') {
                            options.success(data[0]);
                        }
                    }
                });
            }
        }
    });

    self.repOrAgentParams = kendoMDCDropDownList({
        label: 'Rep or Agent',
        endPoint: '/api/leadsapi/SalesRepOrAgentSlicerEndpoint',
        textField: 'Name',
        valueField: 'SalesRepOrAgent',
        idObservable: self.repOrAgentId,
        objObservable: self.repOrAgent,
        additionalParams: {}
    });

    self.searchParams = {
        label: 'Search by Customer Name, Account Number, Town or Postcode',
        observable: self.searchTerm,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.searchTerm(undefined);
            self.parent.resultGridWidget.valueHasMutated();
        },
        enterKey: function () {
            self.parent.resultGridWidget.valueHasMutated();
        }
    };

    self.tagParams = {
        observable: self.tags,
        validate: self.tagIds,
        showClear: true,
        width: 'auto',
        label: 'Tags',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        multiSelectSettings: {
            value: self.tags,
            dataItems: self.tagIds,
            dataValueField: 'TagID',
            dataTextField: 'Name',
            height: 300,
            widget: ko.observable(),
            //open: function (e) {
            //    var self = this;
            //    $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            //},
            //close: function (e) {
            //    $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            //},
            data: new kendo.data.DataSource({
                transport: {
                    read: function (options) {

                        var webapi = new kendo.data.transports.webapi({ prefix: "" });
                        var params = webapi.parameterMap(options.data);

                        var data = {};

                        for (var propertyName in params) {
                            data[propertyName] = params[propertyName];
                        }

                        $.ajax({
                            url: '/api/leadsapi/TagSlicerEndpoint',
                            type: 'POST',
                            dataType: 'json',
                            data: data,
                            success: function (data) {
                                console.log('tagSlicerEndpoint returned', data);
                                options.success(data);
                            },
                            error: function (data) {
                                console.log(data);
                                options.error();
                            }
                        });
                    }
                },
                pageSize: 50,
                serverAggregates: true,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: false,
                sort: [{
                    field: 'Name',
                    dir: 'desc'
                }],
                schema: $.extend({}, kendo.data.schemas.webapi, {
                    data: "Data",
                    total: "Total",
                    errors: "Errors",
                    model: {
                        id: 'TagID',
                        fields: {
                            TagID: { type: 'Number' },
                            Name: { type: 'String' }
                        }
                    }
                })
            }),
            valuePrimitive: true,
            autoWidth: false,
            autoBind: true,
            autoClose: false,
            optionLabel: ' ',
            filter: 'startswith'
        },
        clearFunction: function () {
            var self = this
            self.multiSelectSettings.value([]);
            self.multiSelectSettings.widget().value([]);
            self.multiSelectSettings.widget().trigger('change');
        }
    };

    self.clearSlicers = function () {

    }
}

var customerView = function () {
    var self = this;

    self.busy = ko.observable(false);

    self.availableTitles = getAvailableTitles();

    self.availableTradeAccountContactTypes = getAvailableTradeAccountContactTypes();

    self.availableLeadContactTypes = getAvailableLeadContactTypes();

    self.tradeAccount = ko.observable();

    self.careRecords = ko.observableArray([]);

    self.orderLineStatusGroups = ko.observableArray([]);

    self.recentPatternBooks = ko.observableArray([]);

    self.recentLaunchId = ko.observable();

    self.patternBooksHeld = ko.observableArray([]);
    self.patternBooksNotHeld = ko.observableArray([]);

    self.newNote = ko.observable();
    self.notes = ko.observableArray([]);
    self.allNotesExpanded = ko.observable(false);

    self.summary = ko.observable();

    self.setNewCustomAsDefaultDelivery = ko.observable(false);

    self.validateNow = ko.observable(false);

    self.customAddress = new addressViewModel({
        labelClass: 'delivery-address-label',
        controlClass: 'form-control mdc-text-field__input',
        defaultCountry: undefined,
        validateNow: self.validateNow,
        labelValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please provide a Label'
            }
        },
        nameValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please provide a Name'
            }
        },
        addressLine1Validation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please provide Address Line 1'
            }
        },
        townValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please provide a Town'
            }
        },
        postcodeValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please provide a Postcode'
            }
        },
        countryValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please select a Country'
            }
        },
        phoneIntlMobile: true
    });

    self.addCustomAddress = function () {
        self.validateNow(true);
        self.errors.showAllMessages(false);
        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.customAddress.notifySubscribers();
            return;
        } else {

            var data = $.extend(self.customAddress.toJS(), {
                setAsDefaultDelivery: self.setNewCustomAsDefaultDelivery(),
                tradeAccountId: self.tradeAccount().TradeAccountID
            });

            console.log('customerView addCustomAddress called', data);

            $.ajax({
                url: '/api/leadsapi/AddTradeAccountAddress',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    self.setNewCustomAsDefaultDelivery(false);
                    self.customAddress.reset();
                    self.customAddress.hide();
                    self.loadView(self.tradeAccount());
                },
                error: function (xhr, s, a) {
                    $.showError(xhr, s, a);
                }
            });
        }
    }

    self.editCustomAddress = function (address, deletable) {
        if (typeof deletable == 'undefined') {
            deletable = true;
        }
        self.customAddress.loadTradeAccountAddress(address, deletable);
    }

    self.setDefaultDeliveryAddress = function (address) {
        var data = {
            tradeAccountId: self.tradeAccount().TradeAccountID,
            tradeAccountAddressId: address.TradeAccountAddressID
        };

        $.ajax({
            url: '/api/leadsapi/setDefaultDeliveryAddress',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function () {
                self.loadView(self.tradeAccount());
            },
            error: function (xhr, s, a) {
                $.showError(xhr, s, a);
            }
        });
    }

    self.setDefaultVisitAddress = function (address) {
        var data = {
            tradeAccountId: self.tradeAccount().TradeAccountID,
            tradeAccountAddressId: address.TradeAccountAddressID
        };

        $.ajax({
            url: '/api/leadsapi/setDefaultVisitAddress',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function () {
                self.loadView(self.tradeAccount());
            },
            error: function (xhr, s, a) {
                $.showError(xhr, s, a);
            }
        });
    }

    self.saveCustomAddress = function () {
        self.validateNow(true);
        self.errors.showAllMessages(false);
        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.customAddress.notifySubscribers();
            return;
        } else {

            var data = $.extend(self.customAddress.toJS(), {
                setAsDefaultDelivery: self.setNewCustomAsDefaultDelivery(),
                tradeAccountId: self.tradeAccount().TradeAccountID
            });

            console.log('customerView saveCustomAddress called', data);

            $.ajax({
                url: '/api/leadsapi/UpdateTradeAccountAddress',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    self.setNewCustomAsDefaultDelivery(false);
                    self.customAddress.reset();
                    self.customAddress.hide();
                    self.loadView(self.tradeAccount());

                },
                error: function (xhr, s, a) {
                    $.showError(xhr, s, a);
                }
            });
        }
    }

    self.deleteCustomAddress = function (address) {
        if (address.deletable()) {
            var data = {
                tradeAccountAddressId: address.TradeAccountAddressID
            }
            $.confirm('Are you sure?', 'This address will be marked as deleted.', function () {
                $.ajax({
                    url: '/api/leadsapi/DeleteTradeAccountAddress',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        //self.setNewCustomAsDefaultDelivery(false);
                        ////self.customAddress.reset();
                        self.loadView(self.tradeAccount());
                    },
                    error: function (xhr, s, a) {
                        $.showError(xhr, s, a);
                    }
                });
            }, function () {

            })
        } else {
            $.info('You cannot delete this address', 'You cannot delete the default delivery or default visit addresses. You must select a new default before deleting this address.');
        }
    }

    self.errors = ko.validation.group([
        self.customAddress
    ], {
        deep: true
    });

    self.allNotesExpanded.subscribe(function (newValue) {
        if (newValue) {
            $('.notes-container .note .collapse').collapse('show');
        } else {
            $('.notes-container .note .collapse').collapse('hide');
        }
    });

    self.editingNoteId = ko.observable();

    self.priceChecker = ko.observable();

    //self.tradeAccountContacts = ko.pureComputed({
    //    read: function () {
    //        return Enumerable.From(self.tradeAccountContactsOrderingConfirmations())
    //                         .Concat(self.tradeAccountContactsMarketing())
    //                         .Concat(self.tradeAccountContactsFinancial())
    //        .Concat(self.tradeACcountContactsPricelists())
    //        .Concat(self.tradeAccount)
    //    }
    //}, self);

    self.tradeAccountContactsOrderConfirmations = ko.observableArray([]);
    self.tradeAccountContactsMarketing = ko.observableArray([]);
    self.tradeAccountContactsFinancial = ko.observableArray([]);
    self.tradeAccountContactsPricelists = ko.observableArray([]);
    self.tradeAccountContactsOther = ko.observableArray([]);

    self.contactFactory = new oldTradeAccountContactViewModel({
        tradeAccount: self.tradeAccount,
        parent: self
    });

    self.selectedTradeAccountContacts = ko.observableArray([]);

    self.addNewTradeAccountContact = () => {
        console.log('not yet implemented');
    }

    self.removeTradeAccountContact = () => {
        console.log('not yet implemented');
    }

    //self.contactsiFrameSrc = ko.computed(() => {
    //    if (self.tradeAccount()) {
    //        return `/trade-accounts/contacts/partial?tradeAccountCode=${self.tradeAccount().Code}`; 
    //    }
    //});

    self.addNewContact = function () {
        self.contactFactory.reset();
        $('#trade-account-contact-modal').modal('show');
    }

    self.loadContactForEdit = function (contact) {
        self.contactFactory.load(contact);
    }

    // should only be instantiated when we have a trade account

    self.visitBooker = new visitBooker(self.tradeAccount, self, function () {
        self.loadView(self.tradeAccount());
    });

    window.visitBooker = self.visitBooker;

    self.visitGridWidget = ko.observable();

    self.visitGridSettings = {
        autoBind: true,
        widget: self.visitGridWidget,
        data: new kendo.data.DataSource({
            pageSize: 20
        }),
        columns: [{
            field: 'VisitID',
            title: 'Visit ID',
            width: 60,
            hidden: true
        }, {
            field: 'VisitDT',
            title: 'Visit Date',
            width: 150
        }, {
            field: 'Notes',
            title: 'Notes',
            width: 200,
        }, {
            field: 'Attendees',
            title: 'Attendees',
            width: 300
        }],
        useKOTemplates: true,
        rowTemplate: 'visit-row-template',
        sortable: true,
        filterable: false,
        reorderable: true,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        },
        dataBound: function (e) {

        },
        selectable: "single, row",
        change: function (e) {
            if (e.sender.select()) {
                var selectedItem = e.sender.dataItem(e.sender.select());
                console.log('loadVisitForEdit', selectedItem);
                if (selectedItem != null) {
                    self.visitBooker.loadVisitForEdit(selectedItem);
                }
            }
        }
    };

    self.outstandingOrderGridWidget = ko.observable();

    self.outstandingOrderGridSettings = {
        autoBind: true,
        widget: self.outstandingOrderGridWidget,
        data: new kendo.data.DataSource({
            pageSize: 10
        }),
        columns: [{
            field: 'OrderNumber',
            title: 'Order Number',
            width: 100
        }, {
            field: 'OrderDate',
            title: 'Order Date',
            width: 100,
            template: function (r) {
                return moment(r).format('DD/MM/YYYY')
            }
        }, {
            field: 'ProductName',
            title: 'Name',
            width: 360,
            template: '#: Code # - #: ProductName #'
        }, {
            field: 'Quantity',
            title: 'Quantity',
            width: 70,
            headerAttributes: {
                "style": "text-align: right"
            },
            attributes: {
                "class": "text-right"
            }
        }, {
            field: 'LineValueCurr',
            title: 'Value',
            width: 65,
            headerAttributes: {
                "style": "text-align: right"
            },
            attributes: {
                "class": "text-right"
            }
        }, {
            field: 'StatusExtra',
            title: 'Status',
            width: 150,
            template: function (r) {
                if (r.ExtraDate) {
                    return r.LineStatus + '<br/>' + moment(r.ExtraDate).format("DD/MM/YYYY")
                } else {
                    return r.LineStatus;
                }
            }
        }],
        //useKOTemplates: true,
        //rowTemplate: 'outstanding-order-row-template',
        sortable: true,
        filterable: false,
        reorderable: true,
        scrollable: true,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 200]
        },
        dataBound: function (e) {
            if (self.currentOrderLineStatusGroup() == 5)
                $('#outstanding-orders-grid th.k-header[data-field="StatusExtra"] .k-link').html('Status & Est. Desp. Date');
            else
                $('#outstanding-orders-grid th.k-header[data-field="StatusExtra"] .k-link').html('Status');
        },
        selectable: "single, row",
        change: function (e) {
            if (e.sender.select()) {
                var selectedItem = e.sender.dataItem(e.sender.select());
                console.log('outstandingOrderRowSelected', selectedItem);
            }
        }
    };

    self.currentCareStatusGroup = ko.observable(1);

    self.patternBookSearchTerm = ko.observable();

    // null = All, 0 = Not Held, 1 = Held 
    self.patternBookHeldState = ko.observable(0);

    // null = Both, 14=F, 62=W
    self.patternBookProductFilter = ko.observable(null);

    // null = All, 0 = Out of Stock, 1 = In Stock
    self.patternBookStock = ko.observable(null);

    // null = null, 1 = CL, 2 = DG, 6 = RC, 8 = WY, 9 = RL, 14 = JD
    self.patternBookBrand = ko.observable(null);

    self.patternBookResult = ko.observable();

    self.bestPatternBooksGrouped = ko.computed(function () {
        if (self.patternBookResult()) {
            return Enumerable.From(self.patternBookResult().bestPatternBooks).GroupBy(
                "$.Group", // Group on Group object
                "", // Select everything
                "key, e => e").ToArray();
        }
    });

    //self.bestPatternBooksGrouped.subscribe(function (newValue) {
    //    console.log('bestPatternBooksGrouped subscribe', newValue);
    //    if (newValue) {
    //        window.setTimeout(function () {
    //            $('.pattern-book-carousel .owl-carousel').each(function (index, element) {
    //                $(element).owlCarousel({
    //                    nav: true,
    //                    navText: ['<i class="material-icons">keyboard_arrow_left</i>', '<i class="material-icons">keyboard_arrow_right</i>'],
    //                    navContainer: $(element).closest('.relative').find('.pattern-book-contents-nav'),
    //                    margin: 10,
    //                    items: 5,
    //                    dots: false,
    //                    slideBy: 1,//'page',
    //                    loop: false,
    //                    rewind: false,
    //                    response: false
    //                });
    //            })

    //        }, 0);
    //    }
    //});

    self.newPatternBooksGrouped = ko.computed(function () {
        if (self.patternBookResult()) {
            return Enumerable.From(self.patternBookResult().newPatternBooks).GroupBy(
                "$.Group", // Group on Group object
                "", // Select everything
                "key, e => e").ToArray();
        }
    });

    self.newPatternBooksGrouped.subscribe(function (newValue) {
        console.log('newPatternBooksGrouped subscribe', newValue);
        if (newValue) {
            window.setTimeout(function () {
                $('.pattern-book-carousel .owl-carousel').each(function (index, element) {
                    $(element).owlCarousel({
                        nav: true,
                        navText: ['<i class="material-icons">keyboard_arrow_left</i>', '<i class="material-icons">keyboard_arrow_right</i>'],
                        navContainer: $(element).closest('.relative').find('.pattern-book-contents-nav'),
                        margin: 10,
                        items: 5,
                        dots: false,
                        slideBy: 1,//'page',
                        loop: false,
                        rewind: false,
                        response: false
                    });
                })

            }, 0);
        }
    });

    self.patternBookSearch = ko.computed(function () {

        var tradeAccountId = null;

        if (self.tradeAccount())
            tradeAccountId = self.tradeAccount().TradeAccountID

        var data = {
            tradeAccountId: tradeAccountId,
            searchTerm: self.patternBookSearchTerm(),
            held: self.patternBookHeldState(),
            productFilterId: self.patternBookProductFilter(),
            inStock: self.patternBookStock(),
            brandId: self.patternBookBrand()
        };

        if (tradeAccountId) {

            console.log('patternBookSearch calling with', data);

            $.ajax({
                url: '/api/leadsapi/fetchPatternBooks',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('patternBookSearch returned', data);
                    self.patternBookResult(data);
                },
                error: function (xhr, s, a) {
                    $.showError(xhr, s, a);
                }
            });
        }
    }, self).extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 100
        }
    });

    self.careGridSearchTerm = ko.observable();

    self.careGridSearchTerm.subscribe(function (newValue) {
        if (newValue) {
            self.careGridWidget().dataSource.filter({
                logic: 'or',
                filters: [
                    { field: 'productCodes', operator: 'contains', value: newValue },
                    { field: 'careHeadId', operator: 'startswith', value: newValue },
                    { field: 'creditNumber', operator: 'startswith', value: newValue },
                    { field: 'invoiceNumber', operator: 'startswith', value: newValue },
                ]
            });
        } else {
            self.careGridWidget().dataSource.filter({});
        }
    });

    self.careGridWidget = ko.observable();

    self.careGridSettings = {
        autoBind: true,
        widget: self.careGridWidget,
        data: new kendo.data.DataSource({
            pageSize: 10
        }),
        columns: [{
            field: 'CareRecord',
            title: 'Care Record',
            width: 300,
        }],
        useKOTemplates: true,
        rowTemplate: 'care-row-template',
        sortable: true,
        filterable: false,
        reorderable: true,
        scrollable: false,
        selectable: false,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 200]
        },
        dataBound: function (e) {

        },
        change: function (e) {
            if (e.sender.select()) {
                var selectedItem = e.sender.dataItem(e.sender.select());
                console.log('careGridRowSelected', selectedItem);
            }
        }
    };

    self.currentOrderLineStatusGroup = ko.observable(1);

    self.statusGroupButtonClick = function (group, event) {

        $('.status-group-btn').removeClass('btn-success');

        $(event.target).addClass('btn-success');

        self.busy(true);

        self.currentOrderLineStatusGroup(group.OrderLineStatusGroupID);

        $.ajax({
            url: '/api/leadsapi/LoadOutstandingOrders',
            type: 'POST',
            dataType: 'json',
            data: {
                tradeAccountId: self.tradeAccount().TradeAccountID,
                orderLineStatusGroupID: group.OrderLineStatusGroupID
            },
            success: function (data) {
                self.busy(false);
                self.outstandingOrderGridWidget().setDataSource(new kendo.data.DataSource({
                    data: data,
                    pageSize: 10
                }));
            },
            error: function (xhr, e, s) {
                self.busy(false);
                $.showError(xhr, e, s);
            }
        });
    }

    self.currentCareStatusGroup.subscribe(function (careStatusGroupId) {
        $('.credit-note-info').hide();
        self.careGridWidget().setDataSource(new kendo.data.DataSource({
            data: Enumerable.From(self.careRecords()).Where(function (x) {
                return x.careStatusGroupId == careStatusGroupId;
            }).ToArray(),
            pageSize: 20,
            serverFiltering: false,
            serverPaging: false,
            serverSorting: false,
            serverAggregates: false,
            serverGrouping: false,
            schema: {
                model: {
                    fields: {
                        careHeadId: { type: 'int' },
                        productCode: { type: 'string' },
                        creditNumber: { type: 'string' }
                    }
                }
            }
        }));
        if (careStatusGroupId == 3) {
            $('.care-note-info').css('display', 'inline');
        }
    });

    self.showBooker = function () {
        self.visitBooker.newVisit();
    }

    self.reset = function () {
        console.log('customerView reset called');
        $('[href="#customer-summary"]').tab('show');
        $('[href="#summary-info"]').tab('show');
        ko.dataFor($('#add-customer-address > div')[0]).reset();
    }

    self.loadView = function (rec) {

        self.newNote(undefined);

        self.busy(true);

        self.currentOrderLineStatusGroup(1);

        if (!$('#customer-modal').hasClass('in')) {
            $('#customer-modal').modal('show');
        }

        $.ajax({
            url: '/api/leadsapi/loadCustomerView',
            type: 'POST',
            dataType: 'json',
            data: {
                tradeAccountId: rec.TradeAccountID
            },
            success: function (data) {
                console.log('load customerView returned', data);

                //for (var i in data.summary.CustomerContacts) {
                //    data.summary.CustomerContacts[i].model = new tradeAccountContact(data.summary.CustomerContacts[i]);
                //}

                for (var i in data.summary.CustomerAddresses) {
                    //switch (+i) {
                    //    case 0:
                    //        data.summary.invoiceAddress = new addressViewModel();
                    //        data.summary.invoiceAddress.load(data.summary.CustomerAddresses[i].Address);
                    //        break;
                    //    case 1:
                    //        data.summary.deliveryAddress = new addressViewModel();
                    //        data.summary.deliveryAddress.load(data.summary.CustomerAddresses[i].Address);
                    //        break;
                    //    case 2:
                    //        data.summary.visitAddress = new addressViewModel();
                    //        data.summary.visitAddress.load(data.summary.CustomerAddresses[i].Address);
                    //        break;
                    //    default:
                    data.summary.CustomerAddresses[i].model = new addressViewModel();
                    data.summary.CustomerAddresses[i].model.load(data.summary.CustomerAddresses[i].Address);
                    //        break;
                    //}
                }

                console.log('customerView summary is: ', data.summary)

                self.tradeAccountContactsOrderConfirmations(data.summary.CustomerContactsOrderConfirmations);
                self.tradeAccountContactsMarketing(data.summary.CustomerContactsMarketing);
                self.tradeAccountContactsFinancial(data.summary.CustomerContactsFinancial);
                self.tradeAccountContactsPricelists(data.summary.CustomerContactsPricelists);
                self.tradeAccountContactsOther(data.summary.CustomerContactsOther);

                self.summary(data.summary);



                self.tradeAccount(data.tradeAccount);
                self.visitGridWidget().setDataSource(new kendo.data.DataSource({
                    data: self.tradeAccount().Visits,
                    pageSize: 20
                }));
                self.notes(self.tradeAccount().Notes);
                self.orderLineStatusGroups(data.statusGroups);
                self.outstandingOrderGridWidget().setDataSource(new kendo.data.DataSource({
                    data: data.inProgressOrders,
                    pageSize: 10
                }));
                self.careGridSearchTerm(undefined);
                var careRecords = [];

                var groupedCare = Enumerable.From(data.careRecords).GroupBy(function (x) {
                    return x.CareHeadID;
                }).ToArray();

                for (var care in groupedCare) {
                    careRecords.push(new careHead(groupedCare[care]));
                }

                self.currentCareStatusGroup(1);

                self.careRecords(careRecords);

                self.careGridWidget().setDataSource(new kendo.data.DataSource({
                    data: Enumerable.From(self.careRecords()).Where(function (x) {
                        return x.careStatusGroupId == self.currentCareStatusGroup()
                    }).ToArray(),
                    pageSize: 20,
                    serverFiltering: false,
                    serverPaging: false,
                    serverSorting: false,
                    serverAggregates: false,
                    serverGrouping: false,
                    schema: {
                        model: {
                            fields: {
                                careHeadId: { type: 'int' },
                                productCode: { type: 'string' },
                                creditNumber: { type: 'string' }
                            }
                        }
                    }
                }));

                self.totalSales(data.salesStats.TotalSales);
                self.salesByQuarterFinancial(data.salesStats.SalesByQuarterFinancial);
                self.salesByQuarterCalendar(data.salesStats.SalesByQuarterCalendar);

                self.priceChecker(new priceChecker(self.tradeAccount, false));

                //self.tradeAccountContactsOrderConfirmations();

                self.recentLaunchId(data.recentLaunchId);

                self.resetPatternBookToggles(0);

                window.setTimeout(function () {
                    $("#include-samples").bootstrapSwitch({
                        animate: false,
                        labelText: 'Samples',
                        onText: 'Include',
                        offText: 'Excluded',
                        state: false,
                        onSwitchChange: function (event, state) {
                            self.priceChecker().selectedIncludeSamples(state);
                        }
                    });
                    $("#include-clearance").bootstrapSwitch({
                        animate: false,
                        labelText: 'Clearance',
                        onText: 'Include',
                        offText: 'Excluded',
                        state: false,
                        onSwitchChange: function (event, state) {
                            self.priceChecker().selectedIncludeClearance(state);
                        }
                    });
                    $('a[href="#customer-agreements"]').on('show.bs.tab', function () {
                        console.log('priceChecker shown');
                        window.setTimeout(function () {
                            //self.priceChecker().resultGridWidget().refresh();
                        }, 0);
                    });
                    $('#customer-modal').off('hide.bs.modal', self.reset);
                    $('#customer-modal').on('hide.bs.modal', self.reset);
                }, 0);

                self.selectedTradeAccountContacts(data.contacts.map(c => oldTradeAccountContactViewModel({
                    rec: c
                })));

                self.busy(false);
            },
            error: function (xhr, e, s) {
                self.busy(false);
                $.showError(xhr, e, s);
            }
        })
    }

    self.reload = function () {
        self.loadView(self.tradeAccount());
    }

    self.resetPatternBookToggles = function (heldState) {
        self.patternBookSearchTerm(undefined);
        self.patternBookHeldState(heldState);
        self.patternBookProductFilter(null);
        self.patternBookStock(null);
        self.patternBookBrand(null);
    }

    self.saveNote = function () {
        self.busy(true);
        $.ajax({
            url: '/api/leadsapi/saveCustomerNote',
            type: 'POST',
            dataType: 'json',
            data: {
                tradeAccountNoteId: self.editingNoteId(),
                tradeAccountId: self.tradeAccount().TradeAccountID,
                note: self.newNote()
            },
            success: function (data) {
                self.newNote(undefined);
                self.reload();
            },
            error: function (xhr, e, s) {
                self.busy(false);
                $.showError(xhr, e, s);
            }
        });
    }

    self.thisYear = new Date().getYear() - 100;
    self.lastYear = self.thisYear - 1;
    self.nextYear = self.thisYear + 1;
    self.financialQ1to3 = 0;
    self.financialQ4 = 0;

    self.thisMonth = new Date().getMonth() + 1;
    if (self.thisMonth >= 4) {
        self.financialQ1to3 = self.thisYear;
        self.financialQ4 = self.nextYear;
    } else {
        self.financialQ1to3 = self.lastYear;
        self.financialQ4 = self.thisYear;
    }

    // #region Sales by Quarter Grid (Calendar)

    self.salesByQuarterFinancialWidget = ko.observable();

    self.salesByQuarterCalendarWidget = ko.observable();

    self.totalSalesWidget = ko.observable();

    data: self.salesByQuarterFinancial = ko.observableArray([]);

    self.salesByQuarterCalendar = ko.observableArray([]);

    self.totalSales = ko.observableArray([]);

    self.totalsGridBusy = ko.observable(false);

    self.quarterGridsBusy = ko.observable(false);

    self.quarterCalendarGridSettings = {
        autoBind: false,
        height: 127,
        widget: self.salesByQuarterCalendarWidget,
        data: self.salesByQuarterCalendar,
        scrollable: false,
        columns: [{
            field: '',
            title: 'Calendar Year in Currency',
            hidden: true,
            headerAttributes: {
                'class': 'first-heading'
            },
            width: 1100,
            columns: [{
                field: '',
                headerTemplate: '<span class="larger">Q1</span> (Jan ' + self.thisYear + ' - Mar ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ1ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ1ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_CalendarQ1ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_CalendarQ1ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ1ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ1ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_CalendarQ1ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarQ1ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ1ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ1ToDateCurr ? rec.TY_CalendarQ1ToDateCurr : 0) -
                            (rec.LY_CalendarQ1ToDateCurr ? rec.LY_CalendarQ1ToDateCurr : 0)) /
                            (rec.LY_CalendarQ1ToDateCurr ? Math.abs(rec.LY_CalendarQ1ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q2</span> (Apr ' + self.thisYear + ' - Jun ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ2ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ2ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_CalendarQ2ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_CalendarQ2ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ2ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ2ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_CalendarQ2ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarQ2ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ2ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ2ToDateCurr ? rec.TY_CalendarQ2ToDateCurr : 0) -
                            (rec.LY_CalendarQ2ToDateCurr ? rec.LY_CalendarQ2ToDateCurr : 0)) /
                            (rec.LY_CalendarQ2ToDateCurr ? Math.abs(rec.LY_CalendarQ2ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q3</span> (Jul ' + self.thisYear + ' - Sep ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ3ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ3ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_CalendarQ3ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_CalendarQ3ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ3ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ3ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_CalendarQ3ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarQ3ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ3ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ3ToDateCurr ? rec.TY_CalendarQ3ToDateCurr : 0) -
                            (rec.LY_CalendarQ3ToDateCurr ? rec.LY_CalendarQ3ToDateCurr : 0)) /
                            (rec.LY_CalendarQ3ToDateCurr ? Math.abs(rec.LY_CalendarQ3ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q4</span> (Oct ' + self.thisYear + ' - Dec ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ4ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ4ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_CalendarQ4ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_CalendarQ4ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ4ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ4ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_CalendarQ4ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarQ4ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ4ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ4ToDateCurr ? rec.TY_CalendarQ4ToDateCurr : 0) -
                            (rec.LY_CalendarQ4ToDateCurr ? rec.LY_CalendarQ4ToDateCurr : 0)) /
                            (rec.LY_CalendarQ4ToDateCurr ? Math.abs(rec.LY_CalendarQ4ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    attributes: {
                        'class': 'right-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    width: 75
                }]
            }]
        },
        {
            field: '',
            title: 'Calendar Year in Sterling',
            hidden: false,
            headerAttributes: {
                'class': 'first-heading'
            },
            width: 1100,
            columns: [{
                field: '',
                headerTemplate: '<span class="larger">Q1</span> (Jan ' + self.thisYear + ' - Mar ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ1ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ1ToDate >= 0)
                            return formatGBP(rec.TY_CalendarQ1ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_CalendarQ1ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ1ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ1ToDate >= 0)
                            return formatGBP(rec.LY_CalendarQ1ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_CalendarQ1ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ1ToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ1ToDate ? rec.TY_CalendarQ1ToDate : 0) -
                            (rec.LY_CalendarQ1ToDate ? rec.LY_CalendarQ1ToDate : 0)) /
                            (rec.LY_CalendarQ1ToDate ? Math.abs(rec.LY_CalendarQ1ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q2</span> (Apr ' + self.thisYear + ' - Jun ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ2ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ2ToDate >= 0)
                            return formatGBP(rec.TY_CalendarQ2ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_CalendarQ2ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ2ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ2ToDate >= 0)
                            return formatGBP(rec.LY_CalendarQ2ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_CalendarQ2ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ2ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ2ToDate ? rec.TY_CalendarQ2ToDate : 0) -
                            (rec.LY_CalendarQ2ToDate ? rec.LY_CalendarQ2ToDate : 0)) /
                            (rec.LY_CalendarQ2ToDateC ? Math.abs(rec.LY_CalendarQ2ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q3</span> (Jul ' + self.thisYear + ' - Sep ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ3ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ3ToDate >= 0)
                            return formatGBP(rec.TY_CalendarQ3ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_CalendarQ3ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ3ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ3ToDate >= 0)
                            return formatGBP(rec.LY_CalendarQ3ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_CalendarQ3ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ3ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ3ToDate ? rec.TY_CalendarQ3ToDate : 0) -
                            (rec.LY_CalendarQ3ToDate ? rec.LY_CalendarQ3ToDate : 0)) /
                            (rec.LY_CalendarQ3ToDate ? Math.abs(rec.LY_CalendarQ3ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q4</span> (Oct ' + self.thisYear + ' - Dec ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ4ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ4ToDate >= 0)
                            return formatGBP(rec.TY_CalendarQ4ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_CalendarQ4ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ4ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ4ToDate >= 0)
                            return formatGBP(rec.LY_CalendarQ4ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_CalendarQ4ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ4ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ4ToDate ? rec.TY_CalendarQ4ToDate : 0) -
                            (rec.LY_CalendarQ4ToDate ? rec.LY_CalendarQ4ToDate : 0)) /
                            (rec.LY_CalendarQ4ToDate ? Math.abs(rec.LY_CalendarQ4ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    attributes: {
                        'class': 'right-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    width: 75
                }]
            }]
        }],
        sortable: false,
        filterable: false,
        grouping: false,
        serverGrouping: false,
        pageable: false,
        columnShow: function (e) {
            self.quarterlyGridBusy(false);
        },
        columnHide: function (e) {
            self.quarterlyGridBusy(false);
        }
    }

    // #endregion

    // #region Sales by Quarter Grid (Financial)

    self.quarterFinancialGridSettings = {
        autoBind: false,
        height: 127,
        widget: self.salesByQuarterFinancialWidget,
        data: self.salesByQuarterFinancial,
        sortable: false,
        scrollable: false,
        columns: [{
            field: '',
            title: 'Financial Year in Currency',
            hidden: true,
            headerAttributes: {
                'class': 'first-heading'
            },
            width: 1100,
            columns: [{
                field: '',
                headerTemplate: '<span class="larger">Q1</span> (Apr ' + self.financialQ1to3 + ' - Jun ' + self.financialQ1to3 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ1ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ1ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_FinancialQ1ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialQ1ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ1ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ1ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_FinancialQ1ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialQ1ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ1ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ1ToDateCurr ? rec.TY_FinancialQ1ToDateCurr : 0) -
                            (rec.LY_FinancialQ1ToDateCurr ? rec.LY_FinancialQ1ToDateCurr : 0)) /
                            (rec.LY_FinancialQ1ToDateCurr ? Math.abs(rec.LY_FinancialQ1ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q2</span> (Jul ' + self.financialQ1to3 + ' - Sep ' + self.financialQ1to3 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ2ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ2ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_FinancialQ2ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialQ2ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ2ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ2ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_FinancialQ2ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialQ2ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ2ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ2ToDateCurr ? rec.TY_FinancialQ2ToDateCurr : 0) -
                            (rec.LY_FinancialQ2ToDateCurr ? rec.LY_FinancialQ2ToDateCurr : 0)) /
                            (rec.LY_FinancialQ2ToDateCurr ? Math.abs(rec.LY_FinancialQ2ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q3</span> (Oct ' + self.financialQ1to3 + ' - Dec ' + self.financialQ1to3 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ3ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ3ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_FinancialQ3ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialQ3ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ3ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ3ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_FinancialQ3ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialQ3ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ3ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ3ToDateCurr ? rec.TY_FinancialQ3ToDateCurr : 0) -
                            (rec.LY_FinancialQ3ToDateCurr ? rec.LY_FinancialQ3ToDateCurr : 0)) /
                            (rec.LY_FinancialQ3ToDateCurr ? Math.abs(rec.LY_FinancialQ3ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q4</span> (Jan ' + self.financialQ4 + ' - Mar ' + self.financialQ4 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ4ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ4ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_FinancialQ4ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialQ4ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ4ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ4ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_FinancialQ4ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialQ4ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ4ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ4ToDateCurr ? rec.TY_FinancialQ4ToDateCurr : 0) -
                            (rec.LY_FinancialQ4ToDateCurr ? rec.LY_FinancialQ4ToDateCurr : 0)) /
                            (rec.LY_FinancialQ4ToDateCurr ? Math.abs(rec.LY_FinancialQ4ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    attributes: {
                        'class': 'right-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    width: 75
                }]
            }]
        },
        {
            field: '',
            title: 'Financial Year in Sterling',
            hidden: false,
            headerAttributes: {
                'class': 'first-heading'
            },
            width: 1100,
            columns: [{
                field: '',
                headerTemplate: '<span class="larger">Q1</span> (Apr ' + self.financialQ1to3 + ' - Jun ' + self.financialQ1to3 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ1ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ1ToDate >= 0)
                            return formatGBP(rec.TY_FinancialQ1ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_FinancialQ1ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ1ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ1ToDate >= 0)
                            return formatGBP(rec.LY_FinancialQ1ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_FinancialQ1ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ1ToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ1ToDate ? rec.TY_FinancialQ1ToDate : 0) -
                            (rec.LY_FinancialQ1ToDate ? rec.LY_FinancialQ1ToDate : 0)) /
                            (rec.LY_FinancialQ1ToDate ? Math.abs(rec.LY_FinancialQ1ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q2</span> (Jul ' + self.financialQ1to3 + ' - Sep ' + self.financialQ1to3 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ2ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ2ToDate >= 0)
                            return formatGBP(rec.TY_FinancialQ2ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_FinancialQ2ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ2ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ2ToDate >= 0)
                            return formatGBP(rec.LY_FinancialQ2ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_FinancialQ2ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ2ToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ2ToDate ? rec.TY_FinancialQ2ToDate : 0) -
                            (rec.LY_FinancialQ2ToDate ? rec.LY_FinancialQ2ToDate : 0)) /
                            (rec.LY_FinancialQ2ToDate ? Math.abs(rec.LY_FinancialQ2ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q3</span> (Oct ' + self.financialQ1to3 + ' - Dec ' + self.financialQ1to3 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ3ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ3ToDate >= 0)
                            return formatGBP(rec.TY_FinancialQ3ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_FinancialQ3ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ3ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ3ToDate >= 0)
                            return formatGBP(rec.LY_FinancialQ3ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_FinancialQ3ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ3ToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ3ToDate ? rec.TY_FinancialQ3ToDate : 0) -
                            (rec.LY_FinancialQ3ToDate ? rec.LY_FinancialQ3ToDate : 0)) /
                            (rec.LY_FinancialQ3ToDate ? Math.abs(rec.LY_FinancialQ3ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q4</span> (Jan ' + self.financialQ4 + ' - Mar ' + self.financialQ4 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ4ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ4ToDate >= 0)
                            return formatGBP(rec.TY_FinancialQ4ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_FinancialQ4ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ4ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ4ToDate >= 0)
                            return formatGBP(rec.LY_FinancialQ4ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_FinancialQ4ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ4ToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ4ToDate ? rec.TY_FinancialQ4ToDate : 0) -
                            (rec.LY_FinancialQ4ToDate ? rec.LY_FinancialQ4ToDate : 0)) /
                            (rec.LY_FinancialQ4ToDate ? Math.abs(rec.LY_FinancialQ4ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    attributes: {
                        'class': 'right-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    width: 75
                }]
            }]
        }],
        filterable: false,
        grouping: false,
        serverGrouping: false,
        pageable: false,
        columnShow: function (e) {
            self.quarterGridsBusy(false);
        },
        columnHide: function (e) {
            self.quarterGridsBusy(false);
        }
    }

    // #endregion

    // #region Total Sales

    self.summaryGridSettings = {
        autoBind: false,
        widget: self.totalSalesWidget,
        data: self.totalSales,
        scrollable: false,
        //width: 1000,
        columns: [{
            field: '',
            title: 'Total Sales in Currency',
            hidden: true,
            headerAttributes: {
                'class': 'first-heading'
            },
            //width: 1000,
            columns: [{
                field: '',
                title: 'Financial',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_FinancialYearToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialYearToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_FinancialYearToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialYearToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    //width: 100,
                }, {
                    field: 'LY_FinancialYearToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialYearToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_FinancialYearToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialYearToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100,
                }, {
                    field: 'FinancialYearToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        if (rec.FinancialYearToDateGrowthCurr >= 0)
                            return formatPercentage(rec.FinancialYearToDateGrowthCurr);
                        else
                            return '<span class="text-danger">' + formatPercentage(rec.FinancialYearToDateGrowthCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 50
                }]
            }, {
                field: '',
                title: 'Calendar',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_CalendarYearToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarYearToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_CalendarYearToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_CalendarYearToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    //width: 100,
                }, {
                    field: 'LY_CalendarYearToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarYearToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_CalendarYearToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarYearToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100,
                }, {
                    field: 'CalendarYearToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        if (rec.CalendarYearToDateGrowthCurr >= 0)
                            return formatPercentage(rec.CalendarYearToDateGrowthCurr);
                        else
                            return '<span class="text-danger">' + formatPercentage(rec.CalendarYearToDateGrowthCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 50
                }]
            }, {
                field: '',
                title: 'Month',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_MonthToDateCurr',
                    title: 'MTD',
                    template: function (rec) {
                        if (rec.TY_MonthToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_MonthToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_MonthToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    //width: 100,
                }, {
                    field: 'LY_MonthToDateCurr text-right',
                    title: 'LMTD',
                    template: function (rec) {
                        if (rec.LY_MonthToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_MonthToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_MonthToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100,
                }, {
                    field: 'MonthToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        if (rec.MonthToDateGrowthCurr >= 0)
                            return formatPercentage(rec.MonthToDateGrowthCurr);
                        else
                            return '<span class="text-danger">' + formatPercentage(rec.MonthToDateGrowthCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'right-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    //width: 50
                }]
            }]
        },
        {
            field: '',
            title: 'Total Sales in Sterling',
            hidden: false,
            headerAttributes: {
                'class': 'first-heading'
            },
            //width: 1000,
            columns: [{
                field: '',
                title: 'Financial',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_FinancialYearToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialYearToDate >= 0)
                            return formatGBP(rec.TY_FinancialYearToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_FinancialYearToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    //width: 100
                }, {
                    field: 'LY_FinancialYearToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialYearToDate >= 0)
                            return formatGBP(rec.LY_FinancialYearToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_FinancialYearToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
                    field: 'FinancialYearToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        if (rec.FinancialYearToDateGrowth >= 0)
                            return formatPercentage(rec.FinancialYearToDateGrowth);
                        else
                            return '<span class="text-danger">' + formatPercentage(rec.FinancialYearToDateGrowth) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 50
                }]
            }, {
                field: '',
                title: 'Calendar',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_CalendarYearToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarYearToDate >= 0)
                            return formatGBP(rec.TY_CalendarYearToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_CalendarYearToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    //width: 100
                }, {
                    field: 'LY_CalendarYearToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarYearToDate >= 0)
                            return formatGBP(rec.LY_CalendarYearToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_CalendarYearToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
                    field: 'CalendarYearToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        if (rec.CalendarYearToDateGrowth >= 0)
                            return formatPercentage(rec.CalendarYearToDateGrowth);
                        else
                            return '<span class="text-danger">' + formatPercentage(rec.CalendarYearToDateGrowth) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 50
                }]
            }, {
                field: '',
                title: 'Month',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_MonthToDate',
                    title: 'MTD',
                    template: function (rec) {
                        if (rec.TY_MonthToDate >= 0)
                            return formatGBP(rec.TY_MonthToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_MonthToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    //width: 100
                }, {
                    field: 'LY_MonthToDate',
                    title: 'LMTD',
                    template: function (rec) {
                        if (rec.LY_MonthToDate >= 0)
                            return formatGBP(rec.LY_MonthToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_MonthToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
                    field: 'MonthToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        if (rec.MonthToDateGrowth >= 0)
                            return formatPercentage(rec.MonthToDateGrowth);
                        else
                            return '<span class="text-danger">' + formatPercentage(rec.MonthToDateGrowth) + '</span>';
                    },
                    attributes: {
                        'class': 'right-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    //width: 50
                }]
            }]
        }],
        sortable: false,
        filterable: false,
        grouping: false,
        serverGrouping: false,
        pageable: false,
        columnShow: function (e) {
            self.totalsGridBusy(false);
        },
        columnHide: function (e) {
            self.totalsGridBusy(false);
        }
    }

    self.cancelTradeAccountContactsModal = () => {
        console.log('not yet implemented');
    }

    self.saveTradeAccountContacts = () => {
        console.log('not yet implemented');
    }

    // #endregion
}