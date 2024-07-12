const axios = require('axios');

const getAllNigerianBanks = async () => {
    try {
        const response = await axios.get('https://nigerianbanks.xyz/');

        const simplifiedBanks = response.data.map(bank => ({
            name: bank.name,
            logo: bank.logo,
            code: bank.code
        }));
  
        return { simplifiedBanks };
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getAllNigerianBanks
}