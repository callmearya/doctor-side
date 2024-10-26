import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD1b7InCyJf03f82MBrFCXNd_1lir3nWrQ",
  authDomain: "lil-testing.firebaseapp.com",
  databaseURL: "https://lil-testing-default-rtdb.firebaseio.com",
  projectId: "lil-testing",
  storageBucket: "lil-testing.appspot.com",
  messagingSenderId: "309006701748",
  appId: "1:309006701748:web:2cfa73093e14fbcc2af3e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// HTML elements
const roomsList = document.getElementById('roomsList');

// Fetch and display active rooms from Firestore
const fetchRooms = async () => {
  const callsCollection = collection(db, 'calls');
  const querySnapshot = await getDocs(callsCollection);
  roomsList.innerHTML = ''; // Clear previous list

  querySnapshot.forEach((doc) => {
    const roomId = doc.id;
    const roomElement = document.createElement('div');
    roomElement.textContent = `Room: ${roomId}`;
    roomsList.appendChild(roomElement);
  });
};

// Fetch rooms on load
fetchRooms();
