import { displayCells } from './handleCells.js';
import { displayDate, updateTime } from './handleDate.js';

startDisplay();

function startDisplay()
{
    const time = new Date();
    const hours = time.getHours();
    // if(hours >= 8 && hours <= 9 || hours >= 12 && hours <= 14)
    {
        displayCells();
    }
    displayDate();
    updateTime();
    setInterval(updateTime, 6000);
}



