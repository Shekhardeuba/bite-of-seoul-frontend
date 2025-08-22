import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-korean-food.jpg";
import bulgogi from "@/assets/bulgogi-menu.jpg";
import bibimbap from "@/assets/bibimbap-menu.jpg";
import chefImage from "@/assets/chef-portrait.jpg";

const Gallery = () => {
  // Gallery images with categories
  const galleryImages = [
    {
      id: 1,
      src: heroImage,
      alt: "Korean cuisine spread",
      category: "food",
      title: "Traditional Korean Feast",
    },
    {
      id: 2,
      src: bulgogi,
      alt: "Bulgogi BBQ",
      category: "food",
      title: "Bulgogi BBQ",
    },
    {
      id: 3,
      src: bibimbap,
      alt: "Bibimbap bowl",
      category: "food",
      title: "Traditional Bibimbap",
    },
    {
      id: 4,
      src: chefImage,
      alt: "Chef Kim",
      category: "people",
      title: "Chef Kim in the Kitchen",
    },
    // Adding some placeholder variations for a fuller gallery
    {
      id: 5,
      src: bulgogi,
      alt: "Korean side dishes",
      category: "food",
      title: "Banchan Selection",
    },
    {
      id: 6,
      src: heroImage,
      alt: "Restaurant interior",
      category: "restaurant",
      title: "Dining Room Atmosphere",
    },
    {
      id: 7,
      src: bibimbap,
      alt: "Korean hot pot",
      category: "food",
      title: "Kimchi Jjigae",
    },
    {
      id: 8,
      src: bulgogi,
      alt: "Korean fried chicken",
      category: "food",
      title: "Korean Fried Chicken",
    },
    {
      id: 9,
      src: heroImage,
      alt: "Traditional Korean table setting",
      category: "restaurant",
      title: "Traditional Table Setting",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="py-20 korean-pattern">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 elegant-text">
            Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A visual journey through our authentic Korean cuisine, warm atmosphere, and culinary artistry
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <Card 
                key={image.id} 
                className={`overflow-hidden food-card-hover cursor-pointer ${
                  index % 4 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className={`relative overflow-hidden ${
                  index % 4 === 0 ? 'aspect-square' : 'aspect-[4/3]'
                }`}>
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg mb-1">
                        {image.title}
                      </h3>
                      <span className="text-white/80 text-sm capitalize">
                        {image.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Categories */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 elegant-text">
              Explore Our Story Through Images
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">🍽️</div>
                <h3 className="text-xl font-bold text-primary mb-2">Our Dishes</h3>
                <p className="text-muted-foreground text-sm">
                  Authentic Korean cuisine prepared with traditional techniques and the finest ingredients
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">👨‍🍳</div>
                <h3 className="text-xl font-bold text-primary mb-2">Our Team</h3>
                <p className="text-muted-foreground text-sm">
                  Meet the passionate chefs and staff who bring Korean hospitality to life
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-bold text-primary mb-2">Our Space</h3>
                <p className="text-muted-foreground text-sm">
                  A warm, inviting atmosphere that captures the essence of Korean dining culture
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 korean-pattern">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 elegant-text">
            Experience It Yourself
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Pictures can only capture so much. Come taste the authentic flavors and feel the warm hospitality that makes Bite of Seoul special.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/reservations" className="inline-block">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-md transition-colors">
                Make a Reservation
              </button>
            </a>
            <a href="/menu" className="inline-block">
              <button className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-3 rounded-md transition-colors">
                View Our Menu
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;