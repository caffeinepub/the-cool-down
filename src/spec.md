# Specification

## Summary
**Goal:** Add optional audio cues to guide users through the existing Box Breathing phases during the lockout intervention, without changing timing or lockout behavior.

**Planned changes:**
- Add an in-UI audio toggle on the lockout overlay (OFF by default) with clear English labeling and visible enabled/disabled state.
- Play distinct audio cues at each phase transition (inhale, hold, exhale, hold) while the Intervention UI is active, staying synchronized with the existing 4-second phase cadence.
- Guard audio playback to handle browser autoplay restrictions (require explicit user gesture via the toggle), fail gracefully without repeated console errors, and stop cues immediately when disabled or when lockout ends/unmounts.

**User-visible outcome:** During lockout, users can optionally turn on audio cues that play in sync with the box-breathing cycle; audio is off by default and only plays during the lockout intervention.
