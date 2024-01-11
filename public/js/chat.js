document.addEventListener("DOMContentLoaded", function () {
    console.log("chat.js");

    let itemConversation = document.querySelectorAll('.conversation')
    itemConversation.forEach(function (item) {
        let idConversation = item.getAttribute("data-id");
        let idConversationSelected = item.getAttribute("data-id-selected");
        if (idConversation == idConversationSelected) {
            item.style.backgroundColor = 'aliceblue';
        }
        else {
            item.style.backgroundColor = '';
        }
        item.addEventListener('click', () => {
            let idMessage = item.getAttribute("data-id-msg");
            let idUserSelected = item.getAttribute("data-id-user");
            getContentMsg2(idConversation, idMessage, idUserSelected);

        })
    })

    async function getContentMsg2(idConSelected, idMsg, idUserSelected) {
        // alert(idConSelected)
        let data = {
            idConSelected, idMsg, idUserSelected
        }
        let mData = btoa(JSON.stringify(data));
        utils.PushCookie("dataChat", encodeURIComponent(mData));
        // document.cookie = 'dataChat=' + encodeURIComponent(mData);
        window.location.href = `/stech.manager/chat/c/`;
    }

    async function getContentMsg(idConSelected, idMsg, idUserSelected) {
        try {
            let xhr = new XMLHttpRequest();
            let endPoint = "/stech.manager/chat/c";
            xhr.open('POST', endPoint, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({ idConSelected, idMsg, idUserSelected }));

            xhr.onload = function () {
                if (xhr.status === 200) {
                    window.location.href = "/stech.manager/chat/c";
                    // alert(xhr.responseText);
                    // console.log(xhr.responseText);
                }
            };
        } catch (error) {
            console.error(error);
        }
    }


});