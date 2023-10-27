document.addEventListener("DOMContentLoaded", function () {
    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1MzhkZjY4MGFlNDkzMjg4YzA2M2Q2ZCIsImF2YXRhciI6Imh0dHBzOi8vaW5reXRodWF0c28uY29tL3VwbG9hZHMvdGh1bWJuYWlscy84MDAvMjAyMy8wMy85LWFuaC1kYWktZGllbi10cmFuZy1pbmt5dGh1YXRzby0wMy0xNS0yNy0wMy5qcGciLCJlbWFpbCI6ImtpZXV0aGFuaHR1bmcyazNAZ21haWwuY29tIiwicGFzc3dvcmQiOiJUdW5nQDEyMyIsImZ1bGxfbmFtZSI6Imt0dHVuZyIsInBob25lX251bWJlciI6IjA5NzQ1OTQxNzUiLCJyb2xlIjoiVXNlciIsImFkZHJlc3MiOltdLCJkYXRlIjoiMjAyMy0xMC0yNS0xNjoyNjo0NiIsImFjY291bnRfdHlwZSI6IkluZGl2aWR1YWwiLCJvdHAiOiI3MzA0NTUiLCJfX3YiOjB9LCJpYXQiOjE2OTgzMzA1NzgsImV4cCI6MTY5ODMzMTQ3OH0.l41NbMOcaNZPbSAYj2aItef5JIgpi5diHYV9mCbXIRk"
    const openProductModalButton = document.getElementById("openProductModal");
    const openEditProductModal = document.getElementById("openEditProductModal");
    const productModal = new bootstrap.Modal(document.getElementById("productModal"));
    const updateProductModal = new bootstrap.Modal(document.getElementById("updateProductModal"));
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteProduct"));
    const saveProductButton = document.getElementById("saveProductButton");
    const updateProductButton = document.getElementById("updateProductButton");
    const confirmDeleteButton = document.getElementById("confirmDelete");

    // const imgCateUpdatePreview = document.getElementById("imageProUpdatePreview");
    // const idCateInput = document.getElementById('idCate');
    // const nameCateInput = document.getElementById('nameCateUpdate');
    // const dateCateInput = document.getElementById('dateCateUpdate');
    const idPro = document.getElementById("idPro");
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const img_cover = document.getElementById("img_cover");
    const price = document.getElementById("price");
    const quantity = document.getElementById("quantity");
    const sold = document.getElementById("sold");
    const video = document.getElementById("video");
    const color = document.getElementById("color");
    const list_img = document.getElementById("list_img");
    const date = document.getElementById("date");
    const ram_rom = document.getElementById("ram_rom");

    const deleteProButtons = document.querySelectorAll(".delPro");
    const editProButton = document.querySelectorAll(".updatePro");

    deleteProButtons.forEach(function (deleteProBtn) {
        deleteProBtn.addEventListener("click", function () {
            confirmDeleteModal.show()
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

    editProButton.forEach(function (editProBtn) {
        editProBtn.addEventListener("click", function () {
            const proId = this.getAttribute("data-id");
            console.log(proId);

            const dateProgorYSelected = {
                productId: proId
            };

            axios.post("http://localhost:3000/api/getCategoryById", dateProgorYSelected, {
                headers: {
                    'Authorization': token
                }
            }).then(function (response) {
                let jsonData = response.data.product
                idPro.value = jsonData._id
                title.value = jsonData.title
                description.value = jsonData.description
                img_cover.src = jsonData.img_cover
                price.value = jsonData.price
                quantity.value = jsonData.quantity
                sold.value = jsonData.sold
                video.src = jsonData.video
                color.value = jsonData.color
                list_img.src = jsonData.list_img
                date.value = jsonData.date
                ram_rom.value = jsonData.ram_rom
            })
                .catch(function (error) {
                    console.log(error);
                });
        });
    });
     openProductModalButton.addEventListener("click", function () {
        productModal.show();
    });
    saveProductButton.addEventListener("click", function () {
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const img_cover = document.getElementById("img_cover").file[0];
        const price = document.getElementById("price").value;
        const quantity = document.getElementById("quantity").value;
        const sold = document.getElementById("sold").value;
        const video = document.getElementById("video").file[0];
        const color = document.getElementById("color").value;
        const list_img = document.getElementById("list_img").file[0];
        const date = document.getElementById("date").value;
        const ram_rom = document.getElementById("ram_rom").value;
        // Form Data
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("img_cover", img_cover);
        formData.append("price", price);
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
                location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        productModal.hide();
    });


    updateProductButton.addEventListener("click", function () {
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const img_cover = document.getElementById("img_cover").file[0];
        const price = document.getElementById("price").value;
        const quantity = document.getElementById("quantity").value;
        const sold = document.getElementById("sold").value;
        const video = document.getElementById("video").file[0];
        const color = document.getElementById("color").value;
        const list_img = document.getElementById("list_img").file[0];
        const date = document.getElementById("date").value;
        const ram_rom = document.getElementById("ram_rom").value;

        // Form Data
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("img_cover", img_cover);
        formData.append("price", price);
        formData.append("sold", sold);
        formData.append("video", video);
        formData.append("color", color);
        formData.append("list_img", list_img);
        formData.append("date", date);
        formData.append("ram_rom", ram_rom);
        //- Push data
        fetch('http://localhost:3000/api/editProduct', {
            headers: {
                'Authorization': `${token}`
            },
            method: "POST",
            body: formData,
        })
            .then((response) => {
                console.log(response)
                location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        productModal.hide();
    });

   
    openEditProductModal.addEventListener("click", function () {
        updateProductModal.show();
    });
});

function previewImage(event) {
    const fileInput = document.getElementById("imageCate");
    const imageForm = document.getElementById("imageForm");
    const imagePreview = document.getElementById("imagePreview");

    const selectedFile = fileInput.files[0];
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imageForm.style.display = "block"; // Hiển thị phần tử
        };
        reader.readAsDataURL(selectedFile);
    } else {
        imagePreview.src = "";
        imageForm.style.display = "none"; // Ẩn phần tử
    }

}