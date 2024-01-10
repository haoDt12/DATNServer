

document.addEventListener('DOMContentLoaded', function () {
    const token = utils.GetCookie("token");
    var myModal = new bootstrap.Modal(document.getElementById('EmployeeModal'));

    var myModalBan = new bootstrap.Modal(document.getElementById('banEmployeeModal'));
    const banButtons = document.querySelectorAll('.banEmployee');
    const detailLinks = document.querySelectorAll(".DetailUser");

    const logout = document.getElementById("logout");
    logout.addEventListener("click", function () {
        window.location.assign("/stech.manager/login");
        utils.DeleteAllCookies();
    });


    document.getElementById('openEmployeeModal').addEventListener('click', function () {
        myModal.show();
    });


    document.getElementById('banEmployeeBtn').addEventListener('click', function () {
        myModalBan.show();
    });
    banButtons.forEach(button => {
        button.addEventListener('click', function () {
            const employeeId = this.getAttribute('data-id');
            document.getElementById('idEmployeeBan').value = employeeId;
        });
    });

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