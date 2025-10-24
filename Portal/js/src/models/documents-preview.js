var documentsPreviewViewModel = function () {
    var self = this;

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable(undefined);

    self.validateNow = ko.observable(false);

    self.showDocument = ko.observable(false);

    self.documentSendHistory = ko.observableArray(typeof getDocumentSendHistory === 'function' ? getDocumentSendHistory() : []);

    self.documentId = ko.observable(typeof getDocumentType === 'function' ? getDocumentType() : undefined).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Document is required'
        },
    });

    self.languageId = ko.observable(typeof getLanguageId === 'function' ? getLanguageId() : undefined).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Language is required'
        },
    });

    self.tradeAccountId = ko.observable(typeof getTradeAccountId === 'function' ? getTradeAccountId() : '');

    self.basketId = ko.observable(typeof getBasketId === 'function' ? getBasketId() : undefined);

    self.orderHeadId = ko.observable(typeof getOrderHeadId === 'function' ? getOrderHeadId() : undefined);

    self.transactionId = ko.observable(typeof getTransactionId === 'function' ? getTransactionId() : undefined);

    self.date = ko.observable();

    self.dateParams = {
        label: 'Date',
        observable: self.date,
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'ddd Do MMM yyyy'
            },
            display: {
                sideBySide: false,
                components: {
                    clock: false
                },
                //cellSize: '4rem'
            },
            restrictions: {
                disabledDates: []
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false,
            eventHandlers: {
                onChange: (e) => {
                    //self.from.tempusDominus.updateOptions({
                    //    restrictions: {
                    //        maxDate: e.date,
                    //    },
                    //});
                }
            }
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.date(undefined);
        },
        revertible: ko.observable(false),
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.documentParams = kendoMDCDropDownList({
        label: 'Document',
        odata: true,
        endPoint: '/odata/Documents',
        textField: 'Name',
        valueField: 'DocumentID',
        virtual: false,
        idObservable: self.documentId,
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
        idObservable: self.languageId,
        objObservable: ko.observable(),
        optionLabel: {
            LanguageID: '',
            Name: ''
        },
        optionLabelTemplate: '',
        filter: false,
        autoBind: true
    });

    self.tradeAccountParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account',
        odata: true,
        endPoint: '/odata/TradeAccounts',
        textField: 'ShortLabel',
        valueField: 'TradeAccountID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/TradeAccounts/Default.TradeAccountValueMapper(tradeAccountId=${options.value})`,
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
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            if ((e.ShortLabel != '') && (e.TradeAccountID != null))
                return `<span title="${e.ShortLabel}">Trade Account: ${e.ShortLabel}</span>`
            else
                return '';
        },
        idObservable: self.tradeAccountId,
        objObservable: ko.observable(),
        locked: ko.observable(false),
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
            field: 'Code'
        }, {
            dir: 'asc',
            field: 'Name'
        }],
        select: function (e) {
            console.log('tradeAccountParams select', e);
        },
        showClear: ko.observable(true),
        clearFunction: (e) => {
            self.tradeAccountId('');
            self.tradeAccountParams.observable(undefined);
            self.tradeAccountParams.dropDownListSettings.widget().value('');
            self.tradeAccountParams.dropDownListSettings.widget().trigger('change');
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "Name")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "Code")}`;
            }

            return d;
        }
    });

    self.basketId.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && (self.documentId() != 7 && self.orderHeadId() == null && self.transactionId() == null)
            },
            message: 'One of TransactionID, OrderHeadID or BasketID is required'
        },
        numberUnformatted: {
            digits: 0,
            minValue: 0,
            maxValue: 9223372036854775807,
            currency: {
                FormattingCulture: 'en-GB'
            }
        },
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
                return self.validateNow() && (self.documentId() != 7 && self.basketId() == null && self.transactionId() == null)
            },
            message: 'One of TransactionID, OrderHeadID or BasketID is required'
        },
        numberUnformatted: {
            digits: 0,
            minValue: 0,
            maxValue: 2147483647,
            currency: {
                FormattingCulture: 'en-GB'
            }
        },
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
                return self.validateNow() && (self.documentId() != 7 && self.basketId() == null && self.orderHeadId() == null)
            },
            message: 'One of TransactionID, OrderHeadID or BasketID is required'
        },
        numberUnformatted: {
            digits: 0,
            minValue: 0,
            maxValue: 2147483647,
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
        self.tradeAccountId,
        self.documentId,
        self.languageId
    ]);

    self.tradeAccountId.subscribe(function (newValue) {
        self.validateNow(false);
        self.orderHeadId(undefined);
        self.transactionId(undefined);
        self.basketId(undefined);
    });

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

    self.date.subscribe(nv => {
        if (nv) {
            self.fetchDocument();
        }
    })

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
            documentType: self.documentId(),
            languageId: self.languageId(),
            tradeAccountId: self.tradeAccountId(),
            basketId: self.basketId(),
            transactionId: self.transactionId(),
            orderHeadId: self.orderHeadId(),
            date: self.date() ? self.date().toISOString() : null
        };
    }

    self.canFire = ko.pureComputed(function () {
        let d = null,
            b = null,
            o = null,
            t = null,
            tid = null,
            da = null;

        d = self.documentParams.dropDownListSettings.dataItem();

        if (self.basketId())
            b = self.documentParams.dropDownListSettings.dataItem();
        else if (self.orderHeadId())
            o = self.orderHeadId();
        else if (self.transactionId())
            t = self.transactionId()
        else if (self.tradeAccountId())
            tid = self.tradeAccountId();

        da = self.date();

        return (d && (b || o || t || tid)) || (d == 7 && da != null);
    });

    self.init = function () {
        if (typeof autoLoad == 'function')
            autoLoad.call(self);
    }

    self.link = ko.pureComputed(function () {
        let objJsonStr = JSON.stringify({
            documentType: self.documentId(),
            languageId: self.languageId(),
            tradeAccountId: self.tradeAccountId(),
            basketId: self.basketId(),
            transactionId: self.transactionId(),
            orderHeadId: self.orderHeadId(),
            date: self.date() ? self.date().toISOString() : null
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