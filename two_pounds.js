//View object constructor
function View(){
    this.template = null;
    this.elem = null;
}

View.prototype = function(){
    
    /**
     *Populates template replacing all properties proceeded with ##.
     *@function
     *@param {Object}
     *@return {null} overwrites this.tempTemplate 
     */
    function _populateTemplate(arg){
        //any string that begins with ##
        // var patt = /(?:^|\W)##(\w+)(?!\w)/g;
        var patt = /##(\w+)(?!\w)/g;
        
        if(this.tempTemplate){
            while(results = patt.exec(this.tempTemplate)){
                if (arg[results[1]] !== undefined){
                    //if arg obj property is array, join values
            		if(arg[results[1]] instanceof Array){
            		    var join = arg[results[1]].join(', ');
            		    this.tempTemplate = this.tempTemplate.replace(results[0], join);
            		} else this.tempTemplate = this.tempTemplate.replace(results[0], arg[results[1]]);
                } else this.tempTemplate = this.tempTemplate.replace(results[0], '');
            }
        }
    }
    
    /**
     *Populates template replacing all properties proceeded with ##.  This function populates templates which have repeated elements.
     *@function
     *@param {Array}
     *@return {Null} overwrites this.tempTemplate 
     */
    function _populateRepeatTemplate(projects){
        
        if(!this.tempTemplate) throw new Error("No template set");
        
        //jquery object version of template
        var $temp = $('<div>').append(this.tempTemplate);
        
        // var patt = /(?:^|\W)##(\w+)(?!\w)/g;
        var patt = /##(\w+)(?!\w)/g;
        
        //finds all elements that are to be repeated (with 'data-repeat' attribute)
        var $allRepeatedElems = $temp.find('[data-repeat]');
        
        if($allRepeatedElems.length === 0) throw new Error("Define an element with data-repeat attribute or check template variable formatting.");
        
        var that = this;
        
        $allRepeatedElems.each(function(){
            
            var repeatedElement = this.outerHTML,
                cacheElement    = '',
                combinedCacheElement = '',
                appendType = '';
                
            //loop through projects that are matched with the selected technology    
            for(project in projects) {
                if(project !== 'single') { 
                    
                    //reset cacheElement for another iteration of data-repeat
                    cacheElement = repeatedElement;
    
                    //for each of those projects loop through to find template variables (start with '##')
                    while(results = patt.exec(repeatedElement)) {
                                
                        var result = results[1];
                        
                        //loop through every template variable to see if it matches a property in the project object
                        if (projects[project][result] !== undefined) {
                            
                            /**
                             * determine if template variable resides within a data-repeat element that has a prev() sibling
                             * this will be appended to the document differently than if the element does not have sibling
                             */
                            if($temp.find($(this)).prev().length > 0) {
                                
                                appendType = "after";
                                
                            } else if ($(this).parent().length > 0) {
                                
                                // if($(this).parent().prop("tagName") == 'BODY'|'body'){
                                    
                                    appendType = "prepend";
                                    
                                // }
                                
                            } 
                            cacheElement = cacheElement.replace(results[0], projects[project][result]);
                        }
                    }
                    //add one iteration of data-repeat a "combined" cache for appending
                    combinedCacheElement += cacheElement;
                } 

            } //end projects loop
            
            $prev = $temp.find($(this)).prev();
            $parent = $temp.find($(this)).parent();
            
            if(!appendType) throw new Error('appendType not selected.');
            if(appendType === "after") $temp.find($prev).after(combinedCacheElement);
                else if(appendType === "prepend") {
                    if($temp.find($parent).prop("nodeName") !== undefined) $temp.find($parent).prepend(combinedCacheElement);
                        else $temp.prepend(combinedCacheElement);
                }
                
            $temp.find($(this)).remove();    
            
        });  //end $allRepeatedElems.each()
        
        /**
         * save progress to this.tempTemplate because we scan the template below for ## vars that also exist in 'single' object
         *those that don't exist on the 'single' object will be deleted
         */
        this.tempTemplate = $temp.prop('innerHTML');
        
        /**
         * check if 'single' object exists.  'single' object is a wrapper for any template variable(s) that only appears once 
         * on a template when _populateRepeatTemplate is called.
         */
        for(project in projects) {
            if(project === 'single') {
                while(results = patt.exec(this.tempTemplate)){
                    if (projects[project][results[1]] !== undefined){
                        console.log('hi');
                        //if arg obj property is array, join values
                		if(projects[project][results[1]] instanceof Array){
                		    var join = arg[results[1]].join(', ');
                		    this.tempTemplate = this.tempTemplate.replace(results[0], join); 
                		    $temp = $('<div>').append(this.tempTemplate);
                		} else {
                		    this.tempTemplate = this.tempTemplate.replace(results[0], projects[project][results[1]]); 
                		    $temp = $('<div>').append(this.tempTemplate);
                		}
                    } else {
                        this.tempTemplate = this.tempTemplate.replace(results[0], '');
                        $temp = $('<div>').append(this.tempTemplate);
                    }
                }
            }
        }
        
        this.tempTemplate = $temp.prop('innerHTML');
        
    }

    /**
     * Sets the element to which templates are appended.
     * @function
     * @param {Object} jQuery object
     */
    function setElem(elem){
     	if(elem instanceof jQuery)
        	this.elem = elem; 
        else 
            throw new Error('needs to be jquery obj');
    }
    
    function setTemplate(template){
    	this.template = template;  
    }
    
    /**
     * Renders the template.  Calls _populateTemplate or _populateRepeatTemplate depending argument type.
     * @param {Object||Array} json object or array of json objects
     */
    function render(arg){
    	if(this.template && this.elem){
    	    if(arg instanceof Array === false) {
    	   	    this.tempTemplate = this.template;
             	_populateTemplate.apply(this, [arg]);
             	this.elem.append(this.tempTemplate);
    	    } else {
    	        if(_checkArgArray(arg)) {
    	            this.tempTemplate = this.template;
    	            _populateRepeatTemplate.apply(this, [arg]);
    	            this.elem.append(this.tempTemplate);
    	        } else throw new Error('Argument array not in correct format.');
    	    }
        }
    }
    
    /**
     * Checks render func array for an index called 'single' and checks that each element of array is an object
     * @param {Array}  
     * @returns {Boolean} false will throw error.
     */
    function _checkArgArray(arg) {
        if(arg instanceof Array === true) 
            if('single' in arg) 
                for(position in arg)
                    if(arg[position] instanceof Object)
                        return true;
        return false;
    }
    
    return {
        setElem : setElem,
     	setTemplate : setTemplate,
        render : render
    }
    
}();