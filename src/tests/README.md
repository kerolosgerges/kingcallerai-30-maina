
# RBAC Test Suite

This comprehensive test suite validates the complete Role-Based Access Control (RBAC) system, including authentication, sub-account management, and team assignment logic.

## Test Structure

### 1. RBAC Tests (`rbac.test.ts`)
- Permission registry validation
- Role hierarchy testing
- Permission template management
- Custom permission creation

### 2. Authentication Tests (`auth.test.ts`)
- User signup flow validation
- Login/logout processes
- Session management
- Input validation

### 3. Sub-Account Tests (`subaccount.test.ts`)
- Sub-account creation logic
- Settings management
- Access control validation
- Owner assignment

### 4. Team Assignment Tests (`team-assignment.test.ts`)
- Team member invitation flow
- Role assignment validation
- Permission inheritance
- Bulk operations

### 5. Integration Tests (`integration.test.ts`)
- Complete user onboarding workflow
- Team building processes
- Permission validation across system
- Error recovery mechanisms

### 6. Auto-Correction Tests (`auto-correct.test.ts`)
- Automatic error detection
- Self-healing test mechanisms
- Performance optimization
- Correction summary reporting

## Running Tests

Since the package.json cannot be modified directly, you'll need to set up test running manually:

### Option 1: Using npm scripts (add these to package.json manually)
```json
{
  "scripts": {
    "test": "vitest",
    "test:rbac": "vitest src/tests/rbac.test.ts",
    "test:auth": "vitest src/tests/auth.test.ts",
    "test:integration": "vitest src/tests/integration.test.ts",
    "test:auto-correct": "vitest src/tests/auto-correct.test.ts",
    "test:all": "vitest src/tests/"
  }
}
```

### Option 2: Direct vitest execution
```bash
npx vitest src/tests/
npx vitest src/tests/rbac.test.ts
npx vitest src/tests/auth.test.ts
```

### Option 3: Using the test runner
```bash
npx tsx src/tests/test-runner.ts
```

## Auto-Correction Features

The test suite includes intelligent auto-correction mechanisms:

1. **Error Detection**: Automatically identifies common failure patterns
2. **Self-Healing**: Applies corrections and re-runs failed tests
3. **Multiple Attempts**: Retries tests up to 3 times with improvements
4. **Comprehensive Reporting**: Provides detailed failure analysis and recommendations

## Test Coverage

### RBAC System
- ✅ Permission validation
- ✅ Role hierarchy enforcement
- ✅ Custom permission templates
- ✅ Resource access control

### Authentication
- ✅ User registration
- ✅ Login validation
- ✅ Session management
- ✅ Security checks

### Sub-Account Management
- ✅ Creation workflows
- ✅ Owner assignment
- ✅ Settings validation
- ✅ Access control

### Team Management
- ✅ Member invitations
- ✅ Role assignments
- ✅ Permission inheritance
- ✅ Bulk operations

### Integration
- ✅ End-to-end workflows
- ✅ Cross-system validation
- ✅ Error recovery
- ✅ Data consistency

## Configuration

The tests use mocked Firebase services to avoid external dependencies. Key configuration:

- **Max Retries**: 3 attempts per test suite
- **Auto-Correction**: Enabled by default
- **Performance Thresholds**: 50ms for critical operations
- **Validation Rules**: Comprehensive input validation

## Expected Outcomes

Running the complete test suite should validate:

1. **Security**: All RBAC rules are properly enforced
2. **Functionality**: All user workflows work correctly
3. **Performance**: Operations complete within acceptable timeframes
4. **Reliability**: System handles errors gracefully
5. **Scalability**: Bulk operations perform efficiently

## Troubleshooting

If tests fail repeatedly:

1. Check the auto-correction logs for specific issues
2. Review the failure report for patterns
3. Manually verify system components
4. Consider adjusting performance thresholds
5. Implement additional validation layers

## Maintenance

- Update test cases when adding new RBAC features
- Adjust performance thresholds based on system requirements
- Extend auto-correction logic for new error types
- Review and update permission templates regularly
