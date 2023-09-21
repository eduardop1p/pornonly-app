export default function dateCommentsTranslate(date: string) {
  if (date.includes('seconds')) return `há ${extractNumbers(date)} segundos`;
  if (date.includes('second')) return `há ${extractNumbers(date)} segundo`;
  if (date.includes('minutes')) return `há ${extractNumbers(date)} minutos`;
  if (date.includes('minute')) return `há ${extractNumbers(date)} minuto`;
  if (date.includes('hours')) return `há ${extractNumbers(date)} horas`;
  if (date.includes('hour')) return `há ${extractNumbers(date)} hora`;
  if (date.includes('days')) return `há ${extractNumbers(date)} dias`;
  if (date.includes('day')) return `há ${extractNumbers(date)} dia`;
  if (date.includes('weeks')) return `há ${extractNumbers(date)} semanas`;
  if (date.includes('week')) return `há ${extractNumbers(date)} semana`;
  if (date.includes('months')) return `há ${extractNumbers(date)} meses`;
  if (date.includes('month')) return `há ${extractNumbers(date)} mês`;
  if (date.includes('years')) return `há ${extractNumbers(date)} anos`;
  if (date.includes('year')) return `há ${extractNumbers(date)} ano`;
}

function extractNumbers(str: string) {
  const number = str.replace(/[^0-9]/g, '');
  return number;
}
