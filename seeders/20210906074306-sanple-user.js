'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Users', [
            {
                name: 'muratariku',
                pass: '0903',
                mail: 'clu363721@gmail.com',
                age: 22,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'tanakatarou',
                pass: '0902',
                mail: 'clu63721@gmail.com',
                age: 12,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'murataririko',
                pass: '0901',
                mail: 'clu3721@gmail.com',
                age: 23,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
         await queryInterface.bulkDelete('Users', null, {});
    }
};
