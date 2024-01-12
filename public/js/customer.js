

document.addEventListener('DOMContentLoaded', function () {
    const token = utils.GetCookie("token");

    // var myModal = new bootstrap.Modal(document.getElementById('UserModal'));
    // var myModalUp = new bootstrap.Modal(document.getElementById('UpdateUserModal'));
    var myModalBan = new bootstrap.Modal(document.getElementById('banCustomerModal'));
    const banButtons = document.querySelectorAll('.banCus');
    const addUserButton = document.getElementById("addUserButton");


    const logout = document.getElementById("logout");
    logout.addEventListener("click", function () {
        window.location.assign("/stech.manager/login");
        utils.DeleteAllCookies();
    });

    const deleteProButtons = document.querySelectorAll(".deleteUs");
    const editUserButton = document.querySelectorAll(".updateUs");

    const detailLinks = document.querySelectorAll(".DetailUser");
    const detailLink = document.getElementById("Detail");

    const confirmUpdateButton = document.getElementById("UpdateUser");
    const confirmDeleteButton = document.getElementById("deleteUser");
    let roleAU;

    //
    // document.getElementById('openUserModal').addEventListener('click', function () {
    //     myModal.show();
    // });
    document.getElementById('banCustomerBtn').addEventListener('click', function () {
        myModalBan.show();
    });
    banButtons.forEach(button => {
        button.addEventListener('click', function () {
            const customerId = this.getAttribute('data-id');
            document.getElementById('idCustomerBan').value = customerId;
        });
    });

    deleteProButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const customerId = this.getAttribute('data-id');
            console.log(customerId)
            document.getElementById('idCustomerDelete').value = customerId;
            DelProModal.show();

        })
    })
    detailLinks.forEach(function (detailLink) {
        detailLink.addEventListener("click", function (event) {
            event.preventDefault();
            var userId = this.getAttribute("data-id");
            var encodedUserId = btoa(userId);
            console.log(userId);
            console.log(encodedUserId); // Xuất mã hóa
            window.location.href = "/stech.manager/detail_user?userId=" + encodedUserId;
        });
    });


    let chatUser = document.querySelectorAll('.chatUser');
    chatUser.forEach(function (item) {
        item.addEventListener('click', () => {
            let idUserSelected = item.getAttribute("data-id");
            let arrayID = []
            arrayID.push(idUserSelected)
            // console.log(idUserSelected);
            createConversation(idUserSelected);
        })
    })

    // 
    async function createConversation(idUserSelected) {
        try {
            let xhr = new XMLHttpRequest();
            let endPoint = "/stech.manager/create-conversation";
            xhr.open('POST', endPoint, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({ idUserSelected }));

            xhr.onload = function () {
                if (xhr.status === 200) {
                    let myData = JSON.parse(xhr.response);
                    console.log(myData.message);
                    switch (myData.code) {
                        case "REDIRECT":
                        case "CREATE_SUCCESS":
                            window.location.href = "/stech.manager/chat";
                            break;
                        default:
                            console.log(xhr.responseText);
                            break;
                    }
                }
            };
        } catch (error) {
            console.error(error);
        }
    }
});