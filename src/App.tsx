import React, { useState } from 'react';
import { PersonForm } from './components/PersonForm';
import { FamilyTreeView } from './components/FamilyTreeView';
import { useFamilyStore } from './store/familyStore';

function App() {
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const { addPerson } = useFamilyStore();

  const handleAddPerson = (data: {
    name: string;
    gender: 'male' | 'female' | 'other';
    birthDate?: string;
    deathDate?: string;
  }) => {
    addPerson(data);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Family Tree</h1>
            <button
              onClick={() => setIsAddPersonOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Person
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="h-[calc(100vh-200px)]">
            <FamilyTreeView />
          </div>
        </div>
      </main>

      <PersonForm
        isOpen={isAddPersonOpen}
        onClose={() => setIsAddPersonOpen(false)}
        onSubmit={handleAddPerson}
      />
    </div>
  );
}

export default App;