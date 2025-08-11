"use client";

import { useState } from "react";

interface AnswerFormProps {
  levelNumber: number;
}

export default function AnswerForm({ levelNumber }: AnswerFormProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug log for message state changes
  console.log('Current message state:', message);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const answer = formData.get('answer') as string;

    try {
      const response = await fetch(`/api/levels/${levelNumber}/answer`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('API Response:', result); // Debug log

      if (result.success) {
        console.log('Setting success message:', result.message); // Debug log
        setMessage({ type: 'success', text: result.message });
        // Redirect to next level after a short delay
        setTimeout(() => {
          window.location.href = `/levels/${result.nextLevel}`;
        }, 1500);
      } else {
        console.log('Setting error message:', result.message); // Debug log
        setMessage({ type: 'error', text: result.message });
        // Clear the input field
        (e.currentTarget.elements.namedItem('answer') as HTMLInputElement).value = '';
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Inline message display */}
      {message && (
        <div className={`border rounded p-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input 
          type="text" 
          name="answer" 
          placeholder="Password" 
          className="border rounded px-3 py-2 w-full" 
          required 
          disabled={isSubmitting}
        />

        <button 
          type="submit" 
          className={`bg-black text-white rounded px-4 py-2 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
