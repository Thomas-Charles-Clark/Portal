const tradeAccountContactViewModel = ({
    rec
} = {
    rec: {}
}) => {
    let self = Object.assign({

    }, rec);

    //#region Properties

    self.ready = ko.observable(false);

	self.busy = ko.observable(false);

	self.phone = ko.observable(self.Phone);
	self.editingPhone = ko.observable(false);

	self.fullName = ko.observable(self.FullName);
	self.editingFullName = ko.observable(false);

	self.email = ko.observable(self.Email);
	self.editingEmail = ko.observable(false);

	self.otherTradeAccountAssociations = ko.observable(self.OtherTradeAccountAssociations);

	self.tradeAccountRegistrationComplete = ko.observable(self.TradeAccountRegistrationComplete);
	self.tradePermissionAccountAdmin = ko.observable(self.TradePermissionAccountAdmin);
	self.tradePermissionPlaceOrder = ko.observable(self.TradePermissionPlaceOrder);
	self.tradePermissionRequestSample = ko.observable(self.TradePermissionRequestSample);
	self.tradePermissionViewAccounts = ko.observable(self.TradePermissionViewAccounts);
	self.tradePermissionDownloadPricelistsBrochures = ko.observable(self.TradePermissionDownloadPricelistsBrochures);
	self.tradePermissionDownloadProductFeeds = ko.observable(self.TradePermissionDownloadProductFeeds);
	self.communicationPreference_OrderNotifications = ko.observable(self.CommunicationPreference_OrderNotifications);
	self.communicationPreference_DeliveryNotifications = ko.observable(self.CommunicationPreference_DeliveryNotifications);
	self.communicationPreference_Invoices = ko.observable(self.CommunicationPreference_Invoices);
	self.communicationPreference_CreditNotes = ko.observable(self.CommunicationPreference_CreditNotes);
	self.communicationPreference_StatementsOfAccountAndPaymentRequests = ko.observable(self.CommunicationPreference_StatementsOfAccountAndPaymentRequests);
	self.communicationPreference_ProofOfDelivery = ko.observable(self.CommunicationPreference_ProofOfDelivery);
	self.communicationPreference_PriceLists = ko.observable(self.CommunicationPreference_PriceLists);
	self.communicationPreference_SalesMarketingAndPromotionalInformation = ko.observable(self.CommunicationPreference_SalesMarketingAndPromotionalInformation);
	self.otherTradeAccountAssociations = ko.observable(self.OtherTradeAccountAssociations);

	self.fullName = ko.observable(self.FullName);

	self.email = ko.observable(self.Email).extend({
		email: {
			params: true
		}
	});

    //#endregion


	//#region Components

	self.tradeAccountRegistrationCompleteParams = {
		observable: self.tradeAccountRegistrationComplete,
		enable: ko.observable(false),
		disable: ko.observable(true),
		busy: self.busy
	};

	self.tradePermissionAccountAdminParams = {
		observable: self.tradePermissionAccountAdmin,
		enable: ko.observable(false),
		disable: ko.observable(true),
		busy: self.busy
	};

	self.tradePermissionPlaceOrderParams = {
		observable: self.tradePermissionPlaceOrder,
		enable: ko.observable(false),
		disable: ko.observable(true),
		busy: self.busy
	};

	self.tradePermissionRequestSampleParams = {
		observable: self.tradePermissionRequestSample,
		enable: ko.observable(false),
		disable: ko.observable(true),
		busy: self.busy
	};

	self.tradePermissionViewAccountsParams = {
		observable: self.tradePermissionViewAccounts,
		enable: ko.observable(false),
		disable: ko.observable(true),
		busy: self.busy
	};

	self.tradePermissionDownloadPricelistsBrochuresParams = {
		observable: self.tradePermissionDownloadPricelistsBrochures,
		enable: ko.observable(false),
		disable: ko.observable(true),
		busy: self.busy
	};

	self.tradePermissionDownloadProductFeedsParams = {
		observable: self.tradePermissionDownloadProductFeeds,
		enable: ko.observable(false),
		disable: ko.observable(true),
		busy: self.busy
	};

	self.communicationPreference_OrderNotificationsParams = {
		observable: self.communicationPreference_OrderNotifications,
		enable: ko.observable(true),
		disable: ko.observable(false),
		busy: self.busy
	};

	self.communicationPreference_DeliveryNotificationsParams = {
		observable: self.communicationPreference_DeliveryNotifications,
		enable: ko.observable(true),
		disable: ko.observable(false),
		busy: self.busy
	};

	self.communicationPreference_InvoicesParams = {
		observable: self.communicationPreference_Invoices,
		enable: ko.observable(true),
		disable: ko.observable(false),
		busy: self.busy
	};

	self.communicationPreference_CreditNotesParams = {
		observable: self.communicationPreference_CreditNotes,
		enable: ko.observable(true),
		disable: ko.observable(false),
		busy: self.busy
	};

	self.communicationPreference_StatementsOfAccountAndPaymentRequestsParams = {
		observable: self.communicationPreference_StatementsOfAccountAndPaymentRequests,
		enable: ko.observable(true),
		disable: ko.observable(false),
		busy: self.busy
	};

	self.communicationPreference_ProofOfDeliveryParams = {
		observable: self.communicationPreference_ProofOfDelivery,
		enable: ko.observable(true),
		disable: ko.observable(false),
		busy: self.busy
	};

	self.communicationPreference_PriceListsParams = {
		observable: self.communicationPreference_PriceLists,
		enable: ko.observable(true),
		disable: ko.observable(false),
		busy: self.busy
	};

	self.communicationPreference_SalesMarketingAndPromotionalInformationParams = {
		observable: self.communicationPreference_SalesMarketingAndPromotionalInformation,
		enable: ko.observable(true),
		disable: ko.observable(false),
		busy: self.busy
	};

    self.errors = new ko.validation.group([

    ]);

    //#endregion



	//#region Computeds

	self.title = ko.computed(() => {
		return `TradeAccountMemberID: ${(self.TradeAccountMemberID ?? 'null')}, MemberID: ${(self.MemberID ?? 'null')}`;
	}, self);

    self.unsavedChanges = ko.computed(() => {
        let result = false;

		result = (self.tradeAccountRegistrationComplete() != self.TradeAccountRegistrationComplete) ||
			(self.tradePermissionAccountAdmin() != self.TradePermissionAccountAdmin) ||
			(self.tradePermissionPlaceOrder() != self.TradePermissionPlaceOrder) ||
			(self.tradePermissionRequestSample() != self.TradePermissionRequestSample) ||
			(self.tradePermissionViewAccounts() != self.TradePermissionViewAccounts) ||
			(self.tradePermissionDownloadPricelistsBrochures() != self.TradePermissionDownloadPricelistsBrochures) ||
			(self.tradePermissionDownloadProductFeeds() != self.TradePermissionDownloadProductFeeds) ||
			(self.communicationPreference_OrderNotifications() != self.CommunicationPreference_OrderNotifications) ||
			(self.communicationPreference_DeliveryNotifications() != self.CommunicationPreference_DeliveryNotifications) ||
			(self.communicationPreference_Invoices() != self.CommunicationPreference_Invoices) ||
			(self.communicationPreference_CreditNotes() != self.CommunicationPreference_CreditNotes) ||
			(self.communicationPreference_StatementsOfAccountAndPaymentRequests() != self.CommunicationPreference_StatementsOfAccountAndPaymentRequests) ||
			(self.communicationPreference_ProofOfDelivery() != self.CommunicationPreference_ProofOfDelivery) ||
			(self.communicationPreference_PriceLists() != self.CommunicationPreference_PriceLists) ||
			(self.communicationPreference_SalesMarketingAndPromotionalInformation() != self.CommunicationPreference_SalesMarketingAndPromotionalInformation) ||
			(self.otherTradeAccountAssociations() != self.OtherTradeAccountAssociations) ||
			(self.email() != self.Email) ||
			(self.fullName() != self.FullName);

        return result;
    });

    //#endregion


    //#region Subscriptions



    //#endregion


	//#region Methods

	self.toggleEditingFullName = () => {
		self.editingFullName(!self.editingFullName());

		window.setTimeout(() => {
			if (self.editingFullName()) {
				self.fullName.DOMElement.focus();
			}
		}, 0);
	}

	self.toggleEditingEmail = () => {
		self.editingEmail(!self.editingEmail());

		window.setTimeout(() => {
			if (self.editingEmail()) {
				self.email.DOMElement.focus();
			}
		}, 0);
	}

	self.toggleEditingPhone = () => {
		self.editingPhone(!self.editingPhone());

		window.setTimeout(() => {
			if (self.editingPhone()) {
				self.phone.DOMElement.focus();
			}
		}, 0);
	}

	self.toJS = () => {
		return {
			tradeAccountMemberId: self.TradeAccountMemberID,
			tradeAccountId: self.TradeAccountID,
			memberId: self.MemberID,
			email: self.email(),
			fullName: self.fullName(),
			phone: self.phone(),
			tradeAccountRegistrationComplete: self.tradeAccountRegistrationComplete(),
			tradePermissionAccountAdmin: self.tradePermissionAccountAdmin(),
			tradePermissionPlaceOrder: self.tradePermissionPlaceOrder(),
			tradePermissionRequestSample: self.tradePermissionRequestSample(),
			tradePermissionViewAccounts: self.tradePermissionViewAccounts(),
			tradePermissionDownloadPricelistsBrochures: self.tradePermissionDownloadPricelistsBrochures(),
			tradePermissionDownloadProductFeeds: self.tradePermissionDownloadProductFeeds(),
			communicationPreference_OrderNotifications: self.communicationPreference_OrderNotifications(),
			communicationPreference_DeliveryNotifications: self.communicationPreference_DeliveryNotifications(),
			communicationPreference_Invoices: self.communicationPreference_Invoices(),
			communicationPreference_CreditNotes: self.communicationPreference_CreditNotes(),
			communicationPreference_StatementsOfAccountAndPaymentRequests: self.communicationPreference_StatementsOfAccountAndPaymentRequests(),
			communicationPreference_ProofOfDelivery: self.communicationPreference_ProofOfDelivery(),
			communicationPreference_PriceLists: self.communicationPreference_PriceLists(),
			communicationPreference_SalesMarketingAndPromotionalInformation: self.communicationPreference_SalesMarketingAndPromotionalInformation(),
			otherTradeAccountAssociations: self.otherTradeAccountAssociations()
		}
	}

	//#endregion



    //#region Events



    //#endregion


    return self;
};