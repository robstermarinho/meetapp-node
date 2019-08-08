module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn(
      'subscriptions',
      'subscribed_at',
      'created_at'
    );
  },

  down: queryInterface => {
    return queryInterface.renameColumn(
      'subscriptions',
      'created_at',
      'subscribed_at'
    );
  },
};
