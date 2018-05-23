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
    category: mongoose.Schema.ObjectId
});

var adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Tao model
const category = mongoose.model('Category', categorySchema);
const product = mongoose.model('Product', productSchema);
const admin = mongoose.model('Admin', adminSchema);

// Array
var categoryList = [];

//Them du lieu vao
async.series([
    function (callback) {
        mongoose.connect('mongodb://localhost:27017/shoppingDB',callback);
    },

    function (callback) {
        admin.create({
            username: "admin",
            password: "123"
        }, callback);
    },

    function (callback) {
        category.create({
            name: "Áo khoác Nam"
        }, callback);
    },

    function (callback) {
        category.create({
            name: "Áo khoác Nữ"
        }, callback);
    },

    function (callback) {
        category.find({}, function (err, result) {
            categoryList = result;
            callback();
        })
    },

    function (callback) {
        product.create({
            id: "AK_AD_0000",
            name: "Áo Khoác Nữ Adachi Thun X01",
            price: 271946,
            description: "Áo thun đậm chất nữ tính phù hợp cho các bạn nữ khi ra ngoài",
            size: ["M", "L", "XL"],
            color: ["Đỏ Cam", "Hồng Đậm", "Xanh Trong Trắng"],
            images: ["images/product/AK_AD_0000_0.jpg", "images/product/AK_AD_0000_1.jpg", "images/product/AK_AD_0000_2.jpg"],
            category: categoryList[1]
        }, callback);
    },
    function (callback) {
        product.create({
            id: "AK_AD_0001",
            name: "Áo Khoác Nam Adachi Thun X01",
            price: 278982,
            description: "Áo thun đậm chất nam tính phù hợp cho các bạn nam khi ra ngoài",
            size: ["M", "L", "XL"],
            color: ["Đen", "Trắng", "Xanh Cổ Vịt"],
            images: ["images/product/AK_AD_0001_0.jpg", "images/product/AK_AD_0001_1.jpg", "images/product/AK_AD_0001_2.jpg"],
            category: categoryList[0]
        }, callback);
    },
    function (callback) {
        product.create({
            id: "AK_AD_0002",
            name: "Áo Khoác Nam Adachi Thun X01",
            price: 278982,
            description: "Áo thun đậm chất nam tính phù hợp cho các bạn nam khi ra ngoài",
            size: ["M", "L", "XL"],
            color: ["Đen", "Trắng", "Xanh Cổ Vịt"],
            images: ["images/product/AK_AD_0002_0.jpg", "images/product/AK_AD_0002_1.jpg", "images/product/AK_AD_0002_2.jpg"],
            category: categoryList[0]
        }, callback);
    },
    function (callback) {
        product.create({
            id: "AK_AD_0003",
            name: "Áo Khoác Nữ Adachi Thun T01",
            price: 301361,
            description: "Chất liệu: CVC vảy cá 2 chiều. PE làm tăng độ bền, giữ ấm tốt cho những ngày se lạnh. Cotton sẽ cho cảm giác thoáng và thấm hút tốt. Form áo basic, viền tay áo thiết kế cá tính. Nón rộng, cổ cao, điểm nhấn dây kéo cực chất nới ngực áo.",
            size: ["M", "L", "XL"],
            color: ["Xám Trắng", "Tím Tối", "Xanh Chàm"],
            images: ["images/product/AK_AD_0003_0.jpg", "images/product/AK_AD_0003_1.jpg", "images/product/AK_AD_0003_2.jpg"],
            category: categoryList[1]
        }, callback);
    },
    function (callback) {
        product.create({
            id: "AK_AD_0004",
            name: "Áo Khoác Nữ Adachi Thun ST03",
            price: 292307,
            description: "Trở lại với xu hướng quân đội, áo khoác lính tinh tế &amp; thời thượng hơn. Thiết kế Unisex, nón rộng cổ cao, bo tay áo. Dành cho cả nam &amp; nữ. Chất liệu: Nỉ cao cấp, dày dặn.",
            size: ["M", "L", "XL"],
            color: ["Xanh Lính", "Đỏ Đen", "Râm Đen"],
            images: ["images/product/AK_AD_0004_0.jpg", "images/product/AK_AD_0004_1.jpg", "images/product/AK_AD_0004_2.jpg"],
            category: categoryList[1]
        }, callback);
    },
    function (callback) {
        product.create({
            id: "AK_AD_0005",
            name: "Áo Khoác Nam Adachi Thun ST03",
            price: 278982,
            description: "Trở lại với xu hướng quân đội, áo khoác lính tinh tế &amp; thời thượng hơn. Thiết kế Unisex, nón rộng cổ cao, bo tay áo. Dành cho cả nam &amp; nữ. Chất liệu: Nỉ cao cấp, dày dặn.",
            size: ["M", "L", "XL"],
            color: ["Xanh Lính", "Xanh Dương", "Xám Trắng"],
            images: ["images/product/AK_AD_0005_0.jpg", "images/product/AK_AD_0005_1.jpg", "images/product/AK_AD_0005_2.jpg"],
            category: categoryList[0]
        }, callback);
    },
    function (callback) {
        product.create({
            id: "AK_AD_0006",
            name: "Áo Khoác Nữ Adachi Thun T02",
            price: 278982,
            description: "Chất liệu: CVC vảy cá 2 chiều. PE làm tăng độ bền, giữ ấm tốt cho những ngày se lạnh. Cotton sẽ cho cảm giác thoáng và thấm hút tốt. Form áo basic, viền tay áo thiết kế cá tính. Nón rộng, cổ cao, điểm nhấn dây kéo cực chất nới ngực áo. Đặc biệt nằm trong dòng sản phẩm Adachi, phong cách Unisex phù hợp cho cả nam &amp; nữ.",
            size: ["M", "L", "XL"],
            color: ["Đen", "Xanh Bóng", "Xanh Đen"],
            images: ["images/product/AK_AD_0006_0.jpg", "images/product/AK_AD_0006_1.jpg", "images/product/AK_AD_0006_2.jpg"],
            category: categoryList[1]
        }, callback);
    },
    function (callback) {
        product.create({
            id: "AK_AD_0008",
            name: "Áo Khoác Nam Adachi Thun T01",
            price: 313827,
            description: "Chất liệu : French Terry 2 chiều nhiều tính năng vượt trội. Vải không chứa formaldehyde (chất đây kích ứng da). Chống tia UV vượt trội. Thiết kế thông minh: nón rộng và cổ cao giúp chống nắng hiệu quả. Sự đặc biệt của thương hiệu Adachi đó chính là những trang phục dành riêng cho couple, được thiết kế riêng với những màu sắc và xu hướng thịnh hành nhất, cho các cặp đôi tự tin diện cùng nhau xuống phố.",
            size: ["M", "L", "XL"],
            color: ["Xanh Ngọc", "Xanh Riêu", "Xám Trắng"],
            images: ["images/product/AK_AD_0008_0.jpg", "images/product/AK_AD_0008_1.jpg", "images/product/AK_AD_0008_2.jpg"],
            category: categoryList[0]
        }, callback);
    },
    function (callback) {
        product.create({
            id: "AK_AD_0009",
            name: "Áo Khoác Nữ Adachi Dù A04",
            price: 278982,
            description: "Chất liệu: Lớp ngoài chất liệu gió siêu nhẹ, dày dặn, chất mịn, không nhăn. Vải lót mềm, nhẹ, mát, thấm hút mồ hôi. Dây kéo YKK bền , lướt nhẹ. Túi có dây kéo giữ đc đồ cá nhân. Đi mưa nhẹ được. Đặc biệt túi gấp gọn đi theo áo nhẹ tiện dụng cho vào cốp xe máy, túi xách hoặc balo mang đi.",
            size: ["M", "L", "XL"],
            color: ["Xanh Dương", "Xanh Lá Cây", "Xanh Ngọc"],
            images: ["images/product/AK_AD_0009_0.jpg", "images/product/AK_AD_0009_1.jpg", "images/product/AK_AD_0009_2.jpg"],
            category: categoryList[1]
        }, callback);
    },

    function (callback) {
        product.create({
            id: "AK_AD_0010",
            name: "Áo Khoác Nam Adachi Kaki F01",
            price: 278982,
            description: " Một thiết kế của YaMe với những Slogan hiện đại, kiểu dáng trẻ trung cùng nhiều tính năng nhỏ tiện lợi. Chất liệu kaki với ưu điểm cực bền màu, ít co giãn nên giữ được phom dáng qua thời gian sử dụng khá lâu.",
            size: ["M", "L", "XL"],
            color: ["Cam", "Đen", "Xanh Riêu"],
            images: ["images/product/AK_AD_0010_0.jpg", "images/product/AK_AD_0010_1.jpg", "images/product/AK_AD_0010_2.jpg"],
            category: categoryList[0]
        }, callback);
    },

    function (callback) {
        mongoose.connection.close(function () {
            console.log('Update database successfully!');
        });
    }
]);