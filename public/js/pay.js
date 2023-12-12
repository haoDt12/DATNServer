document.addEventListener('DOMContentLoaded', function (){
    const token = utils.GetCookie("token");
    //Modal
    const ConfirmModal = new bootstrap.Modal(document.getElementById('ConfirmModal'));
    //Button open modal
    const openModalConfirm = document.getElementById('openModalConfirm');
    //Button Confirm
    const buttonConfirm = document.getElementById('buttonConfirm');

    openModalConfirm.addEventListener('click', function (){
        ConfirmModal.show();
    })

    buttonConfirm.addEventListener('click', function (){
        const valueName = document.getElementById('full_name').value;
        const valuePhone = document.getElementById('phone_number').value;
        const valueAddress = document.getElementById('address').value;

        const valueProduct = document.getElementById('product').value;

        const formData = new URLSearchParams();
        formData.append('guestName', valueName);
        formData.append('guestPhone', valuePhone);
        formData.append('guestAddress', valueAddress);
        formData.append('product', valueProduct);
        formData.append('status', 'PayComplete');

        const data = {guestName: valueName,
            guestPhone: valuePhone,
            guestAddress: valueAddress,
            product: valueProduct,
            status: 'PayComplete'
        }

        fetch('http://localhost:3000/api/creatOrderGuest', {
            headers: {
                'Authorization': token,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }).then((response) => {
            console.log(response)
            // location.reload();
        }).catch((error) => {
            console.error("Error:", error);
        });

        const dataToInvoice = {
            guestName: valueName,
            guestPhone: valuePhone,
            guestAddress: valueAddress,
            product: JSON.parse(valueProduct),
        }

        document.cookie = `dataToInvoice=${encodeURIComponent(JSON.stringify(dataToInvoice))}`;

        window.location.href = "/stech.manager/invoice";

    })

})