function QueryProducts(query, callback) {
    async.series([
        function (cb) {
            // build mongoose query object
            if (query.category != undefined) {
                query.category = new mongoose.Types.ObjectId(query.category);
            }
            if (query.size != undefined) {

            }
            cb();
        },

        function (cb) {
            // send query to the database
            Product.find(query, function (err, products) {
                if (err) {
                    console.log(err);
                } else {
                    var returnArray;

                    // process array 'products'
                    returnArray = products;

                    cb();
                    return callback(returnArray);
                }
            });

        }
    ]);

}