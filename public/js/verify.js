document.addEventListener("DOMContentLoaded", function (){
  const inputs = document.querySelectorAll("input");
  const  verifyButton = document.querySelector("button");
// lặp lại tất cả các inputs
  inputs.forEach((input, index1) => {
    input.addEventListener("keyup", (e) => {
      const currentInput = input,
          nextInput = input.nextElementSibling,
          prevInput = input.previousElementSibling;

      if (currentInput.value.length > 1) {
        currentInput.value = "";
        return;
      }
      if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
        nextInput.removeAttribute("disabled");
        nextInput.focus();
      }

      if (e.key === "Backspace") {
        inputs.forEach((input, index2) => {
          if (index1 <= index2 && prevInput) {
            input.setAttribute("disabled", true);
            input.value = "";
            prevInput.focus();
          }
        });
      }
      if (!inputs[5].disabled && inputs[5].value !== "") {
        verifyButton.classList.add("active");
        return;
      }
      verifyButton.classList.remove("active");
    });
  });
  window.addEventListener("load", () => inputs[0].focus());
  async function verifyLogin(userId, otp){
    try {
      const response = await axios.post('http://localhost:3000/api/verifyOtpLogin', {
        userId: userId,
        otp: otp
      });
      return response.data;
    }catch (error){
      console.error(error);
    }
  }
  async function verifySignUp(userTempId, otp){
    try {
      const response = await axios.post('http://localhost:3000/api/verifyOtpRegister', {
        userTempId: userTempId,
        otp: otp
      });
      return response.data;
    }catch (error){
      console.error(error);
    }
  }
  function getCookieValue(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === name) {
        return decodeURIComponent(cookie[1]);
      }
    }
    return null;
  }
  function showMessage(message) {
    alert(message)
  }

  verifyButton.addEventListener("submit",function () {
    const otp = inputs[0].value + inputs[1].value + inputs[2].value + inputs[3].value + inputs[4].value + inputs[5].value;
    const Uid = getCookieValue("Uid");
    const typeVerify = getCookieValue("typeVerify");
    if (typeVerify === "login"){
      verifyLogin(Uid, otp).then(data  => {
        if (data.code === 1) {
          const token = data.token;
          document.cookie = "token=" + encodeURIComponent(token);
          window.location.href = 'http://localhost:3000/stech.manager/home';
        }else {
          showMessage(data.message);
        }
      }).catch(error => {
        console.error('Login error:', error);
      });
    }else if(typeVerify === "signup"){
      verifySignUp(Uid, otp).then(data  => {
        if (data.code === 1) {
          window.location.href = 'http://localhost:3000/stech.manager/login';
        }else {
          showMessage(data.message);
        }
      }).catch(error => {
        console.error('Login error:', error);
      });
    }
  });
});

