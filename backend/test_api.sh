#!/bin/bash

# Quick API Testing Script
# Run this to test the API with various questions

API_URL="http://127.0.0.1:8000/chat"

echo "=================================="
echo "🤖 FOCALOID API QUICK TEST"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1
echo "${BLUE}Test 1: Car Insurance Claim (Nigeria)${NC}"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"question": "How to file a car insurance claim?", "country": "Nigeria"}' | python -m json.tool
echo ""
echo "=================================="
echo ""

# Test 2
echo "${BLUE}Test 2: Health Insurance Documents (Kenya)${NC}"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"question": "What documents are needed for health insurance?", "country": "Kenya"}' | python -m json.tool
echo ""
echo "=================================="
echo ""

# Test 3
echo "${BLUE}Test 3: Basic Insurance Coverage (No Country Filter)${NC}"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"question": "What is covered under basic insurance?"}' | python -m json.tool
echo ""
echo "=================================="
echo ""

# Test 4
echo "${BLUE}Test 4: Policy Renewal (South Africa)${NC}"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I renew my insurance policy?", "country": "South Africa"}' | python -m json.tool
echo ""
echo "=================================="
echo ""

echo "${GREEN}✅ All tests completed!${NC}"


