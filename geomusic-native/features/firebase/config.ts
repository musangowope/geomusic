// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  DocumentData,
  QuerySnapshot,
  DocumentReference,
} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_APP_ID || '',
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID || '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

/**
 * Add a document to a collection
 * @param collectionName The name of the collection
 * @param data The data to add to the collection
 * @returns A promise that resolves to the document reference
 */
export const addDataToCollection = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<DocumentReference<DocumentData>> => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, data);
    console.log(`Document added with ID: ${docRef.id}`);
    return docRef;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

/**
 * Get all documents from a collection
 * @param collectionName The name of the collection
 * @returns A promise that resolves to an array of documents
 */
export const getDataFromCollection = async (
  collectionName: string
): Promise<DocumentData[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);

    const documents: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return documents;
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

/**
 * Query documents from a collection based on a field value
 * @param collectionName The name of the collection
 * @param field The field to query on
 * @param value The value to match
 * @returns A promise that resolves to an array of matching documents
 */
export const queryCollection = async (
  collectionName: string,
  field: string,
  value: any
): Promise<DocumentData[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where(field, '==', value));
    const querySnapshot = await getDocs(q);

    const documents: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return documents;
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
};

/**
 * Update a document in a collection
 * @param collectionName The name of the collection
 * @param documentId The ID of the document to update
 * @param data The data to update in the document
 * @returns A promise that resolves when the update is complete
 */
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<void> => {
  try {
    const documentRef = doc(db, collectionName, documentId);
    await updateDoc(documentRef, data);
    console.log(`Document ${documentId} successfully updated`);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

/**
 * Delete a document from a collection
 * @param collectionName The name of the collection
 * @param documentId The ID of the document to delete
 * @returns A promise that resolves when the deletion is complete
 */
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  try {
    const documentRef = doc(db, collectionName, documentId);
    await deleteDoc(documentRef);
    console.log(`Document ${documentId} successfully deleted`);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export { app, analytics, db };
