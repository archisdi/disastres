const Slack = require('slack-node');

let client;

exports.initialize = () => {
    client = new Slack();
    client.setWebhook(process.env.SLACK_WEBHOOK);
};

exports.getClient = () => {
    if (!client) exports.initialize();
    return client;
};

module.exports = exports;
