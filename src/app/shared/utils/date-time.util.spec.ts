import { describe, it, expect } from 'vitest';
import { formatTimeLabel, formatDateLabel, todayDateString } from './date-time.util';

describe('formatTimeLabel', () => {
  it('formats a standard morning time', () => {
    expect(formatTimeLabel('09:30:00')).toBe('9:30 AM');
  });

  it('formats a standard afternoon time', () => {
    expect(formatTimeLabel('14:05:00')).toBe('2:05 PM');
  });

  it('formats midnight (00:00) as 12:00 AM, not 0:00 AM', () => {
    expect(formatTimeLabel('00:00:00')).toBe('12:00 AM');
  });

  it('formats noon (12:00) as 12:00 PM, not 0:00 PM', () => {
    expect(formatTimeLabel('12:00:00')).toBe('12:00 PM');
  });

  it('pads single-digit minutes', () => {
    expect(formatTimeLabel('09:05:00')).toBe('9:05 AM');
  });

  it('handles times without seconds', () => {
    expect(formatTimeLabel('18:45')).toBe('6:45 PM');
  });
});

describe('todayDateString', () => {
  it('returns a string in yyyy-MM-dd format', () => {
    expect(todayDateString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('formatDateLabel', () => {
  it('formats a date string into a short weekday/month/day label', () => {
    // 2026-08-20 is a Thursday
    expect(formatDateLabel('2026-08-20')).toBe('Thu, Aug 20');
  });
});
