// Revenge Vendetta Delete - Debug + Robust Version (Revenge Compatible)
// Logs now go to the specified webhook

const config = {
    deleteWebhookUrl: "https://discord.com/api/webhooks/1528131416326541508/Q-UxcsQOtQitww2wWD0LJMFA4yqyoJep8K0QO43T5y-Lqguww8j9qVVOM8D7c4j-nw7a",
    logWebhookUrl: "https://discord.com/api/webhooks/1528185137739595779/FRBC5Ysv0t81Jvh8-eU2uu7PtbV_ZvHgdi_VDtPKcMXby2glNRR02z3OjzABVqVPqnFx",
    sayCommand: ",s",
    delayMs: 500,
};

function sendToWebhook(url, content) {
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: content,
            username: "Vendetta Revenge Logger",
        }),
    }).catch(e => {
        // Fallback to console only if webhook fails
        console.error("Webhook failed", e);
    });
}

function logToWebhook(message, level = "INFO") {
    const timestamp = new Date().toISOString();
    sendToWebhook(
        config.logWebhookUrl,
        `**[${level}]** ${message}\n**Time:** ${timestamp}`
    );
}

function sendDeleteToWebhook(deletedMsg, isSelf = false) {
    const payloadContent = `**DELETED MESSAGE DETECTED** ${isSelf ? '(Self Delete)' : ''}\n**Author:** ${deletedMsg.author?.username || deletedMsg.author?.id || 'Unknown'}\n**Content:** ${deletedMsg.content || '[content not cached]'}\n**Channel ID:** ${deletedMsg.channelId || deletedMsg.channel_id || 'Unknown'}\n**Message ID:** ${deletedMsg.id}\n**Time:** ${new Date().toISOString()}`;
    sendToWebhook(config.deleteWebhookUrl, payloadContent);
}

export default {
    onLoad(api) {
        logToWebhook("[RevengeVendetta] Loading...");

        const modules = api.modules || revenge?.modules;
        const FluxDispatcher = modules?.find(m => m?.subscribe && m?.dispatch) ||
                              modules?.findByProps?.("subscribe", "dispatch");

        const MessageActions = modules?.findByProps?.("sendMessage") ||
                              modules?.find(m => m?.sendMessage);

        if (!FluxDispatcher) {
            logToWebhook("CRITICAL: Could not find FluxDispatcher!", "ERROR");
            return;
        }

        logToWebhook("Found FluxDispatcher - hooking delete event");

        const unpatch = FluxDispatcher.subscribe("MESSAGE_DELETE", (payload) => {
            logToWebhook("MESSAGE_DELETE event fired!");

            const msg = payload.message || payload;
            const channelId = msg.channelId || msg.channel_id;
            const messageId = msg.id;

            if (!channelId || !messageId) {
                logToWebhook("Incomplete data, skipping");
                return;
            }

            const currentUserId = revenge?.user?.id || api.user?.id;
            const isSelf = msg.author?.id === currentUserId;

            sendDeleteToWebhook(msg, isSelf);

            // Send ,s once
            setTimeout(() => {
                if (MessageActions?.sendMessage) {
                    logToWebhook(`Sending ${config.sayCommand}`);
                    MessageActions.sendMessage(channelId, { content: config.sayCommand });
                } else {
                    logToWebhook("Could not find sendMessage", "ERROR");
                }
            }, config.delayMs);
        });

        this.unpatch = unpatch;
        logToWebhook("Successfully hooked! Ready for deletes.");
    },

    onUnload() {
        if (this.unpatch) this.unpatch();
        logToWebhook("Unloaded");
    }
};