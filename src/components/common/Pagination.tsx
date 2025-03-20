import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];
  console.log(totalPages, "total pages");
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pageNumbers.map((number) => (
        <React.Fragment key={number}>
          {number === 1 ||
          number === totalPages ||
          (number >= currentPage - 1 && number <= currentPage + 1) ? (
            <Button
              variant={currentPage === number ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(number)}
            >
              {number}
            </Button>
          ) : (
            (number === currentPage - 2 || number === currentPage + 2) && (
              <Button variant="outline" size="icon" disabled>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )
          )}
        </React.Fragment>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
