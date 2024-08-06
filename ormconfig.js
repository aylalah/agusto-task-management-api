module.exports = [
  {
    "name": "migration",
    "type": process.env.DB_DIALECT,
    "host": process.env.DB_HOST,
    "port": 3306,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "cli": {
      "migrationsDir": "src/migrations"
    },
    "migrations": [
      "dist/migrations/**/*.js"
    ]
  },
  {
    "name": "seed",
    "type": process.env.DB_DIALECT,
    "host": process.env.DB_HOST,
    "port": 3306,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "cli": {
      "migrationsDir": "src/seeds"
    },
    "migrations": [
      "dist/seeds/**/*.js"
    ]
  }
]