import { nanoid } from 'nanoid';
import type { Category, Settings } from '../types';

// Universal synthesis prompt used across all subcategories
export const UNIVERSAL_SYNTHESIS_PROMPT = `Let's wrap up this conversation. Please provide a clear synthesis:

**Key Insights**
- The most important things we discussed or I learned

**Decisions Made**
- Any conclusions or choices I've landed on

**Action Items**
- Specific next steps (be concrete)

**Open Questions**
- Anything unresolved to revisit later

Keep it concise and actionable. I'll save this for future reference.`;

// Default categories with subcategories and prompt templates
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: nanoid(),
    name: 'Health',
    icon: 'Heart',
    order: 0,
    subcategories: [
      {
        id: nanoid(),
        name: 'Exercise',
        categoryId: '', // Will be set when creating
        order: 0,
        promptTemplates: {
          evaluation: `I want you to help me evaluate my current exercise routine and fitness level.

{{CONTEXT}}

To give you an accurate assessment, please start by asking me about:
1. My current exercise routine (what I do, how often, intensity)
2. My fitness goals (strength, weight loss, endurance, mobility, etc.)
3. My schedule and time availability
4. Any injuries, limitations, or health conditions
5. How I'm currently feeling (energy levels, recovery, motivation)

Once you understand my situation, please analyze:
- Whether my routine is balanced (strength, cardio, mobility, recovery)
- If I'm progressing toward my goals or have plateaued
- Any signs of overtraining or undertraining
- What's missing that could make a big difference

Please ask me clarifying questions to understand my situation fully before giving your assessment.`,
          planning: `I want you to help me create or refine my exercise routine.

{{CONTEXT}}

To create an effective plan, please start by asking me about:
1. My specific fitness goals (strength, endurance, weight loss, etc.)
2. My experience level with exercise
3. My available time and schedule
4. Equipment I have access to (gym, home equipment, bodyweight only)
5. Any injuries, limitations, or health conditions
6. What I enjoy doing (increases adherence)

Once you understand my situation, please help me design a routine that:
- Aligns with my specific goals
- Fits my available time and equipment
- Balances intensity with recovery
- Is sustainable long-term
- Progressively challenges me

Please ask clarifying questions before creating the plan.`,
          synthesis: UNIVERSAL_SYNTHESIS_PROMPT,
        },
      },
      {
        id: nanoid(),
        name: 'Nutrition',
        categoryId: '',
        order: 1,
        promptTemplates: {
          evaluation: `I want you to evaluate my current nutrition and eating habits.

{{CONTEXT}}

To give you an accurate assessment, please start by asking me about:
1. My typical daily eating patterns (meals, snacks, timing)
2. My nutrition goals (weight loss, muscle gain, energy, health, etc.)
3. Any dietary restrictions or preferences (allergies, vegetarian, etc.)
4. How I feel day-to-day (energy levels, digestion, cravings)
5. My relationship with food and any challenges I face

Once you understand my situation, please analyze:
- What's working well in my current approach
- Any nutritional gaps or concerns you notice
- How well my eating supports my goals
- What habits might be holding me back

Please ask me clarifying questions to understand my nutrition situation fully before assessing.`,
          planning: `I want you to help me create a practical nutrition approach.

{{CONTEXT}}

To create an effective plan, please start by asking me about:
1. My nutrition goals (weight loss, muscle gain, energy, health, etc.)
2. My food preferences and what I enjoy eating
3. Any dietary restrictions or allergies
4. My cooking skills and time available for meal prep
5. My typical daily schedule and meal timing
6. My budget for food
7. Whether I want structured meal plans or flexible guidelines

Once you understand my situation, please help me design a plan that:
- Supports my specific goals
- Works with my food preferences and restrictions
- Is realistic for my lifestyle and schedule
- Doesn't require obsessive tracking
- Is enjoyable and sustainable

Please ask clarifying questions before creating the plan.`,
          synthesis: UNIVERSAL_SYNTHESIS_PROMPT,
        },
      },
      {
        id: nanoid(),
        name: 'Sleep',
        categoryId: '',
        order: 2,
        promptTemplates: {
          evaluation: `I want you to help me evaluate my sleep quality and habits.

{{CONTEXT}}

To give you an accurate assessment, please start by asking me about:
1. My typical sleep schedule (bedtime, wake time, hours per night)
2. How I feel during the day (energy levels, alertness, mood)
3. My sleep environment (room temperature, light, noise, comfort)
4. My pre-bed routine and evening habits
5. Any sleep issues I'm experiencing (trouble falling asleep, staying asleep, waking up)
6. Factors that might affect my sleep (stress, caffeine, screen time, etc.)

Once you understand my situation, please analyze:
- Patterns you notice in my sleep habits
- Factors that might be affecting my sleep quality
- Whether I'm getting adequate recovery
- What improvements would have the biggest impact

Please ask me clarifying questions to understand my sleep situation fully before assessing.`,
          planning: `I want you to help me create a better sleep routine.

{{CONTEXT}}

To create an effective plan, please start by asking me about:
1. My current sleep schedule and when I need to wake up
2. My sleep goals (more hours, better quality, easier falling asleep, etc.)
3. My evening routine and pre-bed habits
4. My sleep environment (room setup, temperature, light, noise)
5. Factors affecting my sleep (stress, caffeine, screens, etc.)
6. My lifestyle constraints (work schedule, family, etc.)
7. What I've already tried

Once you understand my situation, please help me design a plan that:
- Improves my sleep quality
- Fits my lifestyle and schedule
- Addresses my specific challenges
- Is practical and easy to implement
- Can be adjusted gradually

Please ask clarifying questions before creating the plan.`,
          synthesis: UNIVERSAL_SYNTHESIS_PROMPT,
        },
      },
      {
        id: nanoid(),
        name: 'Mental Health',
        categoryId: '',
        order: 3,
        promptTemplates: {
          evaluation: `I want you to help me evaluate my mental health and wellbeing.

{{CONTEXT}}

To give you an accurate assessment, please start by asking me about:
1. How I've been feeling lately (mood, energy, motivation)
2. My current stress levels and main sources of stress
3. My support systems (friends, family, therapy, etc.)
4. Coping strategies I use (what works, what doesn't)
5. Sleep, exercise, and self-care habits
6. Any major life changes or challenges I'm facing
7. What's been on my mind lately

Once you understand my situation, please analyze:
- Patterns you notice in my mental state
- What coping strategies are working or not working
- What stressors or challenges need attention
- Areas of growth or healing you see

Please ask clarifying questions and be supportive. If you notice serious concerns, encourage me to seek professional help.`,
          planning: `I want you to help me create a mental health support plan.

{{CONTEXT}}

To create an effective plan, please start by asking me about:
1. My mental health goals (reduce stress, improve mood, build resilience, etc.)
2. What I'm currently doing for mental health (therapy, meditation, exercise, etc.)
3. My support systems and relationships
4. My daily schedule and available time
5. What kind of practices appeal to me
6. Barriers I face in taking care of my mental health
7. Whether I'm working with a therapist or counselor

Once you understand my situation, please help me design a plan that:
- Addresses my specific challenges
- Builds on my strengths
- Includes practical daily practices
- Connects me with appropriate resources
- Is sustainable and compassionate

Please ask clarifying questions before creating the plan. Remember this complements but doesn't replace professional help.`,
          synthesis: UNIVERSAL_SYNTHESIS_PROMPT,
        },
      },
    ],
  },
  {
    id: nanoid(),
    name: 'Finance',
    icon: 'DollarSign',
    order: 1,
    subcategories: [
      {
        id: nanoid(),
        name: 'Budget & Spending',
        categoryId: '',
        order: 0,
        promptTemplates: {
          evaluation: `I want you to help me evaluate my current financial situation and spending habits.

{{CONTEXT}}

To give you an accurate assessment, please start by asking me about:
1. My monthly income (after tax)
2. My major fixed expenses (rent/mortgage, utilities, insurance, etc.)
3. My typical variable spending (food, entertainment, shopping, etc.)
4. Any debt I'm managing (credit cards, loans, etc.)
5. My financial goals (saving for something, building emergency fund, etc.)
6. My main financial concerns or stress points

Once you understand my situation, please analyze:
- How healthy my overall financial picture is
- Where money might be leaking unnecessarily
- Whether I'm on track for my financial goals
- Any risks or vulnerabilities you see

Please ask me clarifying questions to understand my finances fully before assessing. I know this is sensitive, so feel free to share only what you're comfortable with.`,
          planning: `I want you to help me create a practical budget or spending plan.

{{CONTEXT}}

To create an effective plan, please start by asking me about:
1. My monthly income (after tax)
2. My fixed expenses (rent, utilities, insurance, loan payments, etc.)
3. My variable expenses (food, transportation, entertainment, etc.)
4. My financial goals (emergency fund, saving for something, paying off debt, etc.)
5. What financial security and freedom mean to me
6. My spending habits and pain points
7. Whether I prefer detailed tracking or simple guidelines

Once you understand my situation, please help me design a plan that:
- Aligns with my actual priorities and values
- Is realistic and not overly restrictive
- Builds toward my goals
- Has clear guardrails without micromanaging every dollar
- Leaves room for enjoyment

Please ask clarifying questions before creating the plan.`,
          synthesis: UNIVERSAL_SYNTHESIS_PROMPT,
        },
      },
      {
        id: nanoid(),
        name: 'Savings & Investments',
        categoryId: '',
        order: 1,
        promptTemplates: {
          evaluation: `I want you to help me evaluate my savings and investment strategy.

{{CONTEXT}}

To give you an accurate assessment, please start by asking me about:
1. My savings and investment goals (retirement, house, emergency fund, etc.)
2. My timeline for each goal
3. My current savings rate and investment holdings
4. My risk tolerance and comfort with market volatility
5. My investment experience and knowledge level
6. Any upcoming major expenses or life changes

Once you understand my situation, please analyze:
- Whether I'm saving enough for my goals and timeline
- If my investment approach is appropriate for my situation
- Gaps or risks I should address
- Opportunities I might be missing

Please ask clarifying questions before assessing.`,
          planning: `I want you to help me create a savings and investment plan.

{{CONTEXT}}

To create an effective plan, please start by asking me about:
1. My specific financial goals and timelines
2. My current income and ability to save
3. My risk tolerance and investment experience
4. My existing savings and investments
5. Tax considerations (retirement accounts, etc.)
6. Whether I want active or passive investing
7. How involved I want to be in managing investments

Once you understand my situation, please help me design a plan that:
- Aligns with my specific goals and timeline
- Matches my risk tolerance
- Is practical to implement and maintain
- Balances growth with security
- Optimizes for tax efficiency

Please ask clarifying questions before creating the plan.`,
          synthesis: UNIVERSAL_SYNTHESIS_PROMPT,
        },
      },
      {
        id: nanoid(),
        name: 'Debt',
        categoryId: '',
        order: 2,
        promptTemplates: {
          evaluation: `I want you to help me evaluate my debt situation.

{{CONTEXT}}

To give you an accurate assessment, please start by asking me about:
1. All my debts (credit cards, student loans, car loans, mortgage, etc.)
2. For each debt: balance, interest rate, and minimum payment
3. My monthly income and expenses
4. How the debt affects me emotionally and financially
5. Whether I have any savings or emergency fund
6. My other financial obligations and goals

Once you understand my situation, please analyze:
- The total picture of my debt
- Which debts I should prioritize (considering interest rates and psychology)
- Whether I'm making progress or falling behind
- What strategy would be most effective for me

Please ask clarifying questions before assessing. This can be stressful, so be supportive.`,
          planning: `I want you to help me create a debt payoff plan.

{{CONTEXT}}

To create an effective plan, please start by asking me about:
1. All my debts with balances, interest rates, and minimum payments
2. My monthly income and fixed expenses
3. How much I can realistically put toward debt each month
4. Whether I prefer avalanche (high interest first) or snowball (small balance first)
5. My other financial priorities (emergency fund, retirement, etc.)
6. What motivates me and keeps me on track
7. Any windfalls or income changes expected

Once you understand my situation, please help me design a plan that:
- Prioritizes debts effectively
- Is realistic for my income and expenses
- Keeps me motivated with clear milestones
- Balances debt payoff with other financial needs
- Includes strategies to avoid new debt

Please ask clarifying questions before creating the plan.`,
          synthesis: UNIVERSAL_SYNTHESIS_PROMPT,
        },
      },
      {
        id: nanoid(),
        name: 'Income & Career',
        categoryId: '',
        order: 3,
        promptTemplates: {
          evaluation: `I want you to help me evaluate my income and career trajectory.

{{CONTEXT}}

To give you an accurate assessment, please start by asking me about:
1. My current role, company, and compensation
2. My years of experience and career progression so far
3. My skills, strengths, and areas of expertise
4. My career goals and definition of success
5. My industry and job market conditions
6. What I enjoy and what drains me at work
7. Any barriers or challenges I'm facing

Once you understand my situation, please analyze:
- Whether I'm being compensated fairly for my skills and experience
- Opportunities for income growth I should consider
- If my career path is aligned with my goals
- What skills or changes would have the biggest impact

Please ask clarifying questions before assessing.`,
          planning: `I want you to help me create a career and income growth plan.

{{CONTEXT}}

To create an effective plan, please start by asking me about:
1. My career goals (promotion, switch careers, side income, entrepreneurship, etc.)
2. My timeline and urgency
3. My current skills and what I want to develop
4. My constraints (location, family, risk tolerance, etc.)
5. What energizes me and what kind of work I want to do
6. My network and resources
7. What I've already tried or considered

Once you understand my situation, please help me design a plan that:
- Increases my income potential
- Aligns with my career goals and values
- Builds on my strengths
- Is actionable with clear next steps
- Includes both short-term wins and long-term strategy

Please ask clarifying questions before creating the plan.`,
          synthesis: UNIVERSAL_SYNTHESIS_PROMPT,
        },
      },
    ],
  },
  {
    id: nanoid(),
    name: 'Personal Growth',
    icon: 'Sparkles',
    order: 2,
    subcategories: [
      {
        id: nanoid(),
        name: 'Reading & Learning',
        categoryId: '',
        order: 0,
        promptTemplates: {
          evaluation: `I want you to help me evaluate my learning and reading habits.

{{CONTEXT}}

To give you an accurate assessment, please start by asking me about:
1. My learning goals (career skills, personal interests, general knowledge, etc.)
2. What I'm currently reading or learning
3. How much time I have for learning
4. How I learn best (reading, video, hands-on, etc.)
5. What's working well and what challenges I face
6. What motivates me to learn

Once you understand my situation, please analyze:
- Patterns you see in what and how I'm learning
- Whether I'm making meaningful progress toward my goals
- What's working well and what isn't
- What areas of knowledge would serve me most

Please ask clarifying questions before assessing.`,
          planning: `I want you to help me create a learning and reading plan.

{{CONTEXT}}

To create an effective plan, please start by asking me about:
1. My learning goals and what I want to achieve
2. My interests and what excites me
3. My available time and schedule
4. My learning style and preferences
5. Whether I want structured or flexible learning
6. My budget (if relevant for courses, books, etc.)
7. What's prevented me from learning consistently before

Once you understand my situation, please help me design a plan that:
- Aligns with my goals and interests
- Fits my schedule and learning style
- Balances depth with breadth
- Keeps me motivated and engaged
- Includes accountability measures

Please ask clarifying questions before creating the plan.`,
          synthesis: UNIVERSAL_SYNTHESIS_PROMPT,
        },
      },
      {
        id: nanoid(),
        name: 'Goals & Habits',
        categoryId: '',
        order: 1,
        promptTemplates: {
          evaluation: `I want you to help me evaluate my goals and habits.

{{CONTEXT}}

To give you an accurate assessment, please start by asking me about:
1. My current goals (what I'm working toward)
2. My daily habits and routines
3. What's working well and what isn't
4. Challenges or obstacles I'm facing
5. What success looks like to me
6. My motivation and energy levels

Once you understand my situation, please analyze:
- Whether my goals are clear and aligned with what matters to me
- What habits are serving me and which aren't
- What's getting in the way of progress
- What systems or changes would help most

Please ask clarifying questions before assessing.`,
          planning: `I want you to help me create a goal and habit plan.

{{CONTEXT}}

To create an effective plan, please start by asking me about:
1. My aspirations and what I want to achieve
2. My current habits (good and bad)
3. My daily schedule and lifestyle
4. What's held me back from achieving goals before
5. My accountability preferences (tracking, check-ins, etc.)
6. Whether I prefer big goals or small incremental changes
7. My energy patterns and when I'm most motivated

Once you understand my situation, please help me design a plan that:
- Sets clear, meaningful goals
- Builds sustainable habits
- Accounts for my lifestyle and constraints
- Has built-in accountability and tracking
- Starts small and builds momentum

Please ask clarifying questions before creating the plan.`,
          synthesis: UNIVERSAL_SYNTHESIS_PROMPT,
        },
      },
      {
        id: nanoid(),
        name: 'Relationships',
        categoryId: '',
        order: 2,
        promptTemplates: {
          evaluation: `I want you to help me evaluate my relationships and social connections.

{{CONTEXT}}

To give you an accurate assessment, please start by asking me about:
1. The key relationships in my life (family, friends, partner, colleagues)
2. Which relationships are going well and which aren't
3. How satisfied I feel with my social connections
4. Any relationship challenges or conflicts I'm facing
5. Whether I feel lonely, overwhelmed, or balanced socially
6. What I need from my relationships

Once you understand my situation, please analyze:
- Patterns you see in my relationships
- Which relationships are nourishing and which are draining
- What needs or boundaries might need attention
- What would strengthen my connections

Please ask clarifying questions before assessing.`,
          planning: `I want you to help me create a relationship action plan.

{{CONTEXT}}

To create an effective plan, please start by asking me about:
1. Which relationships matter most to me
2. What I want to improve or change
3. My available time and energy for relationships
4. Specific challenges I'm facing
5. My communication style and comfort level
6. What kind of support or connection I need
7. Boundaries I need to set or maintain

Once you understand my situation, please help me design a plan that:
- Strengthens important relationships
- Sets healthy boundaries where needed
- Makes time for meaningful connection
- Addresses specific challenges
- Feels authentic to who I am

Please ask clarifying questions before creating the plan.`,
          synthesis: UNIVERSAL_SYNTHESIS_PROMPT,
        },
      },
      {
        id: nanoid(),
        name: 'Projects & Hobbies',
        categoryId: '',
        order: 3,
        promptTemplates: {
          evaluation: `I want you to help me evaluate my projects and hobbies.

{{CONTEXT}}

To give you an accurate assessment, please start by asking me about:
1. My current projects and hobbies
2. What brings me joy and what feels like an obligation
3. Whether I'm making progress on what matters to me
4. My available time and energy
5. What's working well and what's stalled
6. What I'm hoping to create, learn, or experience

Once you understand my situation, please analyze:
- Which projects or hobbies are truly bringing me joy
- Whether I'm making progress on what matters to me
- What's working and what's stalled
- What would help me engage more meaningfully

Please ask clarifying questions before assessing.`,
          planning: `I want you to help me create a plan for my projects and hobbies.

{{CONTEXT}}

To create an effective plan, please start by asking me about:
1. What excites me and what I want to pursue
2. My available time and schedule
3. Current projects and their status
4. Whether I want to start new things or finish existing ones
5. My energy levels and when I'm most creative
6. What success looks like to me
7. What's prevented me from engaging with hobbies before

Once you understand my situation, please help me design a plan that:
- Makes time for what brings me joy
- Moves meaningful projects forward
- Balances ambition with sustainability
- Fits my schedule and energy
- Keeps me motivated and engaged

Please ask clarifying questions before creating the plan.`,
          synthesis: UNIVERSAL_SYNTHESIS_PROMPT,
        },
      },
    ],
  },
];

// Fix category IDs in subcategories
DEFAULT_CATEGORIES.forEach((category) => {
  category.subcategories.forEach((subcategory) => {
    subcategory.categoryId = category.id;
  });
});

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  viewMode: 'grid',
  theme: 'light',
  hasCompletedOnboarding: false,
};
