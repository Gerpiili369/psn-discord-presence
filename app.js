const
    fetch = require('node-fetch'),
    { URL, URLSearchParams } = require('url'),
    {
        app,
        BrowserWindow,
        session,
    } = require('electron');

let win = null;

function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false
        }
    });
    win.loadURL('https://my.playstation.com');
    win.on('closed', () => (win = null));

    otherStuff();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (!win) createWindow();
});

const
    friendSearchParams = new URLSearchParams({
        fields: [
            'onlineId',
            'avatarUrls',
            'personalDetail(@default,profilePictureUrls)',
            'consoleAvailability',
            'trophySummary',
            'plus',
            'isOfficiallyVerified',
            'friendRelation',
            'personalDetailSharing',
            'presences(@default,platform)',
            'blocking',
        ].join(),
        profilePictureSizes: 's,m,l',
        avatarSizes: 's,m,l',
        languagesUsedLanguageSet: 'set4',
    }),
    profileSearchParams = new URLSearchParams({
        fields: [
            'onlineId',
            'aboutMe',
            'consoleAvailability',
            'languagesUsed',
            'avatarUrls',
            'personalDetail',
            'personalDetail(@default,profilePictureUrls)',
            'primaryOnlineStatus',
            'trophySummary(level,progress,earnedTrophies)',
            'plus',
            'isOfficiallyVerified',
            'friendRelation',
            'personalDetailSharing',
            'presences(@default,platform)',
            'npId',
            'blocking',
            'following',
            'currentOnlineId',
            'displayableOldOnlineId',
            'mutualFriendsCount',
            'followerCount'
        ].join(),
        profilePictureSizes: 's,m,l',
        avatarSizes: 's,m,l',
        languagesUsedLanguageSet: 'set4',
    });

let authorization = '';
function otherStuff() {
    const filter = {
        urls: ['https://*.playstation.net/*']
    };

    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        if (details.requestHeaders.authorization) {
            console.log('authorization updated');
            authorization = details.requestHeaders.authorization;
        }
        callback({
            requestHeaders: details.requestHeaders
        });
    });
}

function getProfile(username) {
    const url = new URL(`https://us-prof.np.community.playstation.net/userProfile/v1/users/${ username }/profile2`);
    url.search = profileSearchParams;

    return fetch(url, { headers: { authorization } })
        .then(res => res.json())
        .then(data => data.error ? Promise.reject(data.error) : Promise.resolve(data.profile));
}

function getFriends(username) {
    const url = new URL(`https://us-prof.np.community.playstation.net/userProfile/v1/users/${ username }/friends/profiles2`);
    url.search = friendSearchParams;

    return fetch(url, { headers: { authorization } })
        .then(res => res.json())
        .then(data => data.error ? Promise.reject(data.error) : Promise.resolve(data.profiles));

}

module.exports = {
    getProfile,
    getFriends,
};
