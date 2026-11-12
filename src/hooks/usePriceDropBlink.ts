import { useEffect, useRef, useState } from 'react';

/**
 * Hook to detect when an odds price increases and trigger a quick yellow blinking state.
 * If price decreases or stays the same, it does nothing.
 * If price increases (e.g. 3.2 -> 3.4), it blinks yellow for 350ms (< half a second).
 */
export function usePriceDropBlink(price?: number | string | null): boolean {
  const prevPriceRef = useRef<number | undefined>(undefined);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const numericPrice =
      typeof price === 'number'
        ? price
        : price != null && price !== ''
          ? Number(price)
          : undefined;

    if (
      prevPriceRef.current !== undefined &&
      numericPrice !== undefined &&
      !isNaN(numericPrice) &&
      !isNaN(prevPriceRef.current) &&
      numericPrice > prevPriceRef.current
    ) {
      setIsBlinking(true);
      // Blink for 350ms (less than half a second)
      timer = setTimeout(() => {
        setIsBlinking(false);
      }, 350);
    }

    if (numericPrice !== undefined && !isNaN(numericPrice)) {
      prevPriceRef.current = numericPrice;
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [price]);

  return isBlinking;
}

export const usePriceIncreaseBlink = usePriceDropBlink;
