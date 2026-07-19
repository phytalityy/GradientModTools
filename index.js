// Revenge Vendetta Delete - Working Style (based on your example)

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
    if (!url) return;
    try {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: content,
                username: "Revenge Logger"
            })
        });
    } catch (e) {
        console.error("[RevengeVendetta]", e);
    }
}

function logToWebhook(message) {
    sendWebhook(
        config.logWebhookUrl,
        `**RevengeVendetta Log**\n${message}\n**Time:** ${new Date().toISOString()}`
    );
}

let deleteListener;

function onLoad() {
    logToWebhook("Plugin loading...");

    if (!Dispatcher) {
        logToWebhook("ERROR: Dispatcher not found");
        return;
    }

    deleteListener = (data) => {
        try {
            const msg = data.message || data;
            const channelId = msg.channelId || msg.channel_id;
            const isSelf = msg.author?.id === vendetta.user?.id;

            sendWebhook(
                config.webhookUrl,
                `**DELETED MESSAGE DETECTED** ${isSelf ? '(Self Delete)' : ''}\n**Author:** ${msg.author?.username || msg.author?.id || 'Unknown'}\n**Content:** ${msg.content || '[content not cached]'}\n**Channel ID:** ${channelId || 'Unknown'}\n**Message ID:** ${msg.id}\n**Time:** ${new Date().toISOString()}`
            );

            // Send ,s
            setTimeout(() => {
                const MessageActions = vendetta.metro.findByProps("sendMessage");
                if (MessageActions?.sendMessage && channelId) {
                    MessageActions.sendMessage(channelId, { content: config.sayCommand });
                }
            }, config.delayMs);
        } catch (e) {
            logToWebhook("Delete handler error: " + e.message);
        }
    };

    Dispatcher.subscribe("MESSAGE_DELETE", deleteListener);

    logToWebhook("Successfully hooked! Ready for deletes.");
}

function onUnload() {
    if (deleteListener) {
        Dispatcher.unsubscribe("MESSAGE_DELETE", deleteListener);
    }
    logToWebhook("Plugin unloaded");
}

return { onLoad, onUnload };
})();