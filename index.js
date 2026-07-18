(function (plugin, metro, patcher, storage, ui) {
    "use strict";

    const React = metro.common.React;
    const { Forms } = ui.components;

    const STAFF_ROLES = {
        "Entry Level Moderator": {
            level: 1,
            permissions: [
                "Kick",
                "Move",
                "Disconnect",
                "Server Mute",
                "Server Deafen"
            ]
        },

        "Moderator": {
            level: 2,
            permissions: [
                "Warn",
                "Timeout",
                "Jail",
                "Image Mute",
                "Reaction Mute"
            ]
        },

        "Lead Moderator": {
            level: 3,
            permissions: [
                "Ban"
            ]
        },

        "Head Moderator": {
            level: 4,
            permissions: [
                "Server Management"
            ]
        },

        "Administrator": {
            level: 5,
            permissions: [
                "Administrator"
            ]
        },

        "Staff Manager": {
            level: 6,
            permissions: [
                "All Permissions"
            ]
        }
    };


    plugin.storage.selectedRole ??= "Entry Level Moderator";


    function Settings() {

        const role = plugin.storage.selectedRole;


        return React.createElement(
            Forms.FormSection,
            {
                title: "Gradient Mod Tools"
            },


            React.createElement(
                Forms.FormRow,
                {
                    label: "Current Staff Role",
                    subLabel: role
                }
            ),


            ...Object.keys(STAFF_ROLES).map((roleName) => {

                return React.createElement(
                    Forms.FormRow,
                    {
                        label: roleName,

                        subLabel:
                            role === roleName
                                ? "Selected ✓"
                                : "Tap to select",


                        onPress: () => {

                            plugin.storage.selectedRole = roleName;

                            ui.showToast(
                                `Role changed to ${roleName}`
                            );

                        }
                    }
                );

            }),


            React.createElement(
                Forms.FormRow,
                {
                    label: "Permissions",

                    subLabel:
                        STAFF_ROLES[role]
                            .permissions
                            .join(", ")
                }
            )

        );

    }


    plugin.settings = Settings;


    console.log(
        "[Gradient Mod Tools] Loaded as:",
        plugin.storage.selectedRole
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
    vendetta.patcher,
    vendetta.storage,
    vendetta.ui
);