import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDuTQfIE7JjFHXE0g5Hj9sODIPBaK9lBvk",
  authDomain: "my-chat-app-bbfbc.firebaseapp.com",
  projectId: "my-chat-app-bbfbc",
  storageBucket: "my-chat-app-bbfbc.appspot.com",
  messagingSenderId: "481310177713",
  appId: "1:481310177713:web:030de88bd250d39554a590"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()