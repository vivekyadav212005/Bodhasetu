from datetime import datetime
from typing import Literal, Optional

class EmailLogDoc(dict):
    """Mongo document shape for email_logs collection."""
    _id: str
    sender: str
    receiver: Optional[str]
    subject: Optional[str]
    date: datetime
    filename: str
    status: Literal['pending','approved','rejected']
    department: str
    content_type: Optional[str]
    file_bytes: bytes
    created_at: datetime
