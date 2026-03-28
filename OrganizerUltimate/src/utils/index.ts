import { format, formatDistance, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';

export const formatDate = (date: Date | string, formatStr: string = 'PPp'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return format(dateObj, 'h:mm a');
  }
  if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  }
  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }
  
  return format(dateObj, 'MMM d, yyyy');
};

export const formatTimeRange = (start: Date | string, end: Date | string): string => {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;
  
  if (isToday(startDate) && isToday(endDate)) {
    return `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
  }
  
  return `${format(startDate, 'MMM d, h:mm a')} - ${format(endDate, 'h:mm a')}`;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

export const generateMarkedDates = (events: any[], selectedDate: Date): { [key: string]: { marked: boolean; dotColor: string } } => {
  const marked: { [key: string]: { marked: boolean; dotColor: string } } = {};
  
  events.forEach(event => {
    const dateKey = format(typeof event.startDate === 'string' ? parseISO(event.startDate) : event.startDate, 'yyyy-MM-dd');
    if (!marked[dateKey]) {
      marked[dateKey] = { marked: true, dotColor: event.color };
    }
  });
  
  return marked;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
