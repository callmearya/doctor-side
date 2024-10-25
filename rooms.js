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

const roomsList = document.getElementById('roomsList');

function displayAvailableRooms() {
  const roomsRef = database.ref('rooms');

  // Listen for changes to the rooms node
  roomsRef.on('value', (snapshot) => {
    roomsList.innerHTML = ''; // Clear the list

    // Check if there are any rooms available
    if (!snapshot.exists()) {
      roomsList.textContent = 'No available rooms at the moment.';
      return;
    }

    // Iterate through rooms and create room elements
    snapshot.forEach((roomSnapshot) => {
      const roomId = roomSnapshot.key;
      const roomDiv = document.createElement('div');
      roomDiv.textContent = `Room ID: ${roomId}`;
      roomDiv.onclick = () => joinRoom(roomId); // Attach click event to join room
      roomsList.appendChild(roomDiv);
    });
  });
}

async function joinRoom(roomId) {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: ['stun:stun1.l.google.com:19302'] }],
    iceCandidatePoolSize: 10,
  });

  let localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  let remoteStream = new MediaStream();

  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
  };

  const roomRef = database.ref(`rooms/${roomId}`);
  const roomSnapshot = await roomRef.get();
  const roomData = roomSnapshot.val();

  if (!roomData || !roomData.offer) {
    alert('Invalid room ID or the room has no offer.');
    return;
  }

  await pc.setRemoteDescription(new RTCSessionDescription(roomData.offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  roomRef.update({ answer });
}

// Display the list of rooms when the page loads
displayAvailableRooms();

// Display the list of rooms when the page loads
displayAvailableRooms();
