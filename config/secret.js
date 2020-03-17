if (!process.env.JWT_SECRET) {
  throw new Error('No JWT_SECRET found!  Please update your .env');
}

module.exports = process.env.JWT_SECRET;
