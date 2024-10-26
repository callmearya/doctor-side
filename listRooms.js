import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD1b7InCyJf03f82MBrFCXNd_1lir3e1WrQ",
  authDomain: "lil-testing.firebaseapp.com",
  databaseURL: "https://lil-testing-default-rtdb.firebaseio.com",
  projectId: "lil-testing",
  storageBucket: "lil-testing.appspot.com",
  messagingSenderId: "309006701748",
  appId: "1:309006701748:web:2cfa73093e14fbcc2af3e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// HTML elements
const roomsList = document.getElementById('roomsList');

// Fetch and display active rooms
const fetchRooms = () => {
  const roomsRef = ref(db, 'calls'); // Assuming 'calls' is the node where room data is stored
  onValue(roomsRef, (snapshot) => {
    roomsList.innerHTML = ''; // Clear previous list
    snapshot.forEach((childSnapshot) => {
      const roomId = childSnapshot.key;
      const roomElement = document.createElement('div');
      roomElement.textContent = `Room: ${roomId}`;
      roomsList.appendChild(roomElement);
    });
  });
};

// Fetch rooms on load
fetchRooms();
