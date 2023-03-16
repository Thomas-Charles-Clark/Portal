window.assignVisibilityCallback = (ele, cb) => {
    var options = {
        root: null//document.documentElement
    }

    var observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            cb(entry.intersectionRatio > 0);
        });
    }, options);

    observer.observe(ele);
}