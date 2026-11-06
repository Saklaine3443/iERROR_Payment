// app.js - Part 2: Backend Logic & API Bridge

// Configuration: Update this URL to match your Cloudflare Worker's actual endpoint
const API_BASE_URL = 'https://ierror-api.saklainemustack6.workers.dev'; 

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transactionForm');
    const resultBox = document.getElementById('resultDisplay');
    const copyBtn = document.getElementById('copyBtn');
    const loader = document.querySelector('.progress');

    if (!form || !resultBox) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Get Input Values
        const address = document.getElementById('address').value.trim();
        const amount = document.getElementById('amount').value.trim();
        const token = document.getElementById('tokenType').value;

        if (!address || !amount) {
            alert("Please fill in both Address and Amount.");
            return;
        }

        // 2. Show Loading State
        loader.style.width = '100%';
        resultBox.innerHTML = '<span style="color: #58a6ff;">Processing Transaction...</span>';
        resultBox.classList.remove('hidden');

        try {
            // 3. Send Data to Cloudflare Worker
            const response = await fetch(`${API_BASE_URL}/generate-proof`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    recipient: address, 
                    amount: amount, 
                    token: token 
                })
            });

            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

            const data = await response.json();

            // 4. Display Result
            displayResult(data.transactionHash, data.link);

        } catch (error) {
            console.error(error);
            resultBox.innerHTML = `<span style="color: #f85149;">Failed: ${error.message}</span>`;
        } finally {
            loader.style.width = '0%';
        }
    });

    // Helper: Display the generated fraud proof
    function displayResult(hash, link) {
        resultBox.innerHTML = `
            <div><strong>Transaction Hash:</strong></div>
            <div id="hashText">${hash}</div>
            <br>
            <div><strong>Verification Link:</strong></div>
            <a href="${link}" target="_blank" style="color: var(--accent); word-break: break-all;">${link}</a>
        `;
        
        // Setup Copy Button
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(hash).then(() => {
                copyBtn.textContent = "Copied!";
                setTimeout(() => copyBtn.textContent = "Copy Hash", 2000);
            });
        };
    }
});
