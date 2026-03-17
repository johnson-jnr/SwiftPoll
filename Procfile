web: uv run daphne -b 0.0.0.0 -p $PORT simple-poll.asgi:application
worker: uv run celery -A simple-poll worker -l info
beat: uv run celery -A simple-poll beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
