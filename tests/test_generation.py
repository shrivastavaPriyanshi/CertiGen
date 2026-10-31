from datetime import date

from app.certificate_service import generate_certificate


def test_certificate_generation(tmp_path):

    file_path = generate_certificate(
        name="Priyanshi Shrivastava",
        event_name="Python Bootcamp 2026",
        completion_date=date(2026, 10, 31),
        certificate_id="TEST-CERT-001",
        output_dir=str(tmp_path)
    )

    # Check whether PDF exists
    assert file_path.endswith(".pdf")

    # Check whether file was created
    with open(file_path, "rb") as pdf_file:
        content = pdf_file.read()

    # PDF files start with %PDF-
    assert content.startswith(b"%PDF-")