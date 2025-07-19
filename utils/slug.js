// utils/slug.js

// Ex: "Chaise Scandinave Blanche" → "chaise-scandinave-blanche"
export function getSlugByName(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // remplace tout sauf lettres/chiffres par -
      .replace(/(^-|-$)/g, '');     // retire - au début et à la fin
  }
  
  // Ex: "chaise-scandinave-blanche" → regex pour trouver "Chaise Scandinave Blanche"
  export function getNameBySlug(slug) {
    // transforme le slug en mots séparés par espace
    const words = slug.replace(/-/g, ' ');
    // crée une regex insensible à la casse et flexible sur les espaces
    return new RegExp(`^${words.replace(/\s+/g, '\\s+')}$`, 'i');
  }
  