import re
import glob

wa = 'https://wa.me/5516981442301?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Roldan%20Eng%20Software%20e%20gostaria%20de%20falar%20sobre%20um%20projeto.'

files = glob.glob('**/*.html', recursive=True)
total = 0
for f in files:
    try:
        with open(f, encoding='utf-8') as fh:
            content = fh.read()
        orig = content
        # Replace links with "Solicitar orçamento" pointing to contato
        pattern = r'(<a\b[^>]*href=["\'])([^"\']*contato/?)(["\'][^>]*>\s*Solicitar orçamento\s*</a>)'
        def repl(m):
            return m.group(1) + wa + m.group(3)
        content2, n = re.subn(pattern, repl, content, flags=re.IGNORECASE)
        if n > 0 and content2 != orig:
            with open(f, 'w', encoding='utf-8') as fh:
                fh.write(content2)
            print(f'{f}: {n} updated')
            total += n
    except Exception as e:
        print(f'ERR {f}: {e}')
print(f'Total: {total}')
