# Specification: nimbus-tokens-animations

## Overview

Animation tokens provide duration values, easing functions, and pre-composed animation definitions that establish consistent motion and timing throughout the Nimbus design system.

**Parent Spec:** `../nimbus-tokens/spec.md`
**Token Categories:** durations, easings, animations
**Pre-Composed Animations:** spin, ping, pulse, bounce
**Duration Range:** 50ms (fastest) to 2000ms (2s)

## Purpose

This specification defines animation timing, easing curves, and preset animations used for transitions, loading states, and interactive feedback.

## Requirements

### Requirement: Duration Values
The system SHALL provide animation duration tokens.

#### Scenario: Duration scale
- **WHEN** requesting duration
- **THEN** SHALL provide named values: fastest (50ms), faster (100ms), fast (150ms), moderate (200ms), slow (300ms), slower (400ms), slowest (500ms), 1s, 2s

#### Scenario: Duration naming
- **WHEN** tokens are generated
- **THEN** SHALL use semantic naming: durations.fastest, durations.fast, durations.moderate, durations.slow, durations.slowest, durations.1s, durations.2s
- **AND** CSS variables SHALL use kebab-case: --durations-fastest, --durations-fast, etc.
- **AND** TypeScript exports SHALL use PascalCase category: Durations.fastest, Durations.fast, etc.

#### Scenario: Duration outputs
- **WHEN** tokens are output
- **THEN** CSS format SHALL use millisecond units (50ms, 100ms, 1000ms, 2000ms)
- **AND** TypeScript format SHALL use millisecond string values ("50ms", "100ms", "1000ms", "2000ms")
- **AND** Chakra format SHALL wrap values in { value: "50ms" } syntax

#### Scenario: Duration usage guidelines
- **WHEN** components use duration tokens
- **THEN** fastest/faster SHALL be used for micro-interactions (hover, focus)
- **AND** fast/moderate SHALL be used for standard transitions (expand, collapse)
- **AND** slow/slower SHALL be used for deliberate state changes (page transitions)
- **AND** slowest/1s/2s SHALL be used for loading indicators and animations

### Requirement: Easing Functions
The system SHALL provide easing curve definitions.

#### Scenario: Easing values
- **WHEN** requesting easing function
- **THEN** SHALL provide cubic-bezier arrays for: linear, ease-in, ease-out, ease-in-out, ease-in-smooth

#### Scenario: Easing naming
- **WHEN** tokens are generated
- **THEN** SHALL use semantic naming: easings.linear, easings.easeIn, easings.easeOut, easings.easeInOut, easings.easeInSmooth
- **AND** CSS variables SHALL use kebab-case: --easings-linear, --easings-ease-in, etc.
- **AND** TypeScript exports SHALL use PascalCase category: Easings.linear, Easings.easeIn, etc.

#### Scenario: Easing outputs
- **WHEN** tokens are output
- **THEN** CSS format SHALL use cubic-bezier() function notation
- **AND** TypeScript format SHALL use cubic-bezier string values
- **AND** Chakra format SHALL wrap values in { value: "cubic-bezier(...)" } syntax
- **AND** linear SHALL output as "linear" keyword

#### Scenario: Easing definitions
- **WHEN** easing functions are defined
- **THEN** linear SHALL use "linear" keyword
- **AND** ease-in SHALL use cubic-bezier values for acceleration curve
- **AND** ease-out SHALL use cubic-bezier values for deceleration curve
- **AND** ease-in-out SHALL use cubic-bezier values for smooth acceleration/deceleration
- **AND** ease-in-smooth SHALL provide custom curve for enhanced smoothness

### Requirement: Pre-Composed Animations
The system SHALL provide complete animation definitions.

#### Scenario: Animation presets
- **WHEN** requesting animation
- **THEN** SHALL provide: spin, ping, pulse, bounce
- **AND** SHALL compose duration and easing tokens into complete animation strings

#### Scenario: Spin animation
- **WHEN** animations.spin is accessed
- **THEN** SHALL define infinite rotation animation
- **AND** SHALL reference duration token for timing
- **AND** SHALL use linear easing
- **AND** SHALL output as keyframe animation string or reference

#### Scenario: Ping animation
- **WHEN** animations.ping is accessed
- **THEN** SHALL define expanding scale animation
- **AND** SHALL reference duration token for timing
- **AND** SHALL use appropriate easing function
- **AND** SHALL include opacity fade effect

#### Scenario: Pulse animation
- **WHEN** animations.pulse is accessed
- **THEN** SHALL define subtle scale pulsing animation
- **AND** SHALL reference duration token for timing
- **AND** SHALL use appropriate easing function
- **AND** SHALL loop infinitely

#### Scenario: Bounce animation
- **WHEN** animations.bounce is accessed
- **THEN** SHALL define vertical bounce animation
- **AND** SHALL reference duration token for timing
- **AND** SHALL use bounce-style easing curve
- **AND** SHALL loop infinitely

#### Scenario: Animation naming
- **WHEN** animations are generated
- **THEN** SHALL use semantic naming: animations.spin, animations.ping, animations.pulse, animations.bounce
- **AND** CSS variables SHALL use kebab-case: --animations-spin, --animations-ping, etc.
- **AND** TypeScript exports SHALL use PascalCase category: Animations.spin, Animations.ping, etc.

#### Scenario: Animation outputs
- **WHEN** tokens are output
- **THEN** CSS format SHALL generate keyframe definitions and animation shorthand
- **AND** TypeScript format SHALL provide animation string values
- **AND** Chakra format SHALL wrap values compatible with Chakra animation system
- **AND** SHALL include duration, easing, and iteration properties

#### Scenario: Animation token composition
- **WHEN** animation tokens are defined in tokens.json
- **THEN** SHALL reference duration tokens: `{durations.1s}`
- **AND** SHALL reference easing tokens: `{easings.linear}`
- **AND** SHALL compose into complete animation definition
- **AND** SHALL resolve all references during build transformation
