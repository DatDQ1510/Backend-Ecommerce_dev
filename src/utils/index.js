'use strict'

const _ = require('lodash');
const { Types } = require('mongoose');
const getInfoData = (fields = [], object = {}) => {
    return _.pick(object, fields);
}
// ['a', 'b', 'c'] => {a: 1, b: 1, c: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(key => [key, 1]));
}
const getUnSelectData = (unselect = []) => {
    return Object.fromEntries(unselect.map(key => [key, 0]));
}
const convertToObjectId = (id) => {
    return new Types.ObjectId(id);
}
module.exports = {
    getInfoData, getSelectData, getUnSelectData, convertToObjectId
}