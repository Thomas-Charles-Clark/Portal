function notificationsViewModel ({

} = {

}) {
    let self = {};

    //#region Properties

    self.notifications = ko.observableArray([]);

    self.displayElement = document.querySelector("#alerting-target");

    self.bellElement = document.querySelector("#alerting-display .fa-bell");

    self.notificationSoundPath = "/content/sounds/notification-sound.mp3";

    self.notificationSound = new Audio(self.notificationSoundPath);

    //#endregion


    //#region Computeds

    self.unacknowledgedNotifications = ko.pureComputed(() => {
        return self.notifications().flatMap(n => n.Acknowledged ? [] : [n]);
    }, self);

    self.sortedNotifications = ko.pureComputed(() => {
        return Enumerable.From(self.notifications())
            .OrderBy(n => n.Priority)
            .ThenByDescending(n => n.NotificationID)
            .ToArray();
        //return self.notifications().sort((a, b) => {
        //    let priorityA = a.Priority;
        //    let priorityB = b.Priority;
        //    let notificationIdA = a.NotificationID;
        //    let notificationIdB = b.NotificationID;

        //    if (priorityA === priorityB) {
        //        return notificationIdA > notificationIdB ? -1 : 1;
        //    } else {
        //        return priorityA > priorityB ? -1 : 1;
        //    }
        //})
    }, self);

    //#endregion


    //#region Methods



    //#endregion


    //#region Events



    //ta https://css-tricks.com/using-css-transitions-auto-dimensions/

    self.hide = function () {
        self.displayElement.classList.remove('open');

        // get the height of the element's inner content, regardless of its actual size
        let sectionHeight = self.displayElement.scrollHeight;

        // temporarily disable all css transitions
        let elementTransition = self.displayElement.style.transition;
        self.displayElement.style.transition = '';

        // on the next frame (as soon as the previous style change has taken effect),
        // explicitly set the element's height to its current pixel height, so we 
        // aren't transitioning out of 'auto'
        requestAnimationFrame(function () {
            self.displayElement.style.height = sectionHeight + 'px';
            self.displayElement.style.transition = elementTransition;

            // on the next frame (as soon as the previous style change has taken effect),
            // have the element transition to height: 0
            requestAnimationFrame(function () {
                self.displayElement.style.height = 0 + 'px';
            });
        });

        // mark the section as "currently collapsed"
        self.displayElement.setAttribute('data-collapsed', 'true');
    }

    self.toggle = function (ev) {

        if (self.displayElement.classList.contains('open'))
            self.hide();
        else
            self.show();

        self.bellElement.classList.remove('ringing');

        ev.stopPropagation();

        return true;
    }

    self.show = function () {
        self.displayElement.classList.add('open');

        var element = self.displayElement;

        // get the height of the element's inner content, regardless of its actual size
        var sectionHeight = element.scrollHeight;

        // have the element transition to the height of its inner content
        element.style.height = sectionHeight + 'px';

        // when the next css transition finishes (which should be the one we just triggered)
        element.addEventListener('transitionend', function (e) {
            // remove this event listener so it only gets triggered once
            element.removeEventListener('transitionend', arguments.callee);

            // remove "height" from the element's inline styles, so it can return to its initial value
            element.style.height = 'auto';
        });

        // mark the section as "currently not collapsed"
        element.setAttribute('data-collapsed', 'false');
    }

    self.receiveNotification = function (incoming) {
        //console.log('notificationsViewModel: received', incoming);

        self.notifications.remove(n => n.NotificationID == incoming.NotificationID);

        self.notifications.push(incoming);

        self.bellElement.classList.add('ringing');

        //self.notificationSound.play();
    }

    self.receiveNotifications = function (incoming) {
        //console.log('notificationsViewModel: received', incoming);

        let notifications = [];

        incoming.forEach(function (notification) {
            notifications.push(notification);
        });

        let countBefore = self.notifications().length;

        self.notifications(notifications);

        let countAfter = self.notifications().length;

        if (countBefore < countAfter) {
            self.bellElement.classList.add('ringing');
        }
    }

    self.hub = $.connection.notificationHub;

    self.hub.client.receiveNotification = self.receiveNotification;
    self.hub.client.receiveNotifications = self.receiveNotifications;

    self.acknowledgeNotification = (notification) => {
        self.hub.server.acknowledgeNotification(notification.NotificationID);
        self.notifications.remove(n => n.NotificationID === notification.NotificationID);
    }

    self.fetchInterval = null;

    self.hub.connection.start().done(function () {
        if (self.hub.connection.state === $.signalR.connectionState.connected) {
            self.hub.server.fetchNotifications();
        } else {
            console.log('notificationsViewModel: did not fetch because hub was disconnected');
        }

        //self.hub.server.fetchNotifications();
        // no fetching at intervals: if notifications occur, we want them to be pushed to the user.
        // this multiplies up across all open tabs, extra badness
        //self.fetchInterval = setInterval(function () {
        //    console.log('notificationsViewModel: fetchInterval ticked');
        //    if (self.hub.connection.state === $.signalR.connectionState.connected) {
        //        self.hub.server.fetchNotifications();
        //    } else {
        //        console.log('notificationsViewModel: did not fetch because hub was disconnected');
        //    }
        //}, 30000);
    });

    //document.querySelector('body').addEventListener('click', function (ev) {
    //    self.hide();
    //});

    //#endregion

    window.notificationComponent = self;

    return self;
};

//var alertingComponentViewModel = function () {
//    var self = this;

//    self.alerts = ko.observableArray([]);

//    self.taskHref = function () {
//        if (typeof viewModel !== 'undefined') {
//            if (viewModel.hasOwnProperty('taskGridWidget')) {
//                return '#';
//            } else {
//                return '/tasks'
//            }
//        }
//    }

//    self.unreadTasks = ko.pureComputed(function () {
//        return ko.utils.arrayFilter(self.alerts(), function (item) {
//            return item.alertType == 1 && item.unread()
//        });
//    }, self);

//    self.generateTaskHref = function (task) {
//        if (typeof viewModel !== 'undefined') {
//            if (viewModel.hasOwnProperty('taskGridWidget')) {
//                return 'javascript:;'
//            }
//        }

//        return '/tasks?i=' + task.id;
//    }

//    self.unreadTaskClick = function (task, event) {
//        if (typeof viewModel !== 'undefined') {
//            if (viewModel.hasOwnProperty('taskGridWidget')) {
//                viewModel.taskEdit.load(task.data);
//                self.alerts.remove(task);
//                //event.stopImmediatePropagation();
//                //event.preventDefault();
//                //event.stopPropagation();
//                //return true;
//            }
//        }

//        event.stopPropagation();
//        return true;
//    }

//    self.chasedTasks = ko.pureComputed(function () {
//        return ko.utils.arrayFilter(self.alerts(), function (item) {
//            return item.alertType == 2 && item.unread();
//        });
//    });

//    self.commentedTasks = ko.pureComputed(function () {
//        return ko.utils.arrayFilter(self.alerts(), function (item) {
//            return item.alertType == 3 && item.unread();
//        });
//    })

//    self.completedTasks = ko.pureComputed(function () {
//        return ko.utils.arrayFilter(self.alerts(), function (item) {
//            return item.alertType == 4 && item.unread();
//        });
//    })

//    self.expectedDeliveryChangedTasks = ko.pureComputed(function () {
//        return ko.utils.arrayFilter(self.alerts(), function (item) {
//            return item.alertType == 5 && item.unread();
//        });
//    })

//    self.hideAlerting = function () {
//        $("#alerting-target").stop(true, false).slideUp();//stop(true, false).slideUp();
//        //$("#alerting-target").stop(true, false).animate({
//        //    left: -300,
//        //    top: -350
//        //}, 500);
//    }

//    $('body').on('click', function (ev, ui) {
//        self.hideAlerting();
//    });

//    self.toggleAlerts = function (ev) {
//        $("#alerting-display .fa-bell").removeClass('bell-ringing');
//        $("#alerting-target").slideToggle();
//        ev.stopPropagation();
//        return true;
//    }

//    self.displayAlerts = function () {
//        $("#alerting-target").show();//.stop(true, false).slideDown();
//        //$('#alerting-target').stop(true, false).animate({
//        //    left: 0,
//        //    top: 0
//        //}, 400);
//    }

//    self.clearAllAlerts = function () {
//        self.alerts().forEach(function (item) {
//            item.unread(false);
//        });
//    }

//    self.clearNotifications = function () {
//        self.alerts([]);
//    }

//    self.receiveAlert = function (alert) {
//        console.log(alert.message);
//        switch (alert.alertType) {
//            case 1:
//                //if (typeof viewModel !== 'undefined') {
//                //    if (viewModel.hasOwnProperty('taskGridWidget'))
//                //        if (viewModel.taskGridWidget())
//                //            viewModel.taskGridWidget().dataSource.read();
//                //}
//                break;
//            default:
//                break;
//        }
//        self.alerts.push({ id: alert.Id, alertType: alert.alertType, message: alert.message, source: alert.source, unread: ko.observable(true), data: alert.data });

//        $("#alerting-display .fa-bell").addClass('bell-ringing');
//    }

//    self.anyUnreadAlerts = ko.pureComputed(function () {
//        return ko.utils.arrayFilter(self.alerts(), function (item) {
//            return item.unread() == true;
//        }).length;
//    }, self);

//    self.setAlerts = function (incomingAlerts) {
//        //console.log('alertingComponent: received alerts', incomingAlerts);
//        var refreshTasks = false;
//        var alerts = [];
//        incomingAlerts.forEach(function (alert) {
//            switch (alert.alertType) {
//                case 1:
//                case 2:
//                    refreshTasks = true;
//                    break;
//            }
//            alerts.push({ id: alert.id, alertType: alert.alertType, message: alert.message, source: alert.source, unread: ko.observable(true), data: alert.data });
//        });
//        var countBefore = self.alerts().length;
//        self.alerts(alerts);
//        var countAfter = self.alerts().length;
//        if (countBefore < countAfter) {
//            $("#alerting-display .fa-bell").addClass('bell-ringing');
//            refreshTasks = true;
//        } else {
//            refreshTasks = false;
//        }
//        // this logic doesn't hold... we want to refresh Tasks grid when we KNOW that we have differing IDs
//        // on either unread or chased
//        // so... sum the IDs?

//        if (refreshTasks) {
//            if (typeof viewModel !== 'undefined') {
//                if (viewModel.hasOwnProperty('taskGridWidget'))
//                    if (viewModel.taskGridWidget())
//                        viewModel.taskGridWidget().dataSource.read();
//            }
//        }
//    }

//    self.taskAlertHub = $.connection.taskAlertHub;

//    self.taskAlertHub.client.receiveAlert = self.receiveAlert;
//    self.taskAlertHub.client.setAlerts = self.setAlerts;

//    self.readAlert = function (alertId) {
//        self.taskAlertHub.server.readAlert(alertId);
//    }

//    self.fetchInterval = null;

//    self.taskAlertHub.connection.start().done(function () {
//        self.taskAlertHub.server.fetchAlerts();
//        self.fetchInterval = setInterval(function () {
//            if (self.taskAlertHub.connection.state === $.signalR.connectionState.connected) {
//                self.taskAlertHub.server.fetchAlerts();
//            } else {
//                console.log('alertingComponent: did not fetchAlerts because hub was disconnected');
//            }
//        }, 30000);
//    });
//};