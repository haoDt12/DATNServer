// myscript.js

document.addEventListener('DOMContentLoaded', function () {
    var myModal = new bootstrap.Modal(document.getElementById('productModal'));
    var myModalUp = new bootstrap.Modal(document.getElementById('updateProductBtn'));
    var myModalDe = new bootstrap.Modal(document.getElementById('DeleteProductModal'));

    const deleteProButtons = document.querySelectorAll(".delPro");
    const editProButton = document.querySelectorAll(".updatePro");

    const updateProductButton = document.getElementById("updateProduct");
    const confirmDeleteButton = document.getElementById("deleteProduct");

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

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1MzBiMzhhOWNkNmE0MzgwOTUyNjg0NSIsImF2YXRhciI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9pbWFnZXMvdXNlci82NTMwYjM4YTljZDZhNDM4MDk1MjY4NDUvMGQ5NDkyNTAtM2YwYS00ZGRlLWE5ODMtODRmYzFhYjQxN2E3LmpwZyIsImVtYWlsIjoiZGllbnRjcGgyNzUxMkBmcHQuZWR1LnZuIiwicGFzc3dvcmQiOiJUcmluaGRpZW5AMTIzIiwiZnVsbF9uYW1lIjoiVHLhu4tuaCDEkGnhu4FuIiwicGhvbmVfbnVtYmVyIjoiMDM3MzM2MDYyNCIsInJvbGUiOiJVc2VyIiwiYWRkcmVzcyI6W3siX2lkIjoiNjUzMGUwN2MzNzMxMjhkZDQ5NzUzYTJmIiwibmFtZSI6IlRy4buLbmggQ8O0bmcgxJBp4buBbiIsImRldGFpbCI6IkjDoCBO4buZaSIsInBob25lX251bWJlciI6IjAzNzMzNjA2MjQiLCJkYXRlIjoiMjAyMy0xMC0xOS0xNDo1MzozMiIsIl9fdiI6MH1dLCJkYXRlIjoiMjAyMy0xMC0xOS0xMTo0MTo0NiIsImFjY291bnRfdHlwZSI6IkluZGl2aWR1YWwiLCJfX3YiOjEsIm90cCI6Ijc2MTY2MyJ9LCJpYXQiOjE2OTg2NzkxMDIsImV4cCI6MTY5ODY4MjcwMn0.P-H9CWHes5nQ3FkR-JbslkfdmMVt7Nss0gk7Zru9xBw"
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
        formData.append("color", color);
        formData.append("list_img", list_img);
        formData.append("date", date);
        formData.append("ram_rom", ram_rom);
        //- Push data
        fetch('http://localhost:3000/api/addProduct', {
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
    
    editProButton.forEach(function (editProBtn) {
        editProBtn.addEventListener("click", function () {
            const proId = this.getAttribute("data-id");
            console.log(proId);

            const dateProductYSelected = {
                productId: proId
            };

            axios.post("http://localhost:3000/api/getProductById", dateProductYSelected, {
                headers: {
                    'Authorization': token
                }
            }).then(function (response) {
                let jsonData = response.data.product
                categoryUp.value = jsonData.category._id;
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
        await axios.post('http://localhost:3000/api/editProduct', {
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
                fetch('http://localhost:3000/api/deleteProduct', {
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
