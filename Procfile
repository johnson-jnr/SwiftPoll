web: uv run daphne -b 0.0.0.0 -p $PORT simple-poll.asgi:application
worker: uv run celery -A simple-poll worker -l info --concurrency=1
beat: uv run celery -A simple-poll beat -l warning --scheduler django_celery_beat.schedulers:DatabaseScheduler
