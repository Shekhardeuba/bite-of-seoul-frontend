import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Reviews = () => {
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    rating: 5,
    review: "",
  });

  const { toast } = useToast();

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      review: "Absolutely amazing experience! The bulgogi was perfectly marinated and the kimchi was the best I've ever had. The service was exceptional and the atmosphere felt like being in Seoul.",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      date: "2024-01-10",
      review: "Authentic Korean flavors that remind me of my grandmother's cooking. The bibimbap was colorful, fresh, and delicious. Chef Kim really knows how to balance all the flavors perfectly.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 4,
      date: "2024-01-08",
      review: "Great food and lovely atmosphere. The Korean fried chicken was crispy and flavorful. Will definitely be coming back to try more dishes!",
    },
    {
      id: 4,
      name: "David Kim",
      rating: 5,
      date: "2024-01-05",
      review: "As a Korean-American, I can say this restaurant serves truly authentic Korean food. The banchan selection is impressive and everything tastes like home. Highly recommended!",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      rating: 5,
      date: "2024-01-02",
      review: "Celebrated my birthday here and it was perfect! The staff was so attentive and the food was incredible. The traditional setting made the whole experience special.",
    },
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: This will send to API when backend is ready
    console.log("New review:", newReview);
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback. Your review will be published after moderation.",
    });
    setNewReview({
      name: "",
      email: "",
      rating: 5,
      review: "",
    });
  };

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="py-20 korean-pattern">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 elegant-text">
            Customer Reviews
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear what our guests have to say about their Korean dining experience
          </p>
        </div>
      </section>

      {/* Rating Summary */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center">
              <CardContent>
                <div className="text-6xl font-bold text-primary mb-4">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-2xl mb-4">
                  {renderStars(Math.round(averageRating))}
                </div>
                <p className="text-xl text-muted-foreground">
                  Based on {reviews.length} customer reviews
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 elegant-text">
              What Our Guests Say
            </h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-primary">{review.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg">{renderStars(review.rating)}</div>
                        <div className="text-sm text-muted-foreground">{review.rating}/5</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      "{review.review}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Add Review Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-center mb-6 elegant-text">
                  Share Your Experience
                </h2>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reviewName">Your Name *</Label>
                      <Input
                        id="reviewName"
                        value={newReview.name}
                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                        required
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reviewEmail">Email *</Label>
                      <Input
                        id="reviewEmail"
                        type="email"
                        value={newReview.email}
                        onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating *</Label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({...newReview, rating: star})}
                          className={`text-2xl ${
                            star <= newReview.rating ? "text-accent" : "text-muted-foreground"
                          } hover:text-accent transition-colors`}
                        >
                          ⭐
                        </button>
                      ))}
                      <span className="ml-4 text-muted-foreground">
                        {newReview.rating}/5 stars
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviewText">Your Review *</Label>
                    <Textarea
                      id="reviewText"
                      value={newReview.review}
                      onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                      required
                      placeholder="Tell us about your experience at Bite of Seoul..."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;