import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjOUZ5NciV-5Sy0jPJL0fS2aRfWC33big",
  authDomain: "kapsul-noby.firebaseapp.com",
  databaseURL: "https://kapsul-noby-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kapsul-noby",
  storageBucket: "kapsul-noby.firebasestorage.app",
  messagingSenderId: "1857912792",
  appId: "1:1857912792:web:d37a28a824edbc1325bcad",
  measurementId: "G-M3QDHPM2E7"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {
  db,
  ref,
  push,
  set,
  onValue,
  remove
};
