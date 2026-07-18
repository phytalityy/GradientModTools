(function () {
"use strict";


const Dispatcher =
    vendetta.metro.findByProps(
        "subscribe",
        "unsubscribe"
    );


// ================================
// CONFIG
// ================================

const SERVER_ID =
"1506336019828445365";


const WEBHOOK_URL =
"PASTE_WEBHOOK_HERE";



const ENTRY_ACTIONS = {

    NSFW:
    "Imute / Timeout (3h)",

    HATE:
    "Timeout / Jail + Higher Staff Review",

    THREATS:
    "Jail + Higher Staff Review",

    ADVERTISING:
    "Remove Advertisement + Verbal Warn",

    SPAM:
    "Warn → Jail/Timeout",

    IMPERSONATION:
    "Jail until corrected",

    TOXICITY:
    "Verbal Warn → Warn"

};




// ================================
// KEYWORDS
// ================================


const RULES = [

{
type:"NSFW",
keywords:[
"nsfw",
"nudes",
"porn",
"onlyfans",
"explicit",
"sexual",
"send pics"
]
},


{
type:"THREATS",
keywords:[
"ddos",
"i will hack you",
"leak your ip",
"find your house",
"kill you",
"swat you"
]
},


{
type:"ADVERTISING",
keywords:[
"discord.gg/",
"discord.com/invite",
"join my server",
"free nitro"
]
},


{
type:"SPAM",
keywords:[
"@everyone",
"@here",
"ping everyone"
]
},


{
type:"IMPERSONATION",
keywords:[
"i am staff",
"i'm staff",
"i am admin",
"owner said"
]
},


{
type:"TOXICITY",
keywords:[
"kill yourself",
"nobody likes you",
"loser"
]
}

];




// ================================
// TRACKING
// ================================


let listener = null;

let editListener = null;

let deleteListener = null;


let history = {};





// ================================
// WEBHOOK
// ================================


async function webhook(data){


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

                    content:data

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
// ALERT
// ================================


function alertViolation(
message,
rule,
keyword
){


    const user =
    message.author;


    const channel =
    message.channel_id;



    webhook(

`🚨 **Gradient Mod Alert**

**Server**
${SERVER_ID}

**Channel ID**
${channel}

**User**
<@${user.id}>

**Username**
${user.username}

**Violation**
${rule}

**Triggered Keyword**
${keyword}

**Message**
${message.content}

**Recommended Entry Action**
${ENTRY_ACTIONS[rule]}

`

    );

}





// ================================
// KEYWORD SCANNER
// ================================


function scan(message){


    if(
        !message ||
        !message.content ||
        !message.author
    )
    return;



    if(
        message.guild_id &&
        message.guild_id !== SERVER_ID
    )
    return;



    if(
        message.author.bot
    )
    return;



    const text =
    message.content.toLowerCase();



    for(
        const rule of RULES
    ){


        for(
            const word of rule.keywords
        ){


            if(
                text.includes(word)
            ){


                alertViolation(

                    message,

                    rule.type,

                    word

                );


                return;

            }

        }

    }


    checkAttachments(message);


    checkSpam(message);

}





// ================================
// ATTACHMENT SCANNER
// ================================


function checkAttachments(message){


    if(
        !message.attachments
    )
    return;



    const files =
    Object.values(
        message.attachments
    );



    for(
        const file of files
    ){


        const name =
        file.filename?.toLowerCase();



        if(!name)
        continue;



        if(

            name.includes("nsfw") ||
            name.includes("nude") ||
            name.includes("virus") ||
            name.includes("grabify") ||
            name.endsWith(".exe") ||
            name.endsWith(".apk")

        ){


            webhook(

`🚨 **Gradient Attachment Alert**

User:
<@${message.author.id}>

File:
${file.filename}

Channel:
${message.channel_id}

Recommended:
Imute / Timeout

Reason:
Suspicious attachment name`

            );


        }

    }

}





// ================================
// SPAM DETECTION
// ================================


function checkSpam(message){


    const id =
    message.author.id;



    history[id] ??= [];



    history[id].push(
        Date.now()
    );



    history[id] =
    history[id].filter(

        x =>
        Date.now()-x < 5000

    );



    if(
        history[id].length >= 6
    ){


        webhook(

`🚨 **Gradient Spam Alert**

User:
<@${id}>

Channel:
${message.channel_id}

Messages:
${history[id].length} in 5 seconds

Recommended:
Warn → Jail/Timeout`

        );


        history[id]=[];

    }

}





// ================================
// LOAD
// ================================


function onLoad(){


    listener =
    data =>
    scan(data.message);



    Dispatcher.subscribe(

        "MESSAGE_CREATE",

        listener

    );



    editListener =
    data =>
    scan(data.message);



    Dispatcher.subscribe(

        "MESSAGE_UPDATE",

        editListener

    );



    deleteListener =
    data => {


        if(
            data.message
        ){


            webhook(

`⚠️ **Message Deleted**

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


    if(listener)

    Dispatcher.unsubscribe(
        "MESSAGE_CREATE",
        listener
    );


    if(editListener)

    Dispatcher.unsubscribe(
        "MESSAGE_UPDATE",
        editListener
    );


    if(deleteListener)

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