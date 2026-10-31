import uuid
from pathlib import Path
from datetime import date

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.colors import HexColor
from reportlab.lib.units import inch

def generate_certificate(
    name: str,
    event_name: str,
    completion_date: date,
    certificate_id: str,
    output_dir: str = None
):
    """
    Generate an individual PDF certificate.
    """

    # Set output directory
    if output_dir is None:
        output_dir = (
            Path(__file__).resolve().parent.parent
            / "generated_certificates"
        )

    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Create PDF filename
    file_path = output_dir / f"{certificate_id}.pdf"

    # Set A4 landscape page
    page_width, page_height = landscape(A4)

    # Create PDF canvas
    pdf = canvas.Canvas(str(file_path), pagesize=landscape(A4))

    pdf.setTitle(f"Certificate - {name}")

    # Define colors
    gold = HexColor("#B08D45")
    dark_blue = HexColor("#1B2A41")
    cream = HexColor("#FFFDF7")

    # Background
    pdf.setFillColor(cream)
    pdf.rect(0, 0, page_width, page_height, fill=1, stroke=0)

    # Outer decorative border
    pdf.setStrokeColor(gold)
    pdf.setLineWidth(4)
    pdf.rect(
        25, 25,
        page_width - 50,
        page_height - 50
    )

    # Inner border
    pdf.setLineWidth(1.5)
    pdf.rect(
        34, 34,
        page_width - 68,
        page_height - 68
    )

    # Decorative corner circles
    pdf.setFillColor(gold)

    corners = [
        (48, 48),
        (page_width - 48, 48),
        (48, page_height - 48),
        (page_width - 48, page_height - 48)
    ]

    for x, y in corners:
        pdf.circle(x, y, 5, fill=1, stroke=0)

    # Main heading
    pdf.setFillColor(dark_blue)
    pdf.setFont("Times-Bold", 32)

    pdf.drawCentredString(
        page_width / 2,
        page_height - 110,
        "CERTIFICATE OF ACHIEVEMENT"
    )

    # Decorative line
    pdf.setStrokeColor(gold)
    pdf.setLineWidth(2)

    pdf.line(
        page_width / 2 - 150,
        page_height - 125,
        page_width / 2 + 150,
        page_height - 125
    )

    # Subheading
    pdf.setFillColor(dark_blue)
    pdf.setFont("Times-Roman", 17)

    pdf.drawCentredString(
        page_width / 2,
        page_height - 165,
        "This certificate is proudly presented to"
    )

    # Recipient name
    pdf.setFillColor(gold)
    pdf.setFont("Times-Bold", 29)

    pdf.drawCentredString(
        page_width / 2,
        page_height - 220,
        name
    )

    # Event description
    pdf.setFillColor(dark_blue)
    pdf.setFont("Times-Roman", 16)

    pdf.drawCentredString(
        page_width / 2,
        page_height - 265,
        "For successfully completing"
    )

    pdf.setFont("Times-Bold", 20)

    pdf.drawCentredString(
        page_width / 2,
        page_height - 300,
        event_name
    )

    # Completion date
    pdf.setFont("Times-Roman", 13)

    pdf.drawCentredString(
        page_width / 2,
        page_height - 345,
        f"Date of Completion: {completion_date.strftime('%d %B %Y')}"
    )

    # Certificate ID
    pdf.setFont("Helvetica", 9)

    pdf.drawCentredString(
        page_width / 2,
        65,
        f"Certificate ID: {certificate_id}"
    )

    # Signature section
    pdf.setStrokeColor(dark_blue)
    pdf.setLineWidth(1)

    pdf.line(90, 105, 230, 105)

    pdf.setFillColor(dark_blue)
    pdf.setFont("Times-Roman", 11)

    pdf.drawCentredString(
        160, 88, "Authorized Signature"
    )

    # Gold seal
    seal_x = page_width - 115
    seal_y = 110

    pdf.setStrokeColor(gold)
    pdf.setLineWidth(2)
    pdf.circle(seal_x, seal_y, 32, fill=0, stroke=1)
    pdf.circle(seal_x, seal_y, 25, fill=0, stroke=1)

    pdf.setFillColor(gold)
    pdf.setFont("Times-Bold", 9)

    pdf.drawCentredString(
        seal_x, seal_y - 3, "CERTIFIED"
    )

    # Save PDF
    pdf.save()

    return str(file_path)