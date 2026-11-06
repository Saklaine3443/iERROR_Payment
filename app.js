document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('proofForm');
    const btn = document.getElementById('generateBtn');
    const statusDiv = document.getElementById('status');

    // Adjust this URL if your Cloudflare Worker has a specific path
    const API_ENDPOINT = '/api/generate-proof'; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            tokenType: document.getElementById('tokenType').value,
            recipientAddress: document.getElementById('recipientAddress').value,
            amount: parseFloat(document.getElementById('amount').value)
        };

        // UI State: Loading
        btn.disabled = true;
        btn.textContent = 'Processing...';
        statusDiv.textContent = '';
        statusDiv.className = '';

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            
            // Assuming the backend returns an object with a 'proofUrl' or similar
            if (data.proofUrl || data.transactionHash) {
                statusDiv.textContent = `Success! Proof generated.`;
                statusDiv.className = 'success';
                
                // Optional: Open proof in new tab or copy to clipboard
                console.log('Proof Data:', data);
                window.open(data.proofUrl || '#', '_blank');
            } else {
                throw new Error('Invalid response format from server');
            }

        } catch (error) {
            console.error('Error:', error);
            statusDiv.textContent = `Error: ${error.message}`;
            statusDiv.className = 'error';
        } finally {
            btn.disabled = false;
            btn.textContent = 'Generate Proof';
        }
    });
});
