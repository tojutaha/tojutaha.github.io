document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            parseFile(content);
        };
        reader.readAsText(file);
    }
});

function parseFile(content) {
    const lines = content.split('\n');
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous output

    const showWarnings = document.getElementById('showWarnings').checked;
    const showErrors = document.getElementById('showErrors').checked;
    const showMessages = document.getElementById('showMessages').checked;

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
            const span = document.createElement('span');
            let shouldDisplay = false;

            if (trimmedLine.toLowerCase().includes('warning') && showWarnings) {
                span.className = 'warning';
                shouldDisplay = true;
            } else if (trimmedLine.toLowerCase().includes('error') && showErrors) {
                span.className = 'error';
                shouldDisplay = true;
            } else if (showMessages) {
                span.className = ''; // No specific class for messages
                shouldDisplay = true;
            }

            if (shouldDisplay) {
                span.textContent = trimmedLine;
                outputDiv.appendChild(span);
                outputDiv.appendChild(document.createElement('br')); // Add line break
            }
        }
    });
}

// Add event listeners to checkboxes to re-parse the file when checked/unchecked
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const fileInput = document.getElementById('fileInput');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                parseFile(content);
            };
            reader.readAsText(file);
        }
    });
});
