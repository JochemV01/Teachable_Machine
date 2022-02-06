// More API functions here:
        // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

        // the link to your model provided by Teachable Machine export panel
        
        window.onload = (e) => {
            console.log('Model initiated');
            init();
        }

        const URL = "https://teachablemachine.withgoogle.com/models/zZbsPBcuC/";

        let model, webcam, labelContainer, maxPredictions, certainty, category;
        
        
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
                //predict();
                console.log('Image uploaded')
                console.log(output)
            });
        }
        
        
        // Load the image model and setup the webcam
        async function init() {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";

            // load the model and metadata
            // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
            // or files from your local hard drive
            // Note: the pose library adds "tmImage" object to your window (window.tmImage)
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();

            // Convenience function to setup a webcam
            // const flip = true; // whether to flip the webcam
            // webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
            // await webcam.setup(); // request access to the webcam
            // await webcam.play();
            // window.requestAnimationFrame(loop);

            // append elements to the DOM
            // document.getElementById("webcam-container").appendChild(webcam.canvas);
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) { // and class labels
                labelContainer.appendChild(document.createElement("div"));
            }
        }
        
        // async function loop() {
        //     webcam.update(); // update the webcam frame
        //     await predict();
        //     window.requestAnimationFrame(loop);
        // }
            
        // run the webcam image through the image model
        async function predict() {
            // predict can take in an image, video or canvas html element
            const prediction = await model.predict(document.getElementById("output"));
            // console.log(document.getElementById("output"))
            console.log(prediction)
            for (let i = 0; i < maxPredictions; i++) {
                const classPrediction =
                    prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                labelContainer.childNodes[i].innerHTML = classPrediction;
                
    			certainty = parseFloat(prediction[i].probability.toFixed(2));
			    if (certainty > 0.70) {
    				category = prediction[i].className;
			    }
            }
            // window.location.assign(category + ".html");
        }
        
	    async function nextpage() {
            await predict();
    		window.location.assign(category + ".html");
    	}