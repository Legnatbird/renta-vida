import { ChatAction } from '@/types/chat';
import { Goal } from '@/types/goals';

export const processMessage = async (
  message: string
): Promise<{ response: string; action?: ChatAction }> => {
  // This is a mock implementation - in a real app, this would call an AI service
  const lowerMessage = message.toLowerCase();
  
  // Simple pattern matching for demo purposes
  if (lowerMessage.includes('add') && lowerMessage.includes('goal')) {
    // Extract potential goal information
    let amount = 0;
    const amountMatch = message.match(/\$?(\d+)(?:,\d+)*(?:\.\d+)?(?:\s*(?:million|k|thousand))?/i);
    if (amountMatch) {
      const amountStr = amountMatch[1].replace(/,/g, '');
      amount = parseInt(amountStr, 10);
      
      // Handle "k", "thousand", "million"
      if (lowerMessage.includes('k') || lowerMessage.includes('thousand')) {
        amount *= 1000;
      } else if (lowerMessage.includes('million')) {
        amount *= 1000000;
      }
    }
    
    // Extract year
    let year = new Date().getFullYear() + 5; // Default to 5 years from now
    const yearMatch = message.match(/(?:in|by|for)\s+(\d{4})/i);
    if (yearMatch) {
      year = parseInt(yearMatch[1], 10);
    }
    
    // Extract goal title
    let title = 'New Financial Goal';
    if (lowerMessage.includes('house')) title = 'Buy a House';
    else if (lowerMessage.includes('car')) title = 'Buy a Car';
    else if (lowerMessage.includes('education') || lowerMessage.includes('college') || lowerMessage.includes('university')) title = 'Education Fund';
    else if (lowerMessage.includes('retirement')) title = 'Retirement';
    else if (lowerMessage.includes('vacation') || lowerMessage.includes('travel')) title = 'Vacation';
    
    // Create goal object
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      amount,
      targetDate: new Date(year, 11, 31).toISOString(),
      priority: 'medium',
      progress: 0,
      description: '',
    };
    
    return {
      response: `I've added your goal to save $${amount.toLocaleString()} for ${title} by ${year}. I recommend saving $${Math.round(amount / ((year - new Date().getFullYear()) * 12)).toLocaleString()} monthly to achieve this goal.`,
      action: {
        type: 'ADD_GOAL',
        payload: newGoal,
      },
    };
  }
  
  if (lowerMessage.includes('remove') || lowerMessage.includes('delete')) {
    if (lowerMessage.includes('house') || lowerMessage.includes('home')) {
      return {
        response: "I've removed your goal to buy a house. You can always add it back later if your plans change.",
        action: {
          type: 'REMOVE_GOAL',
          payload: { id: '1' }, // This assumes the house goal has ID "1"
        },
      };
    }
  }
  
  // Generic responses
  if (lowerMessage.includes('retirement')) {
    return {
      response: "Based on your current savings rate and goals, you're on track to retire at age 67 with approximately $1.2 million in savings. Would you like to explore options to retire earlier?",
    };
  }
  
  if (lowerMessage.includes('budget')) {
    return {
      response: "I can help you create a budget. Based on your income and expenses, I recommend allocating 50% for necessities, 30% for wants, and 20% for savings and debt repayment. Would you like me to prepare a detailed budget plan?",
    };
  }
  
  if (lowerMessage.includes('invest') || lowerMessage.includes('investment')) {
    return {
      response: "Based on your risk profile and goals, I recommend a portfolio with 60% stocks, 30% bonds, and 10% alternative investments. This balanced approach aligns with your long-term goals while managing volatility.",
    };
  }
  
  // Default response
  return {
    response: "I'm here to help with your financial planning. You can ask me about your goals, budget, investments, or retirement planning. I can also help you add new financial goals or modify existing ones.",
  };
};