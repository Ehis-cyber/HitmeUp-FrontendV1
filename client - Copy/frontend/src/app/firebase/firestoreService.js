import { doc, setDoc, getDocs, getDoc, collection, query, where } from "firebase/firestore"; 
import { db } from "@/app/firebase/firebaseConfig";

/**
 * Updates or creates a Firestore document for a user.
 * @param {string} userId - The UID of the authenticated user.
 * @param {object} data - The data to be saved in the Firestore document.
 */
export const updateUserDocument = async (userId, data) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, data, { merge: true });
    console.log("User document updated successfully!");
  } catch (error) {
    console.error("Error updating user document:", error);
    throw error; // Re-throw to handle it later
  }
};

/**
 * Checks if a given NIN already exists in the Firestore users collection.
 * @param {string} NIN - The National Identification Number to check.
 * @returns {Promise<boolean>} - Returns `true` if the NIN exists, otherwise `false`.
 */
export const checkNINExists = async (NIN) => {
  try {
      const ninRef = collection(db, 'users');
      const q = query(ninRef, where('NIN', '==', NIN)); // Assuming NIN is a field in the document
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty; // Returns true if NIN exists, false if not
  } catch (error) {
      console.error("Error checking NIN existence: ", error);
      throw error;
  }
};

/**
 * Checks if a given username already exists in the Firestore users collection.
 * @param {string} username - The username to check.
 * @returns {Promise<boolean>} - Returns `true` if the username exists, otherwise `false`.
 */
export const checkUsernameExists = async (username) => {
  try {
    const usersCollection = collection(db, "users");
    const usernameQuery = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(usernameQuery);

    return !querySnapshot.empty; // Return true if username exists
  } catch (error) {
    console.error("Error checking username existence:", error);
    throw error; // Re-throw to handle it later
  }
};
