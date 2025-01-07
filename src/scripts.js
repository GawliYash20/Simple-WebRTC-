const userName = "User-" + Math.floor(Math.random() * 100000);
const password = "x";

document.querySelector("#user-name").innerHTML = userName;
const videoForm = document.querySelector("#selectVideo-form");



// Video option
const videoOption = document.getElementById("video-option");

// Initialize Socket.IO connection
const socket = io.connect("https://localhost:8181/", {
// const socket = io.connect("https://[IP_ADDRS]:8180/", {
  auth: {
    userName,
    password,
  },
});

// Select video elements
const localVideoEl = document.querySelector("#local-video");
const remoteVideoEl = document.querySelector("#remote-video");

let localStream;
let remoteStream;
let peerConnection;
let didIOffer = false;

const peerConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};






// Disable (hide) select option
const disableSelectOption = () => {
  videoForm.style.display = "none";
};

// Enable (show) select option
const enableSelectOption = () => {
  videoForm.style.display = "block";
};

function showToast(message, type = 'error') {
  const toastContainer = document.getElementById('toast-container');

  // Create the toast element
  const toast = document.createElement('div');
  toast.classList.add('toast', 'p-3', 'mb-2', 'rounded', 'text-sm', 'animate-toast');
  if (type === 'error') {
    toast.classList.add('bg-red-500');
  } else {
    toast.classList.add('bg-green-600');
  }
  toast.textContent = message;

  // Append the toast to the container
  toastContainer.appendChild(toast);

  // Remove the toast after 3 seconds
  setTimeout(() => {
    toastContainer.removeChild(toast);
  }, 3000); // 3000ms (3 seconds) timeout
}






// Initiate a call
const call = async () => {
  disableSelectOption(); // Disable the select option when making a call
  await fetchUserMedia();
  await createPeerConnection();

  try {
    console.log("Creating offer...");
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    didIOffer = true;
    socket.emit("newOffer", offer);
  } catch (err) {
    console.error("Error creating offer:", err);
  }
};

// Answer an offer
const answerOffer = async (offerObj) => {
  disableSelectOption(); // Disable the select option when answering a call
  await fetchUserMedia();
  await createPeerConnection(offerObj);

  try {
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    offerObj.answer = answer;
    const offerIceCandidates = await socket.emitWithAck("newAnswer", offerObj);

    offerIceCandidates.forEach((candidate) => {
      peerConnection.addIceCandidate(candidate);
      console.log("Added ICE Candidate from offer:", candidate);
    });
  } catch (err) {
    console.error("Error answering offer:", err);
  }
};

// Add an answer to the offer
const addAnswer = async (offerObj) => {
  try {
    await peerConnection.setRemoteDescription(offerObj.answer);
    console.log("Remote description set with answer.");
  } catch (err) {
    console.error("Error setting remote description:", err);
  }
};

// Fetch user media based on selection
const fetchUserMedia = async () => {
  try {
    const selectedOption = videoOption.value || "share-webcam";

    if (selectedOption === "share-screen") {
      localStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          aspectRatio: 16 / 9
        },
        audio: true,
      });
    } else {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        // audio: true,
      });
    }

    localVideoEl.srcObject = localStream;
  } catch (err) {
    console.error("Error accessing media devices:", err);
    // alert("Could not access selected media. Please check permissions.");
    showToast("Could not access selected media. Please check permissions.");
    enableSelectOption();
  }
};

// Create a peer connection
const createPeerConnection = async (offerObj) => {
  peerConnection = new RTCPeerConnection(peerConfiguration);
  remoteStream = new MediaStream();
  remoteVideoEl.srcObject = remoteStream;

  // Add local tracks
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Handle ICE candidates
  peerConnection.addEventListener("icecandidate", (e) => {
    if (e.candidate) {
      socket.emit("sendIceCandidateToSignalingServer", {
        iceCandidate: e.candidate,
        iceUserName: userName,
        didIOffer,
      });
    }
  });

  // Handle remote tracks
  peerConnection.addEventListener("track", (e) => {
    e.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
    remoteVideoEl.srcObject = remoteStream;
    remoteVideoEl.play().catch(console.error);
  });

  // Set remote description if offer object exists
  if (offerObj) {
    await peerConnection.setRemoteDescription(offerObj.offer);
  }
};

// Add a new ICE candidate
const addNewIceCandidate = async (iceCandidate) => {
  try {
    await peerConnection.addIceCandidate(iceCandidate);
    console.log("Added new ICE Candidate.");
  } catch (err) {
    console.error("Error adding ICE Candidate:", err);
  }
};

// Hang up the call
const hangUp = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }
  localVideoEl.srcObject = null;
  remoteVideoEl.srcObject = null;
  enableSelectOption(); // Enable the select option after hanging up
};

// Attach event listeners
document.querySelector("#call").addEventListener("click", call);
document.querySelector("#hangup").addEventListener("click", hangUp);
