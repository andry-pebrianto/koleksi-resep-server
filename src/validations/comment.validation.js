module.exports = {
  insertValidation: (body) => {
    const { commentText } = body;

    // validasi untuk comment text
    if (typeof commentText !== 'string') {
      return { bad: true, message: 'Comment Text harus bertipe string' };
    }
    if (commentText.length < 1 || commentText.length > 500) {
      return {
        bad: true,
        message:
          'Comment Text harus diisi minimal 1 karakter dan maksimal 500 karakter',
      };
    }

    // validasi berhasil
    return { bad: false, body };
  },
};
