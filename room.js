// room.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get, remove } from 'firebase/database';

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
const db = getDatabase(app);
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

  const roomRef = ref(db, `rooms/${roomId}`);
  const participantsRef = child(roomRef, 'participants');

  // Add local participant
  const localParticipant = push(participantsRef);
  set(localParticipant, { joinedAt: Date.now() });

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
  await remove(localParticipant);

  // Check if any participants are left
  const snapshot = await get(participantsRef);
  if (!snapshot.exists()) {
    await remove(roomRef); // Delete room if no participants left
  }

  // Close streams and peer connection
  localStream.getTracks().forEach(track => track.stop());
  pc.close();
  window.location.href = '/';
}

joinRoom();
