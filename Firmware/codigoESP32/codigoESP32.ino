#include <WiFi.h>
#include <PubSubClient.h>
#include <Client.h>
#include <ArduinoJson.h>

// Replace the next variables with your SSID/Password combination
const char* ssid = "IzziWiFiN";
const char* password = "JvnS9L3BAZY9";

// Add your MQTT Broker IP address, example:
//const char* mqtt_server = "192.168.1.144";
const char* mqtt_server = "192.168.0.10";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;
int pin_led = 23;
DynamicJsonDocument doc(1024);
void setup() {
  Serial.begin(115200);
  setup_wifi();
  IPAddress ipAddress(192,168,0,18);
  client.setServer(ipAddress, 1883);
  client.setCallback(callback);
  pinMode(pin_led, OUTPUT);
}

void setup_wifi() {
  WiFi.mode(WIFI_STA);
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);  
  WiFi.begin(ssid, password);  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");  
  String messageTemp;
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  deserializeJson(doc, messageTemp);
  Serial.println();
}

void reconnect() {
  // Loop until we're reconnected
  Serial.println("");
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect    
    if (client.connect("MQTT_SERVICE")) {
      Serial.println("connected");
      // Subscribe
      client.subscribe("get/door");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}