require('dotenv').config();

module.exports = (pageValue, limitValue) => {
  let limit = 'ALL';
  let offset = 0;

  // menentukan limit & offset berdasarkan page
  if (/[\d]/.test(pageValue)) {
    if (pageValue > 0) {
      limit = /[\d]/.test(limitValue) ? limitValue : 3;
      offset = (pageValue - 1) * limit;
    }
  }

  return {
    limit,
    offset,
  };
};
