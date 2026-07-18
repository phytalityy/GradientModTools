(function (plugin, metro, patcher, storage, ui) {
    "use strict";

    const React = metro.common.React;
    const { Forms } = ui.components;
    const {
        FormRow,
        FormDivider
    } = Forms;

    function Settings() {
        return React.createElement(
            React.Fragment,
            null,

            React.createElement(FormRow, {
                label: "Gradient Mod Tools",
                subLabel: "Plugin loaded successfully ✅"
            }),

            React.createElement(FormDivider),

            React.createElement(FormRow, {
                label: "Current Test Role",
                subLabel: "Lead Moderator"
            }),

            React.createElement(FormRow, {
                label: "Permissions",
                subLabel: "Warn • Timeout • Jail • Ban"
            })
        );
    }

    plugin.settings = Settings;

    console.log("[Gradient] Plugin Loaded");

    plugin.onUnload = () => {
        console.log("[Gradient] Plugin Unloaded");
    };

    return plugin;

})(
    {},
    vendetta.metro,
    vendetta.patcher,
    vendetta.storage,
    vendetta.ui
);