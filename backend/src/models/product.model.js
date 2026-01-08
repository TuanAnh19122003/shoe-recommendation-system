const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const { generateSlug } = require('../utils/slugify');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    image: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
}, {
    tableName: 'products',
    timestamps: true,
    hooks: {
        beforeCreate: (product) => {
            if (product.name && !product.slug) {
                product.slug = generateSlug(product.name);
                console.log('[CREATE SLUG]', product.slug);
            }
        },
        beforeUpdate: (product) => {
            if (product.changed('name')) {
                product.slug = generateSlug(product.name);
                console.log('[UPDATE SLUG]', product.slug);
            }
        }
    }
});

module.exports = Product;
