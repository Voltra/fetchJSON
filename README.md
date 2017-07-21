# fetchJSON #
A Javascript library that allows to abstract all boilerplate from retrieving JSON data using the native ES6 fetch API.


----------



Simple and easy to use, it only abstracts away all the boilerplate required for fetching json data.
No other javascript library is required to use this library.


----------
## Installation/Use ##
Just like every library should, I tried to make fetchJSON compatible with quite everything I am aware of.

fetchJSON currently supports regular use (via HTML script tag), npm and require (and commonJS), AMD (and probably ES6 modules ?).

Therefore, here are two ways to install this library:

```html
<html>
	<!-- [...] -->
	<head>
		<!-- [...] -->
		<script src="path/to/fetchJSON.js"></script>
		<!-- [...] -->
	</head>
	<!-- [...] -->
</html>
```

----------

```
npm install fetch_json
```
```javascript
const fetchJSON = require("fetch_json");
```

## Simple use case ##
Sometimes, you just have that json file which's sole purpose is configuration.
With fetchJSON, getting the data from this file is very easy:

```javascript
//With fetchJSON
let config_data;
fetchJSON("../../someFolder/someFile.json", data=>config_data=data);

//Without fetchJSON
let config_data;
fetch("../../someFolder/someFile.json").then(response=>{
	/*gather headers*/
	if(/*there's json in there*/)
		return response.json().then(data=>{
			/*some manipulation*/
			let config_data = data;
			//finally !
		});
	else
		/*handle error*/
})

```

Once loaded, the data can be used like this: 
```javascript
let config_data;
fetchJSON("../../someFolder/someFile.json", data=>config_data=data)
.then(()=>{
	/* use config_data to configure your application*/
});
```

## Questions/Suggestions ##
Please fill free to ask for help / post suggestions on my github repository, I'll be more than glad to take care of your problems/concerns.