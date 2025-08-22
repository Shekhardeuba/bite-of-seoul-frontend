import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import chefImage from "@/assets/chef-portrait.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="py-20 korean-pattern">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 elegant-text">
            Our Story
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A journey from Seoul to your table, bringing authentic Korean traditions and flavors
          </p>
        </div>
      </section>

      {/* Restaurant Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <CardContent className="space-y-6">
                <h2 className="text-3xl font-bold text-primary mb-6">
                  Born from Tradition, Crafted with Love
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Bite of Seoul was born from a simple dream: to share the authentic flavors and warm hospitality 
                  of Korea with our community. Our journey began in a small kitchen in Seoul, where traditional 
                  recipes were passed down through generations of passionate cooks.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every dish we serve tells a story of Korean culture, from the fermented richness of our house-made 
                  kimchi to the perfectly marinated bulgogi that has been grilled to perfection. We believe that food 
                  is more than sustenance—it's a bridge between cultures, a way to share stories, and a means to 
                  create lasting memories.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Today, we continue to honor these traditions while embracing the diversity of our community, 
                  creating a space where everyone can experience the warmth and flavor of authentic Korean cuisine.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chef Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src={chefImage} 
                  alt="Chef Kim" 
                  className="w-full h-[600px] object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl font-bold elegant-text">
                  Meet Chef Kim
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Chef Kim brings over 20 years of culinary expertise from Seoul's finest restaurants to Bite of Seoul. 
                  Trained in the traditional methods of Korean cooking, Chef Kim has mastered the delicate balance of 
                  flavors that makes Korean cuisine so distinctive.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  "Cooking is not just about following recipes," says Chef Kim. "It's about understanding the soul of 
                  the ingredients and respecting the traditions that have been passed down for centuries. When you taste 
                  our food, I want you to experience the warmth of a Korean home."
                </p>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-primary">Specialties:</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Traditional Korean BBQ techniques</li>
                    <li>• House-made kimchi and fermented vegetables</li>
                    <li>• Authentic Korean hot pot dishes</li>
                    <li>• Traditional Korean desserts and teas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Korean Culture */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold elegant-text mb-8">
              Korean Culinary Culture
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6">
                <CardContent className="text-center space-y-4">
                  <div className="text-4xl mb-4">🍱</div>
                  <h3 className="text-xl font-bold text-primary">Banchan</h3>
                  <p className="text-muted-foreground">
                    Traditional side dishes that accompany every Korean meal, creating a symphony of flavors and textures.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="text-center space-y-4">
                  <div className="text-4xl mb-4">🥢</div>
                  <h3 className="text-xl font-bold text-primary">Jeong</h3>
                  <p className="text-muted-foreground">
                    The Korean concept of heart and affection that goes into every dish, making meals a labor of love.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="text-center space-y-4">
                  <div className="text-4xl mb-4">🌶️</div>
                  <h3 className="text-xl font-bold text-primary">Balance</h3>
                  <p className="text-muted-foreground">
                    The harmony of sweet, salty, spicy, and umami flavors that defines authentic Korean cuisine.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;