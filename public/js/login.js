document.addEventListener("DOMContentLoaded",function () {
    const loginButton = document.getElementById("loginButton");
    // create function
    async function login(username, password) {
        try {
            const response = await axios.post('http://localhost:3000/api/loginUser', {
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
    // get message
    function showMessage(message) {
        alert(message)
    }

    loginButton.addEventListener("click",function () {
        const user = document.getElementById("username").value;
        const pass = document.getElementById("password").value;
        if (validFormLogin(user, pass)) {
            login(user, pass).then(data => {
                if (data.code === 1){
                    const Uid = data.id;
                    document.cookie = "Uid=" + encodeURIComponent(Uid);
                    document.cookie = "typeVerify=" + "login";
                    window.location.href = 'http://localhost:3000/stech.manager/verify';
                }else {
                    showMessage(data.message);
                }
            }).catch(error => {
                    console.error('Login error:', error);
                });
        }
    });
});
