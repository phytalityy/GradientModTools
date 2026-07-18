// Revenge Vendetta Delete - Minimal Robust Version

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
        body: JSON.stringify({ content, username: "Revenge Logger" }),
    }).catch(() => {});
}

function log(level, msg) {
    sendToWebhook(config.logWebhookUrl, `**[${level}]** ${msg}\n**Time:** ${new Date().toISOString()}`);
}

export default {
    onLoad(api) {
        try {
            log("INFO", "Plugin loading...");

            const modules = api?.modules || revenge?.modules || window?.revenge?.modules;
            if (!modules) {
                log("ERROR", "Could not access modules API");
                return;
            }

            const FluxDispatcher = modules.find(m => m?.subscribe && m?.dispatch) ||
                                  modules.findByProps?.("subscribe", "dispatch");

            const MessageActions = modules.findByProps?.("sendMessage");

            if (!FluxDispatcher) {
                log("ERROR", "CRITICAL: FluxDispatcher not found");
                return;
            }

            log("INFO", "FluxDispatcher found - hooking MESSAGE_DELETE");

            const unpatch = FluxDispatcher.subscribe("MESSAGE_DELETE", (payload) => {
                try {
                    const msg = payload?.message || payload;
                    const channelId = msg?.channelId || msg?.channel_id;
                    const isSelf = msg?.author?.id === (revenge?.user?.id || api?.user?.id);

                    if (channelId) {
                        sendToWebhook(config.deleteWebhookUrl, 
                            `**DELETED MESSAGE DETECTED** ${isSelf ? '(Self)' : ''}\n**Author:** ${msg.author?.username || msg.author?.id || 'Unknown'}\n**Content:** ${msg.content || '[no content]'}\n**Channel:** ${channelId}\n**Msg ID:** ${msg.id}`);
                    }

                    // Send command
                    setTimeout(() => {
                        if (MessageActions?.sendMessage && channelId) {
                            MessageActions.sendMessage(channelId, { content: config.sayCommand });
                        }
                    }, config.delayMs);
                } catch (e) {
                    log("ERROR", "Delete handler error: " + e.message);
                }
            });

            this.unpatch = unpatch;
            log("INFO", "Plugin successfully hooked and ready");
        } catch (e) {
            log("ERROR", "onLoad failed: " + e.message);
        }
    },

    onUnload() {
        if (this.unpatch) this.unpatch();
        log("INFO", "Plugin unloaded");
    }
};