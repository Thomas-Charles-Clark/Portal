function customerOrderingNotesViewModel() {
    var self = this;

    self.busy = ko.observable(false);

    self.tradeAccountId = ko.observable();

    self.tradeAccount = ko.observable();

    self.orderingNote = ko.observable();

    self.originalOrderingNote = ko.observable();

    self.editorParams = {
        value: self.orderingNote,
        tools: [
            "bold",
            "italic",
            "underline",
            "justifyLeft",
            "justifyCenter",
            "justifyRight",
            "insertUnorderedList",
            "createLink",
            "unlink",
            "insertImage",
            "tableWizard",
            "createTable",
            "addRowAbove",
            "addRowBelow",
            "addColumnLeft",
            "addColumnRight",
            "deleteRow",
            "deleteColumn",
            "mergeCellsHorizontally",
            "mergeCellsVertically",
            "splitCellHorizontally",
            "splitCellVertically",
            "tableAlignLeft",
            "tableAlignCenter",
            "tableAlignRight",
            "viewHtml",
            "formatting",
            {
                name: "fontName",
                items: [
                    { text: "Andale Mono", value: "Andale Mono" },
                    { text: "Arial", value: "Arial" },
                    { text: "Arial Black", value: "Arial Black" },
                    { text: "Book Antiqua", value: "Book Antiqua" },
                    { text: "Comic Sans MS", value: "Comic Sans MS" },
                    { text: "Courier New", value: "Courier New" },
                    { text: "Georgia", value: "Georgia" },
                    { text: "Helvetica", value: "Helvetica" },
                    { text: "Impact", value: "Impact" },
                    { text: "Symbol", value: "Symbol" },
                    { text: "Tahoma", value: "Tahoma" },
                    { text: "Terminal", value: "Terminal" },
                    { text: "Times New Roman", value: "Times New Roman" },
                    { text: "Trebuchet MS", value: "Trebuchet MS" },
                    { text: "Verdana", value: "Verdana" },
                ]
            },
            "fontSize",
            "foreColor",
            "backColor",
        ]
    };

    self.tradeAccountList = kendoMDCDropDownList({
        label: 'Trade Account',
        odata: true,
        endPoint: '/odata/tradeaccounts',
        textField: 'Code',
        valueField: 'TradeAccountID',
        virtual: true,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/TradeAccounts/Default.TradeAccountValueMapper(tradeAccountId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                    }
                });
            }
        },
        sort: [{
            field: 'Code',
            dir: 'asc'
        }],
        idObservable: self.tradeAccountId,
        objObservable: self.tradeAccount,
        height: 340,
        template: '#: Code # - #: Name #',
        valueTemplate: '#: Code # - #: Name #',
        optionLabel: {
            Code: '',
            Name: ''
        },
        optionLabelTemplate: '',
        filtering: function (ev) {
            var filterValue = ev.filter != undefined ? ev.filter.value : "";
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
            });
        },
        autoBind: true,
        height: 340
    });

    self.tradeAccount.subscribe(function (newValue) {
        if (newValue) {
            self.orderingNote(newValue.BeforeOrderNotification);
            self.originalOrderingNote(self.orderingNote());
            if (self.timeout) {
                window.clearTimeout(self.timeout);
                $('#save-success').hide();
            }
        }
    });

    self.save = function () {
        self.busy(true);

        var data = {
            tradeAccountId: self.tradeAccountId(),
            orderingNote: self.orderingNote()
        };

        if (data.orderingNote.replace(/\s/g, '') == '') {
            data.orderingNote = null;
        }

        $.ajax({
            url: '/api/customernotes/SaveOrderingNote',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                $('#save-success').fadeIn('fast');
                self.originalOrderingNote(self.orderingNote());
                self.timeout = window.setTimeout(function () {
                    $('#save-success').fadeOut('slow');
                }, 5000)
            }
        });
    }

    self.cancel = function () {
        $.confirm('Are you sure?', 'This will revert the note back to how it was when you loaded it.', function () {
            self.orderingNote(self.originalOrderingNote());
        });
    }
}