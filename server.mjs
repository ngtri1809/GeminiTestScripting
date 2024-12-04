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

    const fullPrompt = `Please analyze the sentiment of each of the following sentences. For each, determine if it contains Positive, Negative, Neutral, or Mixed sentiment. Provide your response in the format "TestId - Sentiment".\n\n${batchedPrompt}`;
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
        const match = line.match(/Test (\d+) - (Positive|Negative|Neutral|Mixed)/i);
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

// Test case for cross-lingual sentiment analysis
async function runCrossLingualSentimentTest() {
    const crossLingualPrompts = [
        "Lá lành đùm lá rách. Helping others brings joy.",
        "Có công mài sắt có ngày nên kim. Persistence pays off.",
        "Đi một ngày đàng học một sàng khôn. Experience teaches wisdom.",
        "Mất bò mới lo làm chuồng. Too late for precautions.",
        "Thời gian là vàng bạc. Time is precious.",
        "Nước chảy đá mòn. Persistence wears down resistance.",
        "Đèn nhà ai nấy lo. Everyone minds their own business.",
        "Đi một ngày đàng học một sàng khôn. Travel broadens the mind.",
        "Mất bò mới lo làm chuồng. It' too late to lock the stable when the horse is stolen.",
        "Nước đến chân mới nhảy. Only acting when necessary.",
        "Một cây làm chẳng nên non, Ba cây chụm lại nên hòn núi cao. Unity is strength.",
        "Đường dài mới biết ngựa hay, ở lâu mới biết người ngay kẻ tà. Time reveals true quality.",
        "I'm feeling happy vì đã hoàn thành project.",
        "The team performance đã improved significantly.",
        "Our strategic initiative demonstrates exceptional results.",
        "This situation làm tôi rất disappointed.",
        "The project has potential nhưng facing challenges.",
        "The implementation phase gặp nhiều difficulties.",
        "Some aspects tốt, others need improvement.",
        "Market trends show Mixed signals về performance.",
        "Project outcomes còn nhiều uncertainties ahead.",
        "Today tôi làm việc như usual.",
        "The situation cần được xem xét carefully.",
        "Giai đoạn implementation cần phân tích kỹ lưỡng.",
        "Dự án shows kết quả promising.",
        "Phản hồi từ customers cho thấy hiệu suất tốt.",
        "Các sáng kiến chiến lược demonstrate tiềm năng đáng kể.",
        "Tiêu chuẩn chất lượng below expectations.",
        "Những thách thức kỹ thuật vẫn persist.",
        "Market conditions đang trong downward trend.",
        "Một số metrics improved trong khi others declined.",
        "Project status cho thấy varying results.",
        "Việc implementation reveals Mixed outcomes.",
        "Tiến độ hiện tại meets basic standards.",
        "Tình hình remains không thay đổi.",
        "Analysis cho thấy performance ở mức standard.",
        "Kết quả suggest Positive developments.",
        "Team performance vượt quá expectations.",
        "Strategic outcomes thể hiện remarkable progress.",
        "Current challenges ảnh hưởng xấu đến performance.",
        "Quá trình project cho thấy concerning trends.",
        "Implementation đang gặp nhiều trở ngại đáng kể.",
        "Một số aspects hoạt động tốt, số khác thì không.",
        "Tiến độ varies across các lĩnh vực khác nhau.",
        "Kết quả thể hiện Mixed effectiveness.",
        "Các standard procedures đang được tuân thủ.",
        "Tình hình hiện tại remains ổn định.",
        "Phân tích cho thấy typical patterns.",
    ];
    const prePrompt = "Please tell me if this sentence contains Positive, Negative, Neutral, or Mixed sentiment: ";
    const crossLingualExpectedOutput = [
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Neutral",
        "Positive",
        "Negative",
        "Positive",
        "Negative",
        "Negative",
        "Positive",
        "Neutral",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Positive",
        "Negative",
        "Mixed",
        "Mixed",
        "Negative",
        "Neutral",
        "Neutral",
        "Neutral",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Mixed",
        "Mixed",
        "Mixed",
        "Neutral",
        "Neutral",
        "Neutral",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Mixed",
        "Mixed",
        "Mixed",
        "Neutral",
        "Neutral",
        "Neutral",
    ];

    const rawResults = await generateContentForAllPrompts(crossLingualPrompts);
    const parsedResults = parseResults(rawResults);

    console.log("Cross-Lingual Sentiment Test Results:");
    matchResponse(crossLingualExpectedOutput, parsedResults);
}

// Run the test
// runCrossLingualSentimentTest();