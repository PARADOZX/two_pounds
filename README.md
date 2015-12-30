# Two Pounds
A templating engine.

Two Pounds is a super lightweight Javascript templating engine that allows you to update your HTML conveniently and cleanly.  

## Installation

Installation is simple.  Simply clone Made To Fit `git clone https://github.com/PARADOZX/made_to_fit.git` to the appropriate directory. The last step is to include the javascript file *two_pounds.js* in your HTML using the 'script' tag.

The only dependency is jQuery.

## Usage

### Setup

1. Create instance of Two Pounds.  `var view = new View()`

2. Set the element to which the template content will be appended.  `view.setElem($('#main'));`

3. Set the template that will be used.  `view.setTemplate(some_template);`

4. Render the template while passing template variables as the argument.  `view.render(template_vars);`

### Template 

Set template using setTemplate() method.  You can pass HTML within quotes as the argument directly or store the HTML as a javascript string variable and pass the variable as the argument.

Template below uses multiline string variable format.  

__Template variables must be preceded with "two pounds" (two pound signs ##).  This is how Two Pounds templating engine recognizes which text needs to be replaced.__

```javascript
var some_template = "<h2>##title</h2>";
    some_template += "<div>";
        some_template += "<p>##message</p>";
        some_template += "<div class='image-wrapper'>";
            some_template += "<img src='##imgSrc' title='##imgTitle' alt='##imgAlt' />";
        some_template += "</div>";
    some_template += "</div>";
```

For repeated content use the Two Pound's custom __*data-repeat*__ HTML tag attribute.  For instance, the example below includes a header description followed by content that will be reused for the list of items that follow the header.

```javascript
var other_template = "<h2>##category</h2>";
other_template += "<ul>";
    other_template += "<li data-repeat>";
        other_template += "<div>##release</div>";
        other_template += "<div>##description</div>";
    other_template += "</li>";
other_template += "</ul>";
```

### Render

Rendering an object is as easy as passing JSON into the render() method or, if there is repeated content, an array of JSON objects.  If a key of the JSON matches a template variable the template variable will be replaced by the value of the corresponding JSON key.

For instance, using the some_template example above: 
```javascript
view.render({
    "title" : "Chewbacca's Bowcaster", 
    "message" : "This is Chewbacca's bowcaster.  There are many like it, but this one is his.",
    "imgSrc" : "images/wookie_bow.png",
    "imgTitle" : "Hairy never looked so good.",
    "imgAlt" : "Chewbacca and his bow"
});
```

The ouptput is:

Chewbacca's Bowcaster

This is Chewbacca's bowcaster. There are many like it, but this one is his.

Chewbacca and his bow
        

