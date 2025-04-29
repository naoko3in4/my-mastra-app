import { weatherAgent } from "./agents/weather";
import 'dotenv/config';
 
async function main() {
  const result = await weatherAgent.generate("What is the weather in Paris, France? If I want to go out in the evening, should I bring an umbrella?");
  console.log("Agent response:", result.text);
}
 
main();