document.addEventListener('DOMContentLoaded', function () {
    const Uid = utils.GetCookie("Uid");
    const token = utils.GetCookie("token");
    const checkboxes = document.querySelectorAll('.product-checkbox');
    const inputQuan = document.querySelectorAll('.quantity-checkbox');
    const totalDisplay = document.getElementById('total-display');  // Thêm một phần tử để hiển thị tổng giá
    const totalQuan = document.querySelectorAll('.total-checkbox');
    const saveButtons = document.querySelectorAll('.save-btn');
    const total = document.getElementById("total");
    const quantityUp = document.getElementById("quantityUp");
    const imgCoverUp = document.getElementById("imgCoverUp");
    const titleUp = document.getElementById("titleUp");
    const colorUp = document.getElementById("colorUp");
    const priceUp = document.getElementById("priceUp");
    const ram_romUp = document.getElementById("ram_romUp");
        // const inputQuan = document.getElementById('')
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTotal);
    });
    inputQuan.forEach(quantity => {
        quantity.addEventListener('input', updateTotalQuantity);
    });
    saveButtons.forEach(saveBtn => {
        saveBtn.addEventListener('click', saveQuantity);
    });
    function updateTotal() {
        let total = 0;

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const price = parseFloat(checkbox.dataset.price);
                const quantity = parseInt(checkbox.dataset.quantity);
                total += price * quantity;
            }
        });

        // Hiển thị tổng giá
        totalDisplay.innerText = `${total.toFixed(2)}$`;
    }

    function updateTotalQuantity() {
        inputQuan.forEach(item => {
            item.addEventListener("click",  () =>{
                let currentQuantity = parseInt(item.value);
                let price = parseInt(item.dataset.price);
                let cartId = item.dataset.id;
                totalQuan.forEach(itemQuan =>{
                    if (cartId === itemQuan.dataset.id){
                        itemQuan.innerText = price * currentQuantity
                    }
                })

                console.log(cartId ,currentQuantity)
                this.blur();
            })
        });
    }
    function saveQuantity() {
        console.log(Uid)
        // console.log(document.cookie);
        const cartId = this.dataset.id;
        const productId = this.dataset.productid;
        // const productId = document.querySelector(`.quantity-checkbox[data-id="${cartId}"]`).dataset.productId;
        const newQuantity = parseInt(document.querySelector(`.quantity-checkbox[data-id="${cartId}"]`).value);
        // const userId = utils.GetCookie("userId");
        const caculation = parseInt(document.getElementById('caculation').value);

        const formDataUp = new FormData();
        formDataUp.append('userId', Uid);
        formDataUp.append('cartId', cartId);
        formDataUp.append('productId', productId);
        formDataUp.append('caculation', caculation);

        // So sánh giá trị của caculation và quantity
        if (caculation < newQuantity) {
            // Nếu caculation nhỏ hơn quantity, thực hiện reduce
            formDataUp.append('caculation', 'reduce');
        } else if (caculation > newQuantity) {
            // Nếu caculation lớn hơn quantity, thực hiện increase
            formDataUp.append('caculation', 'increase');
        } else {
            // Nếu giá trị bằng nhau, có thể xử lý theo cách khác tùy thuộc vào yêu cầu
            formDataUp.append('caculation', 'equal');
        }
        console.log('userId', Uid)
        console.log(productId)
        fetch('/api/editCart', {
            headers: {
                'Authorization': `${token}`
            },
            method: "POST",
            body: formDataUp,
        })
            .then(response => {
                if (response.ok) {
                    console.log("Request successful");
                } else {
                    console.error("Request failed");
                }
            })
        .catch(error => {
            console.error("Error:", error);
        });
        console.log("Save button clicked");
    }

})