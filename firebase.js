// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTgpoZa9fq3AvZsa0Q6yQdLfKaH5F5jtY",
  authDomain: "universe-850ec.firebaseapp.com",
  projectId: "universe-850ec",
  storageBucket: "universe-850ec.appspot.com",
  messagingSenderId: "722488042945",
  appId: "1:722488042945:web:df4282246a1cc56afdbb40",
  measurementId: "G-W8F83KNMYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export {db,storage}