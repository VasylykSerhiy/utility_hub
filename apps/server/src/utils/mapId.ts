export const mapId = <T>(doc: T): T => {
  if (Array.isArray(doc)) {
    return doc.map(mapId) as T;
  }

  if (doc instanceof Date) {
    return doc;
  }

  if (doc && typeof doc === 'object') {
    const newObj: Record<string, unknown> = {};
    for (const key in doc) {
      if (key === '_id') {
        newObj.id = doc[key]?.toString();
      } else {
        newObj[key] = mapId(doc[key]);
      }
    }
    return newObj as T;
  }

  return doc;
};
