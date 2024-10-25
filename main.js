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

joinRoomButton.onclick = async () => {
  try {
    const roomId = roomInput.value;
    if (!roomId) {
      alert("Please enter a room ID.");
      return;
    }
    
    const roomRef = database.ref(`rooms/${roomId}`);

    // 1. Get user media
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    remoteStream = new MediaStream();

    // Display local video
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
    };
    webcamVideo.srcObject = localStream;
    remoteVideo.srcObject = remoteStream;

    // 2. Retrieve the offer from the database
    const roomData = await roomRef.once('value');
    if (!roomData.exists()) {
      alert("Room ID not found.");
      return;
    }
    const offer = roomData.val().offer;
    if (!offer) {
      alert("No offer found for this room.");
      return;
    }

    // 3. Set remote description with the retrieved offer
    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    // Add ICE candidates to database
    pc.onicecandidate = (event) => {
      event.candidate && roomRef.child('answerCandidates').push(event.candidate.toJSON());
    };

    // 4. Create and set answer description
    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = { sdp: answerDescription.sdp, type: answerDescription.type };
    await roomRef.child('answer').set(answer);

    hangupButton.disabled = false;
  } catch (error) {
    console.error("Error joining room:", error);
  }
};

// Handle hangup button
hangupButton.onclick = () => {
  try {
    localStream.getTracks().forEach(track => track.stop());
    pc.close();
    window.location.href = '../index.html'; // Redirect to main page
  } catch (error) {
    console.error("Error during hangup:", error);
  }
};
