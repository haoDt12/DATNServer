document.addEventListener("DOMContentLoaded", function () {

    console.log("chat.js");

    const detailUser = document.getElementById('detail-user')
    const textUserName = document.getElementById('username')
    const textMessage = document.querySelectorAll('.content-msg')
    const logout = document.getElementById("logout");
    logout.addEventListener("click", function (){
        window.location.assign("/stech.manager/login");
        utils.DeleteAllCookies();
    });

    textMessage.forEach(function (itemMsg) {
        let statusMsg = itemMsg.getAttribute("data-status");
        if (statusMsg == "unseen") {
            itemMsg.classList.add("fw-bold", "fst-italic")
        }
        else if (statusMsg == "seen") {

        }
    })
    let itemConversation = document.querySelectorAll('.conversation')
    itemConversation.forEach(function (item) {
        let conversationID = item.getAttribute("data-id");
        let conversationIDSelected = item.getAttribute("data-id-selected");
        if (conversationID == conversationIDSelected) {
            item.style.backgroundColor = 'aliceblue';
        }
        else {
            item.style.backgroundColor = '';
        }
        item.addEventListener('click', () => {
            const token = utils.GetCookie("token");
            const idUserLoged = utils.GetCookie("Uid");
            console.log(conversationID);
            let messageID = item.getAttribute("data-id-msg");

            doUpdateStatusMsg(token, messageID, "seen", (error, result, code) => {
                if (code === 0) {
                    console.log(error);
                }
                else {
                    // let encodedconversationID = btoa(conversationID);
                    // window.location.href = `/stech.manager/chat/c/${encodedconversationID}/`;
                    console.log(result);
                }
            });
        })
    })

    const doUpdateStatusMsg = (token, idMsg, status, callback) => {
        if (token == null || token.length <= 0) return
        if (idMsg == null || idMsg.length <= 0) return
        if (status == null || status.length <= 0) return
        axios.post('/api/updateStatusMessage', {
            idMsg: idMsg,
            status: status
        }, {
            headers: {
                'Authorization': token
            },
        })
            .then(function (response) {
                let data = response.data
                if (data == null) return
                if (data.message === 'wrong token') {
                    window.location.href = "/stech.manager/login";
                    return
                }
                callback(null, data.message, data.code);
            })
            .catch(function (error) {
                console.log(error);
                callback(error, 'update status message false', 0);
            });
    }
});