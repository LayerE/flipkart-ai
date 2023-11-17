This repo contains code of celery worker, written also as a Dockerfile for easy deployment.
The worker is responsible for processing the tasks from the queue and updating the database with the results (which the client can then query).

The database schema is provided in `images` folder to create the database tables. `user_id` in every table is linked to a global authentication table containing the user's email address aand their corresponding `user_id`, which is not visualised in the image, but exists on the database.

Ensure you have environment variables set for the following:
 - CLOUDAMQP_URL=#RabbitMQ URL
 - IMAGEKIT_PRIVATE_KEYY=#ImageKit Private Key
 - IMAGEKIT_PUBLIC_KEYY=#ImageKit Public Key
 - IMAGEKIT_URL_ENDPOINTY=#ImageKit URL Endpoint
 - MODAL_TOKEN_ID=#Modal Token , get from modal.com
 - MODAL_TOKEN_SECRET=#Modal Token Secret, get from modal.com
 - OPENAI_API_KEY=#OpenAI API Key, not used currently, but add if needed to expand the prompt and then enable it in the code
 - SUPABASE_KEY=#Supabase Key
 - SUPABASE_URL=#Supabase URL
 - TABLE_NAME_WITHOUT_AUTH=#Table name in Supabase to store images