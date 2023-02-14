class formFactory {
    constructor() {

    }

    static createForm = (formJson, dataJson) => {
        let model = formViewModel(formJson);

        model.panels().forEach(p => {
            p.loadRows(dataJson.find(dj => dj.schema == p.schemaName && dj.table == p.tableName));
        });

        model.errors = new ko.validation.group(model.panels().flatMap(p => [...p.fields().flatMap(f => [f.value])]));

        return model;
    }
}

const formViewModel = ((definition) => {
    let self = Object.assign(definition, {
        ready: ko.observable(false)
    });

    //#region Properties

    // this is no longer true: the number of panels depends upon the number of rows presented by data for the form.
    // so... do we even bother initialising the first panel...? no: the form contains the panel definition.
    // but *not always*.
    // design has two distinct panels: Maintenance.Design and Maintenance.Classification
    // both must exist and both get a row each from the data json.
    self.panels = ko.observableArray(self.panels.map(p => panelViewModel(p, self)));

    //#endregion


    //#region Computeds

    self.isInvalid = ko.pureComputed(() => {
        return self.errors().length;
    }, self);

    //#endregion


    //#region Components

    self.errors = new ko.validation.group([]);

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions

    self.getField = (id) => self.panels().flatMap(p => {
        let f = p.fields().find(f => f.fieldId == id);
        if (f) {
            return [f];
        } else {
            return [];
        }
    })[0];
    
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
        self.panels().filter(p => p.validateNow(true));

        if (self.isValid()) {
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
        let result = [];

        self.panels().flatMap(p => {
            let self = p;
            let panel = {
                schema: self.schemaName,
                table: self.tableName,
                panelId: self.panelId,
                row: {}
            };
            self.fields().flatMap(f => {
                if (f.hasOwnProperty('postable') && f.postable) {
                    panel.row[f.fieldName] = ko.unwrap(f.value);
                }
            });
            result.push(panel);
        });

        return { json: JSON.stringify(result) };
    }

    self.toJSON = () => JSON.stringify(self.toJS());

    //#endregion


    //#region Events

    self.init = () => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
            container: 'body'
        }));
        self.ready(true);
    }

    //#endregion

    return self;
});