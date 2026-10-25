export type CatalogProduct = { id: string; name: string; slug: string; description: string; price: number; stock: number; imageUrl: string[]; categoryId: string; category: { id: string; name: string; slug: string }; isFeatured: boolean };

const categoryData = [
  { id: 'clothes', name: 'Clothes', slug: 'clothes' },
  { id: 'shoes', name: 'Shoes', slug: 'shoes' }
];

const itemData = [
  ['Suit', 'suit', 120, 6, 'clothes', true, '/images/suit.jpeg', 'A polished tailored suit selected for the TASHY\'S BOUTIQUE collection.'],
  ['Satin Blouse', 'satin-blouse', 58, 10, 'clothes', true, '/images/satin%20blouse%20.jpeg', 'A softly draped satin blouse for an effortlessly dressed-up look.'],
  ['Pink Heels', 'pink-heels', 105, 9, 'shoes', true, '/images/pink%20heels.jpeg', 'A statement pair of pink heels with a sleek, elegant silhouette.'],
  ['Picnic Dress', 'picnic-dress', 95, 8, 'clothes', true, '/images/picnic%20dress.jpeg', 'A playful picnic-ready dress made for sunny days out.'],
  ['Jean Skirt', 'jean-skirt', 65, 7, 'clothes', false, '/images/jean%20skirt.jpeg', 'A classic jean skirt that pairs easily with your everyday favorites.'],
  ['Elegant White Dress', 'elegant-white-dress', 110, 5, 'clothes', true, '/images/elegent%20white%20dress.jpeg', 'A crisp, elegant white dress for special moments and celebrations.'],
  ['Denim Skirt', 'denim-skirt', 72, 9, 'clothes', false, '/images/denim%20skirt.jpeg', 'A versatile denim skirt with an easy, flattering fit.'],
  ['Denim Dress', 'denim-dress', 90, 6, 'clothes', true, '/images/denim%20dress.jpeg', 'A confident denim dress with a modern, easy-to-style shape.'],
  ['Blazer Dress', 'blazer-dress', 125, 4, 'clothes', true, '/images/blazer%20dresss.jpeg', 'A bold blazer dress for a polished statement look.']
] as const;

export const shopCategorySlugs: string[] = ['clothes', 'shoes'];
export const sampleCategories = categoryData;
export const sampleProducts: CatalogProduct[] = itemData.map(([name, slug, price, stock, categorySlug, isFeatured, image, description]) => {
  const category = categoryData.find((item) => item.slug === categorySlug)!;
  return { id: slug, name, slug, price, stock, categoryId: category.id, category, isFeatured, description, imageUrl: [image] };
});

export async function listProducts() {
  try {
    const { prisma } = await import('@/lib/db');
    const { decodeImageUrls } = await import('@/lib/images');
    const items = await prisma.product.findMany({ where: { imageUrl: { contains: '/images/' }, category: { slug: { in: shopCategorySlugs } } }, include: { category: true }, orderBy: { createdAt: 'desc' } });
    if (items.length) return items.map((item) => ({ ...item, price: Number(item.price), imageUrl: decodeImageUrls(item.imageUrl) })) as CatalogProduct[];
  } catch { /* Show the seeded preview catalog until a database is configured. */ }
  return sampleProducts;
}