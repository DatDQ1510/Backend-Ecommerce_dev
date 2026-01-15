'use strict';

const NOTI = require('../models/notification.model.js');

const pushNotiToSystem = async ({
    type = 'SHOP-001',
    receiverId = 1,
    senderId = 1,
    options = {}
}) => {
    console.log('📌 Creating Notification with:', { type, receiverId, senderId, options });
    let noti_content = '';
    if (type === 'SHOP-001') {
        noti_content = `Shop ${senderId} đã tạo sản phẩm mới`;
    }
    else if (type === 'ORDER-001') {
        noti_content = `Đơn hàng ${senderId} đã được tạo`;
    }
    else if (type === 'ORDER-002') {
        noti_content = `Đơn hàng ${senderId} đã được xác nhận`;
    }
    else if (type === 'PROMOTION-001') {
        noti_content = `Khuyến mãi mới từ shop ${senderId}`;
    }
    else {
        noti_content = 'Notification';
    }
    console.log('📌 Notification Content:', noti_content);
    const newNoti = await NOTI.insertOne({
        noti_type: type,
        noti_senderId: senderId,
        noti_receiveId: receiverId,
        noti_content,
        noti_options: options
    });
    console.log('📌 New Notification:', newNoti);
    return newNoti;
}

const listNotiByUser = async ({
    userId = 1,
    type = 'ALL',
    isRead = 0
}) => {
    const match = { noti_receiveId: userId };
    if (type !== 'ALL') match.noti_type = type;
    return await NOTI.aggregate([
        { $match: match },
        { $project: { noti_type: 1, noti_senderId: 1, noti_receiveId: 1, noti_content: 1, noti_options: 1, createdAt: 1 } },
        { $sort: { createdAt: -1 } },
        { $limit: 10 }
    ]);
}

module.exports = {
    pushNotiToSystem, listNotiByUser
}