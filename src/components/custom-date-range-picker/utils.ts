import { isSameDay, isSameMonth, getYear } from 'date-fns';
// utils
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function shortDateLabel(startDate: Date | null, endDate: Date | null) {
  const getCurrentYear = new Date().getFullYear();

  const startDateYear = startDate ? getYear(startDate) : null;

  const endDateYear = endDate ? getYear(endDate) : null;

  const currentYear = getCurrentYear === startDateYear && getCurrentYear === endDateYear;

  const sameDay = startDate && endDate ? isSameDay(new Date(startDate), new Date(endDate)) : false;

  const sameMonth =
    startDate && endDate ? isSameMonth(new Date(startDate), new Date(endDate)) : false;

  if (currentYear) {
    if (sameMonth) {
      if (sameDay) {
        return fDate(endDate, 'dd/MM/yyyy'); // Định dạng Việt Nam
      }
      return `${fDate(startDate, 'dd')} - ${fDate(endDate, 'dd/MM/yyyy')}`;
    }
    return `${fDate(startDate, 'dd/MM')} - ${fDate(endDate, 'dd/MM/yyyy')}`;
  }

  return `${fDate(startDate, 'dd/MM/yyyy')} - ${fDate(endDate, 'dd/MM/yyyy')}`;
}
