import { Graph } from "yuka";
import { TTTNode } from "./TTTNode";
export class TTTGraph extends Graph {
  constructor(humanPlayer: number);

  currentNode: number;
  nextNode: number;
  digraph: boolean;

  aiPlayer: number;

  test(): void;
  init(): void;
  addNode(node: TTTNode): any;
  generate(nodeIndex: number, activePlayer: number): number;
  aiTurn(): void;
  getNextBoard(node: TTTNode, cell: number, player: number): number[];
  nextPlayer(currentPlayer: number): number;
  findNode(board: number[]): number;
  turn(cell: number, player: number): void;
  computeWeight(node: TTTNode): void;
}
