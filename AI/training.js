// Beispiel: Reinforcement-Learning-DQN mit Transaktionskosten und Slippage
// ------------------------------------------------------------------------
// Dieses Beispiel baut auf dem vorherigen RL-Beispiel auf,
// erweitert aber die Environment-Logik um Transaktionskosten und Slippage.
//
// Achtung: Der Code ist weiterhin sehr vereinfacht.
// In der Praxis solltest du ihn an dein tatsächliches Prisma-Schema
// und deine gewünschten Geschäftsregeln anpassen.
//
// Wichtig:
//  - Prisma setup
//  - Node-Umgebung mit "@tensorflow/tfjs", "@prisma/client"
//  - DB-Tabelle "btcData" (z.B. id, date, lastPrice, priceChangePercent, highPrice, lowPrice, volume)

import * as tf from '@tensorflow/tfjs';
import { PrismaClient } from '@prisma/client';

// Prisma-Client anlegen
const prisma = new PrismaClient();

// Mögliche Aktionen
const ACTIONS = ["BUY", "SELL", "HOLD"];

// Feature-Größe (z.B. 5 Features)
const INPUT_SIZE = 5;

// RL-Hyperparameter
const GAMMA = 0.95;     // Diskontfaktor
const LEARNING_RATE = 0.001; // Lernrate fürs Netzwerk

// Epsilon-Greedy-Parameter
let EPSILON = 1.0;          // Startwert für Exploration
const EPSILON_DECAY = 0.995;  // Abnehmender Faktor pro Episode
const MIN_EPSILON = 0.01;     // Untere Grenze

// Replay-Memory
const MEMORY_SIZE = 2000;
const BATCH_SIZE = 64;
let memory = [];

// Kosten/Slippage
const TRANSACTION_FEE_RATE = 0.001; // 0.1% Transaktionsgebühr
const SLIPPAGE_RATE = 0.0005;       // 0.05% Slippage

// Risikogewichtung
const RISK_FACTOR = 0.1;

// Portfolio-Tracking
let balance = 10000;  // Beispiel: Startkapital in USD
let btcPosition = 0;  // Wieviel BTC halten wir?
let totalProfit = 0;  // Summierter Gewinn
let entryPrice = 0;   // Kaufpreis der aktuellen BTC-Position, falls > 0
let hasPosition = false;

// Q-Network erstellen
function createModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [INPUT_SIZE], units: 24, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 24, activation: 'relu' }));
  model.add(tf.layers.dense({ units: ACTIONS.length, activation: 'linear' }));

  model.compile({
    optimizer: tf.train.adam(LEARNING_RATE),
    loss: 'meanSquaredError',
  });
  return model;
}

const model = createModel();

// Speicher Erfahrungen im Replay-Memory
function storeExperience(state, action, reward, nextState, done) {
  memory.push({ state, action, reward, nextState, done });
  if (memory.length > MEMORY_SIZE) {
    memory.shift();
  }
}

// Aktion auswählen
function chooseAction(state) {
  if (Math.random() < EPSILON) {
    return Math.floor(Math.random() * ACTIONS.length);
  } else {
    const q = model.predict(tf.tensor2d([state]));
    const action = q.argMax(1).dataSync()[0];
    q.dispose();
    return action;
  }
}

// Training per Batch
async function trainBatch() {
  if (memory.length < BATCH_SIZE) return;

  const batch = shuffle(memory).slice(0, BATCH_SIZE);

  const states = batch.map(exp => exp.state);
  const nextStates = batch.map(exp => exp.nextState);

  const tfNextStates = tf.tensor2d(nextStates);
  const qValuesNext = model.predict(tfNextStates);
  const maxQValuesNext = qValuesNext.max(1).dataSync();

  tfNextStates.dispose();
  qValuesNext.dispose();

  const inputs = [];
  const targets = [];

  for (let i = 0; i < batch.length; i++) {
    const { state, action, reward, nextState, done } = batch[i];

    let targetQ = reward;
    if (!done) {
      targetQ += GAMMA * maxQValuesNext[i];
    }

    const currentQ = model.predict(tf.tensor2d([state])).dataSync();
    currentQ[action] = targetQ;

    inputs.push(state);
    targets.push(currentQ);
  }

  const tfInputs = tf.tensor2d(inputs);
  const tfTargets = tf.tensor2d(targets);

  await model.fit(tfInputs, tfTargets, { epochs: 1, verbose: 0 });

  tfInputs.dispose();
  tfTargets.dispose();
}

// Environment-Logik
// -----------------

// Diese Funktion wendet die Aktion an und berechnet eine Belohnung.
function stepEnvironment(action, currentPrice, previousPrice) {
  let reward = 0;
  const risk = Math.abs(currentPrice - previousPrice);

  if (action === 0) { // BUY
    if (!hasPosition) {
      // Kauf zum "aktuellen Marktpreis + Slippage"
      const buyPrice = currentPrice * (1 + SLIPPAGE_RATE);
      const fee = buyPrice * TRANSACTION_FEE_RATE;
      // Prüfen, ob wir genug Guthaben haben
      if (balance >= (buyPrice + fee)) {
        // 1 BTC kaufen (Beispiel)
        btcPosition += 1;
        balance -= (buyPrice + fee);
        hasPosition = true;
        entryPrice = buyPrice;
        // Reward hier kann ggf. negativ sein, weil wir Geld ausgeben
        // reward = - fee;
      } else {
        // Nicht genug Guthaben, minimaler Reward?
        reward -= 1; // ggf. Strafe
      }
    }
  } else if (action === 1) { // SELL
    if (hasPosition && btcPosition > 0) {
      const sellPrice = currentPrice * (1 - SLIPPAGE_RATE);
      const revenue = sellPrice * btcPosition;
      const fee = revenue * TRANSACTION_FEE_RATE;

      const profit = (sellPrice - entryPrice) * btcPosition;
      balance += (revenue - fee);

      btcPosition = 0;
      hasPosition = false;
      entryPrice = 0;
      reward += profit; // Belohnung = erzielter Gewinn
      totalProfit += profit;
    }
  } else {
    // HOLD
    if (hasPosition && btcPosition > 0) {
      // Optional: Belohnung oder Strafe für Halten.
      // z.B. 1% vom "unrealized P/L"
      const unrealized = (currentPrice - entryPrice) * btcPosition;
      reward += unrealized * 0.01;
    }
  }

  // Risiko-Discount
  reward -= RISK_FACTOR * risk;

  return reward;
}

async function loadBtcData() {
  // Daten laden aus Prisma
  const rows = await prisma.btcData.findMany({
    where: {
      date: {
        gte: new Date("2018-01-01"),
        lte: new Date("2025-1-31")
      }
    },
    orderBy: { date: 'asc' }
  });

  const data = rows.map(row => {
    return {
      date: row.date,
      state: [
        parseFloat(row.lastPrice),
        parseFloat(row.priceChangePercent),
        parseFloat(row.highPrice),
        parseFloat(row.lowPrice),
        parseFloat(row.volume)
      ],
      lastPrice: parseFloat(row.lastPrice)
    };
  });

  return data;
}

async function trainAgent(episodes = 5) {
  const data = await loadBtcData();
  console.log(`Geladene Datensätze: ${data.length}`);

  for (let e = 0; e < episodes; e++) {
    // Reset
    balance = 10000;  // Beispiel: Startkapital je Episode
    btcPosition = 0;
    totalProfit = 0;
    entryPrice = 0;
    hasPosition = false;

    for (let i = 1; i < data.length; i++) {
      const currentState = data[i - 1].state; // State von Vortag
      const action = chooseAction(currentState);

      const currentPrice = data[i].lastPrice;
      const previousPrice = data[i - 1].lastPrice;
      const done = (i === data.length - 1);

      // Environment ausführen
      const reward = stepEnvironment(action, currentPrice, previousPrice);

      const nextState = data[i].state;
      storeExperience(currentState, action, reward, nextState, done);

      // Trainieren
      await trainBatch();

      if (done) {
        break;
      }
    }

    // Epsilon reduzieren
    if (EPSILON > MIN_EPSILON) {
      EPSILON *= EPSILON_DECAY;
      if (EPSILON < MIN_EPSILON) {
        EPSILON = MIN_EPSILON;
      }
    }

    console.log(`Episode ${e + 1} | Balance: ${balance.toFixed(2)} | Profit: ${totalProfit.toFixed(2)} | Epsilon: ${EPSILON.toFixed(3)}`);
  }
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Hauptprogramm
(async () => {
  try {
    console.log("Starte Training...");
    await trainAgent(3); // Beispiel: 3 Episoden
    console.log("Training abgeschlossen.");

    // Optional: Modell speichern
    // await model.save('file://./myBtcDqnModelWithSlippage');

  } catch (err) {
    console.error("Fehler", err);
  } finally {
    await prisma.$disconnect();
  }
})();