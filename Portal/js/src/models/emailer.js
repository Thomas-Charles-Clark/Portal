const emailer = ({
    parent,
    sendLabel = 'Send<span class= "glyphicon glyphicon-send" ></span>'
} = {
        parent: {},
        sendLabel: 'Send <span class= "glyphicon glyphicon-send" ></span>'
    }) => (function () {
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

        self.toParams = {
            label: 'Email To',
            originalValue: self.sentTo,
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
                self.to(self.sentTo());
                $(self.to.DOMElement).focus();
            },
            charsRemainingOptions: {
                maxLength: 254
            }
        }

        self.subject = ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateSendNow();
                },
                message: 'Subject Required'
            },
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
            }
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
            }
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
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            permitRevert: true,
            revertFunction: function () {
                self.body(self.originalBody());
                $(self.body.DOMElement).focus();
            },
            charsRemainingOptions: {
                maxLength: 4000
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

        return self;
    })();