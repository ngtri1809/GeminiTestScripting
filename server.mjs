import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const crossLingualPrePrompt = "Please analyze the sentiment of each of the following sentences. For each, determine if it contains Positive, Negative, Neutral, or Mixed sentiment. Provide your response in the format TestId - Sentiment";
const complexPrePrompt = "Please analyze the sentiment of each of the following sentences. For each, determine if it contains Positive, Negative, or Mixed sentiment. Provide your response in the format TestId - Sentiment";
const negationHandlingPrePrompt = "Please analyze the sentiment of each of the following sentences. For each, determine if it contains Positive, Negative, or Neutral sentiment. Provide your response in the format TestId - Sentiment";

// Reusable function to generate content for multiple prompts
async function generateContentForAllPrompts(prePrompt, prompts) {
    const batchedPrompt = prompts.map((prompt, index) => 
        `Test ${index + 1}: ${prompt}`
    ).join('\n\n');

    const fullPrompt = prePrompt +"\n\n" + batchedPrompt;
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

    const rawResults = await generateContentForAllPrompts(crossLingualPrePrompt, crossLingualPrompts);
    const parsedResults = parseResults(rawResults);

    console.log("Cross-Lingual Sentiment Test Results:");
    matchResponse(crossLingualExpectedOutput, parsedResults);
}

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

    const rawResults = await generateContentForAllPrompts(complexPrePrompt,complexPrompts);
    const parsedResults = parseResults(rawResults);

    console.log("Complex Sentiment Test Results:");
    matchResponse(complex, parsedResults);
}

// Test case for negation handling sentiment analysis
async function runNegationHandlingSentimentTest() {
    const negationHandlingPrompts = [
        "The book was not bad at all!",
        "The booAk was not bad at all!",
        "The book was not bad at all!",
        "The ook was not bad at all!",
        "I finally read the book, unfortunately it wasn’t not bad.",
        "I finMallTy reJad the bWook, unfortunately it wSasn ’ t not bad.",
        "I ifnalyl raed the boko, unfortunately it awsn ’ t not bad.",
        "I finll red the boo, unfortunately it was ’ t not bad.",
        "It was a long day, but he didn’t not enjoy it.",
        "It was a lhong day, but he didDn ’ t not enj+oy it.",
        "It was a olng day, but he dind ’ t not enjyo it.",
        "It was a lon day, but he idn ’ t not ejoy it.",
        "Despite thinking the movie would be good, she wasn’t not disappointed.",
        "Despite thinking the meovie wo@uld be goocd, she wasn ’ t not disapcpjointe)d.",
        "Edsptie thinking the movei would be good, she wasn ’ t not dsiappointed.",
        "Desie thinking the movie wold be goo, she wsn ’ t not disappointed.",
        "He didn’t love the restaurant, but the live music wasn’t not a fun time.",
        "He diKdn ’ t lKove the restaurant, but the livee mus3ic wasVn ’ t not a fun ti4me.",
        "He dind ’ t loev the restaurant, but the liev umsic wans ’ t not a fun itme.",
        "He ddn ’ t loe the resturn, but the lve musi wasn ’ t not a fun tie.",
        "She hated the zoo, and the aquarium wasn’t not the same.",
        "She hatexd the zoo, and the aqDuNarium _wasn ’ t not the *same.",
        "She hatde the zoo, and the aquiarum awsn ’ t not the saem.",
        "She hate the zoo, and the quariu was ’ t not the sam.",
        "He didn’t feel spiteful, but he didn’t feel grateful, either.",
        "He d7idn ’ t feenl spZi^teful, but he di^dn ’ t xfeel grateful, either.",
        "He didn ’ t feel pstieful, but he ddin ’ t efel grtaeufl, eitehr.",
        "He idn ’ t fee spiteful, but he idn ’ t fel grateful, ither.",
        "I couldn’t not feel a sense of unease, the discomfort wouldn’t go away.",
        "I couldUn ’ t not zfeel a semnse of u^nease, the discomfort weouldn ’ t go away.",
        "I coulnd ’ t not feel a senes of unease, the idcosmfort woulnd ’ t go awya.",
        "I couldn ’ t not fel a ense of uneae, the discoor wouldn ’ t go aay.",
        "The man was tired, but his spirit was undiminished.",
        "The man was t4ired, but his spirSit was undiRminUis^hed.",
        "The man was tierd, but his psirit was undiimnisdhe.",
        "The man was ired, but his pirit was ndminised.",
        "The dog was unhappy.",
        "The dog was unh4ap^py.",
        "The dog was uhnappy.",
        "The dog was uhppy.",
        "Luckily for the group, the situation ended up being uncomplicated.",
        "Luckily for the geroup, the situation en7ded up being uncomphli5cbated.",
        "Luckily for the group, the situtaino neded up being uncomplicated.",
        "Lucky for the roup, the situation ende up being uncomplicated.",
        "The cat was not being good.",
        "The cat was not beinBg goobd.",
        "The cat was not beign godo.",
        "The cat was not bing god.",
        "They were finished writing their novel, but they still felt incomplete.",
        "They were fBinmished writing &their novel, but ^they still felt incomplete.",
        "Htey were ifnishde writing tehir novel, but they still felt incomplete.",
        "They were finished writing thir nvel, but tey still felt incomplete.",
        "They were having a difficult day, but they weren’t unsatisfied.",
        "Th2ey twere having a difficult day, but the&y w&eren ’ t unsatisfied.",
        "Htey were ahving a idfficult day, but they ewren ’ t unsatisfied.",
        "Thy were aving a ificult day, but the weren ’ t unsatisfied.",
        "Everything seemed to be going right for once, but the woman was unsure.",
        "Everything ^seemed to be going riLght for onpce, but the mwoman was unsure.",
        "Evrehyting seemed to be goign rgiht for once, but the woman was unsuer.",
        "Evthing semed to be going rigt for once, but the woman was unsue.",
        "The cat was unhappy, but after everything she only felt relief.",
        "The cat was uIn+happy, but after oevermy1thing she onily felt relief.",
        "The cat was nuhpapy, but after eevryhtnig she only eflt relief.",
        "The cat was unapy, but after everything she oly fet relief.",
        "I couldn’t stop feeling dissatisfaction, a persistent sense of unfulfillment.",
        "I couldn ’ t stop fe&erling Rdi_ssatiscfactigon, a persistent Xsense of unfulf*illMmenGt.",
        "I cuoldn ’ t tsop feelign dissatisfaction, a persistent senes of unfulfillment.",
        "I couldn ’ t sop feeng disatfactin, a persistent sense of unfulilmnt.",
        "The hotel only had four fountains lined with gold and beautiful gemstones, I guess this place is slightly fancy.",
        "The hotel oBnly had four founta!in$s zlined with golFd and beautYifAul gemstones, I guess this place is slig*hAtly fancy.",
        "The hotel onyl had four fountains linde wiht gold and beautiful gmestoens, I ugess this plaec is slightly fancy.",
        "The otel nly had four fountains lind wih gol and beautiful gemstones, I guess this place is sligty fancy.",
        "The four hour drive to this glorified parking lot was definitely worth it.",
        "The four hour drive to thxis glorified tpar9king lot was dehfiniWtelCy woQrth it.",
        "The four hour drvie to thsi gloirfide parking lot was definitely owrth it.",
        "The our hor drive to tis glorified parking lot was dfinily worth it.",
        "When you dress up all fancy like that, you totally aren’t taking my breath away with your beauty.",
        "(When you d&ress up all fanscy like that, you totally Naren ’ t taking my breath away witPh yojur beauty.",
        "Hwen you drses up all afncy ilke that, you totally arne ’ t tkaing my breath away with your beauty.",
        "When you dress up all fancy lie tha, you totally aren ’ t aking my reath away with yor beaut.",
        "When the zombie screamed right up to my face, I totally wasn’t scared at all, don’t check my heart rate.",
        "Whfen the zomSbie sc0reameYd right up to my &face, I totally w0asn ’ t scjared at all, don ’ t chenck my he!art rate.",
        "When the zombei cseramed rgiht up to my faec, I ottally awsn ’ t scarde at all, don ’ t check my heatr rate.",
        "When the zobie creamd ight up to my fae, I totally wsn ’ t cared at all, don ’ t ceck my heart rae.",
        "I only won the lottery three times today, I guess nothing is going my way!",
        "I only won the lottery Pthree tismes tOoday, I guSess nothing is goinFg my way!",
        "I olny won the lottery three times today, I geuss nthoing is giong my way!",
        "I onl won the ottey thre times today, I gues nothing is goin my way!",
        "When she finally saw the movie, she was not disappointed.",
        "Whe)n she lfinalXly saw the movie, she was not dYisap#poi2nted.",
        "When she finlayl saw the mvoie, she was not diasppointde.",
        "When she inaly saw the move, she was not isapoined.",
        "He was not doing bad at the trick, but the fall made him into a less than uninjured man.",
        "He was not doing bad at the tmrick, but the fall mGade him Winto a lbess thajn &uninjuregd man.",
        "He was not doing bad at the rtick, but the afll mdae him inot a less htan unijnurde man.",
        "He was not doin bad at the trick, but the fll mae him ino a ess han uninjured man.",
        "The beauty of life and nature all around us in this forest is totally boring, and I’m totally not planning on staying here for the next 3 hours breathing it all in.",
        "The beau2ty of livfe and natzure all arou7nd us in this forest is Etotall8y borinAg, and I ’ m RtotallOy not planning on stay(intg here for the next 3 ho_urs breatehifng it all in.",
        "The baeuty of lief and nautre all around us in this foerst is ttoally boring, and I ’ m ttolaly not planning on staying heer for the netx 3 horus bretaihng it all in.",
        "The beauy of life and nature all arond us in ths frest is tally borng, and I ’ m totally not lannig on tayin here for the ext 3 hurs breathing it all in.",
        "Why would I be jealous after they went on a 3 month-long vacation without me? I’m totally fine.",
        "Why would I be Cjealougs after they wenyt on a 3 month - l&ong fvacati*on writWhout me? I ’ m t&otalJly fWine.",
        "Why woudl I be jealous after htey went on a 3 month - olng avctaion without me? I ’ m toatlly fine.",
        "Why would I be jeaos after tey wen on a 3 moth - log vaatio wihut me? I ’ m totally fine.",
        "Coming back to the group, everyone seemed not very satisfied with their work.",
        "Coming bBack to the g*roup, everyone seemed not very sat$isfiezd with their wo+rk.",
        "Coming back to the group, everyone seeemd not evry satisfied iwth their wrok.",
        "Coming back to the group, veryne seemed not vey atisfid wth their work.",
        "While she was originally not happy with her work, the reception she received was not bad!",
        "Whilge she was Bo5riginalCly not happy with her wofrk, the rseceXption she UreceVived was not bad!",
        "While she was orignlialy not happy wtih her wrok, the reception she ercieved was not bad!",
        "While she was oriinay not hppy ith her wor, the recepon she received was not bad!",
        "While he wasn’t angry, he still felt like things were not right.",
        "nWhile he Jwasn ’ t angry, he still femlt like thingUs were not right.",
        "Whiel he wsan ’ t angry, he still eflt like tihngs were not right.",
        "While he was ’ t angry, he till fel like thngs were not right.",
        "There were plenty of opportunities to leave, but the man didn’t hate it here.",
        "ThCere were pZlenty of opbpor2tunirties to leMave, but the man didn ’ t hate it her(e.",
        "There were plenty of opoprtuintise to elave, but the man dind ’ t haet it hree.",
        "here were plety of opportunities to eave, but the man didn ’ t hat it hre.",
        "There wasn’t a good time to leave, but the man didn’t want to stay.",
        "Ther(e wasn ’ t a g_ood itime to lelave, but the man 6didn ’ t want to stNay.",
        "Three wasn ’ t a ogod itme to elave, but the man didn ’ t awnt to stya.",
        "Tere wasn ’ t a god ime to eave, but the man idn ’ t want to sty.",
        "After coming to terms with the building’s weird layout, he was never not happy with it.",
        "After coming to Iterms wi6th the building ’ s gweird l*ayout, he was nevter not happy wiXth it.",
        "After ocming to etrms iwth the ubildnig ’ s weird lyaout, he was never not hpapy with it.",
        "Aftr oming to terms wih the building ’ s weird layot, he was never not appy ith it.",
    ];
    const prePrompt = "Please tell me if this sentence contains Positive, Negative, or Neutral sentiment: ";
    const negationHandlingExpectedOutput = [
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
        "Negative",
        "Negative",
        "Negative",
        "Negative",
        "Positive",
        "Positive",
        "Positive",
        "Positive",
    ];

    const rawResults = await generateContentForAllPrompts(negationHandlingPrePrompt, negationHandlingPrompts);
    const parsedResults = parseResults(rawResults);

    console.log("Negation Handling Sentiment Test Results:");
    matchResponse(negationHandlingExpectedOutput, parsedResults);
}

// Run the test
//runCrossLingualSentimentTest();
//runComplexSentimentTest();
//runNegationHandlingSentimentTest();
