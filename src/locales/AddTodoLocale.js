import { enUS } from 'date-fns/locale';

const formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "d MMMM yyyy ',' p"
};

export const locale = {
    ...enUS,
    formatRelative: token => formatRelativeLocale[token],
};