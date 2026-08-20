# Royal Ballet Academy 1.0 Release Checklist

## Automated checks completed

- TypeScript compilation
- Expo public-config resolution
- Offline iOS Metro export
- Static navigation audit: 13 stack screens, 5 tabs, 14 navigation targets, zero missing routes
- Story prerequisite and cast-reference audit
- Daily engine tests for real-schedule filtering, weekend detection, deterministic gifts, and seasons
- ZIP integrity test

## Device smoke test

Run these once in Expo Go before treating a device install as final:

1. Open every bottom tab.
2. Open Schedule, create a temporary block, edit it, duplicate it, and delete it.
3. Complete one real schedule block and confirm it cannot be claimed twice.
4. Claim the daily gift and reopen the app to confirm it stays claimed.
5. Start and complete one Do It With Me session.
6. Write and edit one journal page and one study note.
7. Open Story and complete one available scene choice.
8. Visit Academy locations and verify room exits.
9. Upload one temporary NPC portrait and one dorm object in the Artwork Portal.
10. Export a backup, then verify the JSON appears in the share sheet.

## Compatibility

This release is locked to Expo SDK 57 in `package.json`, matching the dependencies used for the successful offline iOS bundle. Use an Expo Go version supporting SDK 57. If a device only supports SDK 54, upgrade Expo Go rather than mixing SDK 54 and SDK 57 packages in one installation.

## Native notifications

The app currently provides reliable in-app reminders. Native push notifications are intentionally disabled because the compatible native dependency was unavailable during the release build. The Settings screen reports this honestly; no control pretends to schedule a push notification.
