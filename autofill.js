chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("password is: " + request.pass);
	
	let inputs = document.getElementsByTagName('input');;
	for (let i=0; i<inputs.length; i++) {
		if(inputs[i].type.toLowerCase() === "password") {
			inputs[i].value = request.pass;
			console.log(inputs[i].id);
		}
	}
	
	return Promise.resolve("Autofill Complete");
  });