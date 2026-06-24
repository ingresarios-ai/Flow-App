export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export async function fetchHistoricalCandles(symbol: string, resolution: string, from: number, to: number): Promise<Candle[]> {
  // Binance uses interval like '1m', '5m'. 'resolution' here was '1' for Finnhub.
  const interval = resolution === '1' ? '1m' : '1d';
  
  // Binance requires from/to in milliseconds
  const fromMs = from * 1000;
  const toMs = to * 1000;

  const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${fromMs}&endTime=${toMs}&limit=1000`);
  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error(data.msg || 'Failed to fetch candles from Binance');
  }

  const candles: Candle[] = data.map((kline: any) => ({
    time: Math.floor(kline[0] / 1000), // convert ms to s for lightweight-charts
    open: parseFloat(kline[1]),
    high: parseFloat(kline[2]),
    low: parseFloat(kline[3]),
    close: parseFloat(kline[4]),
  }));

  return candles;
}

export function subscribeToFinnhub(symbol: string, onMessage: (price: number, time: number) => void) {
  // We keep the function name for compatibility, but it connects to Binance WebSocket
  const lowercaseSymbol = symbol.toLowerCase();
  const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${lowercaseSymbol}@trade`);

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    // Binance trade payload: { p: "price", T: timestamp_ms }
    if (data.e === 'trade' && data.p && data.T) {
      onMessage(parseFloat(data.p), Math.floor(data.T / 1000));
    }
  });

  return () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  };
}
