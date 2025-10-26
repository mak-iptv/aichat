import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import readlineSync from 'readline-sync';

// Inicializo SDK
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Histori chat
const chatHistory = [];

// Funksioni për përgjigjen e botit
async function generateBotResponse(userMessage) {
  chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

  try {
    const result = await model.generateContent({ contents: chatHistory });
    const responseText = result.response.text().trim();

    chatHistory.push({ role: 'model', parts: [{ text: responseText }] });
    return responseText;
  } catch (error) {
    console.error('Gabim API:', error);
    return 'Gabim gjatë komunikimit me API-në.';
  }
}

// Funksion kryesor për chat në terminal
async function main() {
  console.log('📢 Chatbot gati! Shkruaj "exit" për të dalë.');
  
  while (true) {
    const userMessage = readlineSync.question('Ti: ');
    if (userMessage.toLowerCase() === 'exit') break;

    const botResponse = await generateBotResponse(userMessage);
    console.log('Bot:', botResponse);
  }

  console.log('Chat perfundoi.');
}

main();
