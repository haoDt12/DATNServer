
document.addEventListener('DOMContentLoaded', function () {
    const Uid = utils.GetCookie("Uid");
    const token = utils.GetCookie("token");
    document.getElementById("save").addEventListener("click",  async function (){
        console.log("u", Uid);
        // console.log("aloalo", Uid);
        // const idUp = document.getElementById("idUser");
        const emailUp = document.getElementById("emailUp");
        const full_nameUp = document.getElementById("full_nameUp");
        const passwordUp = document.getElementById("passwordUp");
        const phone_numberUp = document.getElementById("phone_numberUp");
        const addressUp = document.getElementById("addressUp");
        const imgUp = document.getElementById("avatarUp");
        let Id_user;
        const formDataUp = new FormData();
        formDataUp.append('userId', Uid)
        formDataUp.append('email', emailUp.value)
        formDataUp.append('full_name', full_nameUp.value)
        formDataUp.append('password', passwordUp.value)
        formDataUp.append('phone_number', phone_numberUp.value)
        formDataUp.append('address', addressUp.value)
        formDataUp.append('file', imgUp.files[0])
        console.log(Uid, emailUp.value)
        // await axios.post("/api/editUser", formDataUp, {
        //     headers: {
        //         'Authorization': token
        //     }
        // })
        //     .then(function (response) {
        //         console.log(response);
        //         location.reload();
        //     }).catch(function (error) {
        //         console.log(error);
        //     });
        fetch('/api/editUser', {
            headers: {
                'Authorization': `${token}`
            },
            method: "POST",
            body: formDataUp,
        })
            .then((response) => {
                console.log(response)
                location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        // categoryModal.hide();

    })

})