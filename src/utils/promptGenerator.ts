/**
 * Generate generic prompt templates for a new subcategory
 * These prompts are designed to work for any category/subcategory combination
 */

interface GeneratedPrompts {
  evaluation: string;
  planning: string;
  synthesis: string;
}

export function generatePromptsForSubcategory(
  categoryName: string,
  subcategoryName: string
): GeneratedPrompts {
  const lowerCaseCategory = categoryName.toLowerCase();
  const lowerCaseSubcategory = subcategoryName.toLowerCase();
  const combinedContext = `${lowerCaseCategory} - ${lowerCaseSubcategory}`;

  return {
    evaluation: `I want you to help me evaluate my ${combinedContext}.

{{CONTEXT}}

To give you an accurate assessment, please start by asking me about:
1. What aspects of ${lowerCaseSubcategory} are most important to me in my ${lowerCaseCategory}
2. My current situation with ${lowerCaseSubcategory}
3. What's working well and what isn't
4. Any challenges or pain points I'm experiencing
5. My goals or desired outcomes for ${lowerCaseSubcategory}
6. What success looks like to me in this area

Once you understand my situation, please analyze:
- How things are going overall
- Patterns or themes you notice
- Strengths I can build on
- Areas that need attention or improvement
- Any risks or concerns you see

Please ask clarifying questions before assessing.`,

    planning: `I want you to help me create a plan for my ${combinedContext}.

{{CONTEXT}}

To create an effective plan, please start by asking me about:
1. What I want to achieve with ${lowerCaseSubcategory} in my ${lowerCaseCategory}
2. My current starting point
3. My available time, resources, and constraints
4. What's worked or hasn't worked for me before
5. My priorities and what matters most
6. Any deadlines or timeframes I'm working with
7. What obstacles or challenges I anticipate

Once you understand my situation, please help me design a plan that:
- Moves me toward my goals
- Is realistic and achievable given my constraints
- Builds on my strengths
- Addresses key challenges
- Includes clear next steps

Please ask clarifying questions before creating the plan.`,

    synthesis: `Based on our conversation about ${combinedContext}, please provide a comprehensive synthesis that includes:

1. **Key Insights**: The most important things we discussed
2. **Main Themes**: Recurring patterns or central ideas
3. **Action Items**: Concrete next steps or recommendations
4. **Progress**: How things have evolved (if we've discussed this before)
5. **Focus Areas**: What deserves attention going forward

Please structure this in a clear, organized way that I can reference later.`
  };
}

/**
 * The universal synthesis prompt that works for all categories
 */
export const UNIVERSAL_SYNTHESIS_PROMPT = `Based on our conversation, please provide a comprehensive synthesis that includes:

1. **Key Insights**: The most important things we discussed
2. **Main Themes**: Recurring patterns or central ideas
3. **Action Items**: Concrete next steps or recommendations
4. **Progress**: How things have evolved (if we've discussed this before)
5. **Focus Areas**: What deserves attention going forward

Please structure this in a clear, organized way that I can reference later.`;
