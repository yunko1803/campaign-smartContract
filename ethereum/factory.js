import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const address = '0x56b1a399833a2d9e36c3ad91fafB1B62c4AA98fd';
const abi = JSON.parse(CampaignFactory.interface);

export default new web3.eth.Contract(abi, address);
