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

    updateStatusButton.forEach(function (button) {
        button.addEventListener("click", async function () {
            modalUpdateStatusOrder.show();
            const orderId = this.getAttribute("data-id");
            console.log("Hello " + orderId);
            const orderUpdateId = {
                orderId: orderId
            };

            await axios.post("/api/getOrderByOrderId", orderUpdateId, {
                headers: {
                    'Authorization': token
                },
            }).then(function (response) {
                let jsonData = response.data.order
                inputStatus.value = jsonData.status;
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
            let valueStatus = inputStatus.value;
            if (valueStatus === 'WaitConfirm'){
                valueStatus = 'WaitingGet';
            } else if (valueStatus === 'WaitingGet'){
                valueStatus = 'InTransit';
            } else if (valueStatus === 'InTransit'){
                valueStatus = 'PayComplete';
            }
            const valueId = inputOrderId.value;
            const valueUserId = inputUserId.value;
            const valueAddressId = btnGetAddress.getAttribute("data-status");

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
});