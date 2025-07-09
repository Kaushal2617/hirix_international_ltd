import React, { useState, useMemo } from "react";
import { PoundSterling, ShoppingBag, Users, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const mockStats = {
  totalRevenue: 54230,
  totalOrders: 245,
  avgOrderValue: 221.5,
  refunds: 5,
};

const mockRevenueData = [
  { date: "12 May 2025", orders: 12, revenue: 3450, refunds: 1, net: 3400 },
  { date: "11 May 2025", orders: 9, revenue: 2780, refunds: 0, net: 2780 },
  { date: "10 May 2025", orders: 15, revenue: 4100, refunds: 2, net: 4000 },
  { date: "09 May 2025", orders: 8, revenue: 1890, refunds: 0, net: 1890 },
];

const Revenue: React.FC = () => {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({ from: undefined, to: undefined });
  const [tempDateRange, setTempDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({ from: undefined, to: undefined });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'month' | 'week'>("all");
  const [selectedMonth, setSelectedMonth] = useState("May 2025");
  const [selectedWeek, setSelectedWeek] = useState("Week 2 May 2025");
  const navigate = useNavigate();

  // Mock: All-time revenue (from first to last order)
  const totalWebsiteRevenue = 123456; // Replace with real calculation later

  // Mock: Available months and weeks
  const months = ["May 2025", "April 2025", "March 2025"];
  const weeks = [
    "Week 1 May 2025",
    "Week 2 May 2025",
    "Week 3 May 2025",
    "Week 4 May 2025",
    "Week 1 April 2025",
    "Week 2 April 2025",
  ];

  // Filtered data (mock logic)
  const filteredData = useMemo(() => {
    let data = mockRevenueData;
    if (filterType === "month") {
      // Extract month and year from selectedMonth
      const [month, year] = selectedMonth.split(" ");
      data = data.filter(row => {
        const rowDate = new Date(row.date);
        // Get month name and year from rowDate
        const rowMonth = rowDate.toLocaleString('default', { month: 'long' });
        const rowYear = rowDate.getFullYear().toString();
        return rowMonth === month && rowYear === year;
      });
    } else if (filterType === "week") {
      // Extract week number, month, and year from selectedWeek
      const [_, weekNum, month, year] = selectedWeek.split(" ");
      // Find the first day of the month
      const firstDayOfMonth = new Date(`${month} 1, ${year}`);
      // Calculate the start and end date of the selected week
      const weekIndex = parseInt(weekNum) - 1;
      const startDate = new Date(firstDayOfMonth);
      startDate.setDate(firstDayOfMonth.getDate() + weekIndex * 7);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      data = data.filter(row => {
        const rowDate = new Date(row.date);
        return rowDate >= startDate && rowDate <= endDate;
      });
    }
    // Date range filter
    if (dateRange.from && dateRange.to) {
      const from = new Date(dateRange.from);
      const to = new Date(dateRange.to);
      data = data.filter(row => {
        const rowDate = new Date(row.date);
        return rowDate >= from && rowDate <= to;
      });
    }
    if (search && !data.some(row => row.date.includes(search))) return [];
    return data;
  }, [filterType, selectedMonth, selectedWeek, search, dateRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Revenue Analytics</h1>
        <Button variant="outline" onClick={() => navigate('/admin')}>
          ← Back to Dashboard
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg shadow bg-gradient-to-br from-green-500 to-green-400 text-white p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Revenue</span>
            <PoundSterling className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold">£{(mockStats.totalRevenue / 1000).toFixed(1)}k</div>
        </div>
        <div className="rounded-lg shadow bg-gradient-to-br from-blue-500 to-blue-400 text-white p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Orders</span>
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold">+{mockStats.totalOrders}</div>
        </div>
        <div className="rounded-lg shadow bg-gradient-to-br from-yellow-500 to-yellow-400 text-white p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Avg. Order Value</span>
            <Users className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold">£{mockStats.avgOrderValue.toFixed(2)}</div>
        </div>
        <div className="rounded-lg shadow bg-gradient-to-br from-red-500 to-red-400 text-white p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Refunds</span>
            <RefreshCcw className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold">{mockStats.refunds}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex gap-2 items-center">
          <label className="font-medium">View:</label>
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
          >
            <option value="all">All Time</option>
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
          {filterType === "month" && (
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background ml-2"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          )}
          {filterType === "week" && (
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background ml-2"
              value={selectedWeek}
              onChange={e => setSelectedWeek(e.target.value)}
            >
              {weeks.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          )}
        </div>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <PoundSterling className="w-4 h-4" />
              Filter by date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto bg-white rounded-lg shadow-lg border">
            <div className="bg-green-600 text-white flex items-center justify-between px-4 py-2 rounded-t-lg">
              <span className="font-semibold">Filter by date</span>
              <PoundSterling className="w-4 h-4" />
            </div>
            <div className="p-4">
              <Calendar
                mode="range"
                selected={tempDateRange}
                onSelect={setTempDateRange}
                numberOfMonths={1}
                showOutsideDays={false}
                className="calendar-lg"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setTempDateRange({ from: undefined, to: undefined });
                    setPopoverOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  style={{ backgroundColor: '#219653', color: 'white' }}
                  onClick={() => {
                    setDateRange(tempDateRange);
                    setPopoverOpen(false);
                  }}
                  disabled={!tempDateRange || !tempDateRange.from || !tempDateRange.to}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          placeholder="Search by date, customer, order ID..."
          className="md:w-72"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {/* Add more filters as needed */}
      </div>

      {/* Revenue Table */}
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Revenue Breakdown</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Refunds</TableHead>
              <TableHead>Net Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.orders}</TableCell>
                <TableCell>£{row.revenue}</TableCell>
                <TableCell>{row.refunds}</TableCell>
                <TableCell>£{row.net}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default Revenue; 