import { describe, it, expect } from 'vitest';
import {
  COMPLAINT_STATUS,
  COMPLAINT_CATEGORY,
  STATUS_LABELS,
  CATEGORY_LABELS,
  STATUS_COLORS,
  UPLOAD_CONFIG,
} from '../constants';

describe('Constants', () => {
  it('should have all complaint statuses', () => {
    expect(Object.keys(COMPLAINT_STATUS)).toEqual([
      'PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS',
      'RESOLVED', 'REJECTED', 'CLOSED',
    ]);
  });

  it('should have all complaint categories', () => {
    expect(Object.keys(COMPLAINT_CATEGORY)).toEqual([
      'ROADS', 'WATER', 'ELECTRICITY', 'SANITATION',
      'PUBLIC_SAFETY', 'TRANSPORTATION', 'OTHER',
    ]);
  });

  it('should have labels for all statuses', () => {
    Object.keys(COMPLAINT_STATUS).forEach((status) => {
      expect(STATUS_LABELS[status]).toBeDefined();
      expect(typeof STATUS_LABELS[status]).toBe('string');
    });
  });

  it('should have labels for all categories', () => {
    Object.keys(COMPLAINT_CATEGORY).forEach((category) => {
      expect(CATEGORY_LABELS[category]).toBeDefined();
      expect(typeof CATEGORY_LABELS[category]).toBe('string');
    });
  });

  it('should have colors for all statuses', () => {
    Object.keys(COMPLAINT_STATUS).forEach((status) => {
      expect(STATUS_COLORS[status]).toBeDefined();
    });
  });

  it('should have valid upload config', () => {
    expect(UPLOAD_CONFIG.MAX_FILE_SIZE).toBeGreaterThan(0);
    expect(UPLOAD_CONFIG.MAX_FILES).toBeGreaterThan(0);
    expect(UPLOAD_CONFIG.ALLOWED_TYPES.length).toBeGreaterThan(0);
  });
});
