import Sequelize, { Model } from 'sequelize';
import bcrypte from 'bcryptjs';

/*
 * User Model
 */

class User extends Model {
  static init(sequelize) {
    // Init method
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // It wont be a field in DB table
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    // Generate the password hash from password field before save the user
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypte.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'avatar_id',
    });
    // this.hasOne
    // this.hasMany
  }

  // Check a password with user password hash using bcrypt
  checkPassword(password) {
    return bcrypte.compare(password, this.password_hash);
  }
}
export default User;
