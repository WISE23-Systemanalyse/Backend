interface TestEntity {
    id: number;
    name: string;
  }
  
  // Mock-Tabelle
  const mockTable = {
    id: 'id',
    name: 'name'
  };
  
  // Mock-Daten
  const mockEntity: TestEntity = {
    id: 1,
    name: 'Test Entity'
  };
  
  // Mock-Chain-Objekt
  const mockChain = {
    from: () => mockChain,
    where: () => mockChain,
    values: () => mockChain,
    set: () => mockChain,
    returning: () => Promise.resolve([mockEntity])
  };
  
  // Mock DB-Instanz
  const mockDb = {
    select: () => mockChain,
    insert: () => mockChain,
    update: () => mockChain,
    delete: () => mockChain,
  };
  

export { mockChain, mockDb, mockEntity, mockTable };
export type { TestEntity };