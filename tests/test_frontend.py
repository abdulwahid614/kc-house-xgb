import re
from pathlib import Path
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

STATIC_DIR = Path(__file__).resolve().parent.parent / "app" / "static"


def test_index_page_served():
    """Verify that GET / serves the HTML frontend with 200 OK."""
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert "King County House Price Predictor" in response.text


def test_static_files_accessible():
    """Verify that CSS and JavaScript files are served and accessible."""
    css_res = client.get("/static/style.css")
    assert css_res.status_code == 200
    assert "text/css" in css_res.headers["content-type"]
    assert len(css_res.text) > 500

    js_res = client.get("/static/app.js")
    assert js_res.status_code == 200
    ct = js_res.headers.get("content-type", "")
    assert ("javascript" in ct or "text/plain" in ct)
    assert len(js_res.text) > 500


def test_form_elements_in_html():
    """Verify form and all required input fields are present in HTML."""
    html = (STATIC_DIR / "index.html").read_text(encoding="utf-8")
    
    expected_fields = [
        'id="bedrooms"', 'id="bathrooms"', 'id="sqft_living"', 'id="sqft_lot"',
        'id="floors"', 'id="waterfront"', 'id="view"', 'id="condition"',
        'id="grade"', 'id="sqft_above"', 'id="sqft_basement"', 'id="yr_built"',
        'id="yr_renovated"', 'id="zipcode"', 'id="lat"', 'id="long"',
        'id="sqft_living15"', 'id="sqft_lot15"'
    ]
    for field in expected_fields:
        assert field in html, f"Missing input element {field} in HTML"
        
    assert 'id="submitBtn"' in html
    assert 'id="btnSpinner"' in html
    assert 'id="errorBanner"' in html
    assert 'id="resultDetails"' in html


def test_phase5_theme_toggle_placement_and_icons():
    """
    Verify PHASE 5 Requirements:
    1. Theme toggle button exists at the END of the main interface (in footer).
    2. Uses sun icon for Light Mode and moon icon for Dark Mode.
    """
    html = (STATIC_DIR / "index.html").read_text(encoding="utf-8")
    
    # Check that theme toggle button exists
    assert 'id="themeToggleBtn"' in html
    
    # Check placement: must be inside the <footer> tag (the END of the main interface)
    footer_match = re.search(r'<footer[^>]*>.*?id="themeToggleBtn".*?</footer>', html, re.DOTALL)
    assert footer_match is not None, "Theme toggle button must be located inside the footer at the END of the interface"
    
    # Check icons: Sun icon and Moon icon
    assert 'sun-icon' in html
    assert 'moon-icon' in html
    assert '☀️' in html
    assert '🌙' in html


def test_phase5_css_theme_definitions():
    """Verify CSS defines both light and dark themes with transitions and proper variables."""
    css = (STATIC_DIR / "style.css").read_text(encoding="utf-8")
    
    assert '[data-theme="dark"]' in css
    assert '[data-theme="light"]' in css
    assert '--bg-app' in css
    assert '--bg-card' in css
    assert '--text-primary' in css
    assert 'transition:' in css


def test_phase5_js_theme_logic_and_persistence():
    """
    Verify JS logic includes:
    1. Single click toggle listener.
    2. LocalStorage persistence key.
    3. OS preference fallback via prefers-color-scheme.
    4. Fetch connection to /predict.
    5. Prevention of duplicate submissions.
    """
    js = (STATIC_DIR / "app.js").read_text(encoding="utf-8")
    
    assert 'localStorage' in js
    assert 'kc_house_theme' in js
    assert 'prefers-color-scheme' in js
    assert 'data-theme' in js
    assert '/predict' in js
    assert 'submitBtn.disabled' in js


def test_responsive_meta_viewport():
    """Verify viewport meta tag exists for mobile and desktop responsiveness."""
    html = (STATIC_DIR / "index.html").read_text(encoding="utf-8")
    assert '<meta name="viewport" content="width=device-width, initial-scale=1.0">' in html
