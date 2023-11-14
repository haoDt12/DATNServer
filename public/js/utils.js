const utils = {

    GetCookie: function(name) {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split("=");
            if (cookie[0] === name) {
                return decodeURIComponent(cookie[1]);
            }
        }
        return null;
    },

    PushCookie: function (name, value){
        document.cookie = name + "=" + encodeURIComponent(value);
    },

    showMessage: function (message) {
    alert(message)
    }
};