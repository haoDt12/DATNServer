document.addEventListener('DOMContentLoaded', function () {
    const token = utils.GetCookie("token");
    //Modal
    const modalCreateVoucher = new bootstrap.Modal(document.getElementById('CreateVoucherModal'));
    const modalUpdateVoucher = new bootstrap.Modal(document.getElementById('UpdateVoucherModal'));
    const modalDeleteVoucher = new bootstrap.Modal(document.getElementById('DeleteVoucherModal'));

    //Button openModal
    const openModalCreate = document.getElementById('openModalCreateVoucher');
    const openModalUpdate = document.querySelectorAll(".openModalUpdateVoucher");
    const openModalDelete = document.querySelectorAll(".openModalDeleteVoucher");

    //Button Confirm
    const confirmCreate = document.getElementById('buttonConfirmCreate');
    const confirmUpdate = document.getElementById('buttonConfirmUpdate');
    const confirmDelete = document.getElementById('buttonConfirmDelete');

    //Create
    openModalCreate.addEventListener('click', function () {
        modalCreateVoucher.show();
    });

    confirmCreate.addEventListener('click', function () {
        const valueTitle = document.getElementById('title').value;
        const valueContent = document.getElementById('content').value;
        const valuePrice = document.getElementById('price').value;
        const valueFromDate = document.getElementById('fromDate').value;
        const valueToDate = document.getElementById('toDate').value;

        const formData = new URLSearchParams();
        formData.append("title", valueTitle);
        formData.append("content", valueContent);
        formData.append("price", valuePrice);
        formData.append("toDate", formatDateTime(valueToDate));
        formData.append("fromDate", formatDateTime(valueFromDate));

        fetch('/api/addVoucherForAllUser', {
            headers: {
                'Authorization': `${token}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            body: formData,
        }).then((response) => {
            console.log(response)
            location.reload();
        }).catch((error) => {
            console.error("Error:", error);
        });
    });

    function formatDateTime(dateTimeString) {
        var selectedDate = new Date(dateTimeString);

        // Lấy các thành phần của ngày và giờ
        var year = selectedDate.getFullYear();
        var month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        var day = selectedDate.getDate().toString().padStart(2, '0');
        var hour = selectedDate.getHours().toString().padStart(2, '0');
        var minute = selectedDate.getMinutes().toString().padStart(2, '0');
        var second = selectedDate.getSeconds().toString().padStart(2, '0');

        // Định dạng lại theo "YYYY-MM-DD HH:mm:ss"
        var formattedDate = `${year}-${month}-${day}-${hour}:${minute}:${second}`;

        return formattedDate;
    }

    //DELETE
    openModalDelete.forEach(function (button) {
        button.addEventListener('click', function () {
            const voucherId = this.getAttribute('data-id');
            const dataDelete = new URLSearchParams();
            dataDelete.append("voucherId", voucherId);
            modalDeleteVoucher.show();
            confirmDelete.addEventListener('click', function () {
                fetch('/api/deleteVoucher', {
                    headers: {
                        'Authorization': `${token}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    method: "POST",
                    body: dataDelete,
                }).then((response) => {
                    console.log(response)
                    location.reload();
                }).catch((error) => {
                    console.error("Error:", error);
                });
            })
        })
    })

    //Update
    openModalUpdate.forEach(function (button){
        button.addEventListener('click', function (){
            const voucherId = this.getAttribute('data-id');
            const valueTitle = this.getAttribute('data-title');
            const valueContent = this.getAttribute('data-content');
            const valuePrice = this.getAttribute('data-price');
            const valueFromDate = this.getAttribute('data-fromDate');
            const valueToDate = this.getAttribute('data-toDate');

            document.getElementById('upTitle').value = valueTitle;
            document.getElementById('upContent').value = valueContent;
            document.getElementById('upPrice').value = valuePrice;
            document.getElementById('upFromDate').value = convertDateTimeFormat(valueFromDate);
            document.getElementById('upToDate').value = convertDateTimeFormat(valueToDate);
            console.log(convertDateTimeFormat(valueFromDate))
            modalUpdateVoucher.show();
            confirmUpdate.addEventListener('click', function (){
                const newTitle = document.getElementById('upTitle').value;
                const newContent = document.getElementById('upContent').value;
                const newPrice = document.getElementById('upPrice').value;
                const newFromDate = document.getElementById('upFromDate').value;
                const newToDate = document.getElementById('upToDate').value;

                const formData = new URLSearchParams();
                formData.append("voucherId", voucherId);
                formData.append("title", newTitle);
                formData.append("content", newContent);
                formData.append("price", newPrice);
                formData.append("toDate", formatDateTime(newToDate));
                formData.append("fromDate", formatDateTime(newFromDate));

                fetch('/api/editVoucher', {
                    headers: {
                        'Authorization': `${token}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    method: "POST",
                    body: formData,
                }).then((response) => {
                    console.log(response)
                    location.reload();
                }).catch((error) => {
                    console.error("Error:", error);
                });
            })
        })
    })

    function convertDateTimeFormat(dateTimeString) {
        var parts = dateTimeString.split('-');

        var year = parts[0];
        var month = parts[1];
        var day = parts[2];
        var time = parts[3];

        // Định dạng lại theo "YYYY-MM-DDTHH:mm"
        var formattedDateTime = `${year}-${month}-${day}T${time}`;

        return formattedDateTime;
    }
})