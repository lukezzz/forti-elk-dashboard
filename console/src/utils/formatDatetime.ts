import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(utc);
dayjs.extend(relativeTime);


const df1 = "YYYY-MM-DD HH:mm:ss"
const df2 = "YYYY-MM-DD"

const convertStringToTimeStamp = (dt: string | number) => {
    if (typeof dt === "number") {
        // check if it is millisecond number or second number, if it is second number, convert to millisecond number
        if (dt.toString().length === 10) {
            dt = dt * 1000;
        }
    }

    if (typeof dt === "string") {
        // convert to millisecond number
        if (dt.length === 10) {
            dt = parseInt(dt) * 1000;
        } else if (dt.length === 13) {
            dt = parseInt(dt);
        }
    }

    return dt;
};

export const formateUTCDate = (utcDt: Date) => {
    return dayjs.utc(utcDt).local().format(df1)
}

export const formatUtcDatetime = (utcDt: string | number) => {
    return dayjs
        .utc(convertStringToTimeStamp(utcDt))
        .local()
        .format(df1);
};

export const dayStartToDatetimeString = (lastDay: number) => {
    const dt = dayjs().subtract(lastDay, "day");
    return dt.format(df1);
};

export const nowToDatetimeString = () => {
    return dayjs().utc().format(df1);
};

export const formatUtcDate = (utcDt: string) => {
    return dayjs.utc(utcDt).local().format(df2);
};

export const nowToDateString = () => {
    return dayjs().format(df2);
};

export const formatFromToday = (utcDt: string | number) => {
    const dt = convertStringToTimeStamp(utcDt);
    if (dt) {
        return dayjs.utc(dt).local().fromNow();
    } else {
        return "-";
    }
};


export const ttlToDString = (ttl: number) => {
    if (ttl <= 0) {
        return "No limit";
    }

    const d = Math.floor(ttl / 86400);
    const h = Math.floor((ttl % 86400) / 3600);
    const m = Math.floor((ttl % 3600) / 60);
    const s = ttl % 60;
    let result = "";
    if (d > 0) {
        result += d + "d ";
    }
    if (h > 0) {
        result += h + "h ";
    }
    if (m > 0) {
        result += m + "m ";
    }
    if (s > 0) {
        result += s + "s";
    }
    return result.trim();
}


// interval: 1 hour, 1 day, 1 month
export const formatDateWithInterval = (utcDt: string | number, interval: string) => {
    const dt = convertStringToTimeStamp(utcDt);
    if (dt) {
        return dayjs.utc(dt).local().format(interval === "1 hour" ? "MM-DD H[h]" : interval === "1 day" ? "MMM-DD" : "YYYY-MMM");
    } else {
        return "-";
    }
}