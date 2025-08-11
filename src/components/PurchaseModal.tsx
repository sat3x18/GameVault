import React, { useState } from 'react';
import { X, Send, AlertTriangle } from 'lucide-react';
import { GameItem, PurchaseRequest } from '../types';

interface PurchaseModalProps {
  item: GameItem | null;
  isOpen: boolean;
  onClose: () => void;
}

// Replace this with your actual Discord webhook URL
const WEBHOOK_URL = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN';

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ item, isOpen, onClose }) => {
  const [discordUsername, setDiscordUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !discordUsername.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const purchaseRequest: PurchaseRequest = {
      itemTitle: item.title,
      discordUsername: discordUsername.trim(),
      message: message.trim()
    };

    // Format the Discord message
    const discordMessage = {
      content: `🛒 **New Purchase Request**\n\n**Item:** ${purchaseRequest.itemTitle}\n**Price:** $${item.price}\n**Discord Username:** ${purchaseRequest.discordUsername}\n**Message:** ${purchaseRequest.message || 'No additional message'}\n\n*Please contact the user to complete the transaction.*`
    };

    try {
      const response = await fetch(https://discord.com/api/webhooks/1404462790051102812/Mz7mqxLDiIDW2V1x9yY5gn3TQ8bGOafxnrnVRRNHX2-04XPQIGjcUkL8tQW2G8HVnhh-, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordMessage)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
          resetForm();
        }, 2000);
      } else {
        throw new Error('Failed to send request');
      }
    } catch (error) {
      console.error('Error submitting purchase request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDiscordUsername('');
    setMessage('');
    setSubmitStatus('idle');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      resetForm();
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Purchase Request</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Warning Notice */}
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-400 font-medium text-sm">
                  ⚠️ You must be in our Discord server before submitting this form!
                </p>
                <p className="text-amber-300/80 text-xs mt-1">
                  Join our server first, then submit your purchase request.
                </p>
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <h3 className="font-bold text-white text-lg">{item.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{item.description}</p>
            <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text mt-2">
              ${item.price}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" value={item.title} />
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Discord Username *
              </label>
              <input
                type="text"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                placeholder="e.g., username#1234"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Additional Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any additional information or preferences..."
                rows={3}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
              />
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                ✅ Purchase request sent successfully! We'll contact you on Discord soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                ❌ Failed to send request. Please try again or contact us directly.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !discordUsername.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSubmitting ? 'Sending...' : 'Submit Purchase Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};