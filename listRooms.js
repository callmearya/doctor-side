import './style.css';
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD1b7InCyJf03f82MBrFCXNd_1lir3e1WrQ",
  authDomain: "lil-testing.firebaseapp.com",
  databaseURL: "https://lil-testing-default-rtdb.firebaseio.com",
  projectId: "lil-testing",
  storageBucket: "lil-testing.appspot.com",
  messagingSenderId: "309006701748",
  appId: "1:309006701748:web:2cfa73093e14fbcc2af3e1"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

// HTML element to display rooms
const roomsList = document.getElementById('roomsList');

// Fetch and display active rooms from Firestore
const fetchRooms = async () => {
  const callsCollection = firestore.collection('calls');
  const querySnapshot = await callsCollection.get();
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
