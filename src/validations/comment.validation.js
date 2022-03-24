module.exports = {
  insertValidation: (body) => {
    const { commentText } = body;

    // validasi untuk comment text
    if (typeof commentText !== 'string') {
      return { bad: true, message: 'Title harus diisi dan bertipe string.' };
    }

    // validasi berhasil
    return { bad: false, body };
  },
};
