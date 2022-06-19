const { create: axiosCreate } = require("axios");

const _1sec = 1000;
const _1min = _1sec * 60;
const _1hr = _1min * 60;

const post = async (host, path, body, timeout = _1hr) => {
    const res = await axiosCreate({
        baseURL: host,
        timeout: timeout,
    }).post(path, body);
    return res;
};

const get = async (host, path, timeout = _1hr) => {
    const res = await axiosCreate({
        baseURL: host,
        timeout: timeout,
    }).get(path);
    return res;
};

module.exports = {
    post,
    get,
}