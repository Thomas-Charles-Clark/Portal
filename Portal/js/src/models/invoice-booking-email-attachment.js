const invoiceBookingEmailAttachmentViewModel = ({
    rec
} = {

}) => {
    let self = Object.assign(rec, {

    });

    //#region Properties

    self.busy = ko.observable(false);

    self.attachmentTypeId = ko.observable(`${self.AttachmentTypeID}`);
    self.attachmentType = ko.observable();

    self.properties = ko.observable();
    self.propertiesTemplateName = ko.observable();

    //#endregion


    //#region Lifted Bits



    //#endregion


    //#region Components

    self.attachmentTypeParams = kendoMDCDropDownList({
        label: 'Attachment Type',
        odata: true,
        endPoint: '/odata/AttachmentTypes',
        textField: 'Name',
        valueField: 'AttachmentTypeID',
        virtual: false,
        textField: 'Name',
        valueField: 'AttachmentTypeID',
        virtual: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        idObservable: self.attachmentTypeId,
        objObservable: self.attachmentType,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: false,
        autoBind: true,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        }
    })

    //#endregion


    //#region Computeds

    self.src = ko.computed(() => {
        return `/incomingemail/attachments/${self.IsInline ? 'inline' : 'regular'}/null/${self.AttachmentID}.${self.FileExtension}`;
    }, self);

    //#endregion


    //#region Subscriptions

    self.attachmentTypeId.subscribe(nv => {
        self.devisePropertiesTemplate()
    });

    //#endregion


    //#region Methods

    self.devisePropertiesTemplate = () => {

        let properties = null;
        let propertiesViewModelFn = null;
        let propertiesTemplateName = null;

        switch (+self.attachmentTypeId()) {
            /* 
    
            AttachmentTypeID	Name	        ParsingRequired
                        1	    Unknown	        0
                        2	    Invoice	        1
                        3	    Credit Note	    1
                        4	    Statement	    0
                        5	    Packing List	0
                        6	    Delivery Note	0
                        999	    Junk	        0
    
            */

            case 1:
                break;
            case 2:
                propertiesViewModelFn = invoiceBookingEmailInvoiceViewModel;
                propertiesTemplateName = 'invoice-booking-invoice-template';
                break;
            case 3:
                propertiesViewModelFn = invoiceBookingEmailCreditNoteViewModel;
                propertiesTemplateName = 'invoice-booking-credit-note-template';
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 999:
                break;
            default:
                break;
        }

        if (typeof propertiesViewModelFn == 'function') {
            properties = propertiesViewModelFn({
                rec: self
            });
        }

        self.properties(properties);

        self.propertiesTemplateName(propertiesTemplateName);
    }

    //#endregion


    //#region Events

    self.attributePropertiesResizeStart = (event, ui) => {
        document.querySelector('#attachment-iframe-wrapper').classList.add('blocked');
    }

    self.attributePropertiesResizeStop = (event, ui) => {
        document.querySelector('#attachment-iframe-wrapper').classList.remove('blocked');
    }

    self.devisePropertiesTemplate();

    //#endregion

    return self;
}