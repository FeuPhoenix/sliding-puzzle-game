import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PaymentMethod {
  id?: number;
  type: string;
  provider_name: string;
  last_four_digits: string;
  is_default: boolean;
  expires_at: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Payment Methods</h2>
      
      <!-- Add New Payment Method -->
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h3 class="text-lg font-semibold mb-4">Add New Payment Method</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Payment Type
              <select [(ngModel)]="newPayment.type" 
                      class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </label>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Provider Name
              <input [(ngModel)]="newPayment.provider_name" 
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     type="text">
            </label>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Last 4 Digits
              <input [(ngModel)]="newPayment.last_four_digits" 
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     type="text" 
                     maxlength="4"
                     pattern="[0-9]*">
            </label>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Expiration Date
              <input [(ngModel)]="newPayment.expires_at" 
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     type="date">
            </label>
          </div>
        </div>
        
        <div class="flex items-center justify-between mt-4">
          <button (click)="addPaymentMethod()" 
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Add Payment Method
          </button>
        </div>
      </div>
      
      <!-- Existing Payment Methods -->
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h3 class="text-lg font-semibold mb-4">Your Payment Methods</h3>
        
        <div *ngFor="let method of paymentMethods" 
             class="border-b last:border-b-0 py-4">
          <div class="flex justify-between items-center">
            <div>
              <div class="flex items-center">
                <span class="text-lg font-medium">{{ method.provider_name }}</span>
                <span *ngIf="method.is_default" 
                      class="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Default
                </span>
              </div>
              <div class="text-gray-600">
                {{ method.type }} ending in {{ method.last_four_digits }}
              </div>
              <div class="text-sm text-gray-500">
                Expires: {{ method.expires_at | date:'MM/yyyy' }}
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button *ngIf="!method.is_default"
                      (click)="setDefaultPayment(method)"
                      class="text-blue-600 hover:text-blue-800">
                Set as Default
              </button>
              <button (click)="removePaymentMethod(method)"
                      class="text-red-600 hover:text-red-800">
                Remove
              </button>
            </div>
          </div>
        </div>
        
        <div *ngIf="paymentMethods.length === 0" 
             class="text-center py-4 text-gray-500">
          No payment methods added yet.
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PaymentComponent implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  newPayment: PaymentMethod = {
    type: 'credit_card',
    provider_name: '',
    last_four_digits: '',
    is_default: false,
    expires_at: ''
  };

  constructor() {}

  ngOnInit(): void {
    // TODO: Load payment methods from backend
    this.loadMockPaymentMethods();
  }

  addPaymentMethod(): void {
    // TODO: Save to backend
    const payment = { ...this.newPayment };
    if (this.paymentMethods.length === 0) {
      payment.is_default = true;
    }
    this.paymentMethods.push(payment);
    
    // Reset form
    this.newPayment = {
      type: 'credit_card',
      provider_name: '',
      last_four_digits: '',
      is_default: false,
      expires_at: ''
    };
  }

  setDefaultPayment(method: PaymentMethod): void {
    this.paymentMethods.forEach(m => m.is_default = false);
    method.is_default = true;
  }

  removePaymentMethod(method: PaymentMethod): void {
    this.paymentMethods = this.paymentMethods.filter(m => m !== method);
    if (method.is_default && this.paymentMethods.length > 0) {
      this.paymentMethods[0].is_default = true;
    }
  }

  private loadMockPaymentMethods(): void {
    this.paymentMethods = [
      {
        id: 1,
        type: 'credit_card',
        provider_name: 'Visa',
        last_four_digits: '4242',
        is_default: true,
        expires_at: '2025-12-31'
      }
    ];
  }
} 