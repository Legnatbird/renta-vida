import { ChatAction } from '@/types/chat';
import { Goal } from '@/types/goals';

// Helper function to detect language
const isSpanish = (text: string): boolean => {
  const spanishIndicators = [
    'añadir', 'agregar', 'crear', 'nuevo', 'nueva', 'objetivo', 'meta', 'ahorro', 
    'ahorrar', 'quiero', 'necesito', 'eliminar', 'borrar', 'quitar', 'jubilación', 
    'retiro', 'presupuesto', 'inversión', 'invertir', 'casa', 'coche', 'carro', 
    'auto', 'educación', 'universidad', 'vacaciones', 'viaje',
    'hola', 'gracias', 'por favor', 'sí', 'no', 'bueno', 'malo', 'bien'
  ];
  
  const lowerText = text.toLowerCase();
  return spanishIndicators.some(word => lowerText.includes(word));
};

export const processMessage = async (
  message: string
): Promise<{ response: string; action?: ChatAction }> => {
  // This is a mock implementation - in a real app, this would call an AI service
  const lowerMessage = message.toLowerCase();
  const spanish = isSpanish(message);
  
  // Simple pattern matching for demo purposes
  // ADD GOAL - English and Spanish
  if ((lowerMessage.includes('add') && lowerMessage.includes('goal')) ||
      (lowerMessage.includes('añadir') && lowerMessage.includes('objetivo')) ||
      (lowerMessage.includes('agregar') && lowerMessage.includes('meta')) ||
      (lowerMessage.includes('crear') && lowerMessage.includes('objetivo')) ||
      (lowerMessage.includes('quiero') && lowerMessage.includes('ahorrar'))) {
    
    // Extract potential goal information
    let amount = 0;
    const amountMatch = message.match(/\$?(\d+)(?:,\d+)*(?:\.\d+)?(?:\s*(?:million|k|thousand|mil|millón|millones))?/i);
    if (amountMatch) {
      const amountStr = amountMatch[1].replace(/,/g, '');
      amount = parseInt(amountStr, 10);
      
      // Handle "k", "thousand", "million" and Spanish equivalents
      if (lowerMessage.includes('k') || lowerMessage.includes('thousand') || lowerMessage.includes('mil')) {
        amount *= 1000;
      } else if (lowerMessage.includes('million') || lowerMessage.includes('millón') || lowerMessage.includes('millones')) {
        amount *= 1000000;
      }
    }
    
    // Extract year
    let year = new Date().getFullYear() + 5; // Default to 5 years from now
    const yearMatch = message.match(/(?:in|by|for|en|para|al)\s+(\d{4})/i);
    if (yearMatch) {
      year = parseInt(yearMatch[1], 10);
    }
    
    // Extract goal title based on language
    let title = spanish ? 'Nuevo Objetivo Financiero' : 'New Financial Goal';
    
    // English keywords
    if (!spanish) {
      if (lowerMessage.includes('house')) title = 'Buy a House';
      else if (lowerMessage.includes('car')) title = 'Buy a Car';
      else if (lowerMessage.includes('education') || lowerMessage.includes('college') || lowerMessage.includes('university')) title = 'Education Fund';
      else if (lowerMessage.includes('retirement')) title = 'Retirement';
      else if (lowerMessage.includes('vacation') || lowerMessage.includes('travel')) title = 'Vacation';
    }
    // Spanish keywords
    else {
      if (lowerMessage.includes('casa')) title = 'Comprar una Casa';
      else if (lowerMessage.includes('coche') || lowerMessage.includes('carro') || lowerMessage.includes('auto')) title = 'Comprar un Coche';
      else if (lowerMessage.includes('educación') || lowerMessage.includes('universidad') || lowerMessage.includes('estudios')) title = 'Fondo Educativo';
      else if (lowerMessage.includes('jubilación') || lowerMessage.includes('retiro')) title = 'Jubilación';
      else if (lowerMessage.includes('vacaciones') || lowerMessage.includes('viaje') || lowerMessage.includes('viajar')) title = 'Vacaciones';
    }
    
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
    
    // Generate response based on language
    let response = '';
    if (spanish) {
      response = `He añadido tu objetivo de ahorrar $${amount.toLocaleString()} para ${title} para el año ${year}. Te recomiendo ahorrar $${Math.round(amount / ((year - new Date().getFullYear()) * 12)).toLocaleString()} mensualmente para lograr este objetivo.`;
    } else {
      response = `I've added your goal to save $${amount.toLocaleString()} for ${title} by ${year}. I recommend saving $${Math.round(amount / ((year - new Date().getFullYear()) * 12)).toLocaleString()} monthly to achieve this goal.`;
    }
    
    return {
      response,
      action: {
        type: 'ADD_GOAL',
        payload: newGoal,
      },
    };
  }
  
  // REMOVE GOAL - English and Spanish
  if ((lowerMessage.includes('remove') || lowerMessage.includes('delete')) ||
      (lowerMessage.includes('eliminar') || lowerMessage.includes('borrar') || lowerMessage.includes('quitar'))) {
    
    // Check if house goal
    if (lowerMessage.includes('house') || lowerMessage.includes('home') || 
        lowerMessage.includes('casa') || lowerMessage.includes('hogar')) {
      
      return {
        response: spanish 
          ? "He eliminado tu objetivo de comprar una casa. Siempre puedes añadirlo nuevamente si tus planes cambian."
          : "I've removed your goal to buy a house. You can always add it back later if your plans change.",
        action: {
          type: 'REMOVE_GOAL',
          payload: { id: '1' }, // This assumes the house goal has ID "1"
        },
      };
    }
  }
  
  // RETIREMENT - English and Spanish
  if (lowerMessage.includes('retirement') || lowerMessage.includes('jubilación') || lowerMessage.includes('retiro')) {
    return {
      response: spanish
        ? "Basado en tu tasa de ahorro actual y objetivos, vas por buen camino para jubilarte a los 67 años con aproximadamente $1.2 millones en ahorros. ¿Te gustaría explorar opciones para jubilarte antes?"
        : "Based on your current savings rate and goals, you're on track to retire at age 67 with approximately $1.2 million in savings. Would you like to explore options to retire earlier?",
    };
  }
  
  // BUDGET - English and Spanish
  if (lowerMessage.includes('budget') || lowerMessage.includes('presupuesto')) {
    return {
      response: spanish
        ? "Puedo ayudarte a crear un presupuesto. Basado en tus ingresos y gastos, te recomiendo asignar 50% para necesidades, 30% para deseos, y 20% para ahorros y pago de deudas. ¿Te gustaría que preparara un plan de presupuesto detallado?"
        : "I can help you create a budget. Based on your income and expenses, I recommend allocating 50% for necessities, 30% for wants, and 20% for savings and debt repayment. Would you like me to prepare a detailed budget plan?",
    };
  }
  
  // INVESTMENTS - English and Spanish
  if (lowerMessage.includes('invest') || lowerMessage.includes('investment') || 
      lowerMessage.includes('inversión') || lowerMessage.includes('invertir')) {
    return {
      response: spanish
        ? "Basado en tu perfil de riesgo y objetivos, te recomiendo una cartera con 60% acciones, 30% bonos, y 10% inversiones alternativas. Este enfoque equilibrado se alinea con tus objetivos a largo plazo mientras gestiona la volatilidad."
        : "Based on your risk profile and goals, I recommend a portfolio with 60% stocks, 30% bonds, and 10% alternative investments. This balanced approach aligns with your long-term goals while managing volatility.",
    };
  }
  
  // Default response based on detected language
  return {
    response: spanish
      ? "Estoy aquí para ayudarte con tu planificación financiera. Puedes preguntarme sobre tus objetivos, presupuesto, inversiones o planificación de jubilación. También puedo ayudarte a añadir nuevos objetivos financieros o modificar los existentes."
      : "I'm here to help with your financial planning. You can ask me about your goals, budget, investments, or retirement planning. I can also help you add new financial goals or modify existing ones.",
  };
};