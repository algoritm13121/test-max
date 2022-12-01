import set from 'date-fns/set';
import getMinutes from 'date-fns/getMinutes';
import getDay from 'date-fns/getDay';
import subDays from 'date-fns/subDays';

export default function (time, timeframe) {
    const date = new Date(time);
    const minutes = getMinutes(date);

    switch (timeframe) {
    case '1':
        return +set(new Date(time), { seconds: 0, milliseconds: 0 }) / 1000;
    case '5':
        const full5Minutes = Math.floor(minutes / 5) * 5;

        return +set(new Date(date), { minutes: full5Minutes, seconds: 0, milliseconds: 0 }) / 1000;
    case '15':
        const full15Minutes = Math.floor(minutes / 15) * 15;

        return +set(new Date(date), { minutes: full15Minutes, seconds: 0, milliseconds: 0 }) / 1000;
    case '30':
        const full30Minutes = Math.floor(minutes / 30) * 30;

        return +set(new Date(date), { minutes: full30Minutes, seconds: 0, milliseconds: 0 }) / 1000;
    case '60':
        return +set(new Date(date), { minutes: 0, seconds: 0, milliseconds: 0 }) / 1000;
    case 'D':
        return +set(new Date(time), { hours: 3, minutes: 0, seconds: 0, milliseconds: 0 }) / 1000;
    case 'W':
        const dayOfWeek = getDay(new Date(time));
        const neededDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        return +set(subDays(new Date(time), neededDayOfWeek), { hours: 3, minutes: 0, seconds: 0, milliseconds: 0 }) / 1000;
    case 'M':
        return +set(new Date(time), { date: 1, hours: 3, minutes: 0, seconds: 0, milliseconds: 0 }) / 1000;
    }
}
