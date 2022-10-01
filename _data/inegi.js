module.exports = async function () {
    const year = 2022;

    const uma_daily = 96.22;
    const uma_daily_pretty = "96.22"; 

    const uma_monthly = 2925.09; 
    const uma_monthly_string = String(uma_monthly);
    const uma_monthly_pretty = `\$${uma_monthly_string.slice(0, 1)},${uma_monthly_string.slice(1, uma_monthly_string.length)}`; 

    const uma_yearly = 35101.08; 
    const uma_yearly_string = String(uma_yearly);
    const uma_yearly_pretty = `\$${uma_yearly_string.slice(0, 2)},${uma_yearly_string.slice(2, uma_yearly_string.length)}`;

    const uma_yearly_times_five = (uma_yearly * 5).toFixed(2); 
    const uma_yearly_times_five_string = String(uma_yearly_times_five);
    const uma_yearly_times_five_pretty = `\$${uma_yearly_times_five_string.slice(0, 3)},${uma_yearly_times_five_string.slice(3, uma_yearly_times_five_string.length)}`; 

    return {
        uma_daily: {
            amount: uma_daily,
            amount_pretty: uma_daily_pretty,
            description: 'Valor diario de la UMA',
            for_year: year
        },
        uma_monthly: {
            amount: uma_monthly,
            amount_pretty: uma_monthly_pretty,
            description: 'Valor mensual de la UMA. Se calcula multiplicando su valor diario por 30.4 veces',
            for_year: year
        },
        uma_yearly: {
            amount: uma_yearly,
            amount_pretty: uma_yearly_pretty,
            description: 'Valor anual de la UMA. Se calcula multiplicando su valor mensual por 12',
            for_year: year
        },
        uma_yearly_times_five: {
            amount: uma_yearly_times_five,
            amount_pretty: uma_yearly_times_five_pretty,
        }
    }
}