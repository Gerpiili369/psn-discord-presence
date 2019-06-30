const
    fetch = require('node-fetch'),
    token = process.env.DEVTOKEN,
    clientID = '581267469319143437',
    assetUrl = `https://discordapp.com/api/oauth2/applications/${ clientID }/assets`;

function getAssetId(name, url) {
    return new Promise((resolve, reject) => fetch(assetUrl, { headers: { authorization: token } })
        .then(res => res.json())
        .then(assets => {
            let found = false;
            for (const asset of assets) {
                if (asset.name == name.toLowerCase()) {
                    resolve(asset.id);
                    found = true;
                }
            }

            if (!found) fetch(url)
                .then(res => res.arrayBuffer())
                .then(buffer => Buffer.from(buffer).toString('base64'))
                .then(base64 => `data:image/jpeg;base64,${ base64 }`)
                .then(image => fetch(assetUrl, {
                    headers: {
                        authorization: token,
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        image,
                        name,
                        type: 1,
                    }),
                }))
                .then(res => res.json())
                .then(asset => resolve(asset.id))
                .catch(reject);
        })
        .catch(reject)
    );
}

module.exports = getAssetId;
