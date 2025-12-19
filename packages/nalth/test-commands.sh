#!/bin/bash

# NALTH v2.2.0 Command Validation Script
# Tests all new commands to ensure they work correctly

set -e

echo "🧪 Testing NALTH v2.2.0 Commands"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function
test_command() {
    local cmd=$1
    local description=$2
    echo -n "Testing: $description... "
    
    if eval "$cmd" &> /dev/null; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((TESTS_FAILED++))
    fi
}

# Build the package first
echo "📦 Building Nalth package..."
npm run build || {
    echo -e "${RED}Failed to build package${NC}"
    exit 1
}
echo ""

# Test help commands
echo "📋 Testing Help Commands"
echo "------------------------"
test_command "node bin/nalth.js --help" "nalth --help"
test_command "node bin/nalth.js test --help" "nalth test --help"
test_command "node bin/nalth.js lint --help" "nalth lint --help"
test_command "node bin/nalth.js fmt --help" "nalth fmt --help"
test_command "node bin/nalth.js run --help" "nalth run --help"
test_command "node bin/nalth.js lib --help" "nalth lib --help"
test_command "node bin/nalth.js install --help" "nalth install --help"
test_command "node bin/nalth.js audit --help" "nalth audit --help"
echo ""

# Test version command
echo "📋 Testing Version Command"
echo "------------------------"
test_command "node bin/nalth.js --version" "nalth --version"
echo ""

# Test init commands
echo "📋 Testing Init Commands"
echo "------------------------"
# Create a temporary test directory
TEST_DIR=$(mktemp -d)
cd "$TEST_DIR"

# Initialize a minimal package.json
echo '{"name":"test-project","version":"1.0.0"}' > package.json

test_command "node $OLDPWD/bin/nalth.js test:init" "nalth test:init"
test_command "node $OLDPWD/bin/nalth.js lint:init" "nalth lint:init"
test_command "node $OLDPWD/bin/nalth.js fmt:init" "nalth fmt:init"
test_command "node $OLDPWD/bin/nalth.js run:init" "nalth run:init"
test_command "node $OLDPWD/bin/nalth.js lib:init" "nalth lib:init"

cd "$OLDPWD"
rm -rf "$TEST_DIR"
echo ""

# Test command existence (without execution)
echo "📋 Testing Command Existence"
echo "----------------------------"
COMMANDS=(
    "dev"
    "build"
    "preview"
    "test"
    "lint"
    "fmt"
    "run"
    "ui"
    "lib"
    "install"
    "uninstall"
    "audit"
    "security:report"
    "security:scan"
)

for cmd in "${COMMANDS[@]}"; do
    # Check if command exists in help output
    if node bin/nalth.js --help 2>&1 | grep -q "$cmd"; then
        echo -e "${GREEN}✓${NC} Command '$cmd' is registered"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗${NC} Command '$cmd' is NOT registered"
        ((TESTS_FAILED++))
    fi
done
echo ""

# Summary
echo "================================"
echo "Test Summary"
echo "================================"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
