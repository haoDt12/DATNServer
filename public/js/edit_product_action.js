document.addEventListener('DOMContentLoaded', function (){
    const save_btn = document.getElementById('save');

    const categoryDropdown = document.getElementById('categoryDropdown');
    const dropdown = document.querySelectorAll('.dropdown_item');
    const categorykey = document.getElementById('keyword');
    const tableBody = document.querySelector("#TableOption");


    const myModal = new bootstrap.Modal(document.getElementById('OptionModal'));


    //
    const title = document.getElementById('title');
    const price = document.getElementById('price');
    const quantity = document.getElementById('quantity');
    const description = document.getElementById('description');
    const sold = document.getElementById('sold');
    const img_cover = document.getElementById('img_cover');
    const video = document.getElementById('video');
    const list_img = document.getElementById('list_img');
    //

    const color = document.getElementById('color');
    const content = document.getElementById('content');
    const lableColor = document.getElementById('lableColor');
    const lableContent = document.getElementById('lableContent');
    const save_option = document.getElementById('save_option');
    let token = document.getElementById('textToken').textContent+"";
    let idProduct = document.getElementById('idProduct').textContent+"";4

    console.log(idProduct)



    dropdown.forEach(function (itemDropDown){
        itemDropDown.addEventListener('click',function () {
            let cateId = itemDropDown.getAttribute('data-id')
            categorykey.value = cateId;
            categoryDropdown.style.display = 'none';
        })
    })
    categorykey.addEventListener('click', function () {
        categoryDropdown.style.display = 'block';
    });

    document.getElementById('openAddProductModal').addEventListener('click', function () {
        save_option.style.display = 'none'
        myModal.show();
    });

    const valueOption = document.getElementById('valueOption').value;
    let myArray = JSON.parse(valueOption);

    content.style.display = 'none';
    lableContent.style.display='none'
    OptionType.addEventListener('change', function() {
        let selectedOption = OptionType.value;

        // Ẩn tất cả các trường
        color.style.display = 'none';
        content.style.display = 'none';


        // Nếu Option là 'Color', hiển thị trường màu
        if (selectedOption === 'Color') {
            lableColor.style.display='block'
            lableContent.style.display='none'
            color.style.display = 'block';
        } else {
            // Nếu Option là 'Ram' hoặc 'Rom', hiển thị trường content
            lableColor.style.display='none'
            lableContent.style.display='block'
            content.style.display = 'block';
        }
    });
    img_cover.addEventListener("change", function (event) {
        product_avatar.src = URL.createObjectURL(event.target.files[0]);
        product_avatar.onload = function () {
            URL.revokeObjectURL(product_avatar.src);
        };
    });

    video.addEventListener("change", function (event) {
        let file = event.target.files[0];
        let fileURL = URL.createObjectURL(file);
        video_product.src = fileURL;
    });

    let swiperWrapper = document.querySelector('.swiper-wrapper');
    list_img.addEventListener('change', function (event) {
        let files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let fileURL = URL.createObjectURL(file);
            let imageSlide = document.createElement('div');
            imageSlide.className = 'swiper-slide';
            let imagePreview = document.createElement('img');
            imagePreview.src = fileURL;
            imagePreview.height = 140;
            imagePreview.width = 240;
            imageSlide.appendChild(imagePreview);
            swiperWrapper.appendChild(imageSlide);
        }
        let swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto',
            grabCursor: true,
            centeredSlides: true,
            loop: true,
            allowTouchMove: true,
            spaceBetween: 0,
        });
    });

    document.getElementById('add_option').addEventListener('click', function() {
        console.log(myArray)
        document.getElementById('add_option').style.display = 'block'

        // Lấy giá trị từ các trường input
        let type = document.getElementById('OptionType').value;
        let title = document.getElementById('name').value;
        let fee = document.getElementById('feeArise').value;
        //let content = document.getElementById('content').value;
        let contentValue;

        if (type === 'Color') {
            contentValue = color.value;
        } else {
            contentValue = content.value;
        }

        // Kiểm tra xem các trường có giá trị không
        if (type && title && content&&fee) {
            // Tạo một hàng mới trong mảng
            let newOption = {type, title,content: contentValue ,feesArise: fee};
            console.log(newOption)

            // Thêm hàng mới vào mảng
            myArray.push(newOption);

            updateTable();

            myModal.hide();
        } else {
            // Hiển thị thông báo hoặc thực hiện xử lý khi có lỗi
            alert('Vui lòng điền đầy đủ thông tin.');
        }
    });

    function updateTable() {
        tableBody.innerHTML = '';
        console.log(myArray)
        // Duyệt qua mảng và thêm các dòng mới vào bảng
        for (let i = 0; i < myArray.length; i++) {
            let option = myArray[i];

            // Tạo một hàng mới trong tbody
            let row = document.createElement("tr");
            let indexCell = document.createElement("td");
            indexCell.textContent = i+1;
            row.appendChild(indexCell);

            // Tạo ô dữ liệu cho index

            let fieldsToDisplay = ['type', 'title', 'content', 'feesArise'];
            for (let j = 0; j < fieldsToDisplay.length; j++) {
                let key = fieldsToDisplay[j];
                let value = option[key];

                // Tạo các ô dữ liệu cho từng trường
                let dataCell = document.createElement("td");

                if (key === 'type') {
                    // Nếu là trường type, tạo một td mới cho ::before và một td cho nội dung
                    let typeCell = document.createElement("td");
                    typeCell.textContent = value;
                    row.appendChild(typeCell);
                } else {
                    // Nếu không phải trường type, tạo một td bình thường cho nội dung
                    dataCell.textContent = value;
                    row.appendChild(dataCell);
                }
            }

            // Tạo ô dữ liệu cho action (nút xóa)
            let actionCell = document.createElement("td");
            let editButton = document.createElement("button");
            let deleteButton = document.createElement("button");

            deleteButton.textContent = "Xóa";
            editButton.textContent = "Sửa";

            row.dataset.index = i;
            deleteButton.addEventListener("click", function () {
                // Xử lý sự kiện xóa tại đây
                // Ví dụ: Xóa hàng tương ứng với nút xóa được nhấp
                let rowIndex = parseInt(row.dataset.index);
                deleteRow(rowIndex); // Gọi hàm xóa hàng
            });
            editButton.addEventListener("click", function () {
                let rowIndex = parseInt(row.dataset.index);
                editRow(rowIndex); // Gọi hàm sửa hàng
            });

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            // Thêm hàng vào tbody
            tableBody.appendChild(row);
        }
    }
    updateTable()
    function deleteRow(index) {
        // Xóa hàng khỏi mảng
        myArray.splice(index, 1);

        // Gọi hàm để cập nhật bảng
        updateTable();
    }
    function editRow(index) {
        // Lấy dữ liệu từ mảng tại chỉ mục index
        let editedOption = myArray[index];

        // Hiển thị dữ liệu cần sửa trong modal hoặc nơi khác
        // Ví dụ: gán giá trị cho các trường input trong modal
        document.getElementById('OptionType').value = editedOption.type;
        document.getElementById('name').value = editedOption.title;
        document.getElementById('feeArise').value = editedOption.feesArise;

        // Kiểm tra và hiển thị nội dung hoặc màu sắc tùy thuộc vào loại
        if (editedOption.type === 'Color') {
            // Hiển thị nội dung màu
            document.getElementById('color').value = editedOption.content;
            // Ẩn và hiển thị các trường tương ứng
            document.getElementById('content').style.display = 'none';
            document.getElementById('color').style.display = 'block';
            document.getElementById('lableColor').style.display = 'block';
            document.getElementById('lableContent').style.display = 'none';
        } else {
            // Hiển thị nội dung khác
            document.getElementById('content').value = editedOption.content;
            // Ẩn và hiển thị các trường tương ứng
            document.getElementById('color').style.display = 'none';
            document.getElementById('content').style.display = 'block';
            document.getElementById('lableColor').style.display = 'none';
            document.getElementById('lableContent').style.display = 'block';
        }
        save_option.style.display = 'block'
        document.getElementById('add_option').style.display = 'none'
        save_option.dataset.index = index;
        myModal.show();
        save_option.removeEventListener('click', saveButtonClickHandler);
        save_option.addEventListener('click', saveButtonClickHandler);

        function saveButtonClickHandler() {
            let index = parseInt(save_option.dataset.index);
            let type = document.getElementById('OptionType').value;
            let title = document.getElementById('name').value;
            let fee = document.getElementById('feeArise').value;
            let contentValue;

            if (type === 'Color') {
                contentValue = document.getElementById('color').value;
            } else {
                contentValue = document.getElementById('content').value;
            }

            if (type && title && contentValue && fee) {
                myArray[index] = { type, title, content: contentValue, feesArise: fee };
                updateTable();
                myModal.hide();
            } else {
                alert('Vui lòng điền đầy đủ thông tin.');
            }
        }
    }


    // api
    async function updateProduct(id,category, title, description, img_cover, price,
                                 quantity, sold, video,list_img,option) {
        try {
            var json_option = JSON.stringify(option);
            var formData = new FormData();
            formData.append("productId",id)
            formData.append("category",category)
            formData.append("title",title)
            formData.append("description",description)
            formData.append("price",price)
            formData.append("quantity",quantity)
            formData.append("sold",sold)
            formData.append("img_cover",img_cover)
            list_img.forEach((file) => {
                formData.append("list_img", file);
            });
            formData.append("video",video)
            formData.append("option",json_option)


            const response = await axios.post("/api/editProduct",formData,{
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("data:" + JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
    save_btn.addEventListener("click", function () {
        if (title.value.length <= 0) {
            alert("Chưa chọn title");
            return;
        }
        if (price.value.length <= 0) {
            alert("Chưa chọn giá");
            return;
        }
        if (quantity.value.length <= 0) {
            alert("Chưa chọn quantity");
            return;
        }
        if (description.value.length <= 0) {
            alert("Chưa chọn description");
            return;
        }
        if (categorykey.value.length <= 0) {
            alert("Chưa chọn loại");
            return;
        }
        if (!img_cover) {
            alert("Chưa chọn ảnh");
            return;
        }
        if (myArray.length <= 0) {
            alert("chưa chọn option");
            return;
        }
        if (!video) {
            alert("Chưa chọn video");
            return;
        }
        if (!list_img) {
            alert("Chưa chọn list_img");
            return;
        }
        console.log(idProduct,categorykey.value, title.value, description.value, img_cover.files[0], price.value, quantity.value, "0", video.files[0], Array.from(list_img.files), myArray)
        updateProduct(idProduct,categorykey.value, title.value, description.value, img_cover.files[0], price.value, quantity.value, "0", video.files[0], Array.from(list_img.files), myArray)
            .then(data => {
                console.log(data);
                if (data.code == 1) {
                    location.reload();
                    window.location.href = "/stech.manager/product";
                } else if (data.code == 0) {
                    if (data.message == "wrong token") {
                        window.location.href = "/stech.manager/login/";
                    }
                }
            }).catch(error => {
            console.error('Login error:', error);
        });
    })
})