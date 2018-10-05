import cuid from 'cuid';
import moment from 'moment';

const SLEEP_STATE = ['AWAKE', 'ASLEEP'];

const generateSleepMinutes = () => {
    //Total 8 hours --- 480 mins
    let MIN_SLEEP = 0; // Min Minimum Sleep
    let MAX_SLEEP = 58; // in Total min expecting in hours of sleep
    return Math.floor(Math.random() * MAX_SLEEP) + MIN_SLEEP;
}

const generateDateRangeStartEnd = (day) => {

    //let randomDay = Math.floor(Math.random() * 7) + 1;
    let randomHours = Math.floor(Math.random() * 25);
    let randomMinutes = generateSleepMinutes();

    let start_date = moment();
    if(day) {
        start_date.date(day);
    }
    start_date.hour(randomHours);
    start_date.minute(randomMinutes);
    
    let end_date = moment();
    if(day) {
        end_date.date(day);
    }
    end_date.hour(randomHours);
    end_date.hour(randomHours);
    end_date.minute(randomMinutes);
    end_date.add(1, 'minutes');
    
    return {
        start: start_date.toISOString(),
        end: end_date.toISOString()
    }
}

export const generateDayViewData = (day) => {
    console.log(day);
    let TOTAL_RECORD = 1440;
    const data = [];
    for (let i = 0; i < TOTAL_RECORD; i++) {
        let sleepTrackObject = Object.assign({}, {
            id: cuid(),
            sleepStatus: SLEEP_STATE[Math.floor(Math.random() * 2)],
        }, generateDateRangeStartEnd(day))
        data.push(sleepTrackObject);
    };
    return data;
}

export const generateWeekViewData = () => {
    let data = [];
    let begin = moment().startOf('week').weekday(1);
    for (var i=0; i<7; i++) {
        console.log(begin.date(), begin.format('ddd D-M-Y'));
        const singleDayData = generateDayViewData(begin.date());
        console.log("singleDayData --- ", singleDayData);
        data = data.concat(singleDayData);
        begin.add(1, 'days');
    }
    console.log(data);
    return data;
}

export const generateFakeData = () => {
    const data = [];
    let TOTAL_RECORD = 1440;
    for (let i = 0; i < TOTAL_RECORD; i++) {
        let sleepTrackObject = Object.assign({}, {
            id: cuid(),
            sleepStatus: SLEEP_STATE[Math.floor(Math.random() * 2)],
        }, generateDateRangeStartEnd())
        data.push(sleepTrackObject);
    };
    return data;
}