export function encodeImageUrls(urls: string[]) {
  return JSON.stringify(urls);
}

export function decodeImageUrls(value: string | string[]) {
  if (Array.isArray(value)) return value;
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((url) => typeof url === 'string') ? parsed : [];
  } catch {
    return value ? [value] : [];
  }
}

export function withProductImages<T extends { imageUrl: string | string[] }>(product: T) {
  return { ...product, imageUrl: decodeImageUrls(product.imageUrl) };
}