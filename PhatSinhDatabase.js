const mongoose = require('mongoose');
const async = require('async');

// Khai bao Schema
const categorySchema = new mongoose.Schema({
    name: String
});

const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: Number,
    description: String,
    size: [String],
    color: [String],
    images: [String],
    view: {
        type: Number,
        default: 0
    },
    nItemSold: {
        type: Number,
        default: 0
    },
    category: mongoose.Schema.ObjectId
});

var userSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    username: String,
    password: String,
    name: String,
    email: String,
    phone: String,
    address: String
});

var orderSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'delivering', 'delivered']
    },
    user: mongoose.Schema.ObjectId,
    productList: {
        type: [String]
    },
    size: [String],
    color: [String],
    note: String,
    recipientName: String,
    address: String,
    phone: String
});

var commentSchema = new mongoose.Schema({
    username: String,
    content: String,
    date: Date
});

// Tao model
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);
const Comment = mongoose.model('Comment', commentSchema);

function CreateUser(type, username, password, name, email, phone, address, callback) {
    User.create({
        type: type,
        username: username,
        password: password,
        name: name,
        email: email,
        phone: phone,
        address: address
    }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("User created");
            callback();
        }
    });
}
function CreateCategory(name, callback) {
    Category.create({
        name: name
    }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Category created");
            callback();
        }
    });
}
function CreateProduct(name, price, description, color, images, category, callback) {
    Product.create({
        name: name,
        price,
        description,
        size: ["S", "M", "L", "XL", "XXL"],
        color,
        images,
        category
    }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Product created");
            callback();
        }
    });
}
function CreateOrder(status, user, productList, size, color, note, recipientName, address, phone, callback) {
    Order.create({
        status: status,
        user: user,
        productList: productList,
        size: size,
        color: color,
        note: note,
        recipientName: recipientName,
        address: address,
        phone: phone
    }, function (err) {
        if (err) {
            //console.log(err);
        } else {
            console.log("Order created");
            callback();
        }
    });
}

// Array
var userList = [];
var categoryList = [];
var productList = [];
var commentList = [];

//Them du lieu vao
async.series([

    function (callback) {
        console.log('Connecting to database...');
        mongoose.connect('mongodb://localhost:27017/shoppingDB', callback);
    },

    function (callback) {
        mongoose.connection.db.dropDatabase(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Database dropped');
                callback();
            }
        });
    },


    // Create users
    function (callback) {
        CreateUser('admin', 'admin', '123', 'Nguyen Van Admin', 'admin@gmail.com', '0123456789', 'Ho Chi Minh City', callback);
    },
    function (callback) {
        CreateUser('customer', 'user1', '123', 'Nguyen Van A', 'nguyenvanA@gmail.com', '+84123456789', 'Ho Chi Minh City', callback);
    },
    function (callback) {
        CreateUser('customer', 'user2', '123', 'Nguyen Van B', 'nguyenvanB@gmail.com', '+84123456789', 'Ho Chi Minh City', callback);
    },
    function (callback) {
        CreateUser('customer', 'user3', '123', 'Nguyen Van C', 'nguyenvanC@gmail.com', '+84123456789', 'Ha Noi', callback);
    },
    function (callback) {
        User.find({}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                userList = result;
                callback();
            }
        })
    },


    // Create Category
    function (callback) {
        CreateCategory("Áo khoác Nam", callback);
    },
    function (callback) {
        CreateCategory("Áo khoác Nữ", callback);
    },

    function (callback) {
        Category.find({}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                categoryList = result;
                callback();
            }
        })
    },


    // Create Product
    function (callback) {
        CreateProduct(
            "Áo Khoác Nữ Adachi Thun X01",
            271946,
            "Áo thun đậm chất nữ tính phù hợp cho các bạn nữ khi ra ngoài",
            ["Đỏ Cam", "Hồng Đậm", "Xanh Trong Trắng"],
            ["images/product/AK_AD_0000_0.jpg", "images/product/AK_AD_0000_1.jpg", "images/product/AK_AD_0000_2.jpg"],
            categoryList[1],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nam Adachi Thun X01",
            278982,
            "Áo thun đậm chất nam tính phù hợp cho các bạn nam khi ra ngoài",
            ["Đen", "Trắng", "Xanh Cổ Vịt"],
            ["images/product/AK_AD_0001_0.jpg", "images/product/AK_AD_0001_1.jpg", "images/product/AK_AD_0001_2.jpg"],
            categoryList[0],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nam Adachi Thun X01",
            278982,
            "Áo thun đậm chất nam tính phù hợp cho các bạn nam khi ra ngoài",
            ["Đen", "Trắng", "Xanh Cổ Vịt"],
            ["images/product/AK_AD_0002_0.jpg", "images/product/AK_AD_0002_1.jpg", "images/product/AK_AD_0002_2.jpg"],
            categoryList[0],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nữ Adachi Thun T01",
            301361,
            "Chất liệu: CVC vảy cá 2 chiều. PE làm tăng độ bền, giữ ấm tốt cho những ngày se lạnh. Cotton sẽ cho cảm giác thoáng và thấm hút tốt. Form áo basic, viền tay áo thiết kế cá tính. Nón rộng, cổ cao, điểm nhấn dây kéo cực chất nới ngực áo.",
            ["Xám Trắng", "Tím Tối", "Xanh Chàm"],
            ["images/product/AK_AD_0003_0.jpg", "images/product/AK_AD_0003_1.jpg", "images/product/AK_AD_0003_2.jpg"],
            categoryList[1],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nữ Adachi Thun ST03",
            292307,
            "Trở lại với xu hướng quân đội, áo khoác lính tinh tế &amp; thời thượng hơn. Thiết kế Unisex, nón rộng cổ cao, bo tay áo. Dành cho cả nam &amp; nữ. Chất liệu: Nỉ cao cấp, dày dặn.",
            ["Xanh Lính", "Đỏ Đen", "Râm Đen"],
            ["images/product/AK_AD_0004_0.jpg", "images/product/AK_AD_0004_1.jpg", "images/product/AK_AD_0004_2.jpg"],
            categoryList[1],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nam Adachi Thun ST03",
            278982,
            "Trở lại với xu hướng quân đội, áo khoác lính tinh tế &amp; thời thượng hơn. Thiết kế Unisex, nón rộng cổ cao, bo tay áo. Dành cho cả nam &amp; nữ. Chất liệu: Nỉ cao cấp, dày dặn.",
            ["Xanh Lính", "Xanh Dương", "Xám Trắng"],
            ["images/product/AK_AD_0005_0.jpg", "images/product/AK_AD_0005_1.jpg", "images/product/AK_AD_0005_2.jpg"],
            categoryList[0],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nữ Adachi Thun T02",
            278982,
            "Chất liệu: CVC vảy cá 2 chiều. PE làm tăng độ bền, giữ ấm tốt cho những ngày se lạnh. Cotton sẽ cho cảm giác thoáng và thấm hút tốt. Form áo basic, viền tay áo thiết kế cá tính. Nón rộng, cổ cao, điểm nhấn dây kéo cực chất nới ngực áo. Đặc biệt nằm trong dòng sản phẩm Adachi, phong cách Unisex phù hợp cho cả nam &amp; nữ.",
            ["Đen", "Xanh Bóng", "Xanh Đen"],
            ["images/product/AK_AD_0006_0.jpg", "images/product/AK_AD_0006_1.jpg", "images/product/AK_AD_0006_2.jpg"],
            categoryList[1],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nam Adachi Thun T01",
            313827,
            "Chất liệu : French Terry 2 chiều nhiều tính năng vượt trội. Vải không chứa formaldehyde (chất đây kích ứng da). Chống tia UV vượt trội. Thiết kế thông minh: nón rộng và cổ cao giúp chống nắng hiệu quả. Sự đặc biệt của thương hiệu Adachi đó chính là những trang phục dành riêng cho couple, được thiết kế riêng với những màu sắc và xu hướng thịnh hành nhất, cho các cặp đôi tự tin diện cùng nhau xuống phố.",
            ["Xanh Ngọc", "Xanh Riêu", "Xám Trắng"],
            ["images/product/AK_AD_0008_0.jpg", "images/product/AK_AD_0008_1.jpg", "images/product/AK_AD_0008_2.jpg"],
            categoryList[0],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nữ Adachi Dù A04",
            278982,
            "Chất liệu: Lớp ngoài chất liệu gió siêu nhẹ, dày dặn, chất mịn, không nhăn. Vải lót mềm, nhẹ, mát, thấm hút mồ hôi. Dây kéo YKK bền , lướt nhẹ. Túi có dây kéo giữ đc đồ cá nhân. Đi mưa nhẹ được. Đặc biệt túi gấp gọn đi theo áo nhẹ tiện dụng cho vào cốp xe máy, túi xách hoặc balo mang đi.",
            ["Xanh Dương", "Xanh Lá Cây", "Xanh Ngọc"],
            ["images/product/AK_AD_0009_0.jpg", "images/product/AK_AD_0009_1.jpg", "images/product/AK_AD_0009_2.jpg"],
            categoryList[1],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nam Adachi Kaki F01",
            278982,
            " Một thiết kế của YaMe với những Slogan hiện đại, kiểu dáng trẻ trung cùng nhiều tính năng nhỏ tiện lợi. Chất liệu kaki với ưu điểm cực bền màu, ít co giãn nên giữ được phom dáng qua thời gian sử dụng khá lâu.",
            ["Cam", "Đen", "Xanh Riêu"],
            ["images/product/AK_AD_0010_0.jpg", "images/product/AK_AD_0010_1.jpg", "images/product/AK_AD_0010_2.jpg"],
            categoryList[0],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nữ Adachi Thun T02",
            278982,
            "Chất liệu: CVC vảy cá 2 chiều. PE làm tăng độ bền, giữ ấm tốt cho những ngày se lạnh. Cotton sẽ cho cảm giác thoáng và thấm hút tốt. Form áo basic, viền tay áo thiết kế cá tính. Nón rộng, cổ cao, điểm nhấn dây kéo cực chất nới ngực áo. Đặc biệt nằm trong dòng sản phẩm Adachi, phong cách Unisex phù hợp cho cả nam &amp; nữ.",
            ["Đen", "Xanh Bóng", "Xanh Đen"],
            ["images/product/AK_AD_0006_0.jpg", "images/product/AK_AD_0006_1.jpg", "images/product/AK_AD_0006_2.jpg"],
            categoryList[1],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nam Adachi Thun T01",
            313827,
            "Chất liệu : French Terry 2 chiều nhiều tính năng vượt trội. Vải không chứa formaldehyde (chất đây kích ứng da). Chống tia UV vượt trội. Thiết kế thông minh: nón rộng và cổ cao giúp chống nắng hiệu quả. Sự đặc biệt của thương hiệu Adachi đó chính là những trang phục dành riêng cho couple, được thiết kế riêng với những màu sắc và xu hướng thịnh hành nhất, cho các cặp đôi tự tin diện cùng nhau xuống phố.",
            ["Xanh Ngọc", "Xanh Riêu", "Xám Trắng"],
            ["images/product/AK_AD_0008_0.jpg", "images/product/AK_AD_0008_1.jpg", "images/product/AK_AD_0008_2.jpg"],
            categoryList[0],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nữ Adachi Dù A04",
            278982,
            "Chất liệu: Lớp ngoài chất liệu gió siêu nhẹ, dày dặn, chất mịn, không nhăn. Vải lót mềm, nhẹ, mát, thấm hút mồ hôi. Dây kéo YKK bền , lướt nhẹ. Túi có dây kéo giữ đc đồ cá nhân. Đi mưa nhẹ được. Đặc biệt túi gấp gọn đi theo áo nhẹ tiện dụng cho vào cốp xe máy, túi xách hoặc balo mang đi.",
            ["Xanh Dương", "Xanh Lá Cây", "Xanh Ngọc"],
            ["images/product/AK_AD_0009_0.jpg", "images/product/AK_AD_0009_1.jpg", "images/product/AK_AD_0009_2.jpg"],
            categoryList[1],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nam Adachi Kaki F01",
            278982,
            " Một thiết kế của YaMe với những Slogan hiện đại, kiểu dáng trẻ trung cùng nhiều tính năng nhỏ tiện lợi. Chất liệu kaki với ưu điểm cực bền màu, ít co giãn nên giữ được phom dáng qua thời gian sử dụng khá lâu.",
            ["Cam", "Đen", "Xanh Riêu"],
            ["images/product/AK_AD_0010_0.jpg", "images/product/AK_AD_0010_1.jpg", "images/product/AK_AD_0010_2.jpg"],
            categoryList[0],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nữ Adachi Thun T02",
            278982,
            "Chất liệu: CVC vảy cá 2 chiều. PE làm tăng độ bền, giữ ấm tốt cho những ngày se lạnh. Cotton sẽ cho cảm giác thoáng và thấm hút tốt. Form áo basic, viền tay áo thiết kế cá tính. Nón rộng, cổ cao, điểm nhấn dây kéo cực chất nới ngực áo. Đặc biệt nằm trong dòng sản phẩm Adachi, phong cách Unisex phù hợp cho cả nam &amp; nữ.",
            ["Đen", "Xanh Bóng", "Xanh Đen"],
            ["images/product/AK_AD_0006_0.jpg", "images/product/AK_AD_0006_1.jpg", "images/product/AK_AD_0006_2.jpg"],
            categoryList[1],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nam Adachi Thun T01",
            313827,
            "Chất liệu : French Terry 2 chiều nhiều tính năng vượt trội. Vải không chứa formaldehyde (chất đây kích ứng da). Chống tia UV vượt trội. Thiết kế thông minh: nón rộng và cổ cao giúp chống nắng hiệu quả. Sự đặc biệt của thương hiệu Adachi đó chính là những trang phục dành riêng cho couple, được thiết kế riêng với những màu sắc và xu hướng thịnh hành nhất, cho các cặp đôi tự tin diện cùng nhau xuống phố.",
            ["Xanh Ngọc", "Xanh Riêu", "Xám Trắng"],
            ["images/product/AK_AD_0008_0.jpg", "images/product/AK_AD_0008_1.jpg", "images/product/AK_AD_0008_2.jpg"],
            categoryList[0],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nữ Adachi Dù A04",
            278982,
            "Chất liệu: Lớp ngoài chất liệu gió siêu nhẹ, dày dặn, chất mịn, không nhăn. Vải lót mềm, nhẹ, mát, thấm hút mồ hôi. Dây kéo YKK bền , lướt nhẹ. Túi có dây kéo giữ đc đồ cá nhân. Đi mưa nhẹ được. Đặc biệt túi gấp gọn đi theo áo nhẹ tiện dụng cho vào cốp xe máy, túi xách hoặc balo mang đi.",
            ["Xanh Dương", "Xanh Lá Cây", "Xanh Ngọc"],
            ["images/product/AK_AD_0009_0.jpg", "images/product/AK_AD_0009_1.jpg", "images/product/AK_AD_0009_2.jpg"],
            categoryList[1],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nam Adachi Kaki F01",
            278982,
            " Một thiết kế của YaMe với những Slogan hiện đại, kiểu dáng trẻ trung cùng nhiều tính năng nhỏ tiện lợi. Chất liệu kaki với ưu điểm cực bền màu, ít co giãn nên giữ được phom dáng qua thời gian sử dụng khá lâu.",
            ["Cam", "Đen", "Xanh Riêu"],
            ["images/product/AK_AD_0010_0.jpg", "images/product/AK_AD_0010_1.jpg", "images/product/AK_AD_0010_2.jpg"],
            categoryList[0],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nữ Adachi Thun T02",
            278982,
            "Chất liệu: CVC vảy cá 2 chiều. PE làm tăng độ bền, giữ ấm tốt cho những ngày se lạnh. Cotton sẽ cho cảm giác thoáng và thấm hút tốt. Form áo basic, viền tay áo thiết kế cá tính. Nón rộng, cổ cao, điểm nhấn dây kéo cực chất nới ngực áo. Đặc biệt nằm trong dòng sản phẩm Adachi, phong cách Unisex phù hợp cho cả nam &amp; nữ.",
            ["Đen", "Xanh Bóng", "Xanh Đen"],
            ["images/product/AK_AD_0006_0.jpg", "images/product/AK_AD_0006_1.jpg", "images/product/AK_AD_0006_2.jpg"],
            categoryList[1],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nam Adachi Thun T01",
            313827,
            "Chất liệu : French Terry 2 chiều nhiều tính năng vượt trội. Vải không chứa formaldehyde (chất đây kích ứng da). Chống tia UV vượt trội. Thiết kế thông minh: nón rộng và cổ cao giúp chống nắng hiệu quả. Sự đặc biệt của thương hiệu Adachi đó chính là những trang phục dành riêng cho couple, được thiết kế riêng với những màu sắc và xu hướng thịnh hành nhất, cho các cặp đôi tự tin diện cùng nhau xuống phố.",
            ["Xanh Ngọc", "Xanh Riêu", "Xám Trắng"],
            ["images/product/AK_AD_0008_0.jpg", "images/product/AK_AD_0008_1.jpg", "images/product/AK_AD_0008_2.jpg"],
            categoryList[0],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nữ Adachi Dù A04",
            278982,
            "Chất liệu: Lớp ngoài chất liệu gió siêu nhẹ, dày dặn, chất mịn, không nhăn. Vải lót mềm, nhẹ, mát, thấm hút mồ hôi. Dây kéo YKK bền , lướt nhẹ. Túi có dây kéo giữ đc đồ cá nhân. Đi mưa nhẹ được. Đặc biệt túi gấp gọn đi theo áo nhẹ tiện dụng cho vào cốp xe máy, túi xách hoặc balo mang đi.",
            ["Xanh Dương", "Xanh Lá Cây", "Xanh Ngọc"],
            ["images/product/AK_AD_0009_0.jpg", "images/product/AK_AD_0009_1.jpg", "images/product/AK_AD_0009_2.jpg"],
            categoryList[1],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nam Adachi Kaki F01",
            278982,
            " Một thiết kế của YaMe với những Slogan hiện đại, kiểu dáng trẻ trung cùng nhiều tính năng nhỏ tiện lợi. Chất liệu kaki với ưu điểm cực bền màu, ít co giãn nên giữ được phom dáng qua thời gian sử dụng khá lâu.",
            ["Cam", "Đen", "Xanh Riêu"],
            ["images/product/AK_AD_0010_0.jpg", "images/product/AK_AD_0010_1.jpg", "images/product/AK_AD_0010_2.jpg"],
            categoryList[0],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nữ Adachi Thun T02",
            278982,
            "Chất liệu: CVC vảy cá 2 chiều. PE làm tăng độ bền, giữ ấm tốt cho những ngày se lạnh. Cotton sẽ cho cảm giác thoáng và thấm hút tốt. Form áo basic, viền tay áo thiết kế cá tính. Nón rộng, cổ cao, điểm nhấn dây kéo cực chất nới ngực áo. Đặc biệt nằm trong dòng sản phẩm Adachi, phong cách Unisex phù hợp cho cả nam &amp; nữ.",
            ["Đen", "Xanh Bóng", "Xanh Đen"],
            ["images/product/AK_AD_0006_0.jpg", "images/product/AK_AD_0006_1.jpg", "images/product/AK_AD_0006_2.jpg"],
            categoryList[1],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nam Adachi Thun T01",
            313827,
            "Chất liệu : French Terry 2 chiều nhiều tính năng vượt trội. Vải không chứa formaldehyde (chất đây kích ứng da). Chống tia UV vượt trội. Thiết kế thông minh: nón rộng và cổ cao giúp chống nắng hiệu quả. Sự đặc biệt của thương hiệu Adachi đó chính là những trang phục dành riêng cho couple, được thiết kế riêng với những màu sắc và xu hướng thịnh hành nhất, cho các cặp đôi tự tin diện cùng nhau xuống phố.",
            ["Xanh Ngọc", "Xanh Riêu", "Xám Trắng"],
            ["images/product/AK_AD_0008_0.jpg", "images/product/AK_AD_0008_1.jpg", "images/product/AK_AD_0008_2.jpg"],
            categoryList[0],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nữ Adachi Dù A04",
            278982,
            "Chất liệu: Lớp ngoài chất liệu gió siêu nhẹ, dày dặn, chất mịn, không nhăn. Vải lót mềm, nhẹ, mát, thấm hút mồ hôi. Dây kéo YKK bền , lướt nhẹ. Túi có dây kéo giữ đc đồ cá nhân. Đi mưa nhẹ được. Đặc biệt túi gấp gọn đi theo áo nhẹ tiện dụng cho vào cốp xe máy, túi xách hoặc balo mang đi.",
            ["Xanh Dương", "Xanh Lá Cây", "Xanh Ngọc"],
            ["images/product/AK_AD_0009_0.jpg", "images/product/AK_AD_0009_1.jpg", "images/product/AK_AD_0009_2.jpg"],
            categoryList[1],
            callback);
    },
    function (callback) {
        CreateProduct(
            "Áo Khoác Nam Adachi Kaki F01",
            278982,
            " Một thiết kế của YaMe với những Slogan hiện đại, kiểu dáng trẻ trung cùng nhiều tính năng nhỏ tiện lợi. Chất liệu kaki với ưu điểm cực bền màu, ít co giãn nên giữ được phom dáng qua thời gian sử dụng khá lâu.",
            ["Cam", "Đen", "Xanh Riêu"],
            ["images/product/AK_AD_0010_0.jpg", "images/product/AK_AD_0010_1.jpg", "images/product/AK_AD_0010_2.jpg"],
            categoryList[0],
            callback);
    },
    function (callback) {
        Product.find({}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                productList = result;
                callback();
            }
        })
    },


    // Create Order
    function (callback) {
        CreateOrder(
            'pending',
            userList[1],
            [productList[0], productList[1]],
            ["XL", "S"],
            [productList[0].color[0],productList[1].color[1]],
            "Khong",
            'Tran Thi A',
            'Da Nang',
            '+8416548984',
            callback);
    },
    function (callback) {
        CreateOrder(
            'delivering',
            userList[2],
            [productList[2], productList[3], productList[1]],
            ["XL", "S"],
            [productList[2].color[1],productList[3].color[1],productList[1].color[0]],
            "Khong",
            'Tran Thi B',
            'Gia Lai',
            '+8416548984',
            callback);
    },
    function (callback) {
        CreateOrder(
            'delivered',
            userList[2],
            [productList[2], productList[3], productList[1]],
            ["XL", "S"],
            [productList[2].color[1],productList[3].color[1],productList[1].color[0]],
            "Khong",
            'Tran Thi C',
            'Go Vap',
            '+8416548984',
            callback);
    },
    function (callback) {
        Order.find({}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                orderList = result;
                callback();
            }
        })
    },


    function (callback) {
        mongoose.connection.close(function () {
            console.log('Update database successfully!');
        });
    }
]);