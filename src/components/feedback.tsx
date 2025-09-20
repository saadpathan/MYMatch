"use client"
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Feedback() {
    const { toast } = useToast();

    const handleFeedback = () => {
        toast({
            title: "Thank you!",
            description: "Your feedback helps us improve."
        });
    };

    return (
        <div className="mt-12 text-center p-6 border rounded-lg bg-card">
            <h4 className="font-headline text-lg font-semibold mb-3">Was this helpful?</h4>
            <div className="flex justify-center gap-4">
                <Button variant="outline" size="lg" onClick={handleFeedback}>
                    <ThumbsUp className="mr-2 h-5 w-5" /> Yes
                </Button>
                <Button variant="outline" size="lg" onClick={handleFeedback}>
                    <ThumbsDown className="mr-2 h-5 w-5" /> No
                </Button>
            </div>
        </div>
    );
}
