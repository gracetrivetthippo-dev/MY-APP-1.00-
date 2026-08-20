import {
  FocusSession,
  JournalEntry,
  Relationship,
  ScheduleBlock,
  StoryScene,
  StorySceneProgress,
  StoryTriggerCondition,
  StoryTriggerResult,
  StudyNote,
  Task,
  WardrobeItem,
} from '../types';
import { scheduleBlockOccursOn } from '../schedule/scheduleUtils';

export interface StoryTriggerContext {
  now:Date;
  level:number;
  tasks:Task[];
  schedule:ScheduleBlock[];
  relationships:Relationship[];
  wardrobe:WardrobeItem[];
  sessions:FocusSession[];
  visitedLocations:string[];
  progress:StorySceneProgress[];
  journalEntries:JournalEntry[];
  studyNotes:StudyNote[];
  storyFlags:string[];
}

const mondayFirstDay=(date:Date)=>(date.getDay()+6)%7;
const localDate=(date:Date)=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const localTime=(date:Date)=>`${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;

export function conditionLabel(condition:StoryTriggerCondition):string {
  if(condition.label) return condition.label;
  switch(condition.type){
    case 'scene_complete': return 'Complete the required earlier scene';
    case 'level_at_least': return `Reach Academy Level ${condition.level}`;
    case 'relationship_level_at_least': return `Reach relationship level ${condition.level}`;
    case 'task_complete': return 'Complete the required assignment';
    case 'session_count_at_least': return `Complete ${condition.count} ${condition.kind ?? 'focus'} session${condition.count===1?'':'s'}`;
    case 'location_visited': return 'Visit the required academy location';
    case 'day_of_week': return 'Return on the required day';
    case 'date_on_or_after': return `Available from ${condition.date}`;
    case 'date_on_or_before': return `Available through ${condition.date}`;
    case 'time_on_or_after': return `Available after ${condition.time}`;
    case 'time_before': return `Available before ${condition.time}`;
    case 'schedule_block_today': return 'Requires the matching schedule block today';
    case 'item_owned': return 'Own the required wardrobe item';
    case 'item_equipped': return 'Wear the required wardrobe item';
    case 'journal_entry_exists': return 'Write the required journal reflection';
    case 'study_note_exists': return 'Create the required study note';
    case 'story_flag': return 'Make the required earlier story choice';
  }
}

export function evaluateCondition(condition:StoryTriggerCondition,context:StoryTriggerContext):boolean {
  switch(condition.type){
    case 'scene_complete': return (context.progress.find(p=>p.sceneId===condition.sceneId)?.completions ?? 0)>0;
    case 'level_at_least': return context.level>=condition.level;
    case 'relationship_level_at_least': return (context.relationships.find(r=>r.id===condition.relationshipId)?.level ?? 0)>=condition.level;
    case 'task_complete': return !!context.tasks.find(t=>t.id===condition.taskId)?.completed;
    case 'session_count_at_least': return context.sessions.filter(s=>!condition.kind||s.kind===condition.kind).length>=condition.count;
    case 'location_visited': return context.visitedLocations.includes(condition.locationId);
    case 'day_of_week': return condition.days.includes(mondayFirstDay(context.now));
    case 'date_on_or_after': return localDate(context.now)>=condition.date;
    case 'date_on_or_before': return localDate(context.now)<=condition.date;
    case 'time_on_or_after': return localTime(context.now)>=condition.time;
    case 'time_before': return localTime(context.now)<condition.time;
    case 'schedule_block_today': return context.schedule.some(block=>block.affectsStory!==false&&scheduleBlockOccursOn(block,context.now)&&(!condition.title||block.title===condition.title)&&(!condition.kind||block.kind===condition.kind));
    case 'item_owned': return !!context.wardrobe.find(item=>item.id===condition.itemId)?.owned;
    case 'item_equipped': return !!context.wardrobe.find(item=>item.id===condition.itemId)?.equipped;
    case 'journal_entry_exists': return context.journalEntries.some(entry=>(!condition.template||entry.template===condition.template)&&(!condition.tag||entry.tags.includes(condition.tag)));
    case 'study_note_exists': return context.studyNotes.some(note=>(!condition.notebookId||note.notebookId===condition.notebookId)&&(!condition.tag||note.tags.includes(condition.tag)));
    case 'story_flag': return context.storyFlags.includes(condition.flag);
  }
}

export function evaluateStoryScene(scene:StoryScene,context:StoryTriggerContext):StoryTriggerResult {
  const today=localDate(context.now);
  const expired=!!scene.expiresAt&&today>scene.expiresAt;
  const notStarted=!!scene.startsAt&&today<scene.startsAt;
  const progress=context.progress.find(p=>p.sceneId===scene.id);
  const repeat=scene.repeat ?? {mode:'once' as const};
  const completed=(progress?.completions ?? 0)>0;
  const maximumReached=!!repeat.maxCompletions&&(progress?.completions ?? 0)>=repeat.maxCompletions;
  const cooldownActive=repeat.mode==='repeatable'&&!!repeat.cooldownHours&&!!progress?.lastCompletedAt&&context.now.getTime()-new Date(progress.lastCompletedAt).getTime()<repeat.cooldownHours*3_600_000;
  const reasons=(scene.triggers?.conditions ?? []).map(condition=>({label:conditionLabel(condition),met:evaluateCondition(condition,context)}));
  const triggerMatch=!scene.triggers||scene.triggers.conditions.length===0||(scene.triggers.mode==='ALL'?reasons.every(r=>r.met):reasons.some(r=>r.met));
  const eligible=!expired&&!notStarted&&!maximumReached&&!cooldownActive&&!(repeat.mode==='once'&&completed)&&triggerMatch;
  return {eligible,expired,reasons};
}

export function buildStoryQueue(story:StoryScene[],context:StoryTriggerContext,dismissedIds:string[]):string[] {
  return story
    .filter(scene=>!dismissedIds.includes(scene.id)&&evaluateStoryScene(scene,context).eligible)
    .sort((a,b)=>(b.priority??0)-(a.priority??0)||a.chapter-b.chapter)
    .map(scene=>scene.id);
}
