document.addEventListener('DOMContentLoaded', function(){

    const token = utils.GetCookie("token");

    const modalUpdateStatusOrder = new bootstrap.Modal(document.getElementById('UpdateStatusOrderModal'));
    //
    const updateStatusButton = document.querySelectorAll(".updateStatusOrder");
    const btnGetAddress = document.getElementById('btnGetAddress');
    //
    const confirmUpdateButton = document.querySelectorAll(".confirmUpdateStatusOrder");
    const buttonConfirm = document.getElementById('buttonConfirm');

    const inputOrderId = document.getElementById('inputOrderId');
    const inputUserId = document.getElementById('inputUserId');
    const inputAddressId = document.getElementById('inputAddressId');
    const inputStatus = document.getElementById('inputStatus');
    const btnValueStatus = document.getElementById('updateOrderButton');


    const openDetailOrder = document.querySelectorAll(".detailOrder");
    const loadListOrderByStatus = document.querySelectorAll(".statusButton");

    updateStatusButton.forEach(function (button) {
        button.addEventListener("click", async function () {
            modalUpdateStatusOrder.show();
            const orderId = this.getAttribute("data-id");
            const valueStatus = this.getAttribute("data-status");
            inputStatus.value = valueStatus;
            console.log("Hello " + orderId);
            console.log("Hello " + valueStatus);
            const orderUpdateId = {
                orderId: orderId
            };

            await axios.post("/api/getOrderByOrderId", orderUpdateId, {
                headers: {
                    'Authorization': token
                },
            }).then(function (response) {
                let jsonData = response.data.order
                inputOrderId.value = jsonData._id;
                inputUserId.value = jsonData.userId;
                // inputAddressId.value = jsonData.addressId;
                // console.log("Hello " + JSON.stringify(jsonData.product, null,2));
                // let jsonProduct = JSON.stringify(jsonData.product, null,2);
                // console.log("Product: "+jsonProduct.title);
            }).catch(function (error) {
                console.log(error);
            });
        });
    });
    confirmUpdateButton.forEach(function (button){
        button.addEventListener("click",async function () {
            const valueId = inputOrderId.value;
            const valueUserId = inputUserId.value;
            const valueAddressId = btnGetAddress.getAttribute("data-status");
            const valueStatus = inputStatus.value;

            console.log("Hello "+valueStatus);
            console.log("Hello "+valueUserId);
            console.log("Hello "+valueAddressId);
            console.log("Hello "+token);

            // const formData = new FormData();
            // formData.append("orderId", valueId);
            // formData.append("status", valueStatus);

            const formData = {orderId: valueId, userId: valueUserId, addressId: valueAddressId, status: valueStatus};

            await axios.post("/api/editOrder", formData, {
                headers:{
                    'Authorization': token
                },
            }).then(function (response) {
                console.log(response);
                location.reload();
            }).catch(function (error) {
                console.log(error);
            });
        });
        modalUpdateStatusOrder.hide();
    });

    openDetailOrder.forEach(function(detailLink) {
        detailLink.addEventListener("click", function(event) {
            event.preventDefault();
            var orderId = this.getAttribute("data-id");
            var encodedProductId = btoa(orderId);
            console.log(encodedProductId); // Xuất mã hóa
            window.location.href = "/stech.manager/detail_order?orderId=" + encodedProductId;
        });
    });

    function setCookie(name, value) {
        document.cookie = `${name}=${value}; path=/`;
    }

    loadListOrderByStatus.forEach(function(detailLink) {
        detailLink.addEventListener("click", function(event) {
            event.preventDefault();
            var valueStatus = this.getAttribute("data-status");
            console.log(valueStatus)
            var encodedValueStatus = btoa(valueStatus);
            console.log(encodedValueStatus); // Xuất mã hóa
            setCookie("status", encodedValueStatus)
            window.location.href = "/stech.manager/order";
        });
    });
});