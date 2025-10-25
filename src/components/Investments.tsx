import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, RefreshCw, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface Holding {
  tradingsymbol: string;
  quantity: number;
  average_price: number;
  last_price: number;
  pnl: number;
  pnl_percent: number;
}

interface MarketIndex {
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}

export const Investments = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);
  const [totalPnLPercent, setTotalPnLPercent] = useState(0);

  useEffect(() => {
    fetchMarketIndices();
    const interval = setInterval(fetchMarketIndices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMarketIndices = async () => {
    try {
      const response = await fetch('/api/market/indices');
      if (response.ok) {
        const data = await response.json();
        setMarketIndices(data);
      }
    } catch (error) {
      console.error('Failed to fetch market indices:', error);
    }
  };

  const connectZerodha = () => {
    toast.info("Zerodha integration coming soon! You'll be able to connect your Kite account here.");
  };

  // Demo data for UI showcase
  const demoHoldings: Holding[] = [
    { tradingsymbol: "TCS", quantity: 10, average_price: 3500, last_price: 3650, pnl: 1500, pnl_percent: 4.29 },
    { tradingsymbol: "INFY", quantity: 15, average_price: 1450, last_price: 1520, pnl: 1050, pnl_percent: 4.83 },
    { tradingsymbol: "RELIANCE", quantity: 5, average_price: 2450, last_price: 2380, pnl: -350, pnl_percent: -2.86 },
    { tradingsymbol: "HDFC BANK", quantity: 8, average_price: 1650, last_price: 1720, pnl: 560, pnl_percent: 4.24 },
  ];

  const displayHoldings = isConnected ? holdings : demoHoldings;
  const demoTotalValue = demoHoldings.reduce((sum, h) => sum + (h.last_price * h.quantity), 0);
  const demoTotalPnL = demoHoldings.reduce((sum, h) => sum + h.pnl, 0);
  const demoTotalPnLPercent = (demoTotalPnL / (demoTotalValue - demoTotalPnL)) * 100;

  const displayTotalValue = isConnected ? totalValue : demoTotalValue;
  const displayTotalPnL = isConnected ? totalPnL : demoTotalPnL;
  const displayTotalPnLPercent = isConnected ? totalPnLPercent : demoTotalPnLPercent;

  return (
    <div className="space-y-6">
      {!isConnected && (
        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <LinkIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Connect Your Zerodha Account</h3>
                  <p className="text-sm text-muted-foreground">Link your Kite account to track your real portfolio here</p>
                </div>
              </div>
              <Button onClick={connectZerodha} className="gap-2">
                <LinkIcon className="w-4 h-4" />
                Connect Zerodha
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketIndices.map((index) => (
          <Card key={index.symbol} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{index.symbol}</p>
                  <p className="text-2xl font-bold mt-1">₹{index.value.toLocaleString('en-IN')}</p>
                </div>
                <div className={`flex items-center gap-1 ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {index.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  <span className="font-semibold">{index.changePercent.toFixed(2)}%</span>
                </div>
              </div>
              <div className={`text-sm mt-2 ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{displayTotalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-muted-foreground mt-1">Current portfolio value</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${displayTotalPnL >= 0 ? 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800' : 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200 dark:border-red-800'}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            {displayTotalPnL >= 0 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${displayTotalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {displayTotalPnL >= 0 ? '+' : ''}₹{displayTotalPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <p className={`text-xs mt-1 font-medium ${displayTotalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {displayTotalPnL >= 0 ? '+' : ''}{displayTotalPnLPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <PieChart className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayHoldings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Stocks in portfolio</p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Your Holdings
            </CardTitle>
            {!isConnected && (
              <Badge variant="secondary" className="text-xs">Demo Data</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayHoldings.map((holding, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{holding.tradingsymbol}</h3>
                  <p className="text-sm text-muted-foreground">
                    {holding.quantity} shares @ ₹{holding.average_price.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Current</p>
                    <p className="text-lg font-semibold">₹{holding.last_price.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Value</p>
                    <p className="text-lg font-semibold">
                      ₹{(holding.last_price * holding.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className={`text-right min-w-[100px] ${holding.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="flex items-center justify-end gap-1">
                      {holding.pnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-bold">{holding.pnl_percent.toFixed(2)}%</span>
                    </div>
                    <p className="text-sm font-medium">
                      {holding.pnl >= 0 ? '+' : ''}₹{holding.pnl.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayHoldings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No holdings found</p>
              <p className="text-sm">Connect your Zerodha account to see your portfolio</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
