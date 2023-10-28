// myscript.js

document.addEventListener('DOMContentLoaded', function () {
    var myModal = new bootstrap.Modal(document.getElementById('productModal'));

    document.getElementById('openProductModal').addEventListener('click', function () {
        myModal.show();
    });

    document.getElementById('addProduct').addEventListener('click', function () {
        // Handle adding the product data here
        // You can use JavaScript to send the product data to your server or perform any desired actions.
        // After adding the product, you can close the modal:
        alert("hihihi")
        myModal.hide();
        location.reload();
    });
});
