(function () {
"use strict";


const Dispatcher =
    vendetta.metro.findByProps(
        "dispatch",
        "subscribe",
        "unsubscribe"
    );



// ================================
// CONFIG
// ================================


const WEBHOOK_URL =
"https://discord.com/api/webhooks/1528131416326541508/Q-UxcsQOtQitww2wWD0LJMFA4yqyoJep8K0QO43T5y-Lqguww8j9qVVOM8D7c4j-nw7a";;



const KEYWORDS = [

    "discord.gg",
    "discord.com/invite",

    "free nitro",

    "nsfw",
    "nudes",

    "ddos",
    "ip logger",
    "grabify",

    "hack",

    "kys",

    "@everyone",
    "@here"

];





// ================================
// VARIABLES
// ================================


let listener = null;

let enabled = false;





// ================================
// WEBHOOK
// ================================


async function sendWebhook(content) {


    if (
        WEBHOOK_URL ===
        "PASTE_WEBHOOK_HERE"
    ) {
        return;
    }



    try {


        await fetch(

            WEBHOOK_URL,

            {

                method:
                "POST",


                headers:
                {
                    "Content-Type":
                    "application/json"
                },


                body:
                JSON.stringify({

                    content

                })

            }

        );


    } catch(error) {


        console.log(
            "[Gradient] Webhook failed",
            error
        );


    }

}





// ================================
// SCANNER
// ================================


function scanMessage(message) {


    if (
        !enabled
    )
        return;



    if (
        !message ||
        !message.content ||
        !message.author
    )
        return;



    if (
        message.author.bot
    )
        return;



    const text =
    message.content.toLowerCase();





    for (
        const keyword of KEYWORDS
    ) {


        if (
            text.includes(keyword)
        ) {


            sendWebhook(

`🚨 Gradient Mod Alert

User:
${message.author.username}

User ID:
${message.author.id}

Keyword:
${keyword}

Message:
${message.content}

@everyone`

            );


            break;

        }

    }

}





// ================================
// LOAD
// ================================


function onLoad(){


    if (
        listener
    )
        return;



    enabled = true;



    listener =
    function(data){


        scanMessage(
            data.message
        );


    };



    Dispatcher.subscribe(

        "MESSAGE_CREATE",

        listener

    );



    console.log(
        "[Gradient] Enabled"
    );

}





// ================================
// UNLOAD
// ================================


function onUnload(){


    enabled = false;



    if (
        listener
    ) {


        Dispatcher.unsubscribe(

            "MESSAGE_CREATE",

            listener

        );


        listener = null;

    }



    console.log(
        "[Gradient] Disabled"
    );

}





return {

    onLoad,

    onUnload

};


})();