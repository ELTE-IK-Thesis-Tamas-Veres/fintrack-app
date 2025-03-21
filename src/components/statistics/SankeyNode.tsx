import { Layer, Rectangle } from "recharts";

export interface SankeyNodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  payload: {
    name: string;
    value: number;
  };
  containerWidth: number;
}

export const SankeyNode = ({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
}: SankeyNodeProps) => {
  const isOut = x + width + 6 > containerWidth;

  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        className="fill-primary transition-color"
      />
      <text
        textAnchor={isOut ? "end" : "start"}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize="14"
        className="font-bold transition-colors fill-chart-2"
      >
        {payload.name}
      </text>
      <text
        textAnchor={isOut ? "end" : "start"}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 13}
        fontSize="12"
        className="fill-chart-3 dark:fill-white"
        strokeOpacity="0.7"
      >
        {new Intl.NumberFormat("hu-HU", {
          style: "currency",
          currency: "HUF",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(payload.value)}
      </text>
    </Layer>
  );
};
