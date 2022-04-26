/*
Note: I did not create all of this code myself. Most of this code is like it's
provided by the export panel of the Teachable Machine and the code to show the
oploaded image on the webpage is a combination from various tutorials on the
internet. Finally, I received help from my uncle, who is an experienced webdeveloper
with a lot of knowledge about JavaScript, to make it all work together.

I am no webdeveloper, I had and still have no idea how to make something like this work.
All I know is that this works and that it might be helpful to someone.
*/

// More API functions here:
        // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
        
        // Replace this link with the link to your model provided by Teachable Machine export panel
        const URL = "https://teachablemachine.withgoogle.com/models/zZbsPBcuC/";

        // These are some variables needed by the model
        let model, webcam, labelContainer, maxPredictions, certainty, result;

        // This function will initiate the model when the webpage is loaded, 
        // so the user does not have to wait for it when using it.
        window.onload = (e) => {
            console.log('Model initiated');
            init();
        }
        
        // Load the image model
        async function init() {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";

            // load the model and metadata
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();
            
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) { // and class labels
                labelContainer.appendChild(document.createElement("div"));
            }
        }
        
        // Run the image through the model, and show the result in the label container
        async function predict() {
            // predict can take in an image, video or canvas html element
            const prediction = await model.predict(document.getElementById("output"));
            console.log(prediction)
            for (let i = 0; i < maxPredictions; i++) {
                const classPrediction =
                    prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                labelContainer.childNodes[i].innerHTML = classPrediction;
                
                // This code will save the result with a certainty of over 70% to a variable
    			certainty = parseFloat(prediction[i].probability.toFixed(2));
			    if (certainty > 0.70) {
    				result = prediction[i].className;
			    }
            }
            // window.location.assign(category + ".html");
        }

        // This code will show the uploaded image on the webpage
        // and show an error if the file type is not supported.
        const status = document.getElementById('status');
	    const output = document.getElementById('output');
	    if (window.FileList && window.File && window.FileReader) {
    		document.getElementById('file-selector').addEventListener('change', event => {
			    output.src = '';
    			status.textContent = '';
			    const file = event.target.files[0];
			    if (!file.type) {
    				status.textContent = 'Error: The File.type property does not appear to be supported on this browser.';
				    return;
			    }
			    if (!file.type.match('image.*')) {
    				status.textContent = 'Error: The selected file does not appear to be an image.'
				    return;
			    }
			    const reader = new FileReader();
			    reader.addEventListener('load', event => {
    				output.src = event.target.result;
			    });
			    reader.readAsDataURL(file);
                console.log('Image uploaded')
            });
        }
        
        // This simple function is called by the "next page" button in the HTML file.
        // In this case, it simply takes the result from the model and opens the HTML file with that name.
	    async function nextpage() {
            await predict();
    		window.location.assign(result + ".html");
    	}