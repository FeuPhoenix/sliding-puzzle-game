import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ProfileService, UserProfile } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Profile Header -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div class="flex flex-col items-center">
              <div class="h-24 w-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-white">Profile Settings</h2>
            </div>
          </div>

          <!-- Profile Form -->
          <div class="p-6">
            <form (ngSubmit)="saveProfile()" class="space-y-6">
              <!-- Bio -->
              <div>
                <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  id="bio"
                  [(ngModel)]="profile.bio"
                  name="bio"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Tell us about yourself"></textarea>
              </div>

              <!-- Phone Number -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  [(ngModel)]="profile.phone_number"
                  name="phone_number"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Your phone number">
              </div>

              <!-- Date of Birth -->
              <div>
                <label for="dob" class="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  [(ngModel)]="profile.date_of_birth"
                  name="date_of_birth"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>

              <!-- Country -->
              <div>
                <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  id="country"
                  [(ngModel)]="profile.country"
                  name="country"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Your country">
              </div>

              <!-- Save Button -->
              <div class="flex justify-end">
                <button
                  type="submit"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Success Message -->
        <div *ngIf="showSuccess" 
             class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500">
          Profile updated successfully!
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profile: UserProfile = {};
  showSuccess = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (error) => {
        if (error.status === 404) {
          // Profile doesn't exist yet, that's okay
          this.profile = {};
        } else {
          console.error('Error loading profile:', error);
        }
      }
    });
  }

  saveProfile() {
    const saveOperation = this.profile.id
      ? this.profileService.updateProfile(this.profile)
      : this.profileService.createProfile(this.profile);

    saveOperation.subscribe({
      next: (savedProfile) => {
        this.profile = savedProfile;
        this.showSuccess = true;
        setTimeout(() => this.showSuccess = false, 3000);
      },
      error: (error) => console.error('Error saving profile:', error)
    });
  }
} 