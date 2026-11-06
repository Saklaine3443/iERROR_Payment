// Generate a random 64-char hex string (looks like a real TX hash)
function generateHash() {
    return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

// Get URL parameters ?hash=...&addr=...&amt=...
const params = new URLSearchParams(window.location.search);
const txHash = params.get('hash') || generateHash();
const recipient = params.get('addr') || 'T9y...YourTargetAddress';
const amount = params.get('amt') || '100.00';

// DOM Elements
document.getElementById('txHash').innerText = txHash;
document.getElementById('recipient').innerText = recipient;
document.getElementById('amount').innerText = amount;
document.getElementById('blockHeight').innerText = Math.floor(Math.random() * 100000000) + 10000000; // Random high block number

// Simulate Confirmation Loading
let progress = 0;
const progBar = document.getElementById('progBar');
const confText = document.getElementById('confirmations');

const interval = setInterval(() => {
    progress += 10;
    progBar.style.width = progress + '%';
    
    if (progress >= 100) {
        clearInterval(interval);
        confText.innerText = "Confirmations: 6/6 (Finalized)";
        confText.style.color = "#238636";
    } else {
        confText.innerText = `Confirmations: ${Math.floor(progress / 10)}/6 (Pending...)`;
    }
}, 200); // Fast load for user experience
