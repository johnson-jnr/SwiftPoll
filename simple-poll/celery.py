import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simple-poll.settings')

app = Celery('simple-poll')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
