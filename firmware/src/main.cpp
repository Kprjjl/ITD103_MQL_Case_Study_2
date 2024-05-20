#include <Arduino.h>
#include <Ultrasonic.h>

#define bin_depth 13

Ultrasonic WasteLevel(D6, D5); // Define pins for the ultrasonic sensor (Trig, Echo)

void setup() {
  Serial.begin(9600); // Initialize serial communication at 9600 baud
}

void loop() {
  // long distance = WasteLevel.read(); // Measure distance in centimeters
  // Serial.print("Current Waste Level: ");
  // Serial.println(distance - bin_depth); // Print the measured distance minus bin depth

  // delay(1000); // Wait for a second before taking another measurement
}
