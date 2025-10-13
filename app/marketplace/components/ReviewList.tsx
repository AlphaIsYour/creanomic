// app/marketplace/components/ReviewList.tsx
"use client";

import { useState } from "react";
import {
  Stack,
  Paper,
  Group,
  Avatar,
  Text,
  Rating,
  Box,
  Button,
  Textarea,
  Divider,
} from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import type { ReviewWithReviewer } from "@/lib/api/marketplace";

interface ReviewListProps {
  productId: string;
  initialReviews: ReviewWithReviewer[];
}

export default function ReviewList({
  productId,
  initialReviews,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewWithReviewer[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/marketplace/products/${productId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, comment }),
        }
      );

      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview.data, ...reviews]);
        setComment("");
        setRating(5);
        setShowReviewForm(false);
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <Box mt="md">
      {/* Review Summary */}
      {reviews.length > 0 && (
        <Paper withBorder p="md" radius="md" mb="md">
          <Group>
            <Box>
              <Text size="xl" fw={700}>
                {averageRating.toFixed(1)}
              </Text>
              <Rating value={averageRating} fractions={2} readOnly />
            </Box>
            <Text size="sm" c="dimmed">
              dari {reviews.length} ulasan
            </Text>
          </Group>
        </Paper>
      )}

      {/* Add Review Button */}
      {!showReviewForm && (
        <Button
          variant="light"
          leftSection={<IconStar size={18} />}
          onClick={() => setShowReviewForm(true)}
          mb="md"
        >
          Tulis Ulasan
        </Button>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <Paper withBorder p="md" radius="md" mb="md">
          <Text fw={500} mb="xs">
            Tulis Ulasan Anda
          </Text>
          <Rating value={rating} onChange={setRating} size="lg" mb="md" />
          <Textarea
            placeholder="Bagikan pengalaman Anda dengan produk ini..."
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
            minRows={3}
            mb="md"
          />
          <Group>
            <Button
              onClick={handleSubmitReview}
              loading={isSubmitting}
              disabled={!comment.trim()}
            >
              Kirim Ulasan
            </Button>
            <Button
              variant="subtle"
              onClick={() => {
                setShowReviewForm(false);
                setComment("");
                setRating(5);
              }}
            >
              Batal
            </Button>
          </Group>
        </Paper>
      )}

      <Divider my="md" label="Ulasan Pembeli" labelPosition="center" />

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          Belum ada ulasan untuk produk ini. Jadilah yang pertama!
        </Text>
      ) : (
        <Stack gap="md">
          {reviews.map((review) => (
            <Paper key={review.id} withBorder p="md" radius="md">
              <Group align="flex-start">
                <Avatar
                  src={review.reviewer.image}
                  alt={review.reviewer.name || "User"}
                  radius="xl"
                  size="md"
                />
                <Box style={{ flex: 1 }}>
                  <Group justify="space-between" mb="xs">
                    <Box>
                      <Text fw={500}>
                        {review.reviewer.name || "Anonymous"}
                      </Text>
                      <Rating value={review.rating} readOnly size="sm" />
                    </Box>
                    <Text size="xs" c="dimmed">
                      {new Date(review.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Text>
                  </Group>
                  <Text size="sm">{review.comment}</Text>
                </Box>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
