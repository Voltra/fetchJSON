/**@function fetchJSON
*use the Fetch API to retrieve data from a JSON file
*@param {string} path - the complete path to the file
*@param {object|undefined} data - an object of data to be converted into a query string
*@param {object|undefined} options - the options for fetch
*
*@return the Promise object of the fetch request
*/

(function UniversalModuleDefinition(root, factory){
    if(typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define("fetchJSON", [], factory);
    else if(typeof exports === 'object')
        exports["fetchJSON"] = factory();
    else
        root["fetchJSON"] = factory();
})(window || this, function(){
    // cf. https://stackoverflow.com/a/34749873/7316365
    /**
     * Simple object check.
     * @param item
     * @returns {boolean}
     */
    function isObject(item) {
      return (item && typeof item === 'object' && !(item instanceof Array));
    }

    /**
     * Deep merge two objects.
     * @param target
     * @param ...sources
     */
    function mergeDeep(target/*, ...sources*/) {
    //          if (!sources.length) return target;
      if (arguments.length <=1)
          return target;
      var sources = [].slice.apply(arguments);
        sources.shift(); //remove "target"
      var source = sources.shift();

      if (isObject(target) && isObject(source)) {
        for (var key in source) {
          if (isObject(source[key])) {
            if (!target[key]){
                var obj = {};
                obj[key] = {};
                Object.assign(target, obj);
            }
            mergeDeep(target[key], source[key]);
          } else {
            var obj = {};
            obj[key] = source[key];
            Object.assign(target, obj);
          }
        }
      }

    //          return mergeDeep(target, ...sources);
      return mergeDeep.apply(null, [target].concat(sources));
    }
    //cf. https://stackoverflow.com/a/34749873/7316365
    
    var fetchJSON = function(path, data, options){
//        data = Object.assign({}, fetchJSON.defaults.qs, data || {});
        data = mergeDeep({}, fetchJSON.defaults.qs, data || {});
        options = options || {};
        
        if(typeof data != "object" || data === null)
            throw new TypeError("'data' must be an Object");
        
        var check = function(elem){
            var innerCheck = function(elem){
                if(!(typeof elem == "string" || typeof elem == "number"))
                    throw new TypeError("Invalid data object (elements are not all arrays of strings/numbers or strings or numbers)");
            }
            
            if(elem instanceof Array){
                elem.forEach(innerCheck);
                return;
            }
            
            innerCheck(elem);
        };
        
        Object.values(data).forEach(check);
        
        var primitiveToQstring = function(e){
            return encodeURIComponent(e.key) + "=" + encodeURIComponent(e.value);
        }
        
        var qstring = Object.entries(data)
        .map(function(e){ return {key: e[0], value: e[1]}; })
        .map(function(e){
            if(e.value instanceof Array){
                return e.value.map(function(val){
                    return {key: e.key, value: val};
                }).map(primitiveToQstring).join("&");
            }
            
            return primitiveToQstring(e);
        }).join("&");
        
        if(qstring !== ""){
            if(!/\?/.test(path))//has a '?'
                qstring = "?"+qstring;
            else if(!/\?$/.test(path))//doesn't end by '?'
                qstring = /&$/.test(path) ? qstring : "&"+qstring;
        }
        
        return new Promise(function(resolve, reject){
            if(typeof path == "string"){
//                var fetchOptions = Object.assign({}, fetchJSON.defaults.options, options, {method: "GET"});
//                fetchOptions.headers = Object.assign({}, fetchJSON.defaults.headers, fetchOptions.headers || {});
                var fetchOptions = mergeDeep({}, fetchJSON.defaults.options, options, {method: "GET"});
                fetchOptions.headers = mergeDeep({}, fetchJSON.defaults.headers, fetchOptions.headers || {});
                var f = fetch(path + qstring, fetchOptions);

                f.then(function(response){
                    return response.json()
                    .then(resolve)
                    .catch(function(){
                        var error = "Something went wrong during data inspection (data is not JSON or couldn't reach file)";
                        reject(error);
                        return Promise.reject(error);
                    });
                });

                return f;
            }
            else{
                if(typeof path != "string")
                    reject("The 1st argument must be a string");
                return null;
            }
        });
    };
    
    fetchJSON.defaults = {
        qs: {},
        options: {},
        headers: {
            "Content-Type": "application/json"
        }
    };
    
    return fetchJSON;
});