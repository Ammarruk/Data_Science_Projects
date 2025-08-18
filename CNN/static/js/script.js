// Show preview of uploaded image (large and centered)
function previewImage(event) {
  const preview = document.getElementById('file-preview');
  preview.innerHTML = '';
  const file = event.target.files[0];
  if (file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = "Preview";
    img.className = "preview-img";
    preview.appendChild(img);
  }
}

// Predict file upload
async function predictFile() {
  const input = document.getElementById('file-input');
  const resultDiv = document.getElementById('file-result');
  resultDiv.innerHTML = "";

  if (!input.files.length) {
    alert('Select a file first');
    return;
  }

  const form = new FormData();
  form.append('file', input.files[0]);

  try {
    const response = await fetch('/predict_file', { method: 'POST', body: form });
    const data = await response.json();
    displayResults(data, resultDiv);
  } catch (error) {
    resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// Predict Base64 input
async function predictBase64() {
  const b64 = document.getElementById('base64-input').value;
  const resultDiv = document.getElementById('base64-result');
  resultDiv.innerHTML = "";

  if (!b64.startsWith('data:image')) {
    alert('Paste a valid data URI (starting with data:image)');
    return;
  }

  try {
    const response = await fetch('/predict_base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: b64 })
    });
    const data = await response.json();
    displayResults(data, resultDiv);
  } catch (error) {
    resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// Display results with attractive cards
function displayResults(data, container) {
  if (data.error) {
    container.innerHTML = `<p class="error">${data.error}</p>`;
    return;
  }

  if (data.predictions) {
    container.innerHTML = '<h3>Predictions</h3>';
    const wrapper = document.createElement('div');
    wrapper.className = "prediction-cards";

    data.predictions.forEach(p => {
      const card = document.createElement('div');
      card.className = "prediction-card";
      card.innerHTML = `
        <h4>${p.label}</h4>
        <div class="confidence">${(p.confidence * 100).toFixed(2)}%</div>
      `;
      wrapper.appendChild(card);
    });

    container.appendChild(wrapper);
  } else if (data.prediction) {
    container.innerHTML = `<p>${data.prediction}</p>`;
  }
}
