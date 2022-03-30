module.exports = {
  success: (res, data) => {
    const {
      code, payload, status, message, pagination = false, token = false,
    } = data;

    const responseData = {
      code,
      status,
      data: payload,
      message,
    };

    // jika terdapat pagination
    if (pagination) {
      responseData.pagination = pagination;
    }

    // jika terdapat token
    if (token) {
      responseData.token = token;
      delete responseData.data;
    }

    res.json(responseData);
  },
  failed: (res, data) => {
    const {
      code, payload, status, message,
    } = data;

    const responseData = {
      code,
      status,
      error: payload,
      message,
    };

    res.json(responseData);
  },
};
