# Spec Delta: InlineSvg Component

## MODIFIED Requirements

### Requirement: SVG Attribute Extraction

The component SHALL extract and preserve SVG root element attributes.

#### Scenario: ViewBox preservation

- **WHEN** SVG markup includes viewBox attribute
- **THEN** SHALL extract viewBox value from sanitized SVG element
- **AND** SHALL apply viewBox to rendered svg element
- **AND** SHALL maintain original coordinate system

#### Scenario: Dimension attributes

- **WHEN** SVG markup includes width and height
- **THEN** SHALL extract width and height values
- **AND** SHALL apply to rendered svg element
- **AND** values SHALL be available for sizing control

#### Scenario: Stroke and fill attributes

- **WHEN** SVG root element has stroke or fill attributes
- **THEN** SHALL extract and preserve these attributes
- **AND** SHALL apply to rendered svg element
- **AND** SHALL support currentColor value

#### Scenario: Kebab-case to camelCase conversion

- **WHEN** extracting SVG attributes
- **THEN** SHALL convert kebab-case attribute names to camelCase for React
- **AND** stroke-width SHALL become strokeWidth
- **AND** stroke-linecap SHALL become strokeLinecap
- **AND** stroke-linejoin SHALL become strokeLinejoin
- **AND** conversion SHALL use regex:
  `attr.name.replace(/[-:]([a-z])/g, (_, letter) => letter.toUpperCase())`

#### Scenario: Namespace prefix conversion

- **WHEN** extracting XML namespace attributes
- **THEN** SHALL convert colon-separated namespace prefixes to camelCase for
  React
- **AND** xmlns:xlink SHALL become xmlnsXlink
- **AND** xml:lang SHALL become xmlLang
- **AND** xlink:href SHALL become xlinkHref (if on root element)
- **AND** conversion SHALL handle both hyphens and colons with same regex
  pattern

#### Scenario: React compatibility

- **WHEN** all attributes are converted
- **THEN** SHALL produce React-compatible camelCase attribute names
- **AND** SHALL not produce console warnings about invalid DOM properties
- **AND** SHALL maintain attribute values unchanged during conversion
