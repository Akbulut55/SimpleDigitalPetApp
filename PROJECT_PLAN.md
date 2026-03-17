# Digital Pet v2 — Project Plan

## 1. Project Overview

**Digital Pet v2** is a React Native mobile application where users take care of a virtual pet by feeding and playing with it. The app expands the first prototype into a more complete product by adding gamification systems, persistent progress, improved UI/UX, and user-tested refinements.

The goal is to move from a simple classroom prototype to a small but polished mobile product that feels ready for presentation, testing, and GitHub publication.

---

## 2. Product Vision

This project is designed as a lightweight digital pet experience with a simple care-and-reward loop:

- the user interacts with the pet
- the pet’s stats change
- the user gains progress
- levels and achievements create motivation
- the app saves progress locally
- the interface reacts visually to the pet’s condition

The final app should feel clear, interactive, and intentional rather than just technically functional.

---

## 3. Main Objective

Transform the phase 1 digital pet prototype into a product-style mobile application with:

- a clear gameplay loop
- gamification features
- local data persistence
- improved UI/UX
- reusable component structure
- user feedback integration
- GitHub-ready documentation
- APK packaging
- short promotional video

---

## 4. Core Concept

The user takes care of a digital pet by using simple actions such as **Feed** and **Play**.

Each action affects the pet’s internal state:

- **hunger**
- **happiness**

The app then builds progression on top of this through:

- **XP**
- **leveling**
- **achievements**
- **visual mood changes**

This creates a loop where the user is rewarded for maintaining the pet in a good condition.

---

## 5. Scope

### Included in v2
- pet name and species
- hunger and happiness stats
- Feed and Play actions
- XP system
- level system
- achievements
- dynamic emoji and mood feedback
- dynamic UI styling based on state
- persistent local storage
- reset progress action
- improved layout and visual design

### Not included in v2
- backend
- authentication
- online leaderboard
- cloud save
- multiplayer features
- multiple screens with complex navigation
- advanced animation systems
- monetization systems

The project should remain small, focused, and realistic for the assignment scope.

---

## 6. Target Features

## 6.1 Base Features
These features come from the first version and remain part of the app:

- display pet name
- display pet species
- display hunger value
- display happiness value
- allow feeding the pet
- allow playing with the pet
- keep values within valid limits

## 6.2 Gamification Features
The second version adds product-style progression:

- XP points earned from actions
- level progression based on XP
- achievement unlock system
- mood-based emoji changes
- mood-based card or background color changes
- progress persistence across app restarts

## 6.3 Quality Features
To make the app feel more complete:

- clean visual hierarchy
- better spacing and layout
- responsive action buttons
- reset progress button
- reusable components
- clearer code organization

---

## 7. Gameplay and Progression Design

## 7.1 Pet Stats
The pet has two core stats:

- **Hunger**: value between `0` and `100`
- **Happiness**: value between `0` and `100`

Rules:
- lower hunger is better
- higher happiness is better
- values must never go below `0`
- values must never go above `100`

## 7.2 Actions

### Feed
Effects:
- decreases hunger
- slightly increases happiness
- gives a small amount of XP

Example:
- hunger `-10`
- happiness `+5`
- XP `+5`

### Play
Effects:
- increases happiness
- slightly increases hunger
- gives more XP than Feed

Example:
- happiness `+10`
- hunger `+5`
- XP `+10`

This creates a simple tradeoff and makes the interaction loop more interesting.

## 7.3 XP System
The player earns XP through pet care actions.

Example:
- Feed gives `5 XP`
- Play gives `10 XP`

XP should accumulate continuously.

## 7.4 Level System
The level should be derived from XP rather than manually stored unless needed for display.

Recommended formula:

- `level = Math.floor(xp / 100) + 1`

Example:
- `0–99 XP` → Level 1
- `100–199 XP` → Level 2
- `200–299 XP` → Level 3

This keeps progression simple and predictable.

---

## 8. Mood System

The pet’s mood should be derived from its stat values.

Suggested moods:
- Very Happy
- Normal
- Hungry
- Sad
- Needs Attention

Suggested logic:
- if hunger is very high → Hungry
- if happiness is very high → Very Happy
- if happiness is very low → Sad
- otherwise → Normal

The mood should influence:
- pet emoji
- mood text
- card color or accent color

This helps the UI communicate state without forcing the user to read raw numbers only.

---

## 9. Achievement System

The achievement system is one of the main gamification upgrades.

### Target achievements
The app should include approximately 5 achievements:

1. **First Meal**  
   Unlock when the user feeds the pet for the first time.

2. **Play Time**  
   Unlock when the user plays with the pet for the first time.

3. **Level Up**  
   Unlock when the user reaches Level 2.

4. **Happy Pet**  
   Unlock when happiness reaches `100`.

5. **Well Fed**  
   Unlock when hunger stays below `20`.

### Achievement structure
Each achievement should include:
- unique id
- title
- description
- unlocked state

Optional:
- unlocked date/time

### UI behavior
Achievements should be visible in the app as:
- unlocked
- locked

This section should clearly show progression and motivate continued use.

---

## 10. Persistence

The app should persist player progress locally so the pet state remains after the app is closed.

### Data to save
The app should save:

- hunger
- happiness
- XP
- achievement states
- total feed count
- total play count

If level is derived from XP, it does not need to be stored separately.

### Persistence goal
When the user closes and reopens the app:
- previous pet stats should still exist
- achievements should remain unlocked
- XP and level progress should remain intact

### Reset functionality
A **Reset Progress** button should be added to:
- clear saved progress
- return the app to its initial state

This is useful for both testing and product completeness.

---

## 11. UI / UX Goals

The app should feel like a small finished product, not only a code exercise.

## 11.1 Main screen content
The main screen should display:

- app title
- pet emoji/avatar
- pet name
- pet species
- mood text
- hunger value
- happiness value
- XP
- level
- Feed button
- Play button
- achievements section
- reset progress option

## 11.2 Visual design goals
The interface should aim for:

- centered layout
- consistent spacing
- readable typography
- modern card-based design
- visually clear buttons
- state-based colors
- uncluttered information grouping

## 11.3 Interaction goals
User interactions should feel clear and immediate:
- pressing Feed should visibly improve hunger
- pressing Play should visibly improve happiness
- progression should be easy to notice
- visual changes should support the gameplay loop

Optional polish:
- progress bar for XP
- achievement badges
- simple button press feedback

---

## 12. Technical Design

## 12.1 Architecture Goal
The app should be more organized than phase 1 while still staying lightweight.

Suggested folder structure:

```text
src/
  components/
    PetCard.tsx
    StatPanel.tsx
    ActionButtons.tsx
    AchievementList.tsx
    ProgressSection.tsx
  utils/
    gameLogic.ts
    achievements.ts
    storage.ts
  types/
    pet.ts
App.tsx