const retailStoreMembersViewModel = () => {
    let self = {};

    self.busy = ko.observable(false);

    self.columns = [{
        field: 'RetailStoreMemberID',
        title: 'Account',
        hidden: true
    }, {
        field: 'Email',
        title: 'Email',
        width: 240,
        filterable: true,
        template: function (item) {
            if (item.Email)
                return `<a href="mailto:${item.Email}">${item.Email}</a>`;
            else
                return "&nbsp;";
        }
    }, {
        field: 'Title',
        title: 'Title',
        filterable: true
    }, {
        field: 'FirstName',
        title: 'First Name',
        filterable: true
    }, {
        field: 'LastName',
        title: 'Last Name',
        filterable: true
    }, {
        field: 'PersonalisationName',
        title: 'Personalisation Name',
        filterable: true
    }, {
        field: 'Store',
        title: 'Store',
        filterable: true
    }, {
        field: 'SaleRepresentative',
        title: 'Sales Representative',
        groupHeaderTemplate: "Sales Representative: #= value # (#= items.length# VICs)"
    }, {
        field: 'Status',
        title: 'Status',
        filterable: true
    }, {
        field: 'LastModifiedByName',
        title: 'Last Modified By',
        filterable: true
    }, {
        field: 'Command',
        title: ' ',
        filterable: false,
        exportable: false,
        width: 140,
        attributes: {
            class: "text-center"
        },
        command: [
            {
                name: "Delete",
                //template: (item) => {
                //    return '<button type="button" class="btn btn-outline"><span class="bi bi-x-lg"></span></button>'
                //},
                click: function (e) {
                    e.preventDefault(e);

                    var row = $(e.target).closest("tr"),
                        dataItem = self.grid.widget().dataItem(row);

                    if (dataItem.Deleted) {
                        delete dataItem.Deleted;
                        e.target.innerText = 'DELETE';
                        row.removeClass("deleted");
                        if (Object.keys(dataItem.dirtyFields).length) {

                        } else {
                            dataItem.dirty = false;
                        }
                    } else {
                        dataItem.Deleted = true;
                        e.target.innerText = 'UNDELETE';
                        row.addClass("deleted");
                        dataItem.dirty = true;
                    }
                }
            }
        ]
    }];

    self.dataSourceRead = (options) => {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {

        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/storemembersapi/FetchMembers',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                options.success(data);
            },
            error: function (xhr, s, a) {
                window.showError(xhr.responseText);
                options.error();
            }
        });
    };

    self.dataSource = new kendo.data.DataSource({
        transport: {
            read: self.dataSourceRead,
            create: function (e) {
                console.log('create', e);
                ko.utils.arrayForEach(e.data.models, function (m) {
                    // do something with m
                });
                $.ajax({
                    url: '/retail/storemembers/createMembers',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        models: e.data.models
                    },
                    success: (data) => {
                        if (Object.keys(data.Errors ?? {}).length == 0) {
                            e.success(data);
                            self.grid.widget().dataSource.read();
                        } else {
                            window.showError(`One or more validation errors occurred in your submission.
                            <br/>
                            Please review the messages below and either correct or cancel your changes.
                            <br/>
                            <br/>
                            ${Object.keys(data.Errors).flatMap(k => {
                                return data.Errors[k].errors
                            })}`);
                            self.busy(false);
                            e.error();
                        }
                    },
                    error: (xhr, s, a) => {
                        e.error(xhr);
                        self.busy(false);
                    }
                });
            },
            update: function (e) {
                console.log('update', e);
                ko.utils.arrayForEach(e.data.models, function (m) {
                    // do something with m
                });
                $.ajax({
                    url: '/retail/storemembers/updateMembers',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        models: e.data.models
                    },
                    success: (data) => {
                        if (Object.keys(data.Errors ?? {}).length == 0) {
                            e.success(data);
                            self.grid.widget().dataSource.read();
                        } else {
                            window.showError(`One or more validation errors occurred in your submission.
                            <br/>
                            Please review the messages below and either correct or cancel your changes.
                            <br/>
                            <br/>
                            ${Object.keys(data.Errors).flatMap(k => {
                                return data.Errors[k].errors
                            })}`);
                            self.busy(false);
                            e.error();
                        }
                    },
                    error: (xhr, s, a) => {
                        e.error(xhr, s, a);
                    }
                });
            },
        },
        batch: true,
        sortable: true,
        filterable: true,
        grouping: false,
        serverFiltering: true,
        serverGrouping: false,
        serverPaging: true,
        serverAggregates: true,
        serverSorting: true,
        pageSize: 20,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "AggregateResults",
            model: {
                id: 'RetailStoreMemberID',
                fields: {
                    Email: {
                        type: 'string',
                        editable: true,
                        validation: {
                            email: true,
                            required: true,
                            unique: true
                        }
                    },
                    Title: {
                        type: 'string',
                        editable: true
                    },
                    FirstName: {
                        type: 'string',
                        editable: true
                    },
                    LastName: {
                        type: 'string',
                        editable: true
                    },
                    PersonalisationName: {
                        type: 'string',
                        editable: true
                    },
                    Store: {
                        type: 'string',
                        edtiable: true
                    },
                    SaleRepresentative: {
                        type: 'string',
                        editable: true
                    },
                    Status: {
                        type: 'string',
                        editable: true
                    },
                    CreatedDT: {
                        type: 'date',
                        editable: false
                    },
                    ModifiedDT: {
                        type: 'date',
                        editable: false
                    },
                    LastModifiedByName: {
                        type: 'string',
                        editable: false
                    }
                }
            }
        }),
        sort: {
            field: 'RetailStoreMemberID',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: (e) => {
            self.busy(true);
        },
        requestEnd: function (e) {
            if (e.type == "update") {
                if (e.response) {
                    if (!e.response.Errors) {
                        e.sender.read();
                    } else {
                        self.busy(false);
                    }
                } else {
                    self.busy(false);
                }
            } else {
                self.busy(false);
            }
        },
        noDataTemplate: 'There are no Retail Store Members yet.'
    });

    //self.checkCells = (grid) =>
    //{
    //    var rows = grid.tbody.find("tr");                   //get rows
    //    for (var i = 0; i < rows.length; i++) {

    //        var rowModel = grid.dataItem(rows[i]);          //get row data
    //        if (rowModel && rowModel.isNew()) {

    //            var colCells = $(rows[i]).find("td");       //get cells
    //            for (var j = 0; j < colCells.length; j++) {
    //                if ($(colCells[j]).hasClass('k-group-cell'))
    //                    continue;                           //grouping enabled will add extra td columns that aren't actual columns
    //                grid.editCell($(colCells[j]));          //open for edit
    //                if (!grid.editable.end()) {             //trigger validation
    //                    return false;                       //if fail, return false
    //                }
    //                else {
    //                    grid.closeCell();                   //if success, keep checking
    //                }
    //            }
    //        }
    //    }
    //    return true;                                        //all cells are valid
    //}

    self.grid = {
        autoBind: true,
        widget: ko.observable(),
        columns: self.columns,
        data: self.dataSource,
        //useKOTemplates: true,
        //rowTemplate: 'pending-row-template',
        sortable: true,
        groupable: true,
        filterable: true,
        reorderable: false,
        editable: true,
        selectable: true,
        change: function () {
            this.editRow(this.select());
        },
        toolbar: ["create", "save", "cancel", "excel"],
        navigatable: true,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        //excel: {
        //    allPages: true,
        //    fileName: 'RetailStoreVICs.xlsx',
        //    filterable: true,
        //    collapsbile: true,
        //    forceProxy: true,
        //    proxyURL: '/Sales/Excel_Export_Save'
        //},
        excelExport: function (e) {
            var sheet = e.workbook.sheets[0];
            var grid = e.sender;
            var data = grid.dataSource.data();
            var gridColumns = grid.columns.filter(c => c.exportable != false);
            var columns = gridColumns.map(function (col) {
                return {
                    value: col.title ? col.title : col.field,
                    autoWidth: true,
                    background: "#7a7a7a",
                    color: "#fff"
                };
            });

            var rows = [{ cells: columns, type: "header" }];

            for (var i = 0; i < data.length; i++) {
                var rowCells = [];
                for (var j = 0; j < gridColumns.length; j++) {
                    var cellValue = data[i][gridColumns[j].field];
                    if (typeof cellValue === 'string')
                        cellValue = cellValue.replace(/T00:00:00/g, '');
                    rowCells.push({ value: cellValue });
                }
                rows.push({ cells: rowCells, type: "data" });
            }
            sheet.rows = rows;
        }
        ////dataBound: function (e) {

        ////    let filtercells = [...document.querySelectorAll('.k-filtercell')];
        ////    filtercells.forEach(fc => {
        ////        let dd = fc.find("[data-role='dropdownlist']").data('kendoDropDownList');
        ////        dd.select(3);
        ////        dd.trigger("change");
        ////    });

        ////    //var pristine = e.sender.dataSource.data().toJSON();
        ////    //ko.utils.arrayForEach(e.sender.dataSource.data(), function (item, index) {

        ////    //    ko.cleanNode($('tr[data-uid="' + item.uid + '"]')[0]);

        ////    //    pristine[index].furnitureGridSettings = {
        ////    //        autoBind: true,
        ////    //        widget: ko.observable(),
        ////    //        useKOTemplates: true,
        ////    //        rowTemplate: 'furniture-detail-grid-row-template',
        ////    //        columns: [{
        ////    //            field: 'type',
        ////    //            title: 'Type',
        ////    //            width: 80
        ////    //        }, {
        ////    //            field: 'code',
        ////    //            title: 'Product',
        ////    //            width: 120
        ////    //        }, {
        ////    //            field: 'orderHeadId',
        ////    //            title: 'Order Number',
        ////    //            width: 102
        ////    //        }, {
        ////    //            field: 'orderStatus',
        ////    //            title: 'Order Status',
        ////    //            width: 100
        ////    //        }, {
        ////    //            field: 'transferOrderHeadId',
        ////    //            title: 'Transfer Order Number',
        ////    //            width: 100
        ////    //        }, {
        ////    //            field: 'transferOrderStatus',
        ////    //            title: 'Transfer Status',
        ////    //            width: 100
        ////    //        }, {
        ////    //            field: 'supplierInvoiceNumber',
        ////    //            title: 'Supplier Invoice Number',
        ////    //            width: 140
        ////    //        }],
        ////    //        data: pristine[index].fabricsAndTreatments,
        ////    //        sortable: true,
        ////    //        groupable: false,
        ////    //        filterable: false,
        ////    //        reorderable: false,
        ////    //        editable: false,
        ////    //        selectable: false,
        ////    //        navigatable: false,
        ////    //        paging: false
        ////    //    };

        ////    //    pristine[index].furnitureDetailsBootstrapPopover = {
        ////    //        container: 'body',
        ////    //        title: 'Furniture Details',
        ////    //        onInserted: function (e) {
        ////    //            $('a.furniture-details').not(event.currentTarget).each(function (i, p) {
        ////    //                $(p).popover('hide');
        ////    //            });
        ////    //        },
        ////    //        content: function () {
        ////    //            var result = $('<div data-bind="kendoGrid: $parent.furnitureGridSettings"></div>');
        ////    //            return result;
        ////    //        },
        ////    //        placement: 'right',
        ////    //        trigger: 'click',
        ////    //        template: `<div class="popover details-popover" role="tooltip">
        ////    //                <div class="arrow"></div>
        ////    //                <div class="modal-header grey-blue">
        ////    //                    <button class="close pull-right" data-bind="click: function () { $(popObject).popover('hide'); }">
        ////    //                        <span aria-hidden="true">&times;</span>
        ////    //                    </button>
        ////    //                    <h4 class="modal-title popover-title"></h4>
        ////    //                </div>
        ////    //                <div class="popover-content"></div>
        ////    //            </div>`
        ////    //    }

        ////    //    pristine[index].furnitureSurchargeGridSettings = {
        ////    //        autoBind: true,
        ////    //        widget: ko.observable(),
        ////    //        useKOTemplates: true,
        ////    //        rowTemplate: 'furniture-surcharge-grid-row-template',
        ////    //        columns: [{
        ////    //            field: 'orderHeadId',
        ////    //            title: 'Order Number',
        ////    //            width: 140
        ////    //        }, {
        ////    //            field: 'code',
        ////    //            title: 'Product',
        ////    //            width: 140
        ////    //        }, {
        ////    //            field: 'quantity',
        ////    //            title: 'Quantity',
        ////    //            width: 140
        ////    //        }, {
        ////    //            field: 'orderStatus',
        ////    //            title: 'Order Status',
        ////    //            width: 140
        ////    //        }],
        ////    //        data: pristine[index].furnitureSurcharges,
        ////    //        sortable: true,
        ////    //        groupable: false,
        ////    //        filterable: false,
        ////    //        reorderable: false,
        ////    //        editable: false,
        ////    //        selectable: false,
        ////    //        navigatable: false,
        ////    //        paging: false
        ////    //    };

        ////    //    pristine[index].furnitureSurchargesBootstrapPopover = {
        ////    //        container: 'body',
        ////    //        title: 'Furniture Surcharges',
        ////    //        onInserted: function (e) {
        ////    //            $('a.furniture-details').not(event.currentTarget).each(function (i, p) {
        ////    //                $(p).popover('hide');
        ////    //            });
        ////    //        },
        ////    //        content: function () {
        ////    //            var result = $('<div data-bind="kendoGrid: $parent.furnitureSurchargeGridSettings"></div>');
        ////    //            return result;
        ////    //        },
        ////    //        placement: 'right',
        ////    //        trigger: 'click',
        ////    //        template: `<div class="popover details-popover furniture-surcharges-popover" role="tooltip">
        ////    //                <div class="arrow"></div>
        ////    //                <div class="modal-header grey-blue">
        ////    //                    <button class="close pull-right" data-bind="click: function () { $(popObject).popover('hide'); }">
        ////    //                        <span aria-hidden="true">&times;</span>
        ////    //                    </button>
        ////    //                    <h4 class="modal-title popover-title"></h4>
        ////    //                </div>
        ////    //                <div class="popover-content"></div>
        ////    //            </div>`
        ////    //    }

        ////    //    ko.applyBindings(pristine[index], $('tr[data-uid="' + item.uid + '"]')[0]);
        ////    //});
        ////    //$(function () {
        ////    //    if (self.pendingStatusFilterActive()) {
        ////    //        $('th[data-field="Status"]').find('a.k-grid-filter').addClass('k-state-active');
        ////    //    } else {
        ////    //        $('th[data-field="Status"]').find('a.k-grid-filter').removeClass('k-state-active');
        ////    //    }
        ////    //});
        ////},
        //page: function (e) {
        //    //$('tr[role="row"]').each(function (x) {
        //    //    ko.cleanNode(x);
        //    //});
        //},
        //filterMenuInit: function (e) {
        //    if (e.field === 'Status' || e.field == 'TreatmentProvider') {
        //        var popup = e.container.data("kendoPopup");
        //        var dataSource = this.dataSource;
        //        var field = e.field;
        //        var element = e.container.children(":first");

        //        var originalMultiCheck = e.container.children(":first");

        //        var element = $("<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck).kendoListView({
        //            dataSource: window['get' + e.field + 'FilterOptions'](),
        //            template: "<label><input type='checkbox' value='#:" + field + "#'/>#:" + field + "#</label>"
        //        });

        //        originalMultiCheck.remove();

        //        e.container.children('.k-filter-selected-items').remove();

        //        e.container.find("[type='submit']").click(function (e) {
        //            e.preventDefault();
        //            e.stopPropagation();
        //            var filter = dataSource.filter() || { logic: "and", filters: [] };
        //            var fieldFilters = $.map(element.find('input[type="checkbox"]:checked'), function (input) {
        //                return {
        //                    field: field,
        //                    operator: "contains",
        //                    value: input.value
        //                };
        //            });
        //            if (fieldFilters.length) {
        //                self.removeFiltersForField(filter, field);
        //                filter.filters.push({
        //                    logic: "or",
        //                    filters: fieldFilters
        //                });
        //                dataSource.filter(filter);
        //                self['pending' + e.field + 'FilterActive'](true);
        //            }
        //            popup.close();
        //        });

        //        e.container.find("[type='reset']").click(function (e) {
        //            self['pending' + e.field + 'FilterActive'](false);
        //        });
        //    }
        //},
        //saveChanges: function (e) {
        //    e.preventDefault();

        //    var grid = e.sender;
        //    var data = grid.dataSource.data();
        //    var validationPassed = true;

        //    data.forEach(function (e, i) {

        //        if (e.dirty || e.id === null) {
        //            var uid = e.uid;
        //            var row = grid.element.find("tr[data-uid=" + uid + "]");
        //            var tds = row.find("td");

        //            tds.each(function (i, e) {
        //                grid.editCell(e);

        //                if (grid.editable) {
        //                    var valid = grid.editable.validatable.validate();

        //                    if (!valid) {
        //                        validationPassed = false;
        //                        return false;
        //                    }
        //                }
        //            });
        //        }
        //    });

        //    if (validationPassed) {
        //        grid.dataSource.sync();
        //    }
        //}
    }

    return self;
}