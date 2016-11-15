exports.countKeys = function (keys, values, rereduce) {
    var val = {};
    if (rereduce) {
        for (var i = 0; i < values.length; i++) {
            for (var key in values[i]) {
                if (!val[key]) {
                    val[key] = values[i][key];
                } else {
                    val[key] += values[i][key];
                }
            }
        }
    } else {
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i][0];
            if (!val[key]) {
                val[key] = 1;
            } else {
                val[key]++;
            }
        }
    }
    return val;
};