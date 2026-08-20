import { DailyGift, Relationship, ScheduleBlock } from '../types';
import { scheduleBlockOccursOn, sortSchedule } from '../schedule/scheduleUtils';

export const localDateKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const hash=(value:string)=>[...value].reduce((total,char)=>(total*31+char.charCodeAt(0))>>>0,2166136261);
export type AcademySeason='autumn'|'winter'|'spring'|'summer';
export function academySeason(date=new Date()):AcademySeason {const month=date.getMonth()+1;return month>=9&&month<=11?'autumn':month===12||month<=2?'winter':month>=3&&month<=5?'spring':'summer';}
const weatherBySeason:Record<AcademySeason,{label:string;icon:string;note:string}[]>={
  autumn:[{label:'Rose-gold sun',icon:'partly-sunny-outline',note:'Warm light across the courtyards.'},{label:'Soft rain',icon:'rainy-outline',note:'Library windows and polished hallways.'},{label:'Crisp wind',icon:'leaf-outline',note:'Ribbons lifting along the garden paths.'}],
  winter:[{label:'Light snow',icon:'snow-outline',note:'A quiet white edge along the academy roofs.'},{label:'Silver rain',icon:'rainy-outline',note:'Work lights glow early in the studios.'},{label:'Clear frost',icon:'sparkles-outline',note:'Cold glass and bright morning skies.'}],
  spring:[{label:'Garden sun',icon:'sunny-outline',note:'The practice garden is warm enough to open.'},{label:'Petal breeze',icon:'flower-outline',note:'Rose petals gather near the courtyard doors.'},{label:'April shower',icon:'rainy-outline',note:'A quick rain over the conservatory glass.'}],
  summer:[{label:'Golden afternoon',icon:'sunny-outline',note:'Long light across the empty studios.'},{label:'Warm breeze',icon:'leaf-outline',note:'The grounds feel unhurried today.'},{label:'Summer rain',icon:'rainy-outline',note:'A cooling storm beyond the tall windows.'}],
};
export function academyWeather(date=new Date()){const season=academySeason(date);const options=weatherBySeason[season];return {season,...options[hash(localDateKey(date))%options.length]};}
export const isWeekend=(date=new Date())=>date.getDay()===0||date.getDay()===6;
export function dailySchedule(schedule:ScheduleBlock[],date=new Date()){return schedule.filter(block=>scheduleBlockOccursOn(block,date)).sort(sortSchedule);}

export const dailyGifts:DailyGift[]=[
  {id:'rose-coins',name:'Rose-Sealed Coin Purse',description:'A tiny purse left beside the morning letter.',icon:'rose-outline',coins:18,xp:6},
  {id:'practice-ribbon',name:'Practice Ribbon',description:'A ribbon for returning to the work.',icon:'ribbon-outline',coins:10,xp:14},
  {id:'library-token',name:'Library Token',description:'For one focused page, problem, or paragraph.',icon:'library-outline',coins:12,xp:12},
  {id:'music-note',name:'Music-Wing Note',description:'A small reward from the rehearsal desk.',icon:'musical-note-outline',coins:15,xp:10,relationshipId:'r3',relationshipPoints:3},
  {id:'clara-letter',name:'Letter from Clara',description:'Mostly affectionate. Slightly overdecorated.',icon:'mail-outline',coins:10,xp:10,relationshipId:'r2',relationshipPoints:5},
  {id:'mentor-pin',name:'Mentor’s Gold Pin',description:'A reminder that consistency counts.',icon:'sparkles-outline',coins:8,xp:18,relationshipId:'r4',relationshipPoints:4},
  {id:'tea-ticket',name:'Common-Room Tea Ticket',description:'Redeemable for imaginary tea and real progress.',icon:'cafe-outline',coins:20,xp:5},
  {id:'pressed-rose',name:'Pressed Rose',description:'Found between two pages of the academy chronicle.',icon:'flower-outline',coins:14,xp:12,relationshipId:'r6',relationshipPoints:3},
  {id:'studio-key',name:'Silver Studio Key',description:'Not a literal key. The Headmistress was extremely clear.',icon:'key-outline',coins:16,xp:12},
  {id:'sophie-card',name:'Sophie’s Correction Card',description:'Useful, specific, and almost friendly.',icon:'create-outline',coins:10,xp:14,relationshipId:'r5',relationshipPoints:4},
  {id:'weekend-box',name:'Weekend Music Box',description:'A gentler reward for an unhurried day.',icon:'musical-notes-outline',coins:22,xp:8},
  {id:'academy-crest',name:'Academy Crest Token',description:'A larger reward from the weekly rotation.',icon:'shield-outline',coins:28,xp:15},
];
export function giftForDate(date=new Date()){const weekendOffset=isWeekend(date)?2:0;return dailyGifts[(hash(localDateKey(date))+weekendOffset)%dailyGifts.length];}

const weekdayLocations=['primaryStudio','library','musicWing','practiceStudio','dormCommon'];
const weekendLocations=['formalGardens','roseCourt','conservatory','dormCommon','practiceGarden'];
export function npcPresence(relationships:Relationship[],date=new Date(),hour=date.getHours()){
  const pool=isWeekend(date)?weekendLocations:weekdayLocations;
  return relationships.map((npc,index)=>{
    if(hour<8)return {...npc,dailyLocation:'dormCommon',presenceNote:'Starting the day quietly'};
    if(hour>=20)return {...npc,dailyLocation:'dormCommon',presenceNote:'Evening common-room hours'};
    const dailyLocation=isWeekend(date)?pool[(hash(localDateKey(date)+npc.id)+index)%pool.length]:(npc.homeLocation??pool[index%pool.length]);
    return {...npc,dailyLocation,presenceNote:isWeekend(date)?'Weekend routine':'Academy-day routine'};
  });
}
