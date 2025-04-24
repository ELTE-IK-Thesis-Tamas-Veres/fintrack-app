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
import { useEffect, useMemo, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { Cell, LabelList, Sankey, Tooltip, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
import { format } from "date-fns";
import {
  calculateMaxNodesAtSameDistance,
  fetchAndHandle,
  FetchState,
} from "@/lib/utils";
import { SankeyLink } from "@/components/statistics/SankeyLink";
import { SankeyNode } from "@/components/statistics/SankeyNode";
import { SankeyData } from "@/types/DTO/Sankey";
import {
  MonthlyCategoryStatistics,
  MonthlyIncomeExpense,
} from "@/types/DTO/Statistics";
import { GetCategoryResponse } from "@/types/DTO/Category";
import { SelectCategoryComboBox } from "@/components/record/SelectCategoryComboBox";

export default function Page() {
  const [monthlyCategoryState, setMonthlyCategoryState] = useState<
    FetchState<MonthlyCategoryStatistics[]>
  >({
    isLoading: false,
    response: [],
    error: undefined,
  });

  const fetchLastYearCategoriesMonthly = async (queryString: string) => {
    await fetchAndHandle<MonthlyCategoryStatistics[]>(
      "/api/statistics/lastYearCategoryMonthly" + queryString,
      setMonthlyCategoryState,
      []
    );
  };

  const [monthlyDataState, setMonthlyDataState] = useState<
    FetchState<MonthlyIncomeExpense[]>
  >({
    isLoading: false,
    response: [],
    error: undefined,
  });

  const fetchMonthlyStatistics = async () => {
    await fetchAndHandle<MonthlyIncomeExpense[]>(
      "/api/statistics/lastYearMonthly",
      setMonthlyDataState,
      []
    );
  };

  const [sankeyDataState, setSankeyDataState] = useState<
    FetchState<SankeyData>
  >({
    isLoading: false,
    response: undefined,
    error: undefined,
  });

  const fetchSankeyData = async (query: string) => {
    await fetchAndHandle<SankeyData>(
      "/api/sankey" + query,
      setSankeyDataState,
      undefined
    );
  };

  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");

  const [selectedCategory, setSelectedCategory] =
    useState<GetCategoryResponse | null>(null);

  const handleSankeyFilter = () => {
    if (year === "all") {
      fetchSankeyData("");
    } else if (month === "all") {
      fetchSankeyData(`?year=${year}`);
    } else {
      fetchSankeyData(`?year=${year}&month=${month}`);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchLastYearCategoriesMonthly(`?categoryId=${selectedCategory.id}`);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchSankeyData("");
    fetchMonthlyStatistics();
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
    startDate.setMonth(currentDate.getMonth() - 11);

    return `${format(startDate, "MMMM yyyy")} - ${format(
      currentDate,
      "MMMM yyyy"
    )}`;
  };

  const averageDiff = useMemo(() => {
    if (monthlyDataState.response && monthlyDataState.response.length > 0) {
      const totalDiff = monthlyDataState.response.reduce(
        (acc, curr) => acc + (curr.income - curr.expense),
        0
      );
      return totalDiff / monthlyDataState.response.length;
    }
    return 0;
  }, [monthlyDataState.response]);

  const averegeCategoryDiff = useMemo(() => {
    if (
      monthlyCategoryState.response &&
      monthlyCategoryState.response.length > 0
    ) {
      const totalCategoryDiff = monthlyCategoryState.response.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      return totalCategoryDiff / monthlyCategoryState.response.length;
    }
    return 0;
  }, [monthlyCategoryState.response]);

  const sankeyHeight = useMemo(() => {
    return sankeyDataState.response
      ? calculateMaxNodesAtSameDistance(sankeyDataState.response)
      : 0;
  }, [sankeyDataState.response]);

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6 border rounded-lg shadow-lg bg-card">
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

          {/* Month Selector */}
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
      <Card
        className="p-6 border rounded-lg shadow-lg bg-card h-[80vh]"
        style={{ minHeight: `${sankeyHeight * 50 + 200}px` }}
      >
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
              {({ width, height }) => (
                <Sankey
                  width={width}
                  height={height}
                  data={sankeyDataState.response!}
                  node={(nodeProps) => (
                    <SankeyNode {...nodeProps} containerWidth={960} />
                  )}
                  nodeWidth={15}
                  nodePadding={30}
                  linkCurvature={0.5}
                  iterations={64}
                  link={(linkProps) => <SankeyLink {...linkProps} />}
                  margin={{ left: 100, right: 200, top: 100, bottom: 100 }}
                  sort={false}
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

      <Card className="p-6 border rounded-lg shadow-lg bg-card">
        <CardHeader className="mb-4">
          <CardTitle className="text-xl font-bold">
            Incomes and expenses monthly summary
          </CardTitle>
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
                  <YAxis
                    tickLine={true}
                    tickMargin={5}
                    axisLine={false}
                    tickFormatter={(value) => {
                      return value.toLocaleString("hu-HU", {
                        style: "currency",
                        currency: "HUF",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      });
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar
                    dataKey="expense"
                    fill="var(--color-expense)"
                    radius={4}
                  />
                  <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          )}
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Average monthly balance:{" "}
            {Math.round(averageDiff).toLocaleString("hu-HU")} HUF
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Based on data from the past 12 months
          </div>
        </CardFooter>
      </Card>
      <Card className="p-6 border rounded-lg shadow-lg bg-card">
        <CardHeader className="mb-4">
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle className="text-xl font-bold">
                Selected category - Monthly summary
              </CardTitle>
              <CardDescription>{getTimePeriodDescription()}</CardDescription>
            </div>
            <SelectCategoryComboBox
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
              label={false}
            />
          </div>
        </CardHeader>

        <CardContent>
          {monthlyCategoryState.isLoading ? (
            <p className="text-center text-muted">Loading...</p>
          ) : !selectedCategory ? (
            <p className="text-center">Select a category to view data</p>
          ) : monthlyCategoryState.response === undefined ||
            monthlyCategoryState.response.length === 0 ? (
            <p className="text-center">No data available</p>
          ) : (
            <ChartContainer config={chartConfig2}>
              <BarChart accessibilityLayer data={monthlyCategoryState.response}>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={true}
                  tickMargin={5}
                  axisLine={false}
                  tickFormatter={(value) => {
                    return value.toLocaleString("hu-HU", {
                      style: "currency",
                      currency: "HUF",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    });
                  }}
                />
                <CartesianGrid vertical={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel hideIndicator />}
                />
                <Bar dataKey="amount">
                  <LabelList position="top" dataKey="amount" fillOpacity={1} />
                  {monthlyCategoryState.response.map((item) => (
                    <Cell
                      key={item.month}
                      fill={
                        item.amount > 0
                          ? "hsl(var(--chart-2))"
                          : "hsl(var(--chart-1))"
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
            Average monthly amount for selected category:{" "}
            {Math.round(averegeCategoryDiff).toLocaleString("hu-HU")} HUF
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Based on data from the past 12 months
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

const chartConfig = {
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
  },
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const chartConfig2 = {
  visitors: {
    label: "Visitors",
  },
} satisfies ChartConfig;
