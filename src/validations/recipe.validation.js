module.exports = {
  insertValidation: (body) => {
    const { title, ingredients } = body;

    // validasi untuk title
    if (typeof title !== 'string') {
      return { bad: true, message: 'Title harus bertipe string' };
    }
    if (title.length < 1 || title.length > 100) {
      return {
        bad: true,
        message:
          'Title harus diisi minimal 1 karakter dan maksimal 100 karakter',
      };
    }

    // validasi untuk ingredients
    if (typeof ingredients !== 'string') {
      return {
        bad: true,
        message: 'Ingredients harus bertipe string',
      };
    }

    // validasi berhasil
    return { bad: false, body };
  },
};
