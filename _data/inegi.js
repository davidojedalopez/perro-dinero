module.exports = async function () {
    return {
        uma_daily: {
            amount: 89.62,
            description: 'Valor diario de la UMA',
            for_year: 2021
        },
        uma_monthly: {
            amount: 2724.45,
            description: 'Valor mensual de la UMA. Se calcula multiplicando su valor diario por 30.4 veces',
            for_year: 2021
        },
        uma_yearly: {
            amount: 32693.40,
            description: 'Valor anual de la UMA. Se calcula multiplicando su valor mensual por 12',
            for_year: 2021
        },
    }
}