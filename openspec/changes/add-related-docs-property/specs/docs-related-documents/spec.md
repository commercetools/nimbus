## ADDED Requirements

### Requirement: Related Front Matter Property
The system SHALL accept an optional `related` property in the front matter of any MDX document. Its value is a list of document `id` values.

#### Scenario: Property is omitted
- **WHEN** a document has no `related` property
- **THEN** the parsed document SHALL have an empty `related` list
- **AND** the document SHALL be valid

#### Scenario: Property lists ids
- **WHEN** a document sets `related: [Components-SkeletonText]`
- **THEN** the parsed document SHALL keep the ids in the written order

#### Scenario: Property on a non-component page
- **WHEN** a document without `exportName` sets `related`
- **THEN** the document SHALL be valid

### Requirement: Related Id Validation
The build SHALL stop with an error when a `related` entry is not the `id` of an existing document.

#### Scenario: Unknown id
- **WHEN** a document lists an id that no document has
- **THEN** the build SHALL fail
- **AND** the error message SHALL name the file and the unknown id
- **AND** the build SHALL fail even when `validation.strict` is not set

#### Scenario: All ids exist
- **WHEN** every listed id belongs to an existing document
- **THEN** the build SHALL NOT report a related-id error

### Requirement: Two-Way Related Links
The route manifest SHALL contain, for each document, its own related ids and the ids of documents that list it.

#### Scenario: Reverse link is added
- **WHEN** document A lists B and B does not list A
- **THEN** the manifest entry of B SHALL contain the id of A

#### Scenario: Order of the list
- **WHEN** a document has its own related ids and reverse links
- **THEN** its own ids SHALL come first, in the written order
- **AND** the reverse links SHALL follow, sorted by title

#### Scenario: Duplicates and self-links
- **WHEN** an id appears more than once, or a document lists its own id
- **THEN** the manifest entry SHALL contain each other id once
- **AND** SHALL NOT contain the id of the document itself

### Requirement: Related Documents Section
The docs app SHALL show a "Related components" section at the end of the Overview tab of a document that has related documents.

#### Scenario: Section with cards
- **WHEN** the Overview tab of a document with related ids is shown
- **THEN** the section SHALL appear after the document content
- **AND** SHALL show one illustration card for each related document
- **AND** each card SHALL show the title and description and link to the document

#### Scenario: No related documents
- **WHEN** a document has no related ids
- **THEN** the section SHALL NOT be rendered

#### Scenario: Other tabs
- **WHEN** a tab other than Overview is shown
- **THEN** the section SHALL NOT be rendered
