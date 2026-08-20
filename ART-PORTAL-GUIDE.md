# RBA Artwork Portal Guide

Open **Wardrobe → Upload & Assign Custom Artwork** or **Academy Cast → Open Artwork Assignment Portal**.

## NPC expressions

1. Choose **NPC** and the character.
2. Enter a state such as `neutral`, `mad`, `worried`, `warm`, `stern`, `amused`, or `surprised`.
3. Choose `portrait` for a complete portrait or `expression` for a transparent expression overlay.
4. Upload the image.

Dialogue requests its line's expression and falls back to `neutral`. This means an upload assigned as **Clara Bell · mad · expression** can be selected automatically whenever Clara speaks with that state.

## Avatar layers

Use one transparent canvas size for every interchangeable avatar part. Do not trim individual layers differently. Keep the body, face, eyes, hair, clothes, and accessories aligned to the same origin.

Layer order is:

1. Hair back
2. Base
3. Body
4. Face
5. Expression
6. Outfit
7. Shoes
8. Hair front
9. Accessory

The portal also provides percentage-based horizontal and vertical nudging, scale controls, depth controls, visibility, and removal.

## Dorm furniture and tiny objects

Choose **Furniture → Dorm Room**. Use:

- `background` for wallpaper, flooring, or a full-room base;
- `furniture` for beds, desks, wardrobes, chairs, rugs, and shelves;
- `foreground` for Toca-style tiny objects such as mirrors, brushes, letters, ribbons, perfume, cups, books, jewellery dishes, shoes, and pressed flowers.

Every object stays independent. Upload each object on a transparent canvas, then position, scale, and reorder it inside the portal.

## Locations

Choose **Location**, select the room, and assign either a replacement `background` or a transparent `foreground` overlay. Existing placeholder art remains whenever no replacement is assigned.

## File storage

Imported images are copied into the app's durable document directory. Deleting the original from Files or Photos will not break the assignment. Removing or reinstalling the entire app can erase local artwork, so keep the original art files backed up.
