document.addEventListener('DOMContentLoaded', function() {
	//populate the key value pairs with an option to delete
	//let div_tag = document.getElementById('enter_salts');
	let div_tag = document.getElementById('salt_table');
	chrome.storage.sync.get(null, function (data) {
		let keys = Object.keys(data);
		let values = Object.values(data);
		
		for(var i = 0; i <keys.length;i++) {
			let id = i
			let tr = document.createElement('TR');
			div_tag.appendChild(tr);
			
			let td1 = document.createElement('TD');
			td1.appendChild(document.createTextNode(keys[i]));
			div_tag.appendChild(td1);
			
			let td2 = document.createElement('TD');
			td2.appendChild(document.createTextNode(values[i].salt));
			div_tag.appendChild(td2);
			
			//need remove butten here
			let td3 = document.createElement('TD');
			let form_class = document.createAttribute('class');
			form_class.value = 'form_class';
			td3.setAttributeNode(form_class);
			
			let f1 = document.createElement('form');
			let formid = document.createAttribute("id");
			formid.value = i;
			f1.setAttributeNode(formid);
			
			let butt = document.createElement('input');
			
			let butt_type= document.createAttribute("type");
			butt_type.value = 'submit';
			butt.setAttributeNode(butt_type);
			
			let butt_id = document.createAttribute("id");
			butt_id.value = "button" + id;
			butt.setAttributeNode(butt_id);
			
			let value = document.createAttribute("value");
			value.value = "Remove";
			butt.setAttributeNode(value);
			
			f1.appendChild(butt);
			td3.appendChild(f1);
			div_tag.appendChild(td3);
			
			f1.addEventListener('submit', function(evt) {
				
				chrome.storage.sync.remove(keys[parseInt(evt.target.id)]);
				console.log(keys[parseInt(evt.target.id)] + ' was removed from the list');
				/***if (chrome.runtime.openOptionsPage) {
					chrome.runtime.openOptionsPage();
				  } else {
					window.open(chrome.runtime.getURL('current_salts.html'));
				}***/
			});
		}
	});
});