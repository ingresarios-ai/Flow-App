const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || 'd8u4c59r01qinhufnemgd8u4c59r01qinhufnen0';
async function test() {
  const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=BINANCE:BTCUSDT&token=${apiKey}`);
  const data = await res.json();
  console.log('Quote:', data);

  const to = Math.floor(Date.now() / 1000);
  const from = to - 60;
  const res2 = await fetch(`https://finnhub.io/api/v1/crypto/candle?symbol=BINANCE:BTCUSDT&resolution=1&from=${from}&to=${to}&token=${apiKey}`);
  const data2 = await res2.json();
  console.log('Candle:', data2);
}
test();
