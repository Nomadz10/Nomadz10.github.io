const imgView = document.getElementById('image-view');
const outputBox = document.getElementById('output-box');
const ingredientsBox = document.getElementById('ingredients-box');
const fileInput = document.getElementById('file-input');
let selectedImage;

// Mock ingredients data
const ingredientsJson = {
    "apple_pie": ["apples", "sugar", "cinnamon", "pie crust"],
    "baby_back_ribs": ["pork ribs", "barbecue sauce", "spices"],
    // Add more items here as in your Android app
};

// Handle gallery button click
document.getElementById('gallery-button').addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgView.src = e.target.result;
            selectedImage = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Placeholder for camera capture (Note: This requires additional setup and might not be directly feasible in the browser)
document.getElementById('camera-button').addEventListener('click', () => {
    alert('Camera capture is not supported in this web demo.');
});

// Placeholder for prediction
document.getElementById('predict-button').addEventListener('click', async () => {
    if (!selectedImage) {
        alert('Please select an image first.');
        return;
    }

    // Load and preprocess the image for the model
    const image = new Image();
    image.src = selectedImage;
    image.onload = async () => {
        const tensor = tf.browser.fromPixels(image)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .div(tf.scalar(127.5))
            .sub(tf.scalar(1))
            .expandDims();

        // Load the model and predict
        const model = await tf.loadGraphModel('path/to/your/tfjs/model.json');
        const predictions = await model.predict(tensor).data();

        // Get the highest score prediction
        const maxIndex = predictions.indexOf(Math.max(...predictions));
        const predictedLabel = Object.keys(ingredientsJson)[maxIndex];

        // Update the UI with the prediction and ingredients
        outputBox.textContent = predictedLabel.replace('_', ' ').toUpperCase();
        ingredientsBox.textContent = `Ingredients:\n${ingredientsJson[predictedLabel].join(', ')}`;
    };
});
