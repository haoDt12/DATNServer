document.addEventListener("DOMContentLoaded", function () {

    const socket = io({
        // Socket.IO options
    });

    socket.on('user-chat', (data) => {
        // console.log(data);
        const idUserLoged = utils.GetCookie("Uid");
        const { senderId, message, timestamp, conversation, receiverId, status, deleted } = data.message

        // console.log(`get data: senderId: ${senderId} - receiverId: ${receiverId}`);
        // console.log(`user loged: ${idUserLoged}`);
        // return
        let time = timestamp.slice(timestamp.length - 8, timestamp.length - 3)
        if (idUserLoged == senderId) {
            displayRight(message, time)
        }
        else {
            displayLeft(message, time)
        }
        if (areaMessage) {
            areaMessage.scrollTop = areaMessage.scrollHeight
        }
    })

    console.log('message.js');
    const avatarUser = document.getElementById('avatar')
    const textUserName = document.getElementById('username')
    const areaMessage = document.getElementById('areaMessage')
    if (areaMessage) {
        areaMessage.scrollTop = areaMessage.scrollHeight
    }

    const textIDConversation = document.getElementById('idConversation')
    const textIDUserSelected = document.getElementById('idUserSelected')
    const inputMsg = document.getElementById('textMessage')
    const btnSendMsg = document.getElementById('btnSend')
    btnSendMsg.addEventListener('click', () => {
        let contentMsg = inputMsg.value.trim()
        if (contentMsg.length == 0) return
        let idUserSelected = textIDUserSelected.textContent.trim()
        if (idUserSelected.length <= 0) return
        let conversationID = textIDConversation.textContent.trim()
        if (conversationID.length <= 0) return
        handleSendMsg(conversationID, contentMsg, idUserSelected)
    })


    const doSendMsg = (conversationID, receiverID, message) => {
        //  Send message
        const token = utils.GetCookie("token");
        const senderID = utils.GetCookie("Uid");

        if (token.length == 0) {
            console.log("error get token");
            return
        }

        if (senderID.length === 0) {
            console.log("error get senderID");
            return
        }

        if (conversationID.length === 0) {
            console.log("error get ID conversation");
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
                // console.log(response);
                let data = response.data
                if (data == null) return
                if (data.code == 1) {

                    // console.log(`data: ${data.dataMessage.senderId}`);
                    socket.emit('on-chat', {
                        message: data.dataMessage
                    })
                    inputMsg.value = ""
                    inputMsg.focus()
                }
                else if (data.code == 0) {
                    if (data.message == "wrong token") {
                        window.location.href = "/stech.manager/login/";
                    }
                }
                else {
                    console.log("error message.js");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleSendMsg = (conversationID, message, userSelected) => {
        const receiverID = userSelected.length !== 0 ? userSelected : 'no user selected'
        if (receiverID.length === 0) {
            console.log("error send message: require receiverID");
            return
        }
        doSendMsg(conversationID, receiverID, message)
    }




    const displayLeft = (message, time) => {
        var leftChatMessage = document.createElement('div');
        leftChatMessage.classList.add('left-chat-message', 'fs-13', 'mb-2');

        // Tạo nội dung của tin nhắn bên phải
        var messageContent = document.createElement('div');
        messageContent.classList.add('mb-0', 'mr-3', 'pr-4');
        messageContent.textContent = `${message}`;
        leftChatMessage.appendChild(messageContent);

        var messageOptions = document.createElement('div');
        messageOptions.classList.add('message-options');

        var messageTime = document.createElement('div');
        messageTime.classList.add('message-time');

        messageTime.textContent = `${time}`;
        messageOptions.appendChild(messageTime);

        var messageArrow = document.createElement('div');
        messageArrow.classList.add('message-arrow');
        messageArrow.innerHTML = '<i class="text-muted la la-angle-down fs-17"></i>';
        messageOptions.appendChild(messageArrow);

        leftChatMessage.appendChild(messageOptions);

        // Chèn tin nhắn bên phải vào phần chat panel
        var chatPanel = document.querySelector('.chat-panel-scroll');
        if (chatPanel) {
            var chatPanelContent = chatPanel.querySelector('.p-3');
            if (chatPanelContent) {
                chatPanelContent.appendChild(leftChatMessage);
            }
        }
    }

    const displayRight = (message, time) => {
        // Tạo một phần tử div mới đại diện cho tin nhắn bên phải
        var rightChatWrapper = document.createElement('div');
        rightChatWrapper.classList.add('d-flex', 'flex-row-reverse', 'mb-2');

        var rightChatMessage = document.createElement('div');
        rightChatMessage.classList.add('right-chat-message', 'fs-13', 'mb-2');

        // Tạo nội dung của tin nhắn bên phải
        var messageContent = document.createElement('div');
        messageContent.classList.add('mb-0', 'mr-3', 'pr-4');
        messageContent.innerHTML = '<div class="d-flex flex-row">' +
            `<div class="pr-2">${message}</div>` +
            '<div class="pr-4"></div>' +
            '</div>';
        rightChatMessage.appendChild(messageContent);

        // Tạo các tùy chọn của tin nhắn bên phải
        var messageOptions = document.createElement('div');
        messageOptions.classList.add('message-options', 'dark');

        var messageTime = document.createElement('div');
        messageTime.classList.add('message-time');
        messageTime.innerHTML = '<div class="d-flex flex-row">' +
            `<div class="mr-2">${time}</div>` +
            '<div class="svg15 double-check"></div>' +
            '</div>';
        messageOptions.appendChild(messageTime);

        var messageArrow = document.createElement('div');
        messageArrow.classList.add('message-arrow');
        messageArrow.innerHTML = '<i class="text-muted la la-angle-down fs-17"></i>';
        messageOptions.appendChild(messageArrow);

        rightChatMessage.appendChild(messageOptions);

        // Đặt tin nhắn bên phải vào bọc div mới
        rightChatWrapper.appendChild(rightChatMessage);

        // Chèn tin nhắn bên phải vào phần chat panel
        var chatPanel = document.querySelector('.chat-panel-scroll');
        if (chatPanel) {
            var chatPanelContent = chatPanel.querySelector('.p-3');
            if (chatPanelContent) {
                chatPanelContent.appendChild(rightChatWrapper);
            }
        }
    }

});