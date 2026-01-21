import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

/**
 * Main navigation bar component
 * 
 * Features:
 * - Responsive mobile menu
 * - User authentication display (initials)
 * - Dark/light theme toggle
 * - Active route highlighting
 * - Logout functionality
 * 
 * @example
 * <app-navbar></app-navbar>
 */
@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
    /** Mobile menu open/close state */
    menuOpen = false;

    constructor(
        public authService: AuthService,
        public themeService: ThemeService
    ) {}

    /** Toggle mobile menu visibility */
    toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
    }

    /** Close mobile menu */
    closeMenu(): void {
        this.menuOpen = false;
    }

    /** Log out current user and close menu */
    logout(): void {
        this.authService.logout();
        this.closeMenu();
    }

    /** Toggle between dark and light theme */
    toggleTheme(): void {
        this.themeService.toggleTheme();
    }
}
