var priceChecker = function (tradeAccount, permitMarketChange) {
    var self = this;

    // comes into play in Leads & Customers - CustomerModal - Prices view.
    var permitMarketChange = typeof permitMarketChange === 'undefined' ? true : permitMarketChange;

    if (typeof tradeAccount != 'function')
        console.error('priceChecker expects tradeAccount observable');

    // passing computed observable, by reference.
    self.tradeAccount = tradeAccount;

    self.selectedTradeAccountId = ko.computed({
        read: function () {
            if (self.tradeAccount())
                return self.tradeAccount().TradeAccountID;
            else
                return undefined;
        }
    }, self);

    var selectedMarketId = undefined;
    var selectedTradePriceListId = undefined;
    var selectedCurrencyId = undefined;

    if (ko.unwrap(tradeAccount) != null) {
        var ta = ko.unwrap(self.tradeAccount);
        selectedMarketId = ta.MarketID;
        selectedTradePriceListId = ta.TradePriceListID;
        selectedCurrencyId = ta.CurrencyID;
    }

    self.permitMarketChange = ko.observable(permitMarketChange);

    self.selectedMarketId = ko.observable(selectedMarketId);
    self.selectedTradePriceListId = ko.observable(selectedTradePriceListId);
    self.selectedCurrencyId = ko.observable(selectedCurrencyId);

    self.tradePriceListWidget = ko.observable();

    self.selectedCurrency = ko.pureComputed({
        read: function () {
            if (self.selectedCurrencyId()) {
                return Enumerable.From(getAvailablCurrencies()).Where("$.CurrencyID == " + self.selectedCurrencyId()).FirstOrDefault();
            } else if (self.selectedTradePriceListId()) {
                if (self.tradePriceListWidget().select().length) {
                    for (var i = 0; i < e.sender.select().length; i++) {
                        var currencyId = self.tradePriceListWidget().dataSource.view()[$(eself.tradePriceListWidget().select()[i]).index()].CurrencyID;
                    }
                }
                return Enumerable.From(getAvailablCurrencies()).Where("$.CurrencyID == " + currencyId).FirstOrDefault();
            }
            else if (self.tradeAccount().selected()) {
                return Enumerable.From(getAvailablCurrencies()).Where("$.CurrencyID == " + self.tradeAccount().CurrencyID).FirstOrDefault();
            } else {
                return {
                    FormattingCulture: "en-GB",
                    Code: "GBP"
                }
            }
        }
    }, self);

    self.pricingResults = ko.observableArray([]);

    self.searchTerm = ko.observable();
    self.busy = ko.observable(false);
    self.priceCheckResults = ko.observableArray([]);

    self.quantity = ko.observable();
    self.date = ko.observable();

    self.selectedBrandIDs = ko.observableArray([]).extend({ rateLimit: 200 });
    self.selectedProductTypeGroupIDs = ko.observableArray([]).extend({ rateLimit: 200 });
    self.selectedProductTypeIDs = ko.observableArray([]).extend({ rateLimit: 200 });
    self.selectedItemTypeIDs = ko.observableArray([]).extend({ rateLimit: 200 });
    self.selectedLaunchIDs = ko.observableArray([]).extend({ rateLimit: 200 });
    self.selectedSeasonIDs = ko.observableArray([]).extend({ rateLimit: 200 });

    self.selectedCollectionID = ko.observable();
    self.selectedQualityID = ko.observable();
    self.selectedProductID = ko.observable();
    self.selectedBrandID = ko.observable();
    self.selectedProductTypeID = ko.observable();
    self.freeTextSearch = ko.observable();

    self.selectedIncludeClearance = ko.observable(false);
    self.selectedIncludeSamples = ko.observable(false);

    self.brandWidget = ko.observable();
    self.productTypeGroupWidget = ko.observable();
    self.productTypeWidget = ko.observable();
    self.itemTypeWidget = ko.observable();
    self.launchWidget = ko.observable();
    self.seasonWidget = ko.observable();
    self.includeClearanceWidget = ko.observable();
    self.includeSamplesWidget = ko.observable();

    self.querySwitchWidget = ko.observable();

    self.cacheBuster = ko.observable(false);

    self.yesNoOptions = [
        { Name: 'Yes', Value: true },
        { Name: 'No', Value: false }
    ];

    self.hideAllGridColumns = function () {
        for (var i = 0; i < self.resultGridWidget().columns.length; i++)
            self.resultGridWidget().hideColumn(self.resultGridWidget().columns[i]);
    }

    self.resultGridWidget = ko.observable();

    self.currentQuery = ko.observable('ListPrices');

    self.currentQuery.subscribe(function (newValue) {
        //console.log('priceChecker currentQuery subscribe hit: ' + newValue);

        if (self.resultGridWidget().pager.page() != 0 &&
            self.resultGridWidget().pager.page() != 1) {
            //console.log('priceChecker grid page was ' + self.resultGridWidget().pager.page() + ', paging to page 1');
            self.resultGridWidget().pager.page(1);
        }
    });

    self.displayCustomerPricesColumns = function () {
        // unlock
        self.resultGridWidget().unlockColumn('Discount');
        self.resultGridWidget().unlockColumn('QtyBreak');
        self.resultGridWidget().unlockColumn('ValidFrom');
        self.resultGridWidget().unlockColumn('ValidTo');
        self.resultGridWidget().unlockColumn('Status');
        // show
        self.resultGridWidget().showColumn('ImageOne');
        self.resultGridWidget().showColumn('ImageTwo');
        self.resultGridWidget().showColumn('Code');
        self.resultGridWidget().showColumn('Name');
        self.resultGridWidget().showColumn('RRP');
        self.resultGridWidget().showColumn('ListPrice');
        self.resultGridWidget().showColumn('CustomerPrice');
        self.resultGridWidget().showColumn('ImageTwo');
        self.resultGridWidget().showColumn('ClearanceString');
        self.resultGridWidget().showColumn('Discount');
        self.resultGridWidget().showColumn('QtyBreak');
        self.resultGridWidget().showColumn('ValidFrom');
        self.resultGridWidget().showColumn('ValidTo');
        self.resultGridWidget().showColumn('Cost');
        self.resultGridWidget().showColumn('TargetMargin');
        self.resultGridWidget().showColumn('GrossMargin');
        self.resultGridWidget().showColumn('MarginDisparity');
        self.resultGridWidget().showColumn('Launch');
        self.resultGridWidget().showColumn('Brand');
        self.resultGridWidget().showColumn('ProductType');
        self.resultGridWidget().showColumn('ItemType');
        self.resultGridWidget().showColumn('PricingLevel');
        self.resultGridWidget().showColumn('AgreementType');
        //self.resultGridWidget().showColumn('DefaultSortOrder');
    }

    self.displayListPricesColumns = function () {
        // unlock not required: columns which may be locked will remain hidden?
        // show
        self.resultGridWidget().showColumn('ImageOne');
        self.resultGridWidget().showColumn('ImageTwo');
        self.resultGridWidget().showColumn('Code');
        self.resultGridWidget().showColumn('Name');
        self.resultGridWidget().showColumn('RRP');
        self.resultGridWidget().showColumn('ListPrice');
        self.resultGridWidget().showColumn('ClearanceString');
        self.resultGridWidget().showColumn('Cost');
        self.resultGridWidget().showColumn('TargetMargin');
        self.resultGridWidget().showColumn('GrossMargin');
        self.resultGridWidget().showColumn('MarginDisparity');
        self.resultGridWidget().showColumn('Launch');
        self.resultGridWidget().showColumn('Brand');
        self.resultGridWidget().showColumn('ProductType');
        self.resultGridWidget().showColumn('ItemType');
        self.resultGridWidget().showColumn('Market');
        self.resultGridWidget().showColumn('Currency');
        self.resultGridWidget().showColumn('TradePriceList');
        self.resultGridWidget().showColumn('PricingLevel');
        //self.resultGridWidget().showColumn('DefaultSortOrder');
    }

    self.displayContractPricesColumns = function () {
        //unlock
        self.resultGridWidget().unlockColumn('Discount');
        self.resultGridWidget().unlockColumn('QtyBreak');
        self.resultGridWidget().unlockColumn('ValidFrom');
        self.resultGridWidget().unlockColumn('ValidTo');
        self.resultGridWidget().unlockColumn('Status');
        //show
        self.resultGridWidget().showColumn('Account');
        self.resultGridWidget().showColumn('ImageOne');
        self.resultGridWidget().showColumn('ImageTwo');
        self.resultGridWidget().showColumn('Code');
        self.resultGridWidget().showColumn('Name');
        self.resultGridWidget().showColumn('RRP');
        self.resultGridWidget().showColumn('ListPrice');
        self.resultGridWidget().showColumn('CustomerPrice');
        self.resultGridWidget().showColumn('ClearanceString');
        self.resultGridWidget().showColumn('Discount');
        self.resultGridWidget().showColumn('QtyBreak');
        self.resultGridWidget().showColumn('ValidFrom');
        self.resultGridWidget().showColumn('ValidTo');
        self.resultGridWidget().showColumn('Cost');
        self.resultGridWidget().showColumn('TargetMargin');
        self.resultGridWidget().showColumn('GrossMargin');
        self.resultGridWidget().showColumn('MarginDisparity');
        self.resultGridWidget().showColumn('Launch');
        self.resultGridWidget().showColumn('Brand');
        self.resultGridWidget().showColumn('ProductType');
        self.resultGridWidget().showColumn('ItemType');
        self.resultGridWidget().showColumn('Market');
        self.resultGridWidget().showColumn('Currency');
        self.resultGridWidget().showColumn('TradePriceList');
        self.resultGridWidget().showColumn('PricingLevel');
        self.resultGridWidget().showColumn('AgreementType');
        //self.resultGridWidget().showColumn('DefaultSortOrder');
    }

    self.displayProductsNoPricesColumns = function () {
        // unlock
        self.resultGridWidget().unlockColumn('Discount');
        self.resultGridWidget().unlockColumn('QtyBreak');
        self.resultGridWidget().unlockColumn('ValidFrom');
        self.resultGridWidget().unlockColumn('ValidTo');
        self.resultGridWidget().unlockColumn('Status');
        //show
        self.resultGridWidget().showColumn('ImageOne');
        self.resultGridWidget().showColumn('ImageTwo');
        self.resultGridWidget().showColumn('Code');
        self.resultGridWidget().showColumn('Name');
        self.resultGridWidget().showColumn('RRP');
        self.resultGridWidget().showColumn('ClearanceString');
        self.resultGridWidget().showColumn('Cost');
        self.resultGridWidget().showColumn('TargetMargin');
        self.resultGridWidget().showColumn('Launch');
        self.resultGridWidget().showColumn('Brand');
        self.resultGridWidget().showColumn('ProductType');
        self.resultGridWidget().showColumn('ItemType');
        self.resultGridWidget().showColumn('Market');
        self.resultGridWidget().showColumn('Currency');
        self.resultGridWidget().showColumn('TradePriceList');
        self.resultGridWidget().showColumn('PricingLevel');
        //self.resultGridWidget().showColumn('DefaultSortOrder');
    }

    self.displayLowMarginColumns = function () {
        //unlock
        self.resultGridWidget().unlockColumn('Discount');
        self.resultGridWidget().unlockColumn('QtyBreak');
        self.resultGridWidget().unlockColumn('ValidFrom');
        self.resultGridWidget().unlockColumn('ValidTo');
        self.resultGridWidget().unlockColumn('Status');
        //show
        self.resultGridWidget().showColumn('Account');
        self.resultGridWidget().showColumn('ImageOne');
        self.resultGridWidget().showColumn('ImageTwo');
        self.resultGridWidget().showColumn('Code');
        self.resultGridWidget().showColumn('Name');
        self.resultGridWidget().showColumn('RRP');
        self.resultGridWidget().showColumn('ListPrice');
        self.resultGridWidget().showColumn('CustomerPrice');
        self.resultGridWidget().showColumn('ClearanceString');
        self.resultGridWidget().showColumn('Discount');
        self.resultGridWidget().showColumn('QtyBreak');
        self.resultGridWidget().showColumn('ValidFrom');
        self.resultGridWidget().showColumn('ValidTo');
        self.resultGridWidget().showColumn('Cost');
        self.resultGridWidget().showColumn('TargetMargin');
        self.resultGridWidget().showColumn('GrossMargin');
        self.resultGridWidget().showColumn('MarginDisparity');
        self.resultGridWidget().showColumn('Launch');
        self.resultGridWidget().showColumn('Brand');
        self.resultGridWidget().showColumn('ProductType');
        self.resultGridWidget().showColumn('ItemType');
        self.resultGridWidget().showColumn('Market');
        self.resultGridWidget().showColumn('Currency');
        self.resultGridWidget().showColumn('TradePriceList');
        self.resultGridWidget().showColumn('PricingLevel');
        self.resultGridWidget().showColumn('AgreementType');
        //self.resultGridWidget().showColumn('DefaultSortOrder');
    }

    self.displayContractAgreementsColumns = function () {
        //show
        self.resultGridWidget().showColumn('Account');
        self.resultGridWidget().showColumn('CustomerPrice');
        self.resultGridWidget().showColumn('Discount');
        self.resultGridWidget().showColumn('QtyBreak');
        self.resultGridWidget().showColumn('ValidFrom');
        self.resultGridWidget().showColumn('ValidTo');
        self.resultGridWidget().showColumn('Status');
        self.resultGridWidget().showColumn('Brand');
        self.resultGridWidget().showColumn('ProductGroup');
        self.resultGridWidget().showColumn('ItemType');
        self.resultGridWidget().showColumn('Quality');
        self.resultGridWidget().showColumn('Product');
        self.resultGridWidget().showColumn('Market');
        self.resultGridWidget().showColumn('Currency');
        self.resultGridWidget().showColumn('TradePriceList');
        self.resultGridWidget().showColumn('PricingLevel');
        self.resultGridWidget().showColumn('AgreementType');
        //self.resultGridWidget().showColumn('DefaultSortOrder');
        //lock
        self.resultGridWidget().lockColumn('Discount');
        self.resultGridWidget().showColumn('CustomerPrice');
        self.resultGridWidget().lockColumn('QtyBreak');
        self.resultGridWidget().lockColumn('ValidFrom');
        self.resultGridWidget().lockColumn('ValidTo');
        self.resultGridWidget().lockColumn('Status');
    }

    self.clearanceFilter = function (element) {
        element.kendoDropDownList({
            dataSource: ['Yes', 'No'],
            optionLabel: 'Select'
        });
    }

    self.marginDisparityFilter = function (element) {
        element.kendoDropDownList({
            dataSource: [{ text: 'On Target', val: 10 }, { text: 'Below Target', val: 5 }],
            dataTextField: 'text',
            dataValueField: 'val',
            optionLabel: {
                text: 'Select',
                val: undefined
            }
        });
    }

    self.specialPriceTypeFilter = function (element) {
        element.kendoDropDownList({
            dataSource: [{ text: 'Special Price', val: 'P' }, { text: 'Special Discount', val: 'D' }],
            dataTextField: 'text',
            dataValueField: 'val',
            optionLabel: {
                text: 'Select',
                val: undefined
            }
        });
    }

    self.statusFilter = function (element) {
        element.kendoDropDownList({
            dataSource: [{ text: 'Current', val: 'C' }, { text: 'Future', val: 'F' }, { text: 'Old', val: 'O' }],
            dataTextField: 'text',
            dataValueField: 'val',
            optionLabel: {
                text: 'Select',
                val: undefined
            }
        });
    }

    self.pricingLevelFilter = function (element) {
        element.kendoDropDownList({
            dataSource: [
                'Brand & ProductGroup',
                'Brand & ItemType',
                'ProductGroup',
                'ItemType',
                'Product',
                'Quality',
                'Design'
            ],
            optionLabel: 'Select'
        });
    }

    self.imageColumnTemplate = function (rec) {
        var result = "";
        if (rec.ImageID) {
            result = "<img class='grid-thumb' src='https://www.designersguild.com/image/90/" + rec.ImageID + "'/>";
        }
        if (rec.ProductPageID) {
            result = "<a target='_blank' href='https://www.designersguild.com/uk/p" + rec.ProductPageID + "'>" + result + "</a>";
        }
        return result;
    }

    self.nameColumnTemplate = function (rec) {
        var result = "";
        var name = rec.Name || "[No Name]";
        result += "<span>" + name + "</span>"
        if (rec.ProductPageID) {
            result = "<a target='_blank' href='https://www.designersguild.com/uk/p" + rec.ProductPageID + "'>" + result + "</a>";
        }
        return result;
    }

    self.grossMarginTemplate = function (rec) {
        if (rec.hasOwnProperty('GrossMargin')) {
            return kendo.format("{0:p}", rec.GrossMargin);
        } else {
            return '';
        }
    }

    self.accountTemplate = function (rec) {
        if (rec.hasOwnProperty('TradeAccountCode')) {
            return rec.TradeAccountCode + ' - ' + rec.TradeAccountName;
        } else {
            return '';
        }
    }

    self.discountTemplate = function (rec) {

        switch (rec.AgreementType) {
            case 'D':
                return rec.Discount + '% off';
                break;
            case 'P':
                if (rec.CurrencyFormattingCulture && rec.CurrencyCode) {
                    return formatCurrency(rec.Discount, 2, rec.CurrencyFormattingCulture, rec.CurrencyCode) + ' off';
                } else {
                    return rec.Discount;
                }
                break;
            default:
                return '';
                break;
        }
    }

    self.rrpTemplate = function (rec) {
        if (rec.RRP) {
            if (rec.CurrencyFormattingCulture && rec.CurrencyCode) {
                return formatCurrency(rec.RRP, 2, rec.CurrencyFormattingCulture, rec.CurrencyCode);
            } else {
                return rec.RRP;
            }
        } else {
            return '';
        }
    }

    self.listPriceTemplate = function (rec) {
        if (rec.CurrencyFormattingCulture && rec.CurrencyCode) {
            return formatCurrency(rec.ListPrice, 2, rec.CurrencyFormattingCulture, rec.CurrencyCode);
        } else {
            return rec.ListPrice;
        }
    }

    self.customerPriceTemplate = function (rec) {
        //console.log(rec);
        if (rec.CurrencyFormattingCulture && rec.CurrencyCode) {
            return formatCurrency(rec.CustomerPrice, 2, rec.CurrencyFormattingCulture, rec.CurrencyCode);
        } else {
            return rec.CustomerPrice || '';
        }
    }

    self.costTemplate = function (rec) {
        return formatCurrency(rec.Cost, 2, 'en-GB', 'GBP');
    }

    self.tradePriceListTemplate = function (rec) {
        if (rec.TradePriceList)
            return '<span title="' + rec.TradePriceList + '">' + rec.TradePriceList + '</span>';
        else
            return '';
    }

    self.allGridColumns = [
        {
            field: 'Account',
            title: 'Account',
            locked: true,
            width: 140,
            template: self.accountTemplate,
            filterable: false
        },
        {
            field: 'ImageOne',
            title: ' ',
            width: 70,
            locked: true,
            filterable: false,
            template: self.imageColumnTemplate
        },
        {
            field: 'Code',
            title: 'Code',
            locked: true,
            width: 110
        },
        {
            field: 'Name',
            title: 'Name',
            locked: true,
            width: 140,
            template: self.nameColumnTemplate
        },
        {
            field: 'RRP',
            title: 'RRP',
            locked: true,
            template: self.rrpTemplate,
            width: 70
        },
        {
            field: 'ListPrice',
            title: 'List Price',
            locked: true,
            template: self.listPriceTemplate,
            width: 70
        },
        {
            field: 'CustomerPrice',
            title: 'Customer Price',
            locked: true,
            template: self.customerPriceTemplate,
            width: 100
        },
        {
            field: 'ClearanceString',
            title: 'Clearance',
            width: 100,
            filterable: {
                extra: false,
                ui: self.clearanceFilter
            }
        },
        {
            field: 'ImageTwo',
            title: ' ',
            width: 0,
            template: self.imageColumnTemplate
        },
        {
            field: 'Discount',
            title: 'Discount',
            locked: true,
            type: 'Number',
            format: "{0:c2}",
            width: 90,
            template: self.discountTemplate
        },
        {
            field: 'QtyBreak',
            title: 'Qty Break',
            width: 70
        },
        {
            field: 'ValidFrom',
            title: 'Valid From',
            width: 110,
            type: 'date',
            format: "{0:dd/MM/yyyy}"
        },
        {
            field: 'ValidTo',
            title: 'Valid To',
            width: 110,
            type: 'date',
            format: "{0:dd/MM/yyyy}"
        },
        {
            field: 'Status',
            title: 'Status',
            width: 120,
            hidden: true,
            filterable: {
                extra: false,
                ui: self.statusFilter
            },
            template: function (e) {
                switch (e.Status) {
                    case 'O':
                        return 'Old';
                        break;
                    case 'F':
                        return 'Future'
                        break;
                    case 'C':
                        return 'Current';
                        break;
                    default: break;
                }
            }
        },
        {
            field: 'Cost',
            title: 'Cost',
            width: 80,
            template: self.costTemplate
        },
        {
            field: 'TargetMargin',
            title: 'Target Margin',
            width: 100,
            type: 'Number',
            format: "{0:p}"
        },
        {
            field: 'MarginDisparity',
            title: 'Gross Margin',
            width: 100,
            template: self.grossMarginTemplate,
            filterable: {
                extra: false,
                operators: {
                    string: {
                        eq: 'is'
                    }
                },
                ui: self.marginDisparityFilter
            }
            //,
            //sortable: {
            //    compare: function (a, b, dir) {
            //        if (a.hasOwnProperty('GrossMargin') && b.hasOwnProperty('GrossMargin'))
            //            return a.GrossMargin - b.GrossMargin;
            //        else
            //            return 0;
            //    }
            //}
        },
        {
            field: 'GrossMargin',
            title: '',
            width: 0
        },
        {
            field: 'Launch',
            title: 'Launch',
            width: 120,
            filterable: false
        },
        {
            field: 'Brand',
            title: 'Brand',
            width: 120,
            filterable: false
        },
        {
            field: 'ProductType',
            title: 'Product Type',
            filterable: false,
            width: 140
        },
        {
            field: 'ProductGroup',
            title: 'Product Group',
            width: 150,
            hidden: true,
            filterable: false
        },
        {
            field: 'ItemType',
            title: 'Item Type',
            width: 120,
            filterable: false
        },
        {
            field: 'Quality',
            title: 'Quality',
            filterable: false,
            width: 120,
            hidden: true
        },
        {
            field: 'Product',
            title: 'Product',
            filterable: false,
            width: 120,
            hidden: true
        },
        {
            field: 'Market',
            title: 'Market',
            width: 120,
            filterable: false
        },
        {
            field: 'Currency',
            title: 'Currency',
            width: 120,
            filterable: false
        },
        {
            field: 'TradePriceList',
            title: 'Price List',
            width: 120,
            filterable: false,
            template: self.tradePriceListTemplate
        },
        {
            field: 'PricingLevel',
            title: 'Price Level',
            width: 160,
            filterable: {
                extra: false,
                ui: self.pricingLevelFilter
            }
        },
        {
            field: 'AgreementType',
            title: 'Agreement Type',
            width: 110,
            filterable: {
                extra: false,
                ui: self.specialPriceTypeFilter
            },
            template: function (e) {
                switch (e.AgreementType) {
                    case 'P':
                        return 'Special Price';
                        break;
                    case 'D':
                        return 'Special Discount';
                        break;
                    default:
                        return '';
                        break;
                }
            },
            hidden: true
        },
        {
            field: 'Value',
            title: 'Value',
            width: 120,
            hidden: true
        },
        {
            field: 'DefaultSortOrder',
            title: 'Sort',
            width: 80,
            hidden: false,
            fitlerable: false
        }
    ]

    self.nonce = ko.observable();

    self.rebindGrid = ko.computed(function () {
        //console.log('priceChecker rebindGrid was computed');
        var t = self.nonce();
        if (self.resultGridWidget()) {

            if (self.resultGridWidget().pager.page() != 0 &&
                self.resultGridWidget().pager.page() != 1) {
                //console.log('priceChecker grid page was ' + self.resultGridWidget().pager.page() + ', paging to page 1');
                self.resultGridWidget().pager.page(1);
            }

            self.resultGridWidget().dataSource.read();
        }
    }, self).extend({ throttle: 500 });

    self.resultGridDataSourceURL = function () {
        //console.log('priceChecker resultGridDataSourceURL hit');
        return '/api/pricing/' + self.currentQuery();
    }

    self.resultGridPDFURL = function () {
        return '/api/pricing/' + self.currentQuery() + 'PDF';
    }

    self.resultGridXLSXURL = function () {
        return '/api/pricing/' + self.currentQuery() + 'XLSX';
    }

    self.resultGridDataSourceData = function () {
        return {
            TradeAccountId: self.selectedTradeAccountId() || null,
            TradePriceListID: self.selectedTradePriceListId() || null,
            MarketID: self.selectedMarketId() || null,
            CurrencyID: self.selectedCurrencyId() || null,
            SearchTerm: self.freeTextSearch() || null,
            CollectionID: self.selectedCollectionID() || null,
            QualityID: self.selectedQualityID() || null,
            ProductID: self.selectedProductID() || null,
            BrandID: self.selectedBrandID() || null,
            ProductTypeID: self.selectedProductTypeID() || null,
            IncludeSamples: self.selectedIncludeSamples(),
            IncludeClearance: self.selectedIncludeClearance(),
            BrandIDs: self.selectedBrandIDs() || [],
            ProductTypeGroupIDs: self.selectedProductTypeGroupIDs() || [],
            ProductTypeIDs: self.selectedProductTypeIDs() || [],
            ItemTypeIDs: self.selectedItemTypeIDs() || [],
            LaunchIDs: self.selectedLaunchIDs() || [],
            SeasonIDs: self.selectedSeasonIDs() || [],
            CacheBuster: self.cacheBuster()
        };
    };

    self.resultGridDataSourceRead = function (options) {
        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);
        var data = self.resultGridDataSourceData();
        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }
        //console.log('priceChecker resultGridDataSourceRead', data);
        $.ajax({
            url: self.resultGridDataSourceURL(),
            type: "GET",
            data: data,
            success: function (data) {
                //console.log('priceChecker resultGridDataSourceRead returned', data);
                options.success(data);
            },
            error: function (data) {
                //console.log('priceChecker resultGridDataSource read returned', data);
                options.error();
                //$.showError(data, 'Error', null);
            }
        });
    };

    self.resultGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.resultGridDataSourceRead
        },
        pageSize: 10,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                fields: {
                    RRP: { type: 'number' },
                    ListPrice: { type: 'number' },
                    CustomerPrice: { type: 'number' },
                    Discount: { type: 'number' },
                    QtyBreak: { type: 'number' },
                    ValidFrom: { type: 'date' },
                    ValidTo: { type: 'date' },
                    Cost: { type: 'number' },
                    TargetMargin: { type: 'number' }
                }
            }
        }),
        sort: { field: "DefaultSortOrder", dir: "asc" },
        requestStart: function (e) {
            $("#price-checker-grid-loading").show();
        },
        requestEnd: function (e) {
            $("#price-checker-grid-loading").hide();
        }
    });

    self.lastQuery = ko.observable();

    /*
       
   "Code",
   "Name",
   "RRP",
   "List Price",
   "Customer Price",
   "Discount",
   "Clearance",
   "Qty Break",
   "Valid From",
   "Valid To",
   "Cost",
   "Target Margin",
   "Gross Margin",
   "Launch",
   "Brand",
   "Product Type",
   "Item Type",
   "Price List",
   "Price Level",
   "Agreement Type"
   
   * 
    * 
    */

    self.resultGridSettings = {
        autoBind: false,
        widget: self.resultGridWidget,
        columns: self.allGridColumns,
        data: self.resultGridDataSource,
        height: 685,
        sortable: true,
        filterable: true,
        reorderable: true,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 200]
        },
        //toolbar: $('#toolbar-template').html(),
        pdf: {
            allPages: true,
            avoidLinks: true,
            paperSize: 'A4',
            margin: {
                top: '2cm',
                left: '1cm',
                right: '1cm',
                bottom: '1cm'
            },
            landscape: true,
            repeatHeaders: true,
            template: $('#grid-page-template').html(),
            scale: 0.8
        },
        dataBound: function (e) {

            // uh oh
            self.cacheBuster(false);

            // no need to hide and show columns if the query hasn't changed
            if (self.lastQuery() != self.currentQuery()) {
                self.hideAllGridColumns();

                window.setTimeout(function () {
                    switch (self.currentQuery()) {
                        case 'CustomerPrices':
                            self.displayCustomerPricesColumns();
                            break;
                        case 'ListPrices':
                            self.displayListPricesColumns();
                            break;
                        case 'ContractPrices':
                            self.displayContractPricesColumns();
                            break;
                        case 'ProductsNoPrices':
                            self.displayProductsNoPricesColumns();
                            break;
                        case 'LowMargin':
                            self.displayLowMarginColumns();
                            break;
                        case 'ContractAgreements':
                            self.displayContractAgreementsColumns();
                            break;
                        default:
                            break;
                    }
                }, 0);
            }

            var rows = e.sender.content.find('tr');
            var marginDisparity = e.sender.wrapper.find(".k-grid-header [data-field='MarginDisparity']");
            if (marginDisparity) {
                var marginDisparityIndex = $(marginDisparity).index();
                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    if (dataItem.Clearance == true) {
                        $(row).addClass('bg-warning');
                        $(row).children('td').addClass('bg-warning');
                    }
                    if (dataItem.MarginDisparity === 5) {
                        $(row).children('td:eq(' + marginDisparityIndex + ')').addClass('alert-danger');
                    }
                })
            }

            self.lastQuery(self.currentQuery());
        },
        filterMenuInit: function (e) {
            //console.log('priceChecker resultGrid filterMenuInit', e);
            if (e.field == "MarginDisparity" ||
                e.field == "ClearanceString" ||
                e.field == "AgreementType" ||
                e.field == "Status" ||
                e.field == "PricingLevel") {
                e.container.find(".k-filter-help-text").hide();
                var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");
                setTimeout(function () {
                    firstValueDropDown.wrapper.hide();
                });
            }
        }
    };

    self.pagerWidget = ko.observable();

    self.resultsToXlsx = function () {

        if (self.resultGridWidget().dataSource.total() == 0) {
            $.info('Info', 'Nothing to export');
            return null;
        }

        if (self.resultGridWidget().dataSource.total() == 0)
            return null;

        var webapi = new kendo.data.transports.webapi({ prefix: "" });

        var gridData = {};

        if (self.resultGridWidget().getOptions().dataSource.filter)
            gridData.filter = self.resultGridWidget().getOptions().dataSource.filter;
        if (self.resultGridWidget().getOptions().dataSource.aggregate)
            gridData.aggregate = self.resultGridWidget().getOptions().dataSource.aggregate;
        if (self.resultGridWidget().getOptions().dataSource.group)
            gridData.group = self.resultGridWidget().getOptions().dataSource.group;
        gridData.page = self.resultGridWidget().getOptions().dataSource.page;
        gridData.pageSize = self.resultGridWidget().getOptions().dataSource.pageSize;
        gridData.sort = self.resultGridWidget().getOptions().dataSource.sort;

        var params = webapi.parameterMap(gridData);
        var data = self.resultGridDataSourceData();
        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        var url = self.resultGridXLSXURL() + '?' + jQuery.param(data);

        window.location = url;

        //self.resultGridWidget().dataSource.fetch(function () {
        //    var data = this.data();
        //    var rows = [];
        //    for (var i = 0; i < data.length; i++) {
        //        //push single row for every record
        //        rows.push({
        //            cells: [
        //              { value: data[i].ProductID },
        //              { value: data[i].Code }
        //            ]
        //        })
        //    }
        //    var workbook = new kendo.ooxml.Workbook({
        //        sheets: [
        //          {
        //              columns: [
        //                // Column settings (width)
        //                { autoWidth: true },
        //                { autoWidth: true }
        //              ],
        //              // Title of the sheet
        //              title: "Products",
        //              // Rows of the sheet
        //              rows: rows
        //          }
        //        ]
        //    });
        //    //save the file as Excel file with extension xlsx
        //    kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "Test.xlsx" });
        //});
    }

    self.resultsToPdf = function () {

        if (self.resultGridWidget().dataSource.total() == 0) {
            $.info('Info', 'Nothing to export');
            return null;
        }

        var webapi = new kendo.data.transports.webapi({ prefix: "" });

        var gridData = {};

        if (self.resultGridWidget().getOptions().dataSource.filter)
            gridData.filter = self.resultGridWidget().getOptions().dataSource.filter;
        if (self.resultGridWidget().getOptions().dataSource.aggregate)
            gridData.aggregate = self.resultGridWidget().getOptions().dataSource.aggregate;
        if (self.resultGridWidget().getOptions().dataSource.group)
            gridData.group = self.resultGridWidget().getOptions().dataSource.group;
        gridData.page = self.resultGridWidget().getOptions().dataSource.page;
        gridData.pageSize = self.resultGridWidget().getOptions().dataSource.pageSize;
        gridData.sort = self.resultGridWidget().getOptions().dataSource.sort;

        var params = webapi.parameterMap(gridData);
        var data = self.resultGridDataSourceData();
        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        var url = self.resultGridPDFURL() + '?' + jQuery.param(data);

        window.location = url;

        //// Client-side processing. Works, crashes for >N rows.
        //var grid = $("#grid").data("kendoGrid");
        //var progress = $.Deferred();

        //kendo.drawing.drawDOM($("#header"), { paperSize: "A4", landscape: true, margin: { left: "1cm", top: "2cm", right: "1cm", bottom: "1cm" } })
        //  .done(function (header) {
        //      kendo.drawing.drawDOM($("#footer"), { paperSize: "A4", landscape: true, margin: { left: "1cm", top: "2cm", right: "1cm", bottom: "1cm" } })
        //        .done(function (footer) {
        //            self.resultGridWidget()._drawPDF(progress)
        //              .then(function (root) {
        //                  root.children.unshift(header);
        //                  root.children.push(footer);

        //                  return kendo.drawing.exportPDF(root, {
        //                      paperSize: "A4",
        //                      margin: { left: "1cm", top: "2cm", right: "1cm", bottom: "1cm" },
        //                      landscape: true,
        //                      multiPage: true
        //                  });
        //              })
        //              .done(function (dataURI) {
        //                  console.log("Okay");
        //                  kendo.saveAs({
        //                      dataURI: dataURI,
        //                      fileName: "test.pdf"
        //                  });
        //                  progress.resolve();
        //              })
        //        });
        //  });
    }

    // pre-slicers

    self.preSlicerQueryJson = ko.pureComputed({
        read: function () {
            var x = {
                MarketID: self.selectedMarketId(),
                TradePriceListID: self.selectedTradePriceListId(),
                CurrencyID: self.selectedCurrencyId()
            };
            return JSON.stringify(x, function (k, v) { return v === undefined ? null : v });
        }
    }, self);

    self.marketDataSourceURL = function () {
        return '/pricing-odata/SlicerMarkets/Functions.Filter(f1=@x)?@x=' + self.preSlicerQueryJson();
    }

    self.tradePriceListDataSourceURL = function () {
        return '/pricing-odata/SlicerTradePriceLists/Functions.Filter(f1=@x)?@x=' + self.preSlicerQueryJson();
    }

    self.currencyDataSourceURL = function () {
        return '/pricing-odata/SlicerCurrencies/Functions.Filter(f1=@x)?@x=' + self.preSlicerQueryJson();
    }

    self.marketDataSource = new kendo.data.DataSource({
        type: 'odata-v4',
        serverFiltering: true,
        serverSorting: true,
        serverGrouping: false,
        sort: {
            field: "Name", dir: "asc"
        },
        transport: {
            read: function (options) {
                $.ajax({
                    type: 'GET',
                    url: self.marketDataSourceURL(),
                    success: function (data) {
                        options.success(data);
                    },
                    error: function (xhr, s, e) {
                        options.error(xhr);
                        //$.showError(xhr);
                    }
                })
            }
        }
    });

    self.tradePriceListDataSource = new kendo.data.DataSource({
        type: 'odata-v4',
        serverFiltering: true,
        serverSorting: true,
        serverGrouping: false,
        sort: {
            field: "Name", dir: "asc"
        },
        transport: {
            read: function (options) {
                $.ajax({
                    type: 'GET',
                    url: self.tradePriceListDataSourceURL(),
                    success: function (data) {
                        options.success(data);
                    },
                    error: function (xhr, s, e) {
                        options.error(xhr);
                        //$.showError(xhr);
                    }
                })
            }
        }
    });

    self.currencyDataSource = new kendo.data.DataSource({
        type: 'odata-v4',
        serverFiltering: true,
        serverSorting: true,
        serverGrouping: false,
        sort: {
            field: "Name", dir: "asc"
        },
        transport: {
            read: function (options) {
                $.ajax({
                    type: 'GET',
                    url: self.currencyDataSourceURL(),
                    success: function (data) {
                        options.success(data);
                    },
                    error: function (xhr, s, e) {
                        options.error(xhr);
                        //$.showError(xhr);
                    }
                })
            }
        }
    });

    self.marketChange = function (e) {

        //console.log('priceChecker marketChange hit');
        if (!e.sender.programmaticSelect) {
            if (e.sender.select().length) {
                for (var i = 0; i < e.sender.select().length; i++) {
                    self.selectedMarketId(e.sender.dataSource.view()[$(e.sender.select()[i]).index()].MarketID);
                }
                self.nonce.valueHasMutated();
                //self.rebindGrid();
            } else {
                self.selectedMarketId(undefined);
            }
        } else {
            e.sender.programmaticSelect = false;
        }
    }

    self.marketDataBound = function (e) {
        var me = e.sender;
        var items = me.items();
        var itemsToSelect = [];
        if (items.length) {
            var found = false;
            items.each(function (idx, item) {
                var di = me.dataItem(item);
                if (self.selectedMarketId() == di['MarketID']) {
                    found = true;
                }
            });
            if (!found) {
                self.selectedMarketId(undefined)
            }
            items.each(function (idx, item) {
                var di = me.dataItem(item);
                if (di['MarketID'] == self.selectedMarketId()) {
                    itemsToSelect.push(item);
                }
            });
            if (self.permitMarketChange()) {
                if (itemsToSelect.length) {
                    me.programmaticSelect = true;
                    me.select(itemsToSelect);
                }
            }
        }
    }

    self.tradePriceListChange = function (e) {

        //console.log('priceChecker tradePriceListChange hit');

        if (!e.sender.programmaticSelect) {
            if (e.sender.select().length) {
                for (var i = 0; i < e.sender.select().length; i++) {
                    self.selectedTradePriceListId(e.sender.dataSource.view()[$(e.sender.select()[i]).index()].TradePriceListID);
                }
                self.nonce.valueHasMutated();
                //self.rebindGrid();
            } else {
                self.selectedTradePriceListId(undefined);
            }
        } else {
            e.sender.programmaticSelect = false;
        }
    }

    self.tradePriceListDataBound = function (e) {
        var me = e.sender;
        var items = me.items();
        var itemsToSelect = [];
        if (items.length) {
            var found = false;
            items.each(function (idx, item) {
                var di = me.dataItem(item);
                if (self.selectedTradePriceListId() == di['TradePriceListID']) {
                    found = true;
                }
            });
            if (!found) {
                self.selectedTradePriceListId(undefined)
            }
            items.each(function (idx, item) {
                var di = me.dataItem(item);
                if (di['TradePriceListID'] == self.selectedTradePriceListId()) {
                    itemsToSelect.push(item);
                }
            });
            if (self.permitMarketChange()) {
                if (itemsToSelect.length) {
                    me.programmaticSelect = true;
                    me.select(itemsToSelect);
                }
            }
        }
    }

    self.currencyChange = function (e) {

        //console.log('priceChecker currencyChange hit');
        if (!e.sender.programmaticSelect) {
            if (e.sender.select().length) {
                for (var i = 0; i < e.sender.select().length; i++) {
                    self.selectedCurrencyId(e.sender.dataSource.view()[$(e.sender.select()[i]).index()].CurrencyID);
                }
                self.nonce.valueHasMutated();
                //self.rebindGrid();
            } else {
                self.selectedCurrencyId(undefined);
            }
        } else {
            e.sender.programmaticSelect = false;
        }
    }

    self.currencyDataBound = function (e) {
        var me = e.sender;
        var items = me.items();
        var itemsToSelect = [];
        if (items.length) {
            var found = false;
            items.each(function (idx, item) {
                var di = me.dataItem(item);
                if (self.selectedCurrencyId() == di['CurrencyID']) {
                    found = true;
                }
            });
            if (!found) {
                self.selectedCurrencyId(undefined)
            }
            items.each(function (idx, item) {
                var di = me.dataItem(item);
                if (di['CurrencyID'] == self.selectedCurrencyId()) {
                    itemsToSelect.push(item);
                }
            });
            if (self.permitMarketChange()) {
                if (itemsToSelect.length) {
                    me.programmaticSelect = true;
                    me.select(itemsToSelect);
                }
            }
        }
    }

    // slicers - if no preslicers NO DATA
    self.queryJson = function () {
        if (self.selectedTradePriceListId() == null &&
            self.selectedMarketId() == null &&
            self.selectedCurrencyId() == null) {
            return '';
        }
        else {
            var x = {
                TradePriceListID: self.selectedTradePriceListId(),
                MarketID: self.selectedMarketId(),
                CurrencyID: self.selectedCurrencyId(),
                SearchTerm: self.freeTextSearch(),
                CollectionID: self.selectedCollectionID(),
                QualityID: self.selectedQualityID(),
                ProductID: self.selectedProductID(),
                BrandID: self.selectedBrandID(),
                ProductTypeID: self.selectedProductTypeID(),
                IncludeClearance: self.selectedIncludeClearance(),
                IncludeSamples: self.selectedIncludeSamples(),
                BrandIDs: self.selectedBrandIDs(),
                ProductTypeGroupIDs: self.selectedProductTypeGroupIDs(),
                ProductTypeIDs: self.selectedProductTypeIDs(),
                ItemTypeIDs: self.selectedItemTypeIDs(),
                LaunchIDs: self.selectedLaunchIDs(),
                SeasonIDs: self.selectedSeasonIDs()
            };
            return 'Functions.Filter(f1=@x)?@x=' + JSON.stringify(x, function (k, v) { return v === undefined ? null : v });
        }
    }

    self.queryJs = function () {
        if (self.selectedTradePriceListId() == null &&
            self.selectedMarketId() == null &&
            self.selectedCurrencyId() == null) {
            return {};
        }
        else {
            var x = {
                TradePriceListID: self.selectedTradePriceListId(),
                MarketID: self.selectedMarketId(),
                CurrencyID: self.selectedCurrencyId(),
                SearchTerm: self.freeTextSearch(),
                CollectionID: self.selectedCollectionID(),
                QualityID: self.selectedQualityID(),
                ProductID: self.selectedProductID(),
                BrandID: self.selectedBrandID(),
                ProductTypeID: self.selectedProductTypeID(),
                IncludeClearance: self.selectedIncludeClearance(),
                IncludeSamples: self.selectedIncludeSamples(),
                BrandIDs: self.selectedBrandIDs(),
                ProductTypeGroupIDs: self.selectedProductTypeGroupIDs(),
                ProductTypeIDs: self.selectedProductTypeIDs(),
                ItemTypeIDs: self.selectedItemTypeIDs(),
                LaunchIDs: self.selectedLaunchIDs(),
                SeasonIDs: self.selectedSeasonIDs()
            };
            return x;
        }
    }

    self.brandDataSourceURL = function () {
        return '/pricing-odata/SlicerBrands/' + self.queryJson();
    }

    self.productTypeGroupDataSourceURL = function () {
        return '/pricing-odata/SlicerProductTypeGroups/' + self.queryJson();
    };

    self.productTypeDataSourceURL = function () {
        return '/pricing-odata/SlicerProductTypes/' + self.queryJson();
    }

    self.itemTypeDataSourceURL = function () {
        return '/pricing-odata/SlicerItemTypes/' + self.queryJson();
    }

    self.launchDataSourceURL = function () {
        return '/pricing-odata/SlicerLaunches/' + self.queryJson();
    }

    self.seasonDataSourceURL = function () {
        return '/pricing-odata/SlicerSeasons/' + self.queryJson();
    }

    self.brandDataSource = new kendo.data.DataSource({
        type: 'odata-v4',
        serverFiltering: true,
        serverSorting: true,
        sort: {
            field: 'Name', dir: 'asc'
        },
        transport: {
            read: function (options) {
                $.ajax({
                    type: 'GET',
                    url: self.brandDataSourceURL(),
                    success: function (data) {
                        options.success(data);
                    },
                    error: function (xhr, s, e) {
                        options.error(xhr);
                        //$.showError(xhr);
                    }
                })
            }
        }
    });

    self.productTypeGroupDataSource = new kendo.data.DataSource({
        type: 'odata-v4',
        serverFiltering: true,
        serverSorting: true,
        serverGrouping: false,
        sort: {
            field: "Name", dir: "asc"
        },
        transport: {
            read: function (options) {
                $.ajax({
                    type: 'GET',
                    url: self.productTypeGroupDataSourceURL(),
                    success: function (data) {
                        options.success(data);
                    },
                    error: function (xhr, s, e) {
                        options.error(xhr);
                        //$.showError(xhr);
                    }
                })
            }
        }
    });

    self.productTypeDataSource = new kendo.data.DataSource({
        type: 'odata-v4',
        serverFiltering: true,
        serverSorting: true,
        sort: {
            field: "Name", dir: "asc"
        },
        transport: {
            read: function (options) {
                $.ajax({
                    type: 'GET',
                    url: self.productTypeDataSourceURL(),
                    success: function (data) {
                        options.success(data);
                    },
                    error: function (xhr, s, e) {
                        options.error(xhr);
                        //$.showError(xhr);
                    }
                })
            }
        }
    });

    self.launchDataSource = new kendo.data.DataSource({
        type: 'odata-v4',
        serverFiltering: true,
        serverSorting: true,
        sort: {
            field: 'LaunchID', dir: 'desc'
        },
        transport: {
            read: function (options) {
                $.ajax({
                    type: 'GET',
                    url: self.launchDataSourceURL(),
                    success: function (data) {
                        options.success(data);
                    },
                    error: function (xhr, s, e) {
                        options.error(xhr);
                        $.showError(xhr);
                    }
                })
            }
        }
    });

    self.seasonDataSource = new kendo.data.DataSource({
        type: 'odata-v4',
        serverFiltering: true,
        serverSorting: true,
        sort: {
            field: 'Name', dir: 'asc'
        },
        transport: {
            read: function (options) {
                $.ajax({
                    type: 'GET',
                    url: self.seasonDataSourceURL(),
                    success: function (data) {
                        options.success(data);
                    },
                    error: function (xhr, s, e) {
                        options.error(xhr);
                        //$.showError(xhr);
                    }
                })
            }
        }
    });

    self.itemTypeDataSource = new kendo.data.DataSource({
        type: 'odata-v4',
        serverFiltering: true,
        serverSorting: true,
        sort: {
            field: "Name", dir: "asc"
        },
        transport: {
            read: function (options) {
                $.ajax({
                    type: 'GET',
                    url: self.itemTypeDataSourceURL(),
                    success: function (data) {
                        options.success(data);
                    },
                    error: function (xhr, s, e) {
                        options.error(xhr);
                        //$.showError(xhr);
                    }
                })
            }
        }
    });

    self.brandDataBound = function (e) {
        var me = e.sender;
        var items = me.items();
        var itemsToSelect = [];
        if (items.length) {
            if (!e.sender.autocompleteSelect) {
                for (var i in self.selectedBrandIDs()) {
                    var b = self.selectedBrandIDs()[i];
                    var found = false;
                    items.each(function (idx, item) {
                        var di = me.dataItem(item);
                        if (b == di['BrandID']) {
                            found = true;
                        }
                    });
                    if (!found) {
                        self.selectedBrandIDs.remove(b);
                    }
                }
                items.each(function (idx, item) {
                    var di = me.dataItem(item);
                    if (self.selectedBrandIDs().indexOf(di['BrandID']) > -1) {
                        itemsToSelect.push(item);
                    }
                });
            } else {
                items.each(function (idx, item) {
                    var di = me.dataItem(item);
                    itemsToSelect.push(item);
                });
                e.sender.autocompleteSelect = false;
            }
            if (itemsToSelect.length) {
                me.programmaticSelect = true;
                me.select(itemsToSelect);
            }
        }
    }

    self.productTypeGroupDataBound = function (e) {
        var me = e.sender;
        var items = me.items();
        var itemsToSelect = [];
        if (items.length) {
            if (!e.sender.autocompleteSelect) {
                for (var i in self.selectedProductTypeGroupIDs()) {
                    var ptg = self.selectedProductTypeGroupIDs()[i];
                    var found = false;
                    items.each(function (idx, item) {
                        var di = me.dataItem(item);
                        if (ptg == di['ProductTypeGroupID']) {
                            found = true;
                        }
                    });
                    if (!found) {
                        self.selectedProductTypeGroupIDs.remove(ptg);
                    }
                }
                $(items).each(function (idx, item) {
                    var di = me.dataItem(item);
                    if (self.selectedProductTypeGroupIDs().indexOf(di['ProductTypeGroupID']) > -1) {
                        itemsToSelect.push(item);
                    }
                });
            } else {
                items.each(function (idx, item) {
                    var di = me.dataItem(item);
                    itemsToSelect.push(item);
                });
                e.sender.autocompleteSelect = false;
            }
            if (itemsToSelect.length) {
                me.programmaticSelect = true;
                me.select(itemsToSelect);
            }
        }
    }

    self.productTypeDataBound = function (e) {
        var me = e.sender;
        var items = me.items();
        var itemsToSelect = [];
        if (items.length) {
            if (!e.sender.autocompleteSelect) {
                for (var i in self.selectedProductTypeIDs()) {
                    var pt = self.selectedProductTypeIDs()[i];
                    var found = false;
                    items.each(function (idx, item) {
                        var di = me.dataItem(item);
                        if (pt == di['ProductTypeID']) {
                            found = true;
                        }
                    });
                    if (!found) {
                        self.selectedProductTypeIDs.remove(pt);
                    }
                }
                items.each(function (idx, item) {
                    var di = me.dataItem(item);
                    if (self.selectedProductTypeIDs().indexOf(di['ProductTypeID']) > -1) {
                        itemsToSelect.push(item);
                    }
                });
            } else {
                items.each(function (idx, item) {
                    var di = me.dataItem(item);
                    itemsToSelect.push(item);
                });
                e.sender.autocompleteSelect = false;
            }
            if (itemsToSelect.length) {
                me.programmaticSelect = true;
                me.select(itemsToSelect);
            }
        }
    }

    self.itemTypeDataBound = function (e) {
        var me = e.sender;
        var items = me.items();
        var itemsToSelect = [];
        if (items.length) {
            if (!e.sender.autocompleteSelect) {
                for (var i in self.selectedItemTypeIDs()) {
                    var it = self.selectedItemTypeIDs()[i];
                    var found = false;
                    items.each(function (idx, item) {
                        var di = me.dataItem(item);
                        if (it == di['ItemTypeID']) {
                            found = true;
                        }
                    });
                    if (!found) {
                        self.selectedItemTypeIDs.remove(it);
                    }
                }
                items.each(function (idx, item) {
                    var di = me.dataItem(item);
                    if (self.selectedItemTypeIDs().indexOf(di['ItemTypeID']) > -1) {
                        itemsToSelect.push(item);
                    }
                });
            } else {
                items.each(function (idx, item) {
                    var di = me.dataItem(item);
                    itemsToSelect.push(item);
                });
                e.sender.autocompleteSelect = false;
            }
            if (itemsToSelect.length) {
                me.programmaticSelect = true;
                me.select(itemsToSelect);
            }
        }
    }

    self.launchDataBound = function (e) {
        var me = e.sender;
        var items = me.items();
        var itemsToSelect = [];
        if (items.length) {
            if (!e.sender.autocompleteSelect) {
                for (var i in self.selectedLaunchIDs()) {
                    var it = self.selectedLaunchIDs()[i];
                    var found = false;
                    items.each(function (idx, item) {
                        var di = me.dataItem(item);
                        if (it == di['LaunchID']) {
                            found = true;
                        }
                    });
                    if (!found) {
                        self.selectedLaunchIDs.remove(it);
                    }
                }
                items.each(function (idx, item) {
                    var di = me.dataItem(item);
                    if (self.selectedLaunchIDs().indexOf(di['LaunchID']) > -1) {
                        itemsToSelect.push(item);
                    }
                });
            } else {
                items.each(function (idx, item) {
                    var di = me.dataItem(item);
                    itemsToSelect.push(item);
                });
                e.sender.autocompleteSelect = false;
            }
            if (itemsToSelect.length) {
                me.programmaticSelect = true;
                me.select(itemsToSelect);
            }
        }
    }

    self.seasonDataBound = function (e) {
        var me = e.sender;
        var items = me.items();
        var itemsToSelect = [];
        if (items.length) {
            if (!e.sender.autocompleteSelect) {
                for (var i in self.selectedSeasonIDs()) {
                    var it = self.selectedSeasonIDs()[i];
                    var found = false;
                    items.each(function (idx, item) {
                        var di = me.dataItem(item);
                        if (it == di['SeasonID']) {
                            found = true;
                        }
                    });
                    if (!found) {
                        self.selectedSeasonIDs.remove(it);
                    }
                }
                items.each(function (idx, item) {
                    var di = me.dataItem(item);
                    if (self.selectedSeasonIDs().indexOf(di['SeasonID']) > -1) {
                        itemsToSelect.push(item);
                    }
                });
            } else {
                items.each(function (idx, item) {
                    var di = me.dataItem(item);
                    itemsToSelect.push(item);
                });
                e.sender.autocompleteSelect = false;
            }
            if (itemsToSelect.length) {
                me.programmaticSelect = true;
                me.select(itemsToSelect);
            }
        }
    }

    self.brandChange = function (e) {
        //console.log('priceChecker brand change hit');

        if (!e.sender.programmaticSelect) {
            if (e.sender.select().length) {
                var arr = [];
                for (var i = 0; i < e.sender.select().length; i++) {
                    arr.push(e.sender.dataSource.view()[$(e.sender.select()[i]).index()].BrandID);
                }
                self.selectedBrandIDs(arr);
            } else {
                self.selectedBrandIDs([]);
            }
            self.nonce.valueHasMutated();
            //self.rebindGrid();

        } else {
            e.sender.programmaticSelect = false;
        }
    }

    self.productTypeGroupChange = function (e) {
        //console.log('priceChecker product type group change hit');

        if (!e.sender.programmaticSelect) {
            if (e.sender.select().length) {
                var arr = [];
                for (var i = 0; i < e.sender.select().length; i++) {
                    arr.push(e.sender.dataSource.view()[$(e.sender.select()[i]).index()].ProductTypeGroupID);
                }
                self.selectedProductTypeGroupIDs(arr);
            } else {
                self.selectedProductTypeGroupIDs([]);
            }

            self.nonce.valueHasMutated();
            //self.rebindGrid();

        } else {
            e.sender.programmaticSelect = false;
        }
    }

    self.productTypeChange = function (e) {
        //console.log('priceChecker product type change hit');

        if (!e.sender.programmaticSelect) {
            if (e.sender.select().length) {
                var arr = [];
                for (var i = 0; i < e.sender.select().length; i++) {
                    arr.push(e.sender.dataSource.view()[$(e.sender.select()[i]).index()].ProductTypeID);
                }
                self.selectedProductTypeIDs(arr);
            } else {
                self.selectedProductTypeIDs([]);
            }

            self.nonce.valueHasMutated();
            //self.rebindGrid();

        } else {
            e.sender.programmaticSelect = false;
        }
    }

    self.itemTypeChange = function (e) {
        //console.log('priceChecker item type change hit');

        if (!e.sender.programmaticSelect) {
            if (e.sender.select().length) {
                var arr = [];
                for (var i = 0; i < e.sender.select().length; i++) {
                    arr.push(e.sender.dataSource.view()[$(e.sender.select()[i]).index()].ItemTypeID);
                }
                self.selectedItemTypeIDs(arr);
            } else {
                self.selectedItemTypeIDs([]);
            }

            self.nonce.valueHasMutated();
            //self.rebindGrid();

        } else {
            e.sender.programmaticSelect = false;
        }
    }

    self.launchChange = function (e) {
        //console.log('priceChecker launch change hit');

        if (!e.sender.programmaticSelect) {
            if (e.sender.select().length) {
                var arr = [];
                for (var i = 0; i < e.sender.select().length; i++) {
                    arr.push(e.sender.dataSource.view()[$(e.sender.select()[i]).index()].LaunchID);
                }
                self.selectedLaunchIDs(arr);
            } else {
                self.selectedLaunchIDs([]);
            }

            self.nonce.valueHasMutated();
            //self.rebindGrid();

        } else {
            e.sender.programmaticSelect = false;
        }
    }

    self.seasonChange = function (e) {
        //console.log('priceChecker season change hit');

        if (!e.sender.programmaticSelect) {
            if (e.sender.select().length) {
                var arr = [];
                for (var i = 0; i < e.sender.select().length; i++) {
                    arr.push(e.sender.dataSource.view()[$(e.sender.select()[i]).index()].SeasonID);
                }
                self.selectedSeasonIDs(arr);
            } else {
                self.selectedSeasonIDs([]);
            }

            self.nonce.valueHasMutated();
            //self.rebindGrid();

        } else {
            e.sender.programmaticSelect = false;
        }
    }

    self.openPriceCheckModal = function () {
        $("#price-checker-modal").modal('show');
    }

    self.initPriceCheckerAutocomplete = function () {
        $("#price-checker-search").autocomplete({
            appendTo: 'body',
            source: function (request, response) {
                $.ajax({
                    url: "/Component/PriceCheckerAutocomplete",
                    type: "POST",
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.Name,
                                value: item
                            };
                        }));
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //$.showError(xhr, textStatus, errorThrown);
                    }
                });
            },
            search: function (e, ui) {
                $(this).data("ui-autocomplete").menu.bindings = $();
            },
            minLength: 3,
            select: function (event, ui) {
                event.preventDefault();

                //console.log('priceChecker autoComplete select', ui.item.value);

                self.clearAutocompleteSelection();

                switch (ui.item.value.Type) {
                    case 'Product':
                        $("#price-checker-search").val(ui.item.label);
                        //self.selectedProductID(ui.item.value.ID);
                        break;
                    case 'Collection':
                        $("#price-checker-search").val(ui.item.label);
                        //self.selectedCollectionID(ui.item.value.ID);
                        break;
                    case 'Quality':
                        $("#price-checker-search").val(ui.item.label);
                        //self.selectedQualityID(ui.item.value.ID);
                        break;
                    case 'Brand':
                        $("#price-checker-search").val(ui.item.label);
                        //self.selectedBrandID(ui.item.value.ID);
                        break;
                    case 'ProductType':
                        $("#price-checker-search").val(ui.item.label);
                        //self.selectedProductTypeID(ui.item.value.ID);
                        break;
                    case 'FreeText':
                        $("#price-checker-search").val(ui.item.value.ID);
                        //self.freeTextSearch(ui.item.value.ID);
                        break;
                    default: break;
                }

                self.performPriceCheck(ui.item.value);

                return false;
            },
            focus: function (event, ui) {
                return false;
            },
            autoFocus: true,
            create: function () {
                $(this).data("ui-autocomplete")._renderItem = function (ul, item) {

                    var li = null;
                    var div = null;

                    switch (item.value.Type) {

                        case 'Brand':
                            li = $("<li>");
                            div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "<span class='type'>BRAND</span></div>");
                            li.addClass('list-group-item-success li-collection')
                            break;

                        case 'ProductType':
                            li = $("<li>");
                            div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "<span class='type'>PRODUCT TYPE</span></div>");
                            li.addClass('list-group-item-success li-collection')
                            break;

                        case 'Collection':
                            li = $("<li>");
                            div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "<span class='type'>COLLECTION</span></div>");
                            li.addClass('list-group-item-success li-collection')
                            break;
                        case 'Quality':
                            var extraLabel = item.value.LabelAddition;
                            li = $("<li>");
                            div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "<span class='type'>" + extraLabel + " DESIGN</span></div>");
                            li.addClass('list-group-item-warning li-quality')
                            break;
                        case 'Product':
                            li = $("<li>");
                            div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "<span class='type'>PRODUCT</span></div>");
                            li.addClass('list-group-item-info li-sku');
                            break;
                        case 'FreeText':
                            li = $("<li>");
                            div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "<span class='type'>SEARCH</span></div>");
                            li.addClass('li-search');
                            break;
                    }

                    return li.appendTo(ul);
                };
            }
        });
    }

    self.performPriceCheckerAutocompleteSearch = function () {
        $("#price-checker-search").autocomplete('search');
    }

    self.performPriceCheck = function (item) {
        switch (item.Type) {
            case 'Collection':
                self.selectedProductID(undefined);
                self.selectedQualityID(undefined);
                self.freeTextSearch(undefined);
                self.selectedBrandID(undefined);
                self.selectedProductTypeID(undefined);
                self.selectedCollectionID(item.ID);
                break;
            case 'Quality':
                self.selectedProductID(undefined);
                self.selectedCollectionID(undefined);
                self.freeTextSearch(undefined);
                self.selectedBrandID(undefined);
                self.selectedProductTypeID(undefined);
                self.selectedQualityID(item.ID);
                break;
            case 'Product':
                self.selectedQualityID(undefined);
                self.selectedCollectionID(undefined);
                self.freeTextSearch(undefined);
                self.selectedBrandID(undefined);
                self.selectedProductTypeID(undefined);
                self.selectedProductID(item.ID);
                break;
            case 'Brand':
                self.selectedQualityID(undefined);
                self.selectedCollectionID(undefined);
                self.selectedProductID(undefined);
                self.freeTextSearch(undefined);
                self.selectedProductTypeID(undefined);
                self.selectedBrandID(item.ID);
                break;
            case 'ProductType':
                self.selectedQualityID(undefined);
                self.selectedCollectionID(undefined);
                self.selectedProductID(undefined);
                self.freeTextSearch(undefined);
                self.selectedBrandID(undefined);
                self.selectedProductTypeID(item.ID);
                break;
            case 'FreeText':
                self.selectedQualityID(undefined);
                self.selectedCollectionID(undefined);
                self.selectedProductID(undefined);
                self.selectedBrandID(undefined);
                self.selectedProductTypeID(undefined);
                self.freeTextSearch(item.ID)
                break;
            default: break;
        }


        self.brandWidget().dataSource.read();
        self.productTypeGroupWidget().dataSource.read();
        self.productTypeWidget().dataSource.read();
        self.itemTypeWidget().dataSource.read();
        self.launchWidget().dataSource.read();
        self.seasonWidget().dataSource.read();
    }

    self.clearPriceCheckerSearch = function () {
        self.searchTerm(undefined);
        self.clearAutocompleteSelection();
        $("#price-checker-search").focus();
    }

    self.clearAutocompleteSelection = function () {
        self.selectedProductID(undefined);
        self.selectedQualityID(undefined);
        self.selectedCollectionID(undefined);
        self.selectedBrandID(undefined);
        self.selectedProductTypeID(undefined);
        self.freeTextSearch(undefined);

        self.brandWidget().dataSource.read();
        self.productTypeGroupWidget().dataSource.read();
        self.productTypeWidget().dataSource.read();
        self.itemTypeWidget().dataSource.read();
        self.launchWidget().dataSource.read();
        self.seasonWidget().dataSource.read();
    }

    self.reset = function () {
        self.clearPriceCheckerSearch();
        self.priceCheckResults([]);

        self.brandWidget().clearSelection();
        self.productTypeGroupWidget().clearSelection();
        self.productTypeWidget().clearSelection();
        self.itemTypeWidget().clearSelection();
        self.launchWidget().clearSelection();
        self.seasonWidget().clearSelection();

        $("#include-samples").bootstrapSwitch('state', false, false);
        $("#include-clearance").bootstrapSwitch('state', false, false);
    }

    self.initPriceCheckerAutocomplete();


    /* ~~~~~~~ New Stuff ~~~~~~~ */


    self.searchTerm = ko.observable();

    // because the multiSelect cannot handle being bound to an observableArray:
    // it must be bound to an observable containing an array. Fine.
    self.brandIds = ko.observableArray([]);
    self.productTypeIds = ko.observable();
    self.productTypeGroupIds = ko.observable();
    self.itemTypeIds = ko.observable();
    self.launchIds = ko.observable();
    self.seasonIds = ko.observable();

    self.brandSlicer = ko.observable();
    self.productTypeSlicer = ko.observable();
    self.productTypeGroupSlicer = ko.observable();
    self.itemTypeSlicer = ko.observable();
    self.launchSlicer = ko.observable();
    self.seasonSlicer = ko.observable();

    self.brandSlicerParams = {
        log: true,
        autoBind: true,
        name: 'Brand',
        valueField: 'BrandID',
        textField: 'Name',
        boundTo: self.brandSlicer,
        selectedIds: self.brandIds,
        endPoint: '/api/pricing/BrandSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: null,
        placeholder: 'All'
    };

    self.productTypeSlicerParams = {
        log: true,
        autoBind: true,
        name: 'Product Type',
        valueField: 'ProductTypeID',
        textField: 'Name',
        boundTo: self.productTypeSlicer,
        selectedIds: self.productTypeIds,
        endPoint: '/api/pricing/ProductTypeSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: null,
        placeholder: 'All'
    };

    self.productTypeGroupSlicerParams = {
        log: true,
        autoBind: true,
        name: 'Product Type Group',
        valueField: 'ProductTypeGroupID',
        textField: 'Name',
        boundTo: self.productTypeGroupSlicer,
        selectedIds: self.productTypeGroupIds,
        endPoint: '/api/pricing/ProductTypeGroupSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: [],
        placeholder: 'All'
    };

    self.itemTypeSlicerParams = {
        log: true,
        autoBind: true,
        name: 'Item Type',
        valueField: 'ItemTypeID',
        textField: 'Name',
        boundTo: self.itemTypeSlicer,
        selectedIds: self.itemTypeIds,
        endPoint: '/api/pricing/ItemTypeSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: null,
        placeholder: 'All'
    };

    self.launchSlicerParams = {
        log: true,
        autoBind: true,
        name: 'Launch',
        valueField: 'LaunchID',
        textField: 'Name',
        boundTo: self.launchSlicer,
        selectedIds: self.launchIds,
        endPoint: '/api/pricing/LaunchSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: null,
        placeholder: 'All'
    };

    self.seasonSlicerParams = {
        log: true,
        autoBind: true,
        name: 'Season',
        valueField: 'SeasonID',
        textField: 'Name',
        boundTo: self.seasonSlicer,
        selectedIds: self.seasonIds,
        endPoint: '/api/pricing/SeasonSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: null,
        placeholder: 'All'
    };

    self.slicerCollection = [
        self.brandSlicerParams,
        //self.productTypeSlicerParams,
        //self.productTypeGroupSlicerParams,
        //self.itemTypeSlicerParams,
        //self.launchSlicerParams,
        //self.seasonSlicerParams
    ];

    self.brandSlicerParams.slicerCollection = self.slicerCollection;
    //self.productTypeSlicerParams.slicerCollection = self.slicerCollection;
    //self.productTypeGroupSlicerParams.slicerCollection = self.slicerCollection;
    //self.itemTypeSlicerParams.slicerCollection = self.slicerCollection;
    //self.launchSlicerParams.slicerCollection = self.slicerCollection;
    //self.seasonSlicerParams.slicerCollection = self.slicerCollection;

    self.previousValues = null;

    self.nonce = ko.observable();

    //self.foo = ko.computed({
    //    read: function () {

    //        var f = self.nonce();

    //        if (self.brandSlicer() &&
    //            self.productTypeSlicer() &&
    //            self.productTypeGroupSlicer() &&
    //            self.itemTypeSlicer() &&
    //            self.launchSlicer() &&
    //            self.seasonSlicer()) {
    //            var ids = [];

    //            self.slicerCollection.forEach(function (p) {
    //                ids.push({
    //                    name: p.valueField,
    //                    value: p.selectedIds()
    //                });
    //            });

    //            ids.push({
    //                name: 'searchTerm',
    //                value: self.searchTerm()
    //            });

    //            // also skip if the IDs haven't changed...

    //            var unchangedSkip = false;

    //            if (self.previousValues) {
    //                for (var property in self.previousValues) {
    //                    var p = self.previousValues[property];

    //                    var q = Enumerable.From(ids).Where(function (x) {
    //                        return x.name == p.name
    //                    }).SingleOrDefault();

    //                    if (q) {
    //                        if (p.value == q.value) {
    //                            unchangedSkip = true;
    //                        } else {
    //                            unchangedSkip = false;
    //                            break;
    //                        }
    //                    } else {
    //                        unchangedSkip = false;
    //                        break;
    //                    }
    //                }
    //            }

    //            // always set previous
    //            self.previousValues = ids;

    //            if (self.skipFirst || unchangedSkip) {
    //                self.skipFirst = false;
    //            } else {
    //                if (self.parent) {
    //                    console.log('priceChecker foo', ids);
    //                    //self.parent.dashboardSelect(ids);
    //                }
    //                return ids;
    //            }
    //        }
    //    }
    //}, self).extend({
    //    rateLimit: {
    //        method: 'notifyWhenChangesStop',
    //        timeout: 100
    //    }
    //});
}