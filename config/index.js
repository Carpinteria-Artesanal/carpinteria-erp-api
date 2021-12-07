const config = {
  port: 3008,
  session: {
    secret: 'dff4gdf56g4d6f5g4d6f5g46d5fw',
    timeout: '1h',
  },
  mongo: {
    user: process.env.DATABASE_ROOT_USERNAME || '',
    pass: process.env.DATABASE_ROOT_PASSWORD || '',
    port: ['27017'],
    host: [process.env.DATABASE_HOST || '127.0.0.1'],
    dataBaseName: process.env.DATABASE_NAME || 'carpinteria',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};

module.exports = config;
