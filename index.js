// Revenge Vendetta Delete - Fixed Working Version

(function () {
"use strict";

const Dispatcher = vendetta.metro.findByProps("subscribe", "unsubscribe");
const MessageActions = vendetta.metro.findByProps("sendMessage");

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
            body: JSON.stringify({
                content: content,
                username: "Revenge Logger"
            })
        });
    } catch (e) {}
}

function log(msg) {
    sendWebhook(config.logWebhookUrl, `**RevengeVendetta** ${msg}\n**Time:** ${new Date().toISOString()}`);
}

let deleteListener;

function onLoad() {
    log("Plugin loading...");

    if (!Dispatcher) {
        log("ERROR: Dispatcher not found");
        return;
    }

    deleteListener = (payload) => {
        try {
            const msg = payload?.message || payload;
            if (!msg) return;

            const channelId = msg.channelId || msg.channel_id;
            const isSelf = msg.author?.id === vendetta?.user?.id;

            sendWebhook(config.webhookUrl, 
`**DELETED MESSAGE DETECTED** ${isSelf ? '(Self Delete)' : ''}\n**Author:** ${msg.author?.username || msg.author?.id || 'Unknown'}\n**Content:** ${msg.content || '[content not cached]'}\n**Channel ID:** ${channelId || 'Unknown'}\n**Message ID:** ${msg.id}\n**Time:** ${new Date().toISOString()}`);

            // Send command
            if (MessageActions?.sendMessage && channelId) {
                setTimeout(() => {
                    MessageActions.sendMessage(channelId, { content: config.sayCommand });
                }, config.delayMs);
            }
        } catch (e) {
            log("Delete handler error");
        }
    };

    Dispatcher.subscribe("MESSAGE_DELETE", deleteListener);
    log("Successfully hooked MESSAGE_DELETE");
}

function onUnload() {
    if (deleteListener && Dispatcher) {
        Dispatcher.unsubscribe("MESSAGE_DELETE", deleteListener);
    }
    log("Plugin unloaded");
}

return { onLoad, onUnload };
})();