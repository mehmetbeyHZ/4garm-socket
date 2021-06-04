#include <Servo.h>
int received = 0;
Servo servo, servoDownUp, servoTurnAround;
void setup() {
  servo.attach(2);
  servoDownUp.attach(3);
  servoTurnAround.attach(4);

   servo.write(0);
   servoTurnAround.write(0);
   servoDownUp.write(0);
   Serial.begin(9600);

}

void loop() {
   if(Serial.available() > 0)
    {

      String ReaderFromNode;
      ReaderFromNode = Serial.readString();
      Serial.println(ReaderFromNode.substring(0,ReaderFromNode.length()));
      commandHandler(ReaderFromNode.substring(0,ReaderFromNode.length())); // Convert character to state
    }
    //delay(500);
}


void commandHandler(String command)
{
    int cmdSize = commandSize(command);
    for(int i = 0; i < cmdSize; i++){
      String handleCommand = getValue(command,'!',i);
      commandRouter(handleCommand);
      Serial.println("parsed command:" + handleCommand);
    }
}

void commandRouter(String command) {

   String routeName = getValue(command,':',0);
   int routeValue = getValue(command,':',1).toInt();
   Serial.println(routeName);
   if(routeName == "DOWNUP"){
     servoDownUpHandler(routeValue);
   }

   if(routeName == "FORWARDBACKWARD"){
      servo.write(routeValue);
   }

   if(routeName == "TURNAROUND"){
      servoTurnAround.write(routeValue);
   }

}

void servoDownUpHandler(int value){
  servoDownUp.write(value);
}



int commandSize(String command){
  int found = 0;
  for(int i = 0; i < command.length(); i++){
    char character = command[i];
    if(character == '!'){
      found++;
    }
  }
  return found;

}

String getValue(String data, char separator, int index)
{
    int found = 0;
    int strIndex[] = { 0, -1 };
    int maxIndex = data.length();

    for (int i = 0; i <= maxIndex && found <= index; i++) {
        if (data.charAt(i) == separator || i == maxIndex) {
            found++;
            strIndex[0] = strIndex[1] + 1;
            strIndex[1] = (i == maxIndex) ? i+1 : i;
        }
    }
    return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}