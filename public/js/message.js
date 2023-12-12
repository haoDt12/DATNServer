document.addEventListener("DOMContentLoaded", function () {

    const socket = io({
        // Socket.IO options
    });

    socket.on('user-chat', (data) => {
        // console.log(data);
        const idUserLoged = utils.GetCookie("Uid");
        const { senderId, message, timestamp, conversation, receiverId, status, deleted, filess, images, video } = data.message

        let time = timestamp.slice(timestamp.length - 8, timestamp.length - 3)
        if (idUserLoged == senderId) {
            if (message.length > 0) {
                displayRight(message, null, null, null, time)
            }
            else if (images.length > 0) {
                displayRight("", null, images, null, time)
            }
            else if (video.length > 0) {
                displayRight("", null, null, video, time)
            }

        }
        else {
            if (message.length > 0) {
                displayLeft(message, null, null, null, time)
            }
            else if (images.length > 0) {
                displayLeft("", null, images, null, time)
            }
            else if (video.length > 0) {
                displayLeft("", null, null, video, time)
            }
        }
        if (areaMessage) {
            areaMessage.scrollTop = areaMessage.scrollHeight
        }
    })

    console.log('message.js');
    const btnChooseFile = document.getElementById('open-file')
    const btnChooseImage = document.getElementById('open-image')

    const avatarUser = document.getElementById('avatar')
    const textUserName = document.getElementById('username')
    const areaImageUpload = document.getElementById('area-image-upload')
    const imgUpload = document.getElementById('img-upload')
    const imageInput = document.getElementById("input-image");
    const videoInput = document.getElementById("input-video");
    let numberImageUpload = 0;
    let numberVideoUpload = 0;
    const areaMessage = document.getElementById('areaMessage')
    if (areaMessage) {
        areaMessage.scrollTop = areaMessage.scrollHeight
    }
    if (btnChooseImage && imageInput) {
        btnChooseImage.addEventListener('click', (e) => {
            imageInput.click()
        })
    }
    if (btnChooseFile) {
        btnChooseFile.addEventListener('click', (e) => {
            videoInput.click()
        })
    }
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const selectedFiles = e.target.files;
            let length = selectedFiles.length
            numberImageUpload = length
        });
    }
    if (videoInput) {
        videoInput.addEventListener('change', (e) => {
            const selectedVideo = e.target.files[0];
            numberVideoUpload = selectedVideo.length;
        })
    }


    const textIDConversation = document.getElementById('idConversation')
    const textIDUserSelected = document.getElementById('idUserSelected')
    const inputMsg = document.getElementById('textMessage')
    const btnSendMsg = document.getElementById('btnSend')
    if (!btnSendMsg) return
    inputMsg.addEventListener('keypress', function (event) {
        if (event.key === "Enter" && event.shiftKey) {
            event.preventDefault()
            const cursorPosition = inputMsg.selectionStart || inputMsg.value.length;
            const value = inputMsg.value;
            const textBeforeCursor = value.substring(0, cursorPosition);
            const textAfterCursor = value.substring(cursorPosition, value.length);

            inputMsg.value = `${textBeforeCursor}\n${textAfterCursor}`;
            const rows = (inputMsg.value.match(/\n/g) || []).length + 1;
            inputMsg.rows = rows < 7 ? rows : 7; // Giới hạn tối đa là 5 hàng
        }
        else if (event.key === "Enter") {
            event.preventDefault()
            btnSendMsg.click()
        }
    })
    btnSendMsg.addEventListener('click', () => {
        let contentMsg = inputMsg.value.trim()
        let idUserSelected = textIDUserSelected.textContent.trim()
        if (idUserSelected.length <= 0) return
        let conversationID = textIDConversation.textContent.trim()
        if (conversationID.length <= 0) return

        if (contentMsg.length <= 0 && numberImageUpload <= 0) return // file + video
        if (contentMsg.length <= 0) {
            if (numberImageUpload <= 0) return
            // only send images
            console.log(imageInput.files);

            handleSendMsg(conversationID, "", idUserSelected, imageInput)
        } else {
            if (numberImageUpload <= 0) {
                // only send text message
                handleSendMsg(conversationID, contentMsg, idUserSelected, null)
            }
            else {
                // send text message + images
                handleSendMsg(conversationID, contentMsg, idUserSelected, imageInput)
            }
        }
    })


    const doSendMsg = (conversationID, receiverID, message, images) => {
        // imageInput.files
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




        try {
            const formDataMsg = new FormData();
            formDataMsg.append("conversation", conversationID);
            formDataMsg.append("senderId", senderID);
            formDataMsg.append("receiverId", receiverID);
            formDataMsg.append("message", message);

            if (images) {
                let listImage = Array.from(images.files)
                listImage.forEach((file) => {
                    formDataMsg.append("images", file);
                });
            }

            axios.post('/api/addMessage', formDataMsg, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token
                }
            })
                .then(function (response) {
                    console.log(response);
                    let data = response.data
                    if (data == null) return
                    if (data.code == 1) {

                        // console.log(`data: ${data.dataMessage.senderId}`);
                        socket.emit('on-chat', {
                            message: data.dataMessage
                        })
                        inputMsg.value = ""
                        document.getElementById('area-upload').innerHTML = ''
                        inputMsg.focus()
                    }
                    else if (data.code == 0) {
                        if (data.message == "wrong token") {
                            window.location.href = "/stech.manager/login/";
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

    const handleSendMsg = (conversationID, message, userSelected, images) => {
        const receiverID = userSelected.length !== 0 ? userSelected : 'no user selected'
        if (receiverID.length === 0) {
            console.log("error send message: require receiverID");
            return
        }
        doSendMsg(conversationID, receiverID, message, images)
    }




    const displayLeft = (message, filess, images, video, time) => {
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
    }

    const displayRight = (message, filess, images, video, time) => {
        // Tạo một phần tử div mới đại diện cho tin nhắn bên phải
        var rightChatWrapper = document.createElement('div');
        rightChatWrapper.classList.add('d-flex', 'flex-row-reverse', 'mb-2');

        var rightChatMessage = document.createElement('div');
        rightChatMessage.classList.add('right-chat-message', 'fs-13', 'mb-2');



        // Tạo nội dung của tin nhắn bên phải
        var messageContent = document.createElement('div');
        messageContent.classList.add('mb-0', 'mr-3', 'pr-4', 'pb-2');

        // text
        if (message.length > 0) {
            messageContent.innerHTML = '<div class="d-flex flex-row">' +
                `<div class="pr-2">${message}</div></div>`;
        }
        // 1 image
        else if (images.length == 1) {
            messageContent.innerHTML = '<div class="d-flex flex-row"><div>' +
                `<img class="pr-6 mb-2" src=${images} width="150" height="100" alt="img" style='border-radius: 8px;'>` +
                '</div></div>';
        }
        // more image
        else if (images.length > 1) {
            let startDiv = `<div class="d-flex flex-row"><div>`;
            let imageDiv = ''
            let enndDiv = `</div></div>`
            images.forEach(image => {
                imageDiv += `<img class="pr-1 mb-2" src=${image} width="80" height="70" alt="img" style='border-radius: 8px;'>`;
            });
            let viewImage = startDiv + imageDiv + enndDiv;
            messageContent.innerHTML = viewImage
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

        // Chèn tin nhắn bên phải vào phần chat panel
        var chatPanel = document.querySelector('.chat-panel-scroll');
        if (chatPanel) {
            var chatPanelContent = chatPanel.querySelector('.p-3');
            if (chatPanelContent) {
                chatPanelContent.appendChild(rightChatWrapper);
            }
        }
    }


    // Danh sách emoji
    const emojis = [
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
            inputMsg.value += emoji
        })
    });

    document.addEventListener('click', function (event) {
        const areaEmoji = document.getElementById('area-emoji')
        const areaUpload = document.getElementById('area-upload')

        const isClickInsideEmojiTable = emojiTable.contains(event.target);
        const isClickIconEmoji = document.getElementById('emoji-trigger').contains(event.target);
        const isClickIconUpload = document.getElementById('upload-trigger').contains(event.target);

        if (!isClickInsideEmojiTable) {
            if (!isClickIconEmoji) {
                areaEmoji.classList.remove('active')
            }
            if (!isClickIconUpload) {
                areaUpload.classList.remove('active')
            }
        }
    });

});

function handleVideoUpload(event) {
    const areaVideoUpload = document.getElementById('area-upload')
    const imgUpload = document.getElementById('video-upload')
    const maxFiles = 1;
    const selectedVideo = event.target.files[0];
    areaVideoUpload.innerHTML = ''
    if (selectedVideo) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const videoContainer = document.createElement('div');

            const video = document.createElement('video');
            video.src = e.target.result;
            video.controls = true;
            video.autoplay = true;
            video.style.width = '320px';
            // video.style.height = '240px';

            const removeIcon = document.createElement('div');
            removeIcon.style.marginLeft = '10px';

            const removeButton = document.createElement('i');
            removeButton.classList.add('bx', 'bxs-x-circle', 'bx-tada-hover');
            removeButton.id = 'remove-upload';
            removeButton.style.cursor = 'pointer';

            removeIcon.appendChild(removeButton);
            videoContainer.appendChild(removeIcon);
            videoContainer.appendChild(video);
            areaVideoUpload.innerHTML = '';
            areaVideoUpload.appendChild(videoContainer);

            removeButton.addEventListener('click', function () {
                videoContainer.remove();
            });
        };
        reader.readAsDataURL(selectedVideo);
        areaVideoUpload.scrollIntoView();
    }

    // if (length > 0) {
    //     areaVideoUpload.style.display = 'block';
    // } else {
    //     areaVideoUpload.style.display = 'none';
    // }
}

function handleImageUpload(event) {
    const areaImageUpload = document.getElementById('area-upload')

    const imgUpload = document.getElementById('img-upload')

    const maxFilesToShow = 3;
    const selectedFiles = event.target.files;
    let length = selectedFiles.length
    if (length > maxFilesToShow) {
        alert('Chọn tối đa 3 ảnh')
        return
    }

    areaImageUpload.innerHTML = '';

    for (let i = 0; i < selectedFiles.length; i++) {
        if (i >= maxFilesToShow) {
            break;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';

            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '150px';
            img.style.height = '150px';
            // img.style.marginRight = '2px';

            const removeIcon = document.createElement('div');
            removeIcon.style.position = 'absolute';
            removeIcon.style.top = '2px';
            removeIcon.style.left = '4px';
            removeIcon.style.fontSize = '18px';

            const removeButton = document.createElement('i');
            removeButton.classList.add('bx', 'bxs-x-circle', 'bx-tada-hover');
            removeButton.id = 'remove-upload';
            removeButton.style.cursor = 'pointer';

            removeIcon.appendChild(removeButton);
            imgContainer.appendChild(removeIcon);
            imgContainer.appendChild(img);
            areaImageUpload.appendChild(imgContainer);

            removeButton.addEventListener('click', function () {
                imgContainer.remove();
            });
        };
        reader.readAsDataURL(selectedFiles[i]);
        areaImageUpload.scrollIntoView();
    }

    if (selectedFiles.length > 0) {
        areaImageUpload.style.display = 'block';
    } else {
        areaImageUpload.style.display = 'none';
    }

    // Hiển thị 1 ảnh
    // if (selectedFiles) {
    //     const reader = new FileReader();
    //     reader.onload = function (e) {
    //         imgUpload.src = e.target.result;
    //         areaImageUpload.style.display = "block";
    //     };
    //     reader.readAsDataURL(selectedFiles[0]);
    // } else {
    //     imgUpload.src = "";
    //     areaImageUpload.style.display = "none";
    // }
}
