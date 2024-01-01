document.addEventListener('DOMContentLoaded', function () {
    // get token
    const token = utils.GetCookie("token");
    // Modal
    const CreBannerModal = new bootstrap.Modal(document.getElementById('CreBannerModal'));
    const UpBannerModal = new bootstrap.Modal(document.getElementById('UpBannerModal'));
    const DelBannerModal = new bootstrap.Modal(document.getElementById('DelBannerModal'));
    // Button call api
    const ConfirmCreBanner = document.getElementById("ConfirmCreBanner");
    const ConfirmUpdateBanner = document.getElementById("ConfirmUpBanner");
    const ConfirmDelBanner = document.getElementById("ConfirmDelBanner");
    // Button call modal
    const DeleteBanner = document.querySelectorAll(".DeleteBanner");
    const CreateBanner = document.getElementById("CreateBanner");
    console.log(CreateBanner);
    const UpdateBanner = document.querySelectorAll(".UpdateBanner");
    const logout = document.getElementById("logout");
    logout.addEventListener("click", function (){
        window.location.assign("/stech.manager/login");
        utils.DeleteAllCookies();
    });

    CreateBanner.addEventListener("click", function (e){
        CreBannerModal.show();
    });
    ConfirmCreBanner.addEventListener("click", async function () {
        const img = document.getElementById("img");
        let Id_banner;
        console.log("img:" + img.files[0])
        const formData = new FormData();
        formData.append('file', img.files[0])
        await axios.post("/apiv2/addBanner", formData, {
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
        CreBannerModal.hide();
    });
    DeleteBanner.forEach(function (button){
        button.addEventListener("click", function (){
            DelBannerModal.show();
            const Id_banner = this.getAttribute("data-id");
            console.log("img:"+ Id_banner)
            ConfirmDelBanner.addEventListener("click", async function () {
                await axios.post("/api/deleteBanner", {bannerId: Id_banner},{
                    headers: {
                        'Authorization': token
                    }
                })
                .then(function (response) {
                    console.log(response);
                    location.reload();
                }).catch(function (error) {
                    console.log(error);
                })
            })
        })
    })
    UpdateBanner.forEach(function (button){
        button.addEventListener("click", function (){
            UpBannerModal.show();
            const Id_banner = this.getAttribute("data-id");
            const id = document.getElementById("idBanner");
            const imgUp = document.getElementById("imgUp");
            console.log(Id_banner);
            const dataBanner = {
                bannerId: Id_banner
            };
            axios.post("/api/getBannerById", dataBanner,{
                headers: {
                    'Authorization': token
                }
            })
            .then(function (response) {
                let jsonData = response.data.banner
                id.value = jsonData._id
                imgUp.src = jsonData.img
            }).catch(function (error) {
                console.log(error);
            })
        })
    })
    ConfirmUpdateBanner.addEventListener("click",async function (){
        const idUp = document.getElementById("idBanner");
        const imgUp = document.getElementById("imgUp");
        let Id_banner;
        console.log("id:" + idUp.value)
        console.log("img:" + imgUp.files[0])
        const formDataUp = new FormData();
        formDataUp.append('bannerId', idUp.value)
        formDataUp.append('file', imgUp.files[0])
        await axios.post("/api/editBanner", formDataUp, {
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
});
