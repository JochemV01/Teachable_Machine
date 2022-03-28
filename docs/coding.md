---
layout: page
title: Coding
permalink: /coding/
---
If you want to implement your model in your webpage, you will need to create (or download) 3 files: A `.html` file, a `.js` file and a `.css` file. In case you are unfamiliar with this, here is what the different files are for:

- **HML** (`.html`) is for building the actual page, this file is used to place all elements on the page.
- **JavaScript** (`.js`) makes everything work, this file is used to make the teachable machine work together with the HTML elements.
- **CSS** (`.css`) defines the style and position of all elements on the webpage, this is not required to make it work but I assume you don't want your prototype to look like it's from 1995.

We will work in the same order, so first HTML, then JavaScript and finally CSS. However, in most cases you will find yourself working on multiple files simultaniously, especcially HTML and CSS.

> Be sure to check the [example files on GitHub](https://github.com/JochemV01/Teachable_Machine). To get started quickly, you can also download the files or copypaste the contents into your own files.

## The [HTML](https://raw.githubusercontent.com/JochemV01/Teachable_Machine/main/example.html) file
In the HTML file, you need at least 3 things for the Teachable Machine to work. First of all, you need an `<input>` element, which is used to upload a file. Next, you need a `<p>` element with `id="status"`. I don't know why, it does not show anything but the Teachable Machine does not work without it. Next, you need an `<img>` element with `id="output"`, which will show the image which is uploaded. This is required, because Teachable Machine will only analyze the image which is loaded in the webpage. Finally, you need a `<div>` element with `id="label-container"`, which is used by Teachable Machine to show the result. 

> However, if you don't want some or any of the required elements to be shown on your webpage, you can hide them if you want. All you need to do is add `style="display: none;"` to the opening tag (for example: `<div id="label-container" style="display: none;"></div>`). As long as the element is present in the code, it will work.

Other than this, you are free to add anything you want to the HTML file. If it's relevant in your project, I recommend adding a button to go to the next page, while using Teachable Machine to determine where this button leads. To do this, add the following:

{% highlight html %}
<button class="nav-button" type="button" onclick="nextpage()">
Next Page
</button>
{% endhighlight %}

As you can see, inside the opening tag there is an attribute `onclick` with a value `nextpage()`. This does the following: When you click this element, it will start a JavaScript function called `nextpage()`. This function is defined in the JavaScript file, and the function is what will actually send you do another page. It will be explained in the next section.

## The [JavaScript](https://raw.githubusercontent.com/JochemV01/Teachable_Machine/main/Teachable-machine-script.js) file
The JavaScript file is what connects the HTML elements with the Teachable Machine model. On the Teachable Machine page, when exporting, some JavaScript code is provided to make the model work on your webpage. However, this code works through a webcam, not a file upload. With the little experience I have and a little help from a webdeveloper, I changed this code to work with a file upload instead. Additionally, I made sure the model is actually functional by making sure its result will change the page a button on the page links to.

In your project, you can choose to use the code provided by the Teachable Machine and adapt it using this guide, or you can simply use the [code provided by me](https://raw.githubusercontent.com/JochemV01/Teachable_Machine/main/Teachable-machine-script.js).

### Removing any code related to a webcam
When modifying the basic code from Teachable Machine, you can remove any code related to the webcam. This can either be done by "commenting it out" (by placing `//` in front of every line) or simply getting rid of it. Of course, if you still want to use the webcam, you should not remove the code. The file upload should work either way, with or without this code. However, if you decide to keep this code, you need the HTML elements it uses too, otherwise the browser will not run your code.

### Showing the uploaded picture on the webpage
As far as I know, Teachable Machine can only analyze an image visible on your webpage. That's why you need to load the uploaded image on the webpage. For this, you need 2 HTML elements: A file upload (`<input type="file" id="file-selector" accept="image/png, image/jpg, image/jpeg, image/bmp">`) and the output image (`<img id="output" onload="predict()">`). The rest will happen using JavaScript code. I found some example code for this on the internet (I don't know where anymore), which not only loads the image to the right HTML element, but also shows an error message if the file type is not supported. If you don't want this however, you can simply delete the two if-statements containing the error messages. 

{% highlight js %}
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
{% endhighlight %}

As you can see, the HTML element for the output image you just added contains this code: `onload="predict()"`. This is very important, as this will start the Teachable Machine model as soon as the image is loaded on the webpage. You could also achieve this with a separate "Start" or "Analyze" button, but that does not seem very user-friendly to me :).

### Loading the model
The model needs to be loaded using the `init()` function included in the basic code from Teachable Machine. This code looks like this:

{% highlight js %}
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
{% endhighlight %}

Additionally, you also need to add the URL to your model by replacing the URL in `const URL = "https://teachablemachine.withgoogle.com/models/zZbsPBcuC/";`. Furthermore, some variables need to be defined which are needed to make the code work: `let model, webcam, labelContainer, maxPredictions`.

For an optimal user experience, I recommend loading the model as soon as the webpage is loaded. This is better then loading the model when it is needed, because it does take a few seconds, meaning it is better to do when the user is not yet using the model.

{% highlight js %}
// This function will initiate the model when the webpage is loaded, 
// so the user does not have to wait for it when using it.
window.onload = (e) => {
    console.log('Model initiated');
    init();
}
{% endhighlight %}

### Analyzing the image using the model
The `predict()` function will actually run the image through the model, originally showing the result in some text. However, you can make this do anything you want. I changed the function to save the class with a score of 70% or higher to a variable, which I can use later for the next-button. To do this, you need to define two additional variables: `certainty` and `result`. You can do this at the top of the file, where all other variables are also defined. When this is done, the `predict()` function should look something like this:

{% highlight js %}
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
}
{% endhighlight %}

### Linking the next-button to the right page
This is a very simple function I wrote. It simply takes the result from the `predict()` function (which is stored in the variable called `result`) and adds ".html" to that piece of text. If there is an HTML page with this name, the button will link to this page. Note that the class names in the model need to be the same as the names of your HTML pages. The function looks like this:

{% highlight js %}
// This simple function is called by the "next page" button in the HTML file.
// In this case, it simply takes the result from the model and opens the HTML file with that name.
async function nextpage() {
    await predict();
    window.location.assign(result + ".html");
}
{% endhighlight %}