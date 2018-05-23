var obj = {
    // Get a specific cookie from cookie string
    GetCookie: function (reqObject, name) {
        var cookieString = reqObject.headers.cookie;
        if (cookieString === undefined || cookieString.indexOf(name) === -1) {
            return null;
        } else {
            value = '';
            var i = 0;
            var valueIsStarted = false;
            for (i = cookieString.indexOf(name); i < cookieString.length && cookieString[i] !== ';'; i++) {
                if (valueIsStarted) {
                    value += cookieString[i];
                }

                if (cookieString[i] === '=') {
                    valueIsStarted = true;
                }
            }

            return value;
        }
    },

    SetCookie: function (resObject, name, value, expires) {
        try {
            resObject.cookie(name, value, { expires: new Date(Date.now() + expires) });
            return true;
        } catch (ee) {
            return false;
        }
    },

    RemoveCookie: function (resObject, name) {
        try {
            resObject.cookie(name, { maxAge: Date.now(), expires: Date.now() });
            return true;
        } catch (ee) {
            return false;
        }
    }
}

module.exports = obj;