import { describe, it, expect } from 'vitest';
import { SolarProjectPresenter } from './solar-project-presenter';
import type { SolarProject } from '../../domain/models/solar-project';

describe('SolarProjectPresenter', () => {
    describe('formatPower', () => {
        it('should return dash for null/undefined/0', () => {
            expect(SolarProjectPresenter.formatPower(null)).toBe('—');
            expect(SolarProjectPresenter.formatPower(undefined)).toBe('—');
            expect(SolarProjectPresenter.formatPower(0)).toBe('—');
        });

        it('should format kW correctly when less than 1000', () => {
            expect(SolarProjectPresenter.formatPower(500)).toBe('500 kW');
            expect(SolarProjectPresenter.formatPower(999)).toBe('999 kW');
        });

        it('should format MW correctly when >= 1000', () => {
            expect(SolarProjectPresenter.formatPower(1000)).toBe('1.00 MW');
            expect(SolarProjectPresenter.formatPower(1500)).toBe('1.50 MW');
            expect(SolarProjectPresenter.formatPower(12345)).toBe('12.35 MW');
        });
    });

    describe('calculateTotalPower', () => {
        it('should sum inspectedPowerKw correctly', () => {
            const projects = [
                { inspectedPowerKw: 100 } as SolarProject,
                { inspectedPowerKw: 200 } as SolarProject,
                { inspectedPowerKw: null } as unknown as SolarProject, // Handle null gracefully
            ];
            expect(SolarProjectPresenter.calculateTotalPower(projects)).toBe(300);
        });

        it('should return 0 for empty list', () => {
            expect(SolarProjectPresenter.calculateTotalPower([])).toBe(0);
        });
    });

    describe('getGoogleMapsUrl', () => {
        it('should return correct URL for valid coordinates', () => {
            const url = SolarProjectPresenter.getGoogleMapsUrl(-10, -50);
            expect(url).toBe('https://www.google.com/maps?q=-10,-50');
        });

        it('should return null for missing coordinates', () => {
            expect(SolarProjectPresenter.getGoogleMapsUrl(null, -50)).toBeNull();
            expect(SolarProjectPresenter.getGoogleMapsUrl(-10, null)).toBeNull();
        });
    });

    describe('formatDate', () => {
        it('should return dash for null/undefined', () => {
            expect(SolarProjectPresenter.formatDate(null)).toBe('—');
            expect(SolarProjectPresenter.formatDate(undefined)).toBe('—');
        });

        it('should format date correctly', () => {
            // Using a specific date to test formatting
            const date = '2023-10-15T12:00:00Z';
            // Note: locale formatting depends on Node environment, but we expect DD/MM/YYYY for pt-BR
            const formatted = SolarProjectPresenter.formatDate(date);
            expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
        });

        it('should return original string if date invalid', () => {
            expect(SolarProjectPresenter.formatDate('invalid-date')).toBe('invalid-date');
        });
    });
});
