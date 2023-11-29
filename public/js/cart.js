document.addEventListener('DOMContentLoaded', function () {
    const Uid = utils.GetCookie("userId");
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
                // console.log(item.getAttribute("data-id"))
                const formDataUp = new FormData();
                formDataUp.append('userId', Uid)
                formDataUp.append('cartId', cartId)
                formDataUp.append('quantity', currentQuantity)
                totalQuan.forEach(itemQuan =>{
                    if (cartId === itemQuan.dataset.id){
                        itemQuan.innerText = price * currentQuantity
                    }
                })
                console.log(cartId ,currentQuantity)
                console.log(formDataUp)
                fetch('/api/editCart', {
                    headers: {
                        'Authorization': `${token}`
                    },
                    method: "POST",
                    body: formDataUp,
                })
                    .then((response) => {
                        if (response.ok) {
                            console.log("Request successful");
                        } else {
                            console.error("Request failed");
                        }
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            })
        });
    }

})