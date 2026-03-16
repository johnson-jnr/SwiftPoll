import logging

from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task
def check_poll_schedules():
    from polls.models import Poll

    now = timezone.now()

    logger.info("Checking poll schedules at %s", now)
    activated = Poll.objects.filter(
        is_draft=False, start_date__lte=now, active=False
    ).update(active=True)
    deactivated = Poll.objects.filter(
        end_date__lte=now, active=True
    ).update(active=False)

    return f"Activated: {activated}, Deactivated: {deactivated}"
