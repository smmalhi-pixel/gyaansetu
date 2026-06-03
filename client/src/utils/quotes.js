const QUOTES_KEY = 'gyaansetu_daily_quote';

const QUOTES = [
  { text: "Padhai karna ek din mein successful nahi banata, par roz padhna zaroor banata hai.", author: "Gyaan Guru" },
  { text: "Aaj ka ek chapter, kal ke exam mein confidence ban jaata hai.", author: "Gyaan Guru" },
  { text: "Success ka koi shortcut nahi hota, par GyaanSetu ke saath rasta aasan hai.", author: "Gyaan Guru" },
  { text: "Jo roz padhta hai, wahi aage badhta hai. Keep your streak alive!", author: "Gyaan Guru" },
  { text: "Chhoti chhoti mehnat, bade bade sapne poore karti hai.", author: "Gyaan Guru" },
  { text: "Ek din padhoge toh pass ho jaoge, roz padhoge toh top karoge.", author: "Gyaan Guru" },
  { text: "Knowledge ek aisi daulat hai jo share karne se badhti hai.", author: "Gyaan Guru" },
  { text: "Beta, doubt aana matlab seekh rahe ho. Poocho, hum hain na!", author: "Gyaan Guru" },
  { text: "Sapne woh nahi jo neend mein aaye, sapne woh hai jo neend na aane de.", author: "Dr. APJ Abdul Kalam" },
  { text: "Arise, awake and stop not till the goal is reached.", author: "Swami Vivekananda" },
  { text: "Padhai ka mazaa tab aata hai jab mushkil sawal aasan lagne lagein.", author: "Gyaan Guru" },
  { text: "Aaj ka doubt kal ka confidence banega. Don't skip revision.", author: "Gyaan Guru" },
  { text: "Practice doesn't make perfect. Practice makes permanent.", author: "Gyaan Guru" },
  { text: "Mistakes se daro mat, mistakes se seekho. Yahi real learning hai.", author: "Gyaan Guru" },
  { text: "Tumhari mehnat kabhi waste nahi jaati. Har ek minute count karta hai.", author: "Gyaan Guru" },
  { text: "The expert in anything was once a beginner.", author: "Gyaan Guru" },
  { text: "Kal ka top scorer aaj ka consistent learner hota hai.", author: "Gyaan Guru" },
  { text: "Focus on progress, not perfection.", author: "Gyaan Guru" },
  { text: "Ek subject ko master karo, baki subjects jealous ho jayenge!", author: "Gyaan Guru" },
  { text: "Take breaks, but don't break the streak.", author: "Gyaan Guru" },
  { text: "Padhai boring nahi hai, tareeka galat hai. Try Gyaan Guru's way!", author: "Gyaan Guru" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Aaj kuch naya seekhna hai goal? Let's do it!", author: "Gyaan Guru" },
  { text: "Small daily improvements lead to stunning results.", author: "Gyaan Guru" },
];

export const getTodayQuote = () => {
  const today = new Date().toDateString();
  const saved = localStorage.getItem(QUOTES_KEY);
  
  if (saved) {
    const data = JSON.parse(saved);
    if (data.date === today) {
      return data.quote;
    }
  }
  
  const randomIndex = Math.floor(Math.random() * QUOTES.length);
  const quote = QUOTES[randomIndex];
  localStorage.setItem(QUOTES_KEY, JSON.stringify({ date: today, quote }));
  return quote;
};