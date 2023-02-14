const 
    DOWNLOAD_SEARCH_TYPE_ALL = null,
    DOWNLOAD_SEARCH_TYPE_CLEARANCE = true,
    DOWNLOAD_SEARCH_TYPE_CURRENT = false,
    DOWNLOAD_FILTER_MODE_STANDARD = 0,
    DOWNLOAD_FILTER_MODE_ADVANCED = 1,
    DOWNLOAD_PHASE_SEARCH = 0,
    DOWNLOAD_PHASE_BASKET = 1,
    DOWNLOAD_PHASE_ADDRESS = 2,
    DOWNLOAD_PHASE_DISPATCH = 3,
    DOWNLOAD_SEARCH_DISPLAY_GRID = 0,
    DOWNLOAD_SEARCH_DISPLAY_LIST = 1,
    DOWNLOAD_DISPLAY_FEEDS = 1,
    DOWNLOAD_DISPLAY_IMAGES = 2,
    DOWNLOAD_DISPLAY_HOWTO = 3

var downloadProductsViewModel = function () {
    var self = this;

    // #region Sanity Checks



    // #endregion

    // #region Properties (observables, observableArrays, other)

    self.advertisingImages = ko.observableArray([]);

    self.advertisingDataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {

                var webapi = new kendo.data.transports.webapi({ prefix: "" });
                var params = webapi.parameterMap(options.data);

                var data = {};

                for (var propertyName in params) {
                    data[propertyName] = params[propertyName];
                }

                console.log('calling advertisingImages with', data);

                $.ajax({
                    url: '/api/downloadproductsapi/AdvertisingImages',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        console.log('advertisingImages returned', data);

                        options.success(data);
                    },
                    error: function (xhr, s, a) {
                        self.searchBusy(false);
                        $.showError(xhr, s, a);
                    }
                });
            }
        },
        page: 1,
        pageSize: 10,
        serverPaging: true,
        serverSorting: false,
        serverFiltering: false,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Images",
            total: "ResultCount",
            //errors: "Errors",
            //aggregates: "Aggregates",
            model: {
                id: 'AdvertisingImageID'
            }
        })
        //,
        //sort: { field: "AdvertisingImageID", dir: "asc" }
    });

    self.advertisingGrid = ko.observable();

    self.advertisingGridSettings = {
        autoBind: true,
        widget: self.advertisingGrid,
        data: self.advertisingDataSource,
        columns: [{
            field: ' ',
            title: ' ',
            width: 400
        }, {
            field: ' ',
            title: ' ',
        }],
        useKOTemplates: true,
        rowTemplate: 'advertising-row-template',
        sortable: false,
        filterable: false,
        reorderable: false,
        selectable: false,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 200, 'all']
        }
    };

    self.currentDisplay = ko.observable(DOWNLOAD_DISPLAY_FEEDS);

    self.unitsOfMeasurement = [{
        Name: 'Metric',
        Value: 1
    }, {
        Name: 'Imperial',
        Value: 0
    }];

    self.unitOfMeasurement = ko.observable(self.unitsOfMeasurement[0]);

    self.downloadBusy = ko.observable(false);

    self.totalResults = ko.observable(0);

    self.page = ko.observable(1);

    self.pageSize = ko.observable(50);

    self.basket = ko.observableArray([]);

    self.skipFirst = ko.observable(true);

    self.tradeAccountSelector = new tradeAccountSelector();

    self.tradeAccount = self.tradeAccountSelector.selected;

    self.searchResults = ko.observableArray([]);

    self.searchBusy = ko.observable(true);

    self.searchWidget = ko.observable({});

    self.filterViewMode = ko.observable(DOWNLOAD_FILTER_MODE_STANDARD);

    self.clearance = ko.observable(DOWNLOAD_SEARCH_TYPE_CURRENT);

    self.selectedFilterCountNonce = ko.observable();

    // Holds the filter buttons on the left (now named Categories)
    self.productFilterButtons = ko.observable(getProductFilterButtons());

    self.completeProductFilterSet = ko.observable(getCompleteProductFilterButtonSet());

    // Permits firing of the search computed on demand, via .valueHasMutated
    self.searchNonce = ko.observable();

    // Available sort orders.
    self.searchSortOrders = getSortOptions();

    // Holds the currently applied sort order.
    self.searchSortOrder = ko.observable();

    // Filter Properties:
    self.selectedColour = ko.observable();
    self.selectedBrand = ko.observable();
    self.selectedLaunch = ko.observable();
    self.selectedPattern = ko.observable();
    self.selectedItemType = ko.observable();
    self.selectedStock = ko.observable();
    self.selectedMartindale = ko.observable();
    self.selectedWidth = ko.observable();
    self.selectedSize = ko.observable();
    self.searchNew = ko.observable(false);

    self.previousProductType = ko.observable();
    self.selectedProductType = ko.observable();
    self.selectedProductTypeGroup = ko.observable();
    self.selectedProductGroup = ko.observable();

    self.brandFilterButtons = ko.observable(getBrandFilterButtons());
    self.launchFilterButtons = ko.observable(getLaunchFilterButtons());
    self.patternFilterButtons = ko.observable(getPatternFilterButtons());
    self.itemTypeFilterButtons = ko.observable(getItemTypeFilterButtons());
    self.stockFilterButtons = ko.observable(getStockFilterButtons());
    self.martindaleFilterButtons = ko.observable(getMartindaleFilterButtons());
    self.widthFilterButtons = ko.observable(getWidthFilterButtons());
    self.sizeFilterButtons = ko.observable(getSizeFilterButtons());

    self.seasonalProducts = ko.observable(false);

    // End of Filter Properties

    // Maintains the notion of the widget group selected
    self.searchWidgetGroup = ko.observable();

    // Holds the user-provided search term.
    self.searchTerm = ko.observable();

    // Holds the searchTerm's hasFocus state. Subscribed to below.
    self.searchTermHasFocus = ko.observable(false);

    // Holds the collectionId... for when the user selects one from keyword hints.
    // When this happens, Matt doesn't want me to pass searchTerm... hmm.
    self.collectionId = ko.observable();

    // Holds the keyword-suggesting search term hinter params.
    self.searchTermKeywordAutocompleteParams = {
        mapFunction: function (i) {
            return {
                label: i.Suggestion,
                value: i
            }
        },
        additionalParams: {
            searchTerm: self.searchTerm,
            widget: self.searchWidget,
            productTypeId: self.selectedProductType,
            brandId: self.selectedBrand,
            launchId: self.selectedLaunch,
            seasonal: self.seasonalProducts
        },
        minLength: 1,
        autoFocus: false,
        autocompleteEndpoint: '/api/componentapi/ProductSearchKeywordAutocomplete',
        select: function (ev, ui) {
            console.log('searchTermKeywordAutocomplete select', ui.item.value);
            ev.preventDefault();
            if (ui.item.value.Type === 'Standard') {
                self.searchTerm(ui.item.label);
                //self.search();
            } else {
                self.collectionId(ui.item.value.CollectionID);
                $(self.searchTerm.DOMElement).val(ui.item.label);
                self.searchTerm.silentUpdate(ui.item.label);
                //self.searchTerm(ui.item.label);
                //self.search();
            }
        },
        open: function (event, ui) {
            $('.ui-autocomplete').off('menufocus hover mouseover');
        },
        close: function (ev, ui) {
            $(self.searchTerm.DOMElement).autocomplete('option', 'minLength', 1);
        },
        create: function () {
            $(self.searchTerm.DOMElement).data("ui-autocomplete")._renderItem = function (ul, item) {

                var li = null;
                var div = null;

                switch (item.value.Type) {

                    case 'Collection':
                        li = $("<li>");
                        div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "<span class='type'>COLLECTION</span></div>");
                        li.addClass('list-group-item-success li-search');
                        break;

                    default:
                        li = $("<li>");
                        div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "</div>");
                        li.addClass('li-search');
                        break;
                }

                return li.appendTo(ul);
            };
        }
    };

    self.resultGridWidget = ko.observable();

    self.resultGridDataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {

                var webapi = new kendo.data.transports.webapi({ prefix: "" });
                var params = webapi.parameterMap(options.data);

                var tradeAccountId = null;

                if (self.tradeAccount.peek())
                    tradeAccountId = self.tradeAccount.peek().TradeAccountID

                var data = {
                    widget: self.searchWidget(),
                    launchId: self.selectedLaunch(),
                    searchTerm: self.searchTerm.peek(),
                    brandId: self.selectedBrand(),
                    productTypeId: self.selectedProductType(),
                    productTypeGroupId: self.selectedProductTypeGroup(),
                    productGroupId: self.selectedProductGroup(),
                    itemTypeId: self.selectedItemType(),
                    stockFilterId: self.selectedStock(),
                    clearance: self.clearance(),
                    searchNew: self.searchNew(),
                    tradeAccountId: tradeAccountId,
                    collectionId: self.collectionId(),
                    metric: true,
                    colourId: self.selectedColour(),
                    patternId: self.selectedPattern(),
                    martindaleId: self.selectedMartindale(),
                    wideWidth: self.selectedWidth(),
                    sortOrder: self.searchSortOrder(),
                    sizeId: self.selectedSize(),
                    page: self.page(),
                    pageSize: self.pageSize()
                };

                for (var propertyName in params) {
                    data[propertyName] = params[propertyName];
                }

                console.log('calling downloadSearch with', data);

                $.ajax({
                    url: '/api/downloadproductsapi/downloadSearch',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        console.log('downloadSearch returned', data);

                        // How to suppress this...
                        if (self.previousProductType() == self.selectedProductType()) {

                        } else {
                            self.collectionId.silentUpdate(undefined); // where do I want to clear this... probably here.
                        }

                        options.success(data);
                    },
                    error: function (xhr, s, a) {
                        self.searchBusy(false);
                        $.showError(xhr, s, a);
                    }
                });
            }
        },
        pageSize: 10,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Results",
            total: "ResultCount",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'RecordID'
            }
        }),
        sort: { field: "SortOrder", dir: "asc" },
        requestStart: function (e) {
            self.searchBusy(true);
            if (!self.tradeAccountSelector.selected()) {
                e.preventDefault();
                $.info('Info',
                    'You must select a trade account before adding products to your basket.',
                    function () {
                        $("#info-modal-close").focus();
                    });
                if (!$("#trade-account-collapse").hasClass('in')) {
                    $("#trade-account-collapse").collapse('show');
                }
            }
        },
        requestEnd: function (e) {
            self.searchBusy(false);
        }
    });

    self.resultGridColumns = [{
        field: 'checkbox',
        title: ' ',
        width: 60,
        selectable: true,
        headerAttributes: {
            'class': 'valign-bottom'
        }
    }, {
        field: '',
        title: getResource('PrimaryImage'),
        width: 164,
        attributes: {
            'class': 'image-cell'
        },
        template: function (r) {
            if (r.Images.length > 0) {
                return '<img class="record-primary-image" src="https://www.designersguild.com/image/156/' + r.Images[0].ImageID + '" />';
            }
        }
    }, {
        field: '',
        title: getResource('Heading'),
        width: 175,
        attributes: {
            'class': 'heading-cell'
        },
        template: function (r) {
            var result = '';

            if (r.Heading)
                result = '<span class="heading">' + r.Heading + '</span>';

            if (r.SubHeading)
                result +=  '<span>' + r.SubHeading + '</span>';

            return result;
        }
    }, {
        field: '',
        title: getResource('Description'),
        width: 300,
        attributes: {
            'class': 'description-cell'
        },
        template: function (r) {
            var result = '';

            if (r.Description)
                result = '<span>' + r.Description + '</span>';

            return result;
        }
    }, {
        field: '',
        title: getResource('SecondaryImages'),
        attributes: {
            'class': 'secondary-images-cell'
        },
        template: function (r) {
            var result = '';

            for (var i = 0; i < r.Images.length; i++) {
                if (i == 0)
                    continue;
                result += '<img class="record-secondary-image" src="https://www.designersguild.com/image/90/' + r.Images[i].ImageID + '" />'
            }

            return result;
        }
    }];

    self.onRowClick = function (e) {
        if ($(e.target).hasClass("k-checkbox-label")) {
            return;
        }
        var row = $(e.target).closest("tr");
        var checkbox = $(row).find(".k-checkbox");

        checkbox.click();
    };

    self.resultGridSettings = {
        autoBind: false,
        widget: self.resultGridWidget,
        columns: self.resultGridColumns,
        data: self.resultGridDataSource,
        //useKOTemplates: true,
        //rowTemplate: 'grid-row-template',
        sortable: false,
        filterable: false,
        reorderable: false,
        selectable: false,
        change: function (e) {
            console.log(e);
            self.basket(e.sender.selectedKeyNames());
        },
        persistSelection: true,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 200, 'all']
        },
        dataBound: function (e) {
            var grid = e.sender;
            var rows = grid.tbody.find("[role='row']");

            rows.unbind("click");
            rows.on("click", self.onRowClick)
        }
    }

    // #endregion

    // #region Subscriptions

    self.tradeAccount.subscribe(function (newValue) {
        if (newValue) {
            self.refreshProductFilterButtons(false);
        } else {
            self.productFilterButtons([]);
        }
    });

    self.selectedProductType.subscribe(function (newValue) {
        console.log('downloadFactory selectedProductType', newValue);
    });

    self.searchWidget.subscribe(function (newValue) {

        self.searchWidgetGroup(newValue.ProductFilterGroupID);

        var clearSearchTerm = true;
        
        // If we have a previousProductType
        if (self.previousProductType()) {
            // and that previous product type id is not the same as the currently selected one
            if (self.previousProductType() != self.selectedProductType()) {
                self.collectionId.silentUpdate(undefined); // clear the collectionId
                // then set previous to current
                self.previousProductType(self.selectedProductType());
                // and clear filters.
                self.resetFilters();
            } else {
                // if the previous is the same as the current, avoid clearing search term.
                clearSearchTerm = false;
            }
        } else {
            // If previousProductType is null, set it - and reset the filters.
            self.previousProductType(self.selectedProductType());
            self.resetFilters();
        }

        self.fetchItemTypes(newValue.ProductFilterID);

        self.fetchSizes(newValue.ProductFilterID);

        $("#order-products-modal").scrollTop(0);

        console.log('downloads searchWidget subscribe hit', newValue);

        self.searchResults([]);

        if (clearSearchTerm) {
            self.searchTerm.silentUpdate(undefined);
        }

        window.setTimeout(function () {
            self.searchTerm.valueHasMutated();
        }, 20);
    });


    // #endregion

    // #region Computeds

    self.basketContentsDisplay = ko.pureComputed(function () {
        if (self.basket().length == 0) {
            return getResource('BasketEmpty');
        }

        if (self.basket().length == 1) {
            return '1 item in your basket';
        } else {
            return self.basket().length + ' items in your basket';
        }
    }, self);

    self.basketSummaryList = ko.pureComputed(function () {
        
    });

    self.modeHeader = ko.pureComputed(function () {
        var result = '';

        if (self.searchWidget().Value == null &&
            self.searchBusy() == false &&
            self.brandGroupedSearchResults().length == 0) {
            return '<div class="no-items">Please Select a Category</div>';
        }

        if (self.searchResults().length == 0 &&
            self.searchBusy() == false) {
            return '<div class="no-items">There are no products in this category matching your search criteria or the product you are searching for has been discontinued.</div>';
        }

        //switch (self.mode()) {
        //    case ORDERFACTORY_MODE_BESPOKE_FABRIC_HANGERS:
        //        result = '<h4>Bespoke Fabric Hangers</h4>';
        //        break;
        //    case ORDERFACTORY_MODE_BESPOKE_FABRIC_SHOWLENGTHS:
        //        result = '<h4>Bespoke Fabric Showlengths</h4>';
        //        break;
        //    case ORDERFACTORY_MODE_BESPOKE_WALLPAPER_SHOWLENGTHS:
        //        result = '<h4>Bespoke Wallpaper Showlengths</h4>';
        //        break;
        //    case ORDERFACTORY_MODE_BESPOKE_RUGS:
        //        result = '<h4>Bespoke Rugs</h4>';
        //        break;
        //    case ORDERFACTORY_MODE_BESPOKE_FURNITURE:
        //        result = '<h4>Bespoke Furniture</h4>';
        //        break;
        //    case ORDERFACTORY_MODE_QUICKDISPLAYS:
        //        result = '<h4>Quick Displays</h4>';
        //        break;
        //    default: break;
        //}
        return result;
    });

    self.availableSortOrders = ko.computed(function () {
        var widget = self.searchWidget();
        if (widget) {
            var arr = Enumerable.From(self.searchSortOrders).Where(function (x) {
                return (x.ProductFilterGroupID == self.searchWidget().ProductFilterGroupID) &&
                        (x.Clearance == self.clearance());
            }).OrderBy('$.SortOrder').ToArray();
            return arr;
        } else {
            return [];
        }
    });

    self.availableSortOrders.subscribe(function (newValue) {
        window.setTimeout(function () {
            var def = Enumerable.From(self.availableSortOrders()).Where(function (x) {
                return x.ProductFilterGroupID == self.searchWidgetGroup() &&
                       x.Clearance == self.clearance() &&
                       x.Default == true
            }).SingleOrDefault();

            if (def) {
                self.searchSortOrder(def.Code);
            }
        }, 0);
    });

    self.brandGroupedSearchResults = ko.computed(function () {
        return Enumerable.From(self.searchResults())
            .GroupBy(function (x) {
                return {
                    Brand: x.record.Brand,
                    BrandID: x.record.BrandID,
                    LogoSrc: self.brandLogoSrc(x.record.BrandID)
                }
            },//'{ Brand: $.record.Brand, BrandID: $.record.BrandID }',
            '',
            "key, e => { brand: e.Key(), productPages: Enumerable.From(e.source).GroupBy('{ Grouped: $.record.Grouped, ProductPageID: $.productPageId, ProductPageName: $.record.ProductPageName, ProductPageDescription: $.record.ProductPageDescription, ProductPageImageID: $.record.ProductPageImageID, SortOrder: $.record.SortOrder }', '', \
'key, f => { productPage: f.Key(), products: f.source }', '$.ProductPageID').OrderBy('$.productPage.SortOrder').ToArray() }",
            function (x) { return x.BrandID }
            ).ToArray()
    });

    self.search = ko.computed(function () {

        var nonce = self.searchNonce();

        var tradeAccountId = null;

        if (self.tradeAccount.peek())
            tradeAccountId = self.tradeAccount.peek().TradeAccountID

        var data = {
            widget: self.searchWidget(),
            launchId: self.selectedLaunch(),
            searchTerm: self.searchTerm.peek(),
            brandId: self.selectedBrand(),
            productTypeId: self.selectedProductType(),
            productTypeGroupId: self.selectedProductTypeGroup(),
            productGroupId: self.selectedProductGroup(),
            itemTypeId: self.selectedItemType(),
            stockFilterId: self.selectedStock(),
            clearance: self.clearance(),
            searchNew: self.searchNew(),
            tradeAccountId: tradeAccountId,
            collectionId: self.collectionId(),
            metric: true,
            colourId: self.selectedColour(),
            patternId: self.selectedPattern(),
            martindaleId: self.selectedMartindale(),
            wideWidth: self.selectedWidth(),
            sortOrder: self.searchSortOrder(),
            sizeId: self.selectedSize(),
            page: self.page(),
            pageSize: self.pageSize()
        };

        if (self.skipFirst()) {
            self.skipFirst(false);
            return;
        } else {

            if (tradeAccountId == null) {
                self.searchBusy(false);
                $.info('Please Select a Trade Account', 'Please select a Trade Account before searching for products.');
                return;
            }

            if (self.searchWidget().Value == null) {
                // abort abort abort!
                self.searchBusy(false);
                $.info('Please Select a Category', 'Please select a category before searching for products.');
                return;
            }

            self.resultGridWidget().dataSource.query({
                page: 1,
                pageSize: self.resultGridWidget().dataSource.pageSize()
            });
        }
    }).extend({
        rateLimit: {
            timeout: 300,
            method: 'notifyWhenChangesStop'
        }
    });

    self.selectedFilterCount = ko.computed(function () {
        var ctr = 0;

        var t = self.selectedFilterCountNonce();

        if (self.selectedColour()) ctr++;
        if (self.selectedBrand()) ctr++;
        if (self.selectedLaunch()) ctr++;
        if (self.selectedPattern()) ctr++;
        if (self.selectedItemType()) ctr++;
        if (self.selectedStock()) ctr++;
        if (self.selectedMartindale()) ctr++;
        if (self.selectedWidth()) ctr++;
        if (self.selectedSize()) ctr++;

        return ctr;
    });

    // #endregion

    // #region Components / Slicers

    self.groupedProductFilterButtons = ko.computed(function () {
        return Enumerable.From(self.productFilterButtons()).GroupBy(function (pfg) {
            return {
                productFilterGroup: pfg.ProductFilterGroup,
                productFilterGroupId: pfg.ProductFilterGroupID,
                sortOrder: pfg.ProductFilterGroupSortOrder
            }
        },
            function (result) {
                return result;
            },
            function (key, pfg) {

                var parentProperties = {};

                Object.keys(pfg.source[0]).forEach(function (k) {
                    parentProperties[k] = null;
                });

                pfg.source.forEach(function (button) {
                    Object.keys(button).forEach(function (k) {
                        parentProperties[k] = parentProperties[k] || button[k];
                    });
                });

                parentProperties.AddAll = false;
                parentProperties.Value = -1;
                parentProperties.ProductFilterID = null;
                //console.log(parentProperties);
                // I would not be in the least surprised if this was insufficient...


                return $.extend(parentProperties, {
                    key: key,
                    filterButtons: pfg.source
                })
            },
            function (pfg) {
                return pfg.productFilterGroupId
            })
            .OrderBy('$.key.sortOrder')
            .ToArray()
    });

    //self.groupedProductFilterButtons.subscribe(function (newValues) {
    //    window.setTimeout(function () {
    //        $('#category-accordion .panel-collapse').on('show.bs.collapse', function (e) { $('a:first-child', e.target).click(); });
    //    }, 100);
    //});

    // #endregion

    // #region Validation Groups



    // #endregion

    // #region Functions

    self.init = function () {
        self.searchBusy(false);
    }



    self.refreshProductFilterButtons = function (causeSelect) {

        //self.busy(true);

        var tradeAccountId = self.tradeAccount.peek() ? self.tradeAccount.peek().TradeAccountID : undefined;

        var ticksNow = new Date().getTime();

        var data = {
            tradeAccountId: tradeAccountId,
            launchId: null,
            clearance: self.clearance(),
            searchNew: self.searchNew(),
            applicationId: 61
        };

        console.log('orderFactory refreshProductFilterButtons calling with', data);

        $.ajax({
            url: '/api/componentapi/productSearchFilters',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('orderFactory refreshProductFilterButtons returned in ' + (new Date().getTime() - ticksNow) + 'ms', data);

                // $currentCat.data('product-filter-group');

                var productFilterGroup = $('.group.product-filter-button-group a.btn-primary').closest('.panel').find('.category-heading').data('product-filter-group');

                self.productFilterButtons(data.CurrentSet);

                self.completeProductFilterSet(data.CompleteSet);

                // what we want is to retain the selection if it's present in the set. 
                // if it's not... then :P please select a category

                // so... this is close, however.
                // it is misleading in that it simply opens the accordion panel which was opened when the buttons refreshed
                // not that which actually contains the selected button, which is what we want.

                // so the correct approach would be to find the accordion panel which is parent to the selected button,
                // and .click() that one open. To do so we'll need to pull the productFilterGroup from the category-heading 

                window.setTimeout(function () {

                    var $currentCat = $('a.category-heading[data-product-filter-group="' + productFilterGroup + '"]');

                    if ($currentCat.length) {
                        //$('#category-accordion .collapse').collapse({
                        //    toggle: false,
                        //    parent: '#category-accordion'
                        //});
                        window.setTimeout(function () {
                            $currentCat.click();
                            //$currentBut.click();
                            //if ($('#category-accordion a.category-heading[data-product-filter-group="' + productFilterGroup + '"] + .collapse').length) {
                            //    if (!$('#category-accordion a.category-heading[data-product-filter-group="' + productFilterGroup + '"] + .collapse').hasClass('in'))
                            //        $('#category-accordion a.category-heading[data-product-filter-group="' + productFilterGroup + '"]').click();
                            //        //$('#category-accordion a.category-heading[data-product-filter-group="' + productFilterGroup + '"] + .collapse').collapse('show');
                            //}
                        }, 150);
                    }
                }, 0);

                if (self.searchWidget().hasOwnProperty('Value')) {
                    window.setTimeout(function () {

                        if (self.searchWidget().Value != -1) {

                            var found = Enumerable.From(self.groupedProductFilterButtons()).Where(function (x) {
                                return x.Value == self.searchWidget().Value
                            }).SingleOrDefault();


                            if (found != null) {
                                self.searchNonce.valueHasMutated();
                            } else {
                                // no button was found, but we DID previously have a button selected. Please select a category.
                                self.searchWidget({});
                            }
                        } else {

                            var found = Enumerable.From(self.groupedProductFilterButtons()).Where(function (x) {
                                return x.ProductFilterGroupID == self.searchWidget().ProductFilterGroupID &&
                                    x.ProductFilterID == self.searchWidget().ProductFilterID
                            }).SingleOrDefault();

                            if (found != null) {
                                self.searchNonce.valueHasMutated();
                            } else {
                                self.searchWidget({});
                            }
                        }
                    }, 0);
                }

                //self.busy(false);
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    };

    self.reset = function () {
        self.page(1);
        self.pageSize(50);
        self.searchBusy(false);
        self.searchTermHasFocus(false);
        self.filterViewMode(DOWNLOAD_FILTER_MODE_STANDARD);
        self.clearance(DOWNLOAD_SEARCH_TYPE_CURRENT);
        self.selectedFilterCountNonce.valueHasMutated();
        self.searchWidgetGroup(undefined);
        self.resetFilters();
    }

    // Resets the filters seen in the advanced-filters div
    self.resetFilters = function () {
        self.selectedColour(undefined);
        self.selectedBrand(undefined);
        self.selectedLaunch(undefined);
        self.selectedPattern(undefined);
        self.selectedItemType(undefined);
        self.selectedStock(undefined);
        self.selectedMartindale(undefined);
        self.selectedWidth(undefined);
        self.selectedSize(undefined);
        //self.selectedProductType(undefined);
        //self.previousProductType(undefined);
        self.seasonalProducts(false);
    }

    self.fetchItemTypes = function (productFilterId) {
        if (productFilterId) {
            console.log('calling fetchItemTypes with', productFilterId);
            $.ajax({
                url: '/api/componentapi/fetchItemTypes',
                type: 'POST',
                data: {
                    productFilterId: productFilterId
                },
                success: function (data) {
                    console.log('fetchItemTypes returned', data);
                    self.itemTypeFilterButtons(data);
                }
            });
        }
    }

    self.fetchSizes = function (productFilterId) {
        if (productFilterId) {
            console.log('calling fetchSizes with', productFilterId);
            $.ajax({
                url: '/api/componentapi/fetchSizes',
                type: 'POST',
                data: {
                    productFilterId: productFilterId
                },
                success: function (data) {
                    console.log('fetchSizes returned', data);
                    self.sizeFilterButtons(data);
                }
            });
        }
    }

    self.brandLogoSrc = function (brandId) {
        switch (brandId) {
            case 1:
                return '/Content/images/logos/christian-lacroix.png';
                break;
            case 2:
                return '/Content/images/logos/designers-guild.png';
                break;
            case 3:
                return '/Content/images/logos/designers-guild-essentials.png';
                break;
            case 4:
                return '/Content/images/logos/designers-guild-kids.png';
                break;
            case 5:
                return '/Content/images/logos/designers-guild-unlimited.png';
                break;
            case 6:
                return '/Content/images/logos/the-royal-collection.png';
                break;
            case 8:
                return '/Content/images/logos/william-yeoward.png';
                break;
            case 9:
                return '/Content/images/logos/ralph-lauren.png';
                break;
            case 14:
                return '/Content/images/logos/john-derian.png';
                break;
            default:
                break;
        }
    }

    self.downloadShopifyCSV = function () {
        self.downloadBusy(true);

        var data = {
            tradeAccountId: self.tradeAccount().TradeAccountID,
            displayPrices: true,
            IDs: self.resultGridWidget().selectedKeyNames(),
            unitOfMeasurement: self.unitOfMeasurement()
        }

        if (window.fetch && false) {
            const url = '/api/downloadproductsapi/ProductImagesDownloadShopifyCSV';
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.BearerToken
                }
            }).then(function (response) {
                return response.blob();
            }).then(function (blob) {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'Shopify.csv';
                link.click();
                self.downloadBusy(false);
            });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/api/downloadproductsapi/ProductImagesDownloadShopifyCSV', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.BearerToken);
            //Now set response type
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('load', function () {
                self.downloadBusy(false);
                if (xhr.status === 200) {
                    //console.log(xhr.response) // ArrayBuffer
                    var blob = new Blob([xhr.response]); // Blob
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'Shopify.csv';
                    link.click();
                    self.downloadBusy(false);
                } else {
                    console.error(xhr.response);
                }
            })
            xhr.send(JSON.stringify(data));
        }
    }

    self.downloadMagentoXML = function () {
        self.downloadBusy(true);

        var data = {
            tradeAccountId: self.tradeAccount().TradeAccountID,
            displayPrices: true,
            IDs: self.resultGridWidget().selectedKeyNames()
        }

        if (window.fetch && false) {
            const url = '/api/downloadproductsapi/ProductImagesDownloadMagentoXML';
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.BearerToken
                }
            }).then(function (response) {
                return response.blob();
            }).then(function (blob) {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'Magento.xml';
                link.click();
                self.downloadBusy(false);
            });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/api/downloadproductsapi/ProductImagesDownloadMagentoXML', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.BearerToken);
            //Now set response type
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('load', function () {
                self.downloadBusy(false);
                if (xhr.status === 200) {
                    //console.log(xhr.response) // ArrayBuffer
                    var blob = new Blob([xhr.response]); // Blob
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'Magento.xml';
                    link.click();
                    self.downloadBusy(false);
                } else {
                    console.error(xhr.response);
                }
            })
            xhr.send(JSON.stringify(data));
        }
    }

    self.downloadWooCommerceXML = function () {
        self.downloadBusy(true);

        var data = {
            tradeAccountId: self.tradeAccount().TradeAccountID,
            displayPrices: true,
            IDs: self.resultGridWidget().selectedKeyNames()
        }

        if (window.fetch && false) {
            const url = '/api/downloadproductsapi/ProductImagesDownloadWooCommerceXML';
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.BearerToken
                }
            }).then(function (response) {
                return response.blob();
            }).then(function (blob) {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'WooCommerce.xml';
                link.click();
                self.downloadBusy(false);
            });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/api/downloadproductsapi/ProductImagesDownloadWooCommerceXML', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.BearerToken);
            //Now set response type
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('load', function () {
                self.downloadBusy(false);
                if (xhr.status === 200) {
                    //console.log(xhr.response) // ArrayBuffer
                    var blob = new Blob([xhr.response]); // Blob
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'WooCommerce.xml';
                    link.click();
                    self.downloadBusy(false);
                } else {
                    console.error(xhr.response);
                }
            })
            xhr.send(JSON.stringify(data));
        }
    }

    self.downloadExcelSpreadsheet = function () {
        self.downloadBusy(true);

        var data = {
            tradeAccountId: self.tradeAccount().TradeAccountID,
            displayPrices: true,
            IDs: self.resultGridWidget().selectedKeyNames()
        }

        if (window.fetch && false) {
            const url = '/api/downloadproductsapi/ProductImagesDownloadExcelSpreadsheet';
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.BearerToken
                }
            }).then(function (response) {
                return response.blob();
            }).then(function (blob) {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'Designers-Guild-Products.xlsx';
                link.click();
                self.downloadBusy(false);
            });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/api/downloadproductsapi/ProductImagesDownloadExcelSpreadsheet', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.BearerToken);
            //Now set response type
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('load', function () {
                self.downloadBusy(false);
                if (xhr.status === 200) {
                    //console.log(xhr.response) // ArrayBuffer
                    var blob = new Blob([xhr.response]); // Blob
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'Designers-Guild-Products.xlsx';
                    link.click();
                    self.downloadBusy(false);
                } else {
                    console.error(xhr.response);
                }
            })
            xhr.send(JSON.stringify(data));
        }
    }

    self.imageDownloaderForWindows = function () {
        self.downloadBusy(true);

        var data = {
            tradeAccountId: self.tradeAccount().TradeAccountID,
            displayPrices: true,
            IDs: self.resultGridWidget().selectedKeyNames()
        }

        if (window.fetch && false) {
            const url = '/api/downloadproductsapi/ProductImagesDownloadForWindows';
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.BearerToken
                }
            }).then(function (response) {
                return response.blob();
            }).then(function (blob) {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'Designers-Guild-Image-Downloader.exe';
                link.click();
                self.downloadBusy(false);
            });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/api/downloadproductsapi/ProductImagesDownloadForWindows', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.BearerToken);
            //Now set response type
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('load', function () {
                self.downloadBusy(false);
                if (xhr.status === 200) {
                    //console.log(xhr.response) // ArrayBuffer
                    var blob = new Blob([xhr.response]); // Blob
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'Designers-Guild-Image-Downloader.exe';
                    link.click();
                    self.downloadBusy(false);
                } else {
                    console.error(xhr.response);
                }
            })
            xhr.send(JSON.stringify(data));
        }
    }

    self.imageDownloaderForMac = function () {
        self.downloadBusy(true);

        var data = {
            tradeAccountId: self.tradeAccount().TradeAccountID,
            displayPrices: true,
            IDs: self.resultGridWidget().selectedKeyNames()
        }

        if (window.fetch && false) {
            const url = '/api/downloadproductsapi/ProductImagesDownloadForMac';
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.BearerToken
                }
            }).then(function (response) {
                return response.blob();
            }).then(function (blob) {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'Designers-Guild-Image-Downloader.dmg';
                link.click();
                self.downloadBusy(false);
            });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/api/downloadproductsapi/ProductImagesDownloadForMac', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.BearerToken);
            //Now set response type
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('load', function () {
                self.downloadBusy(false);
                if (xhr.status === 200) {
                    //console.log(xhr.response) // ArrayBuffer
                    var blob = new Blob([xhr.response]); // Blob
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'Designers-Guild-Image-Downloader.dmg';
                    link.click();
                    self.downloadBusy(false);
                } else {
                    console.error(xhr.response);
                }
            })
            xhr.send(JSON.stringify(data));
        }
    }

    self.acceptTerms = function () {
        //self.searchBusy(true);
        //$.ajax({
        //    url: '/api/downloadproductsapi/acceptTerms',
        //    type: 'POST',
        //    dataType: 'json',
        //    success: function (data) {
        //        self.searchBusy(false);
        //    },
        //    error: function (xhr, s, a) {
        //        self.searchBusy(false);
        //        $.showError(xhr, s, a);
        //    }
        //});
    }

    self.productFilterButtonClick = function (data) {
        self.selectedProductType(Enumerable.From(self.completeProductFilterSet()).Where(function (x) {
            return x.ProductFilterID == data.ProductFilterID
        }).Select('$.ProductTypeID').Single());
        self.searchWidget(data);
        self.seasonalProducts(data.Seasonal);
    }

    self.productFilterGroupButtonClick = function (data) {

        // how... should we handle the un-click?
        // now that we're permitting searching by PFG, you'd want to clear
        // when you're collapsing a PFG... not re-select the same thing...

        if (data.ProductFilterGroupID == self.searchWidget().ProductFilterGroupID &&
            data.ProductFilterID != null || (
                data.ProductFilterGroupID == null &&
                data.ProductFilterID == null &&
                data.Seasonal == null &&
                data.Value == null // this dumb null checking is because we introduced an "All Products" button and I'm having to smash around stuff... sorry...
            )) {
            // this is necessarily a de-click. Clear stuff.
            self.skipFirst(true);
            self.searchWidget({
                Value: null,
                ProductFilterID: null,
                ProductFilterGroupID: null,
                Seasonal: null
            });
            //window.setTimeout(function () {
            //    self.busy(false);
            //}, 0);
        } else {
            self.selectedProductType(Enumerable.From(self.completeProductFilterSet()).Where(function (x) {
                return x.ProductFilterGroupID == data.ProductFilterGroupID
            }).Select('$.ProductTypeID').FirstOrDefault());
            self.searchWidget(data);
            self.seasonalProducts(data.Seasonal);
        }
    };

    // #endregion
}

var downloadSearchResult = function (record, parent) {
    var self = this;

    self.parent = parent;

    self.record = record;
}