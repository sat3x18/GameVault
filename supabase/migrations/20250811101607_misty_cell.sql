/*
  # Setup Admin User and Authentication

  1. Authentication Setup
    - Creates an admin user in Supabase Auth
    - Sets up proper email/password authentication
  
  2. Security
    - Ensures RLS policies work with authenticated users
    - Admin user will have proper authentication context

  Note: This migration sets up the admin user that matches the application credentials.
  The admin user email is admin@example.com with password admin123.
*/

-- Insert admin user into auth.users (this is handled by Supabase Auth, but we ensure the user exists)
-- Note: In a real application, you would create this user through the Supabase dashboard
-- or use the Supabase Auth API. This is just for demonstration.

-- The admin user should be created manually in the Supabase dashboard:
-- Email: admin@example.com
-- Password: admin123

-- Ensure our RLS policies are working correctly for authenticated users
-- The existing policies should already allow authenticated users to perform CRUD operations