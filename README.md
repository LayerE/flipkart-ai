# Flipkart AI

## API service 

## Celery worker

## Frontend
The main website of Flipkart Ai

## Banner
Banner genratring site

Deploy Banner sepratly and add live url on  env file of frondted 


Before setting up this project create a supabase table with the schema provided in `schema.png` and also create the following postgress functions:

```sql
create table
  profiles (
    id uuid references auth.users on delete cascade not null primary key,
    email text
  );

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for
select
  using (true);

create policy "Users can insert their own profile." on profiles for insert
with
  check (auth.uid () = id);

create policy "Users can update own profile." on profiles
for update
  using (auth.uid () = id);

create or replace function public.handle_new_user() 
returns trigger as $$
begin
  INSERT INTO public.profiles (id, email)
  values (new.id, new.email)
  ON CONFLICT (id) 
  DO 
    UPDATE SET email = new.email;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after update or insert on auth.users for each row
execute procedure public.handle_new_user ();
```

```sql
CREATE OR REPLACE FUNCTION regenerate_add_to_gallery(image_urls_arg text[], user_id_arg uuid, project_id_arg uuid) returns void as $$
BEGIN
  UPDATE public_images
  SET is_regenerated = false
  WHERE modified_image_url = ANY(image_urls_arg)
  AND user_id = user_id_arg
  AND project_id = project_id_arg;
END;
$$ language plpgsql;
```

# This is used for API service not needed for website
```sql
create
or replace function check_api_key_and_credits (api_key_arg text, task_id_arg text) returns table (should_process boolean) as $$
DECLARE
  credits_var INT;
  user_id_var text;
BEGIN
  -- Check if the user has a job running
  EXECUTE FORMAT('SELECT user_id FROM %I WHERE api_hash = $1', 'APIKeys')
  INTO user_id_var
  USING api_key_arg;

  IF user_id_var IS not null THEN
    -- Create Task
    INSERT INTO "APIRequests" (user_id, task_id) VALUES (user_id_var, task_id_arg);

    -- Get credits
    EXECUTE FORMAT('SELECT credits FROM %I WHERE user_id = $1', 'APICredits')
    INTO credits_var
    USING user_id_var;

    -- Update APICredits
    EXECUTE FORMAT('UPDATE %I SET credits = $1 + 1 WHERE user_id = $2', 'APICredits')
    USING credits_var, user_id_var;
  END IF;

  -- Return credits and job_running in a single record with field names
  RETURN QUERY SELECT user_id_var is not null;
END;
$$ language plpgsql;
```


Also create the supabase storage buckets for Brand assets and then use the same name in the env file of the frontend using `BRAND_ASSETS_BUCKET` variable.

Similarily create for Banner and keep the name as `BANNER_TABLE` in env file

Also create the supabase storage buckets for Images and then use the same name in the env file of the frontend using `NEXT_PUBLIC_IMAGE_TABLE` variable.

Also create the supabase storage buckets for Supabase request images and then use the same name in the env file of the frontend using `SUPABASE_REQUEST_IMAGES_BUCKET` variable.

# For API service, you need one more bucket for storing the generated images of api requests, use the same name in celery worker env file using `API_REQUEST_BUCKET` variable and also add the `API_REQUESTS_TABLE` variable to store the generated images.
