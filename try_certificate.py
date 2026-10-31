from datetime import date
import uuid

from app.certificate_service import generate_certificate


certificate_id = str(uuid.uuid4())

file_path = generate_certificate(
    name="Priyanshi Shrivastava",
    event_name="Python Bootcamp 2026",
    completion_date=date(2026, 10, 31),
    certificate_id=certificate_id
)

print("Certificate generated successfully!")
print("Certificate ID:", certificate_id)
print("File location:", file_path)