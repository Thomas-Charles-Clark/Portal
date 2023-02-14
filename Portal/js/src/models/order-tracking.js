const orderTrackingViewModel = (orderId = null) => (
    function () {
        var self = {};

        self.busy = ko.observable(false);

        self.busyMessage = ko.observable();

        self.orderSearchTerm = ko.observable(orderId);

        self.orderSearchTermParams = {
            label: 'Search by Designers Guild Order Number or Customer Order Reference',
            observable: self.orderSearchTerm,
            showClear: true,
            clearFunction: function () {
                self.orderSearchTerm(undefined);
                self.orderSearchResult(undefined);
            },
            enterKey: function () {
                self.search();
            }
        };

        self.parcelSearchTerm = ko.observable();

        self.parcelSearchTerm.subscribe(function (newValue) {

            $('.order-line-identifier').each(function (index, olid) {
                ko.cleanNode(olid);
                ko.applyBindings(ko.contextFor(olid.parentNode), olid);
            });

            $('.product-code-identifier').each(function (index, olid) {
                ko.cleanNode(olid);
                ko.applyBindings(ko.contextFor(olid.parentNode), olid);
            });

            if (newValue) {
                $('.order-line-identifier').each(function (index, olid) {
                    ko.cleanNode(olid);
                    ko.applyBindings(ko.contextFor(olid.parentNode), olid);
                    if (olid.innerText == newValue) {
                        olid.innerHTML = '<mark>' + olid.innerText + '</mark>';
                    }
                });
                $('.product-code-identifier').each(function (index, pcid) {
                    let uppered = newValue.toUpperCase();
                    if (pcid.innerText.includes(uppered)) {
                        let sPos = pcid.innerText.indexOf(uppered); // this... does this only consider char 0  
                        if (sPos >= 0) {
                            let lhs = pcid.innerText.substring(0, sPos);
                            let rhsStart = sPos + newValue.length;
                            if (rhsStart > pcid.innerText.length)
                                pcid.innerHTML = lhs + '<mark>' + uppered + '</mark>';
                            else
                                pcid.innerHTML = lhs + '<mark>' + uppered + '</mark>' + pcid.innerText.substring(rhsStart);
                        }
                    }
                });
            }
        });

        self.parcelSearchTermParams = {
            label: 'Search by Product Code or Line Number',
            observable: self.parcelSearchTerm,
            showClear: true,
            clearFunction: function () {
                self.parcelSearchTerm(undefined);
            },
        };

        self.orderSearchResult = ko.observable();

        self.despatchedParcelDisplay = ko.computed(function () {
            if (self.orderSearchResult()) {
                return Enumerable.From(self.orderSearchResult().DespatchHeads).Where(function (dh) {
                    return dh.DespatchedDT != null
                }).SelectMany(function (dh) {
                    return dh.ParcelHeads
                }).Select(function (ph) {
                    return parcel({ parcel: ph, parent: self });
                }).OrderBy(function (p) {
                    return p.ParcelID
                }).ToArray()
            } else {
                return [];
            }
        }, self);

        self.filteredDespatchedParcelDisplay = ko.computed(function () {
            var results = self.despatchedParcelDisplay();
            if (self.parcelSearchTerm()) {
                return Enumerable.From(results).Where(function (p) {
                    return Enumerable.From(p.ParcelLines).Where(function (pc) {
                        let uppered = self.parcelSearchTerm().toUpperCase();
                        return (pc.DespatchLineID.split('*')[1] == self.parcelSearchTerm())
                            || (pc.ProductCode.indexOf(uppered) >= 0)
                    }).Any();
                }).ToArray();
            } else {
                return results;
            }
        }, self);

        self.remainingToDespatchParcelDisplay = ko.computed(function () {
            if (self.orderSearchResult()) {
                return Enumerable.From(self.orderSearchResult().DespatchHeads).Where(function (dh) {
                    return dh.DespatchedDT == null
                }).SelectMany(function (dh) {
                    return dh.ParcelHeads
                }).Select(function (ph) {
                    return parcel({ parcel: ph, parent: self });
                }).OrderBy(function (p) {
                    return p.ParcelID
                }).ToArray()
            } else {
                return [];
            }
        }, self);

        self.orderNumberSearchResults = ko.observableArray([]);

        self.lastSearched = ko.observable();

        self.jsonViewer = ko.observable();

        self.search = function () {
            if (!self.orderSearchTerm())
                return;

            self.orderSearchResult(undefined);
            self.orderNumberSearchResults([]);

            self.busyMessage('Searching...');

            self.busy(true);

            var data = {
                searchTerm: self.orderSearchTerm()
            };

            console.log('orderSearch calling with', data);

            var t0 = performance.now();

            $.ajax({
                url: '/api/ordertracking/OrderSearch',
                type: "POST",
                dataType: "json",
                data: data,
                success: function (data) {

                    self.busy(false);

                    self.busyMessage(undefined);

                    console.log('orderSearch returned in ~' + Math.round(performance.now() - t0) + 'ms', data);

                    self.lastSearched(self.orderSearchTerm());

                    if (data.hasOwnProperty('order')) {
                        self.orderSearchResult(data.order);
                        self.emailer.subject(`Order ${data.order?.OrderID} Tracking Update - Designers Guild`);
                        self.emailer.to(data.order?.DeliveryAlertEmail);
                    } else {
                        self.orderNumberSearchResults(data.searchResults);
                    }

                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    self.busyMessage(undefined);
                }
            });
        }

        self.emailer = emailer({ parent: self });

        self.emailer.body.rules.remove(function (item) {
            return item.rule == "required";
        });

        self.emailer.subject('Tracking Update - Designers Guild');
        self.emailer.body(getBodyDefault());

        self.emailer.send = function () {
            self.emailer.validateSendNow(true);
            if (self.emailer.emailErrors().length) {
                self.emailer.emailErrors.filter(function (x) {
                    x.isValid.notifySubscribers(x.isValid());
                });
            } else {
                self.busyMessage('Sending Email to ' + self.emailer.to());

                self.busy(true);

                var data = {
                    orderId: self.orderSearchResult().OrderID,
                    email: self.emailer.to(),
                    replyTo: self.emailer.replyTo(),
                    subject: self.emailer.subject(),
                    body: self.emailer.body()
                };

                console.log('calling emailTrackingUrls with', data);

                $.ajax({
                    url: '/api/ordertracking/EmailTrackingInfo',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        self.busy(false);
                        self.busyMessage(undefined);
                        self.emailer.sentTo(self.emailer.to());
                        self.emailer.showLastSentTo(true);
                        window.setTimeout(function () {
                            self.emailer.showLastSentTo(false);
                        }, 5000);
                    },
                    error: function (xhr, s, a) {
                        self.busy(false);
                        self.busyMessage(undefined);

                        if (xhr.responseJSON && xhr.responseJSON.ExceptionMessage)
                            xhr.responseText = xhr.responseJSON.ExceptionMessage;

                        $.showError({ responseText: '<iframe id="email-error-iframe"></iframe>' }, s, a);

                        if (xhr.responseJSON && xhr.responseJSON.ExceptionMessage) {
                            window.setTimeout(function () {
                                document.getElementById('email-error-iframe').src = 'data:text/html;charset=utf-8,' + escape(xhr.responseText);
                            }, 300);
                        }
                    },
                    timeout: 60000
                });
            }
        }

        if (self.orderSearchTerm()) {
            self.search();
        }

        return self;
    })
    ();

const parcel = ({ parcel, parent } = {}) => (
    function () {
        var self = $.extend(parcel, {});

        self.parent = parent;

        self.expanded = ko.observable();

        self.despatchHead = ko.pureComputed(function () {
            return Enumerable.From(self.parent.orderSearchResult()?.DespatchHeads).Where(function (x) {
                return x.DespatchHeadID == self.DespatchHeadID
            }).SingleOrDefault();
        }, self);

        self.DespatchDate = ko.pureComputed(function () {
            return self.despatchHead()?.DespatchedDate;
        }, self);

        self.ParcelLines = self.ParcelLines.map(function (pl) {
            return $.extend(pl, {
                OrderLine: ko.computed(function () {
                    return Enumerable.From(self.parent.orderSearchResult()?.OrderLines).Where(function (ol) {
                        return ol.DespatchLineID == pl.DespatchLineID
                    }).SingleOrDefault();
                }, self)
            });
        });

        return self;
    })
    ();