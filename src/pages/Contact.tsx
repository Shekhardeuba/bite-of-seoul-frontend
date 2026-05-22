import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="py-20 korean-pattern">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 elegant-text">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch with us for reservations, catering, or any questions about our Korean cuisine
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Location */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <span className="text-2xl mr-3">📍</span>
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic text-muted-foreground">
                  1/95 Gorge Rd<br />
                  Adelaide, SA<br />
                  Australia
                </address>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <a href="https://www.google.com/maps/search/?api=1&query=1%2F95+Gorge+Rd" target="_blank" rel="noreferrer">Get Directions</a>
                </Button>
              </CardContent>
            </Card>

            {/* Phone & Email */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <span className="text-2xl mr-3">📞</span>
                  Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-foreground">Phone</p>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <p className="text-muted-foreground">info@biteofseoul.com</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Reservations</p>
                  <p className="text-muted-foreground">reservations@biteofseoul.com</p>
                </div>
              </CardContent>
            </Card>

            {/* Hours */}
            <Card className="h-full md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <span className="text-2xl mr-3">🕒</span>
                  Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Thursday</span>
                    <span>5:00 PM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday - Saturday</span>
                    <span>5:00 PM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>4:00 PM - 9:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 elegant-text">
              Find Us
            </h2>
            
            {/* Google Maps Placeholder */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-4xl">🗺️</div>
                  <h3 className="text-xl font-semibold text-primary">Interactive Map</h3>
                  <p className="text-muted-foreground max-w-md">
                    Google Maps integration will be added here to show our exact location and provide directions.
                  </p>
                  <Button variant="outline">
                    Open in Google Maps
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 elegant-text">
              Additional Services
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Catering Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Bring authentic Korean flavors to your special events. We offer catering 
                    for corporate events, weddings, and private parties.
                  </p>
                  <Button variant="outline">
                    Learn More About Catering
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Private Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Host your special occasion in our private dining room. Perfect for 
                    birthday celebrations, business dinners, and family gatherings.
                  </p>
                  <Button variant="outline">
                    Book Private Event
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 korean-pattern">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 elegant-text">
            Follow Our Journey
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stay updated with our latest dishes, events, and Korean culture stories on social media
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="lg">
              📘 Facebook
            </Button>
            <Button variant="outline" size="lg">
              📷 Instagram
            </Button>
            <Button variant="outline" size="lg">
              🐦 Twitter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;