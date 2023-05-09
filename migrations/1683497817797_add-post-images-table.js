/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('post_images', {
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
    image_url: {
      type: 'varchar(2048)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('post_images');
};
