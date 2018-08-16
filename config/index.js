const baseConfig = {
  development: {
    username: "postgres",
    password: null,
    database: "chatapp_dev",
    host: "127.0.0.1",
    dialect: "postgresql"
  },
  
  test: {
    username: "postgres",
    password: null,
    database: "chatapp_test",
    host: "127.0.0.1",
    dialect: "postgresql"
  },
  
  production: {
    username: "postgres",
    password: null,
    database: "chatapp_production",
    host: "127.0.0.1",
    dialect: "postgresql"
  }
}

module.exports = baseConfig