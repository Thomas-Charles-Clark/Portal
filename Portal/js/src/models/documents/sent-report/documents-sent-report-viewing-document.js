const documentsSentReportViewingDocumentViewModel = ({
    rec,
    parent
} = {
    rec: {},
    parent: {}
}) => {
    let self = Object.assign({

    }, rec);

    //#region Properties

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please wait...');

    self.iframeSrc = ko.observable();

    self.viewingDocumentLoaded = parent.viewingDocumentLoaded;

    self.emailerModalElement = document.querySelector('#emailer-modal');

    self.emailerModal = bootstrap.Modal.getOrCreateInstance(self.emailerModalElement);

    self.emailer = emailer({
        parent: self,
        sendLabel: 'Send <span class="bi bi-send ms-2"></span>'
    });

    self.emailer.subject(rec.Subject);

    self.emailer.to(rec.RecipientEmailAddress);

    self.refreshParent = parent.refresh;

    //#endregion


    //#region Components



    //#endregion


    //#region Subscriptions

    self.viewingDocumentLoaded.subscribe(nv => {
    })

    //#endregion


    //#region Computeds

    self.documentSrc = ko.computed(() => {
        self.emailerModal.show();
        self.busy(true);
        fetch(`/api/documentsapi/loadDocumentFromFile?filePath=${encodeURIComponent(self.FilePath)}`, {
            method: 'GET',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin'
        })
            .then(response => {
                return response.blob();
            })
            .then(data => {
                self.iframeSrc(URL.createObjectURL(data));

                let iframe = document.createElement('iframe');

                iframe.src = self.iframeSrc();
                
                iframe.onload = () => {
                    console.log('iframe onload fired');
                    self.busy(false);
                }

                document.querySelector('#viewing-document-wrapper').innerHTML = '';

                document.querySelector('#viewing-document-wrapper').appendChild(iframe);

                self.viewingDocumentLoaded(true);
            })
            .catch(err => {
                window.catchFetchError(err);
                self.busy(false);
            })
    }, self);

    //#endregion


    //#region Methods

    self.getData = () => {
        return {
            basketId: self.BasketID,
            orderHeadId: self.OrderHeadID,
            transactionId: self.TransactionID,
            tradeAccountId: self.TradeAccountID,
            documentId: self.DocumentID,
            documentTypeHeader: self.Document,
            filePath: self.FilePath
        };
    }

    self.sendDocument = function () {
        self.emailer.validateSendNow(true);
        if (self.emailer.emailErrors().length) {
            self.emailer.emailErrors.filter(function (x) {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            self.busy(true);
            self.busyMessage('Emailing to ' + self.emailer.to() + '...');
            var data = $.extend(self.getData(), {
                recipient: self.emailer.to(),
                replyTo: self.emailer.replyTo(),
                subject: self.emailer.subject(),
                body: self.emailer.body()
            });

            fetch('/api/documentsapi/emailDocumentFromPath', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-cache',
                credentials: 'same-origin',
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
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

                    self.refreshParent();
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                })
        }
    }

    self.emailer.send = self.sendDocument;

    //#endregion

    //#region Events



    //#endregion

    return self;
}