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
    const DelProModal = new bootstrap.Modal(document.getElementById('DeleteProductModal'));
    const AddCartModal = new bootstrap.Modal(document.getElementById('AddCartModal'));
    // Button call api
    const ConfirmCrePro = document.getElementById("ConfirmCrePro");
    const ConfirmAddCartPro = document.getElementById("ConfirmAddCartPro");
    // Button call modal


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
        // type: {type: String},
        // title: {type: String},
        // content: {type: String},
        // quantity: {type: String},
        // feesArise: {type: String}
    };
    let optionRamRequest = {
        // type: {type: String},
        // title: {type: String},
        // content: {type: String},
        // quantity: {type: String},
        // feesArise: {type: String}
    };
    let optionRomRequest = {
        // type: {type: String},
        // title: {type: String},
        // content: {type: String},
        // quantity: {type: String},
        // feesArise: {type: String}
    };

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
