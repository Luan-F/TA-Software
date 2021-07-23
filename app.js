const key_path = './keys.json';
const fs = require('fs');

let {keysConfig, lastSelected} = JSON.parse(fs.readFileSync(key_path).toString());
let main = document.getElementById('main');
let last = document.getElementById('last');
last.innerHTML = lastSelected;

for(let key in keysConfig){
	if(key === 'lastSelected'){
		continue;
	}
	main.innerHTML += `<div id=${key} class="card">${key}</div>`;
}

const update = (key, color) => {
	document.getElementById(key).style.backgroundColor = color;
};

fs.watch(key_path, (curr, event) => {
	let { keysConfig, lastSelected } = JSON.parse(fs.readFileSync(key_path).toString());
	for(let keyName in keysConfig){
		if(keyName === 'lastSelected'){
			continue;
		}
		let color = '';
		
		if(keysConfig[keyName]){
			color = 'red';
		}
		update(keyName, color);
	}
	
	if(lastSelected != last.innerHTML){
		last.innerHTML = lastSelected;
	}

	if(keysConfig['lastSelected']){
		update('last', 'red');
	}
	else{
		update('last', '');
	}
});
