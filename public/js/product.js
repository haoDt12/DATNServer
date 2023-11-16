document.addEventListener('DOMContentLoaded', function () {
    // get token
    const token = utils.GetCookie("token");
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
    ConfirmCrePro.addEventListener("click", async function () {
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
        // console.log(title.value, description.value, img_cover.files[0], price.value, quantity.value, sold.value, video.files[0], listColor, list_img.files[0], ram_rom.value)
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("img_cover", img_cover);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("sold", sold);
        formData.append("video", video);
        formData.append("color", listColor);
        formData.append("list_img", list_img);
        formData.append("ram_rom", ram_rom);
        formData.append("category", category);
        //- Push data
        fetch('/api/addProduct', {
            headers: {
                'Authorization': `${token}`
            },
            method: "POST",
            body: formData,
        })
            .then(response => {
                // location.reload();
                console.log(response)
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        CreProModal.hide();
        // try {
        //     await axios.post(`/api/addProduct`, {
        //         category: category.value,
        //         title:title.value,
        //         description:description.value,
        //         img_cover: img_cover.files[0],
        //         price:price.value,
        //         quantity:quantity.value,
        //         sold:sold.value,
        //         video:video.files[0],
        //         color:"listColor",
        //         list_img:list_img.files[0],
        //         ram_rom:ram_rom.value
        //     }, {
        //         headers: {
        //             'Authorization': `${token}`
        //         }
        //     }).then(response => {
        //         console.log(response.data);
        //         if (response.data.code === 1) {
        //             utils.showMessage(response.data);
        //             location.reload();
        //         }else {
        //             utils.showMessage(response.data.message);
        //         }
        //     }).catch(error => {
        //         console.error(error);
        //     });
        // } catch (error) {
        //     console.log(error);
        // }
        // CreProModal.hide();
    });

    DeletePro.forEach(function (DeleteProduct){
        DeleteProduct.addEventListener("click", function() {
            DelProModal.show();
            const id_product = this.getAttribute("data-id");
            console.log(id_product);
            ConfirmDelPro.addEventListener("click", function (){
                deleteProduct(id_product).then(data => {
                    if (data.code === 1){
                        console.log(data);
                        DelProModal.hide();
                        location.reload();
                    }else {
                        utils.showMessage(data.message)
                    }
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
                console.error(error);
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
});
