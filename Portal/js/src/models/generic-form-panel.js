const panelViewModel = ((definition, parent) => {

    let self = Object.assign(definition, {
        originalDefinition: JSON.stringify(definition),
        parent: parent
    });

    //#region Properties

    self.validateNow = ko.observable(false);

    self.fields = ko.observableArray((self.fields ?? []).map(f => fieldFactory.createField(f, self)));

    //#endregion


    //#region Components

    self.errors = new ko.validation.group(self.fields().flatMap(f => [f.value]));

    //#endregion


    //#region Computeds

    self.isInvalid = ko.pureComputed(() => {
        return self.errors().length;
    }, self);

    self.visibleFields = ko.computed(() => self.fields().filter(f => f.fieldTypeId > 0), self);

    //#endregion

    //#region Subscriptions



    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions

    self.loadRows = (json) => {
        if (json) {
            for (let i = 0; i < json.row.length; i++) {
                // we always already have at least one panel defined by the form definition itself
                if (i == 0) {
                    self.loadRow(json.row[i]);
                }
                // however data comes along and might go "oi, I've got multiple rows here..." in which case we need a panel per row.
                else {
                    let nextDefinition = JSON.parse(self.originalDefinition);
                    let nextDefinitionPanelIdSplit = nextDefinition.panelId.split('-');
                    let thisPanelId = i + 1;

                    nextDefinitionPanelIdSplit.pop();

                    nextDefinition.fields.forEach(f => {
                        let fieldIdSplit = f.fieldId.split('-');
                        fieldIdSplit[3] = thisPanelId;
                        f.fieldId = fieldIdSplit.join('-');
                    });

                    nextDefinition.panelId = `${nextDefinitionPanelIdSplit.join('-')}-${thisPanelId}`;

                    let nextPanel = panelViewModel(nextDefinition, self.parent);

                    nextPanel.loadRow(json.row[i]);

                    self.parent.panels.push(nextPanel);
                }
            }
        }
    }

    self.loadRow = (json) => {
        Object.keys(json).forEach(k => {
            let f = self.fields().find(f => f.fieldName.toLowerCase() == k.toLowerCase());
            if (f) {
                f.value(json[k]);
                f.originalValue(f.value());
            }
        });
    }

    self.isValid = () => {
        if (self.errors().length) {
            self.errors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
            return false;
        } else {
            return true;
        }
    }

    self.submit = () => {

        self.validateNow(true);

        if (self.isValid()) {

            console.log('Calling saveGenericForm with', self.toJS());

            fetch('/api/productMaintenanceApi/SaveGenericForm', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: self.toJSON()
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.trace(data);
                    let success = data.Success;
                    if (success) {
                        let summary = document.createElement('div');
                        ko.renderTemplate('change-summary-template', data.ChangeSummary, {}, summary);
                        window.showInfo('Success', `Form saved successfully<br/><br/>${summary.innerHTML}`, () => {

                        });
                    } else {
                        window.showInfo('Sorry', data.ErrorMessage);
                    }
                })
                .catch(err => window.catchFetchError)
        }
    }

    self.toJS = () => {
        let result = {
            schema: self.schemaName,
            table: self.tableName,
            panelId: self.panelId,
            row: {}
        };

        self.fields().flatMap(f => {
            if (f.hasOwnProperty('postable') && f.postable) {
                result.row[f.fieldName] = ko.unwrap(f.value);
            }
        });

        console.log('toJS called', result);

        return { json: JSON.stringify([result]) };
    }

    self.toJSON = () => JSON.stringify(self.toJS());

    //#endregion


    //#region Events



    //#endregion

    return self;
});