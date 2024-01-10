

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
});