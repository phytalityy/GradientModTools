(function (plugin, metro, patcher, storage, ui) {
    "use strict";

    const React = metro.common.React;

    const GRADIENT_GUILD_ID = "1506336019828445365";


    const STAFF_ROLES = {

        "1506385513181872149": {
            level: 1,
            name: "Entry Level Moderator",
            permissions: [
                "kick",
                "move",
                "disconnect",
                "serverMute",
                "serverDeafen"
            ]
        },

        "1516768057677058220": {
            level: 2,
            name: "Moderator",
            permissions: [
                "warn",
                "timeout",
                "jail",
                "imute",
                "rmute"
            ]
        },

        "1506384120949899316": {
            level: 3,
            name: "Lead Moderator",
            permissions: [
                "ban"
            ]
        },

        "1506419619089350759": {
            level: 4,
            name: "Head Moderator",
            permissions: [
                "serverManagement"
            ]
        },

        "1516752884539195515": {
            level: 5,
            name: "Administrator",
            permissions: [
                "administrator"
            ]
        },

        "1515499498279800936": {
            level: 6,
            name: "Staff Manager",
            permissions: [
                "*"
            ]
        }

    };


    const UserStore = metro.findByProps(
        "getCurrentUser"
    );

    const GuildMemberStore = metro.findByProps(
        "getMember"
    );

    const GuildStore = metro.findByProps(
        "getGuilds"
    );


    function getHighestStaffRole(roleIds) {

        let highest = null;

        for (const roleId of roleIds) {

            const role = STAFF_ROLES[roleId];

            if (!role)
                continue;


            if (!highest || role.level > highest.level) {
                highest = role;
            }

        }

        return highest;
    }



    function getCurrentStaffRole() {

        try {

            const user = UserStore.getCurrentUser();

            if (!user)
                return null;


            const guilds = GuildStore.getGuilds();


            if (!guilds[GRADIENT_GUILD_ID])
                return null;


            const member = GuildMemberStore.getMember(
                GRADIENT_GUILD_ID,
                user.id
            );


            if (!member)
                return null;


            return getHighestStaffRole(
                member.roles
            );


        } catch (e) {

            console.log(
                "[Gradient Mod Tools] Role error:",
                e
            );

            return null;
        }

    }



    function Settings() {

        const role = getCurrentStaffRole();

        const Forms = ui.components.Forms;


        return React.createElement(
            Forms.FormSection,
            {
                title: "Gradient Mod Tools"
            },


            React.createElement(
                Forms.FormRow,
                {
                    label: "Detected Role",
                    subLabel: role
                        ? role.name
                        : "Not Staff / Not Found"
                }
            ),


            React.createElement(
                Forms.FormRow,
                {
                    label: "Permissions",
                    subLabel: role
                        ? role.permissions.join(", ")
                        : "None"
                }
            )

        );

    }



    plugin.settings = Settings;


    console.log(
        "[Gradient Mod Tools] Loaded",
        getCurrentStaffRole()
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