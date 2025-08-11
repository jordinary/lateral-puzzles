"use client";

import { useState } from "react";

interface AnswerFormProps {
  levelNumber: number;
}

export default function AnswerForm({ levelNumber }: AnswerFormProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string, requiresAuth?: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);



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

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Redirect to next level after a short delay
        setTimeout(() => {
          window.location.href = `/levels/${result.nextLevel}`;
        }, 1500);
      } else if (result.requiresAuth) {
        setMessage({ type: 'error', text: result.message, requiresAuth: true });
        // Clear the input field safely
        try {
          const answerInput = e.currentTarget.elements.namedItem('answer') as HTMLInputElement;
          if (answerInput) {
            answerInput.value = '';
          }
        } catch (clearError) {
          // Don't let this error override our API message
        }
      } else {
        setMessage({ type: 'error', text: result.message });
        // Clear the input field safely
        try {
          const answerInput = e.currentTarget.elements.namedItem('answer') as HTMLInputElement;
          if (answerInput) {
            answerInput.value = '';
          }
        } catch (clearError) {
          // Don't let this error override our API message
        }
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
          <p className="mb-3">{message.text}</p>
          
          {/* Show login/register buttons for authentication required */}
          {message.requiresAuth && (
            <div className="flex gap-3 mt-3">
              <a 
                href="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Log In
              </a>
              <a 
                href="/register" 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Create Account
              </a>
            </div>
          )}
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
