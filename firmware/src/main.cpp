#include <Arduino.h>
#include <Ultrasonic.h>
#include <ESP8266Wifi.h>
#include <ESP8266HTTPClient.h>
#include <config.h>

const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;
const char* device_id = DEVICE_ID;
const char* server_ip = SERVER_IP;

Ultrasonic WasteLevel(D6, D5);
const unsigned long postInterval = 300000; // 5 minutes
const int significantChangeThreshold = 10;  // 10 cm

unsigned long lastPostTime = 0;
long lastDistance = -1;

void connectDevice();
void postSensorData(long distance);

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  connectDevice();
  Serial.println("Setup complete");
  digitalWrite(LED_BUILTIN, HIGH);
}

void loop() {
  unsigned long currentTime = millis();
  long distance = WasteLevel.read();
  Serial.println("Level: " + String(100 - distance) + " cm");

  // Check for significant change
  if (lastDistance == -1 || abs(distance - lastDistance) > significantChangeThreshold) {
    Serial.println("Significant change detected, posting sensor data..");
    postSensorData(distance);
    lastDistance = distance;
    lastPostTime = currentTime;
  } else {
    // Regular interval posting
    if (currentTime - lastPostTime >= postInterval) {
      Serial.println("Interval reached, posting sensor data..");
      postSensorData(distance);
      lastDistance = distance;
      lastPostTime = currentTime;
    }
  }
  delay(1000);
}

void connectDevice() {
  bool connected = false;
  while (!connected) {
    WiFiClient client;
    HTTPClient http;

    String connectUrl = "http://" + String(server_ip) + ":3001/connect/" + String(device_id);
    http.begin(client, connectUrl);
    int httpCode = http.GET();

    if (httpCode == HTTP_CODE_OK) {
      Serial.println("Device connected successfully");
      connected = true;
    } else if (httpCode == HTTP_CODE_NOT_FOUND) {
      Serial.println("Device not found, attempting to register...");

      String postUrl = "http://" + String(server_ip) + ":3001/trash";
      http.begin(client, postUrl);
      http.addHeader("Content-Type", "application/json");

      String payload = "{\"device_id\":\"" + String(device_id) + "\"}";
      httpCode = http.POST(payload);

      if (httpCode == HTTP_CODE_OK) {
        Serial.println("Device registered successfully");
        connected = true;
      } else if (httpCode == HTTP_CODE_BAD_REQUEST) {
        Serial.println("Device already registered, retrying connection...");
      } else {
        Serial.println("Failed to register device, retrying...");
      }
      delay(1000);
    } else {
      Serial.println("Failed to connect device, retrying...");
      delay(1000);
    }

    http.end();
  }
}

void postSensorData(long distance) {
  digitalWrite(LED_BUILTIN, LOW);
  WiFiClient client;
  HTTPClient http;

  String postUrl = "http://" + String(server_ip) + ":3001/trash-level";
  http.begin(client, postUrl);
  http.addHeader("Content-Type", "application/json");

  String payload = "{\"trash_id\":\"" + String(device_id) + "\", \"trash_level\":" + String(distance) + "}";

  int httpCode = http.POST(payload);

  if (httpCode == HTTP_CODE_OK) {
    Serial.println("Sensor data posted successfully");
  } else {
    Serial.println("Failed to post sensor data");
    delay(5000);
  }

  http.end();
  digitalWrite(LED_BUILTIN, HIGH);
}
