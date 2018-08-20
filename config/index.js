const baseConfig = {
  development: {
    username: "postgres",
    password: null,
    database: "chatapp_dev",
    host: "127.0.0.1",
    dialect: "postgresql",
    logging: false,
  },
  
  test: {
    username: "postgres",
    password: null,
    database: "chatapp_test",
    host: "127.0.0.1",
    dialect: "postgresql",
    logging: false,
  },
  
  production: {
    username: "postgres",
    password: null,
    database: "chatapp_production",
    host: "127.0.0.1",
    dialect: "postgresql",
    logging: false,
  }
}

module.exports = baseConfig