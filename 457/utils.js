
export function AbbreviateNumber(number)
{
    // none, thousand, million, billion, trillion, quadtrillion, quintillion, ...
    const abbreviations = ['', 'K', 'M', 'B', 'T', 'Q', 'QQ'];

    let index = 0;
    while (number >= 1000 && index < abbreviations.length - 1) {
        number /= 1000;
        index++;
    }

    // Round to one decimal place
    //const roundedNumber = Math.round(number * 10) / 10;
    const roundedNumber = number.toFixed(3);

    return roundedNumber.toString() + abbreviations[index];
}