const socket = io("/");
const chatInputBox = document.getElementById("chat_message");
const all_messages = document.getElementById("all_messages");
const main__chat__window = document.getElementById("main__chat__window");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

const Showchat = (e) => {
    e.classList.toggle("active");
    document.body.classList.toggle("showchat");
};

const showInvitePop = () => {
    document.body.classList.add("showInvite");
    const roomLinkInput = document.getElementById("roomLink");
    if (roomLinkInput) {
        roomLinkInput.value = window.location.href; // Set the current URL in the input
    }
};

const hideInvitePopup = () => {
    document.body.classList.remove("showInvite");
};

const copyToClipboard = () => {
    const copyText = document.getElementById("roomLink");
    if (copyText) {
        // Use Clipboard API for better reliability
        navigator.clipboard.writeText(copyText.value).then(() => {
            alert("Copied: " + copyText.value);
            hideInvitePopup(); // Hide popup after copying
        }).catch((err) => {
            console.error("Failed to copy: ", err);
        });
    }
};

const peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "3030",
});

let myVideoStream;

navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);

        peer.on("call", (call) => {
            call.answer(stream);
            const video = document.createElement("video");

            call.on("stream", (userVideoStream) => {
                addVideoStream(video, userVideoStream);
            });
        });

        socket.on("user-connected", (userId) => {
            connectToNewUser(userId, stream);
        });

        socket.on("createMessage", (msg) => {
            let li = document.createElement("li");
            li.innerHTML = msg;
            all_messages.append(li);
            main__chat__window.scrollTop = main__chat__window.scrollHeight;
        });

        document.addEventListener("keydown", (e) => {
            if (e.which === 13 && chatInputBox.value !== "") {
                socket.emit("message", chatInputBox.value);
                chatInputBox.value = "";
            }
        });
    });

peer.on("call", function (call) {
    navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", function (remoteStream) {
                addVideoStream(video, remoteStream);
            });
        })
        .catch((err) => {
            console.log("Failed to get local stream", err);
        });
});

peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, streams) => {
    var call = peer.call(userId, streams);
    var video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });
};

const addVideoStream = (videoEl, stream) => {
    videoEl.srcObject = stream;
    videoEl.addEventListener("loadedmetadata", () => {
        videoEl.play();
    });

    videoGrid.append(videoEl);
    let totalUsers = document.getElementsByTagName("video").length;
    if (totalUsers > 1) {
        for (let index = 0; index < totalUsers; index++) {
            document.getElementsByTagName("video")[index].style.width =
                100 / totalUsers + "%";
        }
    }
};

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
};

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
};

const setPlayVideo = () => {
    const html = `<i class="unmute fa fa-pause-circle"></i><span class="unmute">Resume Video</span>`;
    document.getElementById("playPauseVideo").innerHTML = html;
};

const setStopVideo = () => {
    const html = `<i class="fa fa-video-camera"></i><span class="">Pause Video</span>`;
    document.getElementById("playPauseVideo").innerHTML = html;
};

const setUnmuteButton = () => {
    const html = `<i class="unmute fa fa-microphone-slash"></i><span class="unmute">Unmute</span>`;
    document.getElementById("muteButton").innerHTML = html;
};

const setMuteButton = () => {
    const html = `<i class="fa fa-microphone"></i><span>Mute</span>`;
    document.getElementById("muteButton").innerHTML = html;
};

// Add event listener for "Leave Meeting" button
document.getElementById("leave-meeting").addEventListener("click", () => {
    socket.disconnect(); // Disconnect from the server
    window.location.href = "/"; // Redirect to home or a different page
});

// Add event listener for "Participants" button
document.querySelector('.main__controls_button:nth-child(3)').addEventListener("click", () => {
    socket.emit("request-participants");
});

socket.on("participants", (participants) => {
    console.log("Participants:", participants);
    // Handle the display of participants list (e.g., open a modal or alert)
});







// Get elements
const chatbotIcon = document.getElementById('chatbotIcon');
const chatbotWindow = document.getElementById('chatbotWindow');
const closeChatbot = document.getElementById('closeChatbot');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotBody = document.getElementById('chatbotBody');

// Dynamic responses with keyword matching
const keywordResponses = [
    { keywords: ["book", "appointment"], response: "To book an appointment, select a doctor from the 'Doctors' section and pick your preferred time." },
    { keywords: ["upcoming", "appointments"], response: "You can view your upcoming appointments in the 'My Appointments' section." },
    { keywords: ["prescription", "refill"], response: "You can request a prescription refill after consulting a doctor via the 'Pharmacy' section." },
    { keywords: ["ai", "pharmacy", "recommend", "medications"], response: "The AI pharmacy suggests medications based on your symptoms, medical history, and consultation data." },
    { keywords: ["video", "consultation", "specialist"], response: "Yes, you can schedule a video consultation with a specialist directly from the app." },
    { keywords: ["medical", "records"], response: "Your medical records are available in the 'Medical Records' section." },
    { keywords: ["doctors", "specializations"], response: "Our platform covers specializations like General Medicine, Pediatrics, Dermatology, and more." },
    { keywords: ["ai", "diagnose", "conditions"], response: "Our AI helps in diagnosing conditions by analyzing your symptoms and medical history." },
    { keywords: ["reschedule", "appointment"], response: "You can reschedule appointments from the 'My Appointments' section by selecting a new time." },
    { keywords: ["symptoms", "disease"], response: "Please specify the disease name, and I'll provide the symptoms." },
    { keywords: ["support", "issues"], response: "Contact support via the 'Help' section, or call our support line at 1-800-123-4567." },
    { keywords: ["medication", "condition"], response: "Please specify the condition, and I can provide medication recommendations." },
    { keywords: ["ai", "personalized", "medication"], response: "Yes, the AI pharmacy personalizes medication based on your profile and history." },
    { keywords: ["consultation", "history"], response: "Your past consultations can be viewed in the 'Consultation History' section." }
];

// Show chatbot window on icon click
chatbotIcon.onclick = function() {
    chatbotWindow.style.display = 'flex';
};

// Close chatbot window
closeChatbot.onclick = function() {
    chatbotWindow.style.display = 'none';
};

// Function to handle user input and dynamic responses
chatbotInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const userInput = chatbotInput.value.trim().toLowerCase();
        let chatbotResponse = document.createElement('div');
        chatbotResponse.classList.add('chatbot-response');

        let matched = false;

        // Check if user input matches any keyword combination
        keywordResponses.forEach(pair => {
            if (pair.keywords.some(keyword => userInput.includes(keyword))) {
                chatbotResponse.innerHTML = `<strong>User:</strong> ${chatbotInput.value}<br><strong>Bot:</strong> ${pair.response}`;
                matched = true;
            }
        });

        // If no match found, provide default response
        if (!matched) {
            chatbotResponse.innerHTML = `<strong>User:</strong> ${chatbotInput.value}<br><strong>Bot:</strong> Sorry, I don't understand that. Can you please ask something else?`;
        }

        chatbotBody.appendChild(chatbotResponse);
        chatbotInput.value = ''; // Clear the input field
        chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to the bottom
    }
});
