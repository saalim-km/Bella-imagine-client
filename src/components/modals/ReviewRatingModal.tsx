import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useReviewMutation } from "@/hooks/review/useReview";
import { createNewReview } from "@/services/review/reviewService";
import { toast } from "sonner";
import { handleError } from "@/utils/Error/errorHandler";

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const StarRating = ({ rating, setRating }: StarRatingProps) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          className="focus:outline-none"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          <Star
            className={`h-8 w-8 ${
              star <= (hover || rating)
                ? "fill-primary text-primary"
                : "fill-muted text-muted-foreground"
            } transition-colors`}
          />
          <span className="sr-only">{star} stars</span>
        </button>
      ))}
    </div>
  );
};

export default function ReviewRatingSystem({ vendorId, bookingId }: { vendorId: string, bookingId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const { mutate: createReview } = useReviewMutation(createNewReview);

  const handleSubmit = () => {
    console.log({ rating, review });

    createReview(
      {
        comment: review,
        rating: rating,
        vendorId,
        bookingId
      },
      {
        onSuccess: (data) => toast.success(data.message),
        onError: (error: any) => handleError(error),
      }
    );

    setRating(0);
    setReview("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Rate the Vendor</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
          <DialogDescription>
            Please share your feedback about the vendor. Your review helps
            others make informed decisions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-2">
            <Label htmlFor="rating" className="text-center">
              How would you rate your experience?
            </Label>
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              placeholder="Share your experience with this vendor..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={rating === 0}>
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}