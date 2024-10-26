// listRooms.js
import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD1b7InCyJf03f82MBrFCXNd_1lir3nWrQ",
  authDomain: "lil-testing.firebaseapp.com",
  databaseURL: "https://lil-testing-default-rtdb.firebaseio.com",
  projectId: "lil-testing",
  storageBucket: "lil-testing.appspot.com",
  messagingSenderId: "309006701748",
  appId: "1:309006701748:web:2cfa73093e14fbcc2af3e1"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const roomsList = document.getElementById('roomsList');

async function fetchRooms() {
  const roomsRef = db.ref('rooms');
  roomsRef.on('value', (snapshot) => {
    roomsList.innerHTML = ''; // Clear existing rooms
    snapshot.forEach((roomSnapshot) => {
      const room = roomSnapshot.val();
      const roomId = roomSnapshot.key;
      const isFull = room.participants && Object.keys(room.participants).length >= 2;
      const roomElement = document.createElement('button');
      roomElement.textContent = `Room ${roomId}`;
      roomElement.disabled = isFull; // Grey out if full
      roomElement.classList.add(isFull ? 'room-full' : 'room-available');
      roomElement.onclick = () => joinRoom(roomId);
      roomsList.appendChild(roomElement);
    });
  });
}

function joinRoom(roomId) {
  // Navigate to the room page or initiate joining logic
  window.location.href = `/room.html?roomId=${roomId}`;
}

fetchRooms();
