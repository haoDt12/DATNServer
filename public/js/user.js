

document.addEventListener('DOMContentLoaded', function () {
    const token = utils.GetCookie("token");

    var myModal = new bootstrap.Modal(document.getElementById('UserModal'));
    var myModalUp = new bootstrap.Modal(document.getElementById('UpdateUserModal'));
    var myModalDe = new bootstrap.Modal(document.getElementById('deleteUserModal'));


    const deleteProButtons = document.querySelectorAll(".deleteUs");
    const editUserButton = document.querySelectorAll(".updateUs");
    const detailLinks = document.querySelectorAll(".DetailUser");


    const confirmUpdateButton = document.getElementById("UpdateUser");
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
    editUserButton.forEach(function (button){
        button.addEventListener("click", function (){
            myModalUp.show();
            const Id_user= this.getAttribute("data-id");
            const id = document.getElementById("idUser");
            const email = document.getElementById("emailUp");
            const password = document.getElementById("passwordUp");
            const full_name = document.getElementById("full_nameUp");
            const phone_number = document.getElementById("phone_numberUp");
            const role = document.getElementById("roleUp");
            const avatar = document.getElementById("avatarUp");
            console.log(Id_user);
            if (avatar && avatar.files) {
                console.log("img:" + avatar.files[0]);
                // Tiếp tục xử lý khi 'files' tồn tại
            } else {
                console.error("Không thể đọc thuộc tính 'files' vì đối tượng không tồn tại.");
            }
            const dataUser = {
                userId: Id_user
            };
            axios.post("/api/getUserById", dataUser,{
                headers:{
                    'Authorization': token
                }
            })
            .then(function (response) {
                let jsonData = response.data.user
                // if (jsonData && jsonData._id) {
                //     id.value = jsonData._id
                //     email.value = jsonData.email
                //     password.value = jsonData.password
                //     full_name.value = jsonData.full_name
                //     phone_number.value = jsonData.phone_number
                //     role.value = jsonData.role
                //     avatar.src = jsonData.avatar
                //     // Thực hiện các thao tác sử dụng yourObject._id
                // } else {
                //     console.error("Đối tượng không tồn tại hoặc không có thuộc tính '_id'.");
                // }
                id.value = jsonData._id
                email.value = jsonData.email
                password.value = jsonData.password
                full_name.value = jsonData.full_name
                phone_number.value = jsonData.phone_number
                role.value = jsonData.role
                avatar.src = jsonData.avatar
            }).catch(function (error) {
                console.log(error);
            })
        })
    })
    confirmUpdateButton.addEventListener("click",async function (){
        const idUp = document.getElementById("idUser");
        const emailUp = document.getElementById("emailUp");
        const passwordUp = document.getElementById("passwordUp");
        const full_nameUp = document.getElementById("full_nameUp");
        const phone_numberUp = document.getElementById("phone_numberUp");
        const roleUp = document.getElementById("roleUp");
        const imgUp = document.getElementById("avatarUp");
        let Id_user;
        console.log("id:" + idUp.value)
        const formDataUp = new FormData();
        formDataUp.append('userId', idUp.value)
        formDataUp.append('email', emailUp.value)
        formDataUp.append('password', passwordUp.value)
        formDataUp.append('full_name', full_nameUp.value)
        formDataUp.append('phone_number', phone_numberUp.value)
        formDataUp.append('role', roleUp.value)
        formDataUp.append('file', imgUp.files[0])
        await axios.post("/api/editUser", formDataUp, {
            headers: {
                'Authorization': token
            }
        })
            .then(function (response) {
                console.log(response);
                location.reload();
            }).catch(function (error) {
                console.log(error);
            });
    })
    detailLinks.forEach(function(detailLink) {
        detailLink.addEventListener("click", function(event) {
            event.preventDefault();
            var userId = this.getAttribute("data-id");
            var encodedUserId = btoa(userId);
            console.log(encodedUserId); // Xuất mã hóa
            window.location.href = "/stech.manager/detail_user?userId=" + encodedUserId;
        });
    });
});