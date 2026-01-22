import { EBook } from '@/components/ebook/ebook-reader';

// Sample e-books for the library
export const sampleEBooks: EBook[] = [
    {
        id: 'ebook-1',
        title: 'The Art of Conversation',
        author: 'English Learning Press',
        coverImage: '/covers/conversation.jpg',
        level: 'B1',
        genre: 'Non-fiction',
        totalPages: 45,
        chapters: [
            {
                id: 'ch-1-1',
                title: 'Chapter 1: The Power of Small Talk',
                pageStart: 1,
                content: `Small talk is more than just idle chatter. It is the foundation of human connection and the gateway to deeper relationships. When we engage in small talk, we are signaling our openness to communication and our interest in the other person.

Many people underestimate the importance of small talk, viewing it as superficial or unnecessary. However, research has shown that these brief exchanges play a crucial role in building trust and establishing rapport. Whether you are meeting a new colleague, chatting with a neighbor, or making conversation at a party, small talk serves as the essential first step.

The key elements of effective small talk include: asking open-ended questions, showing genuine interest, and finding common ground. Instead of asking "Do you like your job?" try "What do you enjoy most about your work?" This invites a more thoughtful response and creates opportunities for meaningful dialogue.

Common topics for small talk include the weather, recent events, travel experiences, and shared observations about your environment. The goal is not to have a profound discussion, but to create a comfortable atmosphere where both parties feel at ease.

Practice makes perfect when it comes to small talk. The more you engage in these brief conversations, the more natural they will become. Start by challenging yourself to have one meaningful small talk exchange each day, and you will soon notice your confidence growing.`
            },
            {
                id: 'ch-1-2',
                title: 'Chapter 2: Active Listening Skills',
                pageStart: 10,
                content: `Active listening is perhaps the most underrated skill in conversation. While many of us focus on what we want to say, truly effective communicators prioritize understanding what others are trying to convey.

Active listening involves several key components. First, you must give your full attention to the speaker. This means putting away distractions, making eye contact, and positioning your body to show engagement. Second, you should provide verbal and non-verbal feedback to indicate that you are following along.

One powerful technique is called "reflective listening." This involves paraphrasing what the speaker has said to confirm your understanding. For example, you might say, "So what you're saying is that you felt overwhelmed by the project deadline?" This shows the speaker that you are genuinely engaged with their message.

Another important aspect of active listening is resisting the urge to interrupt. Many of us are so eager to share our own thoughts that we cut off others mid-sentence. This not only prevents us from fully understanding their perspective but also makes them feel disrespected.

Finally, ask clarifying questions when something is unclear. Phrases like "Could you tell me more about...?" or "What did you mean when you said...?" demonstrate your interest and help ensure accurate communication.`
            },
            {
                id: 'ch-1-3',
                title: 'Chapter 3: Navigating Difficult Conversations',
                pageStart: 20,
                content: `Every relationship, whether personal or professional, eventually requires us to have difficult conversations. These might involve giving critical feedback, discussing sensitive topics, or addressing conflicts. While such conversations can be uncomfortable, avoiding them often makes matters worse.

The first step in navigating difficult conversations is preparation. Before initiating the discussion, take time to clarify your goals. What outcome are you hoping to achieve? What points do you need to make? What compromises might be acceptable?

Timing and setting are also crucial. Choose a private location where both parties feel comfortable, and avoid initiating difficult conversations when either person is stressed, tired, or rushed. Beginning with phrases like "I have something important I would like to discuss with you when you have time" can help set the right tone.

During the conversation itself, use "I" statements rather than "you" statements. Instead of saying "You never listen to me," try "I feel unheard when I don't have the chance to finish my thoughts." This approach reduces defensiveness and keeps the focus on finding solutions.

Remember that difficult conversations require patience. Give the other person time to process your words and respond thoughtfully. Avoid rushing to fill silences, as these pauses often lead to valuable insights and breakthroughs.`
            },
            {
                id: 'ch-1-4',
                title: 'Chapter 4: Building Long-lasting Relationships',
                pageStart: 32,
                content: `Strong relationships are built on a foundation of consistent, meaningful communication. While initial connections might be sparked by shared interests or circumstances, lasting bonds require ongoing investment and nurturing.

One of the most important factors in maintaining relationships is regular contact. In our busy lives, it is easy to let weeks or months pass without reaching out to important people. Setting reminders or establishing rituals, such as weekly phone calls or monthly meetups, can help ensure these connections remain strong.

Vulnerability plays a crucial role in deepening relationships. When we share our authentic thoughts, fears, and dreams, we invite others to do the same. This mutual openness creates intimacy and trust that surface-level interactions cannot achieve.

It is also important to celebrate others' successes and support them through challenges. Being present during both good times and bad demonstrates that your relationship is about more than just personal convenience. Small gestures, like sending a congratulatory message or offering help during a difficult period, can make a significant impact.

Finally, healthy relationships require managing conflicts constructively. Disagreements are inevitable, but they need not be destructive. Approach conflicts with curiosity rather than defensiveness, seeking to understand the other person's perspective before advocating for your own.`
            }
        ]
    },
    {
        id: 'ebook-2',
        title: 'Grammar Essentials: A Practical Guide',
        author: 'Dr. Sarah Mitchell',
        coverImage: '/covers/grammar.jpg',
        level: 'B2',
        genre: 'Education',
        totalPages: 60,
        chapters: [
            {
                id: 'ch-2-1',
                title: 'Chapter 1: Understanding Tenses',
                pageStart: 1,
                content: `English tenses form the backbone of communication, allowing us to express when actions occur and how they relate to each other in time. While there are twelve main tenses in English, mastering them becomes manageable when you understand the underlying patterns.

The simple tenses (past, present, and future) express completed actions or facts. "She works in London" describes a current fact. "She worked in Paris last year" refers to a completed past action. "She will work in Berlin next month" projects an action into the future.

Continuous (or progressive) tenses emphasize that an action is or was in progress. "She is working on a report" suggests ongoing activity. "She was working when I called" places the ongoing action in the past. "She will be working at that time" projects ongoing activity into the future.

Perfect tenses connect two time periods. "She has worked here for five years" connects past experience to the present moment. "She had worked there before moving" connects an earlier past to a later past. "She will have worked here for ten years by 2025" projects a connection between now and a future point.

Perfect continuous tenses combine the features of both perfect and continuous aspects. These are used when we want to emphasize both the duration and ongoing nature of an activity that connects two time periods.`
            },
            {
                id: 'ch-2-2',
                title: 'Chapter 2: Mastering Articles',
                pageStart: 15,
                content: `Articles (a, an, and the) are among the most frequently used words in English, yet they present significant challenges for learners. Understanding when to use each article—and when to use no article at all—requires attention to both grammar rules and the context of communication.

The definite article "the" is used when both the speaker and listener know which specific thing is being discussed. This might be because the item has already been mentioned, because it is unique, or because the context makes the reference clear. "The sun rises in the east" refers to one specific sun. "I read the book you recommended" refers to a specific, previously mentioned book.

Indefinite articles "a" and "an" introduce non-specific items or first mentions and they are used only with singular countable nouns. "I saw a cat in the garden" introduces a cat for the first time. "She is an engineer" identifies someone's profession without specifying which particular engineer.

The choice between "a" and "an" depends on the sound that follows, not the spelling. We say "a university" because "university" begins with a consonant sound, but "an hour" because "hour" begins with a silent h.

Zero article (no article) is used with plural countable nouns and uncountable nouns when speaking generally. "Cats are independent animals" refers to cats in general. "Water is essential for life" speaks about water as a concept.`
            }
        ]
    },
    {
        id: 'ebook-3',
        title: 'Short Stories for English Learners',
        author: 'Various Authors',
        coverImage: '/covers/stories.jpg',
        level: 'A2',
        genre: 'Fiction',
        totalPages: 35,
        chapters: [
            {
                id: 'ch-3-1',
                title: 'The Lost Key',
                pageStart: 1,
                content: `Maria looked everywhere for her key. She checked her bag. She checked her pockets. She looked under the sofa and behind the door. But she could not find it anywhere.

"This is terrible," she thought. "I need my key to open the door. How will I get into my apartment?"

Maria sat down on the stairs outside her building and tried to think. Where had she last seen the key? She remembered putting it in her pocket that morning when she left for work.

Then she remembered something. At lunchtime, she had changed her jacket because the weather became warmer. Could the key be in her other jacket?

Maria called her colleague, Tom. "Tom, can you check my desk? I left my blue jacket there. Is there a key in the pocket?"

"Let me see," said Tom. "Yes! There is a key here. Do you want me to bring it to you?"

"Yes, please!" said Maria. "That would be wonderful."

Thirty minutes later, Tom arrived with the key. Maria was so happy. She thanked Tom many times and promised to be more careful in the future.

From that day on, Maria always kept her key in the same place: on a special hook by her door.`
            },
            {
                id: 'ch-3-2',
                title: 'A Day at the Beach',
                pageStart: 12,
                content: `The sun was shining brightly when Sophie and her family arrived at the beach. Sophie was very excited because she loved the sea.

"Can I go swimming now?" she asked her parents.

"Wait a moment," said her mother. "First, we need to put on sunscreen to protect our skin."

After putting on sunscreen, Sophie ran toward the water. The waves were small and gentle. The water was cold at first, but Sophie soon got used to it.

Her younger brother, Max, was building a sandcastle near the water. He used a bucket to make towers and decorated them with shells he found on the beach.

"Look, Sophie! I made a castle for a king!" Max said proudly.

"It is beautiful," Sophie replied. "The king would be very happy to live there."

For lunch, the family had sandwiches and fruit. They sat under a large umbrella to stay cool. Sophie's father bought ice cream from a man walking on the beach.

In the afternoon, Sophie and Max collected shells and looked at the small fish in the rock pools. They saw crabs and starfish too.

When the sun started to set, it was time to go home. Sophie was tired but happy. She fell asleep in the car, dreaming about the waves and the warm sand.`
            }
        ]
    },
    {
        id: 'ebook-4',
        title: 'Business English: Professional Communication',
        author: 'James Crawford',
        coverImage: '/covers/business.jpg',
        level: 'C1',
        genre: 'Business',
        totalPages: 55,
        chapters: [
            {
                id: 'ch-4-1',
                title: 'Chapter 1: Writing Professional Emails',
                pageStart: 1,
                content: `In the modern business world, email remains the primary mode of written communication. The ability to write clear, professional emails is therefore an essential skill for anyone working in an international environment.

A well-structured email typically contains five key elements: a clear subject line, an appropriate greeting, a concise body, a clear call to action, and a professional closing.

The subject line should accurately summarize the email's content. Instead of vague subjects like "Question" or "Update," be specific: "Q3 Sales Report - Review Requested by Friday" tells the recipient exactly what to expect.

Your greeting should match your relationship with the recipient. "Dear Mr. Johnson" is appropriate for formal correspondence with someone you do not know well. "Hi Sarah" works for colleagues you interact with regularly. Avoid overly casual greetings like "Hey" in professional contexts.

The body of your email should be organized logically, with the most important information appearing first. Use short paragraphs and bullet points to enhance readability. Assume that busy professionals will skim rather than read every word carefully.

Your call to action should be explicit. Rather than hoping the recipient understands what you need, state it clearly: "Please review the attached document and send your feedback by Wednesday, March 15."

Finally, close with an appropriate sign-off. "Best regards" and "Kind regards" are safe choices for most professional correspondence.`
            }
        ]
    }
];
