#include <Arduino.h>
#include <Ultrasonic.h>
#include <ESP8266Wifi.h>
#include <ESP8266HTTPClient.h>
#include <config.h>

const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;

#define bin_depth 13

Ultrasonic WasteLevel(D6, D5); // Define pins for the ultrasonic sensor (Trig, Echo)

void setup() {
  Serial.begin(9600); // Initialize serial communication at 9600 baud

  WiFi.begin(ssid, password); // Connect to the WiFi network
  while(WiFi.status() != WL_CONNECTED) { // Wait for the connection to be established
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  // long distance = WasteLevel.read(); // Measure distance in centimeters
  // Serial.print("Current Waste Level: ");
  // Serial.println(distance - bin_depth); // Print the measured distance minus bin depth

  // delay(1000); // Wait for a second before taking another measurement
}
