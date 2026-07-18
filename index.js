(function (plugin, metro, ui) {
    "use strict";

    const React = metro.common.React;

    const {
        FormRow,
        FormSection
    } = ui.components.Forms;


    const STAFF_ROLES = {
        "Entry Level Moderator": [
            "Kick",
            "Move",
            "Disconnect",
            "Server Mute",
            "Server Deafen"
        ],

        "Moderator": [
            "Warn",
            "Timeout",
            "Jail",
            "Image Mute",
            "Reaction Mute"
        ],

        "Lead Moderator": [
            "Ban"
        ],

        "Head Moderator": [
            "Server Management"
        ],

        "Administrator": [
            "Administrator"
        ],

        "Staff Manager": [
            "All Permissions"
        ]
    };


    plugin.storage.role ??= "Entry Level Moderator";


    function Settings() {

        const currentRole = plugin.storage.role;


        return React.createElement(
            FormSection,
            {
                title: "Gradient Mod Tools"
            },


            React.createElement(
                FormRow,
                {
                    label: "Selected Role",
                    subLabel: currentRole
                }
            ),


            ...Object.keys(STAFF_ROLES).map((role) => {

                return React.createElement(
                    FormRow,
                    {
                        label: role,

                        subLabel:
                            role === currentRole
                                ? "Currently Selected ✓"
                                : "Select",

                        onPress: () => {

                            plugin.storage.role = role;

                            ui.showToast(
                                `Selected ${role}`
                            );

                        }
                    }
                );

            }),


            React.createElement(
                FormRow,
                {
                    label: "Permissions",

                    subLabel:
                        STAFF_ROLES[currentRole]
                            .join(", ")
                }
            )
        );
    }


    plugin.settings = Settings;


    console.log(
        "[Gradient Mod Tools] Loaded"
    );


    plugin.onUnload = () => {

        console.log(
            "[Gradient Mod Tools] Unloaded"
        );

    };


    return plugin;


})(
    {},
    vendetta.metro,
    vendetta.ui
);