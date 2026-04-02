const creditControlPaymentsHistoryRecordViewModel = ({
    rec
} = {
        rec: {}
}) => {
    let self = Object.assign({

    }, rec);

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait');

    self.popoverInsertion = async function (event) {
        window.setTimeout(() => {
            document.addEventListener("click", (e) => {
                if (e.target.closest('.info-popover') == null) {
                    document.querySelectorAll('[data-bind*="actualBootstrapPopover"]').forEach(e => {
                        let p = bootstrap.Popover.getInstance(e);
                        if (p) {
                            p.hide();
                        }
                    });
                }
            });
        }, 0);
    }

    self.fullErrorDetails = {
        title: "Error Details",
        html: true,
        sanitize: false,
        busy: ko.observable(false),
        data: ko.observable(),
        element: ko.observable(),
        placement: 'left',
        customClass: 'info-popover payment-error-details',
        content: (element) => {
            let e = ko.dataFor(element);
            if (e.FullErrorDetails) {
                return `<pre class="prettyprint linenums dark-bg">${PR.prettyPrintOne(e.FullErrorDetails)}</pre>`
            }
        },
        trigger: 'click',
        solo: true,
        show: null,
        shown: (e) => {

        },
        hide: null,
        hidden: null,
        inserted: self.popoverInsertion,
        popperConfig: (defaultPopperConfig) => defaultPopperConfig
    };

    //#endregion



    //#region Components

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods



    //#endregion



    //#region Events



    //#endregion


    return self;
};