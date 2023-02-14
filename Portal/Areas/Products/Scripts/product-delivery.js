const DEFAULT_DELIVERY_MODE_VIEW = 0,
      DEFAULT_DELIVERY_MODE_EDIT = 1

var productDeliveryBaseViewModel = function () {
    var self = this;

    //#region Properties

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Busy...');

    self.defaultDeliveryServicesBusy = ko.observable(false);

    self.defaultDeliveryServices = ko.observableArray([]);

    self.originCountryId = ko.observable(81);

    self.originCountry = ko.observable();

    self.newDefaultDeliveryService = defaultDeliveryServiceGroupObject({
        record: {
            deliveryHashServices: ko.observableArray([defaultDeliveryServiceObject({
                record: {}
            })])
        }
    });

    self.newDefaultDeliveryService.originCountryId(self.originCountryId());
    self.newDefaultDeliveryService.parent = self;

    self.originCountryDropDownList = kendoMDCDropDownList({
        label: 'Origin Country',
        endPoint: '/api/ComponentAPI/GetCountries',
        textField: 'Name',
        valueField: 'CountryID',
        idObservable: self.originCountryId,
        objObservable: self.originCountry,
        height: 300,
        showClear: true,
        additionalParams: {
            includeEU: true
        }
    });

    self.destinationCountryId = ko.observable();

    self.destinationCountry = ko.observable();

    self.destinationCountryDropDownList = kendoMDCDropDownList({
        label: 'Destination Country',
        endPoint: '/api/ComponentAPI/GetCountries',
        textField: 'Name',
        valueField: 'CountryID',
        idObservable: self.destinationCountryId,
        objObservable: self.destinationCountry,
        height: 300,
        additionalParams: {
            includeEU: true
        }
    });

    self.deliveryGroupId = ko.observable();

    self.deliveryGroup = ko.observable();

    self.deliveryGroupDropDownList = kendoMDCDropDownList({
        label: 'Delivery Group',
        endPoint: '/api/ComponentAPI/GetDeliveryGroups',
        textField: 'Name',
        valueField: 'DeliveryGroupListID',
        idObservable: self.deliveryGroupId,
        objObservable: self.deliveryGroup,
        height: 300
    });

    self.deliveryZoneFactory = deliveryZoneFactory({
        parent: self,
        destinationCountry: self.destinationCountry
    });

    self.deliveryGroupFactory = deliveryGroupFactory({
        parent: self
    });

    //#endregion

    //#region Functions

    self.forceReload = function () {
        self.originCountryId.valueHasMutated();
    }

    self.createDeliveryGroup = function () {
        self.deliveryGroupFactory.load({});
    }

    self.fetchDefaultDeliveryServices = function (data) {
        self.defaultDeliveryServicesBusy(true);
        //console.log('fetchDefaultDeliveryServices calling with', data);
        $.ajax({
            url: '/api/ProductDeliveryAPI/FetchDefaultDeliveryServices',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                //console.log('fetchDefaultDeliveryServices returned', data);

                self.defaultDeliveryServicesBusy(false);

                var groupedDefaultDeliveryServices = self.groupDefaultDeliveryServicesByOriginCountry(data);

                self.defaultDeliveryServices(groupedDefaultDeliveryServices);

                //console.log('defaultDeliveryServices', self.defaultDeliveryServices());
            },
            error: function (xhr, s, a) {
                self.defaultDeliveryServicesBusy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.groupDefaultDeliveryServicesByOriginCountry = function (data) {
        var defaultDeliveryServicesByOriginCountry = Enumerable.From(data).GroupBy(
            function (defaultDeliveryService) {
                return {
                    originCountryId: defaultDeliveryService.OriginCountryID,
                    originCountry: defaultDeliveryService.OriginCountry
                }
            },
            function (groupedByOriginCountry) {
                return groupedByOriginCountry;
            },
            function (originCountry, defaultDeliveryServices) {
                var grouping = {
                    originCountry: $.extend(originCountry, {
                        visible: ko.observable(true),
                        expandable: ko.observable(true)
                    }),
                    originCountryServices: self.groupDefaultDeliveryServicesByDestinationCountry(defaultDeliveryServices.source)
                }
                return grouping;
            },
            function (groupedByOriginCountry) {
                return groupedByOriginCountry.originCountryId
            }).ToArray();

        if (defaultDeliveryServicesByOriginCountry.length == 1) {
            defaultDeliveryServicesByOriginCountry[0].originCountry.visible(true);
            defaultDeliveryServicesByOriginCountry[0].originCountry.expandable(false);
        }

        return defaultDeliveryServicesByOriginCountry;
    }

    self.groupDefaultDeliveryServicesByDestinationCountry = function (data) {
        var defaultDeliveryServicesByDestinationCountry = Enumerable.From(data).GroupBy(
            function (defaultDeliveryService) {
                return {
                    destinationCountryId: defaultDeliveryService.DestinationCountryID,
                    destinationCountry: defaultDeliveryService.DestinationCountry
                }
            },
            function (groupedByDestinationCountry) {
                return groupedByDestinationCountry;
            },
            function (destinationCountry, defaultDeliveryServices) {
                var grouping = {
                    destinationCountry: $.extend(destinationCountry, {
                        visible: ko.observable(false),
                        expandable: ko.observable(true)
                    }),
                    destinationCountryServices: self.groupDefaultDeliveryServicesByDeliveryZone(defaultDeliveryServices.source)
                }
                return grouping;
            },
            function (groupedByDestinationCountry) {
                return groupedByDestinationCountry.destinationCountryId
            }).ToArray();

        if (defaultDeliveryServicesByDestinationCountry.length == 1) {
            defaultDeliveryServicesByDestinationCountry[0].destinationCountry.visible(true);
            defaultDeliveryServicesByDestinationCountry[0].destinationCountry.expandable(false);
        }

        return defaultDeliveryServicesByDestinationCountry;
    }

    self.groupDefaultDeliveryServicesByDeliveryZone = function (data) {
        var defaultDeliveryServicesByZone = Enumerable.From(data).GroupBy(
            function (defaultDeliveryService) {
                return {
                    deliveryZoneId: defaultDeliveryService.DestinationDeliveryZoneID,
                    deliveryZone: defaultDeliveryService.DestinationDeliveryZone
                }
            },
            function (groupedByDeliveryZone) {
                return groupedByDeliveryZone;
            },
            function (deliveryZone, defaultDeliveryServices) {
                var grouping = {
                    deliveryZone: $.extend(deliveryZone, {
                        visible: ko.observable(false),
                        expandable: ko.observable(true),
                        creatingNewDefaultDeliveryService: ko.observable(false),
                        additionalDefaultDeliveryService: defaultDeliveryServiceGroupObject({
                            record: {
                                deliveryHashServices: ko.observableArray([defaultDeliveryServiceObject({
                                    record: {}
                                })])
                            }
                        })
                    }),
                    deliveryZoneServices: self.groupDefaultDeliveryServicesByDeliveryGroup(defaultDeliveryServices.source)
                }
                grouping.deliveryZone.creatingNewDefaultDeliveryService.subscribe(function (newValue) {
                    if (newValue) {
                        grouping.deliveryZone.additionalDefaultDeliveryService.originCountryId(self.originCountryId());
                        grouping.deliveryZone.additionalDefaultDeliveryService.destinationCountryId(self.destinationCountryId());
                    } else {
                        grouping.deliveryZone.additionalDefaultDeliveryService.cancel();
                        grouping.deliveryZone.additionalDefaultDeliveryService.deliveryHashServices.remove(function (dhs) {
                            return dhs.DefaultDeliveryServiceID == null;
                        });
                        ko.utils.arrayForEach(grouping.deliveryZone.additionalDefaultDeliveryService.deliveryHashServices(), function (dhs) {
                            dhs.cancel();
                        });
                    }
                });
                return grouping;
            },
            function (groupedByDeliveryZone) {
                return groupedByDeliveryZone.deliveryZoneId
            }).OrderBy(function (deliveryZoneGrouping) {
                return deliveryZoneGrouping.deliveryZone.deliveryZoneId
            }).ToArray();

        if (defaultDeliveryServicesByZone.length == 1) {
            defaultDeliveryServicesByZone[0].deliveryZone.visible(true);
            defaultDeliveryServicesByZone[0].deliveryZone.expandable(false);
        }

        return defaultDeliveryServicesByZone;
    }

    self.groupDefaultDeliveryServicesByDeliveryGroup = function (data) {
        var defaultDeliveryServicesByDeliveryGroup = Enumerable.From(data).GroupBy(
            function (defaultDeliveryService) {
                return {
                    deliveryGroupId: defaultDeliveryService.DeliveryGroupListID,
                    deliveryGroup: defaultDeliveryService.DeliveryGroup
                }
            },
            function (groupedByDeliveryZone) {
                return groupedByDeliveryZone;
            },
            function (deliveryGroup, defaultDeliveryServices) {
                var deliveryGroupedServices = $.map(self.groupDefaultDeliveryServicesByHash(defaultDeliveryServices.source), function (deliveryGroup) {
                    return defaultDeliveryServiceGroupObject({
                        record: deliveryGroup
                    });
                });

                $.map(deliveryGroupedServices, function (deliveryGroupedService) {
                    $.map(deliveryGroupedService.deliveryHashServices(), function (deliveryHashService) {
                        deliveryHashService.parent(deliveryGroupedService);
                    })
                });

                var grouping = {
                    deliveryGroup: deliveryGroup,
                    deliveryGroupServices: deliveryGroupedServices
                }
                return grouping;
            },
            function (groupedByDeliveryZone) {
                return groupedByDeliveryZone.deliveryGroupId
            }).OrderBy('$.deliveryGroup.deliveryGroupId').ToArray();

        return defaultDeliveryServicesByDeliveryGroup;
    }

    self.groupDefaultDeliveryServicesByHash = function (data, parent) {
        var groupedDefaultDeliveryServices = Enumerable.From(data).GroupBy(
            function (defaultDeliveryService) {
                return {
                    hash: defaultDeliveryService.DefaultDeliveryServiceHash,
                    view: ko.observable(DEFAULT_DELIVERY_MODE_VIEW),
                    edit: function () {
                        this.view(DEFAULT_DELIVERY_MODE_EDIT)
                    }
                }
            },
            function (groupedByHash) {
                return groupedByHash;
            },
            function (deliveryServiceHash, defaultDeliveryServices) {
                var grouping = {
                    hash: deliveryServiceHash,
                    removedHashServiceIds: ko.observableArray([]),
                    deliveryHashServices: ko.observableArray(Enumerable.From($.map(defaultDeliveryServices.source, function (defaultDeliveryService) {
                        return defaultDeliveryServiceObject({
                            record: defaultDeliveryService
                        });
                    })).OrderBy('$.ThresholdMinimum').ToArray())
                }
                grouping.cancelEdit = function () {
                    $.confirm('Unsaved Changes Warning', 'Any unsaved changes will be lost. Are you sure you want to cancel?', function () {
                        grouping.cancel();
                        grouping.deliveryHashServices.remove(function (dhs) {
                            return dhs.DefaultDeliveryServiceID == null;
                        });
                        ko.utils.arrayForEach(grouping.deliveryHashServices(), function (dhs) {
                            dhs.cancel();
                        });
                        grouping.hash.view(DEFAULT_DELIVERY_MODE_VIEW);
                    }, function () {

                    })
                }
                grouping.addDefaultDeliveryService = function () {
                    var addition = defaultDeliveryServiceObject();
                    addition.parent(grouping);
                    grouping.deliveryHashServices.push(addition);
                }
                grouping.removeDeliveryHashService = function (data) {
                    $.confirm('Are you sure?', 'This will remove the price point from the screen. Once saved, this cannot be undone.', function () {
                        if (data.DefaultDeliveryServiceID)
                            grouping.removedHashServiceIds.push(data.DefaultDeliveryServiceID)
                        grouping.deliveryHashServices.remove(data);
                    }, null);
                }
                return grouping;
            },
            function (groupedByHash) {
                return groupedByHash.hash
            }).ToArray();

        return groupedDefaultDeliveryServices;
    }

    self.editDeliveryGroup = function (deliveryGroup) {
        self.deliveryGroupFactory.load(deliveryGroup);
    }

    self.reset = function () {
        console.log('productDeliveryBaseViewModel reset called');
        self.originCountryId(undefined);
        self.destinationCountryId(undefined);
        self.deliveryGroupId(undefined);
        self.defaultDeliveryServices([]);
        self.defaultDeliveryServicesBusy(false);
        self.errors.showAllMessages(false);
    }

    //#endregion

    //#region Computeds

    self.prefilterComputed = ko.computed(function () {
        var prefilterData = {
            originCountryId: self.originCountryId(),
            destinationCountryId: self.destinationCountryId(),
            deliveryGroupListId: self.deliveryGroupId()
        }
        //console.log('prefilterComputed evaluated', prefilterData);
        self.fetchDefaultDeliveryServices(prefilterData);
    }, {
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 300
        }
    });

    self.defaultDeliveryServicesDisplayReady = ko.pureComputed(function () {
        return self.defaultDeliveryServices().length > 0;
    });

    self.reloadDeliveryZones = function () {
        console.log('reloadDeliveryZones');
    }

    self.reloadDeliveryGroups = function () {
        console.log('reloadDeliveryGroups');
    }

    //#endregion

    //#region Components

    self.fulfilmentTypeId = ko.observable();

    self.fulfilmentTypeId.subscribe(function (newValue) {
        if (self.alternateDeliveryServicesGridSettings.widget()) {
            self.alternateDeliveryServicesGridSettings.widget().dataSource.read();
        }
    });

    self.fulfilmentTypeDropDownList = kendoMDCDropDownList({
        label: 'Fulfilment Type',
        endPoint: '/api/ProductDeliveryAPI/GetFulfilmentTypes',
        textField: 'Name',
        valueField: 'FulfilmentTypeID',
        idObservable: self.fulfilmentTypeId,
        height: 300,
        permitRevert: true
    });

    self.alternativeDeliveryGroupId = ko.observable();

    self.alternativeDeliveryGroupId.subscribe(function (newValue) {
        if (self.alternateDeliveryServicesGridSettings.widget()) {
            self.alternateDeliveryServicesGridSettings.widget().dataSource.read();
        }
    });

    self.alternativeDeliveryGroupDropDownList = kendoMDCDropDownList({
        label: 'Delivery Group',
        endPoint: '/api/ComponentAPI/GetDeliveryGroups',
        textField: 'Name',
        valueField: 'DeliveryGroupListID',
        idObservable: self.alternativeDeliveryGroupId,
        height: 300,
        permitRevert: true
    });

    self.deliveryChargingLogicEditor = function (container, options) {
        $('<input name="' + options.field + '" />')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            optionLabel: ' ',
            dataTextField: "Name",
            dataValueField: "DeliveryChargingLogicID",
            dataSource: {
                serverFiltering: true,
                serverSorting: true,
                serverGrouping: true,
                schema: $.extend({}, kendo.data.schemas.webapi, {
                    data: "Data",
                    total: "Total",
                    filters: "Filters",
                    aggregates: "Aggregates",
                    errors: "Errors"
                }),
                transport: {
                    read: function (options) {
                        var webapi = new kendo.data.transports.webapi({ prefix: "" });
                        var mapped = webapi.parameterMap(options.data);
                        var data = {};
                        for (var propertyName in mapped) {
                            data[propertyName] = mapped[propertyName];
                        }
                        $.ajax({
                            url: '/api/ProductDeliveryAPI/GetDeliveryChargingLogics',
                            type: "GET",
                            data: data,
                            success: function (data) {
                                options.success(data);
                            },
                            error: function (data) {
                                options.error();
                            }
                        });
                    }
                }
            }
        });
    }

    self.salesMarketEditor = function (container, options) {
        $('<input name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataTextField: "Name",
                dataValueField: "SalesMarketID",
                optionLabel: ' ',
                dataSource: {
                    serverFiltering: true,
                    serverSorting: true,
                    serverGrouping: true,
                    schema: $.extend({}, kendo.data.schemas.webapi, {
                        data: "Data",
                        total: "Total",
                        filters: "Filters",
                        aggregates: "Aggregates",
                        errors: "Errors"
                    }),
                    transport: {
                        read: function (options) {
                            var webapi = new kendo.data.transports.webapi({ prefix: "" });
                            var mapped = webapi.parameterMap(options.data);
                            var data = {};
                            for (var propertyName in mapped) {
                                data[propertyName] = mapped[propertyName];
                            }
                            $.ajax({
                                url: '/api/ProductDeliveryAPI/GetSalesMarkets',
                                type: "GET",
                                data: data,
                                success: function (data) {
                                    options.success(data);
                                },
                                error: function (data) {
                                    options.error();
                                }
                            });
                        }
                    }
                }
            });
    };

    self.fulfilmentTypeEditor = function (container, options) {
        $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataTextField: "Name",
                dataValueField: "FulfilmentTypeID",
                optionLabel: ' ',
                dataSource: {
                    serverFiltering: true,
                    serverSorting: true,
                    serverGrouping: true,
                    schema: $.extend({}, kendo.data.schemas.webapi, {
                        data: "Data",
                        total: "Total",
                        filters: "Filters",
                        aggregates: "Aggregates",
                        errors: "Errors"
                    }),
                    transport: {
                        read: function (options) {
                            var webapi = new kendo.data.transports.webapi({ prefix: "" });
                            var mapped = webapi.parameterMap(options.data);
                            var data = {};
                            for (var propertyName in mapped) {
                                data[propertyName] = mapped[propertyName];
                            }
                            $.ajax({
                                url: '/api/ProductDeliveryAPI/GetFulfilmentTypes',
                                type: "GET",
                                data: data,
                                success: function (data) {
                                    options.success(data);
                                },
                                error: function (data) {
                                    options.error();
                                }
                            });
                        }
                    }
                }
            });
    };

    self.deliveryGroupEditor = function (container, options) {
        $('<input name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataTextField: "Name",
                dataValueField: "DeliveryGroupID",
                optionLabel: ' ',
                dataSource: {
                    serverFiltering: true,
                    serverSorting: true,
                    serverGrouping: true,
                    schema: $.extend({}, kendo.data.schemas.webapi, {
                        data: "Data",
                        total: "Total",
                        filters: "Filters",
                        aggregates: "Aggregates",
                        errors: "Errors"
                    }),
                    transport: {
                        read: function (options) {
                            var webapi = new kendo.data.transports.webapi({ prefix: "" });
                            var mapped = webapi.parameterMap(options.data);
                            var data = {};
                            for (var propertyName in mapped) {
                                data[propertyName] = mapped[propertyName];
                            }
                            $.ajax({
                                url: '/api/ProductDeliveryAPI/GetDeliveryGroupsDataSource',
                                type: "GET",
                                data: data,
                                success: function (data) {
                                    options.success(data);
                                },
                                error: function (data) {
                                    options.error();
                                }
                            });
                        }
                    }
                }
            });
    };

    self.deliverToDGPremisesEditor = function (container, options) {
        var guid = kendo.guid();
        $('<input class="k-checkbox" id="' + guid + '" type="checkbox" name="DeliverToDGPremisesOnly" data-type="boolean" data-bind="checked:DeliverToDGPremisesOnly">').appendTo(container);
        $('<label class="k-checkbox-label" for="' + guid + '">&#8203;</label>').appendTo(container);
    }

    self.alternateDeliveryServicesGridSettings = {
        autoBind: true,
        widget: ko.observable(),
        //useKOTemplates: true,
        //rowTemplate: 'alternative-delivery-row-template',
        //editTemplate: 'alternative-delivery-edit-template',
        columns: [{
            field: 'AlternateDeliveryServiceID',
            Name: 'ID'
        }, {
            field: 'ServiceName',
            title: 'Name'
        }, {
            field: 'Charge',
            title: 'Charge',
            attributes: {
                css: {
                    'class' : 'text-right'
                }
            }
        }, {
            field: 'DeliveryChargingLogic',
            title: 'Charging Logic',
            template: '#=DeliveryChargingLogic ? DeliveryChargingLogic.Name : ""#',
            editor: self.deliveryChargingLogicEditor
        }, {
            field: 'SalesMarket',
            title: 'Sales Market',
            template: '#=SalesMarket ? SalesMarket.Name : ""#',
            editor: self.salesMarketEditor
        }, {
            field: 'FulfilmentType',
            title: 'Fulfilment Type',
            template: '#=FulfilmentType ? FulfilmentType.Name : ""#',
            editor: self.fulfilmentTypeEditor
        }, {
            field: 'DeliveryGroup',
            title: 'Delivery Group',
            template: '#=DeliveryGroup ? DeliveryGroup.Name : ""#',
            editor: self.deliveryGroupEditor
        }, {
            field: 'DeliverToDGPremisesOnly',
            title: 'Delivery Only to DG Premises',
            editor: self.deliverToDGPremisesEditor
        }, {
            field: 'HAULCODE',
            title: 'HAULCODE'
        }, {
            field: 'CARRCODE',
            title: 'CARRCODE'
        }, {
            field: 'MertexCurrencyCode',
            title: 'Mertex Currency Code'
        }, {
            command: ["destroy"]
        }],
        editable: true,
        toolbar: ["create", "save", "cancel"],
        data: new kendo.data.DataSource({
            transport: {
                read: function (options) {

                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var params = webapi.parameterMap(options.data);

                    var data = {
                        fulfilmentTypeId: self.fulfilmentTypeId() ? self.fulfilmentTypeId() : null,
                        deliveryGroupListId: self.alternativeDeliveryGroupId() ? self.alternativeDeliveryGroupId() : null
                    };

                    for (var propertyName in params) {
                        data[propertyName] = params[propertyName];
                    }

                    //console.log('calling getAlternativeDeliveryServices with', data);

                    $.ajax({
                        url: '/api/ProductDeliveryAPI/GetAlternateDeliveryServices',
                        type: 'GET',
                        dataType: 'json',
                        data: data,
                        success: function (data) {
                            //console.log('getAlternativeDeliveryServices returned', data);
                            options.success(data);
                        },
                        error: function (xhr, s, a) {
                            $.showError(xhr, s, a);
                        }
                    });
                },
                update: function (options) {

                    //console.log('calling updateAlternativeDeliveryServices with', options.data);

                    ko.utils.arrayForEach(options.data.models, function (item) {
                        if (item.SalesMarket != null) {
                            item.SalesMarketID = item.SalesMarket.SalesMarketID;
                        } else {
                            item.SalesMarketID = null;
                        }
                        if (item.FulfilmentType != null) {
                            item.FulfilmentTypeID = item.FulfilmentType.FulfilmentTypeID;
                        } else {
                            item.FulfilmentTypeID = null;
                        }
                        if (item.DeliveryGroup != null) {
                            item.DeliveryGroupID = item.DeliveryGroup.DeliveryGroupID;
                        } else {
                            item.DeliveryGroupID = null;
                        }
                        if (item.DeliveryChargingLogic != null) {
                            item.DeliveryChargingLogicID = item.DeliveryChargingLogic.DeliveryChargingLogicID;
                        } else {
                            item.DeliveryChargingLogicID = null;
                        }
                    })

                    $.ajax({
                        url: '/api/ProductDeliveryAPI/UpdateAlternativeDeliveryServices',
                        type: 'POST',
                        dataType: 'json',
                        data: options.data,
                        success: function (data) {
                            //console.log('updateAlternativeDeliveryServices returned', data);
                            options.success(data);
                        },
                        error: function (xhr, s, a) {
                            $.showError(xhr, s, a);
                        }
                    });
                },
                create: function (options) {
                    //console.log('calling createAlternativeDeliveryServices with', options.data);

                    ko.utils.arrayForEach(options.data.models, function (item) {
                        if (item.SalesMarket != null) {
                            item.SalesMarketID = item.SalesMarket.SalesMarketID;
                        } else {
                            item.SalesMarketID = null;
                        }
                        if (item.FulfilmentType != null) {
                            item.FulfilmentTypeID = item.FulfilmentType.FulfilmentTypeID;
                        } else {
                            item.FulfilmentTypeID = null;
                        }
                        if (item.DeliveryGroup != null) {
                            item.DeliveryGroupID = item.DeliveryGroup.DeliveryGroupID;
                        } else {
                            item.DeliveryGroupID = null;
                        }
                        if (item.DeliveryChargingLogic != null) {
                            item.DeliveryChargingLogicID = item.DeliveryChargingLogic.DeliveryChargingLogicID;
                        } else {
                            item.DeliveryChargingLogicID = null;
                        }
                    })

                    $.ajax({
                        url: '/api/ProductDeliveryAPI/UpdateAlternativeDeliveryServices',
                        type: 'POST',
                        dataType: 'json',
                        data: options.data,
                        success: function (data) {
                            //console.log('createAlternateDeliveryServices returned', data);
                            options.success(data);
                        },
                        error: function (xhr, s, a) {
                            $.showError(xhr, s, a);
                        }
                    });
                },
                destroy: function (options) {
                    //console.log('calling deleteAlternativeDeliveryServices with', options.data);

                    $.ajax({
                        url: '/api/ProductDeliveryAPI/DeleteAlternativeDeliveryServices',
                        type: 'POST',
                        dataType: 'json',
                        data: options.data,
                        success: function (data) {
                            //console.log('deleteAlternativeDeliveryServices returned', data);
                            options.success(data);
                        },
                        error: function (xhr, s, a) {
                            $.showError(xhr, s, a);
                        }
                    });
                },
            },
            pageSize: 10,
            serverPaging: true,
            serverSorting: false,
            serverFiltering: false,
            autoSync: false,
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                aggregates: "AggregateResults",
                model: {
                    id: 'AlternateDeliveryServiceID',
                    fields: {
                        AlternateDeliveryServiceID: { editable: false, nullable: true },
                        ServiceName: { validation: { required: true } },
                        Charge: { type: 'number', validation: { required: false, nullable: true } },
                        DeliveryChargingLogic: {
                            type: 'object',
                            validation: {
                                required: false
                            },
                            defaultValue: {
                                DeliveryChargingLogicID: '',
                                Name: ''
                            }
                        },
                        FulfilmentType: {
                            type: 'object',
                            validation: {
                                required: true,
                                min: 1
                            },
                            defaultValue: {
                                FulfilmentTypeID: '',
                                Name: ''
                            }
                        },
                        SalesMarket: {
                            type: 'object',
                            nullable: true,
                            required: false,
                            validation: {
                                required: false
                            },
                            defaultValue: {
                                SalesMarketID: '',
                                Name: ''
                            },
                        },
                        DeliveryGroup: {
                            type: 'object',
                            nullable: true,
                            validation: {
                                required: false
                            },
                            defaultValue: {
                                DeliveryGroupID: '',
                                Name: ''
                            }
                        },
                        DeliverToDGPremisesOnly: { type: 'boolean', validation: {  } },
                        HAULCODE: { validation: { required: true } },
                        CARRCODE: { validation: { required: true } },
                        MertexCurrencyCode: { validation: { required: true } },

                    }
                }
            }),
            requestStart: function (e) {

            },
            requestEnd: function (e) {

            }
        }),
        sortable: true,
        filterable: false,
        reorderable: true,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        }
    };

    self.contractTradeAccountId = ko.observable();

    self.contractTradeAccountId.subscribe(function (newValue) {
        if (self.contractDeliveryServicesGridSettings.widget()) {
            self.contractDeliveryServicesGridSettings.widget().dataSource.filter({});
        }
    });

    self.contractTradeAccount = ko.observable();

    self.contractTradeAccountDropDownList = kendoMDCDropDownList({
        label: 'Trade Account',
        endPoint: '/api/ProductDeliveryAPI/GetTradeAccountsWithDeliveryContractPrices',
        textField: 'Code',
        valueField: 'TradeAccountID',
        virtual: true,
        idObservable: self.contractTradeAccountId,
        objObservable: self.contractTradeAccount,
        height: 340,
        template: '#: Code # - #: Name #',
        valueTemplate: '#: Code # - #: Name #',
        optionLabel: {
            Code: '',
            Name: ''
        },
        optionLabelTemplate: '',
        filtering: function (ev) {
            var filterValue = ev.filter.value;
            ev.preventDefault();
            this.dataSource.filter({
                logic: "or",
                filters: [
                    {
                        field: "Name",
                        operator: "contains",
                        value: filterValue
                    },
                    {
                        field: "Code",
                        operator: "contains",
                        value: filterValue
                    }
                ]
            })
        }
    });

    self.contractDestinationCountryId = ko.observable();

    self.contractDestinationCountryId.subscribe(function (newValue) {
        if (self.contractDeliveryServicesGridSettings.widget()) {
            self.contractDeliveryServicesGridSettings.widget().dataSource.filter({});
        }
    });

    self.contractDestinationCountry = ko.observable();

    self.contractDestinationCountryDropDownList = kendoMDCDropDownList({
        label: 'Destination Country',
        endPoint: '/api/ComponentAPI/GetCountries',
        textField: 'Name',
        valueField: 'CountryID',
        idObservable: self.contractDestinationCountryId,
        objObservable: self.contractDestinationCountry,
        height: 240,
        additionalParams: {
            includeEU: true
        }
    });

    self.contractDeliveryGroupId = ko.observable();

    self.contractDeliveryGroupId.subscribe(function (newValue) {
        if (self.contractDeliveryServicesGridSettings.widget()) {
            self.contractDeliveryServicesGridSettings.widget().dataSource.filter({});
        }
    });

    self.contractDeliveryGroupDropDownList = kendoMDCDropDownList({
        label: 'Delivery Group',
        endPoint: '/api/ComponentAPI/GetDeliveryGroups',
        textField: 'Name',
        valueField: 'DeliveryGroupListID',
        idObservable: self.contractDeliveryGroupId,
        height: 300,
        permitRevert: true
    });

    self.contractTradeAccountEditor = function (container, options) {
        $('<input required name="' + options.field + '" />')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                popupSettings: {
                    width: '300px'
                },
                filter: 'contains',
                optionLabel: {
                    TradeAccountID: '',
                    Name: '',
                    Code: ''
                },
                dataTextField: "Name",
                dataValueField: "TradeAccountID",
                template: '#= Code # - #= Name #',
                valueTemplate: '#= Code # - #= Name #',
                height: 340,
                virtual: {
                    itemHeight: 34,
                    mapValueTo: 'dataItem',
                    valueMapper: function (options) {
                        $.ajax({
                            url: '/api/ProductDeliveryAPI/TradeAccountValueMapper',
                            type: 'POST',
                            data: {
                                tradeAccountId: options.value
                            },
                            success: function (data) {
                                options.success(data);
                            }
                        });
                    }
                },
                dataSource: {
                    serverFiltering: true,
                    serverSorting: true,
                    serverGrouping: true,
                    serverPaging: true,
                    type: 'odata-v4',
                    transport: {
                        read: {
                            url: '/odata/TradeAccounts'
                        }
                    },
                    pageSize: (340 / 34) * 4
                },
                filtering: function (ev) {
                    var filterValue = ev.filter.value;
                    ev.preventDefault();
                    this.dataSource.filter({
                        logic: "or",
                        filters: [
                            {
                                field: "Name",
                                operator: "contains",
                                value: filterValue
                            },
                            {
                                field: "Code",
                                operator: "contains",
                                value: filterValue
                            }
                        ]
                    })
                }
            });
    }

    self.contractDestinationCountryEditor = function (container, options) {
        $('<input required name="' + options.field + '" />')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                autoWidth: true,
                optionLabel: ' ',
                dataTextField: "Name",
                dataValueField: "CountryID",
                dataSource: {
                    serverFiltering: true,
                    serverSorting: true,
                    serverGrouping: true,
                    serverPaging: true,
                    type: 'odata-v4',
                    transport: {
                        read: {
                            url: '/odata/Countries'
                        }
                    },
                    sort: {
                        field: 'Name',
                        dir: 'asc'
                    }
                },
            });
    }

    self.contractDeliveryGroupEditor = function (container, options) {
        $('<input required name="' + options.field + '" />')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                autoWidth: true,
                dataTextField: "Name",
                dataValueField: "DeliveryGroupID",
                dataSource: {
                    serverFiltering: true,
                    serverSorting: true,
                    serverGrouping: true,
                    serverPaging: true,
                    type: 'odata-v4',
                    transport: {
                        read: {
                            url: '/odata/DeliveryGroups'
                        }
                    },
                    sort: {
                        field: 'Name',
                        dir: 'asc'
                    }
                }
            });
    }

    self.contractCurrencyEditor = function (container, options) {
        $('<input required name="' + options.field + '" />')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                autoWidth: true,
                dataTextField: "Name",
                dataValueField: "CurrencyID",
                dataSource: {
                    serverFiltering: true,
                    serverSorting: true,
                    serverGrouping: true,
                    serverPaging: true,
                    type: 'odata-v4',
                    transport: {
                        read: {
                            url: '/odata/Currencies'
                        }
                    },
                    sort: {
                        field: 'Name',
                        dir: 'asc'
                    }
                }
            });
    }

    self.contractDeliveryChargingLogicEditor = function (container, options) {
        $('<input required name="' + options.field + '" />')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                autoWidth: true,
                optionLabel: ' ',
                dataTextField: "Name",
                dataValueField: "DeliveryChargingLogicID",
                dataSource: {
                    serverFiltering: true,
                    serverSorting: true,
                    serverGrouping: true,
                    serverPaging: true,
                    type: 'odata-v4',
                    transport: {
                        read: {
                            url: '/odata/DeliveryChargingLogics'
                        }
                    },
                    sort: {
                        field: 'Name',
                        dir: 'asc'
                    }
                }
            });
    }

    self.contractDeliveryThresholdTypeEditor = function (container, options) {
        $('<input name="' + options.field + '" />')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                optionLabel: ' ',
                dataTextField: "Name",
                dataValueField: "DeliveryThresholdTypeID",
                dataSource: {
                    serverFiltering: true,
                    serverSorting: true,
                    serverGrouping: true,
                    serverPaging: true,
                    type: 'odata-v4',
                    transport: {
                        read: {
                            url: '/odata/DeliveryThresholdTypes'
                        }
                    },
                    sort: {
                        field: 'Name',
                        dir: 'asc'
                    }
                }
            });
    }

    self.contractDeliveryServicesGridSettings = {
        autoBind: true,
        widget: ko.observable(),
        columns: [{
            field: 'TradeDeliveryContractPriceID',
            title: 'ID',
            width: 60,
            attributes: {
                'class': 'text-right'
            }
        }, {
            field: 'TradeAccountID',
            title: 'Trade Account',
            template: '#=TradeAccount ? TradeAccount.Code + " - " + TradeAccount.Name : ""#',
            editor: self.contractTradeAccountEditor,
            width: 240,
            attributes: {
                'class': 'ellipsis-cell',
                'title': '#=TradeAccount ? TradeAccount.Code + " - " + TradeAccount.Name : ""#'
            }
        }, {
            field: 'HAULCODE',
            title: 'HAULCODE',
            width: 140
        }, {
            field: 'CARRCODE',
            title: 'CARRCODE',
            width: 140
        }, {
            field: 'DestinationCountryID',
            title: 'Destination Country',
            template: '#=DestinationCountry ? DestinationCountry.Name : ""#',
            editor: self.contractDestinationCountryEditor
        }, {
            field: 'DeliveryGroupID',
            title: 'Delivery Group',
            template: '#=DeliveryGroup ? DeliveryGroup.Name : ""#',
            editor: self.contractDeliveryGroupEditor,
            width: 240,
            attributes: {
                'class': 'ellipsis-cell'
            }
        }, {
            field: 'CurrencyID',
            title: 'Currency',
            template: '#=Currency ? Currency.Name : ""#',
            editor: self.contractCurrencyEditor
        }, {
            field: 'ContractPrice',
            title: 'Contract Price'
        },  {
            field: 'DeliveryChargingLogicID',
            title: 'Charging Logic',
            template: '#=DeliveryChargingLogic ? DeliveryChargingLogic.Name : ""#',
            editor: self.contractDeliveryChargingLogicEditor
        }, {
            field: 'OnDate',
            title: 'On Date',
            template: '#= kendo.toString(kendo.parseDate(OnDate), "dd/MM/yyyy")#'
        }, {
            field: 'OffDate',
            title: 'Off Date',
            template: '#= kendo.toString(kendo.parseDate(OffDate), "dd/MM/yyyy")#'
        }, {
            field: 'CreatedDT',
            title: 'Created',
            template: '#= kendo.toString(kendo.parseDate(CreatedDT), "dd/MM/yyyy")#'
        }, {
            field: 'DataSource',
            title: 'Data Source'
        }, {
            field: 'ThresholdMinimum',
            title: 'Threshold Minimum',
            attributes: {
                css: {
                    'class' : 'text-right'
                }
            }
        }, {
            field: 'ThresholdMaximum',
            title: 'Threshold Maximum',
            attributes: {
                css: {
                    'class' : 'text-right'
                }
            }
        }, {
            field: 'DeliveryThresholdTypeID',
            title: 'Threshold Type',
            template: '#=DeliveryThresholdType ? DeliveryThresholdType.Name : ""#',
            editor: self.contractDeliveryThresholdTypeEditor
        }, {
            field: 'WeightBracket',
            title: 'Weight Bracket',
            attributes: {
                css: {
                    'class': 'text-right'
                }
            }
        }, {
            command: ["destroy"]
        }],
        editable: true,
        batch: true,
        toolbar: ["create", "save", "cancel"],
        edit: function (e) {
            if (e.model.isNew()) {
                if (e.sender.options.editable != 'inline') {
                    e.sender.setOptions({ editable: 'inline' });
                    e.sender.one('dataBound', function (x) {
                        window.setTimeout(function () {
                            e.sender.addRow();
                            e.sender.one('dataBound', function (y) {
                                window.setTimeout(function () {
                                    e.sender.setOptions({ editable: 'incell' });
                                }, 0);
                            });
                        }, 0);
                    });
                }
            }
            //console.log('edit', e);  
        },
        cancel: function (e) {
            if (e.sender.options.editable == 'inline') {
                e.sender.setOptions({ editable: 'incell' });
            }
        },
        data: new kendo.data.DataSource({
            type: 'odata-v4',
            content: 'json',
            transport: {
                read: {
                    url: function () {
                        return '/odata/TradeDeliveryContractPrices/Default.Filter(tradeAccountId=' + (self.contractTradeAccountId() || "null") +',destinationCountryId='+ (self.contractDestinationCountryId() || "null") + ',deliveryGroupId=' + (self.contractDeliveryGroupId() ? self.contractDeliveryGroupId().replace('DeliveryGroupID-', '') : "null") + ')?$expand=TradeAccount,DestinationCountry,DeliveryGroup,Currency,DeliveryChargingLogic,DeliveryThresholdType'
                    }
                },
                update: {
                    url: function (data) {
                        return '/odata/TradeDeliveryContractPrices(' + data.TradeDeliveryContractPriceID + ')'
                    }
                },
                batch: {
                    url: function () {
                        return "/odata/$batch";
                    }
                },
                create: {
                    url: function () {
                        return '/odata/TradeDeliveryContractPrices';
                    },
                },
                destroy: {
                    url: function (data) {
                        return '/odata/TradeDeliveryContractPrices(' + data.TradeDeliveryContractPriceID + ')';
                    }
                },
                parameterMap: function (data, type) {
                    var result = kendo.data.transports["odata-v4"].parameterMap(data, type);

                    if (type === "update") {
                        console.log('updating');
                    }

                    //if (result.$filter) {
                    //    result.$filter = result.$filter.replace('datetime', 'datetimeoffset');
                    //}

                    return result;
                }
            },
            pageSize: 10,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            autoSync: false,
            schema: {
                errors: 'error',
                model: {
                    id: 'TradeDeliveryContractPriceID',
                    fields: {
                        TradeDeliveryContractPriceID: {
                            type: 'number',
                            editable: false
                        },
                        TradeAccount: {
                            type: 'object',
                            validation: {
                                required: true
                            },
                            defaultValue: null
                        },
                        TradeAccountID: {
                            type: 'number'
                        },
                        HAULCODE: {
                            validation: {
                                required: true
                            }
                        },
                        CARRCODE: {
                            validation: {
                                required: true
                            }
                        },
                        DestinationCountry: {
                            type: 'object',
                            validation: {
                                required: true
                            },
                            defaultValue: null
                        },
                        DestinationCountryID: {
                            type: 'number'
                        },
                        DeliveryGroup: {
                            type: 'object',
                            validation: {
                                required: true
                            },
                            defaultValue: null
                        },
                        DeliveryGroupID: {
                            type: 'number'
                        },
                        Currency: {
                            type: 'object',
                            validation: {
                                required: true
                            },
                            defaultValue: null
                        },
                        CurrencyID: {
                            type: 'number'
                        },
                        ContractPrice: {
                            type: 'number',
                            validation: {
                                required: true,
                                nullable: false
                            }
                        },
                        DeliveryChargingLogic: {
                            type: 'object',
                            validation: {
                                required: true
                            },
                            defaultValue: null
                        },
                        DeliveryChargingLogicID: {
                            type: 'number'
                        },
                        OnDate: {
                            type: 'date',
                            validation: {
                                required: false,
                                nullable: true
                            }
                        },
                        OffDate: {
                            type: 'date',
                            validation: {
                                required: false,
                                nullable: true
                            },
                            defaultValue: null
                        },
                        CreatedDT: {
                            type: 'date',
                            editable: false
                        },
                        DataSource: {
                            type: 'string',
                            validation: {
                                required: true,
                                nullable: false,
                                maxLength: 1
                            },
                            defaultValue: ''
                        },
                        ThresholdMinimum: {
                            type: 'number',
                            validation: {
                                required: false,
                                nullable: true
                            },
                            defaultValue: null
                        },
                        ThresholdMaximum: {
                            type: 'number',
                            validation: {
                                required: false,
                                nullable: true
                            },
                            defaultValue: null
                        },
                        DeliveryThresholdType: {
                            type: 'object',
                            validation: {
                                required: false
                            },
                            defaultValue: null
                        },
                        DeliveryThresholdTypeID: {
                            type: 'number',
                            defaultValue: null
                        },
                        WeightBracket: {
                            type: 'number',
                            validation: {
                                required: false,
                                nullable: true,
                                minValue: 0
                            },
                            defaultValue: null
                        }
                    }
                }
            },
            requestStart: function (e) {
                console.log('requestStart', e);
            },
            requestEnd: function (e) {
                if (e.type == "create") {
                    // Make a read request to expand Category. By default the OData controller doesn't expand on create.
                    this.read();
                }
            },
        }),
        sortable: true,
        filterable: false,
        reorderable: true,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        }
    };

    self.tradeHaulierOverrideTradeAccountEditor = function (container, options) {
        $('<input required name="' + options.field + '" />')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                popupSettings: {
                    width: '300px'
                },
                filter: 'contains',
                optionLabel: {
                    TradeAccountID: '',
                    Name: '',
                    Code: ''
                },
                dataTextField: "Name",
                dataValueField: "TradeAccountID",
                template: '#= Code # - #= Name #',
                valueTemplate: '#= Code # - #= Name #',
                height: 340,
                virtual: {
                    itemHeight: 34,
                    mapValueTo: 'dataItem',
                    valueMapper: function (options) {
                        $.ajax({
                            url: '/api/ProductDeliveryAPI/TradeAccountValueMapper',
                            type: 'POST',
                            data: {
                                tradeAccountId: options.value
                            },
                            success: function (data) {
                                options.success(data);
                            }
                        });
                    }
                },
                dataSource: {
                    serverFiltering: true,
                    serverSorting: true,
                    serverGrouping: true,
                    serverPaging: true,
                    type: 'odata-v4',
                    transport: {
                        read: {
                            url: '/odata/TradeAccounts'
                        }
                    },
                    pageSize: (340 / 34) * 4
                },
                filtering: function (ev) {
                    var filterValue = ev.filter.value;
                    ev.preventDefault();
                    this.dataSource.filter({
                        logic: "or",
                        filters: [
                            {
                                field: "Name",
                                operator: "contains",
                                value: filterValue
                            },
                            {
                                field: "Code",
                                operator: "contains",
                                value: filterValue
                            }
                        ]
                    })
                }
            });
    }

    self.tradeHaulierOverrideTradeAccountFilter = function (element) {
        $(element).kendoDropDownList({
                autoBind: true,
                popupSettings: {
                    width: '300px'
                },
                filter: 'contains',
                optionLabel: {
                    TradeAccountID: '',
                    Name: '',
                    Code: ''
                },
                dataTextField: "Name",
                dataValueField: "TradeAccountID",
                template: '#= Code # - #= Name #',
                valueTemplate: '#= Code # - #= Name #',
                height: 340,
                virtual: {
                    itemHeight: 34,
                    mapValueTo: 'dataItem',
                    valueMapper: function (options) {
                        $.ajax({
                            url: '/api/ProductDeliveryAPI/TradeAccountValueMapper',
                            type: 'POST',
                            data: {
                                tradeAccountId: options.value
                            },
                            success: function (data) {
                                options.success(data);
                            }
                        });
                    }
                },
                dataSource: {
                    serverFiltering: true,
                    serverSorting: true,
                    serverGrouping: true,
                    serverPaging: true,
                    type: 'odata-v4',
                    transport: {
                        read: {
                            url: '/odata/TradeAccounts'
                        }
                    },
                    pageSize: (340 / 34) * 4
                },
                filtering: function (ev) {
                    if (ev.filter) {
                        var filterValue = ev.filter.value;
                        ev.preventDefault();
                        this.dataSource.filter({
                            logic: "or",
                            filters: [
                                {
                                    field: "Name",
                                    operator: "contains",
                                    value: filterValue
                                },
                                {
                                    field: "Code",
                                    operator: "contains",
                                    value: filterValue
                                }
                            ]
                        })
                    }
                }
            });
    }


    self.tradeHaulierOverrideGridSettings = {
        autoBind: true,
        widget: ko.observable(),
        columns: [{
            field: 'TradeAccountID',
            title: 'Trade Account',
            template: '#=TradeAccount ? TradeAccount.Code + " - " + TradeAccount.Name : ""#',
            editor: self.tradeHaulierOverrideTradeAccountEditor,
            width: 240,
            attributes: {
                'class': 'ellipsis-cell',
                'title': 'TradeAccountTradeHaulierOverrideID: #=TradeAccountTradeHaulierOverrideID#'
            },
            filterable: {
                ui: self.tradeHaulierOverrideTradeAccountFilter
            }
        }, {
            field: 'HAULCODE',
            title: 'HAULCODE',
            width: 140
        }, {
            field: 'HaulierTransportAccountCode',
            title: 'Transport Account Code',
            width: 240
        }, {
            field: 'HaulierDutyTaxAccountCode',
            title: 'Duty & Taxes Account Code',
            width: 240
        }, {
            command: ["destroy"]
        }],
        editable: true,
        batch: true,
        toolbar: ["create", "save", "cancel"],
        edit: function (e) {
            if (e.model.isNew()) {
                if (e.sender.options.editable != 'inline') {
                    var options = e.sender.getOptions();
                    options.editable = 'inline';
                    options.dataSource.schema.model.fields.HAULCODE.editable = true;
                    e.sender.setOptions(options);
                    e.sender.one('dataBound', function (x) {
                        window.setTimeout(function () {
                            e.sender.addRow();
                            e.sender.one('dataBound', function (y) {
                                window.setTimeout(function () {
                                    var options = e.sender.getOptions();
                                    options.editable = 'incell';
                                    options.dataSource.schema.model.fields.HAULCODE.editable = false;
                                    e.sender.setOptions(options);
                                }, 0);
                            });
                        }, 0);
                    });
                }
            }
            e.container.find("input[name='HAULCODE']").attr('maxlength', '20');
            e.container.find("input[name='HaulierTransportAccountCode']").attr('maxlength', '50');
            e.container.find("input[name='HaulierDutyTaxAccountCode']").attr('maxlength', '50');
        },
        cancel: function (e) {
            if (e.sender.options.editable == 'inline') {
                e.sender.setOptions({ editable: 'incell' });
            }
        },
        data: new kendo.data.DataSource({
            //batch: true,
            type: 'odata-v4',
            content: 'json',
            transport: {
                read: {
                    url: function () {
                        return '/odata/TradeAccount_TradeHaulier_Overrides'
                    }
                },
                update: {
                    url: function (data) {
                        return '/odata/TradeAccount_TradeHaulier_Overrides(' + data.TradeAccountTradeHaulierOverrideID + ')'
                    }
                },
                batch: {
                    url: function () {
                        return "/odata/$batch";
                    }
                },
                create: {
                    url: function () {
                        return '/odata/TradeAccount_TradeHaulier_Overrides';
                    }
                },
                destroy: {
                    url: function (data) {
                        return '/odata/TradeAccount_TradeHaulier_Overrides(' + data.TradeAccountTradeHaulierOverrideID + ')'
                    }
                }
            },
            pageSize: 10,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            autoSync: false,
            schema: {
                errors: 'error',
                model: {
                    id: 'TradeAccountTradeHaulierOverrideID',
                    fields: {
                        TradeAccountTradeHaulierOverrideID: {
                            type: 'number',
                            defaultValue: 0
                        },
                        TradeAccount: {
                            type: 'object',
                            validation: {
                                required: true
                            },
                            defaultValue: null
                        },
                        TradeAccountID: {
                            type: 'number'
                        },
                        HAULCODE: {
                            type: 'string',
                            validation: {
                                required: true
                            },
                            editable: false
                        },
                        HaulierTransportAccountCode: {
                            type: 'string',
                            validation: {
                                required: true
                            }
                        },
                        HaulierDutyTaxAccountCode: {
                            type: 'string',
                            validation: {
                                required: false
                            }
                        }
                    }
                }
            }
        }),
        sortable: true,
        filterable: {
            extra: false
        },
        reorderable: true,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        }
    }


    //#endregion

    //#region Subscriptions

    self.originCountryId.subscribe(function (newValue) {
        self.newDefaultDeliveryService.originCountryId(newValue);
    });

    self.destinationCountryId.subscribe(function (newValue) {
        self.newDefaultDeliveryService.destinationCountryId(newValue);
    });

    //#endregion

    //#region Validation Groups

    //#endregion

    //#region Events

    //#endregion
}

const defaultDeliveryServiceGroupObject = ({
    record
} = {}) => (function () {
    // because what we're doing here is a bit of a neat trick - there's computed Hash column in the database to facilitate grouping these things
    // we're safe to take the 0th item from deliveryHashServices and know that the properties therein are common across all other deliveryHashServices
    // for this deliveryServiceGroupObject.
    //
    // only particular properties belonging to each 'deliveryHashService' are independent, as such these must present with multiple controls.
    // however, as a large number of values are common to each hash, we only need expose controls for those values once per delivery service grouping.

    /*
     * The properties which ARE common among the group are:
     *
     * DeliveryGroupID
     * OriginCountryID
     * DestinationCountryID
     * DestinationDeliveryZoneID
     * ServiceName
     * TransferTypeID
     * HAULCODE
     * HaulierServiceCode
     * DeliveryChargingLogicID
     * CurrencyID
     * DeliveryThresholdTypeID
     * ExpressService
     * DeliveryWeekDay
     * WeightBracket
     * 
     * The ones which we might want to change... are probably... 
     * not OriginCountryID, not DestinationCountryID, not DeliveryZoneID and not DeliveryGroupID ?
     * 
     * */

    /*
     * Which necessarily leaves us with the following properties which belong on the individual service records.
     * These, and their controls, belong to the object factory beneath.
     * 
     * Preference
     * Charge
     * PropertionalCharge
     * ThresholdMinimum
     * ThresholdMaximum
     * Surcharge
     * SurchargeDeliveryChargingLogicID
     * 
     * */

    var firstRecord = {};

    if (record.deliveryHashServices().length) {
        firstRecord = record.deliveryHashServices()[0];
    }

    var self = $.extend(record, {});

    self.busy = ko.observable(false);

    self.validateNow = ko.observable(false);

    self.serviceName = ko.observable(firstRecord.ServiceName);

    self.serviceNameTextBox = {
        label: 'Service Name',
        originalValue: ko.unwrap(self.serviceName),
        observable: self.serviceName,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        revertFunction: function () {
            var self = this;
            self.observable(self.originalValue)
        }
    };

    self.haulCode = ko.observable(firstRecord.HAULCODE).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'HaulCode'
        }
    });

    self.haulCodeTextBox = {
        label: 'Haulier Code',
        originalValue: ko.unwrap(self.haulCode),
        observable: self.haulCode,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 10
        },
        revertFunction: function () {
            var self = this;
            self.observable(self.originalValue)
        }
    };

    self.haulierServiceCode = ko.observable(firstRecord.HaulierServiceCode).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'HaulierServiceCode'
        }
    });

    self.haulierServiceCodeTextBox = {
        label: 'Haulier Service Code',
        originalValue: ko.unwrap(self.haulierServiceCode),
        observable: self.haulierServiceCode,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 20
        },
        revertFunction: function () {
            var self = this;
            self.observable(self.originalValue)
        }
    };

    self.deliveryGroupId = ko.observable(firstRecord.DeliveryGroupListID).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'DeliveryGroupID'
        }
    });

    self.deliveryGroup = ko.observable(firstRecord.DeliveryGroup);

    self.deliveryGroupDropDownList = kendoMDCDropDownList({
        label: 'Delivery Group',
        endPoint: '/api/ComponentAPI/GetDeliveryGroups',
        textField: 'Name',
        valueField: 'DeliveryGroupListID',
        idObservable: self.deliveryGroupId,
        objObservable: self.deliveryGroup,
        height: 300,
        permitRevert: true
    });

    self.originCountryId = ko.observable(firstRecord.OriginCountryID).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'OriginCountryID'
        }
    });

    self.originCountry = ko.observable(firstRecord.OriginCountry);

    self.originCountryDropDownList = kendoMDCDropDownList({
        label: 'Origin Country',
        endPoint: '/api/ComponentAPI/GetCountries',
        textField: 'Name',
        valueField: 'CountryID',
        idObservable: self.originCountryId,
        objObservable: self.originCountry,
        height: 300,
        showClear: false,
        additionalParams: {
            includeEU: true
        },
        permitRevert: true
    });

    self.destinationCountryId = ko.observable(firstRecord.DestinationCountryID).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'DestinationCountryID'
        }
    });

    self.destinationCountry = ko.observable(firstRecord.DestinationCountry);

    self.destinationCountryDropDownList = kendoMDCDropDownList({
        label: 'Destination Country',
        endPoint: '/api/ComponentAPI/GetCountries',
        textField: 'Name',
        valueField: 'CountryID',
        idObservable: self.destinationCountryId,
        objObservable: self.destinationCountry,
        height: 300,
        showClear: true,
        additionalParams: {
            includeEU: true
        },
        permitRevert: true
    });

    self.destinationDeliveryZoneId = ko.observable(firstRecord.DestinationDeliveryZoneID);

    self.destinationDeliveryZone = ko.observable(firstRecord.DestinationDeliveryZone);

    self.destinationDeliveryZoneDropDownList = kendoMDCDropDownList({
        label: 'Delivery Zone',
        endPoint: '/api/ProductDeliveryAPI/GetDeliveryZones',
        textField: 'Name',
        valueField: 'DeliveryZoneID',
        idObservable: self.destinationDeliveryZoneId,
        objObservable: self.destinationDeliveryZone,
        height: 300,
        additionalParams: {
            destinationCountryId: self.destinationCountryId
        },
        permitRevert: true,
        noDataTemplate: 'No Delivery Zones found' + (self.destinationCountry() ? ' for ' + self.destinationCountry().Name : '')
    });

    self.transferTypeId = ko.observable(firstRecord.TransferTypeID);

    self.transferType = ko.observable(firstRecord.TransferType);

    self.transferTypeDropDownList = kendoMDCDropDownList({
        label: 'Transfer Type',
        endPoint: '/api/ProductDeliveryAPI/GetTransferTypes',
        textField: 'Name',
        valueField: 'TransferTypeListID',
        idObservable: self.transferTypeId,
        objObservable: self.transferType,
        height: 200,
        permitRevert: true,
        filter: null
    });

    self.deliveryChargingLogicId = ko.observable(firstRecord.DeliveryChargingLogicID).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'DeliveryChargingLogicID'
        }
    });

    self.deliveryChargingLogic = ko.observable(firstRecord.DeliveryChargingLogic);

    self.deliveryChargingLogicDropDownList = kendoMDCDropDownList({
        label: 'Delivery Charging Logic',
        endPoint: '/api/ProductDeliveryAPI/GetDeliveryChargingLogics',
        textField: 'Name',
        valueField: 'DeliveryChargingLogicID',
        template: function (item) {
            if (self.weightBracket())
                return item.Name.replace("{WeightBracket}", self.weightBracket());
            else 
                return item.Name;
        },
        valueTemplate: function (item) {
            if (self.weightBracket())
                return item.Name.replace("{WeightBracket}", self.weightBracket());
            else
                return item.Name;
        },
        idObservable: self.deliveryChargingLogicId,
        objObservable: self.deliveryChargingLogic,
        height: 200,
        disabled: ko.pureComputed(function () { }),
        readOnly: ko.pureComputed(function () { }),
        permitRevert: true
    });

    self.currencyId = ko.observable(firstRecord.CurrencyID).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'CurrencyID'
        }
    });

    self.currency = ko.observable(firstRecord.Currency);

    self.currencyDropDownList = kendoMDCDropDownList({
        label: 'Currency',
        endPoint: '/api/ProductDeliveryAPI/GetCurrencies',
        textField: 'Name',
        valueField: 'CurrencyID',
        idObservable: self.currencyId,
        objObservable: self.currency,
        height: 200,
        permitRevert: true,
        filter: null
    });

    self.deliveryThresholdTypeId = ko.observable(firstRecord.DeliveryThresholdTypeID);

    self.deliveryThresholdType = ko.observable(firstRecord.DeliveryThresholdType);

    self.deliveryThresholdTypeDropDownList = kendoMDCDropDownList({
        label: 'Delivery Threshold Type',
        endPoint: '/api/ProductDeliveryAPI/GetDeliveryThresholdTypes',
        textField: 'Name',
        valueField: 'DeliveryThresholdTypeID',
        idObservable: self.deliveryThresholdTypeId,
        objObservable: self.deliveryThresholdType,
        height: 200,
        permitRevert: true,
        filter: null,
        disabled: ko.computed(function () {
            return self.deliveryChargingLogicId() == 6;
        })
    });

    // is this to be held for sales
    self.expressService = ko.observable(firstRecord.ExpressService);

    self.expressServiceCheckbox = {
        checkboxId: 'express-service-' + firstRecord.DefaultDeliveryServiceID,
        label: 'Express Service?',
        observable: self.expressService,
        originalValue: firstRecord.ExpressService || false,
        useNativeValidation: false,
        revertFunction: function () {
            self.expressService(self.expressServiceCheckbox.originalValue);
        }
    }

    self.weekDayOptions = [{
        Value: 'M-F',
        Name: 'Monday to Friday'
    }, {
        Value: 'SAT',
        Name: 'Saturday'
    }, {
        Value: 'SUN',
        Name: 'Sunday'
    }];

    self.deliveryWeekDayId = ko.observable(firstRecord.DeliveryWeekDay).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'DeliveryWeekDay'
        }
    });

    self.deliveryWeekDay = ko.observable(Enumerable.From(self.weekDayOptions).Where(function (x) {
        return x.Value == firstRecord.DeliveryWeekDay
    }).SingleOrDefault());

    self.deliveryWeekDayDropDownList = kendoMDCDropDownList({
        originalValue: ko.unwrap(self.deliveryWeekDay),    
        idObservable: self.deliveryWeekDayId,
        objObservable: self.deliveryWeekDay,
        label: 'Delivery Week Day',
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        data: self.weekDayOptions,
        //options: self.weekDayOptions,
        textField: 'Name',
        valueField: 'Value',
        //optionsCaption: ' ',
        width: 'auto',
        filter: null,
        permitRevert: true
    });

    self.weightBracket = ko.observable(firstRecord.WeightBracket).extend({
        numberFormatted: {
            digits: 2,
            currency: {
                FormattingCulture: 'en-GB'
            }
        }
    });

    self.weightBracketTextBox = {
        label: 'Weight Bracket',
        originalValue: ko.unwrap(self.weightBracket),
        observable: self.weightBracket,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: ko.computed(function () {
            return self.deliveryChargingLogicId() != 6;
        }),
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        revertFunction: function () {
            var self = this;
            self.observable(self.originalValue)
        }
    };

    self.weightBracket.subscribe(function (previousValue) {
        if (previousValue) {
            self.deliveryChargingLogicDropDownList.dropDownListSettings.widget().dataSource.read();
            ko.utils.arrayForEach(self.deliveryHashServices(), function (dhs) {
                dhs.surchargeDeliveryChargingLogicDropDownList.dropDownListSettings.widget().dataSource.read();
            });
        } else {
            if (self.deliveryChargingLogicId() == 6) {
                self.deliveryChargingLogicId(5);
                self.deliveryChargingLogicDropDownList.dropDownListSettings.widget().dataSource.read().then(function () {
                    self.deliveryChargingLogicId(6);
                    self.deliveryChargingLogicDropDownList.dropDownListSettings.widget().dataSource.read();
                });
                ko.utils.arrayForEach(self.deliveryHashServices(), function (dhs) {
                    dhs.surchargeDeliveryChargingLogicId(5);
                    dhs.surchargeDeliveryChargingLogicDropDownList.dropDownListSettings.widget().dataSource.read().then(function () {
                        dhs.surchargeDeliveryChargingLogicId(6);
                        dhs.surchargeDeliveryChargingLogicDropDownList.dropDownListSettings.widget().dataSource.read();
                    });
                });
            } else {
                self.deliveryChargingLogicDropDownList.dropDownListSettings.widget().dataSource.read();
                ko.utils.arrayForEach(self.deliveryHashServices(), function (dhs) {
                    dhs.surchargeDeliveryChargingLogicDropDownList.dropDownListSettings.widget().dataSource.read();
                });
            }
        }
    }, self, "beforeChange");

    self.reset = function () {
        console.log('defaultDeliveryServiceGroupObject reset called');
        self.deliveryGroupDropDownList.clearFunction();
        //self.originCountryDropDownList.clearFunction();
        //self.destinationCountryId(undefined);
        self.destinationDeliveryZoneDropDownList.clearFunction();
        self.serviceNameTextBox.clearFunction();
        self.transferTypeDropDownList.clearFunction();
        self.haulCodeTextBox.clearFunction();
        self.haulierServiceCodeTextBox.clearFunction();
        self.deliveryChargingLogicDropDownList.clearFunction();
        self.currencyDropDownList.clearFunction();
        self.deliveryThresholdTypeDropDownList.clearFunction();
        self.expressService(false);
        self.deliveryWeekDayDropDownList.clearFunction();
        self.weightBracketTextBox.clearFunction();
    }

    self.cancel = function () {
        console.log('defaultDeliveryServiceGroupObject cancel called');
        ko.utils.arrayForEach(Object.keys(self), function (key) {
            if (self[key]) {
                if (self[key].hasOwnProperty('revertFunction')) {
                    if (typeof self[key].revertFunction === 'function') {
                        self[key].revertFunction();
                    }
                }
            }
        });
    }

    self.deliveryChargingLogicId.subscribe(function (newValue) {
        if (newValue != 6) {
            self.weightBracket(undefined);
        } else {
            self.deliveryThresholdTypeDropDownList.clearFunction();
        }
        ko.utils.arrayForEach(self.deliveryHashServices, function (hashService) {
            hashService.surcharge(undefined);
            hashService.surchargeDeliveryChargingLogicId('');
        });
    });

    self.errors = ko.validation.group([
        self.deliveryHashServices,
        self.deliveryGroupId,
        self.originCountryId,
        self.destinationCountryId,
        self.haulCode,
        self.haulierServiceCode,
        self.currencyId,
        self.deliveryChargingLogicId,
        self.deliveryWeekDay
    ], {
        deep: true,
        live: true,
        observable: true
    });

    self.fetchCarriageCodePopupDetails = function () {
        $.ajax({
            url: '/api/ProductDeliveryAPI/FetchCarriageCodeMap',
            type: 'POST',
            dataType: 'json',
            data: {
                haulcode: self.haulCode(),
                haulierServiceCode: self.haulierServiceCode(),
                expressService: self.expressService()
            },
            success: function (data) {
                if (data.length) {
                    var div = $('<div></div>');
                    var dl = $('<dl class="dl-horizontal"></dl>');
                    $(dl).append('<dt>Haulier Code</dt>');
                    $(dl).append('<dd>' + self.haulCode() + '</dd>');

                    $(dl).append('<dt>Haulier Service Code</dt>');
                    $(dl).append('<dd>' + self.haulierServiceCode() + '</dd>');

                    $(dl).append('<dt>Express Service</dt>');
                    $(dl).append('<dd>' + self.expressService() ? 'Yes' : 'No' + '</dd>');

                    $.map(data, function (carriageCodeMap) {
                        $(dl).append('<dt>Mertex Currency</dt>');
                        $(dl).append('<dd>' + carriageCodeMap.MertexCurrencyCode + '</dd>');
                        $(dl).append('<dt>Market</dt>');
                        $(dl).append('<dd>' + carriageCodeMap.SalesMarket ? carriageCodeMap.SalesMarket.Name : '' + '</dd>');
                        $(dl).append('<dt>Carriage Code</dt>');
                    $(dl).append('<dd>' + carriageCodeMap.CARRCODE + '</dd>');
                    });
                    div.append(dl);
                    self.carriageCodeMapPopoverDetails.contentObservable(div.html());
                } else {
                    self.carriageCodeMapPopoverDetails.contentObservable('<p>No Carriage Codes found.</p><p>Check HAULCODE and Haulier Service Code.</p>');
                }
            },
            error: function (xhr, s, a) {
                $.showError(xhr, s, a);
            }
        });
    }

    self.carriageCodeMapPopoverDetails = {
        title: 'Carriage Code Map',
        placement: 'bottom',
        html: true,
        content: function () {
            self.fetchCarriageCodePopupDetails();
            return 'Loading...';
        },
        trigger: 'click',
        contentObservable: ko.observable('Loading...'),
        template: '<div class="popover carriage-code-map-popover" role="tooltip">\
                <div class="arrow"></div>\
                <div class="modal-header grey-blue">\
                    <button class="close" data-bind="click: function () { $(popObject).popover(\'hide\'); }">\
                        <span aria-hidden="true">&times;</span>\
                    </button>\
                    <h4 class="modal-title popover-title"></h4>\
                </div>\
                <div class="popover-content" data-bind="html: contentObservable"></div>\
            </div>'
    };

    self.save = function () {
        self.validateNow(true);

        ko.utils.arrayForEach(self.deliveryHashServices(), function (dsh) {
            dsh.validateNow(true);
        });

        self.errors.showAllMessages(true);

        window.setTimeout(function () {

            var errors = false;

            ko.utils.arrayForEach(self.deliveryHashServices(), function (dsh) {
                if (dsh.errors().length) {
                    dsh.errors.filter(function (x) {
                        x.isValid.notifySubscribers(x.isValid());
                    });

                    errors = true;
                }
            });

            if (self.errors().length) {

                self.errors.filter(function (x) {
                    x.isValid.notifySubscribers(x.isValid());
                });

                errors = true;

            }

            if (errors) {
                console.log('save rejected', self.errors());
                return;
            } else {
                console.log('save permitted');

                self.busy(true);

                var data = {
                    services: $.map(self.deliveryHashServices(), function (dsh) {
                        return $.extend(self.toJS(), dsh.toJS());   
                    }),
                    removals: self.hasOwnProperty('removedHashServiceIds') ? self.removedHashServiceIds() : []
                };

                console.log('save defaultDeliveryServiceGroup returned', data);

                $.ajax({
                    url: '/api/productDeliveryAPI/SaveDefaultDeliveryServices',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        console.log('save defaultDeliveryServiceGroup returned', data);
                        self.busy(false);
                        self.cancel();
                        ko.utils.arrayForEach(self.deliveryHashServices(), function (dhs) {
                            dhs.cancel();
                        });
                        if (self.hash != null) {
                            self.hash.view(DEFAULT_DELIVERY_MODE_VIEW);
                            self.parent.originCountryId.valueHasMutated();
                        } else {
                            self.reset();
                            self.validateNow(false);
                            ko.utils.arrayForEach(self.deliveryHashServices(), function (dhs) {
                                dhs.validateNow(false);
                            });
                            self.parent.originCountryId.valueHasMutated();
                        }
                    },
                    error: function (xhr, s, a) {
                        self.busy(false);
                        $.showError(xhr, s, a);
                    }
                });
            }

        }, 0);
    }

    self.addDefaultDeliveryServiceToNewGroup = function () {
        var addition = defaultDeliveryServiceObject();
        addition.parent(self);
        self.deliveryHashServices.push(addition);
    }

    self.toJS = function () {
        return {
            deliveryGroupId: self.deliveryGroupId().replace("DeliveryGroupID-", ""),
            originCountryId: self.originCountryId(),
            destinationCountryId: self.destinationCountryId(),
            deliveryChargingLogicId: self.deliveryChargingLogicId(),
            destinationDeliveryZoneId: self.destinationDeliveryZoneId(),
            serviceName: self.serviceName(),
            transferTypeId: self.transferTypeId(),
            haulCode: self.haulCode(),
            haulierServiceCode: self.haulierServiceCode(),
            currencyId: self.currencyId(),
            deliveryThresholdTypeId: self.deliveryThresholdTypeId(),
            expressService: self.expressService(),
            deliveryWeekDay: self.deliveryWeekDayId(),
            weightBracket: self.weightBracket()
        }
    }

    return self;
})();

const defaultDeliveryServiceObject = ({
    record = {}
} = {}) => (function () {

    /*
     * Which necessarily leaves us with the following properties which belong on the individual service records.
     * These, and their controls, belong to the object factory beneath.
     *
     * Preference
     * Charge
     * PropertionalCharge
     * ThresholdMinimum
     * ThresholdMaximum
     * Surcharge
     * SurchargeDeliveryChargingLogicID
     *
     * */

    var self = $.extend(record, {});

    self.parent = ko.observable();

    self.validateNow = ko.observable(false);

    self.preference = ko.observable(record.Preference).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Preference'
        },
        numberFormatted: {
            digits: 0,
            currency: {
                FormattingCulture: 'en-GB'
            }
        }
    })
    
    self.preferenceTextBox = {
        label: 'Preference',
        originalValue: ko.unwrap(self.preference),
        observable: self.preference,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: false,
        revertFunction: function () {
            var self = this;
            self.observable(self.originalValue);
        }
    }

    self.charge = ko.observable(record.Charge).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && (self.proportionalCharge() == null)
            },
            message: 'Charge'
        },
        numberFormatted: {
            digits: 2,
            currency: {
                FormattingCulture: 'en-GB'
            }
        }
    })

    self.chargeTextBox = {
        label: 'Charge',
        originalValue: ko.unwrap(self.charge),
        observable: self.charge,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: false,
        revertFunction: function () {
            var self = this;
            self.observable(self.originalValue);
        }
    }

    self.proportionalCharge = ko.observable(record.ProportionalCharge).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && (self.charge() == null)
            },
            message: 'Proportional Charge'
        },
        numberFormatted: {
            digits: 2,
            currency: {
                FormattingCulture: 'en-GB'
            },
            minValue: 0,
            maxValue: 100
        }
    });

    self.proportionalChargeTextBox = {
        label: 'Proportional Charge',
        originalValue: ko.unwrap(self.proportionalCharge),
        observable: self.proportionalCharge,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: false,
        revertFunction: function () {
            var self = this;
            self.observable(self.originalValue);
        }
    }

    self.thresholdMinimum = ko.observable(record.ThresholdMinimum).extend({
        numberFormatted: {
            digits: 2,
            currency: {
                FormattingCulture: 'en-GB'
            }
        }
    })

    self.thresholdMinimumTextBox = {
        label: 'Threshold Minimum',
        originalValue: ko.unwrap(self.thresholdMinimium),
        observable: self.thresholdMinimum,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: false,
        revertFunction: function () {
            var self = this;
            self.observable(self.originalValue);
        }
    }

    self.thresholdMaximum = ko.observable(record.ThresholdMaximum).extend({
        numberFormatted: {
            digits: 2,
            currency: {
                FormattingCulture: 'en-GB'
            }
        }
    })

    self.thresholdMaximumTextBox = {
        label: 'Threshold Minimum',
        originalValue: ko.unwrap(self.thresholdMaximum),
        observable: self.thresholdMaximum,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: false,
        revertFunction: function () {
            var self = this;
            self.observable(self.originalValue);
        }
    }

    self.surcharge = ko.observable(record.Surcharge).extend({
        numberFormatted: {
            digits: 2,
            currency: {
                FormattingCulture: 'en-GB'
            }
        }
    })

    self.surchargeTextBox = {
        label: 'Surcharge',
        originalValue: ko.unwrap(self.surcharge),
        observable: self.surcharge,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: false,
        disabled: ko.computed(function () {
            if (self.parent()) {
                return self.parent().deliveryChargingLogicId() != 1;
            }
            return true;
        }),
        revertFunction: function () {
            var self = this;
            self.observable(self.originalValue);
        }
    }

    self.surchargeDeliveryChargingLogicId = ko.observable(record.SurchargeDeliveryChargingLogicID);

    self.surchargeDeliveryChargingLogic = ko.observable(record.SurchargeDeliveryChargingLogic);

    self.surchargeDeliveryChargingLogicDropDownList = kendoMDCDropDownList({
        label: 'Delivery Charging Logic',
        endPoint: '/api/ProductDeliveryAPI/GetDeliveryChargingLogics',
        textField: 'Name',
        valueField: 'DeliveryChargingLogicID',
        idObservable: self.surchargeDeliveryChargingLogicId,
        objObservable: self.surchargeDeliveryChargingLogic,
        height: 200,
        template: function (item) {
            if (self.parent()) {
                if (self.parent().weightBracket())
                    return item.Name.replace("{WeightBracket}", self.parent().weightBracket());
                else
                    return item.Name;
            }
            else {
                return item.Name;
            }
        },
        valueTemplate: function (item) {
            if (self.parent()) {
                if (self.parent().weightBracket())
                    return item.Name.replace("{WeightBracket}", self.parent().weightBracket());
                else
                    return item.Name;
            }
            else {
                return item.Name;
            }
        },
        disabled: ko.computed(function () {
            if (self.parent()) {
                return self.parent().deliveryChargingLogicId() != 1;
            } else {
                return true;
            }
        })
    });

    self.proportionalCharge.subscribe(function (newValue) {
        if (newValue) {
            self.charge(undefined);
        };
    });

    self.charge.subscribe(function (newValue) {
        if (newValue) {
            self.proportionalCharge(undefined);
        }
    });

    self.thresholdMinimumDisplay = ko.pureComputed(function () {
        if (self.ThresholdMinimum) {
            if (self.parent()) {
                switch (self.parent().deliveryThresholdType()) {
                    case 1:
                        return formatCurrency(self.ThresholdMinimum, 2, self.Currency.FormattingCulture, self.Currency.Codee);
                        break;
                    case 2:
                        return self.ThresholdMinimum + 'KG'
                        break;
                    case 3:
                    case 4:
                    default:
                        return self.ThresholdMinimum;
                        break;
                }
            }
        }
    }, self);

    self.thresholdMaximumDisplay = ko.pureComputed(function () {
        if (self.ThresholdMaximum) {
            if (self.parent()) {
                switch (self.parent().deliveryThresholdType()) {
                    case 1:
                        return formatCurrency(self.ThresholdMaximum, 2, self.Currency.FormattingCulture, self.Currency.Codee);
                        break;
                    case 2:
                        return self.ThresholdMaximum + 'KG'
                        break;
                    case 3:
                    case 4:
                    default:
                        return self.ThresholdMaximum;
                        break;
                }
            }
        }
    }, self);

    self.cancel = function () {
        console.log('defaultDeliveryServiceObject cancel called');
        ko.utils.arrayForEach(Object.keys(self), function (key) {
            if (self[key]) {
                if (self[key].hasOwnProperty('revertFunction')) {
                    if (typeof self[key].revertFunction === 'function') {
                        self[key].revertFunction();
                    }
                }
            }
        });
    }

    self.errors = ko.validation.group([
        self.preference,
        self.charge,
        self.proportionalCharge
    ]);

    self.toJS = function () {
        return {
            defaultDeliveryServiceId: self.DefaultDeliveryServiceID,
            preference: self.preference(),
            charge: self.charge(),
            proportionalCharge: self.proportionalCharge(),
            thresholdMinimum: self.thresholdMinimum(),
            thresholdMaximum: self.thresholdMaximum(),
            surcharge: self.surcharge(),
            surchargeDeliveryChargingLogicId: self.surchargeDeliveryChargingLogicId()
        }
    }

    return self;
})();

const deliveryZoneFactory = ({
    parent,
    destinationCountry
} = {}) => (function () {

    if (typeof parent === 'undefined') {
        console.error('deliveryZoneFactory demands parent');
    }

    if (typeof destinationCountry === 'undefined') {
        console.error('deliveryZoneFactory demands destinationCountry');
    }

    if (!ko.isObservable(destinationCountry)) {
        console.error('deliveryZoneFactory demands destinationCountry be a ko.observable');
    }

    var self = {};

    self.parent = parent;

    self.busy = ko.observable(false);

    self.validateNow = ko.observable(false);

    self.deliveryZoneId = ko.observable();

    self.destinationCountry = destinationCountry.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Name'
        }
    });

    self.code = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Code'
        }
    });

    self.codeTextBox = {
        label: 'Code',
        observable: self.code,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        charsRemainingOptions: {
            maxLength: 20
        }
    }

    self.name = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Name'
        }
    });

    self.nameTextBox = {
        label: 'Name',
        observable: self.name,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        charsRemainingOptions: {
            maxLength: 50
        }
    }

    self.errors = ko.validation.group([
        self.destinationCountry,
        self.code,
        self.name
    ]);

    self.cancel = function () {
        self.reset();
        $('#delivery-zone-modal').modal('hide');
    }

    self.save = function () {
        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.errors.filter(function (x) {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            self.busy(true);
            var data = {
                deliveryZoneId: self.deliveryZoneId(),
                countryId: self.destinationCountry().CountryID,
                code: self.code(),
                name: self.name()
            };
            console.log('deliveryZone upsert calling with', data);
            $.ajax({
                url: '/api/ProductDeliveryAPI/UpsertDeliveryZone',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('deliveryZone upsert returned', data);
                    self.cancel();
                    self.parent.reloadDeliveryZones();
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError(xhr, s, a);
                }
            });
        }
    }

    self.reset = function () {
        console.log('deliveryZoneFactory reset called');
        self.busy(false);
        self.code(undefined);
        self.name(undefined);
        }

    return self;
})();

const deliveryGroupFactory = ({
    parent
} = {}) => (function () {
        var self = {};

        self.parent = parent;

        self.busy = ko.observable(false);

        self.validateNow = ko.observable(false);

        self.deliveryGroupId = ko.observable();

        self.code = ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Code'
            }
        });

        self.codeTextBox = {
            label: 'Code',
            observable: self.code,
            useNativeValidation: false,
            decorateInputElement: true,
            insertValidationMessages: false,
            showClear: true,
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            revertFunction: function () {
                var self = this;
                self.observable(self.originalValue)
            },
            charsRemainingOptions: {
                maxLength: 50
            }
        }

        self.name = ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Name'
            }
        });

        self.nameTextBox = {
            label: 'Name',
            observable: self.name,
            useNativeValidation: false,
            decorateInputElement: true,
            insertValidationMessages: false,
            showClear: true,
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            revertFunction: function () {
                var self = this;
                self.observable(self.originalValue)
            },
            charsRemainingOptions: {
                maxLength: 50
            }
        }

        self.splitBasketByAvailability = ko.observable(false);

        self.splitBasketByAvailabilityCheckbox = {
            checkboxId: 'split-basket-by-availability',
            label: 'Split Basket by Availability',
            observable: self.splitBasketByAvailability,
            useNativeValidation: false
        }

        self.avgParcelWeightKg = ko.observable().extend({
            numberFormatted: {
                digits: 2,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            }
        });

        self.avgParcelWeightTextBox = {
            label: 'Avg Parcel Weight (kg)',
            observable: self.avgParcelWeightKg,
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            showClear: true,
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            revertFunction: function () {
                var self = this;
                self.observable(self.originalValue)
            }
        };

        self.avgParcelWidthCm = ko.observable().extend({
            numberFormatted: {
                digits: 2,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            }
        });

        self.avgParcelWidthTextBox = {
            label: 'Avg Parcel Width (cm)',
            observable: self.avgParcelWidthCm,
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            showClear: true,
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            revertFunction: function () {
                var self = this;
                self.observable(self.originalValue)
            }
        };

        self.avgParcelHeightCm = ko.observable().extend({
            numberFormatted: {
                digits: 2,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            }
        });

        self.avgParcelHeightTextBox = {
            label: 'Avg Parcel Height (cm)',
            observable: self.avgParcelHeightCm,
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            showClear: true,
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            revertFunction: function () {
                var self = this;
                self.observable(self.originalValue)
            }
        };

        self.avgParcelLengthCm = ko.observable().extend({
            numberFormatted: {
                digits: 2,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            }
        });

        self.avgParcelLengthTextBox = {
            label: 'Avg Parcel Length (cm)',
            observable: self.avgParcelLengthCm,
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            showClear: true,
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            revertFunction: function () {
                var self = this;
                self.observable(self.originalValue)
            }
        };

        self.notes = ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Notes'
            }
        });

        self.notesTextBox = {
            label: 'Notes',
            observable: self.notes,
            useNativeValidation: false,
            decorateInputElement: true,
            insertValidationMessages: false,
            showClear: true,
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            revertFunction: function () {
                var self = this;
                self.observable(self.originalValue)
            },
            charsRemainingOptions: {
                maxLength: 100
            }
        }

        self.splitByBasketItem = ko.observable(false);

        self.splitByBasketItemCheckbox = {
            checkboxId: 'split-by-basket-item',
            label: 'Split by Basket Item',
            observable: self.splitByBasketItem,
            useNativeValidation: false
        }

        self.avgPalletWeightKg = ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Avg Pallet Weight'
            },
            numberFormatted: {
                digits: 2,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            }
        });

        self.avgPalletWeightTextBox = {
            label: 'Avg Pallet Weight (kg)',
            observable: self.avgPalletWeightKg,
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            showClear: true,
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            revertFunction: function () {
                var self = this;
                self.observable(self.originalValue)
            }
        };

        self.courierSurchargeEx = ko.observable().extend({
            numberFormatted: {
                digits: 2,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            }
        })

        self.courierSurchargeTextBox = {
            label: 'Courier Surcharge Ex.',
            observable: self.courierSurchargeEx,
            useNativeValidation: false,
            decorateInputElement: true,
            insertValidationMessages: false,
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            revertFunction: function () {
                var self = this;
                self.observable(self.originalValue)
            },
            showClear: false
        }

        self.allowDisplayDeliveryGroupConsolidation = ko.observable(false);

        self.allowDisplayDeliveryGroupConsolidationCheckbox = {
            checkboxId: 'allow-display-delivery-group-consolidation',
            label: 'Allow Display DeliveryGroup Consoldiation',
            observable: self.allowDisplayDeliveryGroupConsolidation,
            useNativeValidation: false
        }

        self.minimumParcelWeightKg = ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Minimum Parcel Weight'
            },
            numberFormatted: {
                digits: 2,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            }
        });

        self.minimumParcelWeightTextBox = {
            label: 'Minimum Parcel Weight (kg)',
            observable: self.minimumParcelWeightKg,
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            showClear: true,
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            revertFunction: function () {
                var self = this;
                self.observable(self.originalValue)
            }
        };

        self.packagingAllowanceKg = ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Packaging Allowance'
            },
            numberFormatted: {
                digits: 2,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            }
        });

        self.packagingAllowanceTextBox = {
            label: 'Packaging Allowance (kg)',
            observable: self.packagingAllowanceKg,
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            showClear: true,
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            revertFunction: function () {
                var self = this;
                self.observable(self.originalValue)
            }
        };

        self.errors = ko.validation.group([
            self.code,
            self.name,
            self.splitBasketByAvailability,
            self.avgParcelWeightKg,
            self.avgParcelWidthCm,
            self.avgParcelHeightCm,
            self.avgParcelLengthCm,
            self.notes,
            self.splitByBasketItem,
            self.avgPalletWeightKg,
            self.courierSurchargeEx,
            self.allowDisplayDeliveryGroupConsolidation,
            self.minimumParcelWeightKg,
            self.packagingAllowanceKg
        ]);

        self.load = function (record) {
            self.validateNow(false);

            self.deliveryGroupId(record.DeliveryGroupID);

            self.code(record.Code);
            self.codeTextBox.originalValue = record.Code;

            self.name(record.Name);
            self.nameTextBox.originalValue = record.Name;

            self.splitBasketByAvailability(record.SplitBasketByAvailability);

            self.avgParcelWeightKg(record.AvgParcelWeightKG);
            self.avgParcelWeightTextBox.originalValue = record.AvgParcelWeightKG;

            self.avgParcelWidthCm(record.AvgParcelWidthCM);
            self.avgParcelWidthTextBox.originalValue = record.AvgParcelWidthCM;

            self.avgParcelHeightCm(record.AvgParcelHeightCM);
            self.avgParcelHeightTextBox.originalValue = record.AvgParcelHeightCM;

            self.avgParcelLengthCm(record.AvgParcelLengthCM);
            self.avgParcelLengthTextBox.originalValue = record.AvgParcelLengthCM;

            self.notes(record.Notes);
            self.notesTextBox.originalValue = record.Notes;

            self.splitByBasketItem(record.SplitByBasketItem);

            self.avgPalletWeightKg(record.AvgPalletWeightKG);
            self.avgPalletWeightTextBox.originalValue = record.AvgParcelWeightKG;

            self.courierSurchargeEx(record.CourierSurchargeEx);
            self.courierSurchargeTextBox.originalValue = record.CourierSurchargeEx;

            self.allowDisplayDeliveryGroupConsolidation(record.AllowDisplayDeliveryGroupConsolidation);

            self.minimumParcelWeightKg(record.MinimumParcelWeightKG);
            self.minimumParcelWeightTextBox.originalValue = record.MinimumParcelWeightKG;

            self.packagingAllowanceKg(record.PackagingAllowanceKG);
            self.packagingAllowanceTextBox.originalValue = record.PackagingAllowanceKG;

            $('#delivery-group-modal').modal('show');
        }

        self.save = function () {
            self.validateNow(true);
            if (self.errors().length) {
                self.errors.showAllMessages(true);
                self.errors.filter(function (x) {
                    x.isValid.notifySubscribers(x.isValid());
                });
            } else {
                self.busy(true);
                var data = {
                    deliveryGroupId: self.deliveryGroupId(),
                    code: self.code(),
                    name: self.name(),
                    splitBasketByAvailability: self.splitBasketByAvailability(),
                    avgParcelWeightKg: self.avgParcelWeightKg(),
                    avgParcelWidthCm: self.avgParcelWidthCm(),
                    avgParcelHeightCm: self.avgParcelHeightCm(),
                    avgParcelLengthCm: self.avgParcelLengthCm(),
                    notes: self.notes(),
                    splitByBasketItem: self.splitByBasketItem(),
                    avgPalletWeightKg: self.avgPalletWeightKg(),
                    courierSurchargeEx: self.courierSurchargeEx(),
                    allowDisplayDeliveryGroupConsolidation: self.allowDisplayDeliveryGroupConsolidation(),
                    minimumParcelWeightKg: self.minimumParcelWeightKg(),
                    packagingAllowanceKg: self.packagingAllowanceKg()
                };
                console.log('calling deliveryGroup upsert with', data);
                $.ajax({
                    url: '/api/ProductDeliveryAPI/UpsertDeliveryGroup',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        console.log('deliveryGroup upsert returned', data);
                        self.cancel();
                        self.parent.forceReload();
                    },
                    error: function (xhr, s, a) {
                        self.busy(false);
                        $.showError(xhr, s, a);
                    }
                });
            }
        }

        self.cancel = function () {
            self.reset();
            $('#delivery-group-modal').modal('hide');
        }

        self.reset = function () {
            console.log('deliveryGroupFactory reset called');
            self.deliveryGroupId(undefined);
            self.code(undefined);
            self.codeTextBox.originalValue = undefined;
            self.name(undefined);
            self.nameTextBox.originalValue = undefined;
            self.splitBasketByAvailability(undefined);
            self.avgParcelWeightKg(undefined);
            self.avgParcelWeightTextBox.originalValue = undefined;
            self.avgParcelWidthCm(undefined);
            self.avgParcelWidthTextBox.originalValue = undefined;
            self.avgParcelHeightCm(undefined);
            self.avgParcelHeightTextBox.originalValue = undefined;
            self.avgParcelLengthCm(undefined);
            self.avgParcelLengthTextBox.originalValue = undefined;
            self.notes(undefined);
            self.notesTextBox.originalValue = undefined;
            self.splitByBasketItem(undefined);
            self.avgPalletWeightKg(undefined);
            self.avgPalletWeightTextBox.originalValue = undefined;
            self.courierSurchargeEx(undefined);
            self.courierSurchargeTextBox.originalValue = undefined;
            self.allowDisplayDeliveryGroupConsolidation(undefined);
            self.minimumParcelWeightKg(undefined);
            self.minimumParcelWeightTextBox.originalValue = undefined;
            self.packagingAllowanceKg(undefined);
            self.packagingAllowanceTextBox.originalValue = undefined;
            self.busy(false);
        }

        return self;
})();