# Specification: Image Component

## Overview

The Image component displays visual content (photographs, illustrations, graphics) with comprehensive support for loading states, fallbacks, responsive images, and accessibility. It provides an optimized, accessible way to render images within the design system.

**Component:** `Image`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 1)
**React Aria:** Not used (non-interactive display component)

## Purpose

Image provides a robust foundation for displaying visual content with automatic fallback handling, lazy loading support, responsive image selection, and comprehensive accessibility features. It enables users to view meaningful visual content while maintaining performance through lazy loading and responsive image delivery, with graceful degradation when images fail to load.

## Requirements

### Requirement: Image Source Display
The component SHALL display images from provided URLs.

#### Scenario: Basic image rendering
- **WHEN** src prop contains valid image URL
- **THEN** SHALL load and display the image
- **AND** SHALL render as img HTML element
- **AND** SHALL maintain aspect ratio by default

#### Scenario: Image without src
- **WHEN** src prop is not provided
- **THEN** SHALL not render img element
- **AND** MAY render fallback content if provided

### Requirement: Alternative Text
The component SHALL require accessible alternative text per nimbus-core and WCAG standards.

#### Scenario: Alt text requirement
- **WHEN** image is rendered
- **THEN** alt prop SHALL be required
- **AND** SHALL provide meaningful description of image content
- **AND** SHALL support screen reader announcements

#### Scenario: Decorative images
- **WHEN** image is purely decorative
- **THEN** alt prop SHALL be empty string (`alt=""`)
- **AND** SHALL signal to assistive technology to skip image
- **AND** SHALL not announce to screen readers

#### Scenario: Complex images
- **WHEN** image conveys complex information (charts, graphs, infographics)
- **THEN** alt text SHALL describe key information conveyed
- **AND** SHALL go beyond simple title or caption
- **AND** MAY reference additional description via aria-describedby

### Requirement: Loading States
The component SHALL manage and display image loading states.

#### Scenario: Loading indicator
- **WHEN** image is loading
- **THEN** SHALL display loading state visual feedback
- **AND** loading indicator SHALL be customizable via loading prop
- **AND** SHALL support loading="eager" or loading="lazy" values

#### Scenario: Loaded state
- **WHEN** image successfully loads
- **THEN** SHALL display loaded image
- **AND** SHALL trigger onLoad callback if provided
- **AND** SHALL remove loading indicator

#### Scenario: Initial state
- **WHEN** component mounts with src
- **THEN** SHALL initialize in loading state
- **AND** SHALL manage state transitions internally
- **AND** SHALL handle browser native loading behavior

### Requirement: Error Handling and Fallback
The component SHALL handle image loading failures gracefully.

#### Scenario: Image load error
- **WHEN** image fails to load (404, network error, invalid format)
- **THEN** SHALL trigger onError callback if provided
- **AND** SHALL set internal error state
- **AND** SHALL display fallback content

#### Scenario: Fallback image
- **WHEN** image fails to load AND fallbackSrc prop is provided
- **THEN** SHALL attempt to load fallback image
- **AND** SHALL display fallback image if successful
- **AND** SHALL handle fallback image errors gracefully

#### Scenario: Fallback content
- **WHEN** image fails to load AND fallback prop is provided
- **THEN** SHALL render fallback React element
- **AND** fallback content SHALL replace image element
- **AND** SHALL provide visual indication of missing image

#### Scenario: No fallback provided
- **WHEN** image fails to load AND no fallback provided
- **THEN** SHALL render broken image indicator from browser
- **AND** SHALL maintain alt text for accessibility
- **AND** SHALL not throw error

### Requirement: Lazy Loading
The component SHALL support native lazy loading for performance optimization.

#### Scenario: Lazy loading attribute
- **WHEN** loading="lazy" is set
- **THEN** SHALL defer image loading until near viewport
- **AND** SHALL use native browser lazy loading
- **AND** SHALL improve initial page load performance
- **AND** SHALL load image when scrolling into viewport

#### Scenario: Eager loading
- **WHEN** loading="eager" is set (default browser behavior)
- **THEN** SHALL load image immediately
- **AND** SHALL prioritize critical above-the-fold images
- **AND** SHALL not defer loading

#### Scenario: Default loading behavior
- **WHEN** loading prop is not provided
- **THEN** SHALL use browser default loading behavior
- **AND** SHALL typically load eagerly unless browser optimizes

### Requirement: Responsive Image Support
The component SHALL support responsive image selection via srcset and sizes.

#### Scenario: Source set (srcset)
- **WHEN** srcset prop is provided
- **THEN** SHALL define multiple image sources at different resolutions
- **AND** SHALL allow browser to select optimal image based on device pixel density
- **AND** SHALL support width descriptors (e.g., "image-320w.jpg 320w, image-640w.jpg 640w")
- **AND** SHALL support pixel density descriptors (e.g., "image-1x.jpg 1x, image-2x.jpg 2x")

#### Scenario: Sizes attribute
- **WHEN** sizes prop is provided with srcset
- **THEN** SHALL define image display size at different breakpoints
- **AND** SHALL guide browser in selecting appropriate srcset image
- **AND** SHALL support media queries (e.g., "(max-width: 600px) 100vw, 50vw")
- **AND** SHALL optimize bandwidth usage based on viewport

#### Scenario: Responsive without srcset
- **WHEN** responsive sizing needed without srcset
- **THEN** SHALL support width and height props with percentage or viewport units
- **AND** SHALL scale image responsively via CSS
- **AND** SHALL maintain aspect ratio

### Requirement: Aspect Ratio Control
The component SHALL support aspect ratio preservation and control.

#### Scenario: Natural aspect ratio
- **WHEN** image renders without explicit aspect ratio
- **THEN** SHALL maintain image's natural aspect ratio
- **AND** SHALL prevent distortion
- **AND** SHALL use intrinsic width and height

#### Scenario: Explicit aspect ratio
- **WHEN** aspectRatio prop is provided
- **THEN** SHALL enforce specified aspect ratio (e.g., aspectRatio="16/9")
- **AND** SHALL crop or letterbox image as needed with objectFit
- **AND** SHALL prevent layout shift during loading

#### Scenario: Aspect ratio with dimensions
- **WHEN** both width/height and aspectRatio are provided
- **THEN** aspectRatio SHALL take precedence for display
- **AND** width/height SHALL inform browser sizing during load
- **AND** SHALL reduce cumulative layout shift (CLS)

### Requirement: Object Fit Styling
The component SHALL support object-fit CSS property for image sizing within container.

#### Scenario: Cover fit
- **WHEN** objectFit="cover" is set
- **THEN** SHALL scale image to cover entire container
- **AND** SHALL crop image edges if aspect ratios don't match
- **AND** SHALL maintain aspect ratio

#### Scenario: Contain fit
- **WHEN** objectFit="contain" is set
- **THEN** SHALL scale image to fit within container
- **AND** SHALL show full image without cropping
- **AND** SHALL maintain aspect ratio with letterboxing

#### Scenario: Fill fit
- **WHEN** objectFit="fill" is set
- **THEN** SHALL stretch image to fill container
- **AND** MAY distort aspect ratio
- **AND** SHALL not show gaps

#### Scenario: None fit
- **WHEN** objectFit="none" is set
- **THEN** SHALL display image at natural size
- **AND** SHALL crop overflow
- **AND** SHALL not scale image

#### Scenario: Scale-down fit
- **WHEN** objectFit="scale-down" is set
- **THEN** SHALL behave as none or contain, whichever results in smaller image
- **AND** SHALL prevent upscaling beyond natural size

### Requirement: Object Position Styling
The component SHALL support object-position for controlling image alignment within container.

#### Scenario: Position alignment
- **WHEN** objectPosition prop is provided
- **THEN** SHALL position image within container (e.g., "top", "center", "bottom left")
- **AND** SHALL work in conjunction with objectFit
- **AND** SHALL control which part of image is visible when cropped

### Requirement: Border Radius Support
The component SHALL support border radius styling via design tokens.

#### Scenario: Border radius application
- **WHEN** borderRadius prop is provided
- **THEN** SHALL apply rounded corners from design token values
- **AND** SHALL support token values (50, 100, 200, 300, 400, 500, 600, full)
- **AND** SHALL clip image corners to match border radius

### Requirement: Loading Placeholder
The component SHALL support placeholder content during image loading.

#### Scenario: Blur placeholder
- **WHEN** image is loading AND blurDataURL is provided
- **THEN** SHALL display blurred low-resolution placeholder
- **AND** SHALL transition to full image when loaded
- **AND** SHALL improve perceived performance

#### Scenario: Skeleton placeholder
- **WHEN** image is loading AND no blurDataURL provided
- **THEN** MAY display skeleton loading state
- **AND** placeholder SHALL maintain image dimensions
- **AND** SHALL indicate loading in progress

#### Scenario: No placeholder
- **WHEN** no placeholder configuration provided
- **THEN** SHALL show empty space or background color during load
- **AND** SHALL prevent layout shift with explicit dimensions

### Requirement: Fade-in Animation
The component SHALL support smooth fade-in animation on image load.

#### Scenario: Fade-in on load
- **WHEN** image successfully loads
- **THEN** SHALL fade in smoothly with CSS transition
- **AND** animation duration SHALL be configurable
- **AND** SHALL enhance perceived load quality

#### Scenario: No animation
- **WHEN** animation is disabled or not configured
- **THEN** SHALL display image immediately without transition
- **AND** SHALL support instant rendering preference

### Requirement: Cross-Origin Attribute
The component SHALL support CORS configuration for image loading.

#### Scenario: Cross-origin attribute
- **WHEN** crossOrigin prop is provided
- **THEN** SHALL set crossorigin attribute on img element
- **AND** SHALL support "anonymous" or "use-credentials" values
- **AND** SHALL enable CORS requests for canvas manipulation or CSS
- **AND** SHALL allow cross-origin image processing when needed

### Requirement: Decoding Strategy
The component SHALL support image decoding optimization.

#### Scenario: Async decoding
- **WHEN** decoding="async" is set
- **THEN** SHALL decode image off main thread
- **AND** SHALL prevent blocking page rendering
- **AND** SHALL improve initial render performance

#### Scenario: Sync decoding
- **WHEN** decoding="sync" is set
- **THEN** SHALL decode image on main thread before rendering
- **AND** SHALL ensure image is ready when painted
- **AND** MAY block rendering briefly

#### Scenario: Auto decoding
- **WHEN** decoding="auto" is set or not provided
- **THEN** SHALL let browser decide optimal decoding strategy
- **AND** SHALL adapt to browser heuristics

### Requirement: Ref Forwarding
The component SHALL forward refs to the root element per nimbus-core standards.

#### Scenario: Ref forwarding
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to underlying img element
- **AND** SHALL support React.Ref<HTMLImageElement> type
- **AND** SHALL allow parent components to access DOM node

#### Scenario: Ref usage
- **WHEN** parent component uses ref
- **THEN** SHALL provide access to root img element
- **AND** SHALL support imperative operations (focus, measurement)
- **AND** SHALL maintain ref stability across re-renders

### Requirement: Event Handlers
The component SHALL support image lifecycle event handlers.

#### Scenario: onLoad handler
- **WHEN** image successfully loads
- **THEN** SHALL invoke onLoad callback if provided
- **AND** SHALL pass load event to handler
- **AND** SHALL fire after image is decoded and ready to paint

#### Scenario: onError handler
- **WHEN** image fails to load
- **THEN** SHALL invoke onError callback if provided
- **AND** SHALL pass error event to handler
- **AND** SHALL fire before attempting fallback

### Requirement: Recipe-Based Styling
The component SHALL use Chakra UI single-slot recipe per nimbus-core standards.

#### Scenario: Recipe application
- **WHEN** component renders
- **THEN** SHALL apply image recipe from theme/recipes/image.ts
- **AND** recipe SHALL be registered in theme configuration (theme/recipes/index.ts)
- **AND** SHALL use createRecipeContext for Chakra integration

#### Scenario: Base styles
- **WHEN** recipe applies
- **THEN** SHALL apply consistent base styles (display, max-width)
- **AND** SHALL use design tokens for all values
- **AND** SHALL not use hardcoded colors, spacing, or sizing

### Requirement: Custom Styling
The component SHALL accept Chakra style props per nimbus-core standards.

#### Scenario: Style prop override
- **WHEN** style props are provided (width, height, margin, etc.)
- **THEN** SHALL accept all Chakra style props via HTMLChakraProps
- **AND** SHALL apply responsive style values (arrays and objects)
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL merge with recipe styles correctly

#### Scenario: Common style props
- **WHEN** layout props are needed
- **THEN** SHALL support dimension props (width, height, maxWidth, maxHeight)
- **AND** SHALL support margin props (m, mt, mr, mb, ml, mx, my)
- **AND** SHALL support display and positioning props
- **AND** SHALL maintain design system consistency

### Requirement: Semantic HTML Element
The component SHALL use appropriate semantic HTML element.

#### Scenario: Image element
- **WHEN** image renders
- **THEN** SHALL render as HTML img element
- **AND** SHALL be semantically appropriate for image content
- **AND** SHALL provide appropriate document structure

### Requirement: Accessibility Labels
The component SHALL provide accessible labeling per nimbus-core standards.

#### Scenario: Alt text as accessible name
- **WHEN** image is rendered
- **THEN** alt attribute SHALL provide accessible name
- **AND** SHALL be announced by screen readers
- **AND** SHALL describe image purpose or content

#### Scenario: Additional descriptions
- **WHEN** image requires extended description
- **THEN** MAY use aria-describedby to reference detailed description
- **AND** SHALL provide description in associated element
- **AND** SHALL augment alt text with additional context

### Requirement: Testing and Metadata Support
The component SHALL accept data attributes per nimbus-core standards.

#### Scenario: Data attributes
- **WHEN** data-* attributes are provided
- **THEN** SHALL forward all data attributes to root img element
- **AND** SHALL support testing attributes (data-testid)
- **AND** SHALL support custom metadata attributes

#### Scenario: Test queries
- **WHEN** component is tested
- **THEN** SHOULD be queried by alt attribute
- **AND** SHOULD be queried by role="img"
- **AND** SHALL not require data-testid for basic testing

### Requirement: Type Safety
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Props interface
- **WHEN** component is imported
- **THEN** SHALL export ImageProps interface from image.types.ts
- **AND** SHALL include JSDoc comments for all props
- **AND** SHALL extend HTMLChakraProps<"img">

#### Scenario: Recipe props
- **WHEN** component uses recipe
- **THEN** SHALL define ImageRecipeProps type
- **AND** SHALL include UnstyledProp for unstyled variant support

#### Scenario: Required vs optional props
- **WHEN** defining component props
- **THEN** src SHALL be required string
- **AND** alt SHALL be required string
- **AND** loading SHALL be optional ("eager" | "lazy")
- **AND** srcset SHALL be optional string
- **AND** sizes SHALL be optional string
- **AND** crossOrigin SHALL be optional ("anonymous" | "use-credentials")
- **AND** decoding SHALL be optional ("sync" | "async" | "auto")
- **AND** objectFit SHALL be optional ("cover" | "contain" | "fill" | "none" | "scale-down")
- **AND** objectPosition SHALL be optional string
- **AND** fallbackSrc SHALL be optional string
- **AND** fallback SHALL be optional ReactElement
- **AND** onLoad SHALL be optional event handler
- **AND** onError SHALL be optional event handler

### Requirement: Theme Registration
The component recipe SHALL be registered in theme configuration per nimbus-core standards.

#### Scenario: Recipe registration
- **WHEN** component is added to package
- **THEN** recipe SHALL be manually registered in theme/recipes/index.ts
- **AND** SHALL be included in recipes object export: `image: imageRecipe`
- **AND** CRITICAL: registration SHALL not be automatic (no auto-discovery)
- **AND** missing registration SHALL result in unstyled component

#### Scenario: Recipe export
- **WHEN** recipe is defined
- **THEN** SHALL be exported from image.recipe.ts as named export `imageRecipe`
- **AND** SHALL be importable by theme configuration
- **AND** SHALL use defineRecipe from Chakra styled-system

### Requirement: Component Export
The component SHALL be exported from package per nimbus-core standards.

#### Scenario: Component export
- **WHEN** component is added
- **THEN** SHALL be exported from component index.ts: `export { Image }`
- **AND** SHALL be re-exported from package root index.ts
- **AND** SHALL be importable via `import { Image } from "@commercetools/nimbus"`

#### Scenario: Type exports
- **WHEN** component types are defined
- **THEN** SHALL export ImageProps from image.types.ts
- **AND** SHALL re-export from component index.ts: `export type { ImageProps }`
- **AND** SHALL be available for consumer TypeScript usage

### Requirement: Display Name
The component SHALL define a display name per nimbus-core standards.

#### Scenario: Component display name
- **WHEN** component is defined
- **THEN** SHALL set Image.displayName = "Image"
- **AND** SHALL aid debugging and React DevTools inspection
- **AND** SHALL be set immediately after component definition

### Requirement: Performance Optimization
The component SHALL implement performance best practices.

#### Scenario: Layout shift prevention
- **WHEN** image loads
- **THEN** SHALL minimize cumulative layout shift (CLS)
- **AND** SHOULD provide explicit width and height attributes
- **AND** SHALL reserve space before image loads

#### Scenario: Bandwidth optimization
- **WHEN** image is requested
- **THEN** SHALL support responsive image selection via srcset
- **AND** SHALL load appropriate resolution for device and viewport
- **AND** SHALL not waste bandwidth on oversized images

#### Scenario: Render optimization
- **WHEN** image is off-screen
- **THEN** SHALL support lazy loading to defer loading
- **AND** SHALL reduce initial page weight
- **AND** SHALL improve perceived performance

### Requirement: Image Format Support
The component SHALL support modern image formats.

#### Scenario: Format compatibility
- **WHEN** image src is provided
- **THEN** SHALL support JPEG, PNG, GIF, WebP, SVG formats
- **AND** SHALL rely on browser native format support
- **AND** SHALL handle format errors gracefully with fallback

#### Scenario: Format optimization guidance
- **WHEN** selecting image format
- **THEN** JPEG/WebP SHOULD be used for photographs and complex images
- **AND** PNG SHOULD be used for transparency or simple graphics
- **AND** SVG SHOULD be used for logos, icons, and scalable illustrations
- **AND** format choice SHALL prioritize performance and quality

### Requirement: Responsive Behavior
The component SHALL scale correctly across viewport sizes.

#### Scenario: Responsive scaling
- **WHEN** viewport size changes
- **THEN** SHALL scale image appropriately
- **AND** SHALL maintain aspect ratio unless objectFit="fill"
- **AND** SHALL support responsive width/height values

#### Scenario: Responsive source selection
- **WHEN** srcset and sizes are provided
- **THEN** SHALL update image source on viewport resize if needed
- **AND** browser SHALL select optimal image for current conditions
- **AND** SHALL balance quality and performance

### Requirement: Visual Hierarchy
The component SHALL contribute appropriately to page visual hierarchy.

#### Scenario: Hero images
- **WHEN** image is primary content (hero image, product photo)
- **THEN** MAY dominate visual hierarchy
- **AND** SHALL load eagerly with loading="eager"
- **AND** SHALL use high-quality, optimized source

#### Scenario: Supporting images
- **WHEN** image supports or illustrates text content
- **THEN** SHALL contribute to but not dominate hierarchy
- **AND** SHALL maintain appropriate sizing relative to content
- **AND** MAY use lazy loading if below fold

#### Scenario: Decorative images
- **WHEN** image is purely decorative
- **THEN** SHALL use alt="" for accessibility
- **AND** SHALL not convey critical information
- **AND** SHALL enhance visual appeal without functional purpose

### Requirement: Error State Handling
The component SHALL provide clear error indication.

#### Scenario: Visible error state
- **WHEN** image fails to load without fallback
- **THEN** SHALL display browser default broken image indicator
- **AND** SHALL show alt text near indicator
- **AND** SHALL maintain layout with original dimensions if provided

#### Scenario: Graceful degradation
- **WHEN** image fails to load with fallback
- **THEN** SHALL seamlessly transition to fallback content
- **AND** user experience SHALL not be significantly degraded
- **AND** SHALL maintain page usability

### Requirement: Brand Style Consistency
The component SHALL maintain brand style guidelines.

#### Scenario: Brand image consistency
- **WHEN** illustrations or graphics are used
- **THEN** SHALL adhere to established brand style guide
- **AND** SHALL use consistent color palette from design tokens
- **AND** SHALL maintain visual consistency across design system

### Requirement: Contrast Requirements
The component SHALL meet WCAG contrast requirements for text in images.

#### Scenario: Text in images
- **WHEN** image contains critical text
- **THEN** text SHALL meet WCAG contrast standards within image
- **AND** SHALL ensure text readability
- **AND** SHOULD be avoided in favor of HTML text when possible

### Requirement: Loading Strategy Control
The component SHALL provide control over loading behavior.

#### Scenario: Critical images
- **WHEN** image is critical for initial render (hero, logo)
- **THEN** loading="eager" SHOULD be set
- **AND** SHALL prioritize loading
- **AND** SHALL render as soon as possible

#### Scenario: Below-fold images
- **WHEN** image is below viewport initially
- **THEN** loading="lazy" SHOULD be set
- **AND** SHALL defer loading until scrolling approaches
- **AND** SHALL improve initial page load time

### Requirement: Image Dimensions
The component SHALL support explicit dimension attributes.

#### Scenario: Width and height attributes
- **WHEN** image dimensions are known
- **THEN** width and height attributes SHOULD be provided
- **AND** SHALL inform browser layout before image loads
- **AND** SHALL prevent cumulative layout shift (CLS)
- **AND** values SHALL be in pixels (intrinsic dimensions)

#### Scenario: Responsive dimensions
- **WHEN** image needs responsive sizing
- **THEN** width/height attributes SHALL provide intrinsic size
- **AND** CSS styles SHALL control display size
- **AND** SHALL maintain aspect ratio in responsive layouts

### Requirement: Maximum Width Constraint
The component SHALL support maximum width limitations.

#### Scenario: Max-width constraint
- **WHEN** maxWidth prop is provided
- **THEN** SHALL limit image width to specified value
- **AND** SHALL prevent image from exceeding container
- **AND** SHALL use design token values when possible
- **AND** SHALL scale proportionally with height: auto
