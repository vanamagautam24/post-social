/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('post_tags', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    post_id: {
      type: 'integer',
      notNull: true,
      references: 'posts',
      onDelete: 'cascade',
    },
    tag_id: {
      type: 'integer',
      notNull: true,
      references: 'tags',
      onDelete: 'cascade',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('post_tags');
};
