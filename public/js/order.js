document.addEventListener('DOMContentLoaded', function(){

    const token = utils.GetCookie("token");

    const modalUpdateStatusOrder = new bootstrap.Modal(document.getElementById('UpdateStatusOrderModal'));
    //
    const updateStatusButton = document.querySelectorAll(".updateStatusOrder");
    const btnGetAddress = document.getElementById('btnGetAddress');
    const btnGetImg = document.getElementById('btnGetImg');
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
            const valueImg = btnGetImg.getAttribute("data-status");
            const valueStatus = inputStatus.value;

            console.log("Hello "+valueStatus);
            console.log("Hello "+valueUserId);
            console.log("Hello "+valueAddressId);
            console.log("Hello "+valueImg);
            console.log("Hello "+token);

            // const formData = new FormData();
            // formData.append("orderId", valueId);
            // formData.append("status", valueStatus);

            let status;
            if (valueStatus == 'WaitingGet'){
                status = 'Chờ lấy hàng';
            } else if (valueStatus == 'InTransit'){
                status = 'Đang giao'
            } else if (valueStatus == 'PayComplete'){
                status = 'Đã thanh toán'
            } else if (valueStatus == 'WaitConfirm'){
                status = 'Chờ xác nhận'
            } else if (valueStatus == 'Cancel'){
                status = 'Đã hủy'
            }
            const formData1 = new URLSearchParams();
            formData1.append("title", "Trạng thái đơn hàng");
            formData1.append("content", " Trạng thái của dơn hàng bạn: "+status);
            formData1.append("userId", valueUserId);
            formData1.append("img", valueImg);

            fetch('/api/addNotificationPrivate', {
                headers: {
                    'Authorization': `${token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                method: "POST",
                body: formData1,
            }).then((response) => {
                console.log(response)
                console.log("Thanh cong")
            }).catch((error) => {
                console.error("Error:", error);
            });

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