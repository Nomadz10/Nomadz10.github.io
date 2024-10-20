import React, { useState, useEffect, useRef } from 'react';
import './assets/styles/cnn.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from "./Header";

function ConvolutionTool() {
  // State variables
  const [matrix, setMatrix] = useState([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]);

  const [iterations, setIterations] = useState(1);
  const [selectedOption, setSelectedOption] = useState('');
  const [inputImageData, setInputImageData] = useState(null);
  const [outputImageData, setOutputImageData] = useState(null);
  const inputCanvasRef = useRef(null);
  const outputCanvasRef = useRef(null);
  const [saveButtonVisible, setSaveButtonVisible] = useState(false);

  // Preset convolution matrices
  const matrixValues = {
    option1: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    option2: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
    option3: [
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
    ],
    option4: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
    option5: [
      [1 / 16, 2 / 16, 1 / 16],
      [2 / 16, 4 / 16, 2 / 16],
      [1 / 16, 2 / 16, 1 / 16],
    ],
    option6: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ],
    option7: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
  };

  // Handle convolution matrix preset selection
  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (matrixValues[value]) {
      setMatrix(matrixValues[value]);
    }
  };

  // Handle manual changes to the convolution matrix
  const handleMatrixInputChange = (row, col, value) => {
    const updatedMatrix = [...matrix];
    updatedMatrix[row][col] = parseFloat(value);
    setMatrix(updatedMatrix);
  };
  const imageSectionRef = useRef(null); // Create a reference for the image section

  // Handle changes to the number of iterations
  const handleIterationsChange = (e) => {
    setIterations(parseInt(e.target.value));
  };

  // Handle image file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        let width = image.width;
        let height = image.height;
        const w = 695;
        const h = 800;
        if (width > w) {
          height *= w / width;
          width = w;
        }
        if (height > h) {
          width *= h / height;
          height = h;
        }
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, width, height);
        const imgData = context.getImageData(0, 0, width, height);
        setInputImageData(imgData);
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Draw the input image when it changes
  useEffect(() => {
    if (inputImageData && inputCanvasRef.current) {
      const canvas = inputCanvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = inputImageData.width;
      canvas.height = inputImageData.height;
      context.putImageData(inputImageData, 0, 0);
    }
  }, [inputImageData]);

  // Draw the output image when it changes
  useEffect(() => {
    if (outputImageData && outputCanvasRef.current) {
      const canvas = outputCanvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = outputImageData.width;
      canvas.height = outputImageData.height;
      context.putImageData(outputImageData, 0, 0);
      setSaveButtonVisible(true); // This ensures the button becomes visible after drawing
    }
  }, [outputImageData]);

  // Convert image to grayscale
  function convertToGrayscale(imageData) {
    let grayscaleMatrix = [];
    for (let i = 0; i < imageData.height; i++) {
      grayscaleMatrix[i] = [];
      for (let j = 0; j < imageData.width; j++) {
        let index = i * 4 * imageData.width + j * 4;
        let r = imageData.data[index];
        let g = imageData.data[index + 1];
        let b = imageData.data[index + 2];
        grayscaleMatrix[i][j] = 0.3 * r + 0.59 * g + 0.11 * b;
      }
    }
    return grayscaleMatrix;
  }

  // Add padding to grayscale image
  function addPadding(originalMatrix) {
    let size = originalMatrix[0].length;
    const zerosArray = new Array(size).fill(0);
    let paddedMatrix = [...originalMatrix];
    paddedMatrix.unshift(zerosArray);
    paddedMatrix.push(zerosArray);
    paddedMatrix = paddedMatrix.map((row) => [0, ...row, 0]);
    return paddedMatrix;
  }

  // 2D convolution for grayscale
  function convolution2D(largeMatrix, smallMatrix) {
    let result = [];
    for (let i = 0; i < largeMatrix.length - 2; i++) {
      result[i] = [];
      for (let j = 0; j < largeMatrix[i].length - 2; j++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) {
          for (let l = 0; l < 3; l++) {
            sum += largeMatrix[i + k][j + l] * smallMatrix[k][l];
          }
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  // Add padding to RGB image
  function addPaddingColor(originalMatrix) {
    const originalHeight = originalMatrix.length;
    const originalWidth = originalMatrix[0].length;
    const paddedHeight = originalHeight + 2;
    const paddedWidth = originalWidth + 2;
    let paddedMatrix = new Array(paddedHeight);
    for (let y = 0; y < paddedHeight; y++) {
      paddedMatrix[y] = new Array(paddedWidth);
      for (let x = 0; x < paddedWidth; x++) {
        if (y > 0 && y < paddedHeight - 1 && x > 0 && x < paddedWidth - 1) {
          paddedMatrix[y][x] = originalMatrix[y - 1][x - 1];
        } else {
          paddedMatrix[y][x] = [0, 0, 0];
        }
      }
    }
    return paddedMatrix;
  }

  // 3D convolution for RGB
  function convolution3D(largeMatrix, smallMatrix) {
    let result = [];
    for (let i = 0; i < largeMatrix.length - 2; i++) {
      result[i] = [];
      for (let j = 0; j < largeMatrix[i].length - 2; j++) {
        result[i][j] = [];
        for (let z = 0; z < largeMatrix[i][j].length; z++) {
          let sum = 0;
          for (let k = 0; k < 3; k++) {
            for (let l = 0; l < 3; l++) {
              sum += largeMatrix[i + k][j + l][z] * smallMatrix[k][l];
            }
          }
          result[i][j][z] = sum;
        }
      }
    }
    return result;
  }

  // Handle grayscale convolution
  const handleGrayscaleConvolve = () => {
    if (!inputImageData) {
      alert('Please select an image.');
      return;
    }
    let finMatrix = convertToGrayscale(inputImageData);
    let convMatrix = matrix;
    if (convMatrix.every(row => row.every(cell => isNaN(cell)))) {
      convMatrix = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ];
    }
    for (let i = 0; i < iterations; i++) {
      finMatrix = addPadding(finMatrix);
      finMatrix = convolution2D(finMatrix, convMatrix);
    }
    const width = finMatrix[0].length;
    const height = finMatrix.length;
    const outputData = new ImageData(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = 4 * (x + y * width);
        const value = finMatrix[y][x];
        outputData.data[index] = value;
        outputData.data[index + 1] = value;
        outputData.data[index + 2] = value;
        outputData.data[index + 3] = 255;
      }
    }
    setOutputImageData(outputData);
    if (imageSectionRef.current) {
      imageSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle color convolution
  const handleColorConvolve = () => {
    if (!inputImageData) {
      alert('Please select an image.');
      return;
    }
    let iterationsCount = iterations;
    const width = inputImageData.width;
    const height = inputImageData.height;
    let finMatrix = [];
    for (let y = 0; y < height; y++) {
      finMatrix[y] = [];
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const r = inputImageData.data[index];
        const g = inputImageData.data[index + 1];
        const b = inputImageData.data[index + 2];
        finMatrix[y][x] = [r, g, b];
      }
    }
    let convMatrix = matrix;
    if (convMatrix.every(row => row.every(cell => isNaN(cell)))) {
      convMatrix = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ];
    }
    for (let i = 0; i < iterationsCount; i++) {
      finMatrix = addPaddingColor(finMatrix);
      finMatrix = convolution3D(finMatrix, convMatrix);
    }
    const outputData = new ImageData(finMatrix[0].length, finMatrix.length);
    for (let y = 0; y < finMatrix.length; y++) {
      for (let x = 0; x < finMatrix[0].length; x++) {
        const index = 4 * (x + y * finMatrix[0].length);
        const [r, g, b] = finMatrix[y][x];
        outputData.data[index] = r;
        outputData.data[index + 1] = g;
        outputData.data[index + 2] = b;
        outputData.data[index + 3] = 255;
      }
    }
    setOutputImageData(outputData);
    if (imageSectionRef.current) {
      imageSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle saving the output image
  const handleSaveImage = () => {
    if (!outputImageData) return;
    const canvas = document.createElement('canvas');
    canvas.width = outputImageData.width;
    canvas.height = outputImageData.height;
    const context = canvas.getContext('2d');
    context.putImageData(outputImageData, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'convolutedImage.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
      <div>
        {/* Navbar */}
        <Header />

        {/* Main Content */}
        <main>
          {/* Banner */}
          <div className="banner p-0 mb-4">
            <div className="container-fluid py-1">
              <h1 className="display-5 fw-bold pageheader">Image Convolution Tool</h1>
            </div>
            <hr className="hr" />
          </div>

          {/* Controls */}
          <div className="controls-container">
            <div className="container-fluid p-5 overflow-hidden">
              <div className="row justify-content-center">
                {/* Left Column */}
                <div className="col-12 col-md-4 order-2 order-md-1">
                  <div>
                    <div>
                      <div className="card">
                        <h5>How to use:</h5>
                        <ol>
                          <li>Drag and drop or select an image below that you would like to convolve. This image will be displayed below.</li>
                          <li>Enter the values of the convolution matrix OR select a preset convolution operation from the dropdown menu provided. (note: if no matrix is provided the identity will be used as default)</li>
                          <li>Enter the number of times you would like to convolve the image in the 'Number of Iterations' field. (note: entries less than 1 will result in the identity image being returned)</li>
                          <li>Click on either 'Grayscale Convolve' or 'Color Convolve'</li>
                          <li>The appropriate convolution will take place and the result will be displayed. This result image can then be saved using the 'Save Image' Button at the bottom of the page.</li>
                        </ol>
                      </div>
                      <div className="image-container d-flex flex-column align-items-center justify-content-center">
                        <label className="form-label">Select/Drag in image</label>
                        <input
                            className="form-control form-control-sm form-control-file"
                            id="input-image"
                            type="file"
                            onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>

                {/* Center Column */}
                <div className="col-12 col-md-4 order-3 order-md-2">
                  <div className="container">
                    <div className="card table-card">
                      <div className="card-body" id="convolution-matrix">
                        <h2 className="card-title text-center">Convolution Matrix</h2>
                        <div className="row matrix-row justify-content-center">
                          <div className="col-md-8 matrix-col">
                            {matrix.map((row, rowIndex) => (
                                <div className="row t-row justify-content-center" key={rowIndex}>
                                  {row.map((value, colIndex) => (
                                      <div className="col t-div" key={colIndex}>
                                        <input
                                            type="number"
                                            className="styled-input"
                                            value={value}
                                            onChange={(e) => handleMatrixInputChange(rowIndex, colIndex, e.target.value)}
                                        />
                                      </div>
                                  ))}
                                </div>
                            ))}
                          </div>
                        </div>
                        <br />
                        <div className="row justify-content-center">
                          <div className="col-md-10 select">
                            <select
                                className="styled-select"
                                id="options"
                                name="options"
                                aria-label=".form-select-sm example"
                                value={selectedOption}
                                onChange={handleOptionChange}
                            >
                              <option disabled value="">Select an option</option>
                              <option value="option1">Identity</option>
                              <option value="option2">Sharpen</option>
                              <option value="option3">Mean Blur</option>
                              <option value="option5">Gaussian Blur</option>
                              <option value="option4">Edge Detection</option>
                              <option value="option6">Horizontal Sobel</option>
                              <option value="option7">Vertical Sobel</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className="card-body">
                        <label htmlFor="iterations">Number of Iterations:</label>
                        <input
                            className="styled-iter number-input-container "
                            type="number"
                            id="iterations"
                            value={iterations}
                            onChange={handleIterationsChange}
                        />
                        <br />
                        <br />
                        <div className="row justify-content-center">
                          <div className="col-md-6 d-flex justify-content-center gap-2">
                            <button className="styled-button" id="grayscale-button" onClick={handleGrayscaleConvolve}>
                              Grayscale Convolve
                            </button>
                            <button className="styled-button" id="colorize-button" onClick={handleColorConvolve}>
                              Color Convolve
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              {/* Image Display */}
              <div className="row justify-content-center image-row" ref={imageSectionRef}>
                <div className="col-sm">
                  <img id="uploaded-image" style={{ display: 'none' }} alt="" />
                  <canvas id="initial-canvas" ref={inputCanvasRef}></canvas>
                </div>
                <div className="col-sm">
                  <div className="output-container">
                    <canvas id="output-canvas" ref={outputCanvasRef}></canvas>
                  </div>
                </div>
              </div>
              <div className="row justify-content-end">
                <div className="col-6">
                  <br />
                  <div className="save">
                    {saveButtonVisible && (
                        <button type="button" className="btn btn-primary" id="save-button" onClick={handleSaveImage}>
                          Save Image
                        </button>
                    )}
                  </div>

                </div>
              </div>
              <br />
              {/* How it all works Section */}
              <div className="col-12 col-md-12 order-1 order-md-3">
                <div className="card fixed-height-card">
                  <div className="card-body">
                    <h2 className="card-title" style={{ textAlign: 'center' }}>How it all works</h2>
                    <hr />
                    <h3>Image size Manipulation</h3>
                    <p>This application is designed to accept images of varying dimensions. However, performing convolution operations on images of substantial size, utilizing JavaScript for matrix multiplication, often leads to system instability due to the extensive volume of calculations required. To mitigate this issue and ensure optimal performance, images exceeding 700 pixels in width or 800 pixels in height are automatically resized to fit within these maximum dimensions. This adjustment is crucial for maintaining the application's stability and preventing potential crashes during the convolution process. </p>
                    <h3>Grayscale Convolution</h3>

                    <h5>Color to Grayscale Conversion</h5>
                    <p>When Grayscale Convolution is selected, the system initiates a process to convert the input image into grayscale. This conversion leverages a weighted average approach to determine the grayscale value of each pixel. Specifically, the original color pixel, characterized by its Red (R), Green (G), and Blue (B) components, undergoes a transformation. The formula for this conversion is as follows: 30% of the R value, 59% of the G value, and 11% of the B value are combined to calculate a new pixel value. This value ranges from 0 to 255, representing various shades of gray. This step ensures that the color image is accurately represented in grayscale, maintaining the perceptual quality and luminance of the original image.</p>

                    <h5>Padding</h5>
                    <p>To prepare the grayscale image for convolution operations, it is necessary to add padding around its borders. This technique involves surrounding the image with a layer of pixels set to a value of 0 (zero), creating an artificial black border. The primary purpose of padding is to preserve the dimensions of the image throughout the convolution process. Without padding, the convolution operation would gradually decrease the image size, as the outer rows and columns would be lost. By adding padding before each convolution, we ensure that no part of the original image is lost during processing.</p>

                    <h5>Convolution</h5>
                    <p>When applying convolution to a grayscale image, the convolution matrix is moved across the image pixel by pixel. At each position, the convolution operation involves element-wise multiplication of the kernel values with the corresponding grayscale values of the pixels covered by the kernel. These products are then summed up to produce a single output value. This output value replaces the central pixel value in the area covered by the kernel. The process is repeated as the kernel slides across the entire image, one pixel at a time, resulting in a transformed grayscale image.</p>

                    <h5>Multiple Iterations</h5>
                    <p>Once the convolution process is complete for the entire image, the system checks whether additional iterations were requested by the user. If further processing is required, the procedure is repeated using the recently convolved image as the new input. This iterative approach allows for multiple layers of convolution, each building on the last, to achieve the desired effect or analysis depth as specified by the user. This process continues until the specified number of iterations is completed, resulting in a finely processed image ready for review or further application.</p>

                    <h3>Color Convolution</h3>

                    <p>Applying convolution directly to an RGB image is more complex than to a grayscale image due to its multi-channel nature. The convolution operation needs to be applied independently to each of the three color channels. This means that the convolution kernel is replicated across each channel, and matrix multiplication is performed separately for the red, green, and blue channels.</p>

                    <h5>Padding</h5>
                    <p>Padding an RGB (Red, Green, Blue) image, which is inherently multi-channel, involves a more complex procedure. An RGB image consists of three separate color channels, each representing the intensity of red, green, or blue at each pixel. To apply padding to an RGB image, a layer of pixels must be added to each of the three channels independently, and each added pixel is set to a value of 0 in all three channels. This results in an artificial black border being added around the image in all three color dimensions.</p>

                    <h5>Convolution</h5>
                    <p>For each channel, the process mirrors that of the grayscale convolution: the kernel moves over the image, performs element-wise multiplication with the pixel values under the kernel, sums these products, and the resulting value replaces the central pixel value in the output image for that channel. After processing all channels separately, the final convolved image is reconstructed by combining the transformed red, green, and blue channels back into a single RGB image. These steps are all done for each iteration that is requested.</p>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="pt-4 my-md-5 pt-md-5 freetext">
          <div className="row">
            <div className="col-4 col-lg-3 mb-3">
              <span className="fs-5">Image Convolution</span>
              <ul className="list-unstyled small text-muted">
                <li className="mb-2 footer-text">Built by: Vijay Muppalla</li>
                <li className="mb-2 footer-text">© 2024</li>
              </ul>
            </div>

            {/* External Resources Links */}
            <div className="col-4 col-lg-2 mb-3">
              <h5>External Resources</h5>
              <ul className="list-unstyled text-small">
                <li className="mb-1">
                  <a
                      className="text-decoration-none links"
                      href="https://setosa.io/ev/image-kernels/"
                      target="_blank"
                      rel="noreferrer"
                  >
                    How Convolution Works
                  </a>
                </li>
                <li className="mb-1">
                  <a
                      className="text-decoration-none links"
                      href="https://mebble.github.io/imfx/spatial.html"
                      target="_blank"
                      rel="noreferrer"
                  >
                    Mebble Tool Demo
                  </a>
                </li>
                <li className="mb-1">
                  <a
                      className="text-decoration-none links"
                      href="https://github.com/mebble/imfx"
                      target="_blank"
                      rel="noreferrer"
                  >
                    Mebble Tool Repository
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="col-4 col-lg-2 mb-3 freetext">
              <h5>Contact</h5>
              <a
                  href="https://www.linkedin.com/in/vijay-muppalla-7a380526a/"
                  target="_blank"
                  className="icons p-2"
                  rel="noreferrer"
              >
            <span style={{ color: "white" }}>
              <i className="fa-brands fa-linkedin fa-xl"></i>
            </span>
              </a>
              <a
                  href="https://github.com/Nomadz10"
                  target="_blank"
                  className="icons p-2"
                  rel="noreferrer"
              >
            <span style={{ color: "white" }}>
              <i className="fa-brands fa-github fa-xl"></i>
            </span>
              </a>
            </div>
          </div>
        </footer>
      </div>
  );
}

export default ConvolutionTool;
