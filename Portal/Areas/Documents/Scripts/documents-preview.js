var documentsPreviewViewModel = function () {
    var self = this;

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable(undefined);

    self.validateNow = ko.observable(false);

    self.showDocument = ko.observable(false);

    self.documentSendHistory = ko.observableArray(typeof getDocumentSendHistory === 'function' ? getDocumentSendHistory() : []);

    self.documentParams = kendoMDCDropDownList({
        label: 'Document',
        odata: true,
        endPoint: '/odata/Documents',
        textField: 'Name',
        valueField: 'DocumentID',
        virtual: false,
        idObservable: ko.observable(typeof getDocumentType === 'function' ? getDocumentType() : undefined).extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Document is required'
            },
        }),
        objObservable: ko.observable(),
        optionLabel: {
            DocumentID: '',
            Name: ''
        },
        optionLabelTemplate: '',
        filter: false,
        autoBind: true
    });

    self.languageParams = kendoMDCDropDownList({
        label: 'Language',
        odata: true,
        endPoint: '/odata/Languages',
        textField: 'Name',
        valueField: 'LanguageID',
        virtual: false,
        idObservable: ko.observable(typeof getLanguageId === 'function' ? getLanguageId() : undefined).extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Language is required'
            },
        }),
        objObservable: ko.observable(),
        optionLabel: {
            LanguageID: '',
            Name: ''
        },
        optionLabelTemplate: '',
        filter: false,
        autoBind: true
    });

    self.basketId = ko.observable(typeof getBasketId === 'function' ? getBasketId() : undefined);

    self.orderHeadId = ko.observable(typeof getOrderHeadId === 'function' ? getOrderHeadId() : undefined);

    self.transactionId = ko.observable(typeof getTransactionId === 'function' ? getTransactionId() : undefined);

    self.basketId.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && (self.orderHeadId() == null && self.transactionId() == null)
            },
            message: 'One of TransactionID, OrderHeadID or BasketID is required'
        },
        numberFormatted: {
            digits: 0,
            currency: {
                FormattingCulture: 'en-GB'
            }
        }
    });

    self.basketParams = {
        label: 'Basket ID',
        observable: self.basketId,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true
    };

    self.orderHeadId.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && (self.basketId() == null && self.transactionId() == null)
            },
            message: 'One of TransactionID, OrderHeadID or BasketID is required'
        },
        numberFormatted: {
            digits: 0,
            currency: {
                FormattingCulture: 'en-GB'
            }
        }
    });

    self.orderHeadParams = {
        label: 'Order ID',
        observable: self.orderHeadId,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true
    };

    self.transactionId.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && (self.basketId() == null && self.orderHeadId() == null)
            },
            message: 'One of TransactionID, OrderHeadID or BasketID is required'
        },
        numberFormatted: {
            digits: 0,
            currency: {
                FormattingCulture: 'en-GB'
            }
        }
    });

    self.transactionParams = {
        label: 'Transaction ID',
        observable: self.transactionId,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true
    };

    self.errors = ko.validation.group([
        self.basketId,
        self.orderHeadId,
        self.transactionId,
        self.documentParams.observable,
        self.languageParams.observable
    ]);

    self.transactionId.subscribe(function (newValue) {
        self.validateNow(false);
        self.orderHeadId(undefined);
        self.basketId(undefined);
    });

    self.orderHeadId.subscribe(function (newValue) {
        self.validateNow(false);
        self.basketId(undefined);
        self.transactionId(undefined);
    });

    self.basketId.subscribe(function (newValue) {
        self.validateNow(false);
        self.orderHeadId(undefined);
        self.transactionId(undefined);
    });

    self.emailer = emailer({ parent: self });

    self.toBinary = function (string) {
        const codeUnits = new Uint16Array(string.length);
        for (let i = 0; i < codeUnits.length; i++) {
            codeUnits[i] = string.charCodeAt(i);
        }
        return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
    }

    self.sendDocument = function () {
        self.emailer.validateSendNow(true);
        if (self.emailer.emailErrors().length) {
            self.emailer.emailErrors.filter(function (x) {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            self.busy(true);
            self.busyMessage('Emailing to ' + self.emailer.to());
            var data = $.extend(self.getData(), {
                email: self.emailer.to(),
                replyTo: self.emailer.replyTo(),
                subject: self.emailer.subject(),
                body: self.emailer.body()
            });

            let objJsonStr = JSON.stringify(data);

            let objJsonB64 = self.toBinary(objJsonStr);

            $.ajax({
                url: '/api/documentsapi/emailDocument',
                type: 'POST',
                dataType: 'json',
                data: {
                    d: objJsonB64
                },
                success: function (data) {
                    self.documentSendHistory(data.Results);
                    self.busy(false);
                    self.emailer.validateSendNow(false);
                    self.emailer.sentTo(self.emailer.to());
                    //self.to(undefined);
                    //self.subject(undefined);
                    //self.body(undefined);
                    self.emailer.showLastSentTo(true);
                    window.setTimeout(function () {
                        self.emailer.showLastSentTo(false);
                    }, 5000);
                }
            });
        }
    }

    self.emailer.send = self.sendDocument;

    self.fetchDocument = function () {
        self.validateNow(false);
        self.validateNow(true);
        self.emailer.validateSendNow(false);
        window.setTimeout(function () {
            if (self.errors().length) {
                self.errors.filter(function (x) {
                    x.isValid.notifySubscribers(x.isValid());
                })
            } else {
                self.busy(true);

                if (self.basketId())
                    self.busyMessage('Fetching ' + self.documentParams.dropDownListSettings.dataItem().Name + ' for Basket ID ' + self.basketId());
                else if (self.orderHeadId())
                    self.busyMessage('Fetching ' + self.documentParams.dropDownListSettings.dataItem().Name + ' for Order ID ' + self.orderHeadId());
                else if (self.transactionId())
                    self.busyMessage('Fetching ' + self.documentParams.dropDownListSettings.dataItem().Name + ' for Transaction ID ' + self.transactionId());

                let url = '/api/documentsapi/FetchDocument';

                var data = self.getData();

                let objJsonStr = JSON.stringify(data);

                let objJsonB64 = btoa(objJsonStr);

                self.fetchDocumentSendHistory();

                if (window.fetch) {
                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify({ d: objJsonB64 }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.BearerToken
                        }
                    }).then(function (response) {
                        if (response.ok)
                            return response.blob();
                        else
                            throw new error('Document not Found');
                    }).then(function (blob) {
                        $('#document-iframe').remove();
                        $('#document-iframe-container').html(`<iframe src="${window.URL.createObjectURL(blob)}#view=fit" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%;" allowfullscreen></iframe>`);
                        self.showDocument(true);
                        self.busy(false);
                        self.busyMessage(undefined);
                    }).catch(function (xhr, s, a) {
                        $.info('Sorry', "Failed to retrieve Document");
                        self.busy(false);
                    });
                }
            }
        }, 0);
    }

    self.fetchDocumentSendHistory = function () {

        var data = self.getData();

        $.ajax({
            url: '/api/documentsapi/FetchDocumentSendHistory',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.documentSendHistory(data.Results);
            }
        });
    }

    self.getData = function () {
        return {
            documentType: self.documentParams.observable(),
            basketId: self.basketId(),
            transactionId: self.transactionId(),
            orderHeadId: self.orderHeadId(),
            languageId: self.languageParams.observable()
        };
    }

    self.canFire = ko.pureComputed(function () {
        let d = null,
            b = null,
            o = null,
            t = null;

        d = self.documentParams.dropDownListSettings.dataItem();

        if (self.basketId())
            b = self.documentParams.dropDownListSettings.dataItem();
        else if (self.orderHeadId())
            o = self.orderHeadId();
        else if (self.transactionId())
            t = self.transactionId();

        return d && (b || o || t);
    });

    self.init = function () {
        if (typeof autoLoad == 'function')
            autoLoad.call(self);
    }

    self.link = ko.pureComputed(function () {
        let objJsonStr = JSON.stringify({
            documentType: self.documentParams.observable(),
            basketId: self.basketParams.observable(),
            transactionId: self.transactionParams.observable(),
            orderHeadId: self.orderHeadParams.observable(),
            languageId: self.languageParams.observable()
        });
        let objJsonB64 = btoa(objJsonStr);
        return new URLSearchParams({
            d: objJsonB64
        }).toString();
    }, self);

    self.userLink = ko.pureComputed(function () {
        return window.location.origin + '/documents/view?' + self.link()
    }, self);

    self.copyUserLink = function (e) {
        e.preventDefault();
        navigator.permissions.query({ name: "clipboard-write" }).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.writeText(self.userLink());
                $('#user-copied-ok').stop(false, false).fadeIn('fast');
                window.setTimeout(function () {
                    $('#user-copied-ok').stop(false, false).fadeOut('slow');
                }, 500);
            }
        });
    }

    self.adminLink = ko.pureComputed(function () {
        return window.location.origin + '/documents/preview?' + self.link()
    }, self);

    self.copyAdminLink = function (e) {
        e.preventDefault();
        navigator.permissions.query({ name: "clipboard-write" }).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.writeText(self.adminLink());
                $('#admin-copied-ok').stop(false, false).fadeIn('fast');
                window.setTimeout(function () {
                    $('#admin-copied-ok').stop(false, false).fadeOut('slow');
                }, 500);
            }
        });
    }
}