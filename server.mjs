import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Reusable function to generate content for multiple prompts
async function generateContentForAllPrompts(prompts) {
    const batchedPrompt = prompts.map((prompt, index) => 
        `Test ${index + 1}: ${prompt}`
    ).join('\n\n');

    const fullPrompt = `Please analyze the sentiment of each of the following sentences. For each, determine if it contains Positive, Negative, or Mixed sentiment. Provide your response in the format "TestId - Sentiment".\n\n${batchedPrompt}`;
    console.log(fullPrompt +"\n");
    try {
        const result = await model.generateContent(fullPrompt);
        console.log(result.response.text());
        return result.response.text().trim();
    } catch (error) {
        console.error("Error generating content:", error);
        return "Error occurred during processing";
    }
}

function parseResults(rawResults) {
    const lines = rawResults.split('\n');
    return lines.map(line => {
        const match = line.match(/Test (\d+) - (Positive|Negative|Mixed)/i);
        return match ? { testId: parseInt(match[1]), sentiment: match[2] } : null;
    }).filter(result => result !== null);
}


// Function to match expected and actual results
function matchResponse(expectedResults, actualResults) {
    let passed = 0;
    const total = expectedResults.length;

    actualResults.forEach(result => {
        const expected = expectedResults[result.testId - 1];
        if (expected === result.sentiment) {
            passed++;
        } else {
            console.log(`Test failed at Test ${result.testId}: Expected "${expected}", but got "${result.sentiment}"`);
        }
    });

    console.log(`${passed}/${total} tests passed.`);
}

// Test case for complex sentiment analysis
async function runComplexSentimentTest() {
    const complexPrompts = [
    "I am glad he felt guilty",
    "I know I’m wrong, but it’s hard to admit.",
    "I wish I didn’t love you.",
    "My heart aches with love, but it is a painful, unfulfilled longing.",
    "Love has turned bitter, and I can no longer bear its weight.",
    "I love you, but it feels like all we do is hurt each other, and it’s tearing me apart.",
    "Love used to be something that filled me with joy, but now it only weighs on my heart, leaving me feeling empty and uncertain.",
    "I love you, but this relationship has only shown me the darker sides of love—betrayal, confusion, and hurt that I never thought possible.",
    "Love should be something that brings us closer, but instead, it has pushed us apart, leaving me feeling more alone than I ever have before.",
    "Love has made me feel small and insignificant, like my needs and desires no longer matter, and all that’s left is a hollow shell of what we once shared.",
    "Love has become an emotional battlefield, where my affection for you is constantly at odds with the pain and resentment that have taken root in my heart, leaving me unsure of what to feel anymore.",
    "I want to fix it, but I’m afraid of the outcome.",
    "Guilt gnaws at me, yet I can’t fully embrace responsibility.",
    "I regret what I’ve done, but I also feel too scared to face it head-on.",
    "The guilt pushes me to change, but I can’t shake the fear of failing again.",
    "Though guilt pulls me toward change, it clashes with a lingering resentment I don’t fully understand.",
    "Even though I know I should apologize, I can’t stop feeling scared about what will happen if I do.",
    "While I feel an intense sense of guilt over what I’ve done, there’s also a voice inside me that questions whether I deserve to carry all this blame.",
    "This persistent guilt is both a source of deep remorse and a frustrating reminder of my reluctance to face the full consequences of my actions.",
    "Regret is all I can think about.",
    "The criminal was correctly found guilty of their crimes.",
    "The sadness I feel from my actions has me rethinking my choices.",
    "Guilt suffocates me, leaving no space for hope.",
    "Every time I think about what I did, it fills me with guilt",
    "No matter how much time passes, the regret lingers in my mind",
    "I feel as though my guilt has eroded the foundations of my confidence and peace.",
    "Even when I think I’ve come to terms with my guilt, it resurfaces, stronger than before, and takes me back to the lowest point",
    "The worst part of guilt is not just feeling sorry for what I’ve done but also believing that I’ll never be able to fix the harm I’ve caused.",
    "As much as I try to rationalize my actions, the overwhelming guilt cuts through all reasoning, leaving me with a deep, aching emptiness that words can’t fully capture.",
    "I’m proud of my hard work.",
    "This moment reminds me of my strength.",
    "The verdict was guilty once the criminal admitted their crimes, and justice was served",
    "In this achievement, I find deep fulfillment.",
    "I’m proud of what I’ve done because I worked so hard for it.",
    "Seeing the results of my dedication fills me with a sense of pride and accomplishment.",
    "This moment of success is a powerful reminder of my capacity to overcome challenges.",
    "I never thought I would get here, but now that I have, I can look back on everything I’ve done and feel nothing but pride for how far I’ve come.",
    "Reflecting on this journey, I realize that the pride I feel isn’t just about the result, but about the determination and effort that made it possible.",
    "This success is more than just a goal accomplished; it is a reflection of countless moments of hard work, self-discipline, and an unwavering belief in my ability to overcome challenges.",
    "This pride feels bittersweet.",
    "I triumphed, but at what cost?",
    "I’m proud of my work, yet I can’t ignore its imperfections.",
    "Feeling bad about this reminds me to act with more kindness.",
    "I feel proud of myself, yet there’s a small part of me that doubts I earned it.",
    "This accomplishment makes me happy, though I still wonder if I truly deserve it.",
    "This achievement fills me with joy, but it also stirs a subtle unease about the compromises made along the way.",
    "I feel proud of what I’ve achieved, but at the same time, I wonder if I could have done more or taken a different approach to get here.",
    "Even though I feel proud of my success, there’s a lingering doubt in my mind about whether I could have done things better or handled the process differently.",
    "Pride fills my heart when I think about this achievement, yet there’s a lingering sense of imperfection that keeps me from fully celebrating the moment.",
    "Pride is making me feel alone.",
    "I feel proud, but it’s a heavy kind of pride.",
    "Pride fills me, but it’s tainted with a deep sense of emptiness.",
    "I’m proud, but I can’t help feeling that I’ve lost something important in the process.",
    "I feel guilty for my mistake, but I know it’s an opportunity to grow.",
    "Though I’m proud of my success, it brings a sense of isolation that I didn’t expect.",
    "While I should be reveling in my success, my pride feels tainted by the realization that it has distanced me from the things I once valued most.",
    "Pride should feel like a reward, but instead, it feels like a constant reminder of the pressure I’ve placed on myself and the sacrifices I’ve made along the way.",
    "Even in this moment of pride, I find myself wondering if the success I’ve gained is really worth the isolation I feel and the guilt that comes with knowing I’ve left others behind.",
    "Even as I bask in the glow of my success, the pride I feel is tainted by an overwhelming sense of regret for how much I’ve lost in the pursuit of goals that no longer seem as important.",
    "I envy their success, but it inspires me.",
    "Their progress makes me want to improve.",
    "Their accomplishments ignite a fire in me to work toward my own goals with greater determination.",
    "I envy how far they’ve come, and it gives me the energy to go after what I want.",
    "Even though I feel envy, it inspires me to focus on my own growth and reach higher.",
    "This sense of guilt pushes me to embrace empathy and deeper understanding.",
    "Envy pushes me to improve myself, knowing that their success isn’t a limit, but a reminder of what’s possible with dedication.",
    "I look at how far they’ve come, and although I envy their achievements, I realize that their success only motivates me to keep striving for my own goals.",
    "While I experience envy when I see their success, it only drives me to push harder toward my own goals, knowing that their progress is a sign of what’s possible for me as well.",
    "Their success ignites envy within me, but rather than being a negative emotion, it propels me forward, pushing me to pursue my ambitions with newfound vigor and a clearer sense of purpose.",
    "Their success makes me want more, but I don’t want to lose what I already have.",
    "I envy how far they’ve come, but I’m grateful for my own path.",
    "Though their achievements stir envy within me, it also sparks a desire to continue my own journey, not theirs.",
    "I feel envy when I see what they’ve accomplished, but I know my time will come if I keep working.",
    "I admire their success, but I also find myself questioning whether I’m truly ready for the same kind of recognition and what sacrifices might come with it.",
    "Though I feel envious of their progress, I am aware that envy is a signal for me to grow, rather than an indication of what I lack.",
    "I feel guilty for what I did, but this feeling is driving me to become someone better and more thoughtful.",
    "I feel envious when I think about their success, but I also feel a sense of peace knowing that my own journey is unfolding at the right pace for me.",
    "Even though I feel envious when I think about how far they’ve come, I am also aware that the sacrifices they’ve made may not be ones I’m willing to make, which makes me appreciate my own choices.",
    "Though I experience envy when I see their success, it’s tempered with the understanding that what they’ve done may not be what I want for myself, and my path will unfold in its own time.",
    "I envy them, but it makes me feel bad about myself.",
    "Envy consumes me, but it doesn’t help me get ahead.",
    "Their success makes me feel worthless.",
    "I envy their success, but it just makes me feel bitter about my own life.",
    "I feel envious, but it doesn’t motivate me; instead, it just fills me with resentment.",
    "While I envy their accomplishments, it only intensifies my feelings of self-doubt.",
    "Though I envy what they’ve achieved, it only makes me feel bad about myself, as I’m constantly comparing my life to theirs and coming up short.",
    "The guilt I feel right now is painful, but it’s also a sign that I recognize the impact of my actions and am ready to take the steps needed to improve",
    "I feel envious of their success, but the more I focus on them, the worse I feel about my own life and what I’ve yet to accomplish.",
    "While envy drives me to look at what they’ve accomplished, it also makes me feel like I’m losing out on time and opportunities, fueling a sense of resentment and discontent.",
    "I love you so much.",
    "Love fills my heart with a joy that words cannot fully capture.",
    "The love I feel for you is profound, a constant warmth in my soul.",
    "Love for you makes every day brighter, and it fills my life with joy.",
    "Every time I think of you, my heart fills with warmth, and I feel a deep sense of affection.",
    "Love with you is a journey that continually fills my soul with happiness and a deep sense of belonging.",
    "I love you more than anything, and every day I’m with you just reminds me of how lucky I am to have you in my life.",
    "You bring so much love and happiness into my world, and every day with you feels like a gift I’ll never take for granted.",
    "Acknowledging the depth of my guilt has opened the door to greater self-awareness, giving me the courage to repair the harm I’ve caused.",
    "Love for you gives me a sense of purpose and direction in life, and every day with you is an opportunity to deepen our bond and grow in ways I never imagined possible.",
    "I love you, but I’m afraid of what could go wrong.",
    "I love you deeply, but at times I question whether our love is truly sustainable.",
    "Our love is undeniable, yet there are moments when I wonder if we are truly meant for each other.",
    "Love makes me happy, but the more I think about it, the more I worry about how fragile it is.",
    "I love you with all my heart, yet there’s a part of me that fears the potential for heartbreak, and that fear sometimes clouds the happiness love brings.",
    "Our love is strong, but I also sense an underlying vulnerability that makes me wonder if we’re both emotionally equipped for what’s ahead.",
    "Love between us feels real and deep, but at times I can’t shake the feeling that we might not be able to handle everything life will throw our way.",
    "There’s an undeniable and powerful connection between us, but I sometimes fear that our differences might one day grow too vast, causing the very love we share to fray at the edges.",
    "The depth of my love for you is immeasurable, but I can’t help but question whether our love can endure the challenges of the future, especially when we’re both carrying our own insecurities.",
    ];
    const prePrompt = "Please tell me if this sentence contains Positive, Negative, or Mixed sentiment: ";
    const complex = [
    'Positive',
    'Mixed',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Negative',
    'Positive',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Mixed',
    'Mixed',
    'Mixed',
    'Positive',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Positive',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Positive',
    'Mixed',
    'Mixed',
    'Mixed',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Negative',
    'Positive',
    'Negative',
    'Negative',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Positive',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    'Mixed',
    ];

    const rawResults = await generateContentForAllPrompts(complexPrompts);
    const parsedResults = parseResults(rawResults);

    console.log("Complex Sentiment Test Results:");
    matchResponse(complex, parsedResults);
}

// Run the test
runComplexSentimentTest();