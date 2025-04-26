//new-listing
'use client';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore'; 
import { firestore } from '../firebase/firebaseConfig'; 
import TopNavbar from '../components/navbar/TopNavbar';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const router = useRouter();

  const fetchUserCompanies = async (userId: string) => {
    const companiesRef = collection(firestore, 'companies'); 
    const q = query(companiesRef, where("members", "array-contains", userId)); 

    const querySnapshot = await getDocs(q);
    const companiesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCompanies(companiesList);
  };

  const handleCreateCompany = async (companyName: string) => {
    if (!user) {
      setMessage("You need to be logged in to create a company.");
      setMessageType('error');
      return;
    }
    try {
      await addDoc(collection(firestore, 'companies'), {
        name: companyName,
        members: [user.uid]
      });
      fetchUserCompanies(user.uid);
      setMessage("Company created successfully!");
      setMessageType('success');
      const inputElement = document.querySelector('input[name="companyName"]') as HTMLInputElement | null;
      if (inputElement) {
        inputElement.value = '';
      }
    } catch (error) {
      setMessage("Error creating company. Please try again.");
      setMessageType('error');
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    try {
      await deleteDoc(doc(firestore, 'companies', companyId));
      fetchUserCompanies(user?.uid || '');
      setMessage("Company deleted successfully.");
      setMessageType('success');
    } catch (error) {
      setMessage("Error deleting company. Please try again.");
      setMessageType('error');
    }
  };

  const closeMessage = () => {
    setMessage(null);
    setMessageType(null);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
      if (currentUser) {
        fetchUserCompanies(currentUser.uid); 
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <div className="container mx-auto mt-10 px-4">
        {!user ? (
          <div className="text-center text-lg text-gray-700 font-medium">Please log in to manage your companies.</div>
        ) : (
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">Your Companies</h2>
            <p className="text-gray-500 mt-2 mb-6">Manage or create new companies below.</p>
            {companies.length > 0 ? (
              <div className="space-y-4">
                {companies.map((company) => (
                  <div 
                    key={company.id} 
                    className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(`/postgig?company=${company.name}`)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCompany(company.id);
                      }} 
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg p-6 text-gray-700 text-center">No companies found.</div>
            )}
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-3xl font-semibold text-gray-800">Create a New Company</h2>
          <p className="text-gray-500 mt-2 mb-4">Fill in the details below to create a new company.</p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const companyName = form.elements.namedItem("companyName") as HTMLInputElement;
              handleCreateCompany(companyName.value);
              //handleCreateCompany(companyName.value);
            }}
            className="bg-white shadow-md rounded-lg p-6 flex space-x-4 items-center"
          >
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors"
            >
              Create
            </button>
          </form>
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-lg shadow ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className="flex justify-between items-center">
              <span>{message}</span>
              <button 
                onClick={closeMessage} 
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
