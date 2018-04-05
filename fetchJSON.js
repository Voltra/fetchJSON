/**@function fetchJSON
*use the Fetch API to retrieve data from a JSON file
*@param {string} path - the complete path to the file
*@param {object} data - an object of data to be converted into a query string
*
*@return the Promise object of the fetch request
*/

(function UniversalModuleDefinition(root, factory){
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define("fetchJSON", [], factory);
    else if(typeof exports === 'object')
        exports["fetchJSON"] = factory();
    else
        root["fetchJSON"] = factory();
})(this, function(){
    return function(path, data){
        data = data || {};
        
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
        
        return new Promise((resolve, reject)=>{
            if(typeof path == "string"){
//                console.log("url: ", path+qstring);
                var f = fetch(path + qstring);

                f.then(function(response){
//                    var contentType= response.headers.get("content-type");
//
//                    if(contentType && contentType.includes("application/json"))
//                        return response.json().then(jsonData=>{
//                            if(typeof functor == "function")
//                                functor(jsonData);
//                            resolve(jsonData);
//                        });
//                    else{
//                        reject("Something went wrong during data inspection (data is not JSON or couldn't reach file)");
//                        return null;
//                    }
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
    }
});