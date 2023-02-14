$.extend({
    showError: function (xhr, textStatus, errorThrown, callback, args) {

        if (textStatus) {
            $("#error-modal-title").html('Sorry');
        }

        if (window.basketId) {
            $('#error-modal-title').html(`Error - Basket ID: ${ko.unwrap(window.basketId)}`);
        }

        $("#error-modal-body").empty();

        setTimeout(function () {
            $("#error-modal-body").html(xhr.responseText);
        }, 0);

        $("#error-modal").modal("show");
    }
});

$.ajaxSetup({
    beforeSend: function (request, settings) {

        if (settings.dataType === 'binary') {
            settings.xhr().responseType = 'arraybuffer';
            settings.processData = false;
        }

        //console.log(request);
        //console.log(settings);
        
        // hm... I want to be able to repeat a certain group of requests if they were 401'ed,
        // not just the window.lastAjaxCall...
        // this is for slicers.

        // 26/10/2018 - abandon repeat ajax calling; just reload the page.
        //window.slicerCalls = window.slicerCalls || [];
        //if (settings.url.indexOf('SlicerEndpoint') !== -1) {
        //    window.slicerCalls = window.slicerCalls.filter(function(s) { return s.url !== settings.url });
        //    window.slicerCalls.push(settings);
        //    //console.log('window.slicerCalls', window.slicerCalls);
        //}

        //if (settings.url != '/token' && settings.url.indexOf('SlicerEndpoint') === -1) {
        //    window.lastAjaxCall = settings;
        //}

        if (settings.url.indexOf('/api') === 0 || settings.url.indexOf('/odata') === 0) {
            request.withCredentials = true;
            request.setRequestHeader("Authorization", "Bearer " + localStorage.BearerToken);
        }
    },
    error: function (xhr, textStatus, errorThrown) {
        console.log(xhr);
        if (xhr.status == 401) { } // do not show error modal for Auth Required responses...
        else if (xhr.responseText) {
            var resp = JSON.parse(xhr.responseText);
            if (resp.hasOwnProperty('ExceptionMessage')) {
                if (resp.ExceptionMessage.toLowerCase().indexOf('deadlock') > -1 || resp.ExceptionMessage.toLowerCase().indexOf('timeout') > -1) {
                    xhr.responseText = 'There was a timeout attempting to perform your last action.<br/><br/>Please try again in 30 seconds.'
                }
            }
            if (resp.hasOwnProperty('InnerException')) {
                if (resp.InnerException.ExceptionMessage.toLowerCase().indexOf('deadlock') > -1 || resp.InnerException.ExceptionMessage.toLowerCase().indexOf('timeout') > -1)
                    xhr.responseText = 'There was a timeout attempting to perform your last action.<br/><br/>Please try again in 30 seconds.'
            }

            $.showError(xhr, textStatus, errorThrown);
        }
    }
});

$(document).ajaxSuccess(function (event, xhr, settings) {
    // 26/10/2018 - abandon repeat ajax calling; just reload the page.
    //if (settings.url.indexOf('SlicerEndpoint') !== -1) {
    //    window.slicerCalls = window.slicerCalls.filter(function (s) { return s.url === settings.url });
    //    //console.log('window.slicerCalls', window.slicerCalls);
    //}
});

$(document).ajaxError(function (event, xhr, textStatus, errorThrown) {
    if (xhr.status == 401 && !($("#credentials-modal").hasClass('in'))) {
        $("#credentials-modal").modal('show');
    } 
});

$.extend({
    unsavedWarning: function (yesCallback, noCallback, args) {
        $("<div></div>").dialog({
            title: "Warning",
            width: 250,
            height: "auto",
            buttons: [{
                text: "Yes",
                click: function () {
                    yesCallback(args);
                    $(this).remove();
                }
            },
            {
                text: "No",
                click: function () {
                    noCallback(args);
                    $(this).remove();
                }
            }
            ],
            close: function (event, ui) { $(this).remove(); },
            resizable: false,
            modal: true
        }).html("<p style='margin-top: 10px;'>You have unsaved changes.</p><p>Are you sure you wish to proceed?</p>").parent().addClass("alert");
    }
});

$.extend({
    confirm: function (heading, message, yesCallback, noCallback) {
        if (heading != null)
            $("#confirm-modal-heading").html(heading);
        if (message != null)
            $("#confirm-modal-message").html(message);

        $("#confirm-modal").modal('show');

        $("#confirm-modal-yes").off('click');
        $("#confirm-modal-no").off('click');
        
        $("#confirm-modal-yes").on('click', yesCallback);
        $("#confirm-modal-no").on('click', noCallback);
    }
});

$.extend({
    redConfirm: function (heading, message, yesCallback, noCallback) {
        if (heading != null)
            $("#red-confirm-modal-heading").html(heading);
        if (message != null)
            $("#red-confirm-modal-message").html(message);

        $("#red-confirm-modal").modal('show');

        $("#red-confirm-modal-yes").off('click');
        $("#red-confirm-modal-no").off('click');

        $("#red-confirm-modal-yes").on('click', yesCallback);
        $("#red-confirm-modal-no").on('click', noCallback);
    }
});

$.extend({
    info: function (title, message, onShown, onHidden) {

        //console.log('$.info called', title, message);

        $("#info-modal-title").html(title);
        $("#info-modal-body").html(message);
        $("#info-modal").modal("show");
        $("#info-modal").off('shown.bs.modal');
        $("#info-modal").off('hidden.bs.modal');
        if (onShown) {
            $("#info-modal").on('shown.bs.modal', onShown);
        }
        if (onHidden) {
            $("#info-modal").on('hidden.bs.modal', onHidden);
        }
    }
});

$.extend({
    error: function (title, message, onShown, onHidden) {
        $("#error-modal-title").html(title);
        $("#error-modal-body").html(message);
        $("#error-modal").modal("show");
        $("#error-modal").off('shown.bs.modal');
        $("#error-modal").off('hidden.bs.modal');
        if (onShown) {
            $("#error-modal").on('shown.bs.modal', onShown);
        }
        if (onHidden) {
            $("#error-modal").on('hidden.bs.modal', onHidden);
        }
    }
})

$.extend({
    tickToDismiss: function (bindingObj) {
        $("#tick-to-confirm-modal-title").html(bindingObj.title);
        $("#tick-to-confirm-modal-body").html(`${bindingObj.message}<div data-bind="component: { name: 'mdc-checkbox-component', params: acknowledgeParams }"></div>`);
        $("#tick-to-confirm-modal-footer").html(`<button id="tick-to-confirm-modal-close" type="button" class="btn btn-default" data-dismiss="modal" disabled data-bind="enable: acknowledgeParams.observable">Okay</button>`);
        ko.cleanNode(document.getElementById("tick-to-confirm-modal"));
        ko.applyBindings(bindingObj, document.getElementById("tick-to-confirm-modal"));
        $("#tick-to-confirm-modal").modal("show");
        $("#tick-to-confirm-modal").off('shown.bs.modal');
        $("#tick-to-confirm-modal").off('hidden.bs.modal');
        if (bindingObj.onShown) {
            $("#tick-to-confirm-modal").on('shown.bs.modal', bindingObj.onShown);
        }
        if (bindingObj.onHidden) {
            $("#tick-to-confirm-modal-modal").on('hidden.bs.modal', bindingObj.onHidden);
        }
    }
});

// https://stackoverflow.com/questions/32653049/mvc5-antiforgerytoken-how-to-handle-the-provided-anti-forgery-token-was-meant#answer-32656949
// jQuery plugin to prevent double submission of forms
jQuery.fn.preventDoubleSubmission = function () {

    console.log($(this).attr('id') + ' - preventDoubleSubmission enabled');

    $(this).on('submit', function (e) {
        var $form = $(this);
        console.log($form);
        var email = $("#Email").val();
        var pass = $("#Password").val();

        var data = {
            grant_type: 'password',
            username: email,
            password: pass
        }

        $.ajax({
            url: '/token',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            data: data,
            async: false, 
            success: function (data) {
                console.log(data);
                localStorage.BearerToken = data.access_token;
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('bearer token was refused: bad authentication?')
            }
        });

        if ($form.data('submitted') === true) {
            // Previously submitted - don't submit again
            console.log('double submission prevented');
            e.preventDefault();
        } else {
            // Mark it so that the next submit can be ignored
            $form.data('submitted', true);
        }
    });

    // Keep chainability
    return this;
};

// doesn't work, at least vs. textareas. Still gives me "".
//kendo.data.binders.forceValueNullOnEmpty = kendo.data.Binder.extend({
//    init: function (element, bindings, options) {
//        //call the base constructor
//        kendo.data.Binder.fn.init.call(this, element, bindings, options);

//        var that = this;
//        //listen for the change event of the element
//        $(that.element).on("change", function () {
//            that.change(); //call the change function
//        });
//    },
//    refresh: function () {
//        var that = this,
//            value = that.bindings["forceValueNullOnEmpty"].get(); //get the value from the View-Model

//        $(that.element).val(value); //update the HTML input element
//    },
//    change: function () {
//        var value = this.element.value;
//        //in this example the View-Model will be updated only if the value of the input is a number
//        if (value == '') {
//            // AAAAAAAARGH
//        }
//    }
//});

// ta: https://www.geeksforgeeks.org/how-to-check-a-date-is-valid-or-not-using-javascript/
Date.prototype.isValid = function () {
    // If the date object is invalid it
    // will return 'NaN' on getTime()
    // and NaN is never equal to itself.
    return this.getTime() === this.getTime();
};