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
            UpdateCheckoutPage();
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

    addItemToCart(productID, quantity, color, size);
    alert("Thêm sản phẩm vào giỏ thành công");
}



// ==================== CHECKOUT ====================
function UpdateCheckoutPage() {
    var http = new XMLHttpRequest();
    http.open("GET", "/checkout.html?ajax=true", true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var x = document.getElementById('cart-item-list');
            if (x != null) {
                x.innerHTML = this.response;
            }
        }
    }
    http.send();
}

function Order() {
    var http = new XMLHttpRequest();

    var phone = document.getElementById("checkout-phone").value;
    var address = document.getElementById("checkout-address").value;
    var name = document.getElementById("checkout-name").value;
    var note = document.getElementById("checkout-note").value;

    http.open("GET", "/checkout.html?ajax=true&type=order&phone=" + phone.toString() + "&address=" + address.toString() +
        "&name=" + name.toString() + "&note=" + note.toString(), true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.response == 'true') {
                alert("Đặt hàng thành công")
            } else if (this.response == 'chuadangnhap') {
                alert("Vui lòng đăng nhập để đặt hàng");
            } else {
                alert("Không thể đặt hàng. Vui lòng thử lại sau");
            }
        }
    }

    http.send();
}


function UpdateCheckoutCart() {
    var itemID = document.querySelectorAll(".item-productid");
    var itemQuantity = document.querySelectorAll(".item-productquantity");


    for (var i = 0; i < itemID.length; i++) {
        var http = new XMLHttpRequest();
        http.open("GET", "/checkout.html/updatecart/?productID=" + itemID[i].innerHTML.toString() +
            "&quantity=" + itemQuantity[i].value.toString() +
            "&itemIndex=" + i.toString(), true);
        http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.response);
            }
        }
        console.log("sent");
        http.send();
    }
}

// ==================== PRODUCT ====================
function PostComment(productID) {
    var content = document.getElementById('comment-content').value;
    var user = document.getElementById('comment-username').value;

    if (user == "" || user == undefined || content=="" || content==undefined) {
        window.alert('Vui lòng nhập tên và nội dung bình luận');
    } else {
        var http = new XMLHttpRequest();        
        http.open("POST", "/product.html/comment", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (this.response == 'true') {
                    console.log('Da them binh luan');
                } else {
                    console.log('ERR: Khong the them binh luan');
                }
            }
        }
        http.send("user=" + user.toString() + "&content=" + content.toString() + "&productID=" + productID.toString());
        document.getElementById('comment-content').value = "";
    }
}