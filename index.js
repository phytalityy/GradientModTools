// Revenge/Vendetta Plugin: Delete Detector + Single ",s" + Webhook
// Webhook: https://discord.com/api/webhooks/1528131416326541508/Q-UxcsQOtQitww2wWD0LJMFA4yqyoJep8K0QO43T5y-Lqguww8j9qVVOM8D7c4j-nw7a

const config = {
    webhookUrl: "https://discord.com/api/webhooks/1528131416326541508/Q-UxcsQOtQitww2wWD0LJMFA4yqyoJep8K0QO43T5y-Lqguww8j9qVVOM8D7c4j-nw7a",
    sayCommand: ",s",
    delayMs: 400,
};

function sendToWebhook(deletedMsg) {
    const payload = {
        content: `**DELETED MESSAGE DETECTED**\n**Author:** ${deletedMsg.author?.username || 'Unknown'}\n**Content:** ${deletedMsg.content || '[content not cached]'}\n**Channel:** ${deletedMsg.channel?.name || deletedMsg.channelId}\n**Time:** ${new Date().toISOString()}`,
        username: "Vendetta Revenge Logger",
    };

    fetch(config.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }).catch(err => console.error("[RevengeVendetta] Webhook error:", err));
}

export default {
    onLoad() {
        console.log("[RevengeVendetta] Loaded - single ,s mode active");

        const FluxDispatcher = vendetta.patcher.findModuleByProps?.("subscribe", "dispatch");
        const MessageStore = vendetta.patcher.findModuleByProps?.("getMessage", "getMessages");
        const MessageActions = vendetta.patcher.findModuleByProps?.("sendMessage");

        if (!FluxDispatcher) {
            console.error("[RevengeVendetta] Could not find FluxDispatcher");
            return;
        }

        const unpatch = FluxDispatcher.subscribe("MESSAGE_DELETE", (data) => {
            const msgData = data.message || data;
            const { id, channelId } = msgData;

            if (!id || !channelId) return;

            const cachedMsg = MessageStore?.getMessage?.(channelId, id) || msgData;
            
            console.log(`[RevengeVendetta] Delete detected: ${cachedMsg.content?.substring(0, 80)}...`);

            sendToWebhook(cachedMsg);

            // Send ",s" exactly once
            setTimeout(() => {
                if (MessageActions?.sendMessage) {
                    MessageActions.sendMessage(channelId, { content: config.sayCommand });
                }
            }, config.delayMs);
        });

        this.unpatch = unpatch;
    },

    onUnload() {
        if (this.unpatch) this.unpatch();
        console.log("[RevengeVendetta] Unloaded");
    }
};