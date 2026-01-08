const slugify = require('slugify');

const generateSlug = (text) => {
    return slugify(text, {
        lower: true,     // chữ thường
        strict: true,    // bỏ ký tự đặc biệt
        locale: 'vi',    // hỗ trợ tiếng Việt
        trim: true
    });
};

module.exports = {
    generateSlug
};
