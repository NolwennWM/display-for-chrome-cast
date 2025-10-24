export function displayDate()
{
    const dateElement = document.querySelector('.date');
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('fr-FR', options);
    dateElement.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

export function updateTime()
{
    const timeElement = document.querySelector('.time');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
}