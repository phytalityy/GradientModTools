(function (plugin) {
    "use strict";

    const React = vendetta.metro.common?.React ?? vendetta.metro.findByProps("createElement");

    const Dispatcher = vendetta.metro.findByProps(
        "dispatch",
        "subscribe"
    );

    const Notifications =
        vendetta.metro.findByProps(
            "showNotification"
        );

    const GRADIENT_SERVER_ID =
        "1506336019828445365";


    // FIX: initialize storage first
    plugin.storage ??= {};

    plugin.storage.enabled ??= true;
    plugin.storage.alertCooldowns ??= {};


    let messageListener = null;


    /*
        ==========================================
        Gradient Notification System
        ==========================================
    */

    function sendAlert(title, message) {

        if (!plugin.storage.enabled)
            return;


        // Android notification attempt
        try {

            if (Notifications?.showNotification) {

                Notifications.showNotification({

                    title: title,

                    body: message

                });

            }

        } catch (e) {

            console.log(
                "[Gradient] Notification failed",
                e
            );

        }


        // Toast fallback
        try {

            vendetta.ui.showToast(
                `${title}\n${message}`
            );

        } catch (e) {

            console.log(
                "[Gradient] Toast failed",
                e
            );

        }

    }



    /*
        ==========================================
        Cooldown
        ==========================================
    */

    function canAlert(
        type,
        cooldown = 10000
    ) {

        const now = Date.now();

        const last =
            plugin.storage.alertCooldowns[type] || 0;


        if (
            now - last < cooldown
        ) {

            return false;

        }


        plugin.storage.alertCooldowns[type] = now;


        return true;

    }



    /*
        ==========================================
        Alert Builder
        ==========================================
    */

    function createAlert(
        user,
        violation,
        evidence,
        punishment,
        severity
    ) {

        if (
            !canAlert(violation)
        ) {

            return;

        }


        const message =

`User: ${user}

Violation:
${violation}

Severity:
${severity}

Evidence:
${evidence}

Recommended:
${punishment}`;


        sendAlert(
            "🚨 Gradient Mod Alert",
            message
        );

    }



    /*
        ==========================================
        Public API
        ==========================================
    */

    plugin.gradient = {

        serverID:
            GRADIENT_SERVER_ID,

        sendAlert,

        createAlert,

        canAlert

    };


    console.log(
        "[Gradient] Core loaded"
    );


    /*
        Part 2 starts below
    */

/*
        ==========================================
        Gradient Rule Database
        ==========================================
    */

    const RULES = {

        toxicity: {

            name: "Toxicity",

            severity: "Low",

            punishment:
                "Warn → Warn → Jail for repeated offenses",

            keywords: [

                "kys",
                "shut up",
                "nobody likes you",
                "you're trash",
                "you are trash",
                "cry",
                "cope",
                "mad",
                "skill issue",
                "ratio"

            ]

        },


        hate: {

            name: "Hate Speech",

            severity: "Critical",

            punishment:
                "Timeout/Jail/Ban depending on severity",

            keywords: [

                "racist",
                "sexist",
                "homophobic",
                "nazi",
                "terrorist"

            ]

        },


        nsfw: {

            name: "NSFW / Gore",

            severity: "High",

            punishment:
                "Remove content + Timeout/Jail/Ban",

            keywords: [

                "porn",
                "nudes",
                "nsfw",
                "naked",
                "explicit",
                "gore",
                "blood",
                "dead body"

            ]

        },


        inappropriate: {

            name: "Inappropriate",

            severity: "Medium",

            punishment:
                "Warn → Timeout → Jail",

            keywords: [

                "sexual",
                "horny",
                "send pics",
                "show me"

            ]

        },


        threats: {

            name:
                "Threats / Doxxing",

            severity:
                "Critical",

            punishment:
                "Jail/Ban depending on severity",

            keywords: [

                "ddos",
                "i will hack",
                "hack you",
                "leak your ip",
                "your address",
                "find your house",
                "kill you"

            ]

        },


        spam: {

            name:
                "Spamming",

            severity:
                "Medium",

            punishment:
                "Warn → Timeout → Jail",

            keywords: [

                "@everyone",
                "@here",
                "everyone ping"

            ]

        },


        advertising: {

            name:
                "Advertising",

            severity:
                "Medium",

            punishment:
                "Remove advertisement + Warn",

            keywords: [

                "discord.gg/",
                "discord.com/invite",
                "join my server",
                "free nitro",
                "youtube.com",
                "tiktok.com"

            ]

        },


        politics: {

            name:
                "Politics",

            severity:
                "Low",

            punishment:
                "Warn → Timeout if continued",

            keywords: [

                "politics",
                "election",
                "president",
                "government"

            ]

        },


        staff: {

            name:
                "Staff Impersonation",

            severity:
                "High",

            punishment:
                "Jail until corrected",

            keywords: [

                "i am staff",
                "i'm staff",
                "i am admin",
                "owner said"

            ]

        }

    };


    /*
        ==========================================
        Basic Scanner
        ==========================================
    */

    function scanMessage(content) {

        if (!content)
            return null;


        const text =
            content.toLowerCase();


        for (
            const ruleID in RULES
        ) {

            const rule =
                RULES[ruleID];


            for (
                const keyword of rule.keywords
            ) {


                if (
                    text.includes(keyword)
                ) {


                    return {

                        id:
                            ruleID,

                        name:
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


    plugin.gradient.rules =
        RULES;


    plugin.gradient.scanMessage =
        scanMessage;


    console.log(
        "[Gradient] Rule engine loaded"
    );


    /*
        Part 3 starts below
        ==========================================
    */

/*
        ==========================================
        Gradient Message Scanner
        ==========================================
    */

    const userMessages = {};


    function checkSpam(
        userID,
        content
    ) {

        const now =
            Date.now();


        if (!userMessages[userID]) {

            userMessages[userID] = [];

        }


        userMessages[userID].push({

            time: now,

            content

        });


        userMessages[userID] =
            userMessages[userID]
            .filter(
                msg =>
                now - msg.time < 5000
            );


        const count =
            userMessages[userID].length;


        if (count >= 6) {

            return {

                name:
                    "Spamming",

                severity:
                    "Medium",

                punishment:
                    "Warn → Timeout → Jail",

                evidence:
                    `${count} messages in 5 seconds`

            };

        }


        return null;

    }



    function advancedScan(content) {

        const text =
            content.toLowerCase();


        const detections = [];


        // Discord invite detection

        if (
            /discord\.gg\/[a-z0-9]+/i
            .test(text)
        ) {

            detections.push({

                name:
                    "Advertising",

                severity:
                    "Medium",

                punishment:
                    "Remove advertisement + Warn",

                evidence:
                    "Discord invite detected"

            });

        }


        // IP address detection

        if (
            /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/
            .test(text)
        ) {

            detections.push({

                name:
                    "Possible Doxxing",

                severity:
                    "Critical",

                punishment:
                    "Hardban depending on severity",

                evidence:
                    "IP address detected"

            });

        }


        const threats = [

            "i will kill you",
            "i will find you",
            "i know where you live",
            "i will leak",
            "i will ddos"

        ];


        for (
            const threat of threats
        ) {

            if (
                text.includes(threat)
            ) {

                detections.push({

                    name:
                        "Threats",

                    severity:
                        "Critical",

                    punishment:
                        "Jail/Ban",

                    evidence:
                        threat

                });

            }

        }


        return detections;

    }



    const originalScanner =
        plugin.gradient.scanMessage;



    plugin.gradient.scanMessage =
        function(content) {


            const normal =
                originalScanner(content);



            if (normal)
                return normal;



            const advanced =
                advancedScan(content);



            if (
                advanced.length > 0
            ) {

                return {

                    name:
                        advanced[0].name,

                    severity:
                        advanced[0].severity,

                    punishment:
                        advanced[0].punishment,

                    keyword:
                        advanced[0].evidence

                };

            }



            return null;

        };




    function scanChatMessage(message) {


        if (!message)
            return;


        const content =
            message.content;


        const author =
            message.author;


        if (
            !author ||
            !content
        )
            return;



        const result =
            plugin.gradient.scanMessage(
                content
            );


        if (result) {


            plugin.gradient.createAlert(

                author.username,

                result.name,

                `"${result.keyword}" detected`,

                result.punishment,

                result.severity

            );


            return;

        }



        const spam =
            checkSpam(
                author.id,
                content
            );



        if (spam) {


            plugin.gradient.createAlert(

                author.username,

                spam.name,

                spam.evidence,

                spam.punishment,

                spam.severity

            );


        }


    }



    /*
        ==========================================
        Discord Message Listener
        ==========================================
    */


    try {

        if (
            Dispatcher?.subscribe
        ) {


            messageListener =
                Dispatcher.subscribe(

                    "MESSAGE_CREATE",

                    (data) => {

                        try {

                            scanChatMessage(
                                data.message
                            );

                        } catch(e) {

                            console.log(
                                "[Gradient] Scan error",
                                e
                            );

                        }

                    }

                );


            console.log(
                "[Gradient] Listener active"
            );


        }


    } catch(e) {


        console.log(
            "[Gradient] Listener failed",
            e
        );


    }



    console.log(
        "[Gradient] Advanced scanner loaded"
    );


    /*
        Part 4 starts below
        ==========================================
    */

/*
        ==========================================
        Gradient Settings
        ==========================================
    */

    plugin.settings = () => {

        return React.createElement(

            "View",

            null,

            React.createElement(

                "Text",

                null,

                "Gradient Mod Alert System"

            )

        );

    };



    /*
        ==========================================
        History System
        ==========================================
    */

    const violationHistory = {};


    function recordViolation(
        userID,
        rule
    ) {


        if (
            !violationHistory[userID]
        ) {

            violationHistory[userID] = [];

        }


        violationHistory[userID].push({

            rule,

            time:
                Date.now()

        });


        violationHistory[userID] =
            violationHistory[userID]
            .filter(

                v =>
                Date.now() - v.time < 86400000

            );


        return violationHistory[userID].length;

    }



    plugin.gradient.recordViolation =
        recordViolation;



    plugin.gradient.getHistory =
        () => violationHistory;



    /*
        ==========================================
        Plugin Cleanup
        ==========================================
    */

    plugin.onUnload = () => {


        try {


            if (
                typeof messageListener === "function"
            ) {

                messageListener();

            }


        } catch(e) {


            console.log(
                "[Gradient] Listener cleanup failed",
                e
            );


        }


        console.log(
            "[Gradient] Unloaded"
        );


    };



    console.log(
        "[Gradient] Fully loaded"
    );



    /*
        ==========================================
        END OF PLUGIN
        ==========================================
    */


    return plugin;


})({});