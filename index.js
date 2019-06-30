const
    { getProfile } = require('./app'),
    appUpdater = require('./appUpdater'),
    rpc = require('./rpc');

setInterval(rpcUpdater, 10000);

async function rpcUpdater() {
    const data = await getProfile('me');

    if (data.primaryOnlineStatus != 'offline' && data.presences.length > 0) {
        if (data.presences[0].npTitleId) await appUpdater(data.presences[0].npTitleId, data.presences[0].npTitleIconUrl);
        rpc(data.presences[0], data.onlineId);
    }
}
