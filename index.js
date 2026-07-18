(function () {
"use strict";


const Dispatcher =
    vendetta.metro.findByProps(
        "subscribe",
        "unsubscribe"
    );


const ChannelStore =
    vendetta.metro.findByProps(
        "getChannel"
    );



// ================================
// CONFIG
// ================================


const SERVER_ID =
"1506336019828445365";


const TRACK_CATEGORY_ID =
"1506392513374851082";


const WEBHOOK_URL =
"PASTE_WEBHOOK_HERE";




// ================================
// RULES
// ================================


const RULES = [

{
name:"NSFW",
action:"Imute / Timeout (3h)",
keywords:[
"nsfw",
"nudes",
"porn",
"onlyfans",
"explicit",
"sexual"
]
},


{
name:"Threats / Illegal Activity",
action:"Jail + Higher Staff Review",
keywords:[
"ddos",
"hack you",
"leak your ip",
"find your house",
"swat"
]
},


{
name:"Advertising",
action:"Remove Advertisement + Verbal Warn",
keywords:[
"discord.gg/",
"discord.com/invite",
"join my server",
"free nitro"
]
},


{
name:"Spam",
action:"Warn → Jail/Timeout",
keywords:[
"@everyone",
"@here"
]
},


{
name:"Staff Impersonation",
action:"Jail until corrected",
keywords:[
"i am staff",
"i'm admin",
"owner said"
]
}

];




// ================================
// VARIABLES
// ================================


let messageListener;

let editListener;

let deleteListener;


const spamCache = {};





// ================================
// WEBHOOK
// ================================


async function sendWebhook(content) {


    if (
        WEBHOOK_URL ===
        "PASTE_WEBHOOK_HERE"
    )
    return;


    try {


        await fetch(

            WEBHOOK_URL,

            {

            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                content:content

            })

            }

        );


    }
    catch(e){

        console.log(
            "[Gradient]",
            e
        );

    }

}





// ================================
// CATEGORY LOGGER
// ================================


function logCategoryMessage(message){


    if(
        !message.guild_id ||
        message.guild_id !== SERVER_ID
    )
    return;



    const channel =
    ChannelStore.getChannel(
        message.channel_id
    );



    if(
        !channel
    )
    return;



    if(
        channel.parent_id !==
        TRACK_CATEGORY_ID
    )
    return;



    sendWebhook(

`📨 **Category Message Log**

Server:
${SERVER_ID}

Channel:
<#${channel.id}>

Channel ID:
${channel.id}

User:
<@${message.author.id}>

Username:
${message.author.username}

Message:

${message.content}

Message ID:
${message.id}`

    );

}





// ================================
// KEYWORD SCANNER
// ================================


function scanMessage(message){


    if(
        !message ||
        !message.content ||
        !message.author
    )
    return;



    if(
        message.author.bot
    )
    return;



    if(
        message.guild_id &&
        message.guild_id !== SERVER_ID
    )
    return;



    const text =
    message.content.toLowerCase();



    for(
        const rule of RULES
    ){


        for(
            const keyword of rule.keywords
        ){


            if(
                text.includes(keyword)
            ){


                sendWebhook(

`🚨 **Gradient Mod Alert**

Server:
${SERVER_ID}

Channel:
<#${message.channel_id}>

User:
<@${message.author.id}>

Username:
${message.author.username}

Violation:
${rule.name}

Keyword:
${keyword}

Message:
${message.content}

Recommended:
${rule.action}`

                );


                return;

            }

        }

    }


    checkSpam(message);

    checkFiles(message);

}





// ================================
// ATTACHMENT DETECTOR
// ================================


function checkFiles(message){


    if(
        !message.attachments
    )
    return;



    for(
        const file of Object.values(
            message.attachments
        )
    ){


        const name =
        file.filename?.toLowerCase();



        if(!name)
        continue;



        if(

            name.includes("nsfw") ||
            name.includes("virus") ||
            name.includes("grabify") ||
            name.endsWith(".exe") ||
            name.endsWith(".apk")

        ){


            sendWebhook(

`⚠️ **Suspicious File**

User:
<@${message.author.id}>

File:
${file.filename}

Channel:
<#${message.channel_id}}

Recommended:
Review + Imute/Timeout if needed`

            );


        }

    }

}





// ================================
// SPAM
// ================================


function checkSpam(message){


    const id =
    message.author.id;


    spamCache[id] ??= [];


    spamCache[id].push(
        Date.now()
    );


    spamCache[id] =
    spamCache[id].filter(

        x =>
        Date.now()-x < 5000

    );



    if(
        spamCache[id].length >= 6
    ){


        sendWebhook(

`🚨 **Spam Detection**

User:
<@${id}>

Channel:
<#${message.channel_id}>

Messages:
${spamCache[id].length} in 5 seconds

Recommended:
Warn → Jail/Timeout`

        );


        spamCache[id]=[];

    }

}





// ================================
// LOAD
// ================================


function onLoad(){


    messageListener =
    data => {

        const message =
        data.message;


        logCategoryMessage(
            message
        );


        scanMessage(
            message
        );

    };



    editListener =
    data => {

        scanMessage(
            data.message
        );

    };



    deleteListener =
    data => {


        if(
            data.message
        ){

            sendWebhook(

`🗑️ **Message Deleted**

User:
<@${data.message.author?.id}>

Channel:
${data.message.channel_id}

Content:
${data.message.content}`

            );

        }

    };



    Dispatcher.subscribe(
        "MESSAGE_CREATE",
        messageListener
    );


    Dispatcher.subscribe(
        "MESSAGE_UPDATE",
        editListener
    );


    Dispatcher.subscribe(
        "MESSAGE_DELETE",
        deleteListener
    );


    console.log(
        "[Gradient] Enabled"
    );

}





// ================================
// UNLOAD
// ================================


function onUnload(){


    Dispatcher.unsubscribe(
        "MESSAGE_CREATE",
        messageListener
    );


    Dispatcher.unsubscribe(
        "MESSAGE_UPDATE",
        editListener
    );


    Dispatcher.unsubscribe(
        "MESSAGE_DELETE",
        deleteListener
    );


    console.log(
        "[Gradient] Disabled"
    );

}





return {

    onLoad,

    onUnload

};


})();