const creditControlPerformanceViewModel = ({
    tradeAccountIdList,
    tradeAccountCodeList,
} = {
    tradeAccountIdList: ko.observableArray([]),
    tradeAccountCodeList: ko.observableArray([])
}) => {
    let self = {

    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.pods = ko.observableArray([]);

    self.records = ko.observableArray([]);

    self.selectedPod = ko.observable();

    self.tradeAccountIdList = tradeAccountIdList;

    self.tradeAccountCodeList = tradeAccountCodeList;

    //#endregion



    //#region Methods

    self.podClick = (pod, event) => {
        console.log('performance dashboardPod click', pod, event);
        if (self.selectedPod() === pod.PodHandle) {
            self.selectedPod(undefined);
        } else {
            self.selectedPod(pod.PodHandle);
        }
    }

    self.fetch = () => {
        self.busy(true);

        let data = {
            reportGrouping: self.reportGrouping() == '' ? null : self.reportGrouping(),
            currencyOrSterling: self.currencyOrSterling() == '' ? null : self.currencyOrSterling(),
            tradeAccountCodeList: self.tradeAccountCodeList().join(',')
        };

        console.log('fetchPerformance calling with', data);

        fetch("/api/CreditControlAPI/FetchAgedSalesLedger", {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('fetchPerformance returned', data);

                self.pods(data.Pods.map(p => creditControlClaimsBreakdownPodViewModel({
                    rec: p
                })));

                self.records(data.Records.map(p => creditControlClaimsBreakdownRecordViewModel({
                    rec: p
                })));

                self.busy(false);
            })
    }

    self.setTradeAccountDetails = ({ ids, codes }) => {
        self.tradeAccountIdList(ids);
        self.tradeAccountCodeList(codes);
    }
    
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