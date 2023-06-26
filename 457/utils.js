
export function AbbreviateNumber(number)
{
    // none, thousand, million, billion, trillion, quadtrillion, quintillion, ...
    const abbreviations = ['', 'K', 'M', 'B', 'T', 'Q', 'QQ'];

    let index = 0;
    while (number >= 1000 && index < abbreviations.length - 1) {
        number /= 1000;
        index++;
    }

    let roundedNumber = 0;
    if (index > 0 ) {
        roundedNumber = number.toFixed(3);
    } else {
        roundedNumber = number.toFixed(0);
    }

    return roundedNumber.toString() + abbreviations[index];
}

export function Clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function GetRadius(P) {
    return Math.sqrt(P.x*P.x + P.y*P.y) / Math.sqrt(2);
}