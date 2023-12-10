document.addEventListener("DOMContentLoaded", function () {

    console.log('message.js');
    const avatarUser = document.getElementById('avatar')
    const textUserName = document.getElementById('username')
    const areaMessage = document.getElementById('areaMessage')
    if (areaMessage) {
        areaMessage.scrollTop = areaMessage.scrollHeight
    }

});