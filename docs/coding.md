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

> Be sure to check the example files here. To get started quickly, you can also download the files or copypaste the contents into your own files.

## The HTML file
In the HTML file, you need at least 3 things for the Teachable Machine to work. First of all, you need an `<input>` element, which is used to upload a file. Next, you need a `<p>` element with `id="status"`. I don't know why, it does not show anything but the Teachable Machine does not work without it. Next, you need an `<img>` element with `id="output"`, which will show the image which is uploaded. This is required, because Teachable Machine will only analyze the image which is loaded in the webpage. Finally, you need a `<div>` element with `id="label-container"`, which is used by Teachable Machine to show the result. 

> However, if you don't want some or any of the required elements to be shown on your webpage, you can hide them if you want. All you need to do is add `style="display: none;"` to the opening tag (for example: `<div id="label-container" style="display: none;"></div>`). As long as the element is present in the code, it will work.

Other than this, you are free to add anything you want to the HTML file. If it's relevant in your project, I recommend adding a button to go to the next page, while using Teachable Machine to determine where this button leads. To do this, add the following:

{% highlight html %}
<button class="nav-button" type="button" onclick="nextpage()" style="display: none;">Next Page</button>
{% endhighlight %}

As you can see, inside the opening tag there is an attribute `onclick` with a value `nextpage()`. This does the following: When you click this element, it will start a JavaScript function called `nextpage()`. This function is defined in the JavaScript file, and the function is what will actually send you do another page. It will be explained in the next section.

## The JavaScript file
