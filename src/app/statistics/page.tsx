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
import { useEffect, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { Cell, LabelList, Layer, Rectangle, Sankey, Tooltip } from "recharts";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SankeyData } from "../api/sankey/route";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MonthlyIncomeExpense } from "../api/statistics/lastYearMonthly/route";
import { format } from "date-fns";
import { GetCategoryResponse } from "../api/category/route";
import { MonthlyCategoryStatistics } from "../api/statistics/lastYearCategoryMonthly/route";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const SankeyNode = ({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
}: any) => {
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

  const [monthlyDataState, setMonthlyDataState] = useState<{
    isLoading: boolean;
    response?: MonthlyIncomeExpense[];
    error: unknown;
  }>({
    isLoading: false,
    response: undefined,
    error: undefined,
  });

  const [categoriesState, setCategoriesState] = useState<{
    isLoading: boolean;
    response: GetCategoryResponse[];
    error: unknown;
  }>({
    isLoading: false,
    response: [],
    error: undefined,
  });

  const [monthlyCategoryState, setMonthlyCategoryState] = useState<{
    isLoading: boolean;
    response: MonthlyCategoryStatistics[];
    error: unknown;
  }>({
    isLoading: false,
    response: [],
    error: undefined,
  });

  console.log(monthlyCategoryState);

  const fetchCategories = async () => {
    setCategoriesState((previous) => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch("/api/category");
      const data = await response.json();

      if (data.error) {
        setCategoriesState((previous) => ({
          ...previous,
          response: [],
          error: data.error,
        }));
      } else {
        setCategoriesState((previous) => ({
          ...previous,
          response: data,
          error: undefined,
        }));
      }
    } catch (error) {
      setCategoriesState((previous) => ({
        ...previous,
        response: [],
        error: undefined,
      }));
    } finally {
      setCategoriesState((previous) => ({ ...previous, isLoading: false }));
    }
  };

  const fetchLastYearCategoriesMonthly = async (queryString: string) => {
    setMonthlyDataState((previous) => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch(
        "/api/statistics/lastYearCategoryMonthly/?" + queryString
      );
      const data = await response.json();

      if (data.error) {
        setMonthlyCategoryState((previous) => ({
          ...previous,
          response: [],
          error: data.error,
        }));

        toast("Error fetching data", {
          description: data.error,
        });
      } else {
        setMonthlyCategoryState((previous) => ({
          ...previous,
          response: data,
          error: undefined,
        }));
      }
    } catch (error) {
      setMonthlyCategoryState((previous) => ({
        ...previous,
        response: [],
        error: error,
      }));

      toast("Error fetching data", {
        description: "Something went wrong",
      });
    } finally {
      setMonthlyDataState((previous) => ({ ...previous, isLoading: false }));
    }
  };

  const fetchMonthlyStatistics = async () => {
    setMonthlyDataState((previous) => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch("/api/statistics/lastYearMonthly");
      const data = await response.json();

      if (data.error) {
        setMonthlyDataState((previous) => ({
          ...previous,
          response: undefined,
          error: data.error,
        }));

        toast("Error fetching data", {
          description: data.error,
        });
      } else {
        setMonthlyDataState((previous) => ({
          ...previous,
          response: data,
          error: undefined,
        }));
      }
    } catch (error) {
      setMonthlyDataState((previous) => ({
        ...previous,
        response: undefined,
        error: error,
      }));

      toast("Error fetching data", {
        description: "Something went wrong",
      });
    } finally {
      setMonthlyDataState((previous) => ({ ...previous, isLoading: false }));
    }
  };

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

        toast("Error fetching data", {
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
        error: error,
      }));

      toast("Error fetching data", {
        description: "Something went wrong",
      });
    } finally {
      setSankeyDataState((previous) => ({ ...previous, isLoading: false }));
    }
  };

  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined);

  const handleSankeyFilter = () => {
    if (year === "all") {
      fetchSankeyData("");
    } else if (month === "all") {
      fetchSankeyData(`year=${year}`);
    } else {
      fetchSankeyData(`year=${year}&month=${month}`);
    }
  };

  useEffect(() => {
    if (selectedCategoryId) {
      fetchLastYearCategoriesMonthly(`categoryId=${selectedCategoryId}`);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    fetchSankeyData("");
    fetchMonthlyStatistics();
    fetchCategories();
  }, []);

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

  const getTimePeriodDescription = () => {
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setMonth(currentDate.getMonth() - 11); // Get 12 months ago

    return `${format(startDate, "MMMM yyyy")} - ${format(
      currentDate,
      "MMMM yyyy"
    )}`;
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6 border rounded-lg shadow-sm bg-card">
        <h1 className="text-2xl font-semibold">Sankey Diagram</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Year Selector */}
          <Select onValueChange={(value) => setYear(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Year" />
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

          {/* Month Selector (Only visible if a year is selected) */}
          {year !== "all" && (
            <Select onValueChange={(value) => setMonth(value)}>
              <SelectTrigger className="w-full">
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

          {/* Filter Button */}
          <Button className="w-full" onClick={handleSankeyFilter}>
            Apply Filter
          </Button>
        </div>
      </Card>

      {/* Sankey Diagram */}
      <Card className="p-6 border rounded-lg shadow-sm bg-card min-h-[600px] h-[80vh]">
        {sankeyDataState.isLoading && (
          <div className="h-[500px] flex items-center justify-center">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        )}

        {!sankeyDataState.isLoading &&
          sankeyDataState.response &&
          sankeyDataState.response.nodes.length === 0 && (
            <p className="text-center text-muted-foreground">
              No data available
            </p>
          )}

        {!sankeyDataState.isLoading &&
          sankeyDataState.response &&
          sankeyDataState.response.nodes.length > 0 && (
            <AutoSizer>
              {({ width }) => (
                <Sankey
                  width={width}
                  height={500}
                  data={sankeyDataState.response!}
                  node={<SankeyNode containerWidth={960} />}
                  nodeWidth={10}
                  nodePadding={60}
                  linkCurvature={0.61}
                  iterations={64}
                  margin={{ left: 200, right: 200, top: 100, bottom: 100 }}
                >
                  <defs>
                    <linearGradient id="linkGradient">
                      <stop offset="0%" stopColor="rgba(0, 136, 254, 0.5)" />
                      <stop offset="100%" stopColor="rgba(0, 197, 159, 0.3)" />
                    </linearGradient>
                  </defs>
                  <Tooltip />
                </Sankey>
              )}
            </AutoSizer>
          )}
      </Card>

      {/* Monthly Summary */}

      <Card className="p-6 border rounded-lg shadow-sm bg-card min-h-[600px] h-[80vh]">
        <CardHeader>
          <CardTitle>Incomes and expenses monthly summary</CardTitle>
          <CardDescription>{getTimePeriodDescription()}</CardDescription>
        </CardHeader>
        {monthlyDataState.isLoading && (
          <div className="h-[500px] flex items-center justify-center">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        )}
        {!monthlyDataState.isLoading &&
          monthlyDataState.response &&
          monthlyDataState.response.length === 0 && (
            <p className="text-center text-muted-foreground">
              No data available
            </p>
          )}
        {!monthlyDataState.isLoading &&
          monthlyDataState.response &&
          monthlyDataState.response.length > 0 && (
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart
                  data={monthlyDataState.response}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                  <Bar
                    dataKey="expense"
                    fill="var(--color-expense)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          )}
      </Card>
      <Card className="p-6 border rounded-lg shadow-sm bg-card min-h-[600px] h-[80vh]">
        <CardHeader>
          <CardTitle>Bar Chart - Negative</CardTitle>
          <CardDescription>{getTimePeriodDescription()}</CardDescription>
        </CardHeader>
        <Select onValueChange={(value) => setSelectedCategoryId(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select category</SelectLabel>
              {categoriesState.response.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <CardContent>
          {monthlyCategoryState.isLoading && <p>Loading...</p>}
          {!monthlyCategoryState.isLoading &&
            selectedCategoryId &&
            monthlyCategoryState.response.length === 0 && (
              <p>No data available</p>
            )}
          {!selectedCategoryId && <p>Select a category to view data</p>}
          {!monthlyCategoryState.isLoading &&
            monthlyCategoryState.response.length > 0 && (
              <ChartContainer config={chartConfig2}>
                <BarChart
                  accessibilityLayer
                  data={monthlyCategoryState.response}
                >
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <CartesianGrid vertical={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel hideIndicator />}
                  />
                  <Bar dataKey="amount">
                    <LabelList
                      position="top"
                      dataKey="amount"
                      fillOpacity={1}
                    />
                    {monthlyCategoryState.response.map((item) => (
                      <Cell
                        key={item.month}
                        fill={
                          item.amount > 0
                            ? "hsl(var(--chart-1))"
                            : "hsl(var(--chart-2))"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

const chartData = [
  { month: "January", visitors: 186 },
  { month: "February", visitors: 205 },
  { month: "March", visitors: -207 },
  { month: "April", visitors: 173 },
  { month: "May", visitors: -209 },
  { month: "June", visitors: 214 },
  { month: "January", visitors: 186 },
  { month: "February", visitors: 205 },
  { month: "March", visitors: -207 },
  { month: "April", visitors: 173 },
  { month: "May", visitors: -209 },
  { month: "June", visitors: 214 },
];
const chartConfig2 = {
  visitors: {
    label: "Visitors",
  },
} satisfies ChartConfig;
