document.addEventListener("DOMContentLoaded", function () {

    const socket = io({
        // Socket.IO options
    });

    socket.on('user-chat', (data) => {
        const idUserLoged = utils.GetCookie("Uid");
        const { _id, conversation_id, sender_id, message, message_type, status, created_at, deleted_at } = data;
        let time = created_at.slice(created_at.length - 8, created_at.length - 3);


        let useOtherID = "";
        const conversationView = document.querySelectorAll('.conversation');
        conversationView.forEach(function (item) {
            let conversationID = item.getAttribute("data-id");
            if (conversationID == conversation_id) {
                useOtherID = item.getAttribute("data-id-user");
            }
        });
        const contentMsg = document.querySelectorAll('.content-msg');

        // Display conversation
        contentMsg.forEach(function (item) {
            let conversationID = item.getAttribute("data-id");
            if (conversationID == conversation_id) {
                if (idUserLoged == sender_id) {
                    let newMsg = "Bạn: " + message;
                    item.textContent = newMsg;
                }
                else {
                    item.classList.add("fw-bold", "fst-italic");
                    item.textContent = message;
                }
            }
        });

        // Display Content chat
        let tempID = "658a3921a5355c51652410f5";
        let isFakeChat = document.getElementById("fake-chat").checked;
        if (isFakeChat) {
            displayMessageLeft(_id, message, message_type, time);
        } else {
            if (idUserLoged == sender_id) {
                displayMessageRight(_id, message, message_type, time);
            }
            else {
                displayMessageLeft(_id, message, message_type, time);
            }
        }

        // Scroll latest message
        if (areaMessage) {
            areaMessage.scrollTop = areaMessage.scrollHeight
        }

    })

    const conversationFocus = document.getElementById('conversationFocus');
    const inputMsg = document.getElementById('textMessage');
    const btnSendMsg = document.getElementById('btnSend');
    if (!btnSendMsg) return
    inputMsg.addEventListener('keypress', function (event) {
        if (event.key === "Enter" && event.shiftKey) {
            event.preventDefault();
            const cursorPosition = inputMsg.selectionStart || inputMsg.value.length;
            const value = inputMsg.value;
            const textBeforeCursor = value.substring(0, cursorPosition);
            const textAfterCursor = value.substring(cursorPosition, value.length);

            inputMsg.value = `${textBeforeCursor}\n${textAfterCursor}`;
            const rows = (inputMsg.value.match(/\n/g) || []).length + 1;
            inputMsg.rows = rows < 7 ? rows : 7; // Giới hạn tối đa là 7 hàng
        }
        else if (event.key === "Enter") {
            event.preventDefault();
            btnSendMsg.click();
        }
    });
    btnSendMsg.addEventListener('click', () => {
        let conversationID = conversationFocus.getAttribute('data-id');
        if (conversationID.length <= 0) return
        let contentMsg = inputMsg.value.trim();
        if (contentMsg.length > 0) {
            // Send chat text
            // doSendChat(contentMsg);
            doSendChat2(conversationID, contentMsg, "text", null, null);
        }
    });

    function doSendChat2(conversationID, message, messageType, images, video) {
        let isFakeChat = document.getElementById("fake-chat").checked;
        let idUser = conversationFocus.getAttribute('data-id-user');

        const token = utils.GetCookie("token");
        let senderID = utils.GetCookie("Uid");

        if (isFakeChat) {
            senderID = idUser;
        }

        if (token.length == 0) {
            console.log("error get token");
            return
        }

        if (senderID.length === 0) {
            console.log("error get senderID");
            return
        }

        try {
            const formDataMsg = new FormData();
            formDataMsg.append("conversation_id", conversationID);
            formDataMsg.append("sender_id", senderID);
            formDataMsg.append("message_type", messageType);
            formDataMsg.append("message", message);

            if (images) {
                let listImage = Array.from(images.files);
                listImage.forEach((file) => {
                    formDataMsg.append("images", file);
                });
            } else if (video) {
                formDataMsg.append("video", video.files[0]);
            }

            axios.post('/apiv2/addMessage', formDataMsg, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token
                }
            })
                .then(function (response) {
                    // console.log(response);
                    let data = response.data
                    if (data == null) return
                    if (data.code == 1) {
                        socket.emit('on-chat', {
                            message: data.dataMessage
                        })
                        inputMsg.value = "";
                        document.getElementById('area-upload').innerHTML = '';
                        inputMsg.focus();
                    }
                    else if (data.code == 0) {
                        if (data.message == "wrong token") {
                            window.location.href = "/stech.manager/type_login/";
                        }
                    }
                    else {
                        console.log(`message from server: ${data}`);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }

    }

    const displayMessageRight = (id, message, type, time, images, video,) => {
        var rightChatWrapper = document.createElement('div');
        rightChatWrapper.classList.add('d-flex', 'flex-row-reverse', 'mb-2');

        var rightChatMessage = document.createElement('div');
        rightChatMessage.classList.add('right-chat-message', 'fs-13');

        var rightChatAction = document.createElement('div');
        rightChatAction.classList.add('active-message-right');

        var messageAction = document.createElement('div');
        messageAction.classList.add('mb-0', 'mr-2', 'pr-1');
        messageAction.innerHTML = `
                            <div class="d-flex flex-row fs-6">
                                <i class="chat-action-right-trigger bx bx-dots-vertical-rounded chat-trigger" id='chat-trigger'>
                                    <div class="chat-action-right" id='chat-action-right'>
                                        <div class="d-flex flex-column">
                                            <a id='remove-msg' class="px-4 py-2 fs-3 remove-msg" data-id=${id}>Remove</a>
                                            <a id='forward-msg' class="px-4 py-2 fs-3 forward-msg" data-id=${id}>Forward</a>
                                        </div>
                                    </div>
                                </i>
                            </div>
                            `

        rightChatAction.appendChild(messageAction);
        // Tạo nội dung của tin nhắn bên phải
        var messageContent = document.createElement('div');
        messageContent.classList.add('mb-0', 'mr-3', 'pr-4', 'pb-2');

        // text
        if (message.length > 0) {
            messageContent.innerHTML = '<div class="d-flex flex-row">' +
                `<div class="pr-2">${message}</div></div>`;
        }

        rightChatMessage.appendChild(messageContent);

        // Tạo các tùy chọn của tin nhắn bên phải
        var messageOptions = document.createElement('div');
        messageOptions.classList.add('message-options', 'dark', 'mt-3');

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
        rightChatWrapper.appendChild(rightChatAction);

        // Chèn tin nhắn bên phải vào phần chat panel
        var chatPanel = document.querySelector('.chat-panel-scroll');
        if (chatPanel) {
            var chatPanelContent = chatPanel.querySelector('.p-3');
            if (chatPanelContent) {
                chatPanelContent.appendChild(rightChatWrapper);
            }
        }
    };

    const displayMessageLeft = (id, message, type, time, images, video) => {
        var leftChatMessage = document.createElement('div');
        leftChatMessage.classList.add('left-chat-message', 'fs-13', 'mb-2', 'pb-2');

        // Tạo nội dung của tin nhắn bên trái
        var messageContent = document.createElement('p');
        if (message.length > 0) {
            messageContent.classList.add('mb-0', 'mr-3', 'pr-4');
            messageContent.textContent = `${message}`;
        }
        else if (images.length == 1) {
            messageContent = document.createElement('img');
            messageContent.classList.add('mb-0', 'mr-1', 'mt-1', 'pr-4');
            messageContent.src = images;
            messageContent.style.width = '150px';
            messageContent.style.height = '100px';
            messageContent.style.borderRadius = '8px';
        }
        else if (images.length > 1) {
            const imagesContainer = document.createElement('div');
            messageContent = document.createElement('img');
            images.forEach(image => {
                const imageElement = document.createElement('img');
                imageElement.classList.add('mb-0', 'mr-1', 'mt-1', 'pr-1');
                imageElement.src = image;
                imageElement.style.width = '80px';
                imageElement.style.height = '70px';
                imageElement.style.borderRadius = '8px';

                imagesContainer.appendChild(imageElement);
            });

            messageContent = imagesContainer;
        }

        leftChatMessage.appendChild(messageContent);

        var messageOptions = document.createElement('div');
        messageOptions.classList.add('message-options', 'mt-3');

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
    };

    const emojis = ['🎆', '🎇', '🧨', '🎉', '🎊', '🧧', '🎎',
        '😀', '😎', '😁', '😂', '🤣', '😃', '😄', '😋', '😊', '😉', '😆', '😅', '😍', '😘', '🥰',
        '😗', '😙', '🥲', '🤔', '🤩', '🤗', '🙂', '😚', '🫡', '🤨', '😐', '😑', '😶', '🫥', '😮',
        '😥', '😣', '😏', '🙄', '😶‍🌫️', '🤐', '😯', '😪', '😫', '🥱', '😴', '😒', '🤤', '😝', '😜',
        '😛', '😌', '😓', '😔', '😕', '🫤', '🙃', '🫠', '😞', '😖', '🙁', '☹️', '😲', '🤑', '😟',
        '😤', '😢', '😭', '😦', '😧', '😰', '😮‍💨', '😬', '🤯', '😩', '😨', '😱', '🥵', '🥶', '😳',
        '🤪', '😵', '😷', '🤬', '😡', '😠', '🥴', '😵‍💫', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🤡',
        '🤠', '🥹', '🥺', '🥸', '🥳', '🤥', '🫨', '🤫', '🤭', '🫢', '🫣', '👺', '👹', '👿', '😈',
        '🤓', '🧐', '💀', '☠️', '👻', '👽', '👾', '🤖', '😼', '😻', '😹', '😸', '😺', '💩', '😽',
        '🙀', '😿', '😾', '🙈', '🙉', '🙊', '🐵', '🐶', '🐺', '🐱', '🦁', '🐯', '🦒', '🦊', '🦝',
        '🐮', '🐷', '🐗', '🐭', '🐹', '🐰', '🐻', '🐻‍❄️', '🐨', '🐼', '🐸', '🦓', '🐴', '🫎', '🫏',
        '🦄', '🐔', '🐲', '🐽', '🐾', '🐒', '🦍', '🦧', '🦮', '🐕‍🦺', '🐩', '🐕', '🐈', '🐈‍⬛', '🐅',
        '🐆', '🐎', '🦌', '🦬', '🦏', '🦛', '🐂', '🐃', '🐄', '🐖', '🐏', '🐑', '🐐', '🐪', '🐫',
        '🦙', '🦘', '🦥', '🦨', '🦡', '🐘', '🦣', '🐁', '🐀', '🦔', '🐇', '🐿️', '🦫', '🦎', '🐊',
        '🐢', '🐍', '🐉', '🦕', '🦖', '🦦', '🦈', '🐬', '🦭', '🐳', '🐋', '🐟', '🐠', '🐡', '🦐',
        '🦑', '🐙', '🦞', '🦀', '🐚', '🪸', '🪼', '🦆', '🐓', '🦃', '🦅', '🕊️', '🦢', '🦜', '🪽',
        '🐦‍⬛', '🪿', '🦩', '🦚', '🦉', '🦤', '🪶', '🐦', '🐧', '🐥', '🐤', '🐣', '🦇', '🦋', '🐌',
        '🐛', '🦟', '🪰', '🪱', '🦗', '🐜', '🪳', '🐝', '🪲', '🐞', '🦂', '🕷️', '🕸️', '🦠', '🧞‍♀️',
        '🧞‍♂️', '🧞', '🧟‍♀️', '🧟‍♂️', '🧟', '🧌', '🗣️', '👤', '👥', '🫂', '👁️', '👀', '🦴', '🦷', '👅',
        '👄', '🫦', '🧠', '🫀', '🫁', '🦾', '🦿', '👣', '🤺', '⛷️'
    ];
    const emojiTable = document.getElementById('emoji-table');
    emojis.forEach(emoji => {
        const span = document.createElement('span');
        span.textContent = emoji;
        emojiTable.appendChild(span);

        span.addEventListener('click', () => {
            inputMsg.value += emoji;
        })
    });


    document.addEventListener('click', function (event) {
        const areaEmoji = document.getElementById('area-emoji');
        const areaUpload = document.getElementById('area-upload');

        const isClickInsideEmojiTable = emojiTable.contains(event.target);
        const isClickIconEmoji = document.getElementById('emoji-trigger').contains(event.target);
        const isClickIconUpload = document.getElementById('upload-trigger').contains(event.target);

        if (!isClickInsideEmojiTable) {
            if (!isClickIconEmoji) {
                areaEmoji.classList.remove('active');
            }
            if (!isClickIconUpload) {
                areaUpload.classList.remove('active');
            }
        }
    });

    // const areaMessage = document.getElementById('areaMessage');
    // if (areaMessage) {
    //     areaMessage.scrollTop = areaMessage.scrollHeight;
    //     inputMsg.value = "";
    //     document.getElementById('area-upload').innerHTML = '';
    //     inputMsg.focus();
    // }

});



