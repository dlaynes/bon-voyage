
class ExchangeRate {

    static NORMAL = 1;
    static MEDIUM = 2;
    static LOW = 3;
    static RANDOM = 4;

    static METAL = 10;
    static CRYSTAL = 11;
    static DEUTERIUM = 12;
    static SPACE_CREDITS = 20;

    static getTradeRates(exchangeRate){
        let metalTradeValue, crystalTradeValue, deuteriumTradeValue = 1;

        switch(exchangeRate){
            case ExchangeRate.NORMAL:
                metalTradeValue = 3;
                crystalTradeValue = 2;
                break;

            case ExchangeRate.MEDIUM:
                metalTradeValue = 2;
                crystalTradeValue = 1.5;
                break;

            case ExchangeRate.LOW:
                metalTradeValue = 2;
                crystalTradeValue = 1;
                break;

            case ExchangeRate.RANDOM:
                metalTradeValue = (Math.random() * (3 - 2.5) + 2.5).toFixed(3);
                metalTradeValue = (Math.random() * (3 - 2.5) + 2.5).toFixed(3);
                break;
            default:
                console.log("Unknown exchange rate");
                metalTradeValue = 0;
                crystalTradeValue = 0;
                deuteriumTradeValue = 0;
                break;
        }

        return [ metalTradeValue, crystalTradeValue, deuteriumTradeValue ];
    }

    static getResourceTradeValues(resources, from, exchangeRate){

        const rates = ExchangeRate.getTradeRates(exchangeRate);

        switch(from){
            case ExchangeRate.METAL:
                return {
                    metal: resources.metal,
                    crystal: (resources.metal / rates[0]) * rates[1],
                    deuterium: (resources.metal / rates[0]) * rates[2]
                };
                break;
            case ExchangeRate.CRYSTAL:
                return {
                    metal: (resources.crystal / rates[1]) * rates[2],
                    crystal: resources.crystal,
                    deuterium: (resources.crystal / rates [1]) * rates[0]
                };
                break;
            case ExchangeRate.DEUTERIUM:
                return {
                    metal: (resources.deuterium / rates[2]) * rates[0],
                    crystal: (resources.deuterium / rates[2]) * rates[1],
                    deuterium: resources.deuterium
                };
                break;
        }
    }

    static resourcesToSpaceCredits(resources, exchangeRate){
        const rates = ExchangeRate.getTradeRates(exchangeRate);

        const metal = resources.metal,
            crystal = (resources.crystal / rates[1]) * rates[0],
            deuterium = (resources.deuterium / rates[2]) * rates[0];
        return Math.floor((metal + crystal + deuterium) / 40);
    }
}

export default ExchangeRate;