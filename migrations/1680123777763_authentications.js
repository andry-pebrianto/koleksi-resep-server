/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("authentications", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
    },
    token: {
      type: "TEXT",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "authentications",
    "fk-authentications.user_id-users.id",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE",
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("authentications", "fk-authentications.user_id-users.id");
  pgm.dropTable("authentications");
};
