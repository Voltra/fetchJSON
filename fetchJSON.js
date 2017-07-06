/**@function fetchJSON
*@brief use the Fetch API to retrieve data from a JSON file
*@param {string} path - the complete path to the file
*@param {function} functor - the function to which the JSON data will be passed
*
*@return the Promise object of the fetch request
*/
function fetchJSON(path, functor){
    if(  (typeof functor === typeof (x=>x)) && (typeof path === typeof "42xyz")  )
        return fetch(path).then((response)=>{
            var contentType= response.headers.get("content-type");
            
            if(contentType && contentType.includes("application/json"))
                return response.json().then( jsonData=>functor(jsonData) );
            else{
                console.error("fetchJSON.js : Something went wrong during data inspection (data is not JSON or data is unreachable)");
                return null;
            }
        });
    else
        console.error("fetchJSON.js : The second argument must be a function");
}