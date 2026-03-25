var documentsPreviewViewModel = function () {
    var self = this;

    //#region Properties

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable(undefined);

    self.validateNow = ko.observable(false);

    self.showDocument = ko.observable(false);

    self.overrideParameters = ko.observable();

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

    self.document = ko.observable();

    self.documentOutputModeCode = ko.observable(typeof getDocumentOutputModeCode === 'function' ? getDocumentOutputModeCode() : '').extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && (self.document() && self.document().OutputModes != null && self.document().OutputModes().length);
            },
            message: 'Document Output Mode is required'
        },
    });

    self.documentOutputMode = ko.observable();

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

    self.tradeAccount = ko.observable();

    self.basketId = ko.observable(typeof getBasketId === 'function' ? getBasketId() : undefined);

    self.orderHeadId = ko.observable(typeof getOrderHeadId === 'function' ? getOrderHeadId() : undefined);

    self.transactionId = ko.observable(typeof getTransactionId === 'function' ? getTransactionId() : undefined);

    self.date = ko.observable(typeof getDocumentDate === 'function' ? getDocumentDate() : undefined);

    self.liveDocuments = ko.observableArray([]);

    //#endregion


    //#region Components

    self.emailer = emailer({ parent: self });

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
        endPoint: '/odata/Documents?$expand=OutputModes',
        textField: 'Name',
        valueField: 'DocumentID',
        virtual: false,
        idObservable: self.documentId,
        objObservable: self.document,
        optionLabel: {
            DocumentID: '',
            Name: ''
        },
        optionLabelTemplate: '',
        filter: false,
        autoBind: true,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            let filters = [];

            let documentOutputModeCode = self.documentOutputModeCode();

            if (documentOutputModeCode) {
                filters.push(`OutputModes/any(c: c/Code eq '${documentOutputModeCode}')`);
            }

            if (filters.length) {
                let filterString = filters.join(' and ');
                d.$apply = `filter(${filterString})`;
            }

            if (d.$filter) {
                delete d.$filter;
            }

            return d;
        }
    });

    self.documentOutputModeParams = kendoMDCDropDownList({
        label: 'Document Output Mode',
        odata: true,
        endPoint: '/odata/DocumentOutputModes',
        textField: 'Name',
        valueField: 'Code',
        virtual: false,
        idObservable: self.documentOutputModeCode,
        objObservable: self.documentOutputMode,
        optionLabel: {
            Code: '',
            Name: ''
        },
        optionLabelTemplate: '',
        filter: false,
        autoBind: true,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            let filters = [];

            let documentId = self.documentId()

            if (documentId) {
                filters.push(`DocumentID eq ${documentId}`);
            }

            if (filters.length) {
                let filterString = filters.join(' and ');
                d.$apply = `filter(${filterString})`;
            }

            if (d.$filter) {
                delete d.$filter;
            }
            
            return d;
        }
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
        skipCascade: false,
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
        objObservable: self.tradeAccount,
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

    self.liveDocumentsGridParams = {
        autoBind: true,
        widget: ko.observable(),
        columns: [{
            field: 'DocumentLabel',
            title: 'Document',
            filterable: {
                extra: false
            }
        }, {
            field: 'LanguageLabel',
            title: 'Language',
            filterable: {
                extra: false
            }
        }, {
            field: 'TradeAccountLabel',
            title: 'Trade Account',
            filterable: {
                extra: false
            }
        }, {
            field: 'DocumentTotal',
            title: 'Document Total',
            width: 140,
            filterable: {
                extra: false
            }
        }, {
            field: 'Date',
            title: 'Date',
            width: 140,
            filterable: {
                extra: false
            }
        }],
        data: self.liveDocuments,
        dataSource: new kendo.data.DataSource({
            sortable: true,
            filterable: true,
            grouping: false,
            serverGrouping: false,
            serverFiltering: false,
            serverPaging: false,
            pageSize: 10,
            pageable: {
                pageSize: 10,
                pageSizes: [10, 20, 50, 100, 250, 500, 'all']
            },
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                aggregates: "Aggregates",
                model: {
                    id: 'RowKey',
                    fields: {
                        RowKey: { type: 'number' },
                        DocumentID: { type: 'number' },
                        DocumentLabel: { type: 'string' },
                        LanguageID: { type: 'number' },
                        LanguageLabel: { type: 'string' },
                        BasketID: { type: 'number' },
                        TransactionID: { type: 'number' },
                        OrderHeadID: { type: 'number' },
                        TradeAccountID: { type: 'number' },
                        TradeAccountLabel: { type: 'string' },
                        Date: { type: 'date' },
                        DocumentTotal: { type: 'number' },
                        CurrencyCode: { type: 'string' },
                        FormattingCulture: { type: 'string' },
                    }
                }
            }),
            requestStart: (e) => {
                self.busy(true);
            },
            requestEnd: (e) => {
                self.busy(false);
            }
        }),
        useKOTemplates: true,
        rowTemplate: 'live-document-row-template',
        scrollable: false,
        sortable: true,
        filterable: true,
        reorderable: false,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: 'single',
        change: function (e) {
            let dataItem = e.sender.dataItem(e.sender.select());
            
            console.log('change', dataItem);

            //new Date(Date.parse('@($"{Model.DocumentDetails?.date:yyyy-MM-ddTHH:mm:ssZ}")'));

            var overrideParameters = {
                documentType: dataItem.DocumentID,
                languageId: dataItem.LanguageID,
                tradeAccountId: dataItem.TradeAccountID,
                basketId: dataItem.BasketID,
                transactionId: dataItem.TransactionID,
                orderHeadId: dataItem.OrderHeadID,
                date: dataItem.Date ? dataItem.Date : null,
                outputMode: dataItem.OutputMode
            };

            self.overrideParameters(overrideParameters);

            self.fetchDocument(undefined, undefined);
        },
        dataBound: function (e) {

        }
    };

    self.errors = ko.validation.group([
        self.basketId,
        self.orderHeadId,
        self.transactionId,
        self.tradeAccountId,
        self.documentId,
        self.languageId
    ]);

    //#endregion


    //#region Subscriptions

    self.documentId.subscribe(nv => {
        self.overrideParameters(undefined);
    });

    self.languageId.subscribe(nv => {
        self.overrideParameters(undefined);
    });

    self.tradeAccountId.subscribe(function (newValue) {
        self.overrideParameters(undefined);
        self.validateNow(false);
        self.orderHeadId(undefined);
        self.transactionId(undefined);
        self.basketId(undefined);
    });

    self.transactionId.subscribe(function (newValue) {
        self.overrideParameters(undefined);
        self.validateNow(false);
        self.orderHeadId(undefined);
        self.basketId(undefined);
    });

    self.orderHeadId.subscribe(function (newValue) {
        self.overrideParameters(undefined);
        self.validateNow(false);
        self.basketId(undefined);
        self.transactionId(undefined);
    });

    self.basketId.subscribe(function (newValue) {
        self.overrideParameters(undefined);
        self.validateNow(false);
        self.orderHeadId(undefined);
        self.transactionId(undefined);
    });

    self.date.subscribe(nv => {
        self.overrideParameters(undefined);
        if (nv) {
            self.fetchDocument();
        }
    });

    self.documentOutputModeCode.subscribe(nv => {
        if (self.overrideParameters()) {
            self.overrideParameters(Object.assign({
                outputMode: nv
            }, self.overrideParameters()));
        }
    })

    //#endregion


    //#region Methods

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
            var data = $.extend(self.overrideParameters() ?? self.getData(), {
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

    self.fetchDocument = function (data, event) {

        console.log('fetchDocument', data, event);

        if (self.overrideParameters() === 'undefined') {
            self.validateNow(false);
            self.validateNow(true);
        }
        self.emailer.validateSendNow(false);
        window.setTimeout(function () {
            if (self.overrideParameters() === 'undefined' && self.errors().length) {
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

                var data = self.overrideParameters() ?? self.getData();

                let objJsonStr = JSON.stringify(data);

                let objJsonB64 = btoa(objJsonStr);

                self.fetchDocumentSendHistory();

                console.log('getDocumentEmailerProperties calling with', data);

                if (window.fetch) {
                    fetch('/api/documentsapi/GetDocumentEmailerProperties', {
                        method: 'POST',
                        headers: window.fetchHeaders,
                        body: JSON.stringify({ d: objJsonB64 })
                    })
                        .then(window.handleFetchResponse)
                        .then(data => {

                            console.log('getDocumentEmailerProperties returned', data);

                            self.emailer.to(data.EmailTo);
                            self.emailer.originalTo(data.EmailTo);

                            self.emailer.subject(data.EmailSubject);
                            self.emailer.originalSubject(data.EmailSubject);

                            self.emailer.body(data.EmailBody);
                            self.emailer.originalBody(data.EmailBody);
                        })
                        .catch(window.catchFetchError)

                    console.log('fetchDocument calling with', { d: objJsonB64 });

                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify({ d: objJsonB64 }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.BearerToken
                        }
                    })
                        .then(response => response.blob()) 
                    //.then(async response => {

                    //    const reader = response.body.getReader();

                    //    let pdfBytes = [];

                    //    while (true) {
                    //        const result = {
                    //            done, value
                    //        } = await reader.read();

                    //        if (!done) {

                    //        }
                    //    }

                    //    let result = {
                    //        done,
                    //        value
                    //    } = await reader.read();

                    //    var pdfBlob = new Blob([result.value]);

                    //    $('#document-iframe').remove();
                    //    $('#document-iframe-container').html(`<iframe src="${window.URL.createObjectURL(pdfBlob)}#view=fit" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%;" allowfullscreen></iframe>`);

                    //    self.showDocument(true);

                    //    result = {
                    //        done,
                    //        value
                    //    } = await reader.read();

                    //    var emailerJson = JSON.parse(Buffer.from(result.value).toString('utf8'));

                    //    console.log(emailerJson)

                    //    self.busy(false);
                    //    self.busyMessage(undefined);

                    //    //if (response.ok)
                    //    //    return response.blob();
                    //    //else
                    //    //    throw new error('Document not Found');
                    //    })
                    //.then(function (response) {
                    //    if (response.ok)
                    //        return response.blob();
                    //    else
                    //        throw new error('Document not Found');
                    //})
                    .then(function (blob) {
                        $('#document-iframe').remove();
                        $('#document-iframe-container').html(`<iframe src="${window.URL.createObjectURL(blob)}#view=fit" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%;" allowfullscreen></iframe>`);
                        self.showDocument(true);
                        self.busy(false);
                        self.busyMessage(undefined);
                    })
                    .catch(err => {
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
            date: self.date() ? self.date().toISOString() : null,
            outputMode: self.documentOutputModeCode()
        };
    }

    //#endregion


    //#region Computeds

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

        da = self.date

        let result = (d && (tid && (b || o || t))) || (d == 7 && da != null);

        return result;
    });

    self.link = ko.pureComputed(function () {

        let objJson = {
            documentType: self.documentId(),
            languageId: self.languageId(),
            tradeAccountId: self.tradeAccountId(),
            basketId: self.basketId(),
            transactionId: self.transactionId(),
            orderHeadId: self.orderHeadId(),
            date: self.date() ? self.date().toISOString() : null
        };

        if (self.overrideParameters() != null) {
            objJson = self.overrideParameters();
        }

        if (self.documentOutputModeCode()) {
            objJson.outputMode = self.documentOutputModeCode();
        }

        let objJsonB64 = btoa(JSON.stringify(objJson));

        return new URLSearchParams({
            d: objJsonB64
        }).toString();

    }, self);

    self.userLink = ko.pureComputed(function () {
        return window.location.origin + '/documents/view?' + self.link()?.replace(/%3D/gm, '=');
    }, self);

    self.renderDocument = ko.pureComputed(function () {
        return window.location.origin + `/documents/view/render?${(self.link()?.replace(/%3D/gm, '='))}`
    }, self);

    self.directDownloadLink = ko.pureComputed(function () {
        return window.location.origin + `/documents/view/download?${(self.link()?.replace(/%3D/gm, '='))}`
    }, self);

    self.adminLink = ko.pureComputed(function () {
        return window.location.origin + '/documents/preview?' + self.link()?.replace(/%3D/gm, '=')
    }, self);

    self.fetchLiveDocuments = ko.computed(() => {

        ko.ignoreDependencies(() => {
            self.busy(true);
        });

        let data = {
            documentId: self.documentId(),
            tradeAccountId: self.tradeAccountId(),
            languageId: self.languageId(),
            date: self.date(),
            outputMode: self.documentOutputModeCode()
        };

        console.log('FetchLiveDocuments calling with', data);

        fetch('/api/documentsapi/FetchDocumentList', {
            method: 'POST',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: window.fetchHeaders,
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('FetchLiveDocuments returned', data);
                ko.ignoreDependencies(() => {
                    self.liveDocuments(data.Results);
                    window.setTimeout(() => {
                        self.showDocument(false);
                    }, 0);
                    self.busy(false);
                });
            })
            .catch(err => {

                ko.ignoreDependencies(() => {
                    self.busy(false);
                });

                window.catchFetchError(err);
            })
    }, self)

    //#endregion


    //#region Events

    self.init = function () {
        if (typeof autoLoad == 'function')
            autoLoad.call(self);
    }

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

    self.copyDirectDownloadLink = function (e) {
        e.preventDefault();
        navigator.permissions.query({ name: "clipboard-write" }).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.writeText(self.directDownloadLink());
                $('#user-copied-ok').stop(false, false).fadeIn('fast');
                window.setTimeout(function () {
                    $('#user-copied-ok').stop(false, false).fadeOut('slow');
                }, 500);
            }
        });
    }

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

    //#endregion

}