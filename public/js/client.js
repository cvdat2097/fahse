// product-list

// Request a page base on pageIndex
function requestProductListByPageIndex(pageIndex) {
    var http = new XMLHttpRequest();
    http.open("GET", "?currentPage=" + pageIndex.toString() + "&ajax=true", true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(this.responseText, "text/xml");


            document.getElementById('product-list-page').innerHTML = this.response;

        }
    }

    http.send();
}

// Search bar
function Search() {
    var keyword = document.getElementById("search-textinput").value;
    window.location = '/product-list.html?keyword=' + keyword;
}
function SearchWhenPressEnter(e) {
    if (e.keyCode == 13) {
        Search();
    }
}

// ================ CART ============
function GetCart() {
    var http = new XMLHttpRequest();
    http.open("GET", "/cart.html", true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('cart-form').innerHTML = this.response;
        }
    }

    http.send();
}

function removeCartItem(index) {
    var http = new XMLHttpRequest();
    http.open("GET", "/cart.html?type=removeCartItem&itemIndex=" + index.toString(), true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.response == 'true') {
                console.log('Xoa thanh cong');
            } else {
                console.log('Xoa khong thanh cong');
            }

            GetCart();
        }
    }

    http.send();
}

function addItemToCart(productID, quantity, color, size) {
    var http = new XMLHttpRequest();
    http.open("GET", "/cart.html?type=addItemToCart&productID=" + productID.toString() +
        "&quantity=" + quantity.toString() + "&color=" + color + "&size=" + size, true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.response == 'true') {
                console.log('Them thanh cong');
            } else {
                console.log('Them khong thanh cong');
            }

            GetCart();
        }
    }
    http.send();
}

function addItemToCartOnProductDetailPage(productID) {
    var color = document.getElementById("product-color").value;
    var quantity = document.getElementById("product-quantity").value;
    var size = document.getElementById("product-size").value;

    addItemToCart(productID, quantity,color,size);
    alert("Thêm sản phẩm vào giỏ thành công");
}