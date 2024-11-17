export interface Person {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  gender: 'male' | 'female' | 'other';
  parentIds: string[];
  spouseIds: string[];
  childrenIds: string[];
}

export interface FamilyTree {
  people: Record<string, Person>;
  rootId?: string;
}