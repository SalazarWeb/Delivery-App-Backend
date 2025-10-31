import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserType } from './entities/user.entity';
import { Business } from './entities/business.entity';
import { Product } from './entities/product.entity';
import { Reaction } from './entities/reaction.entity';

// Crear DataSource
// Las variables de entorno se cargan automáticamente desde .env
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'delivery_db',
  entities: [User, Business, Product, Reaction],
  synchronize: true,
  logging: true,
});

async function seed() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  try {
    // Inicializar conexión
    console.log('📡 Conectando a la base de datos...');
    await AppDataSource.initialize();
    console.log('✅ Conexión establecida\n');

    // Obtener repositorios
    const userRepository = AppDataSource.getRepository(User);
    const businessRepository = AppDataSource.getRepository(Business);
    const productRepository = AppDataSource.getRepository(Product);

    // ====================================
    // 1. CREAR USUARIO EMPRESA
    // ====================================
    console.log('👤 Creando usuario empresa...');
    
    // Verificar si ya existe el usuario
    let empresaUser = await userRepository.findOne({
      where: { email: 'empresa@seed.com' },
    });

    if (empresaUser) {
      console.log('⚠️  Usuario empresa ya existe, usando el existente');
    } else {
      const passwordHash = await bcrypt.hash('Empresa123!', 10);

      empresaUser = userRepository.create({
        type: UserType.EMPRESA,
        name: 'Restaurante La Casa del Sabor',
        email: 'empresa@seed.com',
        phone: '+1234567890',
        passwordHash,
      });

      empresaUser = await userRepository.save(empresaUser);
      console.log('✅ Usuario empresa creado');
      console.log(`   - ID: ${empresaUser.id}`);
      console.log(`   - Email: ${empresaUser.email}`);
      console.log(`   - Password: Empresa123!`);
    }

    // ====================================
    // 2. CREAR NEGOCIO
    // ====================================
    console.log('\n🏢 Creando negocio...');

    // Verificar si ya existe el negocio
    let business = await businessRepository.findOne({
      where: { name: 'Pizzería Bella Italia' },
    });

    if (business) {
      console.log('⚠️  Negocio ya existe, usando el existente');
    } else {
      business = businessRepository.create({
        ownerId: empresaUser.id,
        name: 'Pizzería Bella Italia',
        description:
          'Las mejores pizzas artesanales de la ciudad. Recetas tradicionales italianas con ingredientes frescos y de primera calidad.',
        address: 'Av. Principal 123, Centro Histórico',
        whatsappNumber: '+1234567890',
        openingHours: {
          lunes: { open: '12:00', close: '23:00' },
          martes: { open: '12:00', close: '23:00' },
          miercoles: { open: '12:00', close: '23:00' },
          jueves: { open: '12:00', close: '23:00' },
          viernes: { open: '12:00', close: '00:00' },
          sabado: { open: '12:00', close: '00:00' },
          domingo: { open: '12:00', close: '23:00' },
        },
      });

      business = await businessRepository.save(business);
      console.log('✅ Negocio creado');
      console.log(`   - ID: ${business.id}`);
      console.log(`   - Nombre: ${business.name}`);
      console.log(`   - Dirección: ${business.address}`);
    }

    // ====================================
    // 3. CREAR PRODUCTOS
    // ====================================
    console.log('\n🍕 Creando productos...');

    const products = [
      {
        name: 'Pizza Margherita',
        description:
          'La clásica pizza italiana con salsa de tomate San Marzano, mozzarella di bufala, albahaca fresca y aceite de oliva extra virgen.',
        weightGrams: 450,
        quantityUnits: 1,
        price: 12.99,
        imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
        isAvailable: true,
      },
      {
        name: 'Pizza Pepperoni',
        description:
          'Pizza con abundante pepperoni de primera calidad, queso mozzarella derretido y salsa de tomate especiada. La favorita de todos.',
        weightGrams: 500,
        quantityUnits: 1,
        price: 14.99,
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
        isAvailable: true,
      },
      {
        name: 'Pizza Cuatro Quesos',
        description:
          'Exquisita combinación de mozzarella, gorgonzola, parmesano y queso de cabra sobre base de crema. Para los amantes del queso.',
        weightGrams: 480,
        quantityUnits: 1,
        price: 16.99,
        imageUrl: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f',
        isAvailable: true,
      },
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const productData of products) {
      // Verificar si el producto ya existe
      const existingProduct = await productRepository.findOne({
        where: { name: productData.name, businessId: business.id },
      });

      if (existingProduct) {
        console.log(`⚠️  "${productData.name}" ya existe, omitiendo...`);
        skippedCount++;
      } else {
        const product = productRepository.create({
          ...productData,
          businessId: business.id,
        });

        await productRepository.save(product);
        console.log(`✅ "${productData.name}" creado - $${productData.price}`);
        createdCount++;
      }
    }

    // ====================================
    // RESUMEN
    // ====================================
    console.log('\n═══════════════════════════════════════');
    console.log('✅ SEED COMPLETADO CON ÉXITO');
    console.log('═══════════════════════════════════════');
    console.log(`👤 Usuario empresa: ${empresaUser.email}`);
    console.log(`🔑 Password: Empresa123!`);
    console.log(`🏢 Negocio: ${business.name}`);
    console.log(`🍕 Productos creados: ${createdCount}`);
    if (skippedCount > 0) {
      console.log(`⚠️  Productos omitidos (ya existen): ${skippedCount}`);
    }
    console.log('═══════════════════════════════════════\n');

    console.log('📋 PRÓXIMOS PASOS:');
    console.log('1. Iniciar el servidor: pnpm start:dev');
    console.log('2. Login con las credenciales:');
    console.log('   POST http://localhost:3000/api/auth/login');
    console.log('   {');
    console.log('     "email": "empresa@seed.com",');
    console.log('     "password": "Empresa123!"');
    console.log('   }');
    console.log('3. Explorar los productos creados:');
    console.log('   GET http://localhost:3000/api/products');
    console.log('\n✨ ¡Base de datos lista para usar!\n');
  } catch (error) {
    console.error('\n❌ Error durante el seed:');
    console.error(error);
    process.exit(1);
  } finally {
    // Cerrar conexión
    await AppDataSource.destroy();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar seed
seed();
