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
window.centerConfirmModal = () => {
    window.confirmModal.querySelector('.modal-dialog').classList.add('modal-dialog-centered');
    window.confirmModal.addEventListener('hidden.bs.modal', () => {
        window.confirmModal.querySelector('.modal-dialog').classList.remove('modal-dialog-centered');
    }, {
        once: true
    })
}

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
window.centerInfoModal = () => {
    window.infoModal.querySelector('.modal-dialog').classList.add('modal-dialog-centered');
    window.infoModal.addEventListener('hidden.bs.modal', () => {
        window.infoModal.querySelector('.modal-dialog').classList.remove('modal-dialog-centered');
    }, {
        once: true
    })
}

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
window.showError = (message = null) => {
    if (message) {
        window.errorModalInstance.__storedContents = window.errorModal.querySelector('.modal-body').innerHTML;
        window.errorModal.querySelector('.modal-body').innerHTML = `<p class="mb-0">${message}</p>`
        window.errorModal.addEventListener('hidden.bs.modal', (e) => {
            window.errorModal.querySelector('.modal-body').innerHTML = window.errorModalInstance.__storedContents;
        }, {
            once: true
        });
    }
    window.errorModalInstance.show();
};
window.hideError = () => {
    window.errorModalInstance.hide();
};

// Thanks to: https://stackoverflow.com/questions/19305821/multiple-modals-overlay
document.addEventListener('show.bs.modal', function (event) {
    if (typeof Enumerable === 'undefined') {
        var self = event.target;

        var zIndex = 1040 + (10 * document.querySelectorAll('.modal.show').length);

        var adj = 0;

        document.querySelectorAll('.modal.show').forEach(function (i, ele) {
            if (+ele.style.zIndex >= zIndex) {
                adj++;
            }
        });

        zIndex += adj * 10;

        console.log(self.id + ' showing at', zIndex);

        self.style.zIndex = zIndex;

        window.setTimeout(function () {
            console.log(self.id + ' backdrop showing at', zIndex - 1);
            let backdropNodes = document.querySelectorAll('.modal-backdrop:not(.modal-stack)');
            let backdrops = [];
            backdropNodes.forEach(bd => {
                backdrops.push(bd);
            })
            if (backdrops.length) {
                backdrops[backdrops.length - 1].style.zIndex = zIndex - 1;
                backdrops[backdrops.length - 1].classList.add('modal-stack');
            }
        }, 0);
    } else {
        self = event.target;

        let zIndex = 1040;

        let openModals = [];

        document.querySelectorAll('.modal.show').forEach(n => {
            if (n != self) {
                openModals.push(n);
            }
        })

        if (openModals.length) {
            zIndex = Enumerable.From(openModals).Select(function (x) {
                return +(x.style.zIndex);
            }).Max() + 10;
        }
        console.log(self.id + ' showing at', zIndex);

        self.style.zIndex = zIndex;

        window.setTimeout(function () {
            console.log(self.id + ' backdrop showing at', zIndex - 1);
            let backdropNodes = document.querySelectorAll('.modal-backdrop:not(.modal-stack)');
            let backdrops = [];
            backdropNodes.forEach(bd => {
                backdrops.push(bd);
            })
            if (backdrops.length) {
                backdrops[backdrops.length - 1].style.zIndex = zIndex - 1;
                backdrops[backdrops.length - 1].classList.add('modal-stack');
            }
        }, 0);
    }
});

document.addEventListener('hidden.bs.modal', function (event) {
    document.querySelectorAll('.modal.show').length && document.body.classList.add('modal-open');
});