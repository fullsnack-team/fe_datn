import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabwindowsService {

  openWindow(url: string, name: string, width: number, height: number): Window | null {
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const options = `width=${width},height=${height},left=${left},top=${top}`;

    const newWindow = window.open(url, name, options);

    if (newWindow) {
      newWindow.focus();
      return newWindow;
    } else {
      // Handle popup blocker or other issues
      return null;
    }
  }
}
