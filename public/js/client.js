// product-list

// Request a page base on pageIndex
function requestProductListByPageIndex(pageIndex) {
    var http = new XMLHttpRequest();
    http.open("GET", "?currentPage=" + pageIndex.toString()+"&ajax=true", true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(this.responseText, "text/xml");


            document.getElementById('product-list-page').innerHTML = this.response;

        }
    }

    http.send();
}