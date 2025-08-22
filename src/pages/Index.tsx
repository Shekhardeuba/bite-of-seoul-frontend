import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-korean-food.jpg";
import bulgogi from "@/assets/bulgogi-menu.jpg";
import bibimbap from "@/assets/bibimbap-menu.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Delicious Korean cuisine" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Authentic Korean
            <span className="block elegant-text text-accent">
              Flavors Await
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Experience the rich traditions and bold flavors of Korea in the heart of the city
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-3">
                View Our Menu
              </Button>
            </Link>
            <Link to="/reservations">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
                Make Reservation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 elegant-text">
              Featured Dishes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our most beloved traditional Korean dishes, prepared with authentic recipes and the finest ingredients
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="food-card-hover overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={bulgogi} 
                  alt="Korean BBQ Bulgogi" 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-primary">Bulgogi BBQ</h3>
                <p className="text-muted-foreground mb-4">
                  Tender marinated beef grilled to perfection with our secret blend of Korean spices
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">$24.99</span>
                  <Link to="/menu">
                    <Button variant="outline">View Menu</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="food-card-hover overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={bibimbap} 
                  alt="Traditional Bibimbap" 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-primary">Bibimbap</h3>
                <p className="text-muted-foreground mb-4">
                  A colorful bowl of rice topped with seasoned vegetables, meat, and a perfectly fried egg
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">$18.99</span>
                  <Link to="/menu">
                    <Button variant="outline">View Menu</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 korean-pattern">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 elegant-text">
            Ready for an Authentic Korean Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book your table today and let us take you on a culinary journey through Korea
          </p>
          <Link to="/reservations">
            <Button size="lg" className="px-8 py-3">
              Reserve Your Table
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;