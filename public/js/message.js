document.addEventListener("DOMContentLoaded", function () {


    const areaMessage = document.getElementById('areaMessage');
    if (areaMessage) {
        areaMessage.scrollTop = areaMessage.scrollHeight;
    }


    const socket = io({
        // Socket.IO options
    });

    socket.on('user-chat', (data) => {
        const { _id, senderId, message, message_type, conversation_id, sender_id, status, created_at, deleted_at } = data

        const conversationView = document.querySelectorAll('.conversation');
        const contentMsg = document.querySelectorAll('.content-msg');


        let time = created_at.slice(created_at.length - 8, created_at.length - 3)

        // Scroll latest message
        if (areaMessage) {
            areaMessage.scrollTop = areaMessage.scrollHeight
        }

        window.location.reload();
    })


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
        let contentMsg = inputMsg.value.trim();
        if (contentMsg.length > 0) {
            // Send chat text
            doSendChat(contentMsg);
        }
    });


    function doSendChat(message) {
        let xhr = new XMLHttpRequest();
        let endPoint = "/stech.manager/create-message";
        xhr.open('POST', endPoint, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ message: message }));

        xhr.onload = function () {
            if (xhr.status === 200) {
                let myData = JSON.parse(xhr.response);
                // console.log(myData);
                switch (myData.code) {
                    case "CREATE_SUCCESS":
                        socket.emit('on-chat', {
                            message: myData.dataMessage
                        })
                        inputMsg.value = "";
                        document.getElementById('area-upload').innerHTML = '';
                        inputMsg.focus();
                        break;

                    default:
                        console.log(xhr.responseText);
                        break;
                }
            }
        };
    }



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

});



