var gdprSurveyViewModel = function () {
    var self = this;

    self.loadingBusy = ko.observable(true);

    var categories = getDataCategories();

    categories.forEach(function (item) {
        item.DataTypes = ko.observableArray(item.DataTypes);
    });

    self.dataCategories = ko.observableArray(categories);

    self.newDataCategoryName = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a name'
        },
        charsRemaining: {
            maxLength: 50,
            elementId: '#new-data-category-name'
        }
    });

    self.newDataCategoryErrors = ko.validation.group([
        self.newDataCategoryName
    ]);

    self.showNewDataCategoryModal = function () {
        self.newDataCategoryName(undefined);
        self.newDataCategoryErrors.showAllMessages(false);
        $("#new-data-category-modal").modal('show');
    }

    self.addNewDataCategory = function () {
        if (self.newDataCategoryErrors().length > 0) {
            self.newDataCategoryErrors.showAllMessages(true);
            return;
        } else {
            $.ajax({
                url: '/api/gdprapi/AddDataCategory',
                type: 'POST',
                dataType: 'json',
                data: {
                    Name: self.newDataCategoryName()
                },
                success: function (data) {
                    $("#new-data-category-modal").modal('hide');
                    data.DataTypes = ko.observableArray();
                    self.dataCategories.push(data);
                    self.newDataCategoryName(undefined);
                    self.newDataCategoryErrors.showAllMessages(false);
                }
            });
        }
    }

    self.newDataTypeName = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a name'
        },
        charsRemaining: {
            maxLength: 50,
            elementId: '#new-data-type-name'
        }
    });

    self.newDataTypeDataCategoryID = ko.observable();

    self.newDataTypeErrors = ko.validation.group([
        self.newDataTypeName
    ]);

    self.showNewDataTypeModal = function (dataCategoryId) {
        self.newDataTypeName(undefined);
        self.newDataTypeDataCategoryID(dataCategoryId);
        self.newDataTypeErrors.showAllMessages(false);
        $("#new-data-type-modal").modal('show');
    }

    self.addNewDataType = function () {
        if (self.newDataTypeErrors().length > 0) {
            self.newDataTypeErrors.showAllMessages(true);
            return;
        } else {
            $.ajax({
                url: '/api/gdprapi/AddDataType',
                type: 'POST',
                dataType: 'json',
                data: {
                    DataCategoryID: self.newDataTypeDataCategoryID(),
                    Name: self.newDataTypeName()
                },
                success: function (data) {
                    $("#new-data-type-modal").modal('hide');

                    self.dataCategories().forEach(function (item) {
                        if (item.DataCategoryID == self.newDataTypeDataCategoryID()) {
                            data.DataCategory = item;
                            item.DataTypes.push(data);
                        }
                    });

                    self.newDataTypeName(undefined);
                    self.newDataTypeDataCategoryID(undefined);
                    self.newDataTypeErrors.showAllMessages(false);
                }
            });
        }
    }

    self.individualCategories = ko.observableArray(getIndividualCategories());

    self.newIndividualCategoryName = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a name'
        },
        charsRemaining: {
            maxLength: 50,
            elementId: '#new-individual-category-name'
        }
    });

    self.newIndividualCategoryErrors = ko.validation.group([
        self.newIndividualCategoryName
    ]);

    self.showNewIndividualCategoryModal = function () {
        self.newIndividualCategoryName(undefined);
        self.newIndividualCategoryErrors.showAllMessages(false);
        $("#new-individual-category-modal").modal('show');
    }

    self.addNewIndividualCategory = function () {
        if (self.newIndividualCategoryErrors().length > 0) {
            self.newIndividualCategoryErrors.showAllMessages(true);
            return;
        } else {
            $.ajax({
                url: '/api/gdprapi/AddIndividualCategory',
                type: 'POST',
                dataType: 'json',
                data: {
                    Name: self.newIndividualCategoryName()
                },
                success: function (data) {
                    $("#new-individual-category-modal").modal('hide');
                    self.individualCategories.push(data);
                    self.newIndividualCategoryName(undefined);
                    self.newIndividualCategoryErrors.showAllMessages(false);

                    window.setTimeout(function () { recalculateClones() }, 0);
                }
            });
        }
    }

    self.dataStores = ko.observableArray(getDataStores());

    self.newDataStoreName = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a name'
        },
        charsRemaining: {
            maxLength: 50,
            elementId: '#new-data-store-name'
        }
    });

    self.newDataStoreErrors = ko.validation.group([
        self.newDataStoreName
    ]);

    self.showNewDataStoreModal = function () {
        self.newDataStoreName(undefined);
        self.newDataStoreErrors.showAllMessages(false);
        $("#new-data-store-modal").modal('show');
    }

    self.addNewDataStore = function () {
        if (self.newDataStoreErrors().length > 0) {
            self.newDataStoreErrors.showAllMessages(true);
            return;
        } else {
            $.ajax({
                url: '/api/gdprapi/AddDataStore',
                type: 'POST',
                dataType: 'json',
                data: {
                    Name: self.newDataStoreName()
                },
                success: function (data) {
                    $("#new-data-store-modal").modal('hide');
                    self.dataStores.push(data);
                    self.newDataStoreName(undefined);
                    self.newDataStoreErrors.showAllMessages(false);

                    window.setTimeout(function () { recalculateClones() }, 0);
                }
            });
        }
    }

    self.dataSources = ko.observableArray(getDataSources());

    self.newDataSourceName = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a name'
        },
        charsRemaining: {
            maxLength: 50,
            elementId: '#new-data-source-name'
        }
    });

    self.newDataSourceErrors = ko.validation.group([
        self.newDataSourceName
    ]);

    self.showNewDataSourceModal = function () {
        self.newDataSourceName(undefined);
        self.newDataSourceErrors.showAllMessages(false);
        $("#new-data-source-modal").modal('show');
    }

    self.addNewDataSource = function () {
        if (self.newDataSourceErrors().length > 0) {
            self.newDataSourceErrors.showAllMessages(true);
            return;
        } else {
            $.ajax({
                url: '/api/gdprapi/AddDataSource',
                type: 'POST',
                dataType: 'json',
                data: {
                    Name: self.newDataSourceName()
                },
                success: function (data) {
                    $("#new-data-source-modal").modal('hide');
                    self.dataSources.push(data);
                    self.newDataSourceName(undefined);
                    self.newDataSourceErrors.showAllMessages(false);

                    window.setTimeout(function() { recalculateClones() }, 0);
                }
            });
        }
    }

    self.partnerCategories = ko.observableArray(getPartnerCategories());

    self.newPartnerCategoryName = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a name'
        },
        charsRemaining: {
            maxLength: 50,
            elementId: '#new-partner-category-name'
        }
    });

    self.newPartnerCategoryErrors = ko.validation.group([
        self.newPartnerCategoryName
    ]);

    self.showNewPartnerCategoryModal = function () {
        self.newPartnerCategoryName(undefined);
        self.newPartnerCategoryErrors.showAllMessages(false);
        $("#new-partner-category-modal").modal('show');
    }

    self.addNewPartnerCategory = function () {
        if (self.newPartnerCategoryErrors().length > 0) {
            self.newPartnerCategoryErrors.showAllMessages(true);
            return;
        } else {
            $.ajax({
                url: '/api/gdprapi/AddPartnerCategory',
                type: 'POST',
                dataType: 'json',
                data: {
                    Name: self.newPartnerCategoryName()
                },
                success: function (data) {
                    $("#new-partner-category-modal").modal('hide');
                    self.partnerCategories.push(data);
                    self.newPartnerCategoryName(undefined);
                    self.newPartnerCategoryErrors.showAllMessages(false);
                }
            });
        }
    }

    self.partners = ko.observableArray([]);

    self.partnerCategoriesList = ko.observableArray();

    self.fetchPreviouslySubmittedData = function () {

        self.loadingBusy(true);

        $.ajax({
            url: '/api/gdprapi/GetPreviouslySubmittedData',
            type: 'GET',
            dataType: 'json',
            data: {
                departmentId: self.stages[0].department().DepartmentID
            },
            success: function (data) {

                console.log('fetched previous submission', data);

                if (data.Attendees) {
                    self.stages[0].attendees(data.Attendees);
                }

                if (data.DataCategories_IndividualCategories) {
                    var asJSON = [];

                    data.DataCategories_IndividualCategories.forEach(function (iCat) {
                        asJSON.push(ko.toJSON({
                            DataCategoryID: iCat.DataCategoryID,
                            IndividualCategoryID: iCat.IndividualCategoryID
                        }))
                    });

                    self.stages[1].responses(asJSON);
                }

                if (data.DataCategories_DataStores) {
                    var asJSON = [];

                    data.DataCategories_DataStores.forEach(function (ds) {
                        asJSON.push(ko.toJSON({
                            DataCategoryID: ds.DataCategoryID,
                            DataStoreID: ds.DataStoreID
                        }));
                    });

                    self.stages[2].responses(asJSON);
                }

                if (data.DataCategories_DataSources) {
                    var asJSON = [];

                    data.DataCategories_DataSources.forEach(function (ds) {
                        asJSON.push(ko.toJSON({
                            DataCategoryID: ds.DataCategoryID,
                            DataSourceID: ds.DataSourceID
                        }));
                    });

                    self.stages[3].responses(asJSON);
                }

                // Partners has to be built first, so that stage 4 has some place to put... stuff.
                if (data.Partners) {
                    data.Partners.forEach(function (p) {
                        self.partners.push(new Partner(p, self.dataCategories, self.dataTransmissionMethods));
                    });
                }

                self.partners().forEach(function (p) {
                    self.dataCategories().forEach(function (dc) {
                        self.partnerCategoriesList.push({
                            SupplierID: p.SupplierID,
                            DataCategoryID: dc.DataCategoryID,
                            DataTransmissionMethod: ko.observable()
                        });
                    });
                });

                if (data.DataCategories_Suppliers_DataTransmissionMethods) {
                    // hm.........
                    data.DataCategories_Suppliers_DataTransmissionMethods.forEach(function (sdtm) {
                        var partner = Enumerable.From(self.stages[4].partners()).Where("$.SupplierID == " + sdtm.SupplierID).SingleOrDefault();

                        if (partner) {

                            var method = Enumerable.From(self.dataTransmissionMethods()).Where("$.DataTransmissionMethodID == " + sdtm.DataTransmissionMethodID).Single();

                            var pcl = Enumerable.From(self.partnerCategoriesList()).Where(function (x) {
                                if (x.SupplierID == sdtm.SupplierID && x.DataCategoryID == sdtm.DataCategoryID)
                                    return x;
                            }).Single();

                            pcl.DataTransmissionMethod(method);

                            partner.categoriesSharedWith.push(pcl);

                            console.log('partner found');
                        }
                    });
                }

                self.loadingBusy(false);

                //skipToEnd();
            },
            error: function (xhr, textStatus, errorThrown) {
                self.loadingBusy(false);
                $.showError(xhr, textStatus, errorThrown);
            }
        });
    }


    self.newPartnerName = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a name'
        },
        charsRemaining: {
            maxLength: 50,
            elementId: '#new-partner-name'
        }
    });

    self.newPartnerCategory = ko.observable().extend({
        required: {
            params: true,
            message: 'Please specify a category'
        }
    });

    self.newPartnerContactName = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a contact name'
        },
        charsRemaining: {
            maxLength: 50,
            elementId: '#new-partner-contact-name'
        }
    });

    self.newPartnerContactEmail = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a contact email'
        },
        charsRemaining: {
            maxLength: 256,
            elementId: '#new-partner-contact-email'
        },
        email: {
            params: true,
            message: 'Invalid email address'
        }
    });

    self.newPartnerContactPhone = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a contact phone number'
        },
        charsRemaining: {
            maxLength: 20,
            elementId: '#new-partner-contact-phone'
        }
    });

    self.newPartnerMertexReference = ko.observable().extend({
        charsRemaining: {
            maxLength: 20,
            elementId: '#new-partner-mertex-reference'
        }
    });

    self.newPartnerErrors = ko.validation.group([
        self.newPartnerName,
        self.newPartnerContactName,
        self.newPartnerCategory,
        self.newPartnerContactEmail,
        self.newPartnerContactPhone
    ]);

    self.extantPartnerID = ko.observable();

    self.loadPartnerForEdit = function (p) {

        var sc = Enumerable.From(self.partnerCategories()).Where("$.SupplierCategoryID == " + p.SupplierCategory().SupplierCategoryID).Single();

        self.newPartnerName(p.Name());
        self.newPartnerCategory(sc);
        self.newPartnerContactName(p.ContactName());
        self.newPartnerContactEmail(p.ContactEmail());
        self.newPartnerContactPhone(p.ContactPhone());
        self.newPartnerMertexReference(p.MertexReference());

        self.extantPartnerID(p.SupplierID);

        $("#partner-modal-title").text('Edit Partner');

        self.showNewPartnerModal();
    }

    self.showNewPartnerModal = function () {
        self.newPartnerErrors.showAllMessages(false);
        $("#new-partner-modal").modal('show');
    }

    self.addNewPartner = function () {
        if (self.newPartnerErrors().length > 0) {
            self.newPartnerErrors.showAllMessages(true);
            return;
        } else {
            if (self.extantPartnerID()) {
                $.ajax({
                    url: '/api/gdprapi/UpdatePartner',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        SupplierID: self.extantPartnerID(),
                        DepartmentID: self.stages[0].department().DepartmentID,
                        Name: self.newPartnerName(),
                        PartnerCategoryID: self.newPartnerCategory().SupplierCategoryID,
                        ContactName: self.newPartnerContactName(),
                        ContactEmail: self.newPartnerContactEmail(),
                        ContactPhone: self.newPartnerContactPhone(),
                        MertexReference: self.newPartnerMertexReference()
                    },
                    success: function (partner) {
                        $("#new-partner-modal").modal('hide');

                        var p = Enumerable.From(self.stages[4].partners()).Where("$.SupplierID == " + self.extantPartnerID()).Single();

                        p.Name(self.newPartnerName());
                        p.SupplierCategory(self.newPartnerCategory());
                        p.ContactName(self.newPartnerContactName());
                        p.ContactEmail(self.newPartnerContactEmail());
                        p.ContactPhone(self.newPartnerContactPhone());
                        p.MertexReference(self.newPartnerMertexReference());

                        self.extantPartnerID(undefined);

                        self.newPartnerName(undefined);
                        self.newPartnerCategory(undefined);
                        self.newPartnerContactName(undefined);
                        self.newPartnerContactEmail(undefined);
                        self.newPartnerContactPhone(undefined);
                        self.newPartnerErrors.showAllMessages(false);

                        window.setTimeout(function () { recalculateClones() }, 0);
                        window.setTimeout(function () {
                            self.stages[4].save();
                        });
                    }
                });
            } else {
                $.ajax({
                    url: '/api/gdprapi/AddPartner',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        DepartmentID: self.stages[0].department().DepartmentID,
                        Name: self.newPartnerName(),
                        PartnerCategoryID: self.newPartnerCategory().SupplierCategoryID,
                        ContactName: self.newPartnerContactName(),
                        ContactEmail: self.newPartnerContactEmail(),
                        ContactPhone: self.newPartnerContactPhone(),
                        MertexReference: self.newPartnerMertexReference()
                    },
                    success: function (partner) {
                        $("#new-partner-modal").modal('hide');

                        partner.categories = ko.observableArray(self.dataCategories().slice());
                        partner.categories().forEach(function (item) {
                            item.dataTransmissionMethods = self.dataTransmissionMethods;
                            item.selectedDataTransmissionMethod = ko.observable();
                            item.shared = ko.observable(false);
                        });

                        self.dataCategories().forEach(function (dc) {
                            self.partnerCategoriesList.push({
                                SupplierID: partner.SupplierID,
                                DataCategoryID: dc.DataCategoryID,
                                DataTransmissionMethod: ko.observable()
                            });
                        });

                        var p = new Partner(partner, self.dataCategories, self.dataTransmissionMethods);

                        self.partners.splice(0, 0, p);

                        self.newPartnerName(undefined);
                        self.newPartnerCategory(undefined);
                        self.newPartnerContactName(undefined);
                        self.newPartnerContactEmail(undefined);
                        self.newPartnerContactPhone(undefined);
                        self.newPartnerErrors.showAllMessages(false);

                        window.setTimeout(function () { recalculateClones() }, 0);
                        window.setTimeout(function () {
                            self.stages[4].save();
                        });
                    }
                });
            }
        }
    }

    self.dataTransmissionMethods = ko.observableArray(getDataTransmissionMethods());

    self.newDataTransmissionMethodName = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a name'
        },
        charsRemaining: {
            maxLength: 50,
            elementId: '#new-data-transmission-method-name'
        }
    });

    self.newDataTransmissionMethodErrors = ko.validation.group([
        self.newDataTransmissionMethodName
    ]);

    self.showNewDataTransmissionMethodModal = function () {
        self.newDataTransmissionMethodName(undefined);
        self.newDataTransmissionMethodErrors.showAllMessages(false);
        $("#new-data-transmission-method-modal").modal('show');
    }

    self.addNewDataTransmissionMethod = function () {
        if (self.newDataTransmissionMethodErrors().length > 0) {
            self.newDataTransmissionMethodErrors.showAllMessages(true);
            return;
        } else {
            $.ajax({
                url: '/api/gdprapi/AddDataTransmissionMethod',
                type: 'POST',
                dataType: 'json',
                data: {
                    Name: self.newDataTransmissionMethodName()
                },
                success: function (data) {
                    $("#new-data-transmission-method-modal").modal('hide');
                    self.dataTransmissionMethods.push(data);
                    self.newDataTransmissionMethodName(undefined);
                    self.newDataTransmissionMethodErrors.showAllMessages(false);

                    window.setTimeout(function () { recalculateClones() }, 0);
                }
            });
        }
    }

    self.stages = [
        new departmentDetailsStage(self),
        new personalInfoWorkedStage(self),
        new personalInfoStoredStage(self),
        new howDoYouCollectStage(self),
        new whoDoYouShareWithStage(self),
        new thankYouStage()
    ];

    self.activeStage = ko.observable(self.stages[0]);

    self.nextStage = function () {
        var current = self.activeStage().stageId;
        if (current < 5) {
            current += 1;
            if (self.activeStage().save()) {
                self.activeStage(self.stages[current]);
            }
        }
    }

    self.previousStage = function () {
        var current = self.activeStage().stageId;
        if (current > 1) {
            current -= 1;
        }
        self.activeStage(self.stages[current]);
    }

    self.init = function () {
        self.loadingBusy(false);
    }

    self.reset = function () {
        self.loadingBusy(false);

        self.stages.forEach(function (item) {
            if (typeof item.reset === 'function') {
                item.reset();
            }
        });

        self.partnerCategoriesList([]);

        self.newDataCategoryName(undefined);
        self.newDataCategoryErrors.showAllMessages(false);
        self.newDataTypeName(undefined);
        self.newDataTypeDataCategoryID(undefined);
        self.newDataTypeErrors.showAllMessages(false);
        self.newIndividualCategoryName(undefined);
        self.newIndividualCategoryErrors.showAllMessages(false);
        self.newDataStoreName(undefined);
        self.newDataStoreErrors.showAllMessages(false);
        self.newDataSourceName(undefined);
        self.newDataSourceErrors.showAllMessages(false);
        self.newPartnerCategoryName(undefined);
        self.newPartnerCategoryErrors.showAllMessages(false);
        self.newPartnerName(undefined);
        self.newPartnerCategory(undefined);
        self.newPartnerContactName(undefined);
        self.newPartnerContactEmail(undefined);
        self.newPartnerContactPhone(undefined);
        self.newPartnerErrors.showAllMessages(false);
        self.newDataTransmissionMethodName(undefined);
        self.newDataTransmissionMethodErrors.showAllMessages(false);

        self.activeStage(self.stages[0]);
    }
}

var departmentDetailsStage = function (parent) {
    var self = this;

    self.parent = parent;

    self.stageId = 0;

    self.heading = "Designers Guild GDPR Data Inventory Questionnaire";

    self.subHeading = "Please complete this survey as accurately as you can";

    self.department = ko.observable().extend({
        required: {
            params: true,
            message: 'Please select your Department'
        }
    });

    self.department.subscribe(function (newValue) {
        if (newValue) {
            self.parent.fetchPreviouslySubmittedData();
        }
    });

    self.attendees = ko.observable().extend({
        required: {
            params: true,
            message: 'Please state who is filling out this survey'
        },
        charsRemaining: {
            maxLength: 500,
            elementId: '#attendees'
        }
    });

    self.availableDepartments = ko.observableArray([]); 

    self.reset = function () {
        self.department(undefined);
        self.attendees(undefined);
        self.errors.showAllMessages(false);
    }

    self.errors = ko.validation.group([
        self.department,
        self.attendees
    ]);

    self.getAvailableDepartments = function () {
        $.ajax({
            url: '/api/gdprapi/GetDepartments',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                self.availableDepartments(data);
                //skipToEnd();
            }
        });
    }

    self.getAvailableDepartments();

    self.save = function () {
        self.parent.loadingBusy(true);
        $.ajax({
            url: '/api/gdprapi/SaveSurveyDepartmentStage',
            type: 'POST',
            dataType: 'json',
            data: {
                DepartmentID: self.department().DepartmentID,
                Attendees: self.attendees(),
            },
            success: function () {
                self.parent.loadingBusy(false);
            },
            error: function (xhr, textStatus, errorThrown) {
                self.parent.loadingBusy(false);
                $.showError(xhr, textStatus, errorThrown);
            }
        });

        return true;
    }
}

var personalInfoWorkedStage = function (parent) {
    var self = this;

    self.parent = parent;

    self.stageId = 1;

    self.heading = "Stage 1 of 4 - What personal information does your department work with?";

    self.subHeading = "Please complete this survey as accurately as you can";

    self.individualCategories = self.parent.individualCategories;

    self.responses = ko.observableArray([]);

    self.reset = function () {
        self.responses([]);
    }

    self.save = function () {
        self.parent.loadingBusy(true);

        var data = {
            DepartmentID: self.parent.stages[0].department().DepartmentID,
            DataCategories_IndividualCategories: self.parent.stages[1].responses().slice()
        };

        data.DataCategories_IndividualCategories.forEach(function (item, idx, arr) {
            arr[idx] = JSON.parse(item);
            arr[idx].DepartmentID = data.DepartmentID;
        });

        $.ajax({
            url: '/api/gdprapi/SaveSurveyPersonalInfoWorkedStage',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function () {
                self.parent.loadingBusy(false);
            },
            error: function (xhr, textStatus, errorThrown) {
                self.parent.loadingBusy(false);
                $.showError(xhr, textStatus, errorThrown);
            }
        });

        return true;
    }
}

var personalInfoStoredStage = function (parent) {
    var self = this;

    self.parent = parent;

    self.stageId = 2;

    self.heading = "Stage 2 of 4 - Where does your department store the personal information they work with?";

    self.subHeading = "Please complete this survey as accurately as you can";

    self.dataStores = self.parent.dataStores;

    self.responses = ko.observableArray([]);

    self.reset = function () {
        self.responses([]);
    }

    self.save = function () {
        self.parent.loadingBusy(true);

        var data = {
            DepartmentID: self.parent.stages[0].department().DepartmentID,
            DataCategories_DataStores: self.parent.stages[2].responses().slice()
        };

        data.DataCategories_DataStores.forEach(function (item, idx, arr) {
            arr[idx] = JSON.parse(item);
            arr[idx].DepartmentID = data.DepartmentID;
        });

        $.ajax({
            url: '/api/gdprapi/SaveSurveyPersonalInfoStoredStage',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function () {
                self.parent.loadingBusy(false);
            },
            error: function (xhr, textStatus, errorThrown) {
                self.parent.loadingBusy(false);
                $.showError(xhr, textStatus, errorThrown);
            }
        });

        return true;
    }
}

var howDoYouCollectStage = function (parent) {
    var self = this;

    self.parent = parent;

    self.stageId = 3;

    self.heading = "Stage 3 of 4 - How do staff in your department collect the personal information they hold?";

    self.subHeading = "Please complete this survey as accurately as you can";

    self.dataSources = self.parent.dataSources;

    self.responses = ko.observableArray([]);

    self.reset = function () {
        self.responses([]);
    }

    self.save = function () {
        self.parent.loadingBusy(true);

        var data = {
            DepartmentID: self.parent.stages[0].department().DepartmentID,
            DataCategories_DataSources: self.parent.stages[3].responses().slice()
        };

        data.DataCategories_DataSources.forEach(function (item, idx, arr) {
            arr[idx] = JSON.parse(item);
            arr[idx].DepartmentID = data.DepartmentID;
        });

        $.ajax({
            url: '/api/gdprapi/SaveSurveyHowDoYouCollectStage',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function () {
                self.parent.loadingBusy(false);
            },
            error: function (xhr, textStatus, errorThrown) {
                self.parent.loadingBusy(false);
                $.showError(xhr, textStatus, errorThrown);
            }
        });
        
        return true;
    }
}

var whoDoYouShareWithStage = function (parent) {
    var self = this;

    self.parent = parent;

    self.stageId = 4;

    self.heading = "Stage 4 of 4 - Who do you share personal information with?";

    self.subHeading = "Please complete this survey as accurately as you can";

    self.partners = self.parent.partners;

    self.reset = function () {
        self.partners().forEach(function (p) {
            p.reset();
        });

        self.partners([]);

        self.errors.showAllMessages(false);
    }

    self.errors = ko.validation.group([
        self.partners
    ], {
        deep: true,
        live: true
    });

    self.save = function () {
        if (self.errors().length > 0) {
            self.errors.showAllMessages(true);
            return false;
        } else {

            var data = {
                DepartmentID: self.parent.stages[0].department().DepartmentID
            };

            var partnerShareInfo = Enumerable.From(viewModel.stages[4].partners()).Select("{ SupplierID: $.partner.SupplierID, CategoriesSharedWith: $.categoriesSharedWith() }").ToArray();

            var shares = [];

            partnerShareInfo.forEach(function (psi) {
                psi.CategoriesSharedWith.forEach(function (cat) {
                    shares.push({
                        DepartmentID: data.DepartmentID,
                        DataCategoryID: cat.DataCategoryID,
                        SupplierID: psi.SupplierID,
                        DataTransmissionMethodID: cat.DataTransmissionMethod().DataTransmissionMethodID
                    })
                });
            });

            data.DataCategories_Suppliers_DataTransmissionMethods = shares;

            console.log(data);

            self.parent.loadingBusy(true);
            $.ajax({
                url: '/api/gdprapi/SaveSurveyWhoDoYouShareWithStage',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function () {
                    self.parent.loadingBusy(false);
                },
                error: function (xhr, textStatus, errorThrown) {
                    self.parent.loadingBusy(false);
                    $.showError(xhr, textStatus, errorThrown);
                }
            });

            return true;
        }
    }
}

var thankYouStage = function () {
    var self = this;

    self.stageId = 5;

    self.heading = "Thank you for completing the GDPR Survey."

    self.subHeading = "";
}

var Partner = function (p, categories, dataTransmissionMethods) {
    var self = this;

    self.partner = p;

    self.SupplierID = p.SupplierID;
    self.Name = ko.observable(p.Name);
    self.SupplierCategory = ko.observable(p.SupplierCategory);
    self.ContactName = ko.observable(p.ContactName);
    self.ContactEmail = ko.observable(p.ContactEmail);
    self.ContactPhone = ko.observable(p.ContactPhone);
    self.MertexReference = ko.observable(p.MertexReference);

    // this does a neat trick: the checkboxes for this partner's data categories are bound
    // to this observable array; their checkedValue is an object providing both their DataCategoryID
    // and an observable to hold their DataTransmissionMethod: { DataCategoryID: #, DataTransmissionMethod: f }
    self.categoriesSharedWith = ko.observableArray([]);

    self.categoriesSharedWith.subscribe(function (newValues) {
        newValues.forEach(function (cat) {
            if (!ko.validation.utils.isValidatable(cat.DataTransmissionMethod)) {
                cat.DataTransmissionMethod.extend({
                    required: {
                        params: true,
                        message: 'Please specify'
                    }
                });
            }
        });
    }, self);


    self.categoriesSharedWith.subscribe(function (changes) {
        changes.forEach(function (change) {
            if (change.status == 'deleted') {
                change.value.DataTransmissionMethod(undefined);
            }
        });
    }, null, 'arrayChange');


    // must be shared by all partners so that additions appear for each
    self.categories = categories;

    // must be shared by all partners so that additions appear for each
    self.dataTransmissionMethods = dataTransmissionMethods;

    self.reset = function () {
        self.categoriesSharedWith([]);
    }
}