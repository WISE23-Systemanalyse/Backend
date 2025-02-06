
export const mockCategories: Array<{ id: number; category_name: string; surcharge: number | null }> = [
  {
    id: 1,
    category_name: "Lebensmittel",
    surcharge: null,
  },
  {
    id: 2,
    category_name: "Transport",
    surcharge: null,
  },
];


export const mockCategory = {
  id: 1,
  category_name: "Test Category",
  surcharge: null,
  description: "Test Description",
  created_at: new Date(),
  updated_at: new Date()
};

export const mockTable = "categories";

export const mockChain = {
  from: () => mockChain,
  where: () => mockChain,
  values: () => mockChain,
  set: () => mockChain,
  returning: () => Promise.resolve([mockCategory])
};

export const mockDb = {
  select: () => mockChain,
  insert: () => mockChain,
  update: () => mockChain,
  delete: () => mockChain,
  query: {
    categories: {
      findFirst: () => Promise.resolve(mockCategory)
    }
  }
}; 