module.exports = async function () {
    return {
        uma_daily: {
            amount: 96.22,
            description: 'Valor diario de la UMA',
            for_year: 2022
        },
        uma_monthly: {
            amount: 2925.09,
            description: 'Valor mensual de la UMA. Se calcula multiplicando su valor diario por 30.4 veces',
            for_year: 2022
        },
        uma_yearly: {
            amount: 35101.08,
            description: 'Valor anual de la UMA. Se calcula multiplicando su valor mensual por 12',
            for_year: 2022
        },
    }
}