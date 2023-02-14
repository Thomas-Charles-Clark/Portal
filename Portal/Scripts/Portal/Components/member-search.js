var memberSearch = function (paginationClass, extraMemberSelectFunction, searchPathOverride, showRecentlyUsed) {
    var self = this;

    self.showRecentlyUsed = typeof showRecentlyUsed !== 'undefined' ? showRecentlyUsed : true;
    self.searchPath = '/Component/MemberSearch';

    if (searchPathOverride) {
        self.searchPath = searchPathOverride;
    }

    self.paginationClass = paginationClass || '.member-search-pagination';

    self.searchBusy = ko.observable(false);

    self.searchTerm = ko.observable(null).extend({ notify: 'always' });

    //self.searchTerm.subscribe(function (newValue) {
    //    self.performSearch();
    //});

    self.selectedTradeAccountGroupId = ko.observable(getTradeAccountGroupId());

    self.selectedTradeAccountId = ko.observable(getTradeAccountId());

    self.haveSearched = ko.observable(false);

    self.onSearchKeyUp = function (parent, event) {
        var key = event.which ? event.which : event.keyCode;
        switch (key) {
            case 13:
                self.performSearch();
                break;
        }
    }

    self.extraMemberSelectFunction = function (member) {

    };

    if (typeof extraMemberSelectFunction === 'function') {
        self.extraMemberSelectFunction = extraMemberSelectFunction;
    }

    self.memberSelected = function (member) {

        if (member) {
            self.searchTerm(member.hasOwnProperty('FullName') ? member.FullName : member.Name);
        } else {
            self.searchTerm(undefined);
        }

        self.extraMemberSelectFunction(member);
    }

    self.searchResults = ko.observable([]);

    self.searchResultsTotalCount = ko.observable(0);

    self.pageNumber = ko.observable(1);

    self.pageSize = ko.observable(10);

    self.pageCount = ko.observable(0);

    self.lastSearchTerm = ko.observable(null);
    self.lastSearchTradeAccountGroupId = ko.observable(getTradeAccountGroupId());
    self.lastSearchTradeAccountId = ko.observable(getTradeAccountId());
    self.lastSearchPageNumber = ko.observable(1);
    self.lastSearchPageSize = ko.observable(10);

    self.clearSearch = function () {
        self.searchTerm(null);
        $(self.searchTerm.DOMElement).focus();
    }

    self.clearResults = function () {
        $(self.searchTerm.DOMElement).val(null);
        $(self.searchTerm.DOMElement).focus();
        self.pageCount(0);
        self.searchResultsTotalCount(0);
        self.searchResults([]);
        self.haveSearched(false);
        self.searchBusy(false);
        if ($(self.paginationClass).data("twbs-pagination")) {
            $(self.paginationClass).twbsPagination('destroy');
        }
    }

    self.performSearch = function (termOverride) {
        if (self.searchTermsChanged()) {
            self.pageNumber(1);
        }
        if (!self.searchBusy()) {
            self.searchBusy(true);
            self.setLastSearch();

            $(self.searchTerm.DOMElement).addClass('ui-autocomplete-loading');

            $.ajax({
                url: self.searchPath,
                type: "POST",
                dataType: "json",
                cache: false,
                data: {
                    term: termOverride || self.searchTerm(),
                    tradeAccountGroupId: self.selectedTradeAccountGroupId(),
                    tradeAccountId: self.selectedTradeAccountId(),
                    languageId: 1,
                    pageNumber: self.pageNumber(),
                    pageSize: self.pageSize()
                },
                success: function (data) {
                    // necessary because we've overridden the select function to noop
                    $(self.searchTerm.DOMElement).removeClass('ui-autocomplete-loading');
                    
                    self.haveSearched(true);

                    self.searchBusy(false);

                    var results = [];

                    self.pageCount(Math.ceil(data.TotalResultsCount / self.pageSize()));
                    self.searchResultsTotalCount(data.TotalResultsCount);
                    self.searchResults(data.Members);

                    if ($(self.paginationClass).data("twbs-pagination")) {
                        $(self.paginationClass).twbsPagination('destroy');
                    }

                    if (self.pageCount()) {
                        $(self.paginationClass).twbsPagination({
                            startPage: self.pageNumber(),
                            totalPages: self.pageCount(),
                            visiblePages: (self.pageCount() > 6 ? 6 : self.pageCount()),
                            initiateStartPageClick: false,
                            onPageClick: function (event, page) {
                                self.page(page);
                            }
                        });
                    } else {
                        $(self.paginationClass).twbsPagination({
                            startPage: self.pageNumber(),
                            totalPages: 1,
                            visiblePages: 1,
                            initiateStartPageClick: false,
                            onPageClick: function (event, page) {
                                self.page(page);
                            }
                        });
                    }

                    self.haveSearched(true);
                },
                error: function (xhr, textStatus, errorThrown) {
                    self.searchBusy(false);
                    $(self.searchTerm.DOMElement).removeClass('ui-autocomplete-loading');
                    //$.showError(xhr, textStatus, errorThrown);
                }
            });
        }
    }

    self.page = function (page) {
        self.pageNumber(page);
        self.performSearch();
    }

    self.searchTermsChanged = function () {
        var result =
            (self.lastSearchTerm() != self.searchTerm()) ||
            (self.lastSearchTradeAccountGroupId() != self.selectedTradeAccountGroupId()) ||
            (self.lastSearchTradeAccountId() != self.selectedTradeAccountId()) ||
            (self.lastSearchPageSize() != self.pageSize());

        return result;
    };

    self.setLastSearch = function () {
        self.lastSearchTerm(self.searchTerm());
        self.lastSearchTradeAccountGroupId(self.selectedTradeAccountGroupId());
        self.lastSearchTradeAccountId(self.selectedTradeAccountId());
        self.lastSearchPageSize(self.pageSize());
    };

    recentlyUsedMembersListener.subscribe(function (incomingList) {
        var myMemberIDs = Enumerable.From(self.recentlyUsedMembers()).Select(function (x) { return x.MemberID }).ToArray();

        for (var i in incomingList) {
            var thisIncomingMember = incomingList[i];
            if (myMemberIDs.indexOf(thisIncomingMember.MemberID) == -1) {
                self.recentlyUsedMembers.push(thisIncomingMember);
            }
        }

    }, self, "recentlyUsedMembersUpdated");

    self.updateRecentlyUsedMembers = function (member) {
        var m = member;
        var extant = Enumerable.From(self.recentlyUsedMembers()).Where(function (x) {
            if (x.MemberID === member.MemberID)
                return x;
        }).SingleOrDefault();

        if (extant) {
            return;
        }
        else {
            self.recentlyUsedMembers.push(m);

            recentlyUsedMembersListener.notifySubscribers(self.recentlyUsedMembers(), "recentlyUsedMembersUpdated");

            $.ajax({
                url: '/Component/UpdateRecentlyUsedMembers',
                type: 'POST',
                dataType: 'json',
                data: {
                    memberId: member.MemberID
                },
                success: function (data) {
                    //console.log('recently used members updated');
                }
            });
        }
    }

    self.recentlyUsedMembers = ko.observableArray(getRecentlyUsedMembers());
    
    self.initAutocomplete = function () {
        $(self.searchTerm.DOMElement).autocomplete({
            classes: {
                'account-no': 'account-no'
            },
            appendTo: 'body',
            source: function (request, response) {
                $.ajax({
                    url: self.searchPath || "/Component/MemberAutocomplete",
                    type: "POST",
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function (data) {
                        response($.map(data.Members, function (item) {
                            return {
                                label: (item.hasOwnProperty('FullName') ? item.FullName : item.Name) + (item.Email ? ' ' + item.Email : ''),
                                value: item
                            };
                        }));
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //$.showError(xhr, textStatus, errorThrown);
                    }
                });
            },
            minLength: 1,
            focus: function (event, ui) {
                event.preventDefault();
            },
            select: function (event, ui) {
                self.memberSelected(ui.item.value);
                if (self.showRecentlyUsed) {
                    self.updateRecentlyUsedMembers(ui.item.value)
                }
                return false;
            },
            autoFocus: true
        })
        return true;
    }
}