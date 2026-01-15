"use strict";
const cloudinary = require('../config/cloudinary.config'); // Kiểm tra đường dẫn import
// 1. Upload ảnh từ URL lên Cloudinary
const upLoadFromUrl = async () => {
    try {
        const urlImage = "https://res.cloudinary.com/shopdatdinh/image/upload/v1735629090/cld-sample-5.jpg";

        const folderName = "product/shopId";
        const newFileName = "demo";

        // Upload ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(urlImage, {
            folder: folderName,
            public_id: newFileName
        });
        console.log("Upload thành công:", result);
        return result;
    } catch (error) {
        console.error("Lỗi upload:", error);
    }
};

// 2. Upload ảnh từ Local lên Cloudinary 

const upLoadFromLocal = async (
    path, // Đường dẫn ảnh cần upload
    folderName = "product/datdinh", // Tên thư mục chứa ảnh
) => {
    try {
        const newFileName = "demo";

        // Upload ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(path, {
            folder: folderName,
            public_id: newFileName
        });
        console.log("Upload thành công:", result);
        return {
            url: result.secure_url,
            public_id: result.public_id,
            thumb_url: await cloudinary.url(result.public_id, {
                width: 150,
                height: 150,
                crop: "fill"
            })
        };
    } catch (error) {
        console.error("Lỗi upload:", error);
    }
};
// 3. upload nhiều ảnh từ local lên Cloudinary
const upLoadManyFromLocal = async (
    files, // Mảng chứa các file cần upload
    folderName = "product/datdinh1", // Tên thư mục chứa ảnh
) => {
    try {
        if(files.length === 0) return;
        const publicIds = [];
        const urls = [];
        const thumbUrls = [];
        for (const file of files) {
            const newFileName = "demo";

            // Upload ảnh lên Cloudinary
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName,
                public_id: newFileName
            });
            publicIds.push(result.public_id);
            urls.push(result.secure_url);
            thumbUrls.push(await cloudinary.url(result.public_id, {
                width: 150,
                height: 150,
                crop: "fill"
            }));
        }
        console.log("Upload thành công:", publicIds);
        return {
            publicIds,
            urls,
            thumbUrls
        };
    } catch (error) {
        console.error("Lỗi upload:", error);
    }
}
module.exports = {
    upLoadFromUrl,
    upLoadFromLocal,
    upLoadManyFromLocal
};
