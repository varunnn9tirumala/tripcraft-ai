import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatCurrency';
import { CheckCircle, XCircle } from 'lucide-react';
import type { BookingSession } from '@/backend';

interface AnalyticsTableProps {
  data: BookingSession[];
}

export default function AnalyticsTable({ data }: AnalyticsTableProps) {
  const [sortedData] = useState(data);

  const BooleanIcon = ({ value }: { value: boolean }) =>
    value ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );

  const formatTimestamp = (timestamp: bigint): string => {
    const milliseconds = Number(timestamp) / 1_000_000;
    const date = new Date(milliseconds);
    return date.toLocaleString();
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Initial Satisfaction</TableHead>
            <TableHead>Opened Sarah</TableHead>
            <TableHead>Post-Sarah Satisfaction</TableHead>
            <TableHead>Booked</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((session, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{session.userName}</TableCell>
              <TableCell>{session.userEmail}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {session.sourceCity} → {session.destinationCity}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {formatCurrency(Number(session.packagePrice), session.currency)}
                </Badge>
              </TableCell>
              <TableCell>
                <BooleanIcon value={session.initialSatisfaction} />
              </TableCell>
              <TableCell>
                <BooleanIcon value={session.openedSarahAI} />
              </TableCell>
              <TableCell>
                <BooleanIcon value={session.postSarahSatisfaction} />
              </TableCell>
              <TableCell>
                <BooleanIcon value={session.proceededToBooking} />
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatTimestamp(session.timestamp)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
