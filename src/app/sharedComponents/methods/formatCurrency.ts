export const formatCurrency = (value: number, currency: string) => {
	let roundedValue = 0;
	if (value) roundedValue = Math.round(value * 100) / 100;
	return `${roundedValue.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
};