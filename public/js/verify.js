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
      const response = await axios.post('/api/verifyOtpLogin', {
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
      const response = await axios.post('/api/verifyOtpRegister', {
        userTempId: userTempId,
        otp: otp
      });
      return response.data;
    }catch (error){
      console.error(error);
    }
  }

  verifyButton.addEventListener("click",function () {
    const otp = inputs[0].value + inputs[1].value + inputs[2].value + inputs[3].value + inputs[4].value + inputs[5].value;
    const Uid = utils.GetCookie("Uid");
    const typeVerify = utils.GetCookie("typeVerify");
    if (typeVerify === "login"){
      verifyLogin(Uid, otp).then(data  => {
        if (data.code === 1) {
          const token = data.token;
          utils.PushCookie("token", token);
          window.location.assign('/stech.manager/home');
        }else {
          utils.showMessage(data.message);
        }
      }).catch(error => {
        console.error('Login error:', error);
      });
    }else if(typeVerify === "signup"){
      verifySignUp(Uid, otp).then(data  => {
        if (data.code === 1) {
          window.location.href = '/stech.manager/login';
        }else {
          utils.showMessage(data.message);
        }
      }).catch(error => {
        console.error('Login error:', error);
      });
    }
  });
});



