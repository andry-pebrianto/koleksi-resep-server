require('dotenv').config();

module.exports = (page, limit) => {
  let item = 'ALL';
  let offset = 0;

  // menentukan limit & offset berdasarkan page
  if (/[\d]/.test(page)) {
    item = /[\d]/.test(limit) ? limit : 3;
    offset = (page - 1) * item;
  }

  return {
    item,
    offset,
  };
};
