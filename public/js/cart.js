document.addEventListener('DOMContentLoaded', function () {
    const Uid = utils.GetCookie("Uid");
    const token = utils.GetCookie("token");
    const checkboxes = document.querySelectorAll('.product-checkbox');
    const inputQuan = document.querySelectorAll('.quantity-checkbox');
    const totalDisplay = document.getElementById('total-display');  // Thêm một phần tử để hiển thị tổng giá
    const totalQuan = document.querySelectorAll('.total-checkbox');
    const saveButtons = document.querySelectorAll('.save-btn');
    const deleteCCartPro = document.querySelectorAll('.deleteCartPro');
    const DeleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteCart"));
    const confirmDelete =  document.getElementById("confirmDelete");
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
    deleteCCartPro.forEach(function (DeleteProduct){
        DeleteProduct.addEventListener("click", function() {
            DeleteModal.show();
            const cartId = this.dataset.id;
            const productId = this.dataset.productid;
            console.log(productId)
            const id_product = this.getAttribute("data-id");
            console.log(id_product);
            confirmDelete.addEventListener("click", async function () {
                console.log("da click")

                const requestData = {
                    userId: Uid,
                    productId: productId,
                    cartId: cartId,
                };
                const headers = {
                    Authorization: token,
                    'Content-Type': 'application/json',
                };
                await axios.post('/api/deleteCart', requestData, {headers})
                    .then(response => {
                        console.log(response.data)

                    })
                    .catch(error => {
                        console.error('Error:', error.response ? error.response.data : error.message);
                    });

                // DeleteModal.hide();
                window.location.reload();
            });
        });
    });
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
    async function saveQuantity() {
        // console.log(document.cookie);
        const productId = this.dataset.productid;
        // const productId = document.querySelector(`.quantity-checkbox[data-id="${cartId}"]`).dataset.productId;

        // const userId = utils.GetCookie("userId");
        const caculation = parseInt(document.getElementById('caculation').value);
        const formDataUp = new FormData();
        formDataUp.append('userId', Uid);
        formDataUp.append('productId', productId);
        formDataUp.append('quantity', caculation);


        console.log('userId', Uid)
        console.log(productId)
        const requestData = {
            userId: Uid,
            productId: productId,
            quantity: caculation,
        };
        const headers = {
            Authorization: token,
            'Content-Type': 'application/json',
        };
        await axios.post('/api/editCartV2', requestData, {headers})
            .then(response => {
                console.log(response.data)
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
            });
        console.log("Save button clicked");
    }

})