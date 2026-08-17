import json, os, sys, tempfile, textwrap
sys.path.insert(0, os.path.dirname(__file__))
from build_index import extract_entries, write_index

SAMPLE_HTML = textwrap.dedent("""
    <!DOCTYPE html>
    <html><head><title>Spring 5 Features</title></head>
    <body>
      <h1>Spring 5</h1>
      <h2 id="ioc">IoC Container</h2>
      <p>The IoC container manages beans.</p>
      <h3 id="functional">Functional Registration</h3>
      <p>Register beans programmatically.</p>
    </body></html>
""")

def test_extract_entries():
    with tempfile.NamedTemporaryFile(suffix='.html', mode='w', delete=False) as f:
        f.write(SAMPLE_HTML)
        path = f.name
    try:
        entries = extract_entries(path, href='/spring-core/spring5-features.html')
        assert len(entries) >= 2, f"Expected at least 2 entries, got {len(entries)}"
        pages = [e['page'] for e in entries]
        assert 'Spring 5 Features' in pages
        texts = [e['text'] for e in entries]
        assert any('IoC Container' in t or 'ioc container' in t.lower() for t in texts)
        anchors = [e['anchor'] for e in entries]
        assert 'ioc' in anchors
    finally:
        os.unlink(path)

def test_write_index():
    with tempfile.TemporaryDirectory() as d:
        out = os.path.join(d, 'search-index.json')
        entries = [{'page': 'Test', 'href': '/test.html', 'section': 'Sec', 'anchor': 'sec', 'text': 'Hello'}]
        write_index(entries, out)
        with open(out) as f:
            data = json.load(f)
        assert data == entries

if __name__ == '__main__':
    test_extract_entries()
    test_write_index()
    print('All tests passed.')
