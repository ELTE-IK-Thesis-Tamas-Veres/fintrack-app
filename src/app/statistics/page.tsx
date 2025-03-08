"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { use, useEffect, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { Layer, Rectangle, Sankey, Tooltip } from "recharts";
import { toast } from "sonner";
import { SankeyData } from "../api/sankey/route";

const data0 = {
  nodes: [
    {
      name: "shopping",
      idText: "6-x",
    },
    {
      name: "snack",
      idText: "8-x",
    },
    {
      name: "food",
      idText: "7-x",
    },
    {
      name: "Uncategorised",
      idText: "7-xu",
    },
    {
      name: "cars",
      idText: "9-x",
    },
    {
      name: "Graphisoft",
      idText: "13-i",
    },
    {
      name: "tech setup",
      idText: "15-i",
    },
    {
      name: "work",
      idText: "12-i",
    },
    {
      name: "budget",
      idText: "b",
    },
  ],
  links: [
    {
      source: 8,
      sourceText: "b",
      target: 0,
      targetText: "6-x",
      value: 999,
    },
    {
      source: 2,
      sourceText: "7-x",
      target: 1,
      targetText: "8-x",
      value: 560,
    },
    {
      source: 8,
      sourceText: "b",
      target: 2,
      targetText: "7-x",
      value: 4010,
    },
    {
      source: 2,
      sourceText: "7-x",
      target: 3,
      targetText: "7-xu",
      value: 3450,
    },
    {
      source: 8,
      sourceText: "b",
      target: 4,
      targetText: "9-x",
      value: 156000,
    },
    {
      source: 5,
      sourceText: "13-i",
      target: 7,
      targetText: "12-i",
      value: 235000,
    },
    {
      source: 6,
      sourceText: "15-i",
      target: 7,
      targetText: "12-i",
      value: 1234,
    },
    {
      source: 7,
      sourceText: "12-i",
      target: 8,
      targetText: "b",
      value: 236234,
    },
  ],
};

const SankeyLink = (props) => {
  const {
    sourceX,
    targetX,
    sourceY,
    targetY,
    sourceControlX,
    targetControlX,
    linkWidth,
    index,
  } = props;
  const [fill, setFill] = useState("url(#linkGradient)");

  return (
    <Layer key={`CustomLink${index}`}>
      <path
        d={`
          M${sourceX},${sourceY + linkWidth / 2}
          C${sourceControlX},${sourceY + linkWidth / 2}
            ${targetControlX},${targetY + linkWidth / 2}
            ${targetX},${targetY + linkWidth / 2}
          L${targetX},${targetY - linkWidth / 2}
          C${targetControlX},${targetY - linkWidth / 2}
            ${sourceControlX},${sourceY - linkWidth / 2}
            ${sourceX},${sourceY - linkWidth / 2}
          Z
        `}
        fill={fill}
        strokeWidth="0"
        onMouseEnter={() => setFill("rgba(0, 136, 254, 0.5)")}
        onMouseLeave={() => setFill("url(#linkGradient)")}
      />
    </Layer>
  );
};

function SankeyNode({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
}: any) {
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
}

export default function Page() {
  const [sankeyDataState, setSankeyDataState] = useState<{
    isLoading: boolean;
    response?: SankeyData;
    error: unknown;
  }>({
    isLoading: false,
    response: undefined,
    error: undefined,
  });

  const fetchSankeyData = async (query: string) => {
    setSankeyDataState((previous) => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch("/api/sankey?" + query);
      const data = await response.json();

      if (data.error) {
        setSankeyDataState((previous) => ({
          ...previous,
          response: undefined,
          error: data.error,
        }));

        toast("Errod fetching data", {
          description: data.error,
        });
      } else {
        setSankeyDataState((previous) => ({
          ...previous,
          response: data,
          error: undefined,
        }));
      }
    } catch (error) {
      setSankeyDataState((previous) => ({
        ...previous,
        response: undefined,
        error: undefined,
      }));

      toast("Errod fetching data", {
        description: "error",
      });
    } finally {
      setSankeyDataState((previous) => ({ ...previous, isLoading: false }));
    }
  };

  const handleFilter = () => {
    if (year === "all") {
      fetchSankeyData("");
    } else if (month === "all") {
      fetchSankeyData(`year=${year}`);
    } else {
      fetchSankeyData(`year=${year}&month=${month}`);
    }
  };

  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    fetchSankeyData("");
  }, []);

  return (
    <>
      <div className="bg-card p-4 rounded-md shadow-sm border min-h-[600px] h-[80vh]">
        <h1>Statistics</h1>

        <Select onValueChange={(value) => setYear(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Year</SelectLabel>
              <SelectItem value="all">Every Year</SelectItem>
              {Array.from(
                { length: new Date().getFullYear() - 1999 },
                (_, i) => (
                  <SelectItem
                    key={i}
                    value={(new Date().getFullYear() - i).toString()}
                  >
                    {new Date().getFullYear() - i}
                  </SelectItem>
                )
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        {year !== "all" && (
          <Select onValueChange={(value) => setMonth(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Month</SelectLabel>
                <SelectItem value="all">Every month</SelectItem>
                {months.map((month, index) => (
                  <SelectItem key={index} value={(index + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <Button onClick={() => handleFilter()}>Filter</Button>

        {sankeyDataState.isLoading && <p>Loading...</p>}
        {sankeyDataState.response &&
          sankeyDataState.response.nodes.length == 0 && <p>No data</p>}
        {sankeyDataState.response &&
          sankeyDataState.response.nodes.length > 0 && (
            <AutoSizer>
              {({ width }) => (
                <>
                  <Sankey
                    width={width}
                    height={500}
                    data={sankeyDataState.response!}
                    node={<SankeyNode containerWidth={960} />}
                    nodeWidth={10}
                    nodePadding={60}
                    linkCurvature={0.61}
                    iterations={64}
                    margin={{
                      left: 200,
                      right: 200,
                      top: 100,
                      bottom: 100,
                    }}
                    link={<SankeyLink />}
                  >
                    <defs>
                      <linearGradient id="linkGradient">
                        <stop offset="0%" stopColor="rgba(0, 136, 254, 0.5)" />
                        <stop
                          offset="100%"
                          stopColor="rgba(0, 197, 159, 0.3)"
                        />
                      </linearGradient>
                    </defs>
                    <Tooltip />
                  </Sankey>
                </>
              )}
            </AutoSizer>
          )}
      </div>
    </>
  );
}
