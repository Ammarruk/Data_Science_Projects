from flask import Flask, render_template, request, jsonify
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.applications.resnet50 import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np
import io, base64
from PIL import Image

# Load pretrained ImageNet model
model = ResNet50(weights='imagenet')

app = Flask(__name__)

def prepare_image(image, target_size=(224,224)):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    image = image.resize(target_size)
    arr = img_to_array(image)
    arr = np.expand_dims(arr, axis=0)
    return preprocess_input(arr)

# Map ImageNet human-related labels to "person"
HUMAN_LABELS = {
    "man", "woman", "bridegroom", "groom", "scuba_diver",
    "baseball_player", "football_player", "skier", "pole", "parachute"  # extend if needed
}

def process_prediction(pred):
    decoded = decode_predictions(pred, top=1)[0][0]  # (class_id, class_name, score)
    label = decoded[1]
    confidence = float(decoded[2])

    # Normalize human labels
    if label in HUMAN_LABELS:
        label = "person"

    return {"prediction": label, "confidence": confidence}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict_file', methods=['POST'])
def predict_file():
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file provided'}), 400
    img = Image.open(file.stream)
    batch = prepare_image(img)
    pred = model.predict(batch)
    result = process_prediction(pred)
    return jsonify(result)

@app.route('/predict_base64', methods=['POST'])
def predict_base64():
    data = request.json.get('image')
    if not data:
        return jsonify({'error': 'No image data'}), 400
    header, b64 = data.split(',', 1)
    img = Image.open(io.BytesIO(base64.b64decode(b64)))
    batch = prepare_image(img)
    pred = model.predict(batch)
    result = process_prediction(pred)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
