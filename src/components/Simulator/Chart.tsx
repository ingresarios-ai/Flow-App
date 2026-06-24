'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { fetchHistoricalCandles, subscribeToFinnhub, Candle } from '@/lib/marketData';

interface ChartProps {
  symbol: string;
  onPriceUpdate?: (price: number) => void;
}

export function Chart({ symbol, onPriceUpdate }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.5)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      crosshair: {
        mode: 1, // Normal crosshair
        vertLine: {
          color: 'rgba(255, 255, 255, 0.2)',
          style: 3,
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.2)',
          style: 3,
        },
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00FF94', // profit green
      downColor: '#FF3EB0', // plasma pink
      borderVisible: false,
      wickUpColor: '#00FF94',
      wickDownColor: '#FF3EB0',
    });

    seriesRef.current = candlestickSeries;

    // Fetch initial historical data
    const loadData = async () => {
      try {
        const to = Math.floor(Date.now() / 1000);
        // Get last 3 days of 1-minute candles (approx)
        const from = to - (3 * 24 * 60 * 60); 
        const data = await fetchHistoricalCandles(symbol, '1', from, to);
        
        // Lightweight charts requires strictly ascending time and unique times
        // Finnhub sometimes returns duplicates or out of order if market was closed, need to ensure clean data
        const cleanData: CandlestickData[] = data.map(c => ({
          time: c.time as any,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close
        })).filter((v, i, a) => i === 0 || v.time > a[i - 1].time);

        candlestickSeries.setData(cleanData);
      } catch (error) {
        console.error('Error loading historical data:', error);
      }
    };

    loadData();

    // Resize handler
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol]);

  // Subscribe to live updates
  useEffect(() => {
    let lastCandleTime: number | null = null;
    let currentCandle: CandlestickData | null = null;

    const unsubscribe = subscribeToFinnhub(symbol, (price, time) => {
      if (onPriceUpdate) onPriceUpdate(price);

      if (!seriesRef.current) return;

      // Group trades into 1-minute candles
      const currentMinute = Math.floor(time / 60) * 60;

      if (lastCandleTime !== currentMinute || !currentCandle) {
        currentCandle = {
          time: currentMinute as any,
          open: price,
          high: price,
          low: price,
          close: price,
        };
        lastCandleTime = currentMinute;
      } else {
        currentCandle.high = Math.max(currentCandle.high, price);
        currentCandle.low = Math.min(currentCandle.low, price);
        currentCandle.close = price;
      }

      try {
        seriesRef.current.update(currentCandle);
      } catch(e) {
        // Ignored if update fails due to time constraints
      }
    });

    return () => {
      unsubscribe();
    };
  }, [symbol, onPriceUpdate]);

  return <div ref={chartContainerRef} className="w-full h-full min-h-[300px]" />;
}
