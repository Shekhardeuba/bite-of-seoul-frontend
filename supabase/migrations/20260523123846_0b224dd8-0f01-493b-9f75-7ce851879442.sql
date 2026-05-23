-- Create public storage bucket for menu item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for menu images
CREATE POLICY "Menu images are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

-- Admins can upload menu images
CREATE POLICY "Admins can upload menu images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update menu images
CREATE POLICY "Admins can update menu images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'menu-images' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete menu images
CREATE POLICY "Admins can delete menu images"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-images' AND public.has_role(auth.uid(), 'admin'));