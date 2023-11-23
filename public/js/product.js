document.addEventListener('DOMContentLoaded', function () {
    // get token
    const token = utils.GetCookie("token");
    const detailLinks = document.querySelectorAll(".DetailPro");
    const detailLink = document.getElementById("Detail");
    // Modal
    const CreProModal = new bootstrap.Modal(document.getElementById('CreProModal'));
    const UpProModal = new bootstrap.Modal(document.getElementById('UpProModal'));
    const DelProModal = new bootstrap.Modal(document.getElementById('DelProModal'));
    // Button call api
    const ConfirmCrePro = document.getElementById("ConfirmCrePro");
    const ConfirmUpdate = document.getElementById("ConfirmUpPro");
    const ConfirmDelPro = document.getElementById("ConfirmDelPro");
    // Button call modal
    const DeletePro = document.querySelectorAll(".DeletePro");
    const CreateProduct = document.getElementById("CreateProduct");
    const UpdatePro = document.querySelectorAll(".UpdatePro");

    async function createProduct(category, title, description, img_cover, price,
                                 quantity, sold, video, color, list_img, ram_rom) {
        try {
            const response = await axios.post(`/api/addProduct`, {
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
                    'Authorization': `${token}`
                }
            });
            console.log("data:" + response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    async function updateProduct(productId, category, title, description, img_cover, price, quantity, sold, video, color, list_img, ram_rom) {
        try {
            const response = await axios.post("/api/editProduct", {
                productId: productId,
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
                    'Authorization': `${token}`
                }
            });
            console.log("data:" + response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
    async function deleteProduct(productId) {
        try {
            const response = await axios.post("/api/deleteProduct", {
                productId: productId
            }, {
                headers: {
                    'Authorization': `${token}`
                }
            });
            console.log(response.data);
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
    async function getProduct(productId) {
        try {
            const response = await axios.post("/api/getProductById", {
                productId: productId
            }, {
                headers: {
                    'Authorization': `${token}`
                }
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error)
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
    const category = document.getElementById("category");
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
    const update_category = document.getElementById("update_category");
    const update_title = document.getElementById("update_title");
    const update_description = document.getElementById("update_description");
    const update_img_cover = document.getElementById("update_img_cover");
    const update_price = document.getElementById("update_price");
    const update_quantity = document.getElementById("update_quantity");
    const update_sold = document.getElementById("update_sold");
    const update_video = document.getElementById("update_video");
    const update_color = document.getElementById("update_color");
    const update_list_img = document.getElementById("update_list_img");
    const update_ram_rom = document.getElementById("update_ram_rom");
    let listColor = [];
    let selectedColor;
    color.addEventListener('input', (event) => {
        selectedColor = event.target.value;
        // console.log(selectedColor);
    });
    color.addEventListener("focusout", function (){
        listColor.push(selectedColor);
        console.log(selectedColor)
    });

    CreateProduct.addEventListener("click", function (e){
        CreProModal.show();
    });
    ConfirmCrePro.addEventListener("click", function () {
        console.log(title.value, description.value, img_cover.files[0], price.value, quantity.value, sold.value, video.files[0], listColor, list_img.files[0], ram_rom.value)
        createProduct("654a752e1ab38cd5dd0f7e17", title.value, description.value, img_cover.files[0], price.value, quantity.value, sold.value, video.files[0], listColor, list_img.files[0], ram_rom.value).then(data => {
            console.log(data);
            if (data.code === 1) {
                utils.showMessage(data);
                location.reload();
            }else {
                utils.showMessage(data.message);
            }
        }).catch(error => {
            console.error('Login error:', error);
        });
        CreProModal.hide();
    });

    DeletePro.forEach(function (DeleteProduct){
        DeleteProduct.addEventListener("click", function() {
            DelProModal.show();
            const id_product = this.getAttribute("data-id");
            console.log(id_product);
            ConfirmDelPro.addEventListener("click", function (){
                deleteProduct(id_product).then(data => {
                    console.log(data);
                    DelProModal.hide();
                    location.reload();
                    utils.showMessage(data.message)
                }).catch(error => {
                    console.error('Login error:', error);
                });
            });
        });
    });

    UpdatePro.forEach(function (UpdateProduct){
        UpdateProduct.addEventListener("click", function (){
            let Id_product = this.getAttribute("data-id");
            console.log(Id_product);
            getProduct(Id_product).then(data =>{
                update_category.value = data.product.category;
                update_title.value = data.product.title;
                update_description.value = data.product.description;
                update_img_cover.value = data.product.img_cover;
                update_price.value = data.product.price;
                update_quantity.value = data.product.quantity;
                update_sold.value = data.product.sold;
                // update_color.value = data.product.color;
                update_video.src = data.product.video;
                update_list_img.src = data.product.list_img;
                update_ram_rom.value = data.product.ram_rom;
            }).catch(error => {
                console.error('Login error:', error);
            });
            ConfirmUpdate.addEventListener("click", function () {
                // updateProduct(Id_product, title.value, description.value, img_cover.files[0], price.value, quantity.value, sold.value, video.files[0], listColor, list_img.files[0], ram_rom.value)
                //     .then(data => {
                //     if (data.code === 1) {
                //         UpProModal.hide();
                //         location.reload();
                //     } else {
                //         utils.showMessage(data.message);
                //     }
                // }).catch(error => {
                //     console.error('Login error:', error);
                // });
            });
        });
    });
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
