import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type CallDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callDetails: any | null;
};

export function CallDetailsDialog({
  open,
  onOpenChange,
  callDetails,
}: CallDetailsDialogProps) {
  if (!callDetails) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Call Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Call ID:</strong>{" "}
            <span className="font-mono">{callDetails.call_id}</span>
          </div>
          {callDetails.error && (
            <div className="text-red-600 text-xs">{callDetails.error}</div>
          )}
          <div>
            <strong>Status:</strong> <Badge>{callDetails.status}</Badge>
          </div>
          <div>
            <strong>To:</strong> {callDetails.to}
          </div>
          <div>
            <strong>From:</strong> {callDetails.from}
          </div>
          <div>
            <strong>Direction:</strong> {callDetails.direction}
          </div>
          <div>
            <strong>Start Time:</strong> {callDetails.start_time}
          </div>
          <div>
            <strong>End Time:</strong> {callDetails.end_time}
          </div>
          <div>
            <strong>Duration:</strong> {callDetails.duration} sec
          </div>
          <div>
            <strong>Price:</strong> ${callDetails.price}
          </div>
          <div>
            <strong>Recording:</strong>
            {callDetails.recording_urls && callDetails.recording_urls.length > 0 ? (
              <div className="flex flex-col gap-1 mt-1">
                {callDetails.recording_urls.map((url: string, i: number) => (
                  <audio controls key={url} className="w-full">
                    <source src={url} type="audio/wav" />
                    Recording {i + 1}
                  </audio>
                ))}
              </div>
            ) : (
              <span className="italic text-gray-400">No recordings</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
