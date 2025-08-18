// Show preview of uploaded image
function previewImage(event) {
  const preview = document.getElementById('file-preview');
  preview.innerHTML = '';
  const file = event.target.files[0];
  if (file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
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
    console.log("File prediction response:", data); // Debug
    displayResults(data, resultDiv);
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
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
    console.log("Base64 prediction response:", data); // Debug
    displayResults(data, resultDiv);
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
  }
}

// Helper to display predictions
function displayResults(data, container) {
  if (data.error) {
    container.innerHTML = `<p style="color:red">${data.error}</p>`;
    return;
  }

  if (data.predictions) {
    const ul = document.createElement('ul');
    data.predictions.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.label} - ${(p.confidence * 100).toFixed(2)}%`;
      ul.appendChild(li);
    });
    container.appendChild(ul);
  } else if (data.prediction) {
    // fallback if backend sends single prediction
    container.innerHTML = `<p>${data.prediction}</p>`;
  }
}
