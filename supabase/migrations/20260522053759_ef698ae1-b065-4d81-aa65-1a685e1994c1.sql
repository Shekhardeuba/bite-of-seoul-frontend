UPDATE public.menu_items SET image_url = CASE name
  WHEN 'Bulgogi BBQ' THEN 'https://images.unsplash.com/photo-1632558022480-c0b06d2e5e3f?w=800&q=80&auto=format&fit=crop'
  WHEN 'Bibimbap' THEN 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800&q=80&auto=format&fit=crop'
  WHEN 'Kimchi Pancake' THEN 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800&q=80&auto=format&fit=crop'
  WHEN 'Korean Fried Chicken' THEN 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80&auto=format&fit=crop'
  WHEN 'Mandu Dumplings' THEN 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80&auto=format&fit=crop'
  WHEN 'Soju' THEN 'https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?w=800&q=80&auto=format&fit=crop'
  WHEN 'Hotteok' THEN 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80&auto=format&fit=crop'
  WHEN 'Japchae' THEN 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=800&q=80&auto=format&fit=crop'
  ELSE image_url END;