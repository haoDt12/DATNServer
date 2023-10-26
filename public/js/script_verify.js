const inputs = document.querySelectorAll("input"),
  button = document.querySelector("button");

// lặp lại tất cả các inputs
inputs.forEach((input, index1) => {
  input.addEventListener("keyup", (e) => {
    const currentInput = input,
      nextInput = input.nextElementSibling,
      prevInput = input.previousElementSibling;

    // nếu ô nhập lơn hơn 1 ký tự thì xóa
    if (currentInput.value.length > 1) {
      currentInput.value = "";
      return;
    }
    // nếu đầu vào tiếp theo bị tắt và giá trị hiện tại không trống
    //  focus vào ô nhập tiếp theo
    if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
      nextInput.removeAttribute("disabled");
      nextInput.focus();
    }

    // nếu nhấn phím xóa lùi
    if (e.key === "Backspace") {
      // lặp lại tất cả các đầu vào
      inputs.forEach((input, index2) => {
        if (index1 <= index2 && prevInput) {
          input.setAttribute("disabled", true);
          input.value = "";
          prevInput.focus();
        }
      });
    }
    if (!inputs[3].disabled && inputs[3].value !== "") {
      button.classList.add("active");
      return;
    }
    button.classList.remove("active");
  });
});

//focus vào ô nhập đầu tiên khi load
window.addEventListener("load", () => inputs[0].focus());
