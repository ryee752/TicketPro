'use client';

import { Button } from '@/app/ui/button';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store';

interface SavedCard {
  id: string;
  lastFour: string;
  cardType: string;
  expiryDate: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentFormProps {
  eventId: string;
  userId: string;
  price: number;
}

export default function PaymentForm({ eventId, userId, price }: PaymentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quantity = parseInt(searchParams.get('quantity') || '1', 10);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    cardType: 'debit'
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      if (!formData.cardNumber) {
        throw new Error('Card number is required');
      }

      // Get last 4 digits of card number
      const lastFour = formData.cardNumber.slice(-4);

      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          eventId,
          price,
          quantity,
          paymentDetails: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            cardNumber: formData.cardNumber,
            lastFour,
            cardType: formData.cardType,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv
          }
        })
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/events/${eventId}/event_detail`);
      }, 1500);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
      setIsProcessing(false);
    }
  };

  // Input formatting handlers
  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData({ ...formData, expiryDate: formatted });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, cardNumber: value });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    setFormData({ ...formData, state: value });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData({ ...formData, cvv: value });
  };

  if (isSuccess) {
    return (
      <div className="text-center py-10">
        <div className="text-green-500 text-4xl mb-4">✓</div>
        <div className="text-2xl font-bold mb-2">Payment Successful!</div>
        <div className="text-gray-600">Redirecting you back to the event page...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {error && (
        <div className="mb-4 rounded-md border border-red-500 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <h2 className="mb-3 text-2xl">Complete Your Payment</h2>

      <div className="w-full">
        {/* Personal Information */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="firstName" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="lastName" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              required
            />
          </div>
        </div>

        {/* Card Information */}
        <div>
          <div>
            <label htmlFor="cardType" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
              Card Type
            </label>
            <select
              id="cardType"
              value={formData.cardType}
              onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              required
            >
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="cardNumber" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                pattern="\d*"
                maxLength={16}
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                required
              />
            </div>
            
            <div className="flex-1">
              <label htmlFor="expiryDate" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                type="text"
                placeholder="MM/YY"
                pattern="\d{2}/\d{2}"
                maxLength={5}
                value={formData.expiryDate}
                onChange={handleExpiryDateChange}
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                required
              />
            </div>

            <div className="flex-1">
              <label htmlFor="cvv" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                CVV
              </label>
              <input
                id="cvv"
                type="text"
                pattern="\d{3,4}"
                maxLength={4}
                value={formData.cvv}
                onChange={handleCvvChange}
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                required
              />
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div>
          <div>
            <label htmlFor="street" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
              Street Address
            </label>
            <input
              id="street"
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="city" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                City
              </label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                required
              />
            </div>

            <div className="flex-1">
              <label htmlFor="state" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                State
              </label>
              <input
                id="state"
                type="text"
                pattern="[A-Z]{2}"
                maxLength={2}
                placeholder="CA"
                value={formData.state}
                onChange={handleStateChange}
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                required
              />
            </div>

            <div className="flex-1">
              <label htmlFor="zipCode" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                ZIP Code
              </label>
              <input
                id="zipCode"
                type="text"
                maxLength={5}
                pattern="\d{5}"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isProcessing}>
        {isProcessing ? 'Processing...' : `Pay $${price * quantity}`}
      </Button>
    </form>
  );
}
