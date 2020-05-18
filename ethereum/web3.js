import Web3 from 'web3';
let web3;

let provider;

//stephen's way
// const web3 = new Web3(window.web3.currentProvider);

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
	//we are in the browser and metamask is running
	web3 = new Web3(window.web3.currentProvider);

	// provider = window.ethereum;
	// provider.enable();
	// web3 = new Web3(provider);
} else {
	//we are in the server or the user is not running metamask
	provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/1f26f97b9fca4a4da64d4439a58a668e');
	web3 = new Web3(provider);
}

export default web3;
