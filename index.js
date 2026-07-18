(function (plugin) {
    "use strict";

    const React = vendetta.metro.common.React;

    return {
        onLoad() {
            console.log("[Gradient Mod Tools] Loaded");

            this.button = React.createElement(
                "Text",
                null,
                "🛡 Gradient Mod Tools"
            );
        },

        onUnload() {
            console.log("[Gradient Mod Tools] Unloaded");
        }
    };

})(plugin);