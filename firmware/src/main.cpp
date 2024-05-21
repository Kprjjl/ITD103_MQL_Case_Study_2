#include <Arduino.h>
#include <Ultrasonic.h>
#include <ESP8266Wifi.h>
#include <ESP8266HTTPClient.h>
#include <config.h>

const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;

#define bin_depth 13

Ultrasonic WasteLevel(D6, D5);

void setup() {
  Serial.begin(9600);

  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    Serial.println("Attempting to connect to the server...");

    http.begin(client, "http://192.168.1.11:3001/");

    int httpCode = http.GET();

    if (httpCode > 0) {
      Serial.printf("[HTTP] GET... code: %d\n", httpCode);

      if (httpCode == HTTP_CODE_OK) {
        String payload = http.getString();
        Serial.println("Received payload:");
        Serial.println(payload);
      }
    } else {
      Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }

  delay(10000);
}
