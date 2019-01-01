exports.HttpResponse = (res, message, content = null, status = 200) => res.status(status).json({
    message,
    status,
    content
});

exports.requestInput = req => ({
    query: req.query || null,
    params: req.params || null,
    body: req.body || null
});

exports.removeDuplicates = (arr, prop) => {
    const obj = {};
    for (let i = 0, len = arr.length; i < len; i++) {
        if (!obj[arr[i][prop]]) obj[arr[i][prop]] = arr[i];
    }
    const newArr = [];
    for (const key in obj) newArr.push(obj[key]); // eslint-disable-line
    return newArr;
};

module.exports = exports;
