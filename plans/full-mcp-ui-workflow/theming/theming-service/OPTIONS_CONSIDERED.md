# Theme Generation Service - Architecture Options

## Executive Summary

This document evaluates architectural options for the theme generation service, which will generate Radix-compatible color palettes, store theme configurations at organization/project level, and cache frequently requested themes.

**Recommendation**: Integration with merchant-center-settings (Option 1)

---

## Context and Requirements

### Service Purpose
- Generate Radix-compatible 12-step color scales from base colors
- **Store theme configurations at organization level**
- **Store theme configurations at project level**
- **Cache frequently requested themes** for performance
- Return JSON token structure for Chakra UI
- Target response time: < 200ms
- Support OAuth2/JWT authentication for production

### Key Requirements
1. **Initial Use**: Internal commercetools applications
2. **Future Use**: mcp-ui service for external application rendering
3. **Data Storage**: Persist theme configurations per organization and project
4. **Performance**: Cache generated themes for frequently requested colors
5. **Production**: OAuth2/JWT auth, Kubernetes deployment

### Existing Infrastructure
- **merchant-center-services**: Monorepo with multiple services
- **merchant-center-settings**: GraphQL service for user/org/project settings
  - Tech stack: Apollo Server, Express, PostgreSQL (Prisma), Node 22
  - Auth: OAuth2/JWT via shared packages
  - Already stores organization and project level data
  - Monitoring: Prometheus, custom loggers
  - Deployed in Kubernetes

---

## Option 1: Integration with merchant-center-settings ⭐ **RECOMMENDED**

### Description
Extend the merchant-center-settings service to include theme management capabilities (storage + generation + caching).

### Architectural Approach
```
merchant-center-settings (extended)
├── GraphQL API (Apollo Server)
├── Settings storage (PostgreSQL/Prisma)
│   ├── Organization settings
│   ├── Project settings
│   └── NEW: Theme configurations
│       ├── OrganizationTheme model
│       └── ProjectTheme model
├── NEW: Theme generation logic
│   └── Color generation (@commercetools/nimbus-theme-generator)
└── NEW: Theme caching (Redis or in-memory)
    └── Cache generated color scales
```

### Data Model Example
```prisma
model OrganizationTheme {
  id             String   @id @default(uuid())
  organizationId String
  name           String   // "Primary Brand Theme"
  baseColor      String   // "#FF5733"
  algorithm      String   // "radix" | "hsl" | "oklch"
  options        Json     // Generation options
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([organizationId, name])
}

model ProjectTheme {
  id        String   @id @default(uuid())
  projectId String
  name      String
  baseColor String
  algorithm String
  options   Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([projectId, name])
}
```

### Pros
✅ **Database ready** - PostgreSQL with Prisma already configured
✅ **Organization/Project models exist** - Natural extension of existing schema
✅ **Auth included** - OAuth2/JWT already implemented
✅ **Consistent data model** - Follows existing patterns for org/project data
✅ **Unified API** - Single GraphQL endpoint for all settings including themes
✅ **Shared infrastructure** - Monitoring, logging, error handling included
✅ **K8s deployment ready** - CI/CD pipeline, Docker configs exist
✅ **Team familiarity** - Team knows how to deploy and maintain
✅ **Quick initial development** - Add GraphQL resolvers + Prisma models
✅ **Cohesive domain** - Theme management (storage + generation) is ONE domain
✅ **Cost efficiency** - No new infrastructure needed

### Cons
❌ **Mixed performance profiles** - Generation (CPU-intensive) + storage (I/O-intensive)
❌ **GraphQL overhead** - More complex than REST for simple generation requests
❌ **Coupled deployment** - Theme changes require full settings service deploy
❌ **Scaling granularity** - Can't scale generation separately from storage

### Mitigation Strategies
- **Redis caching** - Offload generation by caching results aggressively
- **Async generation** - Generate themes asynchronously if needed
- **Rate limiting** - Prevent excessive generation requests
- **Horizontal scaling** - K8s can scale pods based on CPU usage

### When to Choose
- **Storage requirement exists** (our case)
- Internal use primarily
- Unified settings API desired
- Team wants minimal infrastructure changes

---

## Option 2: Standalone Service with Database

### Description
Create a new independent service that handles both storage and generation of themes.

### Architectural Approach
```
nimbus-theme-service (new)
├── REST API (Express)
├── Database (PostgreSQL/Prisma)
│   ├── OrganizationTheme model
│   └── ProjectTheme model
├── Color generation engine
└── Cache layer (Redis)
```

### Pros
✅ **Independent scaling** - Scale storage and generation together
✅ **Focused domain** - Service dedicated to theme management
✅ **Technology flexibility** - Can choose REST over GraphQL
✅ **Separate deployment** - Don't affect settings service
✅ **Clear ownership** - Nimbus team owns everything
✅ **External access easier** - Purpose-built for public API

### Cons
❌ **New database setup** - PostgreSQL + Prisma from scratch
❌ **Duplicate infrastructure** - Auth, monitoring, logging all need setup
❌ **Data model duplication** - Organization/Project concepts duplicated
❌ **More DevOps work** - CI/CD, K8s manifests, Docker configs
❌ **Team overhead** - Another service to maintain
❌ **Development time** - Slower initial implementation

### When to Choose
- High request volume for theme generation
- Need independent scaling of generation
- External access is primary use case
- Team comfortable maintaining multiple services

---

## Option 3: Split Storage (Settings) + Generation (Standalone)

### Description
Store theme configurations in merchant-center-settings, but generate color scales in a separate stateless service.

### Architectural Approach
```
merchant-center-settings:
└── Stores theme CONFIGURATIONS (user input)
    ├── OrganizationTheme: { baseColor: "#FF0000" }
    └── ProjectTheme: { baseColor: "#0066CC" }

nimbus-theme-service (stateless):
└── Generates color SCALES (output)
    ├── Input: baseColor + options
    ├── Output: 12-step Radix scale
    └── Redis cache for generated results
```

### Flow
1. User saves theme config → stored in settings service
2. App requests theme → settings returns config
3. Client/App calls theme service with config
4. Theme service generates/caches/returns scales

### Pros
✅ **Clear separation** - Storage vs computation
✅ **Simple theme service** - Stateless generation + cache
✅ **Reuse settings DB** - No new database for configs
✅ **Independent scaling** - Generation can scale separately
✅ **Flexible consumption** - Anyone can call theme service with a config

### Cons
❌ **Two services** - More complexity than single service
❌ **Two API calls** - Client must call both services
❌ **Service coordination** - Settings and theme must stay in sync
❌ **Duplicate auth** - Both services need authentication

### When to Choose
- Want clear separation of concerns
- Expect very high generation load
- Want generation service usable without settings

---

## Option 4: Serverless with Database

### Description
Serverless function that connects to PostgreSQL for storage and generates themes on-demand.

### Architectural Approach
```
AWS Lambda / Vercel Function:
├── Connects to PostgreSQL (RDS)
├── Generates themes
└── Caches in DynamoDB/Redis
```

### Pros
✅ **Auto-scaling** - Scales to zero when unused
✅ **Pay-per-use** - Cost-efficient
✅ **Managed infrastructure** - No K8s management

### Cons
❌ **Database connection challenges** - Cold starts + connection pooling
❌ **Different from existing infrastructure** - Not K8s-based
❌ **Team unfamiliarity** - New deployment paradigm
❌ **Integration complexity** - Harder to integrate with merchant-center auth
❌ **Debugging difficulty** - Serverless debugging is harder

### When to Choose
- Extremely variable traffic
- Team has serverless expertise
- Cost optimization critical
- Database connection management solved

---

## Comparison Matrix

| Criteria | Option 1: Integrated | Option 2: Standalone + DB | Option 3: Split | Option 4: Serverless |
|----------|---------------------|--------------------------|-----------------|---------------------|
| **Setup Complexity** | ✅ Low | ❌ High | ⚠️ Medium | ⚠️ Medium |
| **Database Ready** | ✅ Yes | ❌ No | ⚠️ Partial | ❌ No |
| **Independent Scaling** | ❌ No | ✅ Yes | ⚠️ Generation Only | ✅ Yes |
| **Storage Included** | ✅ Yes | ✅ Yes | ⚠️ Split | ✅ Yes |
| **External Access** | ⚠️ Moderate | ✅ Easy | ✅ Easy | ✅ Easy |
| **Auth Complexity** | ✅ Included | ❌ Must Build | ❌ Must Build x2 | ❌ Must Build |
| **Development Speed** | ✅ Fast | ❌ Slow | ⚠️ Medium | ⚠️ Medium |
| **Operational Cost** | ✅ Low | ❌ High | ⚠️ Medium | ✅ Low |
| **Team Familiarity** | ✅ High | ✅ High | ⚠️ Medium | ❌ Low |
| **Long-term Flexibility** | ⚠️ Medium | ✅ High | ✅ High | ⚠️ Medium |

---

## Recommendation: Option 1 - Integration with merchant-center-settings

### Rationale

With the requirement to **store theme configurations at organization and project level**, **Option 1 (Integration)** becomes the clear choice:

#### 1. Database and Data Models Already Exist
The merchant-center-settings service:
- Already has PostgreSQL with Prisma configured
- Already stores organization and project level data
- Has established patterns for org/project data models
- Adding theme models is a natural extension

#### 2. Cohesive Domain
When you need both storage AND generation, they form a cohesive "Theme Management" domain:
- Store user theme preferences (configurations)
- Generate color scales from those preferences
- Cache generated results for performance
- All related to managing themes

This isn't "mixed concerns" - it's a complete feature set.

#### 3. Fastest Time to Value
- Add Prisma models for themes (~1 day)
- Add GraphQL resolvers for CRUD (~2 days)
- Integrate @commercetools/nimbus-theme-generator (~2 days)
- Add Redis caching (~1 day)
- **Total: ~1 week to working prototype**

Compare to standalone: ~4 weeks (setup DB, auth, monitoring, deployment)

#### 4. Operational Simplicity
- No new service to deploy
- No new database to maintain
- No new auth to implement
- No new monitoring to configure
- Team already knows how to maintain it

#### 5. Consistent API
Users access all settings through one GraphQL API:
- User settings
- Organization settings
- Project settings
- **Theme settings** (new)

Clean, consistent developer experience.

#### 6. Appropriate Scaling
- Theme configurations stored persistently (low volume)
- Generated themes cached aggressively (high hit rate)
- Generation happens on cache miss (infrequent)
- K8s horizontal scaling handles CPU spikes

The CPU-intensive generation is rare (cache misses), so performance concerns are minimal.

#### 7. External Access Path
When mcp-ui needs access:
- Expose settings service through API gateway
- Rate limit theme endpoints appropriately
- Same auth mechanism as other external APIs
- No architectural changes needed

### Implementation Phases

**Phase 1: Storage (Week 1)**
- Add Prisma models for OrganizationTheme and ProjectTheme
- Create GraphQL schema extensions
- Implement CRUD resolvers
- Database migrations

**Phase 2: Generation (Week 2)**
- Integrate @commercetools/nimbus-theme-generator
- Add generation resolver
- Implement generation logic
- Unit tests

**Phase 3: Caching (Week 3)**
- Add Redis for generated theme caching
- Cache key strategy (baseColor + options)
- Cache invalidation on config changes
- Performance testing

**Phase 4: Production (Week 4)**
- Rate limiting for generation endpoints
- Monitoring and alerts
- Documentation
- External access preparation (for mcp-ui)

### Decision Factors Summary

| Factor | Weight | Score (1-5) | Notes |
|--------|--------|-------------|-------|
| Development Speed | High | 5 | Fastest to implement |
| Operational Cost | High | 5 | No new infrastructure |
| Storage Requirement | Critical | 5 | Database already exists |
| External Access | Medium | 3 | Achievable through API gateway |
| Independent Scaling | Low | 2 | Can scale horizontally |
| Team Familiarity | High | 5 | Team knows the service |
| **Total** | | **4.2/5** | **Strong choice** |

---

## Alternative Consideration

If performance becomes an issue (high generation load), we can:

1. **Add read replicas** - Scale database reads
2. **Increase cache TTL** - Keep generated themes longer
3. **Pre-generate** - Generate common themes ahead of time
4. **Extract generation** - Move to standalone service (migration path exists)

Starting with integration provides a clear migration path if needed, without over-engineering upfront.

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-01-XX | Integrated with merchant-center-settings | Storage requirement + fastest implementation |

---

## Next Steps

1. Review with commercetools platform team
2. Create detailed implementation plan (THEMING_SERVICE_IMPLEMENTATION.md)
3. Design Prisma schema for theme models
4. Design GraphQL schema extensions
5. Begin Phase 1 implementation

---

**Document Status**: Final
**Last Updated**: 2025-01-XX
**Decision Owner**: Nimbus Team + Platform Team
