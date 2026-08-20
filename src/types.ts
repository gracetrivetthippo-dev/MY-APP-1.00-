export type StatKey = 'ballet' | 'strength' | 'flexibility' | 'academics' | 'french' | 'wellbeing';
export type TaskKind = 'ballet' | 'school' | 'french' | 'wellbeing' | 'personal';
export type ActivityKind = 'study' | 'practice' | 'french' | 'reading' | 'wellbeing' | 'custom';
export type AvatarPoseId = 'first' | 'fifth' | 'tendu' | 'arabesque' | 'attitude' | 'jete';

export interface Task { id: string; title: string; detail: string; kind: TaskKind; minutes: number; xp: number; coins: number; completed: boolean; dueLabel: string; }
export interface MentorQuest { id:string; title:string; description:string; mentorId:string; kind:'session_kind'|'location_visit'|'journal_template'|'item_owned'; target:string; goal:number; progress:number; rewardItemId:string; completed:boolean; }
export interface ScheduleBlock {
  id:string; day:number; days?:number[]; start:string; end:string; title:string; location:string; kind:TaskKind;
  notes?:string; recurrence?:'weekly'|'once'; date?:string; startsOn?:string; endsOn?:string;
  paused?:boolean; affectsStory?:boolean; createdAt?:string;
}
export interface Relationship {
  id:string; name:string; role:string; level:number; points:number; note:string; color:string;
  pronouns?:string; year?:string; personality?:string; likes?:string[]; dislikes?:string[];
  homeLocation?:string; scheduleHint?:string; initials?:string;
}
export type WardrobeSlotAppearance='always'|'winter'|'spring'|'fall'|'summer'|'christmas'|'halloween';
export interface WardrobeSlot { id:string; name:string; appearance:WardrobeSlotAppearance; createdAt:string; }
export interface WardrobeItem { id: string; name: string; slot: string; price: number; owned: boolean; equipped: boolean; color: string; unlock?: string; }
export interface ClothingFit { x:number; y:number; scale:number; }
export interface SavedLook { id:string; name:string; poseId:AvatarPoseId; equippedItemIds:string[]; createdAt:string; }
export interface DialogueLine { speaker:string; text:string; expression?:'neutral'|'warm'|'amused'|'worried'|'stern'|'surprised'; }
export interface StoryChoice {
  id:string; label:string; response?:DialogueLine[];
  relationshipEffects?:{relationshipId:string;points:number}[];
  coins?:number; xp?:number; flags?:string[];
}
export type StoryTriggerCondition =
  | { type:'scene_complete'; sceneId:string; label?:string }
  | { type:'level_at_least'; level:number; label?:string }
  | { type:'relationship_level_at_least'; relationshipId:string; level:number; label?:string }
  | { type:'task_complete'; taskId:string; label?:string }
  | { type:'session_count_at_least'; count:number; kind?:ActivityKind; label?:string }
  | { type:'location_visited'; locationId:string; label?:string }
  | { type:'day_of_week'; days:number[]; label?:string }
  | { type:'date_on_or_after'; date:string; label?:string }
  | { type:'date_on_or_before'; date:string; label?:string }
  | { type:'time_on_or_after'; time:string; label?:string }
  | { type:'time_before'; time:string; label?:string }
  | { type:'schedule_block_today'; title?:string; kind?:TaskKind; label?:string }
  | { type:'item_owned'; itemId:string; label?:string }
  | { type:'item_equipped'; itemId:string; label?:string }
  | { type:'journal_entry_exists'; template?:JournalTemplate; tag?:string; label?:string }
  | { type:'study_note_exists'; notebookId?:string; tag?:string; label?:string }
  | { type:'story_flag'; flag:string; label?:string };
export interface StoryTriggerGroup { mode:'ALL'|'ANY'; conditions:StoryTriggerCondition[]; }
export interface StoryRepeatRule { mode:'once'|'repeatable'; cooldownHours?:number; maxCompletions?:number; }
export interface StoryScene {
  id:string; chapter:number; title:string; summary:string; lines:DialogueLine[];
  status:'available'|'locked'|'complete'; requirement?:string; reward?:{ coins:number; xp:number };
  triggers?:StoryTriggerGroup; repeat?:StoryRepeatRule; priority?:number; optional?:boolean;
  startsAt?:string; expiresAt?:string;
  locationId?:string; castIds?:string[]; letterFrom?:string; choices?:StoryChoice[];
}
export interface StorySceneProgress { sceneId:string; completions:number; lastCompletedAt?:string; dismissedAt?:string; choiceId?:string; }
export interface StoryTriggerResult { eligible:boolean; expired:boolean; reasons:{label:string;met:boolean}[]; }
export interface FocusSession { id: string; kind: ActivityKind; title: string; minutes: number; completedAt: string; xp: number; goal?: string; customSteps?: string; }
export interface LearningActivity { id: string; kind: ActivityKind; title: string; subtitle: string; minutes: number; stat: StatKey; steps: string[]; resource?: { label: string; url: string }; }
export interface AcademyBook { id:string; title:string; content:string; importedAt:string; lastPosition:number; wordCount:number; }
export type JournalMood = 'calm'|'proud'|'tired'|'hopeful'|'frustrated'|'excited'|'neutral';
export type JournalTemplate = 'free'|'class-reflection'|'practice-log'|'story-reflection'|'gratitude'|'weekly-review'|'french-vocabulary'|'dream-idea';
export interface JournalEntry {
  id:string; title:string; content:string; entryDate:string; createdAt:string; updatedAt:string;
  mood:JournalMood; template:JournalTemplate; tags:string[]; location?:string; characterId?:string;
  sceneId?:string; favorite:boolean; private:boolean; sessionId?:string;
}
export interface Notebook { id:string; name:string; color:string; createdAt:string; }
export interface StudyNote {
  id:string; notebookId:string; title:string; content:string; createdAt:string; updatedAt:string;
  pinned:boolean; highlightColor?:string; tags:string[]; checklist?:{id:string;text:string;completed:boolean}[];
  bookId?:string; sessionId?:string; sourceImageUri?:string;
}
export type ArtCategory='npc'|'avatar'|'furniture'|'location';
export type ArtLayer='background'|'base'|'body'|'face'|'expression'|'hair-back'|'outfit'|'shoes'|'hair-front'|'accessory'|'furniture'|'foreground'|'portrait';
export interface CustomArtAsset {
  id:string; name:string; uri:string; category:ArtCategory; targetId:string; variant:string; layer:ArtLayer; itemId?:string;
  zIndex:number; x:number; y:number; scale:number; opacity:number; enabled:boolean; createdAt:string;
}
export interface DailyGift { id:string; name:string; description:string; icon:string; coins:number; xp:number; relationshipId?:string; relationshipPoints?:number; }
export interface DailyPreferences { remindersEnabled:boolean; reminderHour:number; reminderMinute:number; }
