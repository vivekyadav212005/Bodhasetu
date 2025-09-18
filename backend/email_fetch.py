import imaplib
import os
import email
from email.utils import parsedate_to_datetime
from dotenv import load_dotenv
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS   # ✅ NEW

# --- Load environment variables ---
load_dotenv()
IMAP_SERVER = os.getenv("IMAP_SERVER")
EMAIL = os.getenv("EMAIL")
PASSWORD = os.getenv("PASSWORD")

# --- Config ---
DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)  # ✅ Allow all origins (React frontend can access)

def fetch_emails():
    mail = imaplib.IMAP4_SSL(IMAP_SERVER)
    mail.login(EMAIL, PASSWORD)
    mail.select("inbox")
    status, messages = mail.search(None, 'UNSEEN')
    email_ids = messages[0].split()

    results = []

    for e_id in email_ids:
        status, msg_data = mail.fetch(e_id, '(RFC822)')
        raw_email = msg_data[0][1]
        msg = email.message_from_bytes(raw_email)

        # Extract metadata
        subject = msg.get("subject", "(No Subject)")
        from_ = msg.get("from", "(Unknown Sender)")
        date_ = msg.get("date", None)

        try:
            parsed_date = parsedate_to_datetime(date_)
            date_str = parsed_date.strftime("%Y-%m-%d %H:%M:%S")
        except Exception:
            date_str = "(Unknown Date)"

        attachments = []

        # --- Save Attachments ---
        for part in msg.walk():
            if part.get_content_maintype() == "multipart":
                continue

            if part.get("Content-Disposition"):
                filename = part.get_filename()
                if filename and filename.lower().endswith(
                    (".pdf", ".docx", ".csv", ".txt", ".xls", ".xlsx")
                ):
                    file_path = os.path.join(DOWNLOAD_FOLDER, filename)
                    with open(file_path, "wb") as f:
                        f.write(part.get_payload(decode=True))

                    attachments.append({
                        "filename": filename,
                        "url": f"http://127.0.0.1:5000/download/{filename}"  # ✅ Full URL
                    })

        if attachments:
            results.append({
                "from": from_,
                "subject": subject,
                "date": date_str,
                "attachments": attachments
            })

    mail.logout()
    return results

# --- API Route to fetch emails ---
@app.route("/emails", methods=["GET"])
def get_emails():
    emails = fetch_emails()
    return jsonify(emails)

# --- Serve downloaded attachments ---
@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    return send_from_directory(DOWNLOAD_FOLDER, filename, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
