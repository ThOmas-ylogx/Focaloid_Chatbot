@echo off
REM Quick API Testing Script for Windows
REM Run this to test the API with various questions

set API_URL=http://127.0.0.1:8000/chat

echo ==================================
echo 🤖 FOCALOID API QUICK TEST
echo ==================================
echo.

echo Test 1: Car Insurance Claim (Nigeria)
curl -X POST %API_URL% -H "Content-Type: application/json" -d "{\"question\": \"How to file a car insurance claim?\", \"country\": \"Nigeria\"}"
echo.
echo ==================================
echo.

echo Test 2: Health Insurance Documents (Kenya)
curl -X POST %API_URL% -H "Content-Type: application/json" -d "{\"question\": \"What documents are needed for health insurance?\", \"country\": \"Kenya\"}"
echo.
echo ==================================
echo.

echo Test 3: Basic Insurance Coverage (No Country Filter)
curl -X POST %API_URL% -H "Content-Type: application/json" -d "{\"question\": \"What is covered under basic insurance?\"}"
echo.
echo ==================================
echo.

echo Test 4: Policy Renewal (South Africa)
curl -X POST %API_URL% -H "Content-Type: application/json" -d "{\"question\": \"How do I renew my insurance policy?\", \"country\": \"South Africa\"}"
echo.
echo ==================================
echo.

echo ✅ All tests completed!
pause


