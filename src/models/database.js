const { PrismaClient } = require("@prisma/client");

// PATRON SINGLETON: una unica instancia de PrismaClient en toda la app.
class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    this.prisma = new PrismaClient();
    Database.instance = this;
  }

  static getInstance() {
    return Database.instance || new Database();
  }

  get client() {
    return this.prisma;
  }
}

module.exports = Database;
