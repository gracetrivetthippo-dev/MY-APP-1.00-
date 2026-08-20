import { ScheduleBlock } from '../types';

export const mondayFirstDay=(date:Date)=>(date.getDay()+6)%7;
export const dateKey=(date:Date)=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const blockDays=(block:ScheduleBlock)=>block.days?.length?block.days:[block.day];

export function scheduleBlockOccursOn(block:ScheduleBlock,date:Date):boolean {
  if(block.paused) return false;
  const key=dateKey(date);
  if(block.recurrence==='once') return block.date===key;
  if(block.startsOn&&key<block.startsOn) return false;
  if(block.endsOn&&key>block.endsOn) return false;
  return blockDays(block).includes(mondayFirstDay(date));
}

export const validTime=(value:string)=>/^([01]\d|2[0-3]):[0-5]\d$/.test(value);
export const validDate=(value?:string)=>!value||/^\d{4}-\d{2}-\d{2}$/.test(value);
export const sortSchedule=(a:ScheduleBlock,b:ScheduleBlock)=>a.start.localeCompare(b.start)||a.title.localeCompare(b.title);
