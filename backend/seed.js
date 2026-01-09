const { faker } = require('@faker-js/faker');
const { 
    sequelize, Role, User, Product, 
    ProductVariant, Cart, CartItem, Order, OrderItem 
} = require('./src/models');

const realShoeNames = [
    'Nike Air Max 270', 'Adidas Ultraboost 22', 'Jordan 1 Retro High OG',
    'Yeezy Boost 350 V2', 'Nike Air Force 1', 'Converse Chuck Taylor All Star',
    'Vans Old Skool', 'New Balance 550', 'Puma Suede Classic', 'Asics Gel-Kayano 28'
];

const seedDatabase = async () => {
    try {
        console.log('--- Bắt đầu Seeding dữ liệu ---');

        // 1. Tắt check khóa ngoại và đồng bộ lại từ đầu
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Sử dụng sync({ force: true }) để xóa sạch và tạo lại bảng
        await sequelize.sync({ force: true });
        
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✔ Đã làm sạch và tạo lại cấu trúc Database');

        // 2. Tạo Roles
        const roles = await Role.bulkCreate([
            { code: 'ADMIN', name: 'Administrator' },
            { code: 'USER', name: 'Regular User' }
        ]);
        console.log('✔ Đã tạo Roles');

        // 3. Tạo Users
        const usersData = Array.from({ length: 5 }).map(() => ({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: 'password123',
            phone: faker.phone.number(),
            role_id: roles[1].id,
            is_active: true
        }));
        const createdUsers = await User.bulkCreate(usersData);
        console.log('✔ Đã tạo Users');

        // 4. Tạo Products (Dùng hàm image mới của Faker v10)
        const shuffledShoes = realShoeNames.sort(() => 0.5 - Math.random());
        const productsData = shuffledShoes.slice(0, 10).map((name) => ({
            name,
            description: `Mẫu giày ${name} chính hãng, thiết kế tối ưu cho việc vận động.`,
            image: faker.image.url({ width: 640, height: 480 }) 
        }));
        const createdProducts = await Product.bulkCreate(productsData, { individualHooks: true });
        console.log('✔ Đã tạo Products');

        // 5. Tạo Product Variants (Dùng hàm color mới của Faker v10)
        const variantsData = [];
        for (const product of createdProducts) {
            variantsData.push(
                {
                    product_id: product.id,
                    size: '40',
                    color: faker.color.rgb({ casing: 'hex' }), // Fix lỗi faker.internet.color
                    price: faker.number.float({ min: 100, max: 500, fractionDigits: 2 }),
                    stock: 50
                },
                {
                    product_id: product.id,
                    size: '42',
                    color: faker.color.rgb({ casing: 'hex' }), 
                    price: faker.number.float({ min: 100, max: 500, fractionDigits: 2 }),
                    stock: 20
                }
            );
        }
        const createdVariants = await ProductVariant.bulkCreate(variantsData);
        console.log('✔ Đã tạo Variants với mã màu HEX');

        // 6. Tạo Cart & Order mẫu cho User đầu tiên
        const firstUser = createdUsers[0];
        const cart = await Cart.create({ user_id: firstUser.id });
        await CartItem.create({
            cart_id: cart.id,
            variant_id: createdVariants[0].id,
            quantity: 1
        });

        const order = await Order.create({
            user_id: firstUser.id,
            total_price: createdVariants[1].price,
            status: 'confirmed'
        });
        await OrderItem.create({
            order_id: order.id,
            variant_id: createdVariants[1].id,
            quantity: 1,
            price: createdVariants[1].price
        });

        console.log('--- HOÀN TẤT SEEDING THÀNH CÔNG ---');
        process.exit(0);
    } catch (error) {
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        console.error('✖ Lỗi Seeding:', error);
        process.exit(1);
    }
};

seedDatabase();