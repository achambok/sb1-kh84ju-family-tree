import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FamilyTree, Person } from '../types/family';
import { v4 as uuidv4 } from 'uuid';

interface FamilyState {
  familyTree: FamilyTree;
  addPerson: (person: Omit<Person, 'id' | 'parentIds' | 'spouseIds' | 'childrenIds'>) => string;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  addRelationship: (personId: string, relatedId: string, type: 'parent' | 'spouse' | 'child') => void;
  removeRelationship: (personId: string, relatedId: string, type: 'parent' | 'spouse' | 'child') => void;
  setRootPerson: (id: string) => void;
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set) => ({
      familyTree: { people: {} },
      
      addPerson: (personData) => {
        const id = uuidv4();
        const person: Person = {
          id,
          ...personData,
          parentIds: [],
          spouseIds: [],
          childrenIds: [],
        };
        
        set((state) => {
          const newState = {
            familyTree: {
              ...state.familyTree,
              people: { ...state.familyTree.people, [id]: person },
            },
          };
          
          // Set as root if this is the first person
          if (!state.familyTree.rootId) {
            newState.familyTree.rootId = id;
          }
          
          return newState;
        });
        
        return id;
      },

      updatePerson: (id, updates) => {
        set((state) => ({
          familyTree: {
            ...state.familyTree,
            people: {
              ...state.familyTree.people,
              [id]: { ...state.familyTree.people[id], ...updates },
            },
          },
        }));
      },

      deletePerson: (id) => {
        set((state) => {
          const { [id]: removed, ...people } = state.familyTree.people;
          return {
            familyTree: {
              ...state.familyTree,
              people,
              rootId: state.familyTree.rootId === id ? undefined : state.familyTree.rootId,
            },
          };
        });
      },

      setRootPerson: (id) => {
        set((state) => ({
          familyTree: {
            ...state.familyTree,
            rootId: id,
          },
        }));
      },

      addRelationship: (personId, relatedId, type) => {
        set((state) => {
          const newPeople = { ...state.familyTree.people };
          
          if (type === 'parent') {
            newPeople[personId].parentIds = [...newPeople[personId].parentIds, relatedId];
            newPeople[relatedId].childrenIds = [...newPeople[relatedId].childrenIds, personId];
          } else if (type === 'spouse') {
            newPeople[personId].spouseIds = [...newPeople[personId].spouseIds, relatedId];
            newPeople[relatedId].spouseIds = [...newPeople[relatedId].spouseIds, personId];
          } else if (type === 'child') {
            newPeople[personId].childrenIds = [...newPeople[personId].childrenIds, relatedId];
            newPeople[relatedId].parentIds = [...newPeople[relatedId].parentIds, personId];
          }

          return {
            familyTree: {
              ...state.familyTree,
              people: newPeople,
            },
          };
        });
      },

      removeRelationship: (personId, relatedId, type) => {
        set((state) => {
          const newPeople = { ...state.familyTree.people };
          
          if (type === 'parent') {
            newPeople[personId].parentIds = newPeople[personId].parentIds.filter(id => id !== relatedId);
            newPeople[relatedId].childrenIds = newPeople[relatedId].childrenIds.filter(id => id !== personId);
          } else if (type === 'spouse') {
            newPeople[personId].spouseIds = newPeople[personId].spouseIds.filter(id => id !== relatedId);
            newPeople[relatedId].spouseIds = newPeople[relatedId].spouseIds.filter(id => id !== personId);
          } else if (type === 'child') {
            newPeople[personId].childrenIds = newPeople[personId].childrenIds.filter(id => id !== relatedId);
            newPeople[relatedId].parentIds = newPeople[relatedId].parentIds.filter(id => id !== personId);
          }

          return {
            familyTree: {
              ...state.familyTree,
              people: newPeople,
            },
          };
        });
      },
    }),
    {
      name: 'family-tree-storage',
    }
  )
);