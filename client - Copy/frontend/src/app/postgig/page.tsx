'use client';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../firebase/firebaseConfig';
import TopNavbar from '../components/navbar/TopNavbar';
import { useRouter } from 'next/navigation';

export default function TaskFormPage() {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [jobBidding, setJobBidding] = useState(false);
  const [location, setLocation] = useState<string>(''); // New location state
  const router = useRouter();

  const handleImageUpload = async (file: File) => {
    const storageRef = ref(storage, 'taskImages/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (err) {
            reject('Failed to get image URL');
          }
        }
      );
    });
  };

  const handleCreateTask = async (
    taskTitle: string,
    taskDescription: string,
    skills: string,
    paymentRange: string,
    duration: string,
    category: string,
    taskersNeeded: number,
    companyName: string,
    location: string // Include location in task data
  ) => {
    if (!user) {
      setMessage('You need to be logged in to create a task.');
      setMessageType('error');
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await handleImageUpload(image);
      }

      const taskData = {
        title: taskTitle,
        description: taskDescription,
        skills,
        paymentRange,
        duration,
        category,
        taskersNeeded,
        postedBy: user.uid,
        createdAt: new Date(),
        imageUrl,
        jobBidding,
        companyName,
        location, // Add location to the task data
      };

      await addDoc(collection(firestore, 'tasks'), taskData);

      setMessage('Task created successfully!');
      setMessageType('success');
      router.push('/tasks');
    } catch (error) {
      console.error('Error creating task: ', error);
      setMessage('Error creating task. Please try again.');
      setMessageType('error');
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskTitle = (e.target as any).taskTitle?.value || '';
    const taskDescription = (e.target as any).taskDescription?.value || '';
    const skills = (e.target as any).skills?.value || '';
    const paymentRange = (e.target as any).paymentRange?.value || '';
    const duration = (e.target as any).duration?.value || '';
    const category = (e.target as any).category?.value || '';
    const taskersNeeded = parseInt((e.target as any).taskersNeeded?.value) || 1;
    const companyName = (e.target as any).companyName?.value || '';
    const location = (e.target as any).location?.value || ''; 

    if (!taskTitle || !taskDescription || !skills || !paymentRange || !duration || !category || !taskersNeeded || !companyName || !location) {
      setMessage('Please fill out all fields.');
      setMessageType('error');
      return;
    }

    handleCreateTask(taskTitle, taskDescription, skills, paymentRange, duration, category, taskersNeeded, companyName, location);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopNavbar />
      <div className="container mt-8 px-4 md:px-8">
        {message && (
          <div className={`alert ${messageType === 'success' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} p-4 rounded-lg border-l-4 mb-6`}>
            <div className="flex justify-between items-center">
              <p className={`text-${messageType === 'success' ? 'green' : 'red'}-700`}>{message}</p>
              <button onClick={() => setMessage(null)} className="text-gray-500 hover:text-gray-700">
                X
              </button>
            </div>
          </div>
        )}
        <form
          className="max-w-lg mx-auto p-10 mb-8 bg-white rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">Post a New Task</h2>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Task Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
              title="Upload an image for the task"
              placeholder="Choose an image file"
            />
          </div>

          {/* Task details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="mb-4">
              <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">Task Title</label>
              <input
                type="text"
                name="taskTitle"
                id="taskTitle"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">Task Description</label>
              <textarea
                name="taskDescription"
                id="taskDescription"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Other inputs */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills</label>
              <input
                type="text"
                name="skills"
                id="skills"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
              />
            </div>
            <div>
              <label htmlFor="paymentRange" className="block text-sm font-medium text-gray-700">Payment Range</label>
              <input
                type="number"
                name="paymentRange"
                id="paymentRange"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="text"
                name="duration"
                id="duration"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                name="category"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
              >
                <option>Beauty</option>
                <option>Electrical</option>
                <option>Errands</option>
                <option>Food Delivery</option>
                <option>Gardening</option>
                <option>Health</option>
                <option>Mechanics</option>
                <option>Moving</option>
                <option>Plumbing</option>
                <option>Tailoring</option>
                <option>Tech</option>
                <option>other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="taskersNeeded" className="block text-sm font-medium text-gray-700">Taskers Needed</label>
              <input
                type="number"
                name="taskersNeeded"
                id="taskersNeeded"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
                min="1"
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
              />
            </div>
          </div>

          {/* New Location field */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3"
              placeholder="Enter the task location"
              required
            />
          </div>

          {/* Submit button */}
          <div className="mb-4">
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700">
              Submit Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
