/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("recipe_tags", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
    },
    recipe_id: {
      type: "uuid",
      notNull: true,
    },
    tag_id: {
      type: "uuid",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "recipe_tags",
    "fk-recipe_tags.recipe_id-recipes.id",
    "FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE",
  );
  pgm.addConstraint(
    "recipe_tags",
    "fk-recipe_tags.tag_id-tags.id",
    "FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE",
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("recipe_tags", "fk-recipe_tags.recipe_id-recipes.id");
  pgm.dropConstraint("recipe_tags", "fk-recipe_tags.tag_id-tags.id");
  pgm.dropTable("recipe_tags");
};
