document.addEventListener('DOMContentLoaded', function () {

    var myModal = new bootstrap.Modal(document.getElementById('UserModal'));
    var myModalUp = new bootstrap.Modal(document.getElementById('updateUserBtn'));
    var myModalDe = new bootstrap.Modal(document.getElementById('deleteUserModal'));


    const deleteProButtons = document.querySelectorAll(".deleteUs");
    const editProButton = document.querySelectorAll(".updateUs");


    const updateProductButton = document.getElementById("updateUser");
    const confirmDeleteButton = document.getElementById("deleteUser");


    document.getElementById('openUserModal').addEventListener('click', function () {
        myModal.show();
    });
    document.getElementById('deleteUserBtn').addEventListener('click', function () {
        myModalDe.show();
    });
    document.getElementById('addUser').addEventListener('click', function () {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const full_name = document.getElementById("full_name").value;
        const phone = document.getElementById("phone").value;
        const role = document.getElementById("role").value;
        const avatar = document.getElementById("avatar").files[0];

        const formData = new FormData();
        formData.append("email", email);
        formData.append("avatar", avatar);
        formData.append("name", password);
        formData.append("full_name", full_name);
        formData.append("phone", phone);
        formData.append("role", role);

        axios.post('/api/registerUser', formData)
            .then((response) => {
                location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
            })
        myModal.hide();
    });
});