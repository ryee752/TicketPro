'use client';

import { Button } from '@/app/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function PaymentForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    {
      id: '1',
      lastFour: '4242',
      cardType: 'credit',
      expiryDate: '12/25',
      firstName: 'John',
      lastName: 'Doe',
      street: '123 Main St',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95123'
    },
  ]);

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
    cardType: 'debit',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSavedCardSelect = (card: SavedCard) => {
    setFormData({
      ...formData,
      firstName: card.firstName,
      lastName: card.lastName,
      cardNumber: `************${card.lastFour}`,
      cardType: card.cardType,
      expiryDate: card.expiryDate,
      street: card.street,
      city: card.city,
      state: card.state,
      zipCode: card.zipCode,
    });
  };

  const handleDeleteCard = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation(); // Prevent card selection when deleting
    setSavedCards(savedCards.filter(card => card.id !== cardId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      // Wait for 1.5 seconds to show success message
      setTimeout(() => {
        router.push(`/events/${eventId}/event_detail`);
      }, 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
      setIsProcessing(false);
    }
  };

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

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    setFormData({ ...formData, state: value });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData({ ...formData, cvv: value });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, cardNumber: value });
  };

  if (isSuccess) {
    return (
      <div className="text-center py-10">
        <div className="text-green-500 text-4xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-600">Redirecting you back to the event page...</p>
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
      <div className="w-full">
        <h1 className="mb-3 text-2xl">Complete Your Payment</h1>
        
        {savedCards.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg mb-3">Saved Cards</h2>
            <div className="space-y-2">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSavedCardSelect(card)}
                >
                  <div>
                    <p className="font-medium">•••• {card.lastFour}</p>
                    <p className="text-sm text-gray-500">Expires {card.expiryDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSavedCardSelect(card);
                      }}
                    >
                      Use this card
                    </Button>
                    <Button
                      className="text-sm bg-red-500 hover:bg-red-600"
                      onClick={(e) => handleDeleteCard(e, card.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="firstName">
                First Name
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="flex-1">
              <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="lastName">
                Last Name
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="cardNumber">
              Card Number
            </label>
            <input
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              id="cardNumber"
              type="text"
              pattern="\d+"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              required
            />
          </div>
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="cardType">
              Card Type
            </label>
            <select
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              id="cardType"
              value={formData.cardType}
              onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
              required
            >
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="expiryDate">
                Expiry Date
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                id="expiryDate"
                type="text"
                placeholder="MM/YY"
                pattern="\d{2}/\d{2}"
                maxLength={5}
                value={formData.expiryDate}
                onChange={handleExpiryDateChange}
                required
              />
            </div>
            <div className="flex-1">
              <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="cvv">
                CVV
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                id="cvv"
                type="text"
                pattern="\d{3,4}"
                maxLength={4}
                value={formData.cvv}
                onChange={handleCvvChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="street">
              Street Address
            </label>
            <input
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              id="street"
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="city">
                City
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="flex-1">
              <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="state">
                State
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                id="state"
                type="text"
                pattern="[A-Z]{2}"
                maxLength={2}
                placeholder="CA"
                value={formData.state}
                onChange={handleStateChange}
                required
              />
            </div>
            <div className="flex-1">
              <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="zipCode">
                ZIP Code
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                id="zipCode"
                type="text"
                maxLength={5}
                pattern="\d{5}"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                required
              />
            </div>
          </div>
        </div>
        <Button
          className="mt-8 w-full" 
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Complete Payment'}
        </Button>
      </div>
    </form>
  );
}
