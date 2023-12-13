document.addEventListener('DOMContentLoaded', function (){
    const categoryDropdown = document.getElementById('categoryDropdown');
    const dropdown = document.querySelectorAll('.dropdown_item');
    const categorykey = document.getElementById('keyword');
    const tableBody = document.querySelector("#TableOption");


    const myModal = new bootstrap.Modal(document.getElementById('OptionModal'));

    const name = document.getElementById('name');

    const color = document.getElementById('color');
    const content = document.getElementById('content');
    const lableColor = document.getElementById('lableColor');
    const lableContent = document.getElementById('lableContent');

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

    document.getElementById('add_option').addEventListener('click', function() {
        console.log(myArray)
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
        if (type && name && content&&fee) {
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

            // Tạo ô dữ liệu cho index

            // Duyệt qua các trường của đối tượng option
            for (let key in option) {
                let value = option[key];

                // Tạo các ô dữ liệu cho từng trường
                let dataCell = document.createElement("td");
                dataCell.textContent = value;
                row.appendChild(dataCell);
            }

            // Tạo ô dữ liệu cho action (nút xóa)
            let actionCell = document.createElement("td");
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Xóa";
            deleteButton.addEventListener("click", function () {
                // Xử lý sự kiện xóa tại đây
                // Ví dụ: Xóa hàng tương ứng với nút xóa được nhấp
                let row = this.parentNode.parentNode;
                let rowIndex = row.id.split('-')[1]; // Lấy index từ ID
                deleteRow(rowIndex); // Gọi hàm xóa hàng
            });
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            // Thêm hàng vào tbody
            tableBody.appendChild(row);
        }
    }
    function deleteRow(index) {
        // Xóa hàng khỏi mảng
        myArray.splice(index, 1);

        // Gọi hàm để cập nhật bảng
        updateTable();
    }
})