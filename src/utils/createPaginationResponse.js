module.exports = (count, page, limit) => {
  let currentPage = 1;
  let dataPerPage = 10;

  // menentukan limit & offset berdasarkan page
  if (/[\d]/.test(page)) {
    if (page > 0) {
      currentPage = parseInt(page, 10);
      dataPerPage = parseInt(limit, 10);
    }
  }

  return {
    currentPage,
    dataPerPage,
    totalPage: Math.ceil(Number(count / dataPerPage)),
  };
};
