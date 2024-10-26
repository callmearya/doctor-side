import './style.css';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { RTCPeerConnection, RTCSessionDescription } from 'wrtc';

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

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Global State
const pc = new RTCPeerConnection(servers);
let localStream = null;

// HTML elements
const webcamVideo = document.getElementById('webcamVideo');
const hangupButton = document.getElementById('hangupButton');

// Start the webcam and join the room
const joinRoom = async (roomId) => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });
  webcamVideo.srcObject = localStream;

  // Listen for the room offer
  const roomRef = ref(db, `calls/${roomId}`);
  onValue(roomRef, (snapshot) => {
    const roomData = snapshot.val();
    if (roomData && roomData.offer) {
      pc.setRemoteDescription(new RTCSessionDescription(roomData.offer));
    }
  });

  // Hangup button functionality
  hangupButton.onclick = () => {
    hangupRoom(roomId);
  };
};

// Hangup Room function
const hangupRoom = (roomId) => {
  const roomRef = ref(db, `calls/${roomId}`);
  remove(roomRef); // Delete the call offer
  pc.close(); // Close the peer connection
  localStream.getTracks().forEach(track => track.stop()); // Stop local tracks
  console.log(`Left room: ${roomId}`);
};

// Fetch room ID from URL or any other method to get the room ID
const roomId = new URLSearchParams(window.location.search).get('roomId');
if (roomId) {
  joinRoom(roomId);
}
