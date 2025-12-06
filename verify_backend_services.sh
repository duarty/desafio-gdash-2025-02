#!/bin/bash

API_URL="http://localhost:3000"
EMAIL="test_backend_$(date +%s)@example.com" # Unique email to avoid conflicts
PASSWORD="password123"

echo "---------------------------------------------------"
echo "Backend Verification Script"
echo "API URL: $API_URL"
echo "Test Email: $EMAIL"
echo "---------------------------------------------------"

# 1. Register User
echo -e "\n[1] Registering User..."
REGISTER_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/users" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Test User\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

HTTP_STATUS=$(echo "$REGISTER_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$REGISTER_RESPONSE" | grep -v "HTTP_STATUS")

if [ "$HTTP_STATUS" -eq 201 ] || [ "$HTTP_STATUS" -eq 200 ]; then
  echo "✅ Registration Successful (Status: $HTTP_STATUS)"
else
  echo "❌ Registration Failed (Status: $HTTP_STATUS)"
  echo "Response: $BODY"
  exit 1
fi

# 2. Login
echo -e "\n[2] Logging In..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

# Extract Token (Simple grep/cut to avoid jq dependency if missing)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ Login Successful"
  echo "Token: ${TOKEN:0:20}..."
else
  echo "❌ Login Failed"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

# 3. Get Users (Protected)
echo -e "\n[3] Accessing Protected Endpoint (GET /users)..."
USERS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN")

HTTP_STATUS=$(echo "$USERS_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$USERS_RESPONSE" | grep -v "HTTP_STATUS")

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "✅ Access Granted (Status: $HTTP_STATUS)"
  echo "Users Found: $(echo $BODY | grep -o '"_id"' | wc -l)"
else
  echo "❌ Access Denied (Status: $HTTP_STATUS)"
  echo "Response: $BODY"
fi

# 4. Get Weather (Protected)
echo -e "\n[4] Accessing Protected Endpoint (GET /weather)..."
WEATHER_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$API_URL/weather" \
  -H "Authorization: Bearer $TOKEN")

HTTP_STATUS=$(echo "$WEATHER_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$WEATHER_RESPONSE" | grep -v "HTTP_STATUS")

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "✅ Access Granted (Status: $HTTP_STATUS)"
  echo "Weather Logs Found: $(echo $BODY | grep -o '"_id"' | wc -l)"
else
  echo "❌ Access Denied (Status: $HTTP_STATUS)"
  echo "Response: $BODY"
fi

# 5. Create Weather Log
echo -e "\n[5] Creating Weather Log..."
CREATE_WEATHER_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/weather" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -23.5505,
    "longitude": -46.6333,
    "timestamp": "2023-10-27T10:00:00Z",
    "temperature": 25.5,
    "humidity": 60,
    "wind_speed": 15.5,
    "cloud_cover": 20,
    "shortwave_radiation": 500,
    "condition": "Sunny"
  }')

HTTP_STATUS=$(echo "$CREATE_WEATHER_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$CREATE_WEATHER_RESPONSE" | grep -v "HTTP_STATUS")

if [ "$HTTP_STATUS" -eq 201 ]; then
  echo "✅ Weather Log Created (Status: $HTTP_STATUS)"
  # Check if windSpeed is present in response
  if echo "$BODY" | grep -q '"windSpeed":15.5'; then
    echo "✅ windSpeed correctly returned"
  else
    echo "❌ windSpeed missing or incorrect in response"
    echo "Response: $BODY"
    exit 1
  fi
else
  echo "❌ Failed to Create Weather Log (Status: $HTTP_STATUS)"
  echo "Response: $BODY"
  exit 1
fi

echo -e "\n---------------------------------------------------"
echo "Verification Complete"
echo "---------------------------------------------------"
