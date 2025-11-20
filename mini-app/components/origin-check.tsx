'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Holder {
  wallet: string;
  fundedBy: string;
}

export default function OriginCheck() {
  const [contract, setContract] = useState('');
  const [holders, setHolders] = useState<Holder[]>([]);
  const [cluster, setCluster] = useState(false);
  const [score, setScore] = useState(0);

  const simulateFetch = () => {
    // Simulate top 20 holders with random fundedBy addresses
    const fakeHolders: Holder[] = Array.from({ length: 20 }, (_, i) => ({
      wallet: `0xWallet${i + 1}`,
      fundedBy: i < 4 ? '0xSenderABC' : `0xSender${i + 5}`
    }));
    setHolders(fakeHolders);

    // Detect cluster anomaly
    const freq: Record<string, number> = {};
    fakeHolders.forEach(h => {
      freq[h.fundedBy] = (freq[h.fundedBy] || 0) + 1;
    });
    const hasCluster = Object.values(freq).some(v => v > 3);
    setCluster(hasCluster);

    // Random safety score between 70 and 100
    setScore(Math.floor(70 + Math.random() * 30));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Origin Check</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="Paste Token Contract"
            value={contract}
            onChange={e => setContract(e.target.value)}
            className="flex-1"
          />
          <Button onClick={simulateFetch} variant="outline">
            Check Origin
          </Button>
        </div>

        {holders.length > 0 && (
          <>
            <div className="flex items-center gap-4">
              <Progress value={score} className="w-32" />
              <span className="text-2xl font-bold">{score}% Distributed</span>
            </div>

            {cluster && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                ⚠️ Common Funding Source Detected
              </Badge>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Funded By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holders.slice(0, 5).map((h, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{h.wallet}</TableCell>
                    <TableCell>{h.fundedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}
