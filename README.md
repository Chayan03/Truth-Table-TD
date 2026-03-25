# Truth Table Tower Defense

A cyberpunk-themed, logic-based tower defense game built with React, TypeScript, and Vite. 

## The Game

Defend your system's CPU Core from corrupted data packets! Incoming packets are represented by 2-bit binary signals (e.g., `10` or `01`). Your goal is to strategically place Logic Gates (AND, OR, NOT, XOR) on the grid to perform boolean operations on these packets as they path over them. 

You must successfully process every packet into a harmless, neutralized `00` state before it breaches your CPU core. Surviving packets earn you Clock Cycles ($), which you use to purchase more complex logic structures to handle faster, shielded enemies.

### Available Gates:
- **AND GATE**: Modifies packets using logical AND. Good for stripping bits.
- **OR GATE**: Forces bits high (`1, 1`). Essential for breaking advanced enemy shields.
- **NOT GATE**: Inverts the left bit! 
- **XOR GATE**: Exclusive OR. Highly modular and tactical.

## Development

This project was bootstrapped with Vite. 

To run locally:
```bash
npm install
npm run dev
```

To build for production:
```bash
npm run build
```
