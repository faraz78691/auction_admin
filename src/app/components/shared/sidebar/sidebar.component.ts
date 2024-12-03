import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isDropdownVisible: boolean = false;
  isDropdownVisible2: boolean = false;
  isDropdownVisible3: boolean = false;
  isSidebarCollapsed: boolean = false;
  @Output() closeSidebarEvent = new EventEmitter<void>();


  ngOnInit(): void {
    // Equivalent to jQuery(document).ready()
    this.hideLoader();
  };


  // Method to hide the loader
  hideLoader(): void {
    const loaderElement = document.querySelector('.ct_loader_main');
    if (loaderElement) {
      loaderElement.classList.add('fade-out'); // Add a class to control fade-out using CSS
    }
  };



  closeSidebar(): void {
    this.isSidebarCollapsed = true; // Set it to true to collapse the sidebar
  }

  // Method to toggle the dropdown
  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  toggleDropdown2(): void {
    this.isDropdownVisible2 = !this.isDropdownVisible2;
  }
  toggleDropdown3(): void {
    this.isDropdownVisible3 = !this.isDropdownVisible3;
  }
}
