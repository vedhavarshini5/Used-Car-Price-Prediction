"""
PDF Report generation service for AutoPrice AI using ReportLab.
Generates an official automotive valuation certificate with full Unicode Rupee symbol support.
"""
import io
import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register Unicode TrueType fonts for genuine Rupee (₹) symbol rendering
FONT_REGULAR = 'Helvetica'
FONT_BOLD = 'Helvetica-Bold'
FONT_ITALIC = 'Helvetica-Oblique'
UNICODE_SUPPORTED = False

# Font search paths
font_candidates = [
    ('AppFont', 'C:/Windows/Fonts/segoeui.ttf', 'AppFont-Bold', 'C:/Windows/Fonts/segoeuib.ttf', 'AppFont-Italic', 'C:/Windows/Fonts/segoeuii.ttf'),
    ('AppFont', 'C:/Windows/Fonts/arial.ttf', 'AppFont-Bold', 'C:/Windows/Fonts/arialbd.ttf', 'AppFont-Italic', 'C:/Windows/Fonts/ariali.ttf'),
    ('AppFont', 'C:/Windows/Fonts/calibri.ttf', 'AppFont-Bold', 'C:/Windows/Fonts/calibrib.ttf', 'AppFont-Italic', 'C:/Windows/Fonts/calibrii.ttf'),
    ('AppFont', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 'AppFont-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 'AppFont-Italic', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf'),
]

for reg_name, reg_path, bold_name, bold_path, ital_name, ital_path in font_candidates:
    if os.path.exists(reg_path) and os.path.exists(bold_path):
        try:
            pdfmetrics.registerFont(TTFont(reg_name, reg_path))
            pdfmetrics.registerFont(TTFont(bold_name, bold_path))
            if os.path.exists(ital_path):
                pdfmetrics.registerFont(TTFont(ital_name, ital_path))
                FONT_ITALIC = ital_name
            else:
                FONT_ITALIC = reg_name
            FONT_REGULAR = reg_name
            FONT_BOLD = bold_name
            UNICODE_SUPPORTED = True
            break
        except Exception as e:
            continue

def clean_currency_text(text: str) -> str:
    """
    Ensures currency is displayed properly.
    If Unicode is supported by registered TTF font, preserves '₹'.
    Otherwise, fallbacks to 'Rs. ' to prevent missing glyph box (■).
    """
    if not text:
        return text
    if not UNICODE_SUPPORTED:
        return text.replace('₹', 'Rs. ')
    return text

def generate_pdf_report(prediction_data: dict, car_input: dict) -> bytes:
    """
    Creates a branded PDF valuation report and returns it as raw bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles using the registered Unicode-capable font
    header_style = ParagraphStyle(
        'MainHeader',
        parent=styles['Normal'],
        fontName=FONT_BOLD,
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0F172A'),
        alignment=TA_CENTER
    )
    
    sub_header = ParagraphStyle(
        'SubHeader',
        parent=styles['Normal'],
        fontName=FONT_REGULAR,
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0284C7'),
        alignment=TA_CENTER
    )
    
    price_title = ParagraphStyle(
        'PriceTitle',
        parent=styles['Normal'],
        fontName=FONT_BOLD,
        fontSize=12,
        leading=15,
        textColor=colors.HexColor('#64748B'),
        alignment=TA_CENTER
    )

    price_style = ParagraphStyle(
        'PriceVal',
        parent=styles['Normal'],
        fontName=FONT_BOLD,
        fontSize=28,
        leading=34,
        textColor=colors.HexColor('#0284C7'),
        alignment=TA_CENTER
    )

    range_style = ParagraphStyle(
        'RangeVal',
        parent=styles['Normal'],
        fontName=FONT_REGULAR,
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#334155'),
        alignment=TA_CENTER
    )

    section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Normal'],
        fontName=FONT_BOLD,
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#0F172A')
    )

    cell_bold = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontName=FONT_BOLD,
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#1E293B')
    )

    cell_normal = ParagraphStyle(
        'CellNormal',
        parent=styles['Normal'],
        fontName=FONT_REGULAR,
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#475569')
    )

    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName=FONT_ITALIC,
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#94A3B8'),
        alignment=TA_CENTER
    )

    story = []

    # Brand Title Header
    story.append(Paragraph("AutoPrice AI", header_style))
    story.append(Paragraph("Automotive Valuation Certificate & Market Intelligence Report", sub_header))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#0284C7'), spaceBefore=2, spaceAfter=12))

    # Valuation Hero Box
    story.append(Paragraph("ESTIMATED MARKET VALUE", price_title))
    story.append(Spacer(1, 3))
    
    formatted_price = clean_currency_text(prediction_data.get('formatted_price', '₹ 0'))
    formatted_range = clean_currency_text(prediction_data.get('formatted_range', '-'))
    price_lakhs = prediction_data.get('price_in_lakhs', '')
    if price_lakhs:
        price_lakhs = clean_currency_text(price_lakhs)

    story.append(Paragraph(formatted_price, price_style))
    story.append(Spacer(1, 4))
    
    range_text = f"Confidence Range: <b>{formatted_range}</b>"
    if price_lakhs:
        range_text += f" &nbsp;|&nbsp; <b>{price_lakhs}</b>"
    story.append(Paragraph(range_text, range_style))
    story.append(Spacer(1, 5))
    
    standing_text = f"Market Standing: <b>{prediction_data.get('market_standing', 'Standard')}</b> &nbsp;|&nbsp; Model Reliability: <b>{prediction_data.get('reliability_score', 90)}%</b>"
    story.append(Paragraph(standing_text, ParagraphStyle('Standing', parent=styles['Normal'], fontName=FONT_REGULAR, fontSize=9, alignment=TA_CENTER, textColor=colors.HexColor('#059669'))))
    story.append(Spacer(1, 14))

    # Vehicle Specifications Table
    story.append(Paragraph("Vehicle Specifications", section_title))
    story.append(Spacer(1, 6))

    brand = car_input.get('brand', 'Car')
    model = car_input.get('model', 'Model')
    year = car_input.get('year', '-')
    km = car_input.get('km_driven', 0)
    fuel = car_input.get('fuel_type', '-')
    transmission = car_input.get('transmission', '-')
    engine = car_input.get('engine', '-')
    mileage = car_input.get('mileage', '-')
    owners = car_input.get('owners', 'First Owner')
    location = car_input.get('location') or 'All India'

    specs_data = [
        [Paragraph("Brand & Model", cell_bold), Paragraph(f"{brand} {model}", cell_normal), Paragraph("Manufacturing Year", cell_bold), Paragraph(str(year), cell_normal)],
        [Paragraph("Kilometers Driven", cell_bold), Paragraph(f"{km:,.0f} km" if isinstance(km, (int, float)) else str(km), cell_normal), Paragraph("Fuel Type", cell_bold), Paragraph(str(fuel), cell_normal)],
        [Paragraph("Transmission", cell_bold), Paragraph(str(transmission), cell_normal), Paragraph("Engine Capacity", cell_bold), Paragraph(f"{engine} CC", cell_normal)],
        [Paragraph("Mileage Rating", cell_bold), Paragraph(f"{mileage} kmpl", cell_normal), Paragraph("Ownership History", cell_bold), Paragraph(str(owners), cell_normal)],
        [Paragraph("Location / City", cell_bold), Paragraph(str(location), cell_normal), Paragraph("Evaluation Date", cell_bold), Paragraph(datetime.now().strftime("%d %b %Y, %I:%M %p"), cell_normal)],
    ]

    t_specs = Table(specs_data, colWidths=[120, 145, 125, 140])
    t_specs.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t_specs)
    story.append(Spacer(1, 14))

    # Key Influencing Factors
    story.append(Paragraph("Key Valuation Drivers", section_title))
    story.append(Spacer(1, 6))

    factors = prediction_data.get('important_features', [])
    factor_rows = [[Paragraph("Factor", cell_bold), Paragraph("Impact Level", cell_bold), Paragraph("Market Assessment", cell_bold)]]
    
    for f in factors[:5]:
        factor_rows.append([
            Paragraph(f.get('name', ''), cell_bold),
            Paragraph(f.get('impact', ''), cell_normal),
            Paragraph(f.get('description', ''), cell_normal)
        ])

    t_factors = Table(factor_rows, colWidths=[125, 110, 295])
    t_factors.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E0F2FE')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#BAE6FD')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t_factors)
    story.append(Spacer(1, 14))

    # Machine Learning Intelligence Box
    story.append(Paragraph("Machine Learning Intelligence", section_title))
    story.append(Spacer(1, 5))
    model_info = prediction_data.get('model_information', {})
    ml_text = (
        f"Valuation estimated using a <b>{model_info.get('algorithm', 'Random Forest Regressor')}</b> "
        f"({model_info.get('trees', 120)} ensemble trees, R² accuracy: <b>{model_info.get('model_r2', 0.9265)}</b>, "
        f"trained on <b>{model_info.get('dataset_size', 6891):,}</b> verified market transactions). "
        f"Confidence intervals account for intra-tree variance and local market fluctuations."
    )
    story.append(Paragraph(ml_text, cell_normal))
    story.append(Spacer(1, 15))

    # Disclaimer Footer
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceBefore=4, spaceAfter=8))
    story.append(Paragraph(
        "Disclaimer: Predictions are estimates generated by a machine learning model based on historical vehicle datasets and should not be considered a guaranteed financial quote or binding market price. Physical inspection and local market demand may influence final transaction values.",
        disclaimer_style
    ))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
