require('dotenv').config();

module.exports = (count, page = 1, limit = 10) => {
  let offset = 0;
  const response = {
    currentPage: /[\d]/.test(page) ? parseInt(page, 10) : 1,
    dataPerPage: parseInt(limit, 10),
    totalPage: Math.ceil(Number(count / limit)),
  };

  // cek apakah ada query param page dan tidak mengandung selain angka
  if (/[\d]/.test(page)) {
    if (parseInt(page, 10) > 0) {
      offset = (parseInt(page, 10) - 1) * limit;
    }
  }

  return {
    limit,
    offset,
    response,
  };
};
