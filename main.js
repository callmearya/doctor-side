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
const database = firebase.database();

// HTML Element
const roomList = document.getElementById('roomList');

// Listen for changes in the `realtimeCalls` node
database.ref('realtimeCalls').on('value', (snapshot) => {
  roomList.innerHTML = ''; // Clear the list

  snapshot.forEach((childSnapshot) => {
    const roomId = childSnapshot.key;
    const participants = childSnapshot.val().participants || 0;

    // Create a list item for each room
    const listItem = document.createElement('li');
    listItem.textContent = `Room Code: ${roomId} - Participants: ${participants}`;
    
    // Grey out the room if it has 2 participants
    if (participants >= 2) {
      listItem.style.color = 'grey';
    }
    
    roomList.appendChild(listItem);
  });
});
