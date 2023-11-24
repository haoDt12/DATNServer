document.addEventListener('DOMContentLoaded', function () {
    const token = utils.GetCookie("token");
    //Modal
    const modalCreateNotification = new bootstrap.Modal(document.getElementById('CreateNotificationModal'));
    const modalUpdateNotification = new bootstrap.Modal(document.getElementById('UpdateNotificationModal'));
    const modalDeleteNotification = new bootstrap.Modal(document.getElementById('DeleteNotificationModal'));

    //Button openModal
    const openModalCreate = document.getElementById('openModalCreateNotifi');
    const openModalUpdate = document.querySelectorAll(".openModalUpdateNotifi");
    const openModalDelete = document.querySelectorAll(".openModalDeleteNotifi");

    //Button Confirm
    const confirmCreate = document.getElementById('buttonConfirmCreate');
    const confirmUpdate = document.getElementById('buttonConfirmUpdate');
    const confirmDelete = document.getElementById('buttonConfirmDelete');

    //Create Notification
    openModalCreate.addEventListener('click', function (){
        modalCreateNotification.show();
    })

    confirmCreate.addEventListener('click', async function (){
        const valueTitle = document.getElementById('title').value;
        const valueContent = document.getElementById('content').value;
        const formData = new URLSearchParams();
        formData.append("title", valueTitle);
        formData.append("content", valueContent);
        fetch('/api/addNotificationPublic', {
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

    //Update Notification
    openModalUpdate.forEach(function (button) {
        button.addEventListener('click', function (){
            const notifiId = this.getAttribute('data-id');
            const valueContent = this.getAttribute('data-content');
            const valueTitle = this.getAttribute('data-title');

            document.getElementById('upTitle').value = valueTitle;
            document.getElementById('upContent').value = valueContent;

            modalUpdateNotification.show();

            confirmUpdate.addEventListener('click', async function(){
                const newTitle = document.getElementById('upTitle').value;
                const newContent = document.getElementById('upContent').value;
                const formData = new URLSearchParams();
                formData.append("title", newTitle);
                formData.append("content", newContent);
                formData.append("notificationId", notifiId);
                fetch('/api/editNotification', {
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

    //Delete Notification
    openModalDelete.forEach(function (button){
        button.addEventListener('click', function (){
            const notifiId = this.getAttribute('data-id');
            const dataDelete = new URLSearchParams();
            dataDelete.append("nonotificationId", notifiId);
            modalDeleteNotification.show();
            confirmDelete.addEventListener('click', async function(){
                fetch('/api/deleteNotification',{
                    headers: {
                        'Authorization': `${token}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    method: "POST",
                    body: dataDelete,
                })
                    .then((response) => {
                        console.log(response)
                        location.reload();
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            })
        })
    })
})