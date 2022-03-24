module.exports = {
  insertValidation: (body) => {
    const {
      name, email, phone, password,
    } = body;

    // validasi untuk name
    if (typeof name !== 'string') { return { bad: true, message: 'Name harus diisi dan bertipe string.' }; }
    if (name.length < 1 || name.length > 50) {
      return {
        bad: true,
        message:
          'Name harus diisi minimal 1 karakter dan maksimal 50 karakter.',
      };
    }

    // validasi untuk email
    if (typeof email !== 'string') { return { bad: true, message: 'Email harus diisi dan bertipe string.' }; }
    if (email.length < 1 || email.length > 100) {
      return {
        bad: true,
        message:
          'Email harus diisi minimal 1 karakter dan maksimal 100 karakter.',
      };
    }

    // validasi untuk phone
    if (typeof phone !== 'string') { return { bad: true, message: 'Phone harus diisi dan bertipe string.' }; }
    if (phone.length < 1 || phone.length > 13) {
      return {
        bad: true,
        message:
          'Phone harus diisi minimal 1 karakter dan maksimal 13 karakter.',
      };
    }

    // validasi untuk password
    if (typeof password !== 'string') { return { bad: true, message: 'Password harus diisi dan bertipe string.' }; }
    if (password.length < 8 || password.length > 250) {
      return {
        bad: true,
        message:
          'Password harus diisi minimal 8 karakter dan maksimal 250 karakter.',
      };
    }
    if (
      !/[a-z]/.test(password)
      || !/[A-Z]/.test(password)
      || !/[0-9]/.test(password)
    ) {
      return {
        bad: true,
        message:
          'Password harus mengandung setidaknya satu huruf kecil, satu huruf besar, dan satu angka.',
      };
    }

    // validasi berhasil
    return { bad: false, body };
  },
};
