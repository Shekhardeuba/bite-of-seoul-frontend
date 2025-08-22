import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import bulgogi from "@/assets/bulgogi-menu.jpg";
import bibimbap from "@/assets/bibimbap-menu.jpg";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Items" },
    { id: "appetizers", label: "Appetizers" },
    { id: "mains", label: "Main Dishes" },
    { id: "drinks", label: "Drinks" },
    { id: "desserts", label: "Desserts" },
  ];

  const menuItems = [
    {
      id: 1,
      name: "Bulgogi BBQ",
      description: "Tender marinated beef grilled to perfection with Korean spices",
      price: "$24.99",
      category: "mains",
      image: bulgogi,
      spicy: false,
    },
    {
      id: 2,
      name: "Bibimbap",
      description: "Rice bowl with seasoned vegetables, meat, and fried egg",
      price: "$18.99",
      category: "mains",
      image: bibimbap,
      spicy: true,
    },
    {
      id: 3,
      name: "Kimchi Pancake",
      description: "Crispy pancake made with fermented kimchi and scallions",
      price: "$12.99",
      category: "appetizers",
      image: bibimbap, // placeholder
      spicy: true,
    },
    {
      id: 4,
      name: "Korean Fried Chicken",
      description: "Double-fried chicken with sweet and spicy glaze",
      price: "$19.99",
      category: "mains",
      image: bulgogi, // placeholder
      spicy: true,
    },
    {
      id: 5,
      name: "Mandu Dumplings",
      description: "Steamed dumplings filled with pork and vegetables",
      price: "$14.99",
      category: "appetizers",
      image: bibimbap, // placeholder
      spicy: false,
    },
    {
      id: 6,
      name: "Soju",
      description: "Traditional Korean rice wine",
      price: "$8.99",
      category: "drinks",
      image: bulgogi, // placeholder
      spicy: false,
    },
  ];

  const filteredItems = activeCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="py-20 korean-pattern">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 elegant-text">
            Our Menu
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover authentic Korean flavors crafted with traditional recipes and the finest ingredients
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className="transition-all duration-200"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card key={item.id} className="food-card-hover overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-primary">{item.name}</h3>
                    {item.spicy && (
                      <span className="text-primary text-lg">🌶️</span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-accent">{item.price}</span>
                    <Button variant="outline" size="sm">
                      Add to Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Menu;