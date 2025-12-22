import { useEffect } from 'react';

export const useRipple = () => {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('.btn');
            if (target) {
                const button = target as HTMLElement;
                const circle = document.createElement('span');
                const diameter = Math.max(button.clientWidth, button.clientHeight);
                const radius = diameter / 2;
                const rect = button.getBoundingClientRect();

                circle.style.width = circle.style.height = `${diameter}px`;
                circle.style.left = `${e.clientX - rect.left - radius}px`;
                circle.style.top = `${e.clientY - rect.top - radius}px`;
                circle.classList.add('ripple');

                if (getComputedStyle(button).position === 'static') {
                    button.style.position = 'relative';
                }
                
                // Remove existing
                const existing = button.getElementsByClassName('ripple')[0];
                if (existing) {
                    existing.remove();
                }

                button.appendChild(circle);
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);
};
