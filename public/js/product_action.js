document.addEventListener('DOMContentLoaded', function (){
    const save_btn = document.getElementById('save');
    const cancel_btn = document.getElementById('cancel');
    const title = document.getElementById('title');
    const price = document.getElementById('price');
    const quantity = document.getElementById('quantity');
    const description = document.getElementById('description');
    const img_cover = document.getElementById('img_cover');
    const tableBody = document.querySelector("#TableOption");
    const product_avatar = document.getElementById('product_avatar');
    const video = document.getElementById('video');
    const video_product = document.getElementById('video_product');
    const imageList = document.getElementById('imageList');
    const list_img = document.getElementById('list_img');
    const OptionType = document.getElementById('OptionType');
    const name = document.getElementById('name');
    const content = document.getElementById('content');
    const update_option = document.getElementById('update_option');

    let category_select = {
        id: {type: String},
        title: {type: String}
    };
    let option_select = {
        type: {type: String},
        title: {type: String},
        content: {type: String},
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

    async function getListCategory() {
        try {
            const response = await axios.post("/api/getListCategory", {
            });
            return response.data;
        } catch (e) {
            console.log(e)
        }
    }
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

    let myArray = [
        ['Color', 'Trắng', 'ffffff',0],
        ['Ram', 'Trắng', 'ffffff',""],
        ['Color', 'Trắng', 'ffffff', "12233243"],
        ['Rom', 'Trắng', 'ffffff',0],
        ['Color', 'Trắng', 'ffffff', "12233243"]
    ];

    // Duyệt qua các phần tử trong mảng
    for (let i = 0; i < myArray.length; i++) {
        let index = i;
        let subArray = myArray[i];

        // Tạo một hàng mới trong tbody
        let row = document.createElement("tr");

        // Tạo ô dữ liệu cho index
        let indexCell = document.createElement("td");
        indexCell.textContent = index;
        row.appendChild(indexCell);

        // Duyệt qua các phần tử trong mảng con
        for (let j = 0; j < subArray.length; j++) {
            let value = subArray[j];

            // Tạo các ô dữ liệu cho type và color
            let dataCell = document.createElement("td");
            dataCell.textContent = value;
            row.appendChild(dataCell);
        }

        // Tạo ô dữ liệu cho action (nút xóa)
        let actionCell = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Xóa";
        deleteButton.addEventListener("click", function() {
            // Xử lý sự kiện xóa tại đây
            // Ví dụ: Xóa hàng tương ứng với nút xóa được nhấp
            let row = this.parentNode.parentNode;
            tableBody.removeChild(row);
            console.log(index)
        });
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        // Thêm hàng vào tbody
        tableBody.appendChild(row);
    }
});