// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { describe, it, expect } from 'vitest';

describe('Navbar Component', () => {
    it('renders portfolio title', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
        expect(screen.getByText(/Portfolio\./i)).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
        expect(screen.getByText(/Home/i)).toBeInTheDocument();
        expect(screen.getByText(/About/i)).toBeInTheDocument();
        expect(screen.getByText(/Blog/i)).toBeInTheDocument();
        expect(screen.getByText(/Contact/i)).toBeInTheDocument();
    });

    it('toggles mobile menu', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
        
        // Mobile menu should be hidden initially (logic handled by CSS classes mostly, 
        // but we can check if button click changes state logic if we query by role)
        const toggleBtn = screen.getByRole('button');
        fireEvent.click(toggleBtn);
        
        // Since the menu rendering is conditional {isMobileMenuOpen && ...}
        // checking for links again might show them now in the mobile section
        // Ideally we check for specific mobile menu IDs or classes
        // For now, simpler check:
        const homeLinks = screen.getAllByText(/Home/i);
        expect(homeLinks.length).toBeGreaterThan(1); // One desktop, one mobile
    });
});
