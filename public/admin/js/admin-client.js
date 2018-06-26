// ================ PRODUCT page
function SendDataToProductModal(modal, rowid) {
    // Get data from row
    var name = document.querySelector("#" + rowid + " .product-name a").innerHTML;
    var price = document.querySelector("#" + rowid + " .product-price").innerHTML;
    var color = document.querySelector("#" + rowid + " .product-color").innerHTML;
    var size = document.querySelector("#" + rowid + " .product-size").innerHTML;
    var view = document.querySelector("#" + rowid + " .product-view").innerHTML;
    var _id = document.querySelector("#" + rowid + " .product-_id").innerHTML;
    var description = document.querySelector("#" + rowid + " .product-description").innerHTML;
    var images = document.querySelector("#" + rowid + " .product-images").innerHTML;
    var category = document.querySelector("#" + rowid + " .product-category").innerHTML;

    switch (modal) {
        case 'modalDelete':
            document.getElementById("modalDeleteProductID").innerHTML = name;

            document.getElementById("modalDeleteComfirmButton").onclick = RemoveProduct.bind({ productID: _id });
            break;

        case 'modalUpdate':
            document.getElementById("modalUpdateName").value = name;
            document.getElementById("modalUpdatePrice").value = price;
            document.getElementById("modalUpdateDescription").value = description;
            document.getElementById("modalUpdateSize").value = size;
            document.getElementById("modalUpdateColor").value = color;
            document.getElementById("modalUpdateImages").value = images;
            document.getElementById("modalUpdateCategory").value = category;

            document.getElementById("modalUpdateComfirmButton").onclick = UpdateProduct.bind({
                productID: _id
            });
            break;
    }
}

function RefreshProductPage() {
    var http = new XMLHttpRequest();
    http.open("GET", "product.html?ajax=true&type=updatepage", true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("body-content").innerHTML = this.response;
        }
    }
    http.send();
}

function RemoveProduct() {
    var productID = this.productID;
    var http = new XMLHttpRequest();
    http.open("POST", "product.html", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.response == 'true') {
                console.log('Xoa thanh cong');
                RefreshProductPage();
            } else {
                console.log('Xoa khong thanh cong');
            }
        }
    }
    http.send("ajax=true&type=deleteproduct&id=" + productID.toString());
}

function UpdateProduct() {
    var productID = this.productID;
    var name = document.getElementById('modalUpdateName').value;
    var price = document.getElementById('modalUpdatePrice').value;
    var description = document.getElementById('modalUpdateDescription').value;
    var color = document.getElementById('modalUpdateColor').value;
    var size = document.getElementById('modalUpdateSize').value;
    var images = document.getElementById('modalUpdateImages').value;

    var http = new XMLHttpRequest();
    http.open("POST", "product.html", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.response == 'true') {
                console.log('Cap nhat thanh cong');
                RefreshProductPage();
            } else {
                console.log('Cap nhat khong thanh cong');
            }
        }
    }
    http.send("ajax=true&type=updateproduct&id=" + productID.toString() +
        "&price=" + price +
        "&description=" + description +
        "&name=" + name +
        "&color=" + color +
        "&size=" + size +
        "&images=" + images);
}

function AddProduct() {
    var name = document.getElementById('modalAddName').value;
    var price = document.getElementById('modalAddPrice').value;
    var description = document.getElementById('modalAddDescription').value;
    var color = document.getElementById('modalAddColor').value;
    var size = document.getElementById('modalAddSize').value;
    var images = document.getElementById('modalAddImages').value;

    var http = new XMLHttpRequest();
    http.open("POST", "product.html", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.response == 'true') {
                console.log('Them thanh cong');
                RefreshProductPage();
            } else {
                console.log('Them khong thanh cong');
            }
        }
    }
    http.send("ajax=true&type=addproduct" +
        "&price=" + price +
        "&description=" + description +
        "&name=" + name +
        "&color=" + color +
        "&size=" + size +
        "&images=" + images);
}


// ================ USER page
function SendDataToUserModal(modal, rowid) {
    // Get data from row
    var _id = document.querySelector("#" + rowid + " .user-_id").innerHTML;
    var name = document.querySelector("#" + rowid + " .user-name").innerHTML;
    var username = document.querySelector("#" + rowid + " .user-username").innerHTML;
    var type = document.querySelector("#" + rowid + " .user-type").innerHTML;
    var phone = document.querySelector("#" + rowid + " .user-phone").innerHTML;
    var address = document.querySelector("#" + rowid + " .user-address").innerHTML;
    switch (modal) {
        case 'modalDelete':
            document.getElementById("modalDeleteUsername").innerHTML = username;

            document.getElementById("modalDeleteComfirmButton").onclick = RemoveUser.bind({ userID: _id });
            break;

        case 'modalUpdate':
            document.getElementById("modalUpdateName").value = name;
            document.getElementById("modalUpdatePhone").value = phone;
            document.getElementById("modalUpdateAddress").value = address;
            document.getElementById("modalUpdateType").value = type;

            document.getElementById("modalUpdateComfirmButton").onclick = UpdateUser.bind({
                username: username,
                name: name,
                phone: phone,
                address: address,
                type: type
            });
            break;
    }
}

function RefreshUserPage() {
    var http = new XMLHttpRequest();
    http.open("GET", "user.html?ajax=true&type=updatepage", true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("body-content").innerHTML = this.response;
        }
    }
    http.send();
}

function RemoveUser() {
    var userID = this.userID;
    var http = new XMLHttpRequest();
    http.open("POST", "user.html", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.response == 'true') {
                console.log('Xoa thanh cong');
                RefreshUserPage();
            } else {
                console.log('Xoa khong thanh cong');
            }
        }
    }
    http.send("ajax=true&type=deleteuser&id=" + userID.toString());
}

function UpdateUser() {
    var username = this.username;
    var name = document.getElementById('modalUpdateName').value;
    var phone = document.getElementById('modalUpdatePhone').value;
    var address = document.getElementById('modalUpdateAddress').value;
    var type = document.getElementById('modalUpdateType').value;
    console.log(type);

    var http = new XMLHttpRequest();
    http.open("POST", "user.html", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.response == 'true') {
                console.log('Cap nhat thanh cong');
                RefreshUserPage();
            } else {
                console.log('Cap nhat khong thanh cong');
            }
        }
    }
    http.send("ajax=true&type=updateuser&username=" + username.toString() +
        "&name=" + name +
        "&phone=" + phone +
        "&usertype=" + type +
        "&address=" + address);
}

// ================ ORDER page
function SendDataToOrderModal(modal, rowid) {
    // Get data from row
    var _id = document.querySelector("#" + rowid + " .order-_id").innerHTML;
    var status = document.querySelector("#" + rowid + " .order-status").value;
    
    switch (modal) {
        case 'modalDelete':
            document.getElementById("modalDeleteOrderid").innerHTML = _id;

            document.getElementById("modalDeleteComfirmButton").onclick = RemoveOrder.bind({ orderID: _id });
            break;

        case 'modalUpdate':
            document.getElementById("modalUpdateComfirmButton").onclick = UpdateOrder.bind({
                orderID: _id,
                status: status
            });
            break;
    }
}


function RefreshOrderPage() {
    var http = new XMLHttpRequest();
    http.open("GET", "order.html?ajax=true&type=updatepage", true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("body-content").innerHTML = this.response;
        }
    }
    http.send();
}

function RemoveOrder() {
    var orderID = this.orderID;
    var http = new XMLHttpRequest();
    http.open("POST", "order.html", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.response == 'true') {
                console.log('Xoa thanh cong');
                RefreshOrderPage();
            } else {
                console.log('Xoa khong thanh cong');
            }
        }
    }
    http.send("ajax=true&type=deleteorder&id=" + orderID.toString());
}

function UpdateOrder() {
    var _id = this.orderID;
    var status = this.status;
    
    var http = new XMLHttpRequest();
    http.open("POST", "order.html", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.response == 'true') {
                console.log('Cap nhat thanh cong');
                RefreshOrderPage();
            } else {
                console.log('Cap nhat khong thanh cong');
            }
        }
    }
    http.send("ajax=true&type=updateorder&_id=" + _id.toString() +
        "&status=" + status);
}

function ChangeElementValue(value) {
    this.value = value;
}