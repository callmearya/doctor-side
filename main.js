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

    // Create a button for each room
    const roomButton = document.createElement('button');
    roomButton.textContent = `Room Code: ${roomId} - Participants: ${participants}`;
    roomButton.style.display = 'block';
    roomButton.style.margin = '0.5rem 0';
    
    // Grey out the button if the room has 2 participants
    if (participants >= 2) {
      roomButton.disabled = true;
      roomButton.style.backgroundColor = 'grey';
    }

    // Add button to the list
    roomList.appendChild(roomButton);
  });
});
