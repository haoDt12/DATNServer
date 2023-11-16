document.addEventListener('DOMContentLoaded', function () {
    // get token
    const token = utils.GetCookie("token");
    var detailLinks = document.querySelectorAll(".DetailPro");
    var detailLink = document.getElementById("Detail");
    // Modal
    const CreProModal = new bootstrap.Modal(document.getElementById('CreProModal'));
    // const UpProModal = new bootstrap.Modal(document.getElementById('UpProModal'));
    const DelProModal = new bootstrap.Modal(document.getElementById('DelProModal'));
    // Button call api
    const ConfirmCrePro = document.getElementById("ConfirmCrePro");
    // const ConfirmUpdate = document.getElementById("update");
    const ConfirmDelPro = document.getElementById("ConfirmDelPro");
    // Button call modal
    const DeletePro = document.querySelectorAll(".DeletePro");
    const CreateProduct = document.getElementById("CreateProduct");
    console.log(CreateProduct);
    const UpdatePro = document.querySelectorAll(".UpdatePro");

    async function createProduct(category, title, description, img_cover, price, quantity, sold, video, color, list_img, ram_rom) {
        try {
            const response = await axios.post("/api/addProduct", {
                category: category,
                title: title,
                description: description,
                img_cover: img_cover,
                list_img: list_img,
                price: price,
                quantity: quantity,
                sold: sold,
                video: video,
                color: color,
                ram_rom: ram_rom
            }, {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async function deleteProduct(productId) {
        try {
            const response = await axios.post("/api/deleteProduct", {
                productId: productId
            }, {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async function getListCategory() {
        try {
            const response = await axios.post("/api/getListCategory", {
            });
            return response.data;
        } catch (e) {
            console.log(e)
        }
    }
    async function getProduct() {
        try {
            const response = await axios.post("/api/getProductById");
            return response.data;
        } catch (e) {
            console.log(e)
        }
    }

    // async function getListProduct() {
    //     try {
    //         const response = await axios.get("/api/getListProduct", {
    //             headers: {
    //                 'Authorization': `${token}`
    //             }
    //         });
    //         return response.data;
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    CreateProduct.addEventListener("click", function (e){
        CreProModal.show();
    });
    ConfirmCrePro.addEventListener("click", function () {
        const title = document.getElementById("title");
        const description = document.getElementById("description");
        const img_cover = document.getElementById("img_cover");
        const price = document.getElementById("price");
        const quantity = document.getElementById("quantity");
        const sold = document.getElementById("sold");
        const video = document.getElementById("video");
        const color = document.getElementById("color");
        const list_img = document.getElementById("list_img");
        const ram_rom = document.getElementById("ram_rom");
        let Id_product;

        let listColor = [];
        let selectedColor;
        color.addEventListener('input', (event) => {
            selectedColor = event.target.value;
        });
        listColor.push(selectedColor);
        createProduct("654a784a1ab38cd5dd0f7e27", title.value, description.value, img_cover.files[0], price.value, quantity.value, sold.value, video.files[0], listColor.values(), list_img.files[0], ram_rom.value).then(data => {
            if (data.code === 1) {
                utils.showMessage(data.message);
            } else {
                utils.showMessage(data.message);
            }
        }).catch(error => {
            console.error('Login error:', error);
        });
        CreProModal.hide();
    });

    DeletePro.forEach(function (DeleteProduct){
        DeleteProduct.addEventListener("click", function() {
            const Id_product = this.getAttribute("data-id");
            ConfirmDelPro.addEventListener("click", function (){
                deleteProduct(Id_product).then(data => {
                    // if (data.code === 1) {
                    //     DelProModal.hide();
                    //     location.reload();
                    // } else {
                        utils.showMessage(token)
                    // }
                }).catch(error => {
                    console.error('Login error:', error);
                });
            })
        });
    });

    // UpdatePro.forEach(function (UpdateProduct){
    //     UpdateProduct.addEventListener("click", function (){
    //         // Id_product = this.getAttribute("data-id");
    //         getProduct().then(data =>{
    //             title.value = data.product.title;
    //             description.value = data.product.description;
    //             img_cover.src = data.product.img_cover;
    //             price.value = data.product.price;
    //             quantity.value = data.product.quantity;
    //             sold.value = data.product.sold;
    //             color.value = data.product.color;
    //             video.src = data.product.video;
    //             list_img.src = data.product.list_img;
    //             ram_rom.value = data.product.ram_rom;
    //         }).catch(error => {
    //             console.error('Login error:', error);
    //         });
    //     });
    // });
    // ConfirmUpdate.addEventListener("click", function () {
    //     updateProduct(Id_product).then(data => {
    //         if (data.code === 1) {
    //             UpProModal.hide();
    //             location.reload();
    //         } else {
    //             utils.showMessage(data.message);
    //         }
    //     }).catch(error => {
    //         console.error('Login error:', error);
    //     });
    // });

    // function setCookie(name, value) {
    //     document.cookie = `${name}=${value}; path=/`;
    // }
    //     setCookie("productId", productId);
    detailLinks.forEach(function(detailLink) {
        detailLink.addEventListener("click", function(event) {
            event.preventDefault();
            var productId = this.getAttribute("data-id");
            var encodedProductId = btoa(productId);
            console.log(encodedProductId); // Xuất mã hóa
            window.location.href = "/stech.manager/detail_product?productId=" + encodedProductId;
        });
    });
});
