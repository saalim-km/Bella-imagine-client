import { Button } from "@/components/ui/button"
import { communityToast, showSuccess, showError, showWarning, showInfo } from "@/components/ui/community-toast"

export function ToastDemo() {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-lg font-semibold mb-4">Community Toast Examples</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Basic variants */}
        <Button variant="outline" onClick={() => showSuccess("Your profile has been updated successfully!")}>
          Success Toast
        </Button>

        <Button variant="outline" onClick={() => showError("Failed to upload image. Please try again.")}>
          Error Toast
        </Button>

        <Button variant="outline" onClick={() => showWarning("Your profile is incomplete")}>
          Warning Toast
        </Button>

        <Button variant="outline" onClick={() => showInfo("New features are now available!")}>
          Info Toast
        </Button>

        {/* Photography-specific toasts */}
        <Button variant="outline" onClick={() => communityToast.photoUploaded(3)}>
          Photo Uploaded
        </Button>

        <Button variant="outline" onClick={() => communityToast.bookingConfirmed("Sarah Johnson")}>
          Booking Confirmed
        </Button>

        <Button variant="outline" onClick={() => communityToast.newMessage("Alex Chen")}>
          New Message
        </Button>

        <Button variant="outline" onClick={() => communityToast.portfolioLiked("Emma Wilson")}>
          Portfolio Liked
        </Button>

        <Button variant="outline" onClick={() => communityToast.reviewReceived(5)}>
          Review Received
        </Button>

        <Button variant="outline" onClick={() => communityToast.welcomePhotographer("John Doe")}>
          Welcome Photographer
        </Button>

        <Button variant="outline" onClick={() => communityToast.profileIncomplete()}>
          Profile Incomplete
        </Button>

        <Button variant="outline" onClick={() => communityToast.uploading()}>
          Uploading State
        </Button>
      </div>
    </div>
  )
}
