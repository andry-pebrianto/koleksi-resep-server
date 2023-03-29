/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("tags", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(55)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("tags");
};
