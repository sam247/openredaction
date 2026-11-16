/**
 * Everyday messages in nine languages: English, Spanish, German, French, Portuguese, Arabic,
 * Hindi, Japanese and Chinese. They are the kind of thing people paste into chat tools:
 * meetings, recipes, prices, sports scores, trains, orders, homework, code questions. Many are
 * heavy on numbers on purpose (dates, times, decimal commas, versions), because that is where
 * false positives show up. None holds personal data, so every detection in one of them is a
 * false positive. The numbers are made up, apart from a few published book ISBNs and a carrier's
 * sample tracking number.
 */
/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: some messages quote code */

export type EverydayLanguage =
  | "en"
  | "es"
  | "de"
  | "fr"
  | "pt"
  | "ar"
  | "hi"
  | "ja"
  | "zh";

export interface EverydayMessage {
  id: string;
  lang: EverydayLanguage;
  text: string;
}

export const everydayMessages: EverydayMessage[] = [
  {
    id: "en-001",
    lang: "en",
    text: "Can you help me write a polite email declining a meeting invite for next Tuesday?",
  },
  {
    id: "en-002",
    lang: "en",
    text: "What's the difference between a Roth IRA and a traditional IRA?",
  },
  {
    id: "en-003",
    lang: "en",
    text: "Explain quantum entanglement like I'm 10 years old.",
  },
  {
    id: "en-004",
    lang: "en",
    text: "My sourdough starter smells like nail polish remover. Is it dead?",
  },
  {
    id: "en-005",
    lang: "en",
    text: "Give me a 3-day itinerary for Lisbon on a budget of about 600 euros.",
  },
  {
    id: "en-006",
    lang: "en",
    text: 'Rewrite this to sound more professional: "hey guys, the report is gonna be late, sorry"',
  },
  {
    id: "en-007",
    lang: "en",
    text: "How many calories are in 2 cups of cooked brown rice?",
  },
  { id: "en-008", lang: "en", text: "What is 17% of 2,450?" },
  { id: "en-009", lang: "en", text: "Solve for x: 3x + 7 = 22" },
  {
    id: "en-010",
    lang: "en",
    text: "Convert 72 degrees Fahrenheit to Celsius.",
  },
  {
    id: "en-011",
    lang: "en",
    text: "I ran 5.2 miles in 48:30. What's my pace per mile?",
  },
  {
    id: "en-012",
    lang: "en",
    text: "The recipe calls for 250 g of flour and 175 ml of milk. How do I scale it to 12 servings instead of 8?",
  },
  {
    id: "en-013",
    lang: "en",
    text: "Which is better for a 1500 sq ft house, a 3 ton or a 3.5 ton AC unit?",
  },
  {
    id: "en-014",
    lang: "en",
    text: "Summarize the plot of Pride and Prejudice in 5 bullet points.",
  },
  { id: "en-015", lang: "en", text: "Write a haiku about autumn leaves." },
  {
    id: "en-016",
    lang: "en",
    text: "What year did the Berlin Wall fall, and why?",
  },
  {
    id: "en-017",
    lang: "en",
    text: "My flight leaves at 6:45 AM and the airport is 40 minutes away. What time should I leave home?",
  },
  {
    id: "en-018",
    lang: "en",
    text: "I'm getting \"TypeError: Cannot read properties of undefined (reading 'map')\" in React. What does it mean?",
  },
  {
    id: "en-019",
    lang: "en",
    text: 'Why does `git push` say "Updates were rejected because the tip of your current branch is behind"?',
  },
  {
    id: "en-020",
    lang: "en",
    text: "Explain the difference between let, const and var in JavaScript.",
  },
  {
    id: "en-021",
    lang: "en",
    text: "What does HTTP status 429 mean and how should my client handle it?",
  },
  {
    id: "en-022",
    lang: "en",
    text: "```python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\nprint(fib(30))\n```\nWhy is this faster than the recursive version?",
  },
  {
    id: "en-023",
    lang: "en",
    text: "Here's my SQL: SELECT customer_id, SUM(amount) FROM orders WHERE created_at >= '2024-01-01' GROUP BY customer_id HAVING SUM(amount) > 1000; how do I add a rank column?",
  },
  {
    id: "en-024",
    lang: "en",
    text: 'docker run -p 8080:80 -v /data:/var/lib/data nginx:1.25.3 fails with "port is already allocated". What now?',
  },
  {
    id: "en-025",
    lang: "en",
    text: 'npm ERR! code ERESOLVE\nnpm ERR! ERESOLVE unable to resolve dependency tree\nnpm ERR! peer react@"^17.0.2" from react-dom@17.0.2\nHow do I fix this?',
  },
  {
    id: "en-026",
    lang: "en",
    text: "What's new in Python 3.12 compared to 3.11?",
  },
  {
    id: "en-027",
    lang: "en",
    text: "My build fails on node v20.11.1 but works on v18.19.0. Where do I start?",
  },
  {
    id: "en-028",
    lang: "en",
    text: "Commit 3f9a2c1e broke the tests. How do I find which change caused it with git bisect?",
  },
  {
    id: "en-029",
    lang: "en",
    text: "The API returned request id 7c9e6679-7425-40de-944b-e07fc1f90ae7 with a 500 error. What should I include in a bug report?",
  },
  {
    id: "en-030",
    lang: "en",
    text: "What does this regex do? ^[A-Z]{2}\\d{2}[A-Z0-9]{4}$",
  },
  {
    id: "en-031",
    lang: "en",
    text: "Explain big O notation with an example of O(n log n).",
  },
  { id: "en-032", lang: "en", text: "How do I center a div with CSS grid?" },
  {
    id: "en-033",
    lang: "en",
    text: "Write a bash one-liner that counts lines in all .py files under src/.",
  },
  {
    id: "en-034",
    lang: "en",
    text: "kubectl get pods shows CrashLoopBackOff with exit code 137. What does 137 mean?",
  },
  {
    id: "en-035",
    lang: "en",
    text: "Is 0.1 + 0.2 === 0.3 in JavaScript? Why not?",
  },
  {
    id: "en-036",
    lang: "en",
    text: "The server log says: 2024-03-14T09:26:53.589Z ERROR worker-3 timeout after 30000ms (attempt 4/5)\nWhy would it time out only under load?",
  },
  {
    id: "en-037",
    lang: "en",
    text: "What's the time complexity of Python's dict lookup?",
  },
  {
    id: "en-038",
    lang: "en",
    text: "How do I convert a Unix timestamp like 1710408413 to a readable date in JavaScript?",
  },
  {
    id: "en-039",
    lang: "en",
    text: "My Raspberry Pi 4 shows 192 MB free out of 3.8 GB. Is that a problem?",
  },
  { id: "en-040", lang: "en", text: "What does chmod 755 do?" },
  {
    id: "en-041",
    lang: "en",
    text: "Our sprint velocity was 34, 29, 41 and 37 points. What's a realistic forecast for the next sprint?",
  },
  {
    id: "en-042",
    lang: "en",
    text: "Make a table comparing the iPhone 15, Pixel 8 and Galaxy S24 on battery, camera and price.",
  },
  {
    id: "en-043",
    lang: "en",
    text: "How long does it take light from the Sun to reach Earth? About 8 minutes 20 seconds?",
  },
  {
    id: "en-044",
    lang: "en",
    text: "Write a birthday message for my coworker who loves hiking.",
  },
  {
    id: "en-045",
    lang: "en",
    text: "My kid's school starts at 8:15 and ends at 2:50. How many hours is that per week?",
  },
  {
    id: "en-046",
    lang: "en",
    text: "What are good houseplants for a room with a north-facing window?",
  },
  {
    id: "en-047",
    lang: "en",
    text: 'Translate "where is the train station?" into Spanish, French and German.',
  },
  {
    id: "en-048",
    lang: "en",
    text: "Explain how compound interest works if I invest $5,000 at 7% for 20 years.",
  },
  {
    id: "en-049",
    lang: "en",
    text: "Our Q3 revenue was $1.2M, up 14% from $1.05M. Write a short summary for the team newsletter.",
  },
  {
    id: "en-050",
    lang: "en",
    text: "Draft a LinkedIn post announcing our new product launch on October 3rd.",
  },
  {
    id: "en-051",
    lang: "en",
    text: "What's the capital of Australia? Everyone says Sydney.",
  },
  {
    id: "en-052",
    lang: "en",
    text: "Plan a weekly workout: 3 days strength, 2 days cardio, 30 to 45 minutes each.",
  },
  {
    id: "en-053",
    lang: "en",
    text: "How do I remove a red wine stain from a cotton shirt?",
  },
  {
    id: "en-054",
    lang: "en",
    text: "I scored 1340 on the SAT. Is that good enough for state universities?",
  },
  {
    id: "en-055",
    lang: "en",
    text: "The Lakers won 112-108 last night. Who had the most points?",
  },
  {
    id: "en-056",
    lang: "en",
    text: "Recommend 5 sci-fi books similar to The Expanse.",
  },
  {
    id: "en-057",
    lang: "en",
    text: "What's the difference between 1080p and 4K for a 55 inch TV at 8 feet?",
  },
  {
    id: "en-058",
    lang: "en",
    text: "Make a grocery list for a week of vegetarian dinners for 4 people.",
  },
  {
    id: "en-059",
    lang: "en",
    text: "How much paint do I need for a 12 x 14 ft room with 8 ft ceilings?",
  },
  {
    id: "en-060",
    lang: "en",
    text: "My car shows code P0420. What does it mean and is it urgent?",
  },
  {
    id: "en-061",
    lang: "en",
    text: "Can you explain what a 401(k) employer match of 50% up to 6% means?",
  },
  {
    id: "en-062",
    lang: "en",
    text: "I need a cover letter for a junior data analyst role. Focus on Excel, SQL and Tableau.",
  },
  {
    id: "en-063",
    lang: "en",
    text: "Why does my bread come out dense? I use 500 g flour, 350 g water, 10 g salt, 7 g yeast.",
  },
  {
    id: "en-064",
    lang: "en",
    text: "What's a good way to learn guitar chords as a 40 year old beginner?",
  },
  { id: "en-065", lang: "en", text: "How many ounces are in 1.5 liters?" },
  {
    id: "en-066",
    lang: "en",
    text: "Is it normal for a 3 month old puppy to sleep 18 hours a day?",
  },
  {
    id: "en-067",
    lang: "en",
    text: "Explain the Monty Hall problem and why switching wins 2/3 of the time.",
  },
  {
    id: "en-068",
    lang: "en",
    text: "Summarize this meeting: we agreed to ship v2.4 on the 15th, Maria owns QA, and the budget stays at 40k.",
  },
  {
    id: "en-069",
    lang: "en",
    text: "Please review my essay introduction and tell me if the thesis is clear.",
  },
  {
    id: "en-070",
    lang: "en",
    text: "What are the main causes of World War I?",
  },
  {
    id: "en-071",
    lang: "en",
    text: "Write a limerick about a cat who hates Mondays.",
  },
  {
    id: "en-072",
    lang: "en",
    text: "Help me split a $186.40 dinner bill between 5 people with an 18% tip.",
  },
  {
    id: "en-073",
    lang: "en",
    text: "What's the difference between weather and climate?",
  },
  {
    id: "en-074",
    lang: "en",
    text: "How do vaccines train the immune system?",
  },
  {
    id: "en-075",
    lang: "en",
    text: "Give me 10 names for a coffee shop with a book theme.",
  },
  {
    id: "en-076",
    lang: "en",
    text: "I have 3 eggs, spinach, feta and half an onion. What can I cook?",
  },
  { id: "en-077", lang: "en", text: "How far is the Moon? Around 384,400 km?" },
  { id: "en-078", lang: "en", text: "Explain the rules of chess castling." },
  {
    id: "en-079",
    lang: "en",
    text: "My electricity bill jumped from 94 to 161 dollars. What could cause that in winter?",
  },
  {
    id: "en-080",
    lang: "en",
    text: "Which is healthier: 2% milk or oat milk?",
  },
  {
    id: "en-081",
    lang: "en",
    text: "Write a short story opening set on a space station orbiting Jupiter.",
  },
  {
    id: "en-082",
    lang: "en",
    text: "Compare AWS, Azure and Google Cloud for a small startup.",
  },
  {
    id: "en-083",
    lang: "en",
    text: "What is the Pythagorean theorem? Show 3-4-5 as an example.",
  },
  {
    id: "en-084",
    lang: "en",
    text: "Help me write a thank-you note to my neighbors for watering my plants.",
  },
  { id: "en-085", lang: "en", text: "Why do cats knead blankets?" },
  {
    id: "en-086",
    lang: "en",
    text: "Our office moved to the 4th floor, room 412. Write a friendly announcement for the team.",
  },
  {
    id: "en-087",
    lang: "en",
    text: "How do I calculate the area of a circle with radius 7.5 cm?",
  },
  {
    id: "en-088",
    lang: "en",
    text: "Explain the difference between TCP and UDP.",
  },
  {
    id: "en-089",
    lang: "en",
    text: "What's a good stretching routine after sitting for 8 hours?",
  },
  {
    id: "en-090",
    lang: "en",
    text: "Give me a study schedule for the next 6 weeks before my biology final on May 20.",
  },
  {
    id: "en-091",
    lang: "en",
    text: "Help me understand this Excel formula: =VLOOKUP(A2, Sheet2!$A$2:$D$500, 4, FALSE)",
  },
  {
    id: "en-092",
    lang: "en",
    text: "My laptop fan runs at 100% with Chrome using 2.3 GB of RAM. Tips?",
  },
  { id: "en-093", lang: "en", text: "How many steps is 10 km?" },
  {
    id: "en-094",
    lang: "en",
    text: "Explain inflation and why the Fed raises rates.",
  },
  {
    id: "en-095",
    lang: "en",
    text: "What should I pack for a 10-day trip to Japan in April?",
  },
  {
    id: "en-096",
    lang: "en",
    text: 'Rewrite this bullet for my resume: "did sales stuff and increased numbers"',
  },
  {
    id: "en-097",
    lang: "en",
    text: "Write unit tests for a function that checks if a string is a palindrome.",
  },
  {
    id: "en-098",
    lang: "en",
    text: "In Go, why does `for i := range 10` work in 1.22 but not 1.21?",
  },
  {
    id: "en-099",
    lang: "en",
    text: "The CSV has columns id,date,amount,category. Write pandas code to get monthly totals per category.",
  },
  {
    id: "en-100",
    lang: "en",
    text: "Explain what a JWT is and when not to use one.",
  },
  {
    id: "en-101",
    lang: "en",
    text: "What is the time zone difference between New York and Tokyo?",
  },
  { id: "en-102", lang: "en", text: "Why is the sky blue?" },
  {
    id: "en-103",
    lang: "en",
    text: "My tomato plants have yellow leaves at the bottom. What's wrong?",
  },
  {
    id: "en-104",
    lang: "en",
    text: "Estimate how long it takes to read a 320 page book at 250 words per minute.",
  },
  {
    id: "en-105",
    lang: "en",
    text: "How do I politely ask my manager for a raise?",
  },
  {
    id: "en-106",
    lang: "en",
    text: "Explain the plot twist in The Sixth Sense without spoiling too much.",
  },
  {
    id: "en-107",
    lang: "en",
    text: "Suggest a name for my Dungeons & Dragons half-elf ranger.",
  },
  {
    id: "en-108",
    lang: "en",
    text: "What's the best way to store fresh herbs?",
  },
  {
    id: "en-109",
    lang: "en",
    text: 'The error says "ORA-00942: table or view does not exist". What do I check?',
  },
  {
    id: "en-110",
    lang: "en",
    text: "Here is a stack trace:\n  at Object.<anonymous> (/app/src/index.js:42:13)\n  at Module._compile (node:internal/modules/cjs/loader:1256:14)\n  at node:internal/main/run_main_module:23:47\nWhat is line 42 doing wrong?",
  },
  {
    id: "en-111",
    lang: "en",
    text: 'The package.json says "version": "3.14.2" but npm view shows 3.15.0. How do I upgrade safely?',
  },
  {
    id: "en-112",
    lang: "en",
    text: "What's the SHA-256 of an empty string? I remember e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.",
  },
  {
    id: "en-113",
    lang: "en",
    text: "Write a regex that matches US ZIP codes like 12345 or 12345-6789.",
  },
  {
    id: "en-114",
    lang: "en",
    text: 'How do I format 1234567.891 as "1,234,567.89" in Python?',
  },
  {
    id: "en-115",
    lang: "en",
    text: "Explain matrix multiplication with a 2x2 example.",
  },
  {
    id: "en-116",
    lang: "en",
    text: "Calculate the monthly payment on a $300,000 mortgage at 6.5% over 30 years.",
  },
  {
    id: "en-117",
    lang: "en",
    text: "Why is my Wi-Fi only 45 Mbps when I pay for 300?",
  },
  {
    id: "en-118",
    lang: "en",
    text: "What's the boiling point of water at 5,000 feet?",
  },
  {
    id: "en-119",
    lang: "en",
    text: "Help me plan a 7-course tasting menu for a dinner party.",
  },
  {
    id: "en-120",
    lang: "en",
    text: "List the planets in order and one fun fact about each.",
  },
  {
    id: "en-121",
    lang: "en",
    text: "What's the difference between affect and effect?",
  },
  {
    id: "en-122",
    lang: "en",
    text: "My son is 12 and wants a phone. What rules have worked for other parents?",
  },
  {
    id: "en-123",
    lang: "en",
    text: "Suggest 3 board games for 2 players that take under 30 minutes.",
  },
  { id: "en-124", lang: "en", text: "How do I tell if an egg is still fresh?" },
  {
    id: "en-125",
    lang: "en",
    text: "Explain the difference between a virus and a bacterium.",
  },
  {
    id: "en-126",
    lang: "en",
    text: 'What does the error "Segmentation fault (core dumped)" mean in C?',
  },
  {
    id: "en-127",
    lang: "en",
    text: "Can you optimize this loop?\nfor (int i = 0; i < 1000000; i++) { total += arr[i] * 2; }",
  },
  {
    id: "en-128",
    lang: "en",
    text: "How do I set up a Python virtual environment on Windows 11?",
  },
  {
    id: "en-129",
    lang: "en",
    text: "Write a function that returns the nth prime number.",
  },
  {
    id: "en-130",
    lang: "en",
    text: "What's the difference between RAID 1 and RAID 5?",
  },
  {
    id: "en-131",
    lang: "en",
    text: "Our API rate limit is 1000 requests per 15 minutes. How many per second is that on average?",
  },
  {
    id: "en-132",
    lang: "en",
    text: "The build number is 20240314.3 and the artifact is app-release-2.8.0-rc1.apk. Write release notes.",
  },
  {
    id: "en-133",
    lang: "en",
    text: "Explain CORS and why my fetch to localhost:3000 from localhost:5173 fails.",
  },
  {
    id: "en-134",
    lang: "en",
    text: "IPv6 address 2001:db8::1 — what does the :: mean?",
  },
  {
    id: "en-135",
    lang: "en",
    text: "My GPU is an RTX 3060 with 12 GB. Can I run a 13B model locally?",
  },
  {
    id: "en-136",
    lang: "en",
    text: "What's the square root of 144, and how do I estimate square roots in my head?",
  },
  {
    id: "en-137",
    lang: "en",
    text: "In chess notation, what does 1. e4 e5 2. Nf3 Nc6 3. Bb5 mean?",
  },
  { id: "en-138", lang: "en", text: "How many tablespoons are in 3/4 cup?" },
  {
    id: "en-139",
    lang: "en",
    text: "What's the population of Canada, roughly 40 million?",
  },
  { id: "en-140", lang: "en", text: "Explain the 4-7-8 breathing technique." },
  {
    id: "en-141",
    lang: "en",
    text: "Is a 2019 Honda Civic with 85,000 miles a good buy at $17,500?",
  },
  {
    id: "en-142",
    lang: "en",
    text: "Help me write an out-of-office reply for December 23 to January 2.",
  },
  {
    id: "en-143",
    lang: "en",
    text: "What were the main results of the 1969 Apollo 11 mission?",
  },
  {
    id: "en-144",
    lang: "en",
    text: "Write a SQL query to find duplicate emails in a users table.",
  },
  {
    id: "en-145",
    lang: "en",
    text: "How do I check which process is using port 5432 on Linux?",
  },
  {
    id: "en-146",
    lang: "en",
    text: "Give me a morning routine that takes 20 minutes.",
  },
  { id: "en-147", lang: "en", text: "Why do onions make you cry?" },
  {
    id: "en-148",
    lang: "en",
    text: "Create a budget template with categories for rent, food, transport and savings.",
  },
  {
    id: "en-149",
    lang: "en",
    text: "What's the difference between a crocodile and an alligator?",
  },
  {
    id: "en-150",
    lang: "en",
    text: "Explain photosynthesis in two sentences.",
  },
  {
    id: "en-151",
    lang: "en",
    text: "We need 3 volunteers for Saturday 9 to 12 at the food bank. Write a sign-up message.",
  },
  {
    id: "en-152",
    lang: "en",
    text: "How do I write a for loop in Rust that goes from 10 down to 1?",
  },
  {
    id: "en-153",
    lang: "en",
    text: "What's the formula for the volume of a cylinder? Radius 4, height 10.",
  },
  {
    id: "en-154",
    lang: "en",
    text: "My blood pressure reading was 128 over 82. Is that normal for a 45 year old?",
  },
  {
    id: "en-155",
    lang: "en",
    text: "What's the best way to learn touch typing? I'm at 35 words per minute.",
  },
  {
    id: "en-156",
    lang: "en",
    text: "Make a packing checklist for a newborn's first trip to grandma's house.",
  },
  {
    id: "en-157",
    lang: "en",
    text: "Why did my sourdough rise 50% in 4 hours at 78 F but only 20% at 68 F?",
  },
  {
    id: "en-158",
    lang: "en",
    text: "The model number on my dishwasher is SHXM4AY55N. How do I reset it?",
  },
  {
    id: "en-159",
    lang: "en",
    text: "Tracking says my package is at the sorting facility since 3 days. Normal?",
  },
  {
    id: "en-160",
    lang: "en",
    text: "What's the lifespan of a lithium battery at 500 charge cycles?",
  },
  {
    id: "en-161",
    lang: "en",
    text: "Explain the Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55.",
  },
  {
    id: "en-162",
    lang: "en",
    text: "My test scores were 78, 85, 92, 88 and 95. What's my average and standard deviation?",
  },
  {
    id: "en-163",
    lang: "en",
    text: "Write CSS for a button that grows 5% on hover with a 200ms transition.",
  },
  {
    id: "en-164",
    lang: "en",
    text: 'What does "idempotent" mean for HTTP methods?',
  },
  {
    id: "en-165",
    lang: "en",
    text: "The flight is AA 1234 from ORD to LAX, departing 14:05, arriving 16:40. How long is it?",
  },
  {
    id: "en-166",
    lang: "en",
    text: "My train ticket number is on the email, but which platform does the 7:52 to Boston usually use?",
  },
  {
    id: "en-167",
    lang: "en",
    text: "How much water should a 70 kg adult drink per day?",
  },
  {
    id: "en-168",
    lang: "en",
    text: "The invoice total is $2,340.00 with 8.25% sales tax included. What's the pre-tax amount?",
  },
  { id: "en-169", lang: "en", text: "Which is bigger, 2^10 or 10^3?" },
  {
    id: "en-170",
    lang: "en",
    text: "Explain the difference between git merge and git rebase with a diagram.",
  },
  {
    id: "en-171",
    lang: "en",
    text: "I'm writing a fantasy novel. Help me design a magic system with 3 rules.",
  },
  {
    id: "en-172",
    lang: "en",
    text: "Brainstorm 10 blog post ideas about remote work productivity.",
  },
  {
    id: "en-173",
    lang: "en",
    text: "The meeting is at 3pm PST. What time is that in London?",
  },
  {
    id: "en-174",
    lang: "en",
    text: "What's the difference between a latte and a flat white?",
  },
  { id: "en-175", lang: "en", text: "Why does ice float?" },
  {
    id: "en-176",
    lang: "en",
    text: "Give me a 5-minute icebreaker for a team of 12 people.",
  },
  {
    id: "en-177",
    lang: "en",
    text: "Explain how a bill becomes law in the United States.",
  },
  { id: "en-178", lang: "en", text: "Can you check my math? 45 * 23 = 1035" },
  {
    id: "en-179",
    lang: "en",
    text: "What is the order of operations for 8 / 2 * (2 + 2)?",
  },
  {
    id: "en-180",
    lang: "en",
    text: "Help me name variables in this function; right now they're a, b, c, and tmp2.",
  },
  {
    id: "en-181",
    lang: "en",
    text: "Write a Python script to rename files like IMG_0001.jpg to 2024-03-14_001.jpg.",
  },
  {
    id: "en-182",
    lang: "en",
    text: "Explain what 0.0.0.0 means when a server listens on it.",
  },
  {
    id: "en-183",
    lang: "en",
    text: "What are the lyrics structure of a typical pop song (verse, chorus, bridge)?",
  },
  {
    id: "en-184",
    lang: "en",
    text: "Our team has 7 people across 4 time zones. Suggest a meeting schedule.",
  },
  {
    id: "en-185",
    lang: "en",
    text: "Write a thank-you email to a customer who ordered 250 units.",
  },
  {
    id: "en-186",
    lang: "en",
    text: "My score in Wordle today was 3/6. Explain the best starting words.",
  },
  {
    id: "en-187",
    lang: "en",
    text: "Explain the difference between mean, median and mode using 2, 3, 3, 5, 7, 10.",
  },
  {
    id: "en-188",
    lang: "en",
    text: "What does a 720 credit score mean when applying for a car loan?",
  },
  {
    id: "en-189",
    lang: "en",
    text: "How do I compute a 95% confidence interval with n = 40, mean 12.3, sd 2.1?",
  },
  {
    id: "en-190",
    lang: "en",
    text: "Recommend a 2-week beginner running plan to reach 5 km.",
  },
  {
    id: "en-191",
    lang: "en",
    text: "Write the lyrics for a silly song about a dog named Biscuit.",
  },
  {
    id: "en-192",
    lang: "en",
    text: "The Wi-Fi password field keeps rejecting my input; what characters are usually not allowed?",
  },
  {
    id: "en-193",
    lang: "en",
    text: 'Explain what "password hashing with salt" means in simple words.',
  },
  {
    id: "en-194",
    lang: "en",
    text: 'My app shows "Your session expired, please log in again" every 15 minutes. Where do I look?',
  },
  {
    id: "en-195",
    lang: "en",
    text: "In our docs, the example config uses API_KEY=your-key-here. How should real keys be stored?",
  },
  {
    id: "en-196",
    lang: "en",
    text: "What's a good password manager for a family of 4?",
  },
  {
    id: "en-197",
    lang: "en",
    text: "Explain two-factor authentication to my grandmother.",
  },
  {
    id: "en-198",
    lang: "en",
    text: 'Why does curl -H "Authorization: Bearer $TOKEN" https://api.example.com return 401 when the token works in Postman?',
  },
  {
    id: "en-199",
    lang: "en",
    text: "In my Express app I read the key with api-key: process.env.OPENAI_KEY and it's undefined in production. Why?",
  },
  {
    id: "en-200",
    lang: "en",
    text: "Should the test pass: expected 200 got 200, or is my assertion wrong?",
  },
  {
    id: "en-201",
    lang: "en",
    text: 'My config has headers = {"Authorization": f"Bearer {api_key}"} and password: os.environ["DB_PASSWORD"]. Is that the right pattern?',
  },
  {
    id: "en-202",
    lang: "en",
    text: "Set pass: true in the pytest config and use x-api-key: ${API_KEY} in the request header. Does that look right?",
  },
  {
    id: "en-203",
    lang: "en",
    text: "Use a combination of letters and numbers for your password, and a password manager like 1Password or Bitwarden. What is a good passcode length, 6 digits?",
  },
  {
    id: "en-204",
    lang: "en",
    text: "Go to the login / signup page and click next. The login form has username / password fields.",
  },
  {
    id: "en-205",
    lang: "en",
    text: "Double check the triple A batteries, 3 pack. The combination 1-2-3 is easiest to remember.",
  },
  {
    id: "en-206",
    lang: "en",
    text: "My phone code is broken and the building code requires 2 exits. Password reset emails take 5 minutes.",
  },
  {
    id: "en-207",
    lang: "en",
    text: "pw 2 is the second practice worksheet. Set the pin mode to 13 on the arduino; the card code snippet on line 42 fails.",
  },
  {
    id: "en-208",
    lang: "en",
    text: "Send it by email to the team at google. Email marketing at hubspot works well.",
  },
  {
    id: "en-209",
    lang: "en",
    text: "I was born in nineteen ninety and moved in two thousand five. Call me double quick, it's five minutes.",
  },
  {
    id: "en-210",
    lang: "en",
    text: "I like five hundred piece puzzles and triple chocolate cake. It cost five hundred dollars and took two thousand hours.",
  },
  {
    id: "en-211",
    lang: "en",
    text: "What's the best pizza dough recipe? I need 500 grams of flour and double the yeast. Convert five hundred fifty five dollars to euros.",
  },
  {
    id: "en-212",
    lang: "en",
    text: "Explain the difference between a PIN and a password for a 10 year old. The login screen says password must be 8 characters with a number.",
  },
  {
    id: "en-213",
    lang: "en",
    text: "The security question was easy, what should my answer be? My mother's maiden name is a common security question, is that safe?",
  },
  {
    id: "en-214",
    lang: "en",
    text: "The combination lock came with a card that says 00-00-00 to reset. My gate code keeps changing every month, is that normal?",
  },
  {
    id: "en-215",
    lang: "en",
    text: "What does RFC 2119 say about MUST and SHOULD? Call triple A, their number is on the card. The passcode is on the sticky note.",
  },
  {
    id: "en-216",
    lang: "en",
    text: "The CVV is the 3 digit number on the back. Is the security code the same as the PIN? The security code 2FA app shows 6 digits.",
  },
  {
    id: "en-217",
    lang: "en",
    text: "Remote access code expired after 10 minutes. AnyDesk is a remote desktop app, version 8.0.9; my remote desktop resolution is 1920 1080.",
  },
  {
    id: "en-218",
    lang: "en",
    text: "What are backup codes and where do I keep them? My recovery key is lost, how do I get a new one? Should I turn on two factor codes for email?",
  },
  {
    id: "en-219",
    lang: "en",
    text: "Code that handles passwords: password = request.form['password']; if password == confirm_password: return True; hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()); user.set_password(new_password)",
  },
  {
    id: "en-220",
    lang: "en",
    text: "login: POST /api/v1/login / returns 200. Backup codes table: id, user_id, code_hash, used_at. Recovery key rotation every 90 days via cron 0 3 * * *. The passcode length must be >= 6; cvv field maxlength=4.",
  },
  {
    id: "en-221",
    lang: "en",
    text: "My flight UA 1234 leaves at 6:45 am from gate B12, seat 23C. What should I pack for 3 days in Denver?",
  },
  {
    id: "en-222",
    lang: "en",
    text: "Our wifi router model is TP-Link AX1500, firmware 1.0.3. Why does it drop every 20 minutes?",
  },
  {
    id: "en-223",
    lang: "en",
    text: "Can you convert 350 degrees Fahrenheit to Celsius and 2 1/2 cups of flour to grams?",
  },
  {
    id: "en-224",
    lang: "en",
    text: "The recipe says bake for 45-50 minutes at 180C. My oven only goes to 170, what do I do?",
  },
  {
    id: "en-225",
    lang: "en",
    text: "I scored 1420 on the SAT and 32 on the ACT. Which colleges should I apply to?",
  },
  {
    id: "en-226",
    lang: "en",
    text: "My kid's school starts at 8:15 and ends at 3:05. How do I plan a 45 minute commute?",
  },
  {
    id: "en-227",
    lang: "en",
    text: "Tracking number 1Z999AA10123456784 says delivered but nothing is here, what should I do?",
  },
  {
    id: "en-228",
    lang: "en",
    text: "The invoice total is $1,249.99 with tax 8.25%. What was the pre-tax amount?",
  },
  {
    id: "en-229",
    lang: "en",
    text: "My doctor appointment is on March 14 at 2:30 pm. What questions should I ask about blood pressure 140/90?",
  },
  {
    id: "en-230",
    lang: "en",
    text: "I take 10 mg of lisinopril once a day. Is it OK to take ibuprofen 200 mg?",
  },
  {
    id: "en-231",
    lang: "en",
    text: "Order #445-2231987 from Amazon arrived damaged. Write a complaint email for me.",
  },
  {
    id: "en-232",
    lang: "en",
    text: "My car's VIN starts with 1HGCM, it's a 2008 Honda Accord with 145,000 miles. Is it worth fixing the transmission?",
  },
  {
    id: "en-233",
    lang: "en",
    text: "The error says ERR_CONNECTION_RESET on port 8080. How do I fix it on Windows 11 build 22631?",
  },
  {
    id: "en-234",
    lang: "en",
    text: "I need to call my bank. What should I say to dispute a $45 charge from March 3?",
  },
  {
    id: "en-235",
    lang: "en",
    text: "Room 1204 at the Hilton was booked for 3 nights, checkout at 11. Can I ask for late checkout?",
  },
  {
    id: "en-236",
    lang: "en",
    text: "My grandson's birthday party is on Saturday at 2 pm, he turns 7. Gift ideas under $30?",
  },
  {
    id: "en-237",
    lang: "en",
    text: "I walked 12,456 steps today and burned 520 calories. Is that enough for weight loss?",
  },
  {
    id: "en-238",
    lang: "en",
    text: "Our HOA fee went from $250 to $310 a month. Write a polite letter asking why.",
  },
  {
    id: "en-239",
    lang: "en",
    text: "My electricity bill was 1,250 kWh this month. How can I cut it by 20 percent?",
  },
  {
    id: "en-240",
    lang: "en",
    text: "Explain what a 401(k) is and whether I should put 6% in if my employer matches 50%.",
  },
  {
    id: "en-241",
    lang: "en",
    text: "I owe $4,500 on a card at 24.99% APR. How long to pay it off at $200 a month?",
  },
  {
    id: "en-242",
    lang: "en",
    text: "The train leaves platform 9 at 17:42 and arrives at 19:05. How long is the trip?",
  },
  {
    id: "en-243",
    lang: "en",
    text: "What's the difference between a 15 year and 30 year mortgage at 6.5% on $300,000?",
  },
  {
    id: "en-244",
    lang: "en",
    text: "My blood sugar was 145 this morning before breakfast. Is that high?",
  },
  {
    id: "en-245",
    lang: "en",
    text: "Help me write a thank you note to nurse Maria on floor 4 for her kindness.",
  },
  {
    id: "en-246",
    lang: "en",
    text: "The package weighs 2.3 kg and is 40 x 30 x 20 cm. Which shipping option is cheapest?",
  },
  {
    id: "en-247",
    lang: "en",
    text: "My phone says storage 118 GB of 128 GB used. What can I delete safely?",
  },
  {
    id: "en-248",
    lang: "en",
    text: "Chapter 12, question 4: solve 3x + 7 = 22 and show the steps.",
  },
  {
    id: "en-249",
    lang: "en",
    text: "My password manager generated a 20 character password. Is that strong enough for my bank?",
  },
  {
    id: "en-250",
    lang: "en",
    text: "Our team code review is at 10 am; PR 2231 has 14 comments. How do I respond politely?",
  },
  {
    id: "en-251",
    lang: "en",
    text: "The thermostat is set to 68 at night and 72 during the day. Is that efficient?",
  },
  {
    id: "en-252",
    lang: "en",
    text: "My pension is $1,850 a month and social security is $2,100. How should I budget?",
  },
  {
    id: "en-253",
    lang: "en",
    text: "Call me back later, I'm driving. Also, the dentist moved my cleaning to the 22nd.",
  },
  {
    id: "en-254",
    lang: "en",
    text: "The lottery numbers were 4 11 23 38 45 and 12. What are the odds of winning?",
  },
  {
    id: "en-255",
    lang: "en",
    text: "I have 3 prescriptions: 20 mg, 40 mg and 81 mg aspirin. Can they be taken together?",
  },
  {
    id: "en-256",
    lang: "en",
    text: "Please summarize this: revenue grew 12% to $4.2M in Q3, costs rose 8%, margin 23%.",
  },
  {
    id: "en-257",
    lang: "en",
    text: "My apartment is unit 5B on the 3rd floor. The landlord hasn't fixed the heat for 2 weeks.",
  },
  {
    id: "en-258",
    lang: "en",
    text: "We're at mile marker 142 on I-75 and the car is overheating. What should we do?",
  },
  {
    id: "en-259",
    lang: "en",
    text: "The printer shows error code E-05 and the paper tray is full. How do I reset it?",
  },
  {
    id: "en-260",
    lang: "en",
    text: "Help me plan a 7 day trip to Italy in May with 2 kids ages 8 and 11.",
  },
  {
    id: "en-261",
    lang: "en",
    text: "The tax form asks for line 11 adjusted gross income. Where do I find it on my W-2?",
  },
  {
    id: "en-262",
    lang: "en",
    text: "I need a packing list for a cruise that leaves on June 3 and returns June 10.",
  },
  {
    id: "en-263",
    lang: "en",
    text: "My WiFi password is saved on my old laptop. How do I find it on Windows?",
  },
  {
    id: "en-264",
    lang: "en",
    text: "Remind me what the security question on my account usually asks about.",
  },
  {
    id: "en-265",
    lang: "en",
    text: "Our new PIN pad at the store keeps beeping. How do I tell the manager?",
  },
  {
    id: "en-266",
    lang: "en",
    text: "The combination of flour, water and salt makes a simple dough. How long do I knead it?",
  },
  {
    id: "en-267",
    lang: "en",
    text: "Is 98.9 degrees a fever for an 80 year old?",
  },
  {
    id: "en-268",
    lang: "en",
    text: "Grandma's recipe card says 1 1/4 cups sugar and 2 sticks butter for 24 cookies.",
  },
  {
    id: "en-269",
    lang: "en",
    text: "My insurance deductible is $1,500 and I've paid $900 so far this year. What's left?",
  },
  {
    id: "en-270",
    lang: "en",
    text: "The gym membership is $39.99 a month with a $49 sign-up fee. Worth it for 2 visits a week?",
  },
  {
    id: "en-271",
    lang: "en",
    text: "A caller said he was from Microsoft and asked me to install AnyDesk. Should I?",
  },
  {
    id: "en-272",
    lang: "en",
    text: "Someone emailed me saying my account will close unless I confirm my password. Is it real?",
  },
  {
    id: "en-273",
    lang: "en",
    text: "My son says his school login doesn't work. Who should he contact?",
  },
  {
    id: "en-274",
    lang: "en",
    text: "We moved to a new house last month. How do I update my address with the post office?",
  },
  {
    id: "en-275",
    lang: "en",
    text: "What's a good passcode for a 5 year old's tablet, and how do I set parental controls?",
  },
  {
    id: "en-276",
    lang: "en",
    text: "The DMV appointment is at 9:40 and I need 2 proofs of residency. What counts?",
  },
  {
    id: "en-277",
    lang: "en",
    text: "My medicare card came in the mail. Should I keep it in my wallet?",
  },
  {
    id: "en-278",
    lang: "en",
    text: "Can you explain the difference between a routing number and an account number?",
  },
  {
    id: "en-279",
    lang: "en",
    text: "docker run -p 8080:80 -e NODE_ENV=production -v /data:/app/data myapp:1.4.2 fails with exit code 137, why?",
  },
  {
    id: "en-280",
    lang: "en",
    text: "kubectl get pods -n prod shows CrashLoopBackOff for api-7f9c8d6b5-x2k4p after 12 restarts.",
  },
  {
    id: "en-281",
    lang: "en",
    text: "My SQL is SELECT * FROM orders WHERE created_at > '2024-03-01' AND total > 100 ORDER BY id DESC LIMIT 50. It's slow.",
  },
  {
    id: "en-282",
    lang: "en",
    text: "TypeError: Cannot read properties of undefined (reading 'map') at UserList (UserList.jsx:42:18)",
  },
  {
    id: "en-283",
    lang: "en",
    text: "git log shows commit 3f9a2c1 by me on 2024-05-12; how do I revert it without losing 8e7d6b5?",
  },
  {
    id: "en-284",
    lang: "en",
    text: "The CI job fails at step 4 of 9: npm ERR! code ERESOLVE unable to resolve dependency tree react@18.2.0",
  },
  {
    id: "en-285",
    lang: "en",
    text: "nginx returns 502 Bad Gateway; upstream is 127.0.0.1:3000 and the logs say connect() failed (111).",
  },
  {
    id: "en-286",
    lang: "en",
    text: "Our Redis uses 2.3 GB of 4 GB; maxmemory-policy allkeys-lru. Should I raise it?",
  },
  {
    id: "en-287",
    lang: "en",
    text: "The Python script throws KeyError: 'user_id' on line 88 when the JSON has 1,024 records.",
  },
  {
    id: "en-288",
    lang: "en",
    text: "How do I set password complexity rules in Django: min length 12, at least 1 digit and 1 symbol?",
  },
  {
    id: "en-289",
    lang: "en",
    text: "Our OAuth flow redirects to /callback?code=... and then fails with invalid_grant. What's wrong?",
  },
  {
    id: "en-290",
    lang: "en",
    text: "The login endpoint returns 401 when the token is expired; how should the frontend refresh it?",
  },
  {
    id: "en-291",
    lang: "en",
    text: "The JWT has exp 1735689600 and iat 1735603200; is a 24 hour expiry reasonable?",
  },
  {
    id: "en-292",
    lang: "en",
    text: "My regex ^\\d{3}-\\d{2}-\\d{4}$ is supposed to validate SSN format; is it right?",
  },
  {
    id: "en-293",
    lang: "en",
    text: "The API rate limit is 1000 requests per 15 minutes per IP; we get 429 after about 600.",
  },
  {
    id: "en-294",
    lang: "en",
    text: "Terraform plan wants to destroy aws_instance.web[0]; how do I keep it and change the AMI?",
  },
  {
    id: "en-295",
    lang: "en",
    text: 'The unit test expects 200 but got 500 on POST /api/users with body {"name": "test"}.',
  },
  {
    id: "en-296",
    lang: "en",
    text: "Our Postgres connection pool is 20; with 50 workers we see too many connections. Fix?",
  },
  {
    id: "en-297",
    lang: "en",
    text: "How do I hash passwords with argon2 in Node, and what memory cost should I use?",
  },
  {
    id: "en-298",
    lang: "en",
    text: "The cron job 0 2 * * * runs twice on the 1st of the month. Why?",
  },
  {
    id: "en-299",
    lang: "en",
    text: "Explain the difference between session cookies and JWTs for authentication.",
  },
  {
    id: "en-300",
    lang: "en",
    text: "The backup codes feature should generate 10 codes of 8 characters; how do I store them safely?",
  },
  {
    id: "en-301",
    lang: "en",
    text: "Our remote access VPN uses port 1194 UDP; clients time out after 60 seconds.",
  },
  {
    id: "en-302",
    lang: "en",
    text: "In the Android app, versionCode 42 and versionName 3.1.4 fail to upload to Play Console.",
  },
  {
    id: "en-303",
    lang: "en",
    text: "The CSV import fails on row 3,412 where the phone column has 555-555-01 (too short).",
  },
  {
    id: "en-304",
    lang: "en",
    text: "Performance: p95 latency went from 120 ms to 480 ms after deploy 2024.05.12-3.",
  },
  {
    id: "en-305",
    lang: "en",
    text: "How do I rotate the API key without downtime if clients cache it for 24 hours?",
  },
  {
    id: "en-306",
    lang: "en",
    text: "Explain what a recovery key is in BitLocker and where Windows stores it.",
  },
  { id: "en-307", lang: "en", text: "someone phoned at noon" },
  { id: "en-308", lang: "en", text: "I have 2 cats and 3 dogs" },
  { id: "en-309", lang: "en", text: "I work at google dot com" },
  { id: "en-310", lang: "en", text: "the invoice was $4,250,000" },
  { id: "en-311", lang: "en", text: "sixty seven people from Ohio" },
  { id: "en-312", lang: "en", text: "meet me on 2026-09-23 at 10:30" },
  {
    id: "en-313",
    lang: "en",
    text: "my password is incorrect, how do I reset it?",
  },
  { id: "en-314", lang: "en", text: "reset your password: click the link" },
  { id: "en-315", lang: "en", text: "a 5 star place to eat" },
  { id: "en-316", lang: "en", text: "it's a 5 minutes drive from here" },
  { id: "en-317", lang: "en", text: "I walked down Main Street" },
  { id: "en-318", lang: "en", text: "the meeting is 3/14/2026" },
  { id: "en-319", lang: "en", text: "my birthday is coming up soon" },
  { id: "en-320", lang: "en", text: "I have 2 accounts at the bank" },
  { id: "en-321", lang: "en", text: "the license is MIT" },
  { id: "en-322", lang: "en", text: "I want to go for a walk at 5 to 6" },
  { id: "en-323", lang: "en", text: "we won 2 to 1 and ate for free" },
  { id: "en-324", lang: "en", text: "the score went from +3 to +7" },
  { id: "en-325", lang: "en", text: "version 10.2.3 and build 10.0.19041.1" },
  { id: "en-326", lang: "en", text: "the local news and internal memo" },
  {
    id: "en-327",
    lang: "en",
    text: "How do I turn on two-step verification? The site shows a QR code and says to scan the otpauth QR in your app.",
  },
  {
    id: "en-328",
    lang: "en",
    text: "What's the difference between TOTP and HOTP in authenticator apps like Authy or Google Authenticator?",
  },
  {
    id: "en-329",
    lang: "en",
    text: "My authenticator app says the setup key is invalid. What does this mean and what should I check?",
  },
  {
    id: "en-330",
    lang: "en",
    text: "Is it safe to back up my 2FA codes to the cloud, or should I print the recovery sheet and keep it in a drawer?",
  },
  {
    id: "en-331",
    lang: "en",
    text: "Write a short guide for my parents: open Google Authenticator, tap the plus sign, then scan the code on the screen.",
  },
  {
    id: "en-332",
    lang: "en",
    text: "Can't scan the QR code? The page says to enter the setup key instead, but where is it?",
  },
  {
    id: "en-333",
    lang: "en",
    text: "Where do I find the VIN on a 2014 Ford F-150? The dealer asked for it before they'll book the recall.",
  },
  {
    id: "en-334",
    lang: "en",
    text: "What does each part of a VIN mean? I know the 10th character is the model year.",
  },
  {
    id: "en-335",
    lang: "en",
    text: "The VIN is on the dashboard and on the door frame, right? Which one does the DMV want?",
  },
  {
    id: "en-336",
    lang: "en",
    text: "The car's ECU part number is 89661-0C330. Is that the same as 89661-0C331 or do I need the exact one?",
  },
  {
    id: "en-337",
    lang: "en",
    text: "My truck's build sheet shows option code 1SZ and engine code L83. What do those mean?",
  },
  {
    id: "en-338",
    lang: "en",
    text: "Our order export has 17-character SKUs like ABC12345678901234. How do I split them into three columns in Excel?",
  },
  {
    id: "en-339",
    lang: "en",
    text: "The insurance company wants a photo of the odometer and the title. What else should I bring to the claim?",
  },
  {
    id: "en-340",
    lang: "en",
    text: "Write a short ad for my 2012 Honda Civic: 98,000 miles, new tires, one owner, asking $7,500.",
  },
  {
    id: "en-341",
    lang: "en",
    text: "Git says detached HEAD at 4f9c2a1b7e3d5f6a8 after I checked out the truck-tracker branch. How do I get back?",
  },
  {
    id: "en-342",
    lang: "en",
    text: "Recall 23V-456 says the airbag in my car needs replacing. Is it safe to drive until the dealer fixes it?",
  },
  {
    id: "en-343",
    lang: "en",
    text: "Is a Toyota RAV4 or a Honda CR-V better for a family of four with a dog?",
  },
  {
    id: "en-344",
    lang: "en",
    text: "My registration renewal says the vehicle has an open emissions recall. What happens if I ignore it?",
  },
  {
    id: "en-345",
    lang: "en",
    text: "I'm a student at a community college. How do I ask a professor for an extension politely?",
  },
  {
    id: "en-346",
    lang: "en",
    text: "The student ID card office is closed until 9. Can I still pick up my textbooks before class?",
  },
  {
    id: "en-347",
    lang: "en",
    text: "Our school has 1,200 students and 85 teachers. Is that a normal ratio for a high school?",
  },
  {
    id: "en-348",
    lang: "en",
    text: "Do I need my student ID for the 2026 SAT, or is a passport enough?",
  },
  {
    id: "en-349",
    lang: "en",
    text: "Explain the difference between CS 101 and CS 161 at my university.",
  },
  {
    id: "en-350",
    lang: "en",
    text: "Write a note for my class: student numbers 1 to 15 present on Monday, 16 to 30 on Tuesday.",
  },
  {
    id: "en-351",
    lang: "en",
    text: "My school ID photo is awful. Can I ask for a new one, and how do I word the email?",
  },
  {
    id: "en-352",
    lang: "en",
    text: "What's a matriculation ceremony and what do I wear to it?",
  },
  {
    id: "en-353",
    lang: "en",
    text: "How do I read a UK number plate? What do the two letters at the start mean?",
  },
  {
    id: "en-354",
    lang: "en",
    text: "Is the license plate HAPPY still available in Ohio, and how much does a vanity plate cost?",
  },
  {
    id: "en-355",
    lang: "en",
    text: "My rego is due next week. Can I still drive the car if I pay it a day late?",
  },
  {
    id: "en-356",
    lang: "en",
    text: "Company registration number vs VAT number: what's the difference for a small business?",
  },
  {
    id: "en-357",
    lang: "en",
    text: "I need a plate for 12 people and 3 serving bowls. What should I buy for the party?",
  },
  {
    id: "en-358",
    lang: "en",
    text: "The license plate reader at the parking garage didn't open the gate. Who do I complain to?",
  },
  {
    id: "en-359",
    lang: "en",
    text: "What does a green number plate mean on a car in the UK?",
  },
  {
    id: "en-360",
    lang: "en",
    text: "Which plate number is the right one in the cake recipe, the 9-inch or the 10-inch?",
  },
  {
    id: "en-361",
    lang: "en",
    text: "Group the kids by age: two to four, five to seven, eight to ten.",
  },
  {
    id: "en-362",
    lang: "en",
    text: "Kids from five to eight, eight to twelve, and twelve to fifteen.",
  },
  {
    id: "en-363",
    lang: "en",
    text: "Sizes run two to four, six to eight, ten to twelve.",
  },
  {
    id: "en-364",
    lang: "en",
    text: "Rest one to two minutes, then do three to five sets of six to eight reps.",
  },
  {
    id: "en-365",
    lang: "en",
    text: "Simmer for two to three minutes, then four to five more.",
  },
  {
    id: "en-366",
    lang: "en",
    text: "Take one to two tablets every four to six hours, no more than eight in a day.",
  },
  {
    id: "en-367",
    lang: "en",
    text: "Water every two to three days for four to six weeks.",
  },
  {
    id: "en-368",
    lang: "en",
    text: "Steep three to five minutes; two to three for green tea.",
  },
  {
    id: "en-369",
    lang: "en",
    text: "We won two games, ate four pizzas and stayed up too late, too.",
  },
  {
    id: "en-370",
    lang: "en",
    text: "She ate eight cookies, too, and won two prizes.",
  },
  {
    id: "en-371",
    lang: "en",
    text: "Too tired to cook, too broke to order, so I ate two apples.",
  },
  {
    id: "en-372",
    lang: "en",
    text: "Can you help? I won two tickets too, for four people on the eighth.",
  },
  {
    id: "en-373",
    lang: "en",
    text: "The puppy ate two socks, too, and won the hearts of four kids, too.",
  },
  {
    id: "en-374",
    lang: "en",
    text: "Add me on Discord, I'm usually on after school.",
  },
  {
    id: "en-375",
    lang: "en",
    text: "My tag is still on the new jacket, can I return it without the receipt?",
  },
  {
    id: "en-376",
    lang: "en",
    text: "What's a good gamertag for someone who likes space and cats?",
  },
  {
    id: "en-377",
    lang: "en",
    text: "How do I change my Xbox gamertag for free a second time?",
  },
  {
    id: "en-378",
    lang: "en",
    text: "My gamertag is private, so how did a stranger find my games?",
  },
  {
    id: "en-379",
    lang: "en",
    text: "My son wants a Roblox username. What are the rules for kids under 13?",
  },
  {
    id: "en-380",
    lang: "en",
    text: "Roblox username ideas that aren't taken yet?",
  },
  {
    id: "en-381",
    lang: "en",
    text: "Is my Steam name visible to people I'm not friends with?",
  },
  {
    id: "en-382",
    lang: "en",
    text: "My Discord username is case sensitive, right? I keep typing it wrong.",
  },
  {
    id: "en-383",
    lang: "en",
    text: "Why does my PSN ID show a 1 at the end after the name change?",
  },
  {
    id: "en-384",
    lang: "en",
    text: "IGN gave the new Zelda a 9. Is it worth buying at full price?",
  },
  {
    id: "en-385",
    lang: "en",
    text: "I read on IGN that the sequel is delayed to 2027.",
  },
  {
    id: "en-386",
    lang: "en",
    text: "My in-game name is too long for the scoreboard, any shorter ideas?",
  },
  {
    id: "en-387",
    lang: "en",
    text: "The BattleTag change costs $10. Is it worth it just for a new name?",
  },
  {
    id: "en-388",
    lang: "en",
    text: "My Riot ID was reset after the update and my friends can't find me.",
  },
  {
    id: "en-389",
    lang: "en",
    text: "What's the difference between a Steam ID and a Steam username?",
  },
  {
    id: "en-390",
    lang: "en",
    text: "My summoner name is the same as my Discord name, is that a bad idea?",
  },
  {
    id: "en-391",
    lang: "en",
    text: "My kid's Minecraft name is his real first name. Should he change it?",
  },
  {
    id: "en-392",
    lang: "en",
    text: "Use my friend code ABC123 to get $10 off your first order.",
  },
  {
    id: "en-393",
    lang: "en",
    text: "What is a Switch friend code and where do I find it?",
  },
  {
    id: "en-394",
    lang: "en",
    text: "Steam tag: Roguelike. What are the best games with it?",
  },
  {
    id: "en-395",
    lang: "en",
    text: "The epic name of the hero is Beowulf. Write a poem about him.",
  },
  {
    id: "en-396",
    lang: "en",
    text: "My Xbox gamertag is so embarrassing, help me pick a new one.",
  },
  {
    id: "en-397",
    lang: "en",
    text: "The Roblox ID for the song is 1837070127. Can I use it in my game?",
  },
  {
    id: "en-398",
    lang: "en",
    text: "My gamertag is 2nd on the leaderboard this week!",
  },
  {
    id: "en-399",
    lang: "en",
    text: "The Xbox name is Microsoft's, not Sony's. Write a quiz question about it.",
  },
  {
    id: "en-400",
    lang: "en",
    text: "The name on Steam is Hollow Knight, but on Switch it has a subtitle.",
  },
  {
    id: "en-401",
    lang: "en",
    text: "A Discord user is sending my daughter messages. What do I do?",
  },
  {
    id: "en-402",
    lang: "en",
    text: "My gamertag is just numbers, is that weird?",
  },
  {
    id: "en-403",
    lang: "en",
    text: "Is Discord safe for a 12 year old? What settings should I turn on?",
  },
  {
    id: "en-404",
    lang: "en",
    text: "I lost my ID. 2 days later it turned up in the laundry basket.",
  },
  {
    id: "en-405",
    lang: "en",
    text: "I renewed my passport. 6 weeks later it finally showed up in the mail.",
  },
  {
    id: "en-406",
    lang: "en",
    text: "Finally passed and got my driver's license. 3 tries, but I did it!",
  },
  {
    id: "en-407",
    lang: "en",
    text: "I changed my password. Thanks for the tip about the password manager!",
  },
  {
    id: "en-408",
    lang: "en",
    text: "Forgot my password again. Second time this week, how do I make one I'll remember?",
  },
  {
    id: "en-409",
    lang: "en",
    text: "I reset my password. Everything works now, thanks.",
  },
  {
    id: "en-410",
    lang: "en",
    text: "Update your password. Then sign out of every other device. Is that the right order?",
  },
  {
    id: "en-411",
    lang: "en",
    text: "I checked my IP. 3 devices on my network show the same one, is that normal?",
  },
  {
    id: "en-412",
    lang: "en",
    text: "It's my birthday. 40 candles is a fire hazard, right?",
  },
  {
    id: "en-413",
    lang: "en",
    text: "They sent me a code. 20 minutes later it had already expired. Why?",
  },
  {
    id: "en-414",
    lang: "en",
    text: "I need my student ID. 10 minutes until the library closes, should I run?",
  },
  {
    id: "en-415",
    lang: "en",
    text: "I got a new license plate. 150 dollars at the DMV, is that normal?",
  },
  {
    id: "en-416",
    lang: "en",
    text: "Which is better for a savings account. 4% or 4.5% with fees?",
  },
  {
    id: "en-417",
    lang: "en",
    text: "I applied to replace my social security card. 3 weeks and nothing yet, should I call?",
  },
  {
    id: "en-418",
    lang: "en",
    text: "The DMV took my picture for the new DL. 45 minutes in line for a 2-second photo.",
  },
  {
    id: "en-419",
    lang: "en",
    text: "My date of birth. 1 thing I hate typing on every single form.",
  },
  {
    id: "en-420",
    lang: "en",
    text: "Please enter the passcode. Thanks, now tap Continue.",
  },
  {
    id: "en-421",
    lang: "en",
    text: "We counted to twelve. Oak Street was next on the parade route.",
  },
  {
    id: "en-422",
    lang: "en",
    text: "My locker code. Never mind, I found the sticky note.",
  },
  {
    id: "en-423",
    lang: "en",
    text: "Which PIN. The one for the card or the one for the phone?",
  },
  {
    id: "en-424",
    lang: "en",
    text: "My username. Honestly I forget which one I used for this site.",
  },
  {
    id: "en-425",
    lang: "en",
    text: "I need to call about my medical record. 2 pages are missing from what they mailed me.",
  },
  {
    id: "en-426",
    lang: "en",
    text: "Check the routing number. 9 digits, and the bank's name should be on it.",
  },
  {
    id: "en-427",
    lang: "en",
    text: "Lost my passport. Embassy says 10 business days for a new one, is that right?",
  },
  {
    id: "en-428",
    lang: "en",
    text: "My SSN. 3 different people asked for it today, is that a scam?",
  },
  {
    id: "en-429",
    lang: "en",
    text: "I forgot what my password is. Thanks for helping me reset it last time.",
  },
  {
    id: "en-430",
    lang: "en",
    text: "i don't know what my roblox username is. lol can you help me find it",
  },
  {
    id: "en-431",
    lang: "en",
    text: "That's just how my username is. Weird, right?",
  },
  { id: "en-432", lang: "en", text: "I'll be there in 5 minutes. Drive safe!" },
  {
    id: "en-433",
    lang: "en",
    text: "We bought 2 tickets. Elm Street Theater was packed, so we sat in the back.",
  },
  {
    id: "en-434",
    lang: "en",
    text: "Order 555 never arrived. Main Street was closed for the parade, maybe that's why?",
  },
  {
    id: "en-435",
    lang: "en",
    text: "We drove 300 miles. Highway traffic was awful the whole way.",
  },
  {
    id: "en-436",
    lang: "en",
    text: "See you at 5 p.m. Drive safe and text me when you leave.",
  },
  {
    id: "en-437",
    lang: "en",
    text: "We land at 6 a.m. Main Street will still be closed, so take the long way.",
  },
  {
    id: "en-438",
    lang: "en",
    text: "We met at twelve thirty. Elm Street was busy, so we walked.",
  },
  {
    id: "en-439",
    lang: "en",
    text: "Our hotel room is 214. Court Street is right outside the window.",
  },
  {
    id: "en-440",
    lang: "en",
    text: "I finally hit level 50. Way more fun than I expected!",
  },
  {
    id: "en-441",
    lang: "en",
    text: "My son just turned 12. Park Avenue had a parade that day, can you believe it?",
  },
  {
    id: "en-442",
    lang: "en",
    text: "I waited 5 minutes. Way too long for a coffee.",
  },
  {
    id: "en-443",
    lang: "en",
    text: "Season 4 just dropped. Drive is the best episode so far.",
  },
  {
    id: "en-444",
    lang: "en",
    text: "Our flight is 1492. Gate 22 is at the other end of the airport.",
  },
  {
    id: "en-445",
    lang: "en",
    text: "It happened back in 2019. Nine one one is the number I called, and they were great.",
  },
  {
    id: "en-446",
    lang: "en",
    text: "It's 2024. Five five five numbers are still in every movie, why?",
  },
  {
    id: "en-447",
    lang: "en",
    text: "Bake at three fifty for twenty to twenty. Five minutes more if it's not golden.",
  },
  {
    id: "en-448",
    lang: "en",
    text: "I counted 42. Twenty more showed up after lunch.",
  },
  {
    id: "en-449",
    lang: "en",
    text: "We waited ten minutes. Five more and we would have left.",
  },
  {
    id: "en-450",
    lang: "en",
    text: "The final score was 3 to 2. Nine of them stayed for the party.",
  },
  {
    id: "en-451",
    lang: "en",
    text: "What time is it there? Nine thirty here.",
  },
  {
    id: "en-452",
    lang: "en",
    text: "Is my score good? Five hundred seems low.",
  },
  {
    id: "en-453",
    lang: "en",
    text: "We need 4 more chairs! Twenty people are coming.",
  },
  {
    id: "en-454",
    lang: "en",
    text: "The total came to 937. Oh, one more thing, the tip isn't included.",
  },
  {
    id: "en-455",
    lang: "en",
    text: "I forgot my password\nThanks for reminding me to write it down!",
  },
  {
    id: "en-456",
    lang: "en",
    text: "Update the password\nThen sign out of every other device.",
  },
  {
    id: "en-457",
    lang: "en",
    text: "I forgot my password\nSarah said the reset link expired.",
  },
  {
    id: "en-458",
    lang: "en",
    text: "Call me around five\nMain Street is closed, so I'll be late.",
  },
  {
    id: "en-459",
    lang: "en",
    text: "My son wants the 3 numbers on the back of the jersey to be his birthday. Is that allowed in youth soccer?",
  },
  {
    id: "en-460",
    lang: "en",
    text: "The 3 numbers on the back of the jersey are the player's old number, right?",
  },
  {
    id: "en-461",
    lang: "en",
    text: "The back of the book has 3 numbers under the barcode. What do they mean?",
  },
  {
    id: "en-462",
    lang: "en",
    text: "There are 3 numbers on the back of the receipt, 042, 117 and 380. Are they the store and the register?",
  },
  {
    id: "en-463",
    lang: "en",
    text: "The product code on the back is 123, but the store's website lists 124. Which one do I order?",
  },
  {
    id: "en-464",
    lang: "en",
    text: "Our hotel room number is 123 and the view is great. What should we see near the harbor?",
  },
  {
    id: "en-465",
    lang: "en",
    text: "Is 123 a good score on the practice test?",
  },
  {
    id: "en-466",
    lang: "en",
    text: "What are the three digits on the back of a credit card for, and why do websites ask for them?",
  },
  {
    id: "en-467",
    lang: "en",
    text: "The CVV is 3 digits on the back, or 4 on the front for Amex. Do debit cards have one too?",
  },
  {
    id: "en-468",
    lang: "en",
    text: "The security code is three to four digits, depending on the card.",
  },
  {
    id: "en-469",
    lang: "en",
    text: "My card's security code rubbed off. How do I get a new card?",
  },
  {
    id: "en-470",
    lang: "en",
    text: "I'm taking CSC 210 this fall. Is it hard if I only know a little Python?",
  },
  {
    id: "en-471",
    lang: "en",
    text: "The code on the back is too faded to read. Can the store still activate the gift card?",
  },
  {
    id: "en-472",
    lang: "en",
    text: "The numbers on the back of the TV remote are 3 and 4 for the batteries.",
  },
  {
    id: "en-473",
    lang: "en",
    text: "Page 123 of the manual says the code on the back of the router resets it.",
  },
  {
    id: "en-474",
    lang: "en",
    text: "Can I take a picture of the back of my card for my records, or is that a bad idea?",
  },
  {
    id: "en-475",
    lang: "en",
    text: "I got a $50 Amazon gift card for my birthday. What's a good book to buy with it?",
  },
  {
    id: "en-476",
    lang: "en",
    text: "My gift card balance says $25.00 but the store says $20. Who do I believe?",
  },
  {
    id: "en-477",
    lang: "en",
    text: "Order 112-4567890-1234567 hasn't shipped yet. Should I write to the seller?",
  },
  {
    id: "en-478",
    lang: "en",
    text: "Can I pay for order 112-4567890-1234567 with an Amazon gift card, or only part of it?",
  },
  {
    id: "en-479",
    lang: "en",
    text: "The gift card code didn't work at checkout. Do I redeem it at amazon.com/redeem first?",
  },
  {
    id: "en-480",
    lang: "en",
    text: "I bought 3 Roblox gift cards for the kids' birthdays. Which amounts make sense for 9 and 12 year olds?",
  },
  {
    id: "en-481",
    lang: "en",
    text: "Write a thank-you note for a $100 Visa gift card from my coworkers.",
  },
  {
    id: "en-482",
    lang: "en",
    text: "Steam card prices went up this year, from $20 to $23. Is that normal?",
  },
  {
    id: "en-483",
    lang: "en",
    text: "The tracking code they sent me is 48291345 but the courier's site says it doesn't exist. What should I try?",
  },
  {
    id: "en-484",
    lang: "en",
    text: "The promo code they emailed me is 4821 and checkout says it expired yesterday. Can they do that?",
  },
  {
    id: "en-485",
    lang: "en",
    text: "I got error code 5001 and the fix in the help article didn't work. What does 5001 usually mean?",
  },
  {
    id: "en-486",
    lang: "en",
    text: "The ambulance came as a code 3. What does code 3 mean?",
  },
  {
    id: "en-487",
    lang: "en",
    text: "The verification code expired before I could type it in. How do I get a new one?",
  },
  {
    id: "en-488",
    lang: "en",
    text: "The code they texted me expired. Is it safe to ask for another one, or is that how scams start?",
  },
  {
    id: "en-489",
    lang: "en",
    text: "My code is 3000 lines long. Can you review it one function at a time?",
  },
  {
    id: "en-490",
    lang: "en",
    text: "The code I got from the tutorial is 1500 lines. Where do I even start?",
  },
  {
    id: "en-491",
    lang: "en",
    text: "Where do I find my account number on a check, and which one is the routing number?",
  },
  {
    id: "en-492",
    lang: "en",
    text: "212 is the area code for Manhattan, right?",
  },
  {
    id: "en-493",
    lang: "en",
    text: "My order number is 113-2846159-7730214 and the tracking number is 9361289744390612445812. Where's my package?",
  },
  {
    id: "en-494",
    lang: "en",
    text: "How do I upgrade from version 2.14.3 to 3.0.1 without breaking my lockfile? I also have react@18.2.0 and lodash@4.17.21 pinned.",
  },
  {
    id: "en-495",
    lang: "en",
    text: "I'm on Python 3.12.4 on Ubuntu 22.04.3 LTS and pip says the wheel needs glibc 2.35.",
  },
  {
    id: "en-496",
    lang: "en",
    text: "Order #W123456789 hasn't shipped and the tracking number 1Z999AA10123456784 shows nothing. What should I write to support?",
  },
  {
    id: "en-497",
    lang: "en",
    text: "The log says 2024-03-15T14:22:31.123Z ERROR timeout after 30000 ms, and the next line is timestamp 1712345678901. Is that in milliseconds?",
  },
  {
    id: "en-498",
    lang: "en",
    text: "Can you double this recipe? 2 1/2 cups flour, 1 tsp salt, 350 g sugar, 3 eggs, bake at 375 for 25-30 minutes.",
  },
  {
    id: "en-499",
    lang: "en",
    text: 'Why does this fail?\n```\nconst password = req.body.password;\nif (!password || password.length < 8) throw new Error("weak password");\n```',
  },
  {
    id: "en-500",
    lang: "en",
    text: "Is this .env template fine to commit? It has no values yet.\n```\nPASSWORD=\nUSERNAME=admin\nDB_PASSWORD=\nDB_USER=postgres\nSECRET_KEY=\nALLOWED_HOSTS=localhost,example.com\n```",
  },
  {
    id: "en-501",
    lang: "en",
    text: "My config reads `DB_PASSWORD=${DB_PASSWORD}` and `password: process.env.DB_PASSWORD`, but the container says it's undefined.",
  },
  {
    id: "en-502",
    lang: "en",
    text: "The README says to set OPENAI_API_KEY=your-api-key-here and then call api_key = os.environ['OPENAI_API_KEY']. Where does that go on Windows?",
  },
  {
    id: "en-503",
    lang: "en",
    text: '<input type="password" name="password" /> doesn\'t show the eye icon in Safari. How do I add one?',
  },
  {
    id: "en-504",
    lang: "en",
    text: 'The API returns {"password": "string", "token": "string"} in the schema. Is that a bug in the OpenAPI file?',
  },
  {
    id: "en-505",
    lang: "en",
    text: "Invoice INV-2024-00123 is overdue and the build number on the receipt is 20240315.4. How do I word a reminder?",
  },
  {
    id: "en-506",
    lang: "en",
    text: "Windows shows error code 0x80070005 when I copy commit 7f3a9c2e17b4d8a6f0e5c9b2d7a1f4e8c3b2a1d0 to the share.",
  },
  {
    id: "en-507",
    lang: "en",
    text: "The book's ISBN is 978-0-306-40615-7, chapter 12, verses 4 to 19. Can you summarize it?",
  },
  {
    id: "en-508",
    lang: "en",
    text: "My package weighs 12.04 kg and the flight UA 1234 departs at 6:45. Will it fit the carry-on limit?",
  },
  {
    id: "en-509",
    lang: "en",
    text: "The docs' curl example is `curl -u user:password https://example.com/api`. Do I replace both words?",
  },
  {
    id: "en-510",
    lang: "en",
    text: "What should a strong password look like? Mine keeps getting rejected as too short.",
  },
  { id: "en-511", lang: "en", text: "The date is 06 12 2026." },
  { id: "en-512", lang: "en", text: "The date is 06.12.2026." },
  { id: "en-513", lang: "en", text: "The time is 06:12." },
  { id: "en-514", lang: "en", text: "The price is 06,12 €." },
  {
    id: "es-001",
    lang: "es",
    text: "¿Me ayudas a escribir un correo para rechazar una reunión el martes que viene?",
  },
  {
    id: "es-002",
    lang: "es",
    text: "¿Cuál es la diferencia entre un plan de pensiones y un fondo indexado?",
  },
  {
    id: "es-003",
    lang: "es",
    text: "Tengo dos o tres dudas sobre la receta: ¿cuántos gramos de harina lleva, 250 o 300?",
  },
  {
    id: "es-004",
    lang: "es",
    text: "Explícame el teorema de Pitágoras con un ejemplo de 3, 4 y 5.",
  },
  {
    id: "es-005",
    lang: "es",
    text: "La reunión es a las 10:30 en la sala 4B, ¿cómo lo digo de forma más formal?",
  },
  {
    id: "es-006",
    lang: "es",
    text: "Todos los días camino cinco kilómetros, ¿cuántas calorías gasto más o menos?",
  },
  {
    id: "es-007",
    lang: "es",
    text: "Resume este artículo en tres puntos, por favor.",
  },
  {
    id: "es-008",
    lang: "es",
    text: "¿Qué significa el error 404 y cómo lo arreglo en Nginx?",
  },
  {
    id: "es-009",
    lang: "es",
    text: "Quiero aprender Python desde cero, ¿por dónde empiezo?",
  },
  {
    id: "es-010",
    lang: "es",
    text: "Mi hijo tiene ocho años y le cuesta leer, ¿qué libros me recomiendas?",
  },
  { id: "es-011", lang: "es", text: "Calcula el 21 % de 1.250 euros." },
  {
    id: "es-012",
    lang: "es",
    text: "La versión 3.2.1 de la aplicación falla al abrir, ¿qué puede ser?",
  },
  {
    id: "es-013",
    lang: "es",
    text: "Escribe un poema corto sobre el mar y la luna.",
  },
  {
    id: "es-014",
    lang: "es",
    text: '¿Cómo se dice "nos vemos mañana" en inglés y en francés?',
  },
  {
    id: "es-015",
    lang: "es",
    text: "Tengo una entrevista de trabajo el lunes, ¿qué preguntas suelen hacer?",
  },
  {
    id: "es-016",
    lang: "es",
    text: 'Traduce esto al inglés: "El pedido llegará entre el 3 y el 5 de octubre".',
  },
  {
    id: "es-017",
    lang: "es",
    text: "¿Cuántos días hay entre el 12 de marzo y el 30 de abril?",
  },
  {
    id: "es-018",
    lang: "es",
    text: "Ayúdame a organizar una fiesta para veinte personas con un presupuesto de 400 euros.",
  },
  {
    id: "es-019",
    lang: "es",
    text: "¿Es mejor pintar la calle de la casa de campo o dejar la piedra natural?",
  },
  {
    id: "es-020",
    lang: "es",
    text: "La calle está muy mojada hoy, ¿qué zapatos me pongo para correr?",
  },
  {
    id: "es-021",
    lang: "es",
    text: "Vivo cerca de una avenida con mucho tráfico, ¿cómo reduzco el ruido en casa?",
  },
  {
    id: "es-022",
    lang: "es",
    text: "Dame una lista de diez películas clásicas españolas.",
  },
  {
    id: "es-023",
    lang: "es",
    text: "Mi equipo ganó 3 a 1 el sábado, escribe una crónica divertida.",
  },
  {
    id: "es-024",
    lang: "es",
    text: "¿Qué es una clave primaria en una base de datos?",
  },
  {
    id: "es-025",
    lang: "es",
    text: "Olvidé la contraseña de mi correo, ¿cuáles son los pasos para recuperarla?",
  },
  {
    id: "es-026",
    lang: "es",
    text: "¿Por qué mi contraseña tiene que tener al menos ocho caracteres?",
  },
  {
    id: "es-027",
    lang: "es",
    text: "Explícame qué es un certificado SSL y por qué el candado es importante.",
  },
  {
    id: "es-028",
    lang: "es",
    text: "El paquete pesa 2,5 kg y mide 40 x 30 x 20 cm, ¿cuánto cuesta enviarlo?",
  },
  {
    id: "es-029",
    lang: "es",
    text: 'Corrige la ortografía: "haber si vienes a las siete y media".',
  },
  {
    id: "es-030",
    lang: "es",
    text: "Quiero correr una maratón en seis meses, hazme un plan de entrenamiento.",
  },
  {
    id: "es-031",
    lang: "es",
    text: "¿Cuál es la capital de Australia y cuántos habitantes tiene?",
  },
  {
    id: "es-032",
    lang: "es",
    text: "Escribe una función en JavaScript que sume los números del 1 al 100.",
  },
  {
    id: "es-033",
    lang: "es",
    text: "¿Cómo configuro dos monitores en Windows 11?",
  },
  {
    id: "es-034",
    lang: "es",
    text: "Mi planta tiene hojas amarillas desde hace una semana, ¿qué le pasa?",
  },
  {
    id: "es-035",
    lang: "es",
    text: "Recomiéndame un plan de tres días en Madrid visitando la Plaza Mayor y el Retiro.",
  },
  {
    id: "es-036",
    lang: "es",
    text: "El vuelo IB 3456 sale a las 7:45, ¿con cuánta antelación tengo que estar en el aeropuerto?",
  },
  { id: "es-037", lang: "es", text: "¿Cuántas cucharadas son 100 mililitros?" },
  {
    id: "es-038",
    lang: "es",
    text: "Haz un resumen del capítulo 12 del libro.",
  },
  {
    id: "es-039",
    lang: "es",
    text: "Tengo 34 años y quiero cambiar de carrera, ¿es tarde para estudiar programación?",
  },
  {
    id: "es-040",
    lang: "es",
    text: "Explícame la regla de tres con un ejemplo: si 4 manzanas cuestan 2 euros, ¿cuánto cuestan 10?",
  },
  {
    id: "es-041",
    lang: "es",
    text: "¿Qué significa la señal de tráfico con un círculo rojo y un número 50?",
  },
  {
    id: "es-042",
    lang: "es",
    text: "Escribe un mensaje de cumpleaños para mi abuela que cumple noventa años.",
  },
  {
    id: "es-043",
    lang: "es",
    text: "¿Qué diferencia hay entre el IVA del 10 % y el del 21 %?",
  },
  {
    id: "es-044",
    lang: "es",
    text: "Mi portátil tiene 8 GB de RAM y 256 GB de disco, ¿me sirve para editar vídeo?",
  },
  {
    id: "es-045",
    lang: "es",
    text: "¿Cómo hago una tabla dinámica en Excel con los datos de 2023 y 2024?",
  },
  {
    id: "es-046",
    lang: "es",
    text: "El código de error del lavavajillas es E24, ¿qué significa?",
  },
  {
    id: "es-047",
    lang: "es",
    text: "Dame ideas de nombres para una cafetería en la calle principal del pueblo.",
  },
  {
    id: "es-048",
    lang: "es",
    text: "¿Cómo explico a mis alumnos de primero la suma con llevadas?",
  },
  {
    id: "es-049",
    lang: "es",
    text: "Pásame una receta de tortilla de patatas para cuatro personas.",
  },
  {
    id: "es-050",
    lang: "es",
    text: "¿Qué es la inflación y por qué suben los precios?",
  },
  {
    id: "es-051",
    lang: "es",
    text: "Escribe un correo al casero diciendo que la caldera no funciona desde el jueves.",
  },
  {
    id: "es-052",
    lang: "es",
    text: "¿Cuál es el mejor horario para dormir si trabajo de 22:00 a 6:00?",
  },
  {
    id: "es-053",
    lang: "es",
    text: "Ayúdame a entender la factura de la luz: 245 kWh a 0,15 euros el kWh.",
  },
  {
    id: "es-054",
    lang: "es",
    text: "¿Qué ejercicios puedo hacer en casa con una mancuerna de 5 kilos?",
  },
  {
    id: "es-055",
    lang: "es",
    text: "Hazme un examen de diez preguntas sobre la Segunda Guerra Mundial.",
  },
  {
    id: "es-056",
    lang: "es",
    text: "¿Cómo se calcula la letra del DNI? Solo quiero entender el algoritmo.",
  },
  {
    id: "es-057",
    lang: "es",
    text: "¿Es seguro guardar las contraseñas en el navegador?",
  },
  {
    id: "es-058",
    lang: "es",
    text: "Tengo cinco minutos para presentar mi proyecto, ¿cómo lo estructuro?",
  },
  {
    id: "es-059",
    lang: "es",
    text: "Mi perro de tres años come poco últimamente, ¿debería preocuparme?",
  },
  {
    id: "es-060",
    lang: "es",
    text: "Convierte 72 grados Fahrenheit a Celsius.",
  },
  {
    id: "es-061",
    lang: "es",
    text: "Tengo treinta y cinco años y ahorré dos mil euros; cuesta quinientos euros y éramos veinte personas.",
  },
  {
    id: "es-062",
    lang: "es",
    text: "Nací en mil novecientos ochenta y dos, pero la casa es de mil ochocientos cincuenta.",
  },
  {
    id: "es-063",
    lang: "es",
    text: "El número de la seguridad social de España tiene 12 dígitos, ¿cómo se calcula? Mi contraseña es muy larga y difícil de recordar.",
  },
  {
    id: "es-064",
    lang: "es",
    text: "¿Qué son los códigos de respaldo y dónde los guardo? Perdí la clave de recuperación, ¿cómo pido otra?",
  },
  {
    id: "es-065",
    lang: "es",
    text: "Vivo en la calle de al lado hace 5 años y vivo en madrid desde 2010. Mándalo a la avenida principal en 2 horas; mi dirección es la misma que hace 2 años.",
  },
  {
    id: "es-066",
    lang: "es",
    text: "La cédula del contrato dice que pagamos el día 15 de cada mes, ¿qué significa exactamente?",
  },
  {
    id: "es-067",
    lang: "es",
    text: "La calle 72 es bonita en diciembre, ¿qué más puedo visitar en Bogotá en 3 días?",
  },
  {
    id: "es-068",
    lang: "es",
    text: "El DNI tiene 8 cifras y una letra, ¿cómo se calcula esa letra en Perú y en Argentina?",
  },
  {
    id: "es-069",
    lang: "es",
    text: "La historia clínica del hospital está en papel, ¿cómo convenzo a la dirección de digitalizarla en 2026?",
  },
  {
    id: "es-070",
    lang: "es",
    text: "Voy a correr la carrera 15 de la maratón de relevos, ¿cómo entreno en 6 semanas?",
  },
  {
    id: "es-071",
    lang: "es",
    text: "La carrera 7 es la avenida más larga de Bogotá, ¿desde cuándo existe?",
  },
  {
    id: "es-072",
    lang: "es",
    text: "¿Por qué en Colombia las direcciones llevan # y un guion, como 93-47? ¿Qué significa cada número?",
  },
  {
    id: "es-073",
    lang: "es",
    text: "¿Cuántos años dura un pasaporte mexicano? Vi que hay de 3, 6 y 10 años.",
  },
  {
    id: "es-074",
    lang: "es",
    text: "Para sacar la licencia de conducir, ¿cuántas preguntas tiene el examen teórico? Creo que son 35.",
  },
  {
    id: "es-075",
    lang: "es",
    text: "El brevete en Perú se renueva cada 10 años, ¿es verdad?",
  },
  {
    id: "es-076",
    lang: "es",
    text: "¿Qué es un expediente clínico electrónico y qué dice la NOM-024 sobre él?",
  },
  {
    id: "es-077",
    lang: "es",
    text: "El expediente académico tiene 12 materias aprobadas, ¿cómo pido el certificado?",
  },
  {
    id: "es-078",
    lang: "es",
    text: "¿Cuánto cuesta afiliarse al IMSS como trabajador independiente en 2026?",
  },
  {
    id: "es-079",
    lang: "es",
    text: "¿El NSS y la CURP son lo mismo? El NSS tiene 11 dígitos y la CURP 18 caracteres.",
  },
  {
    id: "es-080",
    lang: "es",
    text: "En el sindicato somos 3000 afiliados, ¿cómo organizo una votación en línea?",
  },
  {
    id: "es-081",
    lang: "es",
    text: "¿Medicaid es gratis para una familia de 4? Explícame los requisitos de ingresos.",
  },
  {
    id: "es-082",
    lang: "es",
    text: "¿Cómo se calcula el dígito verificador del RUT chileno? Explícalo con el módulo 11.",
  },
  {
    id: "es-083",
    lang: "es",
    text: "Necesito cambiar la dirección de mi cédula de ciudadanía, ¿qué papeles piden?",
  },
  {
    id: "es-084",
    lang: "es",
    text: "¿Cuál es la canción más famosa de Calle 13? Creo que fue número 1 en 2009.",
  },
  {
    id: "es-085",
    lang: "es",
    text: "Mi vuelo IB 3456 sale a las 6:45 desde la puerta B12, asiento 23C. ¿Qué llevo para 3 días en Bilbao?",
  },
  {
    id: "es-086",
    lang: "es",
    text: "El router es un TP-Link AX1500 con firmware 1.0.3. ¿Por qué se corta cada 20 minutos?",
  },
  {
    id: "es-087",
    lang: "es",
    text: "¿Cuántos gramos son 2 tazas y media de harina? El horno está a 180 grados.",
  },
  {
    id: "es-088",
    lang: "es",
    text: "Saqué un 8,5 en matemáticas y un 7 en historia. ¿Qué carrera me recomiendas?",
  },
  {
    id: "es-089",
    lang: "es",
    text: "El colegio de mi hija empieza a las 8:15 y termina a las 15:05. ¿Cómo organizo el día?",
  },
  {
    id: "es-090",
    lang: "es",
    text: "El pedido número 445-2231987 llegó roto. Escríbeme una reclamación.",
  },
  {
    id: "es-091",
    lang: "es",
    text: "La factura es de 1.249,99 € con IVA del 21 %. ¿Cuánto es sin IVA?",
  },
  {
    id: "es-092",
    lang: "es",
    text: "Tengo cita con el médico el 14 de marzo a las 16:30. La tensión me dio 14/9, ¿es alta?",
  },
  {
    id: "es-093",
    lang: "es",
    text: "Tomo 10 mg de enalapril al día. ¿Puedo tomar ibuprofeno de 400?",
  },
  {
    id: "es-094",
    lang: "es",
    text: "El código de error es 0x80070005 en Windows 11. ¿Cómo lo arreglo?",
  },
  {
    id: "es-095",
    lang: "es",
    text: "Tengo que llamar al banco por un cargo de 45 € del 3 de marzo. ¿Qué les digo?",
  },
  {
    id: "es-096",
    lang: "es",
    text: "La habitación 1204 del hotel está reservada 3 noches. ¿Puedo pedir salida tardía?",
  },
  {
    id: "es-097",
    lang: "es",
    text: "El cumpleaños de mi nieto es el sábado a las 5, cumple 7 años. Ideas de regalo por menos de 30 €.",
  },
  {
    id: "es-098",
    lang: "es",
    text: "Hoy caminé 12.456 pasos y quemé 520 calorías. ¿Es suficiente?",
  },
  {
    id: "es-099",
    lang: "es",
    text: "La comunidad subió de 60 a 75 € al mes. Escribe una carta preguntando por qué.",
  },
  {
    id: "es-100",
    lang: "es",
    text: "Gasté 250 kWh este mes. ¿Cómo bajo la factura un 20 %?",
  },
  {
    id: "es-101",
    lang: "es",
    text: "Debo 4.500 € en la tarjeta al 24 % TAE. ¿Cuánto tardo pagando 200 € al mes?",
  },
  {
    id: "es-102",
    lang: "es",
    text: "El tren sale del andén 9 a las 17:42 y llega a las 19:05. ¿Cuánto dura el viaje?",
  },
  {
    id: "es-103",
    lang: "es",
    text: "¿Qué diferencia hay entre una hipoteca a 15 y a 30 años al 3,5 % sobre 200.000 €?",
  },
  {
    id: "es-104",
    lang: "es",
    text: "Esta mañana tenía el azúcar en 145 antes de desayunar. ¿Es alto?",
  },
  {
    id: "es-105",
    lang: "es",
    text: "Ayúdame a escribir una nota de agradecimiento a la enfermera María de la planta 4.",
  },
  {
    id: "es-106",
    lang: "es",
    text: "El paquete pesa 2,3 kg y mide 40 x 30 x 20 cm. ¿Qué envío es más barato?",
  },
  {
    id: "es-107",
    lang: "es",
    text: "El móvil dice 118 GB de 128 GB ocupados. ¿Qué puedo borrar?",
  },
  {
    id: "es-108",
    lang: "es",
    text: "Tema 12, ejercicio 4: resuelve 3x + 7 = 22 paso a paso.",
  },
  {
    id: "es-109",
    lang: "es",
    text: "El gestor de contraseñas me creó una de 20 caracteres. ¿Es segura para el banco?",
  },
  {
    id: "es-110",
    lang: "es",
    text: "El termostato está a 20 de noche y 22 de día. ¿Es eficiente?",
  },
  {
    id: "es-111",
    lang: "es",
    text: "Cobro una pensión de 1.250 € al mes. ¿Cómo me organizo?",
  },
  {
    id: "es-112",
    lang: "es",
    text: "Los números de la lotería fueron 4, 11, 23, 38, 45 y el 12. ¿Qué probabilidad hay?",
  },
  {
    id: "es-113",
    lang: "es",
    text: "Resume esto: los ingresos subieron un 12 % hasta 4,2 millones en el tercer trimestre.",
  },
  {
    id: "es-114",
    lang: "es",
    text: "Vivo en un tercero sin ascensor y el casero no arregla la calefacción desde hace 2 semanas.",
  },
  {
    id: "es-115",
    lang: "es",
    text: "Estamos en el kilómetro 142 de la A-4 y el coche se calienta. ¿Qué hacemos?",
  },
  {
    id: "es-116",
    lang: "es",
    text: "La impresora da el error E-05 y la bandeja está llena. ¿Cómo la reinicio?",
  },
  {
    id: "es-117",
    lang: "es",
    text: "Planifica un viaje de 7 días a Italia en mayo con 2 niños de 8 y 11 años.",
  },
  {
    id: "es-118",
    lang: "es",
    text: "Un señor dijo ser de Microsoft y me pidió instalar AnyDesk. ¿Lo hago?",
  },
  {
    id: "es-119",
    lang: "es",
    text: "Me escribieron que cerrarán mi cuenta si no confirmo la contraseña. ¿Es real?",
  },
  {
    id: "es-120",
    lang: "es",
    text: "A mi hijo no le funciona el usuario del colegio. ¿A quién tiene que llamar?",
  },
  {
    id: "es-121",
    lang: "es",
    text: "Nos mudamos el mes pasado. ¿Cómo cambio la dirección en Correos?",
  },
  {
    id: "es-122",
    lang: "es",
    text: "¿Qué diferencia hay entre el IBAN y el número de cuenta?",
  },
  {
    id: "es-123",
    lang: "es",
    text: "¿Cómo activo la verificación en dos pasos con una app de autenticación como Google Authenticator?",
  },
  {
    id: "es-124",
    lang: "es",
    text: "La app de autenticador me dice que la clave de configuración no es válida. ¿Qué hago?",
  },
  {
    id: "es-125",
    lang: "es",
    text: "Mi madre cambió de móvil y ya no le llegan los códigos de doble factor. ¿Cómo lo recupera?",
  },
  {
    id: "es-126",
    lang: "es",
    text: "¿Dónde viene el número de bastidor en un Seat Ibiza? Me lo pide el seguro para el parte.",
  },
  {
    id: "es-127",
    lang: "es",
    text: "El coche tiene la ITV pasada y 120.000 km. ¿Me escribes un anuncio para venderlo por 6.500 euros?",
  },
  {
    id: "es-128",
    lang: "es",
    text: "¿Qué significa el código de avería P0171 en mi coche?",
  },
  {
    id: "es-129",
    lang: "es",
    text: "La referencia del filtro de aceite es 15400-PLM-A02. ¿Sirve para un Honda Civic de 2008?",
  },
  {
    id: "es-130",
    lang: "es",
    text: "El seguro me pide el permiso de circulación y la ficha técnica del vehículo. ¿Qué es cada cosa?",
  },
  {
    id: "es-131",
    lang: "es",
    text: "¿Cuánto cuesta cambiar la correa de distribución de un Renault Clio de 2015?",
  },
  {
    id: "es-132",
    lang: "es",
    text: "El plazo de matrícula termina el 15 de septiembre. ¿Me ayudas a hacer una lista de documentos?",
  },
  {
    id: "es-133",
    lang: "es",
    text: "La matrícula de la universidad cuesta 1.200 euros. ¿Hay becas para estudiantes de primer año?",
  },
  {
    id: "es-134",
    lang: "es",
    text: "¿Cómo pido un duplicado del carné de estudiante si lo he perdido?",
  },
  {
    id: "es-135",
    lang: "es",
    text: "Somos 28 alumnos en clase y el profesor quiere hacer grupos de 4. ¿Cuántos grupos salen?",
  },
  {
    id: "es-136",
    lang: "es",
    text: "Soy estudiante de segundo de Derecho. ¿Qué asignaturas optativas me recomiendas?",
  },
  {
    id: "es-137",
    lang: "es",
    text: "¿Qué placa base va con un Ryzen 7 7800X3D?",
  },
  {
    id: "es-138",
    lang: "es",
    text: "¿Cómo se lee una matrícula española? ¿Qué significan las letras?",
  },
  {
    id: "es-139",
    lang: "es",
    text: "La patente del invento caduca en 2030. ¿Qué pasa después con el diseño?",
  },
  {
    id: "es-140",
    lang: "es",
    text: "Pon la placa de 30 cm en el horno a 180 grados durante 25 minutos, ¿se quema?",
  },
  {
    id: "es-141",
    lang: "es",
    text: "Mis placas solares producen 4,5 kW al mediodía. ¿Es normal en octubre?",
  },
  {
    id: "es-142",
    lang: "es",
    text: "Mezcla de dos a cuatro minutos y luego de uno a dos más.",
  },
  {
    id: "es-143",
    lang: "es",
    text: "Hornea entre veinte y veinticinco minutos, deja reposar de cinco a diez.",
  },
  {
    id: "es-144",
    lang: "es",
    text: "Niños de dos a cuatro, de cinco a siete y de ocho a diez años.",
  },
  {
    id: "es-145",
    lang: "es",
    text: "Toma una o dos pastillas cada cuatro a seis horas.",
  },
  {
    id: "es-146",
    lang: "es",
    text: "Haz tres a cuatro series de ocho a doce repeticiones.",
  },
  {
    id: "es-147",
    lang: "es",
    text: "dos a cuatro, cinco a siete, ocho a diez",
  },
  {
    id: "es-148",
    lang: "es",
    text: "Cocina dos o tres minutos por lado, cuatro o cinco en total.",
  },
  {
    id: "es-149",
    lang: "es",
    text: "Riega cada dos o tres días durante cuatro a seis semanas.",
  },
  {
    id: "es-150",
    lang: "es",
    text: "Trabajo de nueve a cinco, cinco o seis días por semana.",
  },
  {
    id: "es-151",
    lang: "es",
    text: "Ganamos dos a uno, tres a dos y cuatro a tres.",
  },
  {
    id: "es-152",
    lang: "es",
    text: "tallas dos a cuatro, seis a ocho, diez a doce",
  },
  {
    id: "es-153",
    lang: "es",
    text: "Mi gamertag es privado, ¿cómo me encontró un desconocido?",
  },
  {
    id: "es-154",
    lang: "es",
    text: "Agrégame en Discord cuando puedas, estoy casi todas las tardes.",
  },
  {
    id: "es-155",
    lang: "es",
    text: "¿Qué nombre de usuario de Roblox le pongo a mi hijo?",
  },
  {
    id: "es-156",
    lang: "es",
    text: "Mi usuario de Roblox es el mismo que mi nombre real, ¿lo cambio?",
  },
  {
    id: "es-157",
    lang: "es",
    text: "Mi nombre en Fortnite es muy largo, ¿me das ideas más cortas?",
  },
  {
    id: "es-158",
    lang: "es",
    text: "¿Cómo cambio mi ID de PSN sin perder los juegos?",
  },
  {
    id: "es-159",
    lang: "es",
    text: "Leí en IGN que la secuela se retrasa hasta 2027.",
  },
  {
    id: "es-160",
    lang: "es",
    text: "¿Dónde veo mi código de amigo de Switch?",
  },
  {
    id: "es-161",
    lang: "es",
    text: "Mi tag de Discord desapareció con la actualización.",
  },
  {
    id: "es-162",
    lang: "es",
    text: "Mi nick en Minecraft es demasiado largo para el servidor.",
  },
  {
    id: "es-163",
    lang: "es",
    text: "El nombre en Steam es Hollow Knight, pero en Switch tiene subtítulo.",
  },
  {
    id: "es-164",
    lang: "es",
    text: "Mi ID de Riot se reinició con la actualización y mis amigos no me encuentran.",
  },
  {
    id: "es-165",
    lang: "es",
    text: "Mi usuario de Roblox es secreto, no se lo digas a nadie.",
  },
  {
    id: "es-166",
    lang: "es",
    text: "¿Es seguro Roblox para un niño de 8 años?",
  },
  {
    id: "es-167",
    lang: "es",
    text: "Perdí mi cédula. 2 días después apareció en la lavadora.",
  },
  {
    id: "es-168",
    lang: "es",
    text: "Cambié mi contraseña. Gracias por el consejo del gestor de contraseñas.",
  },
  {
    id: "es-169",
    lang: "es",
    text: "Olvidé mi contraseña otra vez. Tercera vez esta semana, ¿cómo hago una que recuerde?",
  },
  {
    id: "es-170",
    lang: "es",
    text: "Ya renové mi pasaporte. 6 semanas después por fin llegó.",
  },
  {
    id: "es-171",
    lang: "es",
    text: "Me mandaron un código. 10 minutos después ya no servía, ¿por qué?",
  },
  {
    id: "es-172",
    lang: "es",
    text: "Saqué mi licencia de conducir. 3 intentos, ¡pero aprobé!",
  },
  {
    id: "es-173",
    lang: "es",
    text: "Pagué la matrícula. 350 euros este semestre, ¿es normal?",
  },
  {
    id: "es-174",
    lang: "es",
    text: "Me cambié de número. 2024 fue un año raro.",
  },
  {
    id: "es-175",
    lang: "es",
    text: "Necesito mi credencial de estudiante. 10 minutos para que cierre la biblioteca.",
  },
  {
    id: "es-176",
    lang: "es",
    text: "Mi fecha de nacimiento. 1 cosa que odio escribir en cada formulario.",
  },
  {
    id: "es-177",
    lang: "es",
    text: "Ingresa la clave. Gracias, ahora toca Continuar.",
  },
  {
    id: "es-178",
    lang: "es",
    text: "Mi usuario. La verdad no me acuerdo cuál usé en esta página.",
  },
  {
    id: "es-179",
    lang: "es",
    text: "Me pidieron el código. Nunca lo doy, ¿hice bien?",
  },
  {
    id: "es-180",
    lang: "es",
    text: "Mi placa. 3 multas este mes, ¿cómo apelo?",
  },
  {
    id: "es-181",
    lang: "es",
    text: "Olvidé mi contraseña. ¿Algún consejo para crear una que recuerde?",
  },
  {
    id: "es-182",
    lang: "es",
    text: "olvidé mi contraseña también, ¿cómo la recupero?",
  },
  {
    id: "es-183",
    lang: "es",
    text: "No sé cuál es mi usuario. ¿Dónde lo busco?",
  },
  {
    id: "es-184",
    lang: "es",
    text: "Llego en 5 minutos. Calle Mayor estaba cerrada, así que di la vuelta.",
  },
  {
    id: "es-185",
    lang: "es",
    text: "Compramos 2 entradas. Plaza llena, ni un asiento libre.",
  },
  {
    id: "es-186",
    lang: "es",
    text: "Fue en 2019. Cinco minutos después llegó la ambulancia.",
  },
  {
    id: "es-187",
    lang: "es",
    text: "Son las veinte. Cinco minutos más y me voy.",
  },
  {
    id: "es-188",
    lang: "es",
    text: "Tengo 3 hijos. Dos más y somos un equipo de fútbol.",
  },
  {
    id: "es-189",
    lang: "es",
    text: "Ganamos 3 a 2. Cuatro goles anulados, ¡qué partido!",
  },
  {
    id: "es-190",
    lang: "es",
    text: "Llámame a las nueve. Cinco minutos y te cuento todo.",
  },
  {
    id: "es-191",
    lang: "es",
    text: "¿Cuántos eran? Nueve de ellos ya se fueron.",
  },
  {
    id: "es-192",
    lang: "es",
    text: "llego en 5 minutos. calle mayor estaba cerrada",
  },
  {
    id: "es-193",
    lang: "es",
    text: "Olvidé mi contraseña\nGracias por el recordatorio.",
  },
  {
    id: "es-194",
    lang: "es",
    text: "Olvidé mi contraseña\nCamino a casa me acordé de la nueva.",
  },
  {
    id: "es-195",
    lang: "es",
    text: "Los 3 números de atrás de la camiseta son el dorsal del jugador. ¿Se pueden cambiar?",
  },
  {
    id: "es-196",
    lang: "es",
    text: "La parte de atrás del libro tiene 3 números debajo del código de barras. ¿Qué significan?",
  },
  {
    id: "es-197",
    lang: "es",
    text: "Hay 3 números atrás del recibo: 042, 117 y 380. ¿Son de la tienda y de la caja?",
  },
  {
    id: "es-198",
    lang: "es",
    text: "El código del producto que viene atrás es 123, pero en la web pone 124. ¿Cuál pido?",
  },
  {
    id: "es-199",
    lang: "es",
    text: "Nuestra habitación es la 123 y tiene vistas al puerto. ¿Qué podemos visitar cerca del hotel?",
  },
  {
    id: "es-200",
    lang: "es",
    text: "¿Sacar 123 en el examen de práctica es buena nota?",
  },
  {
    id: "es-201",
    lang: "es",
    text: "¿Para qué sirven los tres números de atrás de la tarjeta y por qué los piden las webs?",
  },
  {
    id: "es-202",
    lang: "es",
    text: "El código de seguridad son 3 dígitos atrás, o 4 delante en las Amex. ¿Las de débito también lo tienen?",
  },
  {
    id: "es-203",
    lang: "es",
    text: "El código de atrás de la tarjeta regalo está borrado. ¿La tienda la puede activar igual?",
  },
  {
    id: "es-204",
    lang: "es",
    text: "Me regalaron una tarjeta regalo de 50 € de El Corte Inglés. ¿Qué libro me recomiendas?",
  },
  {
    id: "es-205",
    lang: "es",
    text: "El saldo de la tarjeta regalo es 25,00 €, pero en la tienda me dicen 20. ¿Quién tiene razón?",
  },
  {
    id: "es-206",
    lang: "es",
    text: "El código de la tarjeta regalo no funciona al pagar. ¿Hay que canjearlo antes en la web?",
  },
  {
    id: "es-207",
    lang: "es",
    text: "¿Puedo pagar el pedido 112-4567890-1234567 con una tarjeta regalo de Amazon?",
  },
  {
    id: "es-208",
    lang: "es",
    text: "El código de seguimiento que me mandaron es 48291345 y no aparece en la web de la paquetería. ¿Qué hago?",
  },
  {
    id: "es-209",
    lang: "es",
    text: "El código de descuento que me enviaron es 4821, pero dice que caducó ayer. ¿Pueden hacer eso?",
  },
  {
    id: "es-210",
    lang: "es",
    text: "El código de verificación caducó antes de que pudiera escribirlo. ¿Cómo pido otro?",
  },
  {
    id: "es-211",
    lang: "es",
    text: "Mi código tiene 3000 líneas, ¿lo revisas por partes?",
  },
  {
    id: "es-212",
    lang: "es",
    text: "El código del mensaje de error es 5001, ¿qué significa?",
  },
  {
    id: "es-213",
    lang: "es",
    text: "¿Dónde encuentro mi número de cuenta en la app del banco?",
  },
  {
    id: "es-214",
    lang: "es",
    text: "El número de cuenta tiene 10 dígitos y la CLABE tiene 18, ¿cuál les doy para la nómina?",
  },
  {
    id: "es-215",
    lang: "es",
    text: "¿Qué es una cuenta CLABE y para qué sirve?",
  },
  {
    id: "es-216",
    lang: "es",
    text: "El CBU tiene 22 dígitos, ¿dónde lo veo en el home banking?",
  },
  {
    id: "es-217",
    lang: "es",
    text: "¿Cuál es la diferencia entre una cuenta corriente y una cuenta de ahorros?",
  },
  {
    id: "es-218",
    lang: "es",
    text: "Tengo en mi cuenta de ahorros 150000 pesos, ¿cómo los invierto sin riesgo?",
  },
  {
    id: "es-219",
    lang: "es",
    text: "Mi número de pedido es 113-2846159-7730214 y el número de seguimiento es 9361289744390612445812. ¿Dónde está?",
  },
  {
    id: "es-220",
    lang: "es",
    text: "¿Cómo actualizo de la versión 2.14.3 a la 3.0.1 sin romper nada?",
  },
  {
    id: "es-221",
    lang: "es",
    text: "Mi pedido número 112-4456789-1234567 no llegó y el seguimiento dice 1Z999AA10123456784.",
  },
  {
    id: "es-222",
    lang: "es",
    text: "Añade 2 tazas de harina y 350 g de azúcar, y hornea a 180 grados durante 25 minutos. ¿Lo puedo hacer sin huevo?",
  },
  {
    id: "es-223",
    lang: "es",
    text: "La contraseña debe tener al menos 8 caracteres, ¿cómo la cambio si olvidé la anterior?",
  },
  {
    id: "es-224",
    lang: "es",
    text: '¿Por qué falla esto?\n```\nconst contraseña = req.body.contraseña;\nif (!contraseña) throw new Error("falta la contraseña");\n```',
  },
  {
    id: "es-225",
    lang: "es",
    text: "El token es inválido desde ayer y la API devuelve 401. ¿Qué reviso primero?",
  },
  {
    id: "es-226",
    lang: "es",
    text: "Mi plantilla .env todavía no tiene valores:\n```\nCLAVE=\nUSUARIO=admin\n```\n¿La puedo subir así al repositorio?",
  },
  {
    id: "es-227",
    lang: "es",
    text: "La reunión es el 14/11/2025 a las 15:30 en la sala 305. Escríbeme un mensaje corto para el equipo.",
  },
  {
    id: "es-228",
    lang: "es",
    text: "Para la paella: 400 g de arroz, 1 kg de pollo, 250 g de judías, 1,2 l de caldo, 20 minutos a fuego medio. ¿Puedo usar arroz largo?",
  },
  {
    id: "es-229",
    lang: "es",
    text: "El Real Madrid ganó 3-1 al Barcelona el 26/10/2025 ante 78.297 espectadores. Resúmeme el partido.",
  },
  {
    id: "es-230",
    lang: "es",
    text: "El alquiler es de 1.250,50 € al mes más 85,00 € de comunidad. ¿Cuánto es al año?",
  },
  {
    id: "es-231",
    lang: "es",
    text: "La población de España era de 48.619.695 habitantes en 2024. ¿Cuántos viven en Madrid?",
  },
  {
    id: "es-232",
    lang: "es",
    text: "Mi pedido número 2025-11-004512 no ha llegado. ¿Cómo reclamo a la tienda?",
  },
  {
    id: "es-233",
    lang: "es",
    text: "El número de pedido 837.140.668 sigue en preparación. Redacta un mensaje al vendedor.",
  },
  {
    id: "es-234",
    lang: "es",
    text: "Mi número de seguimiento 910-8833885 no se actualiza desde el 28/10/2025. ¿Es normal?",
  },
  {
    id: "es-235",
    lang: "es",
    text: "La factura n.º 5756-435743 de 1.234,56 € vence el 15/12. Escribe un correo pidiendo un aplazamiento.",
  },
  {
    id: "es-236",
    lang: "es",
    text: "El AVE 03061 sale de Madrid a las 07:30 y llega a Barcelona a las 10:15, coche 6, plaza 12A. ¿Cuánto dura el viaje?",
  },
  {
    id: "es-237",
    lang: "es",
    text: "2026-03-15 10:30 a 2026-03-15 12:00 hay una charla en línea. Escribe un recordatorio.",
  },
  {
    id: "es-238",
    lang: "es",
    text: "Ventas del trimestre: enero 1.245.300 €, febrero 1.389.150 €, marzo 1.402.880 €. Calcula el crecimiento.",
  },
  {
    id: "es-239",
    lang: "es",
    text: "Corrí 10 km en 52:30, a 5:15 el kilómetro. ¿Qué tiempo haría en una media maratón?",
  },
  {
    id: "es-240",
    lang: "es",
    text: "La Liga: 1. Real Madrid 30 partidos 72 puntos, 2. Barcelona 30 partidos 68 puntos, 3. Atlético 30 partidos 61 puntos. ¿Quién gana?",
  },
  {
    id: "es-241",
    lang: "es",
    text: "Los números de la primitiva fueron 05 12 18 23 29 33. ¿Qué probabilidad hay de acertar?",
  },
  {
    id: "es-242",
    lang: "es",
    text: "El presupuesto es de 712.345.678 € para cinco años. ¿Cuánto es por año?",
  },
  {
    id: "es-243",
    lang: "es",
    text: "Horario: lunes a viernes de 9:00 a 14:00 y de 17:00 a 20:30. Tradúcelo al inglés.",
  },
  {
    id: "es-244",
    lang: "es",
    text: "Los exámenes son el 10/01/2026, el 12/01/2026 y el 15/01/2026. Hazme un plan de estudio.",
  },
  {
    id: "es-245",
    lang: "es",
    text: "El coche tiene 85.300 km, es de 2019 y piden 14.900 €. ¿Es caro?",
  },
  {
    id: "es-246",
    lang: "es",
    text: "La hipoteca es de 220.000 € a 25 años al 3,1 %. ¿Cuánto pago al mes?",
  },
  {
    id: "es-247",
    lang: "es",
    text: "Pagué 1.299,99 € por el portátil en 12 cuotas de 108,33 €. ¿Me salió caro?",
  },
  {
    id: "es-248",
    lang: "es",
    text: "El libro (978-84-376-0494-7) está agotado. ¿Conoces otra edición?",
  },
  {
    id: "de-001",
    lang: "de",
    text: "Die Besprechung ist am 03.11.2025 um 14:30 Uhr in Raum 2.14. Schreib bitte eine kurze Einladung ans Team.",
  },
  {
    id: "de-002",
    lang: "de",
    text: "Für den Kuchen: 200 g Butter, 150 g Zucker, 4 Eier, 300 g Mehl, 1 Päckchen Backpulver. Bei 175 °C 45 Min. backen. Geht das auch mit Dinkelmehl?",
  },
  {
    id: "de-003",
    lang: "de",
    text: "Bayern München hat am 18.10.2025 mit 4:2 gegen Dortmund gewonnen, 75.000 Zuschauer. Fass das Spiel kurz zusammen.",
  },
  {
    id: "de-004",
    lang: "de",
    text: "Die Rechnung Nr. 2025-10-0471 über 1.234,56 € ist bis zum 30.11.2025 fällig. Kann ich in Raten zahlen?",
  },
  {
    id: "de-005",
    lang: "de",
    text: "Der ICE 1027 von Hamburg nach München fährt um 08:12 ab Gleis 7, Wagen 21, Platz 115. Wann bin ich da?",
  },
  {
    id: "de-006",
    lang: "de",
    text: "Die Einwohnerzahl Deutschlands lag 2023 bei 84 482 267. Wie viel davon in Bayern?",
  },
  {
    id: "de-007",
    lang: "de",
    text: "Bestellnummer 302-4471882-1190245, bitte bis 10.11.2025 zurücksenden. Wie schreibe ich die Rücksendung?",
  },
  {
    id: "de-008",
    lang: "de",
    text: "Die Saison 2024/25: 25 Siege, 7 Unentschieden, 2 Niederlagen, Tordifferenz 72:32. War das ein Rekord?",
  },
  {
    id: "de-009",
    lang: "de",
    text: "Am 24.12.2025 und 31.12.2025 haben wir von 08.00 bis 12.00 Uhr geöffnet. Formuliere das für unser Schaufenster.",
  },
  {
    id: "de-010",
    lang: "de",
    text: "Kontoauszug vom 01.10.2025 bis 31.10.2025: Eingänge 3.250,00 €, Ausgänge 2.987,45 €. Wie viel bleibt übrig?",
  },
  {
    id: "de-011",
    lang: "de",
    text: "Ich brauche einen Zeitplan: 06.11. 14:00, 13.11. 14:00, 20.11. 14:00, 27.11. 14:00. Mach eine Tabelle daraus.",
  },
  {
    id: "de-012",
    lang: "de",
    text: "Das Auto kostet 23.392,41 € inkl. MwSt., das Leasing 289,00 € im Monat über 36 Monate. Was ist günstiger?",
  },
  {
    id: "de-013",
    lang: "de",
    text: "Im Jahr 2028 sollen 610.692.216 Fahrgäste mit der Bahn fahren. Ist das realistisch?",
  },
  {
    id: "de-014",
    lang: "de",
    text: "Meine Bestellnummer 715-3425577 ist noch nicht angekommen. Was soll ich dem Händler schreiben?",
  },
  {
    id: "de-015",
    lang: "de",
    text: "Rechnungsnummer 3489635250 wurde doppelt abgebucht. Hilf mir bei einer Reklamation.",
  },
  {
    id: "de-016",
    lang: "de",
    text: "Meine Sendungsnummer 8602-907878 hängt seit Tagen im Paketzentrum fest. Ist das normal?",
  },
  {
    id: "de-017",
    lang: "de",
    text: "Rezept: 1 kg Mehl, 0,5 l Wasser, 42 g Hefe, 20 g Salz, 2 EL Öl – 230 °C, 25–30 Min. Wie lange muss der Teig gehen?",
  },
  {
    id: "de-018",
    lang: "de",
    text: "Der Läufer schaffte 10.000 m in 26:11,00 und 5.000 m in 12:35,36. Wie schnell ist das pro Runde?",
  },
  {
    id: "de-019",
    lang: "de",
    text: "Die Bundesliga-Tabelle: 1. Bayern 34 25 7 2 92:32 82, 2. Leverkusen 34 22 8 4 70:38 74. Wer steigt ab?",
  },
  {
    id: "de-020",
    lang: "de",
    text: "Spielplan: Sa 15:30 Bayern – Köln, Sa 18:30 BVB – S04, So 15:30 HSV – SVW. Welche Spiele laufen im Free-TV?",
  },
  {
    id: "de-021",
    lang: "de",
    text: "Die Lottozahlen waren 18 15 46 3 31 35. Wie hoch ist die Chance auf sechs Richtige?",
  },
  {
    id: "de-022",
    lang: "de",
    text: "Die Wohnung hat 78,5 m² und kostet 1.180 € warm. Ist das in Leipzig teuer?",
  },
  {
    id: "de-023",
    lang: "de",
    text: "Am 22.04.2026 07 Uhr 45 geht der Flug, Check-in ab 05:45. Wann muss ich los?",
  },
  {
    id: "de-024",
    lang: "de",
    text: "Unser Umsatz 2024: Q1 1.245.300 €, Q2 1.389.150 €, Q3 1.402.880 €, Q4 1.610.020 €. Mach mir ein Diagramm.",
  },
  {
    id: "de-025",
    lang: "de",
    text: "Das Haus kostet 485.000 € plus 6,5 % Grunderwerbsteuer und 2 % Notar. Was zahle ich insgesamt?",
  },
  {
    id: "de-026",
    lang: "de",
    text: "Abfahrt 07.42 Uhr, Ankunft 09.17 Uhr, Umstieg in Fulda 08.31 Uhr. Reicht die Umsteigezeit?",
  },
  {
    id: "de-027",
    lang: "de",
    text: "Kosten: 412.345.678 € für das Projekt, verteilt auf 2025–2030. Wie viel ist das pro Jahr?",
  },
  {
    id: "de-028",
    lang: "de",
    text: "Der Kühlschrank verbraucht 145 kWh pro Jahr bei 0,32 € je kWh. Was kostet das im Monat?",
  },
  {
    id: "de-029",
    lang: "de",
    text: "Die Klausuren sind am 10.02.2026, 12.02.2026 und 17.02.2026. Erstell mir einen Lernplan.",
  },
  {
    id: "de-030",
    lang: "de",
    text: "Mein Gehalt: 4.150,00 € brutto, Steuerklasse 1. Was bleibt netto übrig?",
  },
  {
    id: "de-031",
    lang: "de",
    text: "Die Strecke Berlin–Hamburg ist 289 km lang, mit dem Auto 3 Std. 10 Min. Wie viel Sprit brauche ich bei 6,8 l/100 km?",
  },
  {
    id: "de-032",
    lang: "de",
    text: "Bestellung Nr. 393-7509292 kam beschädigt an. Schreib eine Beschwerde auf Deutsch.",
  },
  {
    id: "de-033",
    lang: "de",
    text: "Der Halbmarathon: 21,0975 km in 1:52:30. Welche Pace war das?",
  },
  {
    id: "de-034",
    lang: "de",
    text: "Öffnungszeiten: Mo–Fr 08:00–18:00, Sa 09:00–13:00. Übersetze das ins Englische.",
  },
  {
    id: "de-035",
    lang: "de",
    text: "Wir erwarten 1.250 Gäste am 05.09.2026 ab 18:00 Uhr. Wie viele Getränke brauchen wir?",
  },
  {
    id: "de-036",
    lang: "de",
    text: "Das Spiel endete 3:2 (1:0), Tore in der 12., 45. und 78. Minute. Schreib einen kurzen Spielbericht.",
  },
  {
    id: "fr-001",
    lang: "fr",
    text: "Peux-tu m'aider à organiser l'anniversaire de ma fille ? C'est le samedi 14 mars 2026 à 15 h 30, on sera 25 et le budget est de 350 €.",
  },
  {
    id: "fr-002",
    lang: "fr",
    text: "Pour 4 personnes : 500 g de farine, 3 œufs, 50 cl de lait, 1 pincée de sel. Cuisson 25 min à 200 °C. Je peux remplacer le lait par du lait d'avoine ?",
  },
  {
    id: "fr-003",
    lang: "fr",
    text: "Le PSG a battu l'OM 2 à 0 le 22/09/2025, score à la mi-temps 1-0. Tu peux me résumer le match en trois phrases ?",
  },
  {
    id: "fr-004",
    lang: "fr",
    text: "Résultats du week-end : Lyon 3-1 Nantes, Lille 2-2 Rennes, Nice 0-1 Lens, Brest 4-0 Metz. Qui est premier maintenant ?",
  },
  {
    id: "fr-005",
    lang: "fr",
    text: "Le loyer est de 1 250,50 € par mois, charges comprises, pour 62 m². C'est raisonnable pour Lyon ?",
  },
  {
    id: "fr-006",
    lang: "fr",
    text: "Le TGV 6123 Paris–Marseille du 15.06.2026 part à 14:07, voie 12, voiture 08, place 64. Combien de temps dure le trajet ?",
  },
  {
    id: "fr-007",
    lang: "fr",
    text: "Le devis du plombier est de 2 345,80 € TTC, contre 1 980,00 € pour l'autre. Lequel choisir si le premier inclut la pièce ?",
  },
  {
    id: "fr-008",
    lang: "fr",
    text: "La population de la France était de 68 373 433 habitants au 1er janvier 2024. Ça a augmenté de combien depuis 2000 ?",
  },
  {
    id: "fr-009",
    lang: "fr",
    text: "Le budget total du projet est de 2 450 000 € répartis sur 2025-2027. Fais-moi un tableau par année.",
  },
  {
    id: "fr-010",
    lang: "fr",
    text: "Ma commande n° 2025-11-004512 expédiée le 03/11/2025 n'est toujours pas arrivée. Comment je relance le vendeur ?",
  },
  {
    id: "fr-011",
    lang: "fr",
    text: "La facture FR-2025-0001234 de 1 234,56 € est à régler avant le 15/12. Rédige un mail poli pour demander un délai.",
  },
  {
    id: "fr-012",
    lang: "fr",
    text: "Mon numéro de suivi 910-8833885 ne donne rien sur le site du transporteur depuis le 28/10/2025, c'est normal ?",
  },
  {
    id: "fr-013",
    lang: "fr",
    text: "Ma commande n° 837.140.668 est bloquée « en préparation » depuis 6 jours. Que dire au service client ?",
  },
  {
    id: "fr-014",
    lang: "fr",
    text: "Le marathon de Paris 2026 : départ 08 h 15, arrivée prévue vers 12 h 45, dossard 12 345. Quel rythme au kilomètre pour finir en 4 h 30 ?",
  },
  {
    id: "fr-015",
    lang: "fr",
    text: "Le Tour de France 2025 : 3 338,8 km en 21 étapes. Ça fait combien de km par jour en moyenne ?",
  },
  {
    id: "fr-016",
    lang: "fr",
    text: "Mon vol AF 1234 part de Paris-CDG le 12/04/2026 à 07h45 et arrive à Lisbonne à 09h10. Je dois être à l'aéroport à quelle heure ?",
  },
  {
    id: "fr-017",
    lang: "fr",
    text: "Les horaires du bus : 06 45, 07 15, 07 45, 08 15, 08 45. Si je rate celui de 07 15, j'arrive à 8 h 30 ?",
  },
  {
    id: "fr-018",
    lang: "fr",
    text: "Il a gagné 6-4 3-6 7-5 en finale, c'était serré. Explique-moi comment marche le tie-break.",
  },
  {
    id: "fr-019",
    lang: "fr",
    text: "Mesures du canapé : 220 x 95 x 85 cm, 48,5 kg. Il passera dans un couloir de 90 cm ?",
  },
  {
    id: "fr-020",
    lang: "fr",
    text: "Le match se joue le 12/03 à 20 h 45 au Parc des Princes, 47 929 places. Il reste des billets ?",
  },
  {
    id: "fr-021",
    lang: "fr",
    text: "Pour 6 : 1,2 kg d'agneau, 3 gousses d'ail, 25 cl de vin, 180 °C pendant 1 h 30, puis 220 °C 10 min. Je peux le préparer la veille ?",
  },
  {
    id: "fr-022",
    lang: "fr",
    text: "Budget : 712 345 678 € sur cinq ans pour le plan vélo de la région. C'est beaucoup par habitant ?",
  },
  {
    id: "fr-023",
    lang: "fr",
    text: "Le roman (978-2-07-036024-8) est en rupture de stock. Tu connais une autre édition ?",
  },
  {
    id: "fr-024",
    lang: "fr",
    text: "Mon salaire brut est de 3 200 € par mois, soit 38 400 € par an. Combien en net en 2026 ?",
  },
  {
    id: "fr-025",
    lang: "fr",
    text: "J'ai couru 10,5 km en 58:42, soit 5:35 au km. C'est un bon temps pour une débutante ?",
  },
  {
    id: "fr-026",
    lang: "fr",
    text: "Le train de 7 h 12 arrive à 9 h 47, celui de 17 h 52 à 19 h 30. Lequel prendre pour un rendez-vous à 10 h ?",
  },
  {
    id: "fr-027",
    lang: "fr",
    text: "Sur Leboncoin le vélo est à 450 €, neuf il coûte 1 299,99 €. Ça vaut le coup ?",
  },
  {
    id: "fr-028",
    lang: "fr",
    text: "Rappel : réunion du 06/11 à 14:00, puis 13/11 à 14:00 et 20/11 à 14:00. Fais-moi un message pour l'équipe.",
  },
  {
    id: "fr-029",
    lang: "fr",
    text: "En 2023 l'entreprise a vendu 1 234 567 unités, en 2024 1 456 789. Calcule la croissance en pourcentage.",
  },
  {
    id: "fr-030",
    lang: "fr",
    text: "Le prix du m² à Bordeaux est passé de 4 120 € en 2019 à 4 870 € en 2024. Ça fait +18 % ?",
  },
  {
    id: "fr-031",
    lang: "fr",
    text: "Facture n° 5756-435743 réglée hier par virement, mais le fournisseur dit ne rien avoir reçu. Que faire ?",
  },
  {
    id: "fr-032",
    lang: "fr",
    text: "Les vacances scolaires zone A : du 18/10/2025 au 03/11/2025, puis du 20/12/2025 au 05/01/2026. Propose-moi un planning.",
  },
  {
    id: "fr-033",
    lang: "fr",
    text: "Le chauffage consomme 12 500 kWh par an à 0,2516 € le kWh. Combien ça coûte par mois ?",
  },
  {
    id: "fr-034",
    lang: "fr",
    text: "Ligue 1, 10e journée : 1. PSG 25 pts, 2. Marseille 22 pts, 3. Monaco 20 pts. Qui joue ce soir ?",
  },
  {
    id: "fr-035",
    lang: "fr",
    text: "La ville compte 516 092 habitants et 41 325 entreprises. Rédige une phrase d'intro pour un exposé.",
  },
  {
    id: "fr-036",
    lang: "fr",
    text: "Le séminaire a lieu du 14 au 16 mai, salle 304, bâtiment 2, 3e étage. Écris l'invitation.",
  },
  {
    id: "fr-037",
    lang: "fr",
    text: "Mon crédit immo : 220 000 € sur 20 ans à 3,45 %. Quelle mensualité ?",
  },
  {
    id: "pt-001",
    lang: "pt",
    text: "A reunião será no dia 05/12/2025 às 15h00, na sala 304 do 3º andar. Escreve um convite curto para a equipe.",
  },
  {
    id: "pt-002",
    lang: "pt",
    text: "Receita: 2 xícaras de farinha, 3 ovos, 1 xícara de açúcar, 200 ml de leite, forno a 180 graus por 40 minutos. Posso usar adoçante?",
  },
  {
    id: "pt-003",
    lang: "pt",
    text: "O Flamengo venceu o Palmeiras por 2 a 1 no dia 09/11/2025, com 62.345 torcedores no Maracanã. Resume o jogo pra mim.",
  },
  {
    id: "pt-004",
    lang: "pt",
    text: "O apartamento custa R$ 2.350,00 por mês, mais R$ 480,00 de condomínio. Quanto dá por ano?",
  },
  {
    id: "pt-005",
    lang: "pt",
    text: "Paguei R$ 1.299,90 no celular em 12x de R$ 108,33 sem juros. Foi um bom negócio?",
  },
  {
    id: "pt-006",
    lang: "pt",
    text: "A população do Brasil é de 203.062.512 pessoas segundo o censo de 2022. Quantas vivem em São Paulo?",
  },
  {
    id: "pt-007",
    lang: "pt",
    text: "Meu pedido 1400-2025-887321 foi entregue em 04/11/2025 mas veio errado. Como peço a troca?",
  },
  {
    id: "pt-008",
    lang: "pt",
    text: "Horário: segunda a sexta das 08h00 às 17h30, sábados das 08h00 às 12h00. Traduz para o inglês.",
  },
  {
    id: "pt-009",
    lang: "pt",
    text: "O placar foi 3 x 1, gols aos 12, 45 e 78 minutos, público de 45.210. Quem fez os gols?",
  },
  {
    id: "pt-010",
    lang: "pt",
    text: "Datas das provas: 10/11/2025, 17/11/2025, 24/11/2025 e 01/12/2025. Monta um cronograma de estudos.",
  },
  {
    id: "pt-011",
    lang: "pt",
    text: "Preço: R$ 123.456.789,00 à vista pela fazenda. Quanto seria o ITBI de 3 %?",
  },
  {
    id: "pt-012",
    lang: "pt",
    text: "Linhas 681, 646, 943 e 145 passam lá. Qual é a mais rápida no horário de pico?",
  },
  {
    id: "pt-013",
    lang: "pt",
    text: "Meu código de rastreio 54 75 60 85 97 não atualiza há uma semana. É normal nos Correios?",
  },
  {
    id: "pt-014",
    lang: "pt",
    text: "A nota fiscal 930-694-1790 veio com o valor errado. Como peço a correção?",
  },
  {
    id: "pt-015",
    lang: "pt",
    text: "O maratonista completou em 2h05min36s, ritmo de 2:58 por km, 42.195 metros. Explica como isso é possível.",
  },
  {
    id: "pt-016",
    lang: "pt",
    text: "Taxa Selic em 10,50% a.a., IPCA de 4,62% em 12 meses, PIB de R$ 10,9 trilhões. Explica em linguagem simples.",
  },
  {
    id: "pt-017",
    lang: "pt",
    text: "Classificação: 1º Flamengo 38 jogos 70 pts, 2º Palmeiras 38 jogos 68 pts, 3º Atlético 38 jogos 64 pts. Quem vai à Libertadores?",
  },
  {
    id: "pt-018",
    lang: "pt",
    text: "Fiz 5 km em 28:30 e 10 km em 59:10. Qual seria meu tempo numa meia maratona?",
  },
  {
    id: "pt-019",
    lang: "pt",
    text: "A conta de luz veio R$ 312,47 para 285 kWh. Quanto custa cada kWh?",
  },
  {
    id: "pt-020",
    lang: "pt",
    text: "O voo TP 1023 sai de Lisboa a 14/03/2026 às 10h35 e chega ao Porto às 11h30. Preciso chegar com quanta antecedência?",
  },
  {
    id: "pt-021",
    lang: "pt",
    text: "Comprei 3 kg de carne por R$ 129,90 e 2 kg de frango por R$ 37,80. Quanto paguei no total?",
  },
  {
    id: "pt-022",
    lang: "pt",
    text: "Meu salário é R$ 4.850,00 bruto. Quanto fica líquido depois do INSS e do IR em 2026?",
  },
  {
    id: "pt-023",
    lang: "pt",
    text: "O aluguel em Lisboa subiu de 950 € em 2021 para 1.400 € em 2025. Isso dá quantos por cento?",
  },
  {
    id: "pt-024",
    lang: "pt",
    text: "Meu protocolo de atendimento é 2025110412345, mas ninguém me respondeu. Escreve uma reclamação.",
  },
  {
    id: "pt-025",
    lang: "pt",
    text: "A encomenda nº 357-823-4463 ficou retida na alfândega. O que eu faço?",
  },
  {
    id: "pt-026",
    lang: "pt",
    text: "O Brasileirão 2025 terá 380 jogos entre 13/04 e 07/12. Quantos jogos por rodada?",
  },
  {
    id: "pt-027",
    lang: "pt",
    text: "O carro tem 85.300 km e é de 2019, pedem R$ 74.900,00. Está caro?",
  },
  {
    id: "pt-028",
    lang: "pt",
    text: "O financiamento é de R$ 350.000,00 em 360 meses a 9,5% ao ano. Qual a parcela?",
  },
  {
    id: "pt-029",
    lang: "pt",
    text: "Minha fatura nº 299-2044339 do cartão veio com uma cobrança que não reconheço. Como contesto?",
  },
  {
    id: "pt-030",
    lang: "pt",
    text: "Os ingressos custam R$ 180,00 (inteira) e R$ 90,00 (meia). Para 2 adultos e 3 estudantes, quanto dá?",
  },
  {
    id: "pt-031",
    lang: "pt",
    text: "Quantas calorias tem 150 g de arroz, 100 g de feijão e 120 g de frango grelhado?",
  },
  {
    id: "pt-032",
    lang: "pt",
    text: "O prédio tem 32 andares, 4 apartamentos por andar e 128 vagas de garagem. Escreve um anúncio.",
  },
  {
    id: "pt-033",
    lang: "pt",
    text: "Ganhamos de 98 a 87 no basquete ontem, com 24 pontos do nosso pivô. Escreve um post para o Instagram.",
  },
  {
    id: "pt-034",
    lang: "pt",
    text: "O curso vai de 03/02/2026 a 30/06/2026, terças e quintas das 19h00 às 22h00. Quantas aulas são?",
  },
  {
    id: "pt-035",
    lang: "pt",
    text: "A cidade tem 12.325.232 habitantes e 1.521 km². Qual a densidade?",
  },
  {
    id: "pt-036",
    lang: "pt",
    text: "Quero dividir R$ 1.250,00 entre 4 amigos, sendo que um pagou R$ 400,00 adiantado. Quanto cada um deve?",
  },
  {
    id: "ar-001",
    lang: "ar",
    text: "الاجتماع القادم يوم 14/11/2025 الساعة 3:00 مساءً في القاعة 305. اكتب لي رسالة قصيرة للفريق.",
  },
  {
    id: "ar-002",
    lang: "ar",
    text: "وصفة الكبسة: 1 كيلو أرز، 1.5 كيلو دجاج، 3 بصلات، 2 طماطم، 750 مل ماء، على نار هادئة 45 دقيقة. هل يمكن استخدام قدر الضغط؟",
  },
  {
    id: "ar-003",
    lang: "ar",
    text: "فاز الهلال على النصر 3-1 يوم 25/10/2025 أمام 62,345 متفرج. لخص المباراة في ثلاث جمل.",
  },
  {
    id: "ar-004",
    lang: "ar",
    text: "الإيجار 45,000 ريال سنوياً مع 5,000 ريال تأمين. كم يكون شهرياً؟",
  },
  {
    id: "ar-005",
    lang: "ar",
    text: "عدد سكان مصر في 2024 حوالي 107,271,260 نسمة. كم منهم في القاهرة؟",
  },
  {
    id: "ar-006",
    lang: "ar",
    text: "رقم الطلب 171-4859230-6612048 لم يصل حتى الآن. اكتب لي رسالة لخدمة العملاء.",
  },
  {
    id: "ar-007",
    lang: "ar",
    text: "رحلة الخطوط السعودية SV 1023 تقلع من الرياض 14:35 وتصل جدة 16:20. كم مدة الرحلة؟",
  },
  {
    id: "ar-008",
    lang: "ar",
    text: "2026-02-10 09:00 إلى 2026-02-10 11:30 ورشة عمل عن بعد. اكتب تذكيراً.",
  },
  {
    id: "ar-009",
    lang: "ar",
    text: "المبيعات: يناير 1,245,300 درهم، فبراير 1,389,150 درهم، مارس 1,402,880 درهم. احسب النمو الشهري.",
  },
  {
    id: "ar-010",
    lang: "ar",
    text: "ركضت 10 كم في 58:42، يعني 5:52 لكل كيلومتر. هل هذا وقت جيد؟",
  },
  {
    id: "ar-011",
    lang: "ar",
    text: "رقم التتبع 7734 5512 0098 لا يتحدث منذ أسبوع. ماذا أفعل؟",
  },
  {
    id: "ar-012",
    lang: "ar",
    text: "فاتورة رقم 2025-11-00087 بمبلغ 12,870 ريال، آخر موعد للدفع 30/11/2025. اكتب تذكيراً مهذباً.",
  },
  {
    id: "ar-013",
    lang: "ar",
    text: "ترتيب الدوري: 1. الهلال 30 مباراة 72 نقطة، 2. النصر 30 مباراة 68 نقطة، 3. الاتحاد 30 مباراة 61 نقطة. من سيفوز باللقب؟",
  },
  {
    id: "ar-014",
    lang: "ar",
    text: "المسافة من دبي إلى أبوظبي 140 كم، ساعة و30 دقيقة بالسيارة، والبنزين 45 درهم. هل الحافلة أرخص؟",
  },
  {
    id: "ar-015",
    lang: "ar",
    text: "ميزانية المشروع 12,500,000 ريال منها رواتب 6,123,456 ريال. ما النسبة؟",
  },
  {
    id: "ar-016",
    lang: "ar",
    text: "ساعات العمل من الأحد إلى الخميس 8:00 - 17:00. ترجمها إلى الإنجليزية.",
  },
  {
    id: "ar-017",
    lang: "ar",
    text: "مواعيد الامتحانات 10/01/2026 و12/01/2026 و15/01/2026. ضع لي خطة مراجعة.",
  },
  {
    id: "ar-018",
    lang: "ar",
    text: "رقم التذكرة 8821 4407 3315 والرحلة أُلغيت. كيف أطلب استرداد المبلغ؟",
  },
  {
    id: "hi-001",
    lang: "hi",
    text: "अगली मीटिंग 14/11/2025 को दोपहर 3:00 बजे कमरा 305 में है। टीम के लिए एक छोटा सा संदेश लिख दो।",
  },
  {
    id: "hi-002",
    lang: "hi",
    text: "दाल मखनी के लिए: 250 ग्राम उड़द दाल, 50 ग्राम राजमा, 2 टमाटर, 100 मिली क्रीम, 6 घंटे भिगोना। क्या इसे कुकर में बना सकते हैं?",
  },
  {
    id: "hi-003",
    lang: "hi",
    text: "भारत ने ऑस्ट्रेलिया को 6 विकेट से हराया, स्कोर 287/4 बनाम 285/9, दर्शक 1,32,000। मैच का सारांश लिखो।",
  },
  {
    id: "hi-004",
    lang: "hi",
    text: "किराया ₹25,000 महीना है और सिक्योरिटी ₹75,000। साल का कुल खर्च कितना होगा?",
  },
  {
    id: "hi-005",
    lang: "hi",
    text: "भारत की जनसंख्या 2024 में लगभग 1,44,17,19,852 थी। इसमें से कितने लोग शहरों में रहते हैं?",
  },
  {
    id: "hi-006",
    lang: "hi",
    text: "मेरा ऑर्डर नंबर 408-7712345-6634021 अभी तक नहीं आया। ग्राहक सेवा को क्या लिखूँ?",
  },
  {
    id: "hi-007",
    lang: "hi",
    text: "ट्रेन 12951 मुंबई राजधानी 16:35 पर छूटती है और 08:32 पर दिल्ली पहुँचती है, कोच B4, सीट 52। सफर कितने घंटे का है?",
  },
  {
    id: "hi-008",
    lang: "hi",
    text: "2025-12-20 10:00 से 2025-12-20 13:00 तक ऑनलाइन क्लास है। एक रिमाइंडर बना दो।",
  },
  {
    id: "hi-009",
    lang: "hi",
    text: "इस साल की बिक्री: अप्रैल ₹12,45,300, मई ₹13,89,150, जून ₹14,02,880। औसत कितना है?",
  },
  {
    id: "hi-010",
    lang: "hi",
    text: "मैंने 10 किमी 58:42 में दौड़ा, यानी 5:52 प्रति किमी। क्या यह अच्छा समय है?",
  },
  { id: "hi-011", lang: "hi", text: "पिनकोड 110001 और 400001 कहाँ के हैं?" },
  {
    id: "hi-012",
    lang: "hi",
    text: "मेरा ट्रैकिंग नंबर 7734 5512 0098 पाँच दिन से अपडेट नहीं हुआ। क्या करूँ?",
  },
  {
    id: "hi-013",
    lang: "hi",
    text: "इनवॉइस नंबर 2025-11-00087, राशि ₹1,28,700, भुगतान की आखिरी तारीख 30/11/2025। विनम्र रिमाइंडर लिखो।",
  },
  {
    id: "hi-014",
    lang: "hi",
    text: "आईपीएल अंक तालिका: 1. चेन्नई 14 मैच 20 अंक, 2. मुंबई 14 मैच 18 अंक, 3. बेंगलुरु 14 मैच 16 अंक। प्लेऑफ़ में कौन जाएगा?",
  },
  {
    id: "hi-015",
    lang: "hi",
    text: "दिल्ली से जयपुर 280 किमी है, कार से 5 घंटे और ₹2,400 का पेट्रोल। बस से कितना सस्ता पड़ेगा?",
  },
  {
    id: "hi-016",
    lang: "hi",
    text: "टिकट नंबर 8821 4407 3315 वाली फ्लाइट कैंसिल हो गई, रिफंड कैसे माँगूँ?",
  },
  {
    id: "hi-017",
    lang: "hi",
    text: "प्रोजेक्ट का बजट ₹12,50,00,000 है, जिसमें वेतन ₹6,12,34,567। प्रतिशत निकाल दो।",
  },
  {
    id: "hi-018",
    lang: "hi",
    text: "दुकान का समय: सोमवार से शनिवार 10:00 से 20:00 तक। इसे अंग्रेज़ी में लिखो।",
  },
  {
    id: "hi-019",
    lang: "hi",
    text: "परीक्षा की तारीखें 10/03/2026, 12/03/2026 और 17/03/2026 हैं। पढ़ाई का प्लान बनाओ।",
  },
  {
    id: "ja-001",
    lang: "ja",
    text: "来週の会議は2025年11月14日(金)15:00から、会議室305で行います。案内メールを書いてください。",
  },
  {
    id: "ja-002",
    lang: "ja",
    text: "カレーの材料：玉ねぎ2個、にんじん1本、じゃがいも3個、豚肉300g、水700ml。煮込み時間は何分くらいですか？",
  },
  {
    id: "ja-003",
    lang: "ja",
    text: "昨日の試合は巨人が阪神に5対3で勝ちました。観客は42,315人でした。試合のまとめを3行で書いて。",
  },
  {
    id: "ja-004",
    lang: "ja",
    text: "家賃は月85,000円、管理費5,000円、敷金170,000円です。初期費用の合計はいくらですか？",
  },
  {
    id: "ja-005",
    lang: "ja",
    text: "日本の人口は2024年10月時点で123,802,000人です。東京都の割合を教えて。",
  },
  {
    id: "ja-006",
    lang: "ja",
    text: "注文番号 249-5730912-8841265 の商品がまだ届きません。問い合わせの文面を作ってください。",
  },
  {
    id: "ja-007",
    lang: "ja",
    text: "新幹線のぞみ215号は東京8:30発、新大阪10:57着、7号車12番A席です。乗り換えは何分ありますか？",
  },
  {
    id: "ja-008",
    lang: "ja",
    text: "2026/03/15 10:30 から 2026/03/15 12:00 まで、オンライン説明会があります。告知文を作って。",
  },
  {
    id: "ja-009",
    lang: "ja",
    text: "売上は第1四半期1,245,300円、第2四半期1,389,150円、第3四半期1,402,880円でした。前年比を計算して。",
  },
  {
    id: "ja-010",
    lang: "ja",
    text: "マラソンのタイムは3時間42分15秒、1キロ平均5分16秒でした。サブ3.5に必要なペースは？",
  },
  {
    id: "ja-011",
    lang: "ja",
    text: "郵便番号 100-0001 と 150-0002 はどこの地域ですか？",
  },
  {
    id: "ja-012",
    lang: "ja",
    text: "問い合わせ番号 5735-1234-8890 の荷物が配達中のままです。どうすればいいですか？",
  },
  {
    id: "ja-013",
    lang: "ja",
    text: "請求書番号 2025-11-00087、金額 128,700円、支払期限 2025年11月30日。支払いのお願いメールを書いて。",
  },
  {
    id: "ja-014",
    lang: "ja",
    text: "今年の目標：毎日10,000歩、体重を68.5kgから63kgに、読書を年間24冊。計画を立てて。",
  },
  {
    id: "ja-015",
    lang: "ja",
    text: "セ・リーグの順位：1位 阪神 85勝 53敗、2位 DeNA 74勝 66敗、3位 巨人 70勝 69敗。CS の組み合わせは？",
  },
  {
    id: "ja-016",
    lang: "ja",
    text: "東京から大阪まで約500km、新幹線で2時間30分、料金は14,720円です。夜行バスと比べて。",
  },
  {
    id: "ja-017",
    lang: "ja",
    text: "ケーキを焼きます。薄力粉120g、砂糖90g、卵3個、牛乳30ml、170℃で35分。ふわふわにするコツは？",
  },
  {
    id: "ja-018",
    lang: "ja",
    text: "宝くじの番号は 03 11 19 24 32 37 でした。当選確率はどのくらいですか？",
  },
  {
    id: "ja-019",
    lang: "ja",
    text: "伝票番号 4127-8833-0951 で送った荷物が戻ってきました。理由として何が考えられますか？",
  },
  {
    id: "ja-020",
    lang: "ja",
    text: "2025年度の予算は 1,250,000,000円、うち人件費 612,345,678円。割合を出して。",
  },
  {
    id: "ja-021",
    lang: "ja",
    text: "営業時間は平日 9:00〜18:00、土曜 10:00〜15:00 です。英語に訳してください。",
  },
  {
    id: "ja-022",
    lang: "ja",
    text: "試験日は 2026年1月17日、1月18日、2月25日です。勉強スケジュールを作って。",
  },
  {
    id: "zh-001",
    lang: "zh",
    text: "下周的会议定在2025年11月14日下午3点，在305会议室。帮我写一封通知邮件。",
  },
  {
    id: "zh-002",
    lang: "zh",
    text: "红烧肉的做法：五花肉500克，冰糖30克，生抽2勺，老抽1勺，小火炖60分钟。可以用电饭锅做吗？",
  },
  {
    id: "zh-003",
    lang: "zh",
    text: "昨晚的比赛，上海海港3比1战胜北京国安，现场观众52,318人。帮我写个简短的赛后总结。",
  },
  {
    id: "zh-004",
    lang: "zh",
    text: "房租每月4,500元，押一付三，一共要先交18,000元。这个价格在杭州贵吗？",
  },
  {
    id: "zh-005",
    lang: "zh",
    text: "中国人口在2023年底是1,409,670,000人，比上一年减少了多少？",
  },
  {
    id: "zh-006",
    lang: "zh",
    text: "我的订单号 202511041234567890 显示已签收，但我没收到。怎么联系客服？",
  },
  {
    id: "zh-007",
    lang: "zh",
    text: "快递单号 7734 5512 0098 一直显示在运输中，已经五天了，正常吗？",
  },
  {
    id: "zh-008",
    lang: "zh",
    text: "运单号 SF1234567890123 的包裹被退回了，可能是什么原因？",
  },
  {
    id: "zh-009",
    lang: "zh",
    text: "高铁G1次北京南07:00开，上海虹桥11:29到，8车12F座。中途停几站？",
  },
  {
    id: "zh-010",
    lang: "zh",
    text: "2026-01-15 09:30 到 2026-01-15 11:00 有线上培训，帮我写个提醒。",
  },
  {
    id: "zh-011",
    lang: "zh",
    text: "这季度销售额：一月 1,245,300元，二月 1,389,150元，三月 1,402,880元。帮我算一下环比增长。",
  },
  {
    id: "zh-012",
    lang: "zh",
    text: "跑了一个半程马拉松，用时1小时52分30秒，配速5分20秒。怎么提高到1小时45分？",
  },
  { id: "zh-013", lang: "zh", text: "邮编 100000 和 200000 分别是哪个城市？" },
  {
    id: "zh-014",
    lang: "zh",
    text: "发票号码 0441 2589 6630，金额 3,280.00元，开票日期2025-10-28。帮我写报销说明。",
  },
  {
    id: "zh-015",
    lang: "zh",
    text: "今天走了12,345步，消耗了420千卡，体重从72.5公斤降到70.8公斤了。给我一些鼓励的话。",
  },
  {
    id: "zh-016",
    lang: "zh",
    text: "中超积分榜：第1名 上海海港 30场 68分，第2名 上海申花 30场 66分，第3名 成都蓉城 30场 58分。谁能拿冠军？",
  },
  {
    id: "zh-017",
    lang: "zh",
    text: "从北京到上海1,318公里，高铁4小时28分钟，二等座553元。和飞机比哪个更划算？",
  },
  {
    id: "zh-018",
    lang: "zh",
    text: "彩票号码是 05 12 18 23 29 33 加 07，中奖概率是多少？",
  },
  {
    id: "zh-019",
    lang: "zh",
    text: "工单号 2025-1104-0087 一直没人处理，帮我写个催办的消息。",
  },
  {
    id: "zh-020",
    lang: "zh",
    text: "项目预算 12,500,000元，其中人工成本 6,123,456元。占比是多少？",
  },
  {
    id: "zh-021",
    lang: "zh",
    text: "营业时间：周一至周五 9:00-18:00，周六 10:00-16:00。翻译成英文。",
  },
  {
    id: "zh-022",
    lang: "zh",
    text: "考试时间是2026年1月10日、1月12日和1月15日，帮我做个复习计划。",
  },
  {
    id: "zh-023",
    lang: "zh",
    text: "訂單編號 3021 5567 8890 的商品還沒到，請幫我寫一封詢問信。",
  },
];
