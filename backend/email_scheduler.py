from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import timedelta

from backend.email_fetcher import fetch_emails_and_store


def start_scheduler():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(fetch_emails_and_store, IntervalTrigger(hours=2), id="email_fetch_job", replace_existing=True)
    scheduler.start()
    return scheduler
