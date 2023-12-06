document.addEventListener("DOMContentLoaded", function () {
    // style="background-color: red;" 
    // const socket = io();
    const conversation = document.getElementById('openConversation')
    const textUserName = document.getElementById('username')
    const textUserID = document.getElementById('idUserSelected')
    const avatarUser = document.getElementById('avatar')
    const btnSendMsg = document.getElementById('btnSend')
    const inputMsg = document.getElementById('textMessage')
    const areaMessage = document.getElementById('areaMessage')
    let userSelected = ''
    let conversationID = ''
    let itemConversation = document.querySelectorAll('.conversation')
    itemConversation.forEach(function (item) {
        item.addEventListener('click', () => {
            // window.location.reload()

            conversation.style.display = 'none'
            const token = utils.GetCookie("token");
            const idUserLoged = utils.GetCookie("Uid");
            // Change background color
            itemConversation.forEach((element) => {
                element.style.backgroundColor = '';
            });
            item.style.backgroundColor = 'aliceblue';

            // Handle conversation box
            conversationID = item.getAttribute("data-id");
            // updateconversationID(conversationID)
            // utils.PushCookie("conversationID", conversationID);
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
                        userSelected = listOtherUser[0]
                        getDataUser(userSelected, token)
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });

        })
    })


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

    const setUser = (dataUser) => {
        textUserID.innerText = dataUser._id;
        textUserName.innerText = dataUser.full_name;
        avatarUser.src = dataUser.avatar
        conversation.style.display = 'block'
        areaMessage.scrollTop = areaMessage.scrollHeight
    }

    btnSendMsg.addEventListener('click', () => {
        let contentMsg = inputMsg.value
        if (contentMsg.length == 0) return
        handleSendMsg(contentMsg)
        // Gửi tin nhắn tới server thông qua Socket.IO
        // socket.emit('chat message', contentMsg);
    })

    const doSendMsg = (senderID, receiverID, message) => {
        //  Send message
        const token = utils.GetCookie("token");

        if (conversationID.length === 0) {
            console.log("error get ID conversation");
            return
        }
        if (token.length == 0) {
            console.log("error get token");
            return
        }

        axios.post('http://localhost:3000/api/addMessage', {
            conversation: conversationID,
            senderId: senderID,
            receiverId: receiverID,
            message: message,
        }, {
            headers: {
                'Authorization': token
            },
        })
            .then(function (response) {
                if (response.data.code == 1) {
                    inputMsg.value = ""
                    inputMsg.focus()
                }
                else {

                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const handleSendMsg = (message) => {
        const senderID = utils.GetCookie("Uid");
        const receiverID = userSelected.length !== 0 ? userSelected : 'no user selected'
        if (senderID.length === 0 || receiverID.length === 0) {
            console.log("error send message: require 2 ID User");
            return
        }
        doSendMsg(senderID, receiverID, message)
    }

    const updateconversationID = (id) => {
        const token = utils.GetCookie("token");
        const idUserLoged = utils.GetCookie("Uid");
        axios.post('http://localhost:3000/api/updateconversationID', {
            userId: idUserLoged,
            conversationId: id
        }, {
            headers: {
                'Authorization': token
            },
        })
            .then(function (response) {
                console.log(response);
                if (response.data.code == 1) {
                    // window.location.href = '/stech.manager/chat';
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // socket.on('chat message', (msg) => {
    //     const messageElement = document.createElement('div');
    //     messageElement.textContent = msg;
    //     areaMessage.appendChild(messageElement);
    // });
});