var orderImportViewModel = ({ parent } = {}) => function () {
    var self = {};

    //#region Properties

    self.parent = parent;

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable(undefined);

    self.widget = ko.observable();

    self.enabled = ko.observable(true);

    self.uploader = {
        widget: self.widget,
        enabled: self.enabled,
        async: {
            autoUpload: false,
            saveUrl: '/api/orderimport/UploadOrderFile',
        },
        upload: function (e) {
            console.log(e);
            self.busyMessage('Uploading...');
            self.busy(true);
            var xhr = e.XMLHttpRequest;
            xhr.addEventListener("readystatechange", function (e) {
                if (xhr.readyState == 1 /* OPENED */) {
                    xhr.setRequestHeader('Authorization', "Bearer " + localStorage.BearerToken);
                }
            });
        },
        error: function (e) {

            var alertObj = {
                responseText: 'Sorry, an error occurred.'
            };

            if (e.XMLHttpRequest && e.XMLHttpRequest.responseText)
                alertObj.responseText += '<br/><br/>' + JSON.parse(e.XMLHttpRequest.responseText).ExceptionMessage + '<br/><br/>';

            alertObj.responseText += 'Please try again or contact <a mailto="itsupport@designersguild.com" target="_blank">itsupport@designersguild.com</a>';

            $.showError(alertObj, '', '');

            self.busy(false);
        },
        validation: {
            allowedExtensions: ['.csv']
        },
        success: function () {
            self.busy(false);
            $.info('Thank you', 'Your file(s) have been uploaded successfully. You will receive an email about the receipt each of the the files you have uploaded, and any errors encountered during processing will generate and send emails to you as appropriate.');
        }
    }

    //#endregion

    //#region Computeds (Knockout-specific)



    //#endregion

    //#region Components (Knockout-specific)



    //#endregion

    //#region Subscriptions (Knockout-specific)



    //#endregion

    //#region Validation Groups (Knockout-specific)

    self.errors = ko.validation.group([

    ]);

    //#endregion

    //#region Functions

    self.reset = function () {
        console.log('basicFactory reset called', self);
        self.errors.showAllMessages(false);
    }

    self.downloadExampleCSV = function () {
        if (window.fetch) {
            const url = '/api/tradeapi/downloadexamplecsv';
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                return response.blob();
            }).then(function (blob) {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'Example.csv';
                link.click();
            });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/api/tradeapi/downloadexamplecsv', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('load', function () {
                if (xhr.status === 200) {
                    var blob = new Blob([xhr.response]);
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'Example.csv';
                    link.click();
                } else {
                    console.error(xhr.response);
                }
            })
            xhr.send(JSON.stringify(data));
        }
    }

    //#endregion

    //#region Events



    //#endregion

    return self;
}();