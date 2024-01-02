document.addEventListener('DOMContentLoaded', function () {
    // get token
    const Uid = utils.GetCookie("Uid");
    const token = utils.GetCookie("token");
    const detailLinks = document.querySelectorAll(".DetailPro");
    const openModalDelete = document.querySelectorAll(".openModalDeleteProduct");
    const detailLink = document.getElementById("Detail");

    //
    const logout = document.getElementById("logout");
    logout.addEventListener("click", function (){
        window.location.assign("/stech.manager/login");
        utils.DeleteAllCookies();
    });
    // Modal
    const DelProModal = new bootstrap.Modal(document.getElementById('DelProModal'));
    const AddCartModal = new bootstrap.Modal(document.getElementById('AddCartModal'));
    // Button call api
    const ConfirmDelPro = document.getElementById("ConfirmDelPro");
    const ConfirmAddCartPro = document.getElementById("ConfirmAddCartPro");
    // Button call modal
    const UpdatePro = document.querySelectorAll(".UpdatePro");
    const AddCartPro = document.querySelectorAll(".AddCartPro");
    const OpenUpdateProduct = document.querySelectorAll(".OpenUpdateProduct");
    const productIdv2 = document.getElementById("productId");
    const userId = Uid;
    let quantityRequest ;

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

    async function deleteProduct(productId) {
        try {
            const response = await axios.post("/api/deleteProduct", {
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
        } catch (e) {
            console.log(e);
        }
    }
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
    const category = document.getElementById("category");
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const img_cover = document.getElementById("img_cover");
    const price = document.getElementById("price");
    const quantity = document.getElementById("quantity");
    const sold = document.getElementById("sold");
    const video = document.getElementById("video");
    const list_img = document.getElementById("list_img");
    const update_category = document.getElementById("update_category");
    const update_title = document.getElementById("update_title");
    const update_description = document.getElementById("update_description");
    const update_img_cover = document.getElementById("update_img_cover");
    const update_price = document.getElementById("update_price");
    const update_quantity = document.getElementById("update_quantity");
    const update_sold = document.getElementById("update_sold");
    const update_video = document.getElementById("update_video");
    const color = document.getElementById("colorDropdown");
    const ram = document.getElementById("ramDropdown");
    const rom = document.getElementById("romDropdown");
    const addimg = document.getElementById('Addimg');
    const addtitle = document.getElementById("Addtitle");
    const addquantity = document.getElementById("Addquantity");
    const productId = document.getElementById("productId")
    let listColor = [];

        } catch (error) {
            console.log(error)
        }
    }

    //DELETE
    openModalDelete.forEach(function (button) {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            console.log(productId)
            document.getElementById('idProductDelete').value = productId;
            DelProModal.show();

        })
    })


    AddCartPro.forEach(function (AddToCart){
        AddToCart.addEventListener("click", function (){
            let product = this.getAttribute("data-id");
            let data_product = JSON.parse(product)
            const total = document.getElementById('total');

            quantityRequest = 1;

            addimg.src =data_product.img_cover;
            addtitle.value = data_product.name;

            ram.value= data_product.ram;
            rom.value = data_product.rom;
            color.value = data_product.color;
            totalData = data_product.price;
            total.value = totalData;
            total.innerText = totalData.toString();
            productIdv2.value = data_product._id;

            addquantity.addEventListener("change", function (){
                totalData = (Number(data_product.price)) * Number(addquantity.value);
                total.innerText = totalData.toString();
                quantityRequest = addquantity.value.toString();
            })



        })
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

    ConfirmAddCartPro.addEventListener("click", async function () {
        if (JSON.stringify(optionRamRequest) !== "{}"){
            optionRequest.push(optionRamRequest);
            console.log(JSON.stringify(optionRamRequest))
        }
        if (JSON.stringify(optionRomRequest) !== "{}"){
            optionRequest.push(optionRomRequest);
        }
        if (JSON.stringify(optionColorRequest) !== "{}"){
            optionRequest.push(optionColorRequest);
        }
        // console.log(optionRequest)
        try {
            const response = await axios.post("/api/addCart", {
                userId: Uid,
                productId: productId,
                quantity: quantityRequest,
                price: priceRequest,
                title: titleRequest,
                imgCover: imgCoverRequest,
                option: optionRequest,
            }, {
                headers: {
                    'Authorization': `${token}`
                }
            });
            console.log(response.data);
            if (response.data.code === 1){
                titleRequest = null;
                quantityRequest = null;
                imgCoverRequest = null;
                priceRequest = null;
                optionRomRequest = {};
                optionRamRequest = {};
                optionColorRequest = {};
                optionRequest = [];
                location.reload();
            }else {
                alert(response.data.message);
                // AddCartModal.hide();
            }
            return response.data;

            // AddCartModal.style.display ='none';
        } catch (error) {
            console.log(error)
        }
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

    OpenUpdateProduct.forEach(function (button){
        button.addEventListener('click', function (event){
            event.preventDefault();
            var  productId = this.getAttribute("data-id");
            document.cookie = 'productId=' + encodeURIComponent(JSON.stringify(productId));
            window.location.href = "/stech.manager/edit_product_action";
        })
    })
});
