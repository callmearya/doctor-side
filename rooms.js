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

const servers = {
  iceServers: [{ urls: ['stun:stun1.l.google.com:19302'] }],
  iceCandidatePoolSize: 10,
};

// DOM elements
const roomsList = document.getElementById('roomsList');

function displayAvailableRooms() {
  const roomsRef = database.ref('rooms');
  roomsRef.on('value', (snapshot) => {
    roomsList.innerHTML = ''; // Clear the list
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
  // Initialize peer connection
  const pc = new RTCPeerConnection(servers);
  let localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  let remoteStream = new MediaStream();

  // Add local stream tracks to the peer connection
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  // Set up remote stream handling
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
  };

  // Get room reference from database
  const roomRef = database.ref(`rooms/${roomId}`);
  const roomSnapshot = await roomRef.get();
  const roomData = roomSnapshot.val();

  // Handle incoming offer and set remote description
  const offer = roomData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offer));

  // Create answer
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  // Update Firebase with the answer
  roomRef.update({ answer });

  // Display streams (this can be enhanced with video elements similar to `main.js`)
  document.body.appendChild(document.createTextNode("Joined Room! Local and remote streams are active."));
}

// Display the list of rooms when the page loads
displayAvailableRooms();
