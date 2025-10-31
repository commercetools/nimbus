/**
 * Content Feedback Component
 *
 * Allows users to provide feedback on documentation helpfulness
 */

import { useState } from "react";
import { Box, Button, Stack, Text, Textarea } from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";

interface ContentFeedbackProps {
  documentId: string;
}

type FeedbackState = "initial" | "helpful" | "not-helpful" | "submitted";

export function ContentFeedback({ documentId }: ContentFeedbackProps) {
  const [state, setState] = useState<FeedbackState>("initial");
  const [comment, setComment] = useState("");

  const handleHelpful = () => {
    setState("helpful");
    // In a real app, this would send analytics/feedback to a backend
    console.log("Feedback: Helpful", { documentId });

    setTimeout(() => {
      setState("submitted");
    }, 500);
  };

  const handleNotHelpful = () => {
    setState("not-helpful");
  };

  const handleSubmitComment = () => {
    // In a real app, this would send feedback to a backend
    console.log("Feedback: Not helpful", { documentId, comment });

    setState("submitted");
  };

  const handleCancel = () => {
    setState("initial");
    setComment("");
  };

  if (state === "submitted") {
    return (
      <Box
        borderWidth="1px"
        borderColor="neutral.6"
        borderRadius="200"
        padding="400"
        marginY="600"
      >
        <Stack gap="200" alignItems="center">
          <Icons.CheckCircle color="positive.11" />
          <Text color="fg.muted">Thank you for your feedback!</Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      borderWidth="1px"
      borderColor="neutral.6"
      borderRadius="200"
      padding="400"
      marginY="600"
    >
      {state === "initial" && (
        <Stack gap="300">
          <Text fontWeight="500">Was this page helpful?</Text>
          <Stack direction="row" gap="300">
            <Button
              variant="outline"
              size="sm"
              onClick={handleHelpful}
              aria-label="Yes, this was helpful"
            >
              <Icons.ThumbUp />
              Yes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNotHelpful}
              aria-label="No, this was not helpful"
            >
              <Icons.ThumbDown />
              No
            </Button>
          </Stack>
        </Stack>
      )}

      {state === "not-helpful" && (
        <Stack gap="300">
          <Text fontWeight="500">What could we improve?</Text>
          <Textarea
            placeholder="Tell us how we can make this page better..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <Stack direction="row" gap="300">
            <Button size="sm" variant="solid" onClick={handleSubmitComment}>
              Submit
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
