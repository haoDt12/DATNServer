document.addEventListener('DOMContentLoaded', function () {
    // get token
    const Uid = utils.GetCookie("Uid");
    console.log(Uid)
    const token = utils.GetCookie("token");
    const detailLinks = document.querySelectorAll(".DetailPro");
    const detailLink = document.getElementById("Detail");

    //
    const logout = document.getElementById("logout");
    logout.addEventListener("click", function (){
        window.location.assign("/stech.manager/login");
        utils.DeleteAllCookies();
    });
    // Modal
    const CreProModal = new bootstrap.Modal(document.getElementById('CreProModal'));
    const UpProModal = new bootstrap.Modal(document.getElementById('UpProModal'));
    const DelProModal = new bootstrap.Modal(document.getElementById('DelProModal'));
    const AddCartModal = new bootstrap.Modal(document.getElementById('AddCartModal'));
    // Button call api
    const ConfirmCrePro = document.getElementById("ConfirmCrePro");
    const ConfirmUpdate = document.getElementById("ConfirmUpPro");
    const ConfirmDelPro = document.getElementById("ConfirmDelPro");
    const ConfirmAddCartPro = document.getElementById("ConfirmAddCartPro");
    // Button call modal
    const DeletePro = document.querySelectorAll(".DeletePro");

    const OpenUpdate = document.querySelectorAll(".UpdatePro");

    const CreateProduct = document.getElementById("CreateProduct");
    const UpdatePro = document.querySelectorAll(".UpdatePro");
    const AddCartPro = document.querySelectorAll(".AddCartPro");
    const OpenUpdateProduct = document.querySelectorAll(".OpenUpdateProduct");
    const userId = Uid;
    let productId;
    let quantityRequest ;
    let priceRequest ;
    let imgCoverRequest;
    let titleRequest ;
    let optionRequest = [];
    let optionColorRequest = {
        type: {type: String},
        title: {type: String},
        content: {type: String},
        quantity: {type: String},
        feesArise: {type: String}
    };
    let optionRamRequest = {
        type: {type: String},
        title: {type: String},
        content: {type: String},
        quantity: {type: String},
        feesArise: {type: String}
    };
    let optionRomRequest = {
        type: {type: String},
        title: {type: String},
        content: {type: String},
        quantity: {type: String},
        feesArise: {type: String}
    };

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
    const addimg = document.getElementById('Addimg');
    const addtitle = document.getElementById("Addtitle");
    const addquantity = document.getElementById("Addquantity");

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

    // CreateProduct.addEventListener("click", function (e){
    //     CreProModal.show();
    // });

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

    AddCartPro.forEach(function (AddToCart){
        AddToCart.addEventListener("click", function (){
            let Id_product = this.getAttribute("data-id");

            console.log(Id_product);
            getProduct(Id_product).then(data =>{
                if (data.code === 1){
                    const dropdown = document.getElementById('ramDropdown');
                    const dropdownrom = document.getElementById('romDropdown');
                    const dropdowncolor = document.getElementById('colorDropdown');
                    const total = document.getElementById('total');
                    let colorData = data.product.option.filter(item => item.type === "Color")
                    let romData = data.product.option.filter(item => item.type === "Rom")
                    let ramData = data.product.option.filter(item => item.type === "Ram")
                    let totalData = 0;
                    let selectRom =0;
                    let selectRam= 0;
                    quantityRequest = 1;
                    if (ramData.length !== 0){
                        optionRamRequest = ramData[0];
                        document.getElementById('ramAdd').style.display = 'block';
                    }else {
                        document.getElementById('ramAdd').style.display = 'none';
                    }
                    if (romData.length !== 0){
                        optionRomRequest = romData[0];
                        document.getElementById('romAdd').style.display = 'block';
                    }
                    else {
                        document.getElementById('romAdd').style.display = 'none';
                    }
                    if (colorData.length !== 0){
                        optionColorRequest = colorData[0];
                        document.getElementById('colorAdd').style.display = 'block';
                    }else {
                        document.getElementById('colorAdd').style.display = 'none';
                    }
                    console.log(ramData)
                    // Xóa tất cả các option hiện tại
                    dropdown.innerHTML = '';
                    dropdownrom.innerHTML = '';
                    dropdowncolor.innerHTML = '';
                    totalData = data.product.price

                    total.value = totalData;
                    console.log(totalData)
                    // Thêm option mới từ dữ liệu API
                    ramData.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.feesArise;
                        optionElement.textContent = option.title;
                        dropdown.appendChild(optionElement);
                    });
                    romData.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.feesArise;
                        optionElement.textContent = option.title;
                        dropdownrom.appendChild(optionElement);

                    });
                    colorData.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.content;
                        optionElement.textContent = option.title;
                        // optionElement.style.backgroundColor = option.content;
                        dropdowncolor.appendChild(optionElement);

                    });
                    dropdownrom.addEventListener("change", function (){
                        selectRom = dropdownrom.value;
                        totalData = (Number(data.product.price) + Number(selectRam) + Number(selectRom)) * Number(addquantity.value);
                        total.innerText = totalData.toString();
                        const selectedOption = dropdownrom.options[dropdownrom.selectedIndex];
                        romData.map(item => {
                            if (item.title === selectedOption.innerText){
                                optionRomRequest.title = item.title;
                                optionRomRequest.content = item.content;
                                optionRomRequest.quantity = item.quantity;
                                optionRomRequest.feesArise = item.feesArise;
                                optionRomRequest.type = item.type;
                            }
                        })
                        console.log(optionRomRequest)
                    })
                    dropdown.addEventListener("change", function (){
                        selectRam = dropdown.value;
                        totalData = (Number(data.product.price) + Number(selectRam) + Number(selectRom)) * Number(addquantity.value);
                        total.innerText = totalData.toString();
                        const selectedRamOption = dropdown.options[dropdown.selectedIndex];
                        ramData.map(item => {
                            if (item.title === selectedRamOption.innerText){
                                optionRamRequest.title = item.title;
                                optionRamRequest.content = item.content;
                                optionRamRequest.feesArise = item.feesArise;
                                optionRamRequest.quantity = item.quantity;
                                optionRamRequest.type = item.type;
                            }
                        })

                    })
                    dropdowncolor.addEventListener("change", function (){
                        selectedColor = dropdowncolor.value;
                        totalData = (Number(data.product.price) + Number(selectRam) + Number(selectRom)) * Number(addquantity.value);
                        total.innerText = totalData.toString();
                        const selectedColorOption = dropdowncolor.options[dropdowncolor.selectedIndex];
                        colorData.map(item => {
                            if (item.title === selectedColorOption.innerText){
                                optionColorRequest.title = item.title;
                                optionColorRequest.content = item.content;
                                optionColorRequest.feesArise = item.feesArise;
                                optionColorRequest.quantity = item.quantity;
                                optionColorRequest.type = item.type;
                                // alert(item.quantity);
                            }
                        })

                    })
                    console.log(data.product.option)
                    addimg.src = data.product.img_cover;
                    addtitle.value = data.product.title;

                    titleRequest = data.product.title;
                    imgCoverRequest = data.product.img_cover;
                    priceRequest = data.product.price;
                    productId = data.product._id;
                    total.innerText = totalData.toString();

                    addquantity.addEventListener("change", function (){
                        totalData = (Number(data.product.price) + Number(selectRam) + Number(selectRom)) * Number(addquantity.value);
                        total.innerText = totalData.toString();
                        quantityRequest = addquantity.value.toString();
                    })

                }
            }).catch(error => {
                console.error('Login error:', error);
            });
        })
    });

    ConfirmAddCartPro.addEventListener("click", async function () {
        if (Object.keys(optionRamRequest).length){
            optionRequest.push(optionRamRequest);
        }
        if (Object.keys(optionRomRequest).length){
            optionRequest.push(optionRomRequest);
        }
        if (Object.keys(optionColorRequest).length){
            optionRequest.push(optionColorRequest);
        }
        console.log(optionRequest)
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

    OpenUpdateProduct.forEach(function (button){
        button.addEventListener('click', function (event){
            event.preventDefault();
            var  productId = this.getAttribute("data-id");
            document.cookie = 'productId=' + encodeURIComponent(JSON.stringify(productId));
            window.location.href = "/stech.manager/edit_product_action";
        })
    })



});
