import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import type { SearchHistory } from '@/backend';
import type { Principal } from '@icp-sdk/core/principal';

interface SearchHistoryTableProps {
  data: Array<[Principal, SearchHistory[]]>;
}

export default function SearchHistoryTable({ data }: SearchHistoryTableProps) {
  const [sortField, setSortField] = useState<'timestamp' | 'departure' | 'destination'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Flatten the data structure for easier sorting and display
  const flattenedData = data.flatMap(([principal, histories]) =>
    histories.map((history) => ({
      principal: principal.toString(),
      ...history,
    }))
  );

  // Sort the data
  const sortedData = [...flattenedData].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'timestamp') {
      comparison = Number(a.timestamp) - Number(b.timestamp);
    } else if (sortField === 'departure') {
      comparison = a.departure.localeCompare(b.departure);
    } else if (sortField === 'destination') {
      comparison = a.destination.localeCompare(b.destination);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: 'timestamp' | 'departure' | 'destination') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatDateRange = (departureDate: string, returnDate: string) => {
    return `${departureDate} → ${returnDate}`;
  };

  const formatTimestamp = (timestamp: bigint): string => {
    const milliseconds = Number(timestamp) / 1_000_000;
    const date = new Date(milliseconds);
    return date.toLocaleString();
  };

  const isAnonymousUser = (principal: string) => {
    return principal === '2vxsx-fae';
  };

  if (sortedData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-orange-700 dark:text-orange-300">No search history available yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-orange-200 dark:border-orange-800">
            <TableHead className="text-orange-900 dark:text-orange-100">User ID</TableHead>
            <TableHead
              className="cursor-pointer text-orange-900 hover:text-orange-600 dark:text-orange-100 dark:hover:text-orange-400"
              onClick={() => handleSort('departure')}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Departure City
                {sortField === 'departure' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer text-orange-900 hover:text-orange-600 dark:text-orange-100 dark:hover:text-orange-400"
              onClick={() => handleSort('destination')}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Destination City
                {sortField === 'destination' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </div>
            </TableHead>
            <TableHead className="text-orange-900 dark:text-orange-100">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Travel Dates
              </div>
            </TableHead>
            <TableHead className="text-orange-900 dark:text-orange-100">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Travelers
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer text-orange-900 hover:text-orange-600 dark:text-orange-100 dark:hover:text-orange-400"
              onClick={() => handleSort('timestamp')}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Search Time
                {sortField === 'timestamp' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, index) => (
            <TableRow key={index} className="border-orange-100 dark:border-orange-900">
              <TableCell className="font-mono text-xs">
                {isAnonymousUser(item.principal) ? (
                  <Badge variant="secondary">Anonymous</Badge>
                ) : (
                  <span className="truncate max-w-[150px] inline-block" title={item.principal}>
                    {item.principal.slice(0, 8)}...
                  </span>
                )}
              </TableCell>
              <TableCell className="font-medium">{item.departure}</TableCell>
              <TableCell className="font-medium">{item.destination}</TableCell>
              <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                {formatDateRange(item.departure_date, item.return_date)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{Number(item.num_travelers)}</Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                {formatTimestamp(item.timestamp)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
