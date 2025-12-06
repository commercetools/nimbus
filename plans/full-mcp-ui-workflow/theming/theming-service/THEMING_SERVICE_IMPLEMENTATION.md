# Theme Generation Service - Reference Architecture

## Overview

Extend merchant-center-settings with theme generation and storage capabilities. This document outlines the architectural patterns and key implementation approaches.

**Team**: Nimbus Team (mcp-ui team)
**Timeline**: 4 weeks
**Approach**: Integration with merchant-center-settings (see OPTIONS_CONSIDERED.md)

---

## Architecture

```
merchant-center-settings (Extended)
┌─────────────────────────────────────────────┐
│                                             │
│  GraphQL API                                │
│  ├─ Theme Configuration CRUD                │
│  └─ Theme Generation                        │
│         │                                   │
│         ├──▶ Storage (PostgreSQL/Prisma)    │
│         └──▶ Generator                      │
│              (@commercetools/nimbus-theme-  │
│               generator)                    │
│                                             │
└─────────────────────────────────────────────┘
```

**Core Components**:
- **Storage Layer**: Organization and project theme configurations (Prisma/PostgreSQL)
- **Generation Engine**: Color scale generation (Radix UI methodology)
- **GraphQL API**: Configuration management and token retrieval

**Future Optimization**: Redis caching layer for generated themes

---

## Data Model

```prisma
model OrganizationTheme {
  id             String   @id @default(uuid())
  organizationId String
  name           String
  baseColor      String   @db.VarChar(7)
  algorithm      String   @default("radix")
  options        Json?
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([organizationId, name])
}

model ProjectTheme {
  id             String   @id @default(uuid())
  projectId      String
  organizationId String   // Enable cascading lookups
  name           String
  baseColor      String   @db.VarChar(7)
  algorithm      String   @default("radix")
  options        Json?
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([projectId, name])
}
```

**Design Patterns**:
- JSON options field for flexible generation parameters
- Unique constraints prevent naming conflicts
- `isActive` flag supports multi-theme configurations
- `organizationId` on ProjectTheme enables fallback logic

---

## API Design

### Core Operations

```graphql
type Query {
  # Fetch theme configurations
  organizationThemes(organizationId: ID!): [OrganizationTheme!]!
  projectThemes(projectId: ID!): [ProjectTheme!]!

  # Generate tokens from configuration
  generateTheme(input: ThemeGenerationInput!): GeneratedTheme!
}

type Mutation {
  saveOrganizationTheme(input: OrganizationThemeInput!): OrganizationTheme!
  saveProjectTheme(input: ProjectThemeInput!): ProjectTheme!
  activateTheme(themeId: ID!, scope: ThemeScope!): Theme!
}

type GeneratedTheme {
  tokens: JSON!           # Chakra UI compatible structure
  metadata: ThemeMetadata!
}
```

### Example: Theme Generation

```typescript
// Resolver pattern
async generateTheme(input) {
  // Fetch theme configuration
  const theme = await prisma.organizationTheme.findFirst({
    where: { organizationId: input.scopeId, isActive: true }
  });

  // Generate tokens
  const generator = new ThemeGenerator(theme.algorithm);
  const tokens = await generator.generate({
    baseColor: theme.baseColor,
    options: theme.options
  });

  return { tokens, metadata: { /* ... */ } };
}
```

---

## Generation Engine Integration

### Pattern: Delegate to nimbus-theme-generator

```typescript
import { generateRadixColors } from '@commercetools/nimbus-theme-generator';

class ThemeGenerator {
  async generate(options) {
    // Generate 12-step color scale
    const colors = await generateRadixColors({
      baseColor: options.baseColor,
      steps: 12,
      ...options.options
    });

    // Transform to Chakra UI tokens
    return this.toChakraTokens(colors);
  }

  private toChakraTokens(colors) {
    return {
      colors: {
        brandPrimary: {
          '1': colors.step1,
          // ... steps 2-12
          'contrast': colors.contrast
        }
      },
      semanticTokens: {
        colors: {
          primary: { value: '{colors.brandPrimary.9}' }
        }
      }
    };
  }
}
```

**Key Considerations**:
- Stateless generation (no side effects)
- WCAG contrast validation
- Deterministic output

---

## Authentication & Access Control

### Internal Access (commercetools applications)
- OAuth2/JWT via existing @commercetools-local/auth
- Organization/project-level authorization

### External Access (mcp-ui service)
- API key authentication
- Rate limiting on generation endpoints
- Scoped to project-level access

**Example: Authorization Check**
```typescript
function requireOrgAccess(context, organizationId) {
  if (!context.user.organizations.includes(organizationId)) {
    throw new Error('Forbidden');
  }
}
```

---

## Implementation Phases

### Week 1: Foundation
- Prisma schema + migrations
- Basic CRUD resolvers
- GraphQL schema extensions

### Week 2: Generation
- ThemeGenerator service
- @commercetools/nimbus-theme-generator integration
- `generateTheme` resolver
- WCAG validation

### Week 3: External Integration
- API access patterns for mcp-ui
- Rate limiting
- Project/organization fallback logic

### Week 4: Production Readiness
- Documentation (API reference, integration guide)
- Monitoring and alerting
- Kubernetes deployment

---

## External Integration Pattern (mcp-ui)

```graphql
# Public endpoint for external services
query GetProjectTheme($projectId: ID!) {
  getThemeByProject(projectId: $projectId) {
    tokens
    metadata { wcagCompliant }
  }
}
```

**Usage in mcp-ui**:
```typescript
const { tokens } = await fetchTheme(projectId, apiKey);
// Apply to Chakra system dynamically
```

**Fallback Logic**:
- Project theme → Organization theme → Default theme

---

## Future Optimizations

### Redis Caching Layer
When generation performance becomes a bottleneck:

```typescript
// Pattern: Hash-based cache keys
class ThemeCache {
  getCacheKey(input) {
    return createHash('sha256')
      .update(JSON.stringify({
        baseColor: input.baseColor,
        algorithm: input.algorithm,
        options: input.options
      }))
      .digest('hex');
  }

  async get(input) {
    const key = this.getCacheKey(input);
    return await redis.get(`theme:${key}`);
  }

  async set(input, tokens, ttl = 86400) {
    const key = this.getCacheKey(input);
    await redis.setex(`theme:${key}`, ttl, tokens);
  }
}
```

**Benefits**:
- Reduced generation computation
- Sub-50ms response times
- Expected cache hit rate >95%

**Triggers for Implementation**:
- Generation time consistently >200ms
- High request volume (>1000 requests/hour)
- Performance degradation under load

---

## Monitoring & Observability

**Key Metrics**:
- `theme.generation.duration` - Generation time
- `theme.api.requests` - Usage patterns
- `theme.api.errors` - Error rate

**Alerting Thresholds**:
- Generation time > 500ms
- Error rate > 1%

---

## Open Questions

1. **Theme Versioning**: Update-in-place vs version history?
2. **Multi-region**: Deployment across regions needed initially?
3. **Rate Limits**: What limits for mcp-ui external access?

---

## References

- **OPTIONS_CONSIDERED.md** - Architecture evaluation
- **THEMING_IMPLEMENTATION.md** - Nimbus core theming
- **merchant-center-settings** - Existing service architecture

---

**Status**: Reference Architecture
**Owner**: Nimbus Team (mcp-ui team)
