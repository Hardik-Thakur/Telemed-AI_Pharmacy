// Predefined responses for common symptoms
// Expanded responses for common symptoms with short treatments

const responses = {
    "fever": "It sounds like you have a fever. Please stay hydrated and rest. Treatment: Over-the-counter fever reducers like acetaminophen or ibuprofen may help. If it persists, consider seeing a doctor. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    "lazy": "It sounds like you have a tough day today. Please take rest. Treatment: Listen to music, drink juices, and plenty of water so that you feel relaxed. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    "cough": "A cough can be caused by many things. Try drinking warm liquids and resting. Treatment: Consider cough syrups or throat lozenges for relief. If it persists, seek medical advice. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    "headache": "Headaches are common and may be due to stress or dehydration. Drink water and rest in a quiet space. Treatment: Over-the-counter pain relievers like aspirin or ibuprofen can be effective. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    "nausea": "Nausea could be due to food or stress. Stay hydrated and eat light meals until you feel better. Treatment: Ginger tea or anti-nausea medications may help alleviate symptoms. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    "fatigue": "Fatigue might indicate overwork or lack of sleep. Make sure to get some rest and take breaks. Treatment: Prioritize sleep and consider light exercise or relaxation techniques. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    "sore throat": "A sore throat may indicate an infection or allergies. Gargle with warm salt water and stay hydrated. Treatment: Throat lozenges or warm teas can soothe irritation. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    "shortness of breath": "This can be serious. If you experience severe shortness of breath, seek medical attention immediately. Treatment: Use your inhaler if prescribed; otherwise, get emergency help. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    "chest pain": "Chest pain can have many causes. If this is severe, seek medical help immediately. Treatment: Do not ignore severe chest pain; call emergency services right away. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    "dizziness": "Dizziness can be due to dehydration or a lack of sleep. Drink plenty of fluids and rest. Treatment: Lying down in a quiet, dark place may help relieve symptoms. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    "muscle pain": "Muscle pain can occur from overexertion or tension. Rest and apply heat to relieve soreness. Treatment: Consider over-the-counter pain relievers and gentle stretching. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    "rash": "A rash could indicate an allergic reaction or infection. Avoid scratching and consult a doctor if it worsens. Treatment: Topical creams or antihistamines may provide relief. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    "vomiting": "Vomiting can occur due to a variety of causes including food poisoning. Stay hydrated and rest. Treatment: Sips of clear fluids and bland foods can help ease symptoms. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    "diarrhea": "Diarrhea might be due to an infection or dietary changes. Stay hydrated and monitor your condition. Treatment: Consider oral rehydration solutions and avoid dairy products. For further assistance, please contact your doctor or schedule a telemedicine video consultation <a href='index.html' target='_blank'>Click here</a>.",
    
    // Add more symptoms as needed
};

    
function handleSymptom(symptom) {
    const message = responses[symptom] || "Sorry, I don't have information on that.";
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<p><strong>You:</strong> ${symptom}</p>`;
    chatBox.innerHTML += `<p><strong>Dr. Care:</strong> ${message}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

function toggleMoreOptions() {
    const moreOptions = document.getElementById("more-options");
    const moreOptionsBtn = document.getElementById("more-options-btn");

    if (moreOptions.style.display === "none") {
        moreOptions.style.display = "block";
        moreOptionsBtn.textContent = "Show Less Options"; // Change button text
    } else {
        moreOptions.style.display = "none";
        moreOptionsBtn.textContent = "More Options"; // Revert button text
    }
}
// AI Typing simulation
function simulateTyping() {
    const chatBox = document.getElementById('chat-box');
    
    const typingElement = document.createElement('div');
    typingElement.classList.add('message', 'bot-msg');
    
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing-indicator');
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        typingIndicator.appendChild(dot);
    }
    
    typingElement.appendChild(typingIndicator);
    chatBox.appendChild(typingElement);
    
    // Scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
    
    return typingElement;
}

// Bot Response logic
function getBotResponse(userInput) {
    let response = "Hmm, I'm not sure what that might be. Could you provide more details or consult a professional?";
    
    for (let symptom in responses) {
        if (userInput.toLowerCase().includes(symptom)) {
            response = responses[symptom];
            break;
        }
    }
    
    return response;
}

// Handling send button click
document.getElementById('send-btn').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value.trim();
    
    if (userInput === "") return;
    
    // Add user's message to chat
    addMessageToChatBox(userInput, 'user');
    
    // Clear input field
    document.getElementById('user-input').value = '';
    
    // Show typing indicator for the AI bot
    const typingIndicator = simulateTyping();
    
    // Simulate AI typing for 1.5 seconds before responding
    setTimeout(() => {
        // Remove typing indicator
        typingIndicator.remove();
        
        // Get bot response
        const botResponse = getBotResponse(userInput);
        
        // Add bot's message to chat
        addMessageToChatBox(botResponse, 'bot');
        
    }, 1500);
});









document.getElementById('voice-btn').addEventListener('click', function() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN'; // Set to English (India) or 'hi-IN' for Hindi
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('user-input').value = transcript;
        handleUserInput(transcript);
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
    };
});

document.getElementById('send-btn').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    handleUserInput(userInput);
});

function handleUserInput(input) {
    // Here you can use logic to detect language or ask the user
    // For simplicity, we'll just assume English if input is in English and vice versa

    if (input.match(/[a-zA-Z]/)) {
        // Respond in English
        respondToUser(input, 'en');
    } else {
        // Respond in Hindi
        respondToUser(input, 'hi');
    }
}

function respondToUser(input, lang) {
    const response = getResponse(input, lang);
    const chatBox = document.getElementById('chat-box');
    const message = document.createElement('div');
    message.textContent = response;
    chatBox.appendChild(message);
}

function getResponse(input, lang) {
    const responses = {
        fever: {
            en: "You may have a fever. It's important to monitor your temperature and consult a doctor if necessary. For relief, consider taking paracetamol and staying hydrated.",
            hi: "आपको बुखार हो सकता है। अपनी तापमान की निगरानी करना और आवश्यक होने पर डॉक्टर से परामर्श करना महत्वपूर्ण है। राहत के लिए, पैरासिटामोल लेना और हाइड्रेटेड रहना विचार करें।"
        },
        headache: {
            en: "Headaches can result from various causes. Resting in a dark room and staying hydrated can help. Over-the-counter pain relievers may also be effective.",
            hi: "सिरदर्द विभिन्न कारणों से हो सकता है। एक अंधेरी कमरे में आराम करना और हाइड्रेटेड रहना मदद कर सकता है। ओवर-द-काउंटर दर्द निवारक भी प्रभावी हो सकते हैं।"
        },
        cough: {
            en: "Coughing can be a sign of various conditions. If it persists, consider consulting a physician. Drinking warm fluids and honey can provide relief.",
            hi: "खांसी विभिन्न स्थितियों का संकेत हो सकती है। यदि यह बनी रहती है, तो चिकित्सक से परामर्श करने पर विचार करें। गर्म तरल पदार्थ और शहद पीना राहत प्रदान कर सकता है।"
        },
        // Add more symptoms and responses here
    };

    for (const symptom in responses) {
        if (input.toLowerCase().includes(symptom)) {
            return responses[symptom][lang];
        }
    }
    return lang === 'en' ? "I'm not sure about that symptom. Please describe how you're feeling." : "मुझे उस लक्षण के बारे में यकीन नहीं है। कृपया बताएं कि आप कैसा महसूस कर रहे हैं।";
}

function handleSymptom(symptom) {
    document.getElementById('user-input').value = symptom;
    respondToUser(symptom, 'en'); // Default to English response for symptom buttons
}

function toggleMoreOptions() {
    const moreOptions = document.getElementById('more-options');
    moreOptions.style.display = moreOptions.style.display === 'none' ? 'block' : 'none';
}
