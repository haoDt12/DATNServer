document.addEventListener("DOMContentLoaded", function () {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1Mzc4NDE5YTk1ZWE2NmIzZmZkYTAwZCIsImF2YXRhciI6Imh0dHBzOi8vaW5reXRodWF0c28uY29tL3VwbG9hZHMvdGh1bWJuYWlscy84MDAvMjAyMy8wMy85LWFuaC1kYWktZGllbi10cmFuZy1pbmt5dGh1YXRzby0wMy0xNS0yNy0wMy5qcGciLCJlbWFpbCI6InZ1bmduZ3V5ZW5uMTAwMUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IlZ1bmdAMTIzIiwiZnVsbF9uYW1lIjoiVuG7r25nIiwicGhvbmVfbnVtYmVyIjoiMDM2NjExMjcyNiIsInJvbGUiOiJVc2VyIiwiYWRkcmVzcyI6W10sImRhdGUiOiIyMDIzLTEwLTI0LTE1OjQ0OjM4IiwiYWNjb3VudF90eXBlIjoiSW5kaXZpZHVhbCIsIm90cCI6IjQ0MzM0NCIsIl9fdiI6MH0sImlhdCI6MTY5ODM0MTMzMCwiZXhwIjoxNjk4MzQyMjMwfQ.zcBmf0MofnKvdoNvxlwg_s4_eOdf0laQQAsqUdXg5cM"
    const openCategoryModalButton = document.getElementById("openCategoryModal");
    const openEditCategoryModal = document.getElementById("openEditCategoryModal");
    const categoryModal = new bootstrap.Modal(document.getElementById("categoryModal"));
    const updateCategoryModal = new bootstrap.Modal(document.getElementById("updateCategoryModal"));
    const addToCartModal = new bootstrap.Modal(document.getElementById("addToCartModal"));
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteCate"));
    const saveCategoryButton = document.getElementById("saveCategoryButton");
    const updateCategoryButton = document.getElementById("updateCategoryButton");
    const confirmDeleteButton = document.getElementById("confirmDelete");
    const goCart = document.getElementById("goMyCart");

    const imgCateUpdatePreview = document.getElementById("imageCateUpdatePreview");
    const idCateInput = document.getElementById('idCate');
    const nameCateInput = document.getElementById('nameCateUpdate');
    const dateCateInput = document.getElementById('dateCateUpdate');

    const deleteCateButtons = document.querySelectorAll(".delCate");
    const editCateButton = document.querySelectorAll(".updateCate");

    deleteCateButtons.forEach(function (deleteCateBtn) {
        deleteCateBtn.addEventListener("click", function () {
            confirmDeleteModal.show()
            const cateId = this.getAttribute("data-id");
            //- console.log(cateId);

            const dataDelete = new URLSearchParams();
            dataDelete.append("categoryId", cateId);
            confirmDeleteButton.addEventListener('click', function () {
                //- Delete data
                fetch('http://localhost:3000/api/deleteCategory', {
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

    editCateButton.forEach(function (editCateBtn) {
        editCateBtn.addEventListener("click", function () {
            const cateId = this.getAttribute("data-id");
            console.log(cateId);

            const dateCategorYSelected = {
                categoryId: cateId
            };

            axios.post("http://localhost:3000/api/getCategoryById", dateCategorYSelected, {
                headers: {
                    'Authorization': token
                }
            }).then(function (response) {
                let jsonData = response.data.category
                idCateInput.value = jsonData._id
                imgCateUpdatePreview.src = jsonData.img
                nameCateInput.value = jsonData.title
                dateCateInput.value = jsonData.date
            })
                .catch(function (error) {
                    console.log(error);
                });
        });
    });
    goCart.addEventListener("click", function () {
        alert("Updating")
    });


    saveCategoryButton.addEventListener("click", function () {
        const categoryName = document.getElementById("nameCate").value;
        const dateTime = document.getElementById("dateCate").value;
        const file = document.getElementById("imageCate").files[0];
        const addToCartButton = document.getElementById("addToCartButton");
        // Form Data
        const formData = new FormData();
        formData.append("title", categoryName);
        formData.append("date", dateTime);
        formData.append("file", file);
        //- Push data
        fetch('http://localhost:3000/api/addCategory', {
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
        categoryModal.hide();
    });


    updateCategoryButton.addEventListener("click", function () {
        const idCate = document.getElementById("idCate").value;
        const categoryName = document.getElementById("nameCateUpdate").value;
        const dateTime = document.getElementById("dateCateUpdate").value;
        const file = document.getElementById("imageCateUpdate").files[0];


        console.log(idCate);
        console.log(categoryName);
        console.log(dateTime);
        console.log(file);

        // Form Data
        const formDataUpdate = new FormData();
        formDataUpdate.append("categoryId", idCate);
        formDataUpdate.append("title", categoryName);
        formDataUpdate.append("date", dateTime);
        formDataUpdate.append("file", file);
        //- Push data
        fetch('http://localhost:3000/api/editCategory', {
            headers: {
                'Authorization': `${token}`
            },
            method: "POST",
            body: formDataUpdate,
        })
            .then((response) => {
                console.log(response)
                location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        categoryModal.hide();
    });


    openCategoryModalButton.addEventListener("click", function () {
        categoryModal.show();
    });
    openEditCategoryModal.addEventListener("click", function () {
        updateCategoryModal.show();
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
