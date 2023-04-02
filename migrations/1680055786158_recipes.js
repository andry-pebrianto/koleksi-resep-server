/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("recipes", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
    },
    title: {
      type: "VARCHAR(105)",
      notNull: true,
    },
    ingredients: {
      type: "TEXT",
      notNull: true,
    },
    photo_url: {
      type: "VARCHAR(205)",
    },
    video_url: {
      type: "VARCHAR(205)",
    },
    is_active: {
      type: "INTEGER",
      default: 1,
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint(
    "recipes",
    "fk-recipes.user_id-users.id",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE",
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("recipes", "fk-recipes.user_id-users.id");
  pgm.dropTable("recipes");
};
