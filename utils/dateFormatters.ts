import { format as dateFnsFormat } from 'date-fns';

// Month names by language
export const monthNames = {
  en: [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  es: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
};

// Short month names by language
export const shortMonthNames = {
  en: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  es: [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ]
};

// Utility function to format dates with localized month names
export function formatDate(date: Date | string, language: 'en' | 'es' = 'en', formatStr: string = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format using date-fns first
  let formattedDate = dateFnsFormat(dateObj, formatStr);
  
  // Replace month names if the format contains month representations
  if (formatStr.includes('MMM') && !formatStr.includes('MMMM')) {
    // Replace short month names
    const monthIndex = dateObj.getMonth();
    const englishMonth = shortMonthNames.en[monthIndex];
    const localizedMonth = shortMonthNames[language][monthIndex];
    formattedDate = formattedDate.replace(englishMonth, localizedMonth);
  } else if (formatStr.includes('MMMM')) {
    // Replace full month names
    const monthIndex = dateObj.getMonth();
    const englishMonth = monthNames.en[monthIndex];
    const localizedMonth = monthNames[language][monthIndex];
    formattedDate = formattedDate.replace(englishMonth, localizedMonth);
  }
  
  return formattedDate;
}
