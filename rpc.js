const
    RPC = require('discord-rpc'),
    rpc = new RPC.Client({
        transport: 'ipc'
    });
let activity = null;

rpc.on('ready', () => activity && rpc.setActivity(activity));
rpc.login({
    clientId: '581267469319143437',
});

module.exports = (presence, onlineId) => {
    if (!activity || activity.details !== presence.titleName) {
        activity = {
            details: presence.titleName,
            state: `Username: ${ onlineId }, Platform: ${ presence.platform }`,
            largeImageText: presence.titleName,
            smallImageText: presence.platform,
            largeImageKey: presence.npTitleId && presence.npTitleId.toLowerCase(),
            smallImageKey: presence.platform && presence.platform.toLowerCase(),
            startTimestamp: new Date(),
            instance: false
        };
        rpc.setActivity(activity);
    }
};
