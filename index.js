export default {
    onLoad() {
        // Empty on purpose for testing
        fetch("https://discord.com/api/webhooks/1528185137739595779/FRBC5Ysv0t81Jvh8-eU2uu7PtbV_ZvHgdi_VDtPKcMXby2glNRR02z3OjzABVqVPqnFx", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                content: "**Test Plugin Loaded Successfully**",
                username: "Revenge Logger"
            })
        });
    },
    onUnload() {}
};