import os
import imaplib
import email
from email.header import decode_header
from typing import List, Dict, Optional
from datetime import datetime
from bson import Binary
from dotenv import load_dotenv
import asyncio

from backend import db

load_dotenv()

ORG_DOMAIN = os.getenv("ORG_DOMAIN") or "kmrl.org"
EMAIL_ALLOWED_DOMAINS = [d.strip().lower() for d in os.getenv("EMAIL_ALLOWED_DOMAINS", "").split(",") if d.strip()]
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "993"))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
EMAIL_FOLDER = os.getenv("EMAIL_FOLDER", "INBOX")


def _decode(s: Optional[str]) -> str:
    if not s:
        return ""
    parts = decode_header(s)
    out = []
    for p, enc in parts:
        if isinstance(p, bytes):
            try:
                out.append(p.decode(enc or 'utf-8', errors='ignore'))
            except Exception:
                out.append(p.decode('utf-8', errors='ignore'))
        else:
            out.append(p)
    return "".join(out)


def _is_org_address(addr: str) -> bool:
    if not addr:
        return False
    _, email_addr = email.utils.parseaddr(addr)
    if not email_addr or "@" not in email_addr:
        return False
    domain = email_addr.split("@", 1)[1].lower()
    domains = EMAIL_ALLOWED_DOMAINS or [ORG_DOMAIN.lower()] if ORG_DOMAIN else EMAIL_ALLOWED_DOMAINS
    if not domains:
        # No domain configured -> accept all
        return True
    for d in domains:
        d = d.lstrip("@").lower()
        if domain == d or domain.endswith("." + d):
            return True
    return False


def _allowed_mime(m: str) -> bool:
    return m in (
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
    )


def _collect_attachments_sync() -> List[Dict]:
    out: List[Dict] = []
    if not (EMAIL_HOST and EMAIL_USER and EMAIL_PASS):
        return out
    M = imaplib.IMAP4_SSL(EMAIL_HOST, EMAIL_PORT)
    try:
        M.login(EMAIL_USER, EMAIL_PASS)
        M.select(EMAIL_FOLDER)
        # unseen emails
        typ, data = M.search(None, 'UNSEEN')
        if typ != 'OK':
            return out
        ids = data[0].split() if data and data[0] else []
        for num in ids:
            typ, msg_data = M.fetch(num, '(RFC822)')
            if typ != 'OK':
                continue
            raw = msg_data[0][1]
            msg = email.message_from_bytes(raw)
            sender = _decode(msg.get('From', ''))
            receiver = _decode(msg.get('To', ''))
            subject = _decode(msg.get('Subject', ''))
            date_hdr = msg.get('Date')
            try:
                date_obj = email.utils.parsedate_to_datetime(date_hdr) if date_hdr else datetime.utcnow()
            except Exception:
                date_obj = datetime.utcnow()
            # filter by org domain
            sender_addr = email.utils.parseaddr(sender)[1]
            if not _is_org_address(sender_addr):
                continue
            # iterate attachments
            for part in msg.walk():
                disp = part.get_content_disposition()
                fname = _decode(part.get_filename() or "")
                ctype = part.get_content_type() or ""
                is_attachment = disp in ("attachment", "inline") and fname
                by_mime = _allowed_mime(ctype)
                by_ext = fname.lower().endswith((".pdf", ".xlsx", ".xls"))
                if not (is_attachment and (by_mime or by_ext)):
                    continue
                try:
                    payload = part.get_payload(decode=True)
                    if not payload:
                        continue
                    out.append({
                        'filename': fname or 'attachment',
                        'sender': sender_addr,
                        'receiver': email.utils.parseaddr(receiver)[1],
                        'subject': subject,
                        'date': date_obj,
                        'content_type': ctype,
                        'file_bytes': payload,
                    })
                except Exception:
                    continue
        return out
    finally:
        try:
            M.close()
            M.logout()
        except Exception:
            pass


def _infer_department(addr: str) -> str:
    if not addr:
        return 'General'
    local = addr.split('@')[0].lower()
    if 'procure' in local:
        return 'Procurement'
    if 'engineer' in local:
        return 'Engineering'
    if 'finance' in local:
        return 'Finance'
    return 'General'


async def fetch_emails_and_store() -> int:
    attachments = await asyncio.to_thread(_collect_attachments_sync)
    if not attachments:
        return 0
    count = 0
    for a in attachments:
        try:
            record = {
                'sender': a['sender'],
                'receiver': a.get('receiver'),
                'subject': a.get('subject'),
                'date': a.get('date') or datetime.utcnow(),
                'filename': a['filename'],
                'status': 'pending',
                'department': _infer_department(a['sender']),
                'content_type': a.get('content_type'),
                'file_bytes': Binary(a['file_bytes']),
                'created_at': datetime.utcnow(),
            }
            await db.db['email_logs'].insert_one(record)
            count += 1
        except Exception:
            continue
    return count
