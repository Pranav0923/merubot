const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

console.log("=================================");
console.log("CHECKING GEMINI API KEY");
console.log("=================================");

if (!process.env.GEMINI_API_KEY) {
  console.log("❌ GEMINI_API_KEY NOT FOUND");
  process.exit(1);
}

console.log(
  "KEY STARTS WITH:",
  process.env.GEMINI_API_KEY.substring(0, 10)
);

async function run() {
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    console.log("Sending test request...");

    const result = await model.generateContent(
      "Say Hello in one sentence."
    );

    const response = result.response.text();

    console.log("=================================");
    console.log("SUCCESS");
    console.log("=================================");
    console.log(response);

  } catch (error) {

    console.log("=================================");
    console.log("FULL ERROR");
    console.log("=================================");

    console.log(error);

    if (error.response) {
      console.log("Response Data:");
      console.log(error.response.data);
    }
  }
}

run();