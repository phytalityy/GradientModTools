(function() {
"use strict";

const React = vendetta.metro.common.React;
const { findByProps } = vendetta.metro;

const { showToast } = vendetta.ui;
const { getAssetIDByName } = vendetta.ui.assets;

const plugin = vendetta.plugin;

const storage = plugin.storage;


// ================================
// Gradient Mod Tools
// Part 1/5
// Core System
// ================================


storage.enabled ??= true;
storage.sendAndroid ??= true;
storage.webhookURL ??= "";

storage.keywords ??= [
    "discord.gg/",
    "discord.com/invite",
    "free nitro",
    "nsfw",
    "nudes",
    "ddos",
    "hack",
    "kys",
    "@everyone",
    "@here"
];




// ================================
// Cooldown System
// ================================


const cooldowns = {};



function canAlert(type, delay = 10000) {

    const now = Date.now();

    if (
        cooldowns[type] &&
        now - cooldowns[type] < delay
    ) {
        return false;
    }


    cooldowns[type] = now;

    return true;
}




// ================================
// Webhook Sender
// ================================


async function sendWebhook(message) {


    if (
        !storage.webhookURL
    ) return;


    try {


        await fetch(

            storage.webhookURL,

            {

                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },


                body: JSON.stringify({

                    embeds: [

                        {

                            title:
                            "🚨 Gradient Mod Alert",


                            description:
                            message,


                            footer: {

                                text:
                                "Gradient Mod Tools"

                            },


                            timestamp:
                            new Date()
                            .toISOString()

                        }

                    ]

                })

            }

        );


        console.log(
            "[Gradient] Webhook sent"
        );


    } catch(err) {


        console.log(
            "[Gradient] Webhook error",
            err
        );


    }

}




// ================================
// Android Notification Attempt
// ================================


function sendAndroidNotification(
    title,
    body
) {


    if (
        !storage.sendAndroid
    ) return;


    try {


        const Notifications =
        findByProps(
            "showNotification"
        );


        if (
            Notifications?.showNotification
        ) {


            Notifications.showNotification({

                title,

                body

            });


            console.log(
                "[Gradient] Notification sent"
            );

        }


    } catch(err) {


        console.log(
            "[Gradient] Android notification unavailable"
        );


    }

}





// ================================
// Alert Creator
// ================================


function createAlert(
    user,
    violation,
    evidence,
    severity,
    punishment
) {


    if (
        !storage.enabled
    ) return;


    const report =

`**User**
${user}

**Violation**
${violation}

**Severity**
${severity}

**Evidence**
${evidence}

**Recommended Punishment**
${punishment}`;



    sendWebhook(
        report
    );


    sendAndroidNotification(

        "🚨 Gradient Alert",

        `${violation}: ${user}`

    );


}





// ================================
// Export Core
// ================================


const Gradient = {

    canAlert,

    createAlert,

    sendWebhook,

    sendAndroidNotification

};


console.log(
    "[Gradient] Part 1 loaded"
);

// ================================
// Gradient Mod Tools
// Part 2/5
// Webhook + Configuration
// ================================


// Put your Discord webhook URL here

const WEBHOOK_URL =
"https://discord.com/api/webhooks/1528131416326541508/Q-UxcsQOtQitww2wWD0LJMFA4yqyoJep8K0QO43T5y-Lqguww8j9qVVOM8D7c4j-nw7a";



// Apply webhook automatically

storage.webhookURL =
WEBHOOK_URL;



// Default moderation keywords

storage.keywords ??= [

    "discord.gg/",
    "discord.com/invite",

    "free nitro",

    "nsfw",
    "nudes",
    "porn",

    "ddos",
    "ip logger",
    "grabify",

    "kys",

    "@everyone",
    "@here"

];



// Enable by default

storage.enabled ??= true;

storage.sendAndroid ??= true;



console.log(
    "[Gradient] Part 2 loaded - Config ready"
);

// ================================
// Gradient Mod Tools
// Part 3/5
// Message Scanner
// ================================


const Dispatcher =
findByProps(
    "dispatch",
    "subscribe",
    "unsubscribe"
);




const RULES = [

    {

        name:
        "Advertising",

        severity:
        "Medium",

        punishment:
        "Remove advertisement + Warn",

        keywords:
        [
            "discord.gg/",
            "discord.com/invite",
            "join my server",
            "free nitro"
        ]

    },


    {

        name:
        "NSFW Content",

        severity:
        "High",

        punishment:
        "Remove content + Timeout/Jail",

        keywords:
        [
            "nsfw",
            "nudes",
            "porn",
            "explicit"
        ]

    },


    {

        name:
        "Threats",

        severity:
        "Critical",

        punishment:
        "Jail/Ban depending on severity",

        keywords:
        [
            "ddos",
            "hack you",
            "leak your ip",
            "kill you",
            "find your house"
        ]

    },


    {

        name:
        "Toxicity",

        severity:
        "Low",

        punishment:
        "Verbal Warn → Warn",

        keywords:
        [
            "kys",
            "trash",
            "skill issue",
            "nobody likes you",
            "cope"
        ]

    },


    {

        name:
        "Spam",

        severity:
        "Medium",

        punishment:
        "Warn → Timeout",

        keywords:
        [
            "@everyone",
            "@here"
        ]

    }

];






function detectViolation(content) {


    if (
        !content
    )
        return null;



    const text =
    content.toLowerCase();




    for (
        const rule of RULES
    ) {


        for (
            const keyword of rule.keywords
        ) {


            if (
                text.includes(
                    keyword
                )
            ) {


                return {

                    rule:
                    rule.name,


                    severity:
                    rule.severity,


                    punishment:
                    rule.punishment,


                    keyword

                };


            }

        }

    }



    return null;

}





function scanMessage(message) {


    if (
        !message
    )
        return;



    if (
        !message.content ||
        !message.author
    )
        return;



    if (
        message.author.bot
    )
        return;



    if (
        !storage.enabled
    )
        return;




    const result =
    detectViolation(
        message.content
    );



    if (
        !result
    )
        return;





    if (
        !Gradient.canAlert(
            result.rule
        )
    )
        return;





    Gradient.createAlert(

        message.author.username,


        result.rule,


        `Keyword:
${result.keyword}

Message:
${message.content}`,


        result.severity,


        result.punishment

    );


}





let messageListener = null;




try {


    messageListener =
    function(data){


        scanMessage(
            data.message
        );


    };



    Dispatcher.subscribe(

        "MESSAGE_CREATE",

        messageListener

    );



    console.log(
        "[Gradient] Message listener active"
    );



} catch(error) {


    console.log(
        "[Gradient] Listener error",
        error
    );

}



console.log(
    "[Gradient] Part 3 loaded"
);

// ================================
// Gradient Mod Tools
// Part 4/5
// Advanced Detection
// ================================


const userHistory = {};





function addMessageHistory(message) {


    const id =
    message.author?.id;



    if (
        !id
    )
        return;



    userHistory[id] ??= [];



    userHistory[id].push({

        content:
        message.content,


        time:
        Date.now()

    });



    userHistory[id] =
    userHistory[id].filter(

        x =>
        Date.now() - x.time < 10000

    );

}





function checkSpam(message) {


    const id =
    message.author?.id;



    if (
        !id
    )
        return null;



    const history =
    userHistory[id] || [];



    if (
        history.length >= 7
    ) {


        return {

            violation:
            "Message Spam",


            severity:
            "Medium",


            punishment:
            "Warn → Timeout/Jail",


            evidence:
            `${history.length} messages in 10 seconds`

        };

    }



    return null;

}





function checkDuplicates(message) {


    const id =
    message.author?.id;



    if (
        !id
    )
        return null;



    const history =
    userHistory[id] || [];



    const duplicates =
    history.filter(

        x =>
        x.content === message.content

    );



    if (
        duplicates.length >= 3
    ) {


        return {

            violation:
            "Duplicate Spam",


            severity:
            "Medium",


            punishment:
            "Warn → Timeout",


            evidence:
            "Repeated identical messages"

        };

    }



    return null;

}





function checkAdvancedPatterns(message) {


    const text =
    message.content.toLowerCase();





    // IP Address Detection

    if (

        /\b\d{1,3}(\.\d{1,3}){3}\b/
        .test(text)

    ) {


        return {

            violation:
            "Possible Doxxing",


            severity:
            "Critical",


            punishment:
            "Immediate staff review",


            evidence:
            "IP address pattern detected"

        };

    }






    // Suspicious tracking links

    if (

        /(grabify|iplogger|tinyurl|bit\.ly)/
        .test(text)

    ) {


        return {

            violation:
            "Suspicious Link",


            severity:
            "High",


            punishment:
            "Remove link + Investigate",


            evidence:
            "Possible tracking link"

        };

    }






    // Mass Mentions

    const mentions =
    (text.match(/@/g) || [])
    .length;



    if (
        mentions >= 5
    ) {


        return {

            violation:
            "Mass Mention",


            severity:
            "Medium",


            punishment:
            "Warn → Jail",


            evidence:
            `${mentions} mentions detected`

        };

    }



    return null;

}





function advancedScan(message) {


    if (
        !message ||
        !message.author ||
        message.author.bot
    )
        return;



    addMessageHistory(
        message
    );



    const checks = [

        checkSpam(message),

        checkDuplicates(message),

        checkAdvancedPatterns(message)

    ];





    for (
        const result of checks
    ) {


        if (
            result
        ) {


            if (
                Gradient.canAlert(
                    result.violation
                )
            ) {


                Gradient.createAlert(

                    message.author.username,


                    result.violation,


                    result.evidence,


                    result.severity,


                    result.punishment

                );


            }


            break;

        }

    }

}





// Add advanced scanner into existing listener

if (
    Dispatcher &&
    messageListener
) {


    Dispatcher.unsubscribe(

        "MESSAGE_CREATE",

        messageListener

    );



    Dispatcher.subscribe(

        "MESSAGE_CREATE",

        function(data){


            const message =
            data.message;



            scanMessage(
                message
            );


            advancedScan(
                message
            );


        }

    );


}





console.log(
    "[Gradient] Part 4 loaded"
);

// ================================
// Gradient Mod Tools
// Part 5/5
// Final Plugin Export
// ================================



plugin.settings =
Settings;





plugin.onUnload = function() {


    try {


        if (
            Dispatcher &&
            messageListener
        ) {


            Dispatcher.unsubscribe(

                "MESSAGE_CREATE",

                messageListener

            );

        }


    } catch(error) {


        console.log(
            "[Gradient] Cleanup error",
            error
        );


    }



    console.log(
        "[Gradient] Unloaded"
    );


};





console.log(
    "[Gradient] Plugin ready"
);



return plugin;



})();