// myscript.js

document.addEventListener('DOMContentLoaded', function () {
    const token = utils.GetCookie("token");
    
    var myModal = new bootstrap.Modal(document.getElementById('productModal'));
    var myModalUp = new bootstrap.Modal(document.getElementById('updateProductBtn'));
    var myModalDe = new bootstrap.Modal(document.getElementById('DeleteProductModal'));

    const deleteProButtons = document.querySelectorAll(".delPro");
    const editProButton = document.querySelectorAll(".updatePro");

    const updateProductButton = document.getElementById("updateProduct");
    const confirmDeleteButton = document.getElementById("deleteProduct");
    const color = document.getElementById('color');


    const categoryUp = document.getElementById('categoryUp');
    const titleUp = document.getElementById('titleUp');
    const descriptionUp = document.getElementById('descriptionUp');
    const img_coverUp = document.getElementById('img_coverUp');
    const priceUp = document.getElementById('priceUp');
    const quantityUp = document.getElementById('quantityUp');
    const soldUp = document.getElementById('soldUp');
    const videoUp = document.getElementById('videoUp');
    const colorUp = document.getElementById('colorUp');
    const list_imgUp = document.getElementById('list_imgUp');
    const dateUp = document.getElementById('dateUp');
    const ram_romUp = document.getElementById('ram_romUp');

    document.getElementById('openProductModal').addEventListener('click', function () {
        myModal.show();
    });
    document.getElementById('deleteProductBtn').addEventListener('click', function () {
        myModalDe.show();
    });
    
    document.getElementById('addProduct').addEventListener('click', function () {
        // Handle adding the product data here
        // You can use JavaScript to send the product data to your server or perform any desired actions.
        // After adding the product, you can close the modal:

        // const category = document.getElementById("category").value;
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const img_cover = document.getElementById("img_cover").files[0];
        const price = document.getElementById("price").value;
        const quantity = document.getElementById("quantity").value;
        const sold = document.getElementById("sold").value;
        const video = document.getElementById("video").files[0];
        const color = document.querySelectorAll("color").value;
        const list_img = document.getElementById("list_img").files[0];
        const date = document.getElementById("date").value;
        const ram_rom = document.getElementById("ram_rom").value;


        const formData = new FormData();
        formData.append("category", "653aa1fa459df580516ae7d0");
        formData.append("title", title);
        formData.append("description", description);
        formData.append("img_cover", img_cover);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("sold", sold);
        formData.append("video", video);
        formData.append("color", listColor);
        formData.append("list_img", list_img);
        formData.append("date", date);
        formData.append("ram_rom", ram_rom);

        //- Push data
        fetch('/api/addProduct', {
            headers: {
                'Authorization': `${token}`
            },
            method: "POST",
            body: formData,
        })
            .then((response) => {
              //them dk o day nhe
                location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        myModal.hide();
    });
    let listColor = [];
    listColor.push(color)
    let selectedColor;
    color.addEventListener('input', (event) => {
        selectedColor = event.target.value;
        console.log('Selected color:', selectedColor);
        // Xử lý màu đã chọn ở đây
    });
    
    async function getProductById(){
        const proId = this.getAttribute("data-id");
        console.log(proId);
        axios.post("/api/getProductById", dateProductYSelected, {
            headers: {
                'Authorization': `${token}`
            }
        }).then(function (response) {
            let jsonData = response.data.product;              
            categoryUp.value = jsonData.category;
            titleUp.value = jsonData.title
            descriptionUp.value = jsonData.description
            img_coverUp.src = jsonData.img_cover
            priceUp.value = jsonData.price
            quantityUp.value = jsonData.quantity
            soldUp.value = jsonData.sold
            videoUp.src = jsonData.video
            colorUp.value = jsonData.color
            list_imgUp.src = jsonData.list_img
            dateUp.value = jsonData.date
            ram_romUp.value = jsonData.ram_rom
        })
            .catch(function (error) {
                console.log(error);
            });
    }
    editProButton.forEach(function (editProBtn) {
        editProBtn.addEventListener("click", function () {
           

            const dateProductYSelected = {
                productId: proId
            };

           
        });
    });  

    updateProductButton.addEventListener("click", async function(){

        const categoryUp = document.getElementById("categoryUp").value;
        const titleUp = document.getElementById("titleUp").value;
        const descriptionUp = document.getElementById("descriptionUp").value;
        const img_coverUp = document.getElementById("img_coverUp").files[0];
        const priceUp = document.getElementById("priceUp").value;
        const quantityUp = document.getElementById("quantityUp").value;
        const soldUp = document.getElementById("soldUp").value;
        const videoUp = document.getElementById("videoUp").files[0];
        const colorUp = document.getElementById("colorUp").value;
        const list_imgUp = document.getElementById("list_imgUp").files[0];
        const dateUp = document.getElementById("dateUp").value;
        const ram_romUp = document.getElementById("ram_romUp").value;

        const formDataUpdateProduct = new FormData();
        //fix cung productId
        formDataUpdateProduct.append("productId", "653f5fc0d580c8e1b05225bf");
        formDataUpdateProduct.append("category", categoryUp);
        formDataUpdateProduct.append("title", titleUp);
        formDataUpdateProduct.append("description", descriptionUp);
        formDataUpdateProduct.append("img_cover", img_coverUp);
        formDataUpdateProduct.append("price", priceUp);
        formDataUpdateProduct.append("quantity", quantityUp);
        formDataUpdateProduct.append("sold", soldUp);
        formDataUpdateProduct.append("video", videoUp);
        formDataUpdateProduct.append("color", colorUp);
        formDataUpdateProduct.append("list_img", list_imgUp);
        formDataUpdateProduct.append("date", dateUp);
        formDataUpdateProduct.append("ram_rom", ram_romUp);
        await axios.post('/api/editProduct', {
            headers: {
                'Authorization': `${token}`
            },
            method: "POST",
            body: formDataUpdateProduct,
        })
            .then((response) => {
                console.log(response);
                if(response.data.code === 1){
                    alert(response.data.message);
                }else {
                    alert(response.data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        // location.reload();
        myModalUp.hide();
    })

    deleteProButtons.forEach(function (deleteProBtn) {
        deleteProBtn.addEventListener("click", function () {
            myModalDe.show()
            const proId = this.getAttribute("data-id");
            //- console.log(cateId);

            const dataDelete = new URLSearchParams();
            dataDelete.append("productId", proId);
            confirmDeleteButton.addEventListener('click', function () {
                //- Delete data
                fetch('/api/deleteProduct', {
                    headers: {
                        'Authorization': `${token}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    method: "POST",
                    body: dataDelete,
                })
                    .then((response) => {
                        console.log(response)
                        location.reload();
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            })
        });
    });
});
