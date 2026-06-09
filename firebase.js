import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  update
}
from
"https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsXqYKA1J-rc8-kVuk8tDyn0zivv0JhY8",

  authDomain:
  "kapsul-noby-2.firebaseapp.com",

  databaseURL:
  "https://kapsul-noby-2-default-rtdb.asia-southeast1.firebasedatabase.app/",

  projectId:
  "kapsul-noby-2",

  storageBucket:
  "kapsul-noby-2.firebasestorage.app",

  messagingSenderId:
  "27443990706",

  appId:
  "1:27443990706:web:9cb5661f043988964f39ab"
};

const app =
initializeApp(firebaseConfig);

const db =
getDatabase(app);

export {
  db,
  ref,
  push,
  set,
  onValue,
  remove,
  update
};
