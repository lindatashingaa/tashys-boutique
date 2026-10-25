import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { encodeImageUrls } from '../lib/images';

const prisma = new PrismaClient();

const categories = [
  { name: 'Dresses', slug: 'dresses', description: 'Statement pieces for every entrance.' },
  { name: 'Shoes', slug: 'shoes', description: 'The finishing touch, from day to after dark.' },
  { name: 'Bags', slug: 'bags', description: 'Little luxuries that make the look.' }
];

const products = [
  { name: 'Suit', slug: 'suit', category: 'dresses', price: 120, stock: 6, featured: true, image: '/images/suit.jpeg', description: "A polished tailored suit selected for the TASHY'S BOUTIQUE collection." },
  { name: 'Satin Blouse', slug: 'satin-blouse', category: 'dresses', price: 58, stock: 10, featured: true, image: '/images/satin%20blouse%20.jpeg', description: 'A softly draped satin blouse for an effortlessly dressed-up look.' },
  { name: 'Pink Heels', slug: 'pink-heels', category: 'shoes', price: 105, stock: 9, featured: true, image: '/images/pink%20heels.jpeg', description: 'A statement pair of pink heels with a sleek, elegant silhouette.' },
  { name: 'Picnic Dress', slug: 'picnic-dress', category: 'dresses', price: 95, stock: 8, featured: true, image: '/images/picnic%20dress.jpeg', description: 'A playful picnic-ready dress made for sunny days out.' },
  { name: 'Jean Skirt', slug: 'jean-skirt', category: 'dresses', price: 65, stock: 7, featured: false, image: '/images/jean%20skirt.jpeg', description: 'A classic jean skirt that pairs easily with your everyday favorites.' },
  { name: 'Elegant White Dress', slug: 'elegant-white-dress', category: 'dresses', price: 110, stock: 5, featured: true, image: '/images/elegent%20white%20dress.jpeg', description: 'A crisp, elegant white dress for special moments and celebrations.' },
  { name: 'Denim Skirt', slug: 'denim-skirt', category: 'dresses', price: 72, stock: 9, featured: false, image: '/images/denim%20skirt.jpeg', description: 'A versatile denim skirt with an easy, flattering fit.' },
  { name: 'Denim Dress', slug: 'denim-dress', category: 'dresses', price: 90, stock: 6, featured: true, image: '/images/denim%20dress.jpeg', description: 'A confident denim dress with a modern, easy-to-style shape.' },
  { name: 'Blazer Dress', slug: 'blazer-dress', category: 'dresses', price: 125, stock: 4, featured: true, image: '/images/blazer%20dresss.jpeg', description: 'A bold blazer dress for a polished statement look.' }
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({ where: { slug: category.slug }, update: category, create: category });
  }

  const bagsCategory = await prisma.category.findUniqueOrThrow({ where: { slug: 'bags' } });
  const legacyBags = await prisma.category.findUnique({ where: { slug: 'bags-accessories' } });
  if (legacyBags) {
    await prisma.product.updateMany({ where: { categoryId: legacyBags.id }, data: { categoryId: bagsCategory.id } });
    await prisma.category.delete({ where: { id: legacyBags.id } });
  }

  const legacyHeels = await prisma.product.findUnique({ where: { slug: 'blush-pointed-heels' } });
  const pinkHeels = await prisma.product.findUnique({ where: { slug: 'pink-heels' } });
  if (legacyHeels && !pinkHeels) {
    await prisma.product.update({ where: { id: legacyHeels.id }, data: { name: 'Pink Heels', slug: 'pink-heels' } });
  }

  const adminPassword = await bcrypt.hash('admin123', 12);
  const customerPassword = await bcrypt.hash('customer123', 12);
  await prisma.user.upsert({ where: { email: 'admin@tashys.com' }, update: { name: 'Tashy Admin', phone: '0711692134', password: adminPassword, role: 'ADMIN' }, create: { name: 'Tashy Admin', email: 'admin@tashys.com', phone: '0711692134', password: adminPassword, role: 'ADMIN' } });
  await prisma.user.upsert({ where: { email: 'customer@test.com' }, update: { name: 'Boutique Customer', phone: '0771234567', password: customerPassword }, create: { name: 'Boutique Customer', email: 'customer@test.com', phone: '0771234567', password: customerPassword } });

  for (const item of products) {
    const { category, image, featured, ...product } = item;
    const categoryRecord = await prisma.category.findUniqueOrThrow({ where: { slug: category } });
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product, imageUrl: encodeImageUrls([image]), isFeatured: featured, categoryId: categoryRecord.id },
      create: { ...product, imageUrl: encodeImageUrls([image]), isFeatured: featured, categoryId: categoryRecord.id }
    });
  }

  const currentSlugs = products.map((product) => product.slug);
  const oldProducts = await prisma.product.findMany({ where: { slug: { notIn: currentSlugs } }, select: { id: true } });
  for (const oldProduct of oldProducts) {
    await prisma.cartItem.deleteMany({ where: { productId: oldProduct.id } });
    const orderItemCount = await prisma.orderItem.count({ where: { productId: oldProduct.id } });
    if (orderItemCount === 0) await prisma.product.delete({ where: { id: oldProduct.id } });
  }
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());