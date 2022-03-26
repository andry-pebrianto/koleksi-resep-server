require('dotenv').config();

module.exports = (page) => {
  let limit = 'ALL';
  let offset = 0;

  // menentukan limit & offset berdasarkan page
  if (/[\d]/.test(page)) {
    limit = process.env.ITEM_PER_PAGE || 1;
    offset = (page - 1) * limit;
  }

  return {
    limit,
    offset,
  };
};
