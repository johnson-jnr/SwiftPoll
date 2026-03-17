import logging

from celery import shared_task
from django.db.models import Q
from django.utils import timezone
from polls.models import Poll

logger = logging.getLogger(__name__)


@shared_task
def check_poll_schedules():
    now = timezone.now()

    logger.info("Checking poll schedules at %s", now)

    activate_ids = list(
        Poll.objects.filter(
            is_draft=False,
            start_date__lte=now,
            active=False,
        )
        .filter(Q(end_date__isnull=True) | Q(end_date__gt=now))
        .values_list("id", flat=True)
    )
    if activate_ids:
        Poll.objects.filter(id__in=activate_ids).update(active=True)
        logger.info("Activated poll IDs: %s", activate_ids)

    deactivate_ids = list(
        Poll.objects.filter(end_date__lte=now, active=True, is_draft=False).values_list(
            "id", flat=True
        )
    )
    if deactivate_ids:
        Poll.objects.filter(id__in=deactivate_ids).update(active=False)
        logger.info("Deactivated poll IDs: %s", deactivate_ids)

    return {"activated": len(activate_ids), "deactivated": len(deactivate_ids)}
