JavaScript objects do have constructors. You can create objects through functions - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor The this keyword is used often to refer to the state and behavior of the current instance. See https://gist.github.com/dpickett/84ea1ad2a7a0dc121a8f for an example of how to define a "class" and invoke its constructor, as well as an example instance method definition. A lot of folks have started to omit semicolons (http://mislav.uniqpath.com/2010/05/semicolons/) - the spec, however, does require that you terminate your statements with a semi-colon, so we teach that you should adhere to the spec. You can't define global variables inside other objects. You can assign global variables that exist for the life of the page through the window or document global objects when dealing with the document object model.