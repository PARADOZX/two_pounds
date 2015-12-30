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
        some_template += "<img src='##imgSrc' title='##imgTitle' alt='##imgAlt' />";
    some_template += "</div>";
```

For repeated content use the Two Pound's custom __*data-repeat*__ HTML tag attribute.  For instance, the example below includes a header description followed by content that will be reused for the list of items that follow the header.

```javascript
var other_template = "<h2>##category</h2>";
other_template += "<ul>";
    other_template += "<li data-repeat>";
        other_template += "<p>##name</p>";
        other_template += "<p>Release Date: ##release</p>";
    other_template += "</li>";
other_template += "</ul>";
```

### Render

Rendering an object is as easy as passing JSON into the render() method or, if there is repeated content, an array of JSON objects.  If a key of the JSON matches a template variable the template variable will be replaced by the value of the corresponding JSON key.

For instance, using the some_template example from above: 
```javascript
view.render({
    "title" : "Chewbacca's Bowcaster", 
    "message" : "This is Chewbacca's bowcaster.  There are many like it, but this one is his.",
    "imgSrc" : "images/wookie_bow.png",
    "imgTitle" : "Hairy never looked so good.",
    "imgAlt" : "Chewbacca and his bow"
});
```

The resulting HTML is:
```HTML
<h2>Chewbacca's Bowcaster</h2>
<div>
    <p>This is Chewbacca's bowcaster.  There are many like it, but this one is his.</p>
    <img src='images/wookie_bow.png' title='Hairy never looked so good.' alt='Chewbacca and his bow' />
</div>
```

If your template renders repeated content an array of JSON objects must be passed into the render() method.  All template variables not part of the repeated content must be in JSON format defined under the index 'single' of the array.

For instance, using the other_template example from above: 
```javascript
var template_vars = [];
template_vars['single'] = {"category" : "Star Wars Movies"};
template_vars = [
    {"name" : "The Phantom Menace", "release" : 1999},
    {"name" : "Attack of the Clones", "release" : 2002},
    {"name" : "Revenge of the Sith", "release" : 2005},
    {"name" : "A New Hope", "release" : 1977},
    {"name" : "The Empire Strikes Back", "release" : 1980},
    {"name" : "Return of the Jedi", "release" : 1973},
    {"name" : "The Force Awakens", "release" : 2015},
];
```
 

