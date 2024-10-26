// room.js
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
const hangupButton = document.getElementById('hangupButton');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const roomId = new URLSearchParams(window.location.search).get('roomId');
const pc = new RTCPeerConnection(/* ICE Servers */);
let localStream = null;

// Join Room and Set Up Stream
async function joinRoom() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;

  const roomRef = db.ref(`rooms/${roomId}`);
  const participantsRef = roomRef.child('participants');

  // Add local participant
  const localParticipant = participantsRef.push();
  localParticipant.set({ joinedAt: Date.now() });

  // Listen for remote stream
  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  // Setup signaling listeners (using your WebRTC signaling logic)
  // ...

  // Hangup button
  hangupButton.onclick = async () => {
    await endCall(roomRef, localParticipant);
  };
}

// End Call and Delete Room
async function endCall(roomRef, localParticipant) {
  // Remove participant
  await localParticipant.remove();

  // Check if any participants are left
  const snapshot = await roomRef.child('participants').once('value');
  if (!snapshot.exists()) {
    await roomRef.remove(); // Delete room if no participants left
  }

  // Close streams and peer connection
  localStream.getTracks().forEach(track => track.stop());
  pc.close();
  window.location.href = '/';
}

joinRoom();
