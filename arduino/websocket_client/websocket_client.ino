#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
#include <WS2812FX.h>

// WIFI INFO
const char* ssid     = "BOX-DE-VALY";
const char* password = "BIENVENUECHEZVALY";

// TIMER
unsigned int  ledsEffectDuration = 0;

// LEDS
#define LED_PIN 2                       // 0 = GPIO0, 2=GPIO2
#define LED_COUNT 50

WS2812FX ws2812fx = WS2812FX(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

// WEBSOCKET
const char* websockets_server = "ws://8fa403b344c3.ngrok.io"; //server adress and port
using namespace websockets;
WebsocketsClient client;
bool isDisconnected = false;


void setup() {
    Serial.begin(115200);
    connectWifi();
    initLeds();
}

void loop() {
    ws2812fx.service();
    client.poll();
    stopLedsAfterDelay();
    reconnectToServer();
}


void connectToServer() {
  // Connect to server
  client.connect(websockets_server);

  // Send a message
  client.send("Hi Server!");
  // Send a ping
  client.ping();
}

void connectWifi() {
   WiFi.begin(ssid, password);

  while(WiFi.status() != WL_CONNECTED) {
     Serial.print(".");
     delay(200);
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  delay(500);

  Serial.println("Connecting to Server");
  // Setup Callbacks
  client.onMessage(onMessageCallback);
  client.onEvent(onEventsCallback);
  
  connectToServer();
}


void reconnectToServer() {
  if (isDisconnected == true) {
      Serial.print("Reconnecting....");
      connectToServer();
  }
}

void initLeds() {
  ws2812fx.init();
  ws2812fx.setBrightness(80);
  ws2812fx.setSpeed(300);
  ws2812fx.start();
}

void stopLedsAfterDelay() {
  if (ledsEffectDuration > 0) {
    if (millis() >= ledsEffectDuration) {
       Serial.println("STOP EFFECT");
       ledsEffectDuration = 0;
       ws2812fx.stop();
     }
  }
}


void updateLed(int ledModeId, int duration){
 Serial.println("START EFFECT");
 ws2812fx.start();
 ws2812fx.setSegment(0, 0, LED_COUNT - 1, ledModeId, BLACK, 2000, NO_OPTIONS);
 ledsEffectDuration = millis() + duration;
}


void onMessageCallback(WebsocketsMessage message) {
   String data = message.data();

   Serial.print("Got Message: ");
   Serial.println(data);
    String ledMode = getParametersFromMessage(data, 0);
    String duration = getParametersFromMessage(data, 1);

    Serial.print("ledMode: ");
    Serial.println(ledMode);
    Serial.print("duration: ");
    Serial.println(duration);
    updateLed(ledMode.toInt(), duration.toInt());
}

void onEventsCallback(WebsocketsEvent event, String data) {
    if(event == WebsocketsEvent::ConnectionOpened) {
        isDisconnected = false;
        Serial.println("Connnection Opened");
    } else if(event == WebsocketsEvent::ConnectionClosed) {
        isDisconnected = true;
        Serial.println("Connnection Closed");
    } else if(event == WebsocketsEvent::GotPing) {
        Serial.println("Got a Ping!");
    } else if(event == WebsocketsEvent::GotPong) {
        Serial.println("Got a Pong!");
    }
}


String getParametersFromMessage(String data, int index)
{
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length()-1;
  char separator = ',';
  for(int i=0; i<=maxIndex && found<=index; i++){
    if(data.charAt(i)==separator || i==maxIndex){
        found++;
        strIndex[0] = strIndex[1]+1;
        strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
  }

  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";
}
