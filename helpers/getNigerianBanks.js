const axios = require('axios');
const errorHandler = require('../utils/errorHandler');


const getAllNigerianBanks = async (req, res) => {
    try {
        const response = await axios.get('https://nigerianbanks.xyz/');

        const simplifiedBanks = response.data.map(bank => ({
            name: bank.name,
            logo: bank.logo,
            code: bank.code
        }));
  
        res.status(200).json(simplifiedBanks);
    } catch (error) {
        errorHandler(res, error);
    }
}

module.exports = {
    getAllNigerianBanks
}