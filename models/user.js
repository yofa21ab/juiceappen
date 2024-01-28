// models/user.js
class User {
    constructor(username, hashedPassword) {
      this.username = username;
      this.hashedPassword = hashedPassword;
    }
  }
  
  module.exports = User;
  