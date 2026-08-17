#!/usr/bin/env python3
"""
Build search-index.json from all HTML pages.
Run from repo root: python scripts/build_index.py
"""
import json
import os
import re
from html.parser import HTMLParser
from pathlib import Path


class PageParser(HTMLParser):
    def __init__(self, href):
        super().__init__()
        self.href = href
        self.entries = []
        self._title = ''
        self._current_section = ''
        self._current_anchor = ''
        self._in_title = False
        self._in_heading = False
        self._heading_tag = ''
        self._buf = []
        self._skip_tags = {'script', 'style', 'nav', 'header'}
        self._skip_depth = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in self._skip_tags:
            self._skip_depth += 1
            return
        if self._skip_depth:
            return
        if tag == 'title':
            self._in_title = True
        if tag in ('h1', 'h2', 'h3'):
            self._flush_buffer()
            self._in_heading = True
            self._heading_tag = tag
            self._current_anchor = attrs.get('id', '')

    def handle_endtag(self, tag):
        if tag in self._skip_tags:
            self._skip_depth = max(0, self._skip_depth - 1)
            return
        if tag == 'title':
            self._in_title = False
        if tag in ('h1', 'h2', 'h3') and self._in_heading:
            heading_text = ''.join(self._buf).strip()
            self._buf = []
            self._in_heading = False
            if self._heading_tag == 'h1' and not self._title:
                self._title = heading_text
            self._current_section = heading_text
            self.entries.append({
                'page': self._title or self.href,
                'href': self.href,
                'section': heading_text,
                'anchor': self._current_anchor,
                'text': heading_text,
            })

    def handle_data(self, data):
        if self._skip_depth:
            return
        if self._in_title:
            self._title = data.strip()
            return
        text = data.strip()
        if text:
            self._buf.append(text)

    def _flush_buffer(self):
        text = ' '.join(self._buf).strip()
        self._buf = []
        if len(text) > 20:
            self.entries.append({
                'page': self._title or self.href,
                'href': self.href,
                'section': self._current_section,
                'anchor': self._current_anchor,
                'text': text[:300],
            })


def extract_entries(filepath, href):
    with open(filepath, encoding='utf-8') as f:
        html = f.read()
    parser = PageParser(href)
    parser.feed(html)
    parser._flush_buffer()
    return parser.entries


def write_index(entries, output_path):
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)


def build(root='.', output='assets/search-index.json'):
    root = Path(root)
    all_entries = []
    skip_dirs = {'assets', 'scripts', 'docs', '.git'}

    for html_file in sorted(root.rglob('*.html')):
        parts = html_file.parts
        if any(p in skip_dirs for p in parts):
            continue
        rel = '/' + html_file.relative_to(root).as_posix()
        entries = extract_entries(str(html_file), href=rel)
        all_entries.extend(entries)

    write_index(all_entries, str(root / output))
    print(f'Wrote {len(all_entries)} entries to {output}')


if __name__ == '__main__':
    build()
