const fs = require('fs');

let key = document.getElementById('list');

let itens = [];
let values = [];

let html = key.innerHTML;
for(let i = 1 ; i <= itens.length ; i++){
	let item = itens[i-1];
	html += `
		<div id="key${i}" class="key">
		${item} <input type="number" id="input${i}-1"> - <input type="number" id="input${i}-2">
	</div>`;
}
key.innerHTML = html;

function updateKey(){
	
	for(let i = 1 ; i <= itens.length ; i++){
		if(values[i-1] != undefined){
			document.getElementById(`input${i}-1`).value = values[i-1][0];
			document.getElementById(`input${i}-2`).value = values[i-1][1];
		}
	}
	console.log(itens.length);
}

function saveValues(limite = 1){
	for(let i = 1 ; i <= itens.length - limite ; i++){
		let input1 = document.getElementById(`input${i}-1`).value;
		let input2 = document.getElementById(`input${i}-2`).value;

		if(input1 == '' && input2 == ''){
			if(itens.length >= 1 && i > 1){
				input1 = values[i-1][0];
				input2 = values[i-1][1];
			}
			else{
				input1 = 0;
				input2 = 1000;
			}
		}

		values[i-1] = [input1, input2];
	}
}

function createConfigFile(){
	saveValues(0);
	let config = '{';
	let keys = '{"keysConfig":{';
	let i;
	console.log(values)
	for(i = 0 ; i < itens.length-1 ; i++){
		config += `"${itens[i]}": [${values[i][0]},${values[i][1]}],`
		keys += `"${itens[i]}": false,`;
	}
	if(i > 0){
		config += `"${itens[i]}": [${values[i][0]},${values[i][1]}]`;
		keys += `"${itens[i]}": false`;
	}
	keys += '"lastSelected": false},"lastSelected": ""}';
	config += '}';
	
	fs.writeFile("config.json", config, (err) => {
		if(err){
			throw err;
		}
	});
	fs.writeFile("keys.json", keys, (err) => {
		if(err){
			throw err;
		}
	});
};

updateKey();

function addKey(){
	let newItem = document.getElementById('newKey');
	let item = newItem.value;

	if(item == ''){
		return;
	}
	itens.push(item);
	console.log(itens)
	newItem.value = '';
	
	saveValues();
	let qItens = itens.length;
	if(qItens > 1){
		console.log(values, qItens);
		let t = parseInt(values[qItens-2][1]);
		values.push([t, t+1000]);
	}
	
	key.innerHTML += `
		<div id="key${qItens}" class="key">
			${item} <input type="number" id="input${qItens}-1"> - <input type="number" id="input${qItens}-2">
		</div>`;
	updateKey();
}