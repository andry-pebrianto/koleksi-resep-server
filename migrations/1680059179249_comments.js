/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
    },
    recipe_id: {
      type: "uuid",
      notNull: true,
    },
    body: {
      type: "VARCHAR(505)",
      notNull: true,
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
    "comments",
    "fk-comments.user_id-users.id",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE",
  );
  pgm.addConstraint(
    "comments",
    "fk-comments.recipe_id-recipes.id",
    "FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE",
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("comments", "fk-comments.user_id-users.id");
  pgm.dropConstraint("comments", "fk-comments.recipe_id-recipes.id");
  pgm.dropTable("comments");
};
