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

function renderDate(date) {
    //  /[^0-9]/g, ''       strips anything non-numeric (this handles the outdated microsoft format /Date123453245/)
    if (date) {
        if (date.toString().indexOf('Date') > -1)
            return (date ? moment(new Date(parseFloat(date.toString().replace(/[^0-9]/g, '')))).format("DD/MM/YYYY") : null);
        else
            return moment(date).format("DD/MM/YYYY");
    } else {
        return null;
    }
}

function renderDateTime(date) {
    if (date) {
        if (date.toString().indexOf('Date') > -1)
            return (date ? moment(new Date(parseFloat(date.toString().replace(/[^0-9]/g, '')))).format("HH:mm DD/MM/YYYY") : null);
        else
            return moment(date).format("HH:mm DD/MM/YYYY");
    } else {
        return null;
    }
}

function renderMonthYear(date) {
    if (date) {
        if (date.toString().indexOf('Date') > -1)
            return (date ? moment(new Date(parseFloat(date.toString().replace(/[^0-9]/g, '')))).format("MMMM YYYY") : null);
        else
            return moment(date).format("MMMM YYYY");
    } else {
        return null;
    }
}

function renderFullDate(date) {
    if (date) {
        if (date.toString().indexOf('Date') > -1)
            return (date ? moment(new Date(parseFloat(date.toString().replace(/[^0-9]/g, '')))).format("dddd Do MMMM YYYY") : null);
        else
            return moment(date).format("dddd Do MMMM YYYY");
    } else {
        return null;
    }
}

function formatNumber(value, digits, culture) {
    var formatter = new Intl.NumberFormat(
        culture, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });

    return formatter.format(value);
}

function formatNumberBounded(value, digits, min, max, culture) {

    // argh, need a parseable number so that I can bounds it before culturing it


    var formatter = new Intl.NumberFormat(
        culture, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,

    });

    return formatter.format(value);
}

function formatCurrency(value, digits, culture, currency, html) {
    if (value == null)
        return value;

    if (currency === 'E')
        currency = 'GBP'; // Because Export Sterling. Because the finance department were a law unto themselves years ago and ended up inventing a currency code.

    var result = new Intl.NumberFormat(culture, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    }).format(value);

    // Nope, this buggered stuff up all over the place
    //result = result.replace(/\$/gm, '<span class="open-sans-inflated-dollar-glyph">$</span>')

    //// 2. Reorder or manipulate parts
    //// Example: Force symbol to front, removing any extra whitespace
    //let formatted = '';
    //let symbol = '';
    //let body = '';

    //parts.forEach(({ type, value }) => {
    //    if (type === 'currency') {
    //        symbol = value;
    //    } else {
    //        body += value;
    //    }
    //});

    //let result = `${symbol} ${body.trim()}`;

    //// Force format: Symbol + Value
    //if (typeof html === 'undefined') {
    //    return result;
    //} else if (html) {
    //    if (symbol === '$') {
    //        result = `<span class="open-sans-inflated-dollar-glyph">${symbol}</span> ${body.trim()}`;
    //    }
    //}

    return result;
}

function formatPercentage(value, digits, culture) {
    if (value == null)
        return value;

    var formatter = new Intl.NumberFormat(culture, {
        style: 'percent',
        maximumFractionDigits: digits
    });

    return formatter.format(value);
}

function formatPercentageHtmlColourSpan(value, digits, culture) {
    var formatter = new Intl.NumberFormat('en-GB', {
        style: 'percent',
        maximumFractionDigits: digits
    });

    if (value >= 0) {
        return "<span>" + formatter.format(value) + "</span>";
    } else {
        return "<span class='red-text'>" + formatter.format(value) + "</span>";
    }
}

function formatPercentageHtmlColourSpanReversed(value, digits, culture) {
    var formatter = new Intl.NumberFormat('en-GB', {
        style: 'percent',
        maximumFractionDigits: digits
    });

    if (value <= 0) {
        return "<span>" + formatter.format(value) + "</span>";
    } else {
        return "<span class='red-text'>" + formatter.format(value) + "</span>";
    }
}
