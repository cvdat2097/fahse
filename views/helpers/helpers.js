module.exports = {
    ifeq: function (a, b, options) {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    paginate: function (nPage, currentPage) {
        var hrefAttribute;
        var accum = '';
        for (var i = 1; i <= nPage; ++i) {
            hrefAttribute = "/product-list.html?currentPage=" + i.toString();
            if (i == currentPage) {
                accum += '<button onclick="requestProductListByPageIndex(' + i + ')" class="item-pagination flex-c-m trans-0-4 active-pagination">' + i.toString() + '</button>'
            } else {
                accum += '<button onclick="requestProductListByPageIndex(' + i + ')" class="item-pagination flex-c-m trans-0-4">' + i.toString() + '</button>'
            }
        }
        return accum;
    }
}