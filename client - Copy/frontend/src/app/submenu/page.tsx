'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/app/firebase/firebaseConfig';
import Link from 'next/link';

const Submenu = () => {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const checkUserVerification = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, 'users', user.uid); 
                
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists() && docSnap.data().isVerified) {
                    setIsVerified(true);
                } else {
                    setIsVerified(false);
                }
            }
        };

        checkUserVerification();
    }, []);

    const handlePostGigClick = () => {
        if (!isVerified) {
            router.push('/auth/registration');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-950">What would you like to do?</h1>

                {/* Link to Find a Gig */}
                <div className="mb-6 text-center">
                    <Link href="/find-gig" className="text-lg font-medium text-purple-600 hover:underline">
                        Find a Gig
                    </Link>
                </div>

                {/* Link to Post a Gig */}
                <div className="mb-6 text-center">
                    <button
                        onClick={handlePostGigClick}
                        className={`text-lg font-medium text-purple-600 hover:underline ${
                            !isVerified ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                        disabled={!isVerified}
                    >
                        Post a Gig
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Submenu;
