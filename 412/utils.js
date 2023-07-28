
export function Clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function IsEmpty(value)
{
    return value === '' ? true : false;
}

export function OnSuccess(input)
{
    const container = input.parentElement;
    container.classList.remove('invalid');
    container.classList.add('valid');
    const error = container.querySelector('small');
    error.textContent = '';
}

export function OnError(input, message)
{
    const container = input.parentElement;
    container.classList.remove('valid');
    container.classList.add('invalid');
    const error = container.querySelector('small');
    error.textContent = message;

}
