import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/40 mt-20">
    <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-xl font-bold elegant-text mb-3">Bite of Seoul</h3>
        <p className="text-sm text-muted-foreground">Authentic Korean cuisine, crafted with passion.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Explore</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/menu" className="hover:text-primary">Menu</Link></li>
          <li><Link to="/reservations" className="hover:text-primary">Reservations</Link></li>
          <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
          <li><Link to="/about" className="hover:text-primary">About</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Account</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/profile" className="hover:text-primary">Profile</Link></li>
          <li><Link to="/orders" className="hover:text-primary">Orders</Link></li>
          <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Contact</h4>
        <p className="text-sm text-muted-foreground">123 Hangang Rd<br/>Open daily 11AM – 11PM</p>
      </div>
    </div>
    <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Bite of Seoul. All rights reserved.
    </div>
  </footer>
);

export default Footer;
