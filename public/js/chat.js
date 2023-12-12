document.addEventListener("DOMContentLoaded", function () {
    console.log("chat.js");

    const detailUser = document.getElementById('detail-user')
    const textUserName = document.getElementById('username')
    const textMessage = document.querySelectorAll('.content-msg')


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
        // console.log(`id old: ${conversationID}`);
        // console.log(`id new: ${conversationIDSelected}`);
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
                    console.log("123");
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
        axios.post('http://localhost:3000/api/updateStatusMessage', {
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
                    window.location.href = "http://localhost:3000/stech.manager/login";
                    return
                }
                callback(null, data.message, data.code);
            })
            .catch(function (error) {
                console.log(error);
                callback(error, 'update status message false', 0);
            });
    }



    const demo = () => {
        // Get data conversation
        const listOtherUser = []
        axios.post('http://localhost:3000/api/getConversationByID', {
            conversationId: conversationID
        }, {
            headers: {
                'Authorization': token
            },
        })
            .then(function (response) {
                let message = response.data.message
                if (message === 'wrong token') {
                    window.location.href = "http://localhost:3000/stech.manager/login";
                    return
                }
                let listIDUser = response.data.conversation.user;
                listIDUser.forEach(idUser => {
                    if (idUser !== idUserLoged) {
                        listOtherUser.push(idUser)
                    }
                });
                if (listOtherUser.length === 1) {
                    userSelected = listOtherUser[0] // only 2 persion
                    getDataUser(userSelected, token)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    const setUser = (dataUser) => {
        // textUserName.innerText = dataUser.full_name;
        // avatarUser.src = dataUser.avatar
    }

    const getDataUser = (idUser, token) => {
        axios.post('http://localhost:3000/api/getUserById', {
            userId: idUser
        }, {
            headers: {
                'Authorization': token
            },
        })
            .then(function (response) {
                let dataUserSelected = response.data.user
                setUser(dataUserSelected)
            })
            .catch(function (error) {
                console.log(error);
            });
    }
});