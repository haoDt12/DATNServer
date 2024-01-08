document.addEventListener("DOMContentLoaded",function () {
    const loginButton = document.getElementById("loginButton");
    // create function
    let type = utils.GetCookie("LoginType");
    async function login(username, password) {
        try {
            const response = await axios.post('/api/loginUser', {
                username: username,
                password: password
            });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    //validate from
    function validFormLogin(username, password) {
        const phonePattern = /^(0|\+84)[3789][0-9]{8}$/;
        const emailPattern = /^[A-Za-z0-9+_.-]+@(.+)$/;

        const patternEmail = new RegExp(emailPattern);
        const patternPhone = new RegExp(phonePattern);

        const isEmail = patternEmail.test(username);
        const isPhone = patternPhone.test(username);

        if (username.trim().length === 0) {
            alert('Please re-enter email or phone number');
            return false;
        }
        if (password.trim().length === 0) {
            alert('Please re-enter password');
            return false;
        }
        if (!isPhone && !isEmail) {
            alert('Wrong email or phone number');
            return false;
        }
        return true;
    }

    loginButton.addEventListener("click",function () {
        if (type === "LoginWithEmployee"){
            const user = document.getElementById("username").value;
            const pass = document.getElementById("password").value;
            if (validFormLogin(user, pass)) {
                login(user, pass).then(data => {
                    if (data.code === 1){
                        const Uid = data.id;
                        utils.PushCookie("Uid", Uid);
                        localStorage.setItem("idUser", Uid);
                        utils.PushCookie("typeVerify", "login");
                        window.location.assign('/stech.manager/verify');
                    }else {
                        utils.showMessage(data.message);
                    }
                }).catch(error => {
                    console.error('Login error:', error);
                });
            }
        }
        else if (type === "LoginWithAdmin"){
            // viết y đúc thay api admin vào
        }

    });
});
