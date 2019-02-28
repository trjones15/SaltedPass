import Sha256 from './sha256.js';

var parsed_url;

var need_special;
var need_number;
var need_capital;

document.addEventListener('DOMContentLoaded', function() {
	var promise1 = new Promise(function(resolve, reject) {
		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, 	function (tabs){
			var url = tabs[0].url;
			document.getElementById('web_name').innerHTML = 'The Website you are on is: ' + url;
			resolve(url);
	  });
	});
	
	promise1.then(function(value) {
		var parser = document.createElement('a');
		parser.href = value;
		
		console.log(parser.hostname);
		parsed_url = parser.hostname;
		
		document.getElementById('web_name').innerHTML = 'The Website you are on is: ' + parsed_url;
		
		//set checks
		getOptions(parsed_url);
		
		document.getElementById("go-to-options").addEventListener("click", function() {
			if (chrome.runtime.openOptionsPage) {
				chrome.runtime.openOptionsPage();
			  } else {
				window.open(chrome.runtime.getURL('current_salts.html'));
			  }
			});
		document.getElementById("form1").addEventListener('submit', calculatePass);
		document.getElementById("form2").addEventListener('submit', copyPass);
	});
});

function copyPass(evt) {
	evt.preventDefault();
	
	let new_pass = document.getElementById('newpass');
	new_pass.select();
	
	document.execCommand("copy");
	console.log("Copied the text: " + new_pass.innerHTML);
}

function calculatePass(evt) {
	evt.preventDefault();
	
	need_special = evt.target[0].checked;
	need_number = evt.target[1].checked;
	need_capital = evt.target[2].checked;
	
	var salt = getSalt(parsed_url);
	
	var master_pass = evt.target[0].value;
	
	let hashed_pass = Sha256.hash(master_pass + salt, 'string');
	
	let new_pass = hashed_pass.substr(hashed_pass.length - 29);
	
	if (need_special === true) {
		new_pass = new_pass + "!";
	}
	
	if (need_number === true) {
		new_pass = new_pass + "1";
	}
	
	if (need_capital === true) {
		new_pass = new_pass + "A";
	}
	
	document.getElementById('newpass').innerHTML = new_pass;
	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {pass: new_pass}, function(response) {
		console.log("Password Autofilled");
		
		return Promise.resolve("Sending Complete");
	  });
	});
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function getSalt(website) {
	//Check storage if salt present if not add it
	chrome.storage.sync.get([website], function(result) {		
		if (typeof result[website] !== 'undefined') {
			console.log('The salt was found for the website: ' + website + '. The salt is ' + result[website].salt);
			return result[website].salt;
		}
		
		let salt_word = '';
		
		for(let i = 0; i < 128; i++) {
			salt_word += getRandomInt(36).toString(36);
		}
		
		var obj = {[website]: {
			salt: salt_word,
			spec: need_special,
			num: need_number,
			cap: need_capital
		}};
	
		chrome.storage.sync.set(obj, function() {
          console.log('The salt was not found. The new website is ' + website + '. The new salt is: ' + salt_word);
        });
		
		return salt_word;
		
    });	
}

function getOptions(website) {
	chrome.storage.sync.get([website], function(result) {		
		if (typeof result[website] !== 'undefined') {
			need_special = result[website].spec;
			need_number = result[website].num;
			need_capital = result[website].cap;
		} else {
			need_special = true;
			need_number = true;
			need_capital = true;
		}
		
		document.getElementById('spec_char').checked = need_special;
		document.getElementById('num_char').checked = need_number;
		document.getElementById('cap_char').checked = need_capital;
    });
}
