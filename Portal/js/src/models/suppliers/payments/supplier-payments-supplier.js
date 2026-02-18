const supplierRecord = ({
    rec,
    parentGridWidget
} = {
    rec: {},
    parentGridWidget: ko.observable()
}) => {
    let self = Object.assign({
        busy: ko.observable(false),
        gridWidget: parentGridWidget
    }, rec);

    self.productionStopped = ko.observable(rec.ProductionStopped);

    self.shippingStopped = ko.observable(rec.ShippingStopped);

    self.productionStoppedParams = {
        observable: self.productionStopped,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: self.busy
    };

    self.productionStopped.subscribe(nv => {
        let d = self.gridWidget().dataSource.data().find(d => d.SupplierCode == self.SupplierCode);
        d.set('ProductionStopped', nv);
    });
 
    self.shippingStoppedParams = {
        observable: self.shippingStopped,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: self.busy
    };

    self.shippingStopped.subscribe(nv => {
        let d = self.gridWidget().dataSource.data().find(d => d.SupplierCode == self.SupplierCode);
        d.set('ShippingStopped', nv);
    });

    return self;
}