const creditControlStatementsRecordViewModel = ({
    preselected,
    rec
} = {
        preselected: false,
        rec: {}
    }) => {
    let self = Object.assign({
        selected: ko.observable(preselected)
    }, rec);

    self.popoverInsertion = async function(event) {
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

    self.selectedCheckboxParams = {
        checkboxId: `${self.TradeAccountCode}-selected`,
        observable: self.selected,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: self.busy,
    }

    //self.creditsPopoverInfo = {
    //    title: "Credits Info",
    //    html: true,
    //    sanitize: false,
    //    busy: ko.observable(false),
    //    data: ko.observable(),
    //    element: ko.observable(),
    //    placement: 'left',
    //    customClass: 'info-popover credits',
    //    content: (element) => {
    //        let e = ko.dataFor(element);
    //        return `${e.CreditsInfo}`;
    //    },
    //    trigger: 'click',
    //    solo: true,
    //    show: null,
    //    shown: (e) => {

    //    },
    //    hide: null,
    //    hidden: null,
    //    inserted: self.popoverInsertion,
    //    popperConfig: (defaultPopperConfig) => defaultPopperConfig
    //};

    //#endregion



    //#region Methods



    //#endregion



    //#region Components



    //#endregion



    //#region Computeds



    //#endregion





    //#region Subscriptions



    //#endregion



    //#region Events



    //#endregion


    return self;
};