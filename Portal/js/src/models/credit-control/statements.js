const statementsViewModel = (() => {
    let self = {};

    //#region Properties

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please wait...');

    self.validateNow = ko.observable(false);

    self.filters = statementsFiltersViewModel({
        parent: self
    });

    self.sendResponse = ko.observable();

    //#endregion

    //#region Lifted Methods

    self.genericUnsavedChangesClear = (e) => {
        self.checkUnsavedChangesThenClear(e);
    }

    self.checkUnsavedChangesThenClear = async (options) => {
        await self.unsavedChanges().then(() => {
            var self = options; // self is now the params of the control the user just interacted with

            if (ko.isObservableArray(self.observable)) {
                self.observable([]);
            } else {
                self.observable(EMPTY_STRING);
            }

            if (self.dropDownListSettings.widget()) {

                if (ko.isObservableArray(self.observable)) {
                    self.dropDownListSettings.widget().value([]);
                } else {
                    self.dropDownListSettings.widget().value(EMPTY_STRING);
                }

                self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.getDefaultFoundation().adapter_.closeOutline();

                if (self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_ != null)
                    self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_.float(false);
            }

            if (typeof self.afterClear === 'function') {
                self.afterClear();
            }

        }).catch((e) => { });
    }

    self.unsavedChanges = () => {
        return new Promise((resolve, reject) => {

            let array = [];

            let unsaved = false; // array.find(p => p.unsavedChanges());

            if (unsaved) {
                window.showConfirm('Unsaved changes', 'You have unsaved changes. If you proceed your changes will be lost. Proceed?', () => {
                    resolve();
                }, () => {
                    reject();
                });
            } else {
                resolve();
            }
        });
    }

    //#endregion


    //#region Components


    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Computeds



    //#endregion


    //#region Methods

    self.init = () => {

    }

    self.getParameters = () => {

        let data = {
            date: typeof self.filters.date() == 'object' ? self.filters.date().toUTCString() : self.filters.date(),
            tradeAccountId: self.filters.tradeAccountId()
        }

        return data;
    }

    self.sendStatements = (data, event) => {

        self.filters.validateNow(true);

        if (self.filters.errors().length) {
            self.filters.errors.showAllMessages(true);
            self.filters.errors.forEach(x => {
                x.isValid.notifySubscribers(x.isValid());
            })
        } else {
            window.showConfirm('Are you sure?', 'This might send Statement PDF(s)', () => {
                self.busy(true);

                let data = self.getParameters();

                console.log('calling sendStatements with', data);

                fetch('/api/StatementsAPI/SendStatements', {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        self.busy(false);
                        self.sendResponse(data.Response);
                    })
                    .catch(err => {
                        self.busy(false);
                        window.catchFetchError(err);
                    });
            }, () => {

            });
        }
    }

    self.refresh = () => {
        console.log('refresh called');
    }

    //#endregion

    //#region Events



    //#endregion

    return self;
});