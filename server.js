// script.js

// 🚨 VENDOSNI KËTU URL-NË PUBLIKE TË SERVERIT TUAJ TË DEPLOY-UAR NGA GITHUB!
const BASE_SERVER_URL = "https://emri-i-projektit-i-deploy-uar.com"; // SHEMBULL!
const SERVER_ENDPOINT = BASE_SERVER_URL + '/generate-content'; 

async function dergoKërkesënNëMënyrëTëSigurt() {
    const prompt = document.getElementById('promptInput').value || "Më trego një fakt.";
    const rezultatiDiv = document.getElementById('rezultati');
    rezultatiDiv.textContent = 'Po gjenerohet...';

    try {
        // Kërkesa shkon në serverin tuaj në Web (i cili përdor çelësin sekret)
        const pergjigja = await fetch(SERVER_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });

        const data = await pergjigja.json();
        
        if (pergjigja.ok) {
            rezultatiDiv.textContent = data.generatedText;
        } else {
            // Trajtoni gabimet e kthyer nga serveri juaj
            rezultatiDiv.textContent = `Gabim nga Serveri: ${data.error || 'Gabim i panjohur.'}`;
        }
    } catch (error) {
        console.error('Gabim në lidhjen me Serverin:', error);
        rezultatiDiv.textContent = 'Gabim në lidhje. Sigurohuni që serveri juaj i deploy-uar po funksionon.';
    }
}
