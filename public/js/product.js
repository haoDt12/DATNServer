// myscript.js

document.addEventListener('DOMContentLoaded', function () {
    var myModal = new bootstrap.Modal(document.getElementById('productModal'));
    var myModalUp = new bootstrap.Modal(document.getElementById('updateProductBtn'));
    var myModalDe = new bootstrap.Modal(document.getElementById('deleteProductBtn'));

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

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1MzhkZjY4MGFlNDkzMjg4YzA2M2Q2ZCIsImF2YXRhciI6Imh0dHBzOi8vaW5reXRodWF0c28uY29tL3VwbG9hZHMvdGh1bWJuYWlscy84MDAvMjAyMy8wMy85LWFuaC1kYWktZGllbi10cmFuZy1pbmt5dGh1YXRzby0wMy0xNS0yNy0wMy5qcGciLCJlbWFpbCI6ImtpZXV0aGFuaHR1bmcyazNAZ21haWwuY29tIiwicGFzc3dvcmQiOiJUdW5nQDEyMyIsImZ1bGxfbmFtZSI6Imt0dHVuZyIsInBob25lX251bWJlciI6IjA5NzQ1OTQxNzUiLCJyb2xlIjoiVXNlciIsImFkZHJlc3MiOltdLCJkYXRlIjoiMjAyMy0xMC0yNS0xNjoyNjo0NiIsImFjY291bnRfdHlwZSI6IkluZGl2aWR1YWwiLCJvdHAiOiI5NTg0MDEiLCJfX3YiOjB9LCJpYXQiOjE2OTg1Njk3ODYsImV4cCI6MTY5ODU3MzM4Nn0.m6vra3B_JeqOMOH5sZG_irSroCC2MstRb4H--MTXJXk"
    document.getElementById('openProductModal').addEventListener('click', function () {
        myModal.show();
    });
    document.getElementById('updateProductModal').addEventListener('click', function () {
        myModalUp.show();
    });
    document.getElementById('DeleteProductModal').addEventListener('click', function () {
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
        const color = document.getElementById("color").value;
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
                console.log(response)
                // location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        // alert(formData);
        myModal.hide();
        // location.reload();
    });
    document.getElementById('updateProduct').addEventListener('click', function () {
            const proId = this.getAttribute("data-id");
            // console.log(proId);

            const dateProductSelected = {
                productId: proId
            };

            axios.post("http://localhost:3000/api/getProductById", dateProductSelected, {
                headers: {
                    'Authorization': token
                }
            }).then(function (response) {
                let jsonData = response.data.product
                titleUp.value = jsonData.title
                descriptionUp.value = jsonData.description
                img_coverUp.value = jsonData.img_cover
                priceUp.value = jsonData.price
                quantityUp.value = jsonData.quantity
                soldUp.value = jsonData.sold
                videoUp.value = jsonData.video
                colorUp.value = jsonData.color
                list_imgUp.value = jsonData.list_img
                dateUp.value = jsonData.data
                ram_romUp.value = jsonData.ram_rom
            })
                .catch(function (error) {
                    console.log(error);
                });
        myModalUp.hide();
    });
    document.getElementById('confirmDelete').addEventListener('click', function () {
        const proId = this.getAttribute("data-id");
        //- console.log(cateId);

        const dataDelete = new URLSearchParams();
        dataDelete.append("productId", );
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
                    // location.reload();
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        })
        myModalDe.hide();
        // location.reload();
    });
});
