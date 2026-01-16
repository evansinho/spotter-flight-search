'use client';

import { useState } from 'react';
import { SearchParams } from '@/types/flight';
import { Share2, Check } from 'lucide-react';

interface ShareSearchButtonProps {
  searchParams: SearchParams;
}

export function ShareSearchButton({ searchParams }: ShareSearchButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      // Build URL with search parameters
      const params = new URLSearchParams({
        from: searchParams.originLocationCode,
        to: searchParams.destinationLocationCode,
        depart: searchParams.departureDate,
        ...(searchParams.returnDate && { return: searchParams.returnDate }),
        adults: searchParams.adults.toString(),
        ...(searchParams.children && { children: searchParams.children.toString() }),
        ...(searchParams.travelClass && { class: searchParams.travelClass }),
      });

      const shareUrl = `${window.location.origin}?${params.toString()}`;

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      title="Share this search"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-green-600">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span>Share Search</span>
        </>
      )}
    </button>
  );
}