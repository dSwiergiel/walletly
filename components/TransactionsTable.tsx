"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  cn,
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from "@/lib/utils";
import { transactionCategoryStyles } from "@/constants";
import { useEffect, useRef, useState } from "react";

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const { borderColor, textColor, chipBackgroundColor, backgroundColor } =
    transactionCategoryStyles[
      category as keyof typeof transactionCategoryStyles
    ] || transactionCategoryStyles.default;
  return (
    <div className={cn("category-badge", borderColor, chipBackgroundColor)}>
      <div className={cn("size-2 rounded-full", backgroundColor)} />
      <p className={cn("text-[12px] font-medium", textColor)}>{category}</p>
    </div>
  );
};

const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  const [componentWidth, setComponentWidth] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Debounce the resize callback if needed
    const handleResize = (entries: ResizeObserverEntry[]) => {
      // Using requestAnimationFrame can help with performance
      requestAnimationFrame(() => {
        for (const entry of entries) {
          setComponentWidth(entry.contentRect.width);
        }
      });
    };

    const observer = new ResizeObserver(handleResize);

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const showExtraColumns = componentWidth > 800;

  return (
    <div ref={tableRef}>
      <Table>
        <TableHeader className="bg-[#F9FAFB]">
          <TableRow>
            <TableHead className="px-2">Transaction</TableHead>
            <TableHead className="px-2">Amount</TableHead>
            {showExtraColumns && <TableHead className="px-2">Status</TableHead>}
            <TableHead className="px-2">Date</TableHead>
            {showExtraColumns && (
              <TableHead className="px-2">Channel</TableHead>
            )}
            <TableHead className="px-2">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction: Transaction) => {
            const status = getTransactionStatus(new Date(transaction.date));
            const amount = formatAmount(transaction.amount);

            const isDebit = transaction.type === "debit";
            const isCredit = transaction.type === "credit";

            return (
              <TableRow
                key={transaction.id}
                className={`${
                  isDebit || amount[0] === "-" ? "bg-[#fffaf8]" : "bg-[#f9fffb]"
                } !over:bg-none !border-b-DEFAULT`}
              >
                <TableCell className="max-w-[250px] pl-2 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                      {removeSpecialCharacters(transaction.name)}
                    </h1>
                  </div>
                </TableCell>
                <TableCell
                  className={`pl-2 pr-10 font-semibold ${
                    isDebit || amount[0] === "-"
                      ? "text-[#F04438]"
                      : "text-[#039855]"
                  }`}
                >
                  {isDebit ? `-${amount}` : isCredit ? `${amount}` : amount}
                </TableCell>
                {showExtraColumns && (
                  <TableCell className="pl-2 pr-10">
                    <CategoryBadge category={status} />
                  </TableCell>
                )}
                <TableCell className="pl-2 pr-10">
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                {showExtraColumns && (
                  <TableCell className="pl-2 pr-10 capitalize min-w-24">
                    {transaction.paymentChannel}
                  </TableCell>
                )}
                <TableCell className="pl-2 pr-10">
                  <CategoryBadge category={transaction.category} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
