"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useUser } from "@auth0/nextjs-auth0";

const HomePage = () => {
  const { user } = useUser();

  const chartConfig = {
    income: {
      label: "Income",
      color: "hsl(var(--chart-5))",
    },
    expense: {
      label: "Expense",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const chartData = [
    { month: "January", income: 186000, expense: 80000 },
    { month: "February", income: 305000, expense: 200000 },
    { month: "March", income: 237000, expense: 120000 },
    { month: "April", income: 73000, expense: 190000 },
    { month: "May", income: 209000, expense: 130000 },
    { month: "June", income: 214000, expense: 140000 },
    { month: "July", income: 186000, expense: 80000 },
    { month: "August", income: 305000, expense: 200000 },
    { month: "September", income: 237000, expense: 120000 },
    { month: "October", income: 73000, expense: 190000 },
    { month: "November", income: 209000, expense: 130000 },
    { month: "December", income: 214000, expense: 140000 },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header / Navbar */}
      <header className="shadow">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link className="text-2xl font-bold text-gray-600" href="/">
            FinTrack expense tracker
          </Link>
          {user && (
            <Link href="/auth/login">
              <Button variant="default">Sign Up</Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Master Your Finances</h1>
          <p className="text-xl text-gray-600 mb-8">
            Track your income and expenses effortlessly with our intuitive
            dashboard and insightful analytics.
          </p>
          {user ? (
            <Link href="/categories">
              <Button variant="default" size="lg">
                Get Started
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button variant="default" size="lg">
                Get Started
              </Button>
            </Link>
          )}
        </section>

        {/* Chart Section */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Using shadcn charts */}
              <ChartContainer config={chartConfig}>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={true}
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
                  <Bar
                    dataKey="expense"
                    fill="var(--color-expense)"
                    radius={4}
                  />
                  <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        {/* Features / Marketing Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Visual Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Understand your spending habits through beautiful, easy-to-read
                charts and graphs.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Infinite Category Customization</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Organize your finances with infinite nested categories—define
                them recursively and as deeply as you need.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Export you transactions from your bank and import them into
                FinTrack to keep all your financial data in one place.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
