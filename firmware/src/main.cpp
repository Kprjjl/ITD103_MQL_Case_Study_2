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

void setup() {
  Serial.begin(9600);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  bool connected = false;
  while (!connected) {
    WiFiClient client;
    HTTPClient http;

    String connectUrl("http://" + String(server_ip) + ":3001/connect/" + String(device_id));
    http.begin(client, connectUrl);
    int httpCode = http.GET();

    delay(1000);
    
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
      } else {
        Serial.println("Failed to register device, retrying...");
        delay(1000);
      }
    } else {
      Serial.println("Failed to connect device, retrying...");
      delay(1000);
    }

    http.end();
  }

  Serial.println("Setup complete");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

  } else {
    Serial.println("WiFi not connected");
  }

  delay(10000);
}
