/*
 Confirm Modal
 */
window.confirmModal = document.querySelector('#confirm-modal');
window.confirmModalInstance = bootstrap.Modal.getOrCreateInstance(window.confirmModal);
window.onConfirmModalShow = [];
window.confirmModal.addEventListener('show.bs.modal', function (event) {
    window.onConfirmModalShow.forEach((f) => {
        if (f instanceof Function)
            f();
    });
});
window.onConfirmModalShown = [];
window.confirmModal.addEventListener('shown.bs.modal', function (event) {
    window.onConfirmModalShown.forEach((f) => {
        if (f instanceof Function)
            f();
    });
});
window.onConfirmModalHide = [];
window.confirmModal.addEventListener('hide.bs.modal', function (event) {
    window.onConfirmModalHide.forEach((f) => {
        if (f instanceof Function)
            f();
    });
});
window.onConfirmModalHidden = [];
window.confirmModal.addEventListener('hidden.bs.modal', function (event) {
    window.onConfirmModalHidden.forEach((f) => {
        if (f instanceof Function)
            f();
    });
});
window.showConfirm = (title, message, confirm, reject) => {
    document.querySelector('#confirm-modal .modal-title').innerHTML = title;
    document.querySelector('#confirm-modal .modal-body').innerHTML = message;
    window.confirmModalInstance.confirmFn = (() => {
        typeof confirm === 'function' ? confirm() : null;
        window.confirmModalInstance.hide();
    });
    window.confirmModalInstance.rejectFn = (() => {
        typeof reject === 'function' ? reject() : null;
        window.confirmModalInstance.hide();
    });
    window.confirmModalInstance.show();
};
window.hideConfirm = () => {
    window.confirmModalInstance.hide();
};

/*
 Info Modal
 */
window.infoModal = document.querySelector('#info-modal');
window.infoModalInstance = bootstrap.Modal.getOrCreateInstance(window.infoModal);
window.onInfoModalShow = [];
window.infoModal.addEventListener('show.bs.modal', function (event) {
    window.onInfoModalShow.forEach((f) => {
        if (f instanceof Function)
            f();
    });
});
window.onInfoModalShown = [];
window.infoModal.addEventListener('shown.bs.modal', function (event) {
    window.onInfoModalShown.forEach((f) => {
        if (f instanceof Function)
            f();
    });
});
window.onInfoModalHide = [];
window.infoModal.addEventListener('hide.bs.modal', function (event) {
    window.onInfoModalHide.forEach((f) => {
        if (f instanceof Function)
            f();
    });
});
window.onInfoModalHidden = [];
window.infoModal.addEventListener('hidden.bs.modal', function (event) {
    window.onInfoModalHidden.forEach((f) => {
        if (f instanceof Function)
            f();
    });
});
window.showInfo = (title, message, close) => {
    document.querySelector('#info-modal .modal-title').innerHTML = title;
    document.querySelector('#info-modal .modal-body').innerHTML = message;
    window.infoModalInstance.closeFn = (() => {
        typeof close === 'function' ? close() : null;
        window.infoModalInstance.hide();
    });
    window.infoModalInstance.show();
};
window.hideInfo = () => {
    window.infoModalInstance.hide();
};


/*
 Error Modal
 */

window.errorModal = document.querySelector('#error-modal');
window.errorModalInstance = bootstrap.Modal.getOrCreateInstance(window.errorModal);
window.onErrorModalShow = [];
window.errorModal.addEventListener('show.bs.modal', function (event) {
    window.onErrorModalShow.forEach((f) => {
        if (f instanceof Function)
            f();
    });
});
window.onErrorModalShown = [];
window.errorModal.addEventListener('shown.bs.modal', function (event) {
    window.onErrorModalShown.forEach((f) => {
        if (f instanceof Function)
            f();
    });
});
window.onErrorModalHide = [];
window.errorModal.addEventListener('hide.bs.modal', function (event) {
    window.onErrorModalHide.forEach((f) => {
        if (f instanceof Function)
            f();
    });
});
window.onErrorModalHidden = [];
window.errorModal.addEventListener('hidden.bs.modal', function (event) {
    window.onErrorModalHidden.forEach((f) => {
        if (f instanceof Function)
            f();
    });
});
window.showError = () => {
    window.errorModalInstance.show();
};
window.hideError = () => {
    window.errorModalInstance.hide();
};