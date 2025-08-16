# Center Dashboard Header

## Overview

The center dashboard now includes a responsive header with logout functionality and mobile hamburger menu.

## Features

### Desktop Header

- **Sidebar Toggle**: Hamburger button to toggle the sidebar visibility
- **Center Information**: Displays center name and welcome message
- **User Profile**: Shows center name, email, and profile icon
- **Logout Button**: Red logout button with icon for easy access

### Mobile Header

- **Compact Design**: Optimized for mobile screens
- **Sidebar Toggle**: Hamburger button for sidebar navigation
- **Mobile Menu**: Dropdown menu with center info and logout option
- **Responsive**: Automatically adapts to screen size

## Components

### Header.jsx

- **Props**:
  - `center`: Center object with name, email, etc.
  - `onLogout`: Function to handle logout
  - `onToggleSidebar`: Function to toggle sidebar
  - `sidebarOpen`: Boolean for sidebar state
  - `setSidebarOpen`: Function to set sidebar state

### Integration

- Imported in `page.jsx`
- Positioned above main content area
- Handles both desktop and mobile layouts

## Backend Support

- **Logout Route**: `/api/v1/centers/logout` (GET)
- **Authentication Check**: `/api/v1/centers/iscenter` (GET)
- **Cookie Management**: Automatically clears centerToken on logout

## Usage

1. **Login**: Use dummy center credentials
   - Email: `dummycenter@test.com`
   - Password: `test123456`
2. **Navigate**: Use sidebar or header navigation
3. **Logout**: Click logout button in header
4. **Mobile**: Use hamburger menu for mobile navigation

## Styling

- Uses Tailwind CSS for responsive design
- Green theme consistent with IICPA branding
- Smooth transitions and hover effects
- Mobile-first responsive approach
