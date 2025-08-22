
# RBAC & Data Architecture Documentation

## Overview
This document outlines the unified RBAC (Role-Based Access Control) system and data architecture for the platform. It serves as the single source of truth for understanding how permissions, roles, and data storage work.

## Core Principles

### 1. Data Containment
- ALL sub-account related data is stored within sub-account boundaries
- No cross-collection queries required for sub-account operations
- Data locality ensures faster queries and better performance

### 2. Permission Inheritance
- Agency admins have universal access to all sub-accounts
- Sub-account roles are contextual and isolated
- Resource-level permissions for granular control

### 3. Efficient Querying
- Composite indexes for common query patterns
- Denormalized data for fast lookups
- Pre-computed aggregates for dashboard metrics

## Data Structure

### Root Collections
```
/users/{userId}                    // Single source of truth for user profiles
/agencies/{agencyId}               // Agency information
/agencyMembers/{agencyId_userId}   // Agency membership with composite keys
/userAccess/{userId}               // Fast lookup cache for user permissions
/globalSettings/{settingId}        // Platform-wide settings
/invitations/{invitationId}        // Cross-agency invitations
```

### Sub-Account Collections (Fully Contained)
```
/subAccounts/{subAccountId}/
├── // Main sub-account document
├── members/{userId}               // Sub-account members
├── assistants/{assistantId}       // AI assistants
├── contacts/{contactId}           // Contact database
├── campaigns/{campaignId}         // Marketing campaigns
├── workflows/{workflowId}         // Automation workflows
├── phoneNumbers/{phoneId}         // Phone number assignments
├── tools/{toolId}                // Custom tools
├── knowledge/{knowledgeId}        // Knowledge base
├── conversations/{conversationId} // Chat/call logs
├── callLogs/{callLogId}          // Call recordings & transcripts
├── analytics/{date}              // Daily/monthly metrics
├── auditLogs/{logId}             // Activity audit trail
├── settings/{settingType}        // Sub-account specific settings
├── integrations/{integrationId}  // Third-party integrations
├── resourcePermissions/{resourceId} // Resource-level permissions
└── aggregates/{metricType}       // Pre-computed metrics
```

## Role Definitions

### Agency Roles
- `agency_admin`: Full platform control, can access any sub-account
- `agency_user`: Limited agency operations, read-only access

### Sub-Account Roles
- `owner`: Full sub-account control
- `admin`: Administrative operations
- `manager`: Team and content management
- `user`: Content creation and editing
- `viewer`: Read-only access

## Permission System

### Resource Types
- `agency`: Agency-level operations
- `subAccount`: Sub-account management
- `user`: User management
- `assistant`: AI assistant management
- `contact`: Contact database
- `campaign`: Marketing campaigns
- `workflow`: Automation workflows
- `tool`: Custom tools
- `knowledge`: Knowledge base
- `phoneNumber`: Phone number management
- `billing`: Billing and subscriptions
- `settings`: Configuration management
- `analytics`: Reports and metrics
- `audit`: Audit logs

### Action Types
- `create`: Create new resources
- `read`: View resources
- `update`: Modify existing resources
- `delete`: Remove resources
- `manage`: Full control (create, read, update, delete)

## Security Rules Pattern

### Sub-Account Access Helper Functions
```javascript
function hasSubAccountAccess(subAccountId) {
  return isAuthenticated() && (
    isAgencyAdmin() ||
    exists(/databases/$(database)/documents/subAccounts/$(subAccountId)/members/$(getUserId()))
  );
}

function hasSubAccountRole(subAccountId, roles) {
  return isAuthenticated() && (
    isAgencyAdmin() ||
    (exists(/databases/$(database)/documents/subAccounts/$(subAccountId)/members/$(getUserId())) &&
     get(/databases/$(database)/documents/subAccounts/$(subAccountId)/members/$(getUserId())).data.role in roles)
  );
}
```

## Query Patterns

### User's Sub-Accounts
```javascript
// Fast lookup using cache
const userAccessDoc = await getDoc(doc(db, 'userAccess', userId));
const subAccountIds = Object.keys(userAccessDoc.data()?.subAccounts || {});

// Direct query if cache miss
const memberQuery = query(
  collectionGroup(db, 'members'),
  where('userId', '==', userId),
  where('isActive', '==', true)
);
```

### Sub-Account Data
```javascript
// All data within sub-account boundary
const assistants = await getDocs(collection(db, 'subAccounts', subAccountId, 'assistants'));
const contacts = await getDocs(collection(db, 'subAccounts', subAccountId, 'contacts'));
const campaigns = await getDocs(collection(db, 'subAccounts', subAccountId, 'campaigns'));
```

## Migration Strategy

### Phase 1: Structure Update
1. Update Firestore rules for new structure
2. Create migration scripts for existing data
3. Update services to use new paths

### Phase 2: Data Migration
1. Move member data to sub-account subcollections
2. Create user access cache documents
3. Migrate phone numbers to sub-account containers

### Phase 3: Optimization
1. Add composite indexes
2. Implement data aggregation
3. Set up cleanup jobs for old data

## Performance Optimizations

### Indexes Required
```
// Composite indexes for common queries
subAccounts/{subAccountId}/members: [userId, isActive]
subAccounts/{subAccountId}/assistants: [isActive, createdAt]
subAccounts/{subAccountId}/contacts: [tags, createdAt]
subAccounts/{subAccountId}/campaigns: [status, scheduledAt]
```

### Caching Strategy
- User access cache in `/userAccess/{userId}`
- Sub-account aggregates in `/subAccounts/{subAccountId}/aggregates`
- Permission cache with 5-minute TTL

## Best Practices

### For Developers
1. Always check permissions before data operations
2. Use the unified RBAC hooks for permission checks
3. Log all permission changes for audit trail
4. Batch operations within sub-account boundaries
5. Use subcollections for related data

### For Queries
1. Prefer subcollection queries over root-level queries
2. Use composite indexes for multi-field queries
3. Implement pagination for large datasets
4. Cache frequently accessed permission data
5. Use collection groups sparingly

## Troubleshooting

### Common Issues
1. **Permission Denied**: Check user access cache and member documents
2. **Slow Queries**: Verify composite indexes are created
3. **Data Inconsistency**: Use batch writes for related updates
4. **Cache Misses**: Implement cache warming strategies

### Debug Commands
```javascript
// Check user permissions
const userAccess = await getDoc(doc(db, 'userAccess', userId));
console.log('User Access:', userAccess.data());

// Verify sub-account membership
const member = await getDoc(doc(db, 'subAccounts', subAccountId, 'members', userId));
console.log('Member Role:', member.data()?.role);
```

## Future Enhancements

### Planned Features
1. Time-based permissions (temporary access)
2. Resource-level permissions (specific assistant access)
3. Permission templates for bulk assignment
4. Advanced audit queries and reporting
5. Automated permission cleanup

### Scalability Considerations
1. Implement data sharding for large sub-accounts
2. Add read replicas for analytics queries
3. Consider BigQuery export for historical data
4. Implement background jobs for data aggregation

---

**Last Updated**: $(date)
**Version**: 2.0
**Maintainer**: Platform Team

For questions or clarifications, refer to the implementation files in `/src/services/` and `/src/hooks/`.
