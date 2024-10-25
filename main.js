import './style.css';
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

// Global state
let pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

const joinRoomButton = document.getElementById('joinRoomButton');
const roomInput = document.getElementById('roomInput');
const webcamVideo = document.getElementById('webcamVideo');
const remoteVideo = document.getElementById('remoteVideo');
const hangupButton = document.getElementById('hangupButton');

joinRoomButton.onclick = async () => {
  const roomId = roomInput.value;
  const roomRef = database.ref(`rooms/${roomId}`);

  // 1. Get user media
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  remoteStream = new MediaStream();

  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
  };

  webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

  // 2. Get the offer from the database
  const roomData = await roomRef.once('value');
  const offer = roomData.val().offer;

  // 3. Set the remote description
  await pc.setRemoteDescription(new RTCSessionDescription(offer));

  pc.onicecandidate = (event) => {
    event.candidate && roomRef.child('answerCandidates').push(event.candidate.toJSON());
  };

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = { sdp: answerDescription.sdp, type: answerDescription.type };
  roomRef.child('answer').set(answer);

  hangupButton.disabled = false;
  hangupButton.onclick = () => {
    // Clean up and hang up the call
    localStream.getTracks().forEach(track => track.stop());
    pc.close();
    roomRef.remove(); // Remove the room from the database
    window.location.href = '../index.html';
  };
