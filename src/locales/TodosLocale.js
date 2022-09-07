import { formatWithOptions } from 'date-fns/fp';
import { enUS } from 'date-fns/locale';

const formatRelativeLocale = {
    lastWeek: "'last' eeee",
    yesterday: "'yesterday'",
    today: "'today'",
    tomorrow: "'tomorrow'",
    nextWeek: "eeee",
    other: 'd MMMM yyyy'
};
export const locale = {
    ...enUS,
    formatRelative: token => formatRelativeLocale[token],
};

export const dateToString = formatWithOptions({ locale: enUS }, 'd MMMM yyyy')