import type { LogicState, Bit } from "./Entities";

// Deterministic Boolean Evaluation for 2-bit packets
export class LogicEngine {
  
  // AND: Bitwise AND of A and B, stored in B. [A, A AND B]
  static evaluateAND(input: LogicState): LogicState {
    return [input[0], (input[0] & input[1]) as Bit];
  }

  // OR: Forces both bits to 1 (Breaks Shields)
  static evaluateOR(_input: LogicState): LogicState {
    return [1, 1];
  }

  // NOT: Flips the first bit. [NOT A, B]
  static evaluateNOT(input: LogicState): LogicState {
    return [(input[0] === 1 ? 0 : 1) as Bit, input[1]];
  }

  // XOR: Replaces B with A XOR B. [A, A XOR B]
  static evaluateXOR(input: LogicState): LogicState {
    return [input[0], (input[0] ^ input[1]) as Bit];
  }
}
