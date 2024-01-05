

document.addEventListener('DOMContentLoaded', function () {
    const token = utils.GetCookie("token");
    var myModal = new bootstrap.Modal(document.getElementById('EmployeeModal'));
    document.getElementById('openEmployeeModal').addEventListener('click', function () {
        myModal.show();
    });

});