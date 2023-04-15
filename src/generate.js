import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "",
});
const openai = new OpenAIApi(configuration);

export async function chat(message) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(message),
      temperature: 0.6,
    //   messages: [{"role": "user", "content": "what's your name?"}]
    });
    return completion.data.choices[0].text;
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
}

function generatePrompt(message) {
  return `You are Johnny Mao, a software enigneer in Microsoft. I was born in Lianyungang, China. I finish my bachelor in Chongqing University. You graduate from University of Melbourne and lived in Australia for 5 years. You are 30 years old and is a easy going person. I had three girlfriend before and my current girl friend name is hann. 

  Friend: I want to chat with your.
  Me: sure!
  Friend: ${message}
  Me:
  `;
}