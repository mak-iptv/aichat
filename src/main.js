import { GoogleGenerativeAI } from '@google/generative-ai';

const chatBody = document.querySelector('.chat-body');
const messageInput = document.querySelector('.message-input');
const sendMessage = document.querySelector('#send-message');
const fileInput = document.querySelector('#file-input');
const fileUploadButton = document.querySelector('#file-upload');

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// Inicializo SDK
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const chatHistory = [];
let userFile = null;

function createMessageElement(content, classes = []) {
  const div = document.createElement('div');
  div.classList.add('message', ...classes);
  div.innerHTML = content;
  return div;
}

async function generateBotResponse(userMessage) {
  chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });
  if(userFile) chatHistory[chatHistory.length-1].parts.push({ inline_data: userFile });

  try {
    const result = await model.generateContent({ contents: chatHistory });
    const text = result.response.text().trim();
    chatHistory.push({ role: 'model', parts: [{ text }] });
    return text;
  } catch (err) {
    console.error(err);
    return 'Gabim gjatë komunikimit me API-në.';
  } finally {
    userFile = null;
  }
}

sendMessage.addEventListener('click', async () => {
  const text = messageInput.value.trim();
  if(!text) return;

  const userDiv = createMessageElement(text, ['user-message']);
  chatBody.appendChild(userDiv);
  messageInput.value = '';

  const botDiv = createMessageElement('...', ['bot-message']);
  chatBody.appendChild(botDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  const botResponse = await generateBotResponse(text);
  botDiv.innerText = botResponse;
  chatBody.scrollTop = chatBody.scrollHeight;
});

fileUploadButton.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const base64 = ev.target.result.split(',')[1];
    userFile = { data: base64, mime_type: file.type };
  };
  reader.readAsDataURL(file);
});

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage.click(); 
    // ose thërrit funksionin që vepron butonin “Send”
  }
});
