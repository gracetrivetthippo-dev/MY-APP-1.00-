import { ScheduleBlock } from '../types';

export const mondayFirstDay=(date:Date)=>(date.getDay()+6)%7;
export const dateKey=(date:Date)=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const blockDays=(block:ScheduleBlock)=>block.days?.length?block.days:[block.day];
const academyBreaks=[['2026-12-21','2027-01-03'] as const];
export const academyHolidayOccursOn=(date:Date)=>{const key=dateKey(date);return academyBreaks.some(([start,end])=>key>=start&&key<=end);};

export function scheduleBlockOccursOn(block:ScheduleBlock,date:Date):boolean {
  if(block.paused) return false;
  if(academyHolidayOccursOn(date)) return false;
  const key=dateKey(date);
  if(block.recurrence==='once') return block.date===key;
  if(block.startsOn&&key<block.startsOn) return false;
  if(block.endsOn&&key>block.endsOn) return false;
  return blockDays(block).includes(mondayFirstDay(date));
}

export const validTime=(value:string)=>/^([01]\d|2[0-3]):[0-5]\d$/.test(value);
export const validDate=(value?:string)=>{
  if(!value)return true;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const [year,month,day]=value.split('-').map(Number);
  const parsed=new Date(Date.UTC(year,month-1,day));
  return parsed.getUTCFullYear()===year&&parsed.getUTCMonth()===month-1&&parsed.getUTCDate()===day;
};
export function scheduleBlocksOverlap(first:ScheduleBlock,second:ScheduleBlock):boolean {
  if(first.paused||second.paused||first.recurrence!==second.recurrence)return false;
  const sameDay=first.recurrence==='once'
    ? !!first.date&&first.date===second.date
    : blockDays(first).some(day=>blockDays(second).includes(day));
  return sameDay&&first.start<second.end&&second.start<first.end;
}
export const sortSchedule=(a:ScheduleBlock,b:ScheduleBlock)=>a.start.localeCompare(b.start)||a.title.localeCompare(b.title);
