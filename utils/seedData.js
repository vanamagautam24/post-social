const { faker } = require('@faker-js/faker');
const pool = require('./../pool');

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const seedUsers = async (count) => {
  for (let i = 0; i < count; i++) {
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();

    await pool.query(
      'INSERT INTO users (username, email, password, firstname, lastname) VALUES ($1, $2, $3, $4, $5)',
      [username, email, password, firstname, lastname]
    );
  }
};

const seedPosts = async (count) => {
  // Fetch all user IDs from the users table
  const { rows: users } = await pool.query('SELECT id FROM users');

  for (let i = 0; i < count; i++) {
    const content = faker.lorem.sentences();
    // const image_url = faker.image.nature();

    // Choose a random user ID from the fetched user IDs
    const user_id = users[randomInt(0, users.length - 1)].id;

    await pool.query('INSERT INTO posts (content, user_id) VALUES ($1, $2)', [
      content,
      user_id,
    ]);
  }
};

// const seedPostImages = async (count, postsCount) => {
//   const { rows: posts } = await pool.query('SELECT id FROM posts');

//   for (let i = 0; i < count; i++) {
//     const post_id = posts[i].id;
//     const image_url = faker.image.imageUrl() + `?random=${Date.now()}${i}`;

//     await pool.query(
//       'INSERT INTO post_images (post_id, image_url) VALUES ($1, $2)',
//       [post_id, image_url]
//     );
//   }
// };

const seedPostImages = async (count, postsCount) => {
  const { rows: posts } = await pool.query('SELECT id FROM posts');

  for (let i = 0; i < count; i++) {
    const post_id = posts[i].id;
    const image_url = faker.image.nature() + `?random=${Date.now()}${i}`;

    await pool.query(
      'UPDATE post_images SET image_url = $1 WHERE post_id = $2',
      [image_url, post_id]
    );
  }
};

const seedComments = async (count) => {
  const { rows: users } = await pool.query('SELECT id FROM users');
  const { rows: posts } = await pool.query('SELECT id FROM posts');
  for (let i = 0; i < count; i++) {
    const content = faker.lorem.sentence();
    const user_id = users[randomInt(0, users.length - 1)].id;
    const post_id = posts[randomInt(0, users.length - 1)].id;

    await pool.query(
      'INSERT INTO comments (content, user_id, post_id) VALUES ($1, $2, $3)',
      [content, user_id, post_id]
    );
  }
};

const seedLikes = async (count) => {
  const { rows: users } = await pool.query('SELECT id FROM users');
  const { rows: posts } = await pool.query('SELECT id FROM posts');
  for (let i = 0; i < count; i++) {
    const user_id = users[randomInt(0, users.length - 1)].id;
    const post_id = posts[randomInt(0, users.length - 1)].id;

    await pool.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2)', [
      user_id,
      post_id,
    ]);
  }
};

const seedFollowers = async (count, usersCount) => {
  const { rows: users } = await pool.query('SELECT id FROM users');
  for (let i = 0; i < count; i++) {
    const user_id = users[randomInt(0, users.length - 1)].id;
    const follower_id = users[randomInt(0, users.length - 1)].id;

    // Ensure user_id and follower_id are not the same
    if (user_id !== follower_id) {
      await pool.query(
        'INSERT INTO followers (user_id, follower_id) VALUES ($1, $2)',
        [user_id, follower_id]
      );
    } else {
      i--; // If user_id and follower_id are the same, decrement 'i' to repeat the iteration
    }
  }
};

const seedMessages = async (count, usersCount) => {
  const { rows: users } = await pool.query('SELECT id FROM users');
  for (let i = 0; i < count; i++) {
    const sender_id = users[randomInt(0, users.length - 1)].id;
    const receiver_id = users[randomInt(0, users.length - 1)].id;
    const content = faker.lorem.sentences();
    if (sender_id !== receiver_id) {
      await pool.query(
        'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)',
        [sender_id, receiver_id, content]
      );
    } else {
      i--;
    }
  }
};

const seedNotifications = async (count, usersCount) => {
  const { rows: users } = await pool.query('SELECT id FROM users');
  const actions = ['like', 'comment', 'follow'];

  for (let i = 0; i < count; i++) {
    const recipient_id = users[randomInt(0, users.length - 1)].id;
    const actor_id = users[randomInt(0, users.length - 1)].id;
    const action = actions[randomInt(0, actions.length - 1)];
    const target_id = randomInt(1, usersCount);
    const is_read = Math.random() < 0.5;

    await pool.query(
      'INSERT INTO notifications (recipient_id, actor_id, action, target_id, is_read) VALUES ($1, $2, $3, $4, $5)',
      [recipient_id, actor_id, action, target_id, is_read]
    );
  }
};

const seedPostTags = async (count) => {
  const { rows: posts } = await pool.query('SELECT id FROM posts');
  const { rows: tags } = await pool.query('SELECT id FROM tags');
  for (let i = 0; i < count; i++) {
    const post_id = posts[randomInt(0, posts.length - 1)].id;
    const tag_id = tags[randomInt(0, tags.length - 1)].id;

    await pool.query(
      'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)',
      [post_id, tag_id]
    );
  }
};

const seedTags = async (count) => {
  const uniqueTags = new Set();

  while (uniqueTags.size < count) {
    const tagName = faker.lorem.word().toLowerCase();
    uniqueTags.add(tagName);
  }

  for (const tagName of uniqueTags) {
    await pool.query('INSERT INTO tags (name) VALUES ($1)', [tagName]);
  }
};

// Add more seed functions for other tables here

(async () => {
  await pool.connect({
    host: 'localhost',
    port: 5432,
    database: 'post-social',
    user: 'vanama',
    password: 'password',
  });

  // await seedUsers(500);
  // await seedPosts(500);
  await seedPostImages(500);
  // await seedComments(500);
  // await seedLikes(500);
  // await seedFollowers(500);
  // await seedMessages(500);
  // await seedNotifications(500, 500);
  // await seedTags(20);
  // await seedPostTags(500);

  // Call other seed functions here

  console.log('Seeding completed successfully');
  process.exit(0);
})();
