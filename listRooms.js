import './style.css';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, remove } from 'firebase/database';

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
  const roomsRef = ref(db, 'calls');
  onValue(roomsRef, (snapshot) => {
    roomsList.innerHTML = ''; // Clear previous list
    snapshot.forEach((childSnapshot) => {
      const roomId = childSnapshot.key;
      const roomData = childSnapshot.val();
      const isFull = roomData.participants >= 2; // Assuming you track participants

      const roomElement = document.createElement('div');
      roomElement.textContent = `Room: ${roomId}`;
      roomElement.style.cursor = isFull ? 'not-allowed' : 'pointer';
      roomElement.style.opacity = isFull ? '0.5' : '1';

      if (!isFull) {
        roomElement.onclick = () => {
          joinRoom(roomId);
        };
      }

      roomsList.appendChild(roomElement);
    });
  });
};

// Join Room function
const joinRoom = async (roomId) => {
  // Here you can implement the logic to navigate to the room
  console.log(`Joining room: ${roomId}`);
  
  // After joining, you might want to remove the room offer from the database
  const roomRef = ref(db, `calls/${roomId}`);
  remove(roomRef); // Delete the room offer
  
  // Implement your room joining logic here
};

// Fetch rooms on load
fetchRooms();
