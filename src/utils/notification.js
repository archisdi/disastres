const moment = require('moment');
const slack = require('./slack');

exports.notifyQuake = async ({
    latitude, longitude, magnitude, depth, occurs_at: occurs
}) => {
    const client = await slack.getClient();
    client.webhook({
        text: 'An earthquake happens',
        attachments: [{
            color: '#FEAE18',
            fields: [{
                title: 'Coordinates',
                value: `${latitude}, ${longitude}`,
                short: true
            },
            {
                title: 'Magnitude',
                value: `${magnitude} Richter Scale`,
                short: true
            },
            {
                title: 'Depth',
                value: `${depth} KM`,
                short: true
            },
            {
                title: 'Occurs',
                value: moment(occurs).format('DD-MMM-YY HH:mm:ss'),
                short: true
            }
            ],
            ts: moment().unix()
        }]
    }, () => {
        console.log('message sent'); // eslint-disable-line
    });
};

module.exports = exports;
