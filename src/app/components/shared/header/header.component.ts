import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private http: HttpClient, private route: Router) { }

  ngOnInit(): void {
    // Initialize AOS or any other libraries here
    // AOS.init();
  }

  isSidebarCollapsed: boolean = false;
  isLoginPage: boolean = false; // Handle login page logic as needed

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  };

  logout(){
    localStorage.removeItem('adminToken')
    this.route.navigate(['/'])
  }
}
