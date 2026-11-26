let weight = {kg: 1, g: 1000, lb: 2.204623, oz: 35.273968};
let volume = {l: 1, ml: 1000};
let units = {unit: 1, dozen: 12};

export default function convert(value, from, to) {
	if (from in weight && to in weight) {
		return (value / weight[from] * weight[to]).toFixed(3);
	}
	else if (from in volume && to in volume) {
		return (value / volume[from] * volume[to]);
	}
	else if (from in units && to in units) {
		return (value / units[from] * units[to]);
	}
	else {
		return -1;
	}
}
