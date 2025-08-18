from flask import Flask, render_template, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np
import io, base64
from PIL import Image
from tensorflow.keras.models import load_model
# Change this:
# model = load_model('model/cnn_model.h5')
# To this (if your app.py sits under deploy_app/):
model = load_model('model/cnn_model.h5')


app = Flask(__name__)
model = load_model('model/cnn_model.h5')
labels = ['airplane','automobile','bird','cat','deer','dog','frog','horse','ship','truck']

def prepare_image(image, target_size=(32,32)):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    image = image.resize(target_size)
    arr = img_to_array(image).astype('float32') / 255.0
    return np.expand_dims(arr, axis=0)

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
    return jsonify({'prediction': labels[np.argmax(pred)]})

@app.route('/predict_base64', methods=['POST'])
def predict_base64():
    data = request.json.get('image')
    if not data:
        return jsonify({'error': 'No image data'}), 400
    header, b64 = data.split(',', 1)
    img = Image.open(io.BytesIO(base64.b64decode(b64)))
    batch = prepare_image(img)
    pred = model.predict(batch)
    return jsonify({'prediction': labels[np.argmax(pred)]})

if __name__ == '__main__':
    app.run(debug=True)
