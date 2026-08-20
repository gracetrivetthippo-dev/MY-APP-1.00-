"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortSchedule = exports.validDate = exports.validTime = exports.blockDays = exports.dateKey = exports.mondayFirstDay = void 0;
exports.scheduleBlockOccursOn = scheduleBlockOccursOn;
const mondayFirstDay = (date) => (date.getDay() + 6) % 7;
exports.mondayFirstDay = mondayFirstDay;
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
exports.dateKey = dateKey;
const blockDays = (block) => block.days?.length ? block.days : [block.day];
exports.blockDays = blockDays;
function scheduleBlockOccursOn(block, date) {
    if (block.paused)
        return false;
    const key = (0, exports.dateKey)(date);
    if (block.recurrence === 'once')
        return block.date === key;
    if (block.startsOn && key < block.startsOn)
        return false;
    if (block.endsOn && key > block.endsOn)
        return false;
    return (0, exports.blockDays)(block).includes((0, exports.mondayFirstDay)(date));
}
const validTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
exports.validTime = validTime;
const validDate = (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value);
exports.validDate = validDate;
const sortSchedule = (a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title);
exports.sortSchedule = sortSchedule;
