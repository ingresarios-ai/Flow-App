export const modules = {
  basico: {
    name: 'Opciones · Básico',
    sub: 'Domina lo esencial para tu primer trade',
    lessons: [
      {
        t: '¿Qué es una opción? Call vs Put',
        xp: 20,
        ic: '🔓',
        geny: 'Empecemos por el ladrillo de todo. Una opción es un contrato, no una acción.',
      },
      {
        t: 'Prima, strike y vencimiento',
        xp: 20,
        ic: '🏷️',
        geny: 'Tres palabras que verás en cada contrato. Sin esto, estás ciego.',
      },
      {
        t: 'ITM · ATM · OTM',
        xp: 25,
        ic: '🎯',
        geny: 'Dónde está el strike respecto al precio actual lo cambia todo.',
      },
      {
        t: 'Comprar CALLs (alcista)',
        xp: 30,
        ic: '▲',
        geny: 'Tu primera estrategia direccional. Limpia y de riesgo definido.',
      },
      {
        t: 'Comprar PUTs (bajista)',
        xp: 30,
        ic: '▼',
        geny: 'El espejo del call: ganar cuando el mercado cae.',
      },
      {
        t: 'Riesgo definido vs ilimitado',
        xp: 25,
        ic: '🛡️',
        geny: 'Aquí se separan los que sobreviven de los que revientan cuenta.',
      },
      {
        t: 'Break-even y P&L',
        xp: 30,
        ic: '⚖️',
        geny: 'El número que dice si de verdad ganaste, no si la opción subió.',
      },
      {
        t: 'Checkpoint: práctica en el simulador',
        xp: 60,
        ic: '🎮',
        sim: true,
      },
    ],
  },
  avanzado: {
    name: 'Opciones · Avanzado',
    sub: 'Estrategias y gestión profesional',
    lessons: [
      {
        t: 'Las Griegas: Δ Θ V Γ',
        xp: 40,
        ic: '🧮',
        geny: 'Las griegas miden cómo cambia tu opción. Cuatro que debes amar.',
      },
    ],
  },
};
