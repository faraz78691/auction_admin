import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  ngOnInit(): void {
    // Initialize AOS or any other libraries here
    // AOS.init();
  }

  isSidebarCollapsed: boolean = false;
  isLoginPage: boolean = false; // Handle login page logic as needed

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
