// Revenge Vendetta Delete - Updated with your recommendations

(function () {
"use strict";

const Dispatcher = vendetta.metro.findByProps("subscribe", "unsubscribe");

const config = {
    webhookUrl: "https://discord.com/api/webhooks/1528131416326541508/Q-UxcsQOtQitww2wWD0LJMFA4yqyoJep8K0QO43T5y-Lqguww8j9qVVOM8D7c4j-nw7a",
    logWebhookUrl: "https://discord.com/api/webhooks/1528185137739595779/FRBC5Ysv0t81Jvh8-eU2uu7PtbV_ZvHgdi_VDtPKcMXby2glNRR02z3OjzABVqVPqnFx",
    sayCommand: ",s",
    delayMs: 500,
};

async function sendWebhook(url, content) {
    try {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: content, username: "Revenge Logger" })
        });
    } catch (e) {}
}

let deleteListener;

function onLoad() {
    sendWebhook(config.logWebhookUrl, "**RevengeVendetta** Plugin loaded and hooking...");

    deleteListener = (data) => {
        const msg = data.message || data;

        const channelId = msg?.channel_id ?? msg?.channelId;

        sendWebhook(config.webhookUrl, 
`**DELETED MESSAGE DETECTED**
Author: ${msg?.author?.username || msg?.author?.id || "Unknown"}
Author ID: ${msg?.author?.id || "Unknown"}
Content: ${msg?.content || "[no content]"}
Channel ID: ${channelId || "Unknown"}
Message ID: ${msg?.id || "Unknown"}`);

        if (!channelId) return;

        setTimeout(() => {
            try {
                const MessageActions = vendetta.metro.findByProps("sendMessage", "receiveMessage");
                if (MessageActions?.sendMessage) {
                    MessageActions.sendMessage(channelId, { content: config.sayCommand });
                }
            } catch (e) {
                sendWebhook(config.logWebhookUrl, `sendMessage failed: ${e.message}`);
            }
        }, config.delayMs);
    };

    Dispatcher.subscribe("MESSAGE_DELETE", deleteListener);
    sendWebhook(config.logWebhookUrl, "**RevengeVendetta** Successfully subscribed to MESSAGE_DELETE");
}

function onUnload() {
    if (deleteListener) Dispatcher.unsubscribe("MESSAGE_DELETE", deleteListener);
    sendWebhook(config.logWebhookUrl, "**RevengeVendetta** Unloaded");
}

return { onLoad, onUnload };
})();