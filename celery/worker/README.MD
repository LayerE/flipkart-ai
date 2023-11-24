This repo contains code of celery worker, it also contains a Dockerfile for easy deployment.
The worker is responsible for processing the tasks from the queue and updating the database with the results (which the client can then query).

The database schema is provided in `images` folder to create the database tables. `user_id` in every table is linked to a global authentication table containing the user's email address aand their corresponding `user_id`, which is not visualised in the image, but exists on the database.

Ensure you have environment variables set for the following:

- CELERY_BROKER_URL=#Celery Broker URL
- MODAL_TOKEN_ID=#Modal Token, get from modal.com
- MODAL_TOKEN_SECRET=#Modal Token Secret, get from modal.com
- FIREWORKS_API_KEY=#Fireworks API Key, get from fireworks.ai, used for expanding the prompt
- SUPABASE_SERVICE_KEY=#Supabase Key
- NEXT_PUBLIC_SUPABASE_URL=#Supabase URL
- NEXT_PUBLIC_IMAGE_TABLE=#Table name in Supabase to store images and also name of storage bucket in supabase where images are stored
- THREED_IMAGES_TABLE_NAME=#Table name in Supabase to store 3D images
