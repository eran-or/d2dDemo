export type Point = {
  x: number;
  y: number;
};

export interface Shape {
  id: string,
  path: Array<Point>;
  backgroundData: ImageData | null;
}
