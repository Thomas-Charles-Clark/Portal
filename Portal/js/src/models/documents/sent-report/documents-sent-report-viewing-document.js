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

    self.busy = parent.busy;

    self.iframeSrc = ko.observable();

    self.viewingDocumentLoaded = parent.viewingDocumentLoaded;

    //#endregion


    //#region Components



    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Computeds

    self.documentSrc = ko.computed(() => {
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



    //#endregion

    //#region Events



    //#endregion

    return self;
}