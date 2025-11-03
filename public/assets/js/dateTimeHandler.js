
export class DateTimeHandler
{
    constructor()
    {
        console.log("DateHandler initialized");
    }


    displayDate(format)
    {
        const dateElement = document.createElement('span');
        dateElement.classList.add('date');

        const now = new Date();
        if(format === "short")
        {
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            dateElement.textContent = `${day}/${month}/${year}`;
        }
        else if(format === "full")
        {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = now.toLocaleDateString('fr-FR', options);
            dateElement.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        }
        else
        {
            dateElement.textContent = "Date non disponible";
        }
        return dateElement;
    }

    updateDigitalClock()
    {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        this.timeElement.textContent = `${hours}:${minutes}`;
    }
    displayClock(format)
    {
        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        this.timeElement = timeElement;

        if(format === "analog")
        {
            const clock = this.createAnalogClock();
            timeElement.append(clock);

            this.updateAnalogClock();
            setInterval(this.updateAnalogClock.bind(this), 1000);
        }
        else if(format === "digital")
        {
            this.updateDigitalTime();
            setInterval(this.updateDigitalClock.bind(this), 60000);
        }
        else
        {
            timeElement.textContent = "Heure non disponible";
        }


        return timeElement;
    }
    createAnalogClock()
    {
        const clock = document.createElement('div');
        clock.classList.add('analog-clock');
        
        const hoursElement = document.createElement('div');
        hoursElement.classList.add('hours', "hand");
        this.hoursElement = hoursElement;

        const minutesElement = document.createElement('div');
        minutesElement.classList.add('minutes', "hand");
        this.minutesElement = minutesElement;

        const secondsElement = document.createElement('div');
        secondsElement.classList.add('seconds', "hand");
        this.secondsElement = secondsElement;

        const dot = document.createElement('div');
        dot.classList.add('dot');
        clock.append(hoursElement, minutesElement, secondsElement, dot);
        
        return clock;
    }
    updateAnalogClock()
    {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();
        const secondsDeg = ((seconds / 60) * 360);
        const minutesDeg = ((minutes / 60) * 360) + ((seconds/60)*6);
        const hoursDeg = ((hours / 12) * 360) + ((minutes/60)*30);
        this.secondsElement.style.transform = `rotate(${secondsDeg}deg)`;
        this.minutesElement.style.transform = `rotate(${minutesDeg}deg)`;
        this.hoursElement.style.transform = `rotate(${hoursDeg}deg)`;      
    }
}