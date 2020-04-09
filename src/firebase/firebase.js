import firebase from "firebase";
import config from "./firebase-config.json";
import "firebase/firestore";

// Initialize Firebase
firebase.initializeApp(config);

export default firebase;
export const database = firebase.firestore();
