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
function checkMail(email) {
  var warningText = document.getElementById("warning");
	var http = new XMLHttpRequest();
	http.open("GET", "/register.html/checkemail?email=" + email.toString(), true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
              if (this.response == 'false') {
                  warningText.innerHTML = "Email không  hợp lệ";
              }
        }
    }
	http.send();
}
function isPhoneNumber(username, password, name, email, phone, address) {
    var warningText = document.getElementById("warning");
	var http = new XMLHttpRequest();
	http.open("GET", "/register.html/checkphonenumber?phone=" + phone.toString(), true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
                if (this.response == 'true') {
                  warningText.innerHTML = "";
                  registerUser(username, password, name, email, phone, address);
                } else {
                  warningText.innerHTML = "Số điện thoại không  hợp lệ";
                }
        }
    }
	http.send();
}
function registerUser(username, password, name, email, phone, address) {
	var http = new XMLHttpRequest();
  var warningText = document.getElementById("warning");
	http.open("GET", "/register.html/registerUser?type=customer&username=" +  username.toString() + "&password=" + password.toString() + "&name=" + name.toString() + "&email=" + email.toString() + "&phone=" + phone.toString() + "&address=" + address.toString(), true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
                if (this.response == 'true') {
                  alert("Đăng kí thành công");
                }
                else {
                  alert("Không thể đăng kí. Vui lòng thử lại sau");
                }
        }
    }
	http.send();
}

function checkInforRegister(username, password, name, email, phone, address, verifypassword) {
  var warningText = document.getElementById("warning");
  if (name == "") {
    warningText.innerHTML = "Chưa nhập tên";
    return false;
  }
  if (username == "") {
    warningText.innerHTML = "Chưa nhập tên đăng nhập";
    return false;
  }
  if (email == "") {
    warningText.innerHTML = "Chưa nhập email";
    return false;
  }
  if (phone == "") {
    warningText.innerHTML = "Chưa nhập số điện thoại";
    return false;
  }
  if (address == "") {
    warningText.innerHTML = "Chưa nhập địa chỉ";
    return false;
  }
  if (password == "") {
    warningText.innerHTML = "Chưa nhập mật khẩu";
    return false;
  }
  if (password != verifypassword) {
    warningText.innerHTML = "Mật khẩu không khớp";
    return false;
  }
  checkMail(email);
  isPhoneNumber(username, password, name, email, phone, address);
  return true;
}

function checkInforRegister(username, password, name, email, phone, address, verifypassword) {
  var warningText = document.getElementById("warning");
  if (name == "") {
    warningText.innerHTML = "Chưa nhập tên";
    return false;
  }
  if (username == "") {
    warningText.innerHTML = "Chưa nhập tên đăng nhập";
    return false;
  }
  if (email == "") {
    warningText.innerHTML = "Chưa nhập email";
    return false;
  }
  if (phone == "") {
    warningText.innerHTML = "Chưa nhập số điện thoại";
    return false;
  }
  if (address == "") {
    warningText.innerHTML = "Chưa nhập địa chỉ";
    return false;
  }
  if (password == "") {
    warningText.innerHTML = "Chưa nhập mật khẩu";
    return false;
  }
  if (password != verifypassword) {
    warningText.innerHTML = "Mật khẩu không khớp";
    return false;
  }
  checkMail(email);
  isPhoneNumber(username, password, name, email, phone, address);
  return true;
}
function UpdateCheckoutCart() {
    var itemID = document.querySelectorAll(".item-productid");
    var itemQuantity = document.querySelectorAll(".item-productquantity");
    var itemProductID = document.querySelectorAll(".item-productid");

    var dataArray = [];

    for (var i = 0; i < itemID.length; i++) {
        dataArray.push({
            _id: itemProductID[i].innerHTML,
            quantity: itemQuantity[i].value
        })
    }

    for (var i = 0; i < itemID.length; i++) {
        var http = new XMLHttpRequest();
        http.open("POST", "/checkout.html/updatecart/", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.response);
            }
        }
        console.log("sent");
        http.send("?productID=" + itemID[i].innerHTML.toString() +
            "&quantity=" + itemQuantity[i].value.toString() +
            "&itemIndex=" + i.toString() +
            "&data=" + JSON.stringify(dataArray));
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
