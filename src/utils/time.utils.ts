import * as moment from 'moment';

export const t = (date?: string, format = 'YYYY-MM-DD hh:mm:ss') => {
  return date ? moment(date, format) : moment(new Date(), format);
};

export const now = () => {
  return moment().format('YYYY-MM-DD hh:mm:ss');
};

export const date = (date: string | Date, format = 'YYYY-MM-DD hh:mm:ss') => {
  return moment(date).format(format);
};

export const isDateValid = (date: string) => {
  return moment(date).isValid();
};

export const compare = (first: string | Date, second: string | Date) => {
  return moment(first).diff(second);
};

export const dateForSearch = (date: string) => {
  return moment(date, 'YYYY-MM-DD').toDate()
};

export const isDateEqual = (first: string, second: string) => {
  const firstDate = new Date(first)
  const secondDate = new Date(second)
  const [firstYear, firstMonth, firstDay] = [firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate()]
  const [secondYear, secondMonth, secondDay] = [secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate()]

  return firstYear === secondYear
    && firstMonth === secondMonth
    && firstDay === secondDay
};

