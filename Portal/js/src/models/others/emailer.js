const emailer = ({
    parent,
    sendLabel = 'Send<span class= "glyphicon glyphicon-send" ></span>'
} = {
    parent: {},
    sendLabel: 'Send <span class= "glyphicon glyphicon-send" ></span>'
}) => {
    var self = {};

    self.parent = parent;

    self.sendLabel = ko.observable(sendLabel);

    self.validateSendNow = ko.observable(false);

    self.sentTo = ko.observable();

    self.showLastSentTo = ko.observable(false);

    self.to = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateSendNow();
            },
            message: 'Recipient Email Required'
        },
        emailList: {
            params: true,
            onlyIf: function () {
                return self.validateSendNow();
            },
            message: 'Invalid Email'
        }
    });

    self.originalTo = ko.observable();

    self.toParams = {
        label: 'Email To',
        originalValue: self.originalTo,
        observable: self.to,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: true,
        revertFunction: function () {
            self.to(self.originalTo());
            $(self.to.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 254
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true)
    }

    self.subject = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateSendNow();
            },
            message: 'Subject Required'
        }
    });

    self.originalSubject = ko.observable();

    self.subjectParams = {
        label: 'Email Subject',
        originalValue: self.originalSubject,
        observable: self.subject,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: true,
        revertFunction: function () {
            self.subject(self.originalSubject());
            $(self.subject.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 1000
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true)
    };

    self.originalReplyTo = ko.observable(getUserEmail());

    self.replyTo = ko.observable(getUserEmail()).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateSendNow();
            },
            message: 'Reply To Email Required'
        },
        emailList: {
            params: true,
            onlyIf: function () {
                return self.validateSendNow();
            },
            message: 'Invalid Email'
        }
    });

    self.replyToParams = {
        label: 'Reply To',
        originalValue: self.originalReplyTo,
        observable: self.replyTo,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: true,
        revertFunction: function () {
            self.replyTo(self.originalReplyTo());
            $(self.replyTo.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 254
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true)
    }

    self.body = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateSendNow()
            },
            message: 'Body is Required'
        }
    });

    self.originalBody = ko.observable();

    self.bodyParams = {
        label: 'Email Body',
        originalValue: self.originalBody,
        observable: self.body,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        rows: 10,
        clearFunction: function () {
            self.body('');
            window.setTimeout(() => {
                self.bodyParams.editorParams.widget().value('');
                self.bodyParams.editorParams.widget().trigger('change');
                self.bodyParams.editorParams.widget().focus();
            }, 0);
        },
        permitRevert: true,
        revertFunction: function () {
            self.body(self.originalBody());
            window.setTimeout(() => {
                self.bodyParams.editorParams.widget().value(self.originalBody());
                self.bodyParams.editorParams.widget().trigger('change');
                self.bodyParams.editorParams.widget().focus();
            }, 0);
        },
        charsRemainingOptions: {
            maxLength: 4000
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        visible: ko.observable(true),
        editorParams: {
            value: self.body,
            enabled: ko.observable(true),
            widget: ko.observable(),
            height: 450,
            stylesheets: [
                "/css/dist/lib/bootstrap-5.3.1/dist/css/bootstrap.css"
            ], 
            tools: [
                "formatting",
                "bold",
                "italic",
                "underline",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "insertUnorderedList",
                "insertOrderedList",
                "indent",
                "outdent",
                "createLink",
                "unlink",
                "insertImage",
                "tableWizard",
                "createTable",
                "addColumnLeft",
                "addColumnRight",
                "addRowAbove",
                "addRowBelow",
                "deleteRow",
                "deleteColumn",
                "viewHtml"
            ]
        }
    };

    self.emailErrors = ko.validation.group([
        self.to,
        self.replyTo,
        self.subject,
        self.body
    ]);

    self.send = function () {
        console.error('emailer.send must be overridden');
    };

    self.toLabelFudge = event => {
        console.log('toLabelFudge called', event);
        self.to.subscribe(nv => {
            console.log('to changed', nv);
            self.to.mdcTextField.getDefaultFoundation().adapter_.notchOutline(self.to.mdcTextField.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
            self.removeToLabelFudgeHandler();
        })
    }

    self.attachToLabelFudgeHandler = () => {
        $('#send-email-anchor').on('show.bs.collapse', self.toLabelFudge);
    }

    self.removeToLabelFudgeHandler = () => {
        $('#send-email-anchor').off('show.bs.collapse', self.toLabelFudge);
    }

    if (document.querySelector('#send-email')) {
        self.attachToLabelFudgeHandler();
    }

    return self;
}