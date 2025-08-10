/*
  # Create items table for game listings

  1. New Tables
    - `items`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `price` (numeric, required)
      - `image` (text, required)
      - `description` (text, required)
      - `category` (text, required)
      - `in_stock` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `items` table
    - Add policy for public read access
    - Add policy for authenticated users to manage items
*/

CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  image text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to items
CREATE POLICY "Anyone can read items"
  ON items
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert items
CREATE POLICY "Authenticated users can insert items"
  ON items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update items
CREATE POLICY "Authenticated users can update items"
  ON items
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete items
CREATE POLICY "Authenticated users can delete items"
  ON items
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO items (title, price, image, description, category, in_stock) VALUES
  ('Valorant Account - EU', 45, 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400', 'High-tier Valorant account with exclusive skins and competitive rank. EU region, all champions unlocked.', 'Accounts', true),
  ('CS2 Prime Account', 32, 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400', 'Counter-Strike 2 Prime account with excellent trust factor and clean history. Ready for competitive play.', 'Accounts', true),
  ('League of Legends - Level 30', 28, 'https://images.pexels.com/photos/7915236/pexels-photo-7915236.jpeg?auto=compress&cs=tinysrgb&w=400', 'Fresh Level 30 LoL account with all champions and premium skins. Perfect for ranked play.', 'Accounts', true),
  ('Steam Gift Card - $50', 47, 'https://images.pexels.com/photos/5029857/pexels-photo-5029857.jpeg?auto=compress&cs=tinysrgb&w=400', 'Digital Steam wallet code delivered instantly. Perfect for purchasing games and in-game content.', 'Gift Cards', true),
  ('Apex Legends Coaching - 2 Hours', 35, 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400', 'Professional coaching session with a Master-tier player. Improve your gameplay and ranking.', 'Services', true),
  ('Discord Nitro - 1 Month', 9, 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400', 'Discord Nitro subscription with enhanced features, custom emojis, and server boosts.', 'Subscriptions', false);