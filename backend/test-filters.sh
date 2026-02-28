#!/bin/bash

# Dynamic Filters Examples - Test Scripts
# Chạy: bash test-filters.sh

BASE_URL="http://localhost:3000/users/paginated"
TOKEN="YOUR_TOKEN_HERE"

echo "🔧 Testing Dynamic Filters API"
echo "================================"

# Test 1: Basic Pagination
echo ""
echo "Test 1: Basic Pagination"
curl -s -X GET "${BASE_URL}?page=1&limit=10" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Test 2: Simple Search
echo ""
echo "Test 2: Search 'john' in all fields"
curl -s -X GET "${BASE_URL}?search=john" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Test 3: Field-Specific Search
echo ""
echo "Test 3: Search in email field only"
curl -s -X GET "${BASE_URL}?searchField=email&searchValue=gmail" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Test 4: Dynamic Filters - Single field
echo ""
echo "Test 4: Filter by status = active (exact match)"
FILTERS='{"status":"active"}'
ENCODED_FILTERS=$(echo -n "$FILTERS" | jq -sRr @uri)
curl -s -X GET "${BASE_URL}?filters=${ENCODED_FILTERS}" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Test 5: Dynamic Filters - Multiple fields
echo ""
echo "Test 5: Filter by status=active AND role=admin"
FILTERS='{"status":"active","role":"admin"}'
ENCODED_FILTERS=$(echo -n "$FILTERS" | jq -sRr @uri)
curl -s -X GET "${BASE_URL}?filters=${ENCODED_FILTERS}" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Test 6: Filters + Search
echo ""
echo "Test 6: Filter status=active + Search 'john'"
FILTERS='{"status":"active"}'
ENCODED_FILTERS=$(echo -n "$FILTERS" | jq -sRr @uri)
curl -s -X GET "${BASE_URL}?filters=${ENCODED_FILTERS}&search=john" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Test 7: Filters + Search + Pagination + Sort
echo ""
echo "Test 7: Full example - Filter + Search + Page + Sort"
FILTERS='{"status":"active"}'
ENCODED_FILTERS=$(echo -n "$FILTERS" | jq -sRr @uri)
curl -s -X GET "${BASE_URL}?filters=${ENCODED_FILTERS}&search=john&page=1&limit=10&sortBy=createdAt&sortOrder=DESC" \
  -H "Authorization: Bearer ${TOKEN}" | jq

# Test 8: Filter by email (exact)
echo ""
echo "Test 8: Filter by exact email"
FILTERS='{"email":"ngonhathuy6878@gmail.com"}'
ENCODED_FILTERS=$(echo -n "$FILTERS" | jq -sRr @uri)
curl -s -X GET "${BASE_URL}?filters=${ENCODED_FILTERS}" \
  -H "Authorization: Bearer ${TOKEN}" | jq

echo ""
echo "================================"
echo "✅ Tests completed!"
